'use client';

// Bottom panel under the wine map. Mirrors FogPanel's layout and reuses
// its CSS classes:
//   1) Key box — details for the selected AVA (county, established,
//      parent appellations, sub-AVAs)
//   2) Color box — the full appellation stack at the clicked point,
//      smallest (most specific) first, as clickable chips
// Followed by the layer toggles.

import { useState, useEffect } from "react";
import { fogMicroclimate, typicalGrapes } from "./lib/avas";
import { SOIL_ORDER_INFO, SOIL_ORDER_LIST, formatSoil } from "./WineMap";

// Fog legend bands — colors mirror the map's fog-fill ramp, labels match
// fogMicroclimate(). Hour ranges are the same thresholds.
const FOG_LEGEND = [
  { color: "#fde68a", label: "Warm · minimal fog", range: "< 3.5 hr/day" },
  { color: "#dce7a0", label: "Moderate marine influence", range: "3.5–4.5" },
  { color: "#9ecfd6", label: "Cool · regular fog", range: "4.5–5.5" },
  { color: "#6b9bb3", label: "Strong marine / fog", range: "5.5+ hr/day" },
];

export default function WinePanel({
  picked,
  selected,
  onSelect,
  showNapa, onToggleNapa,
  showSonoma, onToggleSonoma,
  showRegions, onToggleRegions,
  showLabels, onToggleLabels,
  showWineries, onToggleWineries,
  showVineyards, onToggleVineyards,
  showFog, onToggleFog,
  showSoils, onToggleSoils,
  showTerrain, onToggleTerrain,
  showElevation, onToggleElevation,
  varietalsByAva = {},
  fogByAva = {},
  wineriesByAva = {},
}) {
  const p = selected?.properties;
  // Roster of wineries in this AVA + whether the click-through list is open.
  const avaWineries = (p && wineriesByAva[p.name]) || [];
  const [listOpen, setListOpen] = useState(false);
  // Close the list when the selection changes (different AVA, or a winery
  // click takes over the card).
  const winery = picked?.winery;
  useEffect(() => {
    setListOpen(false);
  }, [p?.ava_id, winery]);
  // AVA climate one-liner from the mean fog across its wineries.
  const avaFog = p ? fogByAva[p.name] : null;
  const climateLabel =
    avaFog != null ? `${fogMicroclimate(avaFog)} · ~${avaFog.toFixed(1)} hr fog/day` : null;
  // Top grapes poured across this AVA's wineries (our public proxy for
  // parcel-varietal data). Shown only on the AVA card, not the winery card.
  const knownFor = (p && varietalsByAva[p.name]) || [];
  // Soil under the clicked point (only present when the Soils layer is on).
  const soil = picked?.soil;
  const soilLabel = formatSoil(soil);
  // Terroir-based grape suitability for the selected AVA: climate from the
  // AVA's mean fog, soil character from the clicked point's soil order.
  const grapes = typicalGrapes(soil?.order, avaFog);
  const grapesLabel = grapes
    ? `${grapes.grapes}${grapes.character ? ` · ${grapes.character}` : ""}`
    : null;
  const countyLabel = p
    ? [p.inNapa && "Napa", p.inSonoma && "Sonoma"].filter(Boolean).join(" & ")
    : null;
  // "Part of" reads better without North Coast on every single row —
  // it's listed once when it's the only parent.
  const within = p?.within?.filter(w => w !== "North Coast") || [];
  const withinLabel = p
    ? (within.length ? within : p.within || []).join(", ") || null
    : null;
  return (
    <div className="fog-panel">
      <div className="fog-panel-row" style={{ gridTemplateColumns: "1fr" }}>
        <div className="fog-keybox">
          {winery ? (
            <>
              <div className="fog-keybox-h">🍷 {winery.name}</div>
              <KeyRow label="Address" value={winery.address} />
              <KeyRow label="Appellation" value={winery.ava || "Outside any AVA"} />
              <KeyRow
                label="Website"
                value={(() => {
                  // Prefer the winery's own website; fall back to the
                  // directory listing so the row always links somewhere.
                  const href = winery.website || winery.listingUrl;
                  return href ? (
                    <a href={href} target="_blank" rel="noreferrer">
                      {linkLabel(href)} ↗
                    </a>
                  ) : null;
                })()}
              />
            </>
          ) : (
            <>
              <div className="fog-keybox-h">
                {p ? p.name : picked ? "Outside any AVA" : "Click the map to explore an appellation"}
              </div>
              <KeyRow label="County" value={countyLabel} />
              <KeyRow label="AVA Established" value={p?.established} />
              <KeyRow label="Part of" value={withinLabel} />
              <KeyRow
                label="Sub-AVAs"
                value={p?.contains?.length ? `${p.contains.length} — ${p.contains.join(", ")}` : p ? "None" : null}
              />
              {avaWineries.length > 0 && (
                <div className="fog-key-row">
                  <span className="fog-key-label">Wineries</span>
                  <span className="fog-key-value">
                    <button
                      type="button"
                      className="wine-count-link"
                      onClick={() => setListOpen(true)}
                    >
                      {avaWineries.length} ›
                    </button>
                  </span>
                </div>
              )}
              {climateLabel && <KeyRow label="Climate" value={climateLabel} />}
              {knownFor.length > 0 && (
                <KeyRow
                  label="Known For"
                  value={knownFor.slice(0, 5).map(v => v.variety).join(", ")}
                />
              )}
              {soilLabel && <KeyRow label="Soil (at point)" value={soilLabel} />}
              {grapesLabel && <KeyRow label="Typical grapes" value={grapesLabel} />}
            </>
          )}
        </div>
      </div>

      <div className="fog-toggles-row">
        <ToggleSwitch checked={showNapa} onChange={onToggleNapa} label="Napa AVAs" />
        <ToggleSwitch checked={showSonoma} onChange={onToggleSonoma} label="Sonoma AVAs" />
        <ToggleSwitch checked={showRegions} onChange={onToggleRegions} label="Regional Outlines" />
        <ToggleSwitch checked={showLabels} onChange={onToggleLabels} label="AVA Names" />
        <ToggleSwitch checked={showWineries} onChange={onToggleWineries} label="Wineries" />
        <ToggleSwitch checked={showVineyards} onChange={onToggleVineyards} label="Vineyard Blocks" />
        <ToggleSwitch checked={showFog} onChange={onToggleFog} label="Summer Fog" />
        <ToggleSwitch checked={showSoils} onChange={onToggleSoils} label="Soils" />
        <ToggleSwitch checked={showElevation} onChange={onToggleElevation} label="Elevation" />
        <ToggleSwitch checked={showTerrain} onChange={onToggleTerrain} label="Terrain" />
      </div>

      {showFog && (
        <div className="fog-legend-row-wrap">
          <div className="fog-layer-legend">
            <div className="fog-layer-legend-title">
              Summer Fog · avg low-cloud hrs/day (USGS, 1999–2009)
            </div>
            <div className="fog-layer-legend-items">
              {FOG_LEGEND.map(b => (
                <div key={b.label} className="fog-layer-legend-item">
                  <span
                    className="fog-layer-legend-swatch wine-fog-swatch"
                    style={{ background: b.color }}
                  />
                  <span>
                    {b.label} <span className="wine-fog-range">{b.range}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showSoils && (
        <div className="fog-legend-row-wrap">
          <div className="fog-layer-legend">
            <div className="fog-layer-legend-title">
              Soil type · what it means for the vines (USDA-NRCS SSURGO)
            </div>
            <div className="fog-layer-legend-items">
              {SOIL_ORDER_LIST.map(order => {
                const info = SOIL_ORDER_INFO[order];
                return (
                  <div key={order} className="fog-layer-legend-item">
                    <span
                      className="fog-layer-legend-swatch wine-fog-swatch"
                      style={{ background: info.color }}
                    />
                    <span>
                      {order} — {info.plain}
                      {info.note ? (
                        <span className="wine-fog-range"> · {info.note}</span>
                      ) : null}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {listOpen && p && (
        <div className="wine-list-overlay" onClick={() => setListOpen(false)}>
          <div className="wine-list-box" onClick={e => e.stopPropagation()}>
            <div className="wine-list-head">
              <span>
                {avaWineries.length} wineries · {p.name}
              </span>
              <button
                type="button"
                className="wine-list-close"
                onClick={() => setListOpen(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="wine-list-body">
              {avaWineries.map((w, i) => (
                <div key={`${w.name}-${i}`} className="wine-list-item">
                  <div className="wine-list-name">{w.name}</div>
                  <div className="wine-list-meta">{w.address || "—"}</div>
                  <div className="wine-list-meta">
                    {w.website ? (
                      <a href={w.website} target="_blank" rel="noreferrer">
                        {linkLabel(w.website)} ↗
                      </a>
                    ) : (
                      <span className="wine-list-na">n/a</span>
                    )}
                  </div>
                  {w.phone && (
                    <div className="wine-list-meta">
                      <a href={`tel:${w.phone}`}>{w.phone}</a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// "https://en.wikipedia.org/wiki/…" → "wikipedia.org"
function linkLabel(url) {
  try {
    return new URL(url).hostname.replace(/^(www|en)\./, "");
  } catch {
    return "link";
  }
}

function KeyRow({ label, value }) {
  return (
    <div className="fog-key-row">
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
