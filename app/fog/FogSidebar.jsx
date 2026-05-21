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
  showTerrain,
  onToggleTerrain,
  showSeismic,
  onToggleSeismic,
  showMuni,
  onToggleMuni,
  onUseGeoLocation,
  geoLoading,
  geoErr,
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
        <div className="fog-brand-row">
          <FogWaveGlyph />
          <h1 className="fog-brand">
            Summer <em>Fog</em> Map
          </h1>
        </div>
        <div className="fog-tag">Jun–Aug</div>
        <div className="fog-note">
          *Satellite historic driven data of the average hrs per day that a specific location receives fog.
        </div>
      </header>

      <label className="fog-lbl">Location</label>
      <div className="fog-search">
        <div className="fog-search-row">
          <input
            className="fog-input"
            placeholder="1 Dr Carlton B Goodlett Pl…"
            value={q}
            onChange={e => setQ(e.target.value)}
            onFocus={onFocus}
            onBlur={onBlur}
            disabled={!ready}
          />
          <button
            type="button"
            className="fog-geo-btn"
            onClick={onUseGeoLocation}
            disabled={geoLoading || !ready}
            title="Use my current location"
          >
            {geoLoading ? "⏳" : "📍"}
          </button>
        </div>
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

      <Legend />

      {!ready && !dataErr && (
        <div className="fog-note">Loading neighborhood data…</div>
      )}
      {dataErr && <div className="fog-err">⚠ {dataErr}</div>}
      {err && <div className="fog-err">⚠ {err}</div>}
      {geoErr && <div className="fog-err">⚠ {geoErr}</div>}

      {picked && <Result picked={picked} />}

      {!picked && ready && (
        <div className="fog-empty">
          Search for an address above, or click a neighborhood on the map.
        </div>
      )}

      {contoursAvailable && (
        <ToggleSwitch
          checked={showContours}
          onChange={onToggleContours}
          label="Fog data"
          help="Colored USGS fog contour layer. Off reveals just the neighborhood outlines."
        />
      )}

      <ToggleSwitch
        checked={showTerrain}
        onChange={onToggleTerrain}
        label="Terrain & peaks"
        help="Hillshade overlay + labelled peaks (Mt Tam, Twin Peaks, San Bruno Mtn)."
      />

      <ToggleSwitch
        checked={showSeismic}
        onChange={onToggleSeismic}
        label="Seismic hazard zones"
        help="CA Geological Survey liquefaction + landslide zones (via DataSF)."
      />

      <ToggleSwitch
        checked={showMuni}
        onChange={onToggleMuni}
        label="Muni stops"
        help="All SFMTA Muni stops (~3,260 points). Stop names appear when you zoom in past street level."
      />


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
  const contourHours = picked.contour?.properties?.hours;
  const neighborhoodHours = f?.properties?.fogHours;

  // No neighborhood AND no contour — totally outside coverage.
  if (!f && contourHours == null) {
    return (
      <div className="fog-result fog-result-miss">
        <div className="fog-result-h">Outside coverage</div>
        <div className="fog-result-sub">{picked.address}</div>
        <p>This point falls outside the Bay Area fog dataset.</p>
      </div>
    );
  }

  // Inside the Bay Area contours but outside the SF neighborhood layer.
  // Still show the fog value — just without the neighborhood-average sidebar.
  if (!f) {
    return (
      <div className="fog-result">
        <div className="fog-result-score" style={{ background: fogColor(contourHours) }}>
          <div className="fog-score-num"><CountUp value={contourHours} /></div>
          <div className="fog-score-unit">summer fog hrs / day · at this point</div>
        </div>
        <div className="fog-result-zone">
          <span className="fog-result-zone-prefix">Microclimate Zone —</span>
          <span className="fog-result-zone-value">{fogLabel(contourHours)}</span>
        </div>
        <div className="fog-result-h">Outside SF</div>
        {picked.address && (
          <div className="fog-result-sub">{picked.address}</div>
        )}
      </div>
    );
  }

  // Inside SF — prefer the point-specific contour value over the
  // neighborhood average, but show both when they differ.
  const primary = contourHours ?? neighborhoodHours;
  const source = contourHours != null ? "at this point" : "neighborhood avg";
  return (
    <div className="fog-result">
      <div className="fog-result-score" style={{ background: fogColor(primary) }}>
        <div className="fog-score-num"><CountUp value={primary} /></div>
        <div className="fog-score-unit">summer fog hrs / day · {source}</div>
      </div>
      <div className="fog-result-zone">
        <span className="fog-result-zone-prefix">Microclimate Zone —</span>
        <span className="fog-result-zone-value">{fogLabel(primary)}</span>
      </div>
      <div className="fog-result-h">{f.properties.name}</div>
      {picked.address && (
        <div className="fog-result-sub">{picked.address}</div>
      )}
      {contourHours != null && contourHours !== neighborhoodHours && (
        <div className="fog-result-aux">
          Neighborhood avg: {neighborhoodHours.toFixed(1)} hrs / day
        </div>
      )}
    </div>
  );
}

