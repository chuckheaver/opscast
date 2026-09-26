// Shared helpers for the public neighborhood guide at /neighborhoods.
// Slugs match the private field kit's, so /field/castro and
// /neighborhoods/castro refer to the same authored entry.

import { listNeighborhoods, getNeighborhood } from "../fog/lib/neighborhoods";
import STATS from "../lib/neighborhood-stats.json";

export const slugify = name =>
  String(name).toLowerCase().replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

export const NAMES = listNeighborhoods()
  .map(n => n.key)
  .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));

const SLUG_TO_NAME = Object.fromEntries(NAMES.map(n => [slugify(n), n]));
export const nameForSlug = slug => SLUG_TO_NAME[slug] || null;

export const statsFor = name => STATS.hoods?.[name] || null;
export const contentFor = name => getNeighborhood(name);
export const dataThrough = STATS.dataThrough;
export const statsYear = STATS.year;
// Year to date. Every sale is reported however few a neighborhood had, so the
// count always travels with the median.
export const statsWindow = STATS.window;
const fmt = d => new Date(d + "T12:00:00Z").toLocaleDateString("en-US", { month: "long", day: "numeric" });
export const windowLabel = STATS.window
  ? `Jan 1 – ${fmt(STATS.window.to)}, ${STATS.year}` : "";

export const money = v =>
  v == null ? null : v >= 1e6 ? `$${(v / 1e6).toFixed(2)}M` : `$${Math.round(v / 1000)}K`;

// Zone colours match the map's, so the guide and the map read as one thing.
export const ZONE_COLOR = {
  "Sun": "#E8B84B",
  "Transition": "#D8C08E",
  "Fog": "#A8BCCD",
  "Persistent Fog": "#8DA2B5",
};

// Every authored neighborhood with its numbers, sorted for the index.
export function allHoods() {
  return NAMES.map(name => ({
    name,
    slug: slugify(name),
    content: contentFor(name),
    stats: statsFor(name),
  })).filter(h => h.content);
}
