// One sales category's box — median sale, sold, median $/sf, days on market —
// the same box on a neighborhood's page and in its map pop-up, so the two
// always read alike. On the page it is a link that opens the map on that
// category's sales; in the pop-up it is a button that turns that category's
// dots on the map on and off (`active` when they are showing).
// `s` is a neighborhood's entry in app/lib/neighborhood-stats.json.

import Link from "next/link";

const money = v => (v == null ? "—" : v >= 1e6 ? `$${(v / 1e6).toFixed(2)}M` : `$${Math.round(v / 1000)}K`);

export default function SegBox({ seg, s, href, onClick, active }) {
  const n = s[`${seg.key}N`] || 0;
  const ppsf = s[`${seg.key}Ppsf`], dom = s[`${seg.key}Dom`];
  const body = (
    <>
      <div className="lp-nseg-h">{seg.short}</div>
      <dl>
        <dt>Median sale</dt><dd className="lp-nseg-v">{n ? money(s[`${seg.key}Median`]) : "—"}</dd>
        <dt>Sold</dt><dd>{n}</dd>
        <dt>Median $/sf</dt><dd>{ppsf ? `$${Math.round(ppsf).toLocaleString("en-US")}` : "—"}</dd>
        <dt>Days on market</dt><dd>{dom != null ? Math.round(dom) : "—"}</dd>
      </dl>
    </>
  );
  const style = { "--seg": seg.color };
  if (href) return <Link className="lp-nseg" style={style} href={href} title="See these sales on the map">{body}</Link>;
  return (
    <button type="button" className={`lp-nseg${active ? " on" : ""}`} style={style} aria-pressed={!!active} disabled={!n}
      onClick={onClick} title={n ? (active ? "Hide these sales on the map" : "Show these sales on the map") : "No sales yet this year"}>
      {body}
    </button>
  );
}
