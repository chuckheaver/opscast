#!/usr/bin/env node
//
// Build pipeline: USGS 10 m DEM ──► refined "wind" zones in
//                 public/data/sf-microclimates.geojson
//
// Replaces the old direction-agnostic wind-corridor zones (valley floors)
// with a wind-EXPOSURE model for SF's prevailing W/NW wind:
//
//   • Upwind shelter — for each ~20 m cell, scan toward W / WNW / NW and
//     take the max horizon angle (how steeply terrain rises upwind). The
//     smallest of the three is the cell's best-case exposure.
//   • Coastal fringe — low ground with open water a short distance upwind
//     (Ocean Beach, Lands End, Baker Beach, Crissy Field, the Marina).
//   • Windward faces & crests — W/NW-facing slopes and locally-high ridge
//     tops with nothing sheltering them upwind (Twin Peaks, Mt Davidson…).
//   • Wind gaps — low corridors open to the west that funnel wind between
//     the hills (Golden Gate Park / Panhandle, the Alemany gap).
//   • Manual additions (can't be derived from terrain alone): the Golden
//     Gate strait over the water, and the Van Ness + Market Street
//     corridor, whose wind is partly a high-rise canyon effect.
//
// Usage:  node scripts/build-wind-exposure.mjs          (debug outputs only)
//         node scripts/build-wind-exposure.mjs --apply  (also update geojson)

import { fromFile } from "geotiff";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const RAW_DIR = join(ROOT, "data", "raw");
const TMP_DIR = join(ROOT, "data", "tmp");
const OUT_PATH = join(ROOT, "public", "data", "sf-microclimates.geojson");
const DEBUG_BMP = join(TMP_DIR, "wind-debug.bmp");
const APPLY = process.argv.includes("--apply");

// ── Tunables ───────────────────────────────────────────────────────────────
const F = 2;                       // DEM cells per analysis block (≈20 m)
const BEARINGS = [270, 292.5, 315]; // upwind scan directions (wind FROM W→NW)
const SCAN_MAX_M = 1500;           // how far upwind to look
const SCAN_STEP_M = 40;            // sampling step along the scan
const WATER_ELEV_M = 0.5;          // cells at/below this count as open water
const TPI_RADIUS = 7;              // blocks (~140 m) for ridge/valley test

// Category thresholds (degrees are upwind horizon angles).
const COAST_WATER_DIST_M = 1100;   // "near the water" fringe depth
const COAST_MAX_SHELTER = 3;       // fringe must still be fairly open upwind
const FACE_MIN_SLOPE = 12;         // windward-face minimum steepness
const FACE_ASPECT = [235, 350];    // faces pointing WSW→NNW catch the wind
const FACE_MAX_SHELTER = 3;        // ...unless a taller ridge shelters them
const CREST_MIN_TPI = 6;           // metres above local mean = ridge/peak
const CREST_MIN_ELEV_M = 45;       // ignore tiny bumps
const CREST_MAX_SHELTER = 3;
const GAP_MAX_TPI = -2.5;          // metres below local mean = gap/valley
const GAP_MAX_SHELTER = 3;         // gap must be reasonably open to the west
const GAP_MAX_ELEV_M = 90;
// Open corridor: low, flat ground with a nearly unobstructed straight shot
// to the ocean (the Golden Gate Park / Sunset swath the sea breeze pours
// down). Distinct from the coast fringe, which is depth-limited.
const CORRIDOR_MAX_SHELTER = 0.6;
const CORRIDOR_WATER_DIST_M = 3000;
const CORRIDOR_MAX_ELEV_M = 60;
const MIN_NEIGHBORS = 3;           // de-speckle

function findDem() {
  const tif = readdirSync(RAW_DIR).find(f => /\.tiff?$/i.test(f));
  return tif ? join(RAW_DIR, tif) : null;
}
function run(args) {
  console.log("» mapshaper", args.join(" "));
  execFileSync("npx", ["--no-install", "mapshaper", ...args], { stdio: "inherit", cwd: ROOT });
}
// Chaikin corner-cutting, matching the other zone layers' smoothing.
function chaikinSmooth(ring, iterations = 2) {
  if (!ring || ring.length < 4) return ring;
  let pts = ring;
  for (let it = 0; it < iterations; it++) {
    const closed = pts[0][0] === pts[pts.length - 1][0] && pts[0][1] === pts[pts.length - 1][1];
    const n = closed ? pts.length - 1 : pts.length;
    const next = [];
    for (let i = 0; i < n; i++) {
      const p = pts[i], q = pts[(i + 1) % n];
      next.push([0.75 * p[0] + 0.25 * q[0], 0.75 * p[1] + 0.25 * q[1]]);
      next.push([0.25 * p[0] + 0.75 * q[0], 0.25 * p[1] + 0.75 * q[1]]);
    }
    if (closed) next.push(next[0].slice());
    pts = next;
  }
  return pts;
}

