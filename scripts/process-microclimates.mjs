#!/usr/bin/env node
//
// Build pipeline: USGS 10 m DEM (data/raw/*.tif)
//                 ──►  public/data/sf-microclimates.geojson
//
// Derives terrain-driven SUB-microclimate zones for SF from elevation:
//   ☀️  sun-pocket      — south-facing slopes (warm, sheltered, sunnier)
//   🌬️  wind-corridor   — valley floors / gaps that channel wind
//   🌫️  persistent-fog  — high west/ocean-facing ridges where fog banks up
//
// Method (all pure-JS, no GDAL): read the DEM with `geotiff`, downsample to
// a ~50 m analysis grid, compute slope + aspect (Horn 3×3) and a Topographic
// Position Index (valley vs. ridge), classify each coarse cell, emit a square
// polygon per classified cell, then dissolve + smooth with mapshaper.

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
const CONTOURS_OUT = join(ROOT, "public", "data", "sf-contours.geojson");

// ── Tunable classification thresholds ──────────────────────────────────────
const DOWNSAMPLE = 2;          // DEM cells per analysis block (≈10 m → ≈20 m)
const TPI_RADIUS = 7;          // neighbourhood radius (blocks) for valley test
// sun-pocket: a 20–30° incline facing the sun (SE → S → SW). Slope is the
// "estimated incline degrees" the user described — computed straight from
// the elevation gradient (rise/run), which is what topo-line spacing encodes.
const SUN_ASPECT = [112.5, 247.5]; // SE → SW (compass degrees)
const SUN_SLOPE = [20, 30];        // degrees (per spec)
// cool-shade: north-facing inclines — far less direct sun, so cooler.
const COOL_MIN_SLOPE = 15;     // degrees (a real incline, not flat ground)
// (north aspect handled in code: ≥ 292.5° or ≤ 67.5°, i.e. NW → N → NE)
// persistent-fog: high AND west-facing (sits between sun & cool aspects).
const FOG_ASPECT = [247.5, 300]; // W → WNW
const FOG_MIN_ELEV = 80;       // metres
const FOG_MIN_SLOPE = 4;       // degrees (exclude flat hilltops)
// wind-corridor: notable valley/gap, not a cliff
const WIND_MAX_TPI = -5;       // metres below local mean
const WIND_MAX_SLOPE = 10;     // degrees
const MIN_NEIGHBORS = 2;       // de-speckle: drop lone classified cells

const ZONES = { sun: 1, cool: 2, wind: 3, fog: 4 };

function findDem() {
  if (!existsSync(RAW_DIR)) return null;
  const tif = readdirSync(RAW_DIR).find(f => /\.tiff?$/i.test(f));
  return tif ? join(RAW_DIR, tif) : null;
}

function run(args) {
  console.log("» mapshaper", args.join(" "));
  execFileSync("npx", ["--no-install", "mapshaper", ...args], { stdio: "inherit", cwd: ROOT });
}

// Chaikin corner-cutting (matches the fog-contour smoothing) for soft edges.
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

// ── Contour generation (marching squares) ──────────────────────────────────
const FT_PER_M = 3.28084;
const CONTOUR_STEP_FT = 50;     // contour interval
const CONTOUR_INDEX_FT = 250;   // bolder/index lines every N ft
const CONTOUR_F = 4;            // DEM cells per contour grid block (≈40 m)
const PEAK_RADIUS = 9;          // local-max suppression radius (blocks ≈360 m)
const PEAK_MIN_ELEV_M = 70;     // ignore minor bumps below this (≈230 ft)
const PEAK_MIN_GAP_M = 450;     // merge peaks closer than this, keep highest

// Block-average a DEM into a coarser grid (skips nodata).
function coarsen(elev, W, H, nodata, F) {
  const cw = Math.floor(W / F), ch = Math.floor(H / F);
  const g = new Float32Array(cw * ch);
  for (let cy = 0; cy < ch; cy++)
    for (let cx = 0; cx < cw; cx++) {
      let s = 0, n = 0;
      for (let dy = 0; dy < F; dy++)
        for (let dx = 0; dx < F; dx++) {
          const v = elev[(cy * F + dy) * W + (cx * F + dx)];
          if (nodata != null && v === nodata) continue;
          s += v; n++;
        }
      g[cy * cw + cx] = n ? s / n : 0;
    }
  return { g, cw, ch };
}

