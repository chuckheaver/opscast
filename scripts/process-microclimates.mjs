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
const PEAKS_OUT = join(ROOT, "public", "data", "sf-peaks.geojson");

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
// wind-corridor: notable valley/gap, not a cliff
const WIND_MAX_TPI = -5;       // metres below local mean
const WIND_MAX_SLOPE = 10;     // degrees
const MIN_NEIGHBORS = 2;       // de-speckle: drop lone classified cells
// fog path: marine fog floods in from the west and threads east along the
// low ground, blocked by the hills. Model it as everything ≤200 ft that is
// connected to the western (ocean) edge by other ≤200 ft cells — the
// valleys + gaps fog flows through, leaving the high ground blank.
const FOG_CEILING_FT = 200;    // fog flows freely below this elevation
const FOG_PATH_F = 4;          // DEM cells per fog-path block (≈40 m)

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

// ── Hill-peak labels ────────────────────────────────────────────────────────
// We let the basemap draw the contour LINES (Mapbox Terrain v2 — smooth and
// accurate); from the DEM we only derive hill-peak label points so every
// hilltop shows its elevation. Output: peak Points with ele_ft.
const FT_PER_M = 3.28084;
const PEAK_F = 4;              // DEM cells per peak-search block (≈40 m)
const PEAK_RADIUS = 9;         // local-max suppression radius (blocks ≈360 m)
const PEAK_MIN_ELEV_M = 70;    // ignore minor bumps below this (≈230 ft)
const PEAK_MIN_GAP_M = 450;    // merge peaks closer than this, keep highest

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

// Local-maxima hill peaks → label points (rounded ft), distance-deduped.
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

// DEM → peak-label FeatureCollection (Point features, ele_ft + peak flag).
function buildPeaks(elev, W, H, nodata, west, north, east, south) {
  const { g, cw, ch } = coarsen(elev, W, H, nodata, PEAK_F);
  const blkX = (PEAK_F * (east - west)) / W;
  const blkY = (PEAK_F * (north - south)) / H;
  const toLng = x => west + x * blkX;
  const toLat = y => north - y * blkY;
  const features = findPeaks(g, cw, ch, toLng, toLat).map(p => ({
    type: "Feature",
    properties: { ele_ft: p.ft, peak: 1 },
    geometry: { type: "Point", coordinates: [p.lng, p.lat] },
  }));
  return { type: "FeatureCollection", features };
}

