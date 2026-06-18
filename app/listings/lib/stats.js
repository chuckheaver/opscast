// Pure analytics helpers for the listings explorer. No React, no Mapbox —
// just takes GeoJSON-style property objects and returns numbers, so it can
// be unit-tested and reused by both the stats panel and any export.

// ── Fog hours ─────────────────────────────────────────────────────────────
// The USGS contour polygons carry discrete fog-hour values in 0.5-hr steps
// (2.5 → 14). We use each distinct value as its own microclimate zone, so the
// "fog vs. price" analysis lines up exactly with the polygon the property
// sits in. Higher hours = more coastal = foggier.

// Colour for a given fog-hour value: gold (sunniest) → slate → near-black
// (foggiest). Drives both the breakdown bars and the map gradient legend.
export function fogColor(hours) {
  if (hours == null) return "#d6d3d1";
  const stops = [
    [7, "#fcd34d"],
    [8.5, "#fde68a"],
    [9.5, "#cbd5e1"],
    [10.5, "#6b7280"],
    [12, "#1f2937"],
  ];
  if (hours <= stops[0][0]) return stops[0][1];
  if (hours >= stops[stops.length - 1][0]) return stops[stops.length - 1][1];
  for (let i = 0; i < stops.length - 1; i++) {
    const [h0, c0] = stops[i];
    const [h1, c1] = stops[i + 1];
    if (hours >= h0 && hours <= h1) return lerpColor(c0, c1, (hours - h0) / (h1 - h0));
  }
  return stops[stops.length - 1][1];
}

function lerpColor(a, b, t) {
  const pa = [parseInt(a.slice(1, 3), 16), parseInt(a.slice(3, 5), 16), parseInt(a.slice(5, 7), 16)];
  const pb = [parseInt(b.slice(1, 3), 16), parseInt(b.slice(3, 5), 16), parseInt(b.slice(5, 7), 16)];
  const ch = pa.map((v, i) => Math.round(v + (pb[i] - v) * t));
  return "#" + ch.map(v => v.toString(16).padStart(2, "0")).join("");
}

// Three named exposure zones over the continuous fog-hours value:
//   Sun   ≤ 8 hrs/day · Trans 8.1–8.9 · Fog ≥ 9
export function fogZoneName(h) {
  if (h == null) return null;
  if (h <= 8) return "Sun";
  if (h < 9) return "Trans";
  return "Fog";
}
// e.g. 6.5 → "Sun Zone (6.5hrs)", 8.5 → "Trans Zone (8.5hrs)", 9 → "Fog Zone (9.0hrs)"
export function fogZoneLabel(h) {
  if (h == null) return "—";
  return `${fogZoneName(h)} Zone (${Number(h).toFixed(1)}hrs)`;
}

// ── Math helpers ─────────────────────────────────────────────────────────────
export function median(nums) {
  const a = nums.filter(n => Number.isFinite(n)).sort((x, y) => x - y);
  if (!a.length) return null;
  const mid = Math.floor(a.length / 2);
  return a.length % 2 ? a[mid] : (a[mid - 1] + a[mid]) / 2;
}

export function mean(nums) {
  const a = nums.filter(n => Number.isFinite(n));
  return a.length ? a.reduce((s, n) => s + n, 0) / a.length : null;
}

// Days between two ISO (YYYY-MM-DD) dates, or null if either is missing.
export function daysBetween(startISO, endISO) {
  if (!startISO || !endISO) return null;
  const a = Date.parse(startISO);
  const b = Date.parse(endISO);
  if (!Number.isFinite(a) || !Number.isFinite(b)) return null;
  return Math.round((b - a) / 86400000);
}

// A listing counts as "sold" for price stats if it has a real selling price.
const isSold = p => Number.isFinite(p.sellingPrice) && p.sellingPrice > 0;

