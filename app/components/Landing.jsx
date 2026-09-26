// The site's front door. The pitch is street-level microclimate — sun, wind,
// fog, hazard, transit, terrain — not fog alone, because fog is only one
// layer of it. Photo forward, copy short, the map and the live numbers
// carrying the proof.
//
// Every figure comes from app/lib/landing-stats.json, regenerated from the
// live sales file by scripts/build-landing-stats.mjs. Nothing is typed by hand.

import Link from "next/link";
import stats from "../lib/landing-stats.json";
import hoodStats from "../lib/neighborhood-stats.json";

// Two different counts, and they are not interchangeable: 116 neighborhoods
// are MAPPED (the parcel dataset covers them), 105 are WRITTEN UP in the
// guide. The page must not claim the larger number for the smaller thing.
const GUIDE_COUNT = Object.keys(hoodStats.hoods || {}).length;

import SiteFooter, { EMAIL, PHONE_DISPLAY, PHONE_HREF } from "./SiteFooter";

const money = v => `$${(v / 1e6).toFixed(2)}M`;
const pct = (a, b) => (a == null || !b ? null : `${a / b - 1 >= 0 ? "+" : ""}${Math.round((a / b - 1) * 100)}%`);
const pts = (a, b) => (a == null || b == null ? null : `${a - b >= 0 ? "+" : ""}${Math.round(a - b)}`);
const num = v => v.toLocaleString("en-US");

// Each of these is a layer that actually exists on the map, so the page
// never promises a reading the site cannot produce.
const LAYERS = [
  { k: "Sun", href: "/microclimates?layer=solar",
    d: "Hours of direct sun the property gets, season by season." },
  { k: "Wind", href: "/microclimates?layer=wind",
    d: "Which side of the hill takes the wind and which sits sheltered." },
  { k: "Fog", href: "/fog?preset=fog",
    d: "Average summer fog hours, drawn to the contour, not the ZIP code." },
  { k: "Hazard", href: "/fog?preset=hazards",
    d: "Seismic, liquefaction, tsunami and fault lines under the address." },
  { k: "Transit", href: "/fog?preset=transit",
    d: "Every Muni line and stop, and the walk you would really make." },
  { k: "Terrain", href: "/fog?preset=terrain",
    d: "Elevation and slope — the hill you climb carrying groceries." },
];

