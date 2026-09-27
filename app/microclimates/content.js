// Content for /microclimates. Data only — page.js lays it out, charts.jsx draws it.
//
// House style for this page: short titles, no paragraphs, facts as bullets, a
// graphic per section. If a sentence can be a number, it is a number.
//
// Belt membership and fog hours are read from the site's own measured data
// (USGS GOES low-cloud hours, 1999–2009), so the copy cannot drift from the map.

export const LEDE =
  "Seven miles across, and the weather changes with the block. Here is why, from the ocean down to your street.";

// ---------------------------------------------------------------- 1. Köppen

export const KOPPEN = {
  code: "Csb",
  name: "Warm-summer Mediterranean",
  letters: [
    { k: "C", label: "Temperate", p: "Coldest month averages above 32°F (or 26.6°F)." },
    { k: "s", label: "Dry summer", p: "Driest summer month under 1.6 in, and a third or less of the wettest winter month." },
    { k: "b", label: "Warm summer", p: "Every month averages under 71.6°F; at least four average above 50°F." },
  ],
  bullets: [
    "Dry-summer climates like ours cover about 2% of Earth's land — Porto, Valparaíso and the Oregon coast share our code.",
    "One code covers the whole city. The sections below break it down.",
  ],
};

// July afternoon normals on roughly the same line of latitude.
export const LATITUDE = [
  { k: "Seville, 37.4°N", v: 97 },
  { k: "Athens, 38.0°N", v: 92 },
  { k: "Richmond VA, 37.5°N", v: 89 },
  { k: "San Francisco, 37.8°N", v: 67, hi: true },
];

// --------------------------------------------------- 2. The regional engine

export const ENGINE = [
  { n: "1", h: "A cold current", p: "The California Current runs south past us all year." },
  { n: "2", h: "Upwelling", p: "Northwest winds push surface water offshore; cold water rises to replace it. The ocean at Ocean Beach sits at 52–56°F in August." },
  { n: "3", h: "The North Pacific High", p: "Parked offshore from spring to fall. It blocks storms, and its sinking air lays a warm lid — the inversion — over the cool air below." },
  { n: "4", h: "The Central Valley", p: "95–105°F inland. Hot air rises, pressure falls, and marine air gets pulled through the gaps in the Coast Range." },
];

export const ENGINE_BULLETS = [
  "The sea-level gaps are the Golden Gate, the San Bruno Gap, the Petaluma Gap and Carquinez. They act as nozzles.",
  "Hotter Valley = harder push. The fog is strongest when inland California is at its worst.",
  "Winter turns it off: the High slides south, storms arrive, the lid breaks up. The clearest days of the year follow a January storm.",
];

// ------------------------------------------------- 3. Bay Area sub-climates

export const BAY_ZONES = [
  { k: "Sonoma Coast", eg: "Bodega Bay", jul: 62, rain: 30 },
  { k: "Outer Marin coast", eg: "Point Reyes", jul: 63, rain: 32 },
  { k: "Coastside", eg: "Pacifica, Half Moon Bay", jul: 64, rain: 27 },
  { k: "San Francisco — west", eg: "Outer Sunset", jul: 64, rain: 22, hi: true },
  { k: "San Francisco — east", eg: "Mission, North Beach", jul: 72, rain: 22, hi: true },
  { k: "East Bay flats", eg: "Berkeley, Oakland", jul: 73, rain: 24 },
  { k: "Santa Cruz Mtns crest", eg: "Skyline", jul: 78, rain: 45 },
  { k: "Mid-Peninsula", eg: "San Mateo, Palo Alto", jul: 79, rain: 18 },
  { k: "Petaluma Gap", eg: "Petaluma", jul: 82, rain: 25 },
  { k: "Central Marin", eg: "San Rafael", jul: 82, rain: 32 },
  { k: "South Bay", eg: "San Jose", jul: 84, rain: 15 },
  { k: "Sonoma Valley", eg: "Santa Rosa", jul: 87, rain: 32 },
  { k: "Upper Napa Valley", eg: "Calistoga", jul: 90, rain: 36 },
  { k: "Inland East Bay", eg: "Walnut Creek, Livermore", jul: 90, rain: 16 },
];

