// Wine-country micro-climate map — Napa + Sonoma AVAs on top of the same
// physics we render for /microclimates (slope aspect, wind corridors, fog
// fingers, elevation contours) tuned for the region's north-south valleys.
// Wrapped in Suspense because WineApp reads useSearchParams() for the
// optional ?lat=&lng=&name= deep-link.
import { Suspense } from "react";
import WineApp from "./WineApp";

export const metadata = {
  title: "Wine Country Micro-Climate Zones",
  description:
    "Napa + Sonoma micro-climates by AVA — slope aspect on the Mayacamas + Vaca ranges, Petaluma Gap wind, marine fog fingers from Golden Gate + Bodega Bay, and the south→north Winkler temperature gradient.",
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <WineApp />
    </Suspense>
  );
}
