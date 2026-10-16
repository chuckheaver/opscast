// SF Market Update — data-only, year-to-date market stats.
import MarketApp from "./MarketApp";
import LegalLine from "../components/LegalLine";

export const metadata = {
  title: "SF Market Update",
  description:
    "San Francisco market statistics for this year to date (median price, days on market, % over asking, by neighborhood) from MLS closed sales, each month against the same month last year.",
};

export default function Page() {
  return (
    <>
      <MarketApp />
      <LegalLine />
    </>
  );
}
