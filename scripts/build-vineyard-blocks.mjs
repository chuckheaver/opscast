#!/usr/bin/env node
//
// Build pipeline: DWR Statewide Crop Mapping (2023, by Land IQ)
//                 ──►  public/data/avas/vineyard-blocks.geojson
//
// Pulls every field polygon classed as Vineyard (MAIN_CROP = 'V') in
// Napa + Sonoma counties from DWR's hosted ArcGIS service — ~24,500
// blocks — instead of downloading the ~half-GB statewide file. Geometry
// is generalized server-side (~5 m tolerance) and coordinates trimmed to
// 5 decimals so the output stays web-servable.
//
// Kept attributes per block: acres, year planted (when known), county.
//
// Re-run to refresh:  node scripts/build-vineyard-blocks.mjs
// (No cache — the whole pull is ~13 paginated requests.)

import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT_PATH = join(ROOT, "public", "data", "avas", "vineyard-blocks.geojson");

// 2023 final Statewide Crop Mapping — service URL resolved from the CNRA
// catalog item d94e891e00364e49a2ed9e9e2e27837d.
const QUERY_URL =
  "https://utility.arcgis.com/usrsvcs/servers/d94e891e00364e49a2ed9e9e2e27837d" +
  "/rest/services/Planning/i15_Crop_Mapping_2023/MapServer/0/query";
const WHERE = "COUNTY IN ('Napa','Sonoma') AND MAIN_CROP LIKE 'V%'";
const PAGE = 2000;

const round5 = n => Math.round(n * 1e5) / 1e5;
function trimCoords(coords) {
  if (typeof coords[0] === "number") return [round5(coords[0]), round5(coords[1])];
  return coords.map(trimCoords);
}

async function fetchPage(offset) {
  const params = new URLSearchParams({
    where: WHERE,
    outFields: "ACRES,YR_PLANTED,COUNTY",
    returnGeometry: "true",
    outSR: "4326",
    geometryPrecision: "5",
    maxAllowableOffset: "0.00005", // ~5 m generalization
    resultOffset: String(offset),
    resultRecordCount: String(PAGE),
    orderByFields: "OBJECTID",
    f: "geojson",
  });
  const res = await fetch(`${QUERY_URL}?${params}`, {
    headers: { "User-Agent": "OpsCastWineMap/1.0 (chuck@chuckheaver.com)" },
  });
  if (!res.ok) throw new Error(`DWR query → HTTP ${res.status}`);
  const d = await res.json();
  if (d.error) throw new Error(`DWR query error: ${JSON.stringify(d.error)}`);
  return d;
}

async function main() {
  const features = [];
  let offset = 0;
  for (;;) {
    process.stdout.write(`  fetching blocks ${offset}–${offset + PAGE}… `);
    const d = await fetchPage(offset);
    const batch = d.features || [];
    console.log(`${batch.length}`);
    for (const f of batch) {
      const a = f.properties;
      features.push({
        type: "Feature",
        geometry: { type: f.geometry.type, coordinates: trimCoords(f.geometry.coordinates) },
        properties: {
          acres: a.ACRES != null ? Math.round(a.ACRES * 10) / 10 : null,
          // 0 / null both mean "unknown planting year" in the source.
          yr: a.YR_PLANTED || null,
          county: a.COUNTY,
        },
      });
    }
    if (batch.length < PAGE && !d.exceededTransferLimit) break;
    offset += batch.length;
  }

  writeFileSync(OUT_PATH, JSON.stringify({ type: "FeatureCollection", features }));
  const totalAcres = Math.round(features.reduce((s, f) => s + (f.properties.acres || 0), 0));
  const byCounty = {};
  features.forEach(f => {
    byCounty[f.properties.county] = (byCounty[f.properties.county] || 0) + 1;
  });
  console.log(`Wrote ${features.length} vineyard blocks (${totalAcres.toLocaleString()} acres) → ${OUT_PATH}`);
  console.log("  blocks by county:", JSON.stringify(byCounty));
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
