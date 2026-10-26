// Graphics for /microclimates/el-nino, as server components (SVG and HTML, no
// client JavaScript), drawn in the same style as the fog story on /microclimates.
// Every scene is a schematic, not to scale.

import { C } from "../charts";

const HALO = { paintOrder: "stroke", stroke: "rgba(255,255,255,0.92)", strokeWidth: 3.2, strokeLinejoin: "round" };
const WARM = "#E0703A", COLD = "#2F5E86", SAND = "#D9CDB6";

export function Defs() {
  const head = (id, color) => (
    <marker id={id} markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
      <path d="M0,0 L8,4 L0,8 Z" fill={color} />
    </marker>
  );
  const v = (id, a, b) => (
    <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor={a} />
      <stop offset="1" stopColor={b} />
    </linearGradient>
  );
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
      <defs>
        {head("enK", "#3D4650")}
        {head("enW", WARM)}
        {head("enB", COLD)}
        {head("enN", C.barHi)}
        {v("enSky", "#A9CBE6", "#E3EEF6")}
        {v("enCold", "#4F7EA6", "#24476A")}
        {v("enSea", "#9CC3DE", "#6E9DC0")}
        {v("enLand", "#DAD1C1", "#B5AB99")}
        <radialGradient id="enPool" cx="0.5" cy="0.3" r="0.7">
          <stop offset="0" stopColor="#E8642E" />
          <stop offset="1" stopColor="#F2B36B" />
        </radialGradient>
        <linearGradient id="enWarmL" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F4C27A" />
          <stop offset="1" stopColor="#E9A45C" />
        </linearGradient>
        <filter id="enBlur"><feGaussianBlur stdDeviation="2.2" /></filter>
      </defs>
    </svg>
  );
}

// ---------------------------------------------------------------- the Pacific, side view

const P = {
  normal: { sW: 86, sE: 92, tW: 160, tE: 108, pool: 92, cloud: 74, trade: 1, up: 1, sink: true },
  nino: { sW: 90, sE: 88, tW: 142, tE: 134, pool: 236, cloud: 238, trade: 0.35, up: 0.25, sink: false },
  nina: { sW: 84, sE: 93, tW: 172, tE: 98, pool: 64, cloud: 58, trade: 1.6, up: 1.6, sink: true },
};
const XW = 34, XE = 366;
const surf = (p, x) => p.sW + ((p.sE - p.sW) * (x - XW)) / (XE - XW);

function Cloud({ x, y, s = 1 }) {
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      {[[-16, 4, 11], [-4, -4, 14], [11, 1, 12], [22, 6, 8]].map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy} r={r} fill="#fff" stroke="#9FB2C3" strokeWidth="0.8" />)}
      <rect x="-26" y="5" width="56" height="10" rx="5" fill="#fff" />
      {[-14, -4, 6, 16].map(dx => <line key={dx} x1={dx} y1="18" x2={dx - 4} y2="30" stroke="#5F8EAE" strokeWidth="1.6" strokeLinecap="round" />)}
    </g>
  );
}

export function Pacific({ state }) {
  const p = P[state];
  const warmPath = `M${XW},${p.sW} L${XE},${p.sE} L${XE},${p.tE} C${XE - 110},${p.tE + 4} ${XW + 110},${p.tW - 4} ${XW},${p.tW} Z`;
  const trades = Math.round(2 + p.trade * 1.5);
  const label = {
    normal: "Neutral Pacific: steady trade winds pile warm water in the west, storms rise over the west, cold water wells up off South America.",
    nino: "El Niño: weak trade winds, warm water and storms spread east, the warm layer flattens and upwelling off South America weakens.",
    nina: "La Niña: strong trade winds, warm water pushed far west, a steep warm layer and strong upwelling of cold water in the east.",
  }[state];
  return (
    <svg viewBox="0 0 400 220" className="mc-svg fs-scene" role="img" aria-label={label}>
      <rect width="400" height="220" fill="url(#enSky)" />
      <rect x="0" y="80" width="400" height="140" fill="url(#enCold)" />
      <path d={warmPath} fill="url(#enWarmL)" />
      <ellipse cx={p.pool} cy={(surf(p, p.pool) + 120) / 2 + 6} rx="58" ry="20" fill="url(#enPool)" opacity="0.85" filter="url(#enBlur)" />
      <path d={`M${XW},${p.tW} C${XE - 110},${p.tW - 4} ${XW + 110},${p.tW - 4} ${XW},${p.tW}`} fill="none" />
      <path d={`M${XE},${p.tE} C${XE - 110},${p.tE + 4} ${XW + 110},${p.tW - 4} ${XW},${p.tW}`} fill="none" stroke="#fff" strokeWidth="1.6" strokeDasharray="5 4" />
      <path d={`M0,${p.sW} L${XW},${p.sW} L${XE},${p.sE} L400,${p.sE}`} fill="none" stroke="#fff" strokeWidth="1.4" opacity="0.8" />
      {/* land */}
      <path d={`M0,${p.sW - 14} C14,${p.sW - 20} 26,${p.sW - 16} ${XW + 4},${p.sW - 2} L${XW + 2},220 L0,220 Z`} fill="url(#enLand)" />
      <path d={`M400,${p.sE - 26} C388,${p.sE - 24} 374,${p.sE - 14} ${XE - 4},${p.sE - 2} L${XE},220 L400,220 Z`} fill="url(#enLand)" />
      {/* upwelling */}
      {Array.from({ length: Math.max(1, Math.round(p.up * 2.5)) }, (_, i) => (
        <path key={i} d={`M${352 - i * 14},196 C${348 - i * 14},170 ${350 - i * 14},140 ${356 - i * 12},${p.sE + 10}`} fill="none" stroke="#BFE0F5" strokeWidth={1.4 + p.up * 0.6} markerEnd="url(#enB)" opacity={0.35 + p.up * 0.35} />
      ))}
      {/* storms over the warm pool, rising air */}
      <Cloud x={p.cloud} y={30} s={state === "nina" ? 1.1 : 1} />
      <path d={`M${p.cloud + 2},${surf(p, p.cloud) - 6} V66`} stroke="#3D4650" strokeWidth="1.6" markerEnd="url(#enK)" opacity="0.6" />
      {/* trade winds, near the surface, east to west */}
      {Array.from({ length: trades }, (_, i) => {
        const x1 = 330 - i * (240 / trades), x0 = x1 - 26 - p.trade * 18;
        return <path key={i} d={`M${x1},${Math.min(surf(p, x1), surf(p, x0)) - 9} L${x0},${Math.min(surf(p, x1), surf(p, x0)) - 9}`} stroke="#3D4650" strokeWidth={1.2 + p.trade * 1.1} markerEnd="url(#enK)" opacity={state === "nino" ? 0.45 : 0.85} />;
      })}
      {p.sink && <path d="M330,22 V58" stroke="#3D4650" strokeWidth="1.6" markerEnd="url(#enK)" opacity="0.5" />}
      {p.sink && <path d={`M${p.cloud + 40},14 H322`} stroke="#3D4650" strokeWidth="1.4" markerEnd="url(#enK)" opacity="0.45" strokeDasharray="4 3" />}
      {/* labels */}
      <text className="fs-t-s" x="6" y={p.sW - 24} style={HALO}>Asia &amp; Australia</text>
      <text className="fs-t-s" x="394" y={p.sE - 34} textAnchor="end" style={HALO}>South America</text>
      <text className="fs-t-l" x={state === "nino" ? 200 : 150} y={surf(p, 150) + 22} textAnchor="middle" fill="#7A3B12" style={HALO}>Warm water</text>
      <text className="fs-t-s" x="200" y="206" textAnchor="middle" style={{ fill: "#fff" }}>Cold deep water</text>
      <text className="fs-t-s" x={XW + 8} y={p.tW + 16} style={{ fill: "#fff" }}>thermocline</text>
      <text className="fs-t-s" x="200" y={Math.min(surf(p, 200) - 18, 76)} textAnchor="middle" style={HALO}>
        {state === "nino" ? "Trade winds weak" : state === "nina" ? "Trade winds strong" : "Trade winds"}
      </text>
    </svg>
  );
}

