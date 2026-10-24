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

const COAST = "M236,0 C240,18 244,32 248,46 C252,62 256,82 262,104 C266,120 272,138 280,156 C286,170 292,186 300,206 L306,230 L400,230 L400,0 Z";
const JET = {
  normal: "M0,74 C90,48 170,34 248,50 C300,60 350,64 400,62",
  nino: "M0,128 C110,118 200,122 272,134 C322,142 360,140 400,134",
  nina: "M0,116 C70,126 140,50 196,26 C236,10 262,26 282,60 C312,116 350,150 400,166",
};
export function Jet({ state }) {
  const label = {
    normal: "Neutral: the jet stream and storm track aim mostly at the Pacific Northwest.",
    nino: "El Niño: a stronger, straighter jet stream aims at California, often farther south.",
    nina: "La Niña: high pressure off California bends the jet stream north toward the Pacific Northwest and Canada.",
  }[state];
  const storms = { normal: [[176, 32], [236, 46]], nino: [[150, 114], [214, 118], [270, 128]], nina: [[196, 14]] }[state];
  return (
    <svg viewBox="0 0 400 230" className="mc-svg fs-scene" role="img" aria-label={label}>
      <rect width="400" height="230" fill="url(#enSea)" />
      <path d={COAST} fill="url(#enLand)" />
      <path d={JET[state]} fill="none" stroke="#fff" strokeWidth="9" opacity="0.55" strokeLinecap="round" />
      <path d={JET[state]} fill="none" stroke={C.barHi} strokeWidth="3.2" markerEnd="url(#enN)" strokeLinecap="round" />
      {storms.map(([x, y], i) => <Cloud key={i} x={x} y={y - 14} s={0.62} />)}
      {state === "nina" && <text className="fs-t-big" x="190" y="150" textAnchor="middle" fill={C.warmText}>H</text>}
      {state === "nina" && <text className="fs-t-s" x="190" y="168" textAnchor="middle" style={HALO}>High pressure</text>}
      {[["Seattle", 249, 48], ["San Francisco", 263, 108, true], ["Los Angeles", 283, 160]].map(([n, x, y, me]) => (
        <g key={n}>
          <circle cx={x} cy={y} r={me ? 4 : 3} fill={me ? C.barHi : "#3D4650"} stroke="#fff" strokeWidth="1.2" />
          <text className={me ? "fs-t-l" : "fs-t-s"} x={x + 8} y={y + 4} style={HALO}>{n}</text>
        </g>
      ))}
      <text className="fs-t-s" x="10" y="220" style={HALO}>Pacific Ocean</text>
      <text className="fs-t-s" x="10" y={state === "normal" ? 66 : state === "nino" ? 120 : 108} style={HALO}>Jet stream</text>
    </svg>
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
