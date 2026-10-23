// The Köppen-Geiger classes: names, the three-letter hierarchy (group → rainfall
// → heat) and colours, for the climate map and its sunburst key.
//
// Colours keep the hue families the standard Köppen-Geiger maps use (yellow for
// Csa, olive for Csb, magenta for Dsa …) so the map reads against any other one,
// eased toward the site's palette. Every class is also named in the key and the
// tooltip, so none is identified by colour alone.

export const GROUPS = [
  { k: "A", name: "Tropical", color: "#3E78D6" },
  { k: "B", name: "Arid", color: "#E3A63E" },
  { k: "C", name: "Temperate", color: "#8DB86B" },
  { k: "D", name: "Cold", color: "#7A66B8" },
  { k: "E", name: "Polar", color: "#9AA0A6" },
];

const heat = { a: "Hot summer", b: "Warm summer", c: "Cold summer", d: "Very cold winter" };

// code, name, colour. Names follow the usual Köppen-Geiger descriptions.
const C = [
  ["Af", "Tropical rainforest", "#2B55E0"], ["Am", "Tropical monsoon", "#3E86F2"], ["Aw", "Tropical savanna", "#78B2F7"],
  ["BWh", "Hot desert", "#E8483E"], ["BWk", "Cold desert", "#F2A6A2"], ["BSh", "Hot semi-arid (steppe)", "#E8A23A"], ["BSk", "Cold semi-arid (steppe)", "#F0D27A"],
  ["Csa", "Hot-summer Mediterranean", "#F2EB4E"], ["Csb", "Warm-summer Mediterranean", "#C9C340"], ["Csc", "Cold-summer Mediterranean", "#96923A"],
  ["Cwa", "Humid subtropical, dry winter", "#AEEAA5"], ["Cwb", "Subtropical highland", "#7DC47A"], ["Cwc", "Cold subtropical highland", "#4F9A53"],
  ["Cfa", "Humid subtropical", "#CDF37C"], ["Cfb", "Temperate oceanic", "#8CF379"], ["Cfc", "Subpolar oceanic", "#5BC845"],
  ["Dsa", "Hot-summer Mediterranean continental", "#E94FE8"], ["Dsb", "Warm-summer Mediterranean continental", "#BA45BA"], ["Dsc", "Dry-summer subarctic", "#8E4A93"], ["Dsd", "Dry-summer, very cold winter subarctic", "#8A6A92"],
  ["Dwa", "Hot-summer continental, dry winter", "#B2B4F4"], ["Dwb", "Warm-summer continental, dry winter", "#6F86DE"], ["Dwc", "Subarctic, dry winter", "#5A62B4"], ["Dwd", "Very cold subarctic, dry winter", "#3A2A86"],
  ["Dfa", "Hot-summer humid continental", "#6EF0F0"], ["Dfb", "Warm-summer humid continental", "#5DBBEA"], ["Dfc", "Subarctic", "#2F7778"], ["Dfd", "Very cold subarctic", "#264B63"],
  ["ET", "Tundra", "#B4B6B8"], ["EF", "Ice cap", "#70747A"],
];

const RAIN = { s: "dry summer", w: "dry winter", f: "no dry season" };
export const CLASSES = C.map(([code, name, color]) => {
  const g = code[0];
  return {
    code, name, color, group: g,
    rain: g === "A" || g === "E" ? null : g === "B" ? (code[1] === "W" ? "desert" : "steppe") : RAIN[code[1]],
    heat: g === "B" ? (code[2] === "h" ? "hot" : "cold") : g === "C" || g === "D" ? heat[code[2]].toLowerCase() : null,
  };
});
export const BY_CODE = Object.fromEntries(CLASSES.map(c => [c.code, c]));
export const GROUP = Object.fromEntries(GROUPS.map(g => [g.k, g]));

// The sunburst: group → rainfall pattern → the classes (leaves, equal slices).
const leaves = pre => CLASSES.filter(c => c.code.startsWith(pre));
export const TREE = [
  { g: "A", mid: [{ label: "", leaves: leaves("A") }] },
  { g: "B", mid: [{ label: "Desert", leaves: leaves("BW") }, { label: "Steppe", leaves: leaves("BS") }] },
  { g: "C", mid: [{ label: "Dry summer", leaves: leaves("Cs") }, { label: "Dry winter", leaves: leaves("Cw") }, { label: "No dry season", leaves: leaves("Cf") }] },
  { g: "D", mid: [{ label: "Dry summer", leaves: leaves("Ds") }, { label: "Dry winter", leaves: leaves("Dw") }, { label: "No dry season", leaves: leaves("Df") }] },
  { g: "E", mid: [{ label: "", leaves: leaves("E") }] },
];
// The outer ring's short word: the climate's heat, or its own name where it has no letters for one.
export const LEAF_WORD = {
  Af: "Rainforest", Am: "Monsoon", Aw: "Savanna", ET: "Tundra", EF: "Frost",
  BWh: "Hot", BWk: "Cold", BSh: "Hot", BSk: "Cold",
};

// Places named on the map. v: "b" in the Bay Area view, "s" in the state view, or both.
export const CITIES = [
  { n: "San Francisco", lat: 37.7749, lon: -122.4194, v: "bs", me: true, left: true },
  { n: "Oakland", lat: 37.8044, lon: -122.2712, v: "b" },
  { n: "San Jose", lat: 37.3382, lon: -121.8863, v: "bs" },
  { n: "Santa Rosa", lat: 38.4404, lon: -122.7141, v: "b" },
  { n: "Napa", lat: 38.2975, lon: -122.2869, v: "b" },
  { n: "Santa Cruz", lat: 36.9741, lon: -122.0308, v: "b" },
  { n: "Monterey", lat: 36.6002, lon: -121.8947, v: "bs" },
  { n: "Livermore", lat: 37.6819, lon: -121.768, v: "b" },
  { n: "Sacramento", lat: 38.5816, lon: -121.4944, v: "bs" },
  { n: "Stockton", lat: 37.9577, lon: -121.2908, v: "b" },
  { n: "Modesto", lat: 37.6391, lon: -120.9969, v: "b" },
  { n: "Fresno", lat: 36.7378, lon: -119.7871, v: "bs" },
  { n: "Bakersfield", lat: 35.3733, lon: -119.0187, v: "s" },
  { n: "Lake Tahoe", lat: 39.0968, lon: -120.0324, v: "bs" },
  { n: "Reno", lat: 39.5296, lon: -119.8138, v: "bs" },
  { n: "Yosemite Valley", lat: 37.7459, lon: -119.5936, v: "b" },
  { n: "Redding", lat: 40.5865, lon: -122.3917, v: "s" },
  { n: "Eureka", lat: 40.8021, lon: -124.1637, v: "s" },
  { n: "Mt. Whitney", lat: 36.5786, lon: -118.2923, v: "s" },
  { n: "Los Angeles", lat: 34.0522, lon: -118.2437, v: "s" },
  { n: "San Diego", lat: 32.7157, lon: -117.1611, v: "s" },
  { n: "Death Valley", lat: 36.5054, lon: -117.0794, v: "s" },
];

// The two views: the Bay Area out to Reno and Fresno, and all of California.
export const VIEWS = {
  bay: { label: "Bay Area & Central California", lon0: -124.2, lon1: -117.9, lat0: 35.4, lat1: 40.2 },
  state: { label: "All of California", lon0: -124.6, lon1: -114.0, lat0: 32.4, lat1: 42.1 },
};
