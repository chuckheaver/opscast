// Product types: what each kind of San Francisco property really sells for.
// The figures come from app/lib/product-types.json, which the market report's
// generator (reports/market/product.py) writes on every rebuild, so this page
// and the report's Product Types page always agree.

import SiteFooter from "../../components/SiteFooter";
import data from "../../lib/product-types.json";
import ProductTables, { m } from "./ProductTables";

export const metadata = {
  title: "San Francisco Home Prices by Property Type | Chuck Heaver",
  description:
    "Median sale price, size, price per square foot, sale-to-list and days on market for San Francisco single-family homes, duplexes, condos, TICs, co-ops and multi-unit buildings, this year against last year.",
};

export default function Page() {
  const thru = new Date(`${data.through}T12:00:00`).toLocaleDateString("en-US", { month: "long", day: "numeric" });
  const pthru = new Date(`${data.priorThrough}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const Y = data.year, PY = data.priorYear;
  return (
    <div className="lp">
      <section className="lp-guide-head">
        <p className="lp-kicker">Market Report · {Y} vs {PY}, Jan 1 – {thru}</p>
        <h1 className="lp-guide-h1">By Product Type</h1>
      </section>

      <ProductTables data={data} />


      <SiteFooter note={<>Closed sales from SFAR MLS (Residential and Residential Income). {Y}: Jan 1 – {thru}; {PY}: Jan 1 – {pthru} for year over
        year, the full year by quarter. Medians throughout; size and $/sf use only sales with reported square footage. YoY is the % change; % of list
        in points, days on market in days. Sales with no reported square footage count in every figure except $/sf; the count is shown beside each
        $/sf{data.noSqftBig.length ? <>; $3M+ duplex and Residential Income sales without it: {data.noSqftBig.map(r => `${r.addr} (${r.type}, ${m(r.price)})`).join("; ")}</> : null}.
        SFH includes Halfplex and 2 Houses on Lot; Condo includes townhouses; TIC includes co-ownership. Deemed reliable, not guaranteed.</>} />
    </div>
  );
}
