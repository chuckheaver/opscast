'use client';

// OpsCast top-level page.
// Owns app state (location, hours, day range, thresholds, view, forecast,
// loading flags, error) and orchestrates the fetch + view transitions.

import { useState, useEffect, useRef } from "react";
import SetupView from "./components/SetupView";
import ForecastView from "./components/ForecastView";
import { buildDefaults } from "./lib/thresholds";
import { geoCode, getWx, getAQ, buildFcData } from "./lib/weather-api";

export default function Page() {
  const [zip, setZip] = useState("");
  const [startH, setStartH] = useState(8);
  const [endH, setEndH] = useState(17);
  const [dayFrom, setDayFrom] = useState(0);
  const [dayTo, setDayTo] = useState(0); // default: Today through Today
  const [thresh, setThresh] = useState(buildDefaults);
  const [view, setView] = useState("setup");
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [geoLoad, setGeoLoad] = useState(false);
  const [err, setErr] = useState("");

  // Once-per-mount guard for the auto-geolocate attempt below.
  const autoGeoTriedRef = useRef(false);

  // Forecast for arbitrary coords (used by geolocate AND autocomplete-select).
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

  // Forecast for the typed query (uses geoCode to resolve first).
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
        setErr("Location access denied.");
        setGeoLoad(false);
      }
    );
  };

  // Pick a suggestion from autocomplete → immediately fetch forecast.
  const selectLocation = sug => {
    setZip(`${sug.name}${sug.admin1 ? `, ${sug.admin1}` : ""}`);
    runForLocation(sug);
  };

  // Auto-geolocate on mount IF the browser has already granted permission.
  // We don't pop a fresh permission prompt — that would be jarring on first
  // visit. Returning users with granted permission get the convenience.
  useEffect(() => {
    if (autoGeoTriedRef.current) return;
    autoGeoTriedRef.current = true;
    if (
      typeof navigator !== "undefined" &&
      navigator.permissions &&
      navigator.geolocation
    ) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then(result => {
          if (result.state === "granted") {
            useGeo();
          }
        })
        .catch(() => {});
    }
    // useGeo references state setters captured at first render; safe to omit.
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
