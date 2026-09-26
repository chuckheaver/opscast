// The site's front door. The pitch is street-level microclimate — sun, wind,
// fog, hazard, transit, terrain — not fog alone, because fog is only one
// layer of it. Photo forward, copy short, the map and the live numbers
// carrying the proof.
//
// Every figure comes from app/lib/landing-stats.json, regenerated from the
// live sales file by scripts/build-landing-stats.mjs. Nothing is typed by hand.

import Link from "next/link";
import stats from "../lib/landing-stats.json";

const EMAIL = "chuck.heaver@vanguardproperties.com";
const PHONE_DISPLAY = "415.549.1777";
const PHONE_HREF = "+14155491777";
const MAIN_SITE = "https://www.chuckheaver.com";
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
          <span className="lp-logo-sub">San Francisco Realtor · Meteorologist</span>
        </Link>
        <nav className="lp-nav-links">
          <Link href="/fog?preset=fog">The Map</Link>
          <Link href="/neighborhoods">Neighborhoods</Link>
          <Link href="/market">Market</Link>
          <Link href="/tools">All Tools</Link>
          <a className="lp-nav-cta" href={`mailto:${EMAIL}`}>Work With Me</a>
        </nav>
      </header>

      {/* Hero — one claim, one sentence, the face, the map behind it. */}
      <section className="lp-hero">
        <div className="lp-hero-map" aria-hidden="true">
          <img src="/brand/sf-fog-hero.svg" alt="" width="1000" height="780" />
        </div>
        <div className="lp-hero-grid">
          <div className="lp-hero-copy">
            <p className="lp-eyebrow">San Francisco · Vanguard Properties</p>
            <h1 className="lp-h1">
              Every San Francisco block has its own <em>microclimate</em>.
            </h1>
            <p className="lp-lede">
              Sun, wind, fog, hazard, transit — mapped street by street.
              Twenty years forecasting this coastline, thirty-five selling homes on it.
            </p>
            <div className="lp-cta-row">
              <Link className="lp-btn lp-btn-gold" href="/fog?preset=fog">Explore the map</Link>
              <a className="lp-btn lp-btn-ghost" href={`mailto:${EMAIL}?subject=Run%20my%20street`}>Run my street</a>
            </div>
          </div>
          <figure className="lp-portrait">
            <img src="/brand/chuck-heaver-cutout.png" alt="Chuck Heaver" width="1566" height="1784" />
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
            <div className="lp-stat-l">Neighborhoods mapped and profiled</div>
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
          <h2 className="lp-h2">All {num(stats.neighborhoods)} San Francisco neighborhoods, written up.</h2>
          <p className="lp-mapshow-body">
            What each one is actually like, what homes are selling for right now,
            and the microclimate it sits in. Not a ZIP-code summary — the real thing,
            block by block.
          </p>
          <Link className="lp-btn lp-btn-navy" href="/neighborhoods">Open the neighborhood guide</Link>
        </div>
      </section>

      {/* The map, given room. */}
      <section className="lp-mapshow">
        <div className="lp-mapshow-copy">
          <p className="lp-kicker">The map</p>
          <h2 className="lp-h2">I built it because nobody else had.</h2>
          <p className="lp-mapshow-body">
            Every closed sale in San Francisco, geocoded and laid over the
            microclimate it sits in — beside the parcel stock, the terrain, the
            transit and the hazards. I use it on every listing and every offer I write.
          </p>
          <Link className="lp-btn lp-btn-navy" href="/fog?preset=fog">Open the map</Link>
        </div>
        <div className="lp-mapshow-art">
          <img src="/brand/sf-fog-hero.svg" alt="San Francisco split into its microclimate zones, with a dot for every home sold this year" width="1000" height="780" />
          <p className="lp-fine">
            {num(stats.salesThisYear)} closings, {stats.year}. Gold is the sun belt, grey the fog belt.
          </p>
        </div>
      </section>

      {/* About — deliberately short. */}
      <section className="lp-about" id="about">
        <div className="lp-about-inner">
          <div className="lp-about-copy">
            <p className="lp-kicker">About</p>
            <h2 className="lp-h2">Two careers, one job.</h2>
            <p>
              I forecast weather on television for over twenty years before I sold a
              house here, and I have been in real estate for thirty-five. In a city
              where the temperature swings fifteen degrees across three miles, those
              turned out to be the same job.
            </p>
            <ul className="lp-creds">
              <li><b>Vanguard Properties</b> — San Francisco</li>
              <li><b>35 years</b> residential, commercial and investment</li>
              <li><b>20+ years</b> broadcast meteorologist</li>
              <li><b>B.S. Finance</b>, The Ohio State University</li>
              <li>English, German, Portuguese</li>
            </ul>
            <a className="lp-inline-link" href={MAIN_SITE} target="_blank" rel="noopener noreferrer">
              My full practice at chuckheaver.com &rarr;
            </a>
          </div>
          <aside className="lp-about-card">
            <h3>Send me an address.</h3>
            <p>
              I will come back with its sun, wind and fog, what is under it, what has
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
            <a href={MAIN_SITE} target="_blank" rel="noopener noreferrer">chuckheaver.com</a>
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
