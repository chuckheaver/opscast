// San Francisco microclimates, top down: classification, the ocean, the Bay,
// the city's three belts, the block, fog, the year. One graphic per section,
// facts as bullets, no paragraphs.
//
// Words live in content.js, drawings in charts.jsx, climate figures in
// app/lib/sf-climate.json.

import Link from "next/link";
import SiteFooter, { EMAIL } from "../components/SiteFooter";
import STATS from "../lib/landing-stats.json";
import CLIMATE from "../lib/sf-climate.json";
import NSTATS from "../lib/neighborhood-stats.json";
import {
  BarRows, KoppenTests, OceanSection, CityProfile, SunAngle, FogClock, DeckHeights, TempChart, RainChart,
  ClimateTable, ClimateExtremes,
} from "./charts";
import { LotPlan, NeighborShadow, SlopeCompare, FieldRules, SkyChart } from "./sun";
import {
  LEDE, KOPPEN, LATITUDE, ENGINE, ENGINE_BULLETS,
  BAY_ZONES, BAY_BULLETS, BAY_NOTE, BELTS_LEAD, BELTS, FOG_HOURS, FOG_HOURS_NOTE,
  BLOCK, LOT_BULLETS, SUN_TOOLS, FOG_WHAT, DECK, FOG_TOPO, YEAR_BULLETS, DISCLAIMER,
} from "./content";

export const metadata = {
  title: "San Francisco Microclimates: Fog, Wind, Sun and Climate | Chuck Heaver",
  description:
    "San Francisco's microclimates in graphics: the Köppen classification, how the " +
    "Pacific drives Bay Area weather, sub-climates from Napa to San Jose, the city's " +
    "three fog belts, block-level wind, sun and elevation, how fog forms and moves, " +
    "and monthly temperature and rainfall.",
};

const TOC = [
  ["koppen", "Classification"],
  ["ocean", "Ocean"],
  ["bay", "The Bay"],
  ["belts", "Three Belts"],
  ["block", "Your Block"],
  ["fog", "Fog"],
  ["year", "The Year"],
];

const money = v => (v >= 1e6 ? `$${(v / 1e6).toFixed(2)}M` : `$${Math.round(v / 1e3)}K`);

const Bullets = ({ items }) => (
  <ul className="mc-bullets">{items.map(b => <li key={b}>{b}</li>)}</ul>
);

const Cards = ({ items, cols = 2 }) => (
  <div className={`mc-cards mc-cards-${cols}`}>
    {items.map(c => (
      <div className="mc-card" key={c.h}>
        <h3>{c.h}</h3>
        <Bullets items={c.bullets} />
      </div>
    ))}
  </div>
);

