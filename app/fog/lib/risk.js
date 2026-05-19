// Fog-hours → color + human label.
//
// Values are AVERAGE SUMMER fog/low-cloud hours per day (USGS GOES, 1999–2009).
// SF observed range: ~6 hrs/day (NE bayside) to ~13 hrs/day (Outer Sunset).
//
// Three zones with sharp boundaries:
//   • Sun         — 0–8.5 hrs/day  → flat bright yellow
//   • Transition  — 8.6–9          → yellow → grey blend
//   • Fog         — 9+             → gradient from light grey to near-black
//
// `riskColorStops` is consumed by a Mapbox `interpolate` expression:
//   ["interpolate", ["linear"], <input>, ...stops.flat()]
//
// Stops calibrated to the observed SF data range (6.3 → 12.5 hrs/day),
// so the foggiest neighborhood actually hits the darkest grey.
export const riskColorStops = [
  [0,    "#fbbf24"], // Sun        — bright amber
  [8.5,  "#fbbf24"], // Sun        — flat to here
  [9,    "#d6d3d1"], // Fog start  — light grey
  [10.5, "#78716c"], // Fog        — mid grey
  [12.5, "#292524"], // Fog peak   — near-black (SF max ≈ 12.5)
];

export function fogColor(hours) {
  const h = Number.isFinite(hours) ? hours : 0;
  for (let i = riskColorStops.length - 1; i >= 0; i--) {
    if (h >= riskColorStops[i][0]) return riskColorStops[i][1];
  }
  return riskColorStops[0][1];
}

// Three-zone bucketing matching the color gradient.
export function fogLabel(hours) {
  if (hours >= 9) return "Fog";
  if (hours >= 8.6) return "Transition";
  return "Sun";
}
