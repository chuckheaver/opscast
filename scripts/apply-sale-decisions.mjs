// Applies the owner's standing decisions (data/sale-decisions.json) and the
// reporting period (data/reporting-period.json) to the sales file,
// public/data/sf-listings.geojson, so no map, stat or report goes past them:
//
//  - Sales under the price floor (parking, rentals, entry errors), the
//    second copy of a duplicated sale, and records the owner says are not a
//    home sale ("remove") are taken out, and written to
//    data/removed-sales.csv with their reason.
//  - Corrections the owner made to a record (a sale price, a property type,
//    square footage) are set on it, and written to data/edited-sales.csv.
//  - Closings after the reporting period end are held out of the file, in
//    data/held-sales.geojson, and come back on the first run after the
//    owner moves the period end past them. Nothing held is ever lost.
//
// reports/market/review.py lists all three each month. Idempotent — safe to
// rerun.
//
//   node scripts/apply-sale-decisions.mjs
// (geocode-listings.mjs runs it after validation on every data refresh.)

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { statsThrough, lastFullMonth, latestLoadDate } from "./stats-through.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const LISTINGS = join(ROOT, "public", "data", "sf-listings.geojson");
const DECISIONS = join(ROOT, "data", "sale-decisions.json");
const REMOVED = join(ROOT, "data", "removed-sales.csv");
const EDITED = join(ROOT, "data", "edited-sales.csv");
const HELD = join(ROOT, "data", "held-sales.geojson");

const dec = JSON.parse(readFileSync(DECISIONS, "utf8"));
const geo = JSON.parse(readFileSync(LISTINGS, "utf8"));
const floor = dec.minPrice?.value ?? 0;
const dupes = new Map((dec.duplicates?.drop || []).map(d => [String(d.id), d]));
const kept = new Set((dec.keep || []).flatMap(k => k.ids.map(String)));
const dropped = new Map((dec.remove || []).map(d => [String(d.id), d]));   // not a home sale (owner)
const edits = new Map((dec.edits || []).map(e => [String(e.id), e]));

// Held closings rejoin the file first; the period end then decides again.
const held = existsSync(HELD) ? JSON.parse(readFileSync(HELD, "utf8")).features || [] : [];
const have = new Set(geo.features.map(f => String(f.properties?.id ?? "")));
for (const f of held) if (!have.has(String(f.properties?.id ?? ""))) geo.features.push(f);
const END = statsThrough(geo);

// Only full calendar months are reported (the owner's rule): the period end
// may not fall inside the month the latest load is still in.
const FULL = lastFullMonth(geo.features), LOADED = latestLoadDate(geo.features);
if (FULL && END > FULL) {
  throw new Error(`period end ${END} is inside a month the data load hasn't finished (it runs to ${LOADED}); `
    + `the last full month ends ${FULL}. Set data/reporting-period.json periodEnd to ${FULL} or earlier.`);
}
if (FULL && END < FULL) {
  console.warn(`  ! the latest data load is complete through ${FULL} (it runs to ${LOADED}); the period end is ${END}.`
    + ` Ask the owner whether to move data/reporting-period.json periodEnd to ${FULL}.`);
}
console.log(`  period end ${END}: the last full month of a data load that runs to ${LOADED}`);

// What an earlier run already took out stays on the list.
const csvq = v => `"${String(v ?? "").replace(/"/g, '""')}"`;
let prior = [];
try {
  prior = readFileSync(REMOVED, "utf8").trim().split("\n").slice(1).filter(Boolean);
} catch {}

const out = [], removed = [], edited = [], hold = [];
const seenEdit = new Set();
for (const f of geo.features) {
  const p = f.properties || {};
  const id = String(p.id ?? "");
  const e = edits.get(id);
  // A correction the owner took back: the record returns to the feed's value.
  for (const [k, v] of Object.entries(p.ownerEdits || {})) {
    if (e && k in e.set) continue;
    p[k] = v.from;
    delete p.ownerEdits[k];
  }
  if (p.ownerEdits && !Object.keys(p.ownerEdits).length) delete p.ownerEdits;
  if (!e?.footnote) delete p.ownerFootnote;
  if (e) {
    seenEdit.add(id);
    for (const [k, v] of Object.entries(e.set)) {
      // The value the feed had: the record's own until an earlier run changed it.
      const was = p.ownerEdits?.[k] ? p.ownerEdits[k].from : p[k] ?? null;
      p.ownerEdits = { ...(p.ownerEdits || {}), [k]: { from: was, to: v } };
      p[k] = v;
      edited.push([id, p.address, k, was, v, e.reason]);
    }
    if (e.footnote) p.ownerFootnote = e.footnote;
  }
  let why = null;
  if (kept.has(id)) why = null;
  else if (dropped.has(id)) why = dropped.get(id).reason;
  else if (dupes.has(id)) why = `duplicate of MLS ${dupes.get(id).keep}: ${dupes.get(id).reason || dec.duplicates.reason}`;
  else if (Number(p.sellingPrice) > 0 && Number(p.sellingPrice) < floor) why = dec.minPrice.reason;
  if (why) removed.push([id, p.address, p.propType, p.status, String(p.sellingDate || "").slice(0, 10), p.sellingPrice, p.fogNeighborhood, why]);
  else if (String(p.sellingDate || "").slice(0, 10) > END) hold.push(f);
  else out.push(f);
}
geo.features = out;
geo.metadata = {
  ...(geo.metadata || {}),
  statsThrough: END,
  saleDecisions: { appliedAt: new Date().toISOString(), removedThisRun: removed.length, edited: seenEdit.size, heldAfterPeriodEnd: hold.length },
};
writeFileSync(LISTINGS, JSON.stringify(geo));
writeFileSync(HELD, JSON.stringify({ type: "FeatureCollection", periodEnd: END, features: hold }) + "\n");

const head = "id,address,propType,status,sellingDate,sellingPrice,fogNeighborhood,reason";
const rows = [...new Set([...prior, ...removed.map(r => r.map(csvq).join(","))])];
writeFileSync(REMOVED, [head, ...rows].join("\n") + "\n");
writeFileSync(EDITED, ["id,address,field,from,to,reason", ...edited.map(r => r.map(csvq).join(","))].join("\n") + "\n");

console.log(`sale decisions: took out ${removed.length} record(s) this run (${rows.length} on the list in data/removed-sales.csv)`);
for (const r of removed) console.log(`  - ${r[1]} · $${Number(r[5]).toLocaleString("en-US")} · ${r[4]} — ${r[7]}`);
console.log(`  corrected ${seenEdit.size} record(s) (data/edited-sales.csv)`);
for (const id of edits.keys()) if (!seenEdit.has(id)) console.warn(`  ! correction for MLS ${id} (${edits.get(id).address}) found no record`);
console.log(`  held ${hold.length} closing(s) after the period end ${END} (data/held-sales.geojson)`);
