// Content for /microclimates. Data only — page.js does the layout.
//
// The order is deliberate: classification, then the ocean that causes it,
// then the Bay Area, then San Francisco, then the block, then fog, then the
// numbers. High to low, every step explaining the one under it.
//
// Where a figure comes from this site's own data it is marked. The Bay Area
// table is rounded on purpose: it is there to show the spread across the
// region, not to be quoted as a normal for any one town.

export const LEDE =
  "San Francisco is seven miles on a side and holds a range of climates that most " +
  "regions spread over a hundred miles. This is the whole chain of causes — the " +
  "ocean, the hills, the fog and your particular block — in the order things actually happen.";

// ---------------------------------------------------------------- 1. Köppen

export const KOPPEN = {
  code: "Csb",
  name: "Warm-summer Mediterranean",
  lead:
    "Under the Köppen system — the classification climatologists have used for a " +
    "century — San Francisco is Csb. Three letters that tell you almost everything " +
    "about living here, once you know what they mean.",
  letters: [
    {
      k: "C",
      label: "Temperate",
      p: "The coldest month averages above freezing but below 64°F. Nothing here freezes for long, and nothing here gets properly hot. The city has gone decades between measurable snowfalls.",
    },
    {
      k: "s",
      label: "Dry summer",
      p: "The driest summer month gets under an inch, and less than a third of what the wettest winter month gets. San Francisco clears that bar without trying: July normally records essentially nothing, January about four and a half inches.",
    },
    {
      k: "b",
      label: "Warm summer",
      p: "The warmest month averages under 71.6°F. This is where the label becomes a joke locally — San Francisco qualifies by a mile. Our warmest month averages a high near 70°F, and that month is September, not July.",
    },
  ],
  body: [
    {
      h: "Only a sliver of the planet works this way",
      p: "Dry-summer Mediterranean climates cover roughly two percent of the Earth's land: the Mediterranean basin itself, coastal California, central Chile, the Cape of South Africa and southwest Australia. The cool coastal version San Francisco belongs to is rarer still — you would have to go to Porto, to Valparaíso, or to the Oregon coast to find the same two letters doing the same thing.",
    },
    {
      h: "We are far cooler than our latitude says we should be",
      p: "San Francisco sits at 37.8° north — the same line as Seville, Athens and Richmond, Virginia. Those places see July afternoons around 90 to 97°F. San Francisco's July afternoon normal is 67°F. That gap of twenty-five to thirty degrees is not latitude, altitude or luck. It is the Pacific Ocean, and it is the single fact that explains this city's weather.",
    },
    {
      h: "One classification, many climates",
      p: "Köppen works at the scale of a region. It has one label for the entire city, which is exactly why it is only the starting point here. The Outer Sunset and the Mission share a Köppen code and almost nothing else. Everything below this section is about why.",
    },
  ],
};

// --------------------------------------------------- 2. The regional engine

export const ENGINE = {
  lead:
    "Four things drive Bay Area weather. Three of them run hardest in summer, which " +
    "is why summer is the strange season here and winter is the ordinary one.",
  parts: [
    {
      n: "1",
      h: "A cold current running south",
      p: "The California Current carries cool water down the West Coast year round. It is the eastern limb of the North Pacific gyre, and it means the ocean at our doorstep starts out colder than the latitude would suggest.",
    },
    {
      n: "2",
      h: "Upwelling, which makes it colder still",
      p: "From spring into fall, steady northwest winds drag surface water away from the coast. The Earth's rotation bends that flow offshore, and water from a few hundred feet down rises to replace it. That deep water is cold — the ocean off Ocean Beach sits in the low-to-mid 50s°F in August, colder than it is in many Februaries. It also feeds the whole coastal food chain, which is why the fishing and the fog arrive together.",
    },
    {
      n: "3",
      h: "A mountain of sinking air parked offshore",
      p: "The North Pacific High is a semi-permanent area of high pressure that strengthens and moves north each spring. Two consequences: it blocks storms, which is why it does not rain here from May to October; and its air is sinking, and sinking air warms. That puts a layer of warm air a few thousand feet up, sitting on top of the cool marine air below — an inversion, a lid.",
    },
    {
      n: "4",
      h: "A furnace inland",
      p: "The Central Valley reaches 95 to 105°F on a summer afternoon. Hot air rises, pressure at the surface falls, and the cool dense marine air on the coast gets pulled toward the gap. The Coast Ranges block most of it. The sea-level breaks — the Golden Gate, the San Bruno Gap south of the city, the Petaluma Gap to the north and the Carquinez Strait to the east — become nozzles. The hotter the Valley, the harder the city gets hosed with ocean air.",
    },
  ],
  winter: {
    h: "Then winter flips the whole thing off",
    p: "In late fall the North Pacific High slides south and weakens. The storm track drops to our latitude, and the atmospheric rivers that deliver most of California's water start landing on the coast. Storms mix the atmosphere from top to bottom, so the inversion — and the summer fog that lives under it — mostly disappears. That is the local paradox worth knowing before you move here: the clearest, sharpest, most spectacular views in San Francisco usually come the day after a winter storm, and the greyest weeks of the year are in June and July.",
  },
};

