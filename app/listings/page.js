// SF Microclimate Real Estate — geocoded MLS listings on a fog-zone map.
// ListingsApp is the client component (owns map + filters + stats).
import ListingsApp from "./ListingsApp";

export const metadata = {
  title: "SF Microclimate Real Estate",
  description:
    "Explore San Francisco home sales by fog zone, neighborhood, and district — geocoded from MLS data on an interactive map.",
};

export default function Page() {
  return <ListingsApp />;
}
