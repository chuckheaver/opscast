// How fog forms and moves, step by step — the graphic that sits under the
// "A Summer Day in SF" clock on /microclimates. Server components only, like
// charts.jsx: SVG scenes, HTML text, no client JavaScript.
//
// Steps 1–5 make the fog (cold water → saturation → the lid → the inland pull).
// Steps 6–10 follow it over the peninsula and use the same five phases as the
// clock above, so the two graphics read as one.
//
// Temperatures are typical July values for the west side — a schematic of the
// pattern, not a measurement. Place names follow the owner's cross-section
// (Oct 22 2026): Pacific Ocean, Cold California Current water, Warm moist air,
// Sea breeze, Golden Gate Gap, Cool fog layer, East Bay hills.

import { C, CLOCK } from "./charts";

// Gradients, soft-edged fog and halo'd labels give the scenes depth; fill
// colours are url() references defined once in <Defs/>.
const SKY = "url(#fsSky)", WATER = "url(#fsWater)", WATER_D = "url(#fsWaterD)", LAND = "url(#fsLand)";
const FOG = "url(#fsFog)";
const SUN = "#E9B949";
const HALO = { paintOrder: "stroke", stroke: "rgba(255,255,255,0.92)", strokeWidth: 3.2, strokeLinejoin: "round" };

// Arrowheads, gradients and filters, defined once for every scene.
function Defs() {
  const head = (id, color) => (
    <marker id={id} markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
      <path d="M0,0 L8,4 L0,8 Z" fill={color} />
    </marker>
  );
  const v = (id, a, b, extra = {}) => (
    <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor={a} stopOpacity={extra.a ?? 1} />
      <stop offset="1" stopColor={b} stopOpacity={extra.b ?? 1} />
    </linearGradient>
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
        {v("fsSky", "#A9CBE6", "#DCEBF6")}
        {v("fsWarmSky", "#F6D993", "#FBEBC4")}
        {v("fsWater", "#8DB5D0", "#5F8EAE")}
        {v("fsWaterD", "#74A1C0", "#4A7A9C")}
        {v("fsLand", "#DAD1C1", "#B5AB99")}
        {v("fsHill", "#CBC9BC", "#A3A08F")}
        {v("fsValley", "#F4E6C8", "#E2CDA0")}
        {v("fsFog", "#FFFFFF", "#A9BED0", { a: 1, b: 0.96 })}
        <radialGradient id="fsSunG">
          <stop offset="0" stopColor="#FFE7A3" stopOpacity="0.95" />
          <stop offset="1" stopColor="#FFE7A3" stopOpacity="0" />
        </radialGradient>
        <filter id="fsBlur" x="-12%" y="-45%" width="124%" height="190%"><feGaussianBlur stdDeviation="2.4" /></filter>
        <filter id="fsBlur2" x="-35%" y="-90%" width="170%" height="280%"><feGaussianBlur stdDeviation="3.6" /></filter>
        <clipPath id="fsLandClip">
          <path d={LAND_D} />
        </clipPath>
      </defs>
    </svg>
  );
}

// The peninsula profile, west → east: Pacific shore, a low rounded hill, the
// bayside shore, then the higher East Bay hills across the water.
const LAND_D = "M62,152 L80,146 C110,140 140,134 160,120 C180,104 196,98 216,98 C240,98 258,112 276,130 C288,142 296,148 300,150 L345,152 L345,150 C355,138 365,118 380,104 C390,96 396,94 400,94 V200 H62 Z";
const EAST_D = "M345,150 C355,138 365,118 380,104 C390,96 396,94 400,94 V152 H345 Z";

function Scene({ label, children }) {
  return (
    <svg viewBox="0 0 400 200" className="mc-svg fs-scene" role="img" aria-label={label}>
      <rect width="400" height="200" fill={SKY} />
      {children}
    </svg>
  );
}

const T = ({ x, y, children, k = "s", halo, ...rest }) => (
  <text className={`fs-t-${k}`} x={x} y={y} style={halo ? HALO : undefined} {...rest}>{children}</text>
);

// Soft-edged fog, and wisps (blurred ellipses) to break up its flat top.
const Fog = ({ d, op = 0.95 }) => <path d={d} fill={FOG} opacity={op} filter="url(#fsBlur)" />;
const Wisps = ({ pts }) => pts.map(([cx, cy, rx, ry], i) => (
  <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} fill="#fff" opacity="0.8" filter="url(#fsBlur2)" />
));

