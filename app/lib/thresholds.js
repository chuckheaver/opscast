// Metric definitions and default thresholds.
//
// PRIMARY = the 5 headline metrics shown as big cards on the setup view.
// ADVANCED = additional metrics in the collapsible "Advanced" section.
// Each entry: { key, label, [icon], unit, sMin, sMax, step, dMin, dMax, buf,
//               [desc], [binaryStatus] }
//   sMin/sMax     = slider track endpoints
//   dMin/dMax     = default min/max ideal range
//   buf           = caution-band width (currently unused; uniform 2 in colors.js)
//   binaryStatus  = if true, metric skips the caution band (clear → alert)

export const PRIMARY = [
  { key: "feelsLike",  label: "Feels Like Temp",        icon: "🌡️", unit: "°F",  sMin: -20, sMax: 115, step: 1, dMin: 60, dMax: 80, buf: 5,  desc: "How temperature feels on skin" },
  { key: "windSpeed",  label: "Wind/Gusts",             icon: "💨", unit: "mph", sMin: 0,   sMax: 70,  step: 1, dMin: 0,  dMax: 15, buf: 5,  desc: "Strongest wind — gust value when available, else sustained" },
  { key: "precipProb", label: "Precip Chance",          icon: "🌧️", unit: "%",   sMin: 0,   sMax: 100, step: 5, dMin: 0,  dMax: 40, buf: 15, desc: "Chance of measurable precipitation" },
  { key: "cloudCover", label: "Sky Cover",              icon: "☁️", unit: "%",   sMin: 0,   sMax: 100, step: 5, dMin: 0,  dMax: 50, buf: 15, desc: "Percentage of sky covered by clouds" },
  { key: "uvIndex",    label: "UV Index",               icon: "☀️", unit: "",    sMin: 0,   sMax: 11,  step: 1, dMin: 0,  dMax: 8,  buf: 2,  desc: "Solar UV radiation intensity (0–11+)" },
];

// All metrics are always-on now (no exclude toggle in v2.1+).
// precipAccum / visibility / aqi use binaryStatus (clear → alert, no caution
// band) because their natural scales make a 2-unit buffer awkward.
export const ADVANCED = [
  { key: "tempF",       label: "Air Temperature",   unit: "°F",  sMin: -20, sMax: 115, step: 1,    dMin: 50, dMax: 90,   buf: 5  },
  { key: "precipAccum", label: "Precip Amt",        unit: "in",  sMin: 0,   sMax: 2,   step: 0.05, dMin: 0,  dMax: 0.25, buf: 0.1, binaryStatus: true },
  { key: "humidity",    label: "Humidity",          unit: "%",   sMin: 0,   sMax: 100, step: 5,    dMin: 0,  dMax: 75,   buf: 10 },
  { key: "dewPoint",    label: "Dew Point",         unit: "°F",  sMin: 20,  sMax: 80,  step: 1,    dMin: 20, dMax: 65,   buf: 5  },
  // Visibility status is driven by fixed buckets (see getStatus in colors.js),
  // not by the slider range. Slider still shown for future tuning.
  { key: "visibility",  label: "Visibility",        unit: "mi",  sMin: 0.1, sMax: 20,  step: 0.1,  dMin: 7,  dMax: 20,   buf: 0.5 },
  { key: "aqi",         label: "Air Quality (AQI)", unit: "",    sMin: 0,   sMax: 300, step: 10,   dMin: 0,  dMax: 100,  buf: 50,  binaryStatus: true },
];

// Convenience: all metrics in one array (primary first, then advanced).
export const ALL = [...PRIMARY, ...ADVANCED];

// Build the initial thresh state: { [key]: {min, max} }
export const buildDefaults = () => {
  const t = {};
  ALL.forEach(m => {
    t[m.key] = { min: m.dMin, max: m.dMax };
  });
  return t;
};
