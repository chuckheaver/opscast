// Joins the Tall Building Inventory to the MLS listings by street address and
// writes two small lookup files the live pages load (instead of either page
// pulling the full 6.4 MB listings file just to show a link):
//
//   public/data/building-sales.json
//     keyed by building objectid → { name, address, centroid, total,
//     closedCount, medianSale, recent: [{ unit, status, price, date, url }] }
//     Powers the "Market activity" section in the Tall Buildings pop-up.
//
//   public/data/listing-buildings.json
//     keyed by normalized street address → { objectid, name, lng, lat }
//     Powers the "View building structure" link in the listings detail card.
//
// Re-run this whenever the listings data refreshes:  npm run buildings:build

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { normalizeStreetAddress } from "../app/lib/buildingMatch.js";
import { RENTAL_OBJECTIDS, RENTAL_AND_CONDO_OBJECTIDS, EXCLUDED_OBJECTIDS, EXTRA_BUILDINGS, NAME_OVERRIDES } from "../app/fog/lib/buildings.js";

// Preferred display name for an inventory feature (name override → city name → address).
const nameOf = p => NAME_OVERRIDES[String(p.objectid)] || p.name || p.address;

// Tenure label: "rental" (pure rental, buy-side stats hidden), "both" (condo +
// rental — keeps stats, labeled "(Rental/Condo)"), or "condo".
const tenureOf = id => RENTAL_AND_CONDO_OBJECTIDS.has(String(id)) ? "both"
  : RENTAL_OBJECTIDS.has(String(id)) ? "rental" : "condo";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DATA = join(ROOT, "public", "data");

const buildings = JSON.parse(readFileSync(join(DATA, "sf-tall-buildings.geojson"), "utf8"));
const listings = JSON.parse(readFileSync(join(DATA, "sf-listings.geojson"), "utf8"));

const CLOSED = new Set(["Closed", "Sold Off MLS"]);

// Index every listing by its normalized street address.
const listingsByAddr = new Map();
for (const f of listings.features) {
  const key = normalizeStreetAddress(f.properties.address);
  if (!key) continue;
  if (!listingsByAddr.has(key)) listingsByAddr.set(key, []);
  listingsByAddr.get(key).push(f.properties);
}

// Average a polygon's outer-ring vertices — close enough to label/zoom a
// single building footprint.
function centroid(geometry) {
  const ring = geometry?.coordinates?.[0];
  if (!ring?.length) return null;
  let x = 0, y = 0;
  for (const [lng, lat] of ring) { x += lng; y += lat; }
  return [x / ring.length, y / ring.length];
}

