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
