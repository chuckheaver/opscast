'use client';

// Bottom panel under the map. Two stacked sections:
//   1) A–Z index of authored neighborhoods (click a name → open its pop-up)
//      alongside a slim "selected point" strip with the point-level facts
//      that depend on the exact spot clicked (ZIP, elevation, seismic,
//      tsunami). Neighborhood-level facts + the editorial story live in the
//      pop-up (NeighborhoodModal).
//   2) The layer toggles + map legends.

import { findNeighborhoodForPoint } from "./lib/spatial";
import { fogLabel } from "./lib/risk";
import { getNeighborhood, listNeighborhoods } from "./lib/neighborhoods";
import NeighborhoodModal from "./NeighborhoodModal";

// Alphabetical index of authored neighborhoods — stable across renders.
const NBHD_INDEX = listNeighborhoods();

export default function FogPanel({
  picked,
  openHood,
  onOpenHood,
  onCloseHood,
  onPickNeighborhood,
  zips,
  supervisorDistricts,
  realtorNeighborhoods,
  seismicHazards,
  tsunamiHazard,
  showNeighborhoods, onToggleNeighborhoods,
  showContours, onToggleContours,
  contoursAvailable,
  showMuni, onToggleMuni,
  showBikes, onToggleBikes,
  showDistricts, onToggleDistricts,
  showZips, onToggleZips,
  showTerrain, onToggleTerrain,
  showElevation, onToggleElevation,
  showSeismic, onToggleSeismic,
  showTsunami, onToggleTsunami,
  showRealtor, onToggleRealtor,
}) {
  // Compute the per-location lookups inline so we don't double-store them.
  const point = picked?.point;
  const zipFeat = point && zips ? findNeighborhoodForPoint(zips, point) : null;
  const supFeat = point && supervisorDistricts
    ? findNeighborhoodForPoint(supervisorDistricts, point) : null;
  const realtorFeat = point && realtorNeighborhoods
    ? findNeighborhoodForPoint(realtorNeighborhoods, point) : null;

  const neighborhoodName = picked?.feature?.properties?.name;
  const hoodData = getNeighborhood(neighborhoodName);
  const zipCode = zipFeat?.properties?.zip;
  const elevationFt = picked?.elevation_ft;
  const realtorLabel = realtorFeat
    ? `${realtorFeat.properties.nbrhood} (${realtorFeat.properties.nid})`
    : null;
  const supervisorLabel = supFeat
    ? `District ${supFeat.properties.district}${supFeat.properties.supervisor ? ` — ${supFeat.properties.supervisor}` : ""}`
    : null;
  // Microclimate Zone derives from the USGS fog contour at the picked
  // point — same source as the hours value below, just bucketed.
  const fogHrs = picked?.contour?.properties?.hours;
  const microZoneLabel = Number.isFinite(fogHrs) ? fogLabel(fogHrs) : null;

  // Hazard checks — Y/N only resolve once the picked point AND the
  // hazard dataset have both arrived; until then show the "—" placeholder.
  const yesNo = (point, fc) =>
    !point || !fc ? null : findNeighborhoodForPoint(fc, point) ? "Yes" : "No";
  const seismicYN = yesNo(point, seismicHazards);
  const tsunamiYN = yesNo(point, tsunamiHazard);

  // The neighborhood whose pop-up is open. Point-derived facts (fog,
  // supervisor, realtor district) only apply when the picked point is
  // actually inside the open neighborhood.
  const openData = openHood ? getNeighborhood(openHood) : null;
  const factsMatch = neighborhoodName === openHood;

  return (
    <div className="fog-panel">
      {openHood && openData && (
        <NeighborhoodModal
          name={openHood}
          data={openData}
          fogHrs={factsMatch && Number.isFinite(fogHrs) ? fogHrs : null}
          zoneLabel={factsMatch ? microZoneLabel : null}
          supervisorDistrict={factsMatch ? supFeat?.properties?.district : null}
          realtorDistrict={factsMatch ? realtorLabel : null}
          loc={factsMatch ? picked : null}
          onClose={onCloseHood}
        />
      )}
      <div className="fog-panel-row">
        {/* A–Z index of every neighborhood we've written highlights for.
            Click a name to drop a pin at its centre and open the pop-up. */}
        <div className="fog-nbhd-index">
          <div className="fog-keybox-h">
            Neighborhoods <span className="fog-nbhd-count">({NBHD_INDEX.length})</span>
          </div>
          <div className="fog-nbhd-list">
            {NBHD_INDEX.map(n => (
              <button
                key={n.key}
                type="button"
                className={"fog-nbhd-link" + (n.key === openHood ? " on" : "")}
                onClick={() => onPickNeighborhood(n.key)}
              >
                {n.label}
              </button>
            ))}
          </div>
        </div>

        {/* Slim point-level strip: facts that depend on the exact spot. */}
        <div className="fog-keybox fog-point-strip">
          {point ? (
            <>
              <div className="fog-keybox-h">{picked?.address || neighborhoodName || "Selected point"}</div>
              <KeyRow label="Zip Code" value={zipCode} />
              <KeyRow label="Elevation" value={Number.isFinite(elevationFt) ? `${elevationFt} ft` : null} />
              <KeyRow label="Seismic Zone" value={seismicYN} />
              <KeyRow label="Tsunami Zone" value={tsunamiYN} />
              {hoodData && (
                <button type="button" className="fog-hood-link fog-point-cta" onClick={() => onOpenHood(neighborhoodName)}>
                  View {neighborhoodName} details ›
                </button>
              )}
            </>
          ) : (
            <div className="fog-point-empty">
              Click a neighborhood name, or anywhere on the map, to see its details.
            </div>
          )}
        </div>
      </div>

      <div className="fog-toggles-row">
        <ToggleSwitch
          checked={showNeighborhoods}
          onChange={onToggleNeighborhoods}
          label="Neighborhoods"
        />
        {contoursAvailable && (
          <ToggleSwitch
            checked={showContours}
            onChange={onToggleContours}
            label="Summer Fog"
          />
        )}
        <ToggleSwitch
          checked={showMuni}
          onChange={onToggleMuni}
          label="Transit"
        />
        <ToggleSwitch
          checked={showBikes}
          onChange={onToggleBikes}
          label="Bike Paths"
        />
        <ToggleSwitch
          checked={showDistricts}
          onChange={onToggleDistricts}
          label="Districts"
        />
        <ToggleSwitch
          checked={showZips}
          onChange={onToggleZips}
          label="Zip Codes"
        />
        <ToggleSwitch
          checked={showElevation}
          onChange={onToggleElevation}
          label="Elevation"
        />
        <ToggleSwitch
          checked={showTerrain}
          onChange={onToggleTerrain}
          label="Terrain"
        />
        <ToggleSwitch
          checked={showSeismic}
          onChange={onToggleSeismic}
          label="Seismic"
        />
        <ToggleSwitch
          checked={showTsunami}
          onChange={onToggleTsunami}
          label="Tsunami Zone"
        />
        <ToggleSwitch
          checked={showRealtor}
          onChange={onToggleRealtor}
          label="Realtor Districts"
        />
      </div>

      <div className="fog-legend-row-wrap">
        <LayerLegend
          title="Elevation Contours"
          items={[
            ["#0ea5e9", "50 ft"],
            ["#0d9488", "100 ft"],
            ["#65a30d", "200 ft"],
            ["#ca8a04", "300 ft"],
            ["#b91c1c", "600 ft"],
          ]}
        />
        <LayerLegend
          title="Bike Paths"
          items={[
            ["#15803d", "Class I · off-street path", "solid"],
            ["#06b6d4", "Class II · striped lane", "solid"],
            ["#22c55e", "Class IV · separated", "solid"],
            ["#6b7280", "Class III · shared / sharrows", "dashed"],
          ]}
        />
        <LayerLegend
          title="Transit"
          items={[
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
          ]}
        />
      </div>
    </div>
  );
}

// Inline color/line key used under the toggle row to document what the
// elevation contour colours and bike-network colours mean on the map.
function LayerLegend({ title, items }) {
  return (
    <div className="fog-layer-legend">
      <div className="fog-layer-legend-title">{title}</div>
      <div className="fog-layer-legend-items">
        {items.map(([color, label, style]) => {
          const dashed = style === "dashed";
          return (
            <div key={label} className="fog-layer-legend-item">
              <span
                className={`fog-layer-legend-swatch${dashed ? " fog-layer-legend-swatch-dashed" : ""}`}
                style={dashed ? { color } : { background: color }}
              />
              <span className="fog-layer-legend-label">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function KeyRow({ label, value, dark }) {
  return (
    <div className={`fog-key-row${dark ? " fog-key-row-dark" : ""}`}>
      <span className="fog-key-label">{label}</span>
      <span className="fog-key-value">{value || "—"}</span>
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
