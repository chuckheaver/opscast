// Transit line groups for the MySFMap Transit control. Each category maps the
// legend label/colour to the underlying Muni `route_name` values. Shared by the
// map (to filter routes) and the Transit panel (the legend that doubles as the
// selector).

// Named categories (everything that isn't a plain numbered bus). `short` is the
// tiny label used in the compact one-line selector bar.
const NAMED = [
  { key: "J", label: "J Church", short: "J", color: "#D85F2A", routes: ["J"] },
  { key: "K", label: "K Ingleside", short: "K", color: "#5B6770", routes: ["K", "KBUS"] },
  { key: "L", label: "L Taraval", short: "L", color: "#92278F", routes: ["L"] },
  { key: "M", label: "M Ocean View", short: "M", color: "#007749", routes: ["M"] },
  { key: "N", label: "N Judah", short: "N", color: "#005DAA", routes: ["N", "NBUS"] },
  { key: "T", label: "T Third", short: "T", color: "#BC1E2D", routes: ["T", "TBUS"] },
  { key: "F", label: "F Heritage", short: "F", color: "#C99729", routes: ["F", "FBUS"] },
  { key: "cable", label: "Cable car", short: "CC", color: "#B11116", routes: ["C", "PH", "PM"] },
  { key: "rapid", label: "Rapid (R)", short: "Rpd", color: "#EA580C", routes: ["5R", "9R", "14R", "28R", "38R"] },
  { key: "express", label: "Express (X)", short: "Exp", color: "#6D28D9", routes: ["1X", "8AX", "8BX", "30X"] },
  { key: "owl", label: "Owl (90 · 91)", short: "Owl", color: "#1E3A8A", routes: ["90", "91"] },
];

// Every route_name in the data, so "Bus route" can be the catch-all remainder.
const ALL_ROUTE_NAMES = [
  "1", "12", "14", "14R", "15", "18", "19", "1X", "2", "22", "23", "24", "25", "27", "28",
  "28R", "29", "30", "30X", "31", "33", "35", "36", "37", "38", "38R", "39", "43", "44", "45",
  "48", "49", "5", "52", "54", "55", "56", "57", "58", "5R", "6", "66", "67", "7", "714", "8",
  "8AX", "8BX", "9", "90", "91", "9R", "C", "F", "FBUS", "J", "K", "KBUS", "L", "M", "N",
  "NBUS", "PH", "PM", "T", "TBUS",
];
const namedSet = new Set(NAMED.flatMap(c => c.routes));
const BUS_ROUTES = ALL_ROUTE_NAMES.filter(r => !namedSet.has(r));

export const TRANSIT_CATS = [
  ...NAMED,
  { key: "bus", label: "Bus route", short: "Bus", color: "#6B7280", routes: BUS_ROUTES },
];

// Categories in alphabetical order by label (for the selector list).
export const TRANSIT_CATS_ALPHA = [...TRANSIT_CATS].sort((a, b) => a.label.localeCompare(b.label));

export const ALL_TRANSIT_KEYS = TRANSIT_CATS.map(c => c.key);

// The route_name list for a Set of selected category keys.
export function routesForSelection(selSet) {
  const out = [];
  for (const c of TRANSIT_CATS) if (selSet.has(c.key)) out.push(...c.routes);
  return out;
}

export const isAllSelected = selSet => ALL_TRANSIT_KEYS.every(k => selSet.has(k));
