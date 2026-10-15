// Compact Equal Housing + licence line for pages that have no site footer —
// the map and tool apps. `fixed` pins it to the bottom of a full-screen app
// instead of sitting in the flow. It closes with the short form of the
// site-wide disclaimer and a link to the full text at /disclaimer.
//
// It runs as one line of text rather than flex items, so on a phone it wraps
// like a sentence. Each separator is held to the item before it by a
// no-break space, so a wrapped line never starts with "·".

import Link from "next/link";
import { DISCLAIMER_SHORT } from "../lib/disclaimer";

const NBSP = "\u00a0";

function Sep() {
  return <>{NBSP}<span className="legal-sep" aria-hidden="true">·</span>{" "}</>;
}

export default function LegalLine({ fixed = false }) {
  return (
    <div className={"legal-line" + (fixed ? " legal-line-fixed" : "")}>
      <span className="legal-keep">
        <img src="/brand/equal-housing.svg" width="14" height="14"
             alt="Equal Housing Opportunity" title="Equal Housing Opportunity" />
        Equal Housing Opportunity
      </span><Sep />
      <span>Chuck Heaver, Realtor</span><Sep />
      <span className="legal-keep">DRE #02252640</span><Sep />
      <span className="legal-keep">Vanguard Properties</span><Sep />
      <span>{DISCLAIMER_SHORT}</span><Sep />
      <Link href="/disclaimer">Disclaimer</Link>
    </div>
  );
}
