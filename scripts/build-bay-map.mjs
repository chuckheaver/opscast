// Builds app/microclimates/bay-zones.json: the Bay Area shoreline and eleven
// named microclimate zones, projected to SVG path data for BayMap.
//
//   npm i --no-save polygon-clipping @geo-maps/earth-lands-1km
//   node scripts/build-bay-map.mjs
//
// Land is the 1 km geo-maps world land layer (MIT). Zones are hand-drawn
// generalized outlines — drawn loosely over water, then clipped to land so the
// shoreline is real, and made non-overlapping (a zone later in ZONES wins
// where two overlap). Boundaries are schematic: the page says so.

import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const pc = require("polygon-clipping");
const LAND = require.resolve("@geo-maps/earth-lands-1km/map.geo.json");

const BBOX = [-123.15, 37.08, -121.55, 38.62];      // lon0, lat0, lon1, lat1
const W = 760;
const K = Math.cos(((BBOX[1] + BBOX[3]) / 2) * Math.PI / 180);
const H = Math.round(W * (BBOX[3] - BBOX[1]) / ((BBOX[2] - BBOX[0]) * K));
const X = lon => ((lon - BBOX[0]) / (BBOX[2] - BBOX[0])) * W;
const Y = lat => ((BBOX[3] - lat) / (BBOX[3] - BBOX[1])) * H;

// Painted in this order; later zones take precedence where outlines overlap.
const ZONES = {
  tunnel: [[-122.36, 38.17], [-122.36, 38.08], [-122.26, 38.06], [-122.20, 37.98], [-122.17, 37.88], [-122.12, 37.80],
           [-122.03, 37.72], [-121.95, 37.62], [-121.85, 37.5], [-121.5, 37.5], [-121.5, 38.70], [-122.40, 38.78],
           [-122.15, 38.25]],
  sunbowl: [[-122.31, 37.52], [-122.20, 37.57], [-122.10, 37.55], [-121.96, 37.50], [-121.85, 37.50],
            [-121.5, 37.5], [-121.5, 37.0], [-121.88, 37.05], [-121.98, 37.15], [-122.12, 37.28],
            [-122.24, 37.40], [-122.32, 37.50]],
  vines: [[-123.00, 38.42], [-122.90, 38.27], [-122.80, 38.33], [-122.68, 38.34], [-122.55, 38.29],
          [-122.42, 38.21], [-122.33, 38.14], [-122.20, 38.16], [-122.12, 38.30], [-122.20, 38.52],
          [-122.35, 38.72], [-122.72, 38.76], [-123.08, 38.56]],
  // The shoreline where the Bay narrows through the Carquinez Strait into
  // Suisun Bay and the Delta — the path the evening breeze takes inland.
  delta: [[-122.27, 38.07], [-122.20, 38.13], [-122.05, 38.17], [-121.85, 38.15], [-121.50, 38.12],
          [-121.50, 37.96], [-121.80, 37.97], [-121.95, 37.99], [-122.10, 37.98], [-122.22, 38.01]],
  bayshore: [[-122.43, 37.71], [-122.38, 37.66], [-122.40, 37.62], [-122.32, 37.50], [-122.31, 37.52],
             [-122.20, 37.57], [-122.10, 37.55], [-121.96, 37.50], [-121.93, 37.52], [-122.05, 37.62],
             [-122.13, 37.72], [-122.22, 37.82], [-122.26, 37.90], [-122.24, 38.04], [-122.30, 38.07], [-122.43, 37.97],
             [-122.40, 37.85], [-122.30, 37.70], [-122.36, 37.70]],
  ridges: [[-122.45, 37.64], [-122.44, 37.58], [-122.36, 37.45], [-122.28, 37.30], [-122.15, 37.12],
           [-122.00, 36.95], [-121.85, 37.00], [-121.88, 37.05], [-121.98, 37.15], [-122.12, 37.28],
           [-122.24, 37.40], [-122.32, 37.50], [-122.40, 37.62], [-122.38, 37.66]],
  hills: [[-122.30, 37.97], [-122.20, 37.98], [-122.17, 37.88], [-122.12, 37.80], [-122.03, 37.72],
          [-121.95, 37.62], [-121.85, 37.50], [-121.90, 37.47], [-121.93, 37.52], [-122.05, 37.62],
          [-122.13, 37.72], [-122.22, 37.82], [-122.26, 37.90]],
  gap: [[-122.92, 38.26], [-122.84, 38.11], [-122.72, 38.10], [-122.62, 38.15], [-122.50, 38.10],
        [-122.38, 38.10], [-122.42, 38.21], [-122.55, 38.29], [-122.68, 38.34], [-122.80, 38.33]],
  tam: [[-122.47, 37.84], [-122.58, 37.89], [-122.64, 37.94], [-122.72, 38.01], [-122.72, 38.10],
        [-122.62, 38.15], [-122.50, 38.10], [-122.40, 37.96], [-122.44, 37.86]],
  coast: [[-123.40, 38.75], [-123.40, 36.90], [-122.00, 36.90], [-122.00, 36.95], [-122.15, 37.12], [-122.28, 37.30],
          [-122.36, 37.45], [-122.44, 37.58], [-122.45, 37.64], [-122.43, 37.71], [-122.53, 37.71], [-122.53, 37.83],
          [-122.58, 37.89], [-122.64, 37.94], [-122.72, 38.01], [-122.72, 38.10], [-122.84, 38.11], [-122.92, 38.26],
          [-123.00, 38.42], [-123.08, 38.56], [-123.12, 38.75]],
  city: [[-122.54, 37.84], [-122.35, 37.84], [-122.35, 37.708], [-122.54, 37.708]],
};
const MERGE = {};                                   // zones drawn as one (none at present)

