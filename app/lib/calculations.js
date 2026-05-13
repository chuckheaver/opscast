// Unit conversions and derived-weather formulas used across the app.
// Pure functions — no side effects, safe to import anywhere.

export const cToF = c => (c * 9) / 5 + 32;
export const kmToMi = k => k * 0.621371;

// NOAA heat index (Rothfusz regression). Only meaningful at temps >= 80°F.
export const calcHI = (f, rh) => {
  if (f < 80) return f;
  return (
    -42.379 +
    2.04901523 * f +
    10.14333127 * rh -
    0.22475541 * f * rh -
    0.00683783 * f * f -
    0.05391553 * rh * rh +
    0.00122874 * f * f * rh +
    0.00085282 * f * rh * rh -
    0.00000199 * f * f * rh * rh
  );
};

// NWS wind chill. Only meaningful at temps <= 50°F and wind >= 3 mph.
export const calcWC = (f, mph) => {
  if (f > 50 || mph < 3) return f;
  return (
    35.74 +
    0.6215 * f -
    35.75 * Math.pow(mph, 0.16) +
    0.4275 * f * Math.pow(mph, 0.16)
  );
};

// Maps an Open-Meteo WMO weather code to an emoji icon + short label.
export const wxIcon = code => {
  if (code === 0)   return { icon: "☀️",  label: "Clear" };
  if (code <= 3)    return { icon: "⛅",  label: "Cloudy" };
  if (code <= 48)   return { icon: "🌫️", label: "Fog" };
  if (code <= 57)   return { icon: "🌦️", label: "Drizzle" };
  if (code <= 67)   return { icon: "🌧️", label: "Rain" };
  if (code <= 77)   return { icon: "❄️",  label: "Snow" };
  if (code <= 82)   return { icon: "🌧️", label: "Showers" };
  if (code <= 86)   return { icon: "🌨️", label: "Snow" };
  if (code === 95)  return { icon: "⛈️",  label: "Thunder" };
  return              { icon: "🌩️", label: "Hail" };
};
