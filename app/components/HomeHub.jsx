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

// Build a /fog URL carrying the current location + the layer preset.
function buildFogUrl(loc, preset) {
  const qs = new URLSearchParams();
  if (loc?.latitude != null && loc?.longitude != null) {
    qs.set("lat", String(loc.latitude));
    qs.set("lng", String(loc.longitude));
    if (loc.name) qs.set("name", loc.name);
  }
  if (preset) qs.set("preset", preset);
  const s = qs.toString();
  return s ? `/fog?${s}` : "/fog";
}

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
    { emoji: "🌍", label: "Micro-Climate", href: "/microclimates" },
    { emoji: "🏡", label: "Market",        href: "/listings" },
    { emoji: "🌁", label: "Fog Map",       href: buildFogUrl(selectedLoc, "fog") },
    { emoji: "🚃", label: "Transit",       href: buildFogUrl(selectedLoc, "transit") },
    { emoji: "🚲", label: "Bike Paths",    href: buildFogUrl(selectedLoc, "bikes") },
    { emoji: "📭", label: "Districts",     href: buildFogUrl(selectedLoc, "districts") },
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
            <span className="micro-tile-emoji" aria-hidden="true">{t.emoji}</span>
            <span className="micro-tile-label">{t.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
