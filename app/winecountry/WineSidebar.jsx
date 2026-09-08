'use client';

// Left rail for the wine-country micro-climate map. Address search + a
// legend that names the AVAs, wine types, and physical forces behind
// each zone, plus toggles for every layer.

import { useEffect, useRef, useState } from "react";
import { geocodeSuggest } from "../fog/lib/geocode";
import InfoModal from "./InfoModal";

// Each row: [emoji, color-swatch, label, wine-focused description].
const ZONES = [
  ["☀️", "#fdba74", "Warm slopes (Sun)",
    "SW/S/W-facing benches — Rutherford & Oakville east flanks, Diamond Mtn SW, Atlas Peak SW. Late-afternoon heat drives Cab, Zin, Petite Sirah."],
  ["❄️", "#7dd3fc", "Cool slopes (Shade)",
    "N/NW-facing hillsides — Mayacamas W face, Mt Veeder W, Sonoma Mtn W, Vaca east side into Chiles. Slow ripening, higher acid — Chard, Pinot, Cab from restrained sites."],
  ["🌬️", "#2dd4bf", "Wind corridors",
    "Valley-axis wind — Petaluma Gap (Bodega → San Pablo), Napa floor N/S, Chalk Hill Gap, Russian River gap. Diurnal breeze from the Bay pulls into the valleys every afternoon → thicker skins, higher tannin."],
  ["🌫️", "#334155", "Marine fog fingers",
    "Two entry points: Golden Gate → San Pablo Bay → Carneros → southern Napa, and Bodega Bay → Petaluma Gap → Sonoma Valley. This is the summertime cooling engine — the reason Carneros stays cool while Calistoga bakes 30 miles north."],
  ["🌁", "#94a3b8", "Morning valley fog",
    "Diurnal fog that pools on Napa + Sonoma valley floors overnight and burns off ~10 AM. Native to the valley itself, not the marine layer. Preserves acid; slows brix accumulation."],
  ["🌡️", "linear-gradient(to right,#7dd3fc,#a3e635,#fde68a,#fdba74,#f97316)", "Temp gradient (S → N)",
    "Napa Valley Winkler bands, coolest at Carneros (Region I) to hottest at Calistoga (Region IV). ~15 °F afternoon spread across 30 miles — the reason Cab is planted at St. Helena and Pinot at Carneros."],
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

export default function WineSidebar({
  picked,
  onPickFromAddress,
  dataErr,
  ready,
  showSun, onToggleSun,
  showCool, onToggleCool,
  showWind, onToggleWind,
  showFogMarine, onToggleFogMarine,
  showFogValley, onToggleFogValley,
  showTemp, onToggleTemp,
  showTerrain, onToggleTerrain,
  showContours, onToggleContours,
  showFogLine, onToggleFogLine,
  showPeaks, onTogglePeaks,
  showAvas, onToggleAvas,
  showSoils, onToggleSoils,
  onUseGeoLocation,
  geoLoading,
  geoErr,
}) {
  const [q, setQ] = useState("");
  const [sugs, setSugs] = useState([]);
  const [open, setOpen] = useState(false);
  const [learnOpen, setLearnOpen] = useState(false);
  const debounceRef = useRef(null);
  const blurTimerRef = useRef(null);
  const suppressNextFetchRef = useRef(false);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (suppressNextFetchRef.current) {
      suppressNextFetchRef.current = false;
      setSugs([]);
      setOpen(false);
      return;
    }
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
    const display = sug.label || sug.place_name;
    suppressNextFetchRef.current = true;
    setQ(display);
    setSugs([]);
    setOpen(false);
    onPickFromAddress(sug.center, display);
  };

  return (
    <aside className="fog-sidebar">
      <header className="fog-h">
        <div className="fog-brand-row">
          <h1 className="fog-brand">
            Wine <em>Country</em> Zones
          </h1>
          <button
            type="button"
            className="info-btn"
            onClick={() => setLearnOpen(true)}
            aria-label="Open the Learn panel"
            title="Learn — Winkler regions, soil archetypes, the physics behind the map"
          >
            i
          </button>
        </div>
        <div className="fog-note">
          Napa + Sonoma micro-climates by AVA. <b>Click any AVA</b> on the map for its Winkler region, soil, elevation, and the grapes that thrive there. Click a <b>Winkler temperature band</b> for the heat-region reference. Click a <b>soil polygon</b> for the archetype card. Or hit the <b>i</b> button above for the full physics primer.
        </div>
      </header>
      <InfoModal open={learnOpen} onClose={() => setLearnOpen(false)} />

      <label className="fog-lbl">Location</label>
      <div className="fog-search">
        <div className="fog-search-row">
          <input
            className="fog-input"
            placeholder="Search an AVA, town, or address…"
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
                <div className="fog-ac-name">{s.label || s.text}</div>
                {s.place_name && s.place_name !== (s.label || s.text) && (
                  <div className="fog-ac-meta">{s.place_name}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      {geoErr && <div className="fog-note" style={{ color: "#b91c1c" }}>{geoErr}</div>}
      {dataErr && <div className="fog-note" style={{ color: "#b91c1c" }}>Data error: {dataErr}</div>}
      {picked?.point && (
        <div className="fog-legend" style={{ marginTop: 2 }}>
          <div className="fog-legend-title">Marked location</div>
          {picked.address && <div className="fog-ac-name">{picked.address}</div>}
          <div className="fog-legend-range" style={{ display: "block", marginTop: 4 }}>
            Lat {picked.point[1].toFixed(3)}°N · Lng {picked.point[0].toFixed(3)}°
          </div>
        </div>
      )}

      <div className="fog-legend">
        <div className="fog-legend-title">Sub-Climate Zones</div>
        <div className="fog-legend-rows">
          {ZONES.map(([emoji, color, name, desc]) => {
            const isGradient = color.startsWith("linear-gradient");
            const labelColor = isGradient ? "#f97316" : color;
            return (
              <div key={name} className="fog-legend-row" style={{ gridTemplateColumns: "24px 1fr" }}>
                <span
                  className="fog-legend-emoji"
                  aria-hidden="true"
                  style={
                    isGradient
                      ? { display: "inline-block", width: 20, height: 20, borderRadius: 4, background: color, border: "1px solid rgba(0,0,0,0.25)", alignSelf: "center" }
                      : {}
                  }
                >
                  {isGradient ? "" : emoji}
                </span>
                <span>
                  <span className="fog-legend-label" style={{ color: labelColor }}>{name}</span>
                  <span className="fog-legend-range" style={{ display: "block" }}>{desc}</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <ToggleSwitch checked={showSun}        onChange={onToggleSun}        label="Warm slopes"       help="SW/S-facing benches + hill flanks — Cab, Zin, Petite Sirah country." />
      <ToggleSwitch checked={showCool}       onChange={onToggleCool}       label="Cool slopes"       help="N/NW-facing hillsides — slow ripening, higher acid; Chard + restrained Pinot." />
      <ToggleSwitch checked={showWind}       onChange={onToggleWind}       label="Wind corridors"    help="Petaluma Gap, Napa floor, Chalk Hill — diurnal breeze thickens skins." />
      <ToggleSwitch checked={showFogMarine}  onChange={onToggleFogMarine}  label="Marine fog"        help="Summertime cooling engine — Golden Gate + Petaluma Gap fingers." />
      <ToggleSwitch checked={showFogValley}  onChange={onToggleFogValley}  label="Morning valley fog" help="Diurnal fog on Napa + Sonoma valley floors, burns off ~10 AM." />
      <ToggleSwitch checked={showTemp}       onChange={onToggleTemp}       label="Temp gradient S→N" help="Winkler bands across Napa Valley — Carneros (I) to Calistoga (IV)." />
      <ToggleSwitch checked={showAvas}       onChange={onToggleAvas}       label="AVA boundaries"     help="Napa + Sonoma AVAs. Parent (burgundy), mountain (purple dashed), sub-AVA (black). Click for details." />
      <ToggleSwitch checked={showSoils}      onChange={onToggleSoils}      label="Soil archetypes"    help="Volcanic, alluvial gravel, alluvial fan, clay, marine sedimentary, limestone/chalk. Click any polygon for the archetype card." />
      <ToggleSwitch checked={showPeaks}      onChange={onTogglePeaks}      label="Named peaks"        help="Mayacamas + Vaca ridgeline peaks — the walls that shape every valley microclimate." />
      <ToggleSwitch checked={showTerrain}    onChange={onToggleTerrain}    label="Terrain (hillshade)" help="Relief shading from the Mapbox DEM." />
      <ToggleSwitch checked={showContours}   onChange={onToggleContours}   label="Elevation contours" help="Topographic lines relabelled in feet." />
      <ToggleSwitch checked={showFogLine}    onChange={onToggleFogLine}    label="Fog inversion line" help="≈1000 ft — the usual ceiling of marine fog. Mountain AVAs sit above it." />

      <div className="fog-note" style={{ marginTop: "auto", opacity: 0.7 }}>
        Sub-zones are schematic — drawn from valley orientation, gap wind and marine-layer physics rather than parcel-level measurement. Use them as a lens for reading the map, not a survey line.
      </div>
    </aside>
  );
}
