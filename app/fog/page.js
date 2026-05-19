// SF Fog Risk Map — server-rendered shell.
// FogApp is the client component that owns the map + address lookup.
import FogApp from "./FogApp";

export const metadata = {
  title: "Summer Fog Map · Jun–Aug",
  description:
    "Enter a San Francisco address and see the average summer (Jun–Aug) fog hours for that neighborhood.",
};

export default function Page() {
  return <FogApp />;
}
