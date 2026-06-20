// Slug helpers for the private "Field Kit" area (/field). Maps each authored
// neighborhood name to a URL slug and back, so /field/castro resolves to the
// "Castro" entry. Not linked from anywhere public; pages are no-indexed.

import { listNeighborhoods } from "../fog/lib/neighborhoods";

export function slugify(name) {
  return String(name)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Canonical neighborhood names (the geojson keys), alphabetized.
export const NAMES = listNeighborhoods()
  .map(n => n.key)
  .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));

const SLUG_TO_NAME = Object.fromEntries(NAMES.map(n => [slugify(n), n]));

export function nameForSlug(slug) {
  return SLUG_TO_NAME[slug] || null;
}
