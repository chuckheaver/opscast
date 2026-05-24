'use client';

// Left rail for the micro-climate map: address search, the three sub-zone
// toggles + legend, and a result card. Reuses the /fog sidebar styling.

import { useEffect, useRef, useState } from "react";
import { geocodeSuggest } from "../fog/lib/geocode";

const ZONES = [
  ["☀️", "#f59e0b", "Sun Pockets", "20–30° SE/S/SW-facing inclines — the warmest, sunniest slopes."],
  ["❄️", "#38bdf8", "Cool / Shade", "North-facing inclines — far less direct sun, so cooler."],
  ["🌬️", "#2dd4bf", "Wind Corridors", "Valley floors & gaps that funnel and accelerate wind."],
  ["🌫️", "#64748b", "Fog Path & Bands", "Graduated grey by fog density: darkest in the ≤200 ft path fog floods through, lightening up the slopes (200–350, 350–500, 500–1000 ft) as fog thins."],
];

function ToggleSwitch({ checked, onChange, label, help }) {
  return (
    <label className="fog-switch">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
      <span className="fog-switch-track" aria-hidden="true">
        <span className="fog-switch-knob" />
      </span>
      <span className="fog-switch-copy">
        <span className="fog-switch-label">{label}</span>
        {help && <span className="fog-switch-help">{help}</span>}
      </span>
    </label>
  );
}

export default function MicroSidebar({
  picked,
  onPickFromAddress,
  dataErr,
  ready,
  showSun, onToggleSun,
  showCool, onToggleCool,
  showWind, onToggleWind,
  showFog, onToggleFog,
  showContours, onToggleContours,
  showFogLine, onToggleFogLine,
  showNeighborhoods, onToggleNeighborhoods,
  onUseGeoLocation,
  geoLoading,
  geoErr,
}) {
  const [q, setQ] = useState("");
  const [sugs, setSugs] = useState([]);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef(null);
  const blurTimerRef = useRef(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      if (q.trim().length < 3) { setSugs([]); return; }
      try {
        const results = await geocodeSuggest(q);
        setSugs(results);
        setOpen(true);
      } catch {}
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [q]);

  const pick = sug => {
    setQ(sug.place_name);
    setSugs([]);
    setOpen(false);
    onPickFromAddress(sug.center, sug.place_name);
  };

  return (
    <aside className="fog-sidebar">
      <header className="fog-h">
        <div className="fog-brand-row">
          <h1 className="fog-brand">
            Micro<em>Climate</em> Zones
          </h1>
        </div>
        <div className="fog-note">
          Terrain-derived sub-zones for SF, computed from a 10&nbsp;m elevation
          model: sun pockets, wind corridors &amp; persistent-fog ridges.
        </div>
      </header>

      <label className="fog-lbl">Location</label>
      <div className="fog-search">
        <div className="fog-search-row">
          <input
            className="fog-input"
            placeholder="Search an address…"
            value={q}
            onChange={e => setQ(e.target.value)}
            onFocus={() => { if (blurTimerRef.current) clearTimeout(blurTimerRef.current); if (sugs.length) setOpen(true); }}
            onBlur={() => { blurTimerRef.current = setTimeout(() => setOpen(false), 150); }}
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
                onMouseDown={e => { e.preventDefault(); pick(s); }}
              >
                <div className="fog-ac-name">{s.text}</div>
                <div className="fog-ac-meta">{s.place_name}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      {geoErr && <div className="fog-note" style={{ color: "#fca5a5" }}>{geoErr}</div>}
      {dataErr && <div className="fog-note" style={{ color: "#fca5a5" }}>Data error: {dataErr}</div>}
      {picked?.address && (
        <div className="fog-legend" style={{ marginTop: 2 }}>
          <div className="fog-legend-title">Marked location</div>
          <div className="fog-ac-name">{picked.address}</div>
        </div>
      )}

      <div className="fog-legend">
        <div className="fog-legend-title">Sub-Climate Zones</div>
        <div className="fog-legend-rows">
          {ZONES.map(([emoji, color, name, desc]) => (
            <div key={name} className="fog-legend-row" style={{ gridTemplateColumns: "24px 1fr" }}>
              <span className="fog-legend-emoji">{emoji}</span>
              <span>
                <span className="fog-legend-label" style={{ color }}>{name}</span>
                <span className="fog-legend-range" style={{ display: "block" }}>{desc}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <ToggleSwitch checked={showSun} onChange={onToggleSun} label="Sun pockets" help="20–30° south-facing warm slopes." />
      <ToggleSwitch checked={showCool} onChange={onToggleCool} label="Cool / shade" help="North-facing cooler slopes." />
      <ToggleSwitch checked={showWind} onChange={onToggleWind} label="Wind corridors" help="Wind-channeling valleys." />
      <ToggleSwitch checked={showFog} onChange={onToggleFog} label="Fog path & bands" help="Grey by density: dense in the lows, thinning up the slopes." />
      <ToggleSwitch checked={showContours} onChange={onToggleContours} label="Elevation contours" help="Topographic relief lines (ft)." />
      <ToggleSwitch checked={showFogLine} onChange={onToggleFogLine} label="Fog inversion line" help="≈500 ft — the usual eastern limit of marine fog." />
      <ToggleSwitch checked={showNeighborhoods} onChange={onToggleNeighborhoods} label="Neighborhoods" help="SF outlines + name labels." />

      <div className="fog-note" style={{ marginTop: "auto", opacity: 0.7 }}>
        Zones are modeled from elevation (slope, aspect, valley position),
        not live observations — a guide to where each microclimate tends to sit.
      </div>
    </aside>
  );
}
