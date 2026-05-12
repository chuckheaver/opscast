'use client';

// OpsCast top-level page.
// Owns app state (zip, hours, thresholds, view, forecast, etc.) and
// orchestrates fetching + transitions between SetupView and ForecastView.

import { useState } from "react";
import SetupView from "./components/SetupView";
import ForecastView from "./components/ForecastView";
import { DEFAULTS } from "./lib/thresholds";
import { geoCode, getWx, getAQ, buildForecast } from "./lib/weather-api";

export default function Page() {
  const [zip, setZip] = useState("");
  const [startH, setStartH] = useState(8);
  const [endH, setEndH] = useState(17);
  const [thresh, setThresh] = useState(DEFAULTS);
  const [view, setView] = useState("setup");
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [err, setErr] = useState("");
  const [selDay, setSelDay] = useState(0);

  // Fetch a forecast either from a free-text query (default) or, when
  // coordinates are passed in, directly (used by the geolocate flow).
  const run = async (lat = null, lon = null, tz = null, name = null) => {
    setLoading(true);
    setErr("");
    try {
      let loc;
      if (lat != null) {
        loc = {
          latitude: lat,
          longitude: lon,
          timezone: tz,
          name: name || "Your Location",
          admin1: "",
          country: "",
        };
      } else {
        loc = await geoCode(zip);
      }
      const [wx, aq] = await Promise.all([
        getWx(loc.latitude, loc.longitude, loc.timezone),
        getAQ(loc.latitude, loc.longitude, loc.timezone),
      ]);
      setForecast(buildForecast(wx, aq, loc));
      setSelDay(0);
      setView("forecast");
    } catch (e) {
      setErr(e.message);
    }
    setLoading(false);
  };

  // Use browser geolocation, then reverse-geocode the coords to a city name
  // via Nominatim before fetching the forecast.
  const useGeo = () => {
    if (!navigator.geolocation) {
      setErr("Geolocation not supported by your browser.");
      return;
    }
    setGeoLoading(true);
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
            d.address?.county ||
            name;
        } catch {}
        await run(lat, lon, Intl.DateTimeFormat().resolvedOptions().timeZone, name);
        setGeoLoading(false);
      },
      () => {
        setErr("Location access denied.");
        setGeoLoading(false);
      }
    );
  };

  return (
    <div className="app">
      <div className="topbar">
        <div className="brand">
          <div className="brand-pip" />
          <div>
            <div className="brand-name">OpsCast</div>
            <div className="brand-sub mono">Weather Intelligence</div>
          </div>
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
          zip={zip}
          setZip={setZip}
          startH={startH}
          setStartH={setStartH}
          endH={endH}
          setEndH={setEndH}
          thresh={thresh}
          setThresh={setThresh}
          loading={loading}
          geoLoading={geoLoading}
          err={err}
          onSubmit={() => run()}
          onGeo={useGeo}
        />
      )}

      {view === "forecast" && forecast && (
        <ForecastView
          forecast={forecast}
          startH={startH}
          endH={endH}
          thresh={thresh}
          selDay={selDay}
          setSelDay={setSelDay}
        />
      )}
    </div>
  );
}
