// Put every sale where its street address says it is, then take its
// location-based fields from the map layers at that spot.
//
// LOCATION — the street address first, the file's coordinates second. The
// APN is not used.
//   • The address is located from our own records: the same street number on
//     the same street in another sale, or failing that, interpolated between
//     the nearest house numbers on that street (same side, within two
//     blocks). Only trustworthy points are used to build that index — never
//     the MLS's placeholder coordinate (one spot shared by sales on many
//     different streets) or our own neighborhood stand-ins and estimates.
//   • Address located and within 150 m of the file's coordinates (250 m when
//     interpolated): the coordinates stand — the address confirms them.
//   • Address located but farther away, or the file's coordinates are a
//     placeholder: the sale moves to its address (geoSource "address"; the
//     file's coordinates kept as pinMls).
//   • Address not found: the file's coordinates are used as they are.
//   • Neither: the location is unknown — listed on the exception report.
//
// FIELDS FROM THE LOCATION
//   • SFAR District (district, districtNum, areaDesc "SF District N") and the
//     SFAR neighborhood, fog-map neighborhood and fog hours (tag-point.mjs).
//   • Supervisor District (supDistrict) from the city's supervisor map.
//   • ZIP — checked against the ZIPs typed for the other sales on the same
//     city block (blocks don't split ZIPs): 3+ neighbors agreeing 80%+
//     override a different ZIP; a ZIP that isn't a real SF ZIP is always
//     replaced. The MLS value is kept as zipMls.
//
// Writes data/mls-corrections.csv (every change, with the MLS value) and
// data/location-exceptions.csv (anything that could not be determined).
// Run after geocode-listings.mjs:  node scripts/validate-listings.mjs

import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { VectorTile } from "@mapbox/vector-tile";
import Pbf from "pbf";
import { findNeighborhoodForPoint } from "../app/fog/lib/spatial.js";
import { tag } from "./tag-point.mjs";

const LISTINGS = "public/data/sf-listings.geojson";
const geo = JSON.parse(readFileSync(LISTINGS, "utf8"));
const zips = JSON.parse(readFileSync("public/data/sf-zip-codes.geojson", "utf8"));
const sups = JSON.parse(readFileSync("public/data/sf-supervisor-districts.geojson", "utf8"));

const meters = (a, b) => {
  const la = ((a[1] + b[1]) / 2) * Math.PI / 180;
  return Math.hypot((a[0] - b[0]) * 111_320 * Math.cos(la), (a[1] - b[1]) * 110_540);
};
const round6 = pt => pt.map(v => +(+v).toFixed(6));

// ── Start from the file's own values (undo any earlier correction) ─────────
for (const f of geo.features) {
  const p = f.properties;
  if (p.pinMls) {
    f.geometry.coordinates = p.pinMls; p.lng = p.pinMls[0]; p.lat = p.pinMls[1];
    p.geoSource = p.geoSourceMls || "export";
  }
  delete p.pinMls; delete p.geoSourceMls; delete p.geoCheck; delete p.addrMatch;
  if (p.zipMls !== undefined) { p.zip = p.zipMls; delete p.zipMls; }
  if (p.areaDescMls !== undefined) { p.areaDesc = p.areaDescMls; delete p.areaDescMls; }
}

