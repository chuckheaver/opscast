// One-time computation: for each fog neighborhood polygon, derive the
// "timeless" geographic facts the walking-tour scripts need —
//   elevation low/high band, summit (if any), seismic-zone overlap,
//   tsunami-zone overlap, straight-line distance to the Ferry Building,
//   and a slope/ADA class.
// Reads the same public/data geojsons the app uses. Writes app/field/geo.json.
//
//   node scripts/compute-neighborhood-geo.mjs

import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fromFile } from "geotiff";

const load = p => JSON.parse(readFileSync(new URL(`../public/data/${p}`, import.meta.url), "utf8"));
const hoods = load("sf-fog-neighborhoods.geojson");
const seismic = load("sf-seismic-hazards.geojson");
const tsunami = load("sf-tsunami-hazard.geojson");
const peaks = load("sf-peaks.geojson");

const FERRY = [-122.39362, 37.79556]; // Ferry Building [lng,lat]

// ---- USGS NED 10 m DEM (same raster /api/elevation samples) ----
const demDir = new URL("../data/raw/", import.meta.url);
const demFile = readdirSync(demDir).find(f => f.toLowerCase().endsWith(".tif"));
const tiff = await fromFile(path.join(demDir.pathname, demFile));
const img = await tiff.getImage();
const [DW, DS, DE, DN] = img.getBoundingBox();
const DWID = img.getWidth(), DHGT = img.getHeight();
const ELEV = (await img.readRasters())[0];
function demFt(lng, lat) {
  if (lng < DW || lng > DE || lat < DS || lat > DN) return null;
  const col = Math.min(DWID - 1, Math.max(0, Math.floor(((lng - DW) / (DE - DW)) * DWID)));
  const row = Math.min(DHGT - 1, Math.max(0, Math.floor(((DN - lat) / (DN - DS)) * DHGT)));
  const m = ELEV[row * DWID + col];
  if (!Number.isFinite(m)) return null;
  const ft = m * 3.28084;
  return ft > -20 && ft < 1300 ? ft : null; // drop nodata/ocean sentinels
}

// ---- geometry helpers (self-contained) ----
function ringsOf(geom) {
  if (!geom) return [];
  if (geom.type === "Polygon") return geom.coordinates;
  if (geom.type === "MultiPolygon") return geom.coordinates.flat();
  return [];
}
function coordsOf(geom) {
  if (!geom) return [];
  const t = geom.type, c = geom.coordinates;
  if (t === "Point") return [c];
  if (t === "LineString" || t === "MultiPoint") return c;
  if (t === "MultiLineString" || t === "Polygon") return c.flat();
  if (t === "MultiPolygon") return c.flat(2);
  return [];
}
function bbox(coords) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const [x, y] of coords) { if (x < minX) minX = x; if (y < minY) minY = y; if (x > maxX) maxX = x; if (y > maxY) maxY = y; }
  return [minX, minY, maxX, maxY];
}
function pointInRing(pt, ring) {
  const [x, y] = pt; let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j];
    if (((yi > y) !== (yj > y)) && (x < ((xj - xi) * (y - yi)) / (yj - yi) + xi)) inside = !inside;
  }
  return inside;
}
// Point in a polygon feature (outer ring minus holes), across Multi.
function pointInGeom(pt, geom) {
  if (geom.type === "Polygon") {
    const [outer, ...holes] = geom.coordinates;
    if (!pointInRing(pt, outer)) return false;
    return !holes.some(h => pointInRing(pt, h));
  }
  if (geom.type === "MultiPolygon") {
    return geom.coordinates.some(poly => {
      const [outer, ...holes] = poly;
      return pointInRing(pt, outer) && !holes.some(h => pointInRing(pt, h));
    });
  }
  return false;
}
function segIntersect(a, b, c, d) {
  const o = (p, q, r) => Math.sign((q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]));
  return o(a, c, d) !== o(b, c, d) && o(a, b, c) !== o(a, b, d);
}
// Does the hood polygon intersect ANY feature in collection fc? (bbox →
// vertex-in-either → edge cross.) Used for seismic/tsunami.
function intersectsAny(hood, fc) {
  const hRings = ringsOf(hood.geometry);
  const hCoords = hRings.flat();
  const hb = bbox(hCoords);
  for (const f of fc.features) {
    const g = f.geometry; if (!g) continue;
    const oRings = ringsOf(g); if (!oRings.length) continue;
    const oCoords = oRings.flat();
    const ob = bbox(oCoords);
    if (hb[2] < ob[0] || ob[2] < hb[0] || hb[3] < ob[1] || ob[3] < hb[1]) continue; // bbox reject
    if (oCoords.some(p => pointInGeom(p, hood.geometry))) return true;
    if (hCoords.some(p => pointInGeom(p, g))) return true;
    // edge crossings
    for (const hr of hRings) for (let i = 0; i < hr.length - 1; i++)
      for (const or of oRings) for (let k = 0; k < or.length - 1; k++)
        if (segIntersect(hr[i], hr[i + 1], or[k], or[k + 1])) return true;
  }
  return false;
}
function haversineMi(a, b) {
  const R = 3958.8, toR = d => (d * Math.PI) / 180;
  const dLat = toR(b[1] - a[1]), dLng = toR(a[0] - b[0]);
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(toR(a[1])) * Math.cos(toR(b[1])) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(s));
}
function centroid(geom) {
  const rings = ringsOf(geom);
  let best = null, bestA = -Infinity;
  for (const ring of rings) {
    let a = 0; for (let i = 0; i < ring.length - 1; i++) a += ring[i][0] * ring[i + 1][1] - ring[i + 1][0] * ring[i][1];
    if (Math.abs(a) > bestA) { bestA = Math.abs(a); best = ring; }
  }
  if (!best) return null;
  let x = 0, y = 0, a2 = 0;
  for (let i = 0; i < best.length - 1; i++) {
    const cr = best[i][0] * best[i + 1][1] - best[i + 1][0] * best[i][1];
    a2 += cr; x += (best[i][0] + best[i + 1][0]) * cr; y += (best[i][1] + best[i + 1][1]) * cr;
  }
  return a2 ? [x / (3 * a2), y / (3 * a2)] : best[0];
}

