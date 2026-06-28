// Shared, cached loader for the SF closed-sales GeoJSON. Used by the House
// Market Stats pop-up (features array) and the Housing Activity map overlay
// (full FeatureCollection with point geometry) so the ~large file is fetched
// at most once per session.

const DATA_URL = "/data/sf-listings.geojson";

let geoPromise = null;

// Resolve to the raw FeatureCollection (point geometry + properties).
export function loadListingsGeo() {
  if (!geoPromise) {
    geoPromise = fetch(DATA_URL)
      .then(r => (r.ok ? r.json() : { type: "FeatureCollection", features: [] }))
      .catch(() => ({ type: "FeatureCollection", features: [] }));
  }
  return geoPromise;
}

// Convenience: just the features array (what the market stats math wants).
export function loadListingsFeatures() {
  return loadListingsGeo().then(g => g.features || []);
}

// Segment definitions shared across market stats + activity dots.
export const SFR_TYPES = ["Single Family Residence"];
export const CONDO_TYPES = [
  "Condominium", "Loft Condominium", "Loft",
  "Tenancy in Common", "Stock Cooperative", "Co-Ownership",
];
export const isSfr = t => SFR_TYPES.includes(t);
export const isCondo = t => CONDO_TYPES.includes(t);
