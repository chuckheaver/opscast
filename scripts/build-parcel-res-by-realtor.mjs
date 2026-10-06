// Residential parcel stock per SFAR neighborhood (realtor code, e.g. 5m),
// from the map's own z16 parcel tiles — for the report's Latent Inventory
// page, which lists every neighborhood on its own.
//
// Buckets match public/data/parcel-res-by-neighborhood.json: u1 (one unit),
// u2_4, u5_9, u10, othr (non-residential), total. Parcels repeat across tile
// edges, so each blklot counts once, placed by its center.
//
// Writes public/data/parcel-res-by-realtor.json: { nid: {name, u1, …} } and
// public/data/parcel-res-by-fog.json: { neighborhood: {u1, …, units2} }.
// Re-run when the parcel tiles or the realtor map change:
//   node scripts/build-parcel-res-by-realtor.mjs

import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { VectorTile } from "@mapbox/vector-tile";
import Pbf from "pbf";
import { findNeighborhoodForPoint } from "../app/fog/lib/spatial.js";

const Z = 16, TDIR = `public/tiles/parcels/${Z}`;
const tile2lng = (x, z) => (x / 2 ** z) * 360 - 180;
const tile2lat = (y, z) => { const n = Math.PI - (2 * Math.PI * y) / 2 ** z; return (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n))); };
const realtor = JSON.parse(readFileSync("public/data/sf-realtor-neighborhoods.geojson", "utf8"));
const fog = JSON.parse(readFileSync("public/data/sf-fog-neighborhoods.geojson", "utf8"));

const seen = new Map();   // blklot → {t, units, pt}
for (const x of readdirSync(TDIR)) for (const f of readdirSync(`${TDIR}/${x}`)) {
  const y = +f.replace(".pbf", "");
  const layer = new VectorTile(new Pbf(readFileSync(`${TDIR}/${x}/${f}`))).layers.parcels;
  if (!layer) continue;
  for (let i = 0; i < layer.length; i++) {
    const ft = layer.feature(i);
    const bl = ft.properties.blklot;
    if (ft.type !== 3 || !bl || seen.has(bl)) continue;
    const ring = ft.loadGeometry()[0];
    const cx = ring.reduce((a, p) => a + p.x, 0) / ring.length, cy = ring.reduce((a, p) => a + p.y, 0) / ring.length;
    // Keep the copy whose center falls inside its own tile (not a buffer copy).
    if (cx < 0 || cy < 0 || cx > layer.extent || cy > layer.extent) continue;
    seen.set(bl, { t: ft.properties.t, units: Number(ft.properties.units) || 0,
      pt: [tile2lng(+x + cx / layer.extent, Z), tile2lat(y + cy / layer.extent, Z)] });
  }
}
const out = {}; let outside = 0;
for (const { t, units, pt } of seen.values()) {
  const r = findNeighborhoodForPoint(realtor, pt);
  if (!r?.properties?.nid) { outside++; continue; }
  const k = r.properties.nid;
  const o = out[k] || (out[k] = { name: r.properties.nbrhood, district: r.properties.district_num, u1: 0, u2_4: 0, u5_9: 0, u10: 0, othr: 0, total: 0 });
  const res = t === "RES" && units > 0;
  const b = !res ? "othr" : units === 1 ? "u1" : units <= 4 ? "u2_4" : units <= 9 ? "u5_9" : "u10";
  o[b]++; o.total++;
}
writeFileSync("public/data/parcel-res-by-realtor.json", JSON.stringify(out));

// The same stock per neighborhood in our own database (the site's map /
// guide neighborhoods) — what the market report lists, one row each.
// units2: housing units in buildings of 2+ units, residential or mixed use
// (the condo / TIC stock).
const byFog = {};
for (const { t, units, pt } of seen.values()) {
  const f = findNeighborhoodForPoint(fog, pt);
  if (!f) continue;
  const k = f.properties.name;
  const o = byFog[k] || (byFog[k] = { u1: 0, u2_4: 0, u5_9: 0, u10: 0, othr: 0, total: 0, units2: 0 });
  const res = t === "RES" && units > 0;
  const b = !res ? "othr" : units === 1 ? "u1" : units <= 4 ? "u2_4" : units <= 9 ? "u5_9" : "u10";
  o[b]++; o.total++;
  if (units >= 2 && (t === "RES" || t === "MIX")) o.units2 += units;   // condo towers are often coded mixed use
}
writeFileSync("public/data/parcel-res-by-fog.json", JSON.stringify(byFog));
console.log(`by neighborhood: ${Object.keys(byFog).length} neighborhoods; one-unit ${Object.values(byFog).reduce((a, o) => a + o.u1, 0).toLocaleString()}, units in 2+ unit buildings ${Object.values(byFog).reduce((a, o) => a + o.units2, 0).toLocaleString()}`);
const T = k => Object.values(out).reduce((a, o) => a + o[k], 0);
console.log(`${seen.size.toLocaleString()} parcels → ${Object.keys(out).length} SFAR neighborhoods; one-unit ${T("u1").toLocaleString()}, total ${T("total").toLocaleString()}, outside ${outside}`);
