// Build pipeline: USGS 10 m DEM → annual modelled solar irradiation
// per cell → 5-level shaded layer matching the SF Solar Map legend
// (cream → dark brown → black, low → high).
//
// Method (pure JS):
//   1. Read DEM, downsample to a 40 m analysis grid.
//   2. Compute slope + aspect per cell (Horn 3×3, compass aspect).
//   3. Precompute a year-long sun-position table at SF latitude — sun
//      vector + clear-sky atmospheric transmission for every daylight
//      hour, 365 × 24 = 8760 samples (~4380 above the horizon).
//   4. For each cell, accumulate SOLAR_CONSTANT × trans × dot(normal, sun)
//      across the daylight hours. That's the modelled clear-sky direct-
//      beam annual kWh/m² landing on the tilted surface.
//   5. Bin into 5 levels matching the reference legend, emit a square
//      polygon per cell, then dissolve by level through mapshaper.
//
// Caveats vs. the SF Solar Map reference image:
//   - direct beam only (no diffuse); slightly under-counts on cloudy
//     days, slightly over-counts on perfectly clear days.
//   - clear-sky atmosphere; doesn't subtract fog/marine layer hours,
//     so the Outer Richmond won't read darker than the Outer Sunset
//     here (in the reference image it does, because that map embeds
//     measured cloud cover).
//   - no canopy; Golden Gate Park / Presidio look like their bare-
//     ground irradiation, not the reduced ground-level value the
//     canopy actually produces.
//
// Run with: npm run solar:build

