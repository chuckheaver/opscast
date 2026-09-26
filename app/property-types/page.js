// Buyer/seller primer on the five ways property is owned in San Francisco,
// plus the three things that cost people money: what is in the disclosure
// package, how the tax bill actually works, and special tax districts.

import Link from "next/link";
import SiteFooter, { EMAIL } from "../components/SiteFooter";
import { TYPES, SECTIONS, DISCLAIMER } from "./content";

export const metadata = {
  title: "Types of Real Estate in San Francisco — Chuck Heaver",
  description:
    "Single family, condo, TIC, co-op and multi-unit in San Francisco: how each one is owned, how each one is financed, and what to check before you write. Plus the 3R report and legal unit counts, the disclosure package, property taxes and Mello-Roos districts.",
};

export default function Page() {
  return (
    <div className="lp">
      <header className="lp-nav lp-nav-solid">
        <Link href="/" className="lp-logo">
          <span className="lp-logo-name">Chuck Heaver</span>
          <span className="lp-logo-sub">San Francisco Realtor · Meteorologist</span>
        </Link>
        <nav className="lp-nav-links">
          <Link href="/neighborhoods">Neighborhoods</Link>
          <Link href="/fog?preset=fog">The Map</Link>
          <a className="lp-nav-cta" href={`mailto:${EMAIL}`}>Work With Me</a>
        </nav>
      </header>

      <section className="lp-guide-head">
        <p className="lp-kicker">San Francisco Buyer &amp; Seller Guide</p>
        <h1 className="lp-guide-h1">Types of Real Estate</h1>
        <p className="lp-guide-lede">
          Five ways property is owned here, and they are not interchangeable — each
          one finances differently, resells differently, and carries its own way of
          going wrong. Then the three things that cost people real money: the
          disclosure package, the tax bill, and special tax districts.
        </p>
      </section>

      <div className="pt-toc">
        <nav>
          {TYPES.map(t => <a key={t.key} href={`#${t.key}`}>{t.name}</a>)}
          <span className="pt-toc-sep" aria-hidden="true" />
          {SECTIONS.map(s => <a key={s.id} href={`#${s.id}`}>{s.title.replace(/^The /, "")}</a>)}
        </nav>
      </div>

      <article className="pt-body">
        {TYPES.map(t => (
          <section className="pt-type" id={t.key} key={t.key}>
            <div className="pt-type-head">
              <h2>{t.name}</h2>
              <p className="pt-type-short">{t.short}</p>
            </div>
            <p className="pt-what">{t.what}</p>
            <div className="pt-cols">
              <div>
                <h3>Financing</h3>
                <ul>{t.financing.map((x, i) => <li key={i}>{x}</li>)}</ul>
              </div>
              <div>
                <h3>What to check</h3>
                <ul>{t.watch.map((x, i) => <li key={i}>{x}</li>)}</ul>
              </div>
            </div>
          </section>
        ))}

        {SECTIONS.map(s => (
          <section className="pt-sec" id={s.id} key={s.id}>
            <p className="lp-kicker">{s.kicker}</p>
            <h2>{s.title}</h2>
            <p className="pt-lead">{s.lead}</p>
            {s.body.map(b => (
              <div className="pt-block" key={b.h}>
                <h3>{b.h}</h3>
                <p>{b.p}</p>
              </div>
            ))}
          </section>
        ))}

        <section className="pt-cta">
          <div>
            <h2>Not sure which one you are looking at?</h2>
            <p>
              Send me the address. I will tell you what it is, what the records say
              about it, and what it will actually cost you to own.
            </p>
          </div>
          <a className="lp-btn lp-btn-gold" href={`mailto:${EMAIL}?subject=Question%20about%20a%20property`}>
            Ask me about a property
          </a>
        </section>

        <p className="pt-disclaimer">{DISCLAIMER}</p>
      </article>

      <SiteFooter />
    </div>
  );
}
