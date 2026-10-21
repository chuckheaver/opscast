// How fog forms and moves, step by step — the graphic that sits under the
// "A Summer Day in SF" clock on /microclimates. Server components only, like
// charts.jsx: SVG scenes, HTML text, no client JavaScript.
//
// Steps 1–5 make the fog (cold water → saturation → the lid → the inland pull).
// Steps 6–10 follow it over the peninsula and use the same five phases as the
// clock above, so the two graphics read as one.
//
// Temperatures are typical July values for the west side — a schematic of the
// pattern, not a measurement.

import { C, CLOCK } from "./charts";

const SKY = "#F7F9FA", WATER = "#B5CCDC", WATER_D = "#8FB0C8", LAND = "#CBC4B8";
const WARM_SKY = "#FBF1DC", FOG = "#DCE6EE", SUN = "#E9B949";
const FP = { fill: FOG, stroke: "#7F9DB5", strokeWidth: 1.5 };

// Arrowheads and the warm→cool air gradient, defined once for every scene.
function Defs() {
  const head = (id, color) => (
    <marker id={id} markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
      <path d="M0,0 L8,4 L0,8 Z" fill={color} />
    </marker>
  );
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
      <defs>
        {head("fsN", C.barHi)}
        {head("fsW", C.warm)}
        {head("fsK", "#6B6F75")}
        <linearGradient id="fsAir" gradientUnits="userSpaceOnUse" x1="20" y1="0" x2="380" y2="0">
          <stop offset="0" stopColor={C.warm} />
          <stop offset="1" stopColor={C.barHi} />
        </linearGradient>
      </defs>
    </svg>
  );
}

function Scene({ label, children }) {
  return (
    <svg viewBox="0 0 400 200" className="mc-svg fs-scene" role="img" aria-label={label}>
      <rect width="400" height="200" fill={SKY} />
      {children}
    </svg>
  );
}

const T = ({ x, y, children, k = "s", ...rest }) => (
  <text className={`fs-t-${k}`} x={x} y={y} {...rest}>{children}</text>
);

// A scatter of dots: vapour (small, faint) or fog droplets (larger, outlined).
function Dots({ pts, r = 2, drop }) {
  return pts.map(([x, y], i) => (
    <circle key={i} cx={x} cy={y} r={r}
      fill={drop ? "#fff" : C.ramp[1]} fillOpacity={drop ? 0.9 : 0.55}
      stroke={drop ? C.ramp[2] : "none"} strokeWidth="1" />
  ));
}

const VAPOUR = [[40, 62], [78, 96], [120, 54], [150, 88], [186, 66], [226, 100], [262, 58], [300, 92], [340, 70], [366, 104], [96, 118], [210, 122], [320, 120]];
const DROPS = [[222, 110], [248, 102], [276, 114], [304, 104], [332, 116], [362, 106], [236, 126], [266, 128], [298, 124], [328, 130], [356, 124], [384, 116]];

// ---------------------------------------------------------- steps 1 – 5

function S1() {
  return (
    <Scene label="Wind along the coast pushes surface water out to sea, and cold deep water rises to replace it.">
      <rect y="104" width="400" height="96" fill={WATER} />
      <rect y="140" width="400" height="60" fill={WATER_D} />
      <path d="M296,200 L326,114 L400,104 V200 Z" fill={LAND} />
      <path d="M20,40 H132" stroke="#6B6F75" strokeWidth="2" markerEnd="url(#fsK)" />
      <T x="20" y="30">Wind along the coast</T>
      <path d="M300,86 H196" stroke="#6B6F75" strokeWidth="2" markerEnd="url(#fsK)" />
      <T x="20" y="90">Surface water pushed out</T>
      {[170, 220, 268].map(x => (
        <path key={x} d={`M${x},190 V132`} stroke={C.barHi} strokeWidth="2.5" markerEnd="url(#fsN)" />
      ))}
      <T x="16" y="162" k="l">Cold water rises</T>
      <T x="16" y="180">52–56°F, even in July</T>
    </Scene>
  );
}

