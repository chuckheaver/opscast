'use client';

// On-map controls for the Wine AVA map, laid out exactly like the fog map
// (Google-Maps style): a "Search here" bar across the top, quick-link chips
// under it (AVAs, Wineries), a round Layers button top-right, and a round
// "find me" arrow bottom-right. Reuses the fog control CSS (.fog-search,
// .fog-chip, .fog-fab, .fog-float-panel, .fog-layers-panel, …).

import { useState, useRef, useEffect, useMemo } from "react";
import FogLocationSearch from "../fog/FogLocationSearch";
import { geocodeSuggest } from "./lib/geocode";
import { SOIL_ORDER_INFO, SOIL_ORDER_LIST } from "./WineMap";

// Fog legend bands — same colors/labels as the old panel legend.
const FOG_LEGEND = {
  title: "Summer Fog · avg low-cloud hrs/day",
  items: [
    ["#fde68a", "Warm · minimal fog (< 3.5 hr/day)"],
    ["#dce7a0", "Moderate marine influence (3.5–4.5)"],
    ["#9ecfd6", "Cool · regular fog (4.5–5.5)"],
    ["#6b9bb3", "Strong marine / fog (5.5+ hr/day)"],
  ],
};
const SOIL_LEGEND = {
  title: "Soil type (USDA-NRCS SSURGO)",
  items: SOIL_ORDER_LIST.map(order => [
    SOIL_ORDER_INFO[order].color,
    `${order} — ${SOIL_ORDER_INFO[order].plain}`,
  ]),
};

export default function WineMapTools({
  // Layer toggles
  showNapa, onToggleNapa,
  showSonoma, onToggleSonoma,
  showRegions, onToggleRegions,
  showLabels, onToggleLabels,
  showWineries, onToggleWineries,
  showVineyards, onToggleVineyards,
  showFog, onToggleFog,
  showSoils, onToggleSoils,
  showElevation, onToggleElevation,
  showTerrain, onToggleTerrain,
  // Data + selection
  merged, wineries, selectedId,
  onSelectAva, onPickWinery,
  // Search / location
  onPickFromAddress, onUseGeoLocation, ready, geoLoading, picked,
  dataErr,
}) {
  const [menu, setMenu] = useState(null); // "layers" | "avas" | "wineries" | null
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

  const toggleMenu = id => setMenu(m => (m === id ? null : id));

  // ── Layers: grouped toggles ──
  const groups = [
    {
      title: "Appellations",
      items: [
        ["Napa AVAs", showNapa, onToggleNapa],
        ["Sonoma AVAs", showSonoma, onToggleSonoma],
        ["Regional Outlines", showRegions, onToggleRegions],
        ["AVA Names", showLabels, onToggleLabels],
      ],
    },
    {
      title: "Places",
      items: [
        ["Wineries", showWineries, onToggleWineries],
        ["Vineyard Blocks", showVineyards, onToggleVineyards],
      ],
    },
    {
      title: "Climate & Terrain",
      items: [
        ["Summer Fog", showFog, onToggleFog],
        ["Soils", showSoils, onToggleSoils],
        ["Elevation", showElevation, onToggleElevation],
        ["Terrain", showTerrain, onToggleTerrain],
      ],
    },
  ];
  const activeCount = groups.reduce((n, g) => n + g.items.filter(([, on]) => on).length, 0);

  const legends = [showFog && FOG_LEGEND, showSoils && SOIL_LEGEND].filter(Boolean);

  // ── Alphabetical AVA + winery indexes ──
  const avaList = useMemo(() => {
    if (!merged) return [];
    const seen = new Set();
    return merged.features
      .filter(f => f.properties?.name && !seen.has(f.properties.ava_id) && seen.add(f.properties.ava_id))
      .map(f => ({ id: f.properties.ava_id, name: f.properties.name, feature: f }))
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" }));
  }, [merged]);

  const wineryList = useMemo(() => {
    if (!wineries) return [];
    return wineries.features
      .filter(f => f.properties?.name)
      .map(f => ({ name: f.properties.name, ava: f.properties.ava, feature: f }))
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" }));
  }, [wineries]);

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
            suggest={geocodeSuggest}
            onPickFromAddress={onPickFromAddress}
            onUseGeoLocation={onUseGeoLocation}
            ready={ready}
            geoLoading={geoLoading}
            picked={picked}
            showGeoButton={false}
          />
        </div>
      </div>
      {dataErr && (
        <div className="fog-search-err"><span>⚠ {dataErr}</span></div>
      )}

      {/* Quick-link chips */}
      <div className="fog-chips">
        <button
          type="button"
          className={"fog-chip" + (menu === "avas" ? " on" : "")}
          onClick={() => toggleMenu("avas")}
          aria-expanded={menu === "avas"}
        >
          <GridIcon /> AVAs
        </button>
        <button
          type="button"
          className={"fog-chip" + (menu === "wineries" ? " on" : "")}
          onClick={() => toggleMenu("wineries")}
          aria-expanded={menu === "wineries"}
        >
          <GlassIcon /> Wineries
        </button>
      </div>

      {menu === "avas" && (
        <ListPanel
          items={avaList}
          getKey={a => a.id}
          getLabel={a => a.name}
          isOn={a => a.id === selectedId}
          onPick={a => { onSelectAva(a.feature); setMenu(null); }}
          empty="No appellations loaded yet."
        />
      )}

      {menu === "wineries" && (
        <ListPanel
          items={wineryList}
          getKey={(w, i) => `${w.name}-${i}`}
          getLabel={w => w.name}
          getMeta={w => w.ava}
          onPick={w => { onPickWinery(w.feature); setMenu(null); }}
          filter
          empty="No wineries loaded yet."
        />
      )}

      {/* Round Layers button (top-right) */}
      <button
        type="button"
        className={"fog-fab fog-fab-layers" + (menu === "layers" ? " on" : "")}
        onClick={() => toggleMenu("layers")}
        aria-expanded={menu === "layers"}
        aria-label="Map layers"
        title="Map layers"
      >
        <LayersIcon />
        {activeCount > 0 && <span className="fog-fab-badge">{activeCount}</span>}
      </button>

      {menu === "layers" && (
        <div className="fog-float-panel right fog-layers-panel" role="menu">
          {groups.map(g => (
            <div key={g.title} className="fog-layers-group">
              <div className="fog-layers-group-title">{g.title}</div>
              {g.items.map(([label, checked, onChange]) => (
                <ToggleSwitch key={label} label={label} checked={checked} onChange={onChange} />
              ))}
            </div>
          ))}
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
            <LayerLegend key={l.title} title={l.title} items={l.items} />
          ))}
        </div>
      )}
    </div>
  );
}

