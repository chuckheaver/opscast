// Network calls (Open-Meteo geocoding, forecast, air quality) plus the
// transform that turns raw API responses into the per-hour shape the UI uses.

import { cToF, mpsToMph, kmToMi, calcHI, calcWC, wxIcon } from "./calculations";

// Resolve a free-text query (ZIP, city, place name) to a location object
// with latitude/longitude/timezone/etc. Throws on no match.
export const geoCode = async q => {
  const r = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=1&language=en&format=json`
  );
  const d = await r.json();
  if (!d.results?.length) {
    throw new Error(`"${q}" not found. Try a city name or ZIP.`);
  }
  return d.results[0];
};

// 5-day hourly forecast for the given coordinates and timezone.
export const getWx = async (lat, lon, tz) => {
  const p = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    timezone: tz,
    forecast_days: 5,
    hourly: [
      "temperature_2m",
      "relative_humidity_2m",
      "dewpoint_2m",
      "precipitation_probability",
      "precipitation",
      "weathercode",
      "cloudcover",
      "windspeed_10m",
      "windgusts_10m",
      "visibility",
      "uv_index",
    ].join(","),
  });
  const r = await fetch(`https://api.open-meteo.com/v1/forecast?${p}`);
  if (!r.ok) throw new Error("Weather data unavailable. Please try again.");
  return r.json();
};

// US AQI hourly series. Best-effort — returns [] on any failure so the
// main forecast still renders without AQI data.
export const getAQ = async (lat, lon, tz) => {
  try {
    const r = await fetch(
      `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&timezone=${tz}&hourly=us_aqi&forecast_days=5`
    );
    const d = await r.json();
    return d.hourly?.us_aqi || [];
  } catch {
    return [];
  }
};

// Combine raw Open-Meteo weather + air-quality responses into the
// app's normalized per-hour shape, then group by date.
// Returns { days: [[dateStr, hours[]], ...], loc }, capped at 5 days.
export const buildForecast = (wx, aq, loc) => {
  const hours = wx.hourly.time.map((t, i) => {
    const tF = cToF(wx.hourly.temperature_2m[i]);
    const rh = wx.hourly.relative_humidity_2m[i];
    const wMph = mpsToMph(wx.hourly.windspeed_10m[i]);
    const gMph = mpsToMph(wx.hourly.windgusts_10m[i]);
    const code = wx.hourly.weathercode[i];
    const wx2 = wxIcon(code);
    const visKm = (wx.hourly.visibility[i] || 0) / 1000;
    return {
      time: t,
      hour: new Date(t).getHours(),
      date: t.split("T")[0],
      tempF: tF,
      heatIndex: calcHI(tF, rh),
      windChill: calcWC(tF, wMph),
      windSpeed: wMph,
      windGusts: gMph,
      precipProb: wx.hourly.precipitation_probability[i] || 0,
      precipAccum: (wx.hourly.precipitation[i] || 0) * 0.0393701,
      humidity: rh,
      dewPoint: cToF(wx.hourly.dewpoint_2m[i]),
      uvIndex: wx.hourly.uv_index[i] || 0,
      cloudCover: wx.hourly.cloudcover[i] || 0,
      visibility: Math.max(0.01, kmToMi(visKm)),
      aqi: aq[i] || 0,
      icon: wx2.icon,
      condition: wx2.label,
      thunder: wx2.thunder,
      hail: wx2.hail,
      thunderProb: wx2.thunder ? 90 : 0,
    };
  });

  const days = {};
  hours.forEach(h => {
    if (!days[h.date]) days[h.date] = [];
    days[h.date].push(h);
  });
  return { days: Object.entries(days).slice(0, 5), loc };
};
