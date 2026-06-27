'use client';

// Top-level Wine Country AVA experience. Owns:
//   - the merged Napa + Sonoma AVA GeoJSON (two fetches on mount,
//     merged + deduped + area-sorted in lib/avas.js)
//   - the clicked point and its appellation stack
//   - the selected AVA (smallest at the click by default; any chip in
//     the panel re-selects)
//   - the five layer toggles
// Renders a slim title bar, WineMap, and WinePanel, reusing the /fog
// page's layout CSS.

import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import WineMap from "./WineMap";
import WineMapTools from "./WineMapTools";
import WineDetailModal from "./WineDetailModal";
import GrapeModal from "./GrapeModal";
import { mergeAvaCollections, buildLabelPoints, avasAtPoint, fogHoursAtPoint } from "./lib/avas";
import { getWineProfile } from "./lib/grapes";

// Average a feature's outer-ring coordinates → a rough centroid for fly-to.
function featureCenter(feature) {
  const g = feature?.geometry;
  if (!g) return null;
  const polys = g.type === "Polygon" ? [g.coordinates] : g.coordinates;
  let sx = 0, sy = 0, n = 0;
  for (const poly of polys) {
    for (const [x, y] of poly[0]) { sx += x; sy += y; n++; }
  }
  return n ? [sx / n, sy / n] : null;
}

const NAPA_URL = "/data/avas/napa_avas.geojson";
const SONOMA_URL = "/data/avas/sonoma_avas.geojson";
// Sonoma from the sonoma.com directory, Napa from Wikipedia — built by
// scripts/build-sonoma-wineries.mjs and scripts/build-napa-wineries.mjs.
const WINERY_URLS = [
  "/data/avas/sonoma-wineries.geojson",
  "/data/avas/napa-wineries.geojson",
];
const FOG_URL = "/data/avas/wine-fog-contours.geojson";
const SOILS_URL = "/data/avas/soils.geojson";

// Roll the wineries' own varietal lists up by AVA → a ranked "Known for"
// list per appellation. This is the public proxy for the (confidential)
// parcel-varietal data: where each grape is actually poured, by AVA.
function buildVarietalsByAva(wineries) {
  if (!wineries) return {};
  const counts = {}; // ava → { variety → winery count }
  for (const f of wineries.features) {
    const { ava, varietals } = f.properties;
    if (!ava || !varietals) continue;
    const set = new Set(varietals.split("|").map(v => v.trim()).filter(Boolean));
    (counts[ava] ||= {});
    for (const v of set) counts[ava][v] = (counts[ava][v] || 0) + 1;
  }
  const out = {};
  for (const [ava, m] of Object.entries(counts)) {
    out[ava] = Object.entries(m)
      .sort((a, b) => b[1] - a[1])
      .map(([variety, n]) => ({ variety, n }));
  }
  return out;
}

