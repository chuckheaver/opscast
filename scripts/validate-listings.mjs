// Check every sale's agent-entered location fields against where the sale
// actually sits, and correct the ones a person typed wrong.
//
// The pin (MLS coordinates, or the geocoded street address when the export has
// none) is the authority for anything that depends on location:
//   • ZIP        — checked against the ZIPs agents entered for the other sales
//                  on the same city block (blocks don't split ZIPs). With 3+
//                  neighbors agreeing 80%+, a different ZIP is a typo and takes
//                  theirs; a ZIP that isn't a real SF ZIP (e.g. "9411") is always
//                  replaced (neighbors, else the ZIP map). The MLS value is kept
//                  as zipMls. The 2010 ZIP map alone is never trusted over the
//                  agent — it predates Mission Bay and its lines are coarse.
//   • District   — areaDesc "SF District N" from the SFAR district the pin is
//                  in; the MLS value is kept as areaDescMls.
//   • Neighborhood — already the polygon at the pin (geocode-listings.mjs).
//
// The pin itself is cross-checked against the MLS parcel number (APN): the
// city block in the APN should be the block under the pin. When they disagree
// by more than a block, the typed fields decide:
//   • the APN's parcel sits in the ZIP the agent entered → the address, APN
//     and ZIP agree and the pin is the error: the pin moves to the APN's
//     parcel and is re-tagged (geoSource "apn"; the old one kept as pinMls);
//   • otherwise nothing agrees → flagged (geoCheck "apn-far") for a human.
// ZIP and district are only corrected from pins that check out.
//
// Every change and flag is written to data/mls-corrections.csv.
// Run after geocode-listings.mjs:  node scripts/validate-listings.mjs

import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { VectorTile } from "@mapbox/vector-tile";
import Pbf from "pbf";
import { findNeighborhoodForPoint } from "../app/fog/lib/spatial.js";
import { tag } from "./tag-point.mjs";

const LISTINGS = "public/data/sf-listings.geojson";
const geo = JSON.parse(readFileSync(LISTINGS, "utf8"));
const zips = JSON.parse(readFileSync("public/data/sf-zip-codes.geojson", "utf8"));

// ── Parcels: blklot → where it is, and block lookups ──────────────────────
// Decoded from the map's own z16 parcel tiles.
const Z = 16, TDIR = `public/tiles/parcels/${Z}`;
const tile2lng = (x, z) => (x / 2 ** z) * 360 - 180;
const tile2lat = (y, z) => { const n = Math.PI - (2 * Math.PI * y) / 2 ** z; return (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n))); };
const BLKLOT = /^(\d{4}[A-Z]?)(\d{3}[A-Z]?)$/;
const blockOf = s => { const m = BLKLOT.exec(String(s || "").toUpperCase().replace(/[^0-9A-Z]/g, "")); return m ? m[1] : null; };

const blockPts = new Map();          // block → [[lng,lat], ...] parcel centers
const lotPt = new Map();             // blklot → [lng,lat] parcel center
const tileParcels = new Map();       // "x/y" → [{ block, rings:[[lng,lat]...] }]
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
      const rings = ft.loadGeometry().map(r => r.map(p => [
        tile2lng(+x + p.x / layer.extent, Z), tile2lat(+y + p.y / layer.extent, Z),
      ]));
      const ring = rings[0];
      const c = ring.reduce((a, p) => [a[0] + p[0] / ring.length, a[1] + p[1] / ring.length], [0, 0]);
      (blockPts.get(block) || blockPts.set(block, []).get(block)).push(c);
      lotPt.set(String(ft.properties.blklot).toUpperCase(), c);
      list.push({ block, rings });
    }
    tileParcels.set(`${x}/${y}`, list);
  }
}

