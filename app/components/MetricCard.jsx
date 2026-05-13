// One of the 5 primary metric cards on the setup view.
// Shows the metric icon/label/description, current ideal range, a band
// visualization, and two sliders (min and max).

import { fmtT } from "../lib/formatting";

export default function MetricCard({ metric, threshCfg, setThresh }) {
  const m = metric;
  const cfg = threshCfg;

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

  return (
    <div className="mc">
      <div className="mc-bar">
        <div className="mc-strip" style={{ background: "#C8EAC8" }} />
        <div className="mc-body">
          <div className="mc-head">
            <div className="mc-title-row">
              <span className="mc-icon">{m.icon}</span>
              <div>
                <div className="mc-label">{m.label}</div>
                <div className="mc-desc">{m.desc}</div>
                <div className="mc-range">
                  {fmtT(m.key, cfg.min)} → {fmtT(m.key, cfg.max)}
                </div>
              </div>
            </div>
          </div>

          <div className="band-area">
            <div className="band-scale">
              <span>{fmtT(m.key, m.sMin)}</span>
              <em>
                Ideal: {fmtT(m.key, cfg.min)} – {fmtT(m.key, cfg.max)}
              </em>
              <span>{fmtT(m.key, m.sMax)}</span>
            </div>
            <div className="band-track">
              <div
                className="band-fill"
                style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
              />
            </div>
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
        </div>
      </div>
    </div>
  );
}
