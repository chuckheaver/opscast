// Checks app/lib/sf-climate.json against a live reanalysis record.
//
//   node scripts/check-sf-climate.mjs           # print a side-by-side
//   node scripts/check-sf-climate.mjs --write   # overwrite the JSON's months
//
// The shipped numbers are NOAA/NWS station normals for downtown San
// Francisco. This script pulls 1991–2020 daily values from Open-Meteo's ERA5
// archive for the same spot and averages them the same way, which is a
// different instrument reading the same climate: expect a degree or two of
// disagreement, not five. It exists so the table can be audited rather than
// trusted, and it needs outbound network access to run.

import { readFileSync, writeFileSync } from "node:fs";

const FILE = new URL("../app/lib/sf-climate.json", import.meta.url);
const LAT = 37.7749, LON = -122.4194;
const FROM = "1991-01-01", TO = "2020-12-31";
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const url =
  `https://archive-api.open-meteo.com/v1/archive?latitude=${LAT}&longitude=${LON}` +
  `&start_date=${FROM}&end_date=${TO}` +
  `&daily=temperature_2m_max,temperature_2m_min,precipitation_sum` +
  `&temperature_unit=fahrenheit&precipitation_unit=inch&timezone=America%2FLos_Angeles`;

const res = await fetch(url);
if (!res.ok) throw new Error(`archive API ${res.status} ${res.statusText}`);
const { daily } = await res.json();

// One accumulator per calendar month; rainfall is summed per year first so the
// result is "inches in an average January", not "inches on an average day".
const acc = MONTHS.map(() => ({ hi: [], lo: [], wet: new Map() }));
daily.time.forEach((day, i) => {
  const mi = Number(day.slice(5, 7)) - 1;
  const year = day.slice(0, 4);
  const a = acc[mi];
  if (daily.temperature_2m_max[i] != null) a.hi.push(daily.temperature_2m_max[i]);
  if (daily.temperature_2m_min[i] != null) a.lo.push(daily.temperature_2m_min[i]);
  a.wet.set(year, (a.wet.get(year) || 0) + (daily.precipitation_sum[i] || 0));
});

const mean = xs => xs.reduce((a, b) => a + b, 0) / xs.length;
const live = acc.map((a, i) => ({
  m: MONTHS[i],
  high: Math.round(mean(a.hi)),
  low: Math.round(mean(a.lo)),
  precip: Math.round(mean([...a.wet.values()]) * 10) / 10,
}));

const file = JSON.parse(readFileSync(FILE, "utf8"));
const flag = (a, b, tol) => (Math.abs(a - b) > tol ? "  <-- check" : "");
console.log(`${file.station}, ${file.period}  vs  ERA5 ${FROM}..${TO}\n`);
console.log("      shipped            live");
console.log("      high  low  rain    high  low  rain");
live.forEach((L, i) => {
  const S = file.months[i];
  console.log(
    `${L.m}   ${String(S.high).padStart(4)} ${String(S.low).padStart(4)} ${S.precip.toFixed(1).padStart(5)}   ` +
    `${String(L.high).padStart(4)} ${String(L.low).padStart(4)} ${L.precip.toFixed(1).padStart(5)}` +
    flag(S.high, L.high, 3) + flag(S.low, L.low, 3) + flag(S.precip, L.precip, 1)
  );
});
const sum = xs => xs.reduce((a, b) => a + b, 0);
console.log(`\nannual rain  shipped ${sum(file.months.map(x => x.precip)).toFixed(1)}"` +
  `   live ${sum(live.map(x => x.precip)).toFixed(1)}"`);

if (process.argv.includes("--write")) {
  file.months = live;
  file.station = "San Francisco (37.77, -122.42)";
  file.period = `${FROM.slice(0, 4)}–${TO.slice(0, 4)} average`;
  file.source = "Open-Meteo ERA5 reanalysis, averaged by scripts/check-sf-climate.mjs.";
  writeFileSync(FILE, JSON.stringify(file, null, 2) + "\n");
  console.log("\nwrote app/lib/sf-climate.json");
}
