// The one site menu, used on every content page so a reader can always get
// home. Server component: it reads the neighborhood guide list here and hands
// the client menu just the names and slugs, so the guide's content never
// ships to the browser.

import { allHoods } from "../neighborhoods/lib";
import SiteNavClient from "./SiteNavClient";

export default function SiteNav({ bare = false }) {
  const hoods = allHoods()
    .map(h => ({ name: h.name, slug: h.slug }))
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));
  return <SiteNavClient hoods={hoods} bare={bare} />;
}
