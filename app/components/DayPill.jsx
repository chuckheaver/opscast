// One day's pill in the forecast day-strip (Today, Tue, Wed, …).
// Shows the day's max risk score and label.

import { fmtDate } from "../lib/formatting";

export default function DayPill({ date, isFirst, isActive, riskScore, riskStyle, onClick }) {
  const formatted = fmtDate(date);
  const [weekday, monthDay] = formatted.split(",");
  return (
    <div
      className={`day-pill ${isActive ? "on" : ""}`}
      onClick={onClick}
    >
      <div className="dp-n">{isFirst ? "Today" : weekday}</div>
      <div className="dp-d mono">{monthDay?.trim()}</div>
      <div className="dp-r mono" style={{ color: riskStyle.dot }}>
        {riskStyle.label} · {riskScore}/10
      </div>
    </div>
  );
}
