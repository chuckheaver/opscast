// Address search for the Wine AVA map shares the app-wide Mapbox geocoder
// (geoSuggest in app/lib/weather-api.js) but biases it to Napa / Sonoma wine
// country — the only region this map covers. We pass wine country's centre as
// the proximity hint and then float any Napa/Sonoma results to the top.
import { geoSuggest } from "../../lib/weather-api";

// Rough centre of the Napa + Sonoma AVA footprint — the proximity bias point.
const WINE_CENTER = [-122.55, 38.42];
const inWineCountry = r =>
  /napa|sonoma/i.test(r?.place_name || "") || /napa|sonoma/i.test(r?.label || "");

export async function geocodeSuggest(q) {
  const results = await geoSuggest(q, WINE_CENTER);
  // Stable sort: wine-country results first, original (relevance) order kept
  // within each group.
  return [...results].sort((a, b) => (inWineCountry(b) ? 1 : 0) - (inWineCountry(a) ? 1 : 0));
}
