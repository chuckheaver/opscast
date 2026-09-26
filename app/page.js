// Site front door — the agent landing page. The original facet hub lives at
// /tools and is linked from the nav and footer.

import Landing from "./components/Landing";

export const metadata = {
  title: "Chuck Heaver — San Francisco Realtor & Meteorologist",
  description:
    "The only San Francisco realtor who is also a broadcast meteorologist. Every closed sale in the city mapped to its microclimate, so you can see what the fog is worth before you buy or sell.",
  alternates: { canonical: "https://www.ur4cast.com/" },
};

export default function Page() {
  return <Landing />;
}
