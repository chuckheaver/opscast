// One neighborhood's guide page. Editorial content is authored; every number
// is computed from the live sales file, so the two never drift apart.

import Link from "next/link";
import { notFound } from "next/navigation";
import {
  NAMES, slugify, nameForSlug, contentFor, statsFor,
  money, ZONE_COLOR, windowLabel, statsYear,
} from "../lib";

export function generateStaticParams() {
  return NAMES.map(n => ({ slug: slugify(n) }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const name = nameForSlug(slug);
  if (!name) return { title: "Neighborhood — Chuck Heaver" };
  const c = contentFor(name);
  const s = statsFor(name);
  const price = s?.sfhMedian ? ` Houses median ${money(s.sfhMedian)}.` : "";
  return {
    title: `${name} — San Francisco Neighborhood Guide | Chuck Heaver`,
    description: `${c?.spirit || `Living in ${name}, San Francisco.`}${price}`,
  };
}

// Every figure is reported, however few sales are behind it. The sale count
// rides with each median so the reader can weigh it themselves.
const Stat = ({ label, value, sub }) =>
  value == null ? null : (
    <div className="lp-nstat">
      <div className="lp-nstat-v">{value}</div>
      <div className="lp-nstat-l">{label}{sub ? <span className="lp-fine"> {sub}</span> : null}</div>
    </div>
  );

export default async function Page({ params }) {
  const { slug } = await params;
  const name = nameForSlug(slug);
  if (!name) notFound();
  const c = contentFor(name);
  if (!c) notFound();
  const s = statsFor(name);
  const heading = c.title || name;

  return (
    <div className="lp">
      <header className="lp-nav lp-nav-solid">
        <Link href="/" className="lp-logo">
          <span className="lp-logo-name">Chuck Heaver</span>
          <span className="lp-logo-sub">San Francisco Realtor · Meteorologist</span>
        </Link>
        <nav className="lp-nav-links">
          <Link href="/neighborhoods">All Neighborhoods</Link>
          <Link href="/fog?preset=fog">The Map</Link>
          <a className="lp-nav-cta" href={`mailto:chuck.heaver@vanguardproperties.com?subject=${encodeURIComponent(name)}`}>Ask About {name}</a>
        </nav>
      </header>

      <article className="lp-nh">
        <p className="lp-crumb"><Link href="/neighborhoods">San Francisco Neighborhoods</Link> · {heading}</p>
        <div className="lp-nh-head">
          <h1>{heading}</h1>
          {c.aka && <span className="lp-aka">also {c.aka}</span>}
          {s?.zone && <span className="lp-zone" style={{ "--z": ZONE_COLOR[s.zone] }}>{s.zone} zone</span>}
        </div>
        <p className="lp-nh-spirit">{c.spirit}</p>

        {c.reasons?.length ? (
          <ul className="lp-reasons">
            {c.reasons.map(r => <li key={r}>{r}</li>)}
          </ul>
        ) : null}

        {s && s.n > 0 && (
          <section className="lp-nstats">
            <Stat label="Median house" value={money(s.sfhMedian)} sub={s.sfhN ? `${s.sfhN} sold` : null} />
            <Stat label="Median condo / TIC" value={money(s.condoMedian)} sub={s.condoN ? `${s.condoN} sold` : null} />
            <Stat label="Per square foot" value={s.ppsf ? `$${Math.round(s.ppsf).toLocaleString("en-US")}` : null} />
            <Stat label="Days to sell" value={s.dom != null ? Math.round(s.dom) : null} sub="median" />
            <Stat label="Summer fog" value={Number.isFinite(s.fogHours) ? `${s.fogHours.toFixed(1)}h` : null} sub="a day" />
            <Stat label="Homes sold" value={s.n} sub={statsYear} />
          </section>
        )}

        {c.history && (
          <section className="lp-nsec">
            <h2>The story</h2>
            <p>{c.history}</p>
          </section>
        )}

        {c.facts?.length ? (
          <section className="lp-nsec">
            <h2>Things most people don&rsquo;t know</h2>
            <div className="lp-facts">
              {c.facts.map(f => (
                <div key={f.title} className="lp-fact">
                  <h3>{f.title}</h3>
                  <p>{f.text}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {(c.restaurants?.length || c.bars?.length) && (
          <section className="lp-nsec">
            <h2>{c.nearby?.length ? `Eating and drinking near ${name}` : "Eating and drinking"}</h2>
            {c.nearby?.length ? (
              <p className="lp-fine">
                {name} is primarily residential — these sit in {c.nearby.join(", ")}.
              </p>
            ) : null}
            <div className="lp-venues">
              {c.restaurants?.length ? (
                <div>
                  <h3>Restaurants</h3>
                  <ul>{c.restaurants.map(r => (
                    <li key={r.name}>
                      {r.url ? <a href={r.url} target="_blank" rel="noopener noreferrer">{r.name}</a> : r.name}
                      {r.address ? <span className="lp-fine"> · {r.address}</span> : null}
                    </li>
                  ))}</ul>
                </div>
              ) : null}
              {c.bars?.length ? (
                <div>
                  <h3>Bars</h3>
                  <ul>{c.bars.map(b => (
                    <li key={b.name}>
                      {b.url ? <a href={b.url} target="_blank" rel="noopener noreferrer">{b.name}</a> : b.name}
                      {b.address ? <span className="lp-fine"> · {b.address}</span> : null}
                    </li>
                  ))}</ul>
                </div>
              ) : null}
            </div>
          </section>
        )}

        {(c.transit || c.hospital) && (
          <section className="lp-nsec">
            <h2>Getting around and getting care</h2>
            {c.transit ? <p><b>Transit.</b> {c.transit}</p> : null}
            {c.hospital ? (
              <p style={{ marginTop: 10 }}>
                <b>Nearest hospital.</b>{" "}
                {c.hospital.url ? <a href={c.hospital.url} target="_blank" rel="noopener noreferrer">{c.hospital.name}</a> : c.hospital.name}
                {c.hospital.address ? `, ${c.hospital.address}` : ""}
                {c.hospital.dist ? ` (${c.hospital.dist})` : ""}
              </p>
            ) : null}
          </section>
        )}

        <section className="lp-nh-cta">
          <div>
            <h2>Thinking about {name}?</h2>
            <p>
              Send me an address and I will come back with its sun, wind and fog,
              what is under it, and what has closed on the block.
            </p>
          </div>
          <div className="lp-nh-cta-btns">
            <a className="lp-btn lp-btn-gold" href={`mailto:chuck.heaver@vanguardproperties.com?subject=${encodeURIComponent(name)}`}>Ask me about {name}</a>
            <Link className="lp-btn lp-btn-ghost" href="/fog?preset=fog">See it on the map</Link>
          </div>
        </section>
      </article>

      <footer className="lp-foot">
        <div className="lp-foot-inner">
          <div>
            <div className="lp-logo-name">Chuck Heaver</div>
            <p className="lp-fine">Realtor, Vanguard Properties · San Francisco</p>
          </div>
          <div className="lp-foot-links">
            <Link href="/neighborhoods">All neighborhoods</Link>
            <Link href="/fog?preset=fog">Map</Link>
            <Link href="/market">Market</Link>
          </div>
        </div>
        <p className="lp-fine lp-foot-fine">
          Prices are {statsYear} closed sales from SFAR MLS{windowLabel ? ` (${windowLabel})` : ""},
          matched to the neighborhood each home physically sits in. Every sale is included,
          and the &ldquo;sold&rdquo; count beside each median says how many it is drawn from.
          Fog hours are the median daily summer figure from USGS-derived contours.
          Deemed reliable, not guaranteed.
        </p>
      </footer>
    </div>
  );
}
