// Fog-hours → color + human label.
//
// Values are AVERAGE SUMMER fog/low-cloud hours per day (USGS GOES, 1999–2009).
// SF observed range: ~6 hrs/day (NE bayside, Fishermans Wharf) to
// ~13 hrs/day (Outer Sunset, Parkmerced, Lake Merced).
//
// The color scale runs from warm beige (low fog) to deep slate-blue (heavy
// marine layer). Stops cover the full plausible SF range so neighborhoods
// near the extremes don't clamp.
//
// `riskColorStops` is consumed by a Mapbox `interpolate` expression:
//   ["interpolate", ["linear"], <input>, ...stops.flat()]

export const riskColorStops = [
  [4,  "#f3eee5"],
  [6,  "#e8d4a8"],
  [8,  "#b7c5cf"],
  [10, "#7f9ab0"],
  [12, "#4d6f8c"],
  [14, "#1e3a5f"],
];

export function fogColor(hours) {
  const h = Number.isFinite(hours) ? hours : 0;
  for (let i = riskColorStops.length - 1; i >= 0; i--) {
    if (h >= riskColorStops[i][0]) return riskColorStops[i][1];
  }
  return riskColorStops[0][1];
}

export function fogLabel(hours) {
  if (hours >= 12) return "Famously socked-in";
  if (hours >= 10) return "Frequently foggy";
  if (hours >= 8)  return "Often misty";
  if (hours >= 6)  return "Occasionally foggy";
  return "Mostly clear";
}
