// Setup screen: location input, hours, day range, primary metric cards,
// collapsible advanced metric grid, submit. Owns the "show advanced"
// toggle locally; everything else is state passed from page.js.

import { useState } from "react";
import MetricCard from "./MetricCard";
import AdvancedCard from "./AdvancedCard";
import { PRIMARY, ADVANCED } from "../lib/thresholds";
import { fmtHrFull, DAY_LABELS } from "../lib/formatting";

const HOURS_24 = Array.from({ length: 24 }, (_, i) => i);

export default function SetupView({
  zip, setZip,
  startH, setStartH,
  endH, setEndH,
  dayFrom, setDayFrom,
  dayTo, setDayTo,
  thresh, setThresh,
  loading, geoLoad,
  err,
  onSubmit, onGeo,
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const activeAdvanced = ADVANCED.filter(m => !thresh[m.key]?.excluded);

  return (
    <div className="setup">
      <div className="page-h">
        Tell us your<br />
        <em>ideal conditions.</em>
      </div>
      <div className="page-sub">
        Set your range · exclude what doesn't apply · pick your days
      </div>

      <div className="field-lbl">Location</div>
      <div className="loc-row">
        <input
          className="zip-inp"
          placeholder="ZIP code or city name…"
          value={zip}
          onChange={e => setZip(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !loading && onSubmit()}
        />
        <button
          className="geo-btn"
          onClick={onGeo}
          disabled={geoLoad || loading}
        >
          {geoLoad ? "⏳" : "📍"}
        </button>
      </div>

      <div className="field-lbl">Daily Operating Hours</div>
      <div className="sel-row">
        <select
          className="sel-box"
          value={startH}
          onChange={e => setStartH(+e.target.value)}
        >
          {HOURS_24.map(h => (
            <option key={h} value={h}>{fmtHrFull(h)}</option>
          ))}
        </select>
        <span style={{ color: "#78716c", fontFamily: "'DM Mono',monospace" }}>→</span>
        <select
          className="sel-box"
          value={endH}
          onChange={e => setEndH(+e.target.value)}
        >
          {HOURS_24.map(h => (
            <option key={h} value={h}>{fmtHrFull(h)}</option>
          ))}
        </select>
        {endH > startH && (
          <span className="sel-note">{endH - startH}h / day</span>
        )}
      </div>

      <div className="field-lbl">Day Range to Forecast</div>
      <div className="sel-row" style={{ marginBottom: 32 }}>
        <select
          className="sel-box"
          value={dayFrom}
          onChange={e => {
            const v = +e.target.value;
            setDayFrom(v);
            if (v > dayTo) setDayTo(v);
          }}
        >
          {DAY_LABELS.map((l, i) => (
            <option key={i} value={i}>{l}</option>
          ))}
        </select>
        <span style={{ color: "#78716c", fontFamily: "'DM Mono',monospace" }}>through</span>
        <select
          className="sel-box"
          value={dayTo}
          onChange={e => {
            const v = +e.target.value;
            setDayTo(v);
            if (v < dayFrom) setDayFrom(v);
          }}
        >
          {DAY_LABELS.map((l, i) => (
            <option key={i} value={i} disabled={i < dayFrom}>{l}</option>
          ))}
        </select>
        <span className="sel-note">
          {dayTo - dayFrom + 1} day{dayTo - dayFrom > 0 ? "s" : ""} shown
        </span>
      </div>

      <div className="field-lbl">Your Ideal Conditions</div>
      {PRIMARY.map(m => (
        <MetricCard
          key={m.key}
          metric={m}
          threshCfg={thresh[m.key]}
          setThresh={setThresh}
        />
      ))}

      <div className="adv-toggle" onClick={() => setShowAdvanced(v => !v)}>
        <div className="adv-line" />
        <button className="adv-btn">
          {showAdvanced ? "▲ Hide" : "▼ Show"} Advanced Metrics
          {activeAdvanced.length > 0 && ` · ${activeAdvanced.length} active`}
        </button>
        <div className="adv-line" />
      </div>
      {showAdvanced && (
        <div className="adv-grid">
          {ADVANCED.map(m => (
            <AdvancedCard
              key={m.key}
              metric={m}
              threshCfg={thresh[m.key]}
              setThresh={setThresh}
            />
          ))}
        </div>
      )}

      <button
        className="submit-btn"
        onClick={onSubmit}
        disabled={loading || geoLoad || !zip.trim()}
      >
        {loading ? "Fetching Forecast…" : "Get My Forecast →"}
      </button>
      {err && <div className="err-box">⚠ {err}</div>}
    </div>
  );
}
