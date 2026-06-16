#!/usr/bin/env node
//
// Build pipeline: USGS GOES summertime fog/low-cloud contours (Torregrosa
//                 et al. 2016, 1999-2009) ──► public/data/avas/wine-fog-contours.geojson
//
// Source: data/raw/fog_belt_zones.shp — the same USGS "Fog Belt Zones"
// shapefile the SF /fog map uses (from ScienceBase item 59fb6133…). The
// `contour` attribute is fog hours × 100 (e.g. 1300 = 13.0 hrs/day).
//
// Steps:
//   1. Reproject to WGS84 (Mapbox needs lng/lat).
//   2. Clip to a Napa/Sonoma mask.
//   3. Normalize contour → hours, sort large→small so the nested
//      iso-contours paint correctly, Chaikin-smooth the gridded corners.
//
// Re-run:  node scripts/build-wine-fog.mjs
// (Needs the source shapefile in data/raw/ — extracted from
//  DecadalFLCCrasters.zip → FogBeltZones.zip on ScienceBase.)

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const FOG_SHP = join(ROOT, "data", "raw", "fog_belt_zones.shp");
const TMP_DIR = join(ROOT, "data", "tmp");
const OUT_PATH = join(ROOT, "public", "data", "avas", "wine-fog-contours.geojson");

// Frames both counties with a little Pacific margin on the Sonoma coast
// so the foggiest coastal bands aren't sheared off at the shoreline.
const WINE_CLIP_BBOX = "-123.75,37.98,-121.95,38.98";

// Chaikin corner-cutting — rounds the raster-stepped contour corners.
function chaikinSmooth(ring, iterations = 2) {
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

// Planar shoelace — only used to order polygons (big first), so exact
// geodesic area isn't needed.
function ringArea(ring) {
  let s = 0;
  for (let i = 0; i < ring.length - 1; i++) {
    s += ring[i][0] * ring[i + 1][1] - ring[i + 1][0] * ring[i][1];
  }
  return Math.abs(s / 2);
}
function featureArea(f) {
  const g = f.geometry;
  if (!g) return 0;
  const polys = g.type === "Polygon" ? [g.coordinates] : g.coordinates;
  return polys.reduce((a, p) => a + ringArea(p[0]), 0);
}

function run(args) {
  console.log("» mapshaper", args.join(" "));
  execFileSync("npx", ["--no-install", "mapshaper", ...args], { stdio: "inherit", cwd: ROOT });
}

function main() {
  if (!existsSync(FOG_SHP)) {
    console.error(`Missing ${FOG_SHP}`);
    console.error("Extract FogBeltZones.zip (from ScienceBase DecadalFLCCrasters.zip) into data/raw/.");
    process.exit(1);
  }
  mkdirSync(TMP_DIR, { recursive: true });
  mkdirSync(dirname(OUT_PATH), { recursive: true });

  run([FOG_SHP, "-proj", "wgs84", "-o", join(TMP_DIR, "fog_wgs84.json"), "format=geojson"]);
  run([
    join(TMP_DIR, "fog_wgs84.json"),
    "-clip", `bbox=${WINE_CLIP_BBOX}`,
    "-each", "hours = Math.round((contour/100)*10)/10",
    "-filter-fields", "hours",
    "-o", join(TMP_DIR, "fog_wine.json"), "format=geojson",
  ]);

  const fc = JSON.parse(readFileSync(join(TMP_DIR, "fog_wine.json"), "utf8"));
  // Largest polygon first so the small high-fog cores paint on top.
  fc.features.sort((a, b) => featureArea(b) - featureArea(a));
  fc.features.forEach(f => {
    const g = f.geometry;
    if (!g) return;
    if (g.type === "Polygon") g.coordinates = g.coordinates.map(r => chaikinSmooth(r));
    else if (g.type === "MultiPolygon")
      g.coordinates = g.coordinates.map(p => p.map(r => chaikinSmooth(r)));
  });
  fc.metadata = {
    source: "USGS GOES FLCC summertime fog/low-cloud, Torregrosa et al. 2016 (1999-2009)",
    units: "hours = average summer fog/low-cloud hrs per day",
    builtAt: "2026-06-13",
  };
  writeFileSync(OUT_PATH, JSON.stringify(fc));

  const hrs = fc.features.map(f => f.properties.hours);
  console.log(`✓ wrote ${OUT_PATH} (${fc.features.length} fog bands, ${Math.min(...hrs)}–${Math.max(...hrs)} hrs/day)`);
}

main();
