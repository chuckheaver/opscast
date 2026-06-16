#!/usr/bin/env node
//
// Build pipeline: Wikipedia "Wineries in Napa Valley" category
//                 ──►  public/data/avas/napa-wineries.geojson
//
// Coordinates come from three free sources, in order of preference:
//   1. Wikipedia article coordinates (prop=coordinates)
//   2. The article's Wikidata item (P625)
//   3. Nominatim (OpenStreetMap) search by winery name, Napa County
// Anything still unresolved is reported and skipped, never guessed.
//
// Each winery is stamped with its appellation stack via the same
// point-in-polygon helpers the /wine map uses, so e.g. Robert Mondavi
// lands in Oakville > Napa Valley > North Coast.
//
// Re-run to refresh:  node scripts/build-napa-wineries.mjs
// Nominatim results are cached (data/tmp/napa-wineries-nominatim.json);
// the Wikipedia/Wikidata calls are cheap enough to run fresh each time.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { mergeAvaCollections, avasAtPoint } from "../app/wine/lib/avas.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const CACHE_PATH = join(ROOT, "data", "tmp", "napa-wineries-nominatim.json");
const OUT_PATH = join(ROOT, "public", "data", "avas", "napa-wineries.geojson");
const CATEGORY = "Category:Wineries in Napa Valley";
const UA = "OpsCastWineMap/1.0 (chuck@chuckheaver.com)";

// Category members that aren't actually visitable winery locations.
const SKIP_TITLES = new Set(["Napa Valley Wine Train"]);

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function getJson(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`${url} → HTTP ${res.status}`);
  return res.json();
}

async function categoryTitles() {
  const url =
    "https://en.wikipedia.org/w/api.php?action=query&list=categorymembers" +
    `&cmtitle=${encodeURIComponent(CATEGORY)}&cmlimit=500&format=json`;
  const d = await getJson(url);
  return d.query.categorymembers
    .map(m => m.title)
    .filter(t => !t.startsWith("Category:") && !SKIP_TITLES.has(t));
}

// Tier 1: coordinates straight off the Wikipedia articles, plus each
// page's Wikidata id for the tier-2 lookup. Batched 50 titles at a time.
async function wikipediaData(titles) {
  const byTitle = new Map();
  for (let i = 0; i < titles.length; i += 50) {
    const batch = titles.slice(i, i + 50);
    const url =
      "https://en.wikipedia.org/w/api.php?action=query&prop=coordinates|pageprops" +
      "&colimit=500&ppprop=wikibase_item&format=json" +
      `&titles=${encodeURIComponent(batch.join("|"))}`;
    const d = await getJson(url);
    for (const page of Object.values(d.query.pages)) {
      const co = page.coordinates?.[0];
      byTitle.set(page.title, {
        title: page.title,
        qid: page.pageprops?.wikibase_item || null,
        coords: co ? [co.lon, co.lat] : null,
        source: co ? "wikipedia" : null,
      });
    }
  }
  return byTitle;
}

// Tier 2: Wikidata for every page — P625 coordinates (when the article
// had none), P856 official website, P1329 phone number.
async function wikidataFill(byTitle) {
  const withQid = [...byTitle.values()].filter(w => w.qid);
  for (let i = 0; i < withQid.length; i += 50) {
    const batch = withQid.slice(i, i + 50);
    const url =
      "https://www.wikidata.org/w/api.php?action=wbgetentities&props=claims&format=json" +
      `&ids=${batch.map(w => w.qid).join("|")}`;
    const d = await getJson(url);
    for (const w of batch) {
      const claims = d.entities?.[w.qid]?.claims || {};
      const v = claims.P625?.[0]?.mainsnak?.datavalue?.value;
      if (!w.coords && v && Number.isFinite(v.longitude) && Number.isFinite(v.latitude)) {
        w.coords = [v.longitude, v.latitude];
        w.source = "wikidata";
      }
      w.website = claims.P856?.[0]?.mainsnak?.datavalue?.value || null;
      w.phone = claims.P1329?.[0]?.mainsnak?.datavalue?.value || null;
    }
  }
}

// Ground elevation in batches of 100 via the free Open-Meteo API (feet).
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

