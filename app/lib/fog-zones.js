// The site's four summer-fog zones, in one place. Every page, stat and build
// script that names a zone reads it from here (the market report keeps the
// same rule in reports/market/micro.py).
//
// A POINT — a property, a sale, a searched address — takes the zone of the
// fog polygon it sits in (sf-fog-contours.geojson, 0.5-hr steps):
//   Sun             8 hrs or less
//   Transition      the 8.5 polygon (over 8, under 9)
//   Fog             9 – 11 hrs
//   Persistent Fog  over 11 hrs
//
// A NEIGHBORHOOD often covers more than one zone; its category and the share
// of its ground in each zone come from scripts/build-neighborhood-fog-zones.mjs
// (public/data/neighborhood-fog-zones.json).

export const FOG_ZONES = [
  { name: "Sun", range: "8 hrs or less" },
  { name: "Transition", range: "8.5 hrs" },
  { name: "Fog", range: "9 – 11 hrs" },
  { name: "Persistent Fog", range: "over 11 hrs" },
];

export function fogZone(h) {
  if (h == null || !Number.isFinite(Number(h))) return null;
  if (h <= 8) return "Sun";
  if (h < 9) return "Transition";
  if (h <= 11) return "Fog";
  return "Persistent Fog";
}