export default function WineApp() {
  const [merged, setMerged] = useState(null);
  const [labels, setLabels] = useState(null);
  const [wineries, setWineries] = useState(null);
  const [fog, setFog] = useState(null);
  const [dataErr, setDataErr] = useState("");
  const [picked, setPicked] = useState(null); // { point, stack, winery, soil, address }
  const [selected, setSelected] = useState(null); // feature from merged
  const [detailOpen, setDetailOpen] = useState(false); // detail modal visibility
  const [flyTo, setFlyTo] = useState(null); // { center, zoom } → WineMap eases there
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoErr, setGeoErr] = useState("");
  const [showNapa, setShowNapa] = useState(true);
  const [showSonoma, setShowSonoma] = useState(true);
  const [showRegions, setShowRegions] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [showWineries, setShowWineries] = useState(true);
  const [showVineyards, setShowVineyards] = useState(true);
  const [showFog, setShowFog] = useState(false);
  const [showTerrain, setShowTerrain] = useState(false);
  const [showElevation, setShowElevation] = useState(false);
  // Soils (SSURGO) is the heaviest layer (~6.7 MB), so it's lazy-loaded:
  // fetched only the first time the Soils toggle is switched on.
  const [showSoils, setShowSoils] = useState(false);
  const [soils, setSoils] = useState(null);
  useEffect(() => {
    if (!showSoils || soils) return;
    let cancelled = false;
    fetch(SOILS_URL)
      .then(r => (r.ok ? r.json() : null))
      .then(d => {
        if (!cancelled && d) setSoils(d);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [showSoils, soils]);

  useEffect(() => {
    let cancelled = false;
    Promise.all(
      [NAPA_URL, SONOMA_URL].map(url =>
        fetch(url).then(r => {
          if (!r.ok) throw new Error(`Failed to load AVA data (${r.status})`);
          return r.json();
        })
      )
    )
      .then(([napa, sonoma]) => {
        if (cancelled) return;
        const fc = mergeAvaCollections(napa, sonoma);
        setMerged(fc);
        setLabels(buildLabelPoints(fc));
      })
      .catch(e => {
        if (!cancelled) setDataErr(e.message);
      });
    // Winery layers are optional — any file not built yet is skipped
    // silently and the rest still render.
    Promise.all(
      WINERY_URLS.map(url =>
        fetch(url)
          .then(r => (r.ok ? r.json() : null))
          .catch(() => null)
      )
    ).then(parts => {
      if (cancelled) return;
      const features = parts.filter(Boolean).flatMap(fc => fc.features);
      if (features.length) setWineries({ type: "FeatureCollection", features });
    });
    // Fog contours — optional; skipped silently if not built yet.
    fetch(FOG_URL)
      .then(r => (r.ok ? r.json() : null))
      .then(d => {
        if (!cancelled && d) setFog(d);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const varietalsByAva = useMemo(() => buildVarietalsByAva(wineries), [wineries]);

  // Per-AVA winery roster (name / address / phone) for the "Wineries: N"
  // click-through list. Grouped by each winery's most-specific AVA — the
  // same `ava` field that drives the Known-For rollup, so the count and
  // the list agree.
  const wineriesByAva = useMemo(() => {
    const out = {};
    if (!wineries) return out;
    for (const f of wineries.features) {
      const a = f.properties.ava;
      if (!a) continue;
      (out[a] ||= []).push({
        name: f.properties.name,
        address: f.properties.address,
        phone: f.properties.phone,
        website: f.properties.website,
      });
    }
    for (const a in out) out[a].sort((x, y) => x.name.localeCompare(y.name));
    return out;
  }, [wineries]);

  // Mean summer-fog hrs/day across each AVA's wineries — the "where the
  // vines actually are" average, used for the AVA climate-summary line.
  const fogByAva = useMemo(() => {
    if (!wineries || !fog) return {};
    const acc = {};
    for (const f of wineries.features) {
      const ava = f.properties.ava;
      if (!ava) continue;
      const h = fogHoursAtPoint(fog, f.geometry.coordinates);
      if (h == null) continue;
      (acc[ava] ||= { sum: 0, n: 0 });
      acc[ava].sum += h;
      acc[ava].n++;
    }
    const out = {};
    for (const [ava, { sum, n }] of Object.entries(acc)) out[ava] = sum / n;
    return out;
  }, [wineries, fog]);

  // Latest merged dataset, reachable from async (geolocation) callbacks.
  const mergedRef = useRef(merged);
  useEffect(() => { mergedRef.current = merged; }, [merged]);

  // Map click → exact point-in-polygon stack over the full dataset.
  // The smallest (most specific) AVA becomes the selection; North Coast
  // only wins when nothing more specific contains the point. When the
  // click landed on a winery dot, its properties ride along and the
  // detail leads with the winery card. Opens the detail modal.
  const pickPoint = useCallback(
    (point, winery = null, soil = null, extra = {}) => {
      const stack = avasAtPoint(mergedRef.current, point);
      setPicked({ point, stack, winery, soil, ...extra });
      setSelected(stack[0] || null);
      setDetailOpen(true);
    },
    []
  );

  // Address search result → pick that point + fly there.
  const pickFromAddress = useCallback((center, address) => {
    pickPoint(center, null, null, { address });
    setFlyTo({ center, zoom: 11 });
  }, [pickPoint]);

  // "Find me" → geolocate, pick that point, fly there.
  const requestGeoLocation = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setGeoErr("Geolocation isn't available in this browser.");
      return;
    }
    setGeoLoading(true);
    setGeoErr("");
    navigator.geolocation.getCurrentPosition(
      pos => {
        const point = [pos.coords.longitude, pos.coords.latitude];
        pickPoint(point);
        setFlyTo({ center: point, zoom: 11 });
        setGeoLoading(false);
      },
      err => {
        setGeoErr(err.code === err.PERMISSION_DENIED
          ? "Location access denied. Search an address instead."
          : "Couldn't get your location. Search an address instead.");
        setGeoLoading(false);
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 }
    );
  }, [pickPoint]);

  // Pick an AVA from the toolbar list → select + fly to its centre + open detail.
  const pickAvaFromList = useCallback(feature => {
    setSelected(feature);
    const center = featureCenter(feature);
    setPicked({ point: center, stack: [feature], winery: null, soil: null });
    setDetailOpen(true);
    if (center) setFlyTo({ center, zoom: 10.5 });
  }, []);

  // Pick a winery from the toolbar list → pick its point + fly + open detail.
  const pickWineryFromList = useCallback(feature => {
    const point = feature.geometry?.coordinates;
    if (!point) return;
    pickPoint(point, feature.properties);
    setFlyTo({ center: point, zoom: 12 });
  }, [pickPoint]);

  // Grape encyclopedia modal — opened from any clickable grape name
  // (winery popup varietals, AVA Known-For / Typical grapes).
  const [grape, setGrape] = useState(null);
  const openGrape = useCallback(name => {
    const profile = getWineProfile(name);
    if (profile) setGrape(profile);
  }, []);

  // Choosing an appellation chip (in the detail's stack) switches the card
  // from the winery (if any) to that AVA.
  const selectAva = useCallback(feature => {
    setSelected(feature);
    setPicked(p => (p && p.winery ? { ...p, winery: null } : p));
  }, []);

  return (
    <div className="fog-app fog-app-vertical">
      <div className="fog-map-wrap fog-map-wrap-full">
        <WineMap
          merged={merged}
          labels={labels}
          wineries={wineries}
          showNapa={showNapa}
          showSonoma={showSonoma}
          showRegions={showRegions}
          showLabels={showLabels}
          showWineries={showWineries}
          showVineyards={showVineyards}
          fog={fog}
          showFog={showFog}
          soils={soils}
          showSoils={showSoils}
          showTerrain={showTerrain}
          showElevation={showElevation}
          selectedId={selected?.properties?.ava_id || null}
          picked={picked}
          flyTo={flyTo}
          onPickPoint={pickPoint}
          onGrapeClick={openGrape}
        />
        <WineMapTools
          showNapa={showNapa}
          onToggleNapa={setShowNapa}
          showSonoma={showSonoma}
          onToggleSonoma={setShowSonoma}
          showRegions={showRegions}
          onToggleRegions={setShowRegions}
          showLabels={showLabels}
          onToggleLabels={setShowLabels}
          showWineries={showWineries}
          onToggleWineries={setShowWineries}
          showVineyards={showVineyards}
          onToggleVineyards={setShowVineyards}
          showFog={showFog}
          onToggleFog={setShowFog}
          showSoils={showSoils}
          onToggleSoils={setShowSoils}
          showElevation={showElevation}
          onToggleElevation={setShowElevation}
          showTerrain={showTerrain}
          onToggleTerrain={setShowTerrain}
          merged={merged}
          wineries={wineries}
          selectedId={selected?.properties?.ava_id || null}
          onSelectAva={pickAvaFromList}
          onPickWinery={pickWineryFromList}
          onPickFromAddress={pickFromAddress}
          onUseGeoLocation={requestGeoLocation}
          ready={!!merged}
          geoLoading={geoLoading}
          picked={picked}
          dataErr={dataErr || geoErr}
        />
      </div>
      {detailOpen && (
        <WineDetailModal
          picked={picked}
          selected={selected}
          onSelect={selectAva}
          varietalsByAva={varietalsByAva}
          fogByAva={fogByAva}
          wineriesByAva={wineriesByAva}
          onGrapeClick={openGrape}
          onClose={() => setDetailOpen(false)}
        />
      )}
      <GrapeModal grape={grape} onClose={() => setGrape(null)} />
    </div>
  );
}
