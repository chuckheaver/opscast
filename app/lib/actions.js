// Operational guidance generator.
//
// Each entry is a one-line summary of when a metric falls outside the
// user's ideal parameters during the operating window. Verbiage always
// uses the metric's full label from thresholds.js.
//
// Past hours are skipped (caller decorates `isPast` on each hour).
//
// Each advisory:
//   { status: "alert", icon, metric, time, headline }

import { fmtHrFull } from "./formatting";
import { getStatus } from "./colors";
import { PRIMARY } from "./thresholds";

const META_BY_KEY = {};
PRIMARY.forEach(m => { META_BY_KEY[m.key] = m; });

// Find the contiguous-ish window of hours where status === "alert".
// Skips hours marked isPast.
const alertWindow = (hours, key, thresh) => {
  const matching = hours.filter(
    h => !h.isPast && getStatus(key, h[key] ?? 0, thresh) === "alert"
  );
  if (!matching.length) return null;
  return {
    first: matching[0].hour,
    last: matching[matching.length - 1].hour,
    maxVal: Math.max(...matching.map(h => h[key] ?? 0)),
    minVal: Math.min(...matching.map(h => h[key] ?? 0)),
  };
};

// Build a one-line advisory using the metric's official label:
// "The {label} is outside your parameters between {start} – {end}."
const advisory = ({ status, icon, key, first, last }) => {
  const label = META_BY_KEY[key]?.label ?? key;
  const timeRange = `${fmtHrFull(first)} – ${fmtHrFull(last + 1)}`;
  return {
    status,
    icon,
    metric: label,
    time: timeRange,
    headline: `The ${label} is outside your parameters between ${timeRange}.`,
  };
};

export const generateActions = (hours, thresh) => {
  if (!hours.length) return [];
  const actions = [];

  const w = alertWindow(hours, "windSpeed", thresh);
  if (w) {
    actions.push(advisory({
      status: "alert", icon: "💨", key: "windSpeed",
      first: w.first, last: w.last,
    }));
  }

  const p = alertWindow(hours, "precipProb", thresh);
  if (p) {
    actions.push(advisory({
      status: "alert", icon: "🌧️", key: "precipProb",
      first: p.first, last: p.last,
    }));
  }

  const f = alertWindow(hours, "feelsLike", thresh);
  if (f) {
    const tooHot = f.maxVal > thresh.feelsLike.max;
    actions.push(advisory({
      status: "alert",
      icon: tooHot ? "🥵" : "🥶",
      key: "feelsLike",
      first: f.first, last: f.last,
    }));
  }

  const u = alertWindow(hours, "uvIndex", thresh);
  if (u) {
    actions.push(advisory({
      status: "alert", icon: "☀️", key: "uvIndex",
      first: u.first, last: u.last,
    }));
  }

  return actions;
};