// ── Addresses ──────────────────────────────────────────────────────────────
const SUFFIX = {
  street: "st", st: "st", avenue: "ave", ave: "ave", av: "ave", boulevard: "blvd", blvd: "blvd",
  drive: "dr", dr: "dr", road: "rd", rd: "rd", court: "ct", ct: "ct", place: "pl", pl: "pl",
  lane: "ln", ln: "ln", terrace: "ter", ter: "ter", way: "way", circle: "cir", cir: "cir",
  highway: "hwy", hwy: "hwy", alley: "aly", aly: "aly", plaza: "plz", plz: "plz",
};
function parseAddress(address) {
  const line = String(address || "").split(",")[0].replace(/#.*$/, "").replace(/\./g, " ").replace(/\s+/g, " ").trim().toLowerCase();
  const m = /^(\d+)(?:[a-z])?(?:\s*-\s*\d+[a-z]?)?\s+(.+)$/.exec(line);
  if (!m) return null;
  const words = m[2].split(" ").filter(Boolean).map(w => SUFFIX[w] || w);
  // "Great Highway Hwy" → "great hwy"; drop a doubled suffix.
  while (words.length > 1 && SUFFIX[words[words.length - 2]] && words[words.length - 1] === SUFFIX[words[words.length - 2]]) words.pop();
  return { num: +m[1], street: words.join(" ") };
}

// Points we trust enough to locate other addresses from.
const coordKey = pt => pt.map(v => (+v).toFixed(5)).join(",");
const streetsAt = new Map();
for (const f of geo.features) {
  // Our own neighborhood stand-ins borrow a real sale's point; they must not
  // make that sale's genuine coordinates look like a shared placeholder.
  if (f.properties.geoSource === "neighborhood") continue;
  const a = parseAddress(f.properties.address);
  if (!a) continue;
  const k = coordKey(f.geometry.coordinates);
  (streetsAt.get(k) || streetsAt.set(k, new Set()).get(k)).add(a.street);
}
const isPlaceholder = pt => (streetsAt.get(coordKey(pt))?.size || 0) >= 3;   // one spot, 3+ different streets
const UNTRUSTED = new Set(["neighborhood", "interpolated"]);
const trusted = f => !UNTRUSTED.has(f.properties.geoSource) && !isPlaceholder(f.geometry.coordinates);

const exact = new Map();     // "num|street" → [{id, pt}]
const byStreet = new Map();  // street → [{num, pt}]
for (const f of geo.features) {
  if (!trusted(f)) continue;
  const a = parseAddress(f.properties.address);
  if (!a) continue;
  const pt = f.geometry.coordinates;
  (exact.get(`${a.num}|${a.street}`) || exact.set(`${a.num}|${a.street}`, []).get(`${a.num}|${a.street}`)).push({ id: f.properties.id, pt });
  (byStreet.get(a.street) || byStreet.set(a.street, []).get(a.street)).push({ num: a.num, pt });
}
for (const list of byStreet.values()) list.sort((x, y) => x.num - y.num);
const median = pts => {
  const xs = pts.map(p => p[0]).sort((a, b) => a - b), ys = pts.map(p => p[1]).sort((a, b) => a - b);
  return [xs[xs.length >> 1], ys[ys.length >> 1]];
};

// A street written without its suffix ("501 Beale") or with a direction in
// front ("N Mission Bay Blvd") resolves to the one indexed street it names.
const SUFFIXES = new Set(Object.values(SUFFIX));
const stem = st => st.replace(/^(n|s|e|w) /, "").split(" ").filter(w => !SUFFIXES.has(w)).join(" ");
const byStem = new Map();
for (const st of byStreet.keys()) (byStem.get(stem(st)) || byStem.set(stem(st), new Set()).get(stem(st))).add(st);
function resolveStreet(street) {
  if (byStreet.has(street)) return street;
  const c = byStem.get(stem(street));
  return c && c.size === 1 ? [...c][0] : street;
}

// Where the street address is, from the other sales. → { pt, how } or null
function locateAddress(p) {
  const a = parseAddress(p.address);
  if (!a) return null;
  a.street = resolveStreet(a.street);
  const same = (exact.get(`${a.num}|${a.street}`) || []).filter(x => x.id !== p.id);
  if (same.length) return { pt: median(same.map(x => x.pt)), how: `same address in ${same.length} other sale${same.length > 1 ? "s" : ""}` };
  const list = (byStreet.get(a.street) || []).filter(x => x.num % 2 === a.num % 2 && x.num !== a.num);
  let lo = null, hi = null;
  for (const x of list) { if (x.num < a.num) lo = x; else if (x.num > a.num && !hi) hi = x; }
  const SPAN = 200;   // two blocks of house numbers
  if (lo && hi && hi.num - lo.num <= 2 * SPAN && meters(lo.pt, hi.pt) <= 800) {
    const t = (a.num - lo.num) / (hi.num - lo.num);
    return { pt: [lo.pt[0] + t * (hi.pt[0] - lo.pt[0]), lo.pt[1] + t * (hi.pt[1] - lo.pt[1])], how: `between ${lo.num} and ${hi.num} ${a.street}`, interp: true };
  }
  const one = [lo, hi].filter(x => x && Math.abs(x.num - a.num) <= 40).sort((x, y) => Math.abs(x.num - a.num) - Math.abs(y.num - a.num))[0];
  if (one) return { pt: one.pt, how: `next to ${one.num} ${a.street}`, interp: true };
  return null;
}

// ── Parcels: which city block a point is on (for the ZIP check) ───────────
const Z = 16, TDIR = `public/tiles/parcels/${Z}`;
const tile2lng = (x, z) => (x / 2 ** z) * 360 - 180;
const tile2lat = (y, z) => { const n = Math.PI - (2 * Math.PI * y) / 2 ** z; return (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n))); };
const BLKLOT = /^(\d{4}[A-Z]?)(\d{3}[A-Z]?)$/;
const blockOf = s => { const m = BLKLOT.exec(String(s || "").toUpperCase().replace(/[^0-9A-Z]/g, "")); return m ? m[1] : null; };
const tileParcels = new Map();
for (const x of readdirSync(TDIR)) {
  for (const f of readdirSync(`${TDIR}/${x}`)) {
    const y = f.replace(".pbf", "");
    const layer = new VectorTile(new Pbf(readFileSync(`${TDIR}/${x}/${f}`))).layers.parcels;
    if (!layer) continue;
    const list = [];
    for (let i = 0; i < layer.length; i++) {
      const ft = layer.feature(i);
      if (ft.type !== 3) continue;
      const block = blockOf(ft.properties.blklot);
      if (!block) continue;
      list.push({ block, rings: ft.loadGeometry().map(r => r.map(q => [tile2lng(+x + q.x / layer.extent, Z), tile2lat(+y + q.y / layer.extent, Z)])) });
    }
    tileParcels.set(`${x}/${y}`, list);
  }
}
function inRing(pt, ring) {
  let c = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j];
    if ((yi > pt[1]) !== (yj > pt[1]) && pt[0] < ((xj - xi) * (pt[1] - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
}
function blockAt([lng, lat]) {
  const n = 2 ** Z, r = (lat * Math.PI) / 180;
  const key = `${Math.floor(((lng + 180) / 360) * n)}/${Math.floor(((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * n)}`;
  for (const p of tileParcels.get(key) || []) if (p.rings.reduce((acc, ring) => (inRing([lng, lat], ring) ? !acc : acc), false)) return p.block;
  return null;
}

// ── Manual answers (data/location-overrides.json) ──────────────────────────
// Keyed by MLS listing number: { "lat": .., "lng": .. } places the sale there;
// { "nid": "5m", "sup": 8 } sets its districts when the exact spot is unknown.
// Applied on every run, so an answer given once holds for future imports.
let OVERRIDES = {};
try { OVERRIDES = JSON.parse(readFileSync("data/location-overrides.json", "utf8")); } catch {}
const realtorGeo = JSON.parse(readFileSync("public/data/sf-realtor-neighborhoods.geojson", "utf8"));
const realtorByNid = new Map(realtorGeo.features.map(f => [String(f.properties.nid || "").toLowerCase(), f.properties]));

// ── Place every sale ──────────────────────────────────────────────────────
const log = [], exceptions = [];
const counts = { verified: 0, moved: 0, unverified: 0, unknown: 0, zip: 0, district: 0 };
const typedArea = new Map(geo.features.map(f => [f, f.properties.areaDesc]));
for (const f of geo.features) {
  const p = f.properties;
  const file = f.geometry?.coordinates;
  const fileOk = Array.isArray(file) && p.geoSource !== "neighborhood" && !isPlaceholder(file);
  const ov = OVERRIDES[p.id] || null;
  const addr = ov && Number.isFinite(ov.lat) && Number.isFinite(ov.lng)
    ? { pt: [ov.lng, ov.lat], how: "location given by hand" } : locateAddress(p);
  let pt = file, status;
  if (addr && fileOk) {
    const d = meters(addr.pt, file);
    if (d <= (addr.interp ? 250 : 150)) { status = "verified"; p.addrMatch = "verified"; }
    else {
      status = "moved"; pt = round6(addr.pt);
      log.push([p.id, p.address, "Location", `file coordinates ${Math.round(d)} m from the address`, `moved to the address (${addr.how})`]);
    }
  } else if (addr) {
    status = "moved"; pt = round6(addr.pt);
    log.push([p.id, p.address, "Location", p.geoSource === "neighborhood" ? "no location in the file" : "MLS placeholder coordinates", `placed at the address (${addr.how})`]);
  } else if (fileOk) {
    status = "unverified"; p.addrMatch = "unverified";
  } else {
    status = "unknown"; p.addrMatch = "unknown";
    exceptions.push([p.id, p.address, (p.sellingDate || "").slice(0, 10), "Location unknown",
      p.geoSource === "neighborhood" ? "no coordinates in the file and the address matches no other sale" : "MLS placeholder coordinates and the address matches no other sale",
      p.geoSource === "neighborhood" ? "shown at a neighborhood stand-in point (neighborhood inferred from its street/ZIP); needs a real location" : "kept off the map with no neighborhood or district until it has a real location"]);
  }
  counts[status]++;
  if (status === "moved") {
    p.pinMls = file; p.geoSourceMls = p.geoSource; p.geoSource = "address"; p.addrMatch = "moved";
    f.geometry.coordinates = pt; p.lng = pt[0]; p.lat = pt[1];
  }

  // Fields from the location. A sale sitting on the MLS placeholder with no
  // address match has no real location: it gets no neighborhood or district
  // (rather than the placeholder's) and stays off the map — noLocation.
  if (status === "unknown" && p.geoSource !== "neighborhood") {
    Object.assign(p, { fogHours: null, fogNeighborhood: null, neighborhood: null, district: null, districtNum: null, realtorNid: null, supDistrict: null, noLocation: true });
    // Districts given by hand still apply; the sale stays off the map.
    if (ov?.nid && realtorByNid.has(String(ov.nid).toLowerCase())) {
      const r = realtorByNid.get(String(ov.nid).toLowerCase());
      Object.assign(p, { neighborhood: r.nbrhood, district: r.district, districtNum: r.district_num, realtorNid: r.nid, areaDesc: `SF District ${r.district_num}` });
    }
    if (ov?.sup != null) p.supDistrict = Number(ov.sup);
    p._block = null;
    continue;
  }
  delete p.noLocation;
  Object.assign(p, tag(pt));
  const sup = findNeighborhoodForPoint(sups, pt);
  p.supDistrict = sup ? sup.properties.district : null;
  if (ov?.nid && realtorByNid.has(String(ov.nid).toLowerCase())) {
    const r = realtorByNid.get(String(ov.nid).toLowerCase());
    Object.assign(p, { neighborhood: r.nbrhood, district: r.district, districtNum: r.district_num, realtorNid: r.nid });
  }
  if (ov?.sup != null) p.supDistrict = Number(ov.sup);
  if (p.districtNum != null) {
    const want = `SF District ${p.districtNum}`, had = typedArea.get(f);
    if (had !== want) {
      p.areaDescMls = had || null; p.areaDesc = want; counts.district++;
      log.push([p.id, p.address, "SFAR District", had || "(blank)", `${want}${p.realtorNid ? ` (${p.realtorNid})` : ""}`]);
    }
  } else if (status !== "unknown") {
    exceptions.push([p.id, p.address, (p.sellingDate || "").slice(0, 10), "SFAR District unknown", "the location is outside every SFAR district", ""]);
  }
  if (p.supDistrict == null && status !== "unknown") {
    exceptions.push([p.id, p.address, (p.sellingDate || "").slice(0, 10), "Supervisor District unknown", "the location is outside every supervisor district", ""]);
  }
  if (!p.neighborhood && status !== "unknown") {
    exceptions.push([p.id, p.address, (p.sellingDate || "").slice(0, 10), "Neighborhood unknown", "the location is outside every neighborhood", ""]);
  }
  p._block = status === "unknown" ? null : blockAt(pt);
}

// How far a point is from a ZIP's area (0 inside it). A typed ZIP whose area
// is more than 300 m away is a typo; within half a block of its line it is
// trusted — the ZIP map's lines run that far off along some boundaries.
const KX = Math.cos((37.77 * Math.PI) / 180);
const zipFeats = new Map();
for (const z of zips.features) { const k = String(z.properties.zip); (zipFeats.get(k) || zipFeats.set(k, []).get(k)).push(z); }
function metersToZip(pt, zip) {
  const feats = zipFeats.get(zip); if (!feats) return Infinity;
  if (feats.some(z => findNeighborhoodForPoint({ type: "FeatureCollection", features: [z] }, pt))) return 0;
  let best = Infinity;
  for (const z of feats) {
    const g = z.geometry, polys = g.type === "Polygon" ? [g.coordinates] : g.coordinates;
    for (const poly of polys) for (const ring of poly) for (let i = 1; i < ring.length; i++) {
      const ax = ring[i - 1][0] * KX, ay = ring[i - 1][1], bx = ring[i][0] * KX, by = ring[i][1];
      const px = pt[0] * KX, py = pt[1], dx = bx - ax, dy = by - ay, L = dx * dx + dy * dy;
      let t = L ? ((px - ax) * dx + (py - ay) * dy) / L : 0; t = Math.max(0, Math.min(1, t));
      best = Math.min(best, Math.hypot(px - (ax + t * dx), py - (ay + t * dy)) * 110_540);
    }
  }
  return best;
}

// ── ZIP: the block's consensus ─────────────────────────────────────────────
const SF_ZIP = /^941\d\d$/;
const zipAt = pt => { const z = findNeighborhoodForPoint(zips, pt); return z ? String(z.properties.zip) : null; };
const byBlock = new Map();
for (const f of geo.features) {
  const p = f.properties, z = String(p.zip || "");
  if (!p._block || !SF_ZIP.test(z)) continue;
  const m = byBlock.get(p._block) || byBlock.set(p._block, new Map()).get(p._block);
  m.set(z, (m.get(z) || 0) + 1);
}
const finalByBlock = new Map();     // block → Map(zip → sales), after corrections
for (const f of geo.features) {
  const p = f.properties;
  const block = p._block; delete p._block;
  const z = String(p.zip || "");
  const tally = new Map(block ? byBlock.get(block) || [] : []);
  if (SF_ZIP.test(z) && tally.has(z)) tally.set(z, tally.get(z) - 1);
  const others = [...tally.values()].reduce((a, b) => a + b, 0);
  const [topZip, topN] = [...tally.entries()].sort((a, b) => b[1] - a[1])[0] || [null, 0];
  let fix = null, how = null;
  if (!SF_ZIP.test(z)) {
    fix = topN ? topZip : (p.addrMatch === "unknown" ? null : zipAt(f.geometry.coordinates));
    how = topN ? `${topN} other sale(s) on the block use ${topZip}` : "ZIP map at the location";
    if (!fix) exceptions.push([p.id, p.address, (p.sellingDate || "").slice(0, 10), "ZIP unknown", `MLS ZIP "${z}" is not an SF ZIP and the location can't supply one`, ""]);
  } else if (others >= 3 && topZip !== z && topN / others >= 0.8) {
    fix = topZip; how = `${topN} of ${others} other sales on the block use ${topZip}`;
  } else if (p.addrMatch !== "unknown" && p.geoSource !== "neighborhood") {
    const away = metersToZip(f.geometry.coordinates, z);
    if (away > 300) {
      fix = topN && topZip !== z ? topZip : zipAt(f.geometry.coordinates);
      how = `${z} is ${(away / 1609.34).toFixed(1)} mi away; ${topN && topZip !== z ? "the block's other sales use " + topZip : "ZIP map at the location"}`;
    }
  }
  if (fix && fix !== z) {
    p.zipMls = z || null; p.zip = fix; counts.zip++;
    log.push([p.id, p.address, "ZIP", z || "(blank)", `${fix} (${how})`]);
  }
  if (block && SF_ZIP.test(String(p.zip || ""))) {
    const m = finalByBlock.get(block) || finalByBlock.set(block, new Map()).get(block);
    m.set(p.zip, (m.get(p.zip) || 0) + 1);
  }
}

// ── ZIP by city block, from the sales ──────────────────────────────────────
// The ZIP map's lines run up to half a block off along some boundaries
// (94109/94123, 94158/94107, ...), while the ZIPs on the sales are the USPS
// ones. The map's address lookups read an address's ZIP from its block here
// first and fall back to the polygon only for blocks with no sales.
const zipByBlock = {};
for (const [block, m] of finalByBlock) {
  const [top, n] = [...m.entries()].sort((a, b) => b[1] - a[1])[0];
  const total = [...m.values()].reduce((a, b) => a + b, 0);
  if (n / total >= 0.6) zipByBlock[block] = top;          // a split block gets no entry
}
writeFileSync("public/data/zip-by-block.json", JSON.stringify(zipByBlock));

geo.metadata = { ...(geo.metadata || {}), validation: { checkedAt: new Date().toISOString(), method: "street address, then file coordinates; districts from the map layers", ...counts, exceptions: exceptions.length } };
writeFileSync(LISTINGS, JSON.stringify(geo));
const csv = rows => rows.map(r => r.map(v => /[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v)).join(",")).join("\n") + "\n";
writeFileSync("data/mls-corrections.csv", csv([["listing", "address", "field", "before", "now"], ...log]));
writeFileSync("data/location-exceptions.csv", csv([["listing", "address", "sold", "problem", "why", "what it means"], ...exceptions]));
console.log(`ZIP by block: ${Object.keys(zipByBlock).length.toLocaleString()} blocks → public/data/zip-by-block.json`);
console.log(`placed ${geo.features.length.toLocaleString()} sales — address confirms file coordinates ${counts.verified}, moved to the address ${counts.moved}, ` +
  `address not found (file coordinates used) ${counts.unverified}, location unknown ${counts.unknown}; SFAR District corrected ${counts.district}, ZIP corrected ${counts.zip}; ` +
  `${exceptions.length} exception(s) → data/location-exceptions.csv`);