// Minimal 24-bit BMP writer for the debug rendering (no image deps needed).
function writeBmp(path, w, h, rgb /* Uint8Array w*h*3, row 0 = top */) {
  const rowPad = (4 - ((w * 3) % 4)) % 4;
  const dataSize = (w * 3 + rowPad) * h;
  const buf = Buffer.alloc(54 + dataSize);
  buf.write("BM"); buf.writeUInt32LE(54 + dataSize, 2); buf.writeUInt32LE(54, 10);
  buf.writeUInt32LE(40, 14); buf.writeInt32LE(w, 18); buf.writeInt32LE(h, 22);
  buf.writeUInt16LE(1, 26); buf.writeUInt16LE(24, 28); buf.writeUInt32LE(dataSize, 34);
  let o = 54;
  for (let y = h - 1; y >= 0; y--) { // BMP rows run bottom-up
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 3;
      buf[o++] = rgb[i + 2]; buf[o++] = rgb[i + 1]; buf[o++] = rgb[i]; // BGR
    }
    o += rowPad;
  }
  writeFileSync(path, buf);
}

// ── Manual polygons (lng/lat) ──────────────────────────────────────────────
// Golden Gate strait + bay fan — wind pouring through the Gate over the
// water. Drawn over water (outside the land clip), appended after clipping.
const GOLDEN_GATE = [[
  [-122.5140, 37.7830], [-122.5215, 37.7900], [-122.5265, 37.8060],
  [-122.5180, 37.8180], [-122.4900, 37.8235], [-122.4560, 37.8290],
  [-122.4260, 37.8300], [-122.4030, 37.8260], [-122.3980, 37.8130],
  [-122.4120, 37.8090], [-122.4350, 37.8080], [-122.4600, 37.8070],
  [-122.4770, 37.8090], [-122.4850, 37.7990], [-122.4930, 37.7880],
  [-122.5030, 37.7810], [-122.5140, 37.7830],
]];
// Van Ness Ave corridor (Market St → the Bay) — high-rise canyon + the
// Hayes-Valley gap steering wind up the flat corridor.
const VAN_NESS = [[
  [-122.4245, 37.7745], [-122.4205, 37.7745], [-122.4205, 37.8065],
  [-122.4245, 37.8065], [-122.4245, 37.7745],
]];
// Market St corridor (Octavia → Embarcadero) — the classic downtown wind
// canyon, aligned with the westerly flow and lined with towers.
const MARKET = [[
  [-122.4262, 37.7738], [-122.4235, 37.7712], [-122.3925, 37.7935],
  [-122.3947, 37.7962], [-122.4262, 37.7738],
]];

