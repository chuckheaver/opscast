// Setup screen: location input (with autocomplete), hours, day range,
// primary metric cards, collapsible advanced metric grid, submit.
// All shared state is owned by page.js and passed in via props.

import { useState } from "react";
import MetricCard from "./MetricCard";
import AdvancedCard from "./AdvancedCard";
import MicroLifeHeader from "./MicroLifeHeader";
import { PRIMARY, ADVANCED } from "../lib/thresholds";
import { fmtHrFull, dayLabel } from "../lib/formatting";

const HOURS_24 = Array.from({ length: 24 }, (_, i) => i);
const DAY_INDEXES = [0, 1, 2, 3, 4];

export default function SetupView({
  zip, setZip,
  selectedLoc,
  startH, setStartH,
  endH, setEndH,
  dayFrom, setDayFrom,
  dayTo, setDayTo,
  thresh, setThresh,
  loading, geoLoad,
  err,
  onSubmit, onGeo, onSelectLocation,
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="setup">
      <MicroLifeHeader
        zip={zip}
        setZip={setZip}
        selectedLoc={selectedLoc}
        loading={loading}
        geoLoad={geoLoad}
        onSubmit={onSubmit}
        onGeo={onGeo}
        onSelectLocation={onSelectLocation}
      />

      <div className="field-lbl">Period to Forecast</div>
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
        <span style={{ color: "#78716c", fontFamily: "'DM Sans',sans-serif" }}>→</span>
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
          {DAY_INDEXES.map(i => (
            <option key={i} value={i}>{dayLabel(i)}</option>
          ))}
        </select>
        <span style={{ color: "#78716c", fontFamily: "'DM Sans',sans-serif" }}>through</span>
        <select
          className="sel-box"
          value={dayTo}
          onChange={e => {
            const v = +e.target.value;
            setDayTo(v);
            if (v < dayFrom) setDayFrom(v);
          }}
        >
          {DAY_INDEXES.map(i => (
            <option key={i} value={i} disabled={i < dayFrom}>{dayLabel(i)}</option>
          ))}
        </select>
        <span className="sel-note">
          {dayTo - dayFrom + 1} day{dayTo - dayFrom > 0 ? "s" : ""} shown
        </span>
      </div>

      <div className="field-lbl">Tell Me Your Ideal Conditions</div>
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
