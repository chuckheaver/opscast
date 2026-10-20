// Product types: what each kind of San Francisco property really sells for.
// The figures come from app/lib/product-types.json, which the market report's
// generator (reports/market/product.py) writes on every rebuild, so this page
// and the report's Product Types page always agree.

import Link from "next/link";
import SiteFooter from "../../components/SiteFooter";
import data from "../../lib/product-types.json";

const m = v => (v == null ? "—" : v >= 995_000 ? `$${(v / 1e6).toFixed(2)}M` : `$${Math.round(v / 1e3)}K`);
const sf = v => (v == null ? "—" : `$${Math.round(v).toLocaleString("en-US")}`);
const pct = v => (v == null ? "—" : `${Math.round(v)}%`);
const mapHref = hood => `/fog?${new URLSearchParams({ hood, details: "all" })}`;

export const metadata = {
  title: "San Francisco Home Prices by Property Type | Chuck Heaver",
  description:
    "Median sale price, price per square foot, sale-to-list and days on market for San Francisco single-family homes, duplexes, condos, TICs, co-ops and multi-unit buildings, year to date.",
};

export default function Page() {
  const G = data.groups;
  const sfh = G.find(g => g.key === "sfh"), dx = G.find(g => g.key === "duplex");
  const thru = new Date(`${data.through}T12:00:00`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const gap = Math.round((dx.price / sfh.price - 1) * 100), sfgap = Math.round((dx.ppsf / sfh.ppsf - 1) * 100);
  return (
    <div className="lp">
      <section className="lp-guide-head">
        <p className="lp-kicker">Market Report · Jan 1 – {thru}</p>
        <h1 className="lp-guide-h1">What each kind of property sells for</h1>
        <p className="lp-guide-lede">
          Duplexes are not the cheaper buy. The median duplex sold for <b>{m(dx.price)}</b>, {gap >= 0 ? "+" : ""}{gap}% against
          the median house ({m(sfh.price)}), but at <b>{sf(dx.ppsf)}/sf</b>, {sfgap}% per square foot, because it is more building.
        </p>
      </section>

      <main className="ptp">
        <section className="lp-nsec">
          <h2>Year to date by product type</h2>
          <div className="ptp-scroll"><table className="ptp-t">
            <thead><tr><th>Type</th><th>Units sold</th><th>Median price</th><th>Median size</th><th>Median $/sf</th><th>% of list</th><th>Days on market</th></tr></thead>
            <tbody>{G.map(g => (
              <tr key={g.key}><th scope="row">{g.label}</th><td>{g.n.toLocaleString("en-US")}</td><td><b>{m(g.price)}</b></td>
                <td>{g.sqft ? `${Math.round(g.sqft).toLocaleString("en-US")} sf` : "—"}</td>
                <td>{sf(g.ppsf)}{g.noSqft ? <small> ({g.noSqft} no sf)</small> : null}</td><td>{pct(g.pctList)}</td><td>{g.dom == null ? "—" : Math.round(g.dom)}</td></tr>
            ))}</tbody>
          </table></div>
        </section>


        <section className="lp-nsec">
          <h2>By quarter</h2>
          <div className="ptp-scroll"><table className="ptp-t">
            <thead><tr><th>Type</th>{data.quarters.map(q => <th key={q}>Q{q} median · $/sf</th>)}</tr></thead>
            <tbody>{G.map(g => (
              <tr key={g.key}><th scope="row">{g.label}</th>{data.quarters.map(q => { const s = g.byQuarter[q]; return (
                <td key={q}>{m(s.price)} <small>· {sf(s.ppsf)}/sf · {s.n}</small></td>); })}</tr>
            ))}</tbody>
          </table></div>
        </section>

        <section className="lp-nsec">
          <h2>Inside “Other”</h2>
          <div className="ptp-scroll"><table className="ptp-t">
            <thead><tr><th>Type</th><th>Sold</th><th>Median price</th><th>Median $/sf</th><th>Most sold in</th></tr></thead>
            <tbody>{data.other.map(o => (
              <tr key={o.type}><th scope="row">{o.type}</th><td>{o.n}</td><td>{m(o.price)}</td><td>{sf(o.ppsf)}</td>
                <td>{o.topHood ? <Link href={mapHref(o.topHood.hood)}>{o.topHood.hood}</Link> : "—"}{o.topHood ? ` (${o.topHood.n})` : ""}</td></tr>
            ))}</tbody>
          </table></div>
        </section>

        <section className="lp-nsec">
          <h2>Where each type sells</h2>
          <ul className="ptp-facts">{G.filter(g => g.topHood).map(g => (
            <li key={g.key}><b>{g.label}:</b> <Link href={mapHref(g.topHood.hood)}>{g.topHood.hood}</Link> sold the most, {g.topHood.n} ({Math.round(100 * g.topHood.share)}% of
              all), median {m(g.topHood.price)}. The top sale was {m(g.topSale.price)}, {g.topSale.addr}.</li>
          ))}</ul>
        </section>

        <section className="lp-nsec">
          <h2>Left out of $/sf: no square footage</h2>
          <p>{G.map(g => `${g.label} ${g.noSqft} of ${g.n.toLocaleString("en-US")}`).join(" · ")} sales report no square footage. They count in every figure except $/sf.</p>
          {data.noSqftBig.length ? (
            <p>Big ones: {data.noSqftBig.map(r => `${r.addr} (${r.type}, ${m(r.price)}, ${r.hood})`).join("; ")}.</p>
          ) : null}
        </section>
      </main>

      <SiteFooter note={<>Closed sales from SFAR MLS (Residential and Residential Income), Jan 1 – {thru}. Medians throughout; size and $/sf use only sales with
        reported square footage. Duplex / 2 Homes includes 2 Houses on Lot; Condo includes townhouses; TIC includes co-ownership. 2025 Residential
        Income is not yet loaded, so there is no year-over-year comparison by type. Deemed reliable, not guaranteed.</>} />
    </div>
  );
}
