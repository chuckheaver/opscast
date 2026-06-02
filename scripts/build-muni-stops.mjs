// Enrich the existing sf-muni-stops.geojson with the SFMTA route list
// per stop (so each marker on the /fog map can show e.g. "5R · 21 · M"
// under the cross-street name).
//
// The route → stop mapping isn't reachable from this sandbox, so this
// script reads a locally-committed source file instead:
//
//   data/raw/muni-stops-raw.geojson
//
// Download it from DataSF's Muni Stops dataset:
//   https://data.sfgov.org/Transportation/Muni-Stops/i28k-bkz6
//   → Export → GeoJSON
//
// Properties used: `stop_id` and `routes` (a comma-separated list).
//
// Run with: npm run muni:build

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const STOPS_OUT = "./public/data/sf-muni-stops.geojson";
const STOPS_RAW = "./data/raw/muni-stops-raw.geojson";

async function main() {
  let raw;
  try {
    raw = JSON.parse(await readFile(STOPS_RAW, "utf8"));
  } catch (e) {
    console.error(
      `Missing ${STOPS_RAW}.\n` +
      `Download DataSF "Muni Stops" as GeoJSON and save it there:\n` +
      `  https://data.sfgov.org/Transportation/Muni-Stops/i28k-bkz6\n`
    );
    process.exit(1);
  }
  const existing = JSON.parse(await readFile(STOPS_OUT, "utf8"));

  // stop_id (string) → cleaned routes string.
  const routesByStop = new Map();
  for (const f of raw.features || []) {
    const p = f.properties || {};
    const id = String(p.stop_id ?? p.stopid ?? "");
    if (!id) continue;
    const routes = (p.routes ?? p.lines ?? "")
      .toString()
      .split(/[,;|]/)
      .map(s => s.trim())
      .filter(Boolean);
    if (routes.length) routesByStop.set(id, routes.join(" · "));
  }
  console.log(`Indexed routes for ${routesByStop.size} stops.`);

  let hit = 0;
  for (const f of existing.features) {
    const id = String(f.properties.stopid ?? f.properties.stop_id ?? "");
    const routes = routesByStop.get(id);
    if (routes) {
      f.properties.routes = routes;
      hit++;
    }
  }
  console.log(`Matched routes onto ${hit} / ${existing.features.length} existing stops.`);

  existing.builtAt = new Date().toISOString();
  await writeFile(STOPS_OUT, JSON.stringify(existing));
  console.log(`Wrote ${STOPS_OUT}`);
}

main().catch(e => { console.error(e); process.exit(1); });
