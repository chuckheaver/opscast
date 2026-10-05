// The market briefing, on the web. The same generator that prints the PDF
// (reports/market) writes the pages into ./generated; this route lays them
// out under the site's three Market menu sections, with every area name and
// top sale linked into the live map. Rebuild with: bash reports/market/build.sh

import { readFileSync } from "node:fs";
import path from "node:path";
import Link from "next/link";
import SiteFooter from "../../components/SiteFooter";

const G = path.join(process.cwd(), "app/market/report/generated");
const read = f => readFileSync(path.join(G, f), "utf8");

// "sf" is the Market Stats section — the home page's "Market Stats" pill and
// the menu's SF Market item both land on it. SF Neighborhoods jumps to the
// Neighborhoods page inside it (#neighborhoods, set by web.py).
const SECTIONS = [
  { id: "sf", file: "stats.html", h: "Market Stats", p: "San Francisco real estate, where the money went, the grids by neighborhood and fog zone, the neighborhoods, the year in numbers, and what is waiting to sell." },
  { id: "cost", file: "cost.html", h: "The Cost of Ownership", p: "What money costs a financed buyer and a cash buyer right now: rates, bonds and the opportunity cost of owning." },
];

export const metadata = {
  title: "San Francisco Market Briefing | Chuck Heaver",
  description:
    "San Francisco real estate market report: year-to-date closed sales, prices, days on market, cash vs financed buyers, neighborhood grids by fog zone, and the cost of financing — with every neighborhood linked to its sold homes on the map.",
};

export default function Page() {
  const meta = JSON.parse(read("meta.json"));
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: read("sheets.css") }} />
      <div className="lp">
        <section className="lp-guide-head">
          <p className="lp-kicker">Market Report · {meta.period}</p>
          <h1 className="lp-guide-h1">San Francisco Market Briefing</h1>
          <p className="lp-guide-lede">
            Closed sales from SFAR MLS, mapped to the neighborhood and the microclimate each home sits in.
            Click any neighborhood or top sale to see those sold homes on the map, street by street.
          </p>
          <div className="rp-actions">
            <a className="lp-btn lp-btn-gold" href="/reports/sf-market-briefing.pdf" download>Download the PDF</a>
            <Link className="lp-btn lp-btn-ghost" href="/fog?preset=homes">Sold homes on the map</Link>
          </div>
        </section>
        <div className="pt-toc">
          <nav>{SECTIONS.map(s => <a key={s.id} href={`#${s.id}`}>{s.h}</a>)}</nav>
        </div>
      </div>

      <main className="rp">
        {SECTIONS.map(s => (
          <section key={s.id} id={s.id} className="rp-sec">
            <div className="rp-sec-head">
              <h2>{s.h}</h2>
              <p>{s.p}</p>
            </div>
            <p className="rp-hint">Scroll each page sideways on a phone — or download the PDF.</p>
            <div className="rp-sheets" dangerouslySetInnerHTML={{ __html: read(s.file) }} />
          </section>
        ))}
        <p className="rp-foot">
          Report run {meta.run}. Source: SFAR MLS closed sales. Deemed reliable, not guaranteed.
          Rate figures from Freddie Mac and the U.S. Treasury as cited on the page.
        </p>
      </main>

      <div className="lp"><SiteFooter /></div>
    </>
  );
}
