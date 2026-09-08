// Educational reference content lifted from the tasting presentation
// (minus the flight-specific tasting menu). Feeds the Learn modal, the
// Winkler heat-zone click popups, and the soil-archetype click popups.

// ── The Five Microclimate Influencers ─────────────────────────────────
export const INFLUENCERS = [
  {
    emoji: "🌡️",
    name: "Heat",
    tag: "Winkler GDD",
    body: "Growing Degree Days = sum of daily-average temps above 50 °F, Apr 1 → Oct 31. UC Davis (1944) scale runs Region I (cool) → Region V (hot). Determines which grapes ripen where.",
  },
  {
    emoji: "🌫️",
    name: "Fog",
    tag: "Two sources",
    body: "Marine layer through the Golden Gate + Petaluma Gap cools the valleys 20-30 °F below inland highs. Native valley fog also pools overnight and burns off ~10 AM. Both preserve acid.",
  },
  {
    emoji: "🌬️",
    name: "Wind",
    tag: "Diurnal pull",
    body: "Bay + Pacific pressure differential pulls afternoon wind through the gaps and valleys. Wind thickens skins, raises tannin, slows photosynthesis. Petaluma Gap is the reference case.",
  },
  {
    emoji: "🧭",
    name: "Aspect",
    tag: "Slope direction",
    body: "SW / S / W-facing slopes take direct afternoon sun (warmer, riper). N / NW-facing slopes stay cooler (higher acid, slower ripening). East-facing takes morning sun early.",
  },
  {
    emoji: "🗻",
    name: "Elevation",
    tag: "~15 % per 1000 ft",
    body: "Mountain AVAs (Howell, Diamond, Mt Veeder, Atlas Peak) sit ABOVE the fog inversion (~1000 ft), so they lose the marine cooling but gain longer sun + UV. Cooler nights, more intense days.",
  },
];

// ── Winkler Heat Regions ──────────────────────────────────────────────
// Keyed by band number 1..5 (matches the wine-microclimates.geojson
// "band" property on the temp features).
export const WINKLER = {
  1: {
    region: "Region I",
    gdd: "< 2,500 GDD",
    temp: "≤ 70 °F afternoon avg",
    style: "Cool — high acid, slow ripening",
    grapes: ["Sparkling wine (Chard + Pinot Noir)", "Chardonnay", "Pinot Noir", "Riesling"],
    examples: ["Los Carneros", "Sonoma Coast", "Russian River Valley", "Green Valley", "Willamette Valley"],
    swatch: "#7dd3fc",
  },
  2: {
    region: "Region II",
    gdd: "2,501 – 3,000 GDD",
    temp: "70 – 77 °F afternoon avg",
    style: "Moderate — Burgundy + right-bank Bordeaux weather",
    grapes: ["Pinot Noir", "Chardonnay", "Merlot", "Cabernet Franc"],
    examples: ["Yountville", "Mt Veeder", "Sonoma Valley (south)", "Bennett Valley"],
    swatch: "#a3e635",
  },
  3: {
    region: "Region III",
    gdd: "3,001 – 3,500 GDD",
    temp: "77 – 83 °F afternoon avg",
    style: "Warm — classic Napa Cab country",
    grapes: ["Cabernet Sauvignon", "Sauvignon Blanc", "Zinfandel", "Merlot"],
    examples: ["Oakville", "Rutherford", "Howell Mountain", "Alexander Valley", "Dry Creek Valley"],
    swatch: "#fde68a",
  },
  4: {
    region: "Region III+ / IV",
    gdd: "3,501 – 4,000 GDD",
    temp: "83 – 88 °F afternoon avg",
    style: "Hot — jammy, high-alcohol reds",
    grapes: ["Zinfandel", "Cabernet Sauvignon (bold style)", "Petite Sirah", "Syrah"],
    examples: ["St. Helena", "north Dry Creek Valley"],
    swatch: "#fdba74",
  },
  5: {
    region: "Region IV",
    gdd: "> 4,000 GDD",
    temp: "> 88 °F afternoon avg",
    style: "Very hot — the warmest inland wine-country sites",
    grapes: ["Zinfandel", "Petite Sirah", "Cabernet Sauvignon (jammy style)"],
    examples: ["Calistoga", "inland north-Alexander"],
    swatch: "#f97316",
  },
};

