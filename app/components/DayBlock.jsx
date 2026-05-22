// One full day's content: header, Cockpit, the "Hours on Alert"
// summary (HourTimeline), and the collapsible-but-can-be-opened-from-
// above DetailGrid. Past hours (today only) are flagged with isPast
// so children can render them as "-".

import { useState } from "react";
import Cockpit from "./Cockpit";
import HourTimeline from "./HourTimeline";
import DetailGrid from "./DetailGrid";
import { dayLabel, fmtHrFull } from "../lib/formatting";

// Today's local date string ("YYYY-MM-DD") and current hour.
const getNowInfo = () => {
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  return { todayStr, currentHour: now.getHours() };
};

export default function DayBlock({
  dayIndex,
  date,
  hours,
  thresh,
  startH,
  endH,
}) {
  const { todayStr, currentHour } = getNowInfo();
  const isToday = date === todayStr;
  // Open state for the DetailGrid lives here so the "Hours on Alert"
  // summary above can pop it open when a metric name is clicked.
  const [detailOpen, setDetailOpen] = useState(false);

  // Decorate hours with isPast (today only).
  const decorated = hours.map(h => ({
    ...h,
    isPast: isToday && h.hour < currentHour,
  }));

  return (
    <div className="day-block">
      <div className="day-hdr">
        <div>
          <div className="day-label">{dayLabel(dayIndex, date)}</div>
          <div className="day-date">
            {fmtHrFull(startH)} – {fmtHrFull(endH)}
          </div>
        </div>
      </div>

      {decorated.length === 0 ? (
        <div className="no-hrs">No operating hours for this day.</div>
      ) : (
        <>
          <Cockpit hours={decorated} thresh={thresh} />
          <HourTimeline
            hours={decorated}
            thresh={thresh}
            onOpenDetail={() => setDetailOpen(true)}
          />
          <DetailGrid
            hours={decorated}
            thresh={thresh}
            open={detailOpen}
            setOpen={setDetailOpen}
          />
        </>
      )}
    </div>
  );
}
