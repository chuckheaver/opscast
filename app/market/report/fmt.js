// Number formats for Market Stats, matching the report's (reports/market).

export const money = v => (v == null ? "—" : v >= 995_000 ? `$${(v / 1e6).toFixed(2)}M` : `$${Math.round(v / 1e3)}K`);
export const bn = v => (v == null ? "—" : v >= 1e9 ? `$${(v / 1e9).toFixed(2)}B` : `$${Math.round(v / 1e6).toLocaleString("en-US")}M`);
export const usd = v => (v == null ? "—" : `$${Math.round(v).toLocaleString("en-US")}`);
export const int = v => (v == null ? "—" : Math.round(v).toLocaleString("en-US"));
export const sfmt = v => (v == null ? "—" : Math.round(v).toLocaleString("en-US"));
export const sgnPct = (a, b) => (a == null || !b ? null : (100 * (a - b)) / b);
export const pctTxt = v => (v == null ? "—" : `${v >= 0 ? "+" : ""}${Math.round(v)}%`);
export const dshort = iso => { const [y, m, d] = iso.split("-"); return `${+m}/${+d}/${y.slice(2)}`; };
export const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const median = a => {
  const v = a.filter(x => x != null).sort((x, y) => x - y);
  if (!v.length) return null;
  const m = v.length >> 1;
  return v.length % 2 ? v[m] : (v[m - 1] + v[m]) / 2;
};
// The report's three categories and colours (navy, gold, grey).
export const SEGS = [
  { k: "sfh", label: "SFH", color: "#203C5F", light: "#AFC0D0" },
  { k: "co", label: "Condo/TIC/Co-op", color: "#E9BC3F", light: "#F6E3A6" },
  { k: "ot", label: "Other", color: "#6B6F75", light: "#C9CCD0" },
];
