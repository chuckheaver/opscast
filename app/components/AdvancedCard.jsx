// Smaller card for the collapsible advanced-metrics grid.
// Same general behavior as MetricCard but more compact (no icon, no desc).

import { fmtT } from "../lib/formatting";

export default function AdvancedCard({ metric, threshCfg, setThresh }) {
  const m = metric;
  const cfg = threshCfg;
  const excluded = cfg.excluded;

  const range = m.sMax - m.sMin;
  const leftPct = Math.max(0, ((cfg.min - m.sMin) / range) * 100);
  const widthPct = Math.min(
    100 - leftPct,
    ((cfg.max - cfg.min) / range) * 100
  );

  const setMin = v =>
    setThresh(p => ({ ...p, [m.key]: { ...p[m.key], min: parseFloat(v) } }));
  const setMax = v =>
    setThresh(p => ({ ...p, [m.key]: { ...p[m.key], max: parseFloat(v) } }));
  const toggle = () =>
    setThresh(p => ({
      ...p,
      [m.key]: { ...p[m.key], excluded: !p[m.key].excluded },
    }));

  return (
    <div className={`amc ${excluded ? "excluded" : ""}`}>
      <div className="amc-top">
        <div>
          <div className="amc-label">{m.label}</div>
          <div className="amc-range">
            {excluded
              ? "Excluded"
              : fmtT(m.key, cfg.min) + " → " + fmtT(m.key, cfg.max)}
          </div>
        </div>
        <div className="ig-row" onClick={toggle}>
          <div className={`ig-box ${excluded ? "on" : ""}`}>
            {excluded && (
              <span style={{ color: "white", fontSize: 9, fontWeight: 700 }}>
                ✕
              </span>
            )}
          </div>
          <span className="ig-lbl">{excluded ? "Excl" : "On"}</span>
        </div>
      </div>

      {!excluded && (
        <>
          <div className="band-track" style={{ marginBottom: 8 }}>
            <div
              className="band-fill"
              style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
            />
          </div>
          <div className="slider-pair">
            <div className="sl-row">
              <span className="sl-lbl">Min</span>
              <input
                type="range"
                min={m.sMin}
                max={m.sMax}
                step={m.step}
                value={cfg.min}
                onChange={e =>
                  setMin(Math.min(parseFloat(e.target.value), cfg.max - m.step))
                }
              />
              <span className="sl-val">{fmtT(m.key, cfg.min)}</span>
            </div>
            <div className="sl-row">
              <span className="sl-lbl">Max</span>
              <input
                type="range"
                min={m.sMin}
                max={m.sMax}
                step={m.step}
                value={cfg.max}
                onChange={e =>
                  setMax(Math.max(parseFloat(e.target.value), cfg.min + m.step))
                }
              />
              <span className="sl-val">{fmtT(m.key, cfg.max)}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
