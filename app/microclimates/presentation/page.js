// The microclimate presentation: the site's microclimate and market material,
// arranged as a talk — the climate, the Bay, the city's fog zones, what it
// does to prices, the block and the lot, the coming winter, and why a
// meteorologist-realtor. Nothing here is new material: the words come from
// app/microclimates/content.js, the El Niño page, the home page and the market
// data files, and the graphics are the site's own. Deck.jsx shows it as slides
// or as a scrolling page.

import { Fragment } from "react";
import Link from "next/link";
import SiteFooter, { EMAIL, PHONE_DISPLAY, DRE } from "../../components/SiteFooter";
import { LAYERS } from "../../components/Landing";
import STATS from "../../lib/landing-stats.json";
import CLIMATE from "../../lib/sf-climate.json";
import NSTATS from "../../lib/neighborhood-stats.json";
import MARKET from "../../lib/microclimate-market.json";
import REPORT from "../../market/report/web-stats.json";
import { allHoods } from "../../neighborhoods/lib";
import {
  BarRows, OceanSection, CityProfile, SunAngle, FogClock, DeckHeights, TempChart, RainChart,
} from "../charts";
import KoppenMap from "../KoppenMap";
import { BayMap, FogMapCard } from "../bay";
import { LotCross, NeighborShadow, SlopeCompare } from "../sun";
import MicroRealEstate from "../real-estate/MicroRealEstate";
import { Defs, PacificStorms } from "../el-nino/graphics";
import { TOPLINE as NINO, AS_OF, DEALS, CHECKLIST } from "../el-nino/content";
import {
  KOPPEN, LATITUDE, ENGINE, BAY_BULLETS, MICRO_FACTORS, BELTS_LEAD, BELTS, FOG_HOURS, FOG_HOURS_NOTE,
  BLOCK, LOT_BULLETS, DECK, FOG_TOPO, YEAR_BULLETS,
} from "../content";
import { COMPARE, TYPES, SECTIONS as GUIDE } from "../../property-types/content";
import { BUYER_REP, SELF_REP, DUAL, SELLER_REP, OFFERS, GROWTH_EVENTS } from "./content";
import GROWTH from "../../lib/city-growth.json";
import GrowthMap from "./GrowthMap";
import HScroll from "../../components/HScroll";
import Deck from "./Deck";

export const metadata = {
  title: "San Francisco Microclimates and Real Estate | Chuck Heaver",
  description:
    "A presentation on San Francisco's microclimates and what they mean for buying a home: the climate, the Bay, the city's four fog zones, prices by fog zone, sun and wind on the lot, the 2026–27 El Niño, and the data layers read for each property.",
};

