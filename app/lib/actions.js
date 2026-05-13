// Operational guidance generator.
//
// Each entry is a one-line summary of when a metric falls outside the
// user's ideal parameters during the operating window. No suggestions,
// no recommended steps — just the factual statement.
//
// Each advisory:
//   { status: "alert", icon, metric, time, headline }

import { fmtHrFull } from "./formatting";
import { getStatus } from "./colors";

// Find the contiguous-ish window of hours where status === "alert".
// Returns { first, last } or null if none match.
const alertWindow = (hours, key, thresh) => {
  const matching = hours.filter(
    h => getStatus(key, h[key] ?? 0, thresh) === "alert"
  );
  if (!matching.length) return null;
  return {
    first: matching[0].hour,
    last: matching[matching.length - 1].hour,
    maxVal: Math.max(...matching.map(h => h[key] ?? 0)),
    minVal: Math.min(...matching.map(h => h[key] ?? 0)),
  };
};

// Build a one-line advisory: "The {label} is outside your parameters
// between {start} – {end}."
const advisory = ({ status, icon, metric, label, first, last }) => {
  const timeRange = `${fmtHrFull(first)} – ${fmtHrFull(last + 1)}`;
  return {
    status,
    icon,
    metric,
    time: timeRange,
    headline: `The ${label} is outside your parameters between ${timeRange}.`,
  };
};

export const generateActions = (hours, thresh) => {
  if (!hours.length) return [];
  const actions = [];

  if (!thresh.windSpeed?.excluded) {
    const w = alertWindow(hours, "windSpeed", thresh);
    if (w) {
      actions.push(advisory({
        status: "alert", icon: "💨", metric: "Wind", label: "wind",
        first: w.first, last: w.last,
      }));
    }
  }

  if (!thresh.precipProb?.excluded) {
    const p = alertWindow(hours, "precipProb", thresh);
    if (p) {
      actions.push(advisory({
        status: "alert", icon: "🌧️", metric: "Precipitation", label: "precipitation",
        first: p.first, last: p.last,
      }));
    }
  }

  if (!thresh.feelsLike?.excluded) {
    const f = alertWindow(hours, "feelsLike", thresh);
    if (f) {
      const tooHot = f.maxVal > thresh.feelsLike.max;
      actions.push(advisory({
        status: "alert",
        icon: tooHot ? "🥵" : "🥶",
        metric: tooHot ? "Heat" : "Cold",
        label: tooHot ? "heat" : "cold",
        first: f.first, last: f.last,
      }));
    }
  }

  if (!thresh.uvIndex?.excluded) {
    const u = alertWindow(hours, "uvIndex", thresh);
    if (u) {
      actions.push(advisory({
        status: "alert", icon: "☀️", metric: "UV Index", label: "UV index",
        first: u.first, last: u.last,
      }));
    }
  }

  return actions;
};
