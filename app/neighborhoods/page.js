// The public neighborhood guide index. One card per authored neighborhood,
// each carrying its live median price and its microclimate zone.

import Link from "next/link";
import { allHoods, money, ZONE_COLOR, windowLabel } from "./lib";

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
          microclimate it sits in. Prices are closed sales over the last twelve
          months{windowLabel ? ` (${windowLabel})` : ""}.
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
              {/* Three sales is the floor for quoting a median — see the detail page. */}
              {h.stats?.sfhMedian && h.stats.sfhN >= 3 ? <span><b>{money(h.stats.sfhMedian)}</b> house</span> : null}
              {h.stats?.condoMedian && h.stats.condoN >= 3 ? <span><b>{money(h.stats.condoMedian)}</b> condo</span> : null}
              {Number.isFinite(h.stats?.fogHours) ? <span><b>{h.stats.fogHours.toFixed(1)}h</b> fog</span> : null}
            </div>
          </Link>
        ))}
      </section>

      <footer className="lp-foot">
        <p className="lp-fine lp-foot-fine">
          Prices are closed sales from SFAR MLS over the trailing twelve months
          {windowLabel ? `(${windowLabel})` : ""}, matched to the neighborhood each home
          physically sits in. A median is not shown where fewer than three homes of that
          type sold. Fog hours are the median daily summer figure from USGS-derived
          contours. Deemed reliable, not guaranteed.
        </p>
      </footer>
    </div>
  );
}
