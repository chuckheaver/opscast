// One full day's content: bold header with status badge, then Cockpit,
// HourTimeline, ActionPanel, DetailGrid (or an empty state when no hours
// fall within the operating window).

import Cockpit from "./Cockpit";
import HourTimeline from "./HourTimeline";
import ActionPanel from "./ActionPanel";
import DetailGrid from "./DetailGrid";
import { STATUS } from "../lib/colors";
import { generateActions } from "../lib/actions";
import { DAY_LABELS, fmtDs, fmtHrFull } from "../lib/formatting";

export default function DayBlock({
  dayIndex,
  date,
  hours,
  thresh,
  startH,
  endH,
}) {
  const actions = generateActions(hours, thresh);
  const alertCount = actions.filter(a => a.status === "alert").length;
  const cautionCount = actions.filter(a => a.status === "caution").length;
  const badgeStatus =
    alertCount > 0 ? "alert" : cautionCount > 0 ? "caution" : "clear";
  const badge = STATUS[badgeStatus];

  const badgeText =
    alertCount > 0
      ? `${alertCount} Alert${alertCount > 1 ? "s" : ""}`
      : cautionCount > 0
      ? `${actions.length} Caution${actions.length > 1 ? "s" : ""}`
      : badge.label;

  return (
    <div className="day-block">
      <div className="day-hdr">
        <div>
          <div className="day-label">
            {DAY_LABELS[dayIndex]} — {fmtDs(date)}
          </div>
          <div className="day-date">
            {fmtHrFull(startH)} – {fmtHrFull(endH)}
          </div>
        </div>
        <span
          className="day-badge"
          style={{ background: badge.bg, color: badge.text }}
        >
          {badgeText}
        </span>
      </div>

      {hours.length === 0 ? (
        <div className="no-hrs">No operating hours for this day.</div>
      ) : (
        <>
          <Cockpit hours={hours} thresh={thresh} />
          <HourTimeline hours={hours} thresh={thresh} />
          <ActionPanel actions={actions} />
          <DetailGrid hours={hours} thresh={thresh} />
        </>
      )}
    </div>
  );
}
