'use client';

// On-map controls for the Microclimates map, matching the fog/wine maps
// (Google-Maps style): a "Search here" bar across the top, a round Layers
// button top-right whose panel groups the toggles (with a "Microclimate Zones"
// section), and a round "find me" arrow bottom-right. Reuses the fog control
// CSS (.fog-search, .fog-fab, .fog-float-panel, .fog-layers-panel, …).

import { useState, useRef, useEffect } from "react";
import FogLocationSearch from "../fog/FogLocationSearch";

const SEASONS = [
  { key: "annual", label: "Annual" },
  { key: "winter", label: "Winter" },
  { key: "equinox", label: "Spring / Fall" },
  { key: "summer", label: "Summer" },
];

export default function MicroMapTools({
  showSun, onToggleSun,
  showCool, onToggleCool,
  showWind, onToggleWind,
  showSolar, onToggleSolar,
  solarSeason, onSelectSolarSeason,
  showTerrain, onToggleTerrain,
  showContours, onToggleContours,
  showFogLine, onToggleFogLine,
  showNeighborhoods, onToggleNeighborhoods,
  onPickFromAddress, onUseGeoLocation, ready, geoLoading, picked,
  dataErr, geoErr,
}) {
  const [menu, setMenu] = useState(null); // "layers" | null
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!menu) return;
    const onDown = e => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setMenu(null);
    };
    const onKey = e => { if (e.key === "Escape") setMenu(null); };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [menu]);

  const zoneToggles = [
    ["Sun pockets", showSun, onToggleSun],
    ["Cool / shade", showCool, onToggleCool],
    ["Wind corridors", showWind, onToggleWind],
  ];
  const refToggles = [
    ["Terrain", showTerrain, onToggleTerrain],
    ["Elevation contours", showContours, onToggleContours],
    ["Fog inversion line", showFogLine, onToggleFogLine],
    ["Neighborhoods", showNeighborhoods, onToggleNeighborhoods],
  ];
  const activeCount =
    [showSun, showCool, showWind, showSolar, showTerrain, showContours, showFogLine, showNeighborhoods]
      .filter(Boolean).length;

  // Active-layer color key.
  const legends = [];
  const zoneItems = [
    showSun && ["#fdba74", "Sun pockets"],
    showCool && ["#7dd3fc", "Cool / shade"],
    showWind && ["#2dd4bf", "Wind corridors"],
  ].filter(Boolean);
  if (zoneItems.length) legends.push({ title: "Microclimate Zones", items: zoneItems });
  if (showSolar) legends.push({
    title: "Solar Exposure",
    items: [["#fef3c7", "More sun than flat"], ["#c4a574", "Shaded vs flat"]],
  });

  return (
    <div className="fog-maptools" ref={wrapRef}>
      {/* Search bar */}
      <div className="fog-search">
        <a className="fog-search-back" href="/" aria-label="Back to UrMicroLife" title="UrMicroLife">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
        <div className="fog-search-field">
          <svg className="fog-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="m20 20-3.2-3.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <FogLocationSearch
            onPickFromAddress={onPickFromAddress}
            onUseGeoLocation={onUseGeoLocation}
            ready={ready}
            geoLoading={geoLoading}
            picked={picked}
            showGeoButton={false}
          />
        </div>
      </div>
      {(dataErr || geoErr) && (
        <div className="fog-search-err">
          {dataErr && <span>⚠ {dataErr}</span>}
          {geoErr && <span>⚠ {geoErr}</span>}
        </div>
      )}

      {/* Round Layers button (top-right) */}
      <button
        type="button"
        className={"fog-fab fog-fab-layers" + (menu === "layers" ? " on" : "")}
        onClick={() => setMenu(m => (m === "layers" ? null : "layers"))}
        aria-expanded={menu === "layers"}
        aria-label="Map layers"
        title="Map layers"
      >
        <LayersIcon />
        {activeCount > 0 && <span className="fog-fab-badge">{activeCount}</span>}
      </button>

      {menu === "layers" && (
        <div className="fog-float-panel right fog-layers-panel" role="menu">
          <div className="fog-layers-group">
            <div className="fog-layers-group-title">Microclimate Zones</div>
            {zoneToggles.map(([label, checked, onChange]) => (
              <ToggleSwitch key={label} label={label} checked={checked} onChange={onChange} />
            ))}
            <ToggleSwitch label="Solar exposure" checked={showSolar} onChange={onToggleSolar} />
            {showSolar && (
              <div className="micro-season-row">
                {SEASONS.map(s => (
                  <button
                    key={s.key}
                    type="button"
                    className={"micro-season-btn" + (solarSeason === s.key ? " on" : "")}
                    onClick={() => onSelectSolarSeason(s.key)}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="fog-layers-group">
            <div className="fog-layers-group-title">Terrain &amp; Reference</div>
            {refToggles.map(([label, checked, onChange]) => (
              <ToggleSwitch key={label} label={label} checked={checked} onChange={onChange} />
            ))}
          </div>
        </div>
      )}

      {/* Round "find me" arrow (bottom-right) */}
      <button
        type="button"
        className="fog-fab fog-fab-locate"
        onClick={onUseGeoLocation}
        disabled={geoLoading || !ready}
        aria-label="Show my location"
        title="Show my location"
      >
        {geoLoading ? <span className="fog-fab-spin">⏳</span> : <LocateIcon />}
      </button>

      {/* Active-layer color key — only when no menu is open. */}
      {!menu && legends.length > 0 && (
        <div className="fog-active-legends">
          {legends.map(l => (
            <div key={l.title} className="fog-layer-legend">
              <div className="fog-layer-legend-title">{l.title}</div>
              <div className="fog-layer-legend-items">
                {l.items.map(([color, label]) => (
                  <div key={label} className="fog-layer-legend-item">
                    <span className="fog-layer-legend-swatch" style={{ background: color }} />
                    <span className="fog-layer-legend-label">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function LayersIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2 2 7l10 5 10-5-10-5Z" fill="currentColor" opacity="0.9" />
      <path d="m2 12 10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m2 17 10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function LocateIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 11 21 3l-8 18-2-7-8-3Z" fill="currentColor" />
    </svg>
  );
}

function ToggleSwitch({ checked, onChange, label }) {
  return (
    <label className="fog-switch fog-switch-compact">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
      <span className="fog-switch-track" aria-hidden="true">
        <span className="fog-switch-knob" />
      </span>
      <span className="fog-switch-copy">
        <span className="fog-switch-label">{label}</span>
      </span>
    </label>
  );
}
