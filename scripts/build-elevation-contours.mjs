// Build script: extract exact 50 ft + 100 ft elevation contour lines from
// the local USGS NED 10 m DEM via marching squares and write them out as
// a GeoJSON FeatureCollection (Polylines, one per contour segment, tagged
// with `ft`). Consumed by FogMap as a Mapbox vector source.
//
// Run with: npm run contours:build

import { fromFile } from "geotiff";
import { readdir, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const DEM_DIR = "./data/raw";
const OUT = "./public/data/sf-contours-50-100ft.geojson";

// Imperial elevation contours we want exact lines for — Mapbox terrain-v2
// is on a 10 m grid and can't hit these heights directly.
const LEVELS_FT = [50, 100, 200, 300, 600];
const FT_TO_M = 0.3048;

async function findDem() {
  const files = await readdir(DEM_DIR);
  return files.find(f => f.toLowerCase().endsWith(".tif"));
}

// Marching squares — emits 2-point LineStrings (lng/lat) for the contour
// at `level` (metres) within the DEM raster `elev`.
function extractContour(elev, W, H, west, south, east, north, level) {
  const features = [];
  const xStep = (east - west) / (W - 1);
  const yStep = (north - south) / (H - 1);

  // Cell (r,c) corners: TL=(r,c), TR=(r,c+1), BR=(r+1,c+1), BL=(r+1,c).
  // Convert pixel coords (col, row) → lng/lat. Row 0 is north.
  const lng = c => west + c * xStep;
  const lat = r => north - r * yStep;

  // Interpolate along an edge between two corner values (a, b) at param t
  // where t = (level - a) / (b - a) on [0,1].
  const lerp = (a, b) => (level - a) / (b - a);

  for (let r = 0; r < H - 1; r++) {
    for (let c = 0; c < W - 1; c++) {
      const tl = elev[r * W + c];
      const tr = elev[r * W + c + 1];
      const br = elev[(r + 1) * W + c + 1];
      const bl = elev[(r + 1) * W + c];
      if (!Number.isFinite(tl) || !Number.isFinite(tr) ||
          !Number.isFinite(br) || !Number.isFinite(bl)) continue;

      // Bitmask: TL=8 TR=4 BR=2 BL=1.
      let idx = 0;
      if (tl >= level) idx |= 8;
      if (tr >= level) idx |= 4;
      if (br >= level) idx |= 2;
      if (bl >= level) idx |= 1;
      if (idx === 0 || idx === 15) continue;

      // Edge crossings (pixel coords).
      const top    = [c + lerp(tl, tr), r];
      const right  = [c + 1, r + lerp(tr, br)];
      const bottom = [c + lerp(bl, br), r + 1];
      const left   = [c, r + lerp(tl, bl)];

      // Saddle resolution (cases 5 & 10) — use center average vs level.
      const center = (tl + tr + br + bl) / 4;
      const saddleAbove = center >= level;

      const segs = [];
      switch (idx) {
        case 1:  segs.push([left, bottom]); break;
        case 2:  segs.push([bottom, right]); break;
        case 3:  segs.push([left, right]); break;
        case 4:  segs.push([top, right]); break;
        case 5:
          if (saddleAbove) {
            segs.push([top, right], [left, bottom]);
          } else {
            segs.push([top, left], [bottom, right]);
          }
          break;
        case 6:  segs.push([top, bottom]); break;
        case 7:  segs.push([top, left]); break;
        case 8:  segs.push([top, left]); break;
        case 9:  segs.push([top, bottom]); break;
        case 10:
          if (saddleAbove) {
            segs.push([top, left], [bottom, right]);
          } else {
            segs.push([top, right], [left, bottom]);
          }
          break;
        case 11: segs.push([top, right]); break;
        case 12: segs.push([left, right]); break;
        case 13: segs.push([bottom, right]); break;
        case 14: segs.push([left, bottom]); break;
      }
      for (const [a, b] of segs) {
        features.push([
          [lng(a[0]), lat(a[1])],
          [lng(b[0]), lat(b[1])],
        ]);
      }
    }
  }
  return features;
}

// Greedy chain — stitch 2-point segments into longer polylines whose
// endpoints match within a small tolerance. Extends both directions
// from each seed so a single chain grows to its full natural length,
// rather than leaving the back half of each contour as separate pieces.
function chain(segments) {
  const key = ([x, y]) => `${x.toFixed(7)},${y.toFixed(7)}`;
  // endpoint key → list of {i, end} where end is 0 or 1 on segments[i]
  const adj = new Map();
  segments.forEach((seg, i) => {
    for (let end = 0; end < 2; end++) {
      const k = key(seg[end]);
      if (!adj.has(k)) adj.set(k, []);
      adj.get(k).push({ i, end });
    }
  });
  const findUnused = pts => {
    for (const { i, end } of pts) if (!used[i]) return { i, end };
    return null;
  };
  const used = new Array(segments.length).fill(false);
  const chains = [];
  for (let i = 0; i < segments.length; i++) {
    if (used[i]) continue;
    used[i] = true;
    const ch = [segments[i][0], segments[i][1]];
    // Forward
    while (true) {
      const tail = ch[ch.length - 1];
      const hit = findUnused(adj.get(key(tail)) || []);
      if (!hit) break;
      used[hit.i] = true;
      ch.push(segments[hit.i][1 - hit.end]);
    }
    // Backward
    while (true) {
      const head = ch[0];
      const hit = findUnused(adj.get(key(head)) || []);
      if (!hit) break;
      used[hit.i] = true;
      ch.unshift(segments[hit.i][1 - hit.end]);
    }
    chains.push(ch);
  }
  return chains;
}

async function main() {
  const demName = await findDem();
  if (!demName) {
    console.error("No DEM .tif found in data/raw/");
    process.exit(1);
  }
  console.log("Reading DEM:", demName);
  const tiff = await fromFile(path.join(DEM_DIR, demName));
  const img = await tiff.getImage();
  const [west, south, east, north] = img.getBoundingBox();
  const W = img.getWidth(), H = img.getHeight();
  const elev = (await img.readRasters())[0];
  console.log(`DEM ${W}×${H}, bbox [${west.toFixed(3)}, ${south.toFixed(3)}, ${east.toFixed(3)}, ${north.toFixed(3)}]`);

  const features = [];
  for (const ft of LEVELS_FT) {
    const level = ft * FT_TO_M;
    const segs = extractContour(elev, W, H, west, south, east, north, level);
    const chains = chain(segs);
    for (const c of chains) {
      features.push({
        type: "Feature",
        properties: { ft },
        geometry: { type: "LineString", coordinates: c },
      });
    }
    console.log(`  ${ft} ft (${level.toFixed(2)} m): ${segs.length} segments → ${chains.length} chains`);
  }

  await mkdir(path.dirname(OUT), { recursive: true });
  await writeFile(OUT, JSON.stringify({
    type: "FeatureCollection",
    builtAt: new Date().toISOString(),
    features,
  }));
  console.log(`Wrote ${OUT} (${features.length} features)`);
}

main().catch(e => { console.error(e); process.exit(1); });