// ---------------------------------------------------------------- the jet stream, map view

// The North Pacific and North America, 120°E to 60°W, 10°N to 70°N. Jet paths
// follow NOAA Climate.gov's winter patterns: in El Niño the Pacific jet's core
// shifts south and reaches farther east, steering storms across the southern
// third of the continent; in La Niña it retracts west and meanders north.
const JX = lon => ((lon - 120) * 400) / 180;
const JY = lat => ((70 - lat) * 230) / 60;
const jpoly = pts => pts.map(([lo, la], i) => `${i ? "L" : "M"}${JX(lo).toFixed(1)},${JY(la).toFixed(1)}`).join(" ") + " Z";
// a smooth curve through the points (Catmull-Rom as cubic Béziers)
const smooth = pts => {
  const P = pts.map(([lo, la]) => [JX(lo), JY(la)]);
  let d = `M${P[0][0].toFixed(1)},${P[0][1].toFixed(1)}`;
  for (let i = 0; i < P.length - 1; i++) {
    const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d;
};
const NA2 = [[188, 70], [192, 66], [197, 62], [200, 58.5], [205, 57], [210, 59.5], [215, 60], [220, 59.5], [225, 57], [229, 54], [232, 50], [235, 47], [236, 43],
  [236, 40], [237.6, 37.8], [239, 35], [241, 34], [243, 32], [245, 29], [247, 26], [249, 23], [251, 21], [254, 19], [258, 17], [263, 15.5], [267, 13.5], [271, 11],
  [276, 10], [277, 13], [273, 16], [272, 21], [269, 19], [264, 19], [262, 22], [262.5, 26], [263, 28], [266, 29.5], [270, 30], [275, 30], [277, 29], [278, 27],
  [279, 25], [280, 25.5], [280, 27.5], [279, 30], [279.5, 31], [281, 32], [283, 34.5], [284, 36], [286, 38.5], [288, 40.5], [290, 41.5], [293, 43], [295, 44.5],
  [300, 46], [300, 70]];
const AS2 = [[120, 70], [180, 70], [178, 65], [170, 60], [163, 58], [162, 54], [158, 51], [156, 51], [156, 57], [150, 59], [143, 54], [141, 48], [135, 43],
  [130, 42], [129, 36], [126, 35], [122, 30], [121, 25], [120, 22]];
const JP2 = [[130, 31], [135, 34], [140, 35.5], [142, 39], [141.5, 42], [145, 43.5], [141, 45.5], [139.5, 41], [136, 36.5], [131, 34]];
const PAT = {
  normal: {
    core: [[130, 35], [150, 35], [170, 35.6], [190, 37]],
    jet: [[190, 37], [210, 41], [228, 45], [238, 47], [252, 46], [270, 43], [285, 42], [298, 43]],
    low: [190, 52],
    storms: [[226, 46.5]],
  },
  nino: {
    core: [[130, 33], [150, 32], [170, 31], [190, 30.5], [210, 31], [228, 32]],
    jet: [[228, 32], [240, 32.5], [255, 32], [270, 32.5], [285, 35], [298, 38]],
    polar: [[195, 60], [215, 62], [240, 58], [260, 54], [280, 52], [298, 50]],
    low: [206, 47],
    storms: [[222, 33], [238, 34], [256, 33.5]],
    wet: [258, 33, 26, 5.5], dry: [244, 47.5, 9, 3.2],
  },
  nina: {
    core: [[130, 37], [150, 38], [168, 40]],
    jet: [[168, 40], [185, 48], [200, 56], [212, 59], [225, 56], [235, 50], [243, 46], [255, 43], [268, 41], [282, 40], [298, 42]],
    high: [203, 46],
    storms: [[233, 50.5]],
    wet: [241, 47.5, 8, 3.4], dry: [258, 32.5, 24, 4.6],
  },
};
export function Jet({ state }) {
  const p = PAT[state];
  const label = {
    normal: "Neutral winter: the Pacific jet stream reaches about halfway across the Pacific and the storm track aims mostly at the Pacific Northwest.",
    nino: "El Niño winter: the core of the Pacific jet stream shifts south and reaches farther east, steering storms into California and across the southern United States; the polar jet stays over Canada.",
    nina: "La Niña winter: the jet stream retracts west and a variable polar jet meanders north around high pressure in the North Pacific, steering storms into the Pacific Northwest; the southern tier, California included, leans dry.",
  }[state];
  const ell = ([lo, la, rlo, rla], fill, text, tfill) => (
    <g>
      <ellipse cx={JX(lo)} cy={JY(la)} rx={(rlo * 400) / 180} ry={(rla * 230) / 60} fill={fill} opacity="0.55" filter="url(#enBlur)" />
      <text className="fs-t-s en-wd" x={JX(lo)} y={JY(la) + 4} textAnchor="middle" style={{ fill: tfill }}>{text}</text>
    </g>
  );
  return (
    <svg viewBox="0 0 400 230" className="mc-svg fs-scene" role="img" aria-label={label}>
      <rect width="400" height="230" fill="url(#enSea)" />
      <path d={jpoly(AS2)} fill="url(#enLand)" />
      <path d={jpoly(JP2)} fill="url(#enLand)" />
      <path d={jpoly(NA2)} fill="url(#enLand)" />
      {p.wet && ell(p.wet, "#5A80A6", "Wetter", "#0F2236")}
      {p.dry && ell(p.dry, "#C99A4E", "Drier", "#4A3410")}
      {p.polar && <path d={smooth(p.polar)} fill="none" stroke="#5F86AA" strokeWidth="2" strokeDasharray="6 4" markerEnd="url(#enN)" />}
      {p.polar && <text className="fs-t-s" x={JX(238)} y={JY(60.5)} style={HALO}>Polar jet</text>}
      <path d={smooth([...p.core, ...p.jet.slice(1)])} fill="none" stroke="#fff" strokeWidth="8" opacity="0.5" strokeLinecap="round" />
      <path d={smooth(p.core)} fill="none" stroke={C.barHi} strokeWidth="6.5" strokeLinecap="round" />
      <path d={smooth(p.jet)} fill="none" stroke={C.barHi} strokeWidth="2.6" markerEnd="url(#enN)" strokeLinecap="round" />
      <text className="fs-t-s en-wd" x={JX(p.core[1][0])} y={JY(p.core[1][1]) - 9} style={HALO}>{{ nino: "Pacific Jet", nina: "Variable Polar Jet" }[state] || "Pacific jet stream"}</text>
      {p.storms.map(([lo, la], i) => <Cloud key={i} x={JX(lo)} y={JY(la) - 16} s={0.5} />)}
      {p.low && <text className="fs-t-big" x={JX(p.low[0])} y={JY(p.low[1])} textAnchor="middle" fill="#B3261E">L</text>}
      {p.high && <text className="fs-t-big" x={JX(p.high[0])} y={JY(p.high[1])} textAnchor="middle" fill={C.warmText}>H</text>}
      {[["Seattle", 237.7, 47.6], ["San Francisco", 237.6, 37.8, true], ["Los Angeles", 241.8, 34.05]].map(([n, lo, la, me]) => (
        <g key={n}>
          <circle cx={JX(lo)} cy={JY(la)} r={me ? 3.6 : 2.6} fill={me ? C.barHi : "#3D4650"} stroke="#fff" strokeWidth="1.1" />
          {me && <text className="fs-t-l en-sm" x={JX(lo) - 6} y={JY(la) + 4} textAnchor="end" style={HALO}>SF</text>}
        </g>
      ))}
      <circle cx={JX(202.2)} cy={JY(20.8)} r="2.4" fill="#3D4650" stroke="#fff" strokeWidth="1" />
      <text className="fs-t-s" x={JX(202.2) + 6} y={JY(20.8) + 4} style={HALO}>Hawaii</text>
      <text className="fs-t-s" x="8" y="222" style={HALO}>Pacific Ocean</text>
    </svg>
  );
}

// ---------------------------------------------------------------- past strong El Niños, rain and snow

// Grouped by the Bay Area's bin: wetter above 125% of average, normal 75–125%,
// drier below 75%. NOAA's bins 0–4 are the dry side, 5 is 75–125%, 6+ wet.
const HM_GROUPS = [
  { k: "Wetter", d: "Bay Area above 125% of average", has: m => m.name !== "Composite" && m.bay >= 6 },
  { k: "Normal", d: "Bay Area 75–125% of average", has: m => m.name !== "Composite" && m.bay === 5 },
  { k: "Drier", d: "Bay Area below 75% of average", has: m => m.name !== "Composite" && m.bay <= 4 },
];
function HmCard({ m, data, pos }) {
  return (
    <li className={m.name === "Composite" ? "comp" : undefined}>
      <b>{m.name === "Composite" ? "Average" : m.name}</b>
      <div className="en-hm-map">
        <img src={m.src} alt={`California and Nevada, December–May ${m.name}: percent of average precipitation. Bay Area ${data.bins[m.bay]}.`} width={data.w} height={data.h} loading="lazy" />
        <i className="en-hm-sf" style={pos(data.sf)} />
        <i className="en-hm-th" style={pos(data.tahoe)} />
      </div>
      <span className="en-hm-bay" style={{ "--c": data.colors[m.bay] }}><i />Bay Area {data.bins[m.bay]}</span>
    </li>
  );
}

export function HistoryMaps({ data }) {
  const pos = ([x, y]) => ({ left: `${(100 * x) / data.w}%`, top: `${(100 * y) / data.h}%` });
  return (
    <figure className="mc-fig en-hmaps">
      <p className="mc-fig-h">Strong El Niño winters: rain and snow, December–May, percent of average</p>
      <div className="en-hm-key" aria-label="Color key: percent of average precipitation">
        {data.bins.map((b, i) => <span key={b} style={{ "--c": data.colors[i] }}><i />{b}</span>)}
      </div>
      {HM_GROUPS.map(g => {
        const maps = data.maps.filter(g.has);
        return (
          <section key={g.k} className={`en-hm-group en-hm-${g.k}`}>
            <h4 className="en-hm-gh"><b>{g.k}</b><span>{g.d} · {maps.length} of {data.maps.length - 1} winters</span></h4>
            <ol className="en-hm-grid">{maps.map(m => <HmCard key={m.name} m={m} data={data} pos={pos} />)}</ol>
          </section>
        );
      })}
      <section className="en-hm-group">
        <h4 className="en-hm-gh"><b>All 11, averaged</b><span>the strong El Niño winters together</span></h4>
        <ol className="en-hm-grid">{data.maps.filter(m => m.name === "Composite").map(m => <HmCard key={m.name} m={m} data={data} pos={pos} />)}</ol>
      </section>
      <figcaption className="mc-cap">
        Redrawn from NOAA NCEI, Strong El Niño Precipitation Percent of Average, West Climate Region (data: nClimGrid Monthly; average 1991–2020); NOAA&rsquo;s color bins,
        the site&rsquo;s colors [20]. Dots: San Francisco and Lake Tahoe. &ldquo;Bay Area&rdquo; is the bin on the Peninsula, read from the map; winters are grouped by it.
      </figcaption>
    </figure>
  );
}

// ---------------------------------------------------------------- Kelvin waves

const AMER = "M286,0 C292,28 298,54 305,74 C312,94 324,110 337,121 C343,127 346,131 348,137 C350,160 353,190 357,220 L400,220 L400,0 Z";
const ASIA = "M0,64 C18,72 30,92 34,120 C36,150 30,176 20,200 L12,220 L0,220 Z";
const EQ = 136;

function Basin({ children, label }) {
  return (
    <svg viewBox="0 0 400 220" className="mc-svg fs-scene" role="img" aria-label={label}>
      <rect width="400" height="220" fill="url(#enSea)" />
      <path d={ASIA} fill="url(#enLand)" />
      <path d={AMER} fill="url(#enLand)" />
      <line x1="34" x2="348" y1={EQ} y2={EQ} stroke="#fff" strokeWidth="1.2" strokeDasharray="5 5" opacity="0.8" />
      <text className="fs-t-s" x="44" y={EQ + 16} style={{ fill: "#fff" }}>Equator</text>
      <text className="fs-t-s" x="392" y="40" textAnchor="end" style={HALO}>North America</text>
      <text className="fs-t-s" x="336" y="212" textAnchor="end" style={HALO}>South America</text>
      {children}
    </svg>
  );
}
const Bulge = ({ x, rx = 34, o = 0.9 }) => <ellipse cx={x} cy={EQ} rx={rx} ry="13" fill="url(#enPool)" opacity={o} filter="url(#enBlur)" />;

export function Kelvin1() {
  return (
    <Basin label="The trade winds weaken over the western Pacific, releasing a bulge of warm water near Asia.">
      <Bulge x={74} rx={30} />
      {[110, 170, 230].map(x => <path key={x} d={`M${x + 34},${EQ - 34} L${x},${EQ - 34}`} stroke="#3D4650" strokeWidth="1.4" markerEnd="url(#enK)" opacity="0.4" strokeDasharray="4 3" />)}
      <text className="fs-t-s" x="170" y={EQ - 44} textAnchor="middle" style={HALO}>Trade winds weaken</text>
      <text className="fs-t-l" x="74" y={EQ + 34} textAnchor="middle" fill="#7A3B12" style={HALO}>Warm water</text>
    </Basin>
  );
}
export function Kelvin2() {
  return (
    <Basin label="The Kelvin wave travels east along the equator for about two to three months.">
      <Bulge x={110} rx={20} o={0.35} />
      <Bulge x={210} rx={44} />
      <path d={`M150,${EQ - 26} H290`} stroke={WARM} strokeWidth="2.6" markerEnd="url(#enW)" />
      <text className="fs-t-l" x="220" y={EQ - 34} textAnchor="middle" fill="#7A3B12" style={HALO}>Kelvin wave</text>
      <text className="fs-t-s" x="220" y={EQ + 34} textAnchor="middle" style={HALO}>about 2–3 months to cross</text>
    </Basin>
  );
}
export function Kelvin3() {
  return (
    <Basin label="At South America the wave splits; part runs north along the coast to California.">
      <Bulge x={326} rx={22} />
      <path d="M330,120 C318,104 308,90 300,72 C296,60 292,46 289,30" fill="none" stroke={WARM} strokeWidth="2.8" markerEnd="url(#enW)" />
      <path d="M338,150 C340,170 342,186 345,204" fill="none" stroke={WARM} strokeWidth="2" markerEnd="url(#enW)" opacity="0.7" />
      <circle cx="296" cy="62" r="4" fill={C.barHi} stroke="#fff" strokeWidth="1.2" />
      <text className="fs-t-l" x="288" y="66" textAnchor="end" style={HALO}>California</text>
      <text className="fs-t-s" x="286" y="112" textAnchor="end" style={HALO}>coastal Kelvin wave</text>
    </Basin>
  );
}
export function Kelvin4() {
  return (
    <svg viewBox="0 0 400 220" className="mc-svg fs-scene" role="img" aria-label="At the shore: warmer water expands, upwelling weakens and storm winds push water ashore, holding sea level 6 to 12 inches above normal.">
      <rect width="400" height="220" fill="url(#enSky)" />
      <path d="M0,118 L262,118 L262,220 L0,220 Z" fill="url(#enSea)" />
      <path d="M0,104 L270,104 L270,118 L0,118 Z" fill="#F2B36B" opacity="0.75" />
      <path d="M248,220 L262,120 C278,112 290,96 300,84 L400,78 L400,220 Z" fill="url(#enLand)" />
      <rect x="318" y="58" width="22" height="20" fill="#fff" stroke="#8D8573" />
      <path d="M314,58 L329,46 L344,58 Z" fill="#B78D6A" />
      <rect x="352" y="62" width="30" height="16" fill="#fff" stroke="#8D8573" />
      <line x1="0" x2="262" y1="118" y2="118" stroke="#fff" strokeWidth="1.6" strokeDasharray="6 4" />
      <text className="fs-t-s" x="8" y="134" style={{ fill: "#fff" }}>normal sea level</text>
      <text className="fs-t-l" x="8" y="98" fill="#7A3B12" style={HALO}>El Niño sea level</text>
      <path d="M232,116 V106" stroke={C.barHi} strokeWidth="2" markerEnd="url(#enN)" />
      <text className="fs-t-v" x="226" y="96" textAnchor="end" style={HALO}>+6 to 12 in</text>
      <text className="fs-t-s" x="20" y="160" style={{ fill: "#fff" }}>Warmer water expands</text>
      <text className="fs-t-s" x="20" y="178" style={{ fill: "#fff" }}>Upwelling of cold water weakens</text>
      <path d="M40,40 L150,74" stroke="#3D4650" strokeWidth="2" markerEnd="url(#enK)" opacity="0.7" />
      <text className="fs-t-s" x="36" y="32" style={HALO}>Southerly storm winds</text>
    </svg>
  );
}
export const KELVIN_SCENES = [Kelvin1, Kelvin2, Kelvin3, Kelvin4];

// ---------------------------------------------------------------- strength scale

const BANDS = [
  { k: "Weak", a: 0.5, b: 1.0, c: "#F6E2C4" },
  { k: "Moderate", a: 1.0, b: 1.5, c: "#F0C48E" },
  { k: "Strong", a: 1.5, b: 2.0, c: "#E79A5B" },
  { k: "Very strong", a: 2.0, b: 3.0, c: "#D46A35" },
];
const pct = v => `${((v - 0.5) / 2.5) * 100}%`;
export function Strength() {
  return (
    <figure className="mc-fig en-strength">
      <p className="mc-fig-h">How strong: Niño-3.4, °C above normal</p>
      <div className="en-scale">
        {BANDS.map(b => (
          <div key={b.k} className="en-band" style={{ left: pct(b.a), width: `calc(${pct(b.b)} - ${pct(b.a)})`, background: b.c }}>
            <b>{b.k}</b><span>+{b.a.toFixed(1)}{b.b < 3 ? `–${b.b.toFixed(1)}` : "+"}</span>
          </div>
        ))}
        <div className="en-mark now" style={{ left: pct(2.1) }}><i /><b>Now +2.1°C</b><span>Oct 2026 [1]</span></div>
        <div className="en-mark rec" style={{ left: pct(2.5) }}><i /><b>+2.5°C</b><span>record level [1]</span></div>
      </div>
      <figcaption className="mc-cap">
        Very strong events since 1950: 1982–83, 1997–98 and 2015–16. In September NOAA gave a 75% chance this event reaches +2.5°C or more for October–December, beyond any
        since 1950 [1]. NOAA has measured the index against the whole tropics (RONI) since February 2026 [2].
      </figcaption>
    </figure>
  );
}

// ---------------------------------------------------------------- the water-level stack

const STACK_C = ["#B7D0E2", "#8DB2CF", "#E79A5B", "#5F86AA", "#2F5479"];
export function Stack({ layers }) {
  return (
    <figure className="mc-fig en-stack">
      <p className="mc-fig-h">What stacks up at the shore</p>
      <ol className="en-stack-list">
        {layers.map((l, i) => (
          <li key={l.k} style={{ "--c": STACK_C[i], "--h": `${26 + i * 8}px` }}>
            <i /><div><b>{l.k}</b><span>{l.p}</span></div>
          </li>
        ))}
      </ol>
    </figure>
  );
}

// ---------------------------------------------------------------- storms across the Pacific

// A map of the Pacific basin, 110°E to 70°W and 60°N to 30°S, plate carrée.
const LX = lon => ((lon - 110) * 1000) / 180;           // lon in degrees east (0–360)
const LY = lat => ((60 - lat) * 520) / 90;
const poly = pts => pts.map(([lo, la], i) => `${i ? "L" : "M"}${LX(lo).toFixed(1)},${LY(la).toFixed(1)}`).join(" ") + " Z";
const NAM = [[204, 60], [212, 60], [218, 60], [222, 59], [226, 57], [229, 54], [232, 50], [235, 47], [236, 43], [236, 40], [237.5, 38], [239, 35], [241, 34],
  [243, 32], [245, 29], [247, 26], [249, 23], [251, 21], [254, 19], [258, 17], [263, 15.5], [267, 13.5], [271, 11], [276, 8.5], [280, 4], [281, 0], [279.5, -3],
  [279, -6], [282, -12], [285, -17], [289, -22], [290, -30], [290, 60]];
const ASI = [[110, 60], [160, 60], [162, 56], [157, 51], [143, 47], [141, 41], [140, 35], [132, 33], [122, 30], [120, 24], [116, 22], [110, 20]];
const AUS = [[113, -22], [122, -17], [130, -12], [136, -12], [142, -10.5], [146, -18], [153, -25], [153.5, -30], [113, -30]];
const ISL = [[[110, 2], [118, 6], [119, 1], [117, -3], [110, -3]], [[131, -1], [141, -2.5], [150, -6], [147, -10], [138, -8], [132, -4]], [[120, 18], [124, 13], [126, 7], [122, 8], [120, 14]]];

function PinIcon({ x, y, me }) {
  return <circle cx={x} cy={y} r={me ? 5 : 4} fill={me ? C.barHi : "#3D4650"} stroke="#fff" strokeWidth="1.5" />;
}
function Num({ n, x, y }) {
  return (
    <g>
      <circle cx={x} cy={y} r="13" fill={C.barHi} stroke="#fff" strokeWidth="2" />
      <text x={x} y={y + 5} textAnchor="middle" className="en-num">{n}</text>
    </g>
  );
}

export function PacificStorms() {
  const eq = LY(0);
  // the atmospheric river: a narrow plume curving from the tropics near Hawaii
  // to the Bay Area, sampled from a cubic and tapered toward landfall
  const B = (t, a, b, c, d) => (1 - t) ** 3 * a + 3 * (1 - t) ** 2 * t * b + 3 * (1 - t) * t * t * c + t ** 3 * d;
  const P0 = [191, 13], P1 = [198, 19], P2 = [218, 30], P3 = [237.6, 37.8];
  const ctr = Array.from({ length: 21 }, (_, i) => { const t = i / 20; return [B(t, P0[0], P1[0], P2[0], P3[0]), B(t, P0[1], P1[1], P2[1], P3[1])]; });
  const half = i => 3.6 - (i / 20) * 2.2;
  const norm = i => { const a = ctr[Math.max(0, i - 1)], b = ctr[Math.min(20, i + 1)]; const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy); return [-dy / L, dx / L]; };
  const arD = poly([...ctr.map((p, i) => [p[0] + norm(i)[0] * half(i), p[1] + norm(i)[1] * half(i)]),
    ...ctr.map((p, i) => [p[0] - norm(i)[0] * half(i), p[1] - norm(i)[1] * half(i)]).reverse()]);
  const arMid = ctr.map(([lo, la], i) => `${i ? "L" : "M"}${LX(lo).toFixed(1)},${LY(la).toFixed(1)}`).join(" ");
  const jet = `M${LX(132)},${LY(34)} C${LX(165)},${LY(33)} ${LX(195)},${LY(31)} ${LX(215)},${LY(34)} S${LX(232)},${LY(38)} ${LX(239)},${LY(37.5)}`;
  return (
    <svg viewBox="0 0 1000 520" className="mc-svg en-basin" role="img"
      aria-label="Map of the Pacific in an El Niño winter: unusually warm water along the equator in the central and eastern Pacific, thunderstorms over it, a stronger jet stream reaching California, and an atmospheric river, the Pineapple Express, carrying tropical moisture from near Hawaii to the Bay Area.">
      <defs>
        <linearGradient id="enOcean" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7FA9C9" /><stop offset="0.6" stopColor="#9CC3DE" /><stop offset="1" stopColor="#86B2D2" />
        </linearGradient>
        <radialGradient id="enAnom" cx="0.55" cy="0.5" r="0.55">
          <stop offset="0" stopColor="#D9481F" stopOpacity="0.95" />
          <stop offset="0.55" stopColor="#EE8A45" stopOpacity="0.75" />
          <stop offset="1" stopColor="#F6C27A" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="enAR" gradientUnits="userSpaceOnUse" x1={LX(191)} y1={LY(13)} x2={LX(237.6)} y2={LY(37.8)}>
          <stop offset="0" stopColor="#F4FAFE" stopOpacity="0.55" />
          <stop offset="0.5" stopColor="#F4FAFE" stopOpacity="0.92" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="1" />
        </linearGradient>
        <filter id="enSoft"><feGaussianBlur stdDeviation="5" /></filter>
        <filter id="enSoft2"><feGaussianBlur stdDeviation="2.5" /></filter>
      </defs>
      <rect width="1000" height="520" fill="url(#enOcean)" />
      {/* latitude guides */}
      {[30, -15, 45, 15].map(la => <line key={la} x1="0" x2="1000" y1={LY(la)} y2={LY(la)} stroke="#fff" strokeOpacity="0.18" />)}
      <line x1="0" x2="1000" y1={eq} y2={eq} stroke="#fff" strokeWidth="1.4" strokeDasharray="6 6" strokeOpacity="0.7" />
      <text className="en-mt" x={LX(158)} y={eq - 8} style={{ fill: "#fff" }}>Equator</text>

      {/* 1 — the warm water */}
      <ellipse cx={LX(225)} cy={eq + 4} rx="300" ry="46" fill="url(#enAnom)" filter="url(#enSoft)" />
      <ellipse cx={LX(262)} cy={eq + 8} rx="70" ry="26" fill="#D9481F" opacity="0.55" filter="url(#enSoft)" />

      {/* land */}
      <path d={poly(NAM)} fill="url(#enLand)" stroke="#9D937F" strokeWidth="0.8" />
      <path d={poly(ASI)} fill="url(#enLand)" stroke="#9D937F" strokeWidth="0.8" />
      <path d={poly(AUS)} fill="url(#enLand)" stroke="#9D937F" strokeWidth="0.8" />
      {ISL.map((p, i) => <path key={i} d={poly(p)} fill="url(#enLand)" stroke="#9D937F" strokeWidth="0.8" />)}
      <path d={`M${LX(236.5)},${LY(41.5)} C${LX(238.5)},${LY(39.5)} ${LX(240.5)},${LY(37.5)} ${LX(242)},${LY(35.6)}`} stroke="#8E9C7C" strokeWidth="6" strokeLinecap="round" opacity="0.8" />

      {/* 2 — thunderstorms over the warm water */}
      {[[186, 2], [204, -1], [222, 3], [244, 0]].map(([lo, la], i) => (
        <g key={i}>
          <Cloud x={LX(lo)} y={LY(la) - 26} s={0.85} />
          <path d={`M${LX(lo) + 6},${LY(la) - 4} l-6,10 h6 l-5,11`} fill="none" stroke="#F2C94C" strokeWidth="2.2" strokeLinejoin="round" />
        </g>
      ))}
      <path d={`M${LX(215)},${LY(6)} C${LX(214)},${LY(14)} ${LX(214)},${LY(20)} ${LX(216)},${LY(27)}`} fill="none" stroke="#3D4650" strokeWidth="2" markerEnd="url(#enK)" opacity="0.55" strokeDasharray="5 4" />

      {/* 3 — the jet stream */}
      <path d={jet} fill="none" stroke="#fff" strokeWidth="12" opacity="0.45" strokeLinecap="round" />
      <path d={jet} fill="none" stroke={C.barHi} strokeWidth="4" markerEnd="url(#enN)" strokeLinecap="round" />

      {/* 4 — the atmospheric river and its storm */}
      <path d={arD} fill="url(#enAR)" filter="url(#enSoft2)" />
      <path d={arD} fill="none" stroke="#2F6FA8" strokeWidth="1.2" strokeOpacity="0.45" />
      <path d={arMid} fill="none" stroke="#2F6FA8" strokeWidth="2" strokeDasharray="2 5" strokeLinecap="round" opacity="0.8" />
      <g transform={`translate(${LX(222)},${LY(45)})`} opacity="0.95">
        <path d="M-46,-6 C-30,-34 18,-38 40,-14 C52,0 40,18 20,20 C8,22 -2,14 -6,6 C-12,22 -28,30 -40,24" fill="#fff" opacity="0.92" filter="url(#enSoft2)" />
        <text className="en-L" x="4" y="6" textAnchor="middle">L</text>
      </g>
      <text className="en-mt" x={LX(222) - 52} y={LY(45) - 20} textAnchor="end" style={HALO}>Storm</text>

      {/* places */}
      <PinIcon x={LX(202.2)} y={LY(20.8)} />
      <text className="en-mt" x={LX(202.2) - 10} y={LY(20.8) + 18} textAnchor="end" style={HALO}>Hawaii</text>
      <PinIcon x={LX(237.6)} y={LY(37.8)} me />
      <text className="en-mt en-mt-b" x={LX(237.6) + 10} y={LY(37.8) + 4} style={HALO}>San Francisco</text>
      <text className="en-mt" x={LX(242)} y={LY(35.6) + 18} style={HALO}>Sierra Nevada</text>
      <text className="en-mt" x={LX(150)} y={LY(52)} style={HALO}>Asia</text>
      <text className="en-mt" x={LX(132)} y={LY(-22)} style={HALO}>Australia</text>
      <text className="en-mt" x={LX(256)} y={LY(48)} style={HALO}>North America</text>
      <text className="en-mt" x={LX(283)} y={LY(-26)} textAnchor="end" style={HALO}>South America</text>
      <text className="en-mt" x={LX(150)} y={LY(14)} style={{ fill: "#fff" }}>Pacific Ocean</text>

      {/* callouts */}
      <text className="en-ml" x={LX(230)} y={eq + 62} textAnchor="middle" style={{ fill: "#7A2A0E", ...HALO }}>Unusually warm water</text>
      <text className="en-ml" x={LX(160)} y={LY(37) - 8} style={HALO}>Stronger jet stream</text>
      <text className="en-ml" x={LX(222)} y={LY(19)} style={HALO}>Atmospheric river</text>
      <text className="en-mt" x={LX(222)} y={LY(19) + 17} style={HALO}>the &ldquo;Pineapple Express&rdquo;</text>
      <Num n={1} x={LX(268)} y={eq + 30} />
      <Num n={2} x={LX(176)} y={LY(2) - 22} />
      <Num n={3} x={LX(148)} y={LY(37) - 13} />
      <Num n={4} x={LX(214)} y={LY(17)} />
      <Num n={5} x={LX(244)} y={LY(42)} />
    </svg>
  );
}