// ------------------------------------------------- 3. Bay Area sub-climates

export const BAY_LEAD =
  "Marine air is the region's thermostat, and the only question anywhere in the " +
  "Bay Area is how much of it reaches you. Distance from a gap in the Coast Range, " +
  "and whether a ridge stands in the way, sorts the entire region. North to south:";

export const BAY_ZONES = [
  {
    name: "Sonoma Coast",
    eg: "Bodega Bay, Jenner",
    why: "Directly exposed to the ocean. Cool and damp in every month.",
    jul: "62°", jan: "42°", rain: "30\"",
  },
  {
    name: "Upper Napa Valley",
    eg: "Calistoga, St. Helena",
    why: "Marine air drains in overnight and burns off by nine. Hot afternoons, cold nights — the diurnal swing that grows the grapes.",
    jul: "90°", jan: "38°", rain: "36\"",
  },
  {
    name: "Santa Rosa & Sonoma Valley",
    eg: "Santa Rosa, Sonoma",
    why: "Inland enough to get hot, open enough to get the evening marine push.",
    jul: "87°", jan: "39°", rain: "32\"",
  },
  {
    name: "The Petaluma Gap",
    eg: "Petaluma, Sears Point",
    why: "A low break in the Coast Range that funnels ocean air straight into Sonoma. One of the windiest corridors in California.",
    jul: "82°", jan: "40°", rain: "25\"",
  },
  {
    name: "Outer Marin coast",
    eg: "Point Reyes, Stinson Beach",
    why: "Fog country. Point Reyes is among the foggiest places on the West Coast.",
    jul: "63°", jan: "44°", rain: "32\"",
  },
  {
    name: "Central Marin",
    eg: "San Rafael, Ross Valley",
    why: "Mount Tamalpais blocks the direct marine push. Markedly warmer than the coast six miles away.",
    jul: "82°", jan: "43°", rain: "32\"",
  },
  {
    name: "San Francisco — west",
    eg: "Outer Sunset, Richmond",
    why: "First land the marine air touches. The city's coolest, windiest, foggiest ground.",
    jul: "64°", jan: "48°", rain: "22\"",
    sf: true,
  },
  {
    name: "San Francisco — east",
    eg: "Mission, Potrero, North Beach",
    why: "In the lee of the Twin Peaks ridge. Regularly eight to ten degrees warmer on a summer afternoon than the Sunset.",
    jul: "72°", jan: "49°", rain: "22\"",
    sf: true,
  },
  {
    name: "The coastside",
    eg: "Daly City, Pacifica, Half Moon Bay",
    why: "Open ocean on one side, the San Bruno Gap behind. Cool and grey through the summer.",
    jul: "64°", jan: "45°", rain: "27\"",
  },
  {
    name: "East Bay flats",
    eg: "Berkeley, Oakland, Alameda",
    why: "Marine air arrives across the Bay, softened by the crossing. Mild, and mild almost all the time.",
    jul: "73°", jan: "45°", rain: "24\"",
  },
  {
    name: "Inland East Bay",
    eg: "Walnut Creek, Concord, Livermore",
    why: "Behind the Oakland–Berkeley hills. Genuinely hot summers, rescued most evenings by the Delta breeze.",
    jul: "90°", jan: "38°", rain: "16\"",
  },
  {
    name: "Mid-Peninsula bayside",
    eg: "San Mateo, Burlingame, Palo Alto",
    why: "Sheltered from the ocean by the Santa Cruz Mountains, cooled a little by the Bay. The region's mildest strip.",
    jul: "79°", jan: "43°", rain: "18\"",
  },
  {
    name: "Santa Cruz Mountains crest",
    eg: "Skyline, La Honda",
    why: "Storms are forced up and over, so it rains here like nowhere else in the region — and the ridge sits in the fog deck all summer.",
    jul: "78°", jan: "42°", rain: "45\"",
  },
  {
    name: "South Bay",
    eg: "San Jose, Santa Clara",
    why: "The end of the line: far from every gap and in the rain shadow of the Santa Cruz Mountains. The Bay Area's driest, hottest, sunniest corner.",
    jul: "84°", jan: "42°", rain: "15\"",
  },
];

