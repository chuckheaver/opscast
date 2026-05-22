// Setup screen: location input (with autocomplete), hours, day range,
// primary metric cards, collapsible advanced metric grid, submit.
// All shared state is owned by page.js and passed in via props.

import { useState, useEffect, useRef } from "react";
import MetricCard from "./MetricCard";
import AdvancedCard from "./AdvancedCard";
import { PRIMARY, ADVANCED } from "../lib/thresholds";
import { fmtHrFull, dayLabel } from "../lib/formatting";
import { geoSuggest } from "../lib/weather-api";

// Build /fog URLs that forward the selected address (so the map pins
// it without re-prompting) plus a `preset` flag that tells FogApp
// which layer toggles to start on. The presets keep "Neighborhoods"
// always on and layer the rest as labelled in the icon row.
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

const HOURS_24 = Array.from({ length: 24 }, (_, i) => i);
const DAY_INDEXES = [0, 1, 2, 3, 4];

export default function SetupView({
  zip, setZip,
  selectedLoc,
  startH, setStartH,
  endH, setEndH,
  dayFrom, setDayFrom,
  dayTo, setDayTo,
  thresh, setThresh,
  loading, geoLoad,
  err,
  onSubmit, onGeo, onSelectLocation,
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Autocomplete state
  const [suggestions, setSuggestions] = useState([]);
  const [showSugg, setShowSugg] = useState(false);
  const [focused, setFocused] = useState(false);
  const debounceRef = useRef(null);
  const blurTimerRef = useRef(null);

  // Debounced location autocomplete: 300 ms after user stops typing.
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!focused || zip.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      const results = await geoSuggest(zip);
      setSuggestions(results);
      setShowSugg(true);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [zip, focused]);

  const pickSuggestion = sug => {
    setShowSugg(false);
    setSuggestions([]);
    setFocused(false);
    onSelectLocation(sug);
  };

  const handleBlur = () => {
    // Delay hiding so clicks on suggestions land before dismissal.
    blurTimerRef.current = setTimeout(() => {
      setShowSugg(false);
      setFocused(false);
    }, 150);
  };

  const handleFocus = () => {
    if (blurTimerRef.current) clearTimeout(blurTimerRef.current);
    setFocused(true);
    if (suggestions.length) setShowSugg(true);
  };

  return (
    <div className="setup">
      <div className="page-h">
        Tell me about your<br />
        <em>Micro Life</em>,
      </div>
      <div className="micro-icons">
        <a className="micro-icon-item" href="#setup-form">
          <span className="micro-icon" aria-hidden="true">🌤️</span>
          <span className="micro-icon-label">Weather</span>
        </a>
        <a className="micro-icon-item" href={buildFogUrl(selectedLoc, "housing")}>
          <span className="micro-icon" aria-hidden="true">🏡</span>
          <span className="micro-icon-label">Housing</span>
        </a>
        <a className="micro-icon-item" href={buildFogUrl(selectedLoc, "fog")}>
          <span className="micro-icon" aria-hidden="true">🌁</span>
          <span className="micro-icon-label">Summer Fog</span>
        </a>
        <a className="micro-icon-item" href={buildFogUrl(selectedLoc, "muni")}>
          <span className="micro-icon" aria-hidden="true">🚃</span>
          <span className="micro-icon-label">Transit</span>
        </a>
        <a className="micro-icon-item" href={buildFogUrl(selectedLoc, "bikes")}>
          <span className="micro-icon" aria-hidden="true">🚲</span>
          <span className="micro-icon-label">Bike Paths</span>
        </a>
        <a className="micro-icon-item" href={buildFogUrl(selectedLoc, "zips")}>
          <span className="micro-icon" aria-hidden="true">📭</span>
          <span className="micro-icon-label">Postal</span>
        </a>
      </div>
      <div className="page-sub">
        Set your ideal conditions, Pick your dates/times. I'll tell you when to worry!
      </div>

      <div id="setup-form" className="field-lbl">Location</div>
      <div className="loc-row" style={{ position: "relative" }}>
        <input
          className="zip-inp"
          placeholder="ZIP code or city name…"
          value={zip}
          onChange={e => setZip(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={e => e.key === "Enter" && !loading && onSubmit()}
        />
        <button
          className="geo-btn"
          onClick={onGeo}
          disabled={geoLoad || loading}
        >
          {geoLoad ? "⏳" : "📍"}
        </button>
        {showSugg && suggestions.length > 0 && (
          <div className="autocomplete">
            {suggestions.map((s, i) => (
              <div
                key={`${s.latitude},${s.longitude},${i}`}
                className="autocomplete-item"
                // onMouseDown fires before onBlur, so the click registers.
                onMouseDown={e => {
                  e.preventDefault();
                  pickSuggestion(s);
                }}
              >
                <span className="ac-name">{s.name}</span>
                <span className="ac-meta">
                  {[s.admin1, s.country].filter(Boolean).join(", ")}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="field-lbl">Period to Forecast</div>
      <div className="sel-row">
        <select
          className="sel-box"
          value={startH}
          onChange={e => setStartH(+e.target.value)}
        >
          {HOURS_24.map(h => (
            <option key={h} value={h}>{fmtHrFull(h)}</option>
          ))}
        </select>
        <span style={{ color: "#78716c", fontFamily: "'DM Sans',sans-serif" }}>→</span>
        <select
          className="sel-box"
          value={endH}
          onChange={e => setEndH(+e.target.value)}
        >
          {HOURS_24.map(h => (
            <option key={h} value={h}>{fmtHrFull(h)}</option>
          ))}
        </select>
        {endH > startH && (
          <span className="sel-note">{endH - startH}h / day</span>
        )}
      </div>

      <div className="field-lbl">Day Range to Forecast</div>
      <div className="sel-row" style={{ marginBottom: 32 }}>
        <select
          className="sel-box"
          value={dayFrom}
          onChange={e => {
            const v = +e.target.value;
            setDayFrom(v);
            if (v > dayTo) setDayTo(v);
          }}
        >
          {DAY_INDEXES.map(i => (
            <option key={i} value={i}>{dayLabel(i)}</option>
          ))}
        </select>
        <span style={{ color: "#78716c", fontFamily: "'DM Sans',sans-serif" }}>through</span>
        <select
          className="sel-box"
          value={dayTo}
          onChange={e => {
            const v = +e.target.value;
            setDayTo(v);
            if (v < dayFrom) setDayFrom(v);
          }}
        >
          {DAY_INDEXES.map(i => (
            <option key={i} value={i} disabled={i < dayFrom}>{dayLabel(i)}</option>
          ))}
        </select>
        <span className="sel-note">
          {dayTo - dayFrom + 1} day{dayTo - dayFrom > 0 ? "s" : ""} shown
        </span>
      </div>

      <div className="field-lbl">Tell Me Your Ideal Conditions</div>
      {PRIMARY.map(m => (
        <MetricCard
          key={m.key}
          metric={m}
          threshCfg={thresh[m.key]}
          setThresh={setThresh}
        />
      ))}

      <div className="adv-toggle" onClick={() => setShowAdvanced(v => !v)}>
        <div className="adv-line" />
        <button className="adv-btn">
          {showAdvanced ? "▲ Hide" : "▼ Show"} Advanced Metrics
        </button>
        <div className="adv-line" />
      </div>
      {showAdvanced && (
        <div className="adv-grid">
          {ADVANCED.map(m => (
            <AdvancedCard
              key={m.key}
              metric={m}
              threshCfg={thresh[m.key]}
              setThresh={setThresh}
            />
          ))}
        </div>
      )}

      <button
        className="submit-btn"
        onClick={onSubmit}
        disabled={loading || geoLoad || !zip.trim()}
      >
        {loading ? "Fetching Forecast…" : "Get My Forecast →"}
      </button>
      {err && <div className="err-box">⚠ {err}</div>}
    </div>
  );
}
