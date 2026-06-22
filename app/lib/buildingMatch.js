// Shared address normalization used to link the Tall Building Inventory to the
// MLS listings. Both the build-time join (scripts/build-building-sales.mjs) and
// the live pages (/fog and /listings) import this, so a building and a condo
// listing in that building reduce to the SAME key.
//
// The match is deliberately keyed on street number + street name only — the
// unit, city, state, ZIP, and street-type spelling ("Street" vs "St") are all
// stripped or standardized — because a tower's official address ("301 Mission
// Street") and a unit's MLS address ("301 Mission St #48F, San Francisco, CA
// 94105") share exactly that and nothing else.

const STREET_TYPES = [
  ["street", "st"],
  ["avenue", "ave"],
  ["boulevard", "blvd"],
  ["drive", "dr"],
  ["place", "pl"],
  ["court", "ct"],
  ["road", "rd"],
  ["lane", "ln"],
  ["terrace", "ter"],
  ["plaza", "plz"],
  ["square", "sq"],
];

export function normalizeStreetAddress(input) {
  if (!input) return null;
  let s = String(input).split(",")[0]; // drop ", San Francisco, CA 94XXX"
  s = s.replace(/#.*$/, ""); // drop "#1234"
  s = s.replace(/\b(unit|apt|apartment|ste|suite|fl|floor|ph|penthouse)\b.*$/i, "");
  s = s.toLowerCase().trim();
  for (const [long, short] of STREET_TYPES) {
    s = s.replace(new RegExp("\\b" + long + "\\b", "g"), short);
  }
  s = s.replace(/[^a-z0-9 ]/g, " "); // punctuation → space
  s = s.replace(/\s+/g, " ").trim();
  return s || null;
}
