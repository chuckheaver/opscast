// The site's front door. Positions Chuck as the one San Francisco agent who
// is also a meteorologist, proves it with the real microclimate numbers, and
// funnels to the tools that make the case.
//
// Every figure on this page comes from app/lib/landing-stats.json, which is
// regenerated from the live sales file by scripts/build-landing-stats.mjs —
// nothing here is typed by hand.

import Link from "next/link";
import stats from "../lib/landing-stats.json";

const EMAIL = "chuck.heaver@vanguardproperties.com";
const PHONE_DISPLAY = "415.549.1777";
const PHONE_HREF = "+14155491777";
const MAIN_SITE = "https://www.chuckheaver.com";

const money = v => `$${(v / 1e6).toFixed(2)}M`;
const psf = v => `$${Math.round(v).toLocaleString("en-US")}`;
const num = v => v.toLocaleString("en-US");

const TOOLS = [
  {
    href: "/fog?preset=fog",
    kicker: "The map nobody else has",
    title: "Microclimate Map",
    body: "Every closed sale in the city, placed on the fog zone it actually sits in. Switch on terrain, transit, hazards or land use and read a block the way I read it.",
  },
  {
    href: "/market",
    kicker: "Monthly",
    title: "Market Briefing",
    body: "Median and average price, days on market, percent over asking — by neighborhood, this month against the same month last year.",
  },
  {
    href: "/fog?preset=neighborhoods",
    kicker: `${num(stats.neighborhoods)} of them`,
    title: "Neighborhood Profiles",
    body: "What each neighborhood is actually like, what it costs, how fast it moves, and how much sun it gets.",
  },
  {
    href: "/fog?preset=homes",
    kicker: `${num(stats.salesThisYear)} this year`,
    title: "Homes & Sales",
    body: "Filter what has sold by price, type, size and neighborhood, then open any sale to see what it went for against asking.",
  },
  {
    href: "/microclimates?layer=solar",
    kicker: "Sun, wind, fog",
    title: "Sun & Exposure",
    body: "Hours of direct sun a property gets through the year, wind exposure and the fog inversion line — the things a floor plan will not tell you.",
  },
  {
    href: "/weather",
    kicker: "Today",
    title: "Forecast",
    body: "The forecast for your exact block, not for a weather station eight miles away on the other side of the hill.",
  },
];

const WHY = [
  {
    n: "01",
    title: "The fog line is a price line",
    body: `Houses in the sun belt close at a median ${money(stats.houses.sun.median)}. In the persistent fog belt, ${money(stats.houses.persistentFog.median)}. Per square foot it is ${psf(stats.houses.sun.ppsf)} against ${psf(stats.houses.persistentFog.ppsf)}. Most listing presentations never mention it.`,
  },
  {
    n: "02",
    title: "You are buying a climate, not just an address",
    body: "Two homes the same distance from the same park can differ by four hours of summer sun and fifteen degrees on an August afternoon. That decides whether you use the garden, what your heating costs, and whether you like living there.",
  },
  {
    n: "03",
    title: "Weather is a building inspection",
    body: "Salt air, wind loading, damp that never dries, a roof that bakes eight months a year. Twenty years of reading this coastline tells me what to look for before the inspector arrives.",
  },
];

