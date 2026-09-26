// Shared footer for every page that has one: brokerage, licence and the
// Equal Housing Opportunity mark, which has to appear on agent marketing.
// `note` carries whatever data caveat the page needs underneath.

import Link from "next/link";

export const EMAIL = "chuck.heaver@vanguardproperties.com";
export const PHONE_DISPLAY = "415.549.1777";
export const PHONE_HREF = "+14155491777";
export const DRE = "02252640";

export default function SiteFooter({ note = null }) {
  return (
    <footer className="lp-foot">
      <div className="lp-foot-inner">
        <div>
          <div className="lp-logo-name">Chuck Heaver</div>
          <p className="lp-fine">Realtor, Vanguard Properties · Broadcast meteorologist · San Francisco</p>
        </div>
        <div className="lp-foot-links">
          <Link href="/fog?preset=fog">Map</Link>
          <Link href="/neighborhoods">Neighborhoods</Link>
          <Link href="/market">Market</Link>
          <Link href="/tools">All tools</Link>
          <a href={`mailto:${EMAIL}`}>Email</a>
          <a href={`tel:${PHONE_HREF}`}>{PHONE_DISPLAY}</a>
        </div>
      </div>

      <div className="lp-foot-legal">
        <span className="lp-eho">
          <img src="/brand/equal-housing.svg" alt="" width="22" height="22" aria-hidden="true" />
          Equal Housing Opportunity
        </span>
        <span>Chuck Heaver · DRE #{DRE}</span>
        <span>Vanguard Properties</span>
      </div>

      {note ? <p className="lp-fine lp-foot-fine">{note}</p> : null}
    </footer>
  );
}
