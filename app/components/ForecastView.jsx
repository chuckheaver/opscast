// Forecast screen: city + current-conditions hero, color legend,
// radar panel, then one DayBlock per day in the selected range.

import RadarPanel from "./RadarPanel";
import DayBlock from "./DayBlock";

// Legend swatches shown above the day blocks.
// Three-tier model used by all metrics. (Sky Cover swatches used to
// appear here too but were dropped — the day blocks themselves carry
// enough colour context.)
const LEGEND = [
  ["#C8EAC8", "Ideal"],
  ["#FFF0B3", "Caution"],
  ["#FFBDBD", "Alert"],
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

// 8-point compass abbreviation for a wind bearing in degrees.
const COMPASS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
function compass(deg) {
  if (deg == null || !Number.isFinite(deg)) return "";
  const idx = Math.round(((deg % 360) / 45)) % 8;
  return COMPASS[idx];
}

export default function ForecastView({
  forecast,
  startH,
  endH,
  dayFrom,
  dayTo,
  thresh,
  onOpenSettings,
}) {
  const filterToWindow = dh =>
    dh.filter(h => h.hour >= startH && h.hour < endH);

  const selectedDays = forecast.days.slice(dayFrom, dayTo + 1);
  const now = findCurrentHour(forecast.days);
  // Today's overall Hi / Lo for the hero. Falls back to `now` if today's
  // hour array is missing (defensive — shouldn't happen in practice).
  let hi = null;
  let lo = null;
  if (now) {
    const todayHours = (forecast.days.find(([d]) => d === now.date) || forecast.days[0])[1];
    const temps = todayHours.map(h => h.tempF).filter(Number.isFinite);
    if (temps.length) {
      hi = Math.max(...temps);
      lo = Math.min(...temps);
    }
  }

  return (
    <div className="fc">
      <div className="fc-top">
        <div className="fc-city">
          {forecast.loc.label ||
            `${forecast.loc.name}${forecast.loc.admin1 ? `, ${forecast.loc.admin1}` : ""}`}
        </div>
        {now && <div className="fc-currently">Currently</div>}
        <div className="fc-top-row">
          <div className="fc-top-left">
            {now && (
              <>
                <div className="fc-now-temp">
                  {now.tempF}
                  <span className="fc-now-deg">°F</span>
                </div>
                <div className="fc-now-wind">
                  {compass(now.windDir) && `${compass(now.windDir)} `}
                  {now.windSpeed} mph{now.windIsGust ? "g" : ""}
                </div>
              </>
            )}
          </div>
          {now && (
            <div className="fc-now-sky">
              <div className="fc-now-badge" aria-hidden="true">
                <span className="fc-now-icon">{now.icon}</span>
              </div>
              <div className="fc-now-cond">{now.condition}</div>
            </div>
          )}
        </div>
        {now && (
          <div className="fc-now-stats">
            <span className="fc-now-stat">Feels {now.feelsLike}°</span>
            {hi != null && lo != null && (
              <span className="fc-now-stat">Hi {hi}° / Lo {lo}°</span>
            )}
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
          onOpenSettings={onOpenSettings}
        />
      ))}
    </div>
  );
}
