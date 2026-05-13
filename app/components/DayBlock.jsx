// One full day's content: bold header with status badge, then Cockpit,
// HourTimeline, ActionPanel, DetailGrid (or an empty state when no hours
// fall within the operating window).

import Cockpit from "./Cockpit";
import HourTimeline from "./HourTimeline";
import ActionPanel from "./ActionPanel";
import DetailGrid from "./DetailGrid";
import { STATUS, hourWorstStatus } from "../lib/colors";
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

  // Day status = worst hour-level status across the day (excludes Sky Cover,
  // per hourWorstStatus). This catches caution-tier metrics even when no
  // hard alert action is generated.
  const dayWorst = hours.reduce((worst, h) => {
    const hw = hourWorstStatus(h, thresh);
    if (hw === "alert") return "alert";
    if (hw === "caution" && worst !== "alert") return "caution";
    return worst;
  }, "clear");
  const badge = STATUS[dayWorst];

  const alertCount = actions.length;
  const badgeText =
    dayWorst === "alert"
      ? alertCount > 0
        ? `${alertCount} Alert${alertCount > 1 ? "s" : ""}`
        : "Alert"
      : dayWorst === "caution"
      ? "Caution"
      : "Clear";

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