export const BAY_NOTE =
  "Typical July afternoon high, typical January overnight low, and annual rainfall — " +
  "rounded, and shown to make the spread visible rather than to be quoted for any one town. " +
  "Bodega Bay and Livermore sit eighty miles apart and differ by nearly thirty degrees on the " +
  "same July afternoon; the coastside and the inland East Bay manage twenty-six degrees in under " +
  "fifty. Skyline collects three times the rain San Jose does.";

// ------------------------------------------------ 4. The three SF belts

export const BELTS_LEAD =
  "Inside the city the same logic repeats at one-tenth the scale. The Twin Peaks " +
  "ridge — Mount Davidson at 928 feet, Twin Peaks at 922, Mount Sutro at 909 — runs " +
  "down the middle of San Francisco and does to marine air what the Coast Range does " +
  "to the region. West of it is the fog belt. East of it is the fog shadow. In between " +
  "is a band that goes either way depending on the afternoon.";

export const BELTS = [
  {
    key: "fog",
    name: "The Fog Belt",
    where: "Outer Sunset, Parkside, Outer Richmond, Lakeshore, Ingleside, Oceanview, Merced Heights",
    hours: "9 – 12.5 hrs",
    color: "#8DA2B5",
    p: "Everything west and southwest of the ridge, taking the marine air first and unfiltered. Summer afternoons in the low 60s with a 20-plus mph west wind, and a grey ceiling that can hold from May into August. It is also the city's most affordable ground with the largest houses per dollar, and on the ten to twenty clear days a year it is spectacular.",
  },
  {
    key: "transition",
    name: "The Transition Band",
    where: "Cole Valley, Haight, Noe Valley, Glen Park, Forest Hill, West Portal, Miraloma Park",
    hours: "8 – 9 hrs",
    color: "#D8C08E",
    p: "The ridge itself and the saddles through it. Fog pours over the low points in the late afternoon, sits overnight, and is usually gone by eleven the next morning. A single block can sit on the sunny or the grey side of a saddle; this band is where the map earns its keep.",
  },
  {
    key: "sun",
    name: "The Sunbelt",
    where: "Mission, Potrero Hill, Bernal Heights, Dogpatch, Bayview, North Beach, Telegraph and Russian Hill",
    hours: "6 – 8 hrs",
    color: "#E8B84B",
    p: "The eastern third, in the lee of the ridge and shielded from the direct ocean push. Warmer by eight to ten degrees on a summer afternoon, far less wind, and the city's reliable sun. The Mission gets both the afternoon sun and the sunset glow off the fog piling up on the hills above it.",
  },
];

export const BELTS_DATA_NOTE =
  "Hours are average summer fog and low-cloud hours per day, from USGS work on " +
  "GOES satellite imagery, 1999–2009 — the same data the fog map on this site is " +
  "drawn from. Across San Francisco the measured range runs from about 6.0 hours a " +
  "day on the bayside to 12.5 in the outer southwest. Two neighborhoods seven miles " +
  "apart, and one of them sits under cloud twice as long as the other.";

// -------------------------------------------------- 5. Block-scale drivers

export const BLOCK_LEAD =
  "Three belts is still a generalization. Within one belt, four physical things " +
  "decide what a specific address actually gets — and all four can change inside a " +
  "single block.";

