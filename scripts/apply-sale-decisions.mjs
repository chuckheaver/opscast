// Applies the owner's standing decisions (data/sale-decisions.json) to the
// sales file: sales under the price floor (parking, rentals, entry errors) and
// the second copy of a duplicated sale are taken out of
// public/data/sf-listings.geojson, so no map, stat or report counts them.
// Every record taken out is written to data/removed-sales.csv with its reason;
// reports/market/review.py lists them each month. Idempotent — safe to rerun.
//
//   node scripts/apply-sale-decisions.mjs
// (geocode-listings.mjs runs it after validation on every data refresh.)

import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const LISTINGS = join(ROOT, "public", "data", "sf-listings.geojson");
const DECISIONS = join(ROOT, "data", "sale-decisions.json");
const REMOVED = join(ROOT, "data", "removed-sales.csv");

const dec = JSON.parse(readFileSync(DECISIONS, "utf8"));
const geo = JSON.parse(readFileSync(LISTINGS, "utf8"));
const floor = dec.minPrice?.value ?? 0;
const dupes = new Map((dec.duplicates?.drop || []).map(d => [String(d.id), d]));
const kept = new Set((dec.keep || []).flatMap(k => k.ids.map(String)));

// What an earlier run already took out stays on the list.
const csvq = v => `"${String(v ?? "").replace(/"/g, '""')}"`;
let prior = [];
try {
  prior = readFileSync(REMOVED, "utf8").trim().split("\n").slice(1).filter(Boolean);
} catch {}

const out = [], removed = [];
for (const f of geo.features) {
  const p = f.properties || {};
  const id = String(p.id ?? "");
  let why = null;
  if (kept.has(id)) why = null;
  else if (dupes.has(id)) why = `duplicate of MLS ${dupes.get(id).keep}: ${dec.duplicates.reason}`;
  else if (Number(p.sellingPrice) > 0 && Number(p.sellingPrice) < floor) why = dec.minPrice.reason;
  if (why) removed.push([id, p.address, p.propType, p.status, String(p.sellingDate || "").slice(0, 10), p.sellingPrice, p.fogNeighborhood, why]);
  else out.push(f);
}
geo.features = out;
geo.metadata = { ...(geo.metadata || {}), saleDecisions: { appliedAt: new Date().toISOString(), removedThisRun: removed.length } };
writeFileSync(LISTINGS, JSON.stringify(geo));

const head = "id,address,propType,status,sellingDate,sellingPrice,fogNeighborhood,reason";
const rows = [...new Set([...prior, ...removed.map(r => r.map(csvq).join(","))])];
writeFileSync(REMOVED, [head, ...rows].join("\n") + "\n");
console.log(`sale decisions: took out ${removed.length} record(s) this run (${rows.length} on the list in data/removed-sales.csv)`);
for (const r of removed) console.log(`  - ${r[1]} · $${Number(r[5]).toLocaleString("en-US")} · ${r[4]} — ${r[7]}`);
