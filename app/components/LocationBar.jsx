// Location input with autocomplete + 📍 geo button. Extracted from
// MicroLifeHeader so it can be shared by the home hub (app/page.js) and
// the weather sub-page (app/weather). Stateless apart from the
// autocomplete UI (suggestions/show/focus); everything else is driven by
// props so each caller decides what a pick / submit does.

import { useState, useEffect, useRef } from "react";
import { geoSuggest } from "../lib/weather-api";

// Bias autocomplete toward the user's picked location; fall back to the
// SF city center so the very first keystroke still surfaces local hits.
const SF_CENTER = [-122.4194, 37.7749];

export default function LocationBar({
  zip, setZip,
  selectedLoc,
  loading, geoLoad,
  onSubmit, onGeo, onSelectLocation,
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
    <>
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
    </>
  );
}
