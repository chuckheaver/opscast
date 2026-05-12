// Per-hour risk scoring + visual styling for risk levels.

// Score each hour against the user's thresholds.
// Returns { score: 0..10, trig: [labels of triggered conditions] }.
// Internal weights sum to 26, then rescaled to 0..10.
export const calcRisk = (h, t) => {
  let s = 0;
  const trig = [];
  const chk = (cond, weight, label) => {
    if (cond) {
      s += weight;
      trig.push(label);
    }
  };

  chk(h.thunder || h.thunderProb >= t.thunderProb, 3, "Thunder");
  chk(h.hail,                                       3, "Hail");
  chk(h.windGusts >= t.windGusts,                   2, `Gusts ${Math.round(h.windGusts)} mph`);
  chk(h.windSpeed >= t.windSpeed,                   2, `Wind ${Math.round(h.windSpeed)} mph`);
  chk(h.precipProb >= t.precipProb,                 2, `Precip ${h.precipProb}%`);
  chk(h.precipAccum >= t.precipAccum,               2, `Rain ${h.precipAccum.toFixed(2)}"`);
  chk(h.heatIndex >= t.heatIndex,                   2, `Heat Index ${Math.round(h.heatIndex)}°F`);
  chk(h.windChill <= t.windChill,                   2, `Wind Chill ${Math.round(h.windChill)}°F`);
  chk(h.tempF >= t.tempMax || h.tempF <= t.tempMin, 1, `Temp ${Math.round(h.tempF)}°F`);
  chk(h.uvIndex >= t.uvIndex,                       1, `UV ${h.uvIndex}`);
  chk(h.humidity >= t.humidity,                     1, `Humidity ${h.humidity}%`);
  chk(h.dewPoint >= t.dewPoint,                     1, `Dew Pt ${Math.round(h.dewPoint)}°F`);
  chk(h.visibility <= t.visibility,                 2, `Vis ${h.visibility.toFixed(1)} mi`);
  chk(h.cloudCover >= t.cloudCover,                 1, "Overcast");
  chk(h.aqi > 0 && h.aqi >= t.aqi,                  1, `AQI ${h.aqi}`);

  return { score: Math.min(10, Math.round((s * 10) / 26)), trig };
};

// Color palette + label for a given 0..10 risk score.
export const riskStyle = s => {
  if (s <= 2) return { color: "#166534", bg: "#f0fdf4", border: "#bbf7d0", dot: "#16a34a", label: "Low" };
  if (s <= 4) return { color: "#713f12", bg: "#fefce8", border: "#fde047", dot: "#ca8a04", label: "Moderate" };
  if (s <= 6) return { color: "#7c2d12", bg: "#fff7ed", border: "#fdba74", dot: "#ea580c", label: "Elevated" };
  if (s <= 8) return { color: "#7f1d1d", bg: "#fef2f2", border: "#fca5a5", dot: "#dc2626", label: "High" };
  return        { color: "#581c87", bg: "#faf5ff", border: "#d8b4fe", dot: "#9333ea", label: "Critical" };
};