// ── Six Soil Archetypes ───────────────────────────────────────────────
// Keyed by short id (matches wine-soils.geojson `soil` property).
export const SOILS = {
  volcanic: {
    name: "Volcanic",
    tag: "Basalt · tuff · red iron loam",
    swatch: "#7f1d1d",
    traits: "Mineral, iron-rich, low-vigor, well-drained. Concentrates flavor by stressing the vine. Signature 'red rock' iron note.",
    sites: ["Howell Mountain", "Mt Veeder", "Diamond Mountain", "Atlas Peak", "Sonoma Mountain", "Chalk Hill", "Jory (Willamette)"],
    wines: ["Structured Cabernet Sauvignon", "Old-vine Zinfandel", "Mountain Chardonnay", "Willamette Pinot Noir"],
  },
  alluvial_gravel: {
    name: "Alluvial Gravel",
    tag: "Old riverbed cobble + loam",
    swatch: "#c4a574",
    traits: "Very well-drained, warms fast in the sun, forces roots deep for water. The 'Bordeaux Left Bank' terroir — where structured Cabs are born.",
    sites: ["Rutherford Bench", "Oakville alluvial fans", "St. Helena benches", "Left Bank Bordeaux (Médoc, Pauillac)"],
    wines: ["Cabernet Sauvignon (structured, tannic)", "Sauvignon Blanc"],
  },
  alluvial_fan: {
    name: "Alluvial Fan / Loam",
    tag: "Bale + Yolo silt / clay / loam mix",
    swatch: "#d4a76a",
    traits: "Deep, fertile, moisture-retentive valley soils built up by centuries of run-off. Balanced vigor — for pure fruit ripening rather than austere structure.",
    sites: ["Napa Valley floor", "Sonoma Valley floor", "central Alexander Valley"],
    wines: ["Merlot", "Chardonnay", "friendly-style Cabernet"],
  },
  clay: {
    name: "Clay",
    tag: "Cool, water-retentive",
    swatch: "#7c2d12",
    traits: "Holds water and stays cool — moderates the vine's stress even in warm zones. Yields concentrated, silky reds; distinctively 'earthy' whites.",
    sites: ["Los Carneros (Diablo clay loam)", "Pomerol (France)", "parts of Sonoma Valley"],
    wines: ["Pinot Noir", "Merlot (Pomerol style)", "sparkling Chardonnay base"],
  },
  marine_sed: {
    name: "Marine Sedimentary",
    tag: "Sandstone · shale · Goldridge sandy loam",
    swatch: "#a3a380",
    traits: "Ancient seabed lifted by tectonics. Sandy, well-drained, quick to warm on the surface but cools fast at night. Signature stony / oyster-shell finish.",
    sites: ["Russian River Valley (Goldridge)", "Green Valley", "Sonoma Coast", "Spring Mountain (shale)"],
    wines: ["Pinot Noir (red-cherry, tea)", "Chardonnay (mineral, structured)"],
  },
  limestone_chalk: {
    name: "Limestone / Chalk",
    tag: "Calcium-rich, alkaline",
    swatch: "#e7d5b3",
    traits: "Cool, high-mineral, drought-resistant. Retains acid even in warm years — the reason Burgundy + Champagne make the wines they do. Rare in California.",
    sites: ["Chalk Hill (volcanic ash w/ chalky texture)", "Burgundy (Côte d'Or)", "Champagne", "parts of Paso Robles"],
    wines: ["Chardonnay (bright, mineral)", "Pinot Noir (elegant)", "sparkling wine"],
  },
};

// ── Slope Angle — angle-of-incidence math ────────────────────────────
export const SLOPE_TABLE = [
  { angle: "Flat 0°",       gain: "Baseline",   note: "Reference — full noon sun distributed across the horizontal footprint." },
  { angle: "10° S-facing",  gain: "+8 %",       note: "Mild bench — noticeable warming vs the valley floor next door." },
  { angle: "20° S-facing",  gain: "+18 %",      note: "The threshold at which the SF fog map's Warm Slopes layer paints an area orange." },
  { angle: "30° S-facing",  gain: "+25 %",      note: "Textbook mountain vineyard slope — Rutherford Bench, Diamond Mountain SW, Mt Etna terraces." },
  { angle: "10° N-facing",  gain: "-8 %",       note: "Cool bench. High-acid whites; hard to ripen big reds here." },
  { angle: "30° N-facing",  gain: "-25 %",      note: "Shaded slope — most of the Mayacamas W face, Sonoma Coast N-facing ridgelines." },
];

// ── Winkler history (3-column) ────────────────────────────────────────
export const WINKLER_HISTORY = {
  origin: {
    title: "Origin",
    body: "A.J. Winkler + Maynard Amerine, UC Davis, 1944. First published in *General Viticulture* (1962). They classified California from 1 (cool) to 5 (hot) using Growing Degree Days (>50 °F, Apr–Oct) — a metric borrowed from field agronomy and applied to Vitis vinifera for the first time.",
  },
  production: {
    title: "In Production",
    body: "Every serious California grower still consults the Winkler map when deciding what to plant. It's the single reason Cab is planted in St. Helena and Pinot in Carneros — not by tradition, but by 80 years of yield + ripeness data.",
  },
  modern: {
    title: "Modern Extensions",
    body: "Contemporary work adds the Huglin Index (heliothermic, adjusted for latitude), the Growing Season Temperature (GST) mean, and the diurnal range as separate axes. Winkler is the coarse dial; these are the fine ones.",
  },
};
