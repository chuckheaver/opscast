// Setup screen: location input, operating hours, threshold sliders, submit.
// All state is owned by the parent (page.js) and passed in via props.

import SliderGroup from "./SliderGroup";
import { GROUPS } from "../lib/thresholds";
import { fmtHour } from "../lib/formatting";

const HOURS_24 = Array.from({ length: 24 }, (_, i) => i);

export default function SetupView({
  zip, setZip,
  startH, setStartH,
  endH, setEndH,
  thresh, setThresh,
  loading, geoLoading,
  err,
  onSubmit,
  onGeo,
}) {
  return (
    <div className="setup">
      <div className="page-title">
        Your weather.<br/>
        <span>Your hours.</span>
      </div>
      <div className="page-sub mono">
        Set thresholds · enter location · see only the hours that matter
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
          disabled={geoLoading || loading}
          title="Use my location"
        >
          {geoLoading ? "⏳" : "📍"}
        </button>
      </div>

      <div className="field-lbl">Operating Hours</div>
      <div className="hrs-row">
        <select
          className="hr-sel"
          value={startH}
          onChange={e => setStartH(+e.target.value)}
        >
          {HOURS_24.map(h => (
            <option key={h} value={h}>{fmtHour(h)}</option>
          ))}
        </select>
        <span className="hrs-sep">→</span>
        <select
          className="hr-sel"
          value={endH}
          onChange={e => setEndH(+e.target.value)}
        >
          {HOURS_24.map(h => (
            <option key={h} value={h}>{fmtHour(h)}</option>
          ))}
        </select>
        <span className="hrs-note mono">
          {endH > startH ? `${endH - startH}h window` : "·"}
        </span>
      </div>

      {GROUPS.map(g => (
        <SliderGroup
          key={g.title}
          title={g.title}
          keys={g.keys}
          thresh={thresh}
          setThresh={setThresh}
        />
      ))}

      <button
        className="submit-btn"
        onClick={onSubmit}
        disabled={loading || geoLoading || !zip.trim()}
      >
        {loading ? "Fetching forecast…" : "Get Forecast →"}
      </button>
      {err && <div className="err">⚠ {err}</div>}
    </div>
  );
}
