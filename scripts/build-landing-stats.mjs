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

// ── The market KPIs, matching the monthly briefing's front page ─────────
// Year to date against the identical stretch of the prior year, so the site
// and the PDF report never disagree.
const endDate = new Date(built || Date.now());
const md = `${String(endDate.getMonth() + 1).padStart(2, "0")}-${String(endDate.getDate()).padStart(2, "0")}`;
const prevYear = String(Number(year) - 1);

const inWindow = (d, yr) => d >= `${yr}-01-01` && d <= `${yr}-${md}`;
const bucket = yr => {
  const rows = [];
  for (const f of geo.features || []) {
    const p = f.properties || {};
    const price = Number(p.sellingPrice) || 0;
    const d = String(p.sellingDate || "").slice(0, 10);
    if (price <= 0 || !d || !inWindow(d, yr)) continue;
    rows.push({
      price,
      list: Number(p.listPrice) || 0,
      dom: Number.isFinite(Number(p.dom)) ? Number(p.dom) : null,
      house: /single family/i.test(p.propType || ""),
      condo: /condo|tenancy in common/i.test(p.propType || ""),
    });
  }
  return rows;
};
const mean = xs => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null);
const seg = (rows, pick) => {
  const v = rows.filter(pick);
  const doms = v.map(r => r.dom).filter(x => x != null);
  const withList = v.filter(r => r.list > 0);
  return {
    n: v.length,
    median: median(v.map(r => r.price)),
    avg: mean(v.map(r => r.price)),
    dom: median(doms),
    // Two different things, and they get confused for each other:
    // overAsk is the SHARE of sales that closed above list; saleToList is
    // the typical sale as a percentage OF list, i.e. the actual premium.
    overAsk: withList.length ? (100 * withList.filter(r => r.price > r.list).length) / withList.length : null,
    saleToList: withList.length ? median(withList.map(r => (100 * r.price) / r.list)) : null,
  };
};
const marketFor = rows => ({
  sfh: seg(rows, r => r.house),
  condo: seg(rows, r => r.condo),
  volume: rows.reduce((a, r) => a + r.price, 0),
  n: rows.length,
});
const cur = marketFor(bucket(year));
const prior = marketFor(bucket(prevYear));

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
  // The briefing's front-page KPIs, this year against last.
  market: { year, priorYear: prevYear, through: `${year}-${md}`, current: cur, prior },
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

// Where this year's sales are, and nothing else — the home page's live map
// draws these as dots. A few KB instead of the multi-MB listings file.
const POINTS = "public/data/sold-points-ytd.json";
const pts = [];
for (const f of geo.features || []) {
  const p = f.properties || {};
  if (!(Number(p.sellingPrice) > 0) || !String(p.sellingDate || "").startsWith(year)) continue;
  const [lng, lat] = f.geometry?.coordinates || [];
  if (Number.isFinite(lng) && Number.isFinite(lat)) pts.push([+lng.toFixed(5), +lat.toFixed(5)]);
}
writeFileSync(POINTS, JSON.stringify({ year, through: built, points: pts }));
console.log(`wrote ${POINTS} (${pts.length.toLocaleString()} points)`);
console.log(`wrote ${OUT}`);
console.log(`  ${out.salesThisYear.toLocaleString()} ${year} sales · ${out.salesTracked.toLocaleString()} tracked · ${out.parcels.toLocaleString()} parcels`);
console.log(`  houses: sun $${(sun.median / 1e6).toFixed(2)}M ($${Math.round(sun.ppsf)}/sf) vs persistent fog $${(pfog.median / 1e6).toFixed(2)}M ($${Math.round(pfog.ppsf)}/sf) — ${out.houses.priceRatio.toFixed(2)}x`);