// Microclimates legend — three bands matching the fog map's coloring.
// Each row is a colored swatch (the actual polygon fill colour) with the
// matching weather emoji inside, plus the hour range and label.
function Legend() {
  return (
    <div className="fog-legend">
      <div className="fog-legend-title">Microclimates · Fog Hours</div>
      <div className="fog-legend-rows">
        <LegendRow emoji="☀️"  range="≤ 8 hrs" label="Sun" />
        <LegendRow emoji="🌤️" range="8.5 hrs" label="Transition" />
        <LegendRow emoji="☁️"  range="≥ 9 hrs" label="Fog" />
      </div>
    </div>
  );
}

function LegendRow({ emoji, range, label }) {
  return (
    <div className="fog-legend-row">
      <span className="fog-legend-emoji" aria-hidden="true">{emoji}</span>
      <span className="fog-legend-range">{range}</span>
      <span className="fog-legend-label">{label}</span>
    </div>
  );
}

// Three stacked wavy lines — the universal fog/mist weather symbol,
// rendered with a subtle yellow→slate gradient that mirrors the
// Summer→Fog colour story.
function FogWaveGlyph() {
  return (
    <svg
      width="32"
      height="22"
      viewBox="0 0 32 22"
      fill="none"
      aria-hidden="true"
      className="fog-wave"
    >
      <defs>
        <linearGradient id="fog-wave-grad" x1="0" y1="0" x2="32" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fbbf24" />
          <stop offset="1" stopColor="#52525b" />
        </linearGradient>
      </defs>
      <g stroke="url(#fog-wave-grad)" strokeWidth="2" strokeLinecap="round" fill="none">
        <path d="M 2 5 Q 8 1 14 5 T 26 5 H 30" />
        <path d="M 1 11 Q 7 7 13 11 T 25 11 H 31" />
        <path d="M 3 17 Q 9 13 15 17 T 27 17 H 30" />
      </g>
    </svg>
  );
}

// iOS-style toggle switch. Hidden native checkbox keeps the label/keyboard
// behaviour while the sibling span draws the pill + knob.
function ToggleSwitch({ checked, onChange, label, help }) {
  return (
    <label className="fog-switch">
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
      />
      <span className="fog-switch-track" aria-hidden="true">
        <span className="fog-switch-knob" />
      </span>
      <span className="fog-switch-copy">
        <span className="fog-switch-label">{label}</span>
        <span className="fog-switch-help">{help}</span>
      </span>
    </label>
  );
}

// Animated count-up from 0 → value (eased), runs whenever `value` changes.
// 1-decimal output matches the rest of the score card formatting.
function CountUp({ value, duration = 700 }) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (value == null || !Number.isFinite(value)) return;
    let start;
    let raf;
    const step = ts => {
      if (!start) start = ts;
      const t = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setShown(value * eased);
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return shown.toFixed(1);
}
