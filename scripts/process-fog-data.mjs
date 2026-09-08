#!/usr/bin/env node
//
// Build pipeline: SF neighborhood + historical fog shapefiles
//                 ──►  public/data/sf-fog-neighborhoods.geojson
//
// Defaults wired for:
//   - data/raw/neighborhoods.shp  ("SF Find Neighborhoods" — name field)
//   - data/raw/fog_belt_zones.shp (USGS GOES FLCC contours — `contour` field
//                                  stored as hours × 100, summer hrs/day)
//
// To swap in different shapefiles, edit the constants below.

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const RAW_DIR = join(ROOT, "data", "raw");
const OUT_PATH = join(ROOT, "public", "data", "sf-fog-neighborhoods.geojson");
const TMP_DIR = join(ROOT, "data", "tmp");

const NEIGH_SHP = join(RAW_DIR, "neighborhoods.shp");
const FOG_SHP = join(RAW_DIR, "fog_belt_zones.shp");

// Attribute on the fog shapefile holding the fog measurement.
const FOG_HOURS_FIELD = "contour";

// USGS stores `contour` as (hours × 100), so e.g. 1400 = 14.0 hrs/day.
// Set to 1 if your dataset already encodes whole hours.
const FOG_HOURS_DIVISOR = 100;

// Attribute on the neighborhoods shapefile holding the human-readable name.
const NEIGH_NAME_FIELD = "name";

// Unit string baked into the output metadata. Updated to reflect the USGS
// dataset, which measures *summer daytime* fog/low-cloud cover per day.
const UNITS = "fogHours = average summer fog/low-cloud hrs per day (USGS GOES, 1999-2009)";

// Hand-drawn Bay Area clip mask. Western edge follows the Pacific coast
// (Pt Reyes → Bolinas → Marin Headlands → Ocean Beach → Pacifica →
//  Half Moon Bay → Pescadero → Santa Cruz mountains); other edges run
// inland to roughly Gilroy in the south, the East Bay hills, and Novato
// in the north. Coordinates are coarse — purpose is to chop ocean and
// outer-Sierra polygons off the contour data, not to be a precise
// county boundary.
const BAY_AREA_MASK = {
  type: "FeatureCollection",
  features: [{
    type: "Feature",
    properties: { name: "Bay Area clip mask" },
    geometry: {
      type: "Polygon",
      coordinates: [[
        // Pacific coast, north → south
        [-123.00, 38.15],
        [-122.98, 38.05],   // Pt Reyes peninsula tip
        [-122.85, 37.95],   // Bolinas
        [-122.70, 37.90],   // Stinson
        [-122.60, 37.85],   // Marin Headlands
        [-122.52, 37.81],   // Ocean Beach SF
        [-122.52, 37.70],   // SF SW corner
        [-122.50, 37.55],   // Pacifica
        [-122.45, 37.40],   // Half Moon Bay
        [-122.30, 37.25],   // Santa Cruz mountains
        [-122.05, 37.20],   // Around to south Bay edge
        // South + east edges (inland)
        [-121.85, 37.20],   // Gilroy
        [-121.75, 37.30],   // San Jose
        [-121.65, 37.50],   // Milpitas
        [-121.65, 37.70],   // Fremont
        [-121.65, 37.90],   // East Bay hills
        [-121.75, 38.05],   // Walnut Creek / Concord
        [-121.95, 38.15],   // North-east corner
        // North edge (inland → coast)
        [-122.30, 38.18],   // Vallejo / Sonoma
        [-122.70, 38.18],   // Novato / Petaluma area
        [-123.00, 38.15],   // back to start
      ]],
    },
  }],
};

// Chaikin's corner-cutting smoothing for a closed ring of [lng, lat] pairs.
// Each iteration replaces every edge with two interpolated points (at 1/4
// and 3/4 along the edge), rounding hard corners into soft bends.
function chaikinSmooth(ring, iterations = 3) {
  if (!ring || ring.length < 4) return ring;
  let points = ring;
  for (let iter = 0; iter < iterations; iter++) {
    const closed =
      points[0][0] === points[points.length - 1][0] &&
      points[0][1] === points[points.length - 1][1];
    const n = closed ? points.length - 1 : points.length;
    const next = [];
    for (let i = 0; i < n; i++) {
      const p = points[i];
      const q = points[(i + 1) % n];
      next.push([0.75 * p[0] + 0.25 * q[0], 0.75 * p[1] + 0.25 * q[1]]);
      next.push([0.25 * p[0] + 0.75 * q[0], 0.25 * p[1] + 0.75 * q[1]]);
    }
    if (closed) next.push(next[0].slice());
    points = next;
  }
  return points;
}

function ensureInputs() {
  const missing = [];
  if (!existsSync(NEIGH_SHP)) missing.push(NEIGH_SHP);
  if (!existsSync(FOG_SHP)) missing.push(FOG_SHP);
  if (missing.length) {
    console.error("Missing input shapefiles:");
    missing.forEach(p => console.error("  -", p));
    console.error("\nDrop your .shp/.dbf/.shx/.prj bundles into data/raw/ and re-run.");
    process.exit(1);
  }
}