// Wave lines along a stretch of water.
const Waves = ({ x0, x1, ys }) => ys.map((y, i) => (
  <path key={y} d={`M${x0 + (i % 2) * 7},${y} ${"q6,-3 12,0 t12,0 ".repeat(Math.ceil((x1 - x0) / 24))}`}
    fill="none" stroke="#fff" strokeOpacity="0.4" strokeWidth="1.2" />
));

// An arrow with a white halo so it reads over fog and sky alike.
const Arrow = ({ d, color = C.barHi, head = "fsN", w = 3 }) => (
  <g fill="none" strokeLinecap="round">
    <path d={d} stroke="#fff" strokeOpacity="0.9" strokeWidth={w + 4} />
    <path d={d} stroke={color} strokeWidth={w} markerEnd={`url(#${head})`} />
  </g>
);

// A scatter of dots: vapour (small, faint) or fog droplets (larger, outlined).
function Dots({ pts, r = 2, drop }) {
  return pts.map(([x, y], i) => (
    <circle key={i} cx={x} cy={y} r={r}
      fill={drop ? "#fff" : C.ramp[1]} fillOpacity={drop ? 0.95 : 0.6}
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
      <Waves x0={0} x1={300} ys={[110, 118]} />
      <path d="M296,200 L326,114 L400,104 V200 Z" fill={LAND} />
      <Arrow d="M20,40 H132" color="#6B6F75" head="fsK" />
      <T x="20" y="30" halo>Wind along the coast</T>
      <Arrow d="M300,86 H196" color="#6B6F75" head="fsK" />
      <T x="20" y="90" halo>Surface water pushed out</T>
      {[196, 236, 276].map(x => <Arrow key={x} d={`M${x},190 V132`} w={3.2} />)}
      <T x="16" y="156" k="l" fill="#fff">Cold California</T>
      <T x="16" y="170" k="l" fill="#fff">Current water</T>
      <T x="16" y="186" fill="#EAF3F9">52–56°F, even in July</T>
    </Scene>
  );
}

function S2() {
  return (
    <Scene label="Warm, humid air carrying invisible water vapor blows in over the cold ocean.">
      <rect y="150" width="400" height="50" fill={WATER_D} />
      <Waves x0={0} x1={400} ys={[158]} />
      <Dots pts={VAPOUR} />
      {[48, 82, 116].map(y => (
        <path key={y} d={`M20,${y} C100,${y - 12} 160,${y + 12} 230,${y} S340,${y - 8} 382,${y}`}
          fill="none" stroke="url(#fsAir)" strokeWidth="2.8" strokeLinecap="round" markerEnd="url(#fsN)" />
      ))}
      <T x="20" y="24" k="l" fill={C.warmText} halo>Warm moist air</T>
      <T x="190" y="24" halo>Air 62°F</T>
      <T x="20" y="146" halo>invisible water vapor</T>
      <T x="16" y="182" k="l" fill="#fff">Ocean 54°F</T>
      <T x="250" y="146" halo>dew point 54°F</T>
    </Scene>
  );
}

function S3() {
  return (
    <Scene label="Air cooled to its dew point is saturated: the water vapor condenses into fog droplets.">
      <rect y="150" width="400" height="50" fill={WATER_D} />
      <Waves x0={0} x1={400} ys={[158]} />
      <Fog d="M186,152 V108 Q250,88 300,92 T400,100 V152 Z" op={0.92} />
      <Wisps pts={[[250, 100, 26, 6], [330, 98, 30, 6], [376, 108, 20, 5]]} />
      <Dots pts={VAPOUR.slice(0, 7).map(([x, y]) => [x * 0.45, y + 12])} />
      <Dots pts={DROPS} r={3.4} drop />
      <T x="16" y="30" halo>Air</T>
      <rect x="96" y="20" width="96" height="11" rx="3" fill={C.warm} />
      <T x="198" y="30" k="v" halo>54°F</T>
      <T x="16" y="54" halo>Dew point</T>
      <rect x="96" y="44" width="96" height="11" rx="3" fill={C.barHi} />
      <T x="198" y="54" k="v" halo>54°F</T>
      <T x="250" y="40" k="l" halo>equal = saturated</T>
      <T x="250" y="58" halo>100% humidity</T>
      <T x="236" y="82" k="l" fill={C.barHi} halo>Fog droplets forming</T>
      <T x="16" y="182" k="l" fill="#fff">Ocean 54°F</T>
    </Scene>
  );
}

function S4() {
  return (
    <Scene label="Sinking air from the North Pacific High forms a warm lid, an inversion, that traps a flat marine layer of cool fog-filled air beneath it.">
      <rect width="400" height="68" fill="url(#fsWarmSky)" />
      <circle cx="44" cy="34" r="19" fill="#fff" fillOpacity="0.7" stroke={C.barHi} strokeWidth="2" />
      <T x="44" y="41" k="big" textAnchor="middle">H</T>
      {[96, 136, 176].map(x => <Arrow key={x} d={`M${x},14 V52`} color={C.warm} head="fsW" w={2.6} />)}
      <T x="206" y="30" fill={C.warmText}>Warm, dry air</T>
      <T x="206" y="48">sinks from above</T>
      <path d="M0,68 H400" stroke={C.warm} strokeWidth="3" />
      <T x="206" y="86" k="l" fill={C.warmText} halo>Inversion: the lid</T>
      <Fog d="M0,102 Q100,90 200,100 T400,98 V146 H0 Z" />
      <Wisps pts={[[60, 100, 34, 6], [190, 98, 40, 6], [330, 100, 36, 6]]} />
      <T x="20" y="126" k="k" fill={C.barHi}>MARINE LAYER</T>
      <Arrow d="M300,140 V108" w={2.6} />
      <path d="M290,102 H312" stroke={C.warm} strokeWidth="3" />
      <T x="322" y="132">can’t rise</T>
      <rect y="146" width="400" height="54" fill={WATER_D} />
      <Waves x0={0} x1={400} ys={[154]} />
      <T x="16" y="182" k="l" fill="#fff">Cold ocean</T>
    </Scene>
  );
}

function S5() {
  return (
    <Scene label="Hot air rises over the Central Valley, leaving low pressure. Higher pressure over the cool ocean pushes air toward it, through the Golden Gate.">
      <Fog d="M0,112 H150 L172,86 H400 V150 H0 Z" op={0.8} />
      <rect y="150" width="130" height="50" fill={WATER_D} />
      <Waves x0={0} x1={130} ys={[158]} />
      <path d="M130,200 L148,150 L170,108 L186,146 L192,150 L216,112 L244,150 L252,200 Z" fill={LAND} />
      <rect x="252" y="150" width="148" height="50" fill="url(#fsValley)" />
      <circle cx="40" cy="34" r="17" fill="#fff" fillOpacity="0.7" stroke={C.barHi} strokeWidth="2" />
      <T x="40" y="41" k="big" textAnchor="middle">H</T>
      <T x="68" y="30" k="l" halo>High pressure</T>
      <T x="68" y="48" halo>cool ocean air</T>
      <circle cx="356" cy="34" r="17" fill="#fff" fillOpacity="0.7" stroke={C.warm} strokeWidth="2" />
      <T x="356" y="41" k="big" textAnchor="middle" fill={C.warmText}>L</T>
      <T x="326" y="30" k="l" textAnchor="end" fill={C.warmText} halo>Low pressure</T>
      <T x="326" y="48" textAnchor="end" halo>hot rising air</T>
      {[290, 330, 370].map(x => <Arrow key={x} d={`M${x},146 V82`} color={C.warm} head="fsW" w={2.8} />)}
      <Arrow d="M24,134 H300" w={3.4} />
      <T x="30" y="122" k="l" halo>Sea breeze</T>
      <T x="16" y="176" k="l" fill="#fff">Pacific Ocean</T>
      <T x="140" y="184" k="l">Golden Gate Gap</T>
      <T x="262" y="176" k="l">Central Valley</T>
      <T x="262" y="192">95–105°F</T>
    </Scene>
  );
}

// ---------------------------------------------------- steps 6 – 10 (peninsula)

// West → east: Pacific Ocean · the west side · the hill (Mount Davidson / Twin
// Peaks, low and rounded) · the bayside neighborhoods · San Francisco Bay · the
// East Bay hills. The fog (`fogD`) sits behind the land so the shore cuts it,
// and a veil of the same shape, clipped to the land, drapes over the slopes it
// covers. `tongue` lies on the hill's east slope; `children` draw over the fog.
function Peninsula({ label, fogD, fogOp = 0.95, wisps, tongue, sun, children }) {
  return (
    <Scene label={label}>
      {sun}
      <rect y="152" width="62" height="48" fill={WATER} />
      <Waves x0={0} x1={62} ys={[160, 170]} />
      <Fog d={fogD} op={fogOp} />
      <path d={LAND_D} fill={LAND} />
      <path d={EAST_D} fill="url(#fsHill)" />
      <rect x="300" y="152" width="45" height="48" fill={WATER} />
      <Waves x0={300} x1={345} ys={[160, 170]} />
      <g clipPath="url(#fsLandClip)"><Fog d={fogD} op={0.8} /></g>
      {wisps && <Wisps pts={wisps} />}
      {tongue}
      {children}
      <T x="10" y="176" fill="#fff">Pacific</T>
      <T x="10" y="188" fill="#fff">Ocean</T>
      <T x="96" y="172">West side</T>
      <T x="172" y="192" k="l">San Francisco</T>
      <T x="244" y="172">Bayside</T>
      <T x="322" y="188" textAnchor="middle" fill="#fff">SF Bay</T>
      <T x="372" y="176" textAnchor="middle">East Bay</T>
      <T x="372" y="188" textAnchor="middle">hills</T>
    </Scene>
  );
}

const sunAt = (x, y) => (
  <g>
    <circle cx={x} cy={y} r="38" fill="url(#fsSunG)" />
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
      label="Midnight to 8am: a thick fog deck fills the west side, rises just over the hill and reaches across the Bay to the East Bay hills."
      fogD="M0,90 L110,88 L216,86 L300,88 L345,92 Q372,96 392,112 L392,152 H0 Z"
      wisps={[[60, 90, 36, 6], [170, 86, 40, 6], [270, 88, 38, 6], [350, 96, 24, 6]]}
    >
      <T x="14" y="108" k="l" fill={C.barHi} halo>Cool fog layer</T>
    </Peninsula>
  );
}