export const BLOCK = [
  {
    h: "Wind: where the nozzle points",
    p: "The Golden Gate is the only sea-level gap in the Coast Range for sixty miles, and on a summer afternoon it behaves like the mouth of a hose. Air accelerates through it and fans out across the city's western half, routinely 20 to 30 mph from midafternoon until well after dark. Ridgelines speed it up further — air has to compress to get over a hill — while the ground immediately downwind of a hill sits in a sheltered eddy that can be ten degrees warmer and half as windy. Downtown adds a layer of its own: tall towers redirect wind down their faces and around their corners, so a plaza can be unusable at 4pm while the street behind it is calm.",
  },
  {
    h: "Sun angle: the same sky, different amounts of it",
    p: "At San Francisco's latitude the noon sun stands about 76° above the horizon on June 21 and only about 29° on December 21. That low winter sun is what makes aspect decisive here. A south-facing slope takes winter light almost square-on and stays usable all season. A north-facing slope of the same grade can spend weeks in its own shadow, and a rear yard north of a three-story building may get no direct winter sun at all. This is measurable, and the solar layer on the map measures it — season by season, for the actual parcel.",
  },
  {
    h: "Elevation: in the deck, or above it",
    p: "Summer fog is a layer with a top, usually somewhere between 800 and 1,500 feet. San Francisco's high ground sits right at that height, which produces the city's signature sight: Twin Peaks in clear sun above a white sea, with Cole Valley three hundred feet below it in grey. Height is not automatically better — on a deep-marine-layer day the hilltops are the first thing in the cloud and the last thing out of it. What matters is where the top of the deck falls that week relative to your address.",
  },
  {
    h: "Incline and aspect: drainage, pooling and slope",
    p: "Cold air is dense, so at night it slides downhill and pools in the low ground — Glen Canyon and the interior hollows of the Sunset run colder overnight than the slopes around them. Slope angle also changes how much sun a surface collects for a given sun angle: a steep south-facing lot can collect noticeably more winter sun than flat ground nearby, and a steep north-facing lot noticeably less. Grade drives what a garden will do, what a solar array will return, how much a house costs to heat, and how much fog condensation the north wall lives with.",
  },
];

// ----------------------------------------------------------------- 6. Fog

export const FOG = {
  lead:
    "Fog is the part people ask about, and it is the most misunderstood thing in " +
    "the city's weather. It is not random, it is not caused by the Bay, and it is " +
    "not the same phenomenon that greys out the Central Valley in winter.",
  what: [
    {
      h: "What fog actually is",
      p: "Air holds a certain amount of water vapor depending on its temperature. Cool the air enough and it reaches its dew point — the temperature at which it cannot hold any more — and the excess condenses into droplets. A cloud on the ground is fog. Every kind of fog is a different way of reaching that same point.",
    },
    {
      h: "Ours is advection fog, made over cold water",
      p: "Advection fog forms when moist air moves horizontally across a surface colder than its dew point. That is exactly the setup here: the air over the Pacific is humid, the upwelled water off our coast sits in the low-to-mid 50s°F all summer, and air drifting across it gets chilled from beneath until it condenses. The layer that forms is a few hundred to a couple of thousand feet deep, and it is properly called marine stratus. Where it touches ground — Ocean Beach, the west-facing hills — it is fog. Where the ground is lower, it passes overhead as a low grey cloud deck.",
    },
    {
      h: "The other kind, which is not ours",
      p: "Radiation fog forms on cold, clear, windless nights when the ground radiates its heat away and chills the air in contact with it. That is the tule fog of the Central Valley in winter, and it is a different animal: it forms in place, it needs calm, and it is a winter phenomenon. San Francisco gets it only occasionally. When people say 'San Francisco fog,' they mean the summer marine layer.",
    },
  ],
  pacific: {
    h: "The ocean's part",
    p: "Upwelling is what makes the whole thing work. The same northwest winds that drive the marine layer inland are the winds that pull cold water up to the surface, and the temperature contrast does the rest: water in the low 50s on one side of the Coast Range, land above 100°F on the other. That contrast is the strongest it gets in June and July, which is precisely when the fog is at its worst — and it relaxes in September and October, which is why those are the city's warmest, clearest months and why so many visitors leave in August convinced San Francisco has no summer. It doesn't. It has one, and it runs from September to mid-October.",
  },
  dayLead:
    "On a typical July day the marine layer follows a clock. Where you are in the " +
    "city determines which hours you live in.",
  day: [
    { t: "Late night – 8am", p: "The deck is at its deepest and furthest inland. Fog covers the west side to the ground, spills through the Gate, crosses the Bay and runs up the valleys. Drizzle drips off the trees on the west side without a drop of rain falling." },
    { t: "9am – noon", p: "The sun heats the ground and the shallow edges of the deck mix out from the inside. Burn-off runs east to west: the Mission clears first, then Noe, then the ridge. The Outer Sunset may never clear at all." },
    { t: "Noon – 3pm", p: "The clearest part of the day on the west side, if it gets one. Meanwhile the Central Valley is heating toward its peak, and the pressure difference across the Coast Range is building." },
    { t: "3pm – 6pm", p: "The push. The gradient maxes out, the west wind hits its stride through the Golden Gate, and the marine layer comes back across the city, visibly, from the west. This is the hour photographers wait on Twin Peaks for." },
    { t: "6pm – midnight", p: "The fog pours over the ridge saddles and fills the low ground behind them. Temperatures on the west side drop into the 50s. The foghorns at the Gate run all night." },
  ],
  topo: [
    {
      h: "The hills are a dam",
      p: "Marine air comes in low and heavy. The Twin Peaks–Mount Sutro–Mount Davidson ridge stands across its path, and fog stacks up against the western slope, spills through the low saddles and slides around the ends. That is why Cole Valley and the Castro sit at the receiving end of a fog chute while Bernal Heights, a mile and a half further east at a similar elevation, bakes.",
    },
    {
      h: "Two doors into the city",
      p: "There are two main entries. The Golden Gate is the obvious one, feeding the northern half — the Presidio, the Richmond, the Marina and across to the Bay. The San Bruno Gap, the low corridor south of the city that the airport sits in, is the second: it funnels marine air in from Daly City along the 280 corridor, which is why the Outer Mission, Ingleside and Lakeshore see far more fog than the Mission does a few miles north.",
    },
    {
      h: "How high it stands",
      p: "In summer the top of the marine layer usually sits between about 800 and 1,500 feet. Below roughly 800, the city's peaks poke out into clear sun above a solid white floor. Above about 2,000, everything including the ridge is inside the cloud and the day never fully burns off. That number, more than anything else, decides whether a hillside address is above the weather or in it.",
    },
    {
      h: "Why the inversion decides everything",
      p: "The warm air sinking out of the North Pacific High lays a lid over the cool marine air, and the strength and height of that lid governs fog behavior. A strong, low inversion traps a shallow, dense deck that cannot mix out — grey all day, on the coast and often over the whole city. A weak or high inversion lets the morning sun stir the layer away by mid-morning. When offshore flow arrives and the lid tilts the other way, the fog is pushed out to sea entirely and the city gets its 80°F days. It is the same marine layer in all three cases; the lid above it is what changed.",
    },
    {
      h: "Why summer, and not winter",
      p: "Every driver peaks at once between May and August: the North Pacific High is at its strongest and furthest north, upwelling is running hardest so the water is at its coldest, and the Central Valley is at its hottest so the pull inland is at its greatest. In winter all three relax, and passing storms mix the atmosphere so thoroughly that no inversion survives. San Francisco's foggiest month is usually July. Its clearest stretch is the week after a January storm.",
    },
  ],
  karl:
    "The city named it Karl somewhere around 2010, which is a very San Francisco thing to do to a weather pattern.",
};

