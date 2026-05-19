'use client';

// Top-level fog-map experience. Owns:
//   - the loaded neighborhood GeoJSON (one fetch on mount)
//   - the search-bar state (address text + selected suggestion)
//   - the currently "picked" neighborhood (driven by either a search result
//     or a click on the map)
// Renders FogMap (the actual map canvas) and FogSidebar (search + result card).

import { useEffect, useState, useCallback, useRef } from "react";
import FogMap from "./FogMap";
import FogSidebar from "./FogSidebar";
import { findNeighborhoodForPoint, findContourForPoint } from "./lib/spatial";
import { reverseGeocode } from "./lib/geocode";

const DATA_URL = "/data/sf-fog-neighborhoods.geojson";
const CONTOURS_URL = "/data/sf-fog-contours.geojson";

export default function FogApp() {
  const [geojson, setGeojson] = useState(null);
  const [contours, setContours] = useState(null);
  const [dataErr, setDataErr] = useState("");
  const [picked, setPicked] = useState(null); // { feature, point: [lng, lat], address, contour }
  // Fog data layer (contour fills + icon patterns) is shown by default;
  // toggle off for a clean basemap with only neighborhood outlines.
  const [showContours, setShowContours] = useState(true);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoErr, setGeoErr] = useState("");
  const autoGeoTriedRef = useRef(false);
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

  // Auto-prompt for location on first mount, but only if permission isn't
  // already denied — otherwise we'd just be re-asking for a no.
  // The actual trigger is queued as a microtask so the synchronous
  // setState inside requestGeoLocation doesn't fire during the effect body.
  useEffect(() => {
    if (autoGeoTriedRef.current) return;
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
  }, [requestGeoLocation]);

  return (
    <div className="fog-app">
      <FogSidebar
        picked={picked}
        onPickFromAddress={pickFromAddress}
        dataErr={dataErr}
        ready={!!geojson}
        contoursAvailable={!!contours}
        showContours={showContours}
        onToggleContours={setShowContours}
        onUseGeoLocation={requestGeoLocation}
        geoLoading={geoLoading}
        geoErr={geoErr}
      />
      <FogMap
        geojson={geojson}
        contours={contours}
        showContours={showContours}
        picked={picked}
        onPickFeature={pickFromMap}
      />
    </div>
  );
}