function S2() {
  return (
    <Scene label="Warm, humid air carrying invisible water vapor blows in over the cold ocean.">
      <rect y="150" width="400" height="50" fill={WATER_D} />
      <Dots pts={VAPOUR} />
      {[48, 82, 116].map(y => (
        <path key={y} d={`M20,${y} C100,${y - 12} 160,${y + 12} 230,${y} S340,${y - 8} 382,${y}`}
          fill="none" stroke="url(#fsAir)" strokeWidth="2.5" markerEnd="url(#fsN)" />
      ))}
      <T x="20" y="24" k="l" fill={C.warmText}>Warm, humid air</T>
      <T x="190" y="24">Air 62°F</T>
      <T x="20" y="146">invisible water vapor</T>
      <T x="16" y="180" k="l">Ocean 54°F</T>
      <T x="250" y="146">dew point 54°F</T>
    </Scene>
  );
}

function S3() {
  return (
    <Scene label="Air cooled to its dew point is saturated: the water vapor condenses into fog droplets.">
      <rect y="150" width="400" height="50" fill={WATER_D} />
      <path d="M190,150 V104 Q300,84 400,100 V150 Z" {...FP} fillOpacity="0.8" />
      <Dots pts={VAPOUR.slice(0, 7).map(([x, y]) => [x * 0.45, y + 12])} />
      <Dots pts={DROPS} r={3.4} drop />
      <T x="16" y="30">Air</T>
      <rect x="96" y="20" width="96" height="11" rx="3" fill={C.warm} />
      <T x="198" y="30" k="v">54°F</T>
      <T x="16" y="54">Dew point</T>
      <rect x="96" y="44" width="96" height="11" rx="3" fill={C.barHi} />
      <T x="198" y="54" k="v">54°F</T>
      <T x="250" y="40" k="l">equal = saturated</T>
      <T x="250" y="58">100% humidity</T>
      <T x="236" y="146" k="l" fill={C.barHi}>FOG</T>
      <T x="16" y="180" k="l">Ocean 54°F</T>
    </Scene>
  );
}

function S4() {
  return (
    <Scene label="Sinking air from the North Pacific High forms a warm lid, an inversion, that traps a flat marine layer of cool fog-filled air beneath it.">
      <rect width="400" height="68" fill={WARM_SKY} />
      <circle cx="44" cy="34" r="19" fill="none" stroke={C.barHi} strokeWidth="2" />
      <T x="44" y="41" k="big" textAnchor="middle">H</T>
      {[96, 136, 176].map(x => (
        <path key={x} d={`M${x},14 V52`} stroke={C.warm} strokeWidth="2" markerEnd="url(#fsW)" />
      ))}
      <T x="206" y="30" fill={C.warmText}>Warm, dry air</T>
      <T x="206" y="48">sinks from above</T>
      <path d="M0,68 H400" stroke={C.warm} strokeWidth="3" />
      <T x="206" y="86" k="l" fill={C.warmText}>Inversion: the lid</T>
      <path d="M0,102 Q100,90 200,100 T400,98 V146 H0 Z" {...FP} />
      <T x="20" y="126" k="k" fill={C.barHi}>MARINE LAYER</T>
      <path d="M300,140 V108" stroke={C.barHi} strokeWidth="2" markerEnd="url(#fsN)" />
      <path d="M290,102 H312" stroke={C.warm} strokeWidth="3" />
      <T x="322" y="132">can’t rise</T>
      <rect y="146" width="400" height="54" fill={WATER_D} />
      <T x="16" y="180" k="l">Cold ocean</T>
    </Scene>
  );
}