// ---- per-neighborhood ----
const out = {};
for (const f of hoods.features) {
  const name = f.properties.name;
  if (!name) continue;
  const c = centroid(f.geometry);

  // Elevation: sample the DEM on a grid inside the polygon, take min/max.
  const hb = bbox(ringsOf(f.geometry).flat());
  const span = Math.max(hb[2] - hb[0], hb[3] - hb[1]);
  const step = Math.max(span / 45, 0.0004); // ~45-cell grid, ~40 m floor
  const samples = [];
  for (let lng = hb[0]; lng <= hb[2]; lng += step) {
    for (let lat = hb[1]; lat <= hb[3]; lat += step) {
      if (!pointInGeom([lng, lat], f.geometry)) continue;
      const ft = demFt(lng, lat);
      if (ft != null) samples.push(ft);
    }
  }
  // Fall back to the centroid if the grid was too coarse for a tiny polygon.
  if (!samples.length && c) { const ft = demFt(c[0], c[1]); if (ft != null) samples.push(ft); }
  const summitsInside = peaks.features.filter(pk => pointInGeom(pk.geometry.coordinates, f.geometry));
  const topPeak = summitsInside.sort((a, b) => b.properties.ele_ft - a.properties.ele_ft)[0] || null;

  const sorted = samples.slice().sort((a, b) => a - b);
  const q = p => (sorted.length ? sorted[Math.min(sorted.length - 1, Math.floor(p * (sorted.length - 1)))] : 0);
  const sMin = sorted.length ? sorted[0] : 0;
  const sMax = sorted.length ? sorted[sorted.length - 1] : 0;
  const elevLow = Math.max(0, Math.round(sMin / 10) * 10);
  const elevHigh = Math.round(Math.max(sMax, topPeak ? topPeak.properties.ele_ft : 0) / 10) * 10;
  // Slope class from the *typical* terrain (10th–90th pct), so a polygon that
  // merely clips one hilly corner isn't mislabeled "steep".
  const typicalSpread = q(0.9) - q(0.1);
  const slope = typicalSpread >= 200 ? "steep" : typicalSpread >= 90 ? "rolling" : "flat";

  out[name] = {
    elevLow,
    elevHigh,
    slope,
    summit: topPeak ? { name: topPeak.properties.name || null, ft: topPeak.properties.ele_ft } : null,
    seismic: intersectsAny(f, seismic),
    tsunami: intersectsAny(f, tsunami),
    ferryMi: c ? Math.round(haversineMi(c, FERRY) * 10) / 10 : null,
  };
}

writeFileSync(new URL("../app/field/geo.json", import.meta.url), JSON.stringify(out, null, 0));
console.log("wrote app/field/geo.json for", Object.keys(out).length, "neighborhoods");
// quick sample
for (const n of ["Castro", "Marina", "Bernal Heights", "South of Market", "Mt. Davidson Manor", "Treasure Island", "Outer Sunset"]) {
  if (out[n]) console.log(n.padEnd(20), JSON.stringify(out[n]));
}