export default function Landing() {
  const through = stats.dataThrough
    ? new Date(stats.dataThrough).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : null;

  return (
    <div className="lp">
      <header className="lp-nav">
        <Link href="/" className="lp-logo">
          <span className="lp-logo-name">Chuck Heaver</span>
          <span className="lp-logo-sub">Realtor · Meteorologist</span>
        </Link>
        <nav className="lp-nav-links">
          <Link href="/fog?preset=fog">The Map</Link>
          <Link href="/market">Market</Link>
          <Link href="/tools">All Tools</Link>
          <a href="#about">About</a>
          <a className="lp-nav-cta" href={`mailto:${EMAIL}`}>Work With Me</a>
        </nav>
      </header>

      <section className="lp-hero">
        <div className="lp-hero-map" aria-hidden="true">
          <img src="/brand/sf-fog-hero.svg" alt="" width="1000" height="780" />
        </div>
        <div className="lp-hero-inner">
          <p className="lp-eyebrow">San Francisco · Vanguard Properties</p>
          <h1 className="lp-h1">
            In San Francisco, the fog line is a <em>price</em> line.
          </h1>
          <p className="lp-lede">
            A house in the sun belt closes at a median <b>{money(stats.houses.sun.median)}</b>.
            In the persistent fog belt, <b>{money(stats.houses.persistentFog.median)}</b>.
            I spent twenty years forecasting this weather on television and thirty-five
            selling these homes — and I am the only agent in the city who maps both.
          </p>
          <div className="lp-cta-row">
            <Link className="lp-btn lp-btn-gold" href="/fog?preset=fog">Explore the microclimate map</Link>
            <Link className="lp-btn lp-btn-ghost" href="/market">See this month&rsquo;s market</Link>
          </div>
          <p className="lp-hero-note">
            Each dot is a home that closed in {stats.year}. The gold is the sun belt; the grey is the fog.
          </p>
        </div>
      </section>

      <section className="lp-stats" aria-label="What this site tracks">
        <div className="lp-stat">
          <div className="lp-stat-v">{num(stats.salesThisYear)}</div>
          <div className="lp-stat-l">{stats.year} closings placed on a fog zone</div>
        </div>
        <div className="lp-stat">
          <div className="lp-stat-v">{num(stats.parcels)}</div>
          <div className="lp-stat-l">Residential parcels tracked citywide</div>
        </div>
        <div className="lp-stat">
          <div className="lp-stat-v">{stats.houses.ppsfRatio.toFixed(1)}&times;</div>
          <div className="lp-stat-l">Price per foot, sun belt vs fog belt <span className="lp-stat-fine">(houses)</span></div>
        </div>
        <div className="lp-stat">
          <div className="lp-stat-v">{num(stats.neighborhoods)}</div>
          <div className="lp-stat-l">Neighborhoods mapped and profiled</div>
        </div>
      </section>

      <section className="lp-why">
        <div className="lp-section-head">
          <p className="lp-kicker">Why it matters who you hire</p>
          <h2 className="lp-h2">Every agent can pull the comps. I can tell you why the house uphill is worth more.</h2>
        </div>
        <div className="lp-why-grid">
          {WHY.map(w => (
            <article key={w.n} className="lp-why-card">
              <div className="lp-why-n">{w.n}</div>
              <h3>{w.title}</h3>
              <p>{w.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="lp-tools">
        <div className="lp-section-head">
          <p className="lp-kicker">Free, no sign-up, no email wall</p>
          <h2 className="lp-h2">The most detailed public map of San Francisco real estate anywhere.</h2>
        </div>
        <div className="lp-tool-grid">
          {TOOLS.map(t => (
            <Link key={t.href} href={t.href} className="lp-tool">
              <p className="lp-tool-kicker">{t.kicker}</p>
              <h3>{t.title}</h3>
              <p className="lp-tool-body">{t.body}</p>
              <span className="lp-tool-go">Open &rarr;</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="lp-about" id="about">
        <div className="lp-about-inner">
          <div className="lp-about-copy">
            <p className="lp-kicker">About</p>
            <h2 className="lp-h2">Two careers that turned out to be the same job.</h2>
            <p>
              I forecast weather on television for more than twenty years before I sold
              a house in San Francisco, and I have now been in real estate for thirty-five.
              For a long time those felt like separate lives. They are not. This is a city
              where the temperature swings fifteen degrees across three miles, where one
              street is in fog by two in the afternoon and the next one over is not, and
              where that difference is worth millions of dollars in aggregate — and
              nobody was putting a number on it.
            </p>
            <p>
              So I built the map myself. Every closed sale in the city, geocoded and placed
              on the fog contour it sits in, next to the parcel stock, the transit, the
              terrain and the hazards. It is the map on this site, and I use it on every
              listing and every offer I write.
            </p>
            <ul className="lp-creds">
              <li><b>Vanguard Properties</b> — San Francisco</li>
              <li><b>35 years</b> in residential, commercial and investment real estate</li>
              <li><b>20+ years</b> as a broadcast meteorologist</li>
              <li><b>B.S. Finance</b>, The Ohio State University</li>
              <li>English, German, Portuguese <span className="lp-fine">· working Spanish</span></li>
            </ul>
            <a className="lp-inline-link" href={MAIN_SITE} target="_blank" rel="noopener noreferrer">
              My full practice at chuckheaver.com &rarr;
            </a>
          </div>
          <aside className="lp-about-card">
            <h3>Ask me to run your street</h3>
            <p>
              Send me an address. I will come back with its fog hours, its sun exposure,
              what has closed on that block, and what I think it is worth — whether or not
              you ever list with me.
            </p>
            <a className="lp-btn lp-btn-gold lp-btn-block" href={`mailto:${EMAIL}?subject=Run%20my%20street`}>
              Email me an address
            </a>
            <a className="lp-btn lp-btn-ghost lp-btn-block" href={`tel:${PHONE_HREF}`}>{PHONE_DISPLAY}</a>
            <p className="lp-fine">{EMAIL}</p>
          </aside>
        </div>
      </section>

      <footer className="lp-foot">
        <div className="lp-foot-inner">
          <div>
            <div className="lp-logo-name">Chuck Heaver</div>
            <p className="lp-fine">
              Realtor, Vanguard Properties · Broadcast meteorologist · San Francisco
            </p>
          </div>
          <div className="lp-foot-links">
            <Link href="/fog?preset=fog">Microclimate map</Link>
            <Link href="/market">Market</Link>
            <Link href="/tools">All tools</Link>
            <a href={MAIN_SITE} target="_blank" rel="noopener noreferrer">chuckheaver.com</a>
            <a href={`mailto:${EMAIL}`}>Email</a>
          </div>
        </div>
        <p className="lp-fine lp-foot-fine">
          Sale figures are closed transactions from SFAR MLS, geocoded to USGS-derived
          summer-fog contours{through ? `, data through ${through}` : ""}. Sun-belt and
          fog-belt comparisons are single-family homes only. Deemed reliable, not guaranteed.
        </p>
      </footer>
    </div>
  );
}