function S5() {
  return (
    <Scene label="Hot air rises over the Central Valley, leaving low pressure. Higher pressure over the cool ocean pushes air toward it, through the Golden Gate.">
      <path d="M0,112 H150 L172,86 H400 V150 H0 Z" {...FP} fillOpacity="0.7" />
      <rect y="150" width="130" height="50" fill={WATER_D} />
      <path d="M130,200 L148,150 L170,108 L186,146 L192,150 L216,112 L244,150 L252,200 Z" fill={LAND} />
      <rect x="252" y="150" width="148" height="50" fill="#F0E6D2" />
      <circle cx="40" cy="34" r="17" fill="none" stroke={C.barHi} strokeWidth="2" />
      <T x="40" y="41" k="big" textAnchor="middle">H</T>
      <T x="68" y="30" k="l">High pressure</T>
      <T x="68" y="48">cool ocean air</T>
      <circle cx="356" cy="34" r="17" fill="none" stroke={C.warm} strokeWidth="2" />
      <T x="356" y="41" k="big" textAnchor="middle" fill={C.warmText}>L</T>
      <T x="326" y="30" k="l" textAnchor="end" fill={C.warmText}>Low pressure</T>
      <T x="326" y="48" textAnchor="end">hot rising air</T>
      {[290, 330, 370].map(x => (
        <path key={x} d={`M${x},146 V82`} stroke={C.warm} strokeWidth="2.5" markerEnd="url(#fsW)" />
      ))}
      <path d="M24,134 H300" stroke={C.barHi} strokeWidth="3" markerEnd="url(#fsN)" />
      <T x="16" y="176" k="l">Pacific</T>
      <T x="140" y="184" k="l">Golden Gate</T>
      <T x="262" y="176" k="l">Valley</T>
      <T x="262" y="192">95–105°F</T>
    </Scene>
  );
}

// ---------------------------------------------------- steps 6 – 10 (peninsula)

// West → east: Pacific · west side · the ridge (Mount Davidson / Twin Peaks) ·
// the bayside neighborhoods · the Bay. `fog` is drawn behind the land so the
// land line cuts it; `tongue` is drawn in front, spilling over the ridge.
function Peninsula({ label, fog, tongue, sun, children }) {
  return (
    <Scene label={label}>
      <rect y="152" width="66" height="48" fill={WATER} />
      {fog}
      <path d="M62,152 L90,142 L140,138 L180,110 L215,72 L245,98 L285,128 L305,148 L372,150 L372,140 L400,112 V200 H62 Z" fill={LAND} />
      <rect x="308" y="154" width="64" height="46" fill={WATER} />
      {tongue}
      {sun}
      <T x="14" y="188">Pacific</T>
      <T x="112" y="176">West side</T>
      <T x="215" y="62" textAnchor="middle">Ridge</T>
      <T x="258" y="176">Bayside</T>
      <T x="340" y="188" textAnchor="middle">Bay</T>
    </Scene>
  );
}

const sunAt = (x, y) => (
  <g>
    <circle cx={x} cy={y} r="13" fill={SUN} />
    {[0, 45, 90, 135, 180, 225, 270, 315].map(a => (
      <line key={a} x1={x + 18 * Math.cos(a * Math.PI / 180)} y1={y + 18 * Math.sin(a * Math.PI / 180)}
        x2={x + 24 * Math.cos(a * Math.PI / 180)} y2={y + 24 * Math.sin(a * Math.PI / 180)}
        stroke={SUN} strokeWidth="2.5" strokeLinecap="round" />
    ))}
  </g>
);

function S6() {
  return (
    <Peninsula
      label="Midnight to 8am: a thick fog deck fills the west side and stacks against the west slope of the ridge."
      fog={<path d="M0,98 L120,92 L196,88 L226,108 L226,152 H0 Z" {...FP} fillOpacity="0.95" />}
      tongue={<path d="M214,80 Q226,86 236,100 L228,104 Q220,94 212,90 Z" {...FP} fillOpacity="0.9" />}
    >
      {null}
    </Peninsula>
  );
}

function S7() {
  return (
    <Peninsula
      label="8am to noon: the sun warms the land and the fog burns back toward the ocean, bayside first."
      sun={sunAt(330, 40)}
      fog={
        <g>
          <path d="M0,112 L70,108 L150,126 L170,152 H0 Z" {...FP} fillOpacity="0.8" />
          {[110, 140, 168].map(x => (
            <path key={x} d={`M${x},124 V100`} stroke="#6B6F75" strokeWidth="1.8" strokeDasharray="3 3" markerEnd="url(#fsK)" />
          ))}
        </g>
      }
    />
  );
}

