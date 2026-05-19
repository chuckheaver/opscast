// Fog-hours → color + human label.
//
// Values are AVERAGE SUMMER fog/low-cloud hours per day (USGS GOES, 1999–2009).
// SF observed range: ~6 hrs/day (NE bayside) to ~13 hrs/day (Outer Sunset).
//
// Three zones:
//   • Sun         — low fog          → bright yellow
//   • Transition  — mid-range hours  → warm beige fading to cool grey
//   • Fog         — high fog         → dark grey
//
// `riskColorStops` is consumed by a Mapbox `interpolate` expression:
//   ["interpolate", ["linear"], <input>, ...stops.flat()]

export const riskColorStops = [
  [4,  "#fbbf24"], // Sun        — bright amber
  [6,  "#fde68a"], // Sun        — pale yellow
  [8,  "#d6d3d1"], // Transition — warm light grey
  [10, "#a8a29e"], // Transition — mid grey
  [12, "#57534e"], // Fog        — dark grey
  [14, "#292524"], // Fog        — near-black
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
  if (hours >= 11) return "Fog";
  if (hours >= 8)  return "Transition";
  return "Sun";
}
