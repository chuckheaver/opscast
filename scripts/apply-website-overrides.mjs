#!/usr/bin/env node
//
// Applies the hand-researched winery website overrides
// (data/winery-website-overrides.json — name → homepage URL) onto the
// built winery GeoJSON files. A winery's own scraped website always wins;
// the override only fills a blank.
//
// This is the durable home for Charles's manual website research: the
// scrapers (build-sonoma-wineries.mjs / build-napa-wineries.mjs) overwrite
// the GeoJSON, so re-run THIS after any winery rebuild to re-apply them:
//   node scripts/build-sonoma-wineries.mjs && node scripts/apply-website-overrides.mjs
//
// Run on its own to apply new overrides immediately:
//   node scripts/apply-website-overrides.mjs

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OVERRIDES = join(ROOT, "data", "winery-website-overrides.json");
const TARGETS = [
  join(ROOT, "public", "data", "avas", "sonoma-wineries.geojson"),
  join(ROOT, "public", "data", "avas", "napa-wineries.geojson"),
];

function main() {
  if (!existsSync(OVERRIDES)) {
    console.error(`Missing ${OVERRIDES}`);
    process.exit(1);
  }
  const overrides = JSON.parse(readFileSync(OVERRIDES, "utf8"));
  // A real homepage URL — guards against "n/a" placeholders ever
  // rendering as a (broken) link.
  const isReal = u =>
    typeof u === "string" &&
    /^https?:\/\//i.test(u.trim()) &&
    !/n\/a/i.test(u);
  let totalApplied = 0;
  for (const path of TARGETS) {
    if (!existsSync(path)) continue;
    const fc = JSON.parse(readFileSync(path, "utf8"));
    let applied = 0;
    for (const f of fc.features) {
      const p = f.properties;
      // Scrub any non-URL junk (e.g. an old "n/a") so it shows as blank.
      if (p.website && !isReal(p.website)) p.website = null;
      // Only fill a blank — never clobber a website the scraper found.
      if (!p.website && isReal(overrides[p.name])) {
        p.website = overrides[p.name];
        applied++;
      }
    }
    writeFileSync(path, JSON.stringify(fc));
    const withSite = fc.features.filter(f => f.properties.website).length;
    console.log(
      `${path.split("/").pop()}: +${applied} from overrides → ${withSite}/${fc.features.length} now have a website`
    );
    totalApplied += applied;
  }
  console.log(`Applied ${totalApplied} website overrides total.`);
}

main();
