// El Niño 2026–27: how it works, what past strong events did here, and what
// homeowners can do. Informational only — nothing in the stats, reports or
// other pages reads it. Words in content.js, drawings in graphics.jsx.

import Link from "next/link";
import SiteFooter from "../../components/SiteFooter";
import { BarRows } from "../charts";
import { Defs, Pacific, Jet, KELVIN_SCENES, Strength, Stack, PacificStorms, RiverLands } from "./graphics";
import {
  AS_OF, LEDE, TOPLINE, WORDS, STATES, STORMS, KELVIN, STACK, HISTORY, TAHOE, WINE, CHECKLIST, DEALS, SOURCES, DISCLAIMER,
} from "./content";

export const metadata = {
  title: "El Niño 2026–27: What It Means for Bay Area Homes | Chuck Heaver",
  description:
    "How El Niño and La Niña work, Kelvin waves and higher sea levels, what past strong El Niños did in San Francisco, " +
    "Lake Tahoe and Napa–Sonoma wine country, and what homeowners can do before the storms.",
};

const TOC = [
  ["how", "How it works"],
  ["storms", "Storms"],
  ["strength", "This year"],
  ["history", "Past events"],
  ["seas", "Higher seas"],
  ["tahoe", "Lake Tahoe"],
  ["wine", "Wine country"],
  ["protect", "Protect your home"],
  ["deals", "Buying & selling"],
];

const Bullets = ({ items }) => <ul className="mc-bullets">{items.map(b => <li key={b}>{b}</li>)}</ul>;

function Card({ n, h, when, children, p, read, tone }) {
  return (
    <li className={`fs-step${tone ? ` en-${tone}` : ""}`}>
      <div className="fs-head">
        <span className="fs-n" aria-hidden="true">{n}</span>
        <div><h4>{h}</h4><em>{when}</em></div>
      </div>
      {children}
      <p>{p}</p>
      {read && (
        <div className="fs-read">
          {read.map(([k, v]) => <span key={k}>{k} <b>{v}</b></span>)}
        </div>
      )}
    </li>
  );
}

