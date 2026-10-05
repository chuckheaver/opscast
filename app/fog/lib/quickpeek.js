// Point lookups for the Quick Peek card on a searched address: the nearest
// Muni stop, the nearest bike facility, the parcel's land use and the land
// use of the parcels touching it, its zoning, and any special district.
//
// Everything is read from files the map already serves (public/data and the
// parcel vector tiles), fetched on first use and cached for the session, so
// a plain map visit never pays for them.

import { VectorTile } from "@mapbox/vector-tile";
import Pbf from "pbf";
import { findNeighborhoodForPoint } from "./spatial";
import { BIKE_CLASSES } from "./bikes";

const cache = new Map();
function load(url, as = "json") {
  if (!cache.has(url)) {
    cache.set(url, fetch(url)
      .then(r => (r.ok ? (as === "json" ? r.json() : r.arrayBuffer()) : null))
      .catch(() => null));
  }
  return cache.get(url);
}

// ── Distances ────────────────────────────────────────────────────────────
// A local flat projection is exact enough at city scale (meters).
const M_LAT = 110_540;
const mLng = lat => 111_320 * Math.cos((lat * Math.PI) / 180);
function toXY([lng, lat], lat0) { return [lng * mLng(lat0), lat * M_LAT]; }
function segDist(p, a, b) {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const L = dx * dx + dy * dy;
  let t = L ? ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / L : 0;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(p[0] - (a[0] + t * dx), p[1] - (a[1] + t * dy));
}
export function fmtDist(m) {
  const ft = m * 3.28084;
  return ft < 1000 ? `${Math.round(ft / 10) * 10} ft` : `${(m / 1609.34).toFixed(1)} mi`;
}

// ── Muni ─────────────────────────────────────────────────────────────────
export async function nearestMuni(point) {
  const fc = await load("/data/sf-muni-stops.geojson");
  if (!fc) return null;
  const p = toXY(point, point[1]);
  let best = null, bd = Infinity;
  for (const f of fc.features) {
    const q = toXY(f.geometry.coordinates, point[1]);
    const d = Math.hypot(p[0] - q[0], p[1] - q[1]);
    if (d < bd) { bd = d; best = f; }
  }
  if (!best) return null;
  const name = String(best.properties.name || "").replace(/\s*&\s*/g, " & ");
  return { name, routes: best.properties.routes || "", dist: fmtDist(bd) };
}

// ── Bikes ────────────────────────────────────────────────────────────────
const BIKE_LABEL = Object.fromEntries(BIKE_CLASSES.map(c => [c.key, c.label]));
export async function nearestBike(point) {
  const fc = await load("/data/sf-bike-network.geojson");
  if (!fc) return null;
  const p = toXY(point, point[1]);
  let best = null, bd = Infinity;
  for (const f of fc.features) {
    const g = f.geometry;
    const lines = g.type === "LineString" ? [g.coordinates] : g.type === "MultiLineString" ? g.coordinates : [];
    for (const line of lines) {
      for (let i = 1; i < line.length; i++) {
        const d = segDist(p, toXY(line[i - 1], point[1]), toXY(line[i], point[1]));
        if (d < bd) { bd = d; best = f; }
      }
    }
  }
  if (!best) return null;
  const pr = best.properties;
  return {
    street: pr.street || "",
    type: BIKE_LABEL[pr.facility] || pr.symbology || pr.facility || "Bike route",
    cls: /^CLASS /.test(pr.facility || "") ? `Class ${pr.facility.slice(6)}` : (pr.symbology || "Bike route"),
    dist: fmtDist(bd),
  };
}

