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
}

main();