function S8() {
  return (
    <Peninsula
      label="Noon to 3pm: the city is in full sun and the fog sits as a bank offshore."
      sun={sunAt(330, 40)}
      fog={<path d="M0,128 L30,124 L60,134 L66,152 H0 Z" {...FP} fillOpacity="0.7" />}
    />
  );
}

function S9() {
  return (
    <Peninsula
      label="3pm to 7pm: the Valley is at its hottest and pulls the fog bank back in through the Golden Gate and onto the west side."
      sun={sunAt(330, 40)}
      fog={
        <g>
          <path d="M0,112 L60,104 L128,116 L150,152 H0 Z" {...FP} fillOpacity="0.9" />
          <path d="M26,92 H134" stroke={C.barHi} strokeWidth="2.5" markerEnd="url(#fsN)" />
        </g>
      }
    />
  );
}

function S10() {
  return (
    <Peninsula
      label="7pm to midnight: the fog thickens over the west side and spills over the saddles of the ridge into the bayside neighborhoods."
      fog={<path d="M0,96 L120,90 L196,84 L246,104 L262,128 L262,152 H0 Z" {...FP} fillOpacity="0.95" />}
      tongue={
        <g>
          <path d="M214,78 Q244,84 262,112 L276,134 Q246,122 214,96 Z" {...FP} fillOpacity="0.9" />
          <path d="M226,70 Q262,76 286,100" fill="none" stroke={C.barHi} strokeWidth="2.5" markerEnd="url(#fsN)" />
        </g>
      }
    />
  );
}

// ------------------------------------------------------------- step content

// chip tone: "hot" = the gap has closed (fog), "clear" = a wide gap (sky open)
const STEPS = [
  {
    h: "Cold water wells up", when: "Always, strongest in summer", Scene: S1,
    p: "Wind blowing down the coast pushes warm surface water out to sea. Deep, cold water rises to replace it. This is the California Current, and it stays near 52–56°F all summer.",
    read: [["Ocean", "52–56°F"]],
  },
  {
    h: "Warm, humid air arrives", when: "Across the open Pacific", Scene: S2,
    p: "The air over the ocean is warmer than the water and carries invisible water vapor. Its dew point is the temperature it would have to cool to before it can’t hold that vapor any more.",
    read: [["Air", "62°F"], ["Dew point", "54°F"], ["Gap", "8°"]],
  },
  {
    h: "Air meets its dew point", when: "Over the cold water", Scene: S3,
    p: "Chilled from below, the air cools until its temperature equals its dew point. It is now saturated, 100% humid, and the vapor condenses into billions of tiny droplets. A cloud on the surface is fog.",
    read: [["Air", "54°F"], ["Dew point", "54°F"], ["Gap", "0°", "closed"]],
  },
  {
    h: "A lid holds it down", when: "May to September", Scene: S4,
    p: "The North Pacific High sinks warm, dry air from above, which forms a lid: an inversion. The cool, foggy air can’t climb through it, so it spreads out as a flat sheet called the marine layer.",
    read: [["Fog top", "800–1,500 ft"]],
  },
  {
    h: "Inland heat pulls it ashore", when: "Afternoon", Scene: S5,
    p: "The Central Valley bakes. Its hot air rises and leaves low pressure behind. The cooler, high-pressure air at the coast flows toward it, a sea breeze that drags the marine layer through the Golden Gate.",
    read: [["Valley", "95–105°F"], ["Coast", "low 60s"]],
  },
  {
    h: "Thickest", when: "Midnight – 8am", Scene: S6,
    p: "Nights are cool and the lid holds. Air stays within a degree or two of its dew point, so the fog is solid. It stacks against the west slope of the ridge and leaks through the saddles.",
    read: [["Air", "55°F"], ["Dew point", "54°F"], ["Gap", "1°", "closed"]],
  },
  {
    h: "Burns back", when: "8am – noon", Scene: S7,
    p: "The sun heats the ground, and the ground heats the air. Air temperature climbs away from the dew point, and the droplets evaporate. The fog thins from the top and retreats from the bay side first.",
    read: [["Air", "58 → 65°F"], ["Dew point", "53°F"], ["Gap", "5 → 12°", "clear"]],
  },
  {
    h: "Clearest", when: "Noon – 3pm", Scene: S8,
    p: "The gap is at its widest and the sky is open. The fog sits as a bank just off the coast, waiting. Inland, the Valley keeps heating.",
    read: [["Air", "65°F"], ["Dew point", "52°F"], ["Gap", "13°", "clear"]],
  },
  {
    h: "The push", when: "3pm – 7pm", Scene: S9,
    p: "The Valley peaks and the pull is strongest. The bank rolls back through the Golden Gate and lands on the west side first, on a 15–25 mph sea breeze. Air cools to its dew point again.",
    read: [["Air", "62 → 56°F"], ["Dew point", "55°F"], ["Gap", "7 → 1°"]],
  },
  {
    h: "Over the ridge", when: "7pm – midnight", Scene: S10,
    p: "After sunset the land cools and the lid still holds. The deck deepens and spills over the ridge’s saddles into the bayside neighborhoods overnight. Tomorrow it starts again.",
    read: [["Air", "56°F"], ["Dew point", "54°F"], ["Gap", "2°", "closed"]],
  },
];

