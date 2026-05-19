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
  //    Clips the USGS polygons to a slightly-expanded SF bbox so the file
  //    stays small, and normalizes the contour attribute to actual hours.
  const CONTOURS_OUT = join(ROOT, "public", "data", "sf-fog-contours.geojson");
  run([
    join(TMP_DIR, "fog.json"),
    "-clip", "bbox=-122.55,37.70,-122.35,37.85",
    "-each", `hours = Math.round((${FOG_HOURS_FIELD} / ${FOG_HOURS_DIVISOR}) * 10) / 10`,
    "-filter-fields", "hours",
    "-o", CONTOURS_OUT, "format=geojson",
  ]);
  // Round off the raster-derived right angles with three iterations of
  // Chaikin's corner-cutting algorithm. The USGS contours come out of
  // the gridded source as stair-stepped polygons; Chaikin replaces each
  // corner with two interpolated points, so adjacent edges become a soft
  // bend instead of a 90° turn while topology stays intact.
  const smoothed = JSON.parse(readFileSync(CONTOURS_OUT, "utf8"));
  smoothed.features.forEach(f => {
    const g = f.geometry;
    if (!g) return;
    if (g.type === "Polygon") {
      g.coordinates = g.coordinates.map(ring => chaikinSmooth(ring, 3));
    } else if (g.type === "MultiPolygon") {
      g.coordinates = g.coordinates.map(poly =>
        poly.map(ring => chaikinSmooth(ring, 3))
      );
    }
  });
  writeFileSync(CONTOURS_OUT, JSON.stringify(smoothed));
  const contours = JSON.parse(readFileSync(CONTOURS_OUT, "utf8"));
  console.log(`✓ wrote ${CONTOURS_OUT} (${contours.features.length} raw fog contour polygons in SF)`);
}

main();
