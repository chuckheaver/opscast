// The date every published market stat runs through: the last day of the
// last FULL month in the sales file. A dump pulled on Oct 1 carries a stray
// Oct 1 closing or two; the stats stop at Sep 30 so the site, the map counts
// and the monthly briefing all describe the same complete period.
//
// Override with STATS_THROUGH=YYYY-MM-DD when a dump needs a different cut.
export function statsThrough(geo) {
  if (process.env.STATS_THROUGH) return process.env.STATS_THROUGH;
  let latest = "";
  for (const f of geo.features || []) {
    const d = String(f.properties?.sellingDate || "").slice(0, 10);
    if (d > latest) latest = d;
  }
  if (!latest) return new Date().toISOString().slice(0, 10);
  const [y, m, d] = latest.split("-").map(Number);
  const monthEnd = new Date(Date.UTC(y, m, 0)).getUTCDate();
  if (d === monthEnd) return latest;
  return new Date(Date.UTC(y, m - 1, 0)).toISOString().slice(0, 10); // end of prior month
}

// "2026-09-30" as a timestamp that reads as Sep 30 in any US time zone.
export const throughStamp = iso => `${iso}T12:00:00-07:00`;
