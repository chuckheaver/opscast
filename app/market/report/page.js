// Market Stats: the market report's pages on the web, interactive. Same
// content as the PDF — reports/market/webdata.py writes the figures from the
// report's own code into ./web-stats.json (and the sales behind them into
// public/data/report-sales.json) on every rebuild: bash reports/market/build.sh.
// Every neighborhood, fog zone, tier, month and sale opens the sales behind it.

import Link from "next/link";
import SiteFooter from "../../components/SiteFooter";
import data from "./web-stats.json";
import products from "../../lib/product-types.json";
import micro from "../../lib/microclimate-market.json";
import { allHoods } from "../../neighborhoods/lib";
import MicroRealEstate from "../../microclimates/real-estate/MicroRealEstate";
import ProductTables from "../product-types/ProductTables";
import { Overview, AllocationSection, TensSection, NumbersSection, GridsSection, CostSection } from "./ReportApp";

export const metadata = {
  title: "San Francisco Market Stats | Chuck Heaver",
  description:
    "San Francisco real estate market stats, interactive: year-to-date closed sales, prices and volume by month, where the money went, the top 10s, every neighborhood's grid by category and fog zone, product types and the cost of ownership — with every figure opening the sales behind it.",
};

// "sf" is the menu's SF Market item and the home page's Market Stats pill;
// "neighborhoods" is SF Neighborhoods; "cost" the Cost of Ownership.
const SECTIONS = [
  ["sf", "Market Stats"],
  ["money", "Allocation of Money"],
  ["tens", `The 10s`],
  ["numbers", "By the Numbers"],
  ["neighborhoods", "Market Grids"],
  ["zones", "Microclimates"],
  ["types", "Product Types"],
  ["cost", "Cost of Ownership"],
];

const dateLong = iso => new Date(`${iso}T12:00:00`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
const dateShort = iso => new Date(`${iso}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" });

export default function Page() {
  const P = data.period, K = data.kpis;
  const guides = Object.fromEntries(allHoods().map(h => [h.name, h.slug]));
  const thru = dateLong(P.y1[1]);
  return (
    <div className="lp">
      <section className="lp-guide-head">
        <p className="lp-kicker">Market Report · Jan 1 – {thru}</p>
        <h1 className="lp-guide-h1">San Francisco Market Stats</h1>
        <div className="rp-actions">
          <a className="lp-btn lp-btn-gold" href="/reports/sf-market-briefing.pdf" download>Download the PDF</a>
          <Link className="lp-btn lp-btn-ghost" href="/fog?preset=homes">Sold homes on the map</Link>
        </div>
      </section>

      <div className="pt-toc mr-toc">
        <nav>{SECTIONS.map(([id, h]) => <a key={id} href={`#${id}`}>{h}</a>)}</nav>
      </div>

      <main className="mr">
        <section id="sf" className="mr-sec">
          <h2>San Francisco Real Estate</h2>
          <p className="mr-period">YTD through {thru} vs {P.prior}</p>
          <div className="lp-stats mr-band">
            <div className="lp-stats-top"><p className="lp-stats-head">By the Numbers: &rsquo;{K.yy} vs <span className="lp-stats-key">&rsquo;{K.py}</span> YTD ({K.through})</p></div>
            <div className="lp-sbox-row">
              {K.boxes.map(bx => (
                <div className={`lp-sbox lp-sbox-${bx.key}`} key={bx.key}>
                  <div className="lp-sbox-h">{bx.title}</div>
                  {bx.rows.map(r => (
                    <div className={`lp-sbox-r${r.big ? " lp-sbox-big" : ""}`} key={r.label}>
                      <div className="lp-sbox-l">{r.label}{r.chg ? <>: <b>{r.chg}</b></> : null}</div>
                      <div className="lp-sbox-v">{r.now}<span className="lp-stat-prior">{r.then}</span></div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <Overview data={data} />
        </section>

        <section id="money" className="mr-sec">
          <h2>Allocation of Money</h2>
          <p className="mr-period">{data.alloc.n.toLocaleString("en-US")} sales · Jan 1 – {thru}</p>
          <AllocationSection data={data} />
        </section>

        <section id="tens" className="mr-sec">
          <h2>The 10s of {P.year}</h2>
          <p className="mr-period">Year to date: Jan 1 – {thru}</p>
          <TensSection data={data} />
        </section>

        <section id="numbers" className="mr-sec">
          <h2>By the Numbers</h2>
          <p className="mr-period">Jan 1 – {thru}</p>
          <NumbersSection data={data} />
        </section>

        <section id="neighborhoods" className="mr-sec">
          <h2>Market Grids</h2>
          <p className="mr-period">{data.plabel}</p>
          <GridsSection data={data} />
        </section>

        <section id="zones" className="mr-sec mr-wide">
          <h2>Microclimates and Real Estate</h2>
          <p className="mr-period">Jan 1 – {dateLong(micro.through)}</p>
          <div className="mre"><MicroRealEstate data={micro} guides={guides} /></div>
        </section>

        <section id="types" className="mr-sec">
          <h2>Product Types</h2>
          <p className="mr-period">{products.year} vs {products.priorYear}, Jan 1 – {dateShort(products.through)}</p>
          <ProductTables data={products} headings={false} />
        </section>

        <section id="cost" className="mr-sec">
          <h2>The Cost of Ownership</h2>
          <p className="mr-period">Rates as of {data.cost.asOf} (mortgage: Freddie Mac survey, {data.cost.survey})</p>
          <CostSection data={data} />
        </section>

        <section className="mr-notes">
          <h3>Notes</h3>
          <ul>
            <li>Closed sales (Closed and Sold Off MLS) from SFAR MLS, Residential and Residential Income, Jan 1 – {thru}; comparisons with {P.prior} use the same stretch of {P.prior}{P.partial ? `, and the month is ${dateShort(P.m1[0])} – ${dateShort(P.m1[1])} against the same days of ${P.prior}` : ""}. Where {P.prior} is shown as a year it is the full year.</li>
            <li>Categories: SFH = Single Family Residence, Halfplex and 2 Houses on Lot; Condo/TIC/Co-op; Duplex; Other (Tri+) = triplexes, fourplexes, 5+ units and the other types.</li>
            <li>Every sale counts, BMR units included; sales under $100K (parking, rentals, entry errors) and duplicate entries are left out. Median $/sf, Top $/sf and the Lowest 10 leave out sales with no square footage. * fewer than 10 sales.</li>
            <li>Sale vs list: monthly medians; the figure under each month is the change in the median sale from the same month last year. Days on market as reported; list-to-sale ratios use the final list price.</li>
            <li>Fog zones: daily summer fog hours from GOES satellite imagery; each sale counts in the zone at its address. Neighborhoods are where each home sits.</li>
            <li>Cost of ownership: payments on the {`$${(data.cost.medSfh / 1e6).toFixed(2)}M`} SFH and {`$${(data.cost.medCo / 1e6).toFixed(2)}M`} Condo/TIC/Co-op medians with 20% down, principal and interest only. Foregone yield uses the 10-year Treasury; property tax at {(100 * data.cost.propTax).toFixed(2)}%. Treasury yields: daily closes; mortgage rate: Freddie Mac Primary Mortgage Market Survey.</li>
            <li>Report run {dateLong(data.run)}. Deemed reliable, not guaranteed.</li>
          </ul>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
