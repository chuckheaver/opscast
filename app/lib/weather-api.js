// Network calls + the transform that turns raw API responses into the
// per-hour shape the UI uses.
//
// Open-Meteo defaults: temperature in °C, wind in km/h, precip in mm,
// visibility in meters. We ask the API to return wind in mph directly
// (via wind_speed_unit) to avoid unit-confusion bugs. We also pull
// daily sunrise/sunset so each hour can be tagged isDaylight.

import { cToF, kmToMi, calcWC, wxIcon } from "./calculations";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

// Sentinel error string used by SetupView to render the "data source
// updating" notice box directly under the location field, instead of
// the generic error row at the bottom of the form.
export const DATA_SOURCE_DOWN_MSG = "Data Source Updating. Check Back Later.";

// Pull a parent context entry (place = city, region = state, etc.) out
// of a Mapbox feature by its id prefix.
const ctx = (f, prefix) =>
  (f.context || []).find(x => (x.id || "").startsWith(prefix));

// Two-letter state code from a feature's region context ("US-CA" → "CA").
const stateAbbr = f => {
  const r = ctx(f, "region");
  if (r?.short_code) return r.short_code.replace(/^US-/i, "").toUpperCase();
  return r?.text || "";
};

// City name from a feature's place/locality context.
const cityName = f => ctx(f, "place")?.text || ctx(f, "locality")?.text || "";

// Human label tuned per place type:
//   address   → "123 Main St, San Francisco, CA"
//   postcode  → "San Francisco, CA"
//   place     → "San Francisco, CA"
//   other     → "<text>, San Francisco, CA"
const labelFor = f => {
  const type = f.place_type?.[0];
  const city = cityName(f);
  const st = stateAbbr(f);
  if (type === "address") {
    const street = [f.address, f.text].filter(Boolean).join(" ");
    return [street, city, st].filter(Boolean).join(", ");
  }
  if (type === "postcode" || type === "place" || type === "locality") {
    const head = type === "postcode" ? city : f.text;
    return [head, st].filter(Boolean).join(", ");
  }
  return [f.text, city, st].filter(Boolean).join(", ") || f.place_name;
};

// Turn a Mapbox geocoding feature into a location object usable by
// every page. Carries both the main-page shape (name/latitude/
// longitude/timezone) and the /fog shape (id/text/center) so a single
// geocoder can drive both. `label` is the formatted display string the
// location field shows once a suggestion is chosen. Mapbox has no
// timezone → "auto" lets the Open-Meteo forecast endpoint infer it.
const fromMapbox = f => {
  const label = labelFor(f);
  return {
    id: f.id,
    name: label,
    label,
    text: f.text,
    place_name: f.place_name,
    admin1: [cityName(f), stateAbbr(f)].filter(Boolean).join(", "),
    country: "",
    center: f.center, // [lng, lat]
    latitude: f.center[1],
    longitude: f.center[0],
    timezone: "auto",
  };
};

// "&proximity=lng,lat" when a usable bias point is supplied, else "".
const proximityParam = p =>
  Array.isArray(p) && Number.isFinite(p[0]) && Number.isFinite(p[1])
    ? `&proximity=${p[0]},${p[1]}`
    : "";

// Resolve a free-text query (street address, ZIP, city, POI) to a
// single location object. Prefers Mapbox (handles street addresses);
// falls back to Open-Meteo (city/ZIP only) when no Mapbox token.
// `proximity` ([lng, lat]) biases results toward the user's location.
export const geoCode = async (q, proximity) => {
  if (MAPBOX_TOKEN) {
    try {
      const url =
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(q)}.json` +
        `?access_token=${MAPBOX_TOKEN}&country=us&types=address,postcode,place,locality,neighborhood,poi&limit=1` +
        proximityParam(proximity);
      const r = await fetch(url);
      if (r.ok) {
        const d = await r.json();
        if (d.features?.length) return fromMapbox(d.features[0]);
      }
    } catch {}
  }
  try {
    const r = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=1&language=en&format=json`
    );
    const d = await r.json();
    if (!d.results?.length) {
      throw new Error(`"${q}" not found. Try an address, city, or ZIP.`);
    }
    return d.results[0];
  } catch (e) {
    if (/load failed|failed to fetch|networkerror/i.test(e?.message || "")) {
      throw new Error(DATA_SOURCE_DOWN_MSG);
    }
    throw e;
  }
};

// Autocomplete: up to 5 suggestions for a partial query. Mapbox first
// (street-address aware), Open-Meteo as a graceful fallback.
// `proximity` ([lng, lat]) surfaces the closest matching addresses first.
export const geoSuggest = async (q, proximity) => {
  if (!q || q.trim().length < 2) return [];
  if (MAPBOX_TOKEN) {
    try {
      const url =
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(q)}.json` +
        `?access_token=${MAPBOX_TOKEN}&autocomplete=true&country=us&types=address,postcode,place,locality,neighborhood,poi&limit=5` +
        proximityParam(proximity);
      const r = await fetch(url);
      if (r.ok) {
        const d = await r.json();
        if (d.features?.length) return d.features.map(fromMapbox);
      }
    } catch {}
  }
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

// Reverse-geocode a point to a "City, ST" label (for the 📍 pin button).
// Falls back to "Your Location" when Mapbox is unavailable or empty.
export const reverseCityState = async ([lng, lat]) => {
  if (MAPBOX_TOKEN) {
    try {
      const url =
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json` +
        `?access_token=${MAPBOX_TOKEN}&country=us&types=place,locality,postcode&limit=1`;
      const r = await fetch(url);
      if (r.ok) {
        const d = await r.json();
        if (d.features?.length) {
          const lbl = labelFor(d.features[0]);
          if (lbl) return lbl;
        }
      }
    } catch {}
  }
  return "Your Location";
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
  // Single retry with a 500 ms back-off — Open-Meteo occasionally times
  // out on the first hit from a cold CDN edge, and Safari surfaces those
  // failures as a cryptic "Load failed" TypeError. Two attempts is enough
  // to absorb that without making the user wait around.
  const url = `https://api.open-meteo.com/v1/forecast?${p}`;
  let lastErr;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const r = await fetch(url);
      if (!r.ok) {
        throw new Error(`Weather service returned ${r.status}.`);
      }
      return await r.json();
    } catch (e) {
      lastErr = e;
      if (attempt === 0) await new Promise(res => setTimeout(res, 500));
    }
  }
  // Translate "Load failed" / "Failed to fetch" into something a user
  // can actually act on.
  const friendly =
    /load failed|failed to fetch|networkerror/i.test(lastErr?.message || "")
      ? DATA_SOURCE_DOWN_MSG
      : lastErr?.message || "Weather data unavailable.";
  throw new Error(friendly);
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
      uvIndex: Math.round(wx.hourly.uv_index[i] || 0),
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
