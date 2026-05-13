// Horizontal scrolling strip of the day's hours, each with an icon + status
// dot. Tapping an hour opens a popup with all metric values for that hour.
//
// Past hours render with a muted dot and "-" placeholder in the popup.

import { useState } from "react";
import { STATUS, hourWorstStatus, cellStyle } from "../lib/colors";
import { fmtHr, fmtHrFull, fmtV, visibilityCategory } from "../lib/formatting";
import { PRIMARY, ADVANCED } from "../lib/thresholds";

const PAST_STYLE = { bg: "#EFEFEF", text: "#888" };

export default function HourTimeline({ hours, thresh }) {
  const [selectedHour, setSelectedHour] = useState(null);
  const selectedHourData = hours.find(h => h.hour === selectedHour);

  const visibleMetrics = [...PRIMARY, ...ADVANCED];

  return (
    <div className="timeline-wrap">
      <div className="timeline-label">
        Hour-by-Hour · tap any hour for detail
      </div>
      <div className="timeline">
        {hours.map(h => {
          const isSel = selectedHour === h.hour;
          const ws = h.isPast ? null : hourWorstStatus(h, thresh);
          const dotColors = h.isPast ? PAST_STYLE : STATUS[ws];
          return (
            <div
              key={h.hour}
              className={`tl-hour ${isSel ? "selected" : ""}`}
              onClick={() => setSelectedHour(isSel ? null : h.hour)}
              style={h.isPast ? { opacity: 0.45 } : {}}
            >
              <span className="tl-time">{fmtHr(h.hour)}</span>
              <span className="tl-icon">{h.isPast ? "·" : h.icon}</span>
              <div
                className="tl-dot"
                style={{ background: dotColors.bg, color: dotColors.text }}
              >
                {h.isPast
                  ? "-"
                  : ws === "alert"
                  ? "!"
                  : ws === "caution"
                  ? "~"
                  : "✓"}
              </div>
            </div>
          );
        })}
      </div>

      {selectedHourData && (
        <div className="tl-popup">
          <button
            className="tl-close"
            onClick={() => setSelectedHour(null)}
          >
            ✕
          </button>
          <div className="tl-popup-title">
            {selectedHourData.icon} {fmtHrFull(selectedHourData.hour)} —{" "}
            {selectedHourData.condition}
          </div>
          <div className="tl-popup-metrics">
            {visibleMetrics.map(m => {
              const val = selectedHourData[m.key] ?? 0;
              // Past hours and after-sunset UV display as "-".
              const blank =
                selectedHourData.isPast ||
                (m.key === "uvIndex" && selectedHourData.isDaylight === false);

              const c = blank
                ? PAST_STYLE
                : cellStyle(m.key, val, thresh);

              let display;
              if (blank) {
                display = "-";
              } else if (m.key === "visibility") {
                display = `${visibilityCategory(val)} ${fmtV(m.key, val)} mi`;
              } else if (m.key === "windSpeed") {
                display = `${fmtV(m.key, val)} mph${
                  selectedHourData.windIsGust ? "g" : ""
                }`;
              } else {
                display = `${fmtV(m.key, val)}${m.unit === "mph" ? " mph" : ""}`;
              }
              return (
                <span
                  key={m.key}
                  className="tl-pm"
                  style={{ background: c.bg, color: c.text }}
                >
                  {m.label.split(" ")[0]}: <strong>{display}</strong>
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
