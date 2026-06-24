// Authored, homebuyer-facing supplements to the Tall Building Inventory — the
// building twin of neighborhoods.js. Keyed by the building's `objectid` (as a
// string) from sf-tall-buildings.geojson.
//
// The structural facts and the live market stats (active/sold, prices, HOA
// average once the MLS export carries it) are computed at build time into
// public/data/building-profiles.json and merged in by BuildingModal — so they
// never go stale. THIS file holds only the hand-authored layer:
//   narrative      — what living here is actually like
//   units          — number of homes in the building (public record)
//   amenities[]    — doorman, gym, pool, parking, what HOA covers, pet policy…
//   thingsToKnow[] — publicly reported "red flags" a buyer should weigh, each
//                    { text, source, date }. Keep these factual and sourced;
//                    they are reviewed before publish.
//   hoaApprox      — optional authored HOA estimate, shown (labelled "approx")
//                    only until the MLS export provides real per-listing dues.
//
// Two example entries below establish the format. The rest are authored as
// they're reviewed; buildings with no entry simply show the computed data.

// RENTAL apartment towers — you can't buy a unit, so the index labels them
// "Rental" and the profile hides the buy-side stats. Objectids from the
// inventory; refine this list as needed.
export const RENTAL_OBJECTIDS = new Set([
  "196", // NEMA North Tower — 1411 Market
  "55",  // Ava 55 Ninth — 55 9th St
  "358", // Solaire (Transbay Block 6) — 299 Fremont
  "490", // Folsom Bay Tower (Transbay Block 1) — 160 Folsom
  "220", // 1188 Mission at Trinity Place Apartments
  "443", // 1190 Mission at Trinity Place Apartments
  "617", // Archstone Fox Plaza — 1390 Market
  "211", // Avalon Towers — 388 Beale
  "386", // Cathedral Apartments — 1201 California
  "454", // Nob Hill Community Apartments — 1170 Sacramento
  "31",  // BridgeView — 400 Beale
]);

const BUILDINGS = {
  // One Rincon Hill South Tower — the taller of the two Rincon Hill towers.
  "271": {
    units: 376,
    narrative:
      "One Rincon Hill's 60-story South Tower was, on completion in 2008, the " +
      "tallest residential building in San Francisco — a glass spire on the " +
      "western anchorage of the Bay Bridge with some of the most head-on " +
      "downtown-and-bay views in the city. Homes run from one-bedrooms to full-" +
      "floor penthouses; the upper floors are prized for unobstructed water " +
      "views. A tuned liquid mass damper (a water tank near the top) quietly " +
      "counteracts sway on windy days. It reads as a vertical community: " +
      "concierge, neighbors you ride the elevator with, and amenities most " +
      "single-family blocks can't match.",
    amenities: [
      "24/7 lobby attendant / concierge",
      "Infinity-edge pool & spa",
      "Fitness center",
      "Resident lounge & terrace",
      "Deeded garage parking",
      "EV charging (select stalls)",
    ],
    thingsToKnow: [
      {
        text:
          "Top-floor homes can feel building sway in high wind; a tuned liquid " +
          "mass damper is built in specifically to reduce it. Worth asking the " +
          "HOA about and feeling for yourself on a windy day.",
        source: "Engineering / developer materials",
        date: "2008",
      },
    ],
  },

  // Millennium Tower — the famous one. Red flags here are unusually well
  // documented in the public record; framed as such, with the fix noted.
  "451": {
    units: 419,
    narrative:
      "Millennium Tower is a 58-story luxury condominium at Mission & Fremont " +
      "in the Transbay district, completed in 2009 — granite-and-glass, with a " +
      "five-star amenity package and a prime SoMa/Financial District location " +
      "steps from the Salesforce Transit Center. It remains one of the city's " +
      "best-known addresses; pricing reflects both the luxury finish level and " +
      "the building's documented structural history (below).",
    amenities: [
      "24/7 attended lobby & valet",
      "Pool, spa & fitness center",
      "Owners' lounge, wine cellar, screening room",
      "Concierge services",
      "Deeded garage parking",
    ],
    thingsToKnow: [
      {
        text:
          "The tower settled roughly 18 inches and developed a measurable tilt " +
          "after opening — extensively reported and litigated. A perimeter-pile " +
          "foundation upgrade to arrest the settlement was completed in 2023. " +
          "Buyers should review the HOA's current engineering and monitoring " +
          "disclosures and any assessment history closely.",
        source: "Widely reported (SF Chronicle, NYT)",
        date: "2016–2023",
      },
    ],
  },
};

// Look up the authored supplement for a building, or null if none yet.
export function getBuilding(objectid) {
  return BUILDINGS[String(objectid)] || null;
}
