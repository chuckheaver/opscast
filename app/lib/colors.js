// Status color system — three-tier model with a Sky Cover exception.
//
// For most metrics:
//   - "clear"   (green / "Ideal")  → value inside [min, max]
//   - "caution" (yellow)           → within CAUTION_BUFFER units of [min, max]
//   - "alert"   (red)              → more than CAUTION_BUFFER outside
//
// Metrics with `binaryStatus: true` in thresholds.js skip the caution band
// (clear → alert). All metrics are always evaluated (no per-metric exclude
// toggle anymore).
//
// Sky Cover (cloudCover) uses a separate palette — blue when in range,
// muted blue-grey when outside — and is excluded from `hourWorstStatus`
// so a cloudy day doesn't drag the timeline / day badge into alert.

import { ALL } from "./thresholds";

// Uniform buffer (in each metric's native unit) for the caution band.
const CAUTION_BUFFER = 2;

export const STATUS = {
  clear:    { bg: "#C8EAC8", text: "#145214", border: "#74C274", dot: "#16A34A", label: "Ideal" },
  caution:  { bg: "#FFF0B3", text: "#6B4900", border: "#D4A017", dot: "#D97706", label: "Caution" },
  alert:    { bg: "#FFBDBD", text: "#8B0000", border: "#CC0000", dot: "#DC2626", label: "Alert" },
};

// Sky Cover's own palette.
const SKY_IN_RANGE     = { bg: "#D6EEFF", text: "#1A4A7A" }; // light blue
const SKY_OUT_OF_RANGE = { bg: "#A0B8CC", text: "#2A3F52" }; // muted grey-blue

// Determine the operational status of a single metric value against the
// user's threshold range. Returns "clear" | "caution" | "alert".
export const getStatus = (key, val, thresh) => {
  const cfg = thresh[key];
  if (!cfg) return "clear";
  if (val >= cfg.min && val <= cfg.max) return "clear";
  const meta = ALL.find(m => m.key === key);
  if (meta?.binaryStatus) return "alert";
  const distance = Math.max(cfg.min - val, val - cfg.max);
  return distance <= CAUTION_BUFFER ? "caution" : "alert";
};

// Cell background/text colors for a (metric, value) pair.
// Sky Cover gets the blue/grey palette; everything else uses STATUS.
export const cellStyle = (key, val, thresh) => {
  if (key === "cloudCover") {
    const cfg = thresh[key];
    const inRange = cfg && val >= cfg.min && val <= cfg.max;
    return inRange ? SKY_IN_RANGE : SKY_OUT_OF_RANGE;
  }
  const s = getStatus(key, val, thresh);
  return { bg: STATUS[s].bg, text: STATUS[s].text };
};

// Worst status across all metrics for a single hour. Excludes cloudCover
// so the timeline dot / day badge isn't dragged red by sky cover alone.
export const hourWorstStatus = (h, thresh) => {
  let worst = "clear";
  ALL.forEach(m => {
    if (m.key === "cloudCover") return;
    const s = getStatus(m.key, h[m.key] ?? 0, thresh);
    if (s === "alert") worst = "alert";
    else if (s === "caution" && worst === "clear") worst = "caution";
  });
  return worst;
};
