// The one site menu, used on every content page so a reader can always get
// home. Server component: it reads the neighborhood guide list here and hands
// the client menu just the names and slugs, so the guide's content never
// ships to the browser.

import { allHoods } from "../neighborhoods/lib";
import { TYPES, SECTIONS } from "../property-types/content";
import SiteNavClient from "./SiteNavClient";

export default function SiteNav() {
  const hoods = allHoods()
    .map(h => ({ name: h.name, slug: h.slug }))
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));
  // Buyer Guide sections, straight from the guide's own content so the menu
  // can never point at a section that is not there.
  const guide = {
    types: TYPES.map(t => ({ id: t.key, label: t.name })),
    topics: SECTIONS.map(s => ({ id: s.id, label: s.nav })),
  };
  return <SiteNavClient hoods={hoods} guide={guide} />;
}