// --------------------------------------------------------- 7. The year

export const YEAR_LEAD =
  "Here is what all of that adds up to over twelve months — what to pack, what to " +
  "plant, and what to expect if you are moving here.";

export const YEAR_NOTES = [
  {
    h: "There is no hot season, and no cold one",
    p: "Average highs travel about thirteen degrees between the coolest month and the warmest. Most American cities swing forty or more. The practical result is that the city has very little air conditioning and not much heating either, and that the difference between neighborhoods on a given afternoon can be larger than the difference between January and July.",
  },
  {
    h: "September is the summer",
    p: "The warmest month in San Francisco is September, with October close behind. Upwelling eases, the High weakens, offshore flow becomes common, and the city gets the clear, still, genuinely warm days that June refused to hand over.",
  },
  {
    h: "The rain arrives on a schedule",
    p: "About 84% of the year's rain falls between November and March, usually in a handful of large frontal systems and atmospheric rivers rather than in daily showers. Summer rain is close to nonexistent — July normally records essentially none — which is why the landscape browns off by August and why a summer roof leak is a surprise.",
  },
  {
    h: "Dress for the block, not the city",
    p: "A layer you can take off is the whole trick. A July afternoon can be 72°F in the Mission and 58°F with a 25 mph wind at Ocean Beach, at the same hour on the same day, fifteen minutes apart by car.",
  },
];

export const DISCLAIMER =
  "Written as a plain-language explainer, not a scientific paper. Climate normals are " +
  "NOAA/NWS figures for the downtown San Francisco station; fog hours come from USGS " +
  "analysis of GOES satellite imagery, 1999–2009; regional figures are rounded and " +
  "approximate. Weather in any single year will depart from all of it.";