// Scrollable alphabetical list panel (AVAs / Wineries), opening on the left.
// Optionally shows a type-to-filter box (used for the long winery list).
function ListPanel({ items, getKey, getLabel, getMeta, isOn, onPick, filter, empty }) {
  const [q, setQ] = useState("");
  const shown = filter && q.trim()
    ? items.filter(it => getLabel(it).toLowerCase().includes(q.trim().toLowerCase()))
    : items;
  return (
    <div className="fog-float-panel left fog-list-panel">
      {filter && (
        <input
          className="fog-list-filter"
          placeholder="Filter…"
          value={q}
          onChange={e => setQ(e.target.value)}
          autoFocus
        />
      )}
      {shown.length === 0 ? (
        <div className="fog-list-empty">{q ? "No matches." : empty}</div>
      ) : (
        shown.map((it, i) => (
          <button
            key={getKey(it, i)}
            type="button"
            className={"fog-list-link" + (isOn && isOn(it) ? " on" : "")}
            onClick={() => onPick(it)}
          >
            {getLabel(it)}
            {getMeta && getMeta(it) && <span className="fog-bldg-rental"> ({getMeta(it)})</span>}
          </button>
        ))
      )}
    </div>
  );
}

// ── Icons ────────────────────────────────────────────────────────────────
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
function GlassIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 3h12l-1 6a5 5 0 0 1-10 0L6 3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M12 14v5M8 21h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function GridIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
      <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
      <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
      <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
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

function LayerLegend({ title, items }) {
  return (
    <div className="fog-layer-legend">
      <div className="fog-layer-legend-title">{title}</div>
      <div className="fog-layer-legend-items">
        {items.map(([color, label]) => (
          <div key={label} className="fog-layer-legend-item">
            <span className="fog-layer-legend-swatch" style={{ background: color }} />
            <span className="fog-layer-legend-label">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
