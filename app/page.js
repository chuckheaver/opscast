// Site front door — the agent landing page. The original facet hub lives at
// /tools and is linked from the nav and footer.

import Landing from "./components/Landing";

export const metadata = {
  title: "Chuck Heaver — San Francisco Realtor & Meteorologist",
  description:
    "Microclimate real estate in San Francisco. The only realtor here who is also a meteorologist, with every closed sale in the city mapped to the microclimate it sits in.",
  alternates: { canonical: "https://www.ur4cast.com/" },
};

export default function Page() {
  return <Landing />;
}
