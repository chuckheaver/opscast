// SF Fog Risk Map — server-rendered shell.
// FogApp is the client component that owns the map + address lookup.
import FogApp from "./FogApp";

export const metadata = {
  title: "SF Fog Risk Map",
  description:
    "Enter a San Francisco address and see the historical fog risk for that neighborhood.",
};

export default function Page() {
  return <FogApp />;
}
