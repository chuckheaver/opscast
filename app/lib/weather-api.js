// Network calls + the transform that turns raw API responses into the
// per-hour shape the UI uses.
//
// Open-Meteo defaults: temperature in °C, wind in km/h, precip in mm,
// visibility in meters. We ask the API to return wind in mph directly
// (via wind_speed_unit) to avoid a unit-confusion class of bug. The
// other conversions still happen in-app (cToF, kmToMi).

import { cToF, kmToMi, calcWC, wxIcon } from "./calculations";

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
// Includes apparent_temperature (drives feelsLike).
export const getWx = async (lat, lon, tz) => {
  const p = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    timezone: tz,
    forecast_days: 5,
    // Ask the API to return wind speeds in mph so we don't have to
    // convert (and so we can't mix up km/h vs m/s).
    wind_speed_unit: "mph",
    hourly: [
      "temperature_2m",
      "relative_humidity_2m",
      "dewpoint_2m",
      "apparent_temperature",
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
  if (!r.ok) throw new Error("Weather data unavailable.");
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
export const buildFcData = (wx, aq, loc) => {
  const hours = wx.hourly.time.map((t, i) => {
    const tF = cToF(wx.hourly.temperature_2m[i]);
    const rh = wx.hourly.relative_humidity_2m[i];
    // wind comes back already in mph (see wind_speed_unit param in getWx)
    const wMph = wx.hourly.windspeed_10m[i];
    const gMph = wx.hourly.windgusts_10m[i];
    // "Effective wind" — use gust value when available and higher; fall
    // back to sustained wind otherwise. This is what threshold checks
    // and KPIs read via `windSpeed`. Keep the raw values around too for
    // display purposes (sustained shown as context).
    const windEffective = Math.max(gMph || 0, wMph);
    const wx2 = wxIcon(wx.hourly.weathercode[i]);
    return {
      time: t,
      hour: new Date(t).getHours(),
      date: t.split("T")[0],
      tempF: Math.round(tF),
      feelsLike: Math.round(cToF(wx.hourly.apparent_temperature[i])),
      windChill: Math.round(calcWC(tF, wMph)),
      windSpeed: Math.round(windEffective),
      windGusts: Math.round(gMph),
      windSustained: Math.round(wMph),
      precipProb: wx.hourly.precipitation_probability[i] || 0,
      precipAccum: parseFloat(
        ((wx.hourly.precipitation[i] || 0) * 0.0393701).toFixed(2)
      ),
      humidity: rh,
      dewPoint: Math.round(cToF(wx.hourly.dewpoint_2m[i])),
      uvIndex: wx.hourly.uv_index[i] || 0,
      cloudCover: wx.hourly.cloudcover[i] || 0,
      visibility: parseFloat(
        Math.max(0.01, kmToMi((wx.hourly.visibility[i] || 0) / 1000)).toFixed(1)
      ),
      aqi: aq[i] || 0,
      icon: wx2.icon,
      condition: wx2.label,
    };
  });
  const days = {};
  hours.forEach(h => {
    if (!days[h.date]) days[h.date] = [];
    days[h.date].push(h);
  });
  return { days: Object.entries(days).slice(0, 5), loc };
};
