// Status color system: clear/caution/alert/excluded, plus the special
// "sky" gradient used by the cloudCover cells.

import { ALL } from "./thresholds";

// Three operational statuses + one "metric ignored" status.
// Each: { bg, text, border, dot, label }
export const STATUS = {
  clear:    { bg: "#C8EAC8", text: "#145214", border: "#74C274", dot: "#16A34A", label: "Clear" },
  caution:  { bg: "#FFF0B3", text: "#6B4900", border: "#D4A017", dot: "#D97706", label: "Caution" },
  alert:    { bg: "#FFBDBD", text: "#8B0000", border: "#CC0000", dot: "#DC2626", label: "Alert" },
  excluded: { bg: "#EFEFEF", text: "#AAAAAA", border: "#DDD",    dot: "#CCC",    label: "—" },
};

// Sky-color gradient: lighter blue for clear, darker for overcast.
// Used only for cloudCover cells (never as a status).
export const skyColor = v => {
  if (v <= 20) return { bg: "#D6EEFF", text: "#1A4A7A" };
  if (v <= 40) return { bg: "#BEDAEE", text: "#1A4A7A" };
  if (v <= 60) return { bg: "#A0B8CC", text: "#2A3F52" };
  if (v <= 80) return { bg: "#7E96A8", text: "#F0F4F8" };
  return            { bg: "#607585", text: "#F0F4F8" };
};

// Determine the operational status of a single metric value against the
// user's threshold range, taking the buffer (caution band) into account.
export const getStatus = (key, val, thresh) => {
  const cfg = thresh[key];
  if (!cfg || cfg.excluded) return "excluded";
  const m = ALL.find(x => x.key === key);
  if (val >= cfg.min && val <= cfg.max) return "clear";
  return Math.max(cfg.min - val, val - cfg.max) <= (m?.buf ?? 5)
    ? "caution"
    : "alert";
};

// Cell background/text colors. cloudCover uses the sky gradient instead
// of the status colors so the table still reads as a weather visualization.
export const cellStyle = (key, val, thresh) => {
  if (key === "cloudCover") return skyColor(val);
  const s = getStatus(key, val, thresh);
  return { bg: STATUS[s].bg, text: STATUS[s].text };
};

// Worst non-excluded status across all metrics for a single hour.
// Used to color the timeline dots: any alert → "alert", else any caution
// → "caution", else "clear".
export const hourWorstStatus = (h, thresh) => {
  let worst = "clear";
  ALL.forEach(m => {
    if (thresh[m.key]?.excluded) return;
    const s = getStatus(m.key, h[m.key] ?? 0, thresh);
    if (s === "alert") worst = "alert";
    else if (s === "caution" && worst === "clear") worst = "caution";
  });
  return worst;
};
