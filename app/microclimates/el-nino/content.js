// Words for /microclimates/el-nino. Informational only: nothing in the market
// stats, reports or other pages reads this file. Every figure carries its
// source in SOURCES (numbered, printed in the footnotes); the "as of" status is
// NOAA's monthly ENSO discussion and is updated after each one.

export const AS_OF = {
  date: "October 8, 2026",
  next: "November 12, 2026",
  status: "El Niño Advisory",
};

export const LEDE =
  "El Niño is a warming of the tropical Pacific that shifts weather around the world. " +
  "A strong one is under way for winter 2026–27. This page explains how it works, " +
  "what past strong events did in the Bay Area, Lake Tahoe and wine country, and what " +
  "homeowners can do before the storms.";

export const TOPLINE = [
  { v: "+2.1°C", k: "Niño-3.4 sea surface temperature above normal", s: "NOAA, Oct 8, 2026 [1]" },
  { v: ">83%", k: "Chance of a strong to very strong El Niño through Jan–Mar 2027", s: "NOAA, Oct 8, 2026 [1]" },
  { v: "6–12 in", k: "Bay Area sea level above normal expected this fall and winter", s: "Forecasters, Sep–Oct 2026 [6][7]" },
  { v: "Not a promise", k: "2015–16 was very strong and San Francisco got a normal year of rain", s: "[4]" },
];

export const WORDS = [
  { k: "ENSO", p: "El Niño–Southern Oscillation: the swing of the tropical Pacific between El Niño, neutral and La Niña, every two to seven years." },
  { k: "Trade winds", p: "Steady winds that blow east to west along the equator, pushing warm surface water toward Asia." },
  { k: "Thermocline", p: "The boundary between the warm surface layer and the cold water below it." },
  { k: "Upwelling", p: "Cold, deep water rising to the surface, mostly off South America and California." },
  { k: "Niño-3.4", p: "The patch of the central Pacific NOAA watches. Since February 2026 NOAA measures it against the whole tropics (the RONI index)." },
];

export const STATES = [
  {
    key: "normal", h: "Neutral", when: "The usual Pacific",
    p: "Trade winds pile warm water up near Asia, where it rises as storms. Off South America cold water wells up. The storm track over the North Pacific aims mostly at the Pacific Northwest.",
    read: [["Trade winds", "steady"], ["Warm pool", "west"], ["Bay Area winter", "average"]],
  },
  {
    key: "nino", h: "El Niño", when: "Trade winds weaken",
    p: "The trade winds weaken and the warm water slides east. Storms follow it to the central and eastern Pacific, and a stronger jet stream runs straight at California, often farther south.",
    read: [["Trade winds", "weak"], ["Warm pool", "east"], ["Bay Area winter", "wetter odds"]],
    tone: "warm",
  },
  {
    key: "nina", h: "La Niña", when: "Trade winds strengthen",
    p: "The opposite: stronger trade winds push the warm water farther west and more cold water wells up in the east. The storm track lifts north, and California winters lean dry, especially in the south.",
    read: [["Trade winds", "strong"], ["Warm pool", "far west"], ["Bay Area winter", "drier odds"]],
    tone: "cool",
  },
];

export const KELVIN = [
  {
    h: "The winds let go", when: "Western Pacific",
    p: "When the trade winds weaken or reverse, the warm water they held against Asia is released. It starts to move east as a bulge of warm water tens of feet thick, called a Kelvin wave.",
  },
  {
    h: "Across the Pacific", when: "Along the equator",
    p: "The wave travels east along the equator for about two to three months, deepening the warm layer as it goes. NOAA tracks each one; several can follow in a strong event.",
  },
  {
    h: "Up the coast", when: "South America to California",
    p: "At South America the wave splits. Part of it turns north and runs up the coast of Central America, Mexico and California as a coastal Kelvin wave, carrying the warm, raised water with it.",
  },
  {
    h: "Higher water at the shore", when: "The Bay Area",
    p: "Warm water takes up more room than cold, upwelling weakens, and southerly storm winds push water toward shore. Together they hold the ocean several inches above normal for months.",
  },
];

