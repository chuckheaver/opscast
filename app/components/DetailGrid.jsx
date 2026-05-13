// Collapsible hour-by-hour grid: rows are metrics, columns are hours.
// Each cell is color-coded by the metric's status for that hour.

import { useState } from "react";
import { STATUS, skyColor, cellStyle, getStatus } from "../lib/colors";
import { fmtHr, fmtV } from "../lib/formatting";
import { PRIMARY, ADVANCED } from "../lib/thresholds";

// Sub-text shown below the main value in certain cells (e.g. unit).
const SUB_BY_KEY = {
  windGusts: "mph",
  precipAccum: "in/hr",
  visibility: "mi",
  humidity: "%",
  precipProb: "%",
};

// Renders a single cell for a single (metric, hour) pair.
// Special cases:
//   - "windSpeed" row also shows gusts and picks the worse status of the two
//   - "cloudCover" uses the sky-color gradient instead of status colors
function renderCell(key, h, thresh) {
  if (key === "windSpeed") {
    const wC = cellStyle("windSpeed", h.windSpeed, thresh);
    const gC = cellStyle("windGusts", h.windGusts, thresh);
    const ws = getStatus("windSpeed", h.windSpeed, thresh);
    const gs = getStatus("windGusts", h.windGusts, thresh);
    const worse =
      gs === "alert" || (gs === "caution" && ws !== "alert") ? gs : ws;
    const c = STATUS[worse];
    return (
      <td key={key + h.hour} className="dc" style={{ background: c.bg }}>
        <span className="dc-v" style={{ color: c.text }}>
          {h.windSpeed}
        </span>
        <span className="dc-s" style={{ color: c.text }}>
          G:{h.windGusts} mph
        </span>
      </td>
    );
  }
  if (key === "cloudCover") {
    const c = skyColor(h.cloudCover);
    return (
      <td key={key + h.hour} className="dc" style={{ background: c.bg }}>
        <span className="dc-v" style={{ color: c.text }}>
          {h.cloudCover}%
        </span>
      </td>
    );
  }
  const c = cellStyle(key, h[key] ?? 0, thresh);
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

  const activePrimary = PRIMARY.filter(m => !thresh[m.key]?.excluded);
  const activeAdvanced = ADVANCED.filter(m => !thresh[m.key]?.excluded);

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
                {hours.map(h => (
                  <td key={h.hour} className="cond-cell">
                    <span className="cond-ic">{h.icon}</span>
                    <span className="cond-lb">{h.condition}</span>
                  </td>
                ))}
              </tr>
              {activePrimary.map(m => (
                <tr key={m.key}>
                  <td className="row-lbl">{m.label}</td>
                  {hours.map(h => renderCell(m.key, h, thresh))}
                </tr>
              ))}
              {activeAdvanced.length > 0 && (
                <>
                  <tr>
                    <td className="row-lbl sep-lbl" colSpan={hours.length + 1}>
                      ADVANCED METRICS
                    </td>
                  </tr>
                  {activeAdvanced.map(m => (
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
                </>
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