function median(nums) {
  const s = nums.filter(n => Number.isFinite(n) && n > 0).sort((a, b) => a - b);
  if (!s.length) return null;
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

const buildingSales = {};
const listingBuildings = {};
let matched = 0;

for (const f of buildings.features) {
  const p = f.properties;
  const key = normalizeStreetAddress(p.address);
  if (!key) continue;
  const center = centroid(f.geometry);
  // Reverse lookup is keyed by address regardless of whether sales exist, so a
  // listing in ANY of the 180 towers can link back to the building record.
  listingBuildings[key] = {
    objectid: p.objectid,
    name: nameOf(p),
    lng: center?.[0] ?? null,
    lat: center?.[1] ?? null,
  };

  const hits = listingsByAddr.get(key);
  if (!hits || !hits.length) continue;
  matched++;

  const closed = hits.filter(h => CLOSED.has(h.status));
  const recent = [...hits]
    .sort((a, b) => {
      const da = a.sellingDate || a.statusDate || a.listDate || "";
      const db = b.sellingDate || b.statusDate || b.listDate || "";
      return db.localeCompare(da);
    })
    .slice(0, 12)
    .map(h => ({
      unit: h.unit || (h.address?.match(/#\s*([\w-]+)/)?.[1] ?? null),
      status: h.status || null,
      price: h.sellingPrice ?? h.listPrice ?? h.price ?? null,
      date: h.sellingDate || h.statusDate || h.listDate || null,
      url: h.url || null,
    }));

  buildingSales[p.objectid] = {
    name: nameOf(p),
    address: p.address,
    centroid: center,
    total: hits.length,
    closedCount: closed.length,
    medianSale: median(closed.map(h => h.sellingPrice)),
    recent,
  };
}

writeFileSync(join(DATA, "building-sales.json"), JSON.stringify(buildingSales));
// listing-buildings.json is written further down, AFTER the off-inventory
// EXTRA_BUILDINGS loop adds their reverse entries (so their listings deep-link
// resolves too).

// ── Building profiles ─────────────────────────────────────────────────────
// Richer per-building data for the homebuyer-facing "Tall Buildings" index +
// profile modal: the structural facts (so the modal works without a map click)
// plus market stats derived from the matched listings. Residential and
// mixed-with-residential buildings only.
const RESIDENTIAL_OCC = new Set(["Residential", "Mixed Uses (With Residential)"]);
const FOR_SALE = new Set(["Active", "Coming Soon"]);
const PENDING = new Set(["Pending", "Contingent"]);
// Structural fields surfaced in the profile (same set the map pop-up shows).
const STRUCT_FIELDS = [
  "height_ft", "stories_above_grade", "stories_below_grade", "date",
  "completion_date", "retrofit_date", "building_code_year", "square_footage",
  "structural_material", "structural_system", "facade_material",
  "foundation_system", "fire_resistence_type", "percent_sprinklered",
  "liquefaction_potential",
];

const num = v => {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : null;
};
const range = nums => {
  const v = nums.filter(n => Number.isFinite(n));
  return v.length ? [Math.min(...v), Math.max(...v)] : null;
};
// HOA dues aren't in the export yet; read whatever key it lands under when the
// MLS column is added, so the average lights up automatically with no code change.
const hoaOf = h => num(h.hoa ?? h.hoaDues ?? h.hoa_dues ?? h.associationFee ?? h.hoaFee);

// Market stats for one building, from its matched MLS listings. Shared by the
// inventory buildings (geojson) and the off-inventory EXTRA_BUILDINGS.
function computeMarket(hits) {
  const sold = hits.filter(h => CLOSED.has(h.status) && num(h.sellingPrice));
  const active = hits.filter(h => FOR_SALE.has(h.status));
  const pending = hits.filter(h => PENDING.has(h.status));
  const ppsf = sold.map(h => (num(h.sqft) ? num(h.sellingPrice) / num(h.sqft) : null)).filter(Boolean);
  const pctList = sold.map(h => (num(h.listPrice) ? (num(h.sellingPrice) / num(h.listPrice)) * 100 : null)).filter(Boolean);
  const hoaVals = hits.map(hoaOf).filter(v => Number.isFinite(v) && v > 0);
  return {
    active: active.length,
    pending: pending.length,
    sold: sold.length,
    medianSale: median(sold.map(h => num(h.sellingPrice))),
    priceRange: range(sold.map(h => num(h.sellingPrice))),
    activeMedian: median(active.map(h => num(h.listPrice ?? h.price))),
    medianPpsf: median(ppsf),
    medianDom: median(sold.map(h => num(h.dom))),
    medianPctList: median(pctList),
    bedsRange: range(hits.map(h => num(h.bedrooms))),
    sqftRange: range(hits.map(h => num(h.sqft))),
    hoaAvg: hoaVals.length ? Math.round(hoaVals.reduce((a, b) => a + b, 0) / hoaVals.length) : null,
    hoaRange: range(hoaVals),
    recent: [...hits]
      .sort((a, b) => {
        const da = a.sellingDate || a.statusDate || a.listDate || "";
        const db = b.sellingDate || b.statusDate || b.listDate || "";
        return db.localeCompare(da);
      })
      .slice(0, 12)
      .map(h => ({
        unit: h.unit || (h.address?.match(/#\s*([\w-]+)/)?.[1] ?? null),
        status: h.status || null,
        price: h.sellingPrice ?? h.listPrice ?? h.price ?? null,
        date: h.sellingDate || h.statusDate || h.listDate || null,
        url: h.url || null,
      })),
  };
}

const buildingProfiles = {};
for (const f of buildings.features) {
  const p = f.properties;
  if (!RESIDENTIAL_OCC.has(p.occupancy)) continue;
  // Drop office towers the city's broad "mixed-residential" tag swept in, plus
  // inventory duplicates already covered by an off-inventory EXTRA entry.
  if (EXCLUDED_OBJECTIDS.has(String(p.objectid))) continue;
  const key = normalizeStreetAddress(p.address);
  const hits = (key && listingsByAddr.get(key)) || [];

  const struct = {};
  for (const k of STRUCT_FIELDS) {
    if (p[k] != null && p[k] !== "" && !/^(null|unknown)$/i.test(String(p[k]))) struct[k] = p[k];
  }

  buildingProfiles[p.objectid] = {
    objectid: p.objectid,
    name: nameOf(p),
    address: p.address,
    occupancy: p.occupancy,
    rental: RENTAL_OBJECTIDS.has(String(p.objectid)),
    tenure: tenureOf(p.objectid),
    centroid: centroid(f.geometry),
    struct,
    market: computeMarket(hits),
  };
}

// Off-inventory residential condo buildings (Four Seasons Residences, etc.) —
// not in the city geojson, so they bring their own id/location/struct. Market
// stats come from the same address→listings match. They also need a reverse
// listing→building entry so the listings deep-link resolves them.
let extraMatched = 0;
for (const b of EXTRA_BUILDINGS) {
  // A building can span several street addresses (e.g. The Beacon at 250 + 260
  // King). Aggregate listings across all of them for the market stats, and
  // register every address in the reverse map so any unit links back.
  const keys = [b.address, ...(b.altAddresses || [])]
    .map(normalizeStreetAddress)
    .filter(Boolean);
  const hits = keys.flatMap(k => listingsByAddr.get(k) || []);
  if (hits.length) extraMatched++;
  buildingProfiles[b.id] = {
    objectid: b.id,
    name: b.name,
    address: b.address,
    occupancy: b.occupancy || "Residential",
    rental: false,
    tenure: tenureOf(b.id),
    centroid: [b.lng, b.lat],
    struct: b.struct || {},
    market: computeMarket(hits),
  };
  for (const k of keys) {
    listingBuildings[k] = { objectid: b.id, name: b.name, lng: b.lng, lat: b.lat };
  }
}
writeFileSync(join(DATA, "building-profiles.json"), JSON.stringify(buildingProfiles));
// Now that EXTRA_BUILDINGS have contributed their reverse entries, write it.
writeFileSync(join(DATA, "listing-buildings.json"), JSON.stringify(listingBuildings));

console.log(`Buildings: ${buildings.features.length}`);
console.log(`Listings: ${listings.features.length}`);
console.log(`Buildings with sales matched: ${matched}`);
console.log(`Reverse address keys: ${Object.keys(listingBuildings).length}`);
console.log(`Wrote building-sales.json (${Object.keys(buildingSales).length} buildings) + listing-buildings.json`);
console.log(`Off-inventory buildings: ${EXTRA_BUILDINGS.length} (${extraMatched} with sales matched)`);
console.log(`Wrote building-profiles.json (${Object.keys(buildingProfiles).length} residential buildings)`);