// Progressively simpler search strings for a winery title, e.g.
// "Louis M. Martini Winery" also tries "Louis Martini Winery" and
// "Louis Martini"; "Smith-Madrone Vineyards and Winery" tries
// "Smith-Madrone". OSM names rarely match Wikipedia titles exactly.
function nameVariants(title) {
  const base = title.replace(/\s*\([^)]*\)\s*$/, "").trim();
  const noInitial = base.replace(/\b[A-Z]\.\s+/g, "");
  const core = base
    .replace(/\b(Vineyards?|Winery|Wines|Estate|Cellars?|Family)\b/gi, " ")
    .replace(/\b(and|&)\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  const out = [base];
  for (const v of [noInitial, `${core} Winery`, core]) {
    if (v && v.length > 3 && !out.includes(v)) out.push(v);
  }
  return out;
}

// Streets and localities can share a winery's name ("Caymus" is also a
// street in Napa) — only accept hits that look like an actual place of
// business or building.
const NOMINATIM_OK_CLASSES = new Set([
  "craft", "tourism", "amenity", "shop", "building", "man_made", "landuse",
]);

// Tier 3: Nominatim name search, constrained to a Napa-County viewbox so
// a same-named business elsewhere can't hijack the pin. 1 req/s per the
// usage policy; results cached so re-runs are free.
async function nominatimFill(byTitle) {
  const cache = existsSync(CACHE_PATH)
    ? JSON.parse(readFileSync(CACHE_PATH, "utf8"))
    : {};
  const need = [...byTitle.values()].filter(w => !w.coords);
  for (const w of need) {
    for (const name of nameVariants(w.title)) {
      if (!(name in cache)) {
        const url =
          "https://nominatim.openstreetmap.org/search?format=json&limit=3&bounded=1" +
          "&viewbox=-122.65,38.05,-122.05,38.90" +
          `&q=${encodeURIComponent(name)}`;
        process.stdout.write(`  nominatim: ${name}… `);
        const d = await getJson(url);
        const hit = d.find(r => NOMINATIM_OK_CLASSES.has(r.class));
        cache[name] = hit ? { lon: Number(hit.lon), lat: Number(hit.lat) } : null;
        console.log(cache[name] ? "found" : "not found");
        await sleep(1100);
      }
      const hit = cache[name];
      if (hit) {
        w.coords = [hit.lon, hit.lat];
        w.source = "nominatim";
        break;
      }
    }
  }
  mkdirSync(dirname(CACHE_PATH), { recursive: true });
  writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2));
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

  console.log(`Fetching "${CATEGORY}" from Wikipedia…`);
  const titles = await categoryTitles();
  console.log(`  ${titles.length} winery articles`);

  const byTitle = await wikipediaData(titles);
  await wikidataFill(byTitle);
  await nominatimFill(byTitle);

  const resolved = [...byTitle.values()].filter(w => w.coords);
  const unresolved = [...byTitle.values()].filter(w => !w.coords);

  console.log("Resolving elevations…");
  const elevations = await batchElevationFt(resolved.map(w => w.coords));

  const features = resolved
    .map((w, i) => {
      const stack = avasAtPoint(avaFC, w.coords);
      const names = stack.map(s => s.properties.name);
      const name = w.title.replace(/\s*\([^)]*\)\s*$/, "");
      return {
        type: "Feature",
        geometry: { type: "Point", coordinates: w.coords },
        properties: {
          id: `wiki-${w.qid || w.title}`,
          name,
          city: "",
          address: null,
          phone: w.phone || null,
          website: w.website || null,
          varietals: "",
          elevationFt: Number.isFinite(elevations[i]) ? elevations[i] : null,
          listingUrl:
            "https://en.wikipedia.org/wiki/" +
            encodeURIComponent(w.title.replace(/ /g, "_")),
          ava: names[0] || "",
          avaStack: names.join("|"),
          coordSource: w.source,
        },
      };
    })
    .sort((a, b) => a.properties.name.localeCompare(b.properties.name));

  writeFileSync(OUT_PATH, JSON.stringify({ type: "FeatureCollection", features }));
  console.log(`Wrote ${features.length} wineries → ${OUT_PATH}`);
  const bySource = features.reduce((acc, f) => {
    acc[f.properties.coordSource] = (acc[f.properties.coordSource] || 0) + 1;
    return acc;
  }, {});
  console.log("  coordinate sources:", JSON.stringify(bySource));
  if (unresolved.length) {
    console.log(`  unresolved (skipped): ${unresolved.map(w => w.title).join(", ")}`);
  }
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
