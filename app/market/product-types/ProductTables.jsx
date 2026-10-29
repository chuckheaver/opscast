// The Product Types tables (app/lib/product-types.json, written by
// reports/market/product.py): shown on /market/product-types and in Market Stats.

import Link from "next/link";

// Halves round up (Math.round) here and in the report's product.py, so the two agree.
const r = (v, nd) => (Math.round(v * 10 ** nd) / 10 ** nd).toFixed(nd);
export const m = v => (v == null ? "—" : v >= 999_500 ? `$${r(v / 1e6, 2)}M` : `$${Math.round(v / 1e3)}K`);
const sf = v => (v == null ? "—" : `$${Math.round(v).toLocaleString("en-US")}`);
const pct = v => (v == null ? "—" : `${Math.round(v)}%`);
const size = v => (v ? `${Math.round(v).toLocaleString("en-US")} sf` : "—");
const n = v => v.toLocaleString("en-US");
const mapHref = hood => `/fog?${new URLSearchParams({ hood, details: "all" })}`;
// A year-over-year change, signed and shaded; unit "%" or " pts" / " days".
const ch = (v, unit = "%") => {
  if (v == null) return "—";
  let t = unit === "%" ? `${v > 0 ? "+" : ""}${r(v, 1)}%` : `${v > 0 ? "+" : ""}${Math.round(v)}${unit}`;
  if ((unit === " days" || unit === " pts") && Math.abs(Math.round(v)) === 1) t = t.slice(0, -1);
  return <span className={v > 0.05 ? "ptp-up" : v < -0.05 ? "ptp-dn" : ""}>{t}</span>;
};
const pc = (a, b) => (a != null && b ? (a / b - 1) * 100 : null);

export default function ProductTables({ data, headings = true }) {
  const G = data.groups;
  const thru = new Date(`${data.through}T12:00:00`).toLocaleDateString("en-US", { month: "long", day: "numeric" });
  const pthru = new Date(`${data.priorThrough}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const Y = data.year, PY = data.priorYear;
  // The year-to-date table breaks "Other" out: each of its types is a row of its own, after Co-op.
  const TR = [...G.filter(g => g.key !== "other"), ...data.other.map(o => ({ ...o, key: o.type, label: o.type }))];
  const allQ = [...new Set([...data.quarters, ...data.priorQuarters])].sort();
  const qCell = s => (s && s.n ? <>{m(s.price)} <small>· {sf(s.ppsf)}/sf · {size(s.sqft)} · {n(s.n)}</small></> : "—");
  return (
      <main className={headings ? "ptp" : "ptp ptp-embed"}>
        <section className="lp-nsec">
          <h2>Year to date: Jan 1 – {thru}, {Y} vs {PY}</h2>
          <div className="ptp-scroll"><table className="ptp-t ptp-yoy">
            <thead><tr><th>Type</th><th>Year</th><th>Units sold</th><th>Median price</th><th>Median size</th><th>Median $/sf</th><th>% of list</th><th>Days on market</th></tr></thead>
            {TR.map(g => { const p = g.prior, c = g.yoy; return (
              <tbody key={g.key}>
                <tr className="y1"><th scope="row" rowSpan={3}>{g.label}</th><td>{Y}</td><td>{n(g.n)}</td><td><b>{m(g.price)}</b></td><td>{size(g.sqft)}</td>
                  <td>{sf(g.ppsf)}{g.noSqft ? <small> ({g.noSqft} no sf)</small> : null}</td><td>{pct(g.pctList)}</td><td>{g.dom == null ? "—" : Math.round(g.dom)}</td></tr>
                <tr className="y0"><td>{PY}</td><td>{n(p.n)}</td><td>{m(p.price)}</td><td>{size(p.sqft)}</td>
                  <td>{sf(p.ppsf)}{p.noSqft ? <small> ({p.noSqft} no sf)</small> : null}</td><td>{pct(p.pctList)}</td><td>{p.dom == null ? "—" : Math.round(p.dom)}</td></tr>
                <tr className="yc"><td>YoY</td><td>{ch(c.n)}</td><td>{ch(c.price)}</td><td>{ch(c.sqft)}</td><td>{ch(c.ppsf)}</td><td>{ch(c.pctList, " pts")}</td><td>{ch(c.dom, " days")}</td></tr>
              </tbody>); })}
          </table></div>
        </section>

        <section className="lp-nsec">
          <h2>By quarter: median price · $/sf · size · units sold ({PY} full year)</h2>
          <div className="ptp-scroll"><table className="ptp-t ptp-yoy">
            <thead><tr><th>Type</th><th>Year</th>{allQ.map(q => <th key={q}>Q{q}</th>)}</tr></thead>
            {G.map(g => (
              <tbody key={g.key}>
                <tr className="y1"><th scope="row" rowSpan={3}>{g.label}</th><td>{Y}</td>{allQ.map(q => <td key={q}>{qCell(g.byQuarter[q])}</td>)}</tr>
                <tr className="y0"><td>{PY}</td>{allQ.map(q => <td key={q}>{qCell(g.priorByQuarter[q])}</td>)}</tr>
                <tr className="yc"><td>YoY</td>{allQ.map(q => { const a = g.byQuarter[q], b = g.priorByQuarter[q]; return (
                  <td key={q}>{a && b && a.n ? <>{ch(pc(a.price, b.price))} <small>· $/sf {ch(pc(a.ppsf, b.ppsf))} · units {ch(pc(a.n, b.n))}</small></> : "—"}</td>); })}</tr>
              </tbody>
            ))}
          </table></div>
        </section>

        <section className="lp-nsec">
          <h2>Most sales by neighborhood, {Y}</h2>
          <div className="ptp-scroll"><table className="ptp-t ptp-where">
            <thead><tr><th>Type</th><th>Neighborhood</th><th>Units sold</th><th>Share of type</th><th>Median price</th><th>Top sale</th><th>Top sale address</th></tr></thead>
            <tbody>{G.filter(g => g.topHood).map(g => (
              <tr key={g.key}><th scope="row">{g.label}</th><td><Link href={mapHref(g.topHood.hood)}>{g.topHood.hood}</Link></td><td>{n(g.topHood.n)}</td>
                <td>{Math.round(100 * g.topHood.share)}%</td><td>{m(g.topHood.price)}</td><td>{m(g.topSale.price)}</td><td>{g.topSale.addr}</td></tr>
            ))}</tbody>
          </table></div>
        </section>
      </main>
  );
}
