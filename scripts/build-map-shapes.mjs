// The city's land shape and its four summer-fog zones as ready-cut polygons,
// for the drawings that paint the zones without a map underneath (the
// landing hero, scripts/build-fog-hero.mjs; the market report's fog map takes
// the land outline from here too). node scripts/build-map-shapes.mjs
//   → public/data/map-shapes.json  { land, zones: { Sun, Transition, Fog, Persistent Fog } }
//
// Land is every fog-map neighborhood merged into one. The zones are the fog
// contours (public/data/sf-fog-contours.geojson) cut to that land. Contours
// nest, and a point takes the smallest one around it (as the fog map and
// tag-point.mjs read them), so they are laid down largest first and each
// one takes its ground away from whatever zone held it before.
//
// Each contour takes the site's zone for its hours (app/lib/fog-zones.js):
//   8 hrs or less Sun · 8.5 Transition · 9 – 11 Fog · over 11 Persistent Fog
// Re-run after the fog contours or neighborhoods change, then rebuild the hero.

import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const pc = require("polygon-clipping");
import { fogZone, FOG_ZONES } from "../app/lib/fog-zones.js";

const NEIGHBORHOODS = "public/data/sf-fog-neighborhoods.geojson";
const CONTOURS = "public/data/sf-fog-contours.geojson";
const OUT = "public/data/map-shapes.json";

const ZONES = FOG_ZONES.map(z => z.name);
const zoneOf = fogZone;

const polys = g => (g.type === "Polygon" ? [g.coordinates] : g.coordinates);
const geom = mp => (mp.length === 1 ? { type: "Polygon", coordinates: mp[0] } : { type: "MultiPolygon", coordinates: mp });
const ringArea = r => {
  let a = 0;
  for (let i = 0, j = r.length - 1; i < r.length; j = i++) a += (r[j][0] - r[i][0]) * (r[j][1] + r[i][1]);
  return Math.abs(a / 2);
};
const area = mp => mp.reduce((a, p) => a + ringArea(p[0]) - p.slice(1).reduce((b, r) => b + ringArea(r), 0), 0);
// A contour's size for the painting order: its outer outlines only, holes
// not taken out, the same measure findContourForPoint (app/fog/lib/spatial.js) uses.
const size = f => polys(f.geometry).reduce((a, p) => a + ringArea(p[0]), 0);

const N = JSON.parse(readFileSync(NEIGHBORHOODS, "utf8"));
const C = JSON.parse(readFileSync(CONTOURS, "utf8"));

const land = pc.union(...N.features.filter(f => f.geometry).map(f => polys(f.geometry)));

// Ground no contour reaches stays Sun, the same as the base colour under the
// report's fog map.
const zones = { Sun: land, Transition: [], Fog: [], "Persistent Fog": [] };
for (const f of C.features.filter(f => f.geometry).sort((a, b) => size(b) - size(a))) {
  const piece = pc.intersection(land, polys(f.geometry));
  if (!piece.length) continue;
  const z = zoneOf(f.properties.hours);
  for (const o of ZONES) if (o !== z && zones[o].length) zones[o] = pc.difference(zones[o], piece);
  zones[z] = zones[z].length ? pc.union(zones[z], piece) : piece;
}

const out = { land: geom(land), zones: {} };
for (const z of ZONES) if (zones[z].length) out.zones[z] = geom(zones[z]);

writeFileSync(OUT, JSON.stringify(out));
const share = z => (100 * area(zones[z])) / area(land);
console.log(`wrote ${OUT} — ${(JSON.stringify(out).length / 1024).toFixed(0)} KB`);
console.log("  " + ZONES.map(z => `${z} ${share(z).toFixed(1)}%`).join(" · "));
