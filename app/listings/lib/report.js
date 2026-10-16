// Builds the data for the "San Francisco Market Update" PDF from the listings
// features + the current Homes filter. Splits into Single-Family and Condo/TIC
// segments (per the type chips), over the filter's date range + price, and
// computes the same metrics as the printed report plus year-over-year vs the
// same period a year earlier. Status chips are intentionally ignored here: the
// site is sold-comps-only, so the report reads sold rows regardless of which
// sold pill is selected.

import { computeStats } from "./stats";

const SOLD = new Set(["Closed", "Sold Off MLS"]);
const SFH_TYPES = ["Single Family Residence"];
const CONDO_TYPES = ["Condominium", "Tenancy in Common", "Stock Cooperative", "Co-Ownership", "Loft Condominium", "Loft"];

const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const shiftYear = (d, n) => { if (!d) return d; const [y, m, day] = d.split("-"); return `${Number(y) + n}-${m}-${day}`; };
const fmtMonthYear = d => { if (!d) return ""; const [y, m] = d.split("-").map(Number); return `${MON[m - 1]} ${y}`; };

function periodLabel(from, to) {
  if (!from && !to) return "All dates";
  const a = fmtMonthYear(from), b = fmtMonthYear(to);
  return a === b ? a : `${a} – ${b}`;
}

function deltaPct(cur, prior) {
  if (cur == null || prior == null || prior === 0) return null;
  return (cur / prior - 1) * 100;
}

function segment(name, typesCovered, segTypes, props, from, to, lo, hi, prior) {
  const pool = props.filter(p =>
    segTypes.includes(p.propType) &&
    (lo == null || (p.price != null && p.price >= lo)) &&
    (hi == null || (p.price != null && p.price <= hi))
  );
  const inPeriod = (p, f, t) => p.sellingDate && (!f || p.sellingDate >= f) && (!t || p.sellingDate <= t);
  const sold = pool.filter(p => SOLD.has(p.status) && inPeriod(p, from, to));
  // The same stretch a year earlier — only when the data covers all of it.
  const priorSold = prior ? pool.filter(p => SOLD.has(p.status) && inPeriod(p, prior[0], prior[1])) : null;

  const s = computeStats(sold);
  const ps = priorSold ? computeStats(priorSold) : {};

  const compare = [
    { label: "Median Sales Price", cur: s.medianSale, prior: ps.medianSale, fmt: "usd" },
    { label: "Days On Market", cur: s.medianDom, prior: ps.medianDom, fmt: "int" },
    { label: "$ / Sq. Ft.", cur: s.medianPpsf, prior: ps.medianPpsf, fmt: "usd" },
    { label: "Properties Sold", cur: sold.length, prior: priorSold ? priorSold.length : null, fmt: "int" },
    { label: "% Sold Over List", cur: s.pctOverList, prior: ps.pctOverList, fmt: "pct" },
    { label: "% of List Received (avg)", cur: s.avgPctOfList, prior: ps.avgPctOfList, fmt: "pct" },
  ].map(r => ({ ...r, prior: r.prior ?? null, pct: deltaPct(r.cur, r.prior ?? null) }));

  const nbMap = new Map();
  for (const p of sold) {
    const n = p.neighborhood;
    if (!n) continue;
    (nbMap.get(n) || nbMap.set(n, []).get(n)).push(p);
  }
  const neighborhoods = [...nbMap.entries()]
    .map(([n, ps2]) => { const st = computeStats(ps2); return { name: n, median: st.medianSale, ppsf: st.medianPpsf, pctList: st.avgPctOfList, sold: ps2.length, small: ps2.length < 50 }; })
    .sort((a, b) => (b.median ?? 0) - (a.median ?? 0))
    .slice(0, 28);

  return {
    name, typesCovered,
    summary: { median: s.medianSale, dom: s.medianDom, ppsf: s.medianPpsf, sold: sold.length },
    compare,
    neighborhoods,
    yoy: {
      medianPrice: s.medianSale, medianPricePct: deltaPct(s.medianSale, ps.medianSale),
      sales: sold.length, salesPct: priorSold ? deltaPct(sold.length, priorSold.length) : null,
      dom: s.medianDom, domDelta: s.medianDom != null && ps.medianDom != null ? s.medianDom - ps.medianDom : null,
    },
  };
}

// `through` is the period end (metadata.statsThrough). A comparison uses the
// same stretch a year earlier, so it is made only when the data covers all of
// that stretch (the sales file begins on its first sale); otherwise the
// prior column reads "not in data" rather than a figure for a shorter span.
export function buildReportData(features, filter, through) {
  const props = (features || []).map(f => f.properties);
  const dates = props.map(p => String(p.sellingDate || "").slice(0, 10)).filter(Boolean).sort();
  const first = dates[0] || "", last = through || dates[dates.length - 1] || "";
  // An emptied month field means the default stretch — Jan 1 of the stats
  // year through the period end — never an open-ended window.
  let to = filter.closedTo || last;
  if (last && to > last) to = last;
  let from = filter.closedFrom || (last ? `${last.slice(0, 4)}-01-01` : "");
  if (to && from > to) from = `${to.slice(0, 7)}-01`;
  const pFrom = shiftYear(from, -1), pTo = shiftYear(to, -1);
  const prior = first && pFrom && pFrom >= first ? [pFrom, pTo] : null;
  const lo = filter.minPrice ? Number(filter.minPrice) : null;
  const hi = filter.maxPrice ? Number(filter.maxPrice) : null;
  const sub = filter.subtypes;

  const wantSFH = !sub.size || sub.has("Single Family Residence");
  const wantCondo = !sub.size || CONDO_TYPES.some(t => sub.has(t));

  const segments = [];
  if (wantSFH) segments.push(segment("Single-Family Homes", "Single-family", SFH_TYPES, props, from, to, lo, hi, prior));
  if (wantCondo) {
    const t = sub.size ? CONDO_TYPES.filter(x => sub.has(x)) : CONDO_TYPES;
    segments.push(segment("Condos / TIC / Co-ops", "Condominium, TIC, Stock Co-op", t, props, from, to, lo, hi, prior));
  }
  if (!segments.length) {
    const t = sub.size ? [...sub] : [];
    segments.push(segment("Selected Homes", "Selected property types", t, props, from, to, lo, hi, prior));
  }

  const filtersLine = [
    lo != null || hi != null ? `Price ${lo != null ? "$" + lo.toLocaleString("en-US") : "$0"}–${hi != null ? "$" + hi.toLocaleString("en-US") : "∞"}` : null,
  ].filter(Boolean).join(" · ");

  return {
    title: "San Francisco Market Update",
    periodLabel: periodLabel(from, to),
    priorLabel: prior ? periodLabel(pFrom, pTo) : "Prior year (not in data)",
    filtersLine,
    generated: null, // stamped by the caller
    segments,
  };
}
