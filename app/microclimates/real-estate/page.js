// Microclimates and Real Estate — the report's Heat Map and fog-zone closings
// pages as an interactive page. Data from app/lib/microclimate-market.json, built
// by hand with `python3 reports/market/microclimate_market.py` (published sales,
// through the reporting period end).

import SiteFooter from "../../components/SiteFooter";
import data from "../../lib/microclimate-market.json";
import { allHoods } from "../../neighborhoods/lib";
import MicroRealEstate from "./MicroRealEstate";

export const metadata = {
  title: "Prices by Microclimate | Chuck Heaver",
  description:
    "San Francisco home prices by fog zone and neighborhood: an interactive map and grid of median price, price per square foot and days on market for houses, condos, duplexes and more.",
};

const dateLong = iso => new Date(`${iso}T12:00:00`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

export default function Page() {
  const guides = Object.fromEntries(allHoods().map(h => [h.name, h.slug]));
  return (
    <div className="lp">
      <section className="lp-guide-head">
        <p className="lp-kicker">Microclimates · Jan 1 – {dateLong(data.through)}</p>
        <h1 className="lp-guide-h1">Microclimates and Real Estate</h1>
      </section>

      <main className="mre">
        <MicroRealEstate data={data} guides={guides} />
      </main>

      <SiteFooter note={<>{data.fogNote} Sales: SFAR MLS closed sales, Jan 1 – {dateLong(data.through)}, against the same stretch of {data.year - 1}, each counted by the fog
        zone at the property and by the neighborhood it sits in — not a valuation of any property. SFH = Single Family Residence, Halfplex and 2 Houses on Lot; Duplex = Duplex;
        Other (Tri+) = triplexes, fourplexes, 5+ units and the other types. Medians, except the average price; $/sf uses only sales with reported square footage. Est. °F is a
        typical summer afternoon high, estimated from fog hours; weather and climate figures are approximations. vs {data.year - 1} is shown where both years have 3+ sales.
        Deemed reliable, not guaranteed.</>} />
    </div>
  );
}