export const STACK = {
  lead: "None of these floods a street on its own. It is the stack, on the same day, that reaches shoreline streets, beaches and bluffs.",
  layers: [
    { k: "Normal high tide", p: "Twice a day." },
    { k: "King Tide", p: "The year's highest tides, near the new and full moon in December and January." },
    { k: "El Niño", p: "6 to 12 inches added for months, from the Kelvin waves and warm water [6][7]. In 1982–83 and 1997–98, 6 to 10 inches from fall to late spring [9]." },
    { k: "Storm surge", p: "Low pressure and wind. On Feb 3, 1998 the tide at Fort Point ran about 2 feet above prediction [10]." },
    { k: "Waves and runoff", p: "Big surf on the open coast; rain that can't drain on a high tide." },
  ],
  where: [
    "Ocean Beach, where winter waves erode the bluffs south of Sloat Boulevard.",
    "The Embarcadero and the Bay shoreline at King Tides.",
    "Low ground near Mission Creek and Islais Creek.",
    "Pacifica's bluffs and beaches, and low stretches of the Marin shore.",
  ],
};

export const HISTORY = [
  {
    yr: "1982–83", tag: "Very strong",
    facts: [
      "San Francisco rain: 167% of normal for the water year [4].",
      "Central Sierra Snow Lab: 671 inches of snow, third most since records began in 1946 [11].",
    ],
  },
  {
    yr: "1997–98", tag: "Very strong",
    facts: [
      "San Francisco rain: 47.22 inches, the second-wettest season since 1849 [5].",
      "Tide at Fort Point on Feb 3, 1998: about 2 feet above prediction [10].",
      "Landslides across the 10-county Bay region: over $150 million in damage [12].",
      "Rio Nido, Sonoma County: a slide forced 140 homes to evacuate on Feb 6–7 [12].",
      "Pacifica: homes on Esplanade Drive declared uninhabitable as the bluffs eroded [13].",
    ],
  },
  {
    yr: "2015–16", tag: "Very strong",
    facts: [
      "San Francisco rain: 101% of normal, an average year; Los Angeles got 48% [4].",
      "Pacifica: two apartment buildings on Esplanade, emptied in 2010 for bluff erosion, were demolished in Feb–Mar 2016 [13].",
    ],
  },
  {
    yr: "2026–27", tag: "Under way",
    facts: [
      "A Kelvin wave raised Southern California sea level about 6 to 8 inches above normal in early October [8].",
      "Bay Area sea level is expected to run 6 to 12 inches high into spring 2027 [6][7].",
      "More waves are expected from October through February [7].",
    ],
    now: true,
  },
];

export const TAHOE = {
  facts: [
    "Under the strongest El Niños, the Reno–Tahoe region has averaged about 20% more winter precipitation than normal; weaker events have run drier [14].",
    "Whether it falls as snow or rain depends on elevation. Warm, wet storms can bring rain onto the snowpack [14].",
    "1982–83 brought 671 inches to the Central Sierra Snow Lab near Donner Summit [11].",
  ],
  todo: [
    "Know your roof's design snow load (the county building department has it) and have a contractor clear heavy, wet snow before it builds up.",
    "Watch for ice dams at the eaves; keep gutters clear and the attic well insulated and ventilated.",
    "Keep gas meters, propane tanks and furnace and water-heater vents clear of snow.",
    "Decks, balconies and stairs: have snow cleared, and check posts and connections after a big season.",
    "Vacant homes: keep the heat on, know where the water shut-off is, and arrange regular checks.",
    "Line up snow removal and plowing before the first storm; carry chains for I-80 and US-50 controls.",
  ],
};

export const WINE = {
  facts: [
    "Winter rain mostly falls while the vines are dormant; the risks are to land, roads and houses more than to the vines.",
    "1997–98: about 60 inches of rain in Napa from November to February, with widespread mildew and botrytis and a much smaller crop [15].",
    "1997–98: the Rio Nido slide on the Russian River forced 140 homes to evacuate [12].",
    "Wet years refill reservoirs and groundwater.",
  ],
  todo: [
    "Clear culverts, ditches and drains on the property; keep driveways and private roads draining.",
    "Hillside vineyards and yards: erosion control (cover crops, straw wattles) in place before the rain.",
    "Below recent burn scars, rain can bring debris flows; know the county's evacuation zone.",
    "Wells: if floodwater reaches the wellhead, have the water tested before drinking it.",
    "Septic: saturated ground can back up a system; keep heavy water use down during long storms.",
    "Along the Russian, Napa and Petaluma rivers: check the county flood map and the river forecasts.",
  ],
};

