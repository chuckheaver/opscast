// Spatial tags for a point: fog hours, fog-map neighborhood, SFAR
// neighborhood and district. Shared by geocode-listings.mjs (tags every
// listing) and validate-listings.mjs (re-tags a pin it has to move), so a
// moved pin is tagged exactly like a geocoded one.

import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { findNeighborhoodForPoint, findContourForPoint } from "../app/fog/lib/spatial.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC_DATA = join(ROOT, "public", "data");
const CONTOURS = JSON.parse(readFileSync(join(PUBLIC_DATA, "sf-fog-contours.geojson"), "utf8"));
const FOG_NEIGH = JSON.parse(readFileSync(join(PUBLIC_DATA, "sf-fog-neighborhoods.geojson"), "utf8"));
const REALTOR = JSON.parse(readFileSync(join(PUBLIC_DATA, "sf-realtor-neighborhoods.geojson"), "utf8"));

// ── Nearest-neighborhood snap ───────────────────────────────────────────────
// Presidio, Golden Gate Park, and Lincoln Park are parkland with no real
// estate (they carry a null district_num in the realtor data). A listing that
// geocodes into one of them is an edge case — snap it to the nearest
// neighborhood polygon that actually has real estate.
const KX = Math.cos((37.77 * Math.PI) / 180); // scale lng→x at SF latitude

function segDist2(px, py, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay;
  const len2 = dx * dx + dy * dy;
  let t = len2 ? ((px - ax) * dx + (py - ay) * dy) / len2 : 0;
  t = t < 0 ? 0 : t > 1 ? 1 : t;
  const ex = px - (ax + t * dx), ey = py - (ay + t * dy);
  return ex * ex + ey * ey;
}
function featureMinDist2([lng, lat], feature) {
  const g = feature.geometry;
  if (!g) return Infinity;
  const px = lng * KX, py = lat;
  const polys =
    g.type === "Polygon" ? [g.coordinates] : g.type === "MultiPolygon" ? g.coordinates : [];
  let best = Infinity;
  for (const poly of polys)
    for (const ring of poly)
      for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
        const d = segDist2(px, py, ring[j][0] * KX, ring[j][1], ring[i][0] * KX, ring[i][1]);
        if (d < best) best = d;
      }
  return best;
}
function nearestRealtorWithRE(point) {
  let best = null, bestD = Infinity;
  for (const f of REALTOR.features) {
    if (f.properties?.district_num == null) continue; // skip parkland
    const d = featureMinDist2(point, f);
    if (d < bestD) { bestD = d; best = f; }
  }
  return best;
}

// ── Spatial tagging ─────────────────────────────────────────────────────────
export function tag(point) {
  const contour = findContourForPoint(CONTOURS, point);
  const fogN = findNeighborhoodForPoint(FOG_NEIGH, point);
  let realtor = findNeighborhoodForPoint(REALTOR, point);
  // Landed in a no-real-estate park polygon → reassign to the nearest
  // neighborhood that has real estate. (A point outside all polygons stays
  // null so the SF-only guard still drops it.)
  if (realtor && realtor.properties?.district_num == null) {
    realtor = nearestRealtorWithRE(point) || realtor;
  }
  return {
    fogHours: contour?.properties?.hours ?? fogN?.properties?.fogHours ?? null,
    fogNeighborhood: fogN?.properties?.name ?? null,
    neighborhood: realtor?.properties?.nbrhood ?? null,
    district: realtor?.properties?.district ?? null,
    districtNum: realtor?.properties?.district_num ?? null,
  };
}