const money = v => (v >= 1e6 ? `$${(v / 1e6).toFixed(2)}M` : `$${Math.round(v / 1e3)}K`);
const num = v => v.toLocaleString("en-US");
const dateLong = iso => new Date(`${iso}T12:00:00`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

const Bullets = ({ items }) => <ul className="mc-bullets dk-bullets">{items.map(b => <li key={b}>{b}</li>)}</ul>;

// One slide. tone: light (default), navy, cream.
function Slide({ tone = "light", kicker, title, wide, children }) {
  return (
    <section className={`dk-s dk-${tone}${wide ? " dk-wide" : ""}`}>
      <div className="dk-in"><div className="dk-fit">
        {kicker ? <p className="lp-kicker dk-k">{kicker}</p> : null}
        {title ? <h2 className="dk-h">{title}</h2> : null}
        {children}
      </div></div>
    </section>
  );
}

// The Microclimates page's four headline numbers, worked out the same way.
function topline() {
  const m = CLIMATE.months;
  const highs = m.map(d => d.high);
  const rain = m.reduce((a, d) => a + d.precip, 0);
  const wet = m.filter(d => ["Nov", "Dec", "Jan", "Feb", "Mar"].includes(d.m)).reduce((a, d) => a + d.precip, 0);
  const fog = Object.values(NSTATS.hoods).map(x => x.fogHours).filter(Number.isFinite);
  const h = STATS.houses;
  return [
    { v: `${Math.min(...fog)} – ${Math.max(...fog)}`, k: "hours of summer fog a day", s: "bayside → southwest" },
    { v: `${Math.max(...highs) - Math.min(...highs)}°F`, k: "between our coolest and warmest month", s: "most US cities: 40+" },
    { v: `${Math.round((wet / rain) * 100)}%`, k: "of the year's rain falls Nov – Mar", s: "July: none" },
    { v: `${(h.sun.median / h.persistentFog.median).toFixed(1)}×`, k: "house price, Sun vs Persistent Fog", s: `single-family, Jan 1 – ${dateLong(MARKET.through)}` },
  ];
}

// The map layers, described plainly for the slide (the home page's own
// wording is more conversational).
const PLAIN = {
  Transit: "Muni lines and stops, and the walking distance to them.",
  "Terrain/Elevation": "Elevation and slope at the address.",
  Bikes: "Protected lanes and bike routes, and the grade to reach them.",
  "Land Use": "What each surrounding parcel is zoned and built for, residential or commercial.",
};

// The Buyer Guide's sections, by id (app/property-types/content.js).
const G = Object.fromEntries(GUIDE.map(x => [x.id, x]));
const Facts = ({ sec }) => (
  <>
    <p className="pt-lead">{sec.lead}</p>
    <dl className="pt-facts">{sec.body.map(b => <div key={b.h}><dt>{b.h}</dt><dd>{b.p}</dd></div>)}</dl>
  </>
);

// Fog zones × the four property types (app/lib/microclimate-market.json, this
// year to date): how each zone's sales split by type, then the medians.
const ZCATS = [["sfh", "SFH"], ["condo", "Condo/TIC/Co-op"], ["duplex", "Duplex"], ["other", "Other (Tri+)"]];
const ZCOL = { sfh: "#203C5F", condo: "#E9BC3F", duplex: "#3C8D7F", other: "#6B6F75" };
const zy = (cat, z) => MARKET.grid[cat][z].y1;           // [n, median, avg, $/sf, dom, % of list]
const star = n => (n < 10 ? "*" : "");

function ZoneMix() {
  return (
    <div className="dk-mix">
      <p className="mc-fig-h">Share of each zone&rsquo;s sales, by type</p>
      {MARKET.zones.map(z => {
        const tot = zy("all", z.name)[0];
        return (
          <div className="dk-mix-r" key={z.name}>
            <span className="dk-mix-k"><i style={{ background: z.fill }} />{z.name}<small>{z.rng} · {num(tot)} sales</small></span>
            <span className="dk-mix-bar">
              {ZCATS.map(([c, l]) => {
                const n = zy(c, z.name)[0], pct = (100 * n) / tot;
                return pct > 0 ? <b key={c} style={{ width: `${pct}%`, background: ZCOL[c] }} title={`${l}: ${num(n)}`}>{pct >= 7 ? `${Math.round(pct)}%` : ""}</b> : null;
              })}
            </span>
          </div>
        );
      })}
      <p className="dk-mix-key">{ZCATS.map(([c, l]) => <span key={c}><i style={{ background: ZCOL[c] }} />{l}</span>)}</p>
    </div>
  );
}

function ZoneGrid() {
  return (
    <HScroll className="pt-cmp-wrap">
      <table className="pt-cmp dk-zg">
        <thead>
          <tr><th rowSpan="2">Fog zone</th>{ZCATS.map(([c, l]) => <th key={c} colSpan="3" className="g" style={{ borderTop: `3px solid ${ZCOL[c]}` }}>{l}</th>)}</tr>
          <tr>{ZCATS.map(([c]) => ["Median", "$/sf", "Sales"].map(h => <th key={c + h} className={h === "Median" ? "g" : ""}>{h}</th>))}</tr>
        </thead>
        <tbody>
          {MARKET.zones.map(z => (
            <tr key={z.name}>
              <th scope="row"><i className="dk-zsw" style={{ background: z.fill }} />{z.name}</th>
              {ZCATS.map(([c]) => {
                const [n, med, , ppsf] = zy(c, z.name);
                return [<td key="m" className="g"><b>{n ? money(med) : "—"}</b>{star(n)}</td>, <td key="p">{n ? `$${num(Math.round(ppsf))}` : "—"}</td>, <td key="n">{num(n)}</td>];
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </HScroll>
  );
}

// Homes built by decade and type, and housing age and type by fog zone
// (app/lib/city-growth.json, scripts/build-city-growth.py).
function DecadeBars() {
  const D = GROWTH.decades, max = Math.max(...D.map(d => Object.values(d.units).reduce((a, b) => a + b, 0)));
  const W = 760, H = 250, pl = 46, pb = 26, pt = 10, gw = (W - pl - 8) / D.length, bw = gw * 0.66;
  const Y = v => (v / max) * (H - pb - pt);
  return (
    <figure className="mc-fig dk-dec">
      <p className="mc-fig-h">Homes standing today, by decade built and type</p>
      <svg viewBox={`0 0 ${W} ${H}`} className="mc-svg" role="img" aria-label="Homes by decade built and type">
        {[0, 20000, 40000, 60000].filter(v => v <= max).map(v => (
          <g key={v}><line x1={pl} x2={W - 8} y1={H - pb - Y(v)} y2={H - pb - Y(v)} stroke="#E3E5E8" /><text x={pl - 6} y={H - pb - Y(v) + 4} textAnchor="end" className="dk-dec-ax">{v ? `${v / 1000}k` : "0"}</text></g>
        ))}
        {D.map((d, i) => {
          let y0 = H - pb;
          const x = pl + i * gw + (gw - bw) / 2;
          return (
            <g key={d.d}>
              {ZCATS.map(([c, l]) => { const v = d.units[c] || 0, hh = Y(v); y0 -= hh; return v ? <rect key={c} x={x} y={y0} width={bw} height={hh} fill={ZCOL[c]}><title>{`${d.d < 1900 ? "Before 1900" : d.d + "s"} · ${l}: ${num(v)}`}</title></rect> : null; })}
              <text x={x + bw / 2} y={H - 8} textAnchor="middle" className="dk-dec-ax">{d.d < 1900 ? "<1900" : `${String(d.d).slice(2)}s`}</text>
            </g>
          );
        })}
      </svg>
      <p className="dk-mix-key">{ZCATS.map(([c, l]) => <span key={c}><i style={{ background: ZCOL[c] }} />{l}</span>)}</p>
    </figure>
  );
}

function ZoneAge() {
  return (
    <HScroll className="pt-cmp-wrap">
      <table className="pt-cmp dk-zg">
        <thead><tr><th>Fog zone</th><th>Buildings</th><th>Median year built</th><th>Built before 1940</th>{ZCATS.map(([c, l]) => <th key={c} style={{ borderTop: `3px solid ${ZCOL[c]}` }}>{l}<br /><small>share of homes</small></th>)}</tr></thead>
        <tbody>
          {GROWTH.zones.map(z => {
            const zz = MARKET.zones.find(x => x.name === z.name);
            return (
              <tr key={z.name}>
                <th scope="row"><i className="dk-zsw" style={{ background: zz?.fill }} />{z.name}</th>
                <td>{num(z.buildings)}</td><td><b>{z.median}</b></td><td>{Math.round(z.pre1940 * 100)}%</td>
                {ZCATS.map(([c]) => <td key={c}>{Math.round(z.unitShare[c] * 100)}%</td>)}
              </tr>
            );
          })}
        </tbody>
      </table>
    </HScroll>
  );
}

const CREDS = [
  ["Meteorologist", "20 years · NBC, PBS, WGN"],
  ["Real estate", "35 years · residential, commercial and investment"],
  ["Brokerage", "Vanguard Properties, San Francisco · earlier in NYC, Chicago and South Florida"],
  ["Education", "The Ohio State University, Mississippi State"],
  ["Lived in", "Chicago, NYC, South Florida, Rio de Janeiro, Santiago and Germany"],
  ["Languages", "English, German, Portuguese, Spanish (in progress)"],
];

export default function Page() {
  const h = STATS.houses;
  const K = REPORT.kpis, Y = REPORT.ytd;
  const guides = Object.fromEntries(allHoods().map(x => [x.name, x.slug]));
  const thru = dateLong(MARKET.through);

  // [section, title] for the deck's menu, in slide order.
  const meta = [];
  const S = (section, title, el) => { meta.push({ section, title }); return el; };

  const slides = [
    S("Introduction", "Microclimates & Real Estate",
      <Slide tone="navy" wide>
        <div className="dk-title">
          <div>
            <p className="lp-kicker dk-k">San Francisco</p>
            <h1 className="dk-h1">Microclimates &amp; Real&nbsp;Estate</h1>
            <p className="dk-by"><b>Chuck Heaver</b><span>Realtor &amp; Meteorologist · Vanguard Properties</span></p>
          </div>
          <img className="dk-portrait" src="/brand/chuck-heaver-cutout.webp" alt="Chuck Heaver" width="760" height="866" />
        </div>
      </Slide>),

    S("Introduction", "Background",
      <Slide tone="cream" kicker="Chuck Heaver" title="Background">
        <ul className="dk-creds dk-creds-2">{CREDS.map(([b, t]) => <li key={b}><b>{b}</b>{t}</li>)}</ul>
      </Slide>),

    S("Introduction", "Key figures",
      <Slide tone="navy" kicker="San Francisco" title="Key figures">
        <div className="mc-topline dk-topline">
          {topline().map(t => (
            <div className="mc-top" key={t.k}>
              <div className="mc-top-v">{t.v}</div>
              <div className="mc-top-k">{t.k}</div>
              <div className="mc-top-s">{t.s}</div>
            </div>
          ))}
        </div>
      </Slide>),

    // ── The climate
    S("The Climate", `Köppen-Geiger: ${KOPPEN.code}`,
      <Slide kicker="The Climate" title={`Köppen-Geiger: ${KOPPEN.code}`}>
        <p className="mc-lead mc-lead-here">{KOPPEN.here}</p>
        <KoppenMap />
        <div className="mc-letters">
          {KOPPEN.letters.map(l => (
            <div className="mc-letter" key={l.k}>
              <div className="mc-letter-k" aria-hidden="true">{l.k}</div>
              <div><h3>{l.label}</h3><p>{l.p}</p></div>
            </div>
          ))}
        </div>
      </Slide>),

    S("The Climate", "July at the same latitude",
      <Slide kicker="The Climate" title="July afternoons at the same latitude">
        <BarRows rows={LATITUDE} max={100} unit="°F" head="July afternoon, same latitude" labelW={190} />
        <Bullets items={[KOPPEN.bullets[0]]} />
      </Slide>),

    S("The Climate", "Why summers are cool",
      <Slide kicker="The Climate" title="Why San Francisco summers are cool">
        <OceanSection />
        <div className="mc-engine">
          {ENGINE.map(p => (
            <div className="mc-part" key={p.n}>
              <span className="mc-part-n" aria-hidden="true">{p.n}</span>
              <div><h3>{p.h}</h3><p>{p.p}</p></div>
            </div>
          ))}
        </div>
      </Slide>),

    S("The Climate", "Temperature and rainfall",
      <Slide kicker="The Climate" title="Temperature and rainfall by month">
        <div className="dk-2 dk-2-even">
          <TempChart months={CLIMATE.months} />
          <RainChart months={CLIMATE.months} />
        </div>
        <Bullets items={YEAR_BULLETS} />
      </Slide>),

    S("The Bay", "Bay Area microclimates",
      <Slide kicker="The Bay" title="Bay Area microclimates">
        <BayMap />
        <Bullets items={BAY_BULLETS} />
      </Slide>),

    // ── The city
    S("The City", "What shapes the microclimates",
      <Slide kicker="The City" title="What shapes San Francisco&rsquo;s microclimates">
        <dl className="mc-factors dk-factors">
          {MICRO_FACTORS.map(f => <div className="mc-factor" key={f.k}><dt>{f.k}</dt><dd>{f.p}</dd></div>)}
        </dl>
      </Slide>),

    S("The City", "Advection fog",
      <Slide kicker="The City" title="Advection Fog">
        <FogMapCard />
        <FogClock />
      </Slide>),

    S("The City", "Fog depth and terrain",
      <Slide kicker="The City" title="Fog depth and terrain">
        <DeckHeights decks={DECK} />
        <div className="mc-cards mc-cards-3">
          {FOG_TOPO.map(c => <div className="mc-card" key={c.h}><h3>{c.h}</h3><Bullets items={c.bullets} /></div>)}
        </div>
      </Slide>),

    S("The City", "The central ridge",
      <Slide kicker="The City" title="The central ridge">
        <p className="mc-lead">{BELTS_LEAD}</p>
        <CityProfile />
      </Slide>),

    S("The City", "Four fog zones",
      <Slide kicker="The City" title="The four fog zones" wide>
        <div className="mc-belts">
          {BELTS.map(b => (
            <div className="mc-belt" key={b.key} style={{ "--b": b.color }}>
              <div className="mc-belt-top"><span className="mc-belt-swatch" aria-hidden="true" /><h3>{b.name}</h3></div>
              <div className="mc-belt-stats">
                <div><b>{b.hours}</b><span>fog hrs / day</span></div>
                <div><b>{b.count}</b><span>neighborhoods</span></div>
              </div>
              <Bullets items={b.bullets} />
              <p className="mc-belt-where">{b.where}</p>
            </div>
          ))}
        </div>
      </Slide>),

    S("The City", "Fog hours by neighborhood",
      <Slide kicker="The City" title="Summer fog hours by neighborhood">
        <BarRows rows={FOG_HOURS.map(r => ({ ...r, v: r.v.toFixed(1) * 1 }))} max={13} unit="h" head="Summer fog, hours a day" labelW={150} caption={FOG_HOURS_NOTE} />
      </Slide>),

    // ── Real estate
    S("Real Estate", "How the city was built out",
      <Slide kicker="Real Estate · How the city grew" title="How the city was built out" wide>
        <GrowthMap land={MARKET.map.land} hoods={MARKET.hoods.map(x => x.d)} events={GROWTH_EVENTS} w={MARKET.map.w} h={MARKET.map.h} />
        <p className="mc-cap">Every residential building on the San Francisco Assessor&rsquo;s {num(GROWTH.buildings)}-building roll, by the year built as the Assessor records it; condo units are counted in their building. Many older buildings carry the year 1900, so dates before 1906 are shown together. Buildings later demolished are not on the roll.</p>
      </Slide>),

    S("Real Estate", "Housing age and type by fog zone",
      <Slide kicker="Real Estate · How the city grew" title="Housing age and type by fog zone" wide>
        <div className="dk-age">
          <DecadeBars />
          <div><p className="mc-fig-h">By summer fog zone</p><ZoneAge /></div>
        </div>
        <p className="mc-cap">San Francisco Assessor&rsquo;s secured roll; homes = residential units, with each condo unit counted once and dated by its building&rsquo;s year built (not the year it became a condo). Fog zone at each building, from the site&rsquo;s USGS summer fog data. Types follow the site&rsquo;s four categories.</p>
      </Slide>),

    S("Real Estate", "Sales by fog zone and type",
      <Slide kicker={`Real Estate · Jan 1 – ${thru}`} title="Sales by fog zone and property type" wide>
        <ZoneMix />
        <ZoneGrid />
        <p className="mc-cap">Closed sales, each counted by the fog zone at the property. Medians. $/sf uses only sales with reported square footage. * fewer than 10 sales. SFH = Single Family Residence, Halfplex and 2 Houses on Lot; Other (Tri+) = triplexes, fourplexes, 5+ units and the other types.</p>
      </Slide>),

    S("Real Estate", "Prices by neighborhood",
      <Slide kicker={`Real Estate · Jan 1 – ${thru}`} title="Prices by neighborhood and fog zone" wide>
        <div className="mre dk-mre"><MicroRealEstate data={MARKET} guides={guides} /></div>
      </Slide>),

    S("Real Estate", "The 2026 market",
      <Slide kicker="Real Estate" title={`By the Numbers: ’${K.yy} vs ’${K.py} YTD (${K.through})`} wide>
        <div className="dk-ratio dk-ratio-3">
          <div><b>{num(Y.units)}</b><span>homes sold, vs {num(Y.unitsPrior)}</span></div>
          <div><b>${(Y.vol / 1e9).toFixed(2)}B</b><span>sales volume, vs ${(Y.volPrior / 1e9).toFixed(2)}B</span></div>
          <div><b>{num(STATS.parcels)}</b><span>parcels mapped, each sale placed in its fog zone</span></div>
        </div>
        <div className="lp-stats mr-band dk-band">
          <div className="lp-sbox-row">
            {K.boxes.map(bx => (
              <div className={`lp-sbox lp-sbox-${bx.key}`} key={bx.key}>
                <div className="lp-sbox-h">{bx.title}</div>
                {bx.rows.map(r => (
                  <div className={`lp-sbox-r${r.big ? " lp-sbox-big" : ""}`} key={r.label}>
                    <div className="lp-sbox-l">{r.label}{r.chg ? <>: <b>{r.chg}</b></> : null}</div>
                    <div className="lp-sbox-v">{r.now}<span className="lp-stat-prior">{r.then}</span></div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </Slide>),

    // ── The block and the lot
    S("The Block", "Block-level factors",
      <Slide kicker="The Block" title="Wind, sun angle, elevation and grade">
        <div className="mc-cards mc-cards-2">
          {BLOCK.map(c => <div className="mc-card" key={c.h}><h3>{c.h}</h3><Bullets items={c.bullets} /></div>)}
        </div>
      </Slide>),

    S("The Block", "Sun angle on the lot",
      <Slide kicker="The Block" title="Sun angle on the lot">
        <SunAngle />
        <LotCross />
        <Bullets items={LOT_BULLETS} />
      </Slide>),

    S("The Block", "Shadows and slope",
      <Slide kicker="The Block" title="Shadows and slope">
        <NeighborShadow />
        <SlopeCompare />
      </Slide>),

    S("The Block", "Property data layers",
      <Slide tone="cream" kicker="The Block" title="Property data layers">
        <div className="dk-layers">
          {LAYERS.map(l => (
            <Link key={l.k} href={l.href} className="lp-block-layer">
              <span className="lp-block-layer-k">{l.k} <i aria-hidden="true">&rarr;</i></span>
              <span className="lp-block-layer-d">{PLAIN[l.k] || l.d}</span>
            </Link>
          ))}
        </div>
      </Slide>),

    // ── Being covered
    S("Risk", "El Niño 2026–27",
      <Slide kicker={`This winter · NOAA ${AS_OF.status}, ${AS_OF.date}`} title="El Niño 2026–27" wide>
        <div className="mc-topline dk-topline dk-topline-light">
          {NINO.map(t => (
            <div className="mc-top" key={t.k}>
              <div className="mc-top-v">{t.v}</div>
              <div className="mc-top-k">{t.k}</div>
              <div className="mc-top-s">{t.s}</div>
            </div>
          ))}
        </div>
        <Defs />
        <div className="mc-scroll"><PacificStorms /></div>
      </Slide>),

    S("Risk", "Disclosures and storm preparation",
      <Slide kicker="Risk" title="Disclosures and storm preparation">
        <div className="dk-2 dk-2-even">
          <div><p className="mc-fig-h">Disclosures and inspections</p><Bullets items={DEALS} /></div>
          <div><p className="mc-fig-h">{CHECKLIST[0].h}: protecting the house</p><Bullets items={CHECKLIST[0].items} /></div>
        </div>
      </Slide>),

    // ── Buying: the Buyer Guide's material (app/property-types/content.js)
    S("Buying", "Types of real estate",
      <Slide kicker="Buying" title="Types of real estate" wide>
        <div className="pt-cmp-wrap">
          <table className="pt-cmp">
            <thead><tr><th scope="col">Type</th>{COMPARE.cols.map(c => <th key={c} scope="col">{c}</th>)}</tr></thead>
            <tbody>{COMPARE.rows.map(r => <tr key={r.key}><th scope="row">{r.name}</th>{r.cells.map((c, k) => <td key={k}>{c}</td>)}</tr>)}</tbody>
          </table>
        </div>
      </Slide>),

    S("Buying", "Financing and what to watch, by type",
      <Slide kicker="Buying" title="Financing and what to watch, by type" wide>
        <div className="pt-types dk-types">
          {TYPES.map(t => (
            <section className="pt-type" key={t.key}>
              <h2>{t.name}</h2>
              <p className="pt-type-short">{t.short}</p>
              <p className="pt-what">{t.what}</p>
              <h3>Financing</h3>
              <ul>{t.financing.map((x, k) => <li key={k}>{x}</li>)}</ul>
              <h3>Watch for</h3>
              <ul>{t.watch.map((x, k) => <li key={k}>{x}</li>)}</ul>
            </section>
          ))}
        </div>
      </Slide>),

    S("Buying", G.financing.title,
      <Slide kicker="Buying" title={G.financing.title}>
        <p className="pt-lead">{G.financing.lead}</p>
        <ol className="pt-steps">
          {G.financing.steps.map((st, k) => <li key={st.h}><span className="pt-step-n">{k + 1}</span><b>{st.h}</b><span>{st.p}</span></li>)}
        </ol>
        <dl className="pt-facts">{G.financing.body.map(b => <div key={b.h}><dt>{b.h}</dt><dd>{b.p}</dd></div>)}</dl>
      </Slide>),

    S("Buying", BUYER_REP.title,
      <Slide kicker="Representation" title={BUYER_REP.title} wide>
        <div className="dk-2">
          <div><Facts sec={BUYER_REP} /></div>
          <div><p className="mc-fig-h">{SELF_REP.title}</p><dl className="pt-facts">{SELF_REP.body.map(b => <div key={b.h}><dt>{b.h}</dt><dd>{b.p}</dd></div>)}</dl></div>
        </div>
      </Slide>),

    S("Buying", "Dual agency and seller representation",
      <Slide kicker="Representation" title="Dual agency and seller representation" wide>
        <div className="dk-2 dk-2-even">
          <div>
            <p className="mc-fig-h">{DUAL.title}</p>
            <p className="pt-lead">{DUAL.lead}</p>
            <div className="dk-pc">
              <div><p className="dk-pc-h">Pros</p><ul className="dk-terms">{DUAL.pros.map(b => <li key={b.h}><b>{b.h}</b>{b.p}</li>)}</ul></div>
              <div><p className="dk-pc-h">Cons</p><ul className="dk-terms">{DUAL.cons.map(b => <li key={b.h}><b>{b.h}</b>{b.p}</li>)}</ul></div>
            </div>
          </div>
          <div><p className="mc-fig-h">{SELLER_REP.title}</p><Facts sec={SELLER_REP} /></div>
        </div>
      </Slide>),

    S("Buying", OFFERS.title,
      <Slide kicker="Buying" title={OFFERS.title} wide>
        <p className="pt-lead dk-key">{OFFERS.lead}</p>
        <ol className="pt-steps">
          {OFFERS.steps.map((st, k) => <li key={st.h}><span className="pt-step-n">{k + 1}</span><b>{st.h}</b><span>{st.p}</span></li>)}
        </ol>
        <dl className="pt-facts">{OFFERS.body.map(b => <div key={b.h}><dt>{b.h}</dt><dd>{b.p}</dd></div>)}</dl>
        <p className="dk-next">{OFFERS.next} &rarr;</p>
      </Slide>),

    S("Buying", G.disclosure.title,
      <Slide kicker="Buying" title={G.disclosure.title} wide>
        <div className="dk-2 dk-2-even">
          <div><Facts sec={G.disclosure} /></div>
          <div><p className="mc-fig-h">{G.units.title}</p><Facts sec={G.units} /></div>
        </div>
      </Slide>),

    S("Buying", G.insurance.title,
      <Slide kicker="Buying" title={G.insurance.title}>
        <Facts sec={G.insurance} />
      </Slide>),

    S("Buying", "Property taxes and special districts",
      <Slide kicker="Buying" title="Property taxes and special districts" wide>
        <div className="dk-2 dk-2-even">
          <div><p className="mc-fig-h">{G.taxes.title}</p><Facts sec={G.taxes} /></div>
          <div><p className="mc-fig-h">{G.districts.title}</p><Facts sec={G.districts} /></div>
        </div>
      </Slide>),

    S("Sources", "Data sources",
      <Slide kicker="Sources" title="Data sources">
        <ul className="dk-creds dk-creds-2">
          <li><b>Climate normals</b>NOAA / National Weather Service, downtown San Francisco station</li>
          <li><b>Summer fog hours</b>USGS analysis of GOES satellite imagery, 1999–2009</li>
          <li><b>Sales</b>SFAR MLS closed sales, Jan 1 – {thru}, and the same stretch of {MARKET.year - 1}</li>
          <li><b>Property type and parcels</b>City and County of San Francisco land use and zoning; {num(STATS.parcels)} parcels</li>
          <li><b>El Niño</b>NOAA Climate Prediction Center, {AS_OF.date}</li>
          <li><b>Terrain and slope</b>USGS 10 m elevation</li>
          <li><b>Year built and housing type</b>San Francisco Assessor, secured property roll (DataSF); timeline facts from the site&rsquo;s neighborhood guides and the National Park Service (1906)</li>
          <li><b>Representation and offers</b>California DRE (AB 2992, in force Jan 1 2025); Civil Code §§ 2079.14, 2079.21, 1675; C.A.R. Residential Purchase Agreement. General information, not legal advice</li>
        </ul>
      </Slide>),

    S("Close", "Chuck Heaver",
      <Slide tone="navy" wide>
        <div className="dk-title">
          <div>
            <h2 className="dk-h1 dk-h1-sm">Chuck Heaver</h2>
            <p className="dk-by"><span>Realtor &amp; Meteorologist · DRE #{DRE} · Vanguard Properties</span><span>{EMAIL}</span><span>{PHONE_DISPLAY}</span></p>
          </div>
          <img className="dk-portrait" src="/brand/chuck-heaver-cutout.webp" alt="" width="760" height="866" />
        </div>
      </Slide>),
  ];

  return (
    <div className="lp dk-page">
      <Deck meta={meta}>{slides.map((el, k) => <Fragment key={k}>{el}</Fragment>)}</Deck>
      <SiteFooter note={<>Climate normals: NOAA/NWS, downtown San Francisco station. Fog hours: USGS analysis of GOES satellite imagery, 1999–2009.
        Sales: SFAR MLS closed sales, Jan 1 – {thru}, against the same stretch of {MARKET.year - 1}; fog-zone house prices are single-family homes only,
        each counted by the fog zone at the house. El Niño: NOAA, {AS_OF.date}. Diagrams are schematic. General information, not a forecast for any property
        or advice on insurance, engineering, law or representation. Deemed reliable, not guaranteed.</>} />
    </div>
  );
}
