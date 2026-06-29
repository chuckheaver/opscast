// Bike facility classes for the MySFMap Bikes selector. `key` matches the
// `facility` value in the bike-network GeoJSON; `dashed` drives the swatch and
// which map layer (solid vs dashed) the class draws on.

export const BIKE_CLASSES = [
  { key: "CLASS I", label: "Class I · off-street path", short: "Cl1Pth", color: "#15803d", dashed: false },
  { key: "CLASS II", label: "Class II · striped lane", short: "Cl2Str", color: "#06b6d4", dashed: false },
  { key: "CLASS III", label: "Class III · shared / sharrows", short: "Cl3Sep", color: "#6b7280", dashed: true },
  { key: "CLASS IV", label: "Class IV · separated", short: "Cl4Sha", color: "#22c55e", dashed: false },
];

export const ALL_BIKE_KEYS = BIKE_CLASSES.map(c => c.key);
export const isAllBikes = sel => ALL_BIKE_KEYS.every(k => sel.has(k));
