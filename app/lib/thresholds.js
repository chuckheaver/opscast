// Threshold configuration: defaults, slider definitions, and how sliders
// are grouped on the setup view.

export const DEFAULTS = {
  tempMin: 45,
  tempMax: 95,
  heatIndex: 103,
  windChill: 32,
  windSpeed: 20,
  windGusts: 35,
  precipProb: 40,
  precipAccum: 0.25,
  thunderProb: 30,
  uvIndex: 8,
  humidity: 85,
  dewPoint: 68,
  visibility: 0.5,
  cloudCover: 90,
  aqi: 100,
};

// Each slider: storage key (k), label, range, step, and value formatter.
export const SLIDERS = [
  { k: "tempMin",     label: "Min Temperature",     min: -20,  max: 70,   step: 1,    fmt: v => `${v}°F` },
  { k: "tempMax",     label: "Max Temperature",     min: 70,   max: 130,  step: 1,    fmt: v => `${v}°F` },
  { k: "heatIndex",   label: "Heat Index",          min: 90,   max: 130,  step: 1,    fmt: v => `${v}°F` },
  { k: "windChill",   label: "Wind Chill",          min: -30,  max: 50,   step: 1,    fmt: v => `${v}°F` },
  { k: "windSpeed",   label: "Wind Speed",          min: 5,    max: 60,   step: 1,    fmt: v => `${v} mph` },
  { k: "windGusts",   label: "Wind Gusts",          min: 10,   max: 80,   step: 1,    fmt: v => `${v} mph` },
  { k: "precipProb",  label: "Precip Probability",  min: 10,   max: 100,  step: 5,    fmt: v => `${v}%` },
  { k: "precipAccum", label: "Rain Accumulation",   min: 0.05, max: 2,    step: 0.05, fmt: v => `${v.toFixed(2)}"` },
  { k: "thunderProb", label: "Thunder Probability", min: 10,   max: 100,  step: 5,    fmt: v => `${v}%` },
  { k: "uvIndex",     label: "UV Index",            min: 1,    max: 11,   step: 1,    fmt: v => `${v}` },
  { k: "humidity",    label: "Humidity",            min: 40,   max: 100,  step: 5,    fmt: v => `${v}%` },
  { k: "dewPoint",    label: "Dew Point",           min: 50,   max: 80,   step: 1,    fmt: v => `${v}°F` },
  { k: "visibility",  label: "Visibility (below)",  min: 0.1,  max: 5,    step: 0.1,  fmt: v => `${v.toFixed(1)} mi` },
  { k: "cloudCover",  label: "Cloud Cover",         min: 20,   max: 100,  step: 5,    fmt: v => `${v}%` },
  { k: "aqi",         label: "Air Quality Index",   min: 50,   max: 300,  step: 10,   fmt: v => `${v}` },
];

// Slider grouping for the setup view's sections.
export const GROUPS = [
  { title: "Temperature",          keys: ["tempMin", "tempMax", "heatIndex", "windChill"] },
  { title: "Wind",                 keys: ["windSpeed", "windGusts"] },
  { title: "Precipitation",        keys: ["precipProb", "precipAccum", "thunderProb"] },
  { title: "Comfort & Visibility", keys: ["uvIndex", "humidity", "dewPoint", "visibility", "cloudCover", "aqi"] },
];
