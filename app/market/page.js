// SF Market Update — data-only, rolling-12-month market stats.
import MarketApp from "./MarketApp";

export const metadata = {
  title: "SF Market Update",
  description:
    "Rolling 12-month San Francisco market statistics (median price, days on market, % over asking, by neighborhood) from MLS closed sales.",
};

export default function Page() {
  return <MarketApp />;
}