export default function Landing() {
  // "Sept 10, 2026" — toLocaleDateString gives "Sep", so September is spelled
  // the way it is asked for and every other month keeps its short form.
  const through = stats.dataThrough
    ? new Date(stats.dataThrough)
        .toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
        .replace(/^Sep /, "Sept ")
    : null;
  const m = stats.market.current;
  const p = stats.market.prior;
  const r = v => Math.round(v);
  const days = (a, b) => {
    const d = pts(a, b);
    return `${d} ${Math.abs(r(a) - r(b)) === 1 ? "day" : "days"}`;
  };
  const KPIS = [
    { label: "SFH Median Sale", now: money(m.sfh.median), then: money(p.sfh.median),
      chg: pct(m.sfh.median, p.sfh.median) },
    { label: "Condo Median Sale", now: money(m.condo.median), then: money(p.condo.median),
      chg: pct(m.condo.median, p.condo.median) },
    { label: "Total Sales Volume", now: `$${(m.volume / 1e9).toFixed(2)}B`, then: `$${(p.volume / 1e9).toFixed(2)}B`,
      chg: pct(m.volume, p.volume) },
    { label: "SFH Days to Sell", now: r(m.sfh.dom), then: r(p.sfh.dom),
      chg: days(m.sfh.dom, p.sfh.dom) },
    { label: "Condo Days to Sell", now: r(m.condo.dom), then: r(p.condo.dom),
      chg: days(m.condo.dom, p.condo.dom) },
    { label: "SFH Over Asking", now: `${r(m.sfh.overAsk)}%`, then: `${r(p.sfh.overAsk)}%`,
      chg: `${pts(m.sfh.overAsk, p.sfh.overAsk)} pts` },
  ];

  return (
    <div className="lp">
      {/* No logo lockup here — the name and title sit under the portrait a
          few inches below, and dropping it lets the map start higher. */}
      <header className="lp-nav lp-nav-bare">
        <nav className="lp-nav-links">
          <Link href="/fog?preset=fog">The Map</Link>
          <Link href="/neighborhoods">Neighborhoods</Link>
          <Link href="/market">Market</Link>
          <Link href="/tools">All Tools</Link>
          <a className="lp-nav-cta" href={`mailto:${EMAIL}`}>Work With Me</a>
        </nav>
      </header>

      {/* Hero — the map is the subject. The city is the headline, the
          portrait is a byline, and there is no paragraph at all. */}
      <section className="lp-hero">
        <div className="lp-hero-grid">
          <div className="lp-hero-copy">
            <h1 className="lp-city">San Francisco</h1>
            <p className="lp-claim">Real Estate &amp; Microclimates</p>
          </div>
          <figure className="lp-portrait">
            <img src="/brand/chuck-heaver-cutout.png" alt="Chuck Heaver" width="1566" height="1784" />
            <figcaption>
              <b>Chuck Heaver</b>
              <span>Realtor &amp; Meteorologist · Vanguard Properties</span>
            </figcaption>
          </figure>
          <figure className="lp-hero-map">
            <img src="/brand/sf-fog-hero.svg"
                 alt="San Francisco split into its microclimate zones, one dot per home sold this year"
                 width="1000" height="780" />
            <figcaption>
              <Link className="lp-explore" href="/fog?preset=fog">
                <span className="lp-explore-q">Where do you want to go?</span>
                <span className="lp-explore-go" aria-hidden="true">&rarr;</span>
              </Link>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* By the Numbers — the briefing's front page. Each tile shows this
          year then last, separated by a space, with the metric and the
          change beneath it. */}
      <section className="lp-stats" aria-label="By the numbers">
        <p className="lp-stats-head">
          By the Numbers: &rsquo;25 vs &rsquo;26 YTD{through ? ` (${through})` : ""}
        </p>
        <div className="lp-stats-row">
          {KPIS.map(k => (
            <div className="lp-stat" key={k.label}>
              <div className="lp-stat-v">
                {k.now}
                <span className="lp-stat-prior">{k.then}<i>&rsquo;25</i></span>
              </div>
              <div className="lp-stat-l">{k.label}: <b>{k.chg}</b></div>
            </div>
          ))}
        </div>
      </section>

      {/* The actual differentiator: what can be read about one address. */}
      <section className="lp-layers">
        <div className="lp-section-head">
          <p className="lp-kicker">Street level, not ZIP code level</p>
          <h2 className="lp-h2">Six things I can tell you about your block.</h2>
        </div>
        <div className="lp-layer-grid">
          {LAYERS.map(l => (
            <Link key={l.k} href={l.href} className="lp-layer">
              <span className="lp-layer-k">{l.k}</span>
              <span className="lp-layer-d">{l.d}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* The neighborhood guide. */}
      <section className="lp-guide-promo">
        <div>
          <p className="lp-kicker">The guide</p>
          <h2 className="lp-h2">All {num(GUIDE_COUNT)} San Francisco neighborhoods, written up.</h2>
          <p className="lp-mapshow-body">
            What each one is like, what homes are selling for, and the microclimate it sits in.
          </p>
          <Link className="lp-btn lp-btn-navy" href="/neighborhoods">Open the neighborhood guide</Link>
        </div>
      </section>

      {/* About — deliberately short. */}
      <section className="lp-about" id="about">
        <div className="lp-about-inner">
          <div className="lp-about-copy">
            <p className="lp-kicker">About</p>
            <h2 className="lp-h2">Two careers, one job.</h2>
            <p>
              Twenty years forecasting weather on television, thirty-five selling homes here.
              In a city where the temperature swings fifteen degrees across three miles,
              those turned out to be the same job.
            </p>
            <ul className="lp-creds">
              <li><b>Vanguard Properties</b> — San Francisco</li>
              <li><b>35 years</b> residential, commercial and investment</li>
              <li><b>20+ years</b> broadcast meteorologist</li>
              <li><b>B.S. Finance</b>, The Ohio State University</li>
              <li>English, German, Portuguese</li>
            </ul>
            <Link className="lp-inline-link" href="/neighborhoods">
              Start with the neighborhood guide &rarr;
            </Link>
          </div>
          <aside className="lp-about-card">
            <h3>Send me an address.</h3>
            <p>
              I will come back with its sun, wind and fog, what has closed on the block,
              and what I think it is worth.
            </p>
            <a className="lp-btn lp-btn-gold lp-btn-block" href={`mailto:${EMAIL}?subject=Run%20my%20street`}>
              Run my street
            </a>
            <a className="lp-btn lp-btn-ghost lp-btn-block" href={`tel:${PHONE_HREF}`}>{PHONE_DISPLAY}</a>
            <p className="lp-fine">{EMAIL}</p>
          </aside>
        </div>
      </section>

      <SiteFooter note={
        <>
          Market figures are {stats.market.year} closed sales from SFAR MLS through{" "}
          {through}, against the same stretch of {stats.market.priorYear}. Sun-belt and
          fog-belt price comparisons are single-family homes only. Deemed reliable,
          not guaranteed.
        </>
      } />
    </div>
  );
}
