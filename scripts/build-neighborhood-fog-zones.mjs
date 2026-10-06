// Each fog-map neighborhood's fog zone, from the ground it covers rather
// than one number: the neighborhood is sampled on a ~45 m grid against the
// fog contours (public/data/sf-fog-contours.geojson).
//
//   Transition      — 10%+ of its ground in the 8.5-hour band (the line
//                     between sun and fog), or 10%+ on each side of it
//   Sun             — otherwise, ground under 8.5 hours
//   Fog             — otherwise, ground at 9+ hours, averaging under 11
//   Persistent Fog  — ground at 9+ hours, averaging 11 or more
//
// The 10% floor keeps a sliver along an edge from flipping a neighborhood.
//
//   node scripts/build-neighborhood-fog-zones.mjs
//   → public/data/neighborhood-fog-zones.json  { name: {zone, mean, sun, band, fog} }

import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { findContourForPoint } from "../app/fog/lib/spatial.js";

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
  const sun = hrs.filter(h => h < 8.5).length / n;
  const band = hrs.filter(h => h >= 8.5 && h < 9).length / n;
  const fog = hrs.filter(h => h >= 9).length / n;
  const mean = hrs.reduce((a, h) => a + h, 0) / n;
  const zone =
    band >= MIN || (sun >= MIN && fog >= MIN) ? "Transition"
    : sun > fog ? "Sun"
    : mean >= 11 ? "Persistent Fog" : "Fog";
  const r2 = v => Math.round(v * 100) / 100;
  out[name] = { zone, mean: r2(mean), sun: r2(sun), band: r2(band), fog: r2(fog) };
}

writeFileSync(join(DATA, "neighborhood-fog-zones.json"), JSON.stringify(out));
const tally = Object.values(out).reduce((t, v) => ((t[v.zone] = (t[v.zone] || 0) + 1), t), {});
console.log(`fog zones: ${Object.keys(out).length} neighborhoods`, tally);
