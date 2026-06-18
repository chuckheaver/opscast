// Home hub — the clean entry screen. Just the location bar (top), the
// "Your SF Micro Life" title, and a 2-per-row grid of large facet tiles.
// Owns the shared location (zip + selectedLoc), persists it to
// localStorage so /weather and /fog pick it up, and feeds the fog tiles
// their lat/lng. No forecast or threshold form lives here anymore — that
// moved to the Weather tile's own page (/weather).

'use client';

import { useState, useEffect } from "react";
import LocationBar from "./LocationBar";
import { geoCode, reverseCityState } from "../lib/weather-api";

// Shared with /weather and /fog so the picked location carries across.
const LOC_STORAGE_KEY = "opscast.loc.v1";

// Build a URL carrying the current location (lat/lng/name) plus any extra
// query params. Used for the /fog layer presets and the /microclimates
// winds + radiation map.
function buildLocUrl(base, loc, extra = {}) {
  const qs = new URLSearchParams();
  if (loc?.latitude != null && loc?.longitude != null) {
    qs.set("lat", String(loc.latitude));
    qs.set("lng", String(loc.longitude));
    if (loc.name) qs.set("name", loc.name);
  }
  for (const [k, v] of Object.entries(extra)) if (v) qs.set(k, v);
  const s = qs.toString();
  return s ? `${base}?${s}` : base;
}

const buildFogUrl = (loc, preset) => buildLocUrl("/fog", loc, { preset });

export default function HomeHub() {
  const [zip, setZip] = useState("");
  const [selectedLoc, setSelectedLoc] = useState(null);
  const [geoLoad, setGeoLoad] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Restore the last-picked location so the tiles (and the field) start
  // populated and the fog layers open on the right spot.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOC_STORAGE_KEY);
      if (raw) {
        const stored = JSON.parse(raw);
        const lat = Number(stored?.latitude);
        const lng = Number(stored?.longitude);
        if (Number.isFinite(lat) && Number.isFinite(lng)) {
          setSelectedLoc({
            latitude: lat,
            longitude: lng,
            name: stored.name || "Your Location",
          });
          setZip(stored.name || "");
        }
      }
    } catch {}
    setHydrated(true);
  }, []);

  // Persist whenever the picked location changes.
  useEffect(() => {
    if (!hydrated || !selectedLoc) return;
    try {
      localStorage.setItem(LOC_STORAGE_KEY, JSON.stringify({
        latitude: selectedLoc.latitude,
        longitude: selectedLoc.longitude,
        name: selectedLoc.name,
      }));
    } catch {}
  }, [selectedLoc, hydrated]);

  // Typing clears any cached pick so the next submit fresh-geocodes.
  const handleZipInput = val => {
    setZip(val);
    if (selectedLoc !== null) setSelectedLoc(null);
  };

  // Enter in the field: geocode the typed text and store it so the tiles
  // get coordinates. No forecast here — that's the Weather tile's job.
  const run = async () => {
    if (!zip.trim()) return;
    setLoading(true);
    try {
      const loc = selectedLoc || (await geoCode(zip));
      setZip(loc.name || loc.label || zip);
      setSelectedLoc(loc);
    } catch {}
    setLoading(false);
  };

  // 📍 button: resolve the device location to a "City, ST" label.
  const useGeo = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) return;
    setGeoLoad(true);
    navigator.geolocation.getCurrentPosition(
      async pos => {
        const { latitude: lat, longitude: lon } = pos.coords;
        const name = await reverseCityState([lon, lat]);
        setZip(name);
        setSelectedLoc({
          latitude: lat,
          longitude: lon,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          name,
          label: name,
        });
        setGeoLoad(false);
      },
      () => setGeoLoad(false),
      { enableHighAccuracy: false, timeout: 9000, maximumAge: 60000 }
    );
  };

  const selectLocation = sug => {
    setZip(sug.label || sug.name || "");
    setSelectedLoc(sug);
  };

  const tiles = [
    { emoji: "🌤️", label: "Weather",       href: "/weather" },
    { emoji: "🌍", label: "Micro-Climate", href: buildLocUrl("/microclimates", selectedLoc, { layer: "solar" }) },
    { emoji: "🏡", label: "Market",        href: "/listings" },
    { emoji: "🌁", label: "Fog Map",       href: buildFogUrl(selectedLoc, "fog") },
    { emoji: "🚃", label: "Transit",       href: buildFogUrl(selectedLoc, "transit") },
    { emoji: "🚲", label: "Bike Paths",    href: buildFogUrl(selectedLoc, "bikes") },
    {
      label: "Neighborhoods",
      href: buildFogUrl(selectedLoc, "neighborhoods"),
      svg: (
        <svg width="58" height="58" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Folded map">
          <g stroke="#a89f8a" strokeWidth="1.2" strokeLinejoin="round">
            <polygon points="8,18 24,12 24,51 8,57" fill="#ece7d8" />
            <polygon points="24,12 40,18 40,57 24,51" fill="#dcd6c4" />
            <polygon points="40,18 56,12 56,51 40,57" fill="#ece7d8" />
          </g>
          <path d="M10,40 L24,34 L40,40 L54,34" stroke="#7fb27f" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <path d="M16,49 L30,44" stroke="#9cc1e0" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M12,25 L26,31 M31,23 L45,29" stroke="#bfb6a0" strokeWidth="1" fill="none" />
          <g transform="translate(36,27)">
            <path d="M0,-7 C4,-7 6,-4 6,-1 C6,3 0,9 0,9 C0,9 -6,3 -6,-1 C-6,-4 -4,-7 0,-7 Z" fill="#e24b4a" stroke="#fff" strokeWidth="1" />
            <circle cx="0" cy="-1" r="2.2" fill="#fff" />
          </g>
        </svg>
      ),
    },
    { emoji: "🍷", label: "Wine AVAs",     href: "/wine" },
  ];

  return (
    <div className="setup">
      <div className="ml-header">
        <LocationBar
          zip={zip}
          setZip={handleZipInput}
          selectedLoc={selectedLoc}
          loading={loading}
          geoLoad={geoLoad}
          onSubmit={run}
          onGeo={useGeo}
          onSelectLocation={selectLocation}
        />
      </div>

      <div className="page-h hub-title">
        Your SF <em>Micro Life</em>
      </div>

      <div className="micro-grid">
        {tiles.map(t => (
          <a className="micro-tile" href={t.href} key={t.label}>
            <span className="micro-tile-emoji" aria-hidden="true">{t.svg || t.emoji}</span>
            <span className="micro-tile-label">{t.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
