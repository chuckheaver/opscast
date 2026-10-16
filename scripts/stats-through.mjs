// The date every published market stat runs through: the reporting period
// end the owner confirmed before this rebuild, in data/reporting-period.json.
// The site, the map counts and the monthly briefing all describe the same
// period, and scripts/apply-sale-decisions.mjs holds any later closing out
// of the sales file.
//
// Override with STATS_THROUGH=YYYY-MM-DD for a one-off cut. With neither set,
// it falls back to the last day of the last FULL month in the sales file and
// says so — ask the owner for the date instead.
import { existsSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const PERIOD = join(dirname(fileURLToPath(import.meta.url)), "..", "data", "reporting-period.json");

export function statsThrough(geo) {
  if (process.env.STATS_THROUGH) return process.env.STATS_THROUGH;
  if (existsSync(PERIOD)) {
    const end = JSON.parse(readFileSync(PERIOD, "utf8")).periodEnd;
    if (/^\d{4}-\d{2}-\d{2}$/.test(end || "")) return end;
  }
  let latest = "";
  for (const f of geo.features || []) {
    const d = String(f.properties?.sellingDate || "").slice(0, 10);
    if (d > latest) latest = d;
  }
  console.warn("  ! no reporting period end in data/reporting-period.json: inferring one — ask the owner");
  if (!latest) return new Date().toISOString().slice(0, 10);
  const [y, m, d] = latest.split("-").map(Number);
  const monthEnd = new Date(Date.UTC(y, m, 0)).getUTCDate();
  if (d === monthEnd) return latest;
  return new Date(Date.UTC(y, m - 1, 0)).toISOString().slice(0, 10); // end of prior month
}

// "2026-09-30" as a timestamp that reads as Sep 30 in any US time zone.
export const throughStamp = iso => `${iso}T12:00:00-07:00`;
