'use client';

// Live San Francisco conditions in the hero, linking to the forecast page —
// the visible tie between the weather half of this practice and the real
// estate half.
//
// Open-Meteo, no key, one small request. If it fails for any reason the chip
// still renders and still links to /weather; it just says "Forecast" instead
// of a temperature. It must never be the reason the hero looks broken.

import { useEffect, useState } from "react";
import Link from "next/link";

const SF = { lat: 37.7749, lon: -122.4194, tz: "America/Los_Angeles" };

// WMO weather codes, grouped to the handful of states that actually matter
// here. Fog gets its own entry because in this city it is the whole point.
function describe(code) {
  if (code == null) return null;
  if (code === 0) return { label: "Clear", icon: "sun" };
  if (code <= 2) return { label: "Partly cloudy", icon: "part" };
  if (code === 3) return { label: "Overcast", icon: "cloud" };
  if (code <= 48) return { label: "Fog", icon: "fog" };
  if (code <= 57) return { label: "Drizzle", icon: "rain" };
  if (code <= 67) return { label: "Rain", icon: "rain" };
  if (code <= 77) return { label: "Snow", icon: "snow" };
  if (code <= 82) return { label: "Showers", icon: "rain" };
  if (code <= 86) return { label: "Snow showers", icon: "snow" };
  return { label: "Storms", icon: "storm" };
}

const Icon = ({ kind }) => {
  const s = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };
  return (
    <svg className="wx-icon" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      {kind === "sun" && <><circle cx="12" cy="12" r="4.2" {...s} /><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.2 5.2l1.4 1.4M17.4 17.4l1.4 1.4M18.8 5.2l-1.4 1.4M6.6 17.4l-1.4 1.4" {...s} /></>}
      {kind === "part" && <><circle cx="8.5" cy="8.5" r="3.2" {...s} /><path d="M8.5 1.8v1.6M1.8 8.5h1.6M3.9 3.9l1.1 1.1M13.1 3.9 12 5" {...s} /><path d="M17 20H8.4a3.9 3.9 0 0 1 0-7.8 5 5 0 0 1 9.4 1.2A3.3 3.3 0 0 1 17 20Z" {...s} /></>}
      {kind === "cloud" && <path d="M17 19H8.4a3.9 3.9 0 0 1 0-7.8 5 5 0 0 1 9.4 1.2A3.3 3.3 0 0 1 17 19Z" {...s} />}
      {kind === "fog" && <><path d="M17 14H8.4a3.9 3.9 0 0 1 0-7.8 5 5 0 0 1 9.4 1.2A3.3 3.3 0 0 1 17 14Z" {...s} /><path d="M4 17.5h16M6.5 20.5h11" {...s} /></>}
      {kind === "rain" && <><path d="M17 15H8.4a3.9 3.9 0 0 1 0-7.8 5 5 0 0 1 9.4 1.2A3.3 3.3 0 0 1 17 15Z" {...s} /><path d="M9 18l-1 2.5M13 18l-1 2.5M17 18l-1 2.5" {...s} /></>}
      {kind === "snow" && <><path d="M17 15H8.4a3.9 3.9 0 0 1 0-7.8 5 5 0 0 1 9.4 1.2A3.3 3.3 0 0 1 17 15Z" {...s} /><path d="M9 19h.01M13 19h.01M11 21.5h.01M15 21.5h.01" {...s} /></>}
      {kind === "storm" && <><path d="M17 14H8.4a3.9 3.9 0 0 1 0-7.8 5 5 0 0 1 9.4 1.2A3.3 3.3 0 0 1 17 14Z" {...s} /><path d="m12.5 16-2.5 4h3l-2 3.5" {...s} /></>}
    </svg>
  );
};

export default function WeatherChip() {
  const [wx, setWx] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const url =
      "https://api.open-meteo.com/v1/forecast" +
      `?latitude=${SF.lat}&longitude=${SF.lon}` +
      "&current=temperature_2m,weather_code&temperature_unit=fahrenheit" +
      `&timezone=${encodeURIComponent(SF.tz)}`;
    fetch(url)
      .then(r => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then(d => {
        if (cancelled) return;
        const t = Number(d?.current?.temperature_2m);
        const c = describe(d?.current?.weather_code);
        if (Number.isFinite(t) && c) setWx({ temp: Math.round(t), ...c });
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  return (
    <Link className="wx-chip" href="/weather" title="San Francisco forecast">
      <Icon kind={wx?.icon || "part"} />
      {wx ? (
        <span className="wx-text">
          <b>{wx.temp}&deg;</b>
          <span>{wx.label} · SF</span>
        </span>
      ) : (
        <span className="wx-text"><b>Forecast</b><span>San Francisco</span></span>
      )}
    </Link>
  );
}
