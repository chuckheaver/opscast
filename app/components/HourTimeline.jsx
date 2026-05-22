// "Hours on Alert" summary: for each metric that has at least one
// alert-status hour in the day's window, render a line like
//   "Wind/Gusts is on Alert at: 2 PM, 3 PM, 5 PM"
// where the metric name is clickable and opens the Hourly Detail Grid
// below. Caution and ideal hours don't appear here — those colours
// already show up in the detail grid itself. If nothing is red in the
// whole period, we show "No alerts during this period."
//
// Sky Cover (cloudCover) is intentionally skipped — it uses a binary
// in-range / out-of-range palette and isn't counted as an alert
// anywhere else in the app (see hourWorstStatus in lib/colors.js).

import { getStatus } from "../lib/colors";
import { fmtHr } from "../lib/formatting";
import { PRIMARY, ADVANCED } from "../lib/thresholds";

export default function HourTimeline({ hours, thresh, onOpenDetail }) {
  const metrics = [...PRIMARY, ...ADVANCED].filter(m => m.key !== "cloudCover");

  const rows = metrics
    .map(m => {
      const alertHours = hours.filter(h => {
        if (h.isPast) return false;
        // UV at night isn't a real reading — skip.
        if (m.key === "uvIndex" && h.isDaylight === false) return false;
        return getStatus(m.key, h[m.key] ?? 0, thresh) === "alert";
      });
      return { metric: m, alertHours };
    })
    .filter(row => row.alertHours.length > 0);

  return (
    <div className="timeline-wrap">
      <div className="timeline-label">Hours on Alert</div>
      {rows.length === 0 ? (
        <div className="alert-empty">No alerts during this period.</div>
      ) : (
        <ul className="alert-list">
          {rows.map(({ metric, alertHours }) => (
            <li key={metric.key} className="alert-row">
              <button
                type="button"
                className="alert-metric"
                onClick={onOpenDetail}
              >
                {metric.label}
              </button>
              <span className="alert-text">
                {" "}is on Alert at:{" "}
                {alertHours.map(h => fmtHr(h.hour)).join(", ")}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
