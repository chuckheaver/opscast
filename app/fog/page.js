// SF Fog Risk Map — server-rendered shell.
// FogApp is the client component that owns the map + address lookup;
// it reads useSearchParams() for the optional ?lat=&lng=&name= deep-link
// from Ur4cast, so we wrap it in Suspense per Next.js's requirement.
import { Suspense } from "react";
import FogApp from "./FogApp";

export const metadata = {
  title: "MySFMap",
  description:
    "An interactive San Francisco map — neighborhoods, buildings, housing market activity, fog, microclimates, hazards, transit and bikes.",
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <FogApp />
    </Suspense>
  );
}
