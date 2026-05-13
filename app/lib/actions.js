// Operational guidance generator.
//
// Given the day's filtered hours and the user's thresholds, returns an
// array of actionable advisories for the day:
//   [{ status, icon, metric, time, headline, actions: [step, step, ...] }]
//
// Each advisory is keyed off one metric (wind, precip, heat/cold, UV) and
// only generated when that metric crosses caution/alert during the
// operating window. Order: wind, precip, temp, UV.

import { fmtHrFull } from "./formatting";
import { getStatus } from "./colors";

// Find the contiguous window of hours whose status is in `statuses`.
// Returns { first, last, count, maxVal, minVal } or null if none match.
const windows = (hours, key, statuses, thresh) => {
  const matching = hours.filter(h =>
    statuses.includes(getStatus(key, h[key] ?? 0, thresh))
  );
  if (!matching.length) return null;
  return {
    first: matching[0].hour,
    last: matching[matching.length - 1].hour,
    count: matching.length,
    maxVal: Math.max(...matching.map(h => h[key] ?? 0)),
    minVal: Math.min(...matching.map(h => h[key] ?? 0)),
  };
};

export const generateActions = (hours, thresh) => {
  if (!hours.length) return [];
  const actions = [];

  // ── Wind ───────────────────────────────────────────────────────────────
  if (!thresh.windSpeed?.excluded) {
    const wa = windows(hours, "windSpeed", ["alert"], thresh);
    const wc = windows(hours, "windSpeed", ["caution", "alert"], thresh);
    if (wa) {
      actions.push({
        status: "alert",
        icon: "💨",
        metric: "Wind",
        time: `${fmtHrFull(wa.first)} – ${fmtHrFull(wa.last + 1)}`,
        headline: `Wind reaching ${wa.maxVal} mph with gusts above your ${thresh.windSpeed.max} mph threshold`,
        actions: [
          "Secure all outdoor umbrellas, furniture, and menu displays",
          `Move portable items inside before ${fmtHrFull(wa.first)}`,
          wa.maxVal >= 35
            ? "Full patio closure recommended during this period"
            : "Staff to monitor and secure lightweight items",
        ],
      });
    } else if (wc) {
      actions.push({
        status: "caution",
        icon: "💨",
        metric: "Wind",
        time: `${fmtHrFull(wc.first)} – ${fmtHrFull(wc.last + 1)}`,
        headline: `Wind approaching your ${thresh.windSpeed.max} mph comfort threshold`,
        actions: [
          "Pre-position staff to quickly secure outdoor items if wind increases",
          "Consider anchoring table settings and lightweight decor",
        ],
      });
    }
  }

  // ── Precipitation ──────────────────────────────────────────────────────
  if (!thresh.precipProb?.excluded) {
    const pa = windows(hours, "precipProb", ["alert"], thresh);
    const pc = windows(hours, "precipProb", ["caution", "alert"], thresh);
    if (pa) {
      actions.push({
        status: "alert",
        icon: "🌧️",
        metric: "Precipitation",
        time: `${fmtHrFull(pa.first)} – ${fmtHrFull(pa.last + 1)}`,
        headline: `${pa.maxVal}% precipitation probability — rain likely during operating hours`,
        actions: [
          "Prepare indoor overflow seating capacity",
          "Brief staff on guest relocation procedure",
          "Pull outdoor cushions and linens before this window",
          pa.maxVal >= 75
            ? "Consider reducing outdoor reservations during this period"
            : "Have umbrellas and rain gear accessible for guests",
        ],
      });
    } else if (pc) {
      actions.push({
        status: "caution",
        icon: "🌦️",
        metric: "Precipitation",
        time: `${fmtHrFull(pc.first)} – ${fmtHrFull(pc.last + 1)}`,
        headline: `Elevated precipitation chance — monitor radar closely`,
        actions: [
          "Review radar before these hours (use Radar button above)",
          "Have a rain plan ready — know your indoor capacity",
          "Keep outdoor furniture movable",
        ],
      });
    }
  }

  // ── Heat / Cold ────────────────────────────────────────────────────────
  if (!thresh.feelsLike?.excluded) {
    const ha = windows(hours, "feelsLike", ["alert"], thresh);
    const hc = windows(hours, "feelsLike", ["caution"], thresh);
    const tooHot = ha && ha.maxVal > thresh.feelsLike.max;
    const tooCold = ha && ha.minVal < thresh.feelsLike.min;
    if (tooHot) {
      actions.push({
        status: "alert",
        icon: "🥵",
        metric: "Heat",
        time: `${fmtHrFull(ha.first)} – ${fmtHrFull(ha.last + 1)}`,
        headline: `Feels like ${ha.maxVal}°F — above your ${thresh.feelsLike.max}°F comfort threshold`,
        actions: [
          "Set up additional shade structures for outdoor seating",
          "Increase table water service frequency",
          "Brief staff on heat safety — mandatory hydration breaks",
          "Consider limiting outdoor seating to shaded areas only",
        ],
      });
    } else if (tooCold) {
      actions.push({
        status: "alert",
        icon: "🥶",
        metric: "Cold",
        time: `${fmtHrFull(ha.first)} – ${fmtHrFull(ha.last + 1)}`,
        headline: `Feels like ${ha.minVal}°F — below your ${thresh.feelsLike.min}°F comfort threshold`,
        actions: [
          "Deploy outdoor patio heaters",
          "Consider offering complimentary warm beverages",
          "Evaluate whether outdoor seating should remain open during this window",
        ],
      });
    } else if (hc) {
      actions.push({
        status: "caution",
        icon: "🌡️",
        metric: "Temperature",
        time: `${fmtHrFull(hc.first)} – ${fmtHrFull(hc.last + 1)}`,
        headline: `Temperature approaching comfort boundaries`,
        actions: [
          "Monitor conditions — be ready to adjust outdoor service",
          "Ensure shade or heating is accessible",
        ],
      });
    }
  }

  // ── UV ─────────────────────────────────────────────────────────────────
  if (!thresh.uvIndex?.excluded) {
    const ua = windows(hours, "uvIndex", ["alert"], thresh);
    const uc = windows(hours, "uvIndex", ["caution", "alert"], thresh);
    if (ua) {
      actions.push({
        status: "alert",
        icon: "☀️",
        metric: "UV Index",
        time: `${fmtHrFull(ua.first)} – ${fmtHrFull(ua.last + 1)}`,
        headline: `UV Index ${ua.maxVal} — high solar exposure risk`,
        actions: [
          "Deploy shade structures for all outdoor tables",
          "Remind staff to apply sunscreen on breaks",
          "Inform guests of high UV — consider printed advisory",
          "Ensure outdoor staff rotate indoors regularly",
        ],
      });
    } else if (uc) {
      actions.push({
        status: "caution",
        icon: "🌤️",
        metric: "UV Index",
        time: `${fmtHrFull(uc.first)} – ${fmtHrFull(uc.last + 1)}`,
        headline: `Moderate-high UV during peak outdoor hours`,
        actions: [
          "Ensure shade coverage for seating areas",
          "Provide sunscreen for outdoor staff",
        ],
      });
    }
  }

  return actions;
};