async function main() {
  const DEM = findDem();
  if (!DEM) { console.error("No DEM .tif in data/raw/"); process.exit(1); }
  mkdirSync(TMP_DIR, { recursive: true });

  // 1. Read + coarsen the DEM ──────────────────────────────────────────────
  const tiff = await fromFile(DEM);
  const img = await tiff.getImage();
  const W = img.getWidth(), H = img.getHeight();
  const [west, south, east, north] = img.getBoundingBox();
  const nodata = img.getGDALNoData();
  const elev = (await img.readRasters())[0];
  console.log(`DEM ${W}×${H}, bbox [${west.toFixed(3)}, ${south.toFixed(3)}, ${east.toFixed(3)}, ${north.toFixed(3)}]`);

  const cw = Math.floor(W / F), ch = Math.floor(H / F);
  const z = new Float32Array(cw * ch);
  for (let cy = 0; cy < ch; cy++)
    for (let cx = 0; cx < cw; cx++) {
      let s = 0, n = 0;
      for (let dy = 0; dy < F; dy++)
        for (let dx = 0; dx < F; dx++) {
          const v = elev[(cy * F + dy) * W + (cx * F + dx)];
          if (nodata != null && v === nodata) continue;
          s += v; n++;
        }
      z[cy * cw + cx] = n ? s / n : 0;
    }

  const midLat = (north + south) / 2;
  const degLat = 111320, degLon = 111320 * Math.cos((midLat * Math.PI) / 180);
  const cellDeg = (F * (east - west)) / W;
  const dxM = cellDeg * degLon, dyM = ((F * (north - south)) / H) * degLat;
  const at = (x, y) => z[Math.min(ch - 1, Math.max(0, y | 0)) * cw + Math.min(cw - 1, Math.max(0, x | 0))];

  // 2. Per-cell wind metrics ───────────────────────────────────────────────
  // Shelter angle per upwind bearing: the max horizon angle to terrain along
  // the scan; water distance: metres to the first open-water cell upwind.
  const nSteps = Math.floor(SCAN_MAX_M / SCAN_STEP_M);
  const dirs = BEARINGS.map(b => {
    const rad = ((b - 90) * Math.PI) / 180; // compass → math angle
    // Compass bearing b = direction wind comes FROM; step toward it.
    // 270° (W) → (-1, 0) in (x, y-north-up); grid rows grow southward.
    const ux = Math.sin((b * Math.PI) / 180);   // east component
    const uy = Math.cos((b * Math.PI) / 180);   // north component
    return { sx: ux, sy: -uy }; // grid: +x east, +y south
  });

  const shelter = new Float32Array(cw * ch).fill(90);
  const waterDist = new Float32Array(cw * ch).fill(Infinity);
  for (let y = 0; y < ch; y++) {
    for (let x = 0; x < cw; x++) {
      const i = y * cw + x;
      const e0 = z[i];
      let best = 90, wBest = Infinity;
      for (const { sx, sy } of dirs) {
        let maxAng = 0, wd = Infinity;
        for (let s = 1; s <= nSteps; s++) {
          const dist = s * SCAN_STEP_M;
          const px = x + (sx * dist) / dxM;
          const py = y + (sy * dist) / dyM;
          if (px < 0 || py < 0 || px >= cw || py >= ch) break;
          const e = at(px, py);
          const ang = (Math.atan2(e - e0, dist) * 180) / Math.PI;
          if (ang > maxAng) maxAng = ang;
          if (wd === Infinity && e <= WATER_ELEV_M) wd = dist;
        }
        if (maxAng < best) best = maxAng;
        if (wd < wBest) wBest = wd;
      }
      shelter[i] = best;
      waterDist[i] = wBest;
    }
  }

  // Slope, aspect (Horn 3×3) + TPI, as in process-microclimates.mjs.
  const windy = new Uint8Array(cw * ch); // 1 coast, 2 face, 3 crest, 4 gap
  for (let y = 0; y < ch; y++) {
    for (let x = 0; x < cw; x++) {
      const i = y * cw + x;
      const e = z[i];
      if (e <= WATER_ELEV_M) continue; // water itself — clipped out anyway
      const a = at(x - 1, y - 1), b = at(x, y - 1), c = at(x + 1, y - 1);
      const d = at(x - 1, y), f = at(x + 1, y);
      const g = at(x - 1, y + 1), h = at(x, y + 1), ii = at(x + 1, y + 1);
      const dzdx = ((c + 2 * f + ii) - (a + 2 * d + g)) / (8 * dxM);
      const dzdy = ((g + 2 * h + ii) - (a + 2 * b + c)) / (8 * dyM);
      const slope = Math.atan(Math.hypot(dzdx, dzdy)) * (180 / Math.PI);
      let asp = Math.atan2(dzdy, -dzdx) * (180 / Math.PI);
      asp = (90 - asp) % 360; if (asp < 0) asp += 360;

      let sum = 0, cnt = 0;
      for (let ny = -TPI_RADIUS; ny <= TPI_RADIUS; ny++)
        for (let nx = -TPI_RADIUS; nx <= TPI_RADIUS; nx++) {
          if (nx === 0 && ny === 0) continue;
          sum += at(x + nx, y + ny); cnt++;
        }
      const tpi = e - sum / cnt;

      const sh = shelter[i];
      if (waterDist[i] <= COAST_WATER_DIST_M && sh <= COAST_MAX_SHELTER) windy[i] = 1;
      else if (slope >= FACE_MIN_SLOPE && asp >= FACE_ASPECT[0] && asp <= FACE_ASPECT[1] && sh <= FACE_MAX_SHELTER) windy[i] = 2;
      else if (tpi >= CREST_MIN_TPI && e >= CREST_MIN_ELEV_M && sh <= CREST_MAX_SHELTER) windy[i] = 3;
      else if (tpi <= GAP_MAX_TPI && e <= GAP_MAX_ELEV_M && sh <= GAP_MAX_SHELTER) windy[i] = 4;
      else if (sh <= CORRIDOR_MAX_SHELTER && waterDist[i] <= CORRIDOR_WATER_DIST_M && e <= CORRIDOR_MAX_ELEV_M) windy[i] = 5;
    }
  }

  // De-speckle.
  const cleaned = new Uint8Array(windy);
  for (let y = 0; y < ch; y++)
    for (let x = 0; x < cw; x++) {
      if (!windy[y * cw + x]) continue;
      let same = 0;
      for (let ny = -1; ny <= 1; ny++)
        for (let nx = -1; nx <= 1; nx++) {
          if (!nx && !ny) continue;
          const px = x + nx, py = y + ny;
          if (px >= 0 && py >= 0 && px < cw && py < ch && windy[py * cw + px]) same++;
        }
      if (same < MIN_NEIGHBORS) cleaned[y * cw + x] = 0;
    }

  const catCounts = [0, 0, 0, 0, 0, 0];
  cleaned.forEach(v => catCounts[v]++);
  console.log(`Windy cells — coast: ${catCounts[1]}, windward face: ${catCounts[2]}, crest: ${catCounts[3]}, gap: ${catCounts[4]}, corridor: ${catCounts[5]} (of ${cw * ch})`);

  // 3. Sanity checks at known locations ────────────────────────────────────
  const CHECKS = [
    ["Ocean Beach",        -122.508, 37.760, true],
    ["Lands End",          -122.505, 37.787, true],
    ["GG Park west end",   -122.500, 37.769, true],
    ["Twin Peaks summit",  -122.4477, 37.7544, true],
    ["Mt Davidson top",    -122.4545, 37.7383, true],
    ["Marina Green",       -122.4435, 37.8055, true],
    ["Crissy Field",       -122.458, 37.8043, true],
    ["Bernal summit",      -122.4145, 37.7432, true],
    ["Alemany gap",        -122.4273, 37.7323, true],
    ["Noe Valley core",    -122.4310, 37.7510, false],
    ["Inner Mission",      -122.4150, 37.7600, false],
    ["Chinatown",          -122.4067, 37.7941, false],
    ["Tenderloin",         -122.4140, 37.7840, false],
  ];
  const CAT = ["-", "coast", "face", "crest", "gap", "corridor"];
  let pass = 0;
  for (const [name, lng, lat, expectWindy] of CHECKS) {
    const x = Math.round((lng - west) / cellDeg), y = Math.round((north - lat) / cellDeg);
    const v = x >= 0 && y >= 0 && x < cw && y < ch ? cleaned[y * cw + x] : 0;
    // A point "reads windy" if any cell within ~60 m is windy (polygon edges).
    let near = v;
    for (let ny = -3; ny <= 3 && !near; ny++)
      for (let nx = -3; nx <= 3; nx++) {
        const px = x + nx, py = y + ny;
        if (px >= 0 && py >= 0 && px < cw && py < ch && cleaned[py * cw + px]) { near = cleaned[py * cw + px]; break; }
      }
    const ok = !!near === expectWindy;
    if (ok) pass++;
    console.log(`  ${ok ? "✓" : "✗"} ${name.padEnd(18)} expect ${expectWindy ? "windy " : "calm  "} got ${near ? CAT[near] : "calm"}  (shelter ${shelter[y * cw + x]?.toFixed(1)}°, waterDist ${Number.isFinite(waterDist[y * cw + x]) ? Math.round(waterDist[y * cw + x]) + "m" : "∞"})`);
  }
  console.log(`Sanity: ${pass}/${CHECKS.length} checks pass`);

  // 4. Debug BMP — grey elevation, category colours ────────────────────────
  const rgb = new Uint8Array(cw * ch * 3);
  let eMax = 0; z.forEach(v => { if (v > eMax) eMax = v; });
  for (let i = 0; i < cw * ch; i++) {
    const gLev = Math.round((Math.max(0, z[i]) / eMax) * 200) + 30;
    let r = gLev, gg = gLev, b = gLev;
    if (z[i] <= WATER_ELEV_M) { r = 190; gg = 210; b = 235; }
    const v = cleaned[i];
    if (v === 1) { r = 45; gg = 200; b = 235; }      // coast — cyan
    else if (v === 2) { r = 45; gg = 160; b = 255; } // face — blue
    else if (v === 3) { r = 150; gg = 90; b = 255; } // crest — purple
    else if (v === 4) { r = 45; gg = 235; b = 170; } // gap — green
    else if (v === 5) { r = 250; gg = 200; b = 60; } // corridor — amber
    rgb[i * 3] = r; rgb[i * 3 + 1] = gg; rgb[i * 3 + 2] = b;
  }
  writeBmp(DEBUG_BMP, cw, ch, rgb);
  console.log(`✓ debug image → ${DEBUG_BMP} (coast=cyan, face=blue, crest=purple, gap=green, corridor=amber)`);

  if (!APPLY) { console.log("(dry run — re-run with --apply to update the geojson)"); return; }

  // 5. Cells → polygons → dissolve/clip/smooth via mapshaper ───────────────
  const blkX = cellDeg, blkY = (F * (north - south)) / H;
  const cellFeats = [];
  for (let y = 0; y < ch; y++)
    for (let x = 0; x < cw; x++) {
      if (!cleaned[y * cw + x]) continue;
      const lng0 = west + x * blkX, lng1 = west + (x + 1) * blkX;
      const lat1 = north - y * blkY, lat0 = north - (y + 1) * blkY;
      cellFeats.push({
        type: "Feature", properties: { zone: "wind" },
        geometry: { type: "Polygon", coordinates: [[[lng0, lat0], [lng1, lat0], [lng1, lat1], [lng0, lat1], [lng0, lat0]]] },
      });
    }
  const NEIGH = join(ROOT, "public", "data", "sf-fog-neighborhoods.geojson");
  const raw = join(TMP_DIR, "wind-raw.geojson"), dis = join(TMP_DIR, "wind-dis.geojson");
  writeFileSync(raw, JSON.stringify({ type: "FeatureCollection", features: cellFeats }));
  run([raw, "-dissolve2", "fields=zone", "-clip", NEIGH, "-clean", "gap-fill-area=2000",
    "-simplify", "8%", "keep-shapes", "-o", dis, "format=geojson"]);
  const windFeats = JSON.parse(readFileSync(dis, "utf8")).features;
  windFeats.forEach(ft => {
    const gm = ft.geometry;
    if (!gm) return;
    if (gm.type === "Polygon") gm.coordinates = gm.coordinates.map(r => chaikinSmooth(r, 2));
    else if (gm.type === "MultiPolygon") gm.coordinates = gm.coordinates.map(p => p.map(r => chaikinSmooth(r, 2)));
  });
  // Manual polygons — appended AFTER the land clip on purpose: the strait is
  // over water, and the Van Ness/Market canyon effect isn't in the DEM.
  for (const coords of [GOLDEN_GATE, VAN_NESS, MARKET]) {
    windFeats.push({
      type: "Feature", properties: { zone: "wind" },
      geometry: { type: "Polygon", coordinates: coords.map(r => chaikinSmooth(r, 2)) },
    });
  }

  // 6. Swap the wind features inside sf-microclimates.geojson ──────────────
  const fc = JSON.parse(readFileSync(OUT_PATH, "utf8"));
  const before = fc.features.length;
  fc.features = fc.features.filter(f => f.properties?.zone !== "wind").concat(windFeats);
  fc.metadata = fc.metadata || {};
  fc.metadata.zones = fc.metadata.zones || {};
  fc.metadata.zones.wind =
    "Wind-prone areas for the prevailing W/NW flow — open coast fringe, windward W/NW faces, exposed crests, wind gaps open to the west, the Golden Gate strait, and the Van Ness/Market high-rise corridor";
  fc.metadata.windBuiltAt = new Date().toISOString();
  writeFileSync(OUT_PATH, JSON.stringify(fc));
  console.log(`✓ ${OUT_PATH}: ${before} → ${fc.features.length} features (wind: ${windFeats.length})`);
}

main();
