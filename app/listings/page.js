// SF Microclimate Real Estate — geocoded MLS listings on a fog-zone map.
// ListingsApp is the client component (owns map + filters + stats); it reads
// useSearchParams() for the optional ?nbhd=&layer=nbhd deep-link from the fog
// neighborhood pop-up, so we wrap it in Suspense per Next.js's requirement.
import { Suspense } from "react";
import ListingsApp from "./ListingsApp";

export const metadata = {
  title: "SF Microclimate Real Estate",
  description:
    "Explore San Francisco home sales by fog zone, neighborhood, and district — geocoded from MLS data on an interactive map.",
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ListingsApp />
    </Suspense>
  );
}
