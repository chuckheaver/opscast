// Display formatters: hours, dates, values, and threshold labels.

import { ALL } from "./thresholds";

// Short hour for compact timeline labels: "8a", "12p", "5p".
export const fmtHr = h =>
  h === 0 ? "12a" : h < 12 ? `${h}a` : h === 12 ? "12p" : `${h - 12}p`;

// Long hour for headers and popups: "8:00 AM", "12:00 PM", "5:00 PM".
export const fmtHrFull = h =>
  h === 0
    ? "12:00 AM"
    : h < 12
    ? `${h}:00 AM`
    : h === 12
    ? "12:00 PM"
    : `${h - 12}:00 PM`;

// "Monday, September 1"
export const fmtDs = s =>
  new Date(s + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

// "Mon, Sep 1"
export const fmtDsShort = s =>
  new Date(s + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

// Friendly day label for selectors and headers:
//   index 0 → "Today (5/13)"
//   index 1 → "Tomorrow (5/14)"
//   index 2+ → "{weekday} (M/D)"  e.g. "Friday (5/15)"
// `baseDate` optional — when provided as a "YYYY-MM-DD" string or Date,
// label is computed from that date. When omitted, computed from today + index.
export const dayLabel = (index, baseDate) => {
  let d;
  if (baseDate instanceof Date) {
    d = new Date(baseDate);
  } else if (typeof baseDate === "string") {
    d = new Date(baseDate + "T12:00:00");
  } else {
    d = new Date();
    d.setDate(d.getDate() + index);
  }
  const dateStr = `${d.getMonth() + 1}/${d.getDate()}`;
  if (index === 0) return `Today (${dateStr})`;
  if (index === 1) return `Tomorrow (${dateStr})`;
  const weekday = d.toLocaleDateString("en-US", { weekday: "long" });
  return `${weekday} (${dateStr})`;
};

// Visibility category labels — applied where visibility values are
// displayed (DetailGrid, HourTimeline popup).
//   < 0.25 mi → "Dense Fog"
//   < 1 mi   → "Fog"
//   ≤ 6 mi   → "Low"
//   ≤ 15 mi  → "Moderate"
//   > 15 mi  → "Clear"
export const visibilityCategory = mi => {
  if (mi == null) return "";
  if (mi < 0.25) return "Dense Fog";
  if (mi < 1) return "Fog";
  if (mi <= 6) return "Low";
  if (mi <= 15) return "Moderate";
  return "Clear";
};

// Compact value display used in grid cells and KPI tiles (no unit suffix
// unless intrinsic to the value, e.g. precip accumulation includes inches).
export const fmtV = (key, val) => {
  if (val == null) return "—";
  if (key === "precipAccum") return `${parseFloat(val).toFixed(2)}"`;
  if (["feelsLike", "tempF", "windChill", "dewPoint"].includes(key)) {
    return `${Math.round(val)}°`;
  }
  if (["windSpeed", "windGusts"].includes(key)) return `${Math.round(val)}`;
  if (["precipProb", "cloudCover", "humidity"].includes(key)) {
    return `${Math.round(val)}%`;
  }
  if (key === "uvIndex") return `${val}`;
  if (key === "visibility") return `${parseFloat(val).toFixed(1)}`;
  if (key === "aqi") return val > 0 ? `${Math.round(val)}` : "—";
  return `${val}`;
};

// Full value display with unit, used in threshold labels and slider values.
export const fmtT = (key, val) => {
  const m = ALL.find(x => x.key === key);
  if (!m) return `${val}`;
  if (key === "precipAccum") return `${parseFloat(val).toFixed(2)}"`;
  if (m.unit === "°F")  return `${val}°F`;
  if (m.unit === "mph") return `${val} mph`;
  if (m.unit === "%")   return `${val}%`;
  if (m.unit === "mi")  return `${parseFloat(val).toFixed(1)} mi`;
  return `${val}`;
};
