// Server-side elevation lookup against the local USGS NED 10 m DEM —
// the same GeoTIFF that drives the /microclimates pipeline. Direct pixel
// sampling beats the Mapbox Terrain v2 contour-average for accuracy
// (the contours are spaced 10 m apart and Mapbox averages 5 nearby
// features, which smooths real local variation away).
//
// Behaviour: GET /api/elevation?lat=…&lng=…
//   - Returns { ft, source: "usgs-ned-10m" } for points inside the DEM.
//   - Returns { ft: null, source: "outside" } when the point lies outside
//     the tile so the caller can fall back to the Mapbox lookup.
//
// The DEM is opened once and cached in module scope so subsequent requests
// hit a single in-memory raster (warm invocations cost a single array
// index; cold invocations pay ~1 s to read+decode the 12 MB Float32 grid).

import { NextResponse } from "next/server";
import { fromFile } from "geotiff";
import { readdir } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

const DEM_DIR = path.join(process.cwd(), "data/raw");

let demPromise = null;

async function loadDem() {
  if (demPromise) return demPromise;
  demPromise = (async () => {
    const files = await readdir(DEM_DIR);
    const demName = files.find(f => f.toLowerCase().endsWith(".tif"));
    if (!demName) throw new Error("No DEM .tif in data/raw");
    const tiff = await fromFile(path.join(DEM_DIR, demName));
    const img = await tiff.getImage();
    const [west, south, east, north] = img.getBoundingBox();
    const W = img.getWidth();
    const H = img.getHeight();
    const elev = (await img.readRasters())[0];
    return { elev, W, H, west, south, east, north };
  })().catch(err => {
    // Reset on failure so the next request can retry instead of being
    // stuck with a rejected promise.
    demPromise = null;
    throw err;
  });
  return demPromise;
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const lat = Number(searchParams.get("lat"));
  const lng = Number(searchParams.get("lng"));
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return NextResponse.json({ error: "lat and lng required" }, { status: 400 });
  }

  let dem;
  try {
    dem = await loadDem();
  } catch (e) {
    return NextResponse.json({ ft: null, source: "error", error: e.message }, { status: 500 });
  }

  if (lng < dem.west || lng > dem.east || lat < dem.south || lat > dem.north) {
    return NextResponse.json({ ft: null, source: "outside" });
  }

  const col = Math.min(dem.W - 1, Math.max(0, Math.floor(((lng - dem.west) / (dem.east - dem.west)) * dem.W)));
  const row = Math.min(dem.H - 1, Math.max(0, Math.floor(((dem.north - lat) / (dem.north - dem.south)) * dem.H)));
  const meters = dem.elev[row * dem.W + col];

  if (!Number.isFinite(meters)) {
    return NextResponse.json({ ft: null, source: "nodata" });
  }

  return NextResponse.json({
    ft: Math.round(meters * 3.28084),
    source: "usgs-ned-10m",
  });
}