// -------------------------------------------------------------- land
const land = JSON.parse(readFileSync(LAND, "utf8"));
const box = [[[BBOX[0] - 0.3, BBOX[1] - 0.3], [BBOX[2] + 0.3, BBOX[1] - 0.3],
              [BBOX[2] + 0.3, BBOX[3] + 0.3], [BBOX[0] - 0.3, BBOX[3] + 0.3], [BBOX[0] - 0.3, BBOX[1] - 0.3]]];
const inBox = ring => ring.some(([x, y]) => x > BBOX[0] - 0.5 && x < BBOX[2] + 0.5 && y > BBOX[1] - 0.5 && y < BBOX[3] + 0.5);
const near = [];
for (const g of land.geometries || [land]) {
  const polys = g.type === "Polygon" ? [g.coordinates] : g.coordinates;
  for (const p of polys) {
    // Outer rings only: the Bay itself is carved into the coastline, and the
    // holes in this layer are inland lakes too small to matter at this scale.
    if (inBox(p[0])) near.push([p[0]]);
  }
}
const landClip = pc.intersection(box, near);

// ------------------------------------------------------ simplify + path
function dp(pts, tol) {
  if (pts.length < 3) return pts;
  const keep = new Uint8Array(pts.length); keep[0] = keep[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop();
    const [ax, ay] = pts[a], [bx, by] = pts[b];
    const dx = bx - ax, dy = by - ay, L = Math.hypot(dx, dy) || 1;
    let far = -1, md = tol;
    for (let i = a + 1; i < b; i++) {
      const d = Math.abs(dy * pts[i][0] - dx * pts[i][1] + bx * ay - by * ax) / L;
      if (d > md) { md = d; far = i; }
    }
    if (far > 0) { keep[far] = 1; stack.push([a, far], [far, b]); }
  }
  return pts.filter((_, i) => keep[i]);
}
// A closed ring starts and ends on the same point, which gives the simplifier
// a zero-length baseline; split it at the point farthest from the start.
function dpRing(pts, tol) {
  const open = pts.slice(0, -1);
  if (open.length < 4) return open;
  let far = 0, md = -1;
  open.forEach(([x, y], i) => { const d = Math.hypot(x - open[0][0], y - open[0][1]); if (d > md) { md = d; far = i; } });
  return dp(open.slice(0, far + 1), tol).concat(dp(open.slice(far).concat([open[0]]), tol).slice(1, -1));
}
const toPath = mp => mp.map(poly => poly.map(ring => {
  const pts = dpRing(ring.map(([lon, lat]) => [X(lon), Y(lat)]), 0.6);
  return pts.length < 3 ? "" : "M" + pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join("L") + "Z";
}).join("")).join("");

// ---------------------------------------------------------------- zones
const order = Object.keys(ZONES);
const clipped = {};
// Zones are NOT clipped to land here: the page clips them to the shoreline
// after blurring, so the colour stays full-strength right up to the coast
// instead of fading into the water.
order.forEach((k, i) => {
  let z = [[[...ZONES[k], ZONES[k][0]]]];
  const later = order.slice(i + 1).filter(j => (MERGE[j] || j) !== (MERGE[k] || k)).map(j => [[...ZONES[j], ZONES[j][0]]]);
  if (later.length) z = pc.difference(z, ...later);
  const key = MERGE[k] || k;
  clipped[key] = clipped[key] ? pc.union(clipped[key], z) : z;
});

