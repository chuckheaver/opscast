// Renders the landing page's hero graphic: San Francisco's land shape split
// into its four summer-fog zones, with one dot per closed sale this year.
// Emitted as a flat SVG file so the landing page ships no geojson and does
// no work at runtime.  node scripts/build-fog-hero.mjs

import { readFileSync, writeFileSync } from "node:fs";
import { statsThrough } from "./stats-through.mjs";

const SHAPES = "public/data/map-shapes.json";
const LISTINGS = "public/data/sf-listings.geojson";
const OUT = "public/brand/sf-fog-hero.svg";

// Bounding box of the city, and the canvas it is drawn into.
const [W0, S0, E0, N0] = [-122.517, 37.705, -122.353, 37.833];
const W = 1000, H = 780;

// Dark-ground palette: the hero sits on navy, so the zones are tinted to
// read against it rather than reusing the report's print colours.
const ZONES = [
  ["Sun", "#E8B84B", 0.90],
  ["Transition", "#C9A882", 0.78],
  ["Fog", "#A8BCCD", 0.80],
  ["Persistent Fog", "#8DA2B5", 0.80],
];

const shapes = JSON.parse(readFileSync(SHAPES, "utf8"));
const geo = JSON.parse(readFileSync(LISTINGS, "utf8"));
const THROUGH = statsThrough(geo);
const year = THROUGH.slice(0, 4);

const lat0 = ((S0 + N0) / 2) * Math.PI / 180;
const sx = (E0 - W0) * Math.cos(lat0), sy = N0 - S0;
const sc = Math.min(W / sx, H / sy);
const ox = (W - sx * sc) / 2, oy = (H - sy * sc) / 2;
const X = lng => ox + (lng - W0) * Math.cos(lat0) * sc;
const Y = lat => oy + (N0 - lat) * sc;

const path = geom => {
  const parts = geom.type === "Polygon" ? [geom.coordinates] : geom.coordinates;
  let d = "";
  for (const rings of parts)
    for (const r of rings)
      d += "M" + r.map(([x, y]) => `${X(x).toFixed(1)},${Y(y).toFixed(1)}`).join(" L") + "Z";
  return d;
};

// No backdrop of any kind: the landmass sits straight on whatever it is
// placed over. A glow behind it reads as a visible box once the graphic is
// shown at full strength.
const out = [
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="San Francisco divided into four summer-fog zones, with one dot for each home sold this year">`,
];

for (const [name, fill, op] of ZONES) {
  const g = shapes.zones[name];
  if (g) out.push(`<path d="${path(g)}" fill="${fill}" fill-opacity="${op}" fill-rule="evenodd"/>`);
}
out.push(`<path d="${path(shapes.land)}" fill="none" stroke="#ffffff" stroke-opacity="0.34" stroke-width="1.1" fill-rule="evenodd"/>`);

let n = 0;
const dots = [];
for (const f of geo.features || []) {
  const p = f.properties || {};
  if (!String(p.sellingDate || "").startsWith(year) || String(p.sellingDate).slice(0, 10) > THROUGH) continue;
  if (!(Number(p.sellingPrice) > 0)) continue;
  if (p.noLocation) continue;                   // no real location — not drawn
  const c = f.geometry?.coordinates;
  if (!c) continue;
  dots.push(`<circle cx="${X(c[0]).toFixed(1)}" cy="${Y(c[1]).toFixed(1)}" r="2.1"/>`);
  n++;
}
out.push(`<g fill="#0A1A30" fill-opacity="0.70">${dots.join("")}</g>`);
out.push("</svg>");

writeFileSync(OUT, out.join("\n") + "\n");
console.log(`wrote ${OUT} — ${n.toLocaleString()} ${year} sales, ${(out.join("").length / 1024).toFixed(0)} KB`);
