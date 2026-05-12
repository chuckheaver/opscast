// Forecast screen: location header, day-pill strip, summary row, hour list.
// Filters the currently-selected day's hours to the user's operating window.

import DayPill from "./DayPill";
import SummaryRow from "./SummaryRow";
import HourRow from "./HourRow";
import { calcRisk, riskStyle as getRiskStyle } from "../lib/risk";
import { fmtHour } from "../lib/formatting";

export default function ForecastView({
  forecast,
  startH,
  endH,
  thresh,
  selDay,
  setSelDay,
}) {
  // Restrict an hour-array to the operator's working window (startH inclusive,
  // endH exclusive — same semantics as the original).
  const filterToWindow = dayHours =>
    dayHours.filter(h => h.hour >= startH && h.hour < endH);

  // Highest in-window risk score for a given day's hours.
  const maxRiskForDay = dayHours => {
    const inWindow = filterToWindow(dayHours);
    return inWindow.length
      ? Math.max(...inWindow.map(h => calcRisk(h, thresh).score))
      : 0;
  };

  const currentDayHours = filterToWindow(forecast.days[selDay]?.[1] || []);

  return (
    <div className="fc">
      <div className="fc-name">
        {forecast.loc.name}
        {forecast.loc.admin1 ? `, ${forecast.loc.admin1}` : ""}
      </div>
      <div className="fc-meta mono">
        {fmtHour(startH)} – {fmtHour(endH)} operating window
        {forecast.loc.country ? ` · ${forecast.loc.country}` : ""}
      </div>

      <div className="day-strip">
        {forecast.days.map(([date, dayHours], i) => {
          const score = maxRiskForDay(dayHours);
          const rs = getRiskStyle(score);
          return (
            <DayPill
              key={date}
              date={date}
              isFirst={i === 0}
              isActive={selDay === i}
              riskScore={score}
              riskStyle={rs}
              onClick={() => setSelDay(i)}
            />
          );
        })}
      </div>

      {currentDayHours.length > 0 && (
        <SummaryRow hours={currentDayHours} thresh={thresh} />
      )}

      {currentDayHours.length === 0 ? (
        <div className="empty">No operating hours found for this day.</div>
      ) : (
        <div className="hr-list">
          {currentDayHours.map((h, i) => (
            <HourRow key={i} hour={h} thresh={thresh} />
          ))}
        </div>
      )}
    </div>
  );
}
