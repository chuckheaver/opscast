#!/usr/bin/env node
//
// Build pipeline: MLS listing export (CSV)
//                 ──►  public/data/sf-listings.geojson
//
// Steps:
//   1. Parse the raw MLS CSV (data/raw/listings.csv).
//   2. Geocode every address → lng/lat via the free U.S. Census batch
//      geocoder (no API key, one network round-trip for the whole file).
//   3. Stamp each geocoded property with its fog-hours (from the USGS
//      contours), fog-neighborhood name, and SFAR realtor district —
//      reusing the same point-in-polygon helpers the /fog map uses.
//   4. Write a Point FeatureCollection the map layer fetches at runtime.
//
// Re-run any time you drop a fresh MLS export at data/raw/listings.csv:
//   node scripts/geocode-listings.mjs
//
// Geocoding is the slow part (~10-30s for a few hundred addresses). Results
// are cached in data/tmp/geocode-cache.json keyed by address so re-runs that
// only change tagging logic don't re-hit the Census API.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  findNeighborhoodForPoint,
  findContourForPoint,
} from "../app/fog/lib/spatial.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const CSV_PATH = join(ROOT, "data", "raw", "listings.csv");
const PUBLIC_DATA = join(ROOT, "public", "data");
const OUT_PATH = join(PUBLIC_DATA, "sf-listings.geojson");
const CACHE_PATH = join(ROOT, "data", "tmp", "geocode-cache.json");

const CONTOURS = JSON.parse(
  readFileSync(join(PUBLIC_DATA, "sf-fog-contours.geojson"), "utf8")
);
const FOG_NEIGH = JSON.parse(
  readFileSync(join(PUBLIC_DATA, "sf-fog-neighborhoods.geojson"), "utf8")
);
const REALTOR = JSON.parse(
  readFileSync(join(PUBLIC_DATA, "sf-realtor-neighborhoods.geojson"), "utf8")
);

const CENSUS_URL =
  "https://geocoding.geo.census.gov/geocoder/locations/addressbatch";
const CENSUS_BENCHMARK = "Public_AR_Current";

// Manual coordinate overrides for addresses the Census geocoder can't match
// (small / private streets it doesn't carry). Keyed by addrKey(). Coordinates
// sourced from OpenStreetMap. Add new ones here when the run reports misses.
const OVERRIDES = {
  "40 sea view ter|san francisco|ca|94121": [-122.4911, 37.7843], // Sea View Terrace, Seacliff
};

// ── CSV parsing ───────────────────────────────────────────────────────────
// Minimal RFC-4180 parser: handles quoted fields, embedded commas, and
// doubled "" escapes. Returns array-of-arrays.
function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\r") {
      // ignore; \n handles the row break
    } else if (c === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += c;
    }
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

