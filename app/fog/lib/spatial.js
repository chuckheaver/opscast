// Point-in-polygon lookup over the neighborhood FeatureCollection.
// Pure JS ray-casting — adequate for ~40 SF neighborhoods. If the data
// grows (e.g. census blocks), swap this for an R-tree or @turf/boolean-point-in-polygon.

export function findNeighborhoodForPoint(fc, point) {
  const [lng, lat] = point;
  for (const f of fc.features) {
    if (pointInFeature([lng, lat], f)) return f;
  }
  return null;
}

// Find the most specific (smallest-area) USGS contour polygon containing
// a given point. Contour features can be nested — high-fog inner zones
// sit inside lower-fog outer zones — so picking the most specific one
// gives the highest applicable hours value for that exact location.
export function findContourForPoint(fc, point) {
  if (!fc) return null;
  const [lng, lat] = point;
  let best = null;
  let bestArea = Infinity;
  for (const f of fc.features) {
    if (!pointInFeature([lng, lat], f)) continue;
    const area = approxFeatureArea(f);
    if (area < bestArea) {
      best = f;
      bestArea = area;
    }
  }
  return best;
}

// Cheap planar area estimate in degrees² — fine for picking the smallest
// of a small set of overlapping polygons; we don't need true geodesic area.
function approxFeatureArea(feature) {
  const g = feature.geometry;
  if (!g) return Infinity;
  if (g.type === "Polygon") return ringArea(g.coordinates[0]);
  if (g.type === "MultiPolygon") {
    return g.coordinates.reduce((sum, poly) => sum + ringArea(poly[0]), 0);
  }
  return Infinity;
}

function ringArea(ring) {
  if (!ring || ring.length < 3) return 0;
  let a = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    a += (ring[j][0] + ring[i][0]) * (ring[j][1] - ring[i][1]);
  }
  return Math.abs(a / 2);
}

function pointInFeature(pt, feature) {
  const g = feature.geometry;
  if (!g) return false;
  if (g.type === "Polygon") return pointInPolygon(pt, g.coordinates);
  if (g.type === "MultiPolygon") {
    return g.coordinates.some(poly => pointInPolygon(pt, poly));
  }
  return false;
}

// `polygon` is [outerRing, ...holes], each ring is [[lng, lat], ...].
function pointInPolygon(pt, polygon) {
  if (!polygon.length) return false;
  if (!pointInRing(pt, polygon[0])) return false;
  for (let i = 1; i < polygon.length; i++) {
    if (pointInRing(pt, polygon[i])) return false; // inside a hole
  }
  return true;
}

function pointInRing([x, y], ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    const intersect =
      yi > y !== yj > y &&
      x < ((xj - xi) * (y - yi)) / (yj - yi + 1e-12) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}
