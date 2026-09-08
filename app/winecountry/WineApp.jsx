'use client';

// Top-level wine-country micro-climate experience. Loads the AVA outlines
// (Napa + Sonoma), the schematic sub-zone polygons (sun / cool / wind /
// fog_marine / fog_valley / temp gradient), the soil-archetype polygons,
// and the named peaks; owns the layer toggles + the picked location;
// renders the map + sidebar in the same shell as /microclimates.

import { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import WineMap from "./WineMap";
import WineSidebar from "./WineSidebar";
import { reverseGeocode } from "../fog/lib/geocode";

const AVA_URL   = "/data/wine-avas.geojson";
const ZONES_URL = "/data/wine-microclimates.geojson";
const SOILS_URL = "/data/wine-soils.geojson";

export default function WineApp() {
  const searchParams = useSearchParams();
  const [avas, setAvas] = useState(null);
  const [zones, setZones] = useState(null);
  const [soils, setSoils] = useState(null);
  const [dataErr, setDataErr] = useState("");
  const [picked, setPicked] = useState(null); // { point: [lng,lat], address }

  // Layer toggles. Sub-zones on by default so the map reads as a legible
  // microclimate map on first load; the ancillary layers (terrain /
  // contours / fog inversion / soils) start off.
  const [showSun, setShowSun] = useState(true);
  const [showCool, setShowCool] = useState(true);
  const [showWind, setShowWind] = useState(true);
  const [showFogMarine, setShowFogMarine] = useState(true);
  const [showFogValley, setShowFogValley] = useState(true);
  const [showTemp, setShowTemp] = useState(true);
  const [showTerrain, setShowTerrain] = useState(false);
  const [showContours, setShowContours] = useState(false);
  const [showFogLine, setShowFogLine] = useState(false);
  const [showPeaks, setShowPeaks] = useState(true);
  const [showAvas, setShowAvas] = useState(true);
  const [showSoils, setShowSoils] = useState(false);

  const [geoLoading, setGeoLoading] = useState(false);
  const [geoErr, setGeoErr] = useState("");
  const urlLocAppliedRef = useRef(false);

  const urlLoc = (() => {
    // Require the params to actually be present: Number(null) === 0 is
    // finite, so a bare `/winecountry` visit would otherwise resolve to
    // a phantom (0, 0) marker.
    const latRaw = searchParams?.get("lat");
    const lngRaw = searchParams?.get("lng");
    if (latRaw == null || lngRaw == null) return null;
    const lat = Number(latRaw);
    const lng = Number(lngRaw);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    return { point: [lng, lat], name: searchParams.get("name") || "" };
  })();

  useEffect(() => {
    let cancelled = false;
    fetch(AVA_URL)
      .then(r => (r.ok ? r.json() : Promise.reject(new Error(`AVAs ${r.status}`))))
      .then(d => { if (!cancelled) setAvas(d); })
      .catch(e => { if (!cancelled) setDataErr(e.message); });
    fetch(ZONES_URL)
      .then(r => (r.ok ? r.json() : Promise.reject(new Error(`zones ${r.status}`))))
      .then(d => { if (!cancelled) setZones(d); })
      .catch(e => { if (!cancelled) setDataErr(e.message); });
    fetch(SOILS_URL)
      .then(r => (r.ok ? r.json() : Promise.reject(new Error(`soils ${r.status}`))))
      .then(d => { if (!cancelled) setSoils(d); })
      .catch(e => { if (!cancelled) setDataErr(e.message); });
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

  // Apply a URL-provided location once the AVA data is ready.
  useEffect(() => {
    if (urlLocAppliedRef.current || !urlLoc || !avas) return;
    urlLocAppliedRef.current = true;
    setPicked({ point: urlLoc.point, address: urlLoc.name || null });
  }, [urlLoc, avas]);

  // Fallback to the shared location (opscast.loc.v1) — same behavior as
  // /microclimates so the picked point carries across pages.
  useEffect(() => {
    if (urlLocAppliedRef.current || urlLoc || !avas) return;
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
  }, [urlLoc, avas]);

  return (
    <div className="fog-app">
      <WineSidebar
        picked={picked}
        onPickFromAddress={pickFromAddress}
        dataErr={dataErr}
        ready={!!avas}
        showSun={showSun} onToggleSun={setShowSun}
        showCool={showCool} onToggleCool={setShowCool}
        showWind={showWind} onToggleWind={setShowWind}
        showFogMarine={showFogMarine} onToggleFogMarine={setShowFogMarine}
        showFogValley={showFogValley} onToggleFogValley={setShowFogValley}
        showTemp={showTemp} onToggleTemp={setShowTemp}
        showTerrain={showTerrain} onToggleTerrain={setShowTerrain}
        showContours={showContours} onToggleContours={setShowContours}
        showFogLine={showFogLine} onToggleFogLine={setShowFogLine}
        showPeaks={showPeaks} onTogglePeaks={setShowPeaks}
        showAvas={showAvas} onToggleAvas={setShowAvas}
        showSoils={showSoils} onToggleSoils={setShowSoils}
        onUseGeoLocation={requestGeoLocation}
        geoLoading={geoLoading}
        geoErr={geoErr}
      />
      <WineMap
        avas={avas}
        zones={zones}
        soils={soils}
        showSun={showSun}
        showCool={showCool}
        showWind={showWind}
        showFogMarine={showFogMarine}
        showFogValley={showFogValley}
        showTemp={showTemp}
        showTerrain={showTerrain}
        showContours={showContours}
        showFogLine={showFogLine}
        showPeaks={showPeaks}
        showAvas={showAvas}
        showSoils={showSoils}
        picked={picked}
      />
    </div>
  );
}
