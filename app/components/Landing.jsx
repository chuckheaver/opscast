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
import HeroSearch from "./HeroSearch";
import LiveBlockMap from "./LiveBlockMap";
import LiveHoodMap from "./LiveHoodMap";
import { allHoods } from "../neighborhoods/lib";

// Map name → guide page slug, for the neighborhood map's click-through.
const GUIDE_SLUGS = Object.fromEntries(allHoods().map(h => [h.name, h.slug]));
import WeatherChip from "./WeatherChip";

const money = v => `$${(v / 1e6).toFixed(2)}M`;
const pct = (a, b) => (a == null || !b ? null : `${a / b - 1 >= 0 ? "+" : ""}${Math.round((a / b - 1) * 100)}%`);
const pts = (a, b) => (a == null || b == null ? null : `${a - b >= 0 ? "+" : ""}${Math.round(a - b)}`);
const num = v => v.toLocaleString("en-US");

// Each of these is a layer that actually exists on the map, so the page
// never promises a reading the site cannot produce.
const LAYERS = [
  { k: "Sun", href: "/fog?preset=sun",
    d: "Hours of direct sun the property gets, season by season." },
  { k: "Wind", href: "/fog?preset=wind",
    d: "Which side of the hill takes the wind and which sits sheltered." },
  { k: "Fog", href: "/fog?preset=fog",
    d: "Average summer fog hours, drawn to the contour." },
  { k: "Hazard", href: "/fog?preset=hazards",
    d: "Seismic, liquefaction, tsunami and fault lines under the address." },
  { k: "Transit", href: "/fog?preset=transit",
    d: "Every Muni line and stop, and the walk you would really make." },
  { k: "Terrain/Elevation", href: "/fog?preset=terrain",
    d: "Elevation and slope — the hill you climb carrying groceries." },
  { k: "Bikes", href: "/fog?preset=bikes",
    d: "Protected lanes and bike routes, and the climb between you and them." },
  { k: "Land Use", href: "/fog?preset=landuse",
    d: "What every parcel around you is zoned and built for, residential or commercial." },
];

