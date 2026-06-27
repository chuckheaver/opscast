'use client';

// Location detail for the Microclimates map, shown as a modal (mirrors the fog
// map's NeighborhoodModal). Opens when the user clicks the map, searches an
// address, or uses "find me". Starter content is the old left-rail: the picked
// location's Solar Noon Altitude readout plus the sub-climate-zone and
// solar-exposure explanations. (Refine later to surface the exact zone the
// clicked point falls in.)

import { useEffect } from "react";

const ZONES = [
  ["☀️", "#d97706", "Sun Pockets", "≥20° SE/S/SW-facing inclines — the warmest, sunniest slopes."],
  ["❄️", "#0ea5e9", "Cool / Shade", "≥20° NW/N/NE-facing inclines — far less direct sun, so cooler."],
  ["🌬️", "#0d9488", "Wind Corridors", "Valley floors & gaps that funnel and accelerate wind."],
];

const SOLAR_BANDS = [
  ["#fde68a", "More sun than flat", "Slopes that beat flat-ground irradiation in the selected season (mostly south-facing)."],
  ["#c4a574", "Shaded vs flat", "Slopes that fall short of flat-ground (mostly north-facing)."],
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

export default function MicroDetailModal({ picked, onClose }) {
  useEffect(() => {
    const onKey = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!picked?.point) return null;
  const lat = picked.point[1];
  const heading = picked.address || "Marked location";

  return (
    <div className="nh-backdrop" onClick={onClose}>
      <div className="nh-modal" onClick={e => e.stopPropagation()} role="dialog" aria-label={`${heading} microclimate detail`}>
        <button className="nh-x" onClick={onClose} aria-label="Close">×</button>

        <div style={{ fontSize: 22, fontWeight: 800, color: "#1c1917", lineHeight: 1.1, letterSpacing: "-0.5px" }}>{heading}</div>
        <div style={{ fontSize: 13, color: "#78716c", marginTop: 3 }}>Microclimate detail</div>

        {Number.isFinite(lat) && <SunAltitude lat={lat} />}

        <section style={{ marginTop: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#1c1917", marginBottom: 8 }}>Sub-Climate Zones</div>
          {ZONES.map(([emoji, color, name, desc]) => (
            <div key={name} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 18, lineHeight: 1.2 }} aria-hidden="true">{emoji}</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color }}>{name}</div>
                <div style={{ fontSize: 13, color: "#57534e", lineHeight: 1.5 }}>{desc}</div>
              </div>
            </div>
          ))}
        </section>

        <section style={{ marginTop: 8, paddingTop: 12, borderTop: "1px solid #ece8df" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Solar Exposure</div>
          <div style={{ fontSize: 13, color: "#57534e", lineHeight: 1.5, marginBottom: 8 }}>
            Modelled annual sun. The orange &quot;city average&quot; band is hidden so the base map shows — everyone gets some sun.
          </div>
          {SOLAR_BANDS.map(([color, name, desc]) => (
            <div key={name} style={{ display: "flex", gap: 10, marginTop: 6 }}>
              <span aria-hidden="true" style={{ flex: "0 0 auto", width: 18, height: 18, borderRadius: 4, background: color, border: "1px solid rgba(0,0,0,0.2)", marginTop: 1 }} />
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1c1917" }}>{name}</div>
                <div style={{ fontSize: 12.5, color: "#78716c", lineHeight: 1.5 }}>{desc}</div>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}

// Sun-altitude readout pinned to the picked location.
function SunAltitude({ lat }) {
  const today = noonAltitudeDeg(lat, dayOfYearToday());
  const winter = noonAltitudeDeg(lat, 355); // Dec 21
  const summer = noonAltitudeDeg(lat, 172); // Jun 21
  const avg = noonAltitudeDeg(lat, 80);     // Mar 21 ≈ annual mean
  const range = (summer - winter).toFixed(0);
  const row = (label, val, color) => (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", fontSize: 13.5 }}>
      <span style={{ color: "#78716c" }}>{label}</span>
      <span style={{ color, fontWeight: 700 }}>{val.toFixed(0)}°</span>
    </div>
  );
  return (
    <section style={{ marginTop: 14 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#1c1917", marginBottom: 4 }}>Solar Noon Altitude</div>
      <div style={{ fontSize: 12.5, color: "#78716c", fontStyle: "italic", lineHeight: 1.5, marginBottom: 6 }}>
        Sun angle above the horizon at midday, lat&nbsp;{lat.toFixed(2)}°. The ~{range}° annual swing is what makes winter slopes contrast and summer slopes blend.
      </div>
      {row("Today", today, "#d97706")}
      {row("Winter solstice", winter, "#0ea5e9")}
      {row("Annual avg", avg, "#78716c")}
      {row("Summer solstice", summer, "#ea7a3c")}
    </section>
  );
}
