// The site's three sales categories, in one place (the owner, Oct 20 2026):
//   1. SFH — single-family houses
//   2. Condo / TIC / Co-op — owned units
//   3. Other — Residential Income (duplexes to 5+ unit buildings, from the
//      MLS's second feed) and every other type
// Every page, map and stats script reads its segment from here, so the
// neighborhood pages, the map's dots and the landing figures always agree.
// (The monthly market report keeps its own two segments, SFH and Condo /
// TIC / Other, in reports/market/market-grid-v2.py.)

export const SEGMENTS = [
  { key: "sfh", label: "Single-family", short: "SFH", median: "Median house", color: "#203C5F",
    types: ["Single Family Residence", "2 Houses on Lot", "Halfplex"] },
  { key: "condo", label: "Condo / TIC / Co-op", short: "Condo/TIC/Co-op", median: "Median condo / TIC / co-op", color: "#E9BC3F",
    types: ["Condominium", "Tenancy in Common", "Stock Cooperative", "Co-Ownership", "Townhouse", "Loft Condominium", "Loft"] },
  { key: "other", label: "Other", short: "Other", median: "Median other", color: "#B8613A",
    // the types known today; any type not listed above also lands here
    types: ["Duplex", "Triplex", "Fourplex", "5+ Units", "Residential Income Other", "Other", "3+ Houses on Lot"] },
];

const BY_TYPE = new Map(SEGMENTS.flatMap(s => s.types.map(t => [t, s.key])));

// "sfh" | "condo" | "other" for an MLS property type.
export const segOf = propType => BY_TYPE.get(propType) || "other";
export const SEG = Object.fromEntries(SEGMENTS.map(s => [s.key, s]));

// The Mapbox expression that colours a sale by its type, for map layers.
export const segColorExpr = (prop = "propType") =>
  ["match", ["get", prop], SEG.sfh.types, SEG.sfh.color, SEG.condo.types, SEG.condo.color, SEG.other.color];
