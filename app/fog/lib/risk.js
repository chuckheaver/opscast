// Fog-hours → color + human label.
//
// Values are AVERAGE SUMMER fog/low-cloud hours per day (USGS GOES, 1999–2009).
// SF observed range: ~6 hrs/day (NE bayside) to ~13 hrs/day (Outer Sunset).
//
// Three zones with sharp boundaries:
//   • Sun         — < 7.5 hrs/day  → flat bright yellow
//   • Transition  — 7.5–8.5        → yellow → grey blend (1-hour band)
//   • Fog         — > 8.5          → gradient from light grey to near-black
//
// `riskColorStops` is consumed by a Mapbox `interpolate` expression:
//   ["interpolate", ["linear"], <input>, ...stops.flat()]
//
// Notes:
//   - Two yellow stops at 4 and 7.5 keep the Sun zone *flat* (no gradient).
//   - The 7.5 → 8.5 stop pair forces the visible color transition into a
//     tight 1-hour band, matching the labeled "Transition" zone.
//   - Three grey stops (8.5, 11, 14) shape the Fog gradient so the
//     light-to-dark progression is visible at a glance.

export const riskColorStops = [
  [4,   "#fbbf24"], // Sun        — bright amber
  [7.5, "#fbbf24"], // Sun        — flat to here
  [8.5, "#d6d3d1"], // Transition end / Fog start — light grey
  [11,  "#78716c"], // Fog        — mid grey
  [14,  "#292524"], // Fog        — near-black
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
  if (hours > 8.5) return "Fog";
  if (hours >= 7.5) return "Transition";
  return "Sun";
}
