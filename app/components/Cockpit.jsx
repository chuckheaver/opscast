// The 4-KPI strip across the top of each DayBlock:
// Peak Feels Like · Max Wind · Max Precip Chance · Peak UV Index.

import { STATUS, getStatus } from "../lib/colors";

const uvDescription = uv => {
  if (uv <= 2) return "Low";
  if (uv <= 5) return "Moderate";
  if (uv <= 7) return "High";
  if (uv <= 10) return "Very High";
  return "Extreme";
};

export default function Cockpit({ hours, thresh }) {
  if (!hours.length) return null;

  const maxFeels = Math.max(...hours.map(h => h.feelsLike));
  const minFeels = Math.min(...hours.map(h => h.feelsLike));
  // h.windSpeed is the effective wind (gust value when available, else
  // sustained). Sustained is kept separately for context display.
  const maxWind = Math.max(...hours.map(h => h.windSpeed));
  const maxSustained = Math.max(...hours.map(h => h.windSustained ?? h.windSpeed));
  const maxPrecip = Math.max(...hours.map(h => h.precipProb));
  const maxUV = Math.max(...hours.map(h => h.uvIndex));

  const kpiStatus = (key, val) =>
    val != null ? STATUS[getStatus(key, val, thresh)] : STATUS.excluded;

  const fS = kpiStatus("feelsLike", maxFeels);
  const wS = kpiStatus("windSpeed", maxWind);
  const pS = kpiStatus("precipProb", maxPrecip);
  const uS = kpiStatus("uvIndex", maxUV);

  return (
    <div className="cockpit">
      <div className="kpi" style={{ background: fS.bg }}>
        <div className="kpi-label" style={{ color: fS.text }}>
          Peak Feels Like
        </div>
        <div className="kpi-value" style={{ color: fS.text }}>
          {maxFeels}°F
        </div>
        <div className="kpi-sub" style={{ color: fS.text }}>
          <span className="kpi-dot" style={{ background: fS.dot }} />
          {fS.label} · Low {minFeels}°F
        </div>
      </div>
      <div className="kpi" style={{ background: wS.bg }}>
        <div className="kpi-label" style={{ color: wS.text }}>
          Max Wind
        </div>
        <div className="kpi-value" style={{ color: wS.text }}>
          {maxWind}
          <span style={{ fontSize: 16, fontWeight: 400 }}> mph</span>
        </div>
        <div className="kpi-sub" style={{ color: wS.text }}>
          <span className="kpi-dot" style={{ background: wS.dot }} />
          {wS.label} · Sustained {maxSustained} mph
        </div>
      </div>
      <div className="kpi" style={{ background: pS.bg }}>
        <div className="kpi-label" style={{ color: pS.text }}>
          Max Precip Chance
        </div>
        <div className="kpi-value" style={{ color: pS.text }}>
          {maxPrecip}
          <span style={{ fontSize: 16, fontWeight: 400 }}>%</span>
        </div>
        <div className="kpi-sub" style={{ color: pS.text }}>
          <span className="kpi-dot" style={{ background: pS.dot }} />
          {pS.label}
        </div>
      </div>
      <div className="kpi" style={{ background: uS.bg }}>
        <div className="kpi-label" style={{ color: uS.text }}>
          Peak UV Index
        </div>
        <div className="kpi-value" style={{ color: uS.text }}>
          {maxUV}
        </div>
        <div className="kpi-sub" style={{ color: uS.text }}>
          <span className="kpi-dot" style={{ background: uS.dot }} />
          {uvDescription(maxUV)}
        </div>
      </div>
    </div>
  );
}