// The four headline numbers, computed so they move with the data.
function topline() {
  const m = CLIMATE.months;
  const highs = m.map(d => d.high);
  const rain = m.reduce((a, d) => a + d.precip, 0);
  const wet = m.filter(d => ["Nov", "Dec", "Jan", "Feb", "Mar"].includes(d.m))
    .reduce((a, d) => a + d.precip, 0);
  const fog = Object.values(NSTATS.hoods).map(x => x.fogHours).filter(Number.isFinite);
  const h = STATS.houses;
  return [
    { v: `${Math.min(...fog)} – ${Math.max(...fog)}`, k: "hours of summer fog a day", s: "bayside → southwest" },
    { v: `${Math.max(...highs) - Math.min(...highs)}°F`, k: "between our coolest and warmest month", s: "most US cities: 40+" },
    { v: `${Math.round((wet / rain) * 100)}%`, k: "of the year's rain falls Nov – Mar", s: "July: none" },
    { v: `${(h.sun.median / h.persistentFog.median).toFixed(1)}×`, k: "house price, sunbelt vs persistent fog", s: `single-family, ${STATS.year}` },
  ];
}

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
        <p className="lp-kicker">San Francisco</p>
        <h1 className="lp-guide-h1">Microclimates</h1>
        <p className="lp-guide-lede">{LEDE}</p>
        <div className="mc-topline">
          {topline().map(t => (
            <div className="mc-top" key={t.k}>
              <div className="mc-top-v">{t.v}</div>
              <div className="mc-top-k">{t.k}</div>
              <div className="mc-top-s">{t.s}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="pt-toc">
        <nav>
          {TOC.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}
        </nav>
      </div>

      <article className="pt-body mc-body">

        {/* 1 — Classification */}
        <section className="pt-sec" id="koppen">
          <h2>Köppen: {KOPPEN.code}</h2>
          <p className="mc-lead">{KOPPEN.name}</p>
          <div className="mc-letters">
            {KOPPEN.letters.map(l => (
              <div className="mc-letter" key={l.k}>
                <div className="mc-letter-k" aria-hidden="true">{l.k}</div>
                <div>
                  <h3>{l.label}</h3>
                  <p>{l.p}</p>
                </div>
              </div>
            ))}
          </div>
          <KoppenTests />
          <BarRows rows={LATITUDE} max={100} unit="°F" head="July afternoon, same latitude" labelW={190} />
          <Bullets items={KOPPEN.bullets} />
        </section>

        {/* 2 — The ocean */}
        <section className="pt-sec" id="ocean">
          <h2>Why It&rsquo;s Cold</h2>
          <OceanSection />
          <div className="mc-engine">
            {ENGINE.map(p => (
              <div className="mc-part" key={p.n}>
                <span className="mc-part-n" aria-hidden="true">{p.n}</span>
                <div>
                  <h3>{p.h}</h3>
                  <p>{p.p}</p>
                </div>
              </div>
            ))}
          </div>
          <Bullets items={ENGINE_BULLETS} />
        </section>

        {/* 3 — Around the Bay */}
        <section className="pt-sec" id="bay">
          <h2>Around the Bay</h2>
          <BarRows
            rows={BAY_ZONES.map(z => ({ k: z.k, eg: z.eg, v: z.jul, v2: z.rain, hi: z.hi }))}
            max={95} unit="°" head="July afternoon"
            max2={48} unit2={'"'} head2="Rain a year"
            rowH={34} caption={BAY_NOTE}
          />
          <Bullets items={BAY_BULLETS} />
        </section>

        {/* 4 — The three belts */}
        <section className="pt-sec" id="belts">
          <h2>Three Belts</h2>
          <p className="mc-lead">{BELTS_LEAD}</p>
          <CityProfile />

          <div className="mc-belts">
            {BELTS.map(b => (
              <div className="mc-belt" key={b.key} style={{ "--b": b.color }}>
                <div className="mc-belt-top">
                  <span className="mc-belt-swatch" aria-hidden="true" />
                  <h3>{b.name}</h3>
                </div>
                <div className="mc-belt-stats">
                  <div><b>{b.hours}</b><span>fog hrs / day</span></div>
                  <div><b>{b.count}</b><span>neighborhoods</span></div>
                </div>
                <Bullets items={b.bullets} />
                <p className="mc-belt-where">{b.where}</p>
              </div>
            ))}
          </div>

          <BarRows rows={FOG_HOURS.map(r => ({ ...r, v: r.v.toFixed(1) * 1 }))}
                   max={13} unit="h" head="Summer fog, hours a day" labelW={150}
                   caption={FOG_HOURS_NOTE} />

          <p className="mc-fig-h mc-price-h">Single-family median, {STATS.year}</p>
          <div className="mc-price">
            <div className="mc-price-t" style={{ "--b": "#E8B84B" }}>
              <b>{money(h.sun.median)}</b><span>Sunbelt · {h.sun.n} sales</span>
              <i>${Math.round(h.sun.ppsf).toLocaleString("en-US")}/sq ft</i>
            </div>
            <div className="mc-price-t" style={{ "--b": "#A8BCCD" }}>
              <b>{money(h.fog.median)}</b><span>Fog · {h.fog.n} sales</span>
              <i>${Math.round(h.fog.ppsf).toLocaleString("en-US")}/sq ft</i>
            </div>
            <div className="mc-price-t" style={{ "--b": "#8DA2B5" }}>
              <b>{money(h.persistentFog.median)}</b><span>Persistent fog · {h.persistentFog.n} sales</span>
              <i>${Math.round(h.persistentFog.ppsf).toLocaleString("en-US")}/sq ft</i>
            </div>
          </div>
          <p className="mc-cap">Houses only. Across all property types the order flips, because the sunbelt is mostly condos.</p>
        </section>

        {/* 5 — Your block */}
        <section className="pt-sec" id="block">
          <h2>Block by Block</h2>
          <Cards items={BLOCK} />

          <h3 className="mc-h3" id="sun">Sun on the Lot</h3>
          <SunAngle />
          <LotPlan />
          <Bullets items={LOT_BULLETS} />
          <NeighborShadow />
          <SlopeCompare />
          <FieldRules />
          <Bullets items={SUN_TOOLS} />
          <SkyChart />

          <div className="mc-callout-sun">
            <div>
              <b>On the map</b>
              <span>The sun layers show which slopes collect more or less sun than flat ground — summer, winter and equinox.</span>
            </div>
            <div className="mc-btns">
              <Link className="lp-btn lp-btn-navy" href="/microclimates/zones?layer=solar">Sun &amp; wind zones</Link>
              <Link className="lp-btn mc-btn-line" href="/fog?preset=fog">Open the map</Link>
            </div>
          </div>
        </section>

        {/* 6 — Fog */}
        <section className="pt-sec" id="fog">
          <h2>Fog</h2>
          <FogClock />
          <Cards items={FOG_WHAT} />
          <DeckHeights decks={DECK} />
          <Cards items={FOG_TOPO} cols={3} />
        </section>

        {/* 7 — The year */}
        <section className="pt-sec" id="year">
          <h2>The Year</h2>
          <TempChart months={CLIMATE.months} />
          <RainChart months={CLIMATE.months} />
          <ClimateExtremes />
          <Bullets items={YEAR_BULLETS} />
          <details className="mc-details">
            <summary>Month-by-month table</summary>
            <ClimateTable />
          </details>
        </section>

        <section className="pt-cta">
          <div>
            <h2>What does your block get?</h2>
            <p>Send an address. I&rsquo;ll send back its sun, wind, fog and sales.</p>
          </div>
          <a className="lp-btn lp-btn-gold" href={`mailto:${EMAIL}?subject=Microclimate%20question`}>
            Ask about an address
          </a>
        </section>

        <p className="pt-disclaimer">{DISCLAIMER}</p>
      </article>

      <SiteFooter />
    </div>
  );
}