function loadListings() {
  const rows = parseCSV(readFileSync(CSV_PATH, "utf8"));
  const header = rows[0];
  // The export has two columns literally named "Status" (display + code).
  // Track the second occurrence so we keep both.
  const idx = {};
  header.forEach((h, i) => {
    if (h === "Status" && idx.Status != null) idx.StatusCode = i;
    else if (idx[h] == null) idx[h] = i;
  });
  // Square footage column name varies between MLS exports. Pick the first
  // candidate that's actually present in the header — so this keeps working
  // whichever way Charles labels it when he adds it to the export. Stays null
  // (→ "—" in the UI) until one of these columns exists.
  const SQFT_FIELDS = [
    "Square Footage", "SqFt", "Sq Ft", "Living Area", "Living Square Feet",
    "Approx Living SqFt", "Building Area Total", "Total SqFt", "Approx SqFt",
  ];
  const sqftKey = SQFT_FIELDS.find(f => idx[f] != null) || null;

  return rows
    .slice(1)
    .filter(r => r.length >= header.length && r[idx["Listing Number"]])
    .map(r => {
      const g = name => (r[idx[name]] || "").trim();
      // Build a clean street line from components (drops the unit — Census
      // geocodes to the building, which is all we need for mapping).
      const street = [
        g("Street Number"),
        g("Street Direction"),
        g("Street Name"),
        g("Street Suffix"),
        g("Street Post Direction"),
      ]
        .filter(Boolean)
        .join(" ")
        .replace(/\s+/g, " ");
      return {
        id: g("Listing Number"),
        street,
        city: g("City") || "San Francisco",
        state: g("State") || "CA",
        zip: g("Address - ZIP"),
        // Display / analysis fields carried into the GeoJSON properties.
        address: g("Address"),
        unit: g("Unit"),
        status: g("Status"), // first "Status" col = display text
        propType: g("Property Subtype 1 Display"),
        bedrooms: g("Bedrooms"),
        bathrooms: g("Bathrooms Display"),
        sqft: sqftKey ? num(g(sqftKey)) : null,
        listPrice: num(g("Listing Price")),
        sellingPrice: num(g("Selling Price")),
        listDate: usDate(g("Listing Date")),
        sellingDate: usDate(g("Selling Date")),
        statusDate: usDate(g("Status Date")),
        areaDesc: g("Area Desc"),
        apn: g("APN"),
        agent: g("Listing Agent Name"),
        office: g("Listing Office Name / ID"),
        url: g("Listing URL"),
      };
    });
}