// ── Parcels: land use and what abuts it ─────────────────────────────────
// The map's own parcel tiles (z16), decoded here so the lookup works at any
// zoom. `t` is the parcel's land-use class.
export const LAND_USE = {
  RES: "Residential", MIX: "Mixed use", RETAIL: "Retail / entertainment", OFFICE: "Office",
  MED: "Medical", CIE: "Civic / institutional", PDR: "Industrial (PDR)", VISITOR: "Visitor / hotel",
  OPENSPACE: "Open space", PARKING: "Parking", VACANT: "Vacant",
};
const Z = 16;
const tileOf = ([lng, lat]) => {
  const n = 2 ** Z, r = (lat * Math.PI) / 180;
  return [((lng + 180) / 360) * n, ((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * n];
};
function inRing(x, y, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const a = ring[i], b = ring[j];
    if ((a.y > y) !== (b.y > y) && x < ((b.x - a.x) * (y - a.y)) / (b.y - a.y) + a.x) inside = !inside;
  }
  return inside;
}
const inRings = (x, y, rings) => rings.reduce((acc, r) => (inRing(x, y, r) ? !acc : acc), false);
function ringsDist(A, B) {
  // Smallest vertex-to-edge distance between two parcels, both directions.
  let d = Infinity;
  const pass = (P, Q) => {
    for (const rp of P) for (const v of rp) for (const rq of Q)
      for (let i = 1; i < rq.length; i++) {
        const e = segDist([v.x, v.y], [rq[i - 1].x, rq[i - 1].y], [rq[i].x, rq[i].y]);
        if (e < d) d = e;
      }
  };
  pass(A, B); pass(B, A);
  return d;
}

export async function parcelLandUse(point) {
  const [fx, fy] = tileOf(point);
  const tx = Math.floor(fx), ty = Math.floor(fy);
  // The tile under the point, plus any neighbor within ~40 m of it, so a
  // parcel on a tile edge still sees what abuts it across the edge.
  const tileM = (40_075_016 * Math.cos((point[1] * Math.PI) / 180)) / 2 ** Z;
  const near = 40 / tileM;
  const offs = [[0, 0]];
  for (const dx of [-1, 0, 1]) for (const dy of [-1, 0, 1]) {
    if (!dx && !dy) continue;
    const okx = dx === 0 || (dx < 0 ? fx - tx < near : tx + 1 - fx < near);
    const oky = dy === 0 || (dy < 0 ? fy - ty < near : ty + 1 - fy < near);
    if (okx && oky) offs.push([dx, dy]);
  }
  const parcels = [];
  let extent = 4096;
  await Promise.all(offs.map(async ([dx, dy]) => {
    const buf = await load(`/tiles/parcels/${Z}/${tx + dx}/${ty + dy}.pbf`, "buf");
    if (!buf) return;
    const layer = new VectorTile(new Pbf(buf)).layers.parcels;
    if (!layer) return;
    extent = layer.extent;
    for (let i = 0; i < layer.length; i++) {
      const f = layer.feature(i);
      if (f.type !== 3) continue;
      const rings = f.loadGeometry().map(r => r.map(q => ({ x: q.x + dx * layer.extent, y: q.y + dy * layer.extent })));
      parcels.push({ props: f.properties, rings });
    }
  }));
  if (!parcels.length) return null;
  const px = (fx - tx) * extent, py = (fy - ty) * extent;
  const mPer = tileM / extent;
  let subject = parcels.find(p => inRings(px, py, p.rings));
  if (!subject) {
    // Geocoded points can land on the sidewalk: take the nearest parcel within 25 m.
    let bd = Infinity;
    for (const p of parcels) {
      const d = ringsDist([[{ x: px, y: py }]], p.rings);
      if (d < bd) { bd = d; subject = p; }
    }
    if (bd * mPer > 25) subject = null;
  }
  if (!subject) return null;
  const tol = 2.5 / mPer;                       // touching within 2.5 m
  const abut = new Set();
  for (const p of parcels) {
    if (p === subject || p.props.blklot === subject.props.blklot) continue;
    if (ringsDist(subject.rings, p.rings) <= tol) abut.add(LAND_USE[p.props.t] || p.props.t);
  }
  const t = subject.props.t;
  return {
    use: LAND_USE[t] || t || "—",
    units: Number(subject.props.units) || 0,
    abutting: [...abut].filter(Boolean),
    block: (/^(\d{4}[A-Z]?)\d{3}[A-Z]?$/.exec(String(subject.props.blklot || "").toUpperCase()) || [])[1] || null,
  };
}

// ── Zoning and special districts ─────────────────────────────────────────
export async function zoningAndDistricts(point) {
  const [zoning, cbd] = await Promise.all([
    load("/data/sf-zoning.geojson"), load("/data/sf-community-benefit-districts.geojson"),
  ]);
  const z = zoning ? findNeighborhoodForPoint(zoning, point) : null;
  const c = cbd ? findNeighborhoodForPoint(cbd, point) : null;
  const special = [];
  if (c) special.push(`${c.properties.community_benefit_district} (CBD)`);
  if (z && /\(SD\)/.test(z.properties.code || "")) special.push(`${z.properties.code} special development`);
  return { zoning: z ? z.properties.code : null, zoningName: z ? z.properties.name : null, special };
}

// ── Incline ──────────────────────────────────────────────────────────────
// Ground slope at the address from the 10 m USGS elevation model
// (/api/elevation): sample 20 m north, south, east and west and take the
// steepest grade across that 40 m. Returns { pct, label } or null.
async function demFt([lng, lat]) {
  try {
    const r = await fetch(`/api/elevation?lat=${lat}&lng=${lng}`);
    const d = r.ok ? await r.json() : null;
    return Number.isFinite(d?.ft) ? d.ft : null;
  } catch { return null; }
}
export function inclineLabel(pct) {
  if (pct < 4) return "Flat";            // under 4%: within the 10 m model's noise
  if (pct < 8) return "Gentle";
  if (pct < 15) return "Moderate";
  if (pct < 35) return "Steep";
  return "Very steep";
}
export async function incline([lng, lat]) {
  const d = 20, dLat = d / M_LAT, dLng = d / mLng(lat);
  const [n, s, e, w] = await Promise.all([
    demFt([lng, lat + dLat]), demFt([lng, lat - dLat]), demFt([lng + dLng, lat]), demFt([lng - dLng, lat]),
  ]);
  if ([n, s, e, w].some(v => v == null)) return null;
  const run = (2 * d) * 3.28084;                 // feet
  const pct = Math.round(100 * Math.hypot((n - s) / run, (e - w) / run));
  return { pct, label: inclineLabel(pct) };
}

// ── ZIP by city block ─────────────────────────────────────────────────────
// The USPS ZIP the sales on this block carry (validate-listings.mjs). The ZIP
// map's lines run up to half a block off along some boundaries, so a block
// with sales answers first; null when the block has none.
export async function zipForBlock(block) {
  if (!block) return null;
  const t = await load("/data/zip-by-block.json");
  return t?.[block] || null;
}
