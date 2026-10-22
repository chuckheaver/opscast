// SFH vs Duplex by Neighborhood (median numbers). The one report that carries
// the closings after the reporting period end: its data is built by hand with
// `python3 reports/market/duplex_sfh.py` (not by build.sh), so everything else on
// the site still stops at the period end. Click a neighborhood's SFH or Duplex
// figures for the sales behind them.

import SiteFooter from "../../components/SiteFooter";
import data from "../../lib/duplex-vs-sfh.json";
import DuplexVsSfh from "./DuplexVsSfh";

export const metadata = {
  title: "SFH vs Duplex by Neighborhood | Chuck Heaver",
  description:
    "Median price, percent over list and price per square foot for San Francisco single-family homes and duplexes, neighborhood by neighborhood, with the sales behind every figure.",
};

const dateLong = iso => new Date(`${iso}T12:00:00`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

export default function Page() {
  return (
    <div className="lp">
      <section className="lp-guide-head">
        <p className="lp-kicker">Market Report · Jan 1 – {dateLong(data.through)}</p>
        <h1 className="lp-guide-h1">SFH vs Duplex by Neighborhood<span className="dv-sub">(Median Numbers)</span></h1>
      </section>

      <main className="dv">
        <DuplexVsSfh data={data} />
      </main>

      <SiteFooter note={<>Closed sales from SFAR MLS, Jan 1 – {dateLong(data.through)}. This report includes October closings; the site’s other market reports
        run through the last full month. SFH = Single Family Residence and Halfplex; Duplex = Duplex and 2 Houses on Lot. Medians. % over list = sale price over
        list price; $/sf uses only sales with reported square footage. * Fewer than 4 duplex sales: read with care. Difference = Duplex against SFH in the same
        neighborhood (shown where there are 3+ SFH sales); price and $/sf in %, % over list in points. Outliers: a duplex sale above 1.5× the city’s duplex
        median $/sf (${data.cityDuplexPpsf.toLocaleString("en-US")}) or sold 50%+ over list. October closings are not on the map yet, so their addresses open the
        neighborhood. {data.excluded.join(" ")} Deemed reliable, not guaranteed.</>} />
    </div>
  );
}
