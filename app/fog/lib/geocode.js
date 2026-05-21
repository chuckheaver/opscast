// Mapbox forward geocoding, scoped to the Bay Area (matches the contour
// data extent: Pt Reyes → San Jose, Pacific coast → East Bay hills).
// Returns up to 5 suggestions as { id, text, place_name, center: [lng, lat] }.
//
// `proximity` keeps SF results ranked first when the query is ambiguous;
// `bbox` keeps the suggestion list inside the Bay Area; `country=us`
// trims noise. Token is the public NEXT_PUBLIC_MAPBOX_TOKEN.

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

// Bay Area bbox (west, south, east, north) — covers Marin through San Jose,
// matching the clipped USGS contour coverage on the map.
const BAY_BBOX = "-123.00,37.20,-121.65,38.20";
const SF_PROXIMITY = "-122.447,37.7649";

export async function geocodeSuggest(q) {
  if (!TOKEN) throw new Error("NEXT_PUBLIC_MAPBOX_TOKEN not configured");
  const url =
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(q)}.json` +
    `?access_token=${TOKEN}` +
    `&autocomplete=true` +
    `&country=us` +
    `&types=address,poi,place` +
    `&bbox=${BAY_BBOX}` +
    `&proximity=${SF_PROXIMITY}` +
    `&limit=5`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Geocoder error (${r.status})`);
  const d = await r.json();
  return (d.features || []).map(f => ({
    id: f.id,
    text: f.text,
    place_name: f.place_name,
    center: f.center, // [lng, lat]
  }));
}

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
