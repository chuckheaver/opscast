'use client';

// Top-level fog-map experience. Owns:
//   - the loaded neighborhood GeoJSON (one fetch on mount)
//   - the search-bar state (address text + selected suggestion)
//   - the currently "picked" neighborhood (driven by either a search result
//     or a click on the map)
// Renders FogMap (the actual map canvas) and FogSidebar (search + result card).

import { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import FogMap from "./FogMap";
import FogTopBar from "./FogTopBar";
import FogPanel from "./FogPanel";
import { findNeighborhoodForPoint, findContourForPoint } from "./lib/spatial";
import { reverseGeocode, elevationAtPoint } from "./lib/geocode";

const DATA_URL = "/data/sf-fog-neighborhoods.geojson";
const CONTOURS_URL = "/data/sf-fog-contours.geojson";

export default function FogApp() {
  const searchParams = useSearchParams();
  // Preset chosen by the icon clicked on the Ur4cast home page. Each
  // preset names exactly which layer(s) start on. Neighborhoods is
  // always on regardless. No preset → keep the historical defaults
  // (neighborhoods + fog data) so a direct nav to /fog still shows
  // the headline layer.
  const preset = searchParams?.get("preset") || "";
  const [geojson, setGeojson] = useState(null);
  const [contours, setContours] = useState(null);
  const [zips, setZips] = useState(null);
  const [supervisorDistricts, setSupervisorDistricts] = useState(null);
  const [realtorNeighborhoods, setRealtorNeighborhoods] = useState(null);
  const [seismicHazards, setSeismicHazards] = useState(null);
  const [tsunamiHazard, setTsunamiHazard] = useState(null);
  const [dataErr, setDataErr] = useState("");
  const [picked, setPicked] = useState(null); // { feature, point, address, contour, elevation_ft, zip, supervisor, realtor, microZone }
  // Summer fog overlay — on for the "Fog Map" preset; off otherwise.
  const [showContours, setShowContours] = useState(preset === "fog");
  // Transit (Muni stops) — on for the "Transit" preset.
  const [showMuni, setShowMuni] = useState(preset === "transit");
  // Bike network — on for the "Bike Paths" preset.
  const [showBikes, setShowBikes] = useState(preset === "bikes");
  // SF neighborhood outlines + name labels — always on by default and
  // every preset keeps them on as the anchor layer.
  const [showNeighborhoods, setShowNeighborhoods] = useState(true);
  // Supervisor district boundaries — on for the "Districts" preset.
  const [showDistricts, setShowDistricts] = useState(preset === "districts");
  // ZIP code boundaries — independent toggle.
  const [showZips, setShowZips] = useState(false);
  // Topographic hillshade overlay.
  const [showTerrain, setShowTerrain] = useState(false);
  // Elevation contour lines + ft labels + peak labels — the layer set
  // pulled in from /microclimates.
  const [showElevation, setShowElevation] = useState(false);
  // CA Geological Survey seismic hazard zones.
  const [showSeismic, setShowSeismic] = useState(false);
  // CGS Tsunami Hazard Area for Emergency Planning, 2021 update.
  const [showTsunami, setShowTsunami] = useState(false);
  // SFAR Realtor neighborhoods (blue outlines + nbrhood (nid) labels).
  const [showRealtor, setShowRealtor] = useState(false);
  // Background layers kept off — used for lookups, not for the UI toggle set.
  const [showZoning] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoErr, setGeoErr] = useState("");
  const autoGeoTriedRef = useRef(false);
  const urlLocAppliedRef = useRef(false);

  // If the page was opened with ?lat=&lng=&name= (e.g. the Fog Forecast
  // button on Ur4cast), parse those once.
  const urlLoc = (() => {
    const lat = Number(searchParams?.get("lat"));
    const lng = Number(searchParams?.get("lng"));
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    return { point: [lng, lat], name: searchParams.get("name") || "" };
  })();
  // Holds the latest contours/geojson for use inside async callbacks that
  // were captured before the data finished loading.
  const dataRef = useRef({ geojson: null, contours: null });
  useEffect(() => {
    dataRef.current = { geojson, contours };
  }, [geojson, contours]);

  useEffect(() => {
    let cancelled = false;
    fetch(DATA_URL)
      .then(r => {
        if (!r.ok) throw new Error(`Failed to load fog data (${r.status})`);
        return r.json();
      })
      .then(d => {
        if (!cancelled) setGeojson(d);
      })
      .catch(e => {
        if (!cancelled) setDataErr(e.message);
      });

    // Contour overlay is optional — silently skip if the file isn't there.
    fetch(CONTOURS_URL)
      .then(r => (r.ok ? r.json() : null))
      .then(d => {
        if (!cancelled && d) setContours(d);
      })
      .catch(() => {});

    // Extra layers used only for the key/legend lookups (not toggleable
    // in the simplified toggle set). Loaded once on mount, in parallel.
    const loadLookup = (url, setter) =>
      fetch(url)
        .then(r => (r.ok ? r.json() : null))
        .then(d => { if (!cancelled && d) setter(d); })
        .catch(() => {});
    loadLookup("/data/sf-zip-codes.geojson", setZips);
    loadLookup("/data/sf-supervisor-districts.geojson", setSupervisorDistricts);
    loadLookup("/data/sf-realtor-neighborhoods.geojson", setRealtorNeighborhoods);
    loadLookup("/data/sf-seismic-hazards.geojson", setSeismicHazards);
    loadLookup("/data/sf-tsunami-hazard.geojson", setTsunamiHazard);

    return () => {
      cancelled = true;
    };
  }, []);

  // A search result resolved to a lng/lat — find both the containing
  // neighborhood (for context) and the containing fog contour (for the
  // primary value). If the address is outside SF, feature/contour are null
  // but we still set point + address so the map can fly there.
  const pickFromAddress = useCallback(
    (point, address) => {
      if (!geojson) return;
      const feature = findNeighborhoodForPoint(geojson, point);
      const contour = findContourForPoint(contours, point);
      setPicked({ point, address, feature, contour });
    },
    [geojson, contours]
  );

  // User clicked a neighborhood directly on the map.
  const pickFromMap = useCallback(
    (feature, point) => {
      const contour = findContourForPoint(contours, point);
      setPicked({ point, address: null, feature, contour });
    },
    [contours]
  );

  // Browser geolocation → reverse-geocoded address → pick. The dataRef
  // dance lets us run the spatial lookups against the latest data even
  // if the user triggers geo before contours / neighborhoods finish loading.
  const requestGeoLocation = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setGeoErr("Geolocation isn't available in this browser.");
      return;
    }
    setGeoLoading(true);
    setGeoErr("");
    navigator.geolocation.getCurrentPosition(
      async pos => {
        const point = [pos.coords.longitude, pos.coords.latitude];
        const address = await reverseGeocode(point);
        const { geojson: g, contours: c } = dataRef.current;
        const feature = g ? findNeighborhoodForPoint(g, point) : null;
        const contour = findContourForPoint(c, point);
        setPicked({ point, address, feature, contour });
        setGeoLoading(false);
      },
      err => {
        setGeoErr(
          err.code === err.PERMISSION_DENIED
            ? "Location access denied. Search an address instead."
            : "Couldn't get your location. Search an address instead."
        );
        setGeoLoading(false);
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 }
    );
  }, []);

  // If a URL location was provided (e.g. linked from Ur4cast with
  // ?lat=&lng=&name=), apply it as the initial pick as soon as the data
  // loads. This pre-empts the auto-geolocation prompt — the user can
  // still override with the search bar or 📍 button.
  useEffect(() => {
    if (urlLocAppliedRef.current) return;
    if (!urlLoc) return;
    if (!geojson) return; // wait for data so spatial lookups have something to hit
    urlLocAppliedRef.current = true;
    autoGeoTriedRef.current = true; // suppress the auto-geo prompt below
    const feature = findNeighborhoodForPoint(geojson, urlLoc.point);
    const contour = findContourForPoint(contours, urlLoc.point);
    setPicked({
      point: urlLoc.point,
      address: urlLoc.name || null,
      feature,
      contour,
    });
  }, [urlLoc, geojson, contours]);

  // Fallback initial pick from localStorage when no URL params present.
  // Ur4cast writes the user's selected location to opscast.loc.v1 — so
  // navigating to /fog directly carries that location over without needing
  // to round-trip through the Fog Forecast button's query string.
  useEffect(() => {
    if (urlLocAppliedRef.current) return;
    if (autoGeoTriedRef.current) return;
    if (urlLoc) return;
    if (!geojson) return;
    let stored;
    try {
      const raw = localStorage.getItem("opscast.loc.v1");
      if (raw) stored = JSON.parse(raw);
    } catch {}
    const lat = Number(stored?.latitude);
    const lng = Number(stored?.longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
    urlLocAppliedRef.current = true;
    autoGeoTriedRef.current = true;
    const point = [lng, lat];
    const feature = findNeighborhoodForPoint(geojson, point);
    const contour = findContourForPoint(contours, point);
    setPicked({
      point,
      address: stored.name || null,
      feature,
      contour,
    });
  }, [urlLoc, geojson, contours]);

  // When a picked point lands, ask Mapbox for the terrain elevation at
  // that lng/lat. Updates `picked.elevation_ft` once the async lookup
  // resolves; the result card renders the number when present, hides
  // the row when not.
  useEffect(() => {
    const point = picked?.point;
    if (!point) return;
    let cancelled = false;
    elevationAtPoint(point).then(ft => {
      if (cancelled) return;
      setPicked(p => {
        if (!p || p.point !== point) return p;
        return { ...p, elevation_ft: ft };
      });
    });
    return () => {
      cancelled = true;
    };
  }, [picked?.point]);

  // Auto-prompt for location on first mount, but only if permission isn't
  // already denied — otherwise we'd just be re-asking for a no. Skipped
  // entirely when a URL location was provided.
  useEffect(() => {
    if (autoGeoTriedRef.current) return;
    if (urlLoc) return; // URL-provided location takes precedence
    autoGeoTriedRef.current = true;
    if (typeof navigator === "undefined" || !navigator.geolocation) return;
    const trigger = () => queueMicrotask(requestGeoLocation);
    if (navigator.permissions?.query) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then(res => {
          if (res.state !== "denied") trigger();
        })
        .catch(trigger);
    } else {
      trigger();
    }
  }, [requestGeoLocation, urlLoc]);

  return (
    <div className="fog-app fog-app-vertical">
      <FogTopBar
        onPickFromAddress={pickFromAddress}
        onUseGeoLocation={requestGeoLocation}
        ready={!!geojson}
        geoLoading={geoLoading}
        picked={picked}
        dataErr={dataErr}
        geoErr={geoErr}
      />
      <div className="fog-map-wrap">
        <FogMap
          geojson={geojson}
          contours={contours}
          showContours={showContours}
          showTerrain={showTerrain}
          showElevation={showElevation}
          showSeismic={showSeismic}
          showTsunami={showTsunami}
          showMuni={showMuni}
          showBikes={showBikes}
          showZips={showZips}
          showDistricts={showDistricts}
          showZoning={showZoning}
          showRealtor={showRealtor}
          showNeighborhoods={showNeighborhoods}
          picked={picked}
          onPickFeature={pickFromMap}
        />
      </div>
      <FogPanel
        picked={picked}
        zips={zips}
        supervisorDistricts={supervisorDistricts}
        realtorNeighborhoods={realtorNeighborhoods}
        seismicHazards={seismicHazards}
        tsunamiHazard={tsunamiHazard}
        showNeighborhoods={showNeighborhoods}
        onToggleNeighborhoods={setShowNeighborhoods}
        showContours={showContours}
        onToggleContours={setShowContours}
        contoursAvailable={!!contours}
        showMuni={showMuni}
        onToggleMuni={setShowMuni}
        showBikes={showBikes}
        onToggleBikes={setShowBikes}
        showDistricts={showDistricts}
        onToggleDistricts={setShowDistricts}
        showZips={showZips}
        onToggleZips={setShowZips}
        showTerrain={showTerrain}
        onToggleTerrain={setShowTerrain}
        showElevation={showElevation}
        onToggleElevation={setShowElevation}
        showSeismic={showSeismic}
        onToggleSeismic={setShowSeismic}
        showTsunami={showTsunami}
        onToggleTsunami={setShowTsunami}
        showRealtor={showRealtor}
        onToggleRealtor={setShowRealtor}
      />
    </div>
  );
}