// Marching squares: line segments (grid coords) where the surface crosses T.
function marchingSquares(g, cw, ch, T) {
  const segs = [];
  const f = (a, b) => (T - a) / (b - a);
  for (let y = 0; y < ch - 1; y++)
    for (let x = 0; x < cw - 1; x++) {
      const tl = g[y * cw + x], tr = g[y * cw + x + 1];
      const bl = g[(y + 1) * cw + x], br = g[(y + 1) * cw + x + 1];
      let idx = 0;
      if (tl >= T) idx |= 8; if (tr >= T) idx |= 4;
      if (br >= T) idx |= 2; if (bl >= T) idx |= 1;
      if (idx === 0 || idx === 15) continue;
      const top = [x + f(tl, tr), y];
      const bot = [x + f(bl, br), y + 1];
      const lft = [x, y + f(tl, bl)];
      const rgt = [x + 1, y + f(tr, br)];
      const p = (a, b) => segs.push([a, b]);
      switch (idx) {
        case 1: case 14: p(lft, bot); break;
        case 2: case 13: p(bot, rgt); break;
        case 3: case 12: p(lft, rgt); break;
        case 4: case 11: p(top, rgt); break;
        case 6: case 9:  p(top, bot); break;
        case 7: case 8:  p(lft, top); break;
        case 5:  p(lft, top); p(bot, rgt); break; // saddle
        case 10: p(lft, bot); p(top, rgt); break; // saddle
      }
    }
  return segs;
}

// Greedily stitch segments into polylines (quantized endpoint matching).
function stitch(segs) {
  const key = pt => `${Math.round(pt[0] * 1000)}_${Math.round(pt[1] * 1000)}`;
  const used = new Array(segs.length).fill(false);
  const byPt = new Map();
  segs.forEach((s, i) => [0, 1].forEach(e => {
    const k = key(s[e]);
    (byPt.get(k) || byPt.set(k, []).get(k)).push({ i, e });
  }));
  const lines = [];
  for (let i = 0; i < segs.length; i++) {
    if (used[i]) continue;
    used[i] = true;
    const line = [segs[i][0].slice(), segs[i][1].slice()];
    for (const dir of ["tail", "head"]) {
      let go = true;
      while (go) {
        go = false;
        const anchor = dir === "tail" ? line[line.length - 1] : line[0];
        for (const { i: j, e } of byPt.get(key(anchor)) || []) {
          if (used[j]) continue;
          const other = (e === 0 ? segs[j][1] : segs[j][0]).slice();
          if (dir === "tail") line.push(other); else line.unshift(other);
          used[j] = true; go = true; break;
        }
      }
    }
    if (line.length >= 2) lines.push(line);
  }
  return lines;
}

// Local-maxima hill peaks on a coarse grid → label points (rounded ft).
function findPeaks(g, cw, ch, toLng, toLat) {
  const peaks = [];
  const R = PEAK_RADIUS;
  for (let y = R; y < ch - R; y++)
    for (let x = R; x < cw - R; x++) {
      const e = g[y * cw + x];
      if (e < PEAK_MIN_ELEV_M) continue;
      let isMax = true;
      for (let ny = -R; ny <= R && isMax; ny++)
        for (let nx = -R; nx <= R; nx++) {
          if (nx === 0 && ny === 0) continue;
          if (g[(y + ny) * cw + (x + nx)] > e) { isMax = false; break; }
        }
      if (isMax) peaks.push({ lng: toLng(x), lat: toLat(y), elev: e, ft: Math.round(e * FT_PER_M) });
    }
  // Distance-dedupe: drop any peak within PEAK_MIN_GAP_M of a higher one.
  peaks.sort((a, b) => b.elev - a.elev);
  const kept = [];
  const degLat = 111320, midLat = (toLat(0) + toLat(ch - 1)) / 2;
  const degLon = 111320 * Math.cos((midLat * Math.PI) / 180);
  for (const p of peaks) {
    const tooClose = kept.some(k => {
      const dx = (k.lng - p.lng) * degLon, dy = (k.lat - p.lat) * degLat;
      return Math.hypot(dx, dy) < PEAK_MIN_GAP_M;
    });
    if (!tooClose) kept.push(p);
  }
  return kept;
}

