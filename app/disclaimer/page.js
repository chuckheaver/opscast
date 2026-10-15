// The site-wide disclaimer as a page of its own. The wording lives in
// app/lib/disclaimer.js: every footer prints it too, and the map and tool
// apps carry its short form in LegalLine, which links here.

import SiteFooter from "../components/SiteFooter";
import { DISCLAIMERS } from "../lib/disclaimer";

export const metadata = {
  title: "Disclaimer — Chuck Heaver",
  description:
    "What the weather, fog and sales figures on this site are based on, and what they should not be used for.",
};

export default function Page() {
  return (
    <div className="lp">

      <section className="lp-guide-head">
        <p className="lp-kicker">About the data</p>
        <h1 className="lp-guide-h1">Disclaimer</h1>
        <p className="lp-guide-lede">
          What the weather and sales figures on this site are, and what they are not.
        </p>
      </section>

      <main className="dsc">
        {DISCLAIMERS.map(d => <p key={d.title}><b>{d.title}</b> {d.text}</p>)}
      </main>

      {/* The text is this page's body, so the footer leaves its copy off. */}
      <SiteFooter disclaimer={false} />
    </div>
  );
}
