// Compact Equal Housing + licence line for pages that have no site footer —
// the map and tool apps. `fixed` pins it to the bottom of a full-screen app
// instead of sitting in the flow.

export default function LegalLine({ fixed = false }) {
  return (
    <div className={"legal-line" + (fixed ? " legal-line-fixed" : "")}>
      <img src="/brand/equal-housing.svg" width="14" height="14"
           alt="Equal Housing Opportunity" title="Equal Housing Opportunity" />
      <span>Equal Housing Opportunity</span>
      <span className="legal-sep" aria-hidden="true">·</span>
      <span>Chuck Heaver, Realtor · DRE #02252640 · Vanguard Properties</span>
    </div>
  );
}
