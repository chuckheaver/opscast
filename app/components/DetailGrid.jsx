// Collapsible hour-by-hour grid: rows are metrics, columns are hours.
// Each cell is color-coded by the metric's status for that hour.
//
// Special rendering:
//   - Past hours (today only, h.isPast)            → "-" with neutral grey
//   - UV at night (!h.isDaylight)                  → "-"
//   - Wind row with windIsGust                     → small "g" after mph
//   - Visibility row                               → category label + value

import { useState } from "react";
import { cellStyle, hourWorstStatus, STATUS } from "../lib/colors";
import { fmtHr, fmtV, visibilityCategory } from "../lib/formatting";
import { PRIMARY, ADVANCED } from "../lib/thresholds";

const PAST_BG = "#EFEFEF";
const PAST_TEXT = "#888";

// Sub-text shown below the main value in certain cells (units / context).
const SUB_BY_KEY = {
  precipAccum: "in/hr",
  humidity: "%",
  precipProb: "%",
};

// Renders a single cell for a single (metric, hour) pair.
function renderCell(key, h, thresh) {
  // Past hours collapse to a neutral dash everywhere.
  if (h.isPast) {
    return (
      <td
        key={key + h.hour}
        className="dc"
        style={{ background: PAST_BG }}
      >
        <span className="dc-v" style={{ color: PAST_TEXT }}>-</span>
      </td>
    );
  }

  // UV at night also dashes out (no meaningful value).
  if (key === "uvIndex" && h.isDaylight === false) {
    return (
      <td key={key + h.hour} className="dc" style={{ background: PAST_BG }}>
        <span className="dc-v" style={{ color: PAST_TEXT }}>-</span>
      </td>
    );
  }

  const c = cellStyle(key, h[key] ?? 0, thresh);

  if (key === "windSpeed") {
    return (
      <td key={key + h.hour} className="dc" style={{ background: c.bg }}>
        <span className="dc-v" style={{ color: c.text }}>
          {h.windSpeed}
          {h.windIsGust && (
            <span style={{ fontSize: 9, marginLeft: 1 }}>g</span>
          )}
        </span>
        <span className="dc-s" style={{ color: c.text }}>
          {h.windIsGust && h.windSustained < h.windSpeed
            ? `sust ${h.windSustained}`
            : "mph"}
        </span>
      </td>
    );
  }

  if (key === "visibility") {
    const cat = visibilityCategory(h.visibility);
    return (
      <td key={key + h.hour} className="dc" style={{ background: c.bg }}>
        <span className="dc-v" style={{ color: c.text }}>
          {cat}
        </span>
        <span className="dc-s" style={{ color: c.text }}>
          {fmtV(key, h.visibility)} mi
        </span>
      </td>
    );
  }

  const sub = SUB_BY_KEY[key] || null;
  return (
    <td key={key + h.hour} className="dc" style={{ background: c.bg }}>
      <span className="dc-v" style={{ color: c.text }}>
        {fmtV(key, h[key])}
      </span>
      {sub && (
        <span className="dc-s" style={{ color: c.text }}>
          {sub}
        </span>
      )}
    </td>
  );
}

export default function DetailGrid({ hours, thresh }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="detail-toggle" onClick={() => setOpen(v => !v)}>
        <span className="detail-toggle-lbl">📊 Hourly Detail Grid</span>
        <span className="detail-toggle-arr">
          {open ? "▲ Collapse" : "▼ Expand"}
        </span>
      </div>
      {open && (
        <div className="grid-wrap">
          <table className="wx-table">
            <thead>
              <tr>
                <th
                  className="row-lbl"
                  style={{
                    background: "#111",
                    textAlign: "left",
                    color: "#444",
                    fontSize: 8,
                    letterSpacing: 2,
                  }}
                >
                  METRIC / HOUR
                </th>
                {hours.map(h => (
                  <th key={h.hour} className="hr-head">
                    {fmtHr(h.hour)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="row-lbl">Condition</td>
                {hours.map(h => {
                  // Past hours stay grey; live hours pick up the hour's
                  // worst-status tint so the whole column reads at a
                  // glance even before you scan the numeric rows below.
                  let bg = PAST_BG;
                  let labelColor = PAST_TEXT;
                  if (!h.isPast) {
                    const s = STATUS[hourWorstStatus(h, thresh)];
                    bg = s.bg;
                    labelColor = s.text;
                  }
                  return (
                    <td
                      key={h.hour}
                      className="cond-cell"
                      style={{ background: bg }}
                    >
                      {h.isPast ? (
                        <span className="cond-lb" style={{ color: PAST_TEXT }}>-</span>
                      ) : (
                        <>
                          <span className="cond-ic">{h.icon}</span>
                          <span className="cond-lb" style={{ color: labelColor }}>
                            {h.condition}
                          </span>
                        </>
                      )}
                    </td>
                  );
                })}
              </tr>
              {PRIMARY.map(m => (
                <tr key={m.key}>
                  <td className="row-lbl">{m.label}</td>
                  {hours.map(h => renderCell(m.key, h, thresh))}
                </tr>
              ))}
              <tr>
                <td className="row-lbl sep-lbl" colSpan={hours.length + 1}>
                  ADVANCED METRICS
                </td>
              </tr>
              {ADVANCED.map(m => (
                <tr key={m.key}>
                  <td
                    className="row-lbl"
                    style={{
                      background: "#2e2e2e",
                      color: "#aaa",
                      fontSize: 9,
                    }}
                  >
                    {m.label}
                  </td>
                  {hours.map(h => renderCell(m.key, h, thresh))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
