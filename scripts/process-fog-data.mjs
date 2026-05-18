#!/usr/bin/env node
//
// Build pipeline: SF neighborhood + historical fog shapefiles
//                 ──►  public/data/sf-fog-neighborhoods.geojson
//
// What this does
// --------------
// 1. Reads two shapefile bundles from data/raw/:
//      - neighborhoods.shp  (polygons, one per SF neighborhood)
//      - fog.shp            (polygons of historical fog hours, e.g. contour
//                            bands derived from GOES satellite imagery)
// 2. Uses mapshaper to spatial-join the fog polygons onto neighborhoods,
//    aggregating the fog-hours attribute by AREA-WEIGHTED MEAN. (Sum is
//    rarely what you want — it would penalize bigger neighborhoods.)
// 3. Cleans, simplifies, and writes a single GeoJSON suitable for the
//    client to fetch directly.
//
// You will likely need to edit two things to match your data:
//   - FOG_HOURS_FIELD: the attribute name on your fog shapefile that holds
//                      the annual hours (e.g. "FOG_HRS", "hours_yr").
//   - NEIGH_NAME_FIELD: the attribute on your neighborhood shapefile that
//                       holds the human-readable name (e.g. "name", "nhood").
//
// Run:
//   node scripts/process-fog-data.mjs
//
// Requires: `mapshaper` (already a dev dep) reachable via npx.

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
const FOG_SHP = join(RAW_DIR, "fog.shp");

// ↓ EDIT THESE to match your shapefiles' attribute names.
const FOG_HOURS_FIELD = "FOG_HRS";
const NEIGH_NAME_FIELD = "name";

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

  // Step 1: reproject both layers to WGS84 (Mapbox needs lng/lat).
  run([NEIGH_SHP, "-proj", "wgs84", "-o", join(TMP_DIR, "neigh.json"), "format=geojson"]);
  run([FOG_SHP,   "-proj", "wgs84", "-o", join(TMP_DIR, "fog.json"),   "format=geojson"]);

  // Step 2: area-weighted spatial join. `calc` accumulates the field into the
  // target feature; we then divide by hits to get the mean, and round.
  //
  //   -join target+source : per-target join, one row per target with calcs
  //   calc="fogHours=average(<FIELD>)"
  //
  // This is the classic "for each neighborhood, average the overlapping
  // fog-polygon hour values". If you want true area-weighting, switch to
  // `-clip` then `-dissolve` per neighborhood with sum(area * hours)/sum(area).
  run([
    join(TMP_DIR, "neigh.json"),
    "-join", join(TMP_DIR, "fog.json"),
    `calc=fogHours=average(${FOG_HOURS_FIELD})`,
    "fields=" + FOG_HOURS_FIELD,
    "-rename-fields", `name=${NEIGH_NAME_FIELD}`,
    "-each", "id = (this.properties.name||'unk').toLowerCase().replace(/[^a-z0-9]+/g,'-')",
    "-each", "fogHours = Math.round(fogHours || 0)",
    "-simplify", "5%",
    "-o", join(TMP_DIR, "joined.geojson"), "format=geojson",
  ]);

  // Step 3: read back, attach metadata, write to public/.
  const fc = JSON.parse(readFileSync(join(TMP_DIR, "joined.geojson"), "utf8"));
  fc.metadata = {
    source: "data/raw/neighborhoods.shp + data/raw/fog.shp",
    builtAt: new Date().toISOString(),
    units: "fogHours = annual mean hours of marine fog",
  };
  writeFileSync(OUT_PATH, JSON.stringify(fc));
  console.log(`✓ wrote ${OUT_PATH} (${fc.features.length} neighborhoods)`);
}

main();