// ---------------------------------------------------------------- the river reaches land

export function RiverLands() {
  return (
    <svg viewBox="0 0 800 260" className="mc-svg en-land" role="img"
      aria-label="Cross-section from the Pacific to the Sierra Nevada: the atmospheric river's moist air is lifted by the coast hills and the Sierra, cools and drops heavy rain on the Bay Area, and snow above the snow level in the Sierra.">
      <defs>
        <linearGradient id="enStormSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8FA3B5" /><stop offset="1" stopColor="#C9D6E0" />
        </linearGradient>
      </defs>
      <rect width="800" height="260" fill="url(#enStormSky)" />
      <rect x="0" y="200" width="160" height="60" fill="url(#enSea)" />
      {/* terrain: coast hills, the valley, the Sierra */}
      <path d="M150,204 C170,196 190,170 214,160 C236,152 252,166 266,182 C280,196 300,204 330,206 L470,206 C520,200 560,170 600,128 C630,96 660,70 690,58 C712,52 730,64 750,92 C770,120 785,150 800,170 L800,260 L150,260 Z" fill="url(#enLand)" />
      <path d="M612,116 C632,94 660,70 690,58 C712,52 730,64 748,88 L726,96 C712,80 700,78 688,82 C664,92 640,106 624,122 Z" fill="#fff" opacity="0.95" />
      <line x1="560" x2="800" y1="120" y2="120" stroke="#fff" strokeWidth="1.2" strokeDasharray="5 4" />
      <text className="en-mt" x="796" y="114" textAnchor="end" style={HALO}>snow level</text>
      {/* the moist flow, lifted */}
      {[0, 1, 2].map(i => (
        <path key={i} d={`M0,${150 + i * 16} C120,${148 + i * 16} 180,${120 + i * 12} 230,${108 + i * 12} C330,${96 + i * 12} 480,${100 + i * 10} 560,${78 + i * 10} C620,${50 + i * 10} 660,${36 + i * 10} 700,${30 + i * 8}`}
          fill="none" stroke="#2F6FA8" strokeWidth="2.4" markerEnd="url(#enB)" opacity={0.85 - i * 0.2} />
      ))}
      <Cloud x={220} y={66} s={1.15} />
      <Cloud x={290} y={76} s={0.9} />
      <Cloud x={630} y={34} s={1.1} />
      <Cloud x={690} y={26} s={0.95} />
      {[600, 630, 660, 690, 715].map(x => <text key={x} x={x} y={x > 640 ? 76 : 96} className="en-snow">✻</text>)}
      <text className="en-mt en-mt-b" x="40" y="236" style={{ fill: "#fff" }}>Pacific</text>
      <PinIcon x={214} y={160} me />
      <text className="en-mt en-mt-b" x="214" y="186" textAnchor="middle" style={HALO}>Bay Area hills</text>
      <text className="en-mt" x="400" y="226" textAnchor="middle" style={HALO}>Central Valley</text>
      <text className="en-mt en-mt-b" x="690" y="170" textAnchor="middle" style={HALO}>Sierra Nevada · Lake Tahoe</text>
      <text className="en-ml" x="12" y="190" style={HALO}>Warm, moist air</text>
      <text className="en-mt" x="12" y="208" style={HALO}>from the tropics</text>
      <text className="en-mt" x="340" y="70" style={HALO}>Lifted by the hills: heavy rain</text>
      <text className="en-mt" x="664" y="190" textAnchor="middle" style={HALO}>Lifted again: rain below, snow above</text>
    </svg>
  );
}

