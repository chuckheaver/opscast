// Data helpers for the Wine Country AVA map.
//
// The source files (public/data/avas/*.geojson) are the Napa + Sonoma
// slices of the UC Davis AVA Digitizing Project (CC0). AVAs nest and
// overlap freely — Russian River Valley sits inside Northern Sonoma,
// contains Green Valley and Chalk Hill, and also overlaps Sonoma Coast —
// so rather than forcing a tree, we render every sub-AVA as a
// semi-transparent fill (largest first, so small ones paint on top) and
// answer clicks with the full stack of appellations at that point.

// Umbrella appellations drawn as outlines instead of fills. North Coast
// spans six counties and would swallow the whole map, so it's kept for
// point lookups but never drawn.
export const REGION_NAMES = new Set([
  "North Coast",
  "Napa Valley",
  "Northern Sonoma",
  "Sonoma Coast",
]);

// Categorical palette cycled across the sub-AVAs. Wine-leaning hues but
// spaced for contrast against the streets basemap.
const PALETTE = [
  "#7c2d92", "#c2410c", "#0e7490", "#a21caf", "#4d7c0f",
  "#b91c1c", "#1d4ed8", "#b45309", "#15803d", "#9f1239",
  "#6d28d9", "#0f766e", "#ca8a04", "#be185d", "#3f6212",
  "#7e22ce", "#0369a1", "#dc2626",
];

// Planar shoelace area scaled by cos(latitude) — only used to ORDER
// polygons (big fills under small fills), so true geodesic area isn't
// needed.
function ringArea(ring) {
  let sum = 0;
  for (let i = 0; i < ring.length - 1; i++) {
    const [x1, y1] = ring[i];
    const [x2, y2] = ring[i + 1];
    sum += x1 * y2 - x2 * y1;
  }
  return Math.abs(sum / 2);
}

function featureArea(feature) {
  const g = feature.geometry;
  const polys = g.type === "Polygon" ? [g.coordinates] : g.coordinates;
  return polys.reduce((acc, poly) => acc + ringArea(poly[0]), 0);
}

// Vertex-average of the largest outer ring — cheap label anchor that
// stays inside all of these mostly-convex valley shapes.
function labelPoint(feature) {
  const g = feature.geometry;
  const polys = g.type === "Polygon" ? [g.coordinates] : g.coordinates;
  let best = polys[0][0];
  let bestArea = -1;
  for (const poly of polys) {
    const a = ringArea(poly[0]);
    if (a > bestArea) {
      bestArea = a;
      best = poly[0];
    }
  }
  let sx = 0, sy = 0;
  for (const [x, y] of best) {
    sx += x;
    sy += y;
  }
  return [sx / best.length, sy / best.length];
}

const splitNames = s =>
  (s || "")
    .split(/[|,]/)
    .map(x => x.trim())
    .filter(Boolean);

// Merge the two county files into one FeatureCollection:
//   - dedupes shared features (North Coast, Los Carneros appear in both)
//   - flattens properties to what the map + panel actually use
//   - sorts fills large→small so overlapping sub-AVAs stay clickable
export function mergeAvaCollections(napa, sonoma) {
  const byId = new Map();
  for (const f of [...napa.features, ...sonoma.features]) {
    if (!byId.has(f.properties.ava_id)) byId.set(f.properties.ava_id, f);
  }
  const features = [...byId.values()].map(f => {
    const p = f.properties;
    const name = (p.name || "").trim();
    const counties = splitNames(p.county);
    return {
      type: "Feature",
      geometry: f.geometry,
      properties: {
        ava_id: p.ava_id,
        name,
        kind: REGION_NAMES.has(name) ? "region" : "ava",
        inNapa: counties.includes("Napa"),
        inSonoma: counties.includes("Sonoma"),
        established: p.created ? p.created.slice(0, 4) : null,
        within: splitNames(p.within),
        contains: splitNames(p.contains),
        area: featureArea(f),
        color: "",
      },
    };
  });
  features.sort((a, b) => b.properties.area - a.properties.area);
  // Color assignment after the sort so it's stable for a given dataset.
  features
    .filter(f => f.properties.kind === "ava")
    .forEach((f, i) => {
      f.properties.color = PALETTE[i % PALETTE.length];
    });
  return { type: "FeatureCollection", features };
}