function S7() {
  return (
    <Peninsula
      label="8am to noon: the sun warms the land and the fog burns back toward the ocean, bayside first."
      sun={sunAt(330, 40)}
      fogD="M0,112 L70,108 L150,126 L170,152 H0 Z"
      fogOp={0.85}
    >
      {[110, 140, 168].map(x => (
        <path key={x} d={`M${x},124 V100`} stroke="#6B6F75" strokeWidth="1.8" strokeDasharray="3 3" markerEnd="url(#fsK)" />
      ))}
    </Peninsula>
  );
}

function S8() {
  return (
    <Peninsula
      label="Noon to 3pm: the city is in full sun and the fog sits as a bank offshore."
      sun={sunAt(330, 40)}
      fogD="M0,128 L30,124 L60,134 L66,152 H0 Z"
      fogOp={0.8}
    />
  );
}

function S9() {
  return (
    <Peninsula
      label="3pm to 7pm: the Valley is at its hottest and pulls the fog bank back in through the Golden Gate and onto the west side."
      sun={sunAt(330, 40)}
      fogD="M0,112 L60,104 L128,116 L150,152 H0 Z"
    >
      <Arrow d="M20,86 H138" w={3.2} />
      <T x="24" y="76" k="l" halo>Sea breeze</T>
    </Peninsula>
  );
}