function num(s) {
  const n = Number(String(s).replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : null;
}

// MLS exports dates as MM/DD/YY. Normalize to ISO YYYY-MM-DD so the map can
// do plain string range comparisons. Two-digit years map to 2000-2099.
function usDate(s) {
  const m = /^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/.exec(s);
  if (!m) return null;
  let [, mm, dd, yy] = m;
  if (yy.length === 2) yy = "20" + yy;
  return `${yy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
}

// ── Geocoding (Census batch) ────────────────────────────────────────────────
function loadCache() {
  try {
    return JSON.parse(readFileSync(CACHE_PATH, "utf8"));
  } catch {
    return {};
  }
}

function addrKey(l) {
  return `${l.street}|${l.city}|${l.state}|${l.zip}`.toLowerCase();
}

async function geocodeBatch(listings) {
  // Census batch input is headerless CSV: id, street, city, state, zip.
  const csv = listings
    .map(l => [l.id, l.street, l.city, l.state, l.zip].map(csvCell).join(","))
    .join("\n");

  const form = new FormData();
  form.append("benchmark", CENSUS_BENCHMARK);
  form.append(
    "addressFile",
    new Blob([csv], { type: "text/csv" }),
    "addresses.csv"
  );

  const res = await fetch(CENSUS_URL, { method: "POST", body: form });
  if (!res.ok) throw new Error(`Census geocoder HTTP ${res.status}`);
  const text = await res.text();

  // Output rows: id, input, matchStatus, matchType, matchedAddr, "lon,lat", tigerId, side
  const out = {};
  for (const row of parseCSV(text)) {
    const id = row[0];
    const matchStatus = row[2];
    if (matchStatus === "Match" && row[5]) {
      const [lon, lat] = row[5].split(",").map(Number);
      if (Number.isFinite(lon) && Number.isFinite(lat)) {
        out[id] = { point: [lon, lat], matchedAddress: row[4] };
      }
    }
  }
  return out;
}

function csvCell(v) {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

// ── Spatial tagging ─────────────────────────────────────────────────────────
function tag(point) {
  const contour = findContourForPoint(CONTOURS, point);
  const fogN = findNeighborhoodForPoint(FOG_NEIGH, point);
  const realtor = findNeighborhoodForPoint(REALTOR, point);
  return {
    fogHours: contour?.properties?.hours ?? fogN?.properties?.fogHours ?? null,
    fogNeighborhood: fogN?.properties?.name ?? null,
    neighborhood: realtor?.properties?.nbrhood ?? null,
    district: realtor?.properties?.district ?? null,
    districtNum: realtor?.properties?.district_num ?? null,
  };
}

// ── Main ──────────────────────────────────────────────────────────────────
async function main() {
  if (!existsSync(CSV_PATH)) {
    console.error(`Missing ${CSV_PATH}. Drop your MLS export there and re-run.`);
    process.exit(1);
  }
  mkdirSync(dirname(CACHE_PATH), { recursive: true });
  mkdirSync(PUBLIC_DATA, { recursive: true });

  const listings = loadListings();
  console.log(`Parsed ${listings.length} listings from CSV.`);
  const withSqft = listings.filter(l => Number.isFinite(l.sqft) && l.sqft > 0).length;
  console.log(
    withSqft
      ? `Square footage found on ${withSqft}/${listings.length} listings.`
      : `No square-footage column detected — sqft/$psf will show "—" until the export includes one (e.g. "Square Footage").`
  );

  const cache = loadCache();
  const need = listings.filter(l => !cache[addrKey(l)]);
  console.log(
    `${listings.length - need.length} cached, ${need.length} to geocode.`
  );

  if (need.length) {
    // Census batch caps at 10k rows/request; chunk to be safe.
    const CHUNK = 1000;
    for (let i = 0; i < need.length; i += CHUNK) {
      const slice = need.slice(i, i + CHUNK);
      console.log(`Geocoding ${i + 1}-${i + slice.length} of ${need.length}…`);
      const res = await geocodeBatch(slice);
      for (const l of slice) {
        const r = res[l.id];
        cache[addrKey(l)] = r
          ? { point: r.point, matchedAddress: r.matchedAddress }
          : { point: null };
      }
    }
    writeFileSync(CACHE_PATH, JSON.stringify(cache));
  }

  let matched = 0;
  let unmatched = [];
  const features = [];
  for (const l of listings) {
    const c = cache[addrKey(l)];
    const point = c?.point || OVERRIDES[addrKey(l)];
    if (!point) {
      unmatched.push(l.address);
      continue;
    }
    matched++;
    const tags = tag(point);
    features.push({
      type: "Feature",
      geometry: { type: "Point", coordinates: point },
      properties: {
        id: l.id,
        address: l.address,
        unit: l.unit || null,
        status: l.status,
        propType: l.propType,
        bedrooms: l.bedrooms ? Number(l.bedrooms) : null,
        bathrooms: l.bathrooms || null,
        sqft: l.sqft ?? null,
        listPrice: l.listPrice,
        sellingPrice: l.sellingPrice,
        // Most useful single "price" for styling: sale price if closed, else list.
        price: l.sellingPrice ?? l.listPrice,
        listDate: l.listDate,
        sellingDate: l.sellingDate,
        statusDate: l.statusDate,
        areaDesc: l.areaDesc,
        apn: l.apn,
        agent: l.agent,
        office: l.office,
        url: l.url,
        ...tags,
      },
    });
  }

  const fc = {
    type: "FeatureCollection",
    metadata: {
      source: "data/raw/listings.csv (MLS export)",
      builtAt: new Date().toISOString(),
      geocoder: "US Census batch geocoder (Public_AR_Current)",
      total: listings.length,
      matched,
    },
    features,
  };
  writeFileSync(OUT_PATH, JSON.stringify(fc));

  const withFog = features.filter(f => f.properties.fogHours != null).length;
  const withNbhd = features.filter(f => f.properties.neighborhood).length;
  console.log(`\n✓ wrote ${OUT_PATH}`);
  console.log(`  ${matched}/${listings.length} geocoded`);
  console.log(`  ${withFog} tagged with fog-hours, ${withNbhd} with a neighborhood/district`);
  if (unmatched.length) {
    console.log(`\n${unmatched.length} unmatched address(es):`);
    unmatched.slice(0, 20).forEach(a => console.log("  -", a));
    if (unmatched.length > 20) console.log(`  …and ${unmatched.length - 20} more`);
  }
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
