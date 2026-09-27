// San Francisco microclimates, top down: the Köppen classification, the ocean
// that causes it, the Bay Area's sub-climates, the city's three belts, what
// changes block to block, fog in full, and the year in numbers.
//
// Layout only — the writing lives in content.js and the climate figures in
// app/lib/sf-climate.json, so neither can drift out of sync with the other.

import Link from "next/link";
import SiteFooter, { EMAIL } from "../components/SiteFooter";
import ClimateChart, { ClimateTable, ClimateExtremes } from "./ClimateChart";
import STATS from "../lib/landing-stats.json";
import {
  LEDE, KOPPEN, ENGINE, BAY_LEAD, BAY_ZONES, BAY_NOTE,
  BELTS_LEAD, BELTS, BELTS_DATA_NOTE, BLOCK_LEAD, BLOCK,
  FOG, YEAR_LEAD, YEAR_NOTES, DISCLAIMER,
} from "./content";

export const metadata = {
  title: "San Francisco Microclimates: Fog, Wind and Why the Weather Changes by Block",
  description:
    "Why San Francisco's weather changes block by block — the Köppen classification, " +
    "the cold Pacific and the North Pacific High, the Bay Area's sub-climates from Napa " +
    "to San Jose, the city's three fog belts, and how fog forms, moves and burns off. " +
    "With monthly temperature and rainfall normals.",
};

const TOC = [
  ["koppen", "Classification"],
  ["ocean", "The Ocean"],
  ["bay", "Around the Bay"],
  ["belts", "The Three Belts"],
  ["block", "Your Block"],
  ["fog", "Fog"],
  ["year", "The Year"],
];

const money = v => (v >= 1e6 ? `$${(v / 1e6).toFixed(2)}M` : `$${Math.round(v / 1e3)}K`);

