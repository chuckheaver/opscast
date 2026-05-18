// Fog-hours → color + human label.
//
// The color scale is a low-saturation gradient from warm beige (low fog)
// to deep slate-blue (high fog). Stops are tuned to the SF reality —
// the foggiest western neighborhoods (Outer Sunset, Outer Richmond) sit
// around 1500–2000 hours/year, while the southeastern Mission/Bernal
// areas can be in the 200–400 range.
//
// `riskColorStops` is consumed by a Mapbox `interpolate` expression:
//   ["interpolate", ["linear"], <input>, ...stops.flat()]

export const riskColorStops = [
  [0,    "#f3eee5"],
  [400,  "#e8d4a8"],
  [800,  "#b7c5cf"],
  [1200, "#7f9ab0"],
  [1600, "#4d6f8c"],
  [2000, "#1e3a5f"],
];

export function fogColor(hours) {
  const h = Number.isFinite(hours) ? hours : 0;
  for (let i = riskColorStops.length - 1; i >= 0; i--) {
    if (h >= riskColorStops[i][0]) return riskColorStops[i][1];
  }
  return riskColorStops[0][1];
}

export function fogLabel(hours) {
  if (hours >= 1500) return "Famously socked-in";
  if (hours >= 1000) return "Frequently foggy";
  if (hours >= 600)  return "Often misty";
  if (hours >= 300)  return "Occasionally foggy";
  return "Mostly clear";
}