// ── Aggregate stats over a set of listing property objects ───────────────────
export function computeStats(props) {
  const sold = props.filter(isSold);
  const dom = sold.map(p => daysBetween(p.listDate, p.sellingDate)).filter(Number.isFinite);
  const ratios = sold
    .filter(p => Number.isFinite(p.listPrice) && p.listPrice > 0)
    .map(p => (p.sellingPrice / p.listPrice) * 100);
  const overList = sold.filter(
    p => Number.isFinite(p.listPrice) && p.sellingPrice > p.listPrice
  );

  // Square footage stats. Null-safe: returns null until the MLS export
  // includes a sqft column, so the UI shows "—" placeholders meanwhile.
  // $/sqft is the median of each sold home's own (sale price ÷ sqft), which
  // is more robust to mix than dividing the two aggregate medians.
  const withSqft = props.filter(p => Number.isFinite(p.sqft) && p.sqft > 0);
  const ppsf = sold
    .filter(p => Number.isFinite(p.sqft) && p.sqft > 0)
    .map(p => p.sellingPrice / p.sqft);

  // %Ask = median sale price ÷ median list price, over the sold listings that
  // have both (so the numerator and denominator describe the same set).
  const medSale = median(sold.map(p => p.sellingPrice));
  const medListSold = median(
    sold.filter(p => Number.isFinite(p.listPrice) && p.listPrice > 0).map(p => p.listPrice)
  );
  const pctAsk = medSale != null && medListSold ? (medSale / medListSold) * 100 : null;
  const medDom = median(dom);

  return {
    count: props.length,
    soldCount: sold.length,
    medianSale: medSale,
    avgSale: mean(sold.map(p => p.sellingPrice)),
    medianList: median(props.map(p => p.listPrice)),
    medianListSold: medListSold,
    medianDom: medDom == null ? null : Math.round(medDom),
    avgDom: (() => { const a = mean(dom); return a == null ? null : Math.round(a); })(),
    pctAsk,
    pctOverList: sold.length ? (overList.length / sold.length) * 100 : null,
    avgPctOfList: mean(ratios),
    medianPctOfList: median(ratios),
    medianFogHours: median(props.map(p => p.fogHours)),
    avgSqft: mean(withSqft.map(p => p.sqft)),
    medianSqft: median(withSqft.map(p => p.sqft)),
    medianPpsf: median(ppsf),
    avgPpsf: mean(ppsf),
  };
}

// Group props by an arbitrary key function and compute stats per group.
// Returns [{ key, label, stats }]. By default sorted by descending median
// sale price; pass a `sortFn` (receives the {key,label,stats} rows) to order
// differently — e.g. ascending by fog hours so the chart reads as a gradient.
export function groupStats(props, keyFn, labelFn = k => k, sortFn) {
  const groups = new Map();
  for (const p of props) {
    const k = keyFn(p);
    if (k == null || k === "") continue;
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(p);
  }
  const rows = [...groups.entries()].map(([key, items]) => ({
    key,
    label: labelFn(key),
    stats: computeStats(items),
    items, // the property objects in this group, for drill-in views
  }));
  rows.sort(sortFn || ((a, b) => (b.stats.medianSale ?? 0) - (a.stats.medianSale ?? 0)));
  return rows;
}

// Microclimate buckets over the continuous fog-hours value:
//   Sun ≤ 8 hr · Transition 8–9 hr · Fog 9+ hr
const MICRO_LABEL = { Sun: "Sun (≤8 hr)", Trans: "Transition (8–9 hr)", Fog: "Fog (9+ hr)" };
const MICRO_RANK = { Sun: 0, Trans: 1, Fog: 2 };

// Named grouping dimensions the UI exposes, in display order:
// Microclimate · City (Supervisor) District · RE (SFAR) District · Neighborhood.
export const GROUP_BY = {
  microclimate: {
    label: "Microclimate",
    keyFn: p => fogZoneName(p.fogHours),
    labelFn: k => MICRO_LABEL[k] || k,
    // Sun → Transition → Fog (sunniest to foggiest).
    sortFn: (a, b) => (MICRO_RANK[a.key] ?? 9) - (MICRO_RANK[b.key] ?? 9),
  },
  cityDistrict: {
    label: "City District",
    // Supervisor (political) district, tagged at runtime from the
    // sf-supervisor-districts polygons via point-in-polygon.
    keyFn: p => p.cityDistrict,
    sortFn: (a, b) => districtNo(a.key) - districtNo(b.key),
  },
  reDistrict: {
    label: "RE District",
    // SFAR realtor district, e.g. "District 9 - Central East".
    keyFn: p => p.district,
    sortFn: (a, b) => districtNo(a.key) - districtNo(b.key),
  },
  neighborhood: {
    label: "Neighborhood",
    keyFn: p => p.neighborhood,
  },
};

// Pull the leading number out of a "District N ..." / "SF District N" string.
function districtNo(s) {
  const m = /(\d+)/.exec(s || "");
  return m ? Number(m[1]) : 999;
}
