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
    name: p.name || p.address,
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
    name: p.name || p.address,
    address: p.address,
    centroid: center,
    total: hits.length,
    closedCount: closed.length,
    medianSale: median(closed.map(h => h.sellingPrice)),
    recent,
  };
}

writeFileSync(join(DATA, "building-sales.json"), JSON.stringify(buildingSales));
writeFileSync(join(DATA, "listing-buildings.json"), JSON.stringify(listingBuildings));

console.log(`Buildings: ${buildings.features.length}`);
console.log(`Listings: ${listings.features.length}`);
console.log(`Buildings with sales matched: ${matched}`);
console.log(`Reverse address keys: ${Object.keys(listingBuildings).length}`);
console.log(`Wrote building-sales.json (${Object.keys(buildingSales).length} buildings) + listing-buildings.json`);