// Centroid label points for the sub-AVA fills (regions label their
// outline instead).
export function buildLabelPoints(merged) {
  return {
    type: "FeatureCollection",
    features: merged.features
      .filter(f => f.properties.kind === "ava")
      .map(f => ({
        type: "Feature",
        geometry: { type: "Point", coordinates: labelPoint(f) },
        properties: {
          ava_id: f.properties.ava_id,
          name: f.properties.name,
          color: f.properties.color,
          inNapa: f.properties.inNapa,
          inSonoma: f.properties.inSonoma,
        },
      })),
  };
}

// Ray-cast point-in-polygon over the full (unclipped) dataset, so the
// click stack is exact regardless of map tiles. Returns features
// smallest-first — the most specific appellation leads.
function pointInRing(point, ring) {
  const [px, py] = point;
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

function pointInFeature(point, feature) {
  const g = feature.geometry;
  const polys = g.type === "Polygon" ? [g.coordinates] : g.coordinates;
  for (const poly of polys) {
    if (!pointInRing(point, poly[0])) continue;
    // Inside the outer ring — make sure it's not in a hole.
    let inHole = false;
    for (let r = 1; r < poly.length; r++) {
      if (pointInRing(point, poly[r])) {
        inHole = true;
        break;
      }
    }
    if (!inHole) return true;
  }
  return false;
}

export function avasAtPoint(merged, point) {
  if (!merged) return [];
  return merged.features
    .filter(f => pointInFeature(point, f))
    .sort((a, b) => a.properties.area - b.properties.area);
}

// USGS fog contours nest: a point inside the 13-hr band is also inside
// every lower band. The highest `hours` among the polygons containing
// the point is the fog value there. Returns null outside all bands.
export function fogHoursAtPoint(fogFC, point) {
  if (!fogFC) return null;
  let max = null;
  for (const f of fogFC.features) {
    const h = f.properties.hours;
    if (h == null || (max != null && h <= max)) continue;
    if (pointInFeature(point, f)) max = h;
  }
  return max;
}

// Plain-English microclimate band from fog hours/day — the label that
// fills the winery popup's Microclimate row. Thresholds are tuned to the
// actual *land* distribution across the two counties (wineries span
// ~2.5–8 hrs/day; the 10–13 bands sit offshore), so the labels actually
// differentiate the warm inland sites from the marine-cooled ones.
export function fogMicroclimate(hours) {
  if (hours == null) return null;
  if (hours < 3.5) return "Warm · minimal fog";
  if (hours < 4.5) return "Moderate marine influence";
  if (hours < 5.5) return "Cool · regular fog";
  return "Strong marine / fog";
}

// Grape suitability is driven mostly by CLIMATE (the textbook Napa/Sonoma
// pattern: cool & foggy → Pinot/Chardonnay, warm & sunny → Cabernet/
// Zinfandel), so the grape list keys off fog hours. SOIL adds the terroir
// character note (drainage/vigor), which is why a returned object carries
// both. General guidance — not a parcel-level recommendation.
const SOIL_CHARACTER = {
  Mollisols: "deep, fertile valley floor — vigorous",
  Alfisols: "water-holding clay loam",
  Ultisols: "free-draining red hillside — low vigor, concentrated",
  Inceptisols: "young hillside soil",
  Entisols: "free-draining alluvial",
  Vertisols: "heavy clay — water-retentive",
};
export function typicalGrapes(soilOrder, fogHours) {
  if (fogHours == null) return null;
  let grapes;
  if (fogHours < 3.5) grapes = ["Cabernet Sauvignon", "Zinfandel", "Petite Sirah"];
  else if (fogHours < 4.5) grapes = ["Cabernet Sauvignon", "Merlot", "Sauvignon Blanc"];
  else if (fogHours < 5.5) grapes = ["Pinot Noir", "Chardonnay", "Merlot"];
  else grapes = ["Pinot Noir", "Chardonnay", "sparkling"];
  return { grapes: grapes.join(", "), list: grapes, character: SOIL_CHARACTER[soilOrder] || null };
}