// Build the contour-line + peak-label FeatureCollection from the DEM.
function buildContours(elev, W, H, nodata, west, north, east, south) {
  const { g, cw, ch } = coarsen(elev, W, H, nodata, CONTOUR_F);
  const blkX = (CONTOUR_F * (east - west)) / W;
  const blkY = (CONTOUR_F * (north - south)) / H;
  const toLng = x => west + x * blkX;
  const toLat = y => north - y * blkY;

  let maxFt = 0;
  for (let i = 0; i < g.length; i++) maxFt = Math.max(maxFt, g[i] * FT_PER_M);

  const features = [];
  for (let ft = CONTOUR_STEP_FT; ft <= maxFt; ft += CONTOUR_STEP_FT) {
    const segs = marchingSquares(g, cw, ch, ft / FT_PER_M);
    if (!segs.length) continue;
    const lines = stitch(segs)
      .map(l => l.map(([gx, gy]) => [toLng(gx), toLat(gy)]))
      .filter(l => l.length >= 2);
    if (!lines.length) continue;
    features.push({
      type: "Feature",
      properties: { ele_ft: ft, index: ft % CONTOUR_INDEX_FT === 0 ? 1 : 0 },
      geometry: { type: "MultiLineString", coordinates: lines },
    });
  }

  findPeaks(g, cw, ch, toLng, toLat).forEach(p => {
    features.push({
      type: "Feature",
      properties: { ele_ft: p.ft, peak: 1 },
      geometry: { type: "Point", coordinates: [p.lng, p.lat] },
    });
  });

  return { type: "FeatureCollection", features };
}

