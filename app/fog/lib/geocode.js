// Address search for the fog map now shares ONE geocoder with the rest
// of the app — the Mapbox-backed geoSuggest in app/lib/weather-api.js.
// Its results carry both shapes (id/text/center for the map here, and
// name/latitude/longitude/timezone for the forecast pages), so a single
// implementation drives every location field. The fog-specific helpers
// below (elevation + reverse geocode) still live here.
export { geoSuggest as geocodeSuggest } from "../../lib/weather-api";

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

// Query the Mapbox Terrain v2 vector tileset (same source as the contour
// lines on the map) for the elevation at a [lng, lat] point. Returns the
// average elevation of the nearest contour features in feet, rounded, or
// null if unavailable.
export async function elevationAtPoint([lng, lat]) {
  if (!TOKEN) return null;
  try {
    const url =
      `https://api.mapbox.com/v4/mapbox.mapbox-terrain-v2/tilequery/` +
      `${lng},${lat}.json?` +
      `layers=contour&radius=200&limit=5&access_token=${TOKEN}`;
    const r = await fetch(url);
    if (!r.ok) return null;
    const d = await r.json();
    const eles = (d.features || [])
      .map(f => f.properties?.ele)
      .filter(Number.isFinite);
    if (!eles.length) return null;
    const avgMeters = eles.reduce((a, b) => a + b, 0) / eles.length;
    return Math.round(avgMeters * 3.28084);
  } catch {
    return null;
  }
}

// Reverse geocode an arbitrary [lng, lat] to a human-readable place name.
// Used when the user clicks the 📍 button — we want a label like
// "1 Carl St, San Francisco" rather than raw coordinates. Falls back to
// a coarse "Your Location" if the API call fails.
export async function reverseGeocode([lng, lat]) {
  if (!TOKEN) return "Your Location";
  try {
    const url =
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json` +
      `?access_token=${TOKEN}&types=address,poi,place,neighborhood&limit=1`;
    const r = await fetch(url);
    if (!r.ok) return "Your Location";
    const d = await r.json();
    return d.features?.[0]?.place_name || "Your Location";
  } catch {
    return "Your Location";
  }
}
