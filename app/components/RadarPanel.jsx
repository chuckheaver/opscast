// Embedded live radar (RainViewer) + links to external full-feature radars.
// Owns its own expand/collapse state.

import { useState } from "react";

export default function RadarPanel({ loc }) {
  const [expanded, setExpanded] = useState(true);
  const radarSrc = `https://www.rainviewer.com/map.html?loc=${loc.latitude},${loc.longitude},9&oFa=0&oC=0&oU=0&oCS=1&oF=0&oAP=1&rmt=4&refmt=1&palmt=0&c=3`;

  return (
    <div className="radar-panel">
      <div className="radar-hdr" onClick={() => setExpanded(v => !v)}>
        <div className="radar-title">
          📡 Live Radar
          <span className="radar-live">
            <span className="radar-pulse" />
            LIVE
          </span>
        </div>
        <span className="radar-toggle">
          {expanded ? "▲ Hide" : "▼ Show"} Radar
        </span>
      </div>
      {expanded && (
        <div className="radar-body">
          <iframe
            title="Live Weather Radar"
            src={radarSrc}
            allowFullScreen
          />
          <div className="radar-links">
            <a
              className="radar-link"
              href={`https://radar.weather.gov/?station=&type=N0R&lat=${loc.latitude}&lon=${loc.longitude}`}
              target="_blank"
              rel="noreferrer"
            >
              🔗 NWS Radar
            </a>
            <a
              className="radar-link"
              href={`https://www.wunderground.com/wundermap?lat=${loc.latitude}&lon=${loc.longitude}&zoom=8`}
              target="_blank"
              rel="noreferrer"
            >
              🔗 Weather Underground
            </a>
            <a
              className="radar-link"
              href={`https://forecast.weather.gov/MapClick.php?lat=${loc.latitude}&lon=${loc.longitude}`}
              target="_blank"
              rel="noreferrer"
            >
              🔗 NWS Full Forecast
            </a>
            <a
              className="radar-link"
              href="https://earthquake.usgs.gov/earthquakes/map/?extent=17.85329,-127.35352&extent=54.44449,-62.66602"
              target="_blank"
              rel="noreferrer"
            >
              🔗 Shake Map
            </a>
            <a
              className="radar-link"
              href="https://www.nhc.noaa.gov"
              target="_blank"
              rel="noreferrer"
            >
              🔗 Hurricanes
            </a>
            <a
              className="radar-link"
              href="https://www.spc.noaa.gov/products/outlook/day1otlk.html"
              target="_blank"
              rel="noreferrer"
            >
              🔗 Severe Weather
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
