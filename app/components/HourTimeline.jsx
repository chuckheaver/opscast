// "Hours on Alert" summary: for each metric that has at least one
// alert-status hour in the day's window, render a line like
//   "Wind/Gusts: 2 PM, 3 PM, 5 PM"
// The entire box is clickable and opens the Hourly Detail Grid
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

// Collapse a list of alert hour ints into a human range string —
// consecutive hours roll up into "1 PM-5 PM", non-consecutive runs are
// comma-joined: [13,14,15,17,18] → "1 PM-3 PM, 5 PM-6 PM".
function compressHourRanges(hourArr) {
  const sorted = [...new Set(hourArr)].sort((a, b) => a - b);
  if (!sorted.length) return "";
  const groups = [];
  let start = sorted[0];
  let prev = sorted[0];
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === prev + 1) {
      prev = sorted[i];
    } else {
      groups.push([start, prev]);
      start = prev = sorted[i];
    }
  }
  groups.push([start, prev]);
  return groups
    .map(([s, e]) => (s === e ? fmtHr(s) : `${fmtHr(s)}-${fmtHr(e)}`))
    .join(", ");
}

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

  const handleKey = e => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOpenDetail();
    }
  };

  return (
    <div className="timeline-wrap">
      <div className="timeline-label">Hours on Alert</div>
      {rows.length === 0 ? (
        <div className="alert-empty">No alerts during this period.</div>
      ) : (
        <ul
          className="alert-list"
          role="button"
          tabIndex={0}
          onClick={onOpenDetail}
          onKeyDown={handleKey}
        >
          {rows.map(({ metric, alertHours }) => (
            <li key={metric.key} className="alert-row">
              <span className="alert-metric">{metric.label}:</span>
              <span className="alert-text">
                {" "}{compressHourRanges(alertHours.map(h => h.hour))}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
