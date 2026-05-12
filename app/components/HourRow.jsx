// One row in the forecast hour list: time, icon, all stats, risk score + chips.

import { calcRisk, riskStyle as getRiskStyle } from "../lib/risk";
import { fmtHour } from "../lib/formatting";

export default function HourRow({ hour, thresh }) {
  const { score, trig } = calcRisk(hour, thresh);
  const rs = getRiskStyle(score);

  // Renders a stat value, flagging it (color + bold) when it crosses threshold.
  const statValue = (flagged, text) => (
    <span
      className={`st-v${flagged ? " f" : ""}`}
      style={flagged ? { color: rs.dot } : {}}
    >
      {text}
    </span>
  );

  const chipStyle = {
    background: rs.bg,
    color: rs.color,
    border: `1px solid ${rs.border}`,
  };

  return (
    <div
      className="hr-row"
      style={{
        borderColor: trig.length ? rs.border : "var(--border)",
        background: trig.length ? rs.bg : "var(--card)",
      }}
    >
      <div className="hr-t mono">{fmtHour(hour.hour)}</div>
      <div className="hr-ic">{hour.icon}</div>
      <div className="hr-stats">
        <div className="st">
          <span className="st-l">Temp</span>
          {statValue(hour.tempF >= thresh.tempMax || hour.tempF <= thresh.tempMin, `${Math.round(hour.tempF)}°F`)}
        </div>
        <div className="st">
          <span className="st-l">Heat Idx</span>
          {statValue(hour.heatIndex >= thresh.heatIndex, `${Math.round(hour.heatIndex)}°F`)}
        </div>
        <div className="st">
          <span className="st-l">Wind Chill</span>
          {statValue(hour.windChill <= thresh.windChill, `${Math.round(hour.windChill)}°F`)}
        </div>
        <div className="st">
          <span className="st-l">Wind</span>
          {statValue(hour.windSpeed >= thresh.windSpeed, `${Math.round(hour.windSpeed)} mph`)}
        </div>
        <div className="st">
          <span className="st-l">Gusts</span>
          {statValue(hour.windGusts >= thresh.windGusts, `${Math.round(hour.windGusts)} mph`)}
        </div>
        <div className="st">
          <span className="st-l">Precip</span>
          {statValue(hour.precipProb >= thresh.precipProb, `${hour.precipProb}%`)}
        </div>
        <div className="st">
          <span className="st-l">Rain</span>
          {statValue(hour.precipAccum >= thresh.precipAccum, `${hour.precipAccum.toFixed(2)}"`)}
        </div>
        <div className="st">
          <span className="st-l">UV</span>
          {statValue(hour.uvIndex >= thresh.uvIndex, `${hour.uvIndex}`)}
        </div>
        <div className="st">
          <span className="st-l">Humidity</span>
          {statValue(hour.humidity >= thresh.humidity, `${hour.humidity}%`)}
        </div>
        <div className="st">
          <span className="st-l">Dew Pt</span>
          {statValue(hour.dewPoint >= thresh.dewPoint, `${Math.round(hour.dewPoint)}°F`)}
        </div>
        <div className="st">
          <span className="st-l">Visibility</span>
          {statValue(hour.visibility <= thresh.visibility, `${hour.visibility.toFixed(1)} mi`)}
        </div>
        {hour.aqi > 0 && (
          <div className="st">
            <span className="st-l">AQI</span>
            {statValue(hour.aqi >= thresh.aqi, `${hour.aqi}`)}
          </div>
        )}
      </div>
      <div className="hr-right">
        <div className="r-num" style={{ color: rs.dot }}>{score}</div>
        <div className="r-lbl" style={{ color: rs.color }}>{rs.label}</div>
        {trig.length > 0 && (
          <div className="r-chips">
            {trig.slice(0, 3).map((t, ti) => (
              <span key={ti} className="r-chip" style={chipStyle}>
                {t}
              </span>
            ))}
            {trig.length > 3 && (
              <span className="r-chip" style={chipStyle}>
                +{trig.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
