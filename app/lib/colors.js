// Status color system — three-tier model with a Sky Cover exception.
//
// For most metrics:
//   - "clear"   (green)  → value is inside [min, max]
//   - "caution" (yellow) → value is within CAUTION_BUFFER units of [min, max]
//   - "alert"   (red)    → value is more than CAUTION_BUFFER units outside
//   - "excluded" (grey)  → user has excluded this metric from the forecast
//
// Sky Cover (cloudCover) uses a separate palette: blue when in range,
// a muted blue-grey when outside. Sky Cover also does NOT contribute to
// the day's worst-status (so a cloudy day doesn't paint the timeline
// red just because cloud cover is outside its ideal range).

import { ALL } from "./thresholds";

// Uniform buffer (in each metric's native unit) for the caution band.
// Charles requested "within 2 numbers off ideal parameters" → 2.
const CAUTION_BUFFER = 2;

export const STATUS = {
  clear:    { bg: "#C8EAC8", text: "#145214", border: "#74C274", dot: "#16A34A", label: "Clear" },
  caution:  { bg: "#FFF0B3", text: "#6B4900", border: "#D4A017", dot: "#D97706", label: "Caution" },
  alert:    { bg: "#FFBDBD", text: "#8B0000", border: "#CC0000", dot: "#DC2626", label: "Alert" },
  excluded: { bg: "#EFEFEF", text: "#AAAAAA", border: "#DDD",    dot: "#CCC",    label: "—" },
};

// Sky Cover's own palette.
const SKY_IN_RANGE     = { bg: "#D6EEFF", text: "#1A4A7A" }; // light blue, dark blue text
const SKY_OUT_OF_RANGE = { bg: "#A0B8CC", text: "#2A3F52" }; // muted grey-blue

// Determine the operational status of a single metric value against the
// user's threshold range. Returns "excluded" | "clear" | "caution" | "alert".
//
// Metrics flagged `binaryStatus: true` in thresholds.js skip the caution
// band — they go straight from clear to alert. Used for precipAccum,
// visibility, and AQI, where the 2-unit caution buffer is poorly sized.
export const getStatus = (key, val, thresh) => {
  const cfg = thresh[key];
  if (!cfg || cfg.excluded) return "excluded";
  if (val >= cfg.min && val <= cfg.max) return "clear";
  const meta = ALL.find(m => m.key === key);
  if (meta?.binaryStatus) return "alert";
  const distance = Math.max(cfg.min - val, val - cfg.max);
  return distance <= CAUTION_BUFFER ? "caution" : "alert";
};

// Cell background/text colors for a (metric, value) pair.
// Sky Cover gets the blue/grey palette; everything else uses STATUS.
export const cellStyle = (key, val, thresh) => {
  const s = getStatus(key, val, thresh);
  if (key === "cloudCover") {
    if (s === "excluded") {
      return { bg: STATUS.excluded.bg, text: STATUS.excluded.text };
    }
    // Caution and alert both map to the same "outside range" grey for sky.
    return s === "clear" ? SKY_IN_RANGE : SKY_OUT_OF_RANGE;
  }
  return { bg: STATUS[s].bg, text: STATUS[s].text };
};

// Worst non-excluded status across all metrics for a single hour.
// Excludes cloudCover so the timeline dot / day badge isn't dragged red
// by sky cover alone (sky-cover-out-of-range is intentionally muted).
export const hourWorstStatus = (h, thresh) => {
  let worst = "clear";
  ALL.forEach(m => {
    if (m.key === "cloudCover") return;
    if (thresh[m.key]?.excluded) return;
    const s = getStatus(m.key, h[m.key] ?? 0, thresh);
    if (s === "alert") worst = "alert";
    else if (s === "caution" && worst === "clear") worst = "caution";
  });
  return worst;
};