// ── Fog path (flood fill from the west) ─────────────────────────────────────
// Returns a coarse boolean mask of cells fog can reach: everything at/below
// FOG_CEILING_FT that is 4-connected back to the western (ocean) edge. The
// hills (and basins walled off by >200 ft terrain) stay unreached, so the
// mask traces the valleys + gaps fog threads through as it moves east.
function buildFogPathMask(elev, W, H, nodata, west, north, east, south) {
  const { g, cw, ch } = coarsen(elev, W, H, nodata, FOG_PATH_F);
  const T = FOG_CEILING_FT / FT_PER_M;
  const reach = new Uint8Array(cw * ch);
  const q = [];
  for (let y = 0; y < ch; y++) {
    const i = y * cw; // x = 0, the western edge
    if (g[i] <= T) { reach[i] = 1; q.push(i); }
  }
  let head = 0;
  while (head < q.length) {
    const i = q[head++], x = i % cw, y = (i / cw) | 0;
    const tryCell = j => { if (!reach[j] && g[j] <= T) { reach[j] = 1; q.push(j); } };
    if (x > 0) tryCell(i - 1);
    if (x < cw - 1) tryCell(i + 1);
    if (y > 0) tryCell(i - cw);
    if (y < ch - 1) tryCell(i + cw);
  }
  const blkX = (FOG_PATH_F * (east - west)) / W;
  const blkY = (FOG_PATH_F * (north - south)) / H;
  return { reach, g, cw, ch, blkX, blkY };
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

  // Fog path + elevation bands (fog thins as it climbs). Flood-fill the low
  // ground from the west for the ≤200 ft "fog" path, then graduated bands
  // above it: 200–350 (fog2), 350–500 (fog3), 500–1000 ft (fog4).
  const fp = buildFogPathMask(elev, W, H, nodata, west, north, east, south);
  for (let y = 0; y < fp.ch; y++) {
    for (let x = 0; x < fp.cw; x++) {
      const i = y * fp.cw + x;
      const ft = fp.g[i] * 3.28084;
      let zn = null;
      if (fp.reach[i]) zn = "fog";
      else if (ft > 200 && ft <= 350) zn = "fog2";
      else if (ft > 350 && ft <= 500) zn = "fog3";
      else if (ft > 500 && ft <= 1000) zn = "fog4";
      if (!zn) continue;
      const lng0 = west + x * fp.blkX, lng1 = west + (x + 1) * fp.blkX;
      const lat1 = north - y * fp.blkY, lat0 = north - (y + 1) * fp.blkY;
      features.push({
        type: "Feature",
        properties: { zone: zn },
        geometry: {
          type: "Polygon",
          coordinates: [[[lng0, lat0], [lng1, lat0], [lng1, lat1], [lng0, lat1], [lng0, lat0]]],
        },
      });
      counts[zn] = (counts[zn] || 0) + 1;
    }
  }
  console.log("Classified cells:", counts);

  // 6. Dissolve + clip to SF land + clean + simplify. The slope zones and
  //    the fog bands are processed SEPARATELY — sun/cool slopes sit inside
  //    the 200–500 ft fog bands, and a single planar clean would erase the
  //    smaller slope zones where they overlap. Two passes keep them as
  //    independent overlapping layers (they're separate toggles anyway).
  const NEIGH = join(ROOT, "public", "data", "sf-fog-neighborhoods.geojson");
  const SLOPE = new Set(["sun", "cool", "wind"]);
  const dissolveGroup = (feats, tag) => {
    const raw = join(TMP_DIR, `microclimates-${tag}-raw.geojson`);
    const out = join(TMP_DIR, `microclimates-${tag}-dis.geojson`);
    writeFileSync(raw, JSON.stringify({ type: "FeatureCollection", features: feats }));
    run([
      raw,
      "-dissolve2", "fields=zone",
      "-clip", NEIGH,
      "-clean", "gap-fill-area=2000",
      "-simplify", "8%", "keep-shapes",
      "-o", out, "format=geojson",
    ]);
    return JSON.parse(readFileSync(out, "utf8")).features;
  };
  const slopeFeats = dissolveGroup(features.filter(f => SLOPE.has(f.properties.zone)), "slope");
  const fogFeats = dissolveGroup(features.filter(f => !SLOPE.has(f.properties.zone)), "fog");

  // 7. Chaikin-smooth + write final ─────────────────────────────────────────
  const fc = { type: "FeatureCollection", features: [...slopeFeats, ...fogFeats] };
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
      fog: "Fog path — ≤200 ft low ground connected to the west coast that marine fog threads east through",
      fog2: "Fog band 200–350 ft — fog laps this far up the slopes, thinning",
      fog3: "Fog band 350–500 ft — fog reaches here only on the windward side",
      fog4: "Fog band 500–1000 ft — fog crests here at most; usually above the fog",
    },
  };
  writeFileSync(OUT_PATH, JSON.stringify(fc));
  const byZone = fc.features.reduce((m, f) => ((m[f.properties.zone] = (m[f.properties.zone] || 0) + 1), m), {});
  console.log(`✓ wrote ${OUT_PATH} (${fc.features.length} polygons:`, byZone, ")");

  // 8. Hill-peak labels from the DEM (the basemap draws the contour LINES). ──
  const peaks = buildPeaks(elev, W, H, nodata, west, north, east, south);
  peaks.metadata = {
    source: "data/raw USGS 10 m DEM",
    builtAt: new Date().toISOString(),
    note: "Hill peak labels (Point, ele_ft + peak). Contour lines come from Mapbox Terrain v2 on the map.",
  };
  writeFileSync(PEAKS_OUT, JSON.stringify(peaks));
  console.log(`✓ wrote ${PEAKS_OUT} (${peaks.features.length} peak labels)`);
}

main();
