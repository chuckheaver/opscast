// Grape variety encyclopedia — shown in the click-through grape modal.
//
// Every grape uses the SAME compact schema so the modal reads identically
// across varieties: short facts and lists, no prose paragraphs.
//   type       "Red" | "White"
//   origin     birthplace (one line)
//   parentage  DNA cross / lineage (optional)
//   aka        synonyms / other names (array; optional)
//   regions    where it's grown today (array)
//   climate    ideal MICROCLIMATE — temp regime, fog/marine influence,
//              ripening season, diurnal swing (the meteorology link)
//   site       topographic position & exposure — valley floor vs. hill/
//              bench, aspect, sun, position vs. the fog/inversion line
//   soils      preferred soils (one line)
//   tastes     typical flavor/aroma notes (array)
//   style      body / acid / tannin one-liner
//   facts      2–3 short "good to know" bullets
//
// SOURCING: well-established, widely-documented wine facts (parentage per
// UC Davis DNA work; classic regions and flavor profiles). Easy to expand
// or correct — just edit entries here.

export const GRAPE_PROFILES = {
  Chardonnay: {
    type: "White",
    origin: "Burgundy, France",
    parentage: "Pinot Noir × Gouais Blanc",
    aka: ["Aubaine", "Beaunois", "Melon Blanc"],
    regions: ["Burgundy (Chablis, Meursault)", "Champagne", "Russian River Valley", "Sonoma Coast", "Los Carneros", "Oregon", "Australia", "New Zealand"],
    climate: "Cool to moderate; morning fog and a long, even ripening season keep its acidity",
    site: "Valley floor to gentle slopes; thrives in fog-influenced sites; full to partial sun",
    soils: "Limestone, chalk, and clay-limestone",
    tastes: ["green apple", "lemon", "peach", "pineapple", "butter", "vanilla"],
    style: "Light to full-bodied; high acid; often oaked",
    facts: [
      "Blanc de Blancs sparkling wine is 100% Chardonnay.",
      "~80% of US Chardonnay traces to the 1912 Wente clone.",
      "Fueled the 1990s 'Anything But Chardonnay' backlash against oaky styles.",
    ],
  },
  "Cabernet Sauvignon": {
    type: "Red",
    origin: "Bordeaux, France",
    parentage: "Cabernet Franc × Sauvignon Blanc",
    aka: ["Cab", "Bouchet"],
    regions: ["Bordeaux (Médoc, Pauillac)", "Napa Valley (Oakville, Rutherford, Stags Leap)", "Washington", "Chile", "Coonawarra", "Tuscany"],
    climate: "Warm, sunny, long season; ripens late; wide diurnal swing builds color and tannin",
    site: "Well-drained benches and hillsides above the fog line; south/west-facing, full sun",
    soils: "Gravelly, well-drained loam; warm hillside soils",
    tastes: ["blackcurrant", "black cherry", "cedar", "graphite", "bell pepper"],
    style: "Full-bodied; high tannin; ages for decades",
    facts: [
      "The world's most-planted red wine grape.",
      "Napa Valley's signature grape.",
      "Won the 1976 Judgment of Paris (Stag's Leap Wine Cellars).",
    ],
  },
  "Pinot Noir": {
    type: "Red",
    origin: "Burgundy, France",
    parentage: "Ancient variety; mutates into Pinot Gris & Pinot Blanc",
    aka: ["Spätburgunder", "Pinot Nero"],
    regions: ["Burgundy", "Champagne", "Russian River Valley", "Sonoma Coast", "Los Carneros", "Willamette Valley", "New Zealand"],
    climate: "Cool; marine air and morning fog, moderate heat; very sensitive to heat spikes",
    site: "Fog-influenced valley floors and lower slopes; cool aspects; good air drainage to limit frost",
    soils: "Limestone, clay-limestone, well-drained volcanic",
    tastes: ["red cherry", "raspberry", "rose", "forest floor", "mushroom"],
    style: "Light to medium-bodied; high acid; soft tannins",
    facts: [
      "Nicknamed the 'heartbreak grape' — thin-skinned and finicky.",
      "The sole red of red Burgundy and a key Champagne grape.",
      "The 2004 film Sideways sent demand soaring.",
    ],
  },
  Zinfandel: {
    type: "Red",
    origin: "Croatia",
    parentage: "Same grape as Primitivo (Italy) & Tribidrag (Croatia)",
    aka: ["Primitivo", "Tribidrag", "Crljenak Kaštelanski"],
    regions: ["Dry Creek Valley", "Lodi", "Sierra Foothills", "Napa", "Puglia (Italy)"],
    climate: "Warm and sunny with steady, even warmth (ripens unevenly otherwise)",
    site: "Warm valley floors and benches in full sun; classic on old head-trained flats",
    soils: "Well-drained sandy and gravelly loam",
    tastes: ["jammy blackberry", "raspberry", "black pepper", "baking spice"],
    style: "Full-bodied; high alcohol; ripe and jammy",
    facts: [
      "California's heritage grape, with prized century-old vines.",
      "White Zinfandel (1970s) accidentally saved many old vineyards.",
      "Ripens unevenly — raisined and green berries on one cluster.",
    ],
  },
  Merlot: {
    type: "Red",
    origin: "Bordeaux, France",
    parentage: "Offspring of Cabernet Franc",
    aka: [],
    regions: ["Bordeaux Right Bank (Pomerol, Saint-Émilion)", "Napa", "Sonoma", "Washington", "Italy", "Chile"],
    climate: "Moderate to warm; ripens earlier than Cabernet, so it suits slightly cooler sites",
    site: "Valley floor and lower slopes; tolerates cooler, damper ground",
    soils: "Water-holding clay and limestone (e.g. Pomerol clay)",
    tastes: ["plum", "black cherry", "chocolate", "herbs"],
    style: "Medium to full-bodied; soft, plush tannins",
    facts: [
      "The most-planted grape in Bordeaux.",
      "Pétrus is nearly 100% Merlot — among the world's priciest wines.",
      "The 2004 film Sideways dented its US reputation.",
    ],
  },
  "Sauvignon Blanc": {
    type: "White",
    origin: "Loire & Bordeaux, France",
    parentage: "A parent of Cabernet Sauvignon",
    aka: ["Fumé Blanc", "Blanc Fumé"],
    regions: ["Loire (Sancerre, Pouilly-Fumé)", "Bordeaux", "Marlborough (NZ)", "California", "Chile", "South Africa"],
    climate: "Cool to moderate; cooler sites and big diurnal swings keep its bright acidity & aromatics",
    site: "Valley floor to slopes; full sun with cool nights; fog-influenced sites work well",
    soils: "Gravel, limestone, and flinty/silex soils",
    tastes: ["gooseberry", "lime", "grapefruit", "cut grass", "passionfruit"],
    style: "Light-bodied; crisp, high acid; aromatic",
    facts: [
      "Robert Mondavi coined 'Fumé Blanc' in 1968.",
      "Marlborough, NZ defined the modern, pungent style.",
      "Grassy notes come from pyrazine compounds.",
    ],
  },
  Syrah: {
    type: "Red",
    origin: "Northern Rhône, France",
    parentage: "Dureza × Mondeuse Blanche",
    aka: ["Shiraz"],
    regions: ["Northern Rhône (Hermitage, Côte-Rôtie)", "Barossa Valley", "California", "Washington", "South Africa"],
    climate: "Moderate to warm; sunny with reliable heat to ripen",
    site: "Steep, sun-drenched hillsides (classic Northern Rhône); south-facing slopes, full sun",
    soils: "Granite and schist; well-drained",
    tastes: ["blackberry", "plum", "black pepper", "smoked meat", "olive"],
    style: "Full-bodied; savory to jammy",
    facts: [
      "Syrah and Shiraz are the same grape — the name signals the style.",
      "The black-pepper note comes from the compound rotundone.",
      "Core of GSM (Grenache–Syrah–Mourvèdre) blends.",
    ],
  },
  "Petite Sirah": {
    type: "Red",
    origin: "France, 1860s",
    parentage: "Syrah × Peloursin (true name: Durif)",
    aka: ["Durif"],
    regions: ["Napa", "Sonoma", "Lodi", "Australia", "Israel"],
    climate: "Warm; needs sustained heat to ripen its thick skins (late-ripening)",
    site: "Warm valley floors and benches in full sun",
    soils: "Well-drained loam and gravel",
    tastes: ["blueberry", "blackberry", "black pepper", "dark chocolate"],
    style: "Full-bodied; inky; very high tannin",
    facts: [
      "Not the same grape as Syrah.",
      "'Petite' refers to its small berries, not the wine.",
      "Often blended with Zinfandel for color and structure.",
    ],
  },
  Viognier: {
    type: "White",
    origin: "Northern Rhône (Condrieu), France",
    parentage: "Likely related to Syrah",
    aka: [],
    regions: ["Condrieu (Rhône)", "California", "Australia", "Virginia"],
    climate: "Warm; needs heat to build its aromatics while holding enough acidity",
    site: "Steep, sun-facing slopes (classic Condrieu); full sun",
    soils: "Granite and decomposed schist",
    tastes: ["peach", "apricot", "honeysuckle", "tangerine"],
    style: "Full-bodied; low acid; floral and aromatic",
    facts: [
      "Nearly went extinct in the 1960s — down to a few hectares.",
      "Co-fermented with Syrah in Côte-Rôtie to lift aromatics.",
    ],
  },
};

