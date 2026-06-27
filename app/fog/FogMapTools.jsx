'use client';

// On-map controls laid out like Google Maps:
//   • a "Search here" bar pinned across the top (address / current-location)
//   • quick-link chips under it (Buildings, Neighborhoods) that open lists
//   • a round Layers button top-right that opens the layer toggles
//   • a round "find me" arrow bottom-right for current location
// Everything floats over a full-bleed map. Only one dropdown is open at a time.

import { useState, useRef, useEffect } from "react";
import { listNeighborhoods } from "./lib/neighborhoods";
import FogLocationSearch from "./FogLocationSearch";

// Alphabetical neighborhood index (already sorted by listNeighborhoods).
const NBHD_INDEX = listNeighborhoods();

export default function FogMapTools({
  // Layers
  contoursAvailable,
  showNeighborhoods, onToggleNeighborhoods,
  showContours, onToggleContours,
  showMuni, onToggleMuni,
  showBikes, onToggleBikes,
  showDistricts, onToggleDistricts,
  showZips, onToggleZips,
  showTerrain, onToggleTerrain,
  showElevation, onToggleElevation,
  showSeismic, onToggleSeismic,
  showTsunami, onToggleTsunami,
  showRealtor, onToggleRealtor,
  showCBD, onToggleCBD,
  showResBuildings, onToggleResBuildings,
  showComBuildings, onToggleComBuildings,
  // Buildings list
  buildingProfiles, openBuilding, onOpenBuilding,
  // Neighborhoods list
  onPickNeighborhood, openHood,
  // House market stats pop-up
  onOpenMarket,
  // Location / search
  onPickFromAddress, onUseGeoLocation, ready, geoLoading, picked,
  dataErr, geoErr,
}) {
  const [menu, setMenu] = useState(null); // "layers" | "buildings" | "neighborhoods" | null
  const wrapRef = useRef(null);

  // Close the open menu on an outside click or the Escape key.
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
      title: "Boundaries",
      items: [
        ["Neighborhoods", showNeighborhoods, onToggleNeighborhoods],
        ["Districts", showDistricts, onToggleDistricts],
        ["Zip Codes", showZips, onToggleZips],
        ["Realtor Districts", showRealtor, onToggleRealtor],
        ["CBD/Mello-Roos Districts", showCBD, onToggleCBD],
      ],
    },
    {
      title: "Weather & Terrain",
      items: [
        ...(contoursAvailable ? [["Summer Fog", showContours, onToggleContours]] : []),
        ["Elevation", showElevation, onToggleElevation],
        ["Terrain", showTerrain, onToggleTerrain],
      ],
    },
    {
      title: "Hazards",
      items: [
        ["Seismic", showSeismic, onToggleSeismic],
        ["Tsunami Zone", showTsunami, onToggleTsunami],
      ],
    },
    {
      title: "Transit & Bikes",
      items: [
        ["Transit", showMuni, onToggleMuni],
        ["Bike Paths", showBikes, onToggleBikes],
      ],
    },
    {
      title: "Buildings",
      items: [
        ["Large Residential/Mixed", showResBuildings, onToggleResBuildings],
        ["Comm/Off/Hot/Hosp", showComBuildings, onToggleComBuildings],
      ],
    },
  ];
  const activeCount = groups.reduce((n, g) => n + g.items.filter(([, on]) => on).length, 0);

  // Legends for the currently-active color-coded layers only.
  const legends = [
    showElevation && ELEVATION_LEGEND,
    showResBuildings && RES_LEGEND,
    showComBuildings && COM_LEGEND,
    showBikes && BIKE_LEGEND,
    showMuni && TRANSIT_LEGEND,
  ].filter(Boolean);

  // ── Buildings: alphanumeric residential index ──
  const buildingList = buildingProfiles
    ? Object.values(buildingProfiles).sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" }))
    : [];

  return (
    <div className="fog-maptools" ref={wrapRef}>
      {/* Search bar across the top */}
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

      {/* Quick-link chips under the search bar */}
      <div className="fog-chips">
        <button
          type="button"
          className={"fog-chip" + (menu === "buildings" ? " on" : "")}
          onClick={() => toggleMenu("buildings")}
          aria-expanded={menu === "buildings"}
        >
          <BuildingIcon /> Buildings
        </button>
        <button
          type="button"
          className={"fog-chip" + (menu === "neighborhoods" ? " on" : "")}
          onClick={() => toggleMenu("neighborhoods")}
          aria-expanded={menu === "neighborhoods"}
        >
          <GridIcon /> Neighborhoods
        </button>
        <button
          type="button"
          className="fog-chip"
          onClick={() => { setMenu(null); onOpenMarket?.(); }}
          title="House market stats"
        >
          <ChartIcon /> House Market Stats
        </button>
      </div>

      {menu === "buildings" && (
        <div className="fog-float-panel left fog-list-panel">
          {buildingList.length === 0 ? (
            <div className="fog-list-empty">No buildings loaded yet.</div>
          ) : (
            buildingList.map(b => (
              <button
                key={b.objectid}
                type="button"
                className={"fog-list-link" + (b.objectid === openBuilding ? " on" : "")}
                onClick={() => { onOpenBuilding(b.objectid); setMenu(null); }}
              >
                {b.name}
                {b.tenure === "rental" && <span className="fog-bldg-rental"> (Rental)</span>}
                {b.tenure === "both" && <span className="fog-bldg-rental"> (Rental/Condo)</span>}
              </button>
            ))
          )}
        </div>
      )}

      {menu === "neighborhoods" && (
        <div className="fog-float-panel left fog-list-panel">
          {NBHD_INDEX.map(n => (
            <button
              key={n.key}
              type="button"
              className={"fog-list-link" + (n.key === openHood ? " on" : "")}
              onClick={() => { onPickNeighborhood(n.key); setMenu(null); }}
            >
              {n.label}
            </button>
          ))}
        </div>
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
function BuildingIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="3" width="9" height="18" rx="1" stroke="currentColor" strokeWidth="2" />
      <path d="M13 8h6a1 1 0 0 1 1 1v12h-7" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M7 7h3M7 11h3M7 15h3M16 12h1M16 16h1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
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
function ChartIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 20V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M4 20h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <rect x="7" y="12" width="3" height="5" rx="0.5" fill="currentColor" />
      <rect x="12" y="8" width="3" height="9" rx="0.5" fill="currentColor" />
      <rect x="17" y="5" width="3" height="12" rx="0.5" fill="currentColor" />
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
        {items.map(([color, label, style]) => {
          const dashed = style === "dashed";
          const split = style === "split";
          const swatchStyle = dashed
            ? { color }
            : split
            ? { background: `linear-gradient(135deg, ${color.split("/")[0]} 50%, ${color.split("/")[1]} 50%)` }
            : { background: color };
          return (
            <div key={label} className="fog-layer-legend-item">
              <span
                className={`fog-layer-legend-swatch${dashed ? " fog-layer-legend-swatch-dashed" : ""}`}
                style={swatchStyle}
              />
              <span className="fog-layer-legend-label">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Legend data (one per color-coded layer) ──────────────────────────────
const ELEVATION_LEGEND = {
  title: "Elevation Contours",
  items: [
    ["#0ea5e9", "50 ft"],
    ["#0d9488", "100 ft"],
    ["#65a30d", "200 ft"],
    ["#ca8a04", "300 ft"],
    ["#b91c1c", "600 ft"],
  ],
};
const RES_LEGEND = {
  title: "Residential / Mixed",
  items: [
    ["#5B9BD5", "Residential (condo)"],
    ["#F59E0B", "Rental"],
    ["#5B9BD5/#F5C518", "Mixed use", "split"],
  ],
};
const COM_LEGEND = {
  title: "Commercial / Office / Hotel / Hospital",
  items: [["#E6CE78", "Commercial"]],
};
const BIKE_LEGEND = {
  title: "Bike Paths",
  items: [
    ["#15803d", "Class I · off-street path", "solid"],
    ["#06b6d4", "Class II · striped lane", "solid"],
    ["#22c55e", "Class IV · separated", "solid"],
    ["#6b7280", "Class III · shared / sharrows", "dashed"],
  ],
};
const TRANSIT_LEGEND = {
  title: "Transit",
  items: [
    ["#D85F2A", "J Church"],
    ["#5B6770", "K Ingleside"],
    ["#92278F", "L Taraval"],
    ["#007749", "M Ocean View"],
    ["#005DAA", "N Judah"],
    ["#BC1E2D", "T Third"],
    ["#C99729", "F Heritage"],
    ["#B11116", "Cable car"],
    ["#EA580C", "Rapid (R)"],
    ["#6D28D9", "Express (X)"],
    ["#1E3A8A", "Owl (90 · 91)"],
    ["#6B7280", "Bus route"],
  ],
};
