// Each fog-map neighborhood's fog zone and the mix of zones it covers, from
// the ground it covers rather than one number: the neighborhood is sampled on
// a ~45 m grid against the fog contours (public/data/sf-fog-contours.geojson),
// and each sample takes the zone of its polygon (app/lib/fog-zones.js:
// 8 hrs or less Sun · 8.5 Transition · 9 – 11 Fog · over 11 Persistent Fog).
//
// Category:
//   Transition      — 10%+ of its ground in the 8.5 polygon, or 10%+ Sun
//                     ground and 10%+ Fog / Persistent Fog ground (it spans
//                     the sun / fog line)
//   otherwise       — the zone covering most of its ground
// The 10% floor keeps a sliver along an edge from flipping a neighborhood;
// the mix (share of ground in each zone) is kept so pages can show it.
//
//   node scripts/build-neighborhood-fog-zones.mjs
//   → public/data/neighborhood-fog-zones.json
//     { name: {zone, mean, mix: {Sun, Transition, Fog, Persistent Fog}} }

import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { findContourForPoint } from "../app/fog/lib/spatial.js";
import { fogZone, FOG_ZONES } from "../app/lib/fog-zones.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DATA = join(ROOT, "public", "data");
const C = JSON.parse(readFileSync(join(DATA, "sf-fog-contours.geojson"), "utf8"));
const N = JSON.parse(readFileSync(join(DATA, "sf-fog-neighborhoods.geojson"), "utf8"));

const STEP = 0.0004;                                  // degrees latitude, ~45 m
const KX = Math.cos((37.77 * Math.PI) / 180);
const MIN = 0.10;

const inside = (x, y, rings) => {
  let c = false;
  for (const r of rings)
    for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
      const a = r[i], b = r[j];
      if ((a[1] > y) !== (b[1] > y) && x < ((b[0] - a[0]) * (y - a[1])) / (b[1] - a[1]) + a[0]) c = !c;
    }
  return c;
};

const out = {};
for (const f of N.features) {
  const name = f.properties.name;
  const polys = f.geometry.type === "Polygon" ? [f.geometry.coordinates] : f.geometry.coordinates;
  const hrs = [];
  for (const rings of polys) {
    const xs = rings[0].map(p => p[0]), ys = rings[0].map(p => p[1]);
    for (let x = Math.min(...xs); x <= Math.max(...xs); x += STEP / KX)
      for (let y = Math.min(...ys); y <= Math.max(...ys); y += STEP) {
        if (!inside(x, y, rings)) continue;
        const h = findContourForPoint(C, [x, y])?.properties?.hours;
        if (h != null) hrs.push(h);
      }
  }
  // Too small to sample: fall back to the neighborhood's own figure.
  if (!hrs.length) hrs.push(f.properties.fogHours);
  const n = hrs.length;
  const mix = Object.fromEntries(FOG_ZONES.map(z => [z.name, hrs.filter(h => fogZone(h) === z.name).length / n]));
  const mean = hrs.reduce((a, h) => a + h, 0) / n;
  const spans = mix.Sun >= MIN && mix.Fog + mix["Persistent Fog"] >= MIN;
  const zone = mix.Transition >= MIN || spans
    ? "Transition"
    : FOG_ZONES.map(z => z.name).reduce((a, b) => (mix[b] > mix[a] ? b : a));
  const r2 = v => Math.round(v * 100) / 100;
  out[name] = { zone, mean: r2(mean), mix: Object.fromEntries(Object.entries(mix).map(([k, v]) => [k, r2(v)])) };
}

writeFileSync(join(DATA, "neighborhood-fog-zones.json"), JSON.stringify(out));
const tally = Object.values(out).reduce((t, v) => ((t[v.zone] = (t[v.zone] || 0) + 1), t), {});
console.log(`fog zones: ${Object.keys(out).length} neighborhoods`, tally);
