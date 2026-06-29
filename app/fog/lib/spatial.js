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

// Find a neighborhood feature by its `name` property (exact match).
export function findFeatureByName(fc, name) {
  if (!fc || !name) return null;
  return fc.features.find(f => f.properties?.name === name) || null;
}

// A representative interior-ish point for a polygon feature: the area
// centroid of its largest outer ring. Good enough to drop a pin and run
// the point-in-polygon lookups when the user picks a neighborhood by name
// (rather than clicking an exact spot). Returns [lng, lat] or null.
export function centroidOfFeature(feature) {
  const g = feature?.geometry;
  if (!g) return null;
  let ring = null;
  if (g.type === "Polygon") ring = g.coordinates[0];
  else if (g.type === "MultiPolygon") {
    let best = -Infinity;
    for (const poly of g.coordinates) {
      const a = ringArea(poly[0]);
      if (a > best) { best = a; ring = poly[0]; }
    }
  }
  if (!ring || ring.length < 3) return null;
  let x = 0, y = 0, area2 = 0;
  for (let i = 0; i < ring.length - 1; i++) {
    const [x0, y0] = ring[i];
    const [x1, y1] = ring[i + 1];
    const cross = x0 * y1 - x1 * y0;
    area2 += cross;
    x += (x0 + x1) * cross;
    y += (y0 + y1) * cross;
  }
  if (area2 === 0) return ring[0];
  return [x / (3 * area2), y / (3 * area2)];
}

// Bounding box of a feature's geometry as [[west, south], [east, north]],
// suitable for map.fitBounds. Returns null if there are no coordinates.
export function bboxOfFeature(feature) {
  const g = feature?.geometry;
  if (!g) return null;
  let w = Infinity, s = Infinity, e = -Infinity, n = -Infinity;
  const polys = g.type === "Polygon" ? [g.coordinates] : g.type === "MultiPolygon" ? g.coordinates : [];
  for (const poly of polys) {
    for (const ring of poly) {
      for (const [lng, lat] of ring) {
        if (lng < w) w = lng;
        if (lng > e) e = lng;
        if (lat < s) s = lat;
        if (lat > n) n = lat;
      }
    }
  }
  return e === -Infinity ? null : [[w, s], [e, n]];
}

// Does `feature`'s geometry intersect ANY feature in collection `fc`?
// Answers "is any part of this neighborhood inside a hazard zone?" for the
// neighborhood-level Seismic / Tsunami readouts. Polygon–polygon test:
// bbox reject → either ring's vertices inside the other → edge crossings.
export function featureIntersectsAny(feature, fc) {
  if (!feature || !fc?.features) return false;
  const aPolys = toPolygons(feature.geometry);
  for (const f of fc.features) {
    for (const a of aPolys) {
      for (const b of toPolygons(f.geometry)) {
        if (polygonsIntersect(a, b)) return true;
      }
    }
  }
  return false;
}

// Normalise a geometry to an array of polygons, each [outerRing, ...holes].
function toPolygons(g) {
  if (!g) return [];
  if (g.type === "Polygon") return [g.coordinates];
  if (g.type === "MultiPolygon") return g.coordinates;
  return [];
}

function ringBbox(ring) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const [x, y] of ring) {
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  }
  return [minX, minY, maxX, maxY];
}

function polygonsIntersect(a, b) {
  const ra = a[0], rb = b[0];
  if (!ra?.length || !rb?.length) return false;
  // Quick bounding-box reject.
  const [aMinX, aMinY, aMaxX, aMaxY] = ringBbox(ra);
  const [bMinX, bMinY, bMaxX, bMaxY] = ringBbox(rb);
  if (aMaxX < bMinX || bMaxX < aMinX || aMaxY < bMinY || bMaxY < aMinY) return false;
  // Either polygon's vertices inside the other (covers containment + overlap).
  for (const pt of ra) if (pointInPolygon(pt, b)) return true;
  for (const pt of rb) if (pointInPolygon(pt, a)) return true;
  // Edge crossings (covers overlap with no vertex inside the other).
  for (let i = 0; i < ra.length - 1; i++) {
    for (let j = 0; j < rb.length - 1; j++) {
      if (segmentsIntersect(ra[i], ra[i + 1], rb[j], rb[j + 1])) return true;
    }
  }
  return false;
}

function segmentsIntersect(p1, p2, p3, p4) {
  const d = (a, b, c) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
  const d1 = d(p3, p4, p1), d2 = d(p3, p4, p2);
  const d3 = d(p1, p2, p3), d4 = d(p1, p2, p4);
  return ((d1 > 0) !== (d2 > 0)) && ((d3 > 0) !== (d4 > 0));
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
