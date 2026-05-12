// The 4-cell summary row above the hour list:
// Temp Range · Max Gusts · Max Precip · Alert Hours.

import { calcRisk } from "../lib/risk";

export default function SummaryRow({ hours, thresh }) {
  const alertHours = hours.filter(h => calcRisk(h, thresh).score >= 5).length;
  const maxTemp = Math.max(...hours.map(h => h.tempF));
  const minTemp = Math.min(...hours.map(h => h.tempF));
  const maxGusts = Math.max(...hours.map(h => h.windGusts));
  const maxPrecipProb = Math.max(...hours.map(h => h.precipProb));

  return (
    <div className="sum-row">
      <div className="sum-c">
        <div className="sum-l">Temp Range</div>
        <div className="sum-v mono">
          {Math.round(minTemp)}–{Math.round(maxTemp)}°F
        </div>
      </div>
      <div className="sum-c">
        <div className="sum-l">Max Gusts</div>
        <div className="sum-v mono">{Math.round(maxGusts)} mph</div>
      </div>
      <div className="sum-c">
        <div className="sum-l">Max Precip</div>
        <div className="sum-v mono">{maxPrecipProb}%</div>
      </div>
      <div className="sum-c">
        <div className="sum-l">Alert Hours</div>
        <div
          className="sum-v mono"
          style={{ color: alertHours > 0 ? "#ea580c" : "#16a34a" }}
        >
          {alertHours}/{hours.length}
        </div>
      </div>
    </div>
  );
}
