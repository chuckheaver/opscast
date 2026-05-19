// Fog-hours → color + human label.
//
// Values are AVERAGE SUMMER fog/low-cloud hours per day (USGS GOES, 1999–2009).
// SF observed range: ~6 hrs/day (NE bayside) to ~13 hrs/day (Outer Sunset).
//
// Three zones with sharp boundaries:
//   • Sun         — < 8.0 hrs/day  → flat bright yellow
//   • Transition  — 8.0–8.6        → partly-cloudy pattern, density steps
//                                    through 3 sub-bands centered on 8.3
//                                    (Buena Vista's ~50/50 anchor).
//                                    See FogMap.jsx for the patterns.
//   • Fog         — > 8.6          → light grey → near-black gradient
//
// `riskColorStops` is consumed by a Mapbox `interpolate` expression:
//   ["interpolate", ["linear"], <input>, ...stops.flat()]
//
// Stops calibrated to the observed SF data range (6.3 → 12.5 hrs/day),
// so the foggiest neighborhood actually hits the darkest grey. The
// transition zone (8.0–8.6) is rendered as a separate pattern layer
// on top of this base gradient.
export const riskColorStops = [
  [0,    "#fde047"], // Sun       — bright yellow
  [8.0,  "#fde047"], // Sun       — flat to here
  [8.6,  "#d6d3d1"], // Fog start — light grey
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
  if (hours > 8.6) return "Fog";
  if (hours >= 8.0) return "Transition";
  return "Sun";
}

// Used by FogMap.jsx to filter the partly-cloudy pattern overlay layer
// to just the transition band.
export const TRANSITION_RANGE = [8.0, 8.6];

// Sub-band thresholds *within* the transition zone, used by the FogMap
// step expression to pick which cloud-density pattern to render. Anchored
// on Buena Vista (8.3) ≈ 50/50 fog/sun:
//   [8.0, 8.2) → "light"  — sparse clouds, mostly sunny
//   [8.2, 8.4) → "mid"    — balanced (the 50/50 zone)
//   [8.4, 8.6] → "heavy"  — denser clouds, edge of full fog
export const TRANSITION_DENSITY_STEPS = {
  midStart: 8.2,
  heavyStart: 8.4,
};
