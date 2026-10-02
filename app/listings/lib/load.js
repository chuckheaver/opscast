// Shared, cached loader for the SF closed-sales GeoJSON. Used by the House
// Market Stats pop-up (features array) and the Housing Activity map overlay
// (full FeatureCollection with point geometry) so the ~large file is fetched
// at most once per session.

const DATA_URL = "/data/sf-listings.geojson";

let geoPromise = null;

// Every figure on the site runs through the same date: the end of the last
// full month (metadata.statsThrough, e.g. 2026-09-30). Sales that closed
// after it wait for next month's numbers, so map counts, the Homes stats and
// the market report always agree.
export function capToStatsThrough(g) {
  const through = g?.metadata?.statsThrough;
  if (!through || !g.features) return g;
  return { ...g, features: g.features.filter(f => {
    const d = f.properties?.sellingDate;
    return !d || String(d).slice(0, 10) <= through;
  }) };
}

// Resolve to the raw FeatureCollection (point geometry + properties).
export function loadListingsGeo() {
  if (!geoPromise) {
    geoPromise = fetch(DATA_URL)
      .then(r => (r.ok ? r.json() : { type: "FeatureCollection", features: [] }))
      .then(capToStatsThrough)
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

// Sold vs still-on-market (active/pending/coming-soon/contingent/hold).
export const SOLD_STATUSES = ["Closed", "Sold Off MLS"];
export const isSold = status => SOLD_STATUSES.includes(status);

// The date a listing "happened" for period filtering: the close date for sold
// homes, the status date (went active/pending/etc) for everything else.
export const activityDate = p => (isSold(p.status) ? p.sellingDate : p.statusDate);
