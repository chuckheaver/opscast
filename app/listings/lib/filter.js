// Shared listings filter — the full set of controls from the original market
// design (status, property type, closed-between dates, fog hours, district,
// neighborhood, price). Used by both the MySFMap "Homes" overlay (drives the
// dots) and the "Stats" pop-up (drives the report) so they stay identical.

import { fogZoneLabel } from "./stats";

// Property-type → short chip label, matching the original design.
export const SUBTYPE_ABBREV = {
  "Single Family Residence": "SFH",
  "Condominium": "CND",
  "Tenancy in Common": "TIC",
  "Townhouse": "TNH",
  "3+ Houses on Lot": "3+H",
  "Other": "OTH",
  "2 Houses on Lot": "2 H",
  "Co-Ownership": "CO-",
  "Halfplex": "HAL",
  "Stock Cooperative": "STO",
};
export const subtypeAbbrev = t => SUBTYPE_ABBREV[t] || (t || "").slice(0, 3).toUpperCase();

// Display order for the chips.
const STATUS_ORDER = ["Active", "Pending", "Coming Soon", "Contingent - Show", "Contingent - No Show", "Hold", "Closed", "Sold Off MLS"];
const SUBTYPE_ORDER = ["Single Family Residence", "Condominium", "Tenancy in Common", "Townhouse", "3+ Houses on Lot", "Other", "2 Houses on Lot", "Co-Ownership", "Halfplex", "Stock Cooperative"];

export const SOLD_STATUSES = new Set(["Closed", "Sold Off MLS"]);
export const isSoldStatus = s => SOLD_STATUSES.has(s);

// Default filter: all statuses / all types (empty Set = no restriction),
// current calendar year so far.
export function defaultFilter() {
  const y = new Date().getFullYear();
  return {
    statuses: new Set(),
    subtypes: new Set(),
    district: "",
    neighborhood: "",
    fogHrs: "",
    closedFrom: `${y}-01-01`,
    closedTo: "",
    minPrice: "",
    maxPrice: "",
  };
}

// Does a listing's properties pass the filter? (Empty Set = match all; empty
// string = no constraint. Date range only constrains rows that have a sale
// date, so active/pending listings aren't dropped by it.)
export function matchesFilter(p, f) {
  if (f.statuses.size && !f.statuses.has(p.status)) return false;
  if (f.subtypes.size && !f.subtypes.has(p.propType)) return false;
  if (f.district && p.areaDesc !== f.district) return false;
  if (f.neighborhood && p.neighborhood !== f.neighborhood && p.fogNeighborhood !== f.neighborhood) return false;
  if (f.fogHrs && String(p.fogHours) !== f.fogHrs) return false;
  if (f.closedFrom && p.sellingDate && p.sellingDate < f.closedFrom) return false;
  if (f.closedTo && p.sellingDate && p.sellingDate > f.closedTo) return false;
  const lo = f.minPrice ? Number(f.minPrice) : null;
  const hi = f.maxPrice ? Number(f.maxPrice) : null;
  const price = p.price;
  if (lo != null && (price == null || price < lo)) return false;
  if (hi != null && (price == null || price > hi)) return false;
  return true;
}

// Distinct option lists for the dropdowns/chips, derived from the data.
export function deriveOptions(features) {
  const statuses = new Set(), subtypes = new Set(), districts = new Set(), neighborhoods = new Set(), fogHrs = new Set();
  for (const f of features || []) {
    const p = f.properties;
    if (p.status) statuses.add(p.status);
    if (p.propType) subtypes.add(p.propType);
    if (p.areaDesc) districts.add(p.areaDesc);
    if (p.neighborhood) neighborhoods.add(p.neighborhood);
    if (p.fogHours != null) fogHrs.add(p.fogHours);
  }
  const ord = (arr, list) => arr.sort((a, b) => {
    const ia = list.indexOf(a), ib = list.indexOf(b);
    return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
  });
  const distNum = d => parseInt(String(d).replace(/\D/g, ""), 10) || 999;
  return {
    statuses: ord([...statuses], STATUS_ORDER),
    subtypes: ord([...subtypes], SUBTYPE_ORDER),
    districts: [...districts].sort((a, b) => distNum(a) - distNum(b)),
    neighborhoods: [...neighborhoods].sort(),
    fogHrs: [...fogHrs].sort((a, b) => a - b),
  };
}

export { fogZoneLabel };