export default function Landing() {
  // "Sept 10, 2026" — toLocaleDateString gives "Sep", so September is spelled
  // the way it is asked for and every other month keeps its short form.
  const through = stats.dataThrough
    ? new Date(stats.dataThrough)
        .toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
        .replace(/^Sep /, "Sept ")
    : null;
  // "Sept 2026" — the month the stats run through, for the report pill.
  const statsMonth = new Date(`${stats.market.through}T12:00:00`)
    .toLocaleDateString("en-US", { month: "short", year: "numeric" })
    .replace(/^Sep /, "Sept ");
  const m = stats.market.current;
  const p = stats.market.prior;
  const r = v => Math.round(v);
  const unit = (a, b, one, many) =>
    `${pts(a, b)} ${Math.abs(r(a) - r(b)) === 1 ? one : many}`;
  const days = (a, b) => unit(a, b, "day", "days");
  const ptsOf = (a, b) => unit(a, b, "pt", "pts");
  const KPIS = [
    { label: "SFH Median Sale", now: money(m.sfh.median), then: money(p.sfh.median),
      chg: pct(m.sfh.median, p.sfh.median) },
    { label: "Condo Median Sale", now: money(m.condo.median), then: money(p.condo.median),
      chg: pct(m.condo.median, p.condo.median) },
    { label: "Total Units Sold — All", now: num(m.n), then: num(p.n),
      chg: pct(m.n, p.n) },
    { label: "Total Sales Volume", now: `$${(m.volume / 1e9).toFixed(2)}B`, then: `$${(p.volume / 1e9).toFixed(2)}B`,
      chg: pct(m.volume, p.volume) },
    { label: "SFH DOM", now: r(m.sfh.dom), then: r(p.sfh.dom),
      chg: days(m.sfh.dom, p.sfh.dom) },
    { label: "Condo DOM", now: r(m.condo.dom), then: r(p.condo.dom),
      chg: days(m.condo.dom, p.condo.dom) },
    // The typical sale as a percentage OF list — the actual premium, not
    // the share of sales that went over. overAsk is still computed in the
    // stats file if it is ever wanted back.
    { label: "SFH Sale Price vs List", now: `${r(m.sfh.saleToList)}%`, then: `${r(p.sfh.saleToList)}%`,
      chg: ptsOf(m.sfh.saleToList, p.sfh.saleToList) },
    { label: "Condo Sale Price vs List", now: `${r(m.condo.saleToList)}%`, then: `${r(p.condo.saleToList)}%`,
      chg: ptsOf(m.condo.saleToList, p.condo.saleToList) },
  ];

  return (
    <div className="lp">
      {/* No logo lockup here — the name and title sit under the portrait a
          few inches below, and dropping it lets the map start higher. */}

      {/* Hero — the map is the subject. The city is the headline, the
          portrait is a byline, and there is no paragraph at all. */}
      <section className="lp-hero">
        <div className="lp-hero-grid">
          <div className="lp-hero-copy">
            <h1 className="lp-city">San Francisco</h1>
            <div className="lp-claim-row">
              <p className="lp-claim">Real Estate by Microclimate</p>
              <WeatherChip />
            </div>
          </div>
          <figure className="lp-portrait">
            <img src="/brand/chuck-heaver-cutout.webp" alt="Chuck Heaver" width="760" height="866" />
            <figcaption>
              <b>Chuck Heaver</b>
              <span>Realtor &amp; Meteorologist · Vanguard Properties</span>
            </figcaption>
          </figure>
          <figure className="lp-hero-map">
            <Link href="/fog?preset=fog" className="lp-map-link" aria-label="Open the interactive microclimate map">
              <img src="/brand/sf-fog-hero.svg"
                   alt="San Francisco split into its microclimate zones, one dot per home sold this year"
                   width="1000" height="780" />
              <span className="lp-map-hint">Open the Summer Fog Map &rarr;</span>
            </Link>
            <figcaption>
              {/* Typing an address goes to the same map, with the pin already
                  dropped on it, via the ?lat=&lng=&name= deep-link. */}
              <HeroSearch />
            </figcaption>
          </figure>
        </div>
      </section>

      {/* By the Numbers — the briefing's front page. Each tile shows this
          year then last, separated by a space, with the metric and the
          change beneath it. */}
      <section className="lp-stats" aria-label="By the numbers">
        <div className="lp-stats-top">
          <p className="lp-stats-head">
            By the Numbers: &rsquo;26 vs <span className="lp-stats-key">&rsquo;25</span> YTD{through ? ` (${through})` : ""}
          </p>
          <Link href="/market/report" className="lp-stats-pill">Market Stats - {statsMonth}</Link>
        </div>
        <div className="lp-stats-row">
          {KPIS.map(k => (
            <div className="lp-stat" key={k.label}>
              <div className="lp-stat-v">
                {k.now}
                <span className="lp-stat-prior">{k.then}</span>
              </div>
              <div className="lp-stat-l">{k.label}: <b>{k.chg}</b></div>
            </div>
          ))}
        </div>
      </section>

      {/* The actual differentiator: what can be read about one address. */}
      <section className="lp-layers">
        <div className="lp-section-head">
          <p className="lp-kicker lp-kicker-lg">Street level</p>
          <h2 className="lp-h2">What&rsquo;s on your block.</h2>
        </div>
        {/* The live map, with every home sold this year on it. The pill on
            top is a real address search that lands on the full map with the
            sold homes showing; the button below opens the full map. */}
        <div className="lp-block">
        <div className="lp-block-map">
          <LiveBlockMap fallback={
            <Link href="/fog?preset=homes" className="lp-block-map-link" aria-label="Open the map with this year's sold homes">
              <img src="/brand/map-sold-homes.webp" alt="San Francisco map with a blue dot for every home sold this year, by neighborhood"
                   width="1400" height="1055" loading="lazy" />
            </Link>
          } />
          <Link href="/fog?preset=homes" className="lp-block-map-open">Open the full map &rarr;</Link>
          <div className="lp-block-map-pill">
            <HeroSearch placeholder="Enter Address, Select Layer" preset="homes" className="hero-search-light" />
          </div>
        </div>
        {/* The layers, as a compact column beside the map. Each opens the
            map with that layer switched on. */}
        <nav className="lp-block-layers" aria-label="Map layers">
          {LAYERS.map(l => (
            <Link key={l.k} href={l.href} className="lp-block-layer">
              <span className="lp-block-layer-k">{l.k} <i aria-hidden="true">&rarr;</i></span>
              <span className="lp-block-layer-d">{l.d}</span>
            </Link>
          ))}
        </nav>
        </div>
      </section>

      {/* The neighborhood guide. */}
      <section className="lp-guide-promo">
        <div>
          <p className="lp-kicker lp-kicker-lg">The guide</p>
          <h2 className="lp-h2">{num(GUIDE_COUNT)} Neighborhoods — The vibes of the City</h2>
          <p className="lp-mapshow-body">
            What each one is like, what homes are selling for, and the microclimate it sits in.
          </p>
          <Link className="lp-btn lp-btn-navy" href="/neighborhoods">Open the neighborhood guide</Link>
        </div>
        {/* Every neighborhood, outlined — click one to open its guide page. */}
        <div className="lp-hood-map-wrap">
          <LiveHoodMap guides={GUIDE_SLUGS} />
        </div>
      </section>

      {/* About — deliberately short. */}
      <section className="lp-about" id="about">
        <div className="lp-about-inner">
          <div className="lp-about-copy">
            <p className="lp-kicker lp-kicker-lg">About</p>
            <h2 className="lp-h2">Two careers, one job.</h2>
            <p>
              Twenty years forecasting weather. 35 years forecasting real estate. In a city
              where climate zones vary by block and housing costs vary by lot, I am your best
              option for secure guidance to your dream home in San Francisco.
            </p>
            <ul className="lp-creds">
              <li><b>Vanguard Properties</b> — San Francisco</li>
              <li><b>35 years</b> residential, commercial and investment</li>
              <li><b>Brokerage history</b> in NYC, Chicago and South Florida</li>
              <li><b>20+ years</b> meteorologist</li>
              <li><b>Education:</b> The Ohio State University, Mississippi State</li>
              <li>English, German, Portuguese</li>
            </ul>
            <Link className="lp-inline-link" href="/neighborhoods">
              Start with the neighborhood guide &rarr;
            </Link>
          </div>
          <aside className="lp-about-card">
            <h3>Ask me anything.</h3>
            <p>
              Send an address and I will come back with its sun, wind and fog, what has
              closed on the block, and what I think it is worth.
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
