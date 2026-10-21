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
//
// A neighborhood's zone is the one worked out from all of its ground
// (scripts/build-neighborhood-fog-zones.mjs), not from where this year's
// sales happened to fall, so it is the same zone the fog map shows.

import { readFileSync, writeFileSync } from "node:fs";
import { listNeighborhoods } from "../app/fog/lib/neighborhoods.js";
import { statsThrough, throughStamp } from "./stats-through.mjs";
import { segOf } from "../app/lib/segments.js";

const LISTINGS = "public/data/sf-listings.geojson";
const ZONES = "public/data/neighborhood-fog-zones.json";
const OUT = "app/lib/neighborhood-stats.json";

const median = xs => {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

const zones = JSON.parse(readFileSync(ZONES, "utf8"));
const geo = JSON.parse(readFileSync(LISTINGS, "utf8"));
const TO = statsThrough(geo);                      // last day of the last full month
const YEAR = TO.slice(0, 4);
const FROM = `${YEAR}-01-01`;

// A map area with no page of its own counts on its neighbor's page: SFAR
// files both islands as one neighborhood (9t), and the site has a Treasure
// Island page but none for Yerba Buena Island, where the islands' sales sit.
const PAGE_FOR = { "Yerba Buena Island": "Treasure Island" };

const byHood = new Map();
for (const f of geo.features || []) {
  const p = f.properties || {};
  const hood = PAGE_FOR[p.fogNeighborhood] || p.fogNeighborhood;
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
    seg: segOf(p.propType),           // sfh | condo | other (app/lib/segments.js)
  });
}

const out = {
  generatedAt: new Date().toISOString(),
  dataThrough: throughStamp(TO),
  year: YEAR,
  window: { from: FROM, to: TO },
  hoods: {},
};
let withSales = 0;

for (const { key } of listNeighborhoods()) {
  const rows = byHood.get(key) || [];
  const fogs = rows.map(r => r.fog).filter(Number.isFinite);
  const fog = median(fogs);
  const houses = rows.filter(r => r.seg === "sfh").map(r => r.price);
  const condos = rows.filter(r => r.seg === "condo").map(r => r.price);
  const others = rows.filter(r => r.seg === "other").map(r => r.price);
  const ppsf = rows.filter(r => r.sqft > 0).map(r => r.price / r.sqft);
  const doms = rows.map(r => r.dom).filter(v => v != null);
  // Each category's own $/sf and days on market, for its box on the page.
  const seg = k => {
    const r = rows.filter(x => x.seg === k);
    return { ppsf: median(r.filter(x => x.sqft > 0).map(x => x.price / x.sqft)), dom: median(r.map(x => x.dom).filter(v => v != null)) };
  };
  const [sfh, condo, other] = ["sfh", "condo", "other"].map(seg);
  if (rows.length) withSales++;
  out.hoods[key] = {
    n: rows.length,
    sfhMedian: median(houses), sfhN: houses.length,
    condoMedian: median(condos), condoN: condos.length,
    otherMedian: median(others), otherN: others.length,
    sfhPpsf: sfh.ppsf, sfhDom: sfh.dom,
    condoPpsf: condo.ppsf, condoDom: condo.dom,
    otherPpsf: other.ppsf, otherDom: other.dom,
    ppsf: median(ppsf),
    dom: median(doms),
    fogHours: fog,
    zone: zones[key]?.zone ?? null,
    // Share of the neighborhood's ground in each zone, for the mix bar.
    zoneMix: zones[key]?.mix ?? null,
  };
}

writeFileSync(OUT, JSON.stringify(out, null, 2) + "\n");
console.log(`wrote ${OUT}`);
console.log(`  ${Object.keys(out.hoods).length} neighborhoods, ${withSales} with ${YEAR} sales (${FROM} to ${TO})`);
