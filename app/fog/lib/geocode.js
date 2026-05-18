// Mapbox forward geocoding, scoped to San Francisco.
// Returns up to 5 suggestions as { id, text, place_name, center: [lng, lat] }.
//
// `proximity` and a tight `bbox` around the SF peninsula bias results.
// `country=us` cuts down on noise. Token is the public NEXT_PUBLIC_MAPBOX_TOKEN.

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

// Rough bbox around SF (west, south, east, north).
const SF_BBOX = "-122.55,37.70,-122.35,37.84";
const SF_PROXIMITY = "-122.447,37.7649";

export async function geocodeSuggest(q) {
  if (!TOKEN) throw new Error("NEXT_PUBLIC_MAPBOX_TOKEN not configured");
  const url =
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(q)}.json` +
    `?access_token=${TOKEN}` +
    `&autocomplete=true` +
    `&country=us` +
    `&types=address,poi,place` +
    `&bbox=${SF_BBOX}` +
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
