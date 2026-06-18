'use client';

// Left rail for the micro-climate map: address search, the three sub-zone
// toggles + legend, and a result card. Reuses the /fog sidebar styling.

import { useEffect, useRef, useState } from "react";
import { geocodeSuggest } from "../fog/lib/geocode";

const ZONES = [
  ["☀️", "#fdba74", "Sun Pockets", "≥20° SE/S/SW-facing inclines — the warmest, sunniest slopes."],
  ["❄️", "#7dd3fc", "Cool / Shade", "≥20° NW/N/NE-facing inclines — far less direct sun, so cooler."],
  ["🌬️", "#2dd4bf", "Wind Corridors", "Valley floors & gaps that funnel and accelerate wind."],
  ["🌫️", "#64748b", "Fog Path & Bands", "Graduated grey by fog density: darkest in the ≤200 ft path fog floods through, lightening up the slopes (200–350, 350–500, 500–1000 ft) as fog thins."],
];

// Two-colour solar exposure ramp: light yellow above the flat-ground
// irradiation for the selected season, light brown below. Cells within
// ±3% of flat are dropped so the base map reads as "city average".
const SOLAR_BANDS = [
  ["#fef3c7", "More sun than flat", "Light yellow — slopes that beat flat-ground irradiation in the selected season (mostly south-facing)."],
  ["#c4a574", "Shaded vs flat", "Light brown — slopes that fall short of flat-ground (mostly north-facing)."],
];

const SEASONS = [
  { key: "annual",  label: "Annual" },
  { key: "winter",  label: "Winter" },
  { key: "equinox", label: "Spring / Fall" },
  { key: "summer",  label: "Summer" },
];

// Solar declination + noon altitude at a given lat / day-of-year.
function noonAltitudeDeg(latDeg, day) {
  const decl = 23.44 * Math.sin((2 * Math.PI * (day - 81)) / 365);
  return 90 - latDeg + decl;
}
function dayOfYearToday() {
  const d = new Date();
  const start = new Date(d.getFullYear(), 0, 0);
  return Math.floor((d - start) / 86400000);
}

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
  showSolar, onToggleSolar,
  solarSeason, onSelectSolarSeason,
  showTerrain, onToggleTerrain,
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
  // Skip the very next suggest-fetch after a pick so the dropdown
  // doesn't re-open over the just-confirmed selection.
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
    suppressNextFetchRef.current = true;
    setQ(sug.place_name);
    setSugs([]);
    setOpen(false);
    onPickFromAddress(sug.center, sug.place_name);
  };

  return (
    <aside className="fog-sidebar">
      <header className="fog-h">
        <a className="fog-topbar-lbl" href="/" style={{ display: "inline-block", marginBottom: 8 }}>← UrMicroLife</a>
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
      {picked?.point && (
        <div className="fog-legend" style={{ marginTop: 2 }}>
          <div className="fog-legend-title">Marked location</div>
          {picked.address && <div className="fog-ac-name">{picked.address}</div>}
          <SunAltitudePanel lat={picked.point[1]} />
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
          <div style={{ marginTop: 10, paddingTop: 8, borderTop: "1px solid rgba(148, 163, 184, 0.2)" }}>
            <div className="fog-legend-label" style={{ color: "#fbbf24", fontWeight: 700, marginBottom: 4 }}>
              Solar Exposure
            </div>
            <div className="fog-legend-range" style={{ display: "block", marginBottom: 8 }}>
              Modelled annual sun. The orange &quot;city average&quot; band is hidden so the base map shows — everyone gets some sun.
            </div>
            {SOLAR_BANDS.map(([color, name, desc]) => (
              <div key={name} className="fog-legend-row" style={{ gridTemplateColumns: "24px 1fr", marginTop: 4 }}>
                <span
                  aria-hidden="true"
                  style={{
                    display: "inline-block",
                    width: 18,
                    height: 18,
                    borderRadius: 4,
                    background: color,
                    border: "1px solid rgba(0,0,0,0.25)",
                    alignSelf: "center",
                  }}
                />
                <span>
                  <span className="fog-legend-label" style={{ color }}>{name}</span>
                  <span className="fog-legend-range" style={{ display: "block" }}>{desc}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ToggleSwitch checked={showSun} onChange={onToggleSun} label="Sun pockets" help="≥20° south-facing warm slopes." />
      <ToggleSwitch checked={showCool} onChange={onToggleCool} label="Cool / shade" help="≥20° north-facing cooler slopes." />
      <ToggleSwitch checked={showWind} onChange={onToggleWind} label="Wind corridors" help="Wind-channeling valleys." />
      <ToggleSwitch checked={showFog} onChange={onToggleFog} label="Fog path & bands" help="Grey by density: dense in the lows, thinning up the slopes." />
      <ToggleSwitch checked={showSolar} onChange={onToggleSolar} label="Solar exposure" help="Light yellow = above flat-ground sun, light brown = below. Switch seasons to see how aspect matters more in winter than summer." />
      {showSolar && (
        <div className="fog-legend" style={{ padding: "10px 12px", marginTop: 0 }}>
          <div className="fog-legend-title" style={{ marginBottom: 6 }}>Season</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {SEASONS.map(s => (
              <button
                key={s.key}
                type="button"
                onClick={() => onSelectSolarSeason(s.key)}
                style={{
                  flex: "1 1 auto",
                  padding: "6px 10px",
                  fontSize: 12,
                  fontWeight: 700,
                  borderRadius: 6,
                  border: solarSeason === s.key ? "1px solid #fbbf24" : "1px solid rgba(148,163,184,0.3)",
                  background: solarSeason === s.key ? "rgba(251, 191, 36, 0.15)" : "transparent",
                  color: solarSeason === s.key ? "#fbbf24" : "#cbd5e1",
                  cursor: "pointer",
                  letterSpacing: 0.3,
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}
      <ToggleSwitch checked={showTerrain} onChange={onToggleTerrain} label="Terrain" help="Hillshade relief from the Mapbox DEM — adds light/shadow depth to the hills." />
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

// Sun-altitude readout pinned to the picked location. Surfaces the
// noon altitude today plus the annual envelope (winter solstice → summer
// solstice) at this exact latitude — the same physics that drives the
// Solar Exposure layer, just made legible for one point.
function SunAltitudePanel({ lat }) {
  if (!Number.isFinite(lat)) return null;
  const today = noonAltitudeDeg(lat, dayOfYearToday());
  const winter = noonAltitudeDeg(lat, 355); // Dec 21
  const summer = noonAltitudeDeg(lat, 172); // Jun 21
  const avg = noonAltitudeDeg(lat, 80);     // Mar 21 ≈ annual mean
  const range = (summer - winter).toFixed(0);
  const row = (label, val, color) => (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "2px 0", fontSize: 12 }}>
      <span style={{ color: "#94a3b8" }}>{label}</span>
      <span style={{ color, fontWeight: 700 }}>{val.toFixed(0)}°</span>
    </div>
  );
  return (
    <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid rgba(148, 163, 184, 0.2)" }}>
      <div className="fog-legend-title" style={{ marginBottom: 4 }}>Solar Noon Altitude</div>
      <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 6, fontStyle: "italic" }}>
        Sun angle above the horizon at midday, lat&nbsp;{lat.toFixed(2)}°.
        The ~{range}° annual swing is what makes winter slopes contrast and summer slopes blend.
      </div>
      {row("Today", today, "#fbbf24")}
      {row("Winter solstice", winter, "#7dd3fc")}
      {row("Annual avg",     avg,    "#cbd5e1")}
      {row("Summer solstice", summer, "#fdba74")}
    </div>
  );
}
