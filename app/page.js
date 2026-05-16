'use client';

// OpsCast top-level page.
// Owns app state (location, hours, day range, thresholds, view, forecast,
// loading flags, error) and orchestrates the fetch + view transitions.
//
// Persistence: threshold ranges save to localStorage on every change and
// re-hydrate on next mount, so the user's customized "ideal range" becomes
// their personal default automatically.

import { useState, useEffect, useRef } from "react";
import SetupView from "./components/SetupView";
import ForecastView from "./components/ForecastView";
import { buildDefaults } from "./lib/thresholds";
import { geoCode, getWx, getAQ, buildFcData } from "./lib/weather-api";

const THRESH_STORAGE_KEY = "opscast.thresh.v1";

export default function Page() {
  const [zip, setZip] = useState("");
  const [startH, setStartH] = useState(8);
  const [endH, setEndH] = useState(17);
  const [dayFrom, setDayFrom] = useState(0);
  const [dayTo, setDayTo] = useState(0);
  const [thresh, setThresh] = useState(buildDefaults);
  const [view, setView] = useState("setup");
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [geoLoad, setGeoLoad] = useState(false);
  const [err, setErr] = useState("");

  // True once we've attempted to load saved thresholds from localStorage.
  // Prevents the auto-save effect from overwriting saved values with
  // initial defaults before hydration completes.
  const [hydrated, setHydrated] = useState(false);
  const autoGeoTriedRef = useRef(false);

  // ── Threshold persistence ────────────────────────────────────────────
  // On mount: hydrate any saved threshold values from localStorage.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(THRESH_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Merge with defaults so newly-added metrics still get sensible values.
        setThresh({ ...buildDefaults(), ...parsed });
      }
    } catch {
      // localStorage unavailable / parse error — fall back to defaults.
    }
    setHydrated(true);
  }, []);

  // After hydration, save threshold changes back to localStorage.
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(THRESH_STORAGE_KEY, JSON.stringify(thresh));
    } catch {}
  }, [thresh, hydrated]);

  // ── Forecast fetching ────────────────────────────────────────────────
  const runForLocation = async loc => {
    setLoading(true);
    setErr("");
    try {
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

  const run = async () => {
    setLoading(true);
    setErr("");
    try {
      const loc = await geoCode(zip);
      await runForLocation(loc);
    } catch (e) {
      setErr(e.message);
      setLoading(false);
    }
  };

  // Browser geolocation → reverse-geocode for a friendlier name → forecast.
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
        setZip(name);
        await runForLocation({
          latitude: lat,
          longitude: lon,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          name,
          admin1: "",
          country: "",
        });
        setGeoLoad(false);
      },
      () => {
        // Denied / failed — user can still type a location manually.
        setErr("Location access denied. Type a city or ZIP to continue.");
        setGeoLoad(false);
      }
    );
  };

  // Autocomplete suggestion clicked → immediately fetch forecast for that loc.
  const selectLocation = sug => {
    setZip(`${sug.name}${sug.admin1 ? `, ${sug.admin1}` : ""}`);
    runForLocation(sug);
  };

  // ── Auto-geolocate on mount ──────────────────────────────────────────
  // Trigger the browser's location prompt as soon as the app loads, unless
  // the user has already denied permission in this browser previously.
  useEffect(() => {
    if (autoGeoTriedRef.current) return;
    autoGeoTriedRef.current = true;
    if (typeof navigator === "undefined" || !navigator.geolocation) return;

    // If Permissions API is available, skip the prompt when previously denied.
    if (navigator.permissions) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then(result => {
          if (result.state !== "denied") {
            useGeo();
          }
        })
        .catch(() => {
          // Permissions API unavailable — try anyway; browser will prompt.
          useGeo();
        });
    } else {
      useGeo();
    }
    // useGeo captures stable state setters; safe to omit from deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="app">
      <div className="topbar">
        <div>
          <div className="brand-name">OpsCast</div>
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
          zip={zip} setZip={setZip}
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
