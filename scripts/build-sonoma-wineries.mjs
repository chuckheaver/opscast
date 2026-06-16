#!/usr/bin/env node
//
// Build pipeline: sonoma.com winery directory
//                 ──►  public/data/avas/sonoma-wineries.geojson
//
// Steps:
//   1. Fetch the ~11 pages of https://www.sonoma.com/businesses/?category=Wineries
//      (politely: sequential, 500 ms apart, cached locally so re-runs are free).
//   2. Each page embeds the GeoJSON its own map renders — exact lng/lat,
//      name, city, and listing id per winery — so no geocoding is needed.
//      Street addresses come from the listing markup, paired by id.
//   3. Fetch each winery's detail page (cached) for phone, website, and
//      the "At A Glance" varietal lists (Red Wines / White and Dessert
//      Wines).
//   4. Batch-resolve ground elevation for every point via the free
//      Open-Meteo elevation API (100 points per request, no key).
//   5. Stamp each winery with its appellation stack via the same
//      point-in-polygon helpers the /wine map uses.
//   6. Write a Point FeatureCollection the map layer fetches at runtime.
//
// Only facts are kept (name, address, coordinates, listing URL) — the
// directory's descriptive copy stays out of our dataset.
//
// Re-run to refresh:  node scripts/build-sonoma-wineries.mjs
// Force re-download:  rm -rf data/tmp/sonoma-wineries-cache && re-run

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { mergeAvaCollections, avasAtPoint } from "../app/wine/lib/avas.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const CACHE_DIR = join(ROOT, "data", "tmp", "sonoma-wineries-cache");
const OUT_PATH = join(ROOT, "public", "data", "avas", "sonoma-wineries.geojson");
const BASE_URL = "https://www.sonoma.com/businesses?category=Wineries";
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function fetchPage(page) {
  mkdirSync(CACHE_DIR, { recursive: true });
  const cacheFile = join(CACHE_DIR, `page-${page}.html`);
  if (existsSync(cacheFile)) return readFileSync(cacheFile, "utf8");
  const url = page === 1 ? BASE_URL : `${BASE_URL}&page=${page}`;
  process.stdout.write(`  fetching page ${page}… `);
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`${url} → HTTP ${res.status}`);
  const html = await res.text();
  writeFileSync(cacheFile, html);
  console.log("ok");
  await sleep(500);
  return html;
}

const decodeEntities = s =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&#0?39;|&apos;|&#8217;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&#8211;/g, "–")
    .replace(/\s+/g, " ")
    .trim();

// The map data each page embeds: `points = {…FeatureCollection…} ;`
function extractPoints(html) {
  const m = html.match(/points\s*=\s*(\{.*?\}\]\})\s*;/s);
  if (!m) return [];
  return JSON.parse(m[1]).features;
}

// Listing markup pairs an /businesses/{id}/… link with an <h6> address:
//   <a href="/businesses/6750/j-vineyards-winery">J Vineyards…</a>
//   <h6>11447 Old Redwood Highway, , Healdsburg CA 95448</h6>
function extractAddresses(html) {
  const out = new Map();
  const re = /href="\/businesses\/(\d+)\/[^"]*"[^>]*>[^<]+<\/a>\s*<\/h4>\s*<h6>([^<]+)<\/h6>/g;
  let m;
  while ((m = re.exec(html))) {
    const address = decodeEntities(m[2]).replace(/,\s*,/g, ",");
    out.set(Number(m[1]), address);
  }
  return out;
}

async function fetchDetail(id, path) {
  const cacheFile = join(CACHE_DIR, `detail-${id}.html`);
  if (existsSync(cacheFile)) return readFileSync(cacheFile, "utf8");
  const url = `https://www.sonoma.com${path}`;
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) return null;
  const html = await res.text();
  writeFileSync(cacheFile, html);
  await sleep(400);
  return html;
}

// Detail-page extraction: tel: link, the "Visit Website" outbound link
// (utm_* tracking stripped), and the At-A-Glance varietal <dl> lists.
function parseDetail(html) {
  if (!html) return { phone: null, website: null, varietals: [] };
  const phone = html.match(/href="tel:([^"]+)"/)?.[1]?.trim() || null;
  let website = null;
  const w = html.match(/href="(https?:[^"]+)"[^>]*>\s*Visit Website/i);
  if (w) {
    try {
      const u = new URL(w[1].replace(/&amp;/g, "&"));
      [...u.searchParams.keys()]
        .filter(k => k.startsWith("utm_"))
        .forEach(k => u.searchParams.delete(k));
      website = u.toString().replace(/\?$/, "");
    } catch {
      website = w[1];
    }
  }
  const varietals = [];
  for (const dl of html.matchAll(/<dl><dt>(Red Wines|White and Dessert Wines)<\/dt>([\s\S]*?)<\/dl>/g)) {
    for (const dd of dl[2].matchAll(/<dd>([^<]+)<\/dd>/g)) {
      varietals.push(decodeEntities(dd[1]));
    }
  }
  return { phone, website, varietals };
}