export const BAY_BULLETS = [
  "28°F separates Bodega Bay from Livermore on the same July afternoon, 80 miles apart.",
  "Skyline collects three times the rain San Jose does — storms are forced up and over the Santa Cruz Mountains.",
  "Winter nights barely vary: 38°F inland to 49°F in the city. Summer is what sorts this region.",
];

export const BAY_NOTE =
  "Rounded typical values, shown for the spread rather than to be quoted for any one town.";

// ------------------------------------------------------ 4. The three belts

export const BELTS_LEAD =
  "The ridge down the middle of the city — Mount Davidson 928 ft, Twin Peaks 922, Mount Sutro 909 — does to marine air what the Coast Range does to the region.";

export const BELTS = [
  {
    key: "sun", name: "Sunbelt", color: "#E8B84B", hours: "6 – 8", count: 37,
    where: "North Beach, Russian Hill, Financial District, SoMa, Mission, Castro, Potrero Hill, Dogpatch",
    bullets: [
      "The northeast quadrant, in the lee of the ridge.",
      "Eight to ten degrees warmer than the west side on a summer afternoon.",
      "Least wind, most reliable sun, highest price per foot.",
    ],
  },
  {
    key: "transition", name: "Transition", color: "#D8C08E", hours: "8.25 – 8.5", count: 6,
    where: "Noe Valley, Buena Vista, Panhandle, Anza Vista, Lower Pacific Heights, Peralta Heights",
    bullets: [
      "The saddles through the ridge — only six neighborhoods sit here.",
      "Fog spills over in the late afternoon, gone by eleven the next morning.",
      "One block can be on the sunny or the grey side of a saddle.",
    ],
  },
  {
    key: "fog", name: "Fog belt", color: "#8DA2B5", hours: "9 – 12.5", count: 60,
    where: "Richmond, Sunset, Cole Valley, Glen Park, Bayview, Excelsior, West Portal, Ingleside, Lakeshore",
    bullets: [
      "Everything west of the ridge, plus the southern tier fed by the San Bruno Gap.",
      "Summer afternoons in the low 60s with a 20+ mph west wind.",
      "The southwest corner — Ingleside, Oceanview, Parkmerced, Lakeshore — runs to 12.5 hours and is the city's most affordable ground.",
    ],
  },
];

// Measured summer fog hours a day, from the site's own neighborhood data.
export const FOG_HOURS = [
  { k: "Treasure Island", v: 6.0 },
  { k: "North Beach", v: 6.5 },
  { k: "Mission", v: 7.5 },
  { k: "Potrero Hill", v: 8.0 },
  { k: "Noe Valley", v: 8.5 },
  { k: "Outer Sunset", v: 9.0 },
  { k: "Glen Park", v: 10.0 },
  { k: "Parkside", v: 10.5 },
  { k: "West Portal", v: 11.0 },
  { k: "Lakeshore", v: 12.5 },
];

export const FOG_HOURS_NOTE =
  "Average summer fog and low-cloud hours per day — USGS analysis of GOES satellite imagery, 1999–2009. The same data the fog map is drawn from.";

// -------------------------------------------------- 5. Block-scale drivers

