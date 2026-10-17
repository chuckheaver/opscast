// The date every published market stat runs through: the reporting period
// end the owner confirmed before this rebuild, in data/reporting-period.json.
// The site, the map counts and the monthly briefing all describe the same
// period, and scripts/apply-sale-decisions.mjs holds any later closing out
// of the sales file.
//
// The owner's rule: report only full calendar months. The period end is the
// last day of the last FULL month in the latest data load (lastFullMonth); a
// month the load is still in — the early-October closings of an Oct 1 load —
// is never reported until a later load completes it. apply-sale-decisions.mjs
// stops if the period end falls inside that month.
//
// Override with STATS_THROUGH=YYYY-MM-DD for a one-off cut. With neither set,
// it falls back to lastFullMonth and says so — ask the owner instead.
import { existsSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const PERIOD = join(dirname(fileURLToPath(import.meta.url)), "..", "data", "reporting-period.json");

// A real calendar date written YYYY-MM-DD, or a stop: a mistyped period end
// must never quietly turn into a guessed one.
function checkDate(v, where) {
  const ok = /^\d{4}-\d{2}-\d{2}$/.test(v || "") && new Date(`${v}T00:00:00Z`).toISOString().slice(0, 10) === v;
  if (!ok) throw new Error(`${where} must be a date written YYYY-MM-DD, got ${JSON.stringify(v)}`);
  return v;
}

// The latest date the data load carries (a closing or a status change): the
// load was pulled on or after it.
export function latestLoadDate(features) {
  let latest = "";
  for (const f of features || []) {
    for (const k of ["sellingDate", "statusDate"]) {
      const d = String(f.properties?.[k] || "").slice(0, 10);
      if (/^\d{4}-\d{2}-\d{2}$/.test(d) && d > latest) latest = d;
    }
  }
  return latest;
}

// The last day of the last full calendar month in the load: the month the
// load's latest date falls in is still coming in, so it ends the month before.
export function lastFullMonth(features) {
  const latest = latestLoadDate(features);
  if (!latest) return "";
  const [y, m] = latest.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, 0)).toISOString().slice(0, 10);
}

export function statsThrough(geo) {
  if (process.env.STATS_THROUGH) return checkDate(process.env.STATS_THROUGH, "STATS_THROUGH");
  if (existsSync(PERIOD)) return checkDate(JSON.parse(readFileSync(PERIOD, "utf8")).periodEnd, "data/reporting-period.json periodEnd");
  console.warn("  ! no reporting period end in data/reporting-period.json: using the last full month of the load — ask the owner");
  return lastFullMonth(geo.features) || new Date().toISOString().slice(0, 10);
}

// "2026-09-30" as a timestamp that reads as Sep 30 in any US time zone.
export const throughStamp = iso => `${iso}T12:00:00-07:00`;
