// Build the two halves of the /fog map's Transit layer:
//
//   1. public/data/sf-muni-routes.geojson — the SFMTA route patterns
//      (135 MultiLineString features) trimmed to the props we render.
//   2. public/data/sf-muni-stops.geojson  — the existing 3.2k stop
//      points, enriched with a `routes` string listing every route
//      whose line passes within MATCH_RADIUS_M of the stop.
//
// Source: data/raw/sf-muni-routes-raw.geojson
//   (DataSF "Muni Simple Routes" export — committed to the repo so the
//   build is reproducible without outbound network access).
//
// Run with: npm run muni:build

import { readFile, writeFile } from "node:fs/promises";

const ROUTES_RAW = "./data/raw/sf-muni-routes-raw.geojson";
const STOPS_IO   = "./public/data/sf-muni-stops.geojson";
const ROUTES_OUT = "./public/data/sf-muni-routes.geojson";

// Stops sit a few metres off the curb, route geometries follow the
// centerline of the street, so 40–50 m comfortably absorbs both.
const MATCH_RADIUS_M = 50;

// Metres-per-degree at SF latitude (~37.77°). Good enough for in-radius
// tests against ~50 m thresholds; we don't need geodesic precision.
const M_PER_DEG_LAT = 111_000;
const M_PER_DEG_LNG = 88_000;

// Squared distance (metres²) from a [lng, lat] point to the segment a–b.
function pointToSegmentM2(lng, lat, ax, ay, bx, by) {
  const dx = (bx - ax) * M_PER_DEG_LNG;
  const dy = (by - ay) * M_PER_DEG_LAT;
  const pdx = (lng - ax) * M_PER_DEG_LNG;
  const pdy = (lat - ay) * M_PER_DEG_LAT;
  const len2 = dx * dx + dy * dy;
  if (!len2) return pdx * pdx + pdy * pdy;
  let t = (pdx * dx + pdy * dy) / len2;
  if (t < 0) t = 0;
  else if (t > 1) t = 1;
  const cx = pdx - t * dx;
  const cy = pdy - t * dy;
  return cx * cx + cy * cy;
}

// Order route names so the metro letters come first, then the numbered
// buses in numeric order, then anything alpha-suffixed (8AX, 8BX, 5R…).
function routeSort(a, b) {
  const aN = Number.parseInt(a, 10);
  const bN = Number.parseInt(b, 10);
  const aIsNum = Number.isFinite(aN);
  const bIsNum = Number.isFinite(bN);
  if (aIsNum && bIsNum) return aN - bN || a.localeCompare(b);
  if (aIsNum) return 1;
  if (bIsNum) return -1;
  return a.localeCompare(b);
}

async function main() {
  const rawRoutes = JSON.parse(await readFile(ROUTES_RAW, "utf8"));

  // 1) Clean routes — strip Socrata bookkeeping props, keep only the
  //    handful FogMap renders on.
  const routeFeatures = rawRoutes.features.map(f => ({
    type: "Feature",
    properties: {
      route_name: f.properties.route_name,
      direction: f.properties.direction,
      pattern_type: f.properties.pattern_type,
    },
    geometry: f.geometry,
  }));
  await writeFile(ROUTES_OUT, JSON.stringify({
    type: "FeatureCollection",
    builtAt: new Date().toISOString(),
    features: routeFeatures,
  }));
  console.log(`Wrote ${ROUTES_OUT} (${routeFeatures.length} routes)`);

  // 2) Build a flat segment list (route_name, a, b) over every pattern.
  //    We could KD-tree these but with ~50k segments × 3.2k stops the
  //    bbox prefilter alone keeps this under ~2 s.
  const segments = [];
  for (const f of routeFeatures) {
    const lines =
      f.geometry.type === "MultiLineString"
        ? f.geometry.coordinates
        : [f.geometry.coordinates];
    for (const line of lines) {
      for (let i = 0; i < line.length - 1; i++) {
        const [ax, ay] = line[i];
        const [bx, by] = line[i + 1];
        segments.push({
          route: f.properties.route_name,
          ax, ay, bx, by,
          minX: Math.min(ax, bx),
          maxX: Math.max(ax, bx),
          minY: Math.min(ay, by),
          maxY: Math.max(ay, by),
        });
      }
    }
  }
  console.log(`Indexed ${segments.length} route segments`);

  // 3) Spatial join — for each stop, collect every route whose nearest
  //    segment lies within MATCH_RADIUS_M.
  const stops = JSON.parse(await readFile(STOPS_IO, "utf8"));
  const radLat = MATCH_RADIUS_M / M_PER_DEG_LAT;
  const radLng = MATCH_RADIUS_M / M_PER_DEG_LNG;
  const r2 = MATCH_RADIUS_M * MATCH_RADIUS_M;
  let matched = 0;
  for (const stop of stops.features) {
    const [lng, lat] = stop.geometry.coordinates;
    const minX = lng - radLng, maxX = lng + radLng;
    const minY = lat - radLat, maxY = lat + radLat;
    const hit = new Set();
    for (let i = 0; i < segments.length; i++) {
      const s = segments[i];
      if (s.maxX < minX || s.minX > maxX || s.maxY < minY || s.minY > maxY) continue;
      if (hit.has(s.route)) continue;
      const d2 = pointToSegmentM2(lng, lat, s.ax, s.ay, s.bx, s.by);
      if (d2 <= r2) hit.add(s.route);
    }
    if (hit.size) {
      stop.properties.routes = [...hit].sort(routeSort).join(" · ");
      matched++;
    } else {
      delete stop.properties.routes;
    }
  }
  console.log(`Matched routes onto ${matched} / ${stops.features.length} stops`);

  stops.builtAt = new Date().toISOString();
  await writeFile(STOPS_IO, JSON.stringify(stops));
  console.log(`Wrote ${STOPS_IO}`);
}

main().catch(e => { console.error(e); process.exit(1); });
