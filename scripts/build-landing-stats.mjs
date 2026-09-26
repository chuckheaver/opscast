// Headline figures for the landing page, computed from the live sales file so
// the page can never drift from the data behind it. Re-run after every
// listings rebuild:  node scripts/build-landing-stats.mjs
//
// The sun-vs-fog comparison is SINGLE-FAMILY ONLY, deliberately. Across all
// property types the gap inverts — the Sun zone covers condo-heavy SoMa,
// Mission Bay and downtown, so "the sun" reads cheaper than the fog belt.
// That is Simpson's paradox, not a market fact. Houses against houses is the
// honest comparison, and it is the one the page states.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const LISTINGS = "public/data/sf-listings.geojson";
const PARCELS = "public/data/parcel-res-by-neighborhood.json";
const OUT = "app/lib/landing-stats.json";

const zoneOf = h => {
  if (!Number.isFinite(h)) return null;
  if (h <= 8.0) return "sun";
  if (h < 9.0) return "transition";
  if (h < 11.0) return "fog";
  return "persistentFog";
};
const median = xs => {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

const geo = JSON.parse(readFileSync(LISTINGS, "utf8"));
const built = geo.metadata?.builtAt || null;
const year = String(new Date(built || Date.now()).getFullYear());

const sales = [];
for (const f of geo.features || []) {
  const p = f.properties || {};
  const price = Number(p.sellingPrice) || 0;
  if (price <= 0) continue;
  if (!String(p.sellingDate || "").startsWith(year)) continue;
  sales.push({
    zone: zoneOf(Number(p.fogHours)),
    price,
    sqft: Number(p.sqft) || 0,
    house: /single family/i.test(p.propType || ""),
  });
}

const houses = sales.filter(s => s.house);
const zoneStat = (rows, z) => {
  const v = rows.filter(r => r.zone === z);
  if (!v.length) return null;
  return {
    n: v.length,
    median: median(v.map(r => r.price)),
    ppsf: median(v.filter(r => r.sqft > 0).map(r => r.price / r.sqft)),
  };
};

const parcels = JSON.parse(readFileSync(PARCELS, "utf8"));
const parcelTotal = Object.values(parcels).reduce((a, v) => a + (v.total || 0), 0);

const sun = zoneStat(houses, "sun");
const pfog = zoneStat(houses, "persistentFog");

const out = {
  generatedAt: new Date().toISOString(),
  dataThrough: built,
  year,
  // Every closed sale in the database, all years.
  salesTracked: (geo.features || []).length,
  // This year's closings, which is what the map shows.
  salesThisYear: sales.length,
  neighborhoods: Object.keys(parcels).length,
  parcels: parcelTotal,
  // Houses only — see the note at the top of this file.
  houses: {
    sun, fog: zoneStat(houses, "fog"), persistentFog: pfog,
    n: houses.length,
    priceRatio: sun && pfog ? sun.median / pfog.median : null,
    ppsfRatio: sun && pfog ? sun.ppsf / pfog.ppsf : null,
  },
};

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(out, null, 2) + "\n");
console.log(`wrote ${OUT}`);
console.log(`  ${out.salesThisYear.toLocaleString()} ${year} sales · ${out.salesTracked.toLocaleString()} tracked · ${out.parcels.toLocaleString()} parcels`);
console.log(`  houses: sun $${(sun.median / 1e6).toFixed(2)}M ($${Math.round(sun.ppsf)}/sf) vs persistent fog $${(pfog.median / 1e6).toFixed(2)}M ($${Math.round(pfog.ppsf)}/sf) — ${out.houses.priceRatio.toFixed(2)}x`);
