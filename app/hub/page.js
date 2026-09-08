// Maps-site landing page — the three-card hub linking into the three
// interactive maps. This is only visible when the request Host is your
// maps domain (see middleware.js at the repo root, which rewrites the
// maps-domain "/" to "/hub"). Direct visits to /hub also work — useful
// for previews on the *.vercel.app URL.
//
// Brand name is read from NEXT_PUBLIC_MAPS_BRAND (a single string,
// e.g. "SFMicro" or "Bay Micro"). Falls back to a placeholder so you
// can see + tweak the layout before the domain is finalized.

const BRAND = process.env.NEXT_PUBLIC_MAPS_BRAND || "Bay Micro";

export const metadata = {
  title: `${BRAND} — SF micro-climates + wine country`,
  description:
    "Interactive maps of San Francisco's micro-climates, fog risk, and Napa + Sonoma wine-country microclimates.",
};

const CARDS = [
  {
    href: "/fog",
    emoji: "🌁",
    title: "SF Fog Risk Map",
    desc: "USGS GOES fog contours + fog-derived zones over every SF neighborhood. Terrain, seismic, tsunami and elevation layers layered on top.",
  },
  {
    href: "/microclimates",
    emoji: "🗺️",
    title: "SF Micro-Climate Zones",
    desc: "Sun pockets, wind corridors, persistent-fog ridges, seasonal solar exposure. Derived from a 10 m SF elevation model.",
  },
  {
    href: "/winecountry",
    emoji: "🍇",
    title: "Wine Country Zones",
    desc: "Napa + Sonoma AVAs on top of slope aspect, marine fog, valley fog, soil archetypes and the Winkler temperature gradient. Click any AVA for its varieties.",
  },
];

// Split the brand into an optional italic tail so a two-tone header
// like "SF" + italic "Micro" still works: pass "SF|Micro" as the env
// value. If there's no pipe, the whole brand renders as one word.
function BrandHeader() {
  const [head, tail] = BRAND.includes("|") ? BRAND.split("|", 2) : [BRAND, ""];
  return (
    <h1 className="hub-brand">
      {head}
      {tail && <em>{tail}</em>}
    </h1>
  );
}

export default function HubPage() {
  return (
    <main className="hub-page">
      <header className="hub-h">
        <BrandHeader />
        <p className="hub-sub">
          Interactive micro-climate maps for the Bay Area + Wine Country
        </p>
      </header>

      <div className="hub-cards">
        {CARDS.map(c => (
          <a key={c.href} href={c.href} className="hub-card">
            <div className="hub-card-emoji" aria-hidden="true">{c.emoji}</div>
            <div className="hub-card-title">{c.title}</div>
            <div className="hub-card-desc">{c.desc}</div>
            <div className="hub-card-cta">Open the map →</div>
          </a>
        ))}
      </div>

      <p className="hub-footer">
        Looking for a personal weather forecast?
        {" "}
        <a href="https://ur4cast.com" rel="noopener">Visit ur4cast.com</a>
        {" "}
        &mdash; hour-by-hour weather tuned to the outdoor conditions you care about.
      </p>
    </main>
  );
}
