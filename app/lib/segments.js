// The site's four sales categories, in one place (the owner, Oct 22 2026):
//   1. SFH — single-family houses (2 Houses on Lot included)
//   2. Condo / TIC / Co-op — owned units
//   3. Duplex — two-unit buildings (Residential Income, from the MLS's second feed)
//   4. Other — triplexes to 5+ unit buildings and every other type
// Every page, map and stats script reads its segment from here, so the
// neighborhood pages, the map's dots and the landing figures always agree.
// (The monthly market report still has three — SFH, Condo / TIC / Co-op and
// Other, which holds the duplexes — in reports/market/market-grid-v2.py until
// it is brought across.)

export const SEGMENTS = [
  { key: "sfh", label: "Single-family", short: "SFH", median: "Median house", color: "#203C5F",
    types: ["Single Family Residence", "2 Houses on Lot", "Halfplex"] },
  { key: "condo", label: "Condo / TIC / Co-op", short: "Condo/TIC/Co-op", median: "Median condo / TIC / co-op", color: "#E9BC3F",
    types: ["Condominium", "Tenancy in Common", "Stock Cooperative", "Co-Ownership", "Townhouse", "Loft Condominium", "Loft"] },
  { key: "duplex", label: "Duplex", short: "Duplex", median: "Median duplex", color: "#3C8D7F",
    types: ["Duplex"] },
  { key: "other", label: "Other (Tri+)", short: "Other (Tri+)", median: "Median other (tri+)", color: "#B8613A",
    // the types known today; any type not listed above also lands here
    types: ["Triplex", "Fourplex", "5+ Units", "Residential Income Other", "Other", "3+ Houses on Lot"] },
];

const BY_TYPE = new Map(SEGMENTS.flatMap(s => s.types.map(t => [t, s.key])));

// "sfh" | "condo" | "duplex" | "other" for an MLS property type.
export const segOf = propType => BY_TYPE.get(propType) || "other";
export const SEG = Object.fromEntries(SEGMENTS.map(s => [s.key, s]));

// The Mapbox expression that colours a sale by its type, for map layers.
export const segColorExpr = (prop = "propType") =>
  ["match", ["get", prop], SEG.sfh.types, SEG.sfh.color, SEG.condo.types, SEG.condo.color, SEG.duplex.types, SEG.duplex.color, SEG.other.color];
