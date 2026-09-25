'use client';

// Reusable location search: Mapbox-backed address autocomplete + a 📍
// current-location button. Extracted from the old top bar so it can live
// inside the on-map "Location" dropdown (and anywhere else that needs it).

import { useEffect, useRef, useState } from "react";
import { geocodeSuggest as defaultSuggest } from "./lib/geocode";
import { readRecents, pushRecent } from "./lib/recent";

export default function FogLocationSearch({
  onPickFromAddress,
  // Called when the field is emptied via the (×). The app uses this to drop
  // the blue marker — the marker otherwise stays put through panning,
  // layer toggles and closing the info sheet.
  onClear,
  onUseGeoLocation,
  ready,
  geoLoading,
  picked,
  autoFocus,
  showGeoButton = true,
  // Geocoder to use — defaults to the SF-biased fog one; pass a different
  // `suggest(query)` (e.g. the wine-country geocoder) to reuse this UI.
  suggest = defaultSuggest,
  placeholder = "Where do you wanna go?",
}) {
  const [q, setQ] = useState("");
  const [sugs, setSugs] = useState([]);
  const [open, setOpen] = useState(false);
  // The last few picks, offered as soon as the field is focused and empty.
  // Read on mount rather than at module scope so the server render and the
  // first client render agree.
  const [recents, setRecents] = useState([]);
  useEffect(() => { setRecents(readRecents()); }, []);
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
  // Tracks the address the field is currently showing, so a pin that goes
  // away (Reset view, say) empties the field too — without wiping what the
  // user is part-way through typing, which is also an "no address" state.
  const shownAddrRef = useRef(null);
  useEffect(() => {
    const addr = picked?.address || null;
    if (addr) {
      suppressNextFetchRef.current = true;
      setQ(addr);
    } else if (shownAddrRef.current) {
      suppressNextFetchRef.current = true;
      setQ("");
    }
    shownAddrRef.current = addr;
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

  const offerRecents = () => {
    if (blurTimerRef.current) clearTimeout(blurTimerRef.current);
    if (sugs.length || (q.trim().length < 3 && recents.length)) setOpen(true);
  };

  const pick = sug => {
    const display = sug.label || sug.place_name;
    suppressNextFetchRef.current = true;
    setQ(display);
    setSugs([]);
    setOpen(false);
    setRecents(pushRecent(display, sug.center));
    onPickFromAddress(sug.center, display);
  };

  return (
    <div className="fog-topbar-search">
      <div className="zip-wrap">
        <input
          ref={inputRef}
          className="fog-input"
          placeholder={placeholder}
          value={q}
          onChange={e => setQ(e.target.value)}
          onFocus={offerRecents}
          onClick={offerRecents}
          onBlur={() => { blurTimerRef.current = setTimeout(() => setOpen(false), 150); }}
          disabled={!ready}
        />
        {q && (
          <button
            type="button"
            className="clear-btn"
            onMouseDown={e => e.preventDefault()}
            onClick={() => {
            setQ(""); setSugs([]);
            onClear?.();
            inputRef.current?.focus();
            // Straight from "cleared" to the recent list, so the next trip is
            // one tap rather than retyping an address just visited.
            setOpen(recents.length > 0);
          }}
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
      {open && sugs.length === 0 && q.trim().length < 3 && recents.length > 0 && (
        <div className="fog-autocomplete">
          <div className="fog-ac-head">Recent searches</div>
          {recents.map(r => (
            <div
              key={r.label}
              className="fog-autocomplete-item"
              onMouseDown={e => { e.preventDefault(); pick({ label: r.label, center: r.center }); }}
            >
              <div className="fog-ac-name">
                <span className="fog-ac-clock" aria-hidden="true">🕘</span>
                {r.label}
              </div>
            </div>
          ))}
        </div>
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