// A label anchor per zone: the centroid of its largest piece's outer ring.
const anchor = mp => {
  let best = null, area = 0;
  for (const poly of mp) {
    const r = poly[0].map(([lon, lat]) => [X(lon), Y(lat)]);
    let a = 0, cx = 0, cy = 0;
    for (let i = 0; i < r.length - 1; i++) {
      const f = r[i][0] * r[i + 1][1] - r[i + 1][0] * r[i][1];
      a += f; cx += (r[i][0] + r[i + 1][0]) * f; cy += (r[i][1] + r[i + 1][1]) * f;
    }
    if (Math.abs(a) > area) { area = Math.abs(a); best = [cx / (3 * a), cy / (3 * a)]; }
  }
  return best && best.map(v => Math.round(v));
};

// Where each zone's number sits on the map.
const LABELS = {
  coast: [-122.93, 38.06], city: [-122.45, 37.765], bayshore: [-122.19, 37.70], ridges: [-122.16, 37.21], hills: [-122.215, 37.885],
  gap: [-122.82, 38.20], tam: [-122.60, 38.03], sunbowl: [-121.85, 37.28], vines: [-122.47, 38.53],
  tunnel: [-121.74, 37.79], delta: [-121.80, 38.005],
};

const PLACES = [
  ["San Francisco", -122.42, 37.77], ["Oakland", -122.27, 37.80], ["San Jose", -121.89, 37.34],
  ["Santa Rosa", -122.71, 38.44], ["Napa", -122.29, 38.30], ["Petaluma", -122.64, 38.23],
  ["Walnut Creek", -122.06, 37.91], ["Livermore", -121.77, 37.68], ["Palo Alto", -122.14, 37.44],
  ["Half Moon Bay", -122.43, 37.46], ["San Rafael", -122.53, 37.97],
].map(([k, lon, lat]) => ({ k, x: Math.round(X(lon)), y: Math.round(Y(lat)) }));

// Softening happens on the page (a blur before clipping to the shoreline),
// which keeps adjacent zones touching. Chaikin is kept for reference but
// unused — rounding each zone separately opens slivers between neighbors.
function chaikin(ring, n = 3) {
  let pts = ring.slice(0, -1);
  for (let k = 0; k < n; k++) {
    const next = [];
    pts.forEach((p, i) => {
      const q = pts[(i + 1) % pts.length];
      next.push([0.75 * p[0] + 0.25 * q[0], 0.75 * p[1] + 0.25 * q[1]],
                [0.25 * p[0] + 0.75 * q[0], 0.25 * p[1] + 0.75 * q[1]]);
    });
    pts = next;
  }
  return pts;
}
const smoothPath = mp => mp.map(poly => poly.map(ring => {
  const pts = chaikin(ring.map(([lon, lat]) => [X(lon), Y(lat)]));
  return "M" + pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join("L") + "Z";
}).join("")).join("");

const PEAKS = [
  ["Mt Tamalpais", 2572, -122.5797, 37.9235, "right"], ["Mt Diablo", 3849, -121.9142, 37.8816, "below"],
  ["Loma Prieta", 3786, -121.8428, 37.1114, "right"],
].map(([k, ft, lon, lat, side]) => ({ k, ft, side, x: Math.round(X(lon)), y: Math.round(Y(lat)) }));

const WATER = [
  ["Pacific Ocean", -122.93, 37.40], ["San Francisco Bay", -122.28, 37.63], ["San Pablo Bay", -122.40, 38.055],
].map(([k, lon, lat]) => ({ k, x: Math.round(X(lon)), y: Math.round(Y(lat)) }));

// The breeze itself: west-to-east through the Strait and across Suisun Bay.
const BREEZE = [
  [[-122.25, 38.055], [-122.12, 38.045]],
  [[-122.03, 38.075], [-121.90, 38.06]],
].map(line => line.map(([lon, lat]) => [Math.round(X(lon)), Math.round(Y(lat))]));

const out = {
  W, H,
  source: "Shoreline: geo-maps earth-lands 1 km (MIT). Zones: generalized, hand-drawn, smoothed.",
  land: toPath(landClip),
  zones: Object.fromEntries(Object.entries(clipped).map(([k, mp]) => [k, {
    d: toPath(mp),
    at: LABELS[k] ? [Math.round(X(LABELS[k][0])), Math.round(Y(LABELS[k][1]))] : anchor(mp),
  }])),
  places: PLACES,
  peaks: PEAKS,
  water: WATER,
  breeze: BREEZE,
};
writeFileSync(new URL("../app/microclimates/bay-zones.json", import.meta.url), JSON.stringify(out));
console.log(`wrote bay-zones.json  ${W}×${H}  ${(JSON.stringify(out).length / 1024).toFixed(0)} KB`,
  Object.keys(out.zones).join(", "));
