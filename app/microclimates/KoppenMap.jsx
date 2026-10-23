// The Köppen-Geiger climate map of the Bay Area and Central California:
// informational only (nothing in the reports or market stats reads it). Areas are
// labelled with their climate type; the key names each type and its share of the
// land shown. Picture and labels: scripts/smooth-koppen-map.py.

import MAP from "../lib/koppen-bay.json";

const CITIES = [
  { n: "San Francisco", lat: 37.7749, lon: -122.4194, me: true, left: true },
  { n: "Sacramento", lat: 38.5816, lon: -121.4944 },
  { n: "San Jose", lat: 37.3382, lon: -121.8863 },
  { n: "Fresno", lat: 36.7378, lon: -119.7871 },
  { n: "Reno", lat: 39.5296, lon: -119.8138 },
];

const V = MAP.view;
const pos = c => ({ left: `${(100 * (c.lon - V.lon0)) / (V.lon1 - V.lon0)}%`, top: `${(100 * (V.lat1 - c.lat)) / (V.lat1 - V.lat0)}%` });

export default function KoppenMap() {
  return (
    <figure className="mc-fig kg">
      <div className="kg-map" style={{ aspectRatio: `${MAP.w} / ${MAP.h}` }}>
        <img src="/data/koppen-bay.png" alt="Köppen-Geiger climate types of the Bay Area and Central California. San Francisco is Csb, warm-summer Mediterranean." />
        {MAP.labels.map((l, i) => (
          <span key={i} className="kg-area" style={{ left: `${Math.min(l.x, 88)}%`, top: `${Math.min(l.y + (l.code === "Csa" ? 9 : 0), 89)}%` }}><b>{l.code}</b>{l.name}</span>
        ))}
        {CITIES.map(c => (
          <span key={c.n} className={`kg-city${c.me ? " me" : ""}${c.left ? " l" : ""}`} style={pos(c)}><i />{c.n}</span>
        ))}
      </div>
      <ul className="kg-key">
        {MAP.classes.map(c => (
          <li key={c.code}><i style={{ background: c.color }} /><b>{c.code}</b> {c.name} <span>{c.pct}%</span></li>
        ))}
      </ul>
      <figcaption className="mc-cap">
        Climate groups follow Beck et al. 2018 at 1 km; the type within each group is drawn from the Köppen-Geiger 0.5° grid (cells about 55 km across), smoothed, so boundaries
        between types are approximate. Percent of land shown.
      </figcaption>
    </figure>
  );
}
