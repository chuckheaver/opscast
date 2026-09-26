// The public neighborhood guide index. One card per authored neighborhood,
// each carrying its live median price and its microclimate zone.

import Link from "next/link";
import SiteFooter from "../components/SiteFooter";
import { allHoods, money, ZONE_COLOR, windowLabel, statsYear } from "./lib";

export const metadata = {
  title: "San Francisco Neighborhood Guide — Chuck Heaver",
  description:
    "Every San Francisco neighborhood: what it is like to live there, what homes cost, and the microclimate it sits in — sun, fog and everything between.",
};

export default function Page() {
  const hoods = allHoods();

  return (
    <div className="lp">
      <header className="lp-nav lp-nav-solid">
        <Link href="/" className="lp-logo">
          <span className="lp-logo-name">Chuck Heaver</span>
          <span className="lp-logo-sub">San Francisco Realtor · Meteorologist</span>
        </Link>
        <nav className="lp-nav-links">
          <Link href="/fog?preset=fog">The Map</Link>
          <Link href="/market">Market</Link>
          <Link href="/tools">All Tools</Link>
          <a className="lp-nav-cta" href="mailto:chuck.heaver@vanguardproperties.com">Work With Me</a>
        </nav>
      </header>

      <section className="lp-guide-head">
        <p className="lp-kicker">San Francisco Neighborhood Guide</p>
        <h1 className="lp-guide-h1">All {hoods.length} of them, and the microclimate each one gets.</h1>
        <p className="lp-guide-lede">
          What it is like to live there, what homes are selling for, and the
          microclimate it sits in. Prices are {statsYear} closed sales
          {windowLabel ? ` — ${windowLabel}` : ""}; the figure in brackets is how many sold.
        </p>
      </section>

      <section className="lp-guide-grid">
        {hoods.map(h => (
          <Link key={h.slug} href={`/neighborhoods/${h.slug}`} className="lp-hood">
            <div className="lp-hood-top">
              <h2>{h.name}</h2>
              {h.stats?.zone && (
                <span className="lp-zone" style={{ "--z": ZONE_COLOR[h.stats.zone] }}>
                  {h.stats.zone}
                </span>
              )}
            </div>
            <p className="lp-hood-spirit">{h.content.spirit}</p>
            <div className="lp-hood-nums">
              {/* Every median is shown, with its sale count beside it. */}
              {h.stats?.sfhMedian ? <span><b>{money(h.stats.sfhMedian)}</b> house <i>({h.stats.sfhN})</i></span> : null}
              {h.stats?.condoMedian ? <span><b>{money(h.stats.condoMedian)}</b> condo <i>({h.stats.condoN})</i></span> : null}
              {Number.isFinite(h.stats?.fogHours) ? <span><b>{h.stats.fogHours.toFixed(1)}h</b> fog</span> : null}
            </div>
          </Link>
        ))}
      </section>

      <SiteFooter note={
        <>
          Prices are {statsYear} closed sales from SFAR MLS{windowLabel ? ` (${windowLabel})` : ""},
          matched to the neighborhood each home physically sits in. Every sale is included;
          where a neighborhood had few of a type, the count in brackets says so. Fog hours
          are the median daily summer figure from USGS-derived contours. Deemed reliable,
          not guaranteed.
        </>
      } />
    </div>
  );
}
