// The 4-KPI strip across the top of each DayBlock:
// Peak Feels Like · Max Wind · Max Precip Chance · Peak UV Index.
//
// Past hours (today only, marked h.isPast) are excluded from all
// peak/min calculations so the cockpit reflects what's still ahead.

import { STATUS, getStatus } from "../lib/colors";

const uvDescription = uv => {
  if (uv <= 2) return "Low";
  if (uv <= 5) return "Moderate";
  if (uv <= 7) return "High";
  if (uv <= 10) return "Very High";
  return "Extreme";
};

export default function Cockpit({ hours, thresh, onOpenDetail }) {
  // Future-only view of the day.
  const future = hours.filter(h => !h.isPast);

  // Clicking/Entering the KPI strip opens the Hourly Detail grid below,
  // matching the "Hours on Alert" card's behaviour.
  const handleKey = e => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOpenDetail?.();
    }
  };

  // If the entire window has already passed there's nothing to peak/min,
  // so swap the 4-tile cockpit for an empty-state card matching the
  // "Hours on Alert" styling below it.
  if (!future.length) {
    return (
      <div className="timeline-wrap">
        <div className="timeline-label">Forecast</div>
        <div className="alert-empty">No data for selected time period.</div>
      </div>
    );
  }

  const maxFeels = Math.max(...future.map(h => h.feelsLike));
  const minFeels = Math.min(...future.map(h => h.feelsLike));
  const maxWind = Math.max(...future.map(h => h.windSpeed));
  // Identify the hour that produced the peak wind, so we know if it was a gust.
  const peakWindHour = future.find(h => h.windSpeed === maxWind);
  const peakWindIsGust = !!peakWindHour?.windIsGust;
  const maxSustained = Math.max(...future.map(h => h.windSustained ?? h.windSpeed));
  const maxPrecip = Math.max(...future.map(h => h.precipProb));
  // UV maximum from daylight hours only.
  const daylightHours = future.filter(h => h.isDaylight);
  const maxUVRaw = daylightHours.length
    ? Math.max(...daylightHours.map(h => h.uvIndex))
    : null;
  const maxUV = maxUVRaw != null ? Math.round(maxUVRaw) : null;

  // Color the tile by the WORST status seen during the period — not just
  // the peak/max value. This catches the two-sided case (e.g. Feels Like
  // dipping below the ideal min even though the high stayed in range).
  // UV is daylight-only; nighttime hours are skipped so the tile doesn't
  // flash alert just because uvIndex is 0 at 6 AM.
  const worstStatus = key => {
    const pool = key === "uvIndex" ? daylightHours : future;
    let worst = "clear";
    for (const h of pool) {
      const v = h[key];
      if (v == null) continue;
      const s = getStatus(key, v, thresh);
      if (s === "alert") return "alert";
      if (s === "caution" && worst !== "alert") worst = "caution";
    }
    return worst;
  };

  const placeholder = { bg: "#EFEFEF", text: "#888", dot: "#CCC", label: "—" };
  const fS = STATUS[worstStatus("feelsLike")];
  const wS = STATUS[worstStatus("windSpeed")];
  const pS = STATUS[worstStatus("precipProb")];
  const uS = maxUV != null ? STATUS[worstStatus("uvIndex")] : placeholder;

  return (
    <div
      className="cockpit"
      role="button"
      tabIndex={0}
      onClick={onOpenDetail}
      onKeyDown={handleKey}
    >
      <div className="kpi" style={{ background: fS.bg }}>
        <div className="kpi-label" style={{ color: fS.text }}>
          Peak Feels Like
        </div>
        <div className="kpi-value" style={{ color: fS.text }}>
          {maxFeels}°F
        </div>
        <div className="kpi-sub" style={{ color: fS.text }}>
          <span className="kpi-dot" style={{ background: fS.dot }} />
          {fS.label} · Low {minFeels}°F
        </div>
      </div>
      <div className="kpi" style={{ background: wS.bg }}>
        <div className="kpi-label" style={{ color: wS.text }}>
          Max Wind
        </div>
        <div className="kpi-value" style={{ color: wS.text }}>
          {maxWind}
          <span style={{ fontSize: 16, fontWeight: 400 }}>
            {" "}mph{peakWindIsGust ? "g" : ""}
          </span>
        </div>
        <div className="kpi-sub" style={{ color: wS.text }}>
          <span className="kpi-dot" style={{ background: wS.dot }} />
          {wS.label} · Sustained {maxSustained} mph
        </div>
      </div>
      <div className="kpi" style={{ background: pS.bg }}>
        <div className="kpi-label" style={{ color: pS.text }}>
          Max Precip Chance
        </div>
        <div className="kpi-value" style={{ color: pS.text }}>
          {maxPrecip}
          <span style={{ fontSize: 16, fontWeight: 400 }}>%</span>
        </div>
        <div className="kpi-sub" style={{ color: pS.text }}>
          <span className="kpi-dot" style={{ background: pS.dot }} />
          {pS.label}
        </div>
      </div>
      <div className="kpi" style={{ background: uS.bg }}>
        <div className="kpi-label" style={{ color: uS.text }}>
          Peak UV Index
        </div>
        <div className="kpi-value" style={{ color: uS.text }}>
          {maxUV ?? "-"}
        </div>
        <div className="kpi-sub" style={{ color: uS.text }}>
          <span className="kpi-dot" style={{ background: uS.dot }} />
          {maxUV != null ? uvDescription(maxUV) : "After sunset"}
        </div>
      </div>
    </div>
  );
}
