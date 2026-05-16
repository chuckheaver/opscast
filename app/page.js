'use client';

// Ur4cast top-level page.
// Owns app state (location, hours, day range, thresholds, view, forecast,
// loading flags, error) and orchestrates the fetch + view transitions.
//
// Location flow:
//   - Auto-geolocate, manual 📍 button, and autocomplete suggestions all
//     POPULATE the location (text + coords) but stay on the setup view.
//   - User reviews thresholds / hours / day range, then clicks
//     "Get My Forecast →" to actually fetch.

import { useState, useEffect, useRef } from "react";
import SetupView from "./components/SetupView";
import ForecastView from "./components/ForecastView";
import { buildDefaults } from "./lib/thresholds";
import { geoCode, getWx, getAQ, buildFcData } from "./lib/weather-api";

const THRESH_STORAGE_KEY = "ur4cast.thresh.v1";

export default function Page() {
  const [zip, setZip] = useState("");
  // When the user accepts geolocation or picks an autocomplete suggestion,
  // we cache the full location object here (coords + timezone + name).
  // The submit handler uses this directly to skip the redundant geoCode call.
  // Typing in the zip field clears it (handled via handleZipInput).
  const [selectedLoc, setSelectedLoc] = useState(null);
  const [startH, setStartH] = useState(9);
  const [endH, setEndH] = useState(17);
  const [dayFrom, setDayFrom] = useState(0);
  const [dayTo, setDayTo] = useState(1);
  const [thresh, setThresh] = useState(buildDefaults);
  const [view, setView] = useState("setup");
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [geoLoad, setGeoLoad] = useState(false);
  const [err, setErr] = useState("");

  const [hydrated, setHydrated] = useState(false);
  const autoGeoTriedRef = useRef(false);

  // ── Threshold persistence ────────────────────────────────────────────
  useEffect(() => {
    try {
      const saved = localStorage.getItem(THRESH_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setThresh({ ...buildDefaults(), ...parsed });
      }
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(THRESH_STORAGE_KEY, JSON.stringify(thresh));
    } catch {}
  }, [thresh, hydrated]);

  // User-typed input in the location field. Clears any cached selectedLoc
  // so the submit handler will fresh-geoCode whatever they finished typing.
  const handleZipInput = val => {
    setZip(val);
    if (selectedLoc !== null) setSelectedLoc(null);
  };

  // Manual 📍 click OR auto-trigger on mount. Populates the location field
  // and the cached selectedLoc, then stops — does NOT navigate to forecast.
  const useGeo = () => {
    if (!navigator.geolocation) {
      setErr("Geolocation not supported.");
      return;
    }
    setGeoLoad(true);
    setErr("");
    navigator.geolocation.getCurrentPosition(
      async pos => {
        const { latitude: lat, longitude: lon } = pos.coords;
        let name = "Your Location";
        try {
          const r = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
          );
          const d = await r.json();
          name =
            d.address?.city ||
            d.address?.town ||
            d.address?.village ||
            name;
        } catch {}
        const loc = {
          latitude: lat,
          longitude: lon,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          name,
          admin1: "",
          country: "",
        };
        setZip(name);
        setSelectedLoc(loc);
        setGeoLoad(false);
      },
      () => {
        setErr("Location access denied. Type a city or ZIP to continue.");
        setGeoLoad(false);
      }
    );
  };

  // Autocomplete pick. Populates the field and caches the loc; user still
  // has to hit Get My Forecast.
  const selectLocation = sug => {
    setZip(`${sug.name}${sug.admin1 ? `, ${sug.admin1}` : ""}`);
    setSelectedLoc(sug);
  };

  // Submit handler — the ONE place a forecast actually gets fetched.
  // Uses cached selectedLoc when available; otherwise geocodes the typed text.
  const run = async () => {
    setLoading(true);
    setErr("");
    try {
      const loc = selectedLoc || (await geoCode(zip));
      const [wx, aq] = await Promise.all([
        getWx(loc.latitude, loc.longitude, loc.timezone),
        getAQ(loc.latitude, loc.longitude, loc.timezone),
      ]);
      setForecast(buildFcData(wx, aq, loc));
      setView("forecast");
    } catch (e) {
      setErr(e.message);
    }
    setLoading(false);
  };

  // ── Auto-geolocate on mount ──────────────────────────────────────────
  // Pre-fills the location field on first load. User still has to click
  // "Get My Forecast →" to actually fetch.
  useEffect(() => {
    if (autoGeoTriedRef.current) return;
    autoGeoTriedRef.current = true;
    if (typeof navigator === "undefined" || !navigator.geolocation) return;
    if (navigator.permissions) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then(result => {
          if (result.state !== "denied") {
            useGeo();
          }
        })
        .catch(() => {
          useGeo();
        });
    } else {
      useGeo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="app">
      <div className="topbar">
        <div>
          <div className="brand-name">Ur4cast</div>
          <div className="brand-tag">Business Weather Intelligence</div>
        </div>
        {view === "forecast" && (
          <button
            className="edit-btn"
            onClick={() => {
              setView("setup");
              setForecast(null);
              setErr("");
            }}
          >
            ← Edit Settings
          </button>
        )}
      </div>

      {view === "setup" && (
        <SetupView
          zip={zip} setZip={handleZipInput}
          startH={startH} setStartH={setStartH}
          endH={endH} setEndH={setEndH}
          dayFrom={dayFrom} setDayFrom={setDayFrom}
          dayTo={dayTo} setDayTo={setDayTo}
          thresh={thresh} setThresh={setThresh}
          loading={loading} geoLoad={geoLoad}
          err={err}
          onSubmit={run}
          onGeo={useGeo}
          onSelectLocation={selectLocation}
        />
      )}

      {view === "forecast" && forecast && (
        <ForecastView
          forecast={forecast}
          startH={startH}
          endH={endH}
          dayFrom={dayFrom}
          dayTo={dayTo}
          thresh={thresh}
        />
      )}
    </div>
  );
}