// Synonyms / alternate spellings → canonical key in GRAPE_PROFILES.
const ALIASES = {
  Shiraz: "Syrah",
  Durif: "Petite Sirah",
  "Fumé Blanc": "Sauvignon Blanc",
  Primitivo: "Zinfandel",
  Spätburgunder: "Pinot Noir",
  "Pinot Nero": "Pinot Noir",
  Zin: "Zinfandel",
};

// Look up a profile by grape name (case/spacing-insensitive, alias-aware).
// Returns null when we have no profile — callers render such names as
// plain (non-clickable) text.
export function getGrapeProfile(name) {
  if (!name) return null;
  const raw = name.trim();
  if (GRAPE_PROFILES[raw]) return { name: raw, ...GRAPE_PROFILES[raw] };
  if (ALIASES[raw]) return { name: ALIASES[raw], ...GRAPE_PROFILES[ALIASES[raw]] };
  const lower = raw.toLowerCase();
  const key = Object.keys(GRAPE_PROFILES).find(k => k.toLowerCase() === lower);
  if (key) return { name: key, ...GRAPE_PROFILES[key] };
  const aliasKey = Object.keys(ALIASES).find(k => k.toLowerCase() === lower);
  if (aliasKey) return { name: ALIASES[aliasKey], ...GRAPE_PROFILES[ALIASES[aliasKey]] };
  return null;
}

export const hasGrapeProfile = name => getGrapeProfile(name) != null;
