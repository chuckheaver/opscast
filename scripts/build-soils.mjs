#!/usr/bin/env node
//
// Build pipeline: USDA-NRCS SSURGO soil survey (Napa CA055 + Sonoma CA097)
//                 ──►  public/data/avas/soils.geojson
//
// Source: NRCS Soil Data Access (SDA) REST API — the authoritative US
// soil database (~1:24,000). No key. We pull:
//   1. Attributes per map unit (mukey): map-unit name, dominant soil
//      series, and dominant soil ORDER (taxonomic order — the clean
//      categorical we color the map by). mapunit joins to the survey
//      area through the legend table.
//   2. Polygon geometry (mupolygongeo as WKT), paged via OFFSET/FETCH so
//      no single response is huge (~12,800 polygons total).
// Then parse WKT → GeoJSON, attach attributes by mukey, and hand off to
// mapshaper for web simplification.
//
// Re-run:  node scripts/build-soils.mjs
// (Output is then simplified — see the mapshaper step at the end.)

import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const TMP_DIR = join(ROOT, "data", "tmp");
const RAW_PATH = join(TMP_DIR, "soils-raw.geojson");
const OUT_PATH = join(ROOT, "public", "data", "avas", "soils.geojson");

const SDA = "https://sdmdataaccess.nrcs.usda.gov/Tabular/post.rest";
const AREAS = ["CA055", "CA097"]; // Napa, Sonoma
const PAGE = 1500;

async function sda(query) {
  const res = await fetch(SDA, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ format: "JSON", query }),
  });
  if (!res.ok) throw new Error(`SDA HTTP ${res.status}`);
  const text = await res.text();
  if (text.trimStart().startsWith("<")) throw new Error(`SDA error: ${text.slice(0, 200)}`);
  return JSON.parse(text).Table || [];
}

// mukey → { muname, series, order }
async function fetchAttributes() {
  const list = AREAS.map(a => `'${a}'`).join(",");
  const rows = await sda(
    `SELECT m.mukey, m.muname,
       (SELECT TOP 1 c.compname FROM component c WHERE c.mukey=m.mukey ORDER BY c.comppct_r DESC) AS series,
       (SELECT TOP 1 c.taxorder FROM component c WHERE c.mukey=m.mukey ORDER BY c.comppct_r DESC) AS taxorder
     FROM mapunit m INNER JOIN legend l ON m.lkey=l.lkey
     WHERE l.areasymbol IN (${list})`
  );
  const byMukey = new Map();
  for (const [mukey, muname, series, taxorder] of rows) {
    byMukey.set(String(mukey), {
      muname: muname || null,
      series: series || null,
      order: taxorder || "Not ranked",
    });
  }
  console.log(`  attributes for ${byMukey.size} map units`);
  return byMukey;
}

const round5 = n => Math.round(n * 1e5) / 1e5;

// WKT "POLYGON ((x y, ...),(hole))" / "MULTIPOLYGON (((...)))" → GeoJSON.
function wktToGeometry(wkt) {
  const isMulti = wkt.startsWith("MULTIPOLYGON");
  const body = wkt.replace(/^MULTIPOLYGON\s*/, "").replace(/^POLYGON\s*/, "").trim();
  const parseRing = s =>
    s.split(",").map(pair => {
      const [x, y] = pair.trim().split(/\s+/).map(Number);
      return [round5(x), round5(y)];
    });
  // Split into ring groups. A polygon is "((ring),(ring))"; multipolygon
  // wraps several of those in an extra paren level.
  const parsePolygon = s =>
    s
      .replace(/^\(+/, "")
      .replace(/\)+$/, "")
      .split(/\)\s*,\s*\(/)
      .map(parseRing);
  if (!isMulti) {
    return { type: "Polygon", coordinates: parsePolygon(body) };
  }
  // MULTIPOLYGON: outer level splits polygons "(( )),(( ))"
  const polys = body
    .replace(/^\(/, "")
    .replace(/\)$/, "")
    .split(/\)\s*\)\s*,\s*\(\s*\(/)
    .map(p => parsePolygon(`((${p}))`.replace(/\(\(\(+/, "((").replace(/\)\)\)+/, "))")));
  return { type: "MultiPolygon", coordinates: polys };
}

async function fetchGeometry(byMukey) {
  const features = [];
  for (const area of AREAS) {
    let offset = 0;
    for (;;) {
      process.stdout.write(`  ${area} polygons ${offset}–${offset + PAGE}… `);
      const rows = await sda(
        `SELECT mukey, mupolygongeo.STAsText() AS g FROM mupolygon
         WHERE areasymbol='${area}' ORDER BY mupolygonkey
         OFFSET ${offset} ROWS FETCH NEXT ${PAGE} ROWS ONLY`
      );
      console.log(rows.length);
      for (const [mukey, wkt] of rows) {
        if (!wkt) continue;
        const attr = byMukey.get(String(mukey)) || {};
        let geometry;
        try {
          geometry = wktToGeometry(wkt);
        } catch {
          continue;
        }
        features.push({
          type: "Feature",
          geometry,
          properties: {
            mukey: String(mukey),
            name: attr.muname || null,
            series: attr.series || null,
            order: attr.order || "Not ranked",
          },
        });
      }
      if (rows.length < PAGE) break;
      offset += rows.length;
    }
  }
  return features;
}

async function main() {
  mkdirSync(TMP_DIR, { recursive: true });
  mkdirSync(dirname(OUT_PATH), { recursive: true });
  console.log("Fetching SSURGO attributes (NRCS SDA)…");
  const byMukey = await fetchAttributes();
  console.log("Fetching SSURGO polygons…");
  const features = await fetchGeometry(byMukey);
  writeFileSync(RAW_PATH, JSON.stringify({ type: "FeatureCollection", features }));
  console.log(`  raw: ${features.length} polygons → ${RAW_PATH}`);

  // Web simplification: Visvalingam 18% keeps soil-body shape while
  // cutting vertices hard; -clean fixes any self-intersections from it.
  console.log("Simplifying for web (mapshaper)…");
  execFileSync(
    "npx",
    ["--no-install", "mapshaper", RAW_PATH,
     "-simplify", "6%", "keep-shapes",
     "-clean",
     "-o", OUT_PATH, "format=geojson", "precision=0.00001"],
    { stdio: "inherit", cwd: ROOT }
  );

  const out = JSON.parse(readFileSync(OUT_PATH, "utf8"));
  const orders = {};
  out.features.forEach(f => {
    const o = f.properties.order || "Not ranked";
    orders[o] = (orders[o] || 0) + 1;
  });
  const sizeMB = (readFileSync(OUT_PATH).length / 1e6).toFixed(1);
  console.log(`✓ wrote ${out.features.length} soil polygons (${sizeMB} MB) → ${OUT_PATH}`);
  console.log("  soil orders:", JSON.stringify(orders));
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
