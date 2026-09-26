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

const EMAIL = "chuck.heaver@vanguardproperties.com";
const PHONE_DISPLAY = "415.549.1777";
const PHONE_HREF = "+14155491777";
const DRE = "02252640";

const money = v => `$${(v / 1e6).toFixed(2)}M`;
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
  const updated = stats.dataThrough
    ? new Date(stats.dataThrough).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : null;

  return (
    <div className="lp">
      <header className="lp-nav">
        <Link href="/" className="lp-logo">
          <span className="lp-logo-name">Chuck Heaver</span>
          <span className="lp-logo-sub"><i>San Francisco </i>Realtor · Meteorologist</span>
        </Link>
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
            <Link className="lp-explore" href="/fog?preset=fog">
              <span className="lp-explore-k">Explore</span>
              <span className="lp-explore-q">Where do you want to go?</span>
              <span className="lp-explore-go" aria-hidden="true">&rarr;</span>
            </Link>
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
              {num(stats.salesThisYear)} homes sold in {stats.year}, each on the microclimate it sits in
            </figcaption>
          </figure>
        </div>
      </section>

      {/* By the Numbers — refreshed on every data load. */}
      <section className="lp-stats" aria-label="By the numbers">
        <p className="lp-stats-head">
          By the Numbers{updated ? <span className="lp-stats-when"> · updated {updated}</span> : null}
        </p>
        <div className="lp-stats-row">
          <div className="lp-stat">
            <div className="lp-stat-v">{num(stats.salesThisYear)}</div>
            <div className="lp-stat-l">{stats.year} closings, each placed on its microclimate</div>
          </div>
          <div className="lp-stat">
            <div className="lp-stat-v">{num(stats.parcels)}</div>
            <div className="lp-stat-l">Residential parcels tracked citywide</div>
          </div>
          <div className="lp-stat">
            <div className="lp-stat-v">{num(stats.neighborhoods)}</div>
            <div className="lp-stat-l">Neighborhoods mapped across the city</div>
          </div>
          <div className="lp-stat">
            <div className="lp-stat-v">{money(stats.houses.sun.median)}</div>
            <div className="lp-stat-l">
              Median house in the sun vs {money(stats.houses.persistentFog.median)} in the fog
            </div>
          </div>
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

      <footer className="lp-foot">
        <div className="lp-foot-inner">
          <div>
            <div className="lp-logo-name">Chuck Heaver</div>
            <p className="lp-fine">Realtor, Vanguard Properties · Broadcast meteorologist · San Francisco</p>
          </div>
          <div className="lp-foot-links">
            <Link href="/fog?preset=fog">Map</Link>
            <Link href="/neighborhoods">Neighborhoods</Link>
            <Link href="/market">Market</Link>
            <Link href="/tools">All tools</Link>
            <a href={`mailto:${EMAIL}`}>Email</a>
          </div>
        </div>
        <p className="lp-fine lp-foot-fine">
          Chuck Heaver · DRE #{DRE} · Vanguard Properties, San Francisco.
          Sale figures are closed transactions from SFAR MLS geocoded to USGS-derived
          microclimate contours{updated ? `, data through ${updated}` : ""}. Sun-belt and
          fog-belt price comparisons are single-family homes only. Deemed reliable, not guaranteed.
        </p>
      </footer>
    </div>
  );
}