// ---------------------------------------------------------------- rain, soil and runoff

const SOIL = "#8A6A4A", SOIL_D = "#6E5238", WET = "#4E6E8C";
const GROUND = "M0,96 C80,108 170,128 250,148 C300,160 350,166 400,168";
const below = d => `${d} L400,220 L0,220 Z`;
function RainLines({ n, heavy, x0 = 0, x1 = 400, y1 = 92 }) {
  return Array.from({ length: n }, (_, i) => {
    const x = x0 + ((i * 97) % (x1 - x0)), y = 8 + ((i * 53) % 40);
    return <line key={i} x1={x} y1={y} x2={x - (heavy ? 8 : 4)} y2={Math.min(y + (heavy ? 46 : 22), y1)} stroke={heavy ? "#2F5E86" : "#7FA3C2"} strokeWidth={heavy ? 2.2 : 1.3} strokeLinecap="round" />;
  });
}
const surfY = x => 96 + (72 * x) / 400 + (x > 250 ? 0 : -6 * Math.sin((x / 250) * Math.PI));
function Slope({ children, label, soil = SOIL }) {
  return (
    <svg viewBox="0 0 400 220" className="mc-svg fs-scene" role="img" aria-label={label}>
      <rect width="400" height="220" fill="url(#enSky)" />
      <path d={below(GROUND)} fill={soil} />
      <path d={`${GROUND} L400,180 C340,178 290,172 250,162 C170,142 80,122 0,110 Z`} fill="#7E8F5A" opacity="0.9" />
      {children}
    </svg>
  );
}
export function SoakScene() {
  return (
    <Slope label="Steady rain soaks into the soil: most of it sinks in and recharges the ground, and little runs off.">
      <Cloud x={120} y={20} s={1.1} /><Cloud x={290} y={26} s={1} />
      <RainLines n={22} />
      {[40, 90, 140, 190, 240, 300, 350].map(x => <path key={x} d={`M${x},${surfY(x) + 12} V${surfY(x) + 40}`} stroke="#BFE0F5" strokeWidth="2.4" markerEnd="url(#enB)" />)}
      <path d="M0,200 C120,196 260,198 400,204" stroke="#9CC3DE" strokeWidth="10" opacity="0.55" />
      <text className="fs-t-s" x="12" y="214" style={{ fill: "#fff" }}>Soil and groundwater refill</text>
      <path d="M330,168 L380,172" stroke="#2F6FA8" strokeWidth="1.6" markerEnd="url(#enB)" opacity="0.7" />
      <text className="fs-t-s" x="392" y="160" textAnchor="end" style={HALO}>a little runoff</text>
    </Slope>
  );
}
export function BurstScene() {
  return (
    <Slope label="A heavy burst falls faster than the soil can take it: most of it runs off the surface into creeks and drains, which overflow.">
      <Cloud x={110} y={18} s={1.3} /><Cloud x={230} y={14} s={1.4} /><Cloud x={340} y={20} s={1.2} />
      <RainLines n={60} heavy />
      {[30, 110, 190].map(x => <path key={x} d={`M${x},${surfY(x) - 4} C${x + 30},${surfY(x + 30) - 4} ${x + 50},${surfY(x + 50) - 4} ${x + 70},${surfY(x + 70) - 4}`} fill="none" stroke="#2F6FA8" strokeWidth="3.4" markerEnd="url(#enB)" />)}
      {[60, 160].map(x => <path key={x} d={`M${x},${surfY(x) + 12} V${surfY(x) + 22}`} stroke="#BFE0F5" strokeWidth="2" markerEnd="url(#enB)" />)}
      <rect x="318" y="164" width="40" height="7" fill="#3D4650" />
      {[322, 330, 338, 346, 354].map(x => <line key={x} x1={x} x2={x} y1="164" y2="171" stroke="#9AA0A6" />)}
      <path d="M300,166 C320,150 356,150 378,166" fill="#6E9DC0" opacity="0.85" />
      <text className="fs-t-l" x="392" y="140" textAnchor="end" style={HALO}>Drain overloaded</text>
      <text className="fs-t-s" x="12" y="214" style={{ fill: "#fff" }}>Little soaks in</text>
    </Slope>
  );
}
export function BurnScene() {
  return (
    <Slope soil={SOIL_D} label="On a burned slope, a water-repellent layer and bare ground send rain off the surface, carrying ash and soil downhill as a debris flow toward homes below.">
      <path d={`${GROUND} L400,174 C340,172 290,166 250,156 C170,136 80,116 0,104 Z`} fill="#4A4A4A" />
      {[50, 100, 160].map(x => (
        <g key={x}><line x1={x} x2={x} y1={surfY(x)} y2={surfY(x) - 34} stroke="#2B2B2B" strokeWidth="3" />
          <line x1={x} x2={x - 9} y1={surfY(x) - 22} y2={surfY(x) - 30} stroke="#2B2B2B" strokeWidth="2" /><line x1={x} x2={x + 8} y1={surfY(x) - 16} y2={surfY(x) - 25} stroke="#2B2B2B" strokeWidth="2" /></g>
      ))}
      <Cloud x={200} y={18} s={1.2} />
      <RainLines n={34} heavy x0={120} x1={300} />
      <path d={`M120,${surfY(120) - 3} C200,${surfY(200) - 6} 260,${surfY(260) - 8} 318,${surfY(318) - 9}`} fill="none" stroke="#7A5A3A" strokeWidth="9" strokeLinecap="round" opacity="0.9" />
      <path d={`M120,${surfY(120) - 3} C200,${surfY(200) - 6} 260,${surfY(260) - 8} 318,${surfY(318) - 9}`} fill="none" stroke="#B8956A" strokeWidth="2" markerEnd="url(#enK)" strokeDasharray="5 4" />
      <rect x="334" y="142" width="34" height="24" fill="#fff" stroke="#8D8573" /><path d="M330,142 L351,128 L372,142 Z" fill="#B78D6A" />
      <text className="fs-t-l" x="200" y={surfY(200) + 26} textAnchor="middle" style={{ fill: "#fff" }}>Debris flow</text>
      <text className="fs-t-s" x="12" y="214" style={{ fill: "#fff" }}>Water-repellent burned layer: rain runs off</text>
    </Slope>
  );
}
export function SlideScene() {
  return (
    <Slope soil={WET} label="After a wet season the hillside soil is nearly saturated; an intense storm on top of it can set off a shallow landslide.">
      <Cloud x={200} y={18} s={1.2} />
      <RainLines n={34} heavy x0={110} x1={300} />
      <path d={`M150,${surfY(150) - 1} C175,${surfY(175) + 26} 230,${surfY(230) + 30} 262,${surfY(262) + 2}`} fill="none" stroke="#fff" strokeWidth="2" strokeDasharray="5 4" />
      <path d={`M150,${surfY(150) - 1} C175,${surfY(175) + 26} 230,${surfY(230) + 30} 262,${surfY(262) + 2} L292,${surfY(292) - 6} C250,${surfY(240) - 14} 200,${surfY(200) - 10} 160,${surfY(160) + 6} Z`} fill="#7A6040" opacity="0.92" />
      <path d={`M180,${surfY(180) + 4} L250,${surfY(250) + 4}`} stroke="#3D4650" strokeWidth="2" markerEnd="url(#enK)" />
      <rect x="92" y={surfY(110) - 26} width="32" height="22" fill="#fff" stroke="#8D8573" /><path d={`M88,${surfY(110) - 26} L108,${surfY(110) - 40} L128,${surfY(110) - 26} Z`} fill="#B78D6A" />
      <text className="fs-t-l" x="226" y={surfY(226) + 48} textAnchor="middle" style={{ fill: "#fff" }}>Shallow landslide</text>
      <text className="fs-t-s" x="12" y="214" style={{ fill: "#fff" }}>Soil near saturation after about 10 inches of season rain</text>
    </Slope>
  );
}
export const RUNOFF_SCENES = [SoakScene, BurstScene, BurnScene, SlideScene];

