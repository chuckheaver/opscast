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

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import {
  findNeighborhoodForPoint,
  findContourForPoint,
} from "../app/fog/lib/spatial.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
// Every .csv dropped in data/raw/ is loaded and combined. The original
// export covered SF Districts 1-2; additional exports (other districts) just
// get dropped alongside it and are merged here, de-duped by Listing Number.
const RAW_DIR = join(ROOT, "data", "raw");
const listCsvFiles = () =>
  readdirSync(RAW_DIR)
    .filter(f => f.toLowerCase().endsWith(".csv"))
    .sort()
    .map(f => join(RAW_DIR, f));
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

// Per-address neighborhood overrides (keyed by addrKey). Use when the agent
// wants a specific listing filed under a particular neighborhood regardless
// of what the polygons / nearest-snap produce. District still comes from the
// listing's own MLS Area Desc.
const NEIGHBORHOOD_OVERRIDES = {
  "3232 pacific ave|san francisco|ca|94118": "Lake Street", // per agent
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

// Parse one MLS CSV file → array of listing objects.
function loadOneFile(path) {
  const rows = parseCSV(readFileSync(path, "utf8"));
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

  // Optional columns (per docs/MARKET_DATA_SPEC.md). First present alias wins;
  // all fall back gracefully when the export doesn't carry them.
  const pick = aliases => aliases.find(a => idx[a] != null) || null;
  const latKey = pick(["Latitude", "Lat", "GeoLat"]);
  const lngKey = pick(["Longitude", "Lng", "Long", "GeoLon"]);
  const nbhdKey = pick(["Neighborhood", "Subdivision Name"]);
  const contractKey = pick(["Pending Date", "Contract Date", "Under Contract Date", "Contingent Date"]);

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
        // Optional, per spec. lat/lng skip geocoding; nbhd overrides the
        // polygon guess; contractDate powers future "Went Into Contract".
        lat: latKey ? coord(g(latKey)) : null,
        lng: lngKey ? coord(g(lngKey)) : null,
        nbhd: nbhdKey ? g(nbhdKey) : null,
        contractDate: contractKey ? usDate(g(contractKey)) : null,
        listPrice: num(g("Listing Price")),
        sellingPrice: num(g("Selling Price")),
        listDate: usDate(g("Listing Date")),
        sellingDate: usDate(g("Selling Date")),
        statusDate: usDate(g("Status Date")),
        areaDesc: g("Area Desc"),
        apn: g("APN"),
        agent: g("Listing Agent Name"),
        sellingAgent: g("Selling Agent Name"),
        dom: g("DOM") === "" ? null : Number(g("DOM")),
        office: g("Listing Office Name / ID"),
        url: g("Listing URL"),
      };
    });
}

// Load + combine every CSV in data/raw/, de-duping by Listing Number. When the
// same listing appears in more than one file, the record with the most recent
// Status Date wins, so status changes (Active → Pending → Closed) propagate as
// newer exports are added. Returns one flat array of listing objects.
function loadAllListings() {
  const files = listCsvFiles();
  const byId = new Map();
  let dupes = 0;
  for (const f of files) {
    const rows = loadOneFile(f);
    for (const l of rows) {
      const ex = byId.get(l.id);
      if (ex) {
        dupes++;
        if ((l.statusDate || "") > (ex.statusDate || "")) byId.set(l.id, l); // newer wins
      } else {
        byId.set(l.id, l);
      }
    }
    console.log(`  ${f.split("/").pop()}: ${rows.length} rows`);
  }
  if (dupes) console.log(`  (skipped ${dupes} duplicate listing numbers across files)`);
  return [...byId.values()];
}

