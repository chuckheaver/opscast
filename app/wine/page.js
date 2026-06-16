// Wine Country AVA Map — server-rendered shell.
// WineApp is the client component that owns the map + appellation panel.
import WineApp from "./WineApp";

export const metadata = {
  title: "Wine Country AVA Map · Napa & Sonoma",
  description:
    "Explore the American Viticultural Areas (wine appellations) of Napa and Sonoma counties — click anywhere to see every nested AVA at that spot.",
};

export default function Page() {
  return <WineApp />;
}