export default function Page() {
  return (
    <div className="lp">
      <Defs />
      <section className="lp-guide-head">
        <p className="lp-kicker">Microclimates · NOAA {AS_OF.status}, as of {AS_OF.date}</p>
        <h1 className="lp-guide-h1">El Niño 2026–27</h1>
        <p className="lp-guide-lede">{LEDE}</p>
        <div className="mc-topline">
          {TOPLINE.map(t => (
            <div className="mc-top" key={t.k}>
              <div className="mc-top-v">{t.v}</div>
              <div className="mc-top-k">{t.k}</div>
              <div className="mc-top-s">{t.s}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="pt-toc">
        <nav>{TOC.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}</nav>
      </div>

      <article className="pt-body mc-body en-body">

        <section className="pt-sec" id="how">
          <h2>How El Niño and La Niña Work</h2>
          <dl className="fs-words">
            {WORDS.map(w => <div key={w.k}><dt>{w.k}</dt><dd>{w.p}</dd></div>)}
          </dl>
          <h4 className="fs-part">Three states of the Pacific · in the tropics, and over the North Pacific</h4>
          <ol className="fs-steps en-states">
            {STATES.map((s, i) => (
              <Card key={s.key} n={i + 1} h={s.h} when={s.when} p={s.p} read={s.read} tone={s.tone}>
                <div className="en-pair">
                  <div><p className="en-sub">In the tropics</p><Pacific state={s.key} /></div>
                  <div><p className="en-sub">Over the North Pacific</p><Jet state={s.key} /></div>
                </div>
              </Card>
            ))}
          </ol>
          <p className="mc-cap">Schematic cross-sections along the equator, west to east, and storm-track maps; not to scale [3].</p>
        </section>

        <section className="pt-sec" id="storms">
          <h2>How El Niño Feeds Storms: The Pineapple Express</h2>
          <figure className="mc-fig">
            <div className="mc-scroll"><PacificStorms /></div>
            <ol className="en-steps5">
              {STORMS.steps.map((s, i) => <li key={s.h}><span className="fs-n" aria-hidden="true">{i + 1}</span><div><b>{s.h}</b><p>{s.p}</p></div></li>)}
            </ol>
          </figure>
          <figure className="mc-fig">
            <p className="mc-fig-h">When the river reaches land</p>
            <div className="mc-scroll"><RiverLands /></div>
          </figure>
          <Bullets items={STORMS.facts} />
          <p className="mc-cap">Schematic maps, not to scale; an El Niño winter pattern, not a forecast for any storm [3][18].</p>
        </section>

        <section className="pt-sec" id="strength">
          <h2>This Year&rsquo;s Event</h2>
          <Strength />
          <Bullets items={[
            `NOAA: ${AS_OF.status}. A strong to very strong El Niño is likely through January–March 2027 (greater than 83% chance) [1].`,
            "El Niño tilts the odds toward a wet California winter, and the tilt is strongest in Southern California. It does not decide any one storm.",
            `NOAA updates its outlook monthly; the next is ${AS_OF.next}.`,
          ]} />
        </section>

        <section className="pt-sec" id="history">
          <h2>What Strong El Niños Did Here</h2>
          <BarRows
            head="Downtown San Francisco rain, % of normal for the water year"
            rows={[
              { k: "Normal year", v: 100 },
              { k: "1982–83", v: 167 },
              { k: "1997–98", v: 203, hi: true },
              { k: "2015–16", v: 101 },
            ]}
            max={210} unit="%"
            caption="Water years run October to September [4]."
          />
          <div className="en-hist">
            {HISTORY.map(h => (
              <div key={h.yr} className={`en-hist-c${h.now ? " now" : ""}`}>
                <div className="en-hist-h"><b>{h.yr}</b><span>{h.tag}</span></div>
                <ul>{h.facts.map(f => <li key={f}>{f}</li>)}</ul>
              </div>
            ))}
          </div>
        </section>

        <section className="pt-sec" id="seas">
          <h2>Higher Seas: Kelvin Waves</h2>
          <ol className="fs-steps">
            {KELVIN.map((k, i) => {
              const S = KELVIN_SCENES[i];
              return <Card key={k.h} n={i + 1} h={k.h} when={k.when} p={k.p}><S /></Card>;
            })}
          </ol>
          <p className="mc-cap">Schematic, not to scale. Sea-level figures [6][7][8][9].</p>
          <p className="mc-lead mc-lead-here en-lead">{STACK.lead}</p>
          <Stack layers={STACK.layers} />
          <h3 className="en-h3">Where it shows up</h3>
          <Bullets items={STACK.where} />
        </section>

        <section className="pt-sec" id="tahoe">
          <h2>Lake Tahoe: Heavy Snow</h2>
          <Bullets items={TAHOE.facts} />
          <h3 className="en-h3">For Tahoe homeowners</h3>
          <ul className="en-checks">{TAHOE.todo.map(t => <li key={t}>{t}</li>)}</ul>
        </section>

        <section className="pt-sec" id="wine">
          <h2>Napa and Sonoma Valleys</h2>
          <Bullets items={WINE.facts} />
          <h3 className="en-h3">For wine-country property owners</h3>
          <ul className="en-checks">{WINE.todo.map(t => <li key={t}>{t}</li>)}</ul>
        </section>

        <section className="pt-sec" id="protect">
          <h2>Protect Your Home</h2>
          <div className="en-plan">
            {CHECKLIST.map(c => (
              <div key={c.h} className="en-plan-c">
                <h3>{c.h}</h3>
                <ul className="en-checks">{c.items.map(t => <li key={t}>{t}</li>)}</ul>
              </div>
            ))}
          </div>
        </section>

        <section className="pt-sec" id="deals">
          <h2>Buying and Selling</h2>
          <Bullets items={DEALS} />
        </section>

        <section className="pt-sec en-sources">
          <h3 className="en-h3">Sources</h3>
          <ol>{SOURCES.map(s => <li key={s}>{s}</li>)}</ol>
        </section>

        <p className="pt-disclaimer">{DISCLAIMER} See also <Link href="/microclimates">San Francisco Microclimates</Link>.</p>
      </article>

      <SiteFooter />
    </div>
  );
}