export const CHECKLIST = [
  {
    h: "Now",
    items: [
      "Flood insurance: a new federal (NFIP) policy usually takes 30 days to start. Homeowners policies don't cover flood; earthquake and landslide are separate too.",
      "Photograph rooms, belongings and the outside of the house for any claim.",
      "Backwater valve: stops sewage backing up into the house in heavy rain. SFPUC's Floodwater Grant reimburses up to $100,000 for flood protection [16].",
      "Have the roof, flashing and skylights inspected; trim trees over the house and power lines.",
    ],
  },
  {
    h: "Before the first big storm",
    items: [
      "Clean gutters and downspouts; carry water at least a few feet from the foundation.",
      "Clear the storm drain in front of the house (the city's Adopt-a-Drain program) [16].",
      "Test the sump pump, and add a battery backup.",
      "Check retaining walls and hillside drainage; on a slope, ask a geotechnical engineer.",
      "Sandbags for doorways and garage entries on low ground.",
      "Flashlights, batteries, a charged phone pack, and a plan for a power outage.",
    ],
  },
  {
    h: "During",
    items: [
      "Stay off the beach and away from bluff edges in big surf.",
      "Never drive or walk through moving or flooded water.",
      "Watch for new cracks, bulging walls, tilting trees or posts: early signs of a slide.",
    ],
  },
  {
    h: "After",
    items: [
      "Photograph damage before cleaning up; call the insurer.",
      "Check the foundation, crawl space and basement for water; dry them out fast to stop mold.",
      "Have a slope or retaining wall looked at if anything moved.",
    ],
  },
];

export const DEALS = [
  "San Francisco sellers and landlords must disclose whether a property is in SFPUC's 100-Year Storm Flood Risk Zone. The map shows flooding from heavy rain only, not from the Bay or the ocean [17].",
  "California's Natural Hazard Disclosure covers FEMA flood zones, dam inundation, fire and seismic zones.",
  "Ask the seller about past water in the basement or garage, sewer backups, drainage work and roof leaks.",
  "Inspections to consider: roof, drainage and grading, sewer lateral (camera), and a geotechnical review on a slope or bluff.",
];

export const SOURCES = [
  "NOAA Climate Prediction Center, ENSO Diagnostic Discussion, Oct 8, 2026 (cpc.ncep.noaa.gov). The Sep 10, 2026 discussion gave a 75% chance of a record event (+2.5°C or more) in Oct–Dec 2026.",
  "NOAA Climate Prediction Center, Relative Oceanic Niño Index (RONI), effective Feb 1, 2026.",
  "NOAA Climate.gov, ENSO blog: how El Niño and La Niña work.",
  "SFBayWeather, El Niño in the Bay Area and California: 1997–98 vs. 2026–27 (downtown San Francisco, percent of normal by water year).",
  "Jan Null, Golden Gate Weather Services, 1997–1998 San Francisco Rainfall Season in Review (ggweather.com).",
  "KGO-TV, Sep 18, 2026: El Niño-driven Kelvin wave could raise Bay Area sea levels by up to 1 foot.",
  "Associated Press, Oct 3, 2026: A pulse of warm water hitting the Pacific coast could mean erosion and flooding.",
  "NPR, Oct 19, 2026: A Kelvin wave raised sea levels on the West Coast. More are coming.",
  "California Ocean Protection Council, memo on record-breaking sea levels, Dec 2015.",
  "U.S. Geological Survey, Fact Sheet 175-99, and Sea level response to ENSO along the central California coast.",
  "Associated Press, the Sierra Nevada's snowiest seasons, Central Sierra Snow Lab records since 1946.",
  "U.S. Geological Survey, landslides caused by El Niño rainstorms, winter 1997–98 (Open-File Report 98-089; MF-2325).",
  "KGO-TV, 1998 and 2016 coverage of Esplanade Drive, Pacifica; City of Pacifica releases, 2016.",
  "Reno Gazette Journal, Jan 2016: El Niño making snow now (Reno–Tahoe precipitation in strong events).",
  "1998 Sonoma and Napa vintage reports.",
  "San Francisco Public Utilities Commission: Floodwater Grant Program; Adopt-a-Drain.",
  "San Francisco Public Utilities Commission: 100-Year Storm Flood Risk Map and FAQs.",
];

export const DISCLAIMER =
  "General information, not a forecast for any property or advice on insurance, engineering or law. " +
  "For a specific property, ask a licensed inspector, engineer or insurance agent. Forecasts change; " +
  "check NOAA and the National Weather Service for current conditions.";