const WORDS = [
  { k: "Dew point", p: "The temperature at which air can’t hold its water vapor any more. The closer the air is to it, the more humid it feels." },
  { k: "Saturation", p: "Air at its dew point holds all the vapor it can: 100% relative humidity. Cool it any further and the extra water becomes droplets." },
  { k: "Marine layer", p: "The cool, moist, foggy air that sits on top of the ocean, a few hundred to 1,500 feet deep." },
  { k: "Inversion", p: "Normally air gets colder with height. Under a High it gets warmer, which makes a warm lid that traps the marine layer below." },
  { k: "High & Low", p: "Air flows from high pressure to low. A High sits over the cool Pacific and a Low forms over the hot Valley, so the wind blows ashore." },
];

// ---------------------------------------------------------------- the gap chart

// Air temperature = dew point + a gap that follows the fog clock above. Dew
// point is nearly flat; it is the air temperature that moves.
const GAP = [13, 7, 4, 2, 1];                     // by fog level 0 (clear) … 4 (solid)
const DEW = h => (h >= 8 && h < 16 ? 53 - (h >= 10 && h <= 13 ? 1 : 0) : 54);
const AIR = CLOCK.map((v, h) => DEW(h) + GAP[v]);

const X0 = 54, W = 626, Y0 = 16, H = 200, TMIN = 50, TMAX = 70;
const px = h => X0 + (h / 24) * W;
const py = t => Y0 + ((TMAX - t) / (TMAX - TMIN)) * H;
const line = arr => arr.map((t, h) => `${h ? "L" : "M"}${px(h + 0.5).toFixed(1)},${py(t).toFixed(1)}`).join(" ");

