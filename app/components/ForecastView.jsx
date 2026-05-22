// Forecast screen: city + current-conditions hero, color legend,
// radar panel, then one DayBlock per day in the selected range.

import RadarPanel from "./RadarPanel";
import DayBlock from "./DayBlock";
import { fmtHrFull } from "../lib/formatting";

// Legend swatches shown above the day blocks.
// Three-tier model for most metrics, plus a Sky Cover exception.
const LEGEND = [
  ["#C8EAC8", "Ideal"],
  ["#FFF0B3", "Caution"],
  ["#FFBDBD", "Alert"],
  ["#D6EEFF", "Ideal"],
  ["#A0B8CC", "Alert"],
];

// Locate the hour entry in today's hours array that best matches "right
// now" — exact hour match preferred, else the closest available. Returns
// null if no hours are available.
function findCurrentHour(days) {
  if (!days?.length) return null;
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const todayEntry = days.find(([d]) => d === todayStr) || days[0];
  const todayHours = todayEntry[1];
  if (!todayHours?.length) return null;
  const exact = todayHours.find(h => h.hour === now.getHours());
  if (exact) return exact;
  // Fall back to the closest hour by absolute distance.
  return todayHours.reduce((best, h) => {
    const d = Math.abs(h.hour - now.getHours());
    return !best || d < Math.abs(best.hour - now.getHours()) ? h : best;
  }, null);
}

// Friendly long-form date for the hero, e.g. "Thursday, May 21".
function fmtHeroDate(d) {
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export default function ForecastView({
  forecast,
  startH,
  endH,
  dayFrom,
  dayTo,
  thresh,
}) {
  const filterToWindow = dh =>
    dh.filter(h => h.hour >= startH && h.hour < endH);

  const selectedDays = forecast.days.slice(dayFrom, dayTo + 1);
  const now = findCurrentHour(forecast.days);

  return (
    <div className="fc">
      <div className="fc-top">
        <div className="fc-top-row">
          <div className="fc-top-left">
            <div className="fc-city">
              {forecast.loc.name}
              {forecast.loc.admin1 ? `, ${forecast.loc.admin1}` : ""}
            </div>
            <div className="fc-meta">
              {fmtHeroDate(new Date())} · {fmtHrFull(startH)} – {fmtHrFull(endH)} each day
            </div>
          </div>
          {now && (
            <div className="fc-now">
              <span className="fc-now-icon" aria-hidden="true">{now.icon}</span>
              <div className="fc-now-temp">
                {now.tempF}
                <span className="fc-now-deg">°</span>
              </div>
              <div className="fc-now-cond">{now.condition}</div>
            </div>
          )}
        </div>
        {now && (
          <div className="fc-now-strip">
            <div className="fc-now-chip">
              <span className="fc-now-chip-lbl">Feels</span>
              <span className="fc-now-chip-val">{now.feelsLike}°</span>
            </div>
            <div className="fc-now-chip">
              <span className="fc-now-chip-lbl">Wind</span>
              <span className="fc-now-chip-val">
                {now.windSpeed} mph{now.windIsGust ? "g" : ""}
              </span>
            </div>
            <div className="fc-now-chip">
              <span className="fc-now-chip-lbl">Humidity</span>
              <span className="fc-now-chip-val">{now.humidity}%</span>
            </div>
            <div className="fc-now-chip">
              <span className="fc-now-chip-lbl">Precip</span>
              <span className="fc-now-chip-val">{now.precipProb}%</span>
            </div>
            <div className="fc-now-chip">
              <span className="fc-now-chip-lbl">UV</span>
              <span className="fc-now-chip-val">{now.uvIndex}</span>
            </div>
            <div className="fc-now-chip">
              <span className="fc-now-chip-lbl">AQI</span>
              <span className="fc-now-chip-val">{now.aqi}</span>
            </div>
          </div>
        )}
      </div>

      <div className="fc-legend">
        {LEGEND.map(([bg, lbl]) => (
          <div key={lbl} className="fc-leg">
            <div className="fc-leg-sw" style={{ background: bg }} />
            {lbl}
          </div>
        ))}
      </div>

      <RadarPanel loc={forecast.loc} />

      {selectedDays.map(([date, dayHours], idx) => (
        <DayBlock
          key={date}
          dayIndex={dayFrom + idx}
          date={date}
          hours={filterToWindow(dayHours)}
          thresh={thresh}
          startH={startH}
          endH={endH}
        />
      ))}
    </div>
  );
}
