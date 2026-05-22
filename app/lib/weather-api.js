// Network calls + the transform that turns raw API responses into the
// per-hour shape the UI uses.
//
// Open-Meteo defaults: temperature in °C, wind in km/h, precip in mm,
// visibility in meters. We ask the API to return wind in mph directly
// (via wind_speed_unit) to avoid unit-confusion bugs. We also pull
// daily sunrise/sunset so each hour can be tagged isDaylight.

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

// Autocomplete: returns up to 5 location suggestions for a partial query.
// Used by the live search-as-you-type dropdown on SetupView.
export const geoSuggest = async q => {
  if (!q || q.trim().length < 2) return [];
  try {
    const r = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=5&language=en&format=json`
    );
    const d = await r.json();
    return d.results || [];
  } catch {
    return [];
  }
};

// 5-day hourly forecast for the given coordinates and timezone.
export const getWx = async (lat, lon, tz) => {
  const p = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    timezone: tz,
    forecast_days: 5,
    wind_speed_unit: "mph",
    daily: "sunrise,sunset",
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
      "winddirection_10m",
      "visibility",
      "uv_index",
    ].join(","),
  });
  const r = await fetch(`https://api.open-meteo.com/v1/forecast?${p}`);
  if (!r.ok) throw new Error("Weather data unavailable.");
  return r.json();
};

// US AQI hourly series. Best-effort.
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
  // Build a date → {sunrise, sunset} map from the daily series so each
  // hour can know whether it falls in daylight.
  const sunByDate = {};
  if (wx.daily?.time?.length) {
    wx.daily.time.forEach((dateStr, i) => {
      const sunrise = wx.daily.sunrise?.[i];
      const sunset = wx.daily.sunset?.[i];
      sunByDate[dateStr] = {
        sunrise: sunrise ? new Date(sunrise).getTime() : null,
        sunset: sunset ? new Date(sunset).getTime() : null,
      };
    });
  }

  const hours = wx.hourly.time.map((t, i) => {
    const tF = cToF(wx.hourly.temperature_2m[i]);
    const rh = wx.hourly.relative_humidity_2m[i];
    const wMph = wx.hourly.windspeed_10m[i];
    const gMph = wx.hourly.windgusts_10m[i];
    const sustained = Math.round(wMph);
    const gusts = Math.round(gMph);
    // Effective wind = whichever is higher. windIsGust flags the case
    // where gust > sustained so the UI can append a small "g".
    const effective = Math.max(gMph || 0, wMph);
    const dateStr = t.split("T")[0];
    const hourEpoch = new Date(t).getTime();
    const sun = sunByDate[dateStr];
    const isDaylight = sun?.sunrise != null && sun?.sunset != null
      ? hourEpoch >= sun.sunrise && hourEpoch < sun.sunset
      : true; // fallback: treat as daylight if data missing
    const wx2 = wxIcon(wx.hourly.weathercode[i]);
    // At night, the bare-sun "Clear" emoji becomes a moon. Other weather
    // emojis (cloud, rain, fog, etc.) read the same at night.
    const icon = !isDaylight && wx2.label === "Clear" ? "🌙" : wx2.icon;

    return {
      time: t,
      hour: new Date(t).getHours(),
      date: dateStr,
      tempF: Math.round(tF),
      feelsLike: Math.round(cToF(wx.hourly.apparent_temperature[i])),
      windChill: Math.round(calcWC(tF, wMph)),
      windSpeed: Math.round(effective),
      windGusts: gusts,
      windSustained: sustained,
      windIsGust: gusts > sustained,
      windDir: wx.hourly.winddirection_10m?.[i] ?? null,
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
      icon,
      condition: wx2.label,
      isDaylight,
    };
  });

  const days = {};
  hours.forEach(h => {
    if (!days[h.date]) days[h.date] = [];
    days[h.date].push(h);
  });
  return { days: Object.entries(days).slice(0, 5), loc };
};
