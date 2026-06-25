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

// ── Off-inventory buildings ─────────────────────────────────────────────────
// Residential condo buildings that AREN'T in the city's Tall Building Inventory
// (the inventory is a seismic dataset that misses many notable condo towers —
// e.g. the Four Seasons Private Residences). We carry them here with their own
// synthetic id, location, and structural facts so they slot into the same
// index + profile + market-link system. Scope: residential condo buildings
// with > 40 units. Market stats are still computed at build time by matching
// `address` to the MLS listings, exactly like the inventory buildings.
//
// Each entry holds BOTH the build-time fields (id, name, address, lat, lng,
// occupancy, struct) and the authored layer (units, narrative, amenities,
// thingsToKnow, hoaApprox) — getBuilding() returns the authored layer, and
// scripts/build-building-sales.mjs reads the rest.
export const EXTRA_BUILDINGS = [
  {
    id: "x-765-market",
    name: "Four Seasons Private Residences",
    address: "765 Market Street",
    lat: 37.78577,
    lng: -122.40543,
    occupancy: "Mixed Uses (With Residential)",
    struct: {
      stories_above_grade: "40",
      date: "2001",
      completion_date: "2001",
    },
    units: 142,
    narrative:
      "Rising above the Four Seasons Hotel on Market Street at Yerba Buena, the " +
      "Private Residences occupy the tower's upper floors — 142 condominiums " +
      "that live like nothing else in the city because they come wrapped in a " +
      "five-star hotel. Ownership here is a service: a 24-hour doorman and " +
      "concierge, valet, and Four Seasons housekeeping and in-residence dining " +
      "on call, plus membership to the 100,000-sq-ft Equinox Sports Club " +
      "downstairs. Homes range from roughly 790-sq-ft pied-à-terres to " +
      "4,600-sq-ft full-floor residences, many with head-on views straight down " +
      "Market Street and out to the Bay. It is the definition of a community " +
      "within a community — a doorman who knows your name and a building that " +
      "runs like a hotel — in the heart of Yerba Buena's museum-and-shopping " +
      "district. The trade-off is cost: HOA dues are high and reflect that " +
      "hotel-grade service level, well above a standard condo.",
    amenities: [
      "Four Seasons 24-hour doorman & concierge",
      "Valet parking",
      "In-residence dining & housekeeping (Four Seasons)",
      "Equinox Sports Club (100k sq ft) in-building",
      "Hotel spa & service access",
      "Earthquake insurance included in HOA",
    ],
    thingsToKnow: [],
  },
  {
    id: "x-280-spear",
    name: "Mira",
    address: "280 Spear Street",
    lat: 37.79001, lng: -122.39168,
    occupancy: "Mixed Uses (With Residential)",
    struct: { stories_above_grade: "39", date: "2019", completion_date: "2019" },
    units: 392,
    narrative:
      "Mira is the instantly recognizable twisting tower of the Transbay / East " +
      "Cut district — Jeanne Gang's Studio Gang spiraled its bay windows so the " +
      "facade rotates as it rises, which means almost every home has a slightly " +
      "different angle on the Bay Bridge, the waterfront, and the skyline. It's " +
      "one of the most transit-rich addresses in the city, steps from the Ferry " +
      "Building and the Salesforce Transit Center, with cafés at the base. " +
      "Residents get a full luxury package: club lounge, fitness center, private " +
      "dining, rooftop deck, and valet parking in new high-rise construction.",
    amenities: [
      "Staffed lobby",
      "Fitness center",
      "Resident lounge & private dining",
      "Rooftop deck & landscaped courtyard",
      "Valet parking & EV charging",
      "Dog-washing station",
    ],
    thingsToKnow: [
      {
        text:
          "As of 2025 Mira was placed on the Fannie Mae / Freddie Mac \"ineligible " +
          "projects\" list over unresolved HOA construction litigation with the " +
          "developer (Tishman Speyer) — which can make conventional financing " +
          "harder (larger down payments or non-conforming loans) until the dispute " +
          "resolves. Confirm current status and HOA disclosures before writing.",
        source: "SF Standard",
        date: "2025",
      },
    ],
  },
  {
    id: "x-201-folsom",
    name: "Lumina",
    address: "201 Folsom Street",
    lat: 37.78893, lng: -122.39217,
    occupancy: "Mixed Uses (With Residential)",
    struct: { stories_above_grade: "42", date: "2016", completion_date: "2016" },
    units: 655,
    narrative:
      "Lumina is a four-building, resort-style complex on Rincon Hill / the East " +
      "Cut — two glass towers (42 and 37 stories) over two plaza buildings, built " +
      "2015–16 by Tishman Speyer. With roughly 655 homes it carries one of the " +
      "deepest amenity decks in the city: a 75-foot lap pool and spa, a climbing-" +
      "wall gym, a bi-level club lounge, an indoor theater, and a rooftop terrace, " +
      "plus a Woodlands Market grocery at street level. Upper floors capture " +
      "sweeping bay and skyline views, and it's an easy walk to the Embarcadero, " +
      "the Transit Center, and the Financial District.",
    amenities: [
      "75-foot heated lap pool, spa & sauna",
      "Fitness center with climbing wall & yoga",
      "Bi-level club lounge",
      "Private theater & movie lawn",
      "Rooftop terrace with fire pits",
      "Valet & EV charging",
      "24-hour attended lobby",
    ],
    thingsToKnow: [
      {
        text:
          "The HOA filed a construction-defect lawsuit against the developer in " +
          "2022 (curtain-wall, roofing, and mechanical systems), with settlement " +
          "activity in 2024 court records. Request the HOA litigation disclosure, " +
          "the reserve study, and any special-assessment history.",
        source: "SF Superior Court filing (via UniCourt)",
        date: "2022",
      },
    ],
  },
  {
    id: "x-555-4th",
    name: "The Palms",
    address: "555 4th Street",
    lat: 37.77925, lng: -122.39782,
    occupancy: "Residential",
    struct: { stories_above_grade: "9", date: "2006", completion_date: "2006" },
    units: 300,
    narrative:
      "The Palms is a 300-home, full-service condominium in South Beach / SoMa, " +
      "built in 2006 around a landscaped interior courtyard of palm trees. Homes " +
      "run from compact studios to ~2,500-sq-ft layouts, many with private " +
      "balconies, and the building delivers hotel-style service: a 24-hour " +
      "doorman and concierge, a fitness center and yoga studio, a private theater, " +
      "an owners' lounge, and a business center. It's a block from Whole Foods " +
      "and close to Oracle Park, the Embarcadero, and Caltrain — a busy, walkable " +
      "address popular with young professionals and pet owners.",
    amenities: [
      "24-hour doorman & concierge",
      "Fitness center & yoga studio",
      "Private screening theater",
      "Residents' lounge & clubroom",
      "Business & conference center",
      "Landscaped palm courtyard",
      "Garage parking & bike room",
    ],
    thingsToKnow: [],
  },
  {
    id: "x-250-king",
    name: "The Beacon",
    address: "250 King Street",
    altAddresses: ["260 King Street"],
    lat: 37.77816, lng: -122.39329,
    occupancy: "Mixed Uses (With Residential)",
    struct: { stories_above_grade: "16", date: "2004", completion_date: "2004" },
    units: 595,
    narrative:
      "The Beacon fills an entire block between King and Townsend — eight concrete " +
      "buildings, 595 condos above a ground-floor Safeway and retail. It runs like " +
      "a self-contained community: groceries, a gym, two spas, and a pool without " +
      "leaving the block, plus Oracle Park, Caltrain, and the Embarcadero a short " +
      "walk away. Floor plans run small to mid-size, which has long made it a " +
      "popular entry point for first-time buyers and investors. The full-time door " +
      "staff and dog park give it a real \"building within a neighborhood\" feel — " +
      "weighed against the defect history below.",
    amenities: [
      "24-hour doorman & concierge",
      "Heated outdoor pool",
      "Two spas / hot tubs",
      "Fitness center",
      "Clubhouse & resident lounge",
      "Private dog park",
      "Deeded garage parking",
    ],
    thingsToKnow: [
      {
        text:
          "The Beacon has a well-documented defect history: the HOA's water-" +
          "intrusion and solar-heat-gain case reached the California Supreme Court " +
          "(Beacon Residential Community Assn. v. Skidmore, Owings & Merrill, 2014), " +
          "a landmark ruling on architects' duty to future homeowners. Many original " +
          "units were built without air conditioning. Review the building's repair " +
          "and disclosure history closely.",
        source: "California Supreme Court (S208173)",
        date: "2014",
      },
    ],
  },
  {
    id: "x-219-brannan",
    name: "The Brannan",
    address: "219 Brannan Street",
    altAddresses: ["229 Brannan Street", "239 Brannan Street"],
    lat: 37.78306, lng: -122.39016,
    occupancy: "Mixed Uses (With Residential)",
    struct: { stories_above_grade: "17", date: "2002", completion_date: "2002" },
    units: 336,
    narrative:
      "The Brannan is a full-service luxury community of 336 homes across three " +
      "towers (219 / 229 / 239 Brannan) in South Beach, built 2000–02. Designer " +
      "Christian Liaigre shaped the lobbies and common areas, and the look still " +
      "reads as upscale decades on. The signature amenity is a heated 75-foot lap " +
      "pool and spa in a landscaped courtyard, paired with a fitness center and " +
      "around-the-clock door staff. Homes span compact one-bedrooms to 3,000-plus-" +
      "sq-ft layouts, drawing everyone from professionals to downsizing owners, in " +
      "one of the more walkable waterfront-adjacent luxury settings in the city.",
    amenities: [
      "24-hour door person & security",
      "Heated 75-foot lap pool",
      "Spa / jacuzzi",
      "Fitness center",
      "Landscaped courtyard & BBQ",
      "Concierge services",
      "Deeded garage parking",
    ],
    thingsToKnow: [],
  },
  {
    id: "x-1160-mission",
    name: "SoMa Grand",
    address: "1160 Mission Street",
    lat: 37.77870, lng: -122.41261,
    occupancy: "Mixed Uses (With Residential)",
    struct: { stories_above_grade: "22", date: "2008", completion_date: "2008" },
    units: 246,
    narrative:
      "SoMa Grand is a 246-home concrete tower at 9th and Mission, built in 2008, " +
      "and one of the more service-rich condo buildings in the area: a 24/7 " +
      "attended lobby, concierge, and an unusual twice-monthly in-unit housekeeping " +
      "perk included for residents. A large landscaped terrace with a fire pit and " +
      "BBQ is the social heart, alongside a fitness center, hot tub, and club " +
      "lounge. Civic Center and Powell BART/Muni are a short walk for car-free " +
      "commuters, though the immediate mid-Market blocks are more transitional " +
      "than the waterfront condo districts.",
    amenities: [
      "24/7 attended lobby & concierge",
      "Twice-monthly in-unit housekeeping",
      "Fitness & wellness center",
      "Jacuzzi / hot tub",
      "Club room & WiFi lounge",
      "Landscaped terrace with fire pit",
      "Deeded garage parking",
    ],
    thingsToKnow: [
      {
        text:
          "The HOA sued the developer/builder over construction defects in 2013, " +
          "with waterproofing the main issue and residents reporting flooding after " +
          "heavy rain. Confirm how it was resolved, any special assessments, and " +
          "the current reserve study.",
        source: "The Miller Law Firm (via SocketSite)",
        date: "2013",
      },
    ],
  },
  {
    id: "x-300-berry",
    name: "Arterra",
    address: "300 Berry Street",
    lat: 37.77265, lng: -122.39345,
    occupancy: "Residential",
    struct: { stories_above_grade: "16", date: "2008", completion_date: "2008" },
    units: 269,
    narrative:
      "Arterra was San Francisco's first LEED-certified residential high-rise — a " +
      "16-story Mission Bay tower built in 2008 with 269 homes from compact studios " +
      "to ~2,200-sq-ft layouts. Floor-to-ceiling glass and an energy-efficient " +
      "build are the defining features, with a taller view tower stepping down to " +
      "park-facing sections. It's steps from the Mission Bay waterfront, Oracle " +
      "Park, Chase Center, UCSF, and Caltrain, with concierge, a fitness center, a " +
      "rooftop deck, and a club room — aimed at buyers who want a newer, green home " +
      "near the ballpark and tech employers.",
    amenities: [
      "24-hour concierge & security",
      "Fitness center",
      "Rooftop deck with BBQ",
      "Resident club room",
      "Guest suite",
      "Landscaped courtyard",
      "Bike storage",
    ],
    thingsToKnow: [],
  },
  {
    id: "x-300-third",
    name: "Museum Parc",
    address: "300 3rd Street",
    lat: 37.78318, lng: -122.39908,
    occupancy: "Mixed Uses (With Residential)",
    struct: { stories_above_grade: "15", date: "1989", completion_date: "1989" },
    units: 233,
    narrative:
      "Museum Parc is an established 15-story, 233-home condominium at Third and " +
      "Folsom, built in 1989, with ground-floor retail and a public garage beneath " +
      "the residences. It's a doorman building with a lap pool and fitness center, " +
      "but the real draw is location: SFMOMA is about two blocks away, and " +
      "Moscone, Yerba Buena, South Park, BART, Muni, and Caltrain are all within " +
      "walking distance. As an older building it tends to offer larger floor plans " +
      "and a more central, downtown-adjacent setting than the newer Mission Bay " +
      "towers.",
    amenities: [
      "24-hour doorman",
      "Lap pool",
      "On-site fitness center",
      "Landscaped garden",
      "Ground-floor retail & dining",
      "Public parking garage",
    ],
    thingsToKnow: [],
  },
  {
    id: "x-718-longbridge",
    name: "Arden",
    address: "718 Long Bridge Street",
    altAddresses: ["708 Long Bridge Street"],
    lat: 37.77055, lng: -122.39055,
    occupancy: "Residential",
    struct: { stories_above_grade: "16", date: "2015", completion_date: "2015" },
    units: 267,
    narrative:
      "Arden (708–718 Long Bridge, by Bosa Development) is a 16-story Mission Bay " +
      "high-rise completed in 2015 with 267 homes from one- to three-bedroom " +
      "layouts of roughly 720 to 2,460 sq ft. It's one of the neighborhood's most " +
      "amenity-rich newer buildings, anchored by a heated rooftop lap pool and " +
      "spa, two gyms, multiple lounges, and full concierge service. Set along " +
      "Mission Creek near the parks and waterfront, it's quick to Chase Center, " +
      "Oracle Park, UCSF, Caltrain, and I-280 — a resort-style, low-maintenance " +
      "home in a fast-growing district.",
    amenities: [
      "Heated rooftop lap pool & spa",
      "Two fitness centers",
      "24-hour concierge & security",
      "Rooftop terraces with BBQ & fire pits",
      "Resident lounges with library",
      "Pet-washing station",
      "EV charging & secure garage",
    ],
    thingsToKnow: [],
  },
  {
    id: "x-199-newmontgomery",
    name: "199 New Montgomery",
    address: "199 New Montgomery Street",
    lat: 37.78684, lng: -122.39994,
    occupancy: "Residential",
    struct: { stories_above_grade: "16", date: "2005", completion_date: "2005" },
    units: 166,
    narrative:
      "199 New Montgomery is a 16-story, 166-home condominium in Yerba Buena / " +
      "SoMa, built in 2005. It's a full-service building with a staffed front " +
      "desk, an underground garage, and a rooftop deck with a fire pit and grills. " +
      "The location is the headline: highly walkable, close to Salesforce Park, " +
      "Union Square, and Montgomery Street transit, with homes from studios to " +
      "larger multi-bedroom layouts.",
    amenities: [
      "24/7 front-desk attendant",
      "Rooftop deck with fire pit & grills",
      "Underground parking garage",
      "Dedicated bike parking",
      "City-view seating areas",
    ],
    thingsToKnow: [],
  },
  {
    id: "x-631-folsom",
    name: "BLU",
    address: "631 Folsom Street",
    lat: 37.78545, lng: -122.39862,
    occupancy: "Mixed Uses (With Residential)",
    struct: { stories_above_grade: "21", date: "2009", completion_date: "2009" },
    units: 114,
    narrative:
      "BLU is a 21-story glass condominium tower on Folsom in SoMa, completed in " +
      "2009 (Handel Architects for Lennar Urban / Malcolm Properties). It holds " +
      "just 114 homes — about six per floor, including six two-story penthouses " +
      "with private roof decks — so units run generously sized for the market, " +
      "roughly 900 to 2,600 sq ft. A street-level podium carries retail and the " +
      "residential lobby, with an adjacent public open space and art. It's a " +
      "lower-density, view-oriented option in the heart of the SoMa tech corridor.",
    amenities: [
      "Attended lobby",
      "Two-story penthouses with private roof decks",
      "Floor-to-ceiling glass residences",
      "Ground-floor retail podium",
      "Adjacent public open space",
      "Secured parking",
    ],
    thingsToKnow: [],
  },
  {
    id: "x-325-chinabasin",
    name: "Radiance at Mission Bay",
    address: "325 China Basin Street",
    lat: 37.77204, lng: -122.39085,
    occupancy: "Residential",
    struct: { stories_above_grade: "9", date: "2008", completion_date: "2008" },
    units: 99,
    narrative:
      "The Radiance at 325 China Basin (the original 99-home phase of Bosa's " +
      "Radiance development) is a 9-story Mission Bay condominium completed in " +
      "2008, with one- and two-bedroom residences and resort-style amenities: a " +
      "landscaped courtyard, a rooftop terrace with fire pits, a club lounge, and " +
      "a fitness center. Its waterfront setting gives bay-facing views, with Chase " +
      "Center, Oracle Park, and Caltrain close by — weighed against the Mission " +
      "Bay subsidence issue below.",
    amenities: [
      "Landscaped common courtyard",
      "Rooftop terrace with fire pits",
      "Club lounge with kitchen",
      "Fitness center",
      "Secured parking garage",
      "Gated security / 24-hour cameras",
    ],
    thingsToKnow: [
      {
        text:
          "Built on Mission Bay fill: the Radiance HOA sued the City in 2022 over " +
          "neighborhood ground subsidence — sidewalks and utilities (not the pile-" +
          "supported building itself) have settled, straining sewer pipes, with some " +
          "areas reported sinking ~18 inches. This is an area-wide Mission Bay issue; " +
          "review the HOA's disclosures and any assessment history.",
        source: "Potrero View",
        date: "2022",
      },
    ],
  },
];
const EXTRA_BY_ID = Object.fromEntries(EXTRA_BUILDINGS.map(b => [b.id, b]));

// Look up the authored supplement for a building (inventory or off-inventory),
// or null if none yet.
export function getBuilding(objectid) {
  return BUILDINGS[String(objectid)] || EXTRA_BY_ID[String(objectid)] || null;
}
