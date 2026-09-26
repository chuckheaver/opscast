// Per-neighborhood figures for the public neighborhood guide, computed from
// the live sales file. Re-run with the landing stats after each feed:
//   node scripts/build-neighborhood-stats.mjs
//
// Sales are matched on fogNeighborhood — the point-in-polygon result — not on
// the MLS text field, so a home counts toward the area it physically sits in.
//
// The window is YEAR TO DATE. Every sale in it is reported, however few a
// neighborhood had — the sale count sits beside each median so the reader can
// weigh it themselves rather than having the figure withheld.

import { readFileSync, writeFileSync } from "node:fs";
import { listNeighborhoods } from "../app/fog/lib/neighborhoods.js";

const LISTINGS = "public/data/sf-listings.geojson";
const OUT = "app/lib/neighborhood-stats.json";

const median = xs => {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
const zoneOf = h => {
  if (!Number.isFinite(h)) return null;
  if (h <= 8.0) return "Sun";
  if (h < 9.0) return "Transition";
  if (h < 11.0) return "Fog";
  return "Persistent Fog";
};

const geo = JSON.parse(readFileSync(LISTINGS, "utf8"));
const end = new Date(geo.metadata?.builtAt || Date.now());
const YEAR = String(end.getFullYear());
const iso = d => d.toISOString().slice(0, 10);
const FROM = `${YEAR}-01-01`, TO = iso(end);

const byHood = new Map();
for (const f of geo.features || []) {
  const p = f.properties || {};
  const hood = p.fogNeighborhood;
  if (!hood) continue;
  const price = Number(p.sellingPrice) || 0;
  if (price <= 0) continue;
  const sold = String(p.sellingDate || "").slice(0, 10);
  if (!sold || sold < FROM || sold > TO) continue;
  if (!byHood.has(hood)) byHood.set(hood, []);
  byHood.get(hood).push({
    price,
    sqft: Number(p.sqft) || 0,
    dom: Number.isFinite(Number(p.dom)) ? Number(p.dom) : null,
    fog: Number(p.fogHours),
    house: /single family/i.test(p.propType || ""),
    condo: /condo|tenancy in common/i.test(p.propType || ""),
  });
}

const out = {
  generatedAt: new Date().toISOString(),
  dataThrough: geo.metadata?.builtAt || null,
  year: YEAR,
  window: { from: FROM, to: TO },
  hoods: {},
};
let withSales = 0;

for (const { key } of listNeighborhoods()) {
  const rows = byHood.get(key) || [];
  const fogs = rows.map(r => r.fog).filter(Number.isFinite);
  const fog = median(fogs);
  const houses = rows.filter(r => r.house).map(r => r.price);
  const condos = rows.filter(r => r.condo).map(r => r.price);
  const ppsf = rows.filter(r => r.sqft > 0).map(r => r.price / r.sqft);
  const doms = rows.map(r => r.dom).filter(v => v != null);
  if (rows.length) withSales++;
  out.hoods[key] = {
    n: rows.length,
    sfhMedian: median(houses), sfhN: houses.length,
    condoMedian: median(condos), condoN: condos.length,
    ppsf: median(ppsf),
    dom: median(doms),
    fogHours: fog,
    zone: zoneOf(fog),
  };
}

writeFileSync(OUT, JSON.stringify(out, null, 2) + "\n");
console.log(`wrote ${OUT}`);
console.log(`  ${Object.keys(out.hoods).length} neighborhoods, ${withSales} with ${YEAR} sales (${FROM} to ${TO})`);
