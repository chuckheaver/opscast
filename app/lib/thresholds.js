// Metric definitions and default thresholds.
//
// PRIMARY = the 5 headline metrics shown as big cards on the setup view.
// ADVANCED = additional metrics in the collapsible "Advanced" section.
// Each entry: { key, label, [icon], unit, sMin, sMax, step, dMin, dMax, buf,
//               [desc], [excluded] }
//   sMin/sMax = slider track endpoints
//   dMin/dMax = default min/max ideal range
//   buf       = how far outside [min,max] still counts as "caution" before
//               escalating to "alert"
//   excluded  = (advanced only) starts excluded from the forecast by default

export const PRIMARY = [
  { key: "feelsLike",  label: "Feels Like Temp",        icon: "🌡️", unit: "°F",  sMin: -20, sMax: 115, step: 1, dMin: 55, dMax: 88, buf: 5,  desc: "How temperature feels on skin" },
  { key: "windSpeed",  label: "Wind Speed incl. Gusts", icon: "💨", unit: "mph", sMin: 0,   sMax: 70,  step: 1, dMin: 0,  dMax: 20, buf: 5,  desc: "Strongest wind — gust value when available, else sustained" },
  { key: "precipProb", label: "Precip Probability",     icon: "🌧️", unit: "%",   sMin: 0,   sMax: 100, step: 5, dMin: 0,  dMax: 40, buf: 15, desc: "Chance of measurable precipitation" },
  { key: "cloudCover", label: "Sky Cover",              icon: "☁️", unit: "%",   sMin: 0,   sMax: 100, step: 5, dMin: 0,  dMax: 60, buf: 15, desc: "Percentage of sky covered by clouds" },
  { key: "uvIndex",    label: "UV Index",               icon: "☀️", unit: "",    sMin: 0,   sMax: 11,  step: 1, dMin: 0,  dMax: 6,  buf: 2,  desc: "Solar UV radiation intensity (0–11+)" },
];

// Note: heatIndex and windGusts intentionally removed.
// - heatIndex: redundant with feelsLike (apparent_temperature already factors in heat index logic)
// - windGusts: rolled into the primary windSpeed metric (effective wind = max of gust, sustained)
//
// `binaryStatus: true` means the metric has no caution (yellow) band — it
// goes straight from clear → alert when crossing the threshold.
export const ADVANCED = [
  { key: "tempF",       label: "Air Temperature",   unit: "°F",  sMin: -20, sMax: 115, step: 1,    dMin: 50, dMax: 90,   buf: 5,   excluded: false },
  { key: "precipAccum", label: "Rain Accumulation", unit: "in",  sMin: 0,   sMax: 2,   step: 0.05, dMin: 0,  dMax: 0.25, buf: 0.1, excluded: false, binaryStatus: true },
  { key: "humidity",    label: "Humidity",          unit: "%",   sMin: 0,   sMax: 100, step: 5,    dMin: 0,  dMax: 75,   buf: 10,  excluded: true  },
  { key: "dewPoint",    label: "Dew Point",         unit: "°F",  sMin: 20,  sMax: 80,  step: 1,    dMin: 20, dMax: 65,   buf: 5,   excluded: true  },
  { key: "visibility",  label: "Visibility",        unit: "mi",  sMin: 0.1, sMax: 10,  step: 0.1,  dMin: 1,  dMax: 10,   buf: 0.5, excluded: true,  binaryStatus: true },
  { key: "aqi",         label: "Air Quality (AQI)", unit: "",    sMin: 0,   sMax: 300, step: 10,   dMin: 0,  dMax: 100,  buf: 50,  excluded: true,  binaryStatus: true },
];

// Convenience: all metrics in one array (primary first, then advanced).
export const ALL = [...PRIMARY, ...ADVANCED];

// Build the initial thresh state: { [key]: {min, max, excluded} }
export const buildDefaults = () => {
  const t = {};
  ALL.forEach(m => {
    t[m.key] = { min: m.dMin, max: m.dMax, excluded: m.excluded ?? false };
  });
  return t;
};
