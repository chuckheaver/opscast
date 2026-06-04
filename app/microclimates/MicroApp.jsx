'use client';

// Top-level micro-climate experience. Loads the SF neighborhood outlines
// and the terrain-derived sub-zone polygons, owns the layer toggles + the
// picked location, and renders the map + sidebar in the same shell as /fog.

import { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import MicroMap from "./MicroMap";
import MicroSidebar from "./MicroSidebar";
import { reverseGeocode } from "../fog/lib/geocode";

const NEIGH_URL = "/data/sf-fog-neighborhoods.geojson";
const ZONES_URL = "/data/sf-microclimates.geojson";
const SOLAR_URL = "/data/sf-solar-irradiation.geojson";
const CANOPY_URL = "/data/sf-canopy.geojson";

export default function MicroApp() {
  const searchParams = useSearchParams();
  const [neighborhoods, setNeighborhoods] = useState(null);
  const [zones, setZones] = useState(null);
  const [solar, setSolar] = useState(null);
  const [canopy, setCanopy] = useState(null);
  const [dataErr, setDataErr] = useState("");
  const [picked, setPicked] = useState(null); // { point: [lng,lat], address }

  // Layer toggles — all three sub-zones on by default; neighborhood
  // outlines on as the anchor.
  const [showSun, setShowSun] = useState(true);
  const [showCool, setShowCool] = useState(true);
  const [showWind, setShowWind] = useState(true);
  const [showFog, setShowFog] = useState(true);
  const [showSolar, setShowSolar] = useState(false);
  const [showContours, setShowContours] = useState(false);
  const [showFogLine, setShowFogLine] = useState(false);
  const [showNeighborhoods, setShowNeighborhoods] = useState(true);

  const [geoLoading, setGeoLoading] = useState(false);
  const [geoErr, setGeoErr] = useState("");
  const urlLocAppliedRef = useRef(false);

  const urlLoc = (() => {
    const lat = Number(searchParams?.get("lat"));
    const lng = Number(searchParams?.get("lng"));
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    return { point: [lng, lat], name: searchParams.get("name") || "" };
  })();

  useEffect(() => {
    let cancelled = false;
    fetch(NEIGH_URL)
      .then(r => (r.ok ? r.json() : Promise.reject(new Error(`neighborhoods ${r.status}`))))
      .then(d => { if (!cancelled) setNeighborhoods(d); })
      .catch(e => { if (!cancelled) setDataErr(e.message); });
    fetch(ZONES_URL)
      .then(r => (r.ok ? r.json() : Promise.reject(new Error(`zones ${r.status}`))))
      .then(d => { if (!cancelled) setZones(d); })
      .catch(e => { if (!cancelled) setDataErr(e.message); });
    fetch(SOLAR_URL)
      .then(r => (r.ok ? r.json() : null))
      .then(d => { if (!cancelled && d) setSolar(d); })
      .catch(() => {});
    fetch(CANOPY_URL)
      .then(r => (r.ok ? r.json() : null))
      .then(d => { if (!cancelled && d) setCanopy(d); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const pickFromAddress = useCallback((point, address) => {
    setPicked({ point, address });
  }, []);

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
        setPicked({ point, address });
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

  // Apply a URL-provided location once the data is ready.
  useEffect(() => {
    if (urlLocAppliedRef.current || !urlLoc || !neighborhoods) return;
    urlLocAppliedRef.current = true;
    setPicked({ point: urlLoc.point, address: urlLoc.name || null });
  }, [urlLoc, neighborhoods]);

  // Fallback to the shared location (opscast.loc.v1) when no URL params
  // are present, so the selection carries across pages consistently.
  useEffect(() => {
    if (urlLocAppliedRef.current || urlLoc || !neighborhoods) return;
    let stored;
    try {
      const raw = localStorage.getItem("opscast.loc.v1");
      if (raw) stored = JSON.parse(raw);
    } catch {}
    const lat = Number(stored?.latitude);
    const lng = Number(stored?.longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
    urlLocAppliedRef.current = true;
    setPicked({ point: [lng, lat], address: stored.name || null });
  }, [urlLoc, neighborhoods]);

  return (
    <div className="fog-app">
      <MicroSidebar
        picked={picked}
        onPickFromAddress={pickFromAddress}
        dataErr={dataErr}
        ready={!!neighborhoods}
        showSun={showSun} onToggleSun={setShowSun}
        showCool={showCool} onToggleCool={setShowCool}
        showWind={showWind} onToggleWind={setShowWind}
        showFog={showFog} onToggleFog={setShowFog}
        showSolar={showSolar} onToggleSolar={setShowSolar}
        showContours={showContours} onToggleContours={setShowContours}
        showFogLine={showFogLine} onToggleFogLine={setShowFogLine}
        showNeighborhoods={showNeighborhoods} onToggleNeighborhoods={setShowNeighborhoods}
        onUseGeoLocation={requestGeoLocation}
        geoLoading={geoLoading}
        geoErr={geoErr}
      />
      <MicroMap
        neighborhoods={neighborhoods}
        zones={zones}
        solar={solar}
        canopy={canopy}
        showSun={showSun}
        showCool={showCool}
        showWind={showWind}
        showFog={showFog}
        showSolar={showSolar}
        showContours={showContours}
        showFogLine={showFogLine}
        showNeighborhoods={showNeighborhoods}
        picked={picked}
      />
    </div>
  );
}
