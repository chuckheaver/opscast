// "Operational Guidance" panel — purely presentational.
// Each action is a one-line summary: icon + status badge + headline.

import { STATUS } from "../lib/colors";

export default function ActionPanel({ actions }) {
  return (
    <div className="actions-panel">
      <div className="action-hdr">⚡ Operational Guidance</div>
      {actions.length === 0 ? (
        <div className="all-clear-banner">
          <span className="ac-icon">✅</span>
          <div>
            <div className="ac-text">All Clear — Ideal Conditions</div>
            <div className="ac-sub">
              All monitored metrics are within your ideal ranges for this
              period.
            </div>
          </div>
        </div>
      ) : (
        actions.map((a, ai) => (
          <div key={ai} className="action-item">
            <div className="action-left">
              <span className="action-icon">{a.icon}</span>
              <span
                className="action-status"
                style={{
                  background: STATUS[a.status].bg,
                  color: STATUS[a.status].text,
                }}
              >
                {STATUS[a.status].label}
              </span>
            </div>
            <div>
              <div className="action-headline">{a.headline}</div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
