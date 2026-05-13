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

export const DAY_LABELS = ["Today", "Tomorrow", "Day 3", "Day 4", "Day 5"];

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
