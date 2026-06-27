'use client';

// Reusable location search: Mapbox-backed address autocomplete + a 📍
// current-location button. Extracted from the old top bar so it can live
// inside the on-map "Location" dropdown (and anywhere else that needs it).

import { useEffect, useRef, useState } from "react";
import { geocodeSuggest as defaultSuggest } from "./lib/geocode";

export default function FogLocationSearch({
  onPickFromAddress,
  onUseGeoLocation,
  ready,
  geoLoading,
  picked,
  autoFocus,
  showGeoButton = true,
  // Geocoder to use — defaults to the SF-biased fog one; pass a different
  // `suggest(query)` (e.g. the wine-country geocoder) to reuse this UI.
  suggest = defaultSuggest,
}) {
  const [q, setQ] = useState("");
  const [sugs, setSugs] = useState([]);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef(null);
  const blurTimerRef = useRef(null);
  const inputRef = useRef(null);
  // Set immediately before we programmatically change `q` (a pick, or the
  // picked-address seed below) so the suggest effect skips the refetch that
  // would otherwise re-open the dropdown over the just-confirmed selection.
  const suppressNextFetchRef = useRef(false);

  useEffect(() => {
    if (autoFocus && inputRef.current) inputRef.current.focus();
  }, [autoFocus]);

  // Seed the input with whatever address is currently picked so the user sees
  // "where they are" without having to click anything.
  useEffect(() => {
    if (picked?.address) {
      suppressNextFetchRef.current = true;
      setQ(picked.address);
    }
  }, [picked?.address]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (suppressNextFetchRef.current) {
      suppressNextFetchRef.current = false;
      setSugs([]);
      setOpen(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      if (q.trim().length < 3) { setSugs([]); return; }
      try {
        const results = await suggest(q);
        setSugs(results);
        setOpen(true);
      } catch {}
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [q, suggest]);

  const pick = sug => {
    const display = sug.label || sug.place_name;
    suppressNextFetchRef.current = true;
    setQ(display);
    setSugs([]);
    setOpen(false);
    onPickFromAddress(sug.center, display);
  };

  return (
    <div className="fog-topbar-search">
      <div className="zip-wrap">
        <input
          ref={inputRef}
          className="fog-input"
          placeholder="Address, ZIP code, or city…"
          value={q}
          onChange={e => setQ(e.target.value)}
          onFocus={() => { if (blurTimerRef.current) clearTimeout(blurTimerRef.current); if (sugs.length) setOpen(true); }}
          onBlur={() => { blurTimerRef.current = setTimeout(() => setOpen(false), 150); }}
          disabled={!ready}
        />
        {q && (
          <button
            type="button"
            className="clear-btn"
            onMouseDown={e => e.preventDefault()}
            onClick={() => { setQ(""); setSugs([]); setOpen(false); }}
            aria-label="Clear location"
            title="Clear"
          >
            ×
          </button>
        )}
      </div>
      {showGeoButton && (
        <button
          type="button"
          className="fog-geo-btn"
          onClick={onUseGeoLocation}
          disabled={geoLoading || !ready}
          title="Use my current location"
        >
          {geoLoading ? "⏳" : "📍"}
        </button>
      )}
      {open && sugs.length > 0 && (
        <div className="fog-autocomplete">
          {sugs.map(s => (
            <div
              key={s.id}
              className="fog-autocomplete-item"
              onMouseDown={e => { e.preventDefault(); pick(s); }}
            >
              <div className="fog-ac-name">{s.label || s.text}</div>
              {s.place_name && s.place_name !== (s.label || s.text) && (
                <div className="fog-ac-meta">{s.place_name}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
