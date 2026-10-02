// Ground incline at every sale in public/data/sf-listings.geojson, from the
// 10 m USGS elevation model in data/raw (the same raster /api/elevation
// reads). Same method as the map's Quick Peek: sample 20 m north, south,
// east and west and take the steepest grade across the 40 m.
//
// Writes data/sale-incline.json: { listingId: inclinePercent }.
// Re-run after every listings rebuild:  node scripts/build-sale-incline.mjs

import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { fromFile } from "geotiff";

const dir = "data/raw";
const tifName = readdirSync(dir).find(f => f.toLowerCase().endsWith(".tif"));
const img = await (await fromFile(`${dir}/${tifName}`)).getImage();
const [west, south, east, north] = img.getBoundingBox();
const W = img.getWidth(), H = img.getHeight();
const elev = (await img.readRasters())[0];

const metersAt = (lng, lat) => {
  if (lng < west || lng > east || lat < south || lat > north) return null;
  const col = Math.min(W - 1, Math.max(0, Math.floor(((lng - west) / (east - west)) * W)));
  const row = Math.min(H - 1, Math.max(0, Math.floor(((north - lat) / (north - south)) * H)));
  const m = elev[row * W + col];
  return Number.isFinite(m) ? m : null;
};

const D = 20, M_LAT = 110_540;
const geo = JSON.parse(readFileSync("public/data/sf-listings.geojson", "utf8"));
const out = {};
let n = 0, missing = 0;
for (const f of geo.features) {
  const [lng, lat] = f.geometry?.coordinates || [];
  const id = f.properties?.id;
  if (!id || !Number.isFinite(lng) || !Number.isFinite(lat)) continue;
  const dLat = D / M_LAT, dLng = D / (111_320 * Math.cos((lat * Math.PI) / 180));
  const s = [metersAt(lng, lat + dLat), metersAt(lng, lat - dLat), metersAt(lng + dLng, lat), metersAt(lng - dLng, lat)];
  if (s.some(v => v == null)) { missing++; continue; }
  out[id] = Math.round(100 * Math.hypot((s[0] - s[1]) / (2 * D), (s[2] - s[3]) / (2 * D)));
  n++;
}
writeFileSync("data/sale-incline.json", JSON.stringify(out));
const steep = Object.values(out).filter(v => v >= 15).length;
console.log(`wrote data/sale-incline.json — ${n.toLocaleString()} sales, ${missing} outside the model; ${steep.toLocaleString()} at 15%+`);
