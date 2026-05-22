// Forecast screen: city header, color legend, radar panel, then one
// DayBlock per day in the selected range.

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

  return (
    <div className="fc">
      <div className="fc-top">
        <div>
          <div className="fc-city">
            {forecast.loc.name}
            {forecast.loc.admin1 ? `, ${forecast.loc.admin1}` : ""}
          </div>
          <div className="fc-meta">
            {fmtHrFull(startH)} – {fmtHrFull(endH)} each day
            {forecast.loc.country ? ` · ${forecast.loc.country}` : ""}
          </div>
        </div>
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
