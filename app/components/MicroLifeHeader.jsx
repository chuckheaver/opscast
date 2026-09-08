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
        What&apos;s Your SF <em>Micro-Life?</em>
      </div>
      <div className="micro-icons">
        <a className="micro-icon-item" href="#setup-form">
          <span className="micro-icon" aria-hidden="true">🌤️</span>
          <span className="micro-icon-label">Weather</span>
        </a>
        <a className="micro-icon-item" href={buildFogUrl(selectedLoc, "hoods")}>
          <span className="micro-icon" aria-hidden="true">🏡</span>
          <span className="micro-icon-label">Hoods</span>
        </a>
        <a className="micro-icon-item" href={buildFogUrl(selectedLoc, "fog")}>
          <span className="micro-icon" aria-hidden="true">🌁</span>
          <span className="micro-icon-label">Fog Map</span>
        </a>
        <a className="micro-icon-item" href={buildFogUrl(selectedLoc, "transit")}>
          <span className="micro-icon" aria-hidden="true">🚃</span>
          <span className="micro-icon-label">Transit</span>
        </a>
        <a className="micro-icon-item" href={buildFogUrl(selectedLoc, "bikes")}>
          <span className="micro-icon" aria-hidden="true">🚲</span>
          <span className="micro-icon-label">Bike Paths</span>
        </a>
        <a className="micro-icon-item" href={buildFogUrl(selectedLoc, "districts")}>
          <span className="micro-icon" aria-hidden="true">📭</span>
          <span className="micro-icon-label">Districts</span>
        </a>
      </div>
      <div className="page-sub">
        Set Your Ideal Weather and Times Here
        {onOpenSettings && (
          <button
            type="button"
            className="gear-btn gear-btn-inline"
            onClick={onOpenSettings}
            aria-label="Settings"
            title="Settings"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#ea580c"
                d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm9.43 4.92l-2.05-1.16a7.6 7.6 0 0 0 0-2.52l2.05-1.16a.5.5 0 0 0 .2-.62l-1.94-3.36a.5.5 0 0 0-.6-.23l-2.4.84a7.5 7.5 0 0 0-2.18-1.26l-.36-2.53a.5.5 0 0 0-.5-.42h-3.88a.5.5 0 0 0-.5.42l-.36 2.53a7.5 7.5 0 0 0-2.18 1.26l-2.4-.84a.5.5 0 0 0-.6.23L2.32 7.96a.5.5 0 0 0 .2.62l2.05 1.16a7.6 7.6 0 0 0 0 2.52L2.52 13.42a.5.5 0 0 0-.2.62l1.94 3.36c.13.22.4.32.6.23l2.4-.84a7.5 7.5 0 0 0 2.18 1.26l.36 2.53c.04.24.25.42.5.42h3.88a.5.5 0 0 0 .5-.42l.36-2.53a7.5 7.5 0 0 0 2.18-1.26l2.4.84a.5.5 0 0 0 .6-.23l1.94-3.36a.5.5 0 0 0-.2-.62z"
              />
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
            onChange={e => {
              // Typing always re-opens the lookup and starts fresh, even
              // right after a pick (the field keeps DOM focus through the
              // mousedown-select, so onFocus never re-fires on its own).
              if (!focused) setFocused(true);
              setZip(e.target.value);
            }}
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
