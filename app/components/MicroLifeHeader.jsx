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
          onKeyDown={e => e.key === "Enter" && !loading && onSubmit && onSubmit()}
        />
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
                <span className="ac-name">{s.name}</span>
                <span className="ac-meta">
                  {[s.admin1, s.country].filter(Boolean).join(", ")}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
