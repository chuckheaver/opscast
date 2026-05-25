// Shared top section used on both the front (forecast) page and the
// gear-accessed settings page. Owns:
//   - the "Tell me about your Micro Life," heading
//   - the six facet icons (Weather / Housing / Summer Fog / Transit /
//     Bike Paths / Postal) with their /fog?preset=… or "#setup-form"
//     destinations
//   - the muted call-to-action subhead
//   - the Location input with autocomplete + 📍 geo button
//
// Stateless apart from the autocomplete UI (suggestions/show/focus);
// everything else (zip text, selected location, loading flags) is
// driven by props so the parent decides what each interaction does
// (e.g. front-page picks auto-refetch the forecast, settings-page
// picks wait for the explicit Submit click).

import { useState, useEffect, useRef } from "react";
import { geoSuggest } from "../lib/weather-api";

// Bias autocomplete toward the user's picked location; fall back to the
// SF city center so the very first keystroke still surfaces local hits.
const SF_CENTER = [-122.4194, 37.7749];

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

export default function MicroLifeHeader({
  zip, setZip,
  selectedLoc,
  loading, geoLoad,
  onSubmit, onGeo, onSelectLocation,
  // When provided, renders a ⚙ gear button inline next to "Micro Life"
  // that opens the settings page. Omitted on the settings page itself
  // (where it would be redundant).
  onOpenSettings,
}) {
  const [suggestions, setSuggestions] = useState([]);
  const [showSugg, setShowSugg] = useState(false);
  const [focused, setFocused] = useState(false);
  const debounceRef = useRef(null);
  const blurTimerRef = useRef(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!focused || zip.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    const proximity =
      selectedLoc?.longitude != null && selectedLoc?.latitude != null
        ? [selectedLoc.longitude, selectedLoc.latitude]
        : SF_CENTER;
    debounceRef.current = setTimeout(async () => {
      const results = await geoSuggest(zip, proximity);
      setSuggestions(results);
      setShowSugg(true);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [zip, focused, selectedLoc]);

  const pickSuggestion = sug => {
    setShowSugg(false);
    setSuggestions([]);
    setFocused(false);
    onSelectLocation(sug);
  };

  const handleBlur = () => {
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
    <div className="ml-header">
      <div className="page-h">
        What&apos;s Your SF<br />
        <em>Micro-Life?</em>
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
        Set your ideal conditions once, pick your typical dates/times, and I&apos;ll tell you when you need to worry!
        {onOpenSettings && (
          <button
            type="button"
            className="gear-btn gear-btn-inline"
            onClick={onOpenSettings}
            aria-label="Settings"
            title="Settings"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
        )}
      </div>

      <div id="setup-form" className="field-lbl">Location</div>
      <div className="loc-row" style={{ position: "relative" }}>
        <div className="zip-wrap">
          <input
            className="zip-inp"
            placeholder="Address, ZIP code, or city…"
            value={zip}
            onChange={e => setZip(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={e => e.key === "Enter" && !loading && onSubmit && onSubmit()}
          />
          {zip && (
            <button
              type="button"
              className="clear-btn"
              onMouseDown={e => e.preventDefault()}
              onClick={() => { setZip(""); setSuggestions([]); setShowSugg(false); }}
              aria-label="Clear location"
              title="Clear"
            >
              ×
            </button>
          )}
        </div>
        <button
          className="geo-btn"
          onClick={onGeo}
          disabled={geoLoad || loading}
          aria-label="Use my current location"
          title="Use my current location"
        >
          {geoLoad ? "⏳" : "📍"}
        </button>
        {showSugg && suggestions.length > 0 && (
          <div className="autocomplete">
            {suggestions.map((s, i) => (
              <div
                key={`${s.latitude},${s.longitude},${i}`}
                className="autocomplete-item"
                onMouseDown={e => {
                  e.preventDefault();
                  pickSuggestion(s);
                }}
              >
                <span className="ac-name">{s.label || s.name}</span>
                {s.place_name && s.place_name !== (s.label || s.name) && (
                  <span className="ac-meta">{s.place_name}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