import { existsSync, mkdirSync, readdirSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { execFileSync } from "node:child_process";
import { fromFile } from "geotiff";

const ROOT = resolve(".");
const RAW_DIR = "./data/raw";
const TMP_DIR = "./data/tmp";
const OUT_PATH = "./public/data/sf-solar-irradiation.geojson";
const NEIGH_PATH = "./public/data/sf-fog-neighborhoods.geojson";

const LAT = 37.77;                  // SF latitude
const DOWNSAMPLE = 4;               // ≈40 m analysis grid
const TIME_STEP_HOURS = 1;          // 1-hour sampling
const TRANSMISSIVITY = 0.7;         // clear-sky atmospheric transmission
const CLOUD_FACTOR = 0.78;          // SF averages ~22% cloud cover by year
const SOLAR_CONSTANT_KW = 1.367;    // kW/m² at top of atmosphere
// Annual diffuse-sky baseline on a flat surface — about 1/3 of SF's
// 1700 kWh/m² total. Tilted surfaces see less sky, so they receive
// DIFFUSE_ANNUAL × (1 + cos(slope))/2 (the standard isotropic sky-view
// factor). Without this term, flat ground reads suspiciously dark
// because the direct-beam-only model misses ~600 kWh/m² of scattered
// light bouncing off the atmosphere and surroundings.
const DIFFUSE_ANNUAL = 550;         // kWh/m²

// Annual kWh/m² → bucket id. SF's actual modelled distribution is
// extremely peaked around flat-ground (~1799 kWh/m²) because most of
// the city IS flat-ish — so the bins are tuned to let the hill faces
// stand out either side of the flatland median, matching the visual
// contrast on the SF Solar Map reference image.
const LEVELS = [
  { id: 1, max: 1550 },             // very low  — deep north-shadow
  { id: 2, max: 1750 },             // low       — north-facing slopes
  { id: 3, max: 1830 },             // medium    — flatlands (city default)
  { id: 4, max: 1900 },             // high      — mild south-facing
  { id: 5, max: Infinity },         // very high — steep south-facing peaks
];
const levelFromKWh = kwh => {
  for (const l of LEVELS) if (kwh < l.max) return l.id;
  return 5;
};

function findDem() {
  if (!existsSync(RAW_DIR)) return null;
  const tif = readdirSync(RAW_DIR).find(f => /\.tiff?$/i.test(f));
  return tif ? join(RAW_DIR, tif) : null;
}

function shell(cmd, args) {
  console.log("»", cmd, args.join(" "));
  execFileSync(cmd, args, { stdio: "inherit", cwd: ROOT });
}

// Sun-position table at SF latitude for the whole year. Returns one
// entry per daylight hour with the sun unit vector in compass coords
// (x = east, y = north, z = up) and a pre-multiplied per-hour energy
// weight (SOLAR_CONSTANT × clear-sky transmission × cloud factor × dt).
function buildSunTable() {
  const latR = (LAT * Math.PI) / 180;
  const table = [];
  for (let day = 1; day <= 365; day++) {
    // Solar declination, Spencer's first-order approximation.
    const decl = (23.44 * Math.PI / 180) *
      Math.sin(2 * Math.PI * (day - 81) / 365);
    for (let hour = 0; hour < 24; hour += TIME_STEP_HOURS) {
      const hAng = ((hour - 12) * 15) * Math.PI / 180; // rad
      const sinAlt =
        Math.sin(latR) * Math.sin(decl) +
        Math.cos(latR) * Math.cos(decl) * Math.cos(hAng);
      if (sinAlt <= 0.01) continue;
      const alt = Math.asin(sinAlt);
      // Solar azimuth (0 = N, clockwise). Symmetric about noon.
      const cosAz =
        (Math.sin(decl) - sinAlt * Math.sin(latR)) /
        (Math.cos(alt) * Math.cos(latR));
      let az = Math.acos(Math.max(-1, Math.min(1, cosAz)));
      if (hour > 12) az = 2 * Math.PI - az;
      // Sun unit vector in compass coords (E, N, Up).
      const sx = Math.cos(alt) * Math.sin(az);
      const sy = Math.cos(alt) * Math.cos(az);
      const sz = sinAlt;
      // Air mass (simple Lambert) and clear-sky transmission.
      const airMass = 1 / sinAlt;
      const trans = Math.pow(TRANSMISSIVITY, airMass);
      const weight = SOLAR_CONSTANT_KW * trans * CLOUD_FACTOR * TIME_STEP_HOURS;
      table.push({ sx, sy, sz, weight });
    }
  }
  return table;
}

async function main() {
  const DEM = findDem();
  if (!DEM) {
    console.error("No DEM .tif in data/raw/. Drop a GeoTIFF DEM there and re-run.");
    process.exit(1);
  }
  mkdirSync(TMP_DIR, { recursive: true });
  mkdirSync(dirname(OUT_PATH), { recursive: true });

  console.log("Reading DEM:", DEM);
  const tiff = await fromFile(DEM);
  const img = await tiff.getImage();
  const W = img.getWidth(), H = img.getHeight();
  const [west, south, east, north] = img.getBoundingBox();
  const nodata = img.getGDALNoData();
  const elev = (await img.readRasters())[0];
  console.log(`DEM ${W}×${H}, bbox [${west.toFixed(3)}, ${south.toFixed(3)}, ${east.toFixed(3)}, ${north.toFixed(3)}]`);

  // Block-average downsample to the analysis grid.
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
      z[cy * cw + cx] = cnt ? sum / cnt : NaN;
    }
  }
  console.log(`Analysis grid: ${cw}×${ch} cells`);

  // Convert geographic spacing to metres at SF latitude.
  const M_PER_DEG_LAT = 111_111;
  const M_PER_DEG_LNG = 111_111 * Math.cos((LAT * Math.PI) / 180);
  const dxM = ((east - west) / W) * M_PER_DEG_LNG * F;
  const dyM = ((north - south) / H) * M_PER_DEG_LAT * F;
  console.log(`Cell size: ${dxM.toFixed(1)} m × ${dyM.toFixed(1)} m`);

  console.log("Building annual sun-position table...");
  const sunTable = buildSunTable();
  console.log(`Sun table: ${sunTable.length} daylight samples`);

  console.log("Computing slope, aspect, irradiation per cell...");
  const irr = new Float32Array(cw * ch);
  let counted = 0;
  for (let y = 1; y < ch - 1; y++) {
    for (let x = 1; x < cw - 1; x++) {
      const at = (cx, cy) => z[cy * cw + cx];
      const a = at(x-1, y-1), b = at(x, y-1), c = at(x+1, y-1);
      const d = at(x-1, y),                       f = at(x+1, y);
      const g = at(x-1, y+1), h = at(x, y+1), i = at(x+1, y+1);
      const e = at(x, y);
      if (!Number.isFinite(e)) continue;
      if ([a,b,c,d,f,g,h,i].some(v => !Number.isFinite(v))) continue;

      // Horn 3×3 derivatives. dzdy is (south - north)/dy because row
      // index grows southward in the DEM.
      const dzdx = ((c + 2*f + i) - (a + 2*d + g)) / (8 * dxM);
      const dzdy = ((g + 2*h + i) - (a + 2*b + c)) / (8 * dyM);

      // Slope in radians from horizontal.
      const slopeR = Math.atan(Math.hypot(dzdx, dzdy));
      // Compass aspect (0=N, 90=E, 180=S, 270=W). Down-slope direction
      // is -gradient; convert that vector to a compass bearing.
      let aspR = Math.atan2(-dzdx, dzdy);
      if (aspR < 0) aspR += 2 * Math.PI;

      // Tilted-surface normal in compass coords.
      const cosB = Math.cos(slopeR), sinB = Math.sin(slopeR);
      const nx = sinB * Math.sin(aspR);
      const ny = sinB * Math.cos(aspR);
      const nz = cosB;

      let direct = 0;
      for (let k = 0; k < sunTable.length; k++) {
        const s = sunTable[k];
        const dot = nx * s.sx + ny * s.sy + nz * s.sz;
        if (dot <= 0) continue;
        direct += s.weight * dot;
      }
      // Isotropic-sky diffuse: a tilted surface sees only (1+cosβ)/2
      // of the sky dome, so half-sky for a vertical surface.
      const diffuse = DIFFUSE_ANNUAL * (1 + cosB) / 2;
      irr[y * cw + x] = direct + diffuse;
      counted++;
    }
  }
  console.log(`Computed irradiation for ${counted} cells`);

  // Quick histogram + percentiles so we know how the bins are landing.
  const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  const values = [];
  let minK = Infinity, maxK = -Infinity, sumK = 0, n = 0;
  for (let k = 0; k < irr.length; k++) {
    const v = irr[k];
    if (!v) continue;
    counts[levelFromKWh(v)]++;
    values.push(v);
    if (v < minK) minK = v;
    if (v > maxK) maxK = v;
    sumK += v; n++;
  }
  values.sort((a, b) => a - b);
  const pct = p => values[Math.floor(values.length * p)];
  console.log(`Irradiation kWh/m²: min ${minK.toFixed(0)}, mean ${(sumK/n).toFixed(0)}, max ${maxK.toFixed(0)}`);
  console.log(`Percentiles: p10 ${pct(0.10).toFixed(0)} · p20 ${pct(0.20).toFixed(0)} · p40 ${pct(0.40).toFixed(0)} · p60 ${pct(0.60).toFixed(0)} · p80 ${pct(0.80).toFixed(0)} · p90 ${pct(0.90).toFixed(0)}`);
  console.log("Cells per level:", counts);

  // Emit a square polygon per cell tagged with its level. Mapshaper
  // dissolves them into one polygon per level next.
  const cellW = ((east - west) / W) * F;
  const cellH = ((north - south) / H) * F;
  const toLng = cx => west + ((cx + 0.5) * F * (east - west)) / W;
  const toLat = cy => north - ((cy + 0.5) * F * (north - south)) / H;

  const features = [];
  for (let y = 1; y < ch - 1; y++) {
    for (let x = 1; x < cw - 1; x++) {
      const v = irr[y * cw + x];
      if (!v) continue;
      const lvl = levelFromKWh(v);
      const lng = toLng(x), lat = toLat(y);
      const x0 = lng - cellW / 2, x1 = lng + cellW / 2;
      const y0 = lat - cellH / 2, y1 = lat + cellH / 2;
      features.push({
        type: "Feature",
        properties: { level: lvl },
        geometry: {
          type: "Polygon",
          coordinates: [[[x0,y0],[x1,y0],[x1,y1],[x0,y1],[x0,y0]]],
        },
      });
    }
  }
  console.log(`Emitting ${features.length} cell polygons`);

  const RAW = join(TMP_DIR, "solar-cells-raw.geojson");
  await writeFile(RAW, JSON.stringify({
    type: "FeatureCollection",
    features,
  }));

  shell("npx", [
    "--no-install", "mapshaper", RAW,
    "-dissolve2", "fields=level",
    "-clip", NEIGH_PATH,
    "-clean", "gap-fill-area=2000",
    "-simplify", "8%", "keep-shapes",
    "-o", OUT_PATH, "format=geojson", "force",
  ]);

  console.log("Wrote", OUT_PATH);
}

main().catch(e => { console.error(e); process.exit(1); });
