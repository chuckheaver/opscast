// Popup content for each AVA — the "why this place is different" card
// that opens on click. Keyed by AVA name (must match the `name`
// property in public/data/wine-avas.geojson).
//
// Each entry:
//   winkler        — heat region I..V (UC Davis Winkler classification)
//   soil           — soil archetype + short characterization
//   elevation      — feet range (rough envelope for the AVA footprint)
//   slopeAspect    — where the grapes actually sit + which way they face
//   varieties      — [{ name, why }] — dominant grape + one-line reason
//                    it thrives in this microclimate
//   summary        — italic 1-line "so what" that ties the physics
//                    (aspect / temp / soil) to the wine you'll taste

export const AVA_CONTENT = {
  "Napa Valley": {
    winkler: "II – IV (spans the range)",
    soil: "Alluvial fans, volcanic uplands, marine sediments — the AVA covers ~15 sub-AVAs across every soil archetype.",
    elevation: "0 – 2,700 ft",
    slopeAspect: "Valley floor + Mayacamas (W wall, E-facing) + Vaca (E wall, W-facing).",
    varieties: [
      { name: "Cabernet Sauvignon", why: "Warm mid-valley benches (Oakville → Calistoga) + gravelly alluvial soils — Napa's flagship." },
      { name: "Chardonnay + Pinot Noir", why: "Carneros south end stays marine-cool for the sparkling / still whites end of the range." },
    ],
    summary: "Everything Napa is famous for lives inside a 30-mile north-south corridor with a ~15 °F afternoon spread — this is the parent AVA, not a terroir on its own.",
  },
  "Los Carneros (Napa)": {
    winkler: "I – II (coolest inland Napa)",
    soil: "Diablo clay loam + volcanic ash lenses — poor drainage stresses the vines.",
    elevation: "0 – 400 ft",
    slopeAspect: "Rolling low hills, valley floor pressed against San Pablo Bay. Bay-facing slopes take the marine push head-on.",
    varieties: [
      { name: "Pinot Noir", why: "Cold marine fog + wind hold sugars back → high acid, red-fruit signature." },
      { name: "Chardonnay", why: "Same cool signature preserves acid for lean, mineral, sometimes sparkling wines." },
    ],
    summary: "The southern gate — the reason Napa isn't Fresno. Fog through the Golden Gate → San Pablo Bay pins summertime highs 15 °F below Calistoga.",
  },
  "Los Carneros (Sonoma)": {
    winkler: "I – II",
    soil: "Sonoma clay loam over sedimentary bedrock — cool, moisture-retentive.",
    elevation: "0 – 400 ft",
    slopeAspect: "Rolling hills open to San Pablo Bay + Petaluma Gap winds.",
    varieties: [
      { name: "Pinot Noir", why: "Double marine forcing (bay + gap) gives even cooler nights than Napa Carneros." },
      { name: "Chardonnay", why: "High acid retention + chalky finish; the Sonoma sparkling-wine backbone." },
    ],
    summary: "Shares a name with Napa Carneros but sees more Petaluma Gap wind. Even greater diurnal swing → thicker skins on the Pinots.",
  },
  "Yountville": {
    winkler: "II",
    soil: "Bale gravelly loam — deep, well-drained alluvium off the Mayacamas.",
    elevation: "50 – 500 ft",
    slopeAspect: "Valley floor + gentle west-side benches. Morning fog reaches; afternoons burn off ~11 AM.",
    varieties: [
      { name: "Merlot", why: "Cooler than Oakville next door → merlot ripens without the raisin risk of hotter mid-valley sites." },
      { name: "Cabernet Sauvignon", why: "Softer, red-fruited style. Less tannic than Oakville / Rutherford — the 'elegant' end of Napa Cab." },
    ],
    summary: "The pivot point of the valley — the last sub-AVA that still sees reliable fog. From here north, whites give way to structured reds.",
  },
  "Oakville": {
    winkler: "III",
    soil: "Bale + Yolo alluvial loams — very deep, iron-rich reds on the eastern bench.",
    elevation: "100 – 500 ft",
    slopeAspect: "Alluvial fans east + west of the Napa River, gentle east-facing benches capture morning sun.",
    varieties: [
      { name: "Cabernet Sauvignon", why: "Peak-Napa heat + drainage + gravel → the classic dense, high-tannin structure. This is where the cult labels sit." },
      { name: "Sauvignon Blanc", why: "The rare heat-region III SB — Robert Mondavi's 'Fumé Blanc' put Oakville SB on the map." },
    ],
    summary: "The middle of the valley by every measure — heat, drainage, tannin. Half the price on the label is 'because Oakville.'",
  },
  "Rutherford": {
    winkler: "III",
    soil: "Rutherford Bench — deep alluvial gravel on the west side, iron-rich clay on the east. \"Rutherford dust\" flavor comes from this soil.",
    elevation: "100 – 500 ft",
    slopeAspect: "The 'Bench' is a west-side alluvial fan facing east — takes morning sun early, drains fast.",
    varieties: [
      { name: "Cabernet Sauvignon", why: "The 'Rutherford dust' minerality is unmistakable — a cocoa / cedar signature only this bench produces." },
    ],
    summary: "One grape, one bench, one signature. Warmer than Oakville by a few degrees; the tannins arrive with dust, not oak.",
  },
  "St. Helena": {
    winkler: "III – IV",
    soil: "Aiken + Boomer volcanic loams over Mayacamas colluvium — the Vaca-side alluvium is younger, more mixed.",
    elevation: "150 – 700 ft",
    slopeAspect: "Valley narrows here; alluvial fans on both sides, west-side benches face east (morning sun).",
    varieties: [
      { name: "Cabernet Sauvignon", why: "Hotter than Oakville — riper, jammier fruit; higher alcohol; softer tannins." },
      { name: "Zinfandel", why: "Old-vine Zin plots on the volcanic west side benefit from the heat spikes." },
    ],
    summary: "The valley pinches in and heat pools. Every AVA line north of here reads 'warmer' — St. Helena is the crossover.",
  },
  "Calistoga": {
    winkler: "IV (warmest sub-AVA)",
    soil: "Volcanic tuff + gravel from the ancient Mount Konocti lahar — porous, hot at the surface.",
    elevation: "300 – 1,200 ft",
    slopeAspect: "Valley floor rises here; hillside vineyards face south and southwest into afternoon sun.",
    varieties: [
      { name: "Zinfandel", why: "Zin needs the heat to fully ripen and hold high alcohol without cooking — Calistoga delivers." },
      { name: "Petite Sirah", why: "Structural grape that thrives on volcanic minerality + heat stress." },
      { name: "Cabernet Sauvignon", why: "Bold, jammy, high-alcohol interpretation — very different from Rutherford's dusty style." },
    ],
    summary: "The northern furnace. 100 °F+ summer afternoons + volcanic mineral loading = the biggest, boldest wines in Napa.",
  },
  "Howell Mountain": {
    winkler: "III (cooler than mid-valley — elevation offsets latitude)",
    soil: "Aiken loam over volcanic tuff (red basalt) + iron-rich fractured rock.",
    elevation: "1,400 – 2,200 ft (all vineyards above the fog line)",
    slopeAspect: "SW-facing benches on the Vaca ridge dominate. Above the fog inversion, so afternoons stay UV-intense.",
    varieties: [
      { name: "Cabernet Sauvignon", why: "Above-fog UV + volcanic drainage = thick skins, huge tannin, long-aging structure." },
      { name: "Zinfandel", why: "Old-vine mountain plots (Lamborn) give concentrated, black-pepper Zin with minerality unavailable on the valley floor." },
    ],
    summary: "Above the fog line — a different climate on the same latitude. Cooler days than the valley below + intense UV = the most structured wines in Napa.",
  },
  "Diamond Mountain": {
    winkler: "II – III",
    soil: "Volcanic ash + red iron loam — extremely well-drained, low-vigor.",
    elevation: "400 – 2,200 ft",
    slopeAspect: "Mayacamas-side ridge, SE-facing benches catch morning sun and stay warmer than Spring Mtn.",
    varieties: [
      { name: "Cabernet Sauvignon", why: "SE-facing + volcanic — floral, red-cherry Cab with mountain tannin. Less overtly ripe than Howell." },
    ],
    summary: "Napa's other above-the-fog mountain — softer than Howell because it faces the warm bay, not the cool coast.",
  },
  "Spring Mountain": {
    winkler: "II",
    soil: "Sandy loam over sedimentary marine shale — more acidic than Diamond or Howell.",
    elevation: "600 – 2,200 ft",
    slopeAspect: "Mayacamas ridge, east-facing terraces catch early sun but the ridge blocks afternoon heat.",
    varieties: [
      { name: "Cabernet Sauvignon", why: "Cooler, more restrained mountain Cab — high acid + fine-grained tannin." },
      { name: "Cabernet Franc", why: "Cool-loving Bordeaux variety finds its Napa home here — Spring Mtn is one of the few sites cool enough." },
    ],
    summary: "The most restrained mountain AVA — cooler and more acidic than Howell or Diamond, closer in style to right-bank Bordeaux.",
  },
  "Mount Veeder": {
    winkler: "I – II (very cool for Napa)",
    soil: "Sedimentary marine + volcanic mix — thin, rocky, low-vigor.",
    elevation: "500 – 2,000 ft",
    slopeAspect: "Bay-facing Mayacamas ridge — SW slopes cool from Carneros marine air; NW slopes see very little sun.",
    varieties: [
      { name: "Cabernet Sauvignon", why: "The most Bordeaux-like Napa Cab — high acid, gravelly minerality, savory rather than jammy." },
      { name: "Chardonnay", why: "Cool-mountain acid → bright, structured Chard with genuine mineral finish." },
    ],
    summary: "The AVA where marine air climbs the hill. Napa's coolest mountain — Cab here can be mistaken for Bordeaux more than for St. Helena.",
  },
  "Atlas Peak": {
    winkler: "III – IV",
    soil: "Volcanic tuff + rocky red loam — the eastern Vaca answer to Howell.",
    elevation: "1,000 – 2,700 ft",
    slopeAspect: "SW-facing Vaca ridge benches. Above the valley fog, exposed to afternoon sun from the west.",
    varieties: [
      { name: "Cabernet Sauvignon", why: "Big, tannic, above-fog Cab — structure closer to Howell than to the valley floor." },
      { name: "Sangiovese", why: "The Antinori family plantings (Antica) — Italian variety thrives on volcanic mountain terroir." },
    ],
    summary: "Howell's east-side counterpart. Same above-fog physics, but the SW aspect makes it a touch hotter and jammier.",
  },
  "Sonoma Valley": {
    winkler: "II – III",
    soil: "Sonoma volcanic + Goulding gravelly loam on the alluvial fans.",
    elevation: "50 – 1,500 ft",
    slopeAspect: "Bounded by Sonoma Mountain (W) + the Mayacamas (E). Valley floor + east-facing lower benches.",
    varieties: [
      { name: "Chardonnay + Pinot Noir", why: "South end (near Carneros) stays cool for whites + Pinot." },
      { name: "Zinfandel", why: "Old-vine Zin in the mid-valley (Glen Ellen, Kenwood) enjoys the volcanic soils + warmer afternoons." },
      { name: "Cabernet Sauvignon", why: "Moon Mountain and warmer north-valley sites produce structured Cab." },
    ],
    summary: "A miniature Napa Valley — cool-to-warm gradient south to north, same mountain-vs-floor spread. More diverse, less monomaniac.",
  },
  "Sonoma Coast": {
    winkler: "I (coldest wine-country AVA)",
    soil: "Goldridge sandy loam + marine sediment — well-drained, quick to warm on the surface but the fog holds the vines back.",
    elevation: "0 – 1,800 ft",
    slopeAspect: "Coastal ridges — Pacific-facing slopes take direct fog, ridge tops rise above it for the 'extreme' sites.",
    varieties: [
      { name: "Pinot Noir", why: "The coldest reliably-ripening site in California — long hang time, sharp acid, red-fruit intensity." },
      { name: "Chardonnay", why: "Marine acid retention + slow ripening → the model 'Old-World-style' California Chard." },
    ],
    summary: "The wine-country climate extreme. If Calistoga is the furnace, Sonoma Coast is the walk-in freezer.",
  },
  "Russian River Valley": {
    winkler: "I – II",
    soil: "Goldridge sandy loam — quick-draining, low-vigor. Iconic RRV signature.",
    elevation: "20 – 400 ft",
    slopeAspect: "Rolling low hills; the Russian River gap pulls marine air in most mornings.",
    varieties: [
      { name: "Pinot Noir", why: "Cool marine forcing + Goldridge soil = high-acid, red-cherry Pinot with distinctive stony finish." },
      { name: "Chardonnay", why: "Same signature applied to Chard — bright, mineral, ageable." },
    ],
    summary: "Cool but not extreme. Russian-River-gap fog every morning burns off by early afternoon, giving both the cold and the sun the grapes need.",
  },
  "Green Valley": {
    winkler: "I (coldest sub-region of RRV)",
    soil: "Goldridge sandy loam — the AVA's purest expression.",
    elevation: "50 – 500 ft",
    slopeAspect: "Small basin within the RRV — sits right in the Russian River gap fog corridor.",
    varieties: [
      { name: "Pinot Noir", why: "Even colder than the rest of RRV — the tightest, most acid-driven Pinots in Sonoma." },
      { name: "Chardonnay", why: "Sparkling houses (Iron Horse) planted here specifically for this cold." },
    ],
    summary: "A sub-AVA within RRV that's a full Winkler notch cooler — the coldest ripening spot inland from Sonoma Coast.",
  },
  "Dry Creek Valley": {
    winkler: "II – III",
    soil: "Dry Creek gravelly loam — warm, well-drained fan; the east-side benches are the sweet spot.",
    elevation: "150 – 1,000 ft",
    slopeAspect: "Narrow N-S valley walled by hills — west-facing east benches get warm afternoon sun.",
    varieties: [
      { name: "Zinfandel", why: "Old-vine Zin (100+ year plantings) — this is arguably America's Zin capital." },
      { name: "Cabernet Sauvignon", why: "Warm mid-valley + gravelly drainage make elegant Cab in the shadow of Napa." },
      { name: "Sauvignon Blanc", why: "Marine-tinged SB with the warmer profile a full ripening gives." },
    ],
    summary: "Sonoma's Zin heartland. Warmer than RRV two miles east — the Dry Creek Hills wall the marine air out.",
  },
  "Alexander Valley": {
    winkler: "III",
    soil: "Yolo gravelly loam + volcanic bench soils — one of Sonoma's warmest, most consistent AVAs.",
    elevation: "100 – 2,400 ft",
    slopeAspect: "Broad valley open at both ends; less fog, more sun. Benches on both sides.",
    varieties: [
      { name: "Cabernet Sauvignon", why: "Softer, jammier Cab than Napa — riper fruit, silkier tannin at a friendlier price point." },
      { name: "Chardonnay", why: "Rounder, richer style thanks to warmer afternoons than RRV." },
    ],
    summary: "Sonoma's answer to Napa Valley — warm, gentle, big-shouldered Cab-country without the Napa premium.",
  },
  "Chalk Hill": {
    winkler: "II – III",
    soil: "Volcanic chalk-white ash (the name is literal) — mineral, well-drained.",
    elevation: "200 – 1,200 ft",
    slopeAspect: "Sits in the Chalk Hill Gap — the marine pathway between Russian River and Alexander Valley. SW-facing hills warm quickly.",
    varieties: [
      { name: "Chardonnay", why: "The chalky ash + warm afternoons + cool marine mornings deliver a rounder-than-RRV, more-mineral-than-Alexander Chard." },
      { name: "Sauvignon Blanc", why: "The same volcanic minerality lifts the SB profile with texture and structure." },
    ],
    summary: "A wind-and-fog corridor with distinctive white volcanic soil — Chalk Hill Chard has an unmistakable mineral thread.",
  },
  "Bennett Valley": {
    winkler: "II",
    soil: "Volcanic clay + tuff over marine sediment.",
    elevation: "300 – 1,500 ft",
    slopeAspect: "Small bowl south of Santa Rosa, drained by the Petaluma Gap wind. SW-facing benches.",
    varieties: [
      { name: "Merlot", why: "Petaluma Gap wind + volcanic soil = structured, complex Merlot — the AVA's calling card." },
      { name: "Syrah", why: "Gap wind mimics the Northern Rhône; some of California's best cool-climate Syrah is here." },
    ],
    summary: "A small AVA punching above its weight — the Petaluma Gap keeps it cool + windy, well-suited to right-bank Bordeaux and cool-climate Rhône.",
  },
};