const meters = (a, b) => {
  const la = ((a[1] + b[1]) / 2) * Math.PI / 180;
  return Math.hypot((a[0] - b[0]) * 111_320 * Math.cos(la), (a[1] - b[1]) * 110_540);
};
function inRing(pt, ring) {
  let c = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j];
    if ((yi > pt[1]) !== (yj > pt[1]) && pt[0] < ((xj - xi) * (pt[1] - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
}
function blockAtPin([lng, lat]) {
  const n = 2 ** Z, r = (lat * Math.PI) / 180;
  const x = Math.floor(((lng + 180) / 360) * n);
  const y = Math.floor(((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * n);
  for (const p of tileParcels.get(`${x}/${y}`) || []) {
    if (p.rings.reduce((acc, ring) => (inRing([lng, lat], ring) ? !acc : acc), false)) return p.block;
  }
  return null;
}

// ── Check every sale ──────────────────────────────────────────────────────
const log = [];
const counts = { pinMoved: 0, zip: 0, district: 0, apnFar: 0, apnOk: 0, apnUnchecked: 0 };
const zipAt = pt => { const z = findNeighborhoodForPoint(zips, pt); return z ? String(z.properties.zip) : null; };
const typedZip = p => String(p.zipMls ?? p.zip ?? "");
for (const f of geo.features) {
  const p = f.properties;
  let pt = f.geometry?.coordinates;
  if (!Array.isArray(pt) || p.geoSource === "neighborhood") continue;   // placeholders have no real spot

  // 1. Pin vs APN.
  const apnKey = String(p.apn || "").toUpperCase().replace(/[^0-9A-Z]/g, "");
  const apnBlock = blockOf(p.apn);
  let pinOk = true;
  if (!apnBlock || !blockPts.has(apnBlock)) { counts.apnUnchecked++; delete p.geoCheck; }
  else {
    const near = blockAtPin(pt) === apnBlock || Math.min(...blockPts.get(apnBlock).map(c => meters(pt, c))) <= 120;
    if (near) { counts.apnOk++; p.geoCheck = "apn"; }
    else {
      const pts = blockPts.get(apnBlock);
      const apnLoc = lotPt.get(apnKey) || pts.reduce((a, c) => [a[0] + c[0] / pts.length, a[1] + c[1] / pts.length], [0, 0]);
      const away = Math.round(meters(pt, apnLoc));
      if (typedZip(p) && zipAt(apnLoc) === typedZip(p)) {
        // Address, APN and ZIP agree; the pin is the typo. Move it and re-tag.
        p.pinMls = p.pinMls || pt;
        p.geoSource = "apn";
        pt = f.geometry.coordinates = apnLoc.map(v => +v.toFixed(6));
        p.lng = pt[0]; p.lat = pt[1];
        Object.assign(p, tag(pt));
        p.geoCheck = "apn"; counts.pinMoved++;
        log.push([p.id, p.address, "Pin", `MLS pin ${away} m from parcel`, `moved to APN ${p.apn}`, "address, APN and ZIP agree; pin did not"]);
      } else {
        pinOk = false; counts.apnFar++; p.geoCheck = "apn-far";
        log.push([p.id, p.address, "Pin vs APN", `APN ${p.apn} (block ${apnBlock})`, `pin ${away} m away`, "fields disagree — check the pin, APN and ZIP"]);
      }
    }
  }
  if (!pinOk) continue;   // a suspect pin corrects nothing

  // 2. ZIP — decided in a second pass, once every pin is final.
  p._block = blockAtPin(pt);

  // 3. SF district from the pin.
  if (p.districtNum != null) {
    const want = `SF District ${p.districtNum}`;
    const had = p.areaDescMls ?? p.areaDesc;
    if (had !== want) {
      if (!p.areaDescMls) { p.areaDescMls = had || null;
        log.push([p.id, p.address, "SF District", had || "", want, "SFAR district at the pin"]); }
      p.areaDesc = want; counts.district++;
    } else if (p.areaDescMls) { delete p.areaDescMls; }
  }
}

// ── ZIP: the block's consensus ─────────────────────────────────────────────
const SF_ZIP = /^941\d\d$/;
const byBlock = new Map();
for (const f of geo.features) {
  const p = f.properties;
  if (!p._block || p.geoCheck === "apn-far") continue;
  const z = typedZip(p);
  if (!SF_ZIP.test(z)) continue;
  const m = byBlock.get(p._block) || byBlock.set(p._block, new Map()).get(p._block);
  m.set(z, (m.get(z) || 0) + 1);
}
for (const f of geo.features) {
  const p = f.properties;
  const block = p._block; delete p._block;
  if (!block || p.geoCheck === "apn-far") continue;
  const z = typedZip(p);
  // Neighbors' ZIPs on this block, not counting this sale.
  const tally = new Map(byBlock.get(block) || []);
  if (SF_ZIP.test(z)) tally.set(z, tally.get(z) - 1);
  const others = [...tally.values()].reduce((a, b) => a + b, 0);
  const [topZip, topN] = [...tally.entries()].sort((a, b) => b[1] - a[1])[0] || [null, 0];
  let fix = null, how = null;
  if (!SF_ZIP.test(z)) {
    fix = topN ? topZip : zipAt(f.geometry.coordinates);
    how = topN ? `not an SF ZIP; ${topN} other sale(s) on the block use ${topZip}` : "not an SF ZIP; ZIP map at the pin";
  } else if (others >= 3 && topZip !== z && topN / others >= 0.8) {
    fix = topZip; how = `${topN} of ${others} other sales on the block use ${topZip}`;
  }
  if (fix && fix !== z) {
    p.zipMls = z || null; p.zip = fix; counts.zip++;
    log.push([p.id, p.address, "ZIP", z, fix, how]);
  } else if (p.zipMls) { p.zip = p.zipMls; delete p.zipMls; }
}

geo.metadata = { ...(geo.metadata || {}), validation: { checkedAt: new Date().toISOString(), ...counts } };
writeFileSync(LISTINGS, JSON.stringify(geo));
const csv = [["listing", "address", "field", "mls_value", "corrected_or_found", "how"], ...log]
  .map(r => r.map(v => /[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v)).join(","))
  .join("\n") + "\n";
writeFileSync("data/mls-corrections.csv", csv);
console.log(`validated ${geo.features.length.toLocaleString()} sales — pins moved to their APN ${counts.pinMoved}, ZIP corrected ${counts.zip}, ` +
  `SF District corrected ${counts.district}; pin vs APN: ${counts.apnOk} agree, ${counts.apnFar} flagged, ${counts.apnUnchecked} not checkable → data/mls-corrections.csv`);