export function FogGap() {
  const dew = CLOCK.map((_, h) => DEW(h));
  const foggy = CLOCK.map(v => v >= 3);
  const bands = [];
  foggy.forEach((f, h) => {
    if (!f) return;
    const last = bands[bands.length - 1];
    if (last && last[1] === h) last[1] = h + 1; else bands.push([h, h + 1]);
  });
  return (
    <figure className="mc-fig">
      <p className="mc-fig-h">The gap that makes the fog</p>
      <div className="mc-scroll">
        <svg viewBox="0 0 700 262" className="mc-svg mc-diagram" role="img"
          aria-label="Air temperature and dew point through a summer day on the west side. At night and in the evening the two lines nearly touch and it is foggy. From late morning to mid-afternoon air temperature climbs about 11 degrees above the dew point and the fog burns off.">
          <rect width="700" height="262" rx="14" fill="#F7F9FA" />
          {[50, 55, 60, 65, 70].map(t => (
            <g key={t}>
              <line x1={X0} x2={X0 + W} y1={py(t)} y2={py(t)} stroke={C.line} />
              <text className="fs-t-s" x={X0 - 8} y={py(t) + 4} textAnchor="end">{t}°</text>
            </g>
          ))}
          {bands.map(([a, b]) => (
            <rect key={a} x={px(a)} y={Y0} width={px(b) - px(a)} height={H} fill="#B6C7D6" fillOpacity="0.5" />
          ))}
          <text className="fs-t-k" x={px(4)} y={Y0 + 16} textAnchor="middle" fill={C.barHi}>FOG</text>
          <text className="fs-t-k" x={px(20)} y={Y0 + 16} textAnchor="middle" fill={C.barHi}>FOG</text>
          <text className="fs-t-k" x={px(12)} y={Y0 + 16} textAnchor="middle" fill={C.warmText}>CLEAR</text>
          <path d={line(dew)} fill="none" stroke={C.barHi} strokeWidth="3" />
          <path d={line(AIR)} fill="none" stroke={C.warm} strokeWidth="3" />
          <text className="fs-t-l" x={px(1.2)} y={py(54) + 24} fill={C.barHi}>Dew point</text>
          <text className="fs-t-l" x={px(15.4)} y={py(62)} fill={C.warmText}>Air temperature</text>
          <path d={`M${px(12.5)},${py(52)} V${py(65)}`} stroke="#6B6F75" strokeWidth="2" markerStart="url(#fsK)" markerEnd="url(#fsK)" />
          <text className="fs-t-v" x={px(12.5) + 8} y={py(59) + 5}>13° gap</text>
          {[0, 6, 12, 18, 24].map(h => (
            <text key={h} className="fs-t-s" x={px(h)} y={Y0 + H + 22} textAnchor={h === 0 ? "start" : h === 24 ? "end" : "middle"}>
              {h === 0 || h === 24 ? "12am" : h === 12 ? "noon" : h < 12 ? `${h}am` : `${h - 12}pm`}
            </text>
          ))}
        </svg>
      </div>
      <figcaption className="mc-cap">Fog holds while the air is within about 2° of its dew point. Typical July day on the west side; schematic, not a measurement.</figcaption>
    </figure>
  );
}

// ----------------------------------------------------------------- the story

function Step({ n, s }) {
  return (
    <li className="fs-step">
      <div className="fs-head">
        <span className="fs-n" aria-hidden="true">{n}</span>
        <div>
          <h4>{s.h}</h4>
          <em>{s.when}</em>
        </div>
      </div>
      <s.Scene />
      <p>{s.p}</p>
      <div className="fs-read">
        {s.read.map(([k, v, tone]) => (
          <span key={k} className={tone ? `fs-${tone}` : undefined}>{k} <b>{v}</b></span>
        ))}
      </div>
    </li>
  );
}

export function FogStory() {
  return (
    <>
      <Defs />
      <figure className="mc-fig">
        <p className="mc-fig-h">How fog forms, step by step</p>
        <dl className="fs-words">
          {WORDS.map(w => (
            <div key={w.k}><dt>{w.k}</dt><dd>{w.p}</dd></div>
          ))}
        </dl>

        <h4 className="fs-part">Steps 1–5 · Making the fog</h4>
        <ol className="fs-steps">
          {STEPS.slice(0, 5).map((s, i) => <Step key={s.h} n={i + 1} s={s} />)}
        </ol>

        <h4 className="fs-part">Steps 6–10 · A day over the peninsula</h4>
        <ol className="fs-steps" start={6}>
          {STEPS.slice(5).map((s, i) => <Step key={s.h} n={i + 6} s={s} />)}
        </ol>
        <p className="mc-cap">Schematic cross-section, west to east, not to scale. Temperatures are typical July values for the west side.</p>
      </figure>
      <FogGap />
    </>
  );
}
