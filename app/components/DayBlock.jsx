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
  onOpenSettings,
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
        {onOpenSettings && (
          <button
            type="button"
            className="gear-btn gear-btn-inline day-gear"
            onClick={onOpenSettings}
            aria-label="Settings"
            title="Adjust thresholds or time window"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#ea580c"
                d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm9.43 4.92l-2.05-1.16a7.6 7.6 0 0 0 0-2.52l2.05-1.16a.5.5 0 0 0 .2-.62l-1.94-3.36a.5.5 0 0 0-.6-.23l-2.4.84a7.5 7.5 0 0 0-2.18-1.26l-.36-2.53a.5.5 0 0 0-.5-.42h-3.88a.5.5 0 0 0-.5.42l-.36 2.53a7.5 7.5 0 0 0-2.18 1.26l-2.4-.84a.5.5 0 0 0-.6.23L2.32 7.96a.5.5 0 0 0 .2.62l2.05 1.16a7.6 7.6 0 0 0 0 2.52L2.52 13.42a.5.5 0 0 0-.2.62l1.94 3.36c.13.22.4.32.6.23l2.4-.84a7.5 7.5 0 0 0 2.18 1.26l.36 2.53c.04.24.25.42.5.42h3.88a.5.5 0 0 0 .5-.42l.36-2.53a7.5 7.5 0 0 0 2.18-1.26l2.4.84a.5.5 0 0 0 .6-.23l1.94-3.36a.5.5 0 0 0-.2-.62z"
              />
            </svg>
          </button>
        )}
      </div>

      {decorated.length === 0 ? (
        <div className="timeline-wrap">
          <div className="timeline-label">Forecast</div>
          <div className="alert-empty">No data for selected period.</div>
        </div>
      ) : (
        <>
          <Cockpit
            hours={decorated}
            thresh={thresh}
            onOpenDetail={() => setDetailOpen(true)}
          />
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
