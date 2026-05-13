// Horizontal scrolling strip of the day's hours, each with an icon + status
// dot. Tapping an hour opens a popup with all metric values for that hour.

import { useState } from "react";
import { STATUS, hourWorstStatus, getStatus, skyColor } from "../lib/colors";
import { fmtHr, fmtHrFull, fmtV } from "../lib/formatting";
import { PRIMARY, ADVANCED } from "../lib/thresholds";

export default function HourTimeline({ hours, thresh }) {
  const [selectedHour, setSelectedHour] = useState(null);
  const selectedHourData = hours.find(h => h.hour === selectedHour);

  // Primary + active-advanced metrics (filter out excluded ones).
  const visibleMetrics = [
    ...PRIMARY.filter(m => !thresh[m.key]?.excluded),
    ...ADVANCED.filter(m => !thresh[m.key]?.excluded),
  ];

  return (
    <div className="timeline-wrap">
      <div className="timeline-label">
        Hour-by-Hour · tap any hour for detail
      </div>
      <div className="timeline">
        {hours.map(h => {
          const ws = hourWorstStatus(h, thresh);
          const isSel = selectedHour === h.hour;
          const tlColors = STATUS[ws];
          return (
            <div
              key={h.hour}
              className={`tl-hour ${isSel ? "selected" : ""}`}
              onClick={() => setSelectedHour(isSel ? null : h.hour)}
            >
              <span className="tl-time">{fmtHr(h.hour)}</span>
              <span className="tl-icon">{h.icon}</span>
              <div
                className="tl-dot"
                style={{ background: tlColors.bg, color: tlColors.text }}
              >
                {ws === "alert" ? "!" : ws === "caution" ? "~" : "✓"}
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
              const s =
                m.key === "cloudCover"
                  ? "clear"
                  : getStatus(m.key, val, thresh);
              const c =
                m.key === "cloudCover" ? skyColor(val) : STATUS[s];
              return (
                <span
                  key={m.key}
                  className="tl-pm"
                  style={{ background: c.bg, color: c.text }}
                >
                  {m.label.split(" ")[0]}:{" "}
                  <strong>
                    {fmtV(m.key, val)}
                    {m.unit === "mph" ? " mph" : ""}
                  </strong>
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
