'use client';

// Ur4cast top-level page.
// Forecast-first: on mount we auto-geolocate, fetch the forecast, and
// show the result. The setup form (location entry + threshold sliders)
// lives behind the ⚙ gear icon in the topbar, accessed only when the
// user wants to change something.

import { useState, useEffect, useRef } from "react";
import SetupView from "./components/SetupView";
import ForecastView from "./components/ForecastView";
import { buildDefaults } from "./lib/thresholds";
import { geoCode, getWx, getAQ, buildFcData } from "./lib/weather-api";

const THRESH_STORAGE_KEY = "ur4cast.thresh.v1";
// Last-selected location, shared with /fog so it can carry the location over
// without depending on the Fog Forecast button's URL params (direct navs work).
const LOC_STORAGE_KEY = "opscast.loc.v1";

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
  // Three views: "loading" (fetching the auto-launch forecast), "forecast"
  // (results), and "settings" (the SetupView form behind the gear icon).
  // We start in "loading" so the splash is intentional, then fall through
  // to "settings" only if geolocation fails or returns nothing.
  const [view, setView] = useState("loading");
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [geoLoad, setGeoLoad] = useState(false);
  const [err, setErr] = useState("");

  const [hydrated, setHydrated] = useState(false);
  const autoGeoTriedRef = useRef(false);
  const autoFetchedRef = useRef(false);

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

  // Persist the selected location (geo-resolved or manually-picked) so /fog
  // can pick it up on direct navigation. Cleared when the user types a new
  // query — see handleZipInput.
  useEffect(() => {
    if (!selectedLoc) return;
    try {
      localStorage.setItem(LOC_STORAGE_KEY, JSON.stringify({
        latitude: selectedLoc.latitude,
        longitude: selectedLoc.longitude,
        name: selectedLoc.name,
      }));
    } catch {}
  }, [selectedLoc]);

  // User-typed input in the location field. Clears any cached selectedLoc
  // so the submit handler will fresh-geoCode whatever they finished typing.
  const handleZipInput = val => {
    setZip(val);
    if (selectedLoc !== null) setSelectedLoc(null);
  };

  // Fetch the forecast for a given location object and flip to the
  // forecast view. Used by both auto-launch and manual submit.
  const fetchForLoc = async loc => {
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
      setView("settings");
    }
    setLoading(false);
  };

  // Manual 📍 click OR auto-trigger on mount. Populates the location
  // and (when autoFetch is true) chains directly into a forecast fetch
  // so the user lands on the result page without a second click.
  const useGeo = (autoFetch = false) => {
    if (!navigator.geolocation) {
      setErr("Geolocation not supported.");
      if (view === "loading") setView("settings");
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
        if (autoFetch) fetchForLoc(loc);
      },
      () => {
        setErr("Location access denied. Type a city or ZIP to continue.");
        setGeoLoad(false);
        if (view === "loading") setView("settings");
      }
    );
  };

  // Autocomplete pick. Populates the field and caches the loc; user still
  // has to hit Get My Forecast.
  const selectLocation = sug => {
    setZip(`${sug.name}${sug.admin1 ? `, ${sug.admin1}` : ""}`);
    setSelectedLoc(sug);
  };

  // SetupView's submit handler — geocodes the typed text if needed and
  // jumps back to the forecast view with the new data.
  const run = async () => {
    setLoading(true);
    setErr("");
    try {
      const loc = selectedLoc || (await geoCode(zip));
      await fetchForLoc(loc);
    } catch (e) {
      setErr(e.message);
      setLoading(false);
    }
  };

  // ── Auto-launch on mount ─────────────────────────────────────────────
  // Try the stored location first (instant — no permission prompt). If
  // we have one, fetch the forecast immediately. Otherwise fall back to
  // browser geolocation, which then chains into a fetch.
  useEffect(() => {
    if (!hydrated) return;
    if (autoFetchedRef.current) return;
    autoFetchedRef.current = true;

    let stored = null;
    try {
      const raw = localStorage.getItem(LOC_STORAGE_KEY);
      if (raw) stored = JSON.parse(raw);
    } catch {}
    const lat = Number(stored?.latitude);
    const lng = Number(stored?.longitude);
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      const loc = {
        latitude: lat,
        longitude: lng,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        name: stored.name || "Your Location",
        admin1: "",
        country: "",
      };
      setZip(loc.name);
      setSelectedLoc(loc);
      fetchForLoc(loc);
      return;
    }

    // No stored location — try geolocation and chain into a fetch.
    if (autoGeoTriedRef.current) return;
    autoGeoTriedRef.current = true;
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setView("settings");
      return;
    }
    if (navigator.permissions) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then(result => {
          if (result.state === "denied") {
            setView("settings");
          } else {
            useGeo(true);
          }
        })
        .catch(() => useGeo(true));
    } else {
      useGeo(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  return (
    <div className="app">
      <div className="topbar">
        <div>
          <div className="brand-name">Ur<em>4cast</em></div>
          <div className="brand-tag">Business Weather Intelligence</div>
        </div>
        {view === "forecast" && (
          <button
            className="gear-btn"
            onClick={() => setView("settings")}
            aria-label="Settings"
            title="Settings"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
        )}
        {view === "settings" && forecast && (
          <button
            className="edit-btn"
            onClick={() => setView("forecast")}
          >
            ← Back to Forecast
          </button>
        )}
      </div>

      {view === "loading" && (
        <div className="splash">
          <div className="splash-inner">
            <div className="splash-dot" />
            <div className="splash-msg">Fetching your forecast…</div>
          </div>
        </div>
      )}

      {view === "settings" && (
        <SetupView
          zip={zip} setZip={handleZipInput}
          selectedLoc={selectedLoc}
          startH={startH} setStartH={setStartH}
          endH={endH} setEndH={setEndH}
          dayFrom={dayFrom} setDayFrom={setDayFrom}
          dayTo={dayTo} setDayTo={setDayTo}
          thresh={thresh} setThresh={setThresh}
          loading={loading} geoLoad={geoLoad}
          err={err}
          onSubmit={run}
          onGeo={() => useGeo(false)}
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
