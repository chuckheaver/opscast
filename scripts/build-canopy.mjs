// Build SF heavy-vegetation overlay for the /microclimates page.
//
// SF's heaviest urban tree canopy sits in a handful of well-known
// preserves where the neighborhood polygon in sf-fog-neighborhoods is
// effectively a park boundary (Golden Gate Park, Presidio, McLaren
// Park, etc.). We grab those by name from the existing geojson, plus
// a hand-traced polygon for Mt Sutro Forest (which isn't its own
// neighborhood — it sits inside the Inner Sunset / Parnassus block).
//
// Run with: npm run canopy:build

import { readFile, writeFile } from "node:fs/promises";

const NEIGH = "./public/data/sf-fog-neighborhoods.geojson";
const OUT = "./public/data/sf-canopy.geojson";

// Neighborhood polygons whose footprint is predominantly tree canopy.
const CANOPY_NEIGHBORHOODS = new Set([
  "Golden Gate Park",
  "Presidio National Park",
  "McLaren Park",
  "Lincoln Park / Ft. Miley",
  "Sutro Heights",
  "Buena Vista",
]);

// Hand-drawn Mt Sutro Forest polygon — the wooded UCSF / Mt Sutro
// crown sitting between Inner Sunset, Parnassus, and Twin Peaks. The
// neighborhood polygons cut right through it without a dedicated
// boundary, so we trace its rough footprint by hand.
const MT_SUTRO = {
  type: "Feature",
  properties: { name: "Mt Sutro Forest" },
  geometry: {
    type: "Polygon",
    coordinates: [[
      [-122.4640, 37.7600],
      [-122.4555, 37.7610],
      [-122.4530, 37.7570],
      [-122.4540, 37.7530],
      [-122.4595, 37.7515],
      [-122.4635, 37.7540],
      [-122.4640, 37.7600],
    ]],
  },
};

async function main() {
  const neigh = JSON.parse(await readFile(NEIGH, "utf8"));
  const features = neigh.features
    .filter(f => CANOPY_NEIGHBORHOODS.has(f.properties.name))
    .map(f => ({
      type: "Feature",
      properties: { name: f.properties.name },
      geometry: f.geometry,
    }));
  features.push(MT_SUTRO);

  await writeFile(OUT, JSON.stringify({
    type: "FeatureCollection",
    builtAt: new Date().toISOString(),
    features,
  }));
  console.log(`Wrote ${OUT} (${features.length} canopy polygons)`);
}

main().catch(e => { console.error(e); process.exit(1); });
