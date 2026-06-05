// Build pipeline: USGS 10 m DEM → modelled solar irradiation per cell
// for FOUR seasonal windows → two-band sun/shade layers (light yellow
// where the slope catches more sun than flat ground in that season,
// light brown where it catches less).
//
// Why seasonal: at SF latitude (37.77° N) the noon sun altitude
// ranges from ~30° on the winter solstice to ~76° on the summer
// solstice. Winter's low sun makes north-facing slopes drop deep into
// the shade and south-facing slopes glow; summer's high sun barely
// cares about aspect. Flipping between seasons makes that contrast
// vivid.
//
// Outputs (one file per season):
//   public/data/sf-solar-annual.geojson
//   public/data/sf-solar-winter.geojson
//   public/data/sf-solar-equinox.geojson
//   public/data/sf-solar-summer.geojson
// Each carries two features: { level: "sun" } and { level: "shade" }.
// Cells within ±3% of the flat-ground irradiation for the season are
// dropped — the base map shows there and reads as "city average".

import { existsSync, mkdirSync, readdirSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { execFileSync } from "node:child_process";
import { fromFile } from "geotiff";

const ROOT = resolve(".");
const RAW_DIR = "./data/raw";
const TMP_DIR = "./data/tmp";
const OUT_DIR = "./public/data";
const NEIGH_PATH = "./public/data/sf-fog-neighborhoods.geojson";

const LAT = 37.77;
const DOWNSAMPLE = 4;
const TIME_STEP_HOURS = 1;
const TRANSMISSIVITY = 0.7;
const CLOUD_FACTOR = 0.78;
const SOLAR_CONSTANT_KW = 1.367;
// Annual diffuse-sky baseline on a flat surface, scaled per-day so
// the seasonal sums are consistent.
const DIFFUSE_PER_DAY = 550 / 365; // kWh/m²/day

// ±3% of the flat-ground irradiation marks the "city average" band.
// Cells inside it are dropped so the base map shows; outside it we
// paint sun (above) or shade (below).
const NEUTRAL_BAND = 0.03;

// Season day-of-year windows. Winter/Summer are 75-day blocks around
// the solstices; Equinox combines spring + fall to represent the in-
// between, when the sun's noon altitude sits near the annual mean.
const SEASONS = {
  annual:  { label: "Annual",      ranges: [[1, 365]] },
  winter:  { label: "Winter",      ranges: [[335, 365], [1, 45]] },   // Dec 1  – Feb 14
  equinox: { label: "Spring/Fall", ranges: [[60, 120], [244, 304]] }, // Mar 1  – Apr 30 + Sep 1 – Oct 31
  summer:  { label: "Summer",      ranges: [[135, 212]] },            // May 15 – Jul 31
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

// Chaikin corner-cutting — two passes turn the cell-grid staircase
// into smooth curves.
function chaikinSmooth(ring, iterations = 2) {
  if (!ring || ring.length < 4) return ring;
  let pts = ring;
  for (let it = 0; it < iterations; it++) {
    const last = pts.length - 1;
    const closed = pts[0][0] === pts[last][0] && pts[0][1] === pts[last][1];
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
function smoothFeature(f) {
  const g = f.geometry;
  if (!g) return f;
  if (g.type === "Polygon") {
    g.coordinates = g.coordinates.map(r => chaikinSmooth(r, 2));
  } else if (g.type === "MultiPolygon") {
    g.coordinates = g.coordinates.map(p => p.map(r => chaikinSmooth(r, 2)));
  }
  return f;
}

const inSeason = (day, ranges) => ranges.some(([a, b]) => day >= a && day <= b);

// Returns { table, days } for the season. Each table entry is one
// daylight hour with the sun unit vector + the per-hour energy weight.
function buildSunTable(seasonKey) {
  const latR = (LAT * Math.PI) / 180;
  const ranges = SEASONS[seasonKey].ranges;
  const table = [];
  let days = 0;
  for (let day = 1; day <= 365; day++) {
    if (!inSeason(day, ranges)) continue;
    days++;
    const decl = (23.44 * Math.PI / 180) * Math.sin(2 * Math.PI * (day - 81) / 365);
    for (let hour = 0; hour < 24; hour += TIME_STEP_HOURS) {
      const hAng = ((hour - 12) * 15) * Math.PI / 180;
      const sinAlt =
        Math.sin(latR) * Math.sin(decl) +
        Math.cos(latR) * Math.cos(decl) * Math.cos(hAng);
      if (sinAlt <= 0.01) continue;
      const alt = Math.asin(sinAlt);
      const cosAz =
        (Math.sin(decl) - sinAlt * Math.sin(latR)) /
        (Math.cos(alt) * Math.cos(latR));
      let az = Math.acos(Math.max(-1, Math.min(1, cosAz)));
      if (hour > 12) az = 2 * Math.PI - az;
      const sx = Math.cos(alt) * Math.sin(az);
      const sy = Math.cos(alt) * Math.cos(az);
      const sz = sinAlt;
      const airMass = 1 / sinAlt;
      const trans = Math.pow(TRANSMISSIVITY, airMass);
      const weight = SOLAR_CONSTANT_KW * trans * CLOUD_FACTOR * TIME_STEP_HOURS;
      table.push({ sx, sy, sz, weight });
    }
  }
  return { table, days };
}

async function main() {
  const DEM = findDem();
  if (!DEM) {
    console.error("No DEM .tif in data/raw/. Drop a GeoTIFF DEM there and re-run.");
    process.exit(1);
  }
  mkdirSync(TMP_DIR, { recursive: true });
  mkdirSync(OUT_DIR, { recursive: true });

  console.log("Reading DEM:", DEM);
  const tiff = await fromFile(DEM);
  const img = await tiff.getImage();
  const W = img.getWidth(), H = img.getHeight();
  const [west, south, east, north] = img.getBoundingBox();
  const nodata = img.getGDALNoData();
  const elev = (await img.readRasters())[0];
  console.log(`DEM ${W}×${H}, bbox [${west.toFixed(3)}, ${south.toFixed(3)}, ${east.toFixed(3)}, ${north.toFixed(3)}]`);

  // Block-average downsample.
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

  const M_PER_DEG_LAT = 111_111;
  const M_PER_DEG_LNG = 111_111 * Math.cos((LAT * Math.PI) / 180);
  const dxM = ((east - west) / W) * M_PER_DEG_LNG * F;
  const dyM = ((north - south) / H) * M_PER_DEG_LAT * F;

  // Pre-compute slope + aspect per cell ONCE (constants across seasons).
  console.log("Computing slope, aspect per cell...");
  const nxA = new Float32Array(cw * ch);
  const nyA = new Float32Array(cw * ch);
  const nzA = new Float32Array(cw * ch);
  const validA = new Uint8Array(cw * ch);
  for (let y = 1; y < ch - 1; y++) {
    for (let x = 1; x < cw - 1; x++) {
      const at = (cx, cy) => z[cy * cw + cx];
      const a = at(x-1, y-1), b = at(x, y-1), c = at(x+1, y-1);
      const d = at(x-1, y),                       f = at(x+1, y);
      const g = at(x-1, y+1), h = at(x, y+1), i = at(x+1, y+1);
      const e = at(x, y);
      if (!Number.isFinite(e)) continue;
      if ([a,b,c,d,f,g,h,i].some(v => !Number.isFinite(v))) continue;
      const dzdx = ((c + 2*f + i) - (a + 2*d + g)) / (8 * dxM);
      const dzdy = ((g + 2*h + i) - (a + 2*b + c)) / (8 * dyM);
      const slopeR = Math.atan(Math.hypot(dzdx, dzdy));
      let aspR = Math.atan2(-dzdx, dzdy);
      if (aspR < 0) aspR += 2 * Math.PI;
      const cosB = Math.cos(slopeR), sinB = Math.sin(slopeR);
      const idx = y * cw + x;
      nxA[idx] = sinB * Math.sin(aspR);
      nyA[idx] = sinB * Math.cos(aspR);
      nzA[idx] = cosB;
      validA[idx] = 1;
    }
  }

  // Cell → polygon helpers.
  const cellW = ((east - west) / W) * F;
  const cellH = ((north - south) / H) * F;
  const toLng = cx => west + ((cx + 0.5) * F * (east - west)) / W;
  const toLat = cy => north - ((cy + 0.5) * F * (north - south)) / H;

  for (const [key, def] of Object.entries(SEASONS)) {
    console.log(`\n── ${def.label} (${key}) ──`);
    const { table: sunTable, days } = buildSunTable(key);
    console.log(`  sun-position samples: ${sunTable.length} (${days} days)`);

    // Flat-ground threshold for this season: direct = Σ weight × sz,
    // diffuse = DIFFUSE_PER_DAY × days (sky view = 1 for flat ground).
    let flatDirect = 0;
    for (const s of sunTable) flatDirect += s.weight * s.sz;
    const flatDiffuse = DIFFUSE_PER_DAY * days;
    const flat = flatDirect + flatDiffuse;
    const hi = flat * (1 + NEUTRAL_BAND);
    const lo = flat * (1 - NEUTRAL_BAND);
    console.log(`  flat-ground irradiation: ${flat.toFixed(0)} kWh/m²  (sun >${hi.toFixed(0)}, shade <${lo.toFixed(0)})`);

    // Classify each cell, emit only sun + shade polygons (drop neutral).
    const features = [];
    let nSun = 0, nShade = 0, nNeutral = 0;
    for (let y = 1; y < ch - 1; y++) {
      for (let x = 1; x < cw - 1; x++) {
        const idx = y * cw + x;
        if (!validA[idx]) continue;
        const nx = nxA[idx], ny = nyA[idx], nz = nzA[idx];
        let direct = 0;
        for (let k = 0; k < sunTable.length; k++) {
          const s = sunTable[k];
          const dot = nx * s.sx + ny * s.sy + nz * s.sz;
          if (dot > 0) direct += s.weight * dot;
        }
        const diffuse = DIFFUSE_PER_DAY * days * (1 + nz) / 2;
        const total = direct + diffuse;

        let level;
        if (total > hi) { level = "sun"; nSun++; }
        else if (total < lo) { level = "shade"; nShade++; }
        else { nNeutral++; continue; }

        const lng = toLng(x), lat = toLat(y);
        const x0 = lng - cellW / 2, x1 = lng + cellW / 2;
        const y0 = lat - cellH / 2, y1 = lat + cellH / 2;
        features.push({
          type: "Feature",
          properties: { level },
          geometry: {
            type: "Polygon",
            coordinates: [[[x0,y0],[x1,y0],[x1,y1],[x0,y1],[x0,y0]]],
          },
        });
      }
    }
    console.log(`  cells: sun=${nSun}, shade=${nShade}, neutral(dropped)=${nNeutral}`);

    const RAW = join(TMP_DIR, `solar-${key}-raw.geojson`);
    const OUT = join(OUT_DIR, `sf-solar-${key}.geojson`);
    await writeFile(RAW, JSON.stringify({ type: "FeatureCollection", features }));
    shell("npx", [
      "--no-install", "mapshaper", RAW,
      "-dissolve2", "fields=level",
      "-clip", NEIGH_PATH,
      "-clean", "gap-fill-area=2000",
      "-simplify", "8%", "keep-shapes",
      "-o", OUT, "format=geojson", "force",
    ]);
    const fc = JSON.parse(await readFile(OUT, "utf8"));
    fc.metadata = { season: def.label, flat_kwh: Math.round(flat) };
    fc.features = fc.features.map(smoothFeature);
    await writeFile(OUT, JSON.stringify(fc));
    console.log(`  wrote ${OUT}`);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