// Ground elevation for many points at once — Open-Meteo accepts up to
// 100 coordinates per call and needs no API key. Returns feet.
async function batchElevationFt(coordsList) {
  const out = [];
  for (let i = 0; i < coordsList.length; i += 100) {
    const batch = coordsList.slice(i, i + 100);
    const url =
      "https://api.open-meteo.com/v1/elevation" +
      `?latitude=${batch.map(c => c[1].toFixed(5)).join(",")}` +
      `&longitude=${batch.map(c => c[0].toFixed(5)).join(",")}`;
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (!res.ok) throw new Error(`elevation API → HTTP ${res.status}`);
    const d = await res.json();
    out.push(...d.elevation.map(m => Math.round(m * 3.28084)));
    await sleep(300);
  }
  return out;
}

// The "N results" text is split across tags, so read the page count off
// the pagination links instead (max page=N on the page).
function pageCount(html) {
  let pages = 1;
  for (const m of html.matchAll(/[?&](?:amp;)?page=(\d+)/g)) {
    pages = Math.max(pages, Number(m[1]));
  }
  return { pages };
}

async function main() {
  console.log("Loading AVA polygons for tagging…");
  const napa = JSON.parse(
    readFileSync(join(ROOT, "public", "data", "avas", "napa_avas.geojson"), "utf8")
  );
  const sonoma = JSON.parse(
    readFileSync(join(ROOT, "public", "data", "avas", "sonoma_avas.geojson"), "utf8")
  );
  const avaFC = mergeAvaCollections(napa, sonoma);

  console.log("Fetching sonoma.com winery directory…");
  const first = await fetchPage(1);
  const { pages } = pageCount(first);
  console.log(`  directory spans ${pages} pages`);

  const byId = new Map();
  for (let p = 1; p <= pages; p++) {
    const html = p === 1 ? first : await fetchPage(p);
    const addresses = extractAddresses(html);
    for (const f of extractPoints(html)) {
      const props = f.properties || {};
      const id = props.id;
      if (!id || byId.has(id)) continue;
      const [lng, lat] = f.geometry?.coordinates || [];
      if (!Number.isFinite(lng) || !Number.isFinite(lat)) continue;
      const stack = avasAtPoint(avaFC, [lng, lat]);
      const names = stack.map(s => s.properties.name);
      byId.set(id, {
        type: "Feature",
        geometry: { type: "Point", coordinates: [lng, lat] },
        properties: {
          id,
          name: decodeEntities(props.title || ""),
          city: decodeEntities(props.city || ""),
          address: addresses.get(id) || null,
          listingUrl: props.url ? `https://www.sonoma.com${props.url}` : null,
          // Most specific appellation first; "" when outside every AVA.
          ava: names[0] || "",
          avaStack: names.join("|"),
        },
      });
    }
  }

  // Detail pages → phone / website / varietals. Cached after the first
  // run, so only fresh listings cost a network round-trip.
  console.log(`Fetching ${byId.size} detail pages (cached after first run)…`);
  let done = 0;
  for (const [id, f] of byId) {
    const p = f.properties;
    const path = p.listingUrl ? new URL(p.listingUrl).pathname : null;
    const detail = parseDetail(path ? await fetchDetail(id, path) : null);
    p.phone = detail.phone;
    p.website = detail.website;
    p.varietals = detail.varietals.join("|");
    if (++done % 50 === 0) console.log(`  ${done}/${byId.size}`);
  }

  // Ground elevation for every winery, in batches of 100.
  console.log("Resolving elevations…");
  const feats = [...byId.values()];
  const elevations = await batchElevationFt(feats.map(f => f.geometry.coordinates));
  feats.forEach((f, i) => {
    f.properties.elevationFt = Number.isFinite(elevations[i]) ? elevations[i] : null;
  });

  const features = feats.sort((a, b) =>
    a.properties.name.localeCompare(b.properties.name)
  );
  const missingAddr = features.filter(f => !f.properties.address).length;
  const outsideAva = features.filter(f => !f.properties.ava).length;
  const missingPhone = features.filter(f => !f.properties.phone).length;
  const missingSite = features.filter(f => !f.properties.website).length;
  const missingVar = features.filter(f => !f.properties.varietals).length;
  writeFileSync(
    OUT_PATH,
    JSON.stringify({ type: "FeatureCollection", features })
  );
  console.log(`Wrote ${features.length} wineries → ${OUT_PATH}`);
  console.log(`  without street address: ${missingAddr}`);
  console.log(`  outside any AVA polygon: ${outsideAva}`);
  console.log(`  missing phone: ${missingPhone}, website: ${missingSite}, varietals: ${missingVar}`);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
