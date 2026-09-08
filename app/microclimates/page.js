// SF Micro-Climate Zones — terrain-derived sub-microclimates.
// MicroApp owns the map + address lookup; wrapped in Suspense because it
// reads useSearchParams() for the optional ?lat=&lng=&name= deep-link.
import { Suspense } from "react";
import MicroApp from "./MicroApp";

export const metadata = {
  title: "SF Micro-Climate Zones",
  description:
    "Terrain-derived sub-microclimate zones for San Francisco — sun pockets, wind corridors, and persistent-fog ridges, computed from elevation.",
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <MicroApp />
    </Suspense>
  );
}
