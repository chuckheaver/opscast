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
import { statsThrough, throughStamp } from "./stats-through.mjs";
import { fogZone } from "../app/lib/fog-zones.js";
import { segOf, SEGMENTS } from "../app/lib/segments.js";

const LISTINGS = "public/data/sf-listings.geojson";
const PARCELS = "public/data/parcel-res-by-neighborhood.json";
const OUT = "app/lib/landing-stats.json";

// A sale's zone: the fog polygon at its own point (app/lib/fog-zones.js).
const KEY = { Sun: "sun", Transition: "transition", Fog: "fog", "Persistent Fog": "persistentFog" };
const zoneOf = h => KEY[fogZone(h)] ?? null;
const median = xs => {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

const geo = JSON.parse(readFileSync(LISTINGS, "utf8"));
const THROUGH = statsThrough(geo);                 // e.g. "2026-09-30"
const built = throughStamp(THROUGH);
const year = THROUGH.slice(0, 4);
const upTo = d => String(d || "").slice(0, 10) <= THROUGH;

const sales = [];
for (const f of geo.features || []) {
  const p = f.properties || {};
  const price = Number(p.sellingPrice) || 0;
  if (price <= 0) continue;
  if (!String(p.sellingDate || "").startsWith(year) || !upTo(p.sellingDate)) continue;
  sales.push({
    zone: zoneOf(p.fogHours),
    price,
    sqft: Number(p.sqft) || 0,
    house: segOf(p.propType) === "sfh",
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
const md = THROUGH.slice(5);
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
      sqft: Number(p.sqft) || 0,
      dom: Number.isFinite(Number(p.dom)) ? Number(p.dom) : null,
      seg: segOf(p.propType),        // sfh | condo | duplex | other (app/lib/segments.js)
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
    volume: v.reduce((a, r) => a + r.price, 0),
    avg: mean(v.map(r => r.price)),
    ppsf: median(v.filter(r => r.sqft > 0).map(r => r.price / r.sqft)),
    dom: median(doms),
    // Two different things, and they get confused for each other:
    // overAsk is the SHARE of sales that closed above list; saleToList is
    // the typical sale as a percentage OF list, i.e. the actual premium.
    overAsk: withList.length ? (100 * withList.filter(r => r.price > r.list).length) / withList.length : null,
    saleToList: withList.length ? median(withList.map(r => (100 * r.price) / r.list)) : null,
  };
};
const marketFor = rows => ({
  sfh: seg(rows, r => r.seg === "sfh"),
  condo: seg(rows, r => r.seg === "condo"),
  duplex: seg(rows, r => r.seg === "duplex"),
  other: seg(rows, r => r.seg === "other"),
  volume: rows.reduce((a, r) => a + r.price, 0),
  n: rows.length,
});
const cur = marketFor(bucket(year));
const prior = marketFor(bucket(prevYear));

const out = {
  generatedAt: new Date().toISOString(),
  dataThrough: built,
  year,
  // This year's closings, which is what the map shows.
  salesThisYear: sales.length,
  neighborhoods: Object.keys(parcels).length,
  parcels: parcelTotal,
  // The briefing's front-page KPIs, this year against last.
  market: { year, priorYear: prevYear, through: `${year}-${md}`, current: cur, prior },
  // Houses only — see the note at the top of this file.
  houses: {
    sun, transition: zoneStat(houses, "transition"), fog: zoneStat(houses, "fog"), persistentFog: pfog,
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
// Each point carries its segment, by index into SEGMENTS (app/lib/segments.js):
// 0 = SFH, 1 = Condo / TIC / Co-op, 2 = Other — the map colours them to match.
const SEG_INDEX = Object.fromEntries(SEGMENTS.map((s, i) => [s.key, i]));
const pts = [];
for (const f of geo.features || []) {
  const p = f.properties || {};
  if (!(Number(p.sellingPrice) > 0) || !String(p.sellingDate || "").startsWith(year) || !upTo(p.sellingDate)) continue;
  if (p.noLocation) continue;                   // no real location — not drawn
  const [lng, lat] = f.geometry?.coordinates || [];
  if (Number.isFinite(lng) && Number.isFinite(lat)) pts.push([+lng.toFixed(5), +lat.toFixed(5), SEG_INDEX[segOf(p.propType)]]);
}
writeFileSync(POINTS, JSON.stringify({ year, through: built, segments: SEGMENTS.map(s => s.short), points: pts }));
console.log(`wrote ${POINTS} (${pts.length.toLocaleString()} points)`);
console.log(`wrote ${OUT}`);
console.log(`  ${out.salesThisYear.toLocaleString()} ${year} sales · ${out.parcels.toLocaleString()} parcels`);
console.log(`  houses: sun $${(sun.median / 1e6).toFixed(2)}M ($${Math.round(sun.ppsf)}/sf) vs persistent fog $${(pfog.median / 1e6).toFixed(2)}M ($${Math.round(pfog.ppsf)}/sf) — ${out.houses.priceRatio.toFixed(2)}x`);
