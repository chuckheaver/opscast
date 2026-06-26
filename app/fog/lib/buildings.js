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
// Display-name overrides for inventory buildings the city labels by address
// (e.g. "450 Folsom [Transbay Block 8]") but that are known by a building name.
// Keyed by objectid → preferred name; applied to the index, the profile modal,
// and the map footprint label.
export const NAME_OVERRIDES = {
  "333": "The Avery", // 450 Folsom [Transbay Block 8]
  "239": "Four Seasons Hotel & Residences", // 757 Market — hotel below, residences above
};

export const RENTAL_OBJECTIDS = new Set([
  "196", // NEMA North Tower — 1411 Market
  "55",  // Ava 55 Ninth — 55 9th St
  "358", // Solaire (Transbay Block 6) — 299 Fremont
  "220", // 1188 Mission at Trinity Place Apartments
  "443", // 1190 Mission at Trinity Place Apartments
  "617", // Fox Plaza — 1390 Market
  "211", // Avalon / 388 Beale
  "31",  // BridgeView — 400 Beale
  "76",  // The Gateway (Macondray House) — 405 Davis Court (rent-controlled rental, not a co-op)
  "302", // The Gateway (Buckelew House) — 155 Jackson (rent-controlled rental)
  // Removed on research: 386 (Cathedral Apartments — actually a co-op),
  // 454 (Nob Hill Community Apartments — actually condos), 490 (excluded duplicate).
]);

// Buildings that are BOTH for-sale condos AND rental apartments (e.g. The Avery
// — condos on the upper floors, rentals below). These keep their buy-side
// market stats (they're not in RENTAL_OBJECTIDS) but the index labels them
// "(Rental/Condo)". A pure rental gets "(Rental)"; a pure condo gets no label.
export const RENTAL_AND_CONDO_OBJECTIDS = new Set([
  "333", // The Avery — 118 for-sale condos above market-rate + affordable rentals
]);