// The shoreline street at a high tide: the drain can't empty, Bay water pushes
// back up the pipe, water rises through drains and manholes, and runs down
// into the station below.
export function DrainScene() {
  return (
    <svg viewBox="0 0 800 300" className="mc-svg en-land" role="img"
      aria-label="Cross-section of a San Francisco shoreline street in a storm at high tide: rain fills the combined sewer, the Bay covers the outfall so the pipe can't drain, Bay water pushes back into the pipe, water rises out of drains and manholes onto the street and runs down the entrance into the subway station below.">
      <rect width="800" height="300" fill="url(#enStormSky)" />
      <Cloud x={160} y={22} s={1.2} /><Cloud x={300} y={18} s={1.3} /><Cloud x={450} y={24} s={1.1} />
      <RainLines n={70} heavy x0={60} x1={560} y1={104} />
      {/* buildings */}
      <rect x="20" y="40" width="70" height="66" fill="#C9C1B2" /><rect x="96" y="58" width="52" height="48" fill="#D7D0C2" />
      {/* street and ground */}
      <rect x="0" y="106" width="610" height="10" fill="#5C6168" />
      <rect x="0" y="116" width="610" height="184" fill="#B5AB99" />
      {/* seawall and the Bay at high tide */}
      <rect x="604" y="96" width="14" height="204" fill="#8D8573" />
      <rect x="618" y="128" width="182" height="172" fill="url(#enSea)" />
      <path d="M618,128 C660,120 700,134 740,124 C770,118 790,126 800,122 L800,300 L618,300 Z" fill="#6E9DC0" opacity="0.6" />
      <line x1="618" x2="800" y1="170" y2="170" stroke="#fff" strokeDasharray="6 4" strokeWidth="1.2" />
      <text className="fs-t-s" x="794" y="164" textAnchor="end" style={{ fill: "#fff" }}>normal high tide</text>
      <text className="fs-t-l" x="794" y="146" textAnchor="end" style={HALO}>King Tide + El Niño + surge</text>
      {/* the combined sewer and its outfall */}
      <path d="M40,214 H620" stroke="#4F5A64" strokeWidth="26" />
      <path d="M40,214 H620" stroke="#6E9DC0" strokeWidth="20" />
      <text className="fs-t-s" x="60" y="248" style={{ fill: "#131A25" }}>Combined sewer: rain and sewage share one pipe</text>
      <path d="M520,214 H460" stroke="#2F6FA8" strokeWidth="3" markerEnd="url(#enB)" />
      <path d="M600,214 H540" stroke="#2F6FA8" strokeWidth="3" markerEnd="url(#enB)" />
      <text className="fs-t-s" x="560" y="200" textAnchor="middle" style={HALO}>Bay water pushes back</text>
      <text className="fs-t-s" x="700" y="236" textAnchor="middle" style={{ fill: "#fff" }}>outfall under water</text>
      {/* drain inlet and manhole overflowing */}
      <rect x="196" y="106" width="16" height="108" fill="#4F5A64" opacity="0.6" />
      <path d="M180,104 C190,84 218,84 228,104" fill="#6E9DC0" />
      <path d="M204,140 V92" stroke="#2F6FA8" strokeWidth="2.6" markerEnd="url(#enB)" />
      <text className="fs-t-l" x="204" y="76" textAnchor="middle" style={HALO}>Water rises out of drains</text>
      {/* subway station below the street */}
      <rect x="300" y="132" width="230" height="60" rx="4" fill="#E9E4DA" stroke="#8D8573" />
      <rect x="312" y="176" width="206" height="10" fill="#9AA0A6" />
      <path d="M300,106 L300,116 L330,116 L360,150 L372,150" fill="none" stroke="#8D8573" strokeWidth="3" />
      <path d="M302,108 C320,118 340,132 362,146" fill="none" stroke="#2F6FA8" strokeWidth="3" markerEnd="url(#enB)" />
      <path d="M330,186 H500" stroke="#6E9DC0" strokeWidth="6" opacity="0.8" />
      <text className="fs-t-l" x="415" y="160" textAnchor="middle" style={{ fill: "#131A25" }}>Subway station</text>
      <text className="fs-t-s" x="470" y="124" textAnchor="middle" style={HALO}>runs down entrances; pumps fall behind</text>
    </svg>
  );
}
