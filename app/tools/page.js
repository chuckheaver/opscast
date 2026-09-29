// The original Ur4cast facet hub. The site's front door is now the agent
// landing page at /, so the tile grid lives here and is linked from it.

import HomeHub from "../components/HomeHub";
import LegalLine from "../components/LegalLine";

export const metadata = {
  title: "All Tools — Chuck Heaver",
  description:
    "Every San Francisco map and dataset in one place: microclimate, market, neighborhoods, transit, bikes and hazards.",
};

export default function Page() {
  return (
    <>
    <div className="app">
      <div className="topbar">
        <div>
          <div className="brand-name">Ur<em>4cast</em></div>
          <div className="brand-tag">Local Intelligence For You</div>
        </div>
      </div>
      <HomeHub />
      <LegalLine />
    </div>
    </>
  );
}