// Buildings dropped from the residential homebuyer index. Two reasons:
//   • office — the city's "mixed-residential" tag swept in pure office towers
//     with no homes (still drawn on the map, just not a homebuyer profile).
//   • duplicate — already covered by a better off-inventory EXTRA entry under
//     the building's primary marketing address.
export const EXCLUDED_OBJECTIDS = new Set([
  "622", // 235 Pine — office
  "399", // 345 California — office
  "593", // One Maritime Plaza — office
  "17",  // 601 Montgomery — office
  "551", // 121 Spear — office
  "365", // 50 First (Oceanwide Center I) — stalled, no homes
  "430", // 526 Mission (Oceanwide Center II) — stalled, no homes
  "490", // 160 Folsom (Folsom Bay Tower) = Mira — duplicate of EXTRA x-280-spear
  "81",  // 301 Beale (LUMINA I) — duplicate of EXTRA x-201-folsom
  "611", // 338 Main (LUMINA II) — duplicate of EXTRA x-201-folsom
  "239", // 757 Market (Four Seasons) — residences covered by EXTRA x-765-market
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
    altAddresses: ["160 Folsom Street"], // Mira = Transbay Block 1; inventory's "Folsom Bay Tower" (490)
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
    altAddresses: ["301 Beale Street", "338 Main Street"], // other Lumina towers (inventory 81, 611)
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
// Authored supplements for the remaining inventory residential buildings
// (condos, co-ops, and rental communities), researched from public sources.
// Keyed by objectid. Published red flags are well-sourced; uncertain items
// were held back for review.
const MORE_BUILDINGS = {
  // Four Seasons at 757 Market — one mixed-use tower (hotel below, residences
  // above). Excluded from the index (the residences are the EXTRA x-765-market
  // entry), but its map footprint pop-up shows this story.
  "239": {
    units: 142,
    narrative:
      "The Four Seasons at 757 Market is one tower with two lives — the Four Seasons Hotel on the lower floors and 142 Private Residences (luxury condominiums) on the floors above. Residents live over a five-star hotel with full Four Seasons service — doorman, concierge, valet, housekeeping and in-residence dining on call — plus membership to the 100,000-sq-ft Equinox Sports Club in the building, in the heart of Yerba Buena at Market and Third. (See \"Four Seasons Private Residences\" in the building list for unit sales and details.)",
    amenities: ["Four Seasons 24-hour doorman & concierge", "Valet parking", "In-residence dining & housekeeping", "Equinox Sports Club (100k sq ft) in-building", "Hotel spa & service access"],
    thingsToKnow: [],
  },
  "105": {
    units: 102,
    narrative:
      "The St. Regis Residences occupy the upper floors of a 42-story tower above the St. Regis hotel and the Museum of the African Diaspora at Third and Mission — one of the city's most established luxury full-service condo buildings. Residents share hotel-grade services and a five-star Yerba Buena location next to SFMOMA and the Financial District. It draws affluent and pied-à-terre buyers who value privacy, concierge living, and direct access to the hotel's spa and dining; HOA dues are correspondingly high.",
    amenities: ["24-hour concierge & butler service", "Heated indoor pool", "Fitness center", "Spa access via the St. Regis hotel", "Valet parking", "Resident lounge & private dining"],
    thingsToKnow: [],
  },
  "196": {
    units: 754,
    narrative:
      "NEMA is a 754-unit luxury rental community at 10th and Market in Mid-Market, its 37-story North Tower opening in 2014 alongside a south tower and two mid-rises. It's known for a heavy amenity package and an active resident-events calendar with tech-forward services. The transit-rich location is central, though the surrounding Mid-Market blocks are ones many renters tour carefully at street level.",
    amenities: ["60-foot saline lap pool", "7,000 sq ft fitness center", "Rooftop Skyline Terrace", "Backyard terrace with grills", "Valet parking", "Resident events programming"],
    thingsToKnow: [{ text: "NEMA's $384M mortgage was reported in default and sent to special servicing in 2023, with foreclosure risk after its valuation fell sharply — an ownership/financial-stability item worth watching for a rental.", source: "SFist", date: "2023" }],
  },
  "293": {
    units: 403,
    narrative:
      "33 Tehama — now operating as Spera SF — is a 35-story luxury rental tower in SoMa near the Salesforce Transit Center, completed in 2017 with 403 studio-to-multi-bedroom apartments. After major flooding it was closed for roughly two years and reopened under the Spera name in 2024. It suits renters who want a high-rise lifestyle steps from the East Cut and downtown transit.",
    amenities: ["Rooftop deck & lounge", "Fitness center", "Resident lounge", "On-site parking", "Front-desk service", "Pet-friendly"],
    thingsToKnow: [{ text: "A burst rooftop pipe in June 2022 flooded all 35 floors (~95 units damaged), followed by a second flood in August; the building closed ~2 years and displaced residents sued the owner. Confirm the repairs and current condition.", source: "Wikipedia (Spera SF / 33 Tehama)", date: "2022" }],
  },
  "341": {
    units: 400,
    narrative:
      "The Sequoias is a 25-story continuing-care retirement community (a 'Life Plan' community) on Cathedral Hill, built in 1969 and run by nonprofit Sequoia Living. Residents live in their own independent-living apartments and can age in place through assisted living, skilled nursing, and memory care on the same campus. It draws older adults who want maintenance-free city living with dining, wellness, and on-site healthcare, and is long known as welcoming to LGBTQ+ seniors.",
    amenities: ["On-site dining", "Health & wellness programs", "Assisted living & skilled nursing on site", "Memory care", "City & bay views", "Independent-living apartments"],
    thingsToKnow: [{ text: "This is a continuing-care retirement community, not a standard condo: residents typically pay a one-time entrance fee plus a monthly fee (reported ~$6,600/mo) for services and a continuum of care, with limited entrance-fee refunds after the first 90 days. It is an age-restricted senior community.", source: "Sequoia Living", date: "2025" }],
  },
  "386": {
    units: 84,
    narrative:
      "Cathedral Apartments is a 16-story Gothic Revival building from 1927 atop Nob Hill near Grace Cathedral and the cable cars. It's organized as a housing cooperative, so buyers purchase shares rather than a deeded condo. The location is one of the city's most established, walkable luxury districts, with units from studios to multi-bedroom homes and full-time door staff lending a quiet, traditional building culture.",
    amenities: ["Full-time doorman / attended lobby", "Elevator service", "Common roof deck", "Garage parking", "Pet-friendly"],
    thingsToKnow: [{ text: "This is a housing co-op, not a condo: share-based ownership and board approval can limit mortgage options and complicate resale versus a standard condo. Confirm the co-op's financing and approval rules before offering.", source: "Building listings (Compass / Apartments.com)", date: "2026" }],
  },
  "452": {
    units: 285,
    narrative:
      "338 Spear is the tallest tower of The Infinity, a four-building condominium complex completed in 2008 on the Rincon Hill / SoMa waterfront, steps from the Embarcadero and Bay Bridge. The wider Infinity community totals roughly 650 homes across its linked buildings, sharing an extensive amenity package and a full-service HOA. Floor plans run from studios to large multi-bedroom homes with bay and city views behind the development's signature curving glass.",
    amenities: ["75-foot indoor lap pool", "5,000 sq ft fitness center", "24-hour attended lobby & concierge", "Club lounge with catering kitchen", "Private theater room", "Deeded parking & landscaped courtyard"],
    thingsToKnow: [{ text: "The Infinity HOA filed a construction-defect lawsuit (vs. 300 Spear Realty Venture, Webcor, Permasteelisa); the docket shows dismissals with prejudice by 2021, suggesting settlement. Request HOA records for repair scope, reserves, and any assessments.", source: "SF Superior Court (via UniCourt)", date: "2017" }],
  },
  "491": {
    units: 127,
    narrative:
      "Pacific Heights Towers at 2200 Sacramento is a 17-story condominium from 1964 with 127 homes on the corner of Sacramento and Laguna, directly across from Lafayette Park. Floor plans range from one to four bedrooms, many with floor-to-ceiling windows and views toward the Golden Gate. It's a full-service, doorman building in one of the city's most established residential neighborhoods, a short walk from the Upper Fillmore shopping corridor, with HOA dues that include earthquake insurance.",
    amenities: ["24-hour doorman", "Fitness center", "Penthouse club room with views", "Elevator service", "Earthquake insurance included in HOA", "Across from Lafayette Park"],
    thingsToKnow: [{ text: "The building has appeared on a preliminary, unofficial city inventory of older concrete buildings that may warrant seismic evaluation — a screening list, not a finding that the building is unsafe. Treat it as a prompt to review the building's seismic records and any voluntary retrofits with the HOA.", source: "SF non-ductile concrete building screening list (preliminary)", date: "2024" }],
  },
  "560": {
    units: 49,
    narrative:
      "388 Market is a 24-story flatiron tower by Skidmore, Owings & Merrill, completed in 1987 in the Financial District, with luxury residences on its top floors above office and ground-floor retail. The rounded, red-granite form gives the upper homes wide curved-window outlooks over Market Street and the Bay. It's a doorman building in the heart of downtown, with immediate access to Embarcadero BART/Muni and the Ferry Building.",
    amenities: ["Doorman / attended lobby", "Curved floor-to-ceiling windows", "City & Bay views", "Ground-floor retail", "Steps from Embarcadero BART/Muni"],
    thingsToKnow: [],
  },
  "618": {
    units: 537,
    narrative:
      "500 Folsom is a 42-story luxury rental tower in the East Cut / Transbay, completed in 2020 to a Skidmore, Owings & Merrill design. It offers studios through two-bedrooms plus penthouses, with floor-to-ceiling windows and many bay or city views; of 537 units, 109 are below-market-rate, giving an income-mixed resident base. It's highly walkable and transit-rich, adjacent to Salesforce Park and the Transit Center.",
    amenities: ["Spa", "Indoor-outdoor recreation areas", "Fitness center", "Resident lounge", "Below-grade parking", "Bay & city views"],
    thingsToKnow: [],
  },
  "113": {
    units: 77,
    narrative:
      "Royal Towers is a full-service residential high-rise on Russian Hill, described by listing sources as a stock cooperative rather than a condo — so buyers purchase shares and typically face a board-approval interview. It's staffed around the clock with door attendants and on-site management, and homes are large by SF standards (roughly 1,000–3,600 sq ft) with sweeping bay and city views from a prized address.",
    amenities: ["24-hour door attendant", "On-site resident manager", "Fitness center", "Indoor pool with retractable roof", "Sauna / spa", "Garage & guest parking"],
    thingsToKnow: [{ text: "Described as a stock cooperative with board approval required to buy; co-op shares can be harder to finance and narrow the buyer pool versus a condo. Verify share-loan and cash requirements with management.", source: "Vanguard Properties / RubyHome listings", date: "2026" }],
  },
  "211": {
    units: 247,
    narrative:
      "388 Beale (formerly Avalon Towers, now UDR-managed) is a two-tower luxury rental community in the East Cut near the Bay Bridge and Embarcadero. The towers are rotated over a shared podium so many homes are corner units with panoramic bridge and water views, in floor plans from studios to three-bedrooms. Renters get a full amenity package in a walkable waterfront location close to the Ferry Building and downtown jobs.",
    amenities: ["Fitness center", "Whirlpool spa & sauna", "Resident clubhouse / lounge", "On-site parking", "EV charging", "Private balconies (select units)"],
    thingsToKnow: [],
  },
  "302": {
    units: null,
    narrative:
      "155 Jackson is one of the high-rise towers of The Gateway (originally Golden Gateway Center), a large rental community of roughly 1,250 homes across four towers and townhomes on a landscaped, traffic-separated plaza in the Financial District / Jackson Square area. Residents lease studios through three-bedrooms with pedestrian-bridge access to Embarcadery Center and on-site Safeway and retail. The setting is unusually green and quiet for downtown, with easy Muni, BART, and Ferry Building access.",
    amenities: ["24/7 courtesy patrol", "Rooftop terrace with city views", "On-site laundry", "Door-attendant service", "On-site retail (grocery, café)", "Elevated pedestrian plaza"],
    thingsToKnow: [],
  },
  "350": {
    units: 550,
    narrative:
      "The residential tower at 1500 Mission — known as Fifteen Fifty — is a 39-story Related California high-rise at Mission and South Van Ness, paired with the City's permit-center office building. It offers 550 rental homes (including 110 affordable) from studios to penthouses, with interiors by Marmol Radziner. The standout is roughly 40,000 sq ft of indoor-outdoor amenities anchored by an on-site Equinox, where SoMa, the Mission, and Hayes Valley meet.",
    amenities: ["24/7 staffed lobby", "On-site Equinox fitness club", "~40,000 sq ft amenity decks", "Landscaped private gardens", "Resident lounges", "Subterranean parking"],
    thingsToKnow: [],
  },
  "396": {
    units: 165,
    narrative:
      "One Hawthorne is a 25-story, 165-home condominium tucked on a small SoMa side street near Yerba Buena, SFMOMA, and the Financial District. Homes range from studios to three-bedrooms (about 500 to nearly 2,000 sq ft), a mix of entry-level and larger floor plans in one building. The signature amenity is a ~4,500-sq-ft rooftop lounge and deck with 360° views, backed by a 24-hour attended lobby in a highly walkable location.",
    amenities: ["24-hour staffed lobby", "On-site management", "~4,500 sq ft rooftop lounge & deck", "Fitness center", "Bicycle storage", "High-speed elevators"],
    thingsToKnow: [],
  },
  "454": {
    units: 71,
    narrative:
      "Despite its historic name, 1170 Sacramento is today a residential condominium atop Nob Hill, with roughly 71 homes across 19 stories (built 1963). Units are notably large — about 1,750 to over 5,000 sq ft — drawing buyers who want space, views, and a prestigious address. It's a full-service building with a landscaped drive-in entry, 24-hour door attendants, and on-site management; HOA dues are high but bundle most utilities and services.",
    amenities: ["24-hour door attendants", "On-site management", "Landscaped drive-in entry", "Guest / valet parking", "Elevator", "Most utilities included in HOA"],
    thingsToKnow: [{ text: "HOA dues here are among the highest in the city — reported roughly in the $3,200–$4,200/month range — reflecting full-service staffing and bundled utilities. Confirm current dues and exactly what they cover before budgeting.", source: "MLS / building listings", date: "2026" }],
  },
  "503": {
    units: 48,
    narrative:
      "Green Hill Tower is a boutique mid-century-modern condominium on one of Russian Hill's most coveted blocks, with just 48 homes across 21 floors (1961) — a small, close-knit owner community. Residences are spacious (about 1,000 to nearly 3,000 sq ft), many with floor-to-ceiling windows, oversized terraces, and sweeping downtown, bay, and Coit Tower views. It has an around-the-clock resident manager and garage parking; homes turn over infrequently.",
    amenities: ["24/7 attended lobby", "On-site resident manager", "Garage parking", "Guest parking", "Elevator", "Private terraces (most units)"],
    thingsToKnow: [],
  },
  "588": {
    units: 447,
    narrative:
      "399 Fremont is a 42-story, 447-home luxury rental tower in Rincon Hill (the East Cut), completed in 2016 and UDR-managed. Homes range from studios to three-bedrooms with quartz counters and Bosch appliances, set among roughly 25,000 sq ft of amenity space. The location is minutes from the Bay Bridge, the Embarcadero, downtown employers, and Caltrain, with high walkability.",
    amenities: ["Fitness center with yoga/spin studios", "Lap pool with cabana lounge", "Resident media / club lounge", "Catering kitchen & wine storage", "On-site parking", "~25,000 sq ft of amenities"],
    thingsToKnow: [],
  },
  "120": {
    units: 138,
    narrative:
      "Cathedral Hill Tower is a 27-story full-service condominium from 1966 on Cathedral Hill near the Van Ness corridor and Civic Center. Residents have a 24-hour attended lobby with doorman and concierge, secure entry, and an attached underground garage — a real convenience here. Units range from compact one-bedrooms to larger plans, many with city and bay views from the upper floors, with easy access to Japantown, Polk Street, and the new Van Ness BRT.",
    amenities: ["24-hour doorman & concierge", "Controlled-access entry", "Underground assigned parking", "Resident clubroom", "Bike storage", "On-site management"],
    thingsToKnow: [],
  },
  "220": {
    units: 440,
    narrative:
      "1188 Mission at Trinity Place is a 24-story rental community in SoMa, part of the four-tower Trinity Place development around the large public Piazza Angelo courtyard. It offers studio and one-bedroom layouts with contemporary finishes, on-site management, and 24-hour courtesy patrol. The location is steps from Mid-Market, Civic Center BART/Muni, and the SoMa tech corridor.",
    amenities: ["Fitness center", "Resident lounges", "Landscaped courtyards & piazza", "Underground parking", "Bike storage", "24-hour courtesy patrol"],
    thingsToKnow: [{ text: "In 2015 the SF City Attorney accused the Trinity Place development of unlawfully renting rent-controlled units as short-term tourist rentals, citing units at 1188/1190 Mission run as a 'SOMA Suites Hotel' in alleged violation of its development agreement.", source: "Hoodline", date: "2015" }],
  },
  "308": {
    units: 136,
    narrative:
      "Fontana West is an 18-story stock cooperative from 1963, one of the twin Fontana Towers on Russian Hill's northern waterfront. As a co-op, buyers purchase shares rather than a deeded condo, which affects financing and board approval. It's prized for sweeping bay, Golden Gate, and Alcatraz views, with floor plans from studios to four-bedrooms and a quiet setting near Aquatic Park and Ghirardelli Square.",
    amenities: ["Heated outdoor pool with BBQ", "Attended / secure lobby", "Zen garden", "Club room", "Per-floor laundry", "Bay & Golden Gate views"],
    thingsToKnow: [{ text: "This is a stock cooperative, not a condo: share ownership can limit lender options, requires board approval of buyers, and complicates financing versus a condo.", source: "SF co-op references", date: "2026" }],
  },
  "358": {
    units: 409,
    narrative:
      "Solaire is a 32-story LEED Gold rental high-rise in the Transbay / Rincon Hill district, completed around 2016 on Transbay Block 6. The pet-friendly community offers studios, one-, and two-bedrooms plus urban townhomes with upscale finishes and strong light. Standouts include a rooftop deck, a co-working lounge with work pods, and multiple landscaped sky decks, steps from the Salesforce Transit Center and the Embarcadero.",
    amenities: ["Rooftop sun deck with bay views", "Fitness center & yoga room", "Co-working lounge with work pods", "Pet spa & grooming", "Sky decks with hot tub & BBQ", "Ground-floor retail"],
    thingsToKnow: [],
  },
  "463": {
    units: 342,
    narrative:
      "The Metropolitan is a full-service condominium completed in 2004, spanning two towers at 333 and 355 1st Street in South Beach / Rincon Hill. It's one of the more amenity-rich buildings in the neighborhood, with a 24-hour front desk, an indoor pool and spa, fitness center, theater, and club lounge. Floor plans run from one-bedrooms to larger homes, many with bay or city views, a walk from the Embarcadero, Oracle Park, and SFMOMA.",
    amenities: ["24-hour front desk & concierge", "Indoor pool & spa", "Fitness center", "Theater room", "Club lounge & party room", "Private garage parking"],
    thingsToKnow: [],
  },
  "507": {
    units: 136,
    narrative:
      "The Watermark is a 22-story condominium from 2006 in South Beach, designed by Moore Ruble Yudell with a distinctive curved waterfront form. It's a full-service building with a 24-hour doorman and concierge and one of the few SF condos with a heated full-size lap pool and spa. Many homes capture dramatic bay, Bay Bridge, and waterfront views, directly across from the Embarcadero and a walk to Oracle Park and the Ferry Building.",
    amenities: ["24-hour doorman & concierge", "Heated full-size lap pool & spa", "Fitness center", "BBQ & outdoor seating", "Security services", "Waterfront & bay views"],
    thingsToKnow: [],
  },
  "624": {
    units: 348,
    narrative:
      "340 Fremont is a 40-story rental tower from 2016 in Rincon Hill (the East Cut), designed by Handel Architects and run by Equity Residential. It offers 348 studios through two-bedrooms with a full amenity floor and landscaped garden terraces on multiple podium levels. Residents get a 24-hour concierge, a sky lounge with city views, and pet-friendly features, with quick access to the Embarcadero, Financial District, and Bay Bridge.",
    amenities: ["24-hour concierge", "Sky lounge with city views", "Rooftop terrace & garden decks", "Fitness center & yoga studio", "Dog run & wash station", "Catering kitchen"],
    thingsToKnow: [],
  },
  "13": {
    units: 112,
    narrative:
      "The Summit is a 28-story condominium near the crest of Russian Hill, designed in the mid-1960s as part of Joseph Eichler's foray into high-rise living. With only about 112 homes across nearly 30 floors, residences are relatively large and the building is known for panoramic Bay, Golden Gate, and skyline views. It's a full-service, doorman building in a quiet, prestigious pocket, walkable to Polk Street and the Hyde Street cable car.",
    amenities: ["Full-time doorman", "Concierge", "Elevator", "Panoramic bay & bridge views", "Secure parking", "On-site management"],
    thingsToKnow: [],
  },
  "255": {
    units: 127,
    narrative:
      "Fontana East is one of two 1965 towers on the former Fontana factory site at the edge of Russian Hill and the northern waterfront. It's a stock cooperative rather than a condo, so buyers purchase shares — typically a more owner-occupied, stable community but with stricter approval and financing. The towers are prized for unobstructed views over Aquatic Park, the Bay, Alcatraz, and the Golden Gate, a walk from Ghirardelli Square and the Marina.",
    amenities: ["Doorman", "Pool", "Panoramic waterfront views", "On-site management", "Secure parking", "Elevator"],
    thingsToKnow: [{ text: "This is a stock cooperative, not a condo: co-op ownership generally requires larger down payments, has fewer lenders, and involves board approval for purchases. Verify the co-op's financing and approval rules.", source: "SF co-op references", date: "2026" }],
  },
  "31": {
    units: 245,
    narrative:
      "BridgeView is a 26-story rental community from 2001 in South Beach, near the foot of the Bay Bridge and the Embarcadero. With roughly 245 homes it offers full-service living including a doorman and resort-style amenities; apartments typically feature hardwood floors, granite kitchens, and in-unit laundry, with many bridge and water views. It's convenient to the Financial District, the waterfront, the Ferry Building, and South Beach dining.",
    amenities: ["Full-time doorman", "Heated lap pool", "Fitness center", "Sundeck with BBQ", "Bike room", "Assigned parking"],
    thingsToKnow: [],
  },
  "363": {
    units: 52,
    narrative:
      "The Ritz-Carlton Residences occupy a vertical addition completed in 2007 atop the landmark 1890 Old Chronicle Building at Market and Kearny in the Financial District. About 52 luxury condominiums, from roughly 950 to over 3,500 sq ft, are served by Ritz-Carlton hotel-style amenities and staffing — concierge, valet, and access to hotel services in a historic landmark near Union Square and Montgomery BART/Muni.",
    amenities: ["Ritz-Carlton concierge", "Valet parking", "Hotel-style staffing & services", "24-hour security / doorman", "Historic landmark building", "Fitness facilities"],
    thingsToKnow: [{ text: "The building also contains a separate Ritz-Carlton fractional / club (timeshare) component distinct from the whole-ownership residences — confirm which ownership type a given unit is. Full-service luxury staffing typically means high monthly HOA dues.", source: "Ritz-Carlton Club listings / Condomania", date: "2026" }],
  },
  "425": {
    units: 146,
    narrative:
      "The Four Seasons Private Residences at 706 Mission is a 43-story tower completed around 2020 in the Yerba Buena arts district, attached to the restored historic Aronson Building. It offers roughly 146 for-sale condominiums — one- to four-bedroom homes, typically ~1,075 to 4,600 sq ft — with managed Four Seasons services and a dedicated amenity floor. Residents are steps from SFMOMA, the Contemporary Jewish Museum, and Union Square. (This is the newer of the city's two Four Seasons residential offerings, distinct from 765 Market.)",
    amenities: ["Four Seasons concierge & services", "Resident amenity / club floor", "Fitness facilities", "Valet / secure parking", "24-hour staffing", "Restored Aronson Building spaces"],
    thingsToKnow: [],
  },
  "468": {
    units: 486,
    narrative:
      "The Paramount is a 40-story rental high-rise from 2001 in the SoMa / Yerba Buena area on Mission Street, just outside the Financial District. With roughly 486 apartments (a mix of market-rate and below-market-rate), it was for a time the tallest all-residential building in the city and remains a large, professionally managed Related community. Residents value the central location near Yerba Buena, Union Square, BART/Muni, and major tech employers.",
    amenities: ["Fitness center", "Resident lounge", "On-site management", "Secure parking", "Some affordable (BMR) units", "Concierge / front desk"],
    thingsToKnow: [],
  },
  "535": {
    units: 64,
    narrative:
      "Bellaire Tower is a 20-story Art Deco condominium from 1930 by architect H.C. Baumann, on Green Street at the crest of Russian Hill. It's an intimate building of about 64 homes (roughly 690 to 1,850 sq ft), prized for classic period detailing, full-time doorman service, and one of the most prestigious addresses on the hill. Many homes enjoy sweeping city and bay views, a walk from Polk Street and the cable cars.",
    amenities: ["Full-time doorman", "Concierge", "Bike room", "Elevator", "Historic Art Deco building", "City & bay views"],
    thingsToKnow: [],
  },
  "626": {
    units: 67,
    narrative:
      "Hills Plaza is a block-square mixed-use complex created in the early 1990s from the landmark 1926 Hills Bros. Coffee plant on the Embarcadero between Folsom and Harrison. Above several stories of Class A office and retail, ten added floors hold about 67 residential condominiums — a boutique, light-filled community atop a historic waterfront landmark with direct Embarcadero frontage, water and Bay Bridge views, and a landscaped plaza near the Ferry Building.",
    amenities: ["Doorman / 24-hour staffing", "Secure parking", "Terrace common space", "Landscaped waterfront plaza", "Historic landmark building", "Bay & Bay Bridge views"],
    thingsToKnow: [{ text: "Residential condos sit above commercial office and retail floors; shared governance, security, and common-area cost allocation between commercial and residential owners can complicate HOA budgeting. Review the CC&Rs and HOA disclosures.", source: "Hoodline / NoeHill (SF Landmark #157)", date: "2026" }],
  },
  "16": {
    units: 320,
    narrative:
      "Jasper is a 40-story luxury rental tower in Rincon Hill / the East Cut, offering studios through two-bedrooms with floor-to-ceiling windows and bay or city views. As a professionally managed apartment community there are no for-sale units, suiting renters who want a downtown high-rise lifestyle without a long-term commitment. It's highly walkable and transit-rich, within reach of the Financial District, the Embarcadero, and major SoMa employers.",
    amenities: ["Fitness center", "Rooftop terrace / lounge", "Resident lounge", "Underground parking", "Pet-friendly with dog amenities", "Bike storage"],
    thingsToKnow: [],
  },
  "261": {
    units: 55,
    narrative:
      "181 Fremont places 55 ultra-luxury for-sale condominiums on the top 17 floors of an 802-foot tower that is otherwise office space — one of the tallest residential addresses on the West Coast. Owning here means full-service living with valet, direct elevator access, and a full-floor Residents' Club some 500 feet up with a 360° terrace, private dining, and a fitness center. A signature perk is private access to the adjacent Salesforce Park atop the Transit Center.",
    amenities: ["Full-floor Residents' Club", "360° observation terrace", "Fitness center with yoga room", "Private dining room", "Valet parking", "Direct Salesforce Park access"],
    thingsToKnow: [],
  },
  "322": {
    units: 298,
    narrative:
      "The One Rincon Hill North Tower at 401 Harrison (also marketed as The Harrison) is a 49-story for-sale condominium completed in 2014 — the second tower of the One Rincon Hill complex. Owners enjoy sweeping bay and city views from a hilltop perch above the Bay Bridge approach, with resort-style shared amenities and doorman/concierge service. The Rincon Hill location is highly walkable and close to the Embarcadero, Financial District, and transit.",
    amenities: ["Outdoor pool", "Fitness center", "Resident lounge", "24-hour doorman / concierge", "Valet / garage parking", "Sky terrace & views"],
    thingsToKnow: [{ text: "One Rincon Hill's construction-defect litigation centered on the South Tower; public records don't make clear whether the North Tower (this building) was included. Ask the HOA whether this tower had defect claims, repairs, or special assessments.", source: "Public reporting on One Rincon Hill litigation", date: "2026" }],
  },
  "482": {
    units: 45,
    narrative:
      "333 Bush is a 43-story Financial District tower that is mostly Class A office but includes about 45 individually owned condominiums on its top seven floors. Owners get dramatic high-floor city views in a central downtown location steps from Union Square, transit, and dining, with valet and below-grade parking. Because the homes sit above a working office building, residents share the tower with commercial tenants; it earned LEED Platinum after a 2017 renovation.",
    amenities: ["Valet parking", "Below-grade garage", "High-floor city views", "LEED Platinum building", "Ground-floor retail", "Staffed lobby"],
    thingsToKnow: [],
  },
  "55": {
    units: 270,
    narrative:
      "AVA 55 Ninth is a professionally managed rental community in SoMa offering studios through two-bedrooms, built in 2014 by AvalonBay. As a rental there are no ownership units, fitting renters who want an amenity-rich building in a central, transit-heavy location near Civic Center, Mid-Market, and the Financial District. Apartments include in-unit laundry and full kitchens, and it's pet-friendly; the Mid-Market setting is very walkable but mixed in character.",
    amenities: ["Fitness center", "Rooftop lounge", "Outdoor BBQ / dining area", "Bike storage", "Pet amenities (dog wash)", "Underground parking"],
    thingsToKnow: [],
  },
  "615": {
    units: 32,
    narrative:
      "The Montgomery Washington Tower is a 26-story mixed-use building in the north Financial District, directly across from the Transamerica Pyramid, with offices below and just 32 for-sale condominiums on the uppermost floors (residential entry at 611 Washington). With only 32 homes (roughly 1,240 to 5,160 sq ft), it's an intimate, full-service ownership building with 24-hour concierge and a rooftop pool, steps from Jackson Square, Chinatown, and North Beach.",
    amenities: ["24-hour concierge", "24-hour security", "Rooftop heated lap pool & sundeck", "Fitness center with sauna", "Assigned secured parking", "High-speed elevators"],
    thingsToKnow: [],
  },
  "627": {
    units: 92,
    narrative:
      "Twelve Hundred California is a 27-story, 92-home cooperative at California and Jones in the heart of Nob Hill, built in 1962. Because it's a co-op rather than condos, buyers purchase shares and the building vets purchasers, so it suits buyers comfortable with co-op ownership. It's one of Nob Hill's premier full-service buildings — 24-hour doormen, on-site management, and a long-established community in a prestigious, view-rich location served by the cable cars.",
    amenities: ["24-hour doormen", "On-site management", "Exercise room / health club", "Guest parking", "Library / conference room", "Storage"],
    thingsToKnow: [{ text: "This is a cooperative, not a condo: share ownership commonly carries stricter board approval, owner-occupancy and financing restrictions, and can be harder to mortgage. Confirm the co-op's rules before offering.", source: "SF real-estate listings (Compass / Condomania)", date: "2026" }],
  },
  "274": {
    units: 320,
    narrative:
      "The Infinity's North Tower at 301 Main is a ~37-story tower within Tishman Speyer's four-building Infinity condominium complex (about 650 homes total) completed in 2008 in Rincon Hill / South Beach near the Embarcadero. Residences are owner-occupied condos from compact studios to three-bedrooms, many with bay, bridge, or city views through the development's signature curving glass. It's a walkable waterfront location close to the Ferry Building, Oracle Park, and downtown, with full building staff.",
    amenities: ["24-hour attended lobby / concierge", "Fitness center", "Lap pool & spa", "Resident clubhouse / lounge", "Landscaped courtyard", "On-site parking"],
    thingsToKnow: [],
  },
  "333": {
    units: 118,
    narrative:
      "The Avery (Transbay Block 8) at 450 Folsom is a 56-story tower in the Transbay / East Cut, by Related California with OMA and Fougeron, completed in 2019. It's a mixed building of about 548 homes: 118 for-sale luxury condominiums on the upper floors above market-rate and affordable rentals. Condo buyers get high-floor views and a heavily amenitized full-service building steps from the Salesforce Transit Center and Park, with the on-site Shops at Avery Lane.",
    amenities: ["60-foot indoor lap pool", "Fitness center & steam room", "24-hour attended lobby", "Resident lounges & catering kitchen", "Outdoor terrace with BBQ", "Valet parking"],
    thingsToKnow: [],
    website: "https://www.theaverysf.com/",
  },
  "370": {
    units: 42,
    narrative:
      "Ten Miller Place is a 22-story boutique condominium in the Nob Hill area, built in 1963 with 42 owner-occupied homes. It's a full-service building with a 24/7 doorman, elevator, and deeded garage parking, and many homes enjoy city and bay views from the hilltop. The small unit count gives it an intimate feel, within walking distance of Union Square, the Financial District, Russian Hill, and Polk Street dining; floor plans range widely from compact homes to a large penthouse.",
    amenities: ["24/7 doorman", "Deeded garage parking", "Elevator", "City & bay views", "Nob Hill location"],
    thingsToKnow: [],
  },
  "443": {
    units: 418,
    narrative:
      "1190 Mission at Trinity Place is a 23-story rental high-rise in SoMa, completed in 2013 as a phase of the four-tower Trinity Place complex by Arquitectonica. It holds roughly 418 studio, one-, and two-bedroom apartments with on-site management, controlled access, and a 24-hour courtesy patrol, opening onto the large public Piazza Angelo courtyard. It's central and near transit, and a portion of the complex is rent-controlled.",
    amenities: ["Fitness center", "Rooftop deck", "Top-floor community room", "Per-floor laundry", "Covered garage parking", "Bike storage"],
    thingsToKnow: [{ text: "In 2015 the SF City Attorney accused the Trinity Place development of unlawfully renting rent-controlled units (citing seven at 1190 Mission) as short-term tourist rentals in alleged violation of its development agreement.", source: "Hoodline", date: "2015" }],
  },
  "617": {
    units: 444,
    narrative:
      "Fox Plaza is a 29-story mixed-use tower at 1390 Market in the Civic Center / Mid-Market area, built in 1966 on the site of the old Fox Theatre. The lower floors are office and retail; the upper floors hold about 444 rental apartments (mostly studios, plus one- and two-bedrooms), operated by Essex after a multi-year renovation. On-site conveniences include ground-floor retail (a Starbucks, a post office, a credit union) and a resident fitness center.",
    amenities: ["Fitness center", "Building laundry", "On-site paid parking garage", "Pet-friendly (restrictions)", "Package receiving", "On-site retail (Starbucks, USPS)"],
    thingsToKnow: [
      { text: "Built in 1966 with pre-Northridge welded steel moment frames; the owner performed a voluntary seismic retrofit (fluid viscous dampers and connection upgrades) to reduce collapse risk — indicating the original structure didn't meet modern seismic standards.", source: "Taylor Devices (structural case study)", date: "2024" },
      { text: "Tenant reviews recurringly cite building-management and maintenance issues — elevators out of service, pest complaints, package theft, and slow staff response. These are renter-reported, so weigh them against a personal tour.", source: "ApartmentRatings / Yelp tenant reviews", date: "2026" },
    ],
  },
  "76": {
    units: null,
    narrative:
      "405 Davis Court is one of the high-rise towers of Golden Gateway Center (marketed today as 'The Gateway'), built around 1967 in the Financial District / Barbary Coast redevelopment of the old Produce District. Although sometimes called 'Macondray House,' the Golden Gateway towers are rent-controlled rental apartments under single ownership — not for-sale co-ops or condos. The location is strong: a block or two from Embarcadero Center and the Ferry Building, on a master-planned superblock with elevated garden plazas, pedestrian bridges, and access to the Golden Gateway Tennis & Swim Club.",
    amenities: ["Elevated landscaped garden plazas", "Access to Golden Gateway Tennis & Swim Club", "Ground-floor retail on site", "Garage parking", "Bay & Ferry Building views (upper units)", "Steps from Embarcadero Center"],
    thingsToKnow: [],
  },
};

const EXTRA_BY_ID = Object.fromEntries(EXTRA_BUILDINGS.map(b => [b.id, b]));

// Official "property website" per building (objectid → URL), researched and
// verified to resolve to a real building/developer/operator page (not a listing
// aggregator). Merged into getBuilding() and rendered as a link in the pop-up +
// modal. Buildings with no verified site simply show no link.
export const WEBSITES = {
  "16": "https://www.rentjasper.com/",
  "55": "https://www.avaloncommunities.com/california/san-francisco-apartments/ava-55-ninth/",
  "196": "https://www.rentnema.com/",
  "211": "https://www.udr.com/san-francisco-bay-area-apartments/san-francisco/388-beale/",
  "220": "https://1188missionapts.com/",
  "239": "https://www.fourseasons.com/residences/private_residences/sanfrancisco/",
  "261": "https://181fremont.com/",
  "274": "https://infinitysf.org/",
  "293": "https://www.sperasf.com/",
  "341": "https://sequoialiving.org/san-francisco/",
  "350": "https://www.relatedrentals.com/apartment-rentals/san-francisco/mission/fifteen-fifty",
  "358": "https://solairesf.com/",
  "425": "https://706sf.com/",
  "443": "https://1190missionapts.com/",
  "451": "https://millenniumtower-sf.com/",
  "452": "https://infinitysf.org/",
  "468": "https://www.relatedrentals.com/apartment-rentals/san-francisco/soma/the-paramount",
  "507": "https://sfwatermark.com/",
  "588": "https://www.udr.com/san-francisco-bay-area-apartments/san-francisco/399-fremont/",
  "617": "https://www.essexapartmenthomes.com/apartments/san-francisco/fox-plaza",
  "618": "https://www.essexapartmenthomes.com/apartments/san-francisco/500-folsom",
  "624": "https://www.equityapartments.com/san-francisco/rincon-hill/340-fremont-apartments",
  "626": "https://hillsplazasf.com/",
  "x-765-market": "https://www.fourseasons.com/residences/private_residences/sanfrancisco/",
  "x-280-spear": "https://mirasf.com/",
  "x-250-king": "https://www.beaconsf.com/",
  "x-219-brannan": "https://www.thebrannan.com/",
  "x-631-folsom": "https://bluhoa.org/",
};

// Look up the authored supplement for a building (inventory or off-inventory),
// or null if none yet. Merges in the verified property website.
export function getBuilding(objectid) {
  const id = String(objectid);
  const base = BUILDINGS[id] || MORE_BUILDINGS[id] || EXTRA_BY_ID[id] || null;
  if (!base) return null;
  const website = base.website || WEBSITES[id] || null;
  return website ? { ...base, website } : base;
}
