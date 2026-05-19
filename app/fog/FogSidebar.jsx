'use client';

// Left rail. Address search (debounced Mapbox geocoder, SF-scoped) +
// the picked-neighborhood result card.

import { useEffect, useRef, useState } from "react";
import { geocodeSuggest } from "./lib/geocode";
import { fogLabel, fogColor } from "./lib/risk";

export default function FogSidebar({
  picked,
  onPickFromAddress,
  dataErr,
  ready,
  contoursAvailable,
  showContours,
  onToggleContours,
}) {
  const [q, setQ] = useState("");
  const [sugs, setSugs] = useState([]);
  const [open, setOpen] = useState(false);
  const [err, setErr] = useState("");
  const debounceRef = useRef(null);
  const blurTimerRef = useRef(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      if (q.trim().length < 3) {
        setSugs([]);
        return;
      }
      try {
        const results = await geocodeSuggest(q);
        setSugs(results);
        setOpen(true);
      } catch (e) {
        setErr(e.message);
      }
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [q]);

  const pick = sug => {
    setQ(sug.place_name);
    setSugs([]);
    setOpen(false);
    setErr("");
    onPickFromAddress(sug.center, sug.place_name);
  };

  const onBlur = () => {
    blurTimerRef.current = setTimeout(() => setOpen(false), 150);
  };
  const onFocus = () => {
    if (blurTimerRef.current) clearTimeout(blurTimerRef.current);
    if (sugs.length) setOpen(true);
  };

  return (
    <aside className="fog-sidebar">
      <header className="fog-h">
        <div className="fog-brand">Summer Fog Map</div>
        <div className="fog-tag">Jun–Aug</div>
      </header>

      <label className="fog-lbl">San Francisco address</label>
      <div className="fog-search">
        <input
          className="fog-input"
          placeholder="1 Dr Carlton B Goodlett Pl…"
          value={q}
          onChange={e => setQ(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          disabled={!ready}
        />
        {open && sugs.length > 0 && (
          <div className="fog-autocomplete">
            {sugs.map(s => (
              <div
                key={s.id}
                className="fog-autocomplete-item"
                onMouseDown={e => {
                  e.preventDefault();
                  pick(s);
                }}
              >
                <div className="fog-ac-name">{s.text}</div>
                <div className="fog-ac-meta">{s.place_name}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {!ready && !dataErr && (
        <div className="fog-note">Loading neighborhood data…</div>
      )}
      {dataErr && <div className="fog-err">⚠ {dataErr}</div>}
      {err && <div className="fog-err">⚠ {err}</div>}

      {picked && <Result picked={picked} />}

      {!picked && ready && (
        <div className="fog-empty">
          Search for an address above, or click a neighborhood on the map.
        </div>
      )}

      {contoursAvailable && (
        <label className="fog-toggle">
          <input
            type="checkbox"
            checked={showContours}
            onChange={e => onToggleContours(e.target.checked)}
          />
          <span className="fog-toggle-label">Show raw fog contours</span>
          <span className="fog-toggle-help">
            Overlay the original USGS GOES isolines on top of the neighborhoods.
          </span>
        </label>
      )}

      <footer className="fog-footer">
        <div>
          Fog data: USGS GOES summertime fog &amp; low-cloud indices, 1999–2009
          (Torregrosa et al., 2016). Neighborhood boundaries: DataSF.
        </div>
      </footer>
    </aside>
  );
}

function Result({ picked }) {
  const f = picked.feature;
  if (!f) {
    return (
      <div className="fog-result fog-result-miss">
        <div className="fog-result-h">Outside SF coverage</div>
        <div className="fog-result-sub">{picked.address}</div>
        <p>This address doesn&apos;t fall inside any indexed SF neighborhood.</p>
      </div>
    );
  }
  const hours = f.properties.fogHours;
  return (
    <div className="fog-result">
      <div className="fog-result-h">{f.properties.name}</div>
      {picked.address && (
        <div className="fog-result-sub">{picked.address}</div>
      )}
      <div className="fog-result-score" style={{ background: fogColor(hours) }}>
        <div className="fog-score-num">{hours.toFixed(1)}</div>
        <div className="fog-score-unit">avg summer fog hrs / day</div>
      </div>
      <div className="fog-result-label">{fogLabel(hours)}</div>
    </div>
  );
}