async function main() {
  const DEM = findDem();
  if (!DEM) {
    console.error("No DEM .tif found in data/raw/. Drop a GeoTIFF DEM there and re-run.");
    process.exit(1);
  }
  mkdirSync(TMP_DIR, { recursive: true });
  mkdirSync(dirname(OUT_PATH), { recursive: true });

  // 1. Read DEM ────────────────────────────────────────────────────────────
  console.log("Reading DEM:", DEM);
  const tiff = await fromFile(DEM);
  const img = await tiff.getImage();
  const W = img.getWidth(), H = img.getHeight();
  const [west, south, east, north] = img.getBoundingBox();
  const nodata = img.getGDALNoData();
  const elev = (await img.readRasters())[0];
  console.log(`DEM ${W}×${H}, bbox [${west.toFixed(3)}, ${south.toFixed(3)}, ${east.toFixed(3)}, ${north.toFixed(3)}]`);

  // 2. Downsample to the analysis grid (block-average, skipping nodata) ─────
  const F = DOWNSAMPLE;
  const cw = Math.floor(W / F), ch = Math.floor(H / F);
  const z = new Float32Array(cw * ch);
  for (let cy = 0; cy < ch; cy++) {
    for (let cx = 0; cx < cw; cx++) {
      let sum = 0, cnt = 0;
      for (let dy = 0; dy < F; dy++) {
        for (let dx = 0; dx < F; dx++) {
          const v = elev[(cy * F + dy) * W + (cx * F + dx)];
          if (nodata != null && v === nodata) continue;
          sum += v; cnt++;
        }
      }
      z[cy * cw + cx] = cnt ? sum / cnt : 0;
    }
  }

  // Real-world block dimensions (metres) — DEM is geographic (deg).
  const midLat = (north + south) / 2;
  const degLat = 111320, degLon = 111320 * Math.cos((midLat * Math.PI) / 180);
  const cellDeg = (F * (east - west)) / W;          // block width in degrees
  const dxM = cellDeg * degLon, dyM = cellDeg * degLat;

  const at = (x, y) => z[Math.min(ch - 1, Math.max(0, y)) * cw + Math.min(cw - 1, Math.max(0, x))];

  // 3. Slope, aspect (Horn 3×3), TPI per analysis cell ──────────────────────
  const zone = new Uint8Array(cw * ch);
  for (let y = 0; y < ch; y++) {
    for (let x = 0; x < cw; x++) {
      const a = at(x - 1, y - 1), b = at(x, y - 1), c = at(x + 1, y - 1);
      const d = at(x - 1, y),     e = at(x, y),     f = at(x + 1, y);
      const g = at(x - 1, y + 1), h = at(x, y + 1), i = at(x + 1, y + 1);
      const dzdx = ((c + 2 * f + i) - (a + 2 * d + g)) / (8 * dxM);
      const dzdy = ((g + 2 * h + i) - (a + 2 * b + c)) / (8 * dyM);
      const slope = Math.atan(Math.hypot(dzdx, dzdy)) * (180 / Math.PI);

      // Compass aspect (0=N, 90=E, 180=S, 270=W); row index grows southward.
      let asp = Math.atan2(dzdy, -dzdx) * (180 / Math.PI);
      asp = (90 - asp) % 360; if (asp < 0) asp += 360;

      // Topographic Position Index: elevation minus mean of a wider window.
      let sum = 0, cnt = 0;
      for (let ny = -TPI_RADIUS; ny <= TPI_RADIUS; ny++) {
        for (let nx = -TPI_RADIUS; nx <= TPI_RADIUS; nx++) {
          if (nx === 0 && ny === 0) continue;
          sum += at(x + nx, y + ny); cnt++;
        }
      }
      const tpi = e - sum / cnt;

      // Classify (priority: sun > cool > fog > wind) ──────────────────────
      const inAsp = (lo, hi) => asp >= lo && asp <= hi;
      const northFacing = asp >= 292.5 || asp <= 67.5; // NW → N → NE
      if (slope >= SUN_SLOPE[0] && slope <= SUN_SLOPE[1] && inAsp(...SUN_ASPECT)) {
        zone[y * cw + x] = ZONES.sun;
      } else if (slope >= COOL_MIN_SLOPE && northFacing) {
        zone[y * cw + x] = ZONES.cool;
      } else if (e >= FOG_MIN_ELEV && slope >= FOG_MIN_SLOPE && inAsp(...FOG_ASPECT)) {
        zone[y * cw + x] = ZONES.fog;
      } else if (tpi <= WIND_MAX_TPI && slope <= WIND_MAX_SLOPE) {
        zone[y * cw + x] = ZONES.wind;
      }
    }
  }

  // 4. De-speckle: drop classified cells with too few same-zone neighbours ──
  const cleaned = new Uint8Array(zone);
  for (let y = 0; y < ch; y++) {
    for (let x = 0; x < cw; x++) {
      const zv = zone[y * cw + x];
      if (!zv) continue;
      let same = 0;
      for (let ny = -1; ny <= 1; ny++)
        for (let nx = -1; nx <= 1; nx++) {
          if (nx === 0 && ny === 0) continue;
          const px = x + nx, py = y + ny;
          if (px < 0 || py < 0 || px >= cw || py >= ch) continue;
          if (zone[py * cw + px] === zv) same++;
        }
      if (same < MIN_NEIGHBORS) cleaned[y * cw + x] = 0;
    }
  }

  // 5. Emit a square polygon per classified cell ────────────────────────────
  const resX = (east - west) / W, resY = (north - south) / H;
  const blkX = F * resX, blkY = F * resY;
  const features = [];
  const counts = { sun: 0, cool: 0, wind: 0, fog: 0 };
  const NAME = { 1: "sun", 2: "cool", 3: "wind", 4: "fog" };
  for (let y = 0; y < ch; y++) {
    for (let x = 0; x < cw; x++) {
      const zv = cleaned[y * cw + x];
      if (!zv) continue;
      const lng0 = west + x * blkX, lng1 = west + (x + 1) * blkX;
      const lat1 = north - y * blkY, lat0 = north - (y + 1) * blkY;
      features.push({
        type: "Feature",
        properties: { zone: NAME[zv] },
        geometry: {
          type: "Polygon",
          coordinates: [[[lng0, lat0], [lng1, lat0], [lng1, lat1], [lng0, lat1], [lng0, lat0]]],
        },
      });
      counts[NAME[zv]]++;
    }
  }
  console.log("Classified cells:", counts);

  const RAW_TMP = join(TMP_DIR, "microclimates-cells.geojson");
  writeFileSync(RAW_TMP, JSON.stringify({ type: "FeatureCollection", features }));

  // 6. Dissolve adjacent same-zone squares, clean slivers, light simplify ───
  const DISSOLVED = join(TMP_DIR, "microclimates-dissolved.geojson");
  run([
    RAW_TMP,
    "-dissolve2", "fields=zone",
    "-clean", "gap-fill-area=2000",
    "-simplify", "8%", "keep-shapes",
    "-o", DISSOLVED, "format=geojson",
  ]);

  // 7. Chaikin-smooth + write final ─────────────────────────────────────────
  const fc = JSON.parse(readFileSync(DISSOLVED, "utf8"));
  fc.features.forEach(ft => {
    const gm = ft.geometry;
    if (!gm) return;
    if (gm.type === "Polygon") gm.coordinates = gm.coordinates.map(r => chaikinSmooth(r, 2));
    else if (gm.type === "MultiPolygon")
      gm.coordinates = gm.coordinates.map(p => p.map(r => chaikinSmooth(r, 2)));
  });
  fc.metadata = {
    source: "data/raw USGS 10 m DEM",
    builtAt: new Date().toISOString(),
    zones: {
      sun: "20–30° SE/S/SW-facing inclines — warmer, sunnier sun pockets",
      cool: "North-facing inclines — far less direct sun, cooler & shaded",
      wind: "Valley floors / gaps that channel wind",
      fog: "High west/ocean-facing ridges where fog persists",
    },
  };
  writeFileSync(OUT_PATH, JSON.stringify(fc));
  const byZone = fc.features.reduce((m, f) => ((m[f.properties.zone] = (m[f.properties.zone] || 0) + 1), m), {});
  console.log(`✓ wrote ${OUT_PATH} (${fc.features.length} polygons:`, byZone, ")");

  // 8. Elevation contours (50 ft) + peak labels, generated from the DEM ─────
  const contours = buildContours(elev, W, H, nodata, west, north, east, south);
  const peakFeatures = contours.features.filter(f => f.properties.peak);
  const lineFeatures = contours.features.filter(f => !f.properties.peak);

  // Simplify the (vertex-dense) contour lines via mapshaper to shrink the
  // file; points pass through untouched, so peaks are added back after.
  const C_RAW = join(TMP_DIR, "contours-raw.geojson");
  const C_SIMP = join(TMP_DIR, "contours-simp.geojson");
  writeFileSync(C_RAW, JSON.stringify({ type: "FeatureCollection", features: lineFeatures }));
  run([C_RAW, "-simplify", "14%", "keep-shapes", "-o", C_SIMP, "format=geojson"]);
  const simp = JSON.parse(readFileSync(C_SIMP, "utf8"));
  simp.features.push(...peakFeatures);
  simp.metadata = {
    source: "data/raw USGS 10 m DEM",
    builtAt: new Date().toISOString(),
    interval_ft: CONTOUR_STEP_FT,
    note: "Contour lines (MultiLineString, ele_ft + index) and hill peak labels (Point, ele_ft + peak).",
  };
  writeFileSync(CONTOURS_OUT, JSON.stringify(simp));
  console.log(`✓ wrote ${CONTOURS_OUT} (${lineFeatures.length} contour levels, ${peakFeatures.length} peak labels)`);
}

main();