export const BLOCK = [
  {
    h: "Wind",
    bullets: [
      "20–30 mph through the Golden Gate from midafternoon into the night.",
      "Ridgelines speed it up; the ground just downwind of a hill can be 10°F warmer and half as windy.",
      "Downtown towers throw their own gusts — a plaza can be unusable while the street behind it is calm.",
    ],
  },
  {
    h: "Sun angle",
    bullets: [
      "Low winter sun makes the direction a slope faces decisive.",
      "A north-facing slope can sit in its own shadow for weeks.",
      "A rear yard north of a three-story building may get no direct winter sun at all.",
    ],
  },
  {
    h: "Elevation",
    bullets: [
      "The fog deck has a top, usually 800–1,500 ft.",
      "Twin Peaks in sun above a white sea, Cole Valley 300 ft below it in grey — same afternoon.",
      "Higher is not automatically better: on a deep day the hilltops are first in and last out.",
    ],
  },
  {
    h: "Grade",
    bullets: [
      "Cold air is dense — at night it drains downhill and pools in the low ground.",
      "Glen Canyon and the Sunset's interior hollows run colder overnight than the slopes above them.",
      "A steep south-facing lot collects far more winter sun than flat ground next door.",
    ],
  },
];

// Sun on a lot — the bullets that go with the drawings.
export const LOT_BULLETS = [
  "In June the sun rises and sets behind the north wall — northeast and northwest.",
  "In December it rises and sets well south of east and west, and tops out at 29°.",
  "A north-facing rear yard spends most of the winter in its own house's shadow.",
];

export const SUN_TOOLS = [
  "Sun Seeker or Sun Surveyor (phone): draws the sun's path over the camera view.",
  "Compass and inclinometer apps: the direction and angle to any roofline or tree.",
  "Google Earth: 3D buildings and a sun slider for any date.",
  "A photo from the yard at noon near December 21 settles it.",
];

// ----------------------------------------------------------------- 6. Fog

export const FOG_WHAT = [
  {
    h: "What it is",
    bullets: [
      "Air cooled to its dew point — the water it can no longer hold condenses.",
      "Ours is advection fog: humid ocean air crossing water colder than itself.",
      "Not tule fog — that forms on cold, still winter nights in the Central Valley.",
    ],
  },
  {
    h: "Why summer",
    bullets: [
      "Every driver peaks May to August: strongest High, coldest water, hottest Valley.",
      "Foggiest month: July.",
      "September and October relax the pattern — our warmest, clearest months.",
    ],
  },
];

export const DECK = [
  { k: "Shallow", ft: 600, sub: "under 800 ft", p: "Peaks in sun above the fog" },
  { k: "Typical", ft: 1200, sub: "800 – 1,500 ft", p: "Burns off late morning" },
  { k: "Deep", ft: 2200, sub: "over 2,000 ft", p: "Grey all day" },
];

export const FOG_TOPO = [
  {
    h: "The ridge",
    bullets: [
      "Marine air comes in low and heavy and stacks against the western slope.",
      "It spills through the saddles and around the ends rather than over the top.",
      "Cole Valley sits below a saddle and gets the overflow. The Castro, a mile east, stays in the sunbelt.",
    ],
  },
  {
    h: "Two doors",
    bullets: [
      "The Golden Gate feeds the northern half — Presidio, Richmond, Marina, across the Bay.",
      "The San Bruno Gap feeds the south along the 280 corridor.",
      "That second door is why Ingleside and Lakeshore see far more fog than the Mission a few miles north.",
    ],
  },
  {
    h: "Inversion",
    bullets: [
      "A strong cap stops the deck mixing out — it can sit all day.",
      "A weak cap lets the morning sun break it up.",
      "Offshore wind removes it: the fog goes out to sea and the city gets its 80°F days.",
    ],
  },
];

// --------------------------------------------------------------- 7. The year

export const YEAR_BULLETS = [
  "September is the warmest month, October second. June is not summer here.",
  "Very little air conditioning in the housing stock, and not much heating either.",
  "72°F in the Mission and 58°F with a 25 mph wind at Ocean Beach, same hour, same day.",
];

export const DISCLAIMER =
  "Climate normals: NOAA/NWS, downtown San Francisco station. Fog hours: USGS analysis of GOES " +
  "satellite imagery, 1999–2009. Regional figures are rounded. Diagrams are schematic. Any single " +
  "year departs from all of it.";