function S10() {
  return (
    <Peninsula
      label="7pm to midnight: the fog deepens over the west side, spills over the hill and runs down its east slope to the edge of the Bay."
      fogD="M0,74 L110,72 L196,70 L244,76 Q290,98 314,152 H0 Z"
      wisps={[[70, 74, 36, 6], [160, 70, 40, 6]]}
      tongue={
        <g>
          <path d="M190,70 C242,70 268,90 286,112 C296,124 304,138 308,150 L294,149 C282,142 266,130 252,116 C236,100 220,94 190,94 Z"
            fill={FOG} opacity="0.94" filter="url(#fsBlur)" />
          <Arrow d="M228,60 C266,60 296,84 308,120" w={3.2} />
        </g>
      }
    >
      <T x="14" y="92" k="l" fill={C.barHi} halo>Cool fog layer</T>
      <T x="236" y="54" k="l" halo>Sea breeze</T>
    </Peninsula>
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
    p: "Nights are cool and the lid holds. Air stays within a degree or two of its dew point, so the fog is solid. It fills the west side, rises just over the hill and reaches across the Bay to the East Bay hills.",
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
    h: "Over the hill", when: "7pm – midnight", Scene: S10,
    p: "After sunset the land cools and the lid still holds. The deck deepens, spills over the hill and runs down its east slope to the edge of the Bay overnight. Tomorrow it starts again.",
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