function run(args) {
  console.log("» mapshaper", args.join(" "));
  execFileSync("npx", ["--no-install", "mapshaper", ...args], {
    stdio: "inherit",
    cwd: ROOT,
  });
}

function main() {
  ensureInputs();
  mkdirSync(TMP_DIR, { recursive: true });
  mkdirSync(dirname(OUT_PATH), { recursive: true });

  // 1. Reproject both layers to WGS84 (Mapbox needs lng/lat).
  run([NEIGH_SHP, "-proj", "wgs84", "-o", join(TMP_DIR, "neigh.json"), "format=geojson"]);
  run([FOG_SHP,   "-proj", "wgs84", "-o", join(TMP_DIR, "fog.json"),   "format=geojson"]);

  // 2. Per-neighborhood spatial join: for each SF neighborhood polygon,
  //    average the `contour` values of fog polygons that intersect it.
  //    Unweighted — bigger fog polygons don't get more pull. Adequate for a
  //    coarse risk index; switch to a -clip + area-weighted dissolve if you
  //    need exact area weighting.
  run([
    join(TMP_DIR, "neigh.json"),
    "-join", join(TMP_DIR, "fog.json"),
    `calc=fogHours=average(${FOG_HOURS_FIELD})`,
    "fields=" + FOG_HOURS_FIELD,
    "-rename-fields", `name=${NEIGH_NAME_FIELD}`,
    "-each", "id = (this.properties.name||'unk').toLowerCase().replace(/[^a-z0-9]+/g,'-')",
    "-each", `fogHours = fogHours == null ? null : Math.round((fogHours / ${FOG_HOURS_DIVISOR}) * 10) / 10`,
    // -clean fills gap slivers between adjacent neighborhood polygons left
    // over from the source data. Skipping -simplify entirely: 117 polygons
    // produces a ~400KB GeoJSON, well under any size threshold worth
    // bothering with, and simplification was creating the visible gap-slivers
    // along shared edges. Topology in == topology out.
    "-clean", "gap-fill-area=0",
    "-o", join(TMP_DIR, "joined.geojson"), "format=geojson",
  ]);

  // 3. Attach metadata and write to public/.
  const fc = JSON.parse(readFileSync(join(TMP_DIR, "joined.geojson"), "utf8"));
  fc.metadata = {
    source: "data/raw/neighborhoods.shp + data/raw/fog_belt_zones.shp",
    builtAt: new Date().toISOString(),
    units: UNITS,
  };
  writeFileSync(OUT_PATH, JSON.stringify(fc));

  const withData = fc.features.filter(f => f.properties.fogHours != null).length;
  console.log(`✓ wrote ${OUT_PATH} (${fc.features.length} neighborhoods, ${withData} with fog data)`);

  // 4. Separate "raw contours" export for the toggleable overlay on /fog.
  //    Clips the USGS polygons to a hand-drawn Bay Area mask whose western
  //    edge follows the Pacific coast (so ocean polygons don't stick out
  //    past the coastline) and whose other edges run inland from Novato
  //    in the north to San Jose in the south to Concord in the east.
  //    Normalizes the contour attribute to actual hours and rounds out the
  //    raster-stepped polygon corners with Chaikin smoothing afterwards.
  const MASK_PATH = join(TMP_DIR, "bay-area-mask.geojson");
  writeFileSync(MASK_PATH, JSON.stringify(BAY_AREA_MASK));

  const CONTOURS_OUT = join(ROOT, "public", "data", "sf-fog-contours.geojson");
  run([
    join(TMP_DIR, "fog.json"),
    "-clip", MASK_PATH,
    "-each", `hours = Math.round((${FOG_HOURS_FIELD} / ${FOG_HOURS_DIVISOR}) * 10) / 10`,
    "-filter-fields", "hours",
    "-o", CONTOURS_OUT, "format=geojson",
  ]);
  // Round off the raster-derived right angles with two iterations of
  // Chaikin's corner-cutting algorithm. The USGS contours come out of
  // the gridded source as stair-stepped polygons; Chaikin replaces each
  // corner with two interpolated points, so adjacent edges become a soft
  // bend instead of a 90° turn while topology stays intact. Two
  // iterations is the file-size sweet spot — more rounds out further
  // but quadruples the vertex count.
  const smoothed = JSON.parse(readFileSync(CONTOURS_OUT, "utf8"));
  smoothed.features.forEach(f => {
    const g = f.geometry;
    if (!g) return;
    if (g.type === "Polygon") {
      g.coordinates = g.coordinates.map(ring => chaikinSmooth(ring, 2));
    } else if (g.type === "MultiPolygon") {
      g.coordinates = g.coordinates.map(poly =>
        poly.map(ring => chaikinSmooth(ring, 2))
      );
    }
  });
  writeFileSync(CONTOURS_OUT, JSON.stringify(smoothed));
  const contours = JSON.parse(readFileSync(CONTOURS_OUT, "utf8"));
  console.log(`✓ wrote ${CONTOURS_OUT} (${contours.features.length} raw fog contour polygons in SF)`);
}

main();
