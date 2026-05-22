// Collapsible hour-by-hour grid: rows are metrics, columns are hours.
// Each cell is color-coded by the metric's status for that hour.
//
// Special rendering:
//   - Past hours (today only, h.isPast)            → "-" with neutral grey
//   - UV at night (!h.isDaylight)                  → "-"
//   - Wind row with windIsGust                     → small "g" after mph
//   - Visibility row                               → category label + value

import { cellStyle, hourWorstStatus, STATUS } from "../lib/colors";
import { fmtHr, fmtV, visibilityCategory, aqiCategory } from "../lib/formatting";
import { PRIMARY, ADVANCED } from "../lib/thresholds";

const PAST_BG = "#EFEFEF";
const PAST_TEXT = "#888";

// Sub-text shown below the main value in certain cells (units / context).
// Note: precipProb and humidity used to live here too, but fmtV already
// renders them with a trailing "%" — no second-line unit needed.
const SUB_BY_KEY = {
  precipAccum: "in/hr",
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
    const speedRound = Math.round(h.windSpeed);
    const sustRound = Math.round(h.windSustained ?? h.windSpeed);
    const isGust = h.windIsGust && h.windSustained < h.windSpeed;
    return (
      <td key={key + h.hour} className="dc" style={{ background: c.bg }}>
        <span className="dc-v" style={{ color: c.text }}>
          {speedRound} {isGust ? "gst" : "mph"}
        </span>
        {isGust && (
          <span className="dc-s" style={{ color: c.text }}>
            {sustRound} sus
          </span>
        )}
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

  if (key === "aqi") {
    const cat = aqiCategory(h.aqi);
    return (
      <td key={key + h.hour} className="dc" style={{ background: c.bg }}>
        <span className="dc-v" style={{ color: c.text }}>
          {cat || "—"}
        </span>
        <span className="dc-s" style={{ color: c.text }}>
          {fmtV(key, h.aqi)}
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

export default function DetailGrid({ hours, thresh, open, setOpen }) {
  return (
    <>
      <div className="detail-toggle" onClick={() => setOpen(v => !v)}>
        <span className="detail-toggle-lbl">📊 Hourly Detail</span>
        <span className="detail-toggle-arr">
          {open ? "▲ Collapse" : "▼ Expand"}
        </span>
      </div>
      {open && (
        <div className="grid-wrap">
          <table className="wx-table">
            <thead>
              <tr>
                <th className="row-lbl row-lbl-corner">METRIC / HOUR</th>
                {hours.map(h => (
                  <th key={h.hour} className="hr-head">
                    {fmtHr(h.hour)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="row-lbl">Sky</td>
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
              {[...PRIMARY, ...ADVANCED].map(m => (
                <tr key={m.key}>
                  <td className="row-lbl">{m.label}</td>
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
