'use client';

// OpsCast top-level page (v2).
// Owns app state (location, hours, day range, thresholds, view, forecast,
// loading flags, error) and orchestrates the fetch + view transitions.

import { useState } from "react";
import SetupView from "./components/SetupView";
import ForecastView from "./components/ForecastView";
import { buildDefaults } from "./lib/thresholds";
import { geoCode, getWx, getAQ, buildFcData } from "./lib/weather-api";

export default function Page() {
  const [zip, setZip] = useState("");
  const [startH, setStartH] = useState(8);
  const [endH, setEndH] = useState(17);
  const [dayFrom, setDayFrom] = useState(0);
  const [dayTo, setDayTo] = useState(2);
  const [thresh, setThresh] = useState(buildDefaults);
  const [view, setView] = useState("setup");
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [geoLoad, setGeoLoad] = useState(false);
  const [err, setErr] = useState("");

  // Fetch a forecast either from the typed query or, when coordinates are
  // passed in, directly (used by the geolocate flow).
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
      setForecast(buildFcData(wx, aq, loc));
      setView("forecast");
    } catch (e) {
      setErr(e.message);
    }
    setLoading(false);
  };

  // Browser geolocation → reverse-geocode for a friendlier name → run().
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
        await run(
          lat,
          lon,
          Intl.DateTimeFormat().resolvedOptions().timeZone,
          name
        );
        setGeoLoad(false);
      },
      () => {
        setErr("Location access denied.");
        setGeoLoad(false);
      }
    );
  };

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
          onSubmit={() => run()}
          onGeo={useGeo}
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
