// Fog-hours → color + human label.
//
// Values are AVERAGE SUMMER fog/low-cloud hours per day (USGS GOES, 1999–2009).
// SF observed range: ~6 hrs/day (NE bayside) to ~13 hrs/day (Outer Sunset).
//
// Three zones with sharp boundaries:
//   • Sun         — < 8.35 hrs/day → flat bright yellow
//   • Transition  — 8.35–8.5       → sparse "scattered clouds" pattern,
//                                    weighted toward the west side of each
//                                    tile so it reads as marine layer
//                                    spilling east. See FogMap.jsx.
//   • Fog         — > 8.5          → light grey → near-black gradient
//
// `riskColorStops` is consumed by a Mapbox `interpolate` expression:
//   ["interpolate", ["linear"], <input>, ...stops.flat()]
//
// Stops calibrated to the observed SF data range (6.3 → 12.5 hrs/day),
// so the foggiest neighborhood actually hits the darkest grey. The
// transition zone (8.35–8.5) is rendered as a separate pattern layer
// on top of this base gradient.
export const riskColorStops = [
  [0,    "#fde047"], // Sun       — bright yellow
  [8.35, "#fde047"], // Sun       — flat to here
  [8.5,  "#d6d3d1"], // Fog start — light grey
  [10.5, "#78716c"], // Fog       — mid grey
  [12.5, "#292524"], // Fog peak  — near-black (SF max ≈ 12.5)
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
  if (hours > 9) return "Fog";
  if (hours >= 8) return "Transition";
  return "Sun";
}

// Used by FogMap.jsx to filter the transition fill + outline layers.
// Bands match the legend shown in the sidebar (Microclimates · Fog Hours).
export const TRANSITION_RANGE = [8, 9];
