'use client';

// Bottom panel under the map. Two stacked sections:
//   1) Key/Legend box — what we know about the picked location:
//      Neighborhood, ZIP, Elevation, Real Estate District, Supervisor District
//   2) Color box (smaller) — microclimate zone + average summer fog hrs/day
// Followed by the four primary layer toggles (Neighborhoods, Summer Fog,
// Transit, Bike Paths).

import { findNeighborhoodForPoint } from "./lib/spatial";
import { fogColor, fogLabel } from "./lib/risk";

export default function FogPanel({
  picked,
  zips,
  supervisorDistricts,
  realtorNeighborhoods,
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
}) {
  // Compute the per-location lookups inline so we don't double-store them.
  const point = picked?.point;
  const zipFeat = point && zips ? findNeighborhoodForPoint(zips, point) : null;
  const supFeat = point && supervisorDistricts
    ? findNeighborhoodForPoint(supervisorDistricts, point) : null;
  const realtorFeat = point && realtorNeighborhoods
    ? findNeighborhoodForPoint(realtorNeighborhoods, point) : null;

  const neighborhoodName = picked?.feature?.properties?.name;
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

  return (
    <div className="fog-panel">
      <div className="fog-panel-row">
        <div className="fog-keybox">
          <div className="fog-keybox-h">
            {picked?.address || (point ? "Selected location" : "Pick a location")}
          </div>
          <KeyRow label="Neighborhood" value={neighborhoodName} />
          <KeyRow label="Zip Code" value={zipCode} />
          <KeyRow label="Elevation" value={Number.isFinite(elevationFt) ? `${elevationFt} ft` : null} />
          <KeyRow label="Real Estate District" value={realtorLabel} />
          <KeyRow label="Supervisor District" value={supervisorLabel} />
        </div>

        <div
          className="fog-colorbox"
          style={fogHrs != null ? { background: fogColor(fogHrs) } : undefined}
        >
          <KeyRow label="Microclimate Zone" value={microZoneLabel} />
          <KeyRow
            label="Avg Summer Fog Daily"
            value={fogHrs != null ? `${fogHrs.toFixed(1)} hrs / day` : null}
          />
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
