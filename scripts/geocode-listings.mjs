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
// Estimated points for addresses the export left un-geocoded, written by
// scripts/interpolate-unmapped.py from same-building / same-street
// neighbors. Loaded as a fallback tier (see loadInterpolated).
const INTERP_PATH = join(ROOT, "data", "geocode-interpolated.json");

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
// Agent fields can arrive with the agent's MLS ID + phone numbers baked in
// ("Jane Doe (ID:811150)  Primary:415-555-0100 …"). This file is the last
// stop before a PUBLIC GeoJSON, so reduce to the name here regardless of
// which export format landed in data/raw/. Plain names pass through.
const AGENT_TAIL = /\s*\(ID:|\s+(?:Primary|Secondary|Cell|Other|Office|Home|Fax|Mobile|Direct|Phone)\s*:/;
const cleanAgent = s => String(s || "").split(AGENT_TAIL)[0].trim();

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
  const photoKey = pick(["Photo URL", "Photo", "Full Picture URL", "Picture URL"]);

  return rows
    .slice(1)
    .filter(r => r.length >= header.length && r[idx["Listing Number"]])
    .map(r => {
      const g = name => (r[idx[name]] || "").trim();
      // Build a clean street line from components (drops the unit — Census
      // geocodes to the building, which is all we need for mapping).
      // Canonical CSVs from convert-mls-history.py carry only a full
      // "Address" ("<street>, City, CA zip"), not the split street columns
      // a raw export has. Fall back to the segment before the first comma
      // so the geocode cache key and the Census batch input both get a real
      // street line instead of an empty string (which collapsed every
      // listing in a zip onto one cache key).
      const street = ([
        g("Street Number"),
        g("Street Direction"),
        g("Street Name"),
        g("Street Suffix"),
        g("Street Post Direction"),
      ]
        .filter(Boolean)
        .join(" ") || g("Address").split(",")[0])
        .replace(/\s+/g, " ")
        .trim();
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
        agent: cleanAgent(g("Listing Agent Name")),
        sellingAgent: cleanAgent(g("Selling Agent Name")),
        dom: g("DOM") === "" ? null : Number(g("DOM")),
        office: g("Listing Office Name / ID"),
        url: g("Listing URL"),
        // First listing photo (MLS media), used for the map pop-up link/thumb.
        photo: photoKey ? (g(photoKey).split(";")[0].trim() || null) : null,
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

// Seed the cache from the already-published GeoJSON. Coordinates that a
// Census run finds on one machine live only in that machine's (ignored)
// data/tmp cache — the published file is the one place they persist. Seeding
// from it lets a rebuild anywhere, including where Census is unreachable,
// keep every previously placed address instead of dropping it again.
//
// Fills only keys the cache lacks; export-supplied lat/lng still wins in the
// main loop, and addresses with a manual OVERRIDES entry are skipped so the
// override stays authoritative. Keys are derived exactly as loadOneFile does
// for canonical rows: the address segment before the first comma + city /
// state / zip (published rows are SF-only by construction).
function seedCacheFromPublished(cache) {
  if (!existsSync(OUT_PATH)) return 0;
  let fc;
  try {
    fc = JSON.parse(readFileSync(OUT_PATH, "utf8"));
  } catch {
    return 0;
  }
  let n = 0;
  for (const f of fc.features || []) {
    const p = f.properties || {};
    const pt = f.geometry?.coordinates;
    if (!p.address || !Array.isArray(pt) || pt.length < 2) continue;
    // A placeholder pinned to a neighborhood anchor is not a position for
    // that address — never seed it, so the listing stays geocode-eligible.
    if (p.geoSource === "neighborhood") continue;
    const street = String(p.address).split(",")[0].replace(/\s+/g, " ").trim();
    if (!street) continue;
    const key = addrKey({ street, city: "San Francisco", state: "CA", zip: p.zip || "" });
    if (cache[key] || OVERRIDES[key]) continue;
    // A published point that was itself only estimated stays in the
    // estimate tier so a reachable geocoder still gets to replace it.
    cache[key] = p.geoSource === "interpolated"
      ? { point: pt, source: "interpolated", seededFrom: "published" }
      : p.geoSource === "nearest"
        ? { point: pt, source: "nearest", via: p.geoVia || null, seededFrom: "published" }
        : { point: pt, seededFrom: "published" };
    n++;
  }
  return n;
}

// Load the estimates from interpolate-unmapped.py as the LOWEST tier: only
// fills keys with no usable point (absent, a recorded Census miss, or an
// older estimate). Export lat/lng, a real cached geocode, and OVERRIDES all
// beat it in the main loop, and these keys are still sent to Census whenever
// it is reachable, so a true geocode replaces the estimate automatically.
function loadInterpolated(cache) {
  if (!existsSync(INTERP_PATH)) return 0;
  let est;
  try {
    est = JSON.parse(readFileSync(INTERP_PATH, "utf8"));
  } catch {
    return 0;
  }
  let n = 0;
  for (const [key, e] of Object.entries(est)) {
    if (!Array.isArray(e?.point) || OVERRIDES[key]) continue;
    const cur = cache[key];
    if (cur?.point && cur.source !== "interpolated") continue;
    cache[key] = { point: e.point, source: "interpolated", method: e.method, from: e.from };
    n++;
  }
  return n;
}

// ── Neighborhood placeholders for unmappable listings ──────────────────────
// A sold listing with no findable position (no export lat/lng, no geocode,
// no close neighbor to estimate from) must still exist as a feature so it
// counts in the filter total and the Stats report. Infer its neighborhood
// from placed listings — same street + ZIP first, else the ZIP's majority
// neighborhood — and pin it to that neighborhood's anchor: the placed
// listing nearest the neighborhood's centroid, so it sits on real estate
// inside the polygon. Every such listing in a neighborhood shares one point;
// the map draws them as a single larger blue dot whose pop-up lists all of them.
// Tagged geoSource "neighborhood" + placeholder: <name>. Never cached, so a
// reachable geocoder still gets to place them properly on a later run.
function loadPublished() {
  if (!existsSync(OUT_PATH)) return null;
  try {
    return JSON.parse(readFileSync(OUT_PATH, "utf8"));
  } catch {
    return null;
  }
}
function streetName(address) {
  const s = String(address || "").split(",")[0].replace(/\s+(#|unit\s+|apt\s+)\S+$/i, "").trim();
  const m = /^\d+\s+(.+)$/.exec(s);
  return m ? m[1].toLowerCase() : null;
}
function buildNeighborhoodIndex(fc) {
  const byStreet = new Map(), byZip = new Map(), pts = new Map(), areaByNbhd = new Map();
  const bump = (map, key, val) => {
    const m = map.get(key) || new Map();
    m.set(val, (m.get(val) || 0) + 1);
    map.set(key, m);
  };
  for (const f of fc?.features || []) {
    const p = f.properties || {};
    // Only real positions feed the index — never estimates or placeholders.
    if (!p.neighborhood || p.geoSource === "interpolated" || p.geoSource === "neighborhood") continue;
    const st = streetName(p.address), zip = String(p.zip || "").trim();
    if (st) bump(byStreet, `${st}|${zip}`, p.neighborhood);
    bump(byZip, zip, p.neighborhood);
    if (p.areaDesc) bump(areaByNbhd, p.neighborhood, p.areaDesc);
    (pts.get(p.neighborhood) || pts.set(p.neighborhood, []).get(p.neighborhood)).push(f.geometry.coordinates);
  }
  const top = m => (m ? [...m.entries()].sort((a, b) => b[1] - a[1])[0][0] : null);
  const anchors = new Map();
  for (const [nb, list] of pts) {
    const cx = list.reduce((s, p) => s + p[0], 0) / list.length;
    const cy = list.reduce((s, p) => s + p[1], 0) / list.length;
    let best = list[0], bd = Infinity;
    for (const p of list) {
      const d = ((p[0] - cx) * KX) ** 2 + (p[1] - cy) ** 2;
      if (d < bd) { bd = d; best = p; }
    }
    anchors.set(nb, best);
  }
  return { byStreet, byZip, anchors, areaByNbhd, top };
}
function placeholderFor(l, idx) {
  if (!idx) return null;
  const zip = String(l.zip || "").trim();
  const st = streetName(l.address || l.street);
  const nb = idx.top(st ? idx.byStreet.get(`${st}|${zip}`) : null) || idx.top(idx.byZip.get(zip));
  const point = nb && idx.anchors.get(nb);
  if (!point) return null;
  return { neighborhood: nb, areaDesc: idx.top(idx.areaByNbhd.get(nb)), point };
}

// ── Nearest-address fallback ────────────────────────────────────────────────
// Some addresses are real but sit outside every geocoder's address ranges
// (new construction, a lot split, an in-fill number): 192 Museum Way misses
// while 190 Museum Way matches. When an address misses, try its neighbours
// on the same street out to ±NEAREST_MAX_OFFSET house numbers and pin the
// listing to the closest number that geocodes — same-parity numbers (same
// side of the street) are preferred over the opposite side. Tagged
// geoSource "nearest" + geoVia = the address actually matched, and kept in
// the retry set so a later run that can geocode the true address replaces it.
const NEAREST_MAX_OFFSET = 30;
const UNIT_RE = /\s+(?:#|unit\s+|apt\.?\s+|ste\.?\s+|suite\s+)\S+$/i;
const HOUSE_RE = /^(\d+)\s+(.+)$/;
export function neighborCandidates(street, max = NEAREST_MAX_OFFSET) {
  const m = HOUSE_RE.exec(String(street || "").replace(UNIT_RE, "").trim());
  if (!m) return [];
  const n = Number(m[1]);
  const rest = m[2];
  const out = [];
  for (let d = 1; d <= max; d++) {
    for (const sgn of [-1, 1]) {
      const k = n + sgn * d;
      if (k <= 0) continue;
      out.push({ street: `${k} ${rest}`, offset: sgn * d, sameSide: d % 2 === 0 });
    }
  }
  return out;
}
// Closest number wins; the opposite side of the street costs a few numbers,
// so 190 beats 191 for 192, but 191 still beats 200.
export const nearestRank = c => Math.abs(c.offset) + (c.sameSide ? 0 : 6);

// SF bounding box (includes Treasure Island) — a fast first filter for
// gross mis-geocodes to same-named streets in other cities.
const inBBox = ([lon, lat]) =>
  lon >= -122.53 && lon <= -122.34 && lat >= 37.69 && lat <= 37.84;

async function nearestAddressPass(need, cache, geocode) {
  const retry = need.filter(l => {
    const c = cache[addrKey(l)];
    return !c?.point || c.source === "interpolated" || c.source === "nearest";
  });
  if (!retry.length) return 0;
  const rows = [];
  const byRow = new Map();
  for (const l of retry) {
    for (const c of neighborCandidates(l.street)) {
      const id = `${l.id}#${c.offset}`;
      rows.push({ id, street: c.street, city: l.city, state: l.state, zip: l.zip });
      byRow.set(id, { l, c });
    }
  }
  if (!rows.length) return 0;
  console.log(`Nearest-address fallback: ${retry.length} unmatched address(es) → trying ${rows.length} neighbouring house numbers…`);
  const best = new Map();
  const CHUNK = 1000;
  for (let i = 0; i < rows.length; i += CHUNK) {
    let res;
    try {
      res = await geocode(rows.slice(i, i + CHUNK));
    } catch (err) {
      console.warn(`  nearest-address lookup failed (${err.message}); skipping for this run.`);
      return 0;
    }
    for (const [id, r] of Object.entries(res)) {
      const hit = byRow.get(id);
      if (!hit || !inBBox(r.point)) continue;
      const key = addrKey(hit.l);
      const cur = best.get(key);
      if (!cur || nearestRank(hit.c) < nearestRank(cur.c)) best.set(key, { c: hit.c, r });
    }
  }
  for (const [key, { c, r }] of best) {
    cache[key] = { point: r.point, matchedAddress: r.matchedAddress, source: "nearest", via: c.street, offset: c.offset };
  }
  console.log(`  placed ${best.size} of ${retry.length} at the nearest geocodable house number.`);
  return best.size;
}

// Offline test hook: GEOCODE_MOCK_FILE=<json> answers batches from a map of
// "<street>|<zip>" (lower-case) → [lng, lat] instead of calling Census.
async function mockGeocodeBatch(listings) {
  const table = JSON.parse(readFileSync(process.env.GEOCODE_MOCK_FILE, "utf8"));
  const out = {};
  for (const l of listings) {
    const pt = table[`${l.street}|${l.zip}`.toLowerCase()];
    if (pt) out[l.id] = { point: pt, matchedAddress: `${l.street}, ${l.city}, ${l.state}, ${l.zip}`.toUpperCase() };
  }
  return out;
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
  const seeded = seedCacheFromPublished(cache);
  if (seeded) console.log(`Seeded ${seeded} address(es) from the published sf-listings.geojson.`);
  const estimated = loadInterpolated(cache);
  if (estimated) console.log(`Loaded ${estimated} estimated point(s) from data/geocode-interpolated.json (fallback tier).`);
  // Neighborhood inference for listings nothing above can place (built from
  // real positions in the previously published file).
  const nbhdIndex = buildNeighborhoodIndex(loadPublished());
  // Listings that already carry lat/long don't need geocoding at all.
  // Estimated points are still retried so a real geocode can replace them.
  const hasLatLng = l => Number.isFinite(l.lat) && Number.isFinite(l.lng);
  const ESTIMATE = new Set(["interpolated", "nearest"]);
  const need = listings.filter(l => {
    if (hasLatLng(l)) return false;
    const c = cache[addrKey(l)];
    return !c || ESTIMATE.has(c.source);
  });
  const geocode = process.env.GEOCODE_MOCK_FILE ? mockGeocodeBatch : geocodeBatch;
  console.log(
    `${listings.length - need.length} cached, ${need.length} to geocode.`
  );

  if (need.length) {
    // Census batch caps at 10k rows/request; chunk to be safe.
    const CHUNK = 1000;
    for (let i = 0; i < need.length; i += CHUNK) {
      const slice = need.slice(i, i + CHUNK);
      console.log(`Geocoding ${i + 1}-${i + slice.length} of ${need.length}…`);
      let res;
      try {
        res = await geocode(slice);
      } catch (err) {
        // Census unreachable (offline, egress-blocked, or an outage). Don't
        // abort — everything already cached or carrying lat/lng still gets
        // written below; these rows simply land in the unmatched list so
        // the run is re-tryable later without losing the rest.
        console.warn(`Census geocoder failed (${err.message}); leaving ${slice.length} address(es) unmatched for this run.`);
        continue;
      }
      for (const l of slice) {
        const r = res[l.id];
        const key = addrKey(l);
        // A Census miss must not erase an estimate we already hold.
        cache[key] = r
          ? { point: r.point, matchedAddress: r.matchedAddress }
          : ESTIMATE.has(cache[key]?.source) ? cache[key] : { point: null };
      }
    }
    // Whatever Census still couldn't place: try the neighbouring house
    // numbers and pin to the closest one that resolves.
    await nearestAddressPass(need, cache, geocode);
    writeFileSync(CACHE_PATH, JSON.stringify(cache));
  }

  let matched = 0;
  let placeholders = 0;
  let unmatched = [];
  let outside = [];
  const features = [];
  for (const l of listings) {
    const c = cache[addrKey(l)];
    // Precedence: export lat/lng > a real geocode (Census / carried over from
    // the published file) > a hand-placed OVERRIDE > nearest-address pin >
    // same-street interpolation > neighborhood placeholder.
    const real = c?.point && !ESTIMATE.has(c.source) ? c.point : null;
    let point = (hasLatLng(l) ? [l.lng, l.lat] : null) || real || OVERRIDES[addrKey(l)] || c?.point || null;
    // Provenance of the coordinate, mirroring the precedence above, so the
    // map can flag estimates as approximate.
    let geoSource = hasLatLng(l) ? "export"
      : real ? (c.seededFrom === "published" ? "published" : "census")
      : OVERRIDES[addrKey(l)] ? "override"
      : c?.point ? c.source : null;
    const geoVia = geoSource === "nearest" ? c.via || null : null;
    // Last resort: pin an unmappable listing to its neighborhood so it still
    // exists as a feature and counts. Only truly unresolvable rows fall out.
    let placeholder = null;
    if (!point) {
      placeholder = placeholderFor(l, nbhdIndex);
      if (!placeholder) {
        unmatched.push(l.address);
        continue;
      }
      point = placeholder.point;
      geoSource = "neighborhood";
      placeholders++;
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
    // A placeholder files under the neighborhood it was inferred from (the
    // anchor point's polygon should agree, but the inference is the truth
    // here), and borrows that neighborhood's SF district when the row has
    // none of its own.
    if (placeholder) {
      tags.neighborhood = placeholder.neighborhood;
      if (!l.areaDesc && placeholder.areaDesc) l.areaDesc = placeholder.areaDesc;
    }
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
        geoSource,
        // For "nearest": the neighbouring address whose position this is.
        geoVia,
        placeholder: placeholder ? placeholder.neighborhood : null,
        // "SF District N". Prefer the MLS "Area Desc" column; when an export
        // omits it, derive it from the realtor district polygon so the
        // District filter/labels still work.
        areaDesc: l.areaDesc || (tags.districtNum != null ? `SF District ${tags.districtNum}` : null),
        apn: l.apn,
        agent: l.agent,
        sellingAgent: l.sellingAgent || null,
        office: l.office,
        url: l.url,
        photo: l.photo || null,
        // Coordinates so the UI can look up elevation on demand.
        lng: point[0],
        lat: point[1],
        ...tags,
      },
    });
  }

  // Carry over published listings that aren't in any CSV in data/raw/ (the
  // 2022–2025 comps were built from exports that are no longer on disk).
  // Without this a rebuild would publish only the current CSVs' rows.
  const ids = new Set(listings.map(l => String(l.id)));
  const carried = (loadPublished()?.features || []).filter(f => !ids.has(String(f.properties?.id)));
  if (carried.length) {
    console.log(`Carrying over ${carried.length} published listing(s) not present in data/raw/ CSVs.`);
    features.push(...carried);
  }

  const fc = {
    type: "FeatureCollection",
    metadata: {
      source: "data/raw/*.csv (combined MLS exports)",
      builtAt: new Date().toISOString(),
      geocoder: "US Census batch geocoder (Public_AR_Current)",
      total: features.length,
      rebuilt: listings.length,
      carriedOver: carried.length,
      matched,
      droppedOutsideSF: outside.length,
      neighborhoodPlaceholders: placeholders,
      nearestAddress: features.filter(f => f.properties.geoSource === "nearest").length,
    },
    features,
  };
  writeFileSync(OUT_PATH, JSON.stringify(fc));

  const withFog = features.filter(f => f.properties.fogHours != null).length;
  const withNbhd = features.filter(f => f.properties.neighborhood).length;
  console.log(`\n✓ wrote ${OUT_PATH}`);
  console.log(`  ${matched}/${listings.length} geocoded`);
  console.log(`  ${withFog} tagged with fog-hours, ${withNbhd} with a neighborhood/district`);
  const nearestN = fc.metadata.nearestAddress;
  if (nearestN) {
    console.log(`  ${nearestN} pinned to the nearest geocodable house number (geoSource "nearest")`);
  }
  if (placeholders) {
    console.log(`  ${placeholders} pinned to a neighborhood placeholder (no mappable address; still counted)`);
  }
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

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch(e => {
    console.error(e);
    process.exit(1);
  });
}