function num(s) {
  const n = Number(String(s).replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : null;
}

// Signed decimal parse for coordinates (num() would strip the minus sign).
function coord(s) {
  const v = parseFloat(s);
  return Number.isFinite(v) ? v : null;
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

// ── Nearest-neighborhood snap ───────────────────────────────────────────────
// Presidio, Golden Gate Park, and Lincoln Park are parkland with no real
// estate (they carry a null district_num in the realtor data). A listing that
// geocodes into one of them is an edge case — snap it to the nearest
// neighborhood polygon that actually has real estate.
const KX = Math.cos((37.77 * Math.PI) / 180); // scale lng→x at SF latitude

function segDist2(px, py, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay;
  const len2 = dx * dx + dy * dy;
  let t = len2 ? ((px - ax) * dx + (py - ay) * dy) / len2 : 0;
  t = t < 0 ? 0 : t > 1 ? 1 : t;
  const ex = px - (ax + t * dx), ey = py - (ay + t * dy);
  return ex * ex + ey * ey;
}
function featureMinDist2([lng, lat], feature) {
  const g = feature.geometry;
  if (!g) return Infinity;
  const px = lng * KX, py = lat;
  const polys =
    g.type === "Polygon" ? [g.coordinates] : g.type === "MultiPolygon" ? g.coordinates : [];
  let best = Infinity;
  for (const poly of polys)
    for (const ring of poly)
      for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
        const d = segDist2(px, py, ring[j][0] * KX, ring[j][1], ring[i][0] * KX, ring[i][1]);
        if (d < best) best = d;
      }
  return best;
}
function nearestRealtorWithRE(point) {
  let best = null, bestD = Infinity;
  for (const f of REALTOR.features) {
    if (f.properties?.district_num == null) continue; // skip parkland
    const d = featureMinDist2(point, f);
    if (d < bestD) { bestD = d; best = f; }
  }
  return best;
}

// ── Spatial tagging ─────────────────────────────────────────────────────────
function tag(point) {
  const contour = findContourForPoint(CONTOURS, point);
  const fogN = findNeighborhoodForPoint(FOG_NEIGH, point);
  let realtor = findNeighborhoodForPoint(REALTOR, point);
  // Landed in a no-real-estate park polygon → reassign to the nearest
  // neighborhood that has real estate. (A point outside all polygons stays
  // null so the SF-only guard still drops it.)
  if (realtor && realtor.properties?.district_num == null) {
    realtor = nearestRealtorWithRE(point) || realtor;
  }
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
  const files = listCsvFiles();
  if (!files.length) {
    console.error(`No .csv files in ${RAW_DIR}. Drop your MLS export(s) there and re-run.`);
    process.exit(1);
  }
  mkdirSync(dirname(CACHE_PATH), { recursive: true });
  mkdirSync(PUBLIC_DATA, { recursive: true });

  console.log(`Loading ${files.length} CSV file(s) from data/raw/:`);
  const listings = loadAllListings();
  console.log(`Parsed ${listings.length} unique listings.`);
  const withSqft = listings.filter(l => Number.isFinite(l.sqft) && l.sqft > 0).length;
  console.log(
    withSqft
      ? `Square footage found on ${withSqft}/${listings.length} listings.`
      : `No square-footage column detected — sqft/$psf will show "—" until the export includes one (e.g. "Square Footage").`
  );

  const cache = loadCache();
  // Listings that already carry lat/long don't need geocoding at all.
  const hasLatLng = l => Number.isFinite(l.lat) && Number.isFinite(l.lng);
  const need = listings.filter(l => !hasLatLng(l) && !cache[addrKey(l)]);
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

  // SF bounding box (includes Treasure Island) — a fast first filter for
  // gross mis-geocodes to same-named streets in other cities.
  const inBBox = ([lon, lat]) =>
    lon >= -122.53 && lon <= -122.34 && lat >= 37.69 && lat <= 37.84;

  let matched = 0;
  let unmatched = [];
  let outside = [];
  const features = [];
  for (const l of listings) {
    const c = cache[addrKey(l)];
    const point = (hasLatLng(l) ? [l.lng, l.lat] : null) || c?.point || OVERRIDES[addrKey(l)];
    if (!point) {
      unmatched.push(l.address);
      continue;
    }
    const tags = tag(point);
    // San Francisco only. Drop by city name — catches Daly City / San Ramon,
    // which the SF MLS still tags with an "SF District" so we can't rely on
    // that — plus a bbox sanity check for gross geocode misses. We do NOT
    // require a realtor-neighborhood polygon match, so valid SF spots that
    // aren't in those polygons (e.g. Treasure Island) are kept.
    const cityOk = !l.city || /san\s*francisco/i.test(l.city);
    if (!inBBox(point) || !cityOk) {
      outside.push(l.address);
      continue;
    }
    // An MLS-supplied neighborhood is authoritative over the polygon guess;
    // a manual per-address override beats both.
    if (l.nbhd) tags.neighborhood = l.nbhd;
    const nbOverride = NEIGHBORHOOD_OVERRIDES[addrKey(l)];
    if (nbOverride) tags.neighborhood = nbOverride;
    matched++;
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
        contractDate: l.contractDate ?? null,
        listPrice: l.listPrice,
        sellingPrice: l.sellingPrice,
        // Most useful single "price" for styling: sale price if closed, else list.
        price: l.sellingPrice ?? l.listPrice,
        listDate: l.listDate,
        sellingDate: l.sellingDate,
        statusDate: l.statusDate,
        dom: l.dom ?? null,
        zip: l.zip || null,
        // "SF District N". Prefer the MLS "Area Desc" column; when an export
        // omits it, derive it from the realtor district polygon so the
        // District filter/labels still work.
        areaDesc: l.areaDesc || (tags.districtNum != null ? `SF District ${tags.districtNum}` : null),
        apn: l.apn,
        agent: l.agent,
        sellingAgent: l.sellingAgent || null,
        office: l.office,
        url: l.url,
        // Coordinates so the UI can look up elevation on demand.
        lng: point[0],
        lat: point[1],
        ...tags,
      },
    });
  }

  const fc = {
    type: "FeatureCollection",
    metadata: {
      source: "data/raw/*.csv (combined MLS exports)",
      builtAt: new Date().toISOString(),
      geocoder: "US Census batch geocoder (Public_AR_Current)",
      total: listings.length,
      matched,
      droppedOutsideSF: outside.length,
    },
    features,
  };
  writeFileSync(OUT_PATH, JSON.stringify(fc));

  const withFog = features.filter(f => f.properties.fogHours != null).length;
  const withNbhd = features.filter(f => f.properties.neighborhood).length;
  console.log(`\n✓ wrote ${OUT_PATH}`);
  console.log(`  ${matched}/${listings.length} geocoded`);
  console.log(`  ${withFog} tagged with fog-hours, ${withNbhd} with a neighborhood/district`);
  if (outside.length) {
    console.log(`\n${outside.length} dropped as outside SF:`);
    outside.slice(0, 10).forEach(a => console.log("  -", a));
  }
  if (unmatched.length) {
    console.log(`\n${unmatched.length} unmatched address(es):`);
    unmatched.slice(0, 20).forEach(a => console.log("  -", a));
    if (unmatched.length > 20) console.log(`  …and ${unmatched.length - 20} more`);
  }

  // Refresh the Tall Building ↔ sales join off the listings we just wrote, so
  // the building pop-ups and the building/market cross-links stay in sync with
  // every data refresh — no separate command to remember.
  console.log(`\nRefreshing building↔sales links…`);
  try {
    execFileSync("node", [join(__dirname, "build-building-sales.mjs")], { stdio: "inherit" });
  } catch (e) {
    console.warn("  (building↔sales join failed — run `npm run buildings:build` manually)", e.message);
  }
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
