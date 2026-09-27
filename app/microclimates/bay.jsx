// The Bay Area as eleven named microclimates, and the city's fog map.
//
// Shoreline and zone shapes come from scripts/build-bay-map.mjs (real 1 km
// coastline, generalized hand-drawn zones clipped to it). Zones are coloured
// cool → warm by typical July afternoon high, numbered on the map, and named
// in the key — so no zone is identified by colour alone.

import Link from "next/link";
import GEO from "./bay-zones.json";
import { BAY_MAP } from "./content";

// Eleven steps, blue through a neutral to amber, ordered by July high.
const HEAT = ["#4E7398", "#7292AF", "#9CB3C6", "#C5D2DB", "#D8C9A0", "#E6DCC4", "#E8C987", "#DDAE5B", "#D5A04A", "#CC913A", "#BA7D2C"];
const LAND = "#F5F1E6", WATER = "#BCD3E1", COAST = "#6F93AB";
const ALPHA = 0.6;                                  // how much of the base map shows through

// The colour a zone actually renders at over land, for the key and badges.
const over = (hex, a = ALPHA, bg = LAND) => {
  const c = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const [f, b] = [c(hex), c(bg)];
  return "#" + f.map((v, i) => Math.round(a * v + (1 - a) * b[i]).toString(16).padStart(2, "0")).join("");
};

export function BayMap() {
  const zones = [...BAY_MAP].sort((a, b) => a.jul - b.jul)
    .map((z, i) => ({ ...z, fill: HEAT[i], tint: over(HEAT[i]), n: i + 1 }));
  // Paint in the build script's order, so its precedence holds.
  const paint = Object.keys(GEO.zones).map(k => zones.find(z => z.key === k)).filter(Boolean);
  return (
    <figure className="mc-fig">
      <p className="mc-fig-h">The Bay Area&rsquo;s eleven microclimates</p>
      <div className="bm">
        <div className="bm-map">
          <svg viewBox={`0 0 ${GEO.W} ${GEO.H}`} className="mc-svg" role="img"
            aria-label={"Map of the Bay Area divided into eleven microclimates, coolest to warmest: " +
              zones.map(z => `${z.name}, July high about ${z.jul} degrees`).join("; ") + "."}>
            <defs>
              <clipPath id="bm-land"><path d={GEO.land} /></clipPath>
              <filter id="bm-soft" x="-5%" y="-5%" width="110%" height="110%">
                <feGaussianBlur stdDeviation="7" />
              </filter>
              <marker id="bm-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                <path d="M0,0 L8,4 L0,8 Z" fill="#2F6F73" />
              </marker>
              {/* wind streaks — the Delta Breeze zone's texture */}
              <pattern id="bm-wind" width="26" height="12" patternUnits="userSpaceOnUse">
                <path d="M1,6 C7,2 13,10 25,6" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
              </pattern>
              <filter id="bm-shore" x="-5%" y="-5%" width="110%" height="110%">
                <feGaussianBlur stdDeviation="6" />
              </filter>
            </defs>

            <rect width={GEO.W} height={GEO.H} fill={WATER} />
            {/* a soft light halo off the shore, so the coastline reads at a glance */}
            <path d={GEO.land} fill="none" stroke="#E4EEF4" strokeWidth="14" filter="url(#bm-shore)" />
            <path d={GEO.land} fill={LAND} />

            <g clipPath="url(#bm-land)">
              <g filter="url(#bm-soft)" opacity={ALPHA}>
                {paint.map(z => <path key={z.key} d={GEO.zones[z.key].d} fill={z.fill} />)}
              </g>
            </g>
            <g clipPath="url(#bm-land)">
              <path d={GEO.zones.delta.d} fill="url(#bm-wind)" opacity="0.85" />
            </g>
            <path d={GEO.land} fill="none" stroke={COAST} strokeWidth="1.3" strokeLinejoin="round" />

            {/* the Delta breeze, drawn as the wind it is */}
            {GEO.breeze.map((l, i) => (
              <g key={i}>
                <path d={`M${l[0][0]},${l[0][1]} L${l[1][0]},${l[1][1]}`} className="bm-breeze-halo" />
                <path d={`M${l[0][0]},${l[0][1]} L${l[1][0]},${l[1][1]}`} className="bm-breeze" markerEnd="url(#bm-arrow)" />
              </g>
            ))}
            {GEO.water.map(w => <text key={w.k} x={w.x} y={w.y} textAnchor="middle" className="bm-water">{w.k}</text>)}
            {GEO.peaks.map(p => (
              <g key={p.k} className="bm-peak">
                <title>{`${p.k}, ${p.ft.toLocaleString("en-US")} ft`}</title>
                <path d={`M${p.x},${p.y - 9} L${p.x + 8},${p.y + 5} L${p.x - 8},${p.y + 5} Z`} />
                {p.side === "below"
                  ? <text x={p.x} y={p.y + 24} textAnchor="middle">{p.k}</text>
                  : <text x={p.x + 12} y={p.y + 5}>{p.k}</text>}
              </g>
            ))}
            {GEO.places.map(p => (
              <g key={p.k} className="bm-place">
                <circle cx={p.x} cy={p.y} r="4" />
                <text x={p.x + 8} y={p.y + 6}>{p.k}</text>
              </g>
            ))}
            {zones.map(z => {
              const [x, y] = GEO.zones[z.key].at;
              return (
                <g key={z.key}>
                  <title>{`${z.n}. ${z.name} — July ${z.jul}°F`}</title>
                  <circle cx={x} cy={y} r="21" fill={z.fill} stroke="#fff" strokeWidth="3" />
                  <text x={x} y={y + 8} textAnchor="middle" className={`bm-n${z.n === 1 ? " bm-n-w" : ""}`}>{z.n}</text>
                </g>
              );
            })}
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
                {z.link && <Link className="bm-link" href={z.link.href}>{z.link.label} &rarr;</Link>}
              </div>
            </li>
          ))}
        </ol>
      </div>
      <figcaption className="mc-cap">
        Typical July afternoon high. Zones blend into each other on purpose — real edges follow ridgelines and move day to day.
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