export default function Page() {
  const h = STATS.houses;

  return (
    <div className="lp">
      <header className="lp-nav lp-nav-solid">
        <Link href="/" className="lp-logo">
          <span className="lp-logo-name">Chuck Heaver</span>
          <span className="lp-logo-sub">San Francisco Realtor · Meteorologist</span>
        </Link>
        <nav className="lp-nav-links">
          <Link href="/microclimates">Microclimates</Link>
          <Link href="/neighborhoods">Neighborhoods</Link>
          <Link href="/fog?preset=fog">The Map</Link>
          <a className="lp-nav-cta" href={`mailto:${EMAIL}`}>Work With Me</a>
        </nav>
      </header>

      <section className="lp-guide-head">
        <p className="lp-kicker">San Francisco Microclimates</p>
        <h1 className="lp-guide-h1">Why the Weather Changes Block by Block</h1>
        <p className="lp-guide-lede">{LEDE}</p>
      </section>

      <div className="pt-toc">
        <nav>
          {TOC.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}
        </nav>
      </div>

      <article className="pt-body">

        {/* 1 — Classification ------------------------------------------- */}
        <section className="pt-sec" id="koppen">
          <p className="lp-kicker">Start at the top</p>
          <h2>The Climate San Francisco Is Filed Under</h2>
          <p className="pt-lead">{KOPPEN.lead}</p>

          <div className="mc-letters">
            {KOPPEN.letters.map(l => (
              <div className="mc-letter" key={l.k}>
                <div className="mc-letter-k" aria-hidden="true">{l.k}</div>
                <h3>{l.label}</h3>
                <p>{l.p}</p>
              </div>
            ))}
          </div>
          <p className="mc-code-note">
            <b>{KOPPEN.code}</b> — {KOPPEN.name}. Three letters, in that order.
          </p>

          {KOPPEN.body.map(b => (
            <div className="pt-block" key={b.h}>
              <h3>{b.h}</h3>
              <p>{b.p}</p>
            </div>
          ))}
        </section>

        {/* 2 — The ocean ------------------------------------------------ */}
        <section className="pt-sec" id="ocean">
          <p className="lp-kicker">The cause</p>
          <h2>The Ocean Runs the Bay Area</h2>
          <p className="pt-lead">{ENGINE.lead}</p>

          <div className="mc-engine">
            {ENGINE.parts.map(p => (
              <div className="mc-part" key={p.n}>
                <span className="mc-part-n" aria-hidden="true">{p.n}</span>
                <div>
                  <h3>{p.h}</h3>
                  <p>{p.p}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-block">
            <h3>{ENGINE.winter.h}</h3>
            <p>{ENGINE.winter.p}</p>
          </div>
        </section>

        {/* 3 — Around the Bay ------------------------------------------- */}
        <section className="pt-sec" id="bay">
          <p className="lp-kicker">Drill down: the region</p>
          <h2>One Bay, Fourteen Climates</h2>
          <p className="pt-lead">{BAY_LEAD}</p>

          <div className="mc-table-wrap">
            <table className="mc-table mc-bay">
              <thead>
                <tr>
                  <th scope="col">Sub-climate</th>
                  <th scope="col">July<span className="lp-fine"> afternoon</span></th>
                  <th scope="col">January<span className="lp-fine"> night</span></th>
                  <th scope="col">Rain<span className="lp-fine"> a year</span></th>
                </tr>
              </thead>
              <tbody>
                {BAY_ZONES.map(z => (
                  <tr key={z.name} className={z.sf ? "mc-row-sf" : undefined}>
                    <th scope="row">
                      <span className="mc-zone-name">{z.name}</span>
                      <span className="mc-zone-eg">{z.eg}</span>
                      <span className="mc-zone-why">{z.why}</span>
                    </th>
                    <td>{z.jul}</td>
                    <td>{z.jan}</td>
                    <td>{z.rain}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mc-note">{BAY_NOTE}</p>
        </section>

        {/* 4 — The three belts ------------------------------------------ */}
        <section className="pt-sec" id="belts">
          <p className="lp-kicker">Drill down: the city</p>
          <h2>San Francisco&rsquo;s Three Microclimates</h2>
          <p className="pt-lead">{BELTS_LEAD}</p>

          <div className="mc-belts">
            {BELTS.map(b => (
              <div className="mc-belt" key={b.key} style={{ "--b": b.color }}>
                <div className="mc-belt-head">
                  <h3>{b.name}</h3>
                  <span className="mc-belt-hours">{b.hours}<span className="lp-fine"> of fog a day</span></span>
                </div>
                <p className="mc-belt-where">{b.where}</p>
                <p>{b.p}</p>
              </div>
            ))}
          </div>
          <p className="mc-note">{BELTS_DATA_NOTE}</p>

          <div className="mc-callout">
            <h3>And it shows up in the price</h3>
            <p>
              Single-family homes sold in {STATS.year} so far: a median of{" "}
              <b>{money(h.sun.median)}</b> in the sunbelt ({h.sun.n} sales),{" "}
              <b>{money(h.fog.median)}</b> in the fog belt ({h.fog.n}), and{" "}
              <b>{money(h.persistentFog.median)}</b> in the persistent-fog southwest ({h.persistentFog.n}).
              Per square foot that is ${Math.round(h.sun.ppsf).toLocaleString("en-US")} against $
              {Math.round(h.persistentFog.ppsf).toLocaleString("en-US")} — a{" "}
              {h.ppsfRatio.toFixed(2)}× spread for the same city.
            </p>
            <p className="lp-fine">
              Houses only, deliberately. Compare all property types across the belts and the
              answer flips, because the sunny bayside is heavily condo and the foggy west side
              is heavily house — a mix difference, not a price difference.
            </p>
            <Link className="lp-btn lp-btn-ghost" href="/fog?preset=fog">See the fog map</Link>
          </div>
        </section>

        {/* 5 — Your block ----------------------------------------------- */}
        <section className="pt-sec" id="block">
          <p className="lp-kicker">Drill down: the block</p>
          <h2>Wind, Sun Angle, Elevation and Grade</h2>
          <p className="pt-lead">{BLOCK_LEAD}</p>

          {BLOCK.map(b => (
            <div className="pt-block" key={b.h}>
              <h3>{b.h}</h3>
              <p>{b.p}</p>
            </div>
          ))}

          <div className="mc-callout">
            <h3>This is measurable, one address at a time</h3>
            <p>
              Sun by season, wind exposure, elevation, slope, the fog contour your parcel
              sits inside — the map on this site draws all of it for a specific address
              rather than for a ZIP code.
            </p>
            <div className="mc-callout-btns">
              <Link className="lp-btn lp-btn-gold" href="/fog?preset=fog">Open the map</Link>
              <Link className="lp-btn lp-btn-ghost" href="/microclimates/zones?layer=solar">Sun &amp; wind zones</Link>
            </div>
          </div>
        </section>

        {/* 6 — Fog ------------------------------------------------------- */}
        <section className="pt-sec" id="fog">
          <p className="lp-kicker">The main event</p>
          <h2>Fog: How It Forms, Where It Goes, Why It Stays</h2>
          <p className="pt-lead">{FOG.lead}</p>

          {FOG.what.map(b => (
            <div className="pt-block" key={b.h}>
              <h3>{b.h}</h3>
              <p>{b.p}</p>
            </div>
          ))}

          <div className="mc-callout mc-callout-light">
            <h3>{FOG.pacific.h}</h3>
            <p>{FOG.pacific.p}</p>
          </div>

          <h3 className="mc-sub">A day in the life of the marine layer</h3>
          <p className="mc-note mc-note-lead">{FOG.dayLead}</p>
          <ol className="mc-day">
            {FOG.day.map(d => (
              <li key={d.t}>
                <span className="mc-day-t">{d.t}</span>
                <span className="mc-day-p">{d.p}</span>
              </li>
            ))}
          </ol>

          <h3 className="mc-sub">Fog meets the hills</h3>
          {FOG.topo.map(b => (
            <div className="pt-block" key={b.h}>
              <h3>{b.h}</h3>
              <p>{b.p}</p>
            </div>
          ))}
          <p className="mc-note">{FOG.karl}</p>
        </section>

        {/* 7 — The year -------------------------------------------------- */}
        <section className="pt-sec" id="year">
          <p className="lp-kicker">What to expect</p>
          <h2>San Francisco&rsquo;s Year, in Numbers</h2>
          <p className="pt-lead">{YEAR_LEAD}</p>

          <ClimateChart />
          <ClimateTable />
          <ClimateExtremes />

          {YEAR_NOTES.map(b => (
            <div className="pt-block" key={b.h}>
              <h3>{b.h}</h3>
              <p>{b.p}</p>
            </div>
          ))}
        </section>

        <section className="pt-cta">
          <div>
            <h2>Want to know what your block gets?</h2>
            <p>
              Send me an address and I will come back with its sun by season, its wind,
              the fog contour it sits in, what is under it, and what has sold around it.
            </p>
          </div>
          <a className="lp-btn lp-btn-gold" href={`mailto:${EMAIL}?subject=Microclimate%20question`}>
            Ask me about an address
          </a>
        </section>

        <p className="pt-disclaimer">{DISCLAIMER}</p>
      </article>

      <SiteFooter />
    </div>
  );
}
