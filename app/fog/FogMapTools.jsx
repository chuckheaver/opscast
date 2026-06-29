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
import ListingFilter from "../components/ListingFilter";
import LayerSelector from "../components/LayerSelector";
import LayerBar from "../components/LayerBar";
import { TRANSIT_CATS, TRANSIT_CATS_ALPHA } from "./lib/transit";
import { BIKE_CLASSES } from "./lib/bikes";

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
  showFaults,
  showRealtor, onToggleRealtor,
  showCBD, onToggleCBD,
  showResBuildings, onToggleResBuildings,
  showComBuildings, onToggleComBuildings,
  // Buildings list
  buildingProfiles, openBuilding, onOpenBuilding, onZoomBuilding, onShowResBuildings,
  // Transit (multi-select line categories)
  transitSel, onToggleTransitCat, onShowAllTransit, onSelectNoneTransit, onSaveTransitDefault, onTransitOpen,
  // Bikes (multi-select facility classes)
  bikeSel, onToggleBikeClass, onShowAllBikes, onSelectNoneBikes, onSaveBikeDefault, onBikesOpen,
  // Hazards (seismic + tsunami) selector
  onHazardsOpen, onToggleHazard, onShowAllHazards, onSelectNoneHazards, onSaveHazardDefault,
  // Microclimate zones selector
  onToggleMicroZone, onShowAllMicro, onSelectNoneMicro, onSaveMicroDefault,
  // Neighborhoods list
  onPickNeighborhood, openHood,
  // House market stats pop-up
  onOpenMarket,
  // Housing Activity (Homes) map overlay — shared market filter drives the dots
  activityOn, homesFilter, homesOptions, onActivityOpen, onHomesFilterChange, onHomesReset, onClearActivity,
  // MicroClimates overlay
  showMicroSun, onToggleMicroSun, showMicroCool, onToggleMicroCool,
  showMicroWind, onToggleMicroWind, onMicroOpen,
  // Location / search
  onPickFromAddress, onUseGeoLocation, ready, geoLoading, picked,
  dataErr, geoErr,
  // Optional menu to open on first load (e.g. "activity" from the Market entry)
  initialMenu,
}) {
  const [menu, setMenu] = useState(initialMenu || null); // "layers" | "buildings" | "neighborhoods" | "activity" | null
  const wrapRef = useRef(null);
  // Collapse the open list/Homes panel down to its header so it stops covering
  // the map on small screens. Resets whenever a different panel opens.
  const [panelCollapsed, setPanelCollapsed] = useState(false);
  useEffect(() => { setPanelCollapsed(false); }, [menu]);

  // The Market entry lands with the Homes filter open + dots on.
  useEffect(() => {
    if (initialMenu === "activity") onActivityOpen?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
  const microItems = [
    showMicroSun && ["#fdba74", "Sun pockets"],
    showMicroCool && ["#7dd3fc", "Cool / shade"],
    showMicroWind && ["#2dd4bf", "Wind corridors"],
  ].filter(Boolean);
  const hazardItems = [
    showSeismic && ["#dc2626", "Seismic zone"],
    showTsunami && ["#0ea5e9", "Tsunami zone"],
    showFaults && ["#b91c1c", "Fault lines"],
  ].filter(Boolean);
  // Transit + Bikes legends mirror the user's current selection.
  const transitItems = TRANSIT_CATS_ALPHA
    .filter(c => transitSel?.has(c.key))
    .map(c => [c.color, c.label]);
  const bikeItems = BIKE_CLASSES
    .filter(c => bikeSel?.has(c.key))
    .map(c => [c.color, c.label, c.dashed ? "dashed" : undefined]);
  const legends = [
    showElevation && ELEVATION_LEGEND,
    showResBuildings && RES_LEGEND,
    showComBuildings && COM_LEGEND,
    showBikes && bikeItems.length && { title: "Bikes", items: bikeItems },
    showMuni && transitItems.length && { title: "Transit", items: transitItems },
    microItems.length && { title: "Microclimate zones", items: microItems },
    hazardItems.length && { title: "Hazards", items: hazardItems },
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

      {/* Quick-link chips under the search bar. Each chip toggles its own map
          layer on/off (blue = on, white = off); any number can be on at once.
          Layers with a selector (Hoods, Homes, Bldgs, Transit, Bikes,
          MicroClimates) also open their panel when switched on. */}
      <div className="fog-chips">
        {/* Hoods — opens the jump-to list (outlines are the always-on anchor
            layer). Pick a neighborhood to zoom to it + open its info pop-up. */}
        <button
          type="button"
          className={"fog-chip" + (menu === "neighborhoods" ? " on" : "")}
          onClick={() => {
            if (menu === "neighborhoods") { setMenu(null); }
            else { onToggleNeighborhoods(true); setMenu("neighborhoods"); }
          }}
          aria-expanded={menu === "neighborhoods"}
          title="Neighborhoods"
        >
          <GridIcon /> Hoods
        </button>
        {/* Homes — sale dots driven by the market filter */}
        <button
          type="button"
          className={"fog-chip" + (activityOn ? " on" : "")}
          onClick={() => {
            if (activityOn) { onClearActivity?.(); if (menu === "activity") setMenu(null); }
            else { onActivityOpen?.(); setMenu("activity"); }
          }}
          aria-pressed={!!activityOn}
          title="Home sale dots"
        >
          <DotsIcon /> Homes
        </button>
        {/* Bldgs — residential footprints + index */}
        <button
          type="button"
          className={"fog-chip" + (showResBuildings ? " on" : "")}
          onClick={() => {
            const on = !showResBuildings;
            onToggleResBuildings?.(on);
            setMenu(on ? "buildings" : (menu === "buildings" ? null : menu));
          }}
          aria-pressed={!!showResBuildings}
          title="Buildings"
        >
          <BuildingIcon /> Bldgs
        </button>
        {/* Stats — market report pop-up (no map layer) */}
        <button
          type="button"
          className="fog-chip"
          onClick={() => { setMenu(null); onOpenMarket?.(); }}
          title="House market stats"
        >
          <ChartIcon /> Stats
        </button>
        {/* Fog — summer fog contours */}
        <button
          type="button"
          className={"fog-chip" + (showContours ? " on" : "")}
          onClick={() => onToggleContours(!showContours)}
          aria-pressed={!!showContours}
          title="Summer fog"
        >
          <FogIcon /> Fog
        </button>
        {/* MicroClimates — terrain micro-zones */}
        <button
          type="button"
          className={"fog-chip" + ((showMicroSun || showMicroCool || showMicroWind) ? " on" : "")}
          onClick={() => {
            const on = showMicroSun || showMicroCool || showMicroWind;
            if (on) { onSelectNoneMicro?.(); if (menu === "micro") setMenu(null); }
            else { onMicroOpen?.(); setMenu("micro"); }
          }}
          aria-pressed={showMicroSun || showMicroCool || showMicroWind}
          title="Microclimate zones"
        >
          <MicroIcon /> MicroClimates
        </button>
        {/* Hazards — seismic + tsunami + fault lines selector */}
        <button
          type="button"
          className={"fog-chip" + ((showSeismic || showTsunami || showFaults) ? " on" : "")}
          onClick={() => {
            if (showSeismic || showTsunami || showFaults) { onSelectNoneHazards?.(); if (menu === "hazards") setMenu(null); }
            else { onHazardsOpen?.(); setMenu("hazards"); }
          }}
          aria-pressed={showSeismic || showTsunami || showFaults}
          title="Hazards — seismic, tsunami + fault lines"
        >
          <HazardIcon /> Hazards
        </button>
        {/* Transit — Muni lines + line selector */}
        <button
          type="button"
          className={"fog-chip" + (showMuni ? " on" : "")}
          onClick={() => {
            if (showMuni) { onToggleMuni?.(false); if (menu === "transit") setMenu(null); }
            else { onTransitOpen?.(); setMenu("transit"); }
          }}
          aria-pressed={!!showMuni}
          title="Transit lines"
        >
          <TransitIcon /> Transit
        </button>
        {/* Bikes — bike network + class selector */}
        <button
          type="button"
          className={"fog-chip" + (showBikes ? " on" : "")}
          onClick={() => {
            if (showBikes) { onToggleBikes?.(false); if (menu === "bikes") setMenu(null); }
            else { onBikesOpen?.(); setMenu("bikes"); }
          }}
          aria-pressed={!!showBikes}
          title="Bike network"
        >
          <BikeIcon /> Bikes
        </button>
      </div>

      {menu === "buildings" && (
        <div className={"fog-float-panel left fog-list-panel" + (panelCollapsed ? " collapsed" : "")}>
          <CollapseHead title="Buildings" collapsed={panelCollapsed} onToggle={() => setPanelCollapsed(c => !c)} />
          {!panelCollapsed && (buildingList.length === 0 ? (
            <div className="fog-list-empty">No buildings loaded yet.</div>
          ) : (
            buildingList.map(b => (
              <button
                key={b.objectid}
                type="button"
                className={"fog-list-link" + (b.objectid === openBuilding ? " on" : "")}
                onClick={() => { onZoomBuilding?.(b); setMenu(null); }}
              >
                {b.name}
                {b.tenure === "rental" && <span className="fog-bldg-rental"> (Rental)</span>}
                {b.tenure === "both" && <span className="fog-bldg-rental"> (Rental/Condo)</span>}
              </button>
            ))
          ))}
        </div>
      )}

      {menu === "neighborhoods" && (
        <div className={"fog-float-panel left fog-list-panel" + (panelCollapsed ? " collapsed" : "")}>
          <CollapseHead title="Neighborhoods" collapsed={panelCollapsed} onToggle={() => setPanelCollapsed(c => !c)} />
          {!panelCollapsed && NBHD_INDEX.map(n => (
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

      {menu === "activity" && (
        <div className={"fog-float-panel left fog-homes-panel" + (panelCollapsed ? " collapsed" : "")}>
          <CollapseHead title="Homes" collapsed={panelCollapsed} onToggle={() => setPanelCollapsed(c => !c)} />
          {!panelCollapsed && (
            <>
              <ListingFilter
                filter={homesFilter}
                options={homesOptions}
                onChange={onHomesFilterChange}
                onReset={onHomesReset}
              />
              <button type="button" className="fog-activity-clear" onClick={() => { onClearActivity?.(); setMenu(null); }}>Hide dots</button>
            </>
          )}
        </div>
      )}

      {menu === "micro" && (
        <LayerSelector
          title="Microclimates"
          hint="Tap a zone to show or hide it. “Save default” keeps your picks for next time."
          items={[
            { key: "sun", label: "Sun pockets", color: "#fdba74", on: showMicroSun },
            { key: "cool", label: "Cool / shade", color: "#7dd3fc", on: showMicroCool },
            { key: "wind", label: "Wind corridors", color: "#2dd4bf", on: showMicroWind },
          ]}
          onToggle={onToggleMicroZone}
          onAll={onShowAllMicro}
          onNone={onSelectNoneMicro}
          onSaveDefault={onSaveMicroDefault}
        />
      )}

      {menu === "hazards" && (
        <LayerSelector
          title="Hazards"
          hint="Tap a hazard to show or hide it. “Save default” keeps your picks for next time."
          items={[
            { key: "seismic", label: "Seismic zone", color: "#dc2626", on: showSeismic },
            { key: "tsunami", label: "Tsunami zone", color: "#0ea5e9", on: showTsunami },
            { key: "faults", label: "Fault lines", color: "#b91c1c", on: showFaults },
          ]}
          onToggle={onToggleHazard}
          onAll={onShowAllHazards}
          onNone={onSelectNoneHazards}
          onSaveDefault={onSaveHazardDefault}
        />
      )}

      {menu === "transit" && (
        <LayerBar
          items={TRANSIT_CATS.map(c => ({ key: c.key, short: c.short, color: c.color, on: !!transitSel?.has(c.key) }))}
          onToggle={onToggleTransitCat}
          onAll={onShowAllTransit}
          onNone={onSelectNoneTransit}
        />
      )}

      {menu === "bikes" && (
        <LayerSelector
          title="Bikes"
          hint="Tap a class to show or hide it. “Save default” keeps your picks for next time."
          items={BIKE_CLASSES.map(c => ({ key: c.key, label: c.label, color: c.color, dashed: c.dashed, on: !!bikeSel?.has(c.key) }))}
          onToggle={onToggleBikeClass}
          onAll={onShowAllBikes}
          onNone={onSelectNoneBikes}
          onSaveDefault={onSaveBikeDefault}
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
function DotsIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="6" cy="7" r="2.2" fill="currentColor" />
      <circle cx="16" cy="6" r="2.2" fill="currentColor" />
      <circle cx="9" cy="16" r="2.2" fill="currentColor" />
      <circle cx="18" cy="15" r="2.2" fill="currentColor" />
    </svg>
  );
}
function FogIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M4 9h16M6 13h12M4 17h16" />
    </svg>
  );
}
function MicroIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="4" fill="currentColor" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function HazardIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3 2 20h20L12 3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M12 10v4M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function TransitIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="6" y="3" width="12" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M6 11h12" stroke="currentColor" strokeWidth="2" />
      <circle cx="9" cy="14" r="1" fill="currentColor" /><circle cx="15" cy="14" r="1" fill="currentColor" />
      <path d="M8 17l-2 4M16 17l2 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function BikeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" stroke="currentColor" strokeWidth="2">
      <circle cx="6" cy="17" r="3.5" /><circle cx="18" cy="17" r="3.5" />
      <path d="M6 17l4-7h5l-3 7M10 10l-1-3H7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Collapse/expand header for the list + Homes panels (taps fold the panel to
// just this bar so it stops covering the map on small screens).
function CollapseHead({ title, collapsed, onToggle }) {
  return (
    <div className="fog-transit-head fog-panel-head">
      <button
        type="button"
        className="fog-transit-collapse"
        onClick={onToggle}
        aria-expanded={!collapsed}
        aria-label={(collapsed ? "Expand " : "Collapse ") + title}
      >
        <span className="fog-transit-caret" aria-hidden="true">{collapsed ? "▸" : "▾"}</span>
        <span>{title}</span>
      </button>
    </div>
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
