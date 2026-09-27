// The Bay Area as nine named microclimates, and the city's fog map.
//
// Shoreline and zone shapes come from scripts/build-bay-map.mjs (real 1 km
// coastline, generalized hand-drawn zones clipped to it). Zones are coloured
// cool → warm by typical July afternoon high, numbered on the map, and named
// in the key — so no zone is identified by colour alone.

import Link from "next/link";
import GEO from "./bay-zones.json";
import { BAY_MAP } from "./content";

// Nine steps, blue through a neutral to amber, ordered by July high.
const HEAT = ["#4E7398", "#7292AF", "#9CB3C6", "#C5D2DB", "#E6DCC4", "#E8C987", "#DDAE5B", "#CC913A", "#BA7D2C"];

export function BayMap() {
  const zones = [...BAY_MAP].sort((a, b) => a.jul - b.jul).map((z, i) => ({ ...z, fill: HEAT[i], n: i + 1 }));
  const dark = i => i === 0;                          // only the deepest blue needs white numbers
  return (
    <figure className="mc-fig">
      <p className="mc-fig-h">The Bay Area&rsquo;s nine microclimates</p>
      <div className="bm">
        <div className="bm-map">
          <svg viewBox={`0 0 ${GEO.W} ${GEO.H}`} className="mc-svg" role="img"
            aria-label={"Map of the Bay Area divided into nine microclimates, coolest to warmest: " +
              zones.map(z => `${z.name}, July high about ${z.jul} degrees`).join("; ") + "."}>
            <rect width={GEO.W} height={GEO.H} fill="#DCE7EE" />
            <path d={GEO.land} fill="#EEF0F1" />
            {zones.map(z => (
              <path key={z.key} d={GEO.zones[z.key].d} fill={z.fill} stroke="#fff" strokeWidth="1.2">
                <title>{`${z.n}. ${z.name} — July ${z.jul}°F`}</title>
              </path>
            ))}
            {GEO.places.map(p => (
              <g key={p.k} className="bm-place">
                <circle cx={p.x} cy={p.y} r="4" />
                <text x={p.x + 8} y={p.y + 6}>{p.k}</text>
              </g>
            ))}
            {zones.map((z, i) => {
              const [x, y] = GEO.zones[z.key].at;
              return (
                <g key={z.key}>
                  <circle cx={x} cy={y} r="21" fill={z.fill} stroke="#fff" strokeWidth="3" />
                  <text x={x} y={y + 8} textAnchor="middle" className={`bm-n${dark(i) ? " bm-n-w" : ""}`}>{z.n}</text>
                </g>
              );
            })}
            <text x={GEO.W - 14} y={GEO.H - 14} textAnchor="end" className="bm-ocean">Pacific Ocean</text>
          </svg>
        </div>
        <ol className="bm-key">
          {zones.map(z => (
            <li key={z.key}>
              <span className="bm-sw" style={{ background: z.fill }}>{z.n}</span>
              <div>
                <b>{z.name} <em>{z.jul}°F</em></b>
                <span>{z.p}</span>
                <i>{z.eg}</i>
              </div>
            </li>
          ))}
        </ol>
      </div>
      <figcaption className="mc-cap">
        Typical July afternoon high. Zone lines are generalized — real edges follow ridgelines and shift day to day.
      </figcaption>
    </figure>
  );
}

// The landing page's fog map, reused as-is, linking into the live map.
export function FogMapCard() {
  return (
    <figure className="mc-fig mc-fogmap">
      <Link href="/fog?preset=fog" className="lp-map-link" aria-label="Open the interactive summer fog map">
        <img src="/brand/sf-fog-hero.svg"
             alt="San Francisco split into its fog zones, one dot per home sold this year"
             width="1000" height="780" loading="lazy" />
        <span className="lp-map-hint">Open the Summer Fog Map &rarr;</span>
      </Link>
      <div className="mc-fogmap-key">
        {[["Sun", "#E8B84B"], ["Transition", "#C9A882"], ["Fog", "#A8BCCD"], ["Persistent fog", "#8DA2B5"]].map(([k, c]) => (
          <span key={k}><i style={{ background: c }} />{k}</span>
        ))}
        <span><i className="mc-fogmap-dot" />home sold this year</span>
      </div>
      <div className="mc-fogmap-btns">
        <Link href="/fog?preset=fog">Fog</Link>
        <Link href="/fog?preset=terrain">Terrain</Link>
        <Link href="/fog?preset=hazards">Hazards</Link>
        <Link href="/microclimates/zones?layer=solar">Sun &amp; wind</Link>
      </div>
    </figure>
  );
}
