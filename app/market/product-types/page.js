// Product types: what each kind of San Francisco property really sells for.
// The figures come from app/lib/product-types.json, which the market report's
// generator (reports/market/product.py) writes on every rebuild, so this page
// and the report's Product Types page always agree.

import Link from "next/link";
import SiteFooter from "../../components/SiteFooter";
import data from "../../lib/product-types.json";

// Halves round up (Math.round) here and in the report's product.py, so the two agree.
const r = (v, nd) => (Math.round(v * 10 ** nd) / 10 ** nd).toFixed(nd);
const m = v => (v == null ? "—" : v >= 999_500 ? `$${r(v / 1e6, 2)}M` : `$${Math.round(v / 1e3)}K`);
const sf = v => (v == null ? "—" : `$${Math.round(v).toLocaleString("en-US")}`);
const pct = v => (v == null ? "—" : `${Math.round(v)}%`);
const size = v => (v ? `${Math.round(v).toLocaleString("en-US")} sf` : "—");
const n = v => v.toLocaleString("en-US");
const mapHref = hood => `/fog?${new URLSearchParams({ hood, details: "all" })}`;
// A year-over-year change, signed and shaded; unit "%" or " pts" / " days".
const ch = (v, unit = "%") => {
  if (v == null) return "—";
  let t = unit === "%" ? `${v > 0 ? "+" : ""}${r(v, 1)}%` : `${v > 0 ? "+" : ""}${Math.round(v)}${unit}`;
  if (unit === " days" && Math.abs(Math.round(v)) === 1) t = t.slice(0, -1);
  return <span className={v > 0.05 ? "ptp-up" : v < -0.05 ? "ptp-dn" : ""}>{t}</span>;
};
const pc = (a, b) => (a != null && b ? (a / b - 1) * 100 : null);

export const metadata = {
  title: "San Francisco Home Prices by Property Type | Chuck Heaver",
  description:
    "Median sale price, size, price per square foot, sale-to-list and days on market for San Francisco single-family homes, duplexes, condos, TICs, co-ops and multi-unit buildings, this year against last year.",
};

export default function Page() {
  const G = data.groups;
  const thru = new Date(`${data.through}T12:00:00`).toLocaleDateString("en-US", { month: "long", day: "numeric" });
  const pthru = new Date(`${data.priorThrough}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const Y = data.year, PY = data.priorYear;
  const allQ = [...new Set([...data.quarters, ...data.priorQuarters])].sort();
  const qCell = s => (s && s.n ? <>{m(s.price)} <small>· {sf(s.ppsf)}/sf · {size(s.sqft)} · {n(s.n)}</small></> : "—");
  return (
    <div className="lp">
      <section className="lp-guide-head">
        <p className="lp-kicker">Market Report · {Y} vs {PY}, Jan 1 – {thru}</p>
        <h1 className="lp-guide-h1">What each kind of property sells for</h1>
        <p className="lp-guide-lede">
          Median sale price, size, price per square foot, sale-to-list and days on market for each kind of San Francisco property: {Y} year to
          date against the same stretch of {PY}, and each quarter against the same quarter a year earlier.
        </p>
      </section>

      <main className="ptp">
        <section className="lp-nsec">
          <h2>Year to date by product type: {Y} vs {PY}</h2>
          <p className="ptp-sub">Jan 1 – {thru} in both years.</p>
          <div className="ptp-scroll"><table className="ptp-t ptp-yoy">
            <thead><tr><th>Type</th><th>Year</th><th>Units sold</th><th>Median price</th><th>Median size</th><th>Median $/sf</th><th>% of list</th><th>Days on market</th></tr></thead>
            {G.map(g => { const p = g.prior, c = g.yoy; return (
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
          <h2>By quarter: median price · $/sf · size · units sold</h2>
          <p className="ptp-sub">Each quarter of {Y} against the same quarter of {PY}; {PY} is shown in full.</p>
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
          <h2>Inside “Other”: {Y} vs {PY}</h2>
          <p className="ptp-sub">Jan 1 – {thru} in both years.</p>
          <div className="ptp-scroll"><table className="ptp-t ptp-other">
            <thead><tr><th>Type</th><th>Sold {Y}</th><th>Sold {PY}</th><th>Median {Y}</th><th>Median {PY}</th><th>YoY</th><th>Median size {Y}</th><th>Median $/sf {Y}</th><th>Most sold in, {Y}</th></tr></thead>
            <tbody>{data.other.map(o => (
              <tr key={o.type}><th scope="row">{o.type}</th><td>{o.n}</td><td>{o.prior.n}</td><td>{m(o.price)}</td><td>{m(o.prior.price)}</td><td>{ch(o.yoy.price)}</td><td>{size(o.sqft)}</td><td>{sf(o.ppsf)}</td>
                <td>{o.topHood ? <><Link href={mapHref(o.topHood.hood)}>{o.topHood.hood}</Link> ({o.topHood.n})</> : "—"}</td></tr>
            ))}</tbody>
          </table></div>
        </section>

        <section className="lp-nsec">
          <h2>Where each type sells, {Y}</h2>
          <ul className="ptp-facts">{G.filter(g => g.topHood).map(g => (
            <li key={g.key}><b>{g.label}:</b> <Link href={mapHref(g.topHood.hood)}>{g.topHood.hood}</Link> sold the most, {g.topHood.n} ({Math.round(100 * g.topHood.share)}% of
              all), median {m(g.topHood.price)}. The top sale was {m(g.topSale.price)}, {g.topSale.addr}.</li>
          ))}</ul>
        </section>

        <section className="lp-nsec">
          <h2>Left out of $/sf: no square footage</h2>
          <p>{G.map(g => `${g.label} ${g.noSqft} of ${n(g.n)}`).join(" · ")} {Y} sales report no square footage. They count in every figure except $/sf.</p>
          {data.noSqftBig.length ? (
            <p>Big ones: {data.noSqftBig.map(r => `${r.addr} (${r.type}, ${m(r.price)}, ${r.hood})`).join("; ")}.</p>
          ) : null}
        </section>
      </main>

      <SiteFooter note={<>Closed sales from SFAR MLS (Residential and Residential Income). {Y}: Jan 1 – {thru}; {PY}: Jan 1 – {pthru} for year over
        year, the full year by quarter. Medians throughout; size and $/sf use only sales with reported square footage. YoY is the % change; % of list
        in points, days on market in days. Duplex / 2 Homes includes 2 Houses on Lot; Condo includes townhouses; TIC includes co-ownership. Deemed
        reliable, not guaranteed.</>} />
    </div>
  );
}
