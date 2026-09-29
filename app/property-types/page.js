// Buyer/seller primer on the five ways property is owned in San Francisco,
// plus the three things that cost people money: what is in the disclosure
// package, how the tax bill actually works, and special tax districts.

import Link from "next/link";
import SiteFooter, { EMAIL } from "../components/SiteFooter";
import { COMPARE, TYPES, SECTIONS, DISCLAIMER } from "./content";

export const metadata = {
  title: "Types of Real Estate in San Francisco — Chuck Heaver",
  description:
    "Single family, condo, TIC, co-op and multi-unit in San Francisco: how each one is owned, how each one is financed, and what to check before you write. Plus pre-qualification vs pre-approval, the 3R report and legal unit counts, the disclosure package, getting an insurance quote, property taxes and Mello-Roos districts.",
};

export default function Page() {
  return (
    <div className="lp">

      <section className="lp-guide-head">
        <p className="lp-kicker">San Francisco Buyer &amp; Seller Guide</p>
        <h1 className="lp-guide-h1">Types of Real Estate</h1>
        <p className="lp-guide-lede">
          Five ways to own in San Francisco, and what it takes to buy each one — in one-line facts.
        </p>
      </section>

      <div className="pt-toc">
        <nav>
          <a href="#compare">At a glance</a>
          {TYPES.map(t => <a key={t.key} href={`#${t.key}`}>{t.name.replace(" (TIC)", "")}</a>)}
          <span className="pt-toc-sep" aria-hidden="true" />
          {SECTIONS.map(s => <a key={s.id} href={`#${s.id}`}>{s.nav}</a>)}
        </nav>
      </div>

      <article className="pt-body">
        {/* The five types at a glance. */}
        <section className="pt-sec" id="compare">
          <h2>At a glance</h2>
          <div className="pt-cmp-wrap">
            <table className="pt-cmp">
              <thead>
                <tr><th scope="col">Type</th>{COMPARE.cols.map(c => <th key={c} scope="col">{c}</th>)}</tr>
              </thead>
              <tbody>
                {COMPARE.rows.map(r => (
                  <tr key={r.key}>
                    <th scope="row"><a href={`#${r.key}`}>{r.name}</a></th>
                    {r.cells.map((c, i) => <td key={i}>{c}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="pt-types">
          {TYPES.map(t => (
            <section className="pt-type" id={t.key} key={t.key}>
              <h2>{t.name}</h2>
              <p className="pt-type-short">{t.short}</p>
              <p className="pt-what">{t.what}</p>
              <h3>Financing</h3>
              <ul>{t.financing.map((x, i) => <li key={i}>{x}</li>)}</ul>
              <h3>Watch for</h3>
              <ul>{t.watch.map((x, i) => <li key={i}>{x}</li>)}</ul>
            </section>
          ))}
        </div>

        {SECTIONS.map(s => (
          <section className="pt-sec" id={s.id} key={s.id}>
            <p className="lp-kicker">{s.kicker}</p>
            <h2>{s.title}</h2>
            <p className="pt-lead">{s.lead}</p>
            {s.steps && (
              <ol className="pt-steps">
                {s.steps.map((st, i) => (
                  <li key={st.h}><span className="pt-step-n">{i + 1}</span><b>{st.h}</b><span>{st.p}</span></li>
                ))}
              </ol>
            )}
            <dl className="pt-facts">
              {s.body.map(b => (
                <div key={b.h}><dt>{b.h}</dt><dd>{b.p}</dd></div>
              ))}
            </dl>
          </section>
        ))}

        <section className="pt-cta">
          <div>
            <h2>Not sure what you're looking at?</h2>
            <p>Send the address. I'll tell you what it is and what it costs to own.</p>
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
