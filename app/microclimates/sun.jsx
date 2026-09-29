// Sun on a San Francisco lot: overhead plan, neighbor and slope sections,
// two field rules, and a sky chart. Server components, no client JavaScript.
//
// Nothing here is drawn by eye. Sun positions come from the standard solar
// geometry at 37.77°N (solar time, no refraction), shadows are the true
// projections of box-shaped buildings, and every "hours of sun" figure is
// sampled from that geometry at render time.

import { C } from "./charts";

const LAT = 37.7749;
const R = Math.PI / 180;
const DEC = { jun: 23.44, eq: 0, dec: -23.44 };

// Altitude and azimuth (degrees; azimuth clockwise from north) for a
// declination and a solar hour (12 = solar noon).
export function sunAt(decl, hour) {
  const H = (hour - 12) * 15 * R, d = decl * R, p = LAT * R;
  const sinAlt = Math.sin(p) * Math.sin(d) + Math.cos(p) * Math.cos(d) * Math.cos(H);
  const alt = Math.asin(sinAlt);
  let cosAz = (Math.sin(d) - sinAlt * Math.sin(p)) / (Math.cos(alt) * Math.cos(p));
  cosAz = Math.max(-1, Math.min(1, cosAz));
  let az = Math.acos(cosAz) / R;
  if (H > 0) az = 360 - az;
  return { alt: alt / R, az };
}

// Solar hours of sunrise and sunset for a declination.
function dayBounds(decl) {
  const x = -Math.tan(LAT * R) * Math.tan(decl * R);
  const H = Math.acos(Math.max(-1, Math.min(1, x))) / R / 15;
  return [12 - H, 12 + H];
}

const fmtH = h => `${Math.floor(h)}h ${String(Math.round((h % 1) * 60)).padStart(2, "0")}m`;

// ------------------------------------------------------------ geometry

function hull(pts) {
  const p = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo = [], up = [];
  for (const q of p) { while (lo.length > 1 && cross(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
  for (const q of p.reverse()) { while (up.length > 1 && cross(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
  return lo.slice(0, -1).concat(up.slice(0, -1));
}

function inside(pt, poly) {
  let ok = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if ((yi > pt[1]) !== (yj > pt[1]) && pt[0] < ((xj - xi) * (pt[1] - yi)) / (yj - yi) + xi) ok = !ok;
  }
  return ok;
}

// Shadow of a box on flat ground: hull of its footprint and the footprint
// shifted by the shadow vector. x is east, y is north, feet.
function shadow(b, sun) {
  const L = b.h / Math.tan(sun.alt * R);
  const dx = -L * Math.sin(sun.az * R), dy = -L * Math.cos(sun.az * R);
  const base = [[b.x0, b.y0], [b.x1, b.y0], [b.x1, b.y1], [b.x0, b.y1]];
  return hull(base.concat(base.map(([x, y]) => [x + dx, y + dy])));
}

// ------------------------------------------------------ 1. the lot from above

// A 25 × 100 ft lot between two row-house neighbors, backing onto the rear
// neighbor's yard. Houses 30 ft tall and 55 ft deep, yards 45 ft.
// `yard` is which way our rear yard faces: "north" (street to the south) or
// "south" (street to the north) — the layout is mirrored, nothing else.
function block(yard) {
  const H = 30;
  const rel = [
    { x0: 0, x1: 25, y0: 0, y1: 55, h: H, me: true },
    { x0: -25, x1: 0, y0: 0, y1: 55, h: H },
    { x0: 25, x1: 50, y0: 0, y1: 55, h: H },
    { x0: -25, x1: 50, y0: 145, y1: 200, h: H },           // the houses behind
  ];
  const flip = b => ({ ...b, y0: 100 - b.y1, y1: 100 - b.y0 });
  const buildings = yard === "north" ? rel : rel.map(flip);
  const yardBox = yard === "north" ? { y0: 55, y1: 100 } : { y0: 0, y1: 45 };
  const street = yard === "north" ? { y0: -30, y1: -4 } : { y0: 104, y1: 130 };
  return { buildings, yardBox, street };
}

// Hours of direct sun at each 2.5 ft cell of the rear yard, sunrise to
// sunset, with every house on the block casting its shadow.
const CELL = 2.5;
function yardCells(buildings, yardBox, decl) {
  const [rise, set] = dayBounds(decl);
  const cells = [];
  for (let x = CELL / 2; x < 25; x += CELL)
    for (let y = yardBox.y0 + CELL / 2; y < yardBox.y1; y += CELL) cells.push({ x, y, h: 0 });
  const step = 0.1;
  for (let t = rise + step / 2; t < set; t += step) {
    const sun = sunAt(decl, t);
    if (sun.alt <= 0.5) continue;
    const shades = buildings.map(b => shadow(b, sun));
    for (const c of cells) if (!shades.some(s => inside([c.x, c.y], s))) c.h += step;
  }
  const avg = cells.reduce((a, c) => a + c.h, 0) / cells.length;
  return { cells, avg };
}

// Sun-hours ramp for the yard: shade grey → full-sun gold.
const HEAT_MAX = 14;
const heat = h => {
  const t = Math.max(0, Math.min(1, h / HEAT_MAX));
  const a = [200, 205, 211], b = [240, 190, 70];
  return `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(",")})`;
};

// One panel: north up, our house (navy) and its rear yard coloured by how
// many hours of sun each part of it gets. Neighbors are drawn because their
// shadows count; nothing else is on the drawing.
function LotPanel({ yard, season }) {
  const decl = DEC[season];
  const { buildings, yardBox } = block(yard);
  const { cells, avg } = yardCells(buildings, yardBox, decl);
  const S = 2.6;
  const X0 = -20, X1 = 45;
  const Y0 = -14, Y1 = 114;                  // just the lot, the street and the back fence
  const W = (X1 - X0) * S, H = (Y1 - Y0) * S;
  const px = x => (x - X0) * S, py = y => (Y1 - y) * S;
  const streetY = yard === "north" ? [-14, -2] : [102, 114];
  const fenceY = yard === "north" ? 100 : 0;

  return (
    <div className="sn-lot">
      <svg viewBox={`0 0 ${W} ${H}`} className="mc-svg" role="img"
        aria-label={`Rear yard facing ${yard} on ${season === "jun" ? "June 21" : "December 21"}: about ${avg.toFixed(1)} hours of direct sun on average.`}>
        <defs><clipPath id={`lot-${yard}-${season}`}><rect width={W} height={H} rx="10" /></clipPath></defs>
        <g clipPath={`url(#lot-${yard}-${season})`}>
          <rect width={W} height={H} fill="#F5F6F7" />
          <rect x="0" y={py(streetY[1])} width={W} height={(streetY[1] - streetY[0]) * S} fill="#DCDFE3" />
          <text className="sn-t" x={W / 2} y={py((streetY[0] + streetY[1]) / 2) + 4} textAnchor="middle">street</text>
          {cells.map((c, i) => (
            <rect key={i} x={px(c.x - CELL / 2)} y={py(c.y + CELL / 2)} width={CELL * S + 0.4} height={CELL * S + 0.4} fill={heat(c.h)} />
          ))}
          {buildings.filter(b => b.y0 < Y1 && b.y1 > Y0).map((b, i) => (
            <rect key={i} x={px(b.x0)} y={py(b.y1)} width={(b.x1 - b.x0) * S} height={(b.y1 - b.y0) * S}
                  fill={b.me ? "#4E7398" : "#B9C0C7"} stroke="#fff" strokeWidth="1.5" />
          ))}
          <rect x={px(0)} y={py(yardBox.y1)} width={25 * S} height={(yardBox.y1 - yardBox.y0) * S}
                fill="none" stroke="#131A25" strokeWidth="1.5" />
          <line x1={px(-20)} x2={px(45)} y1={py(fenceY)} y2={py(fenceY)} stroke="#8E98A1" strokeWidth="1" />
          <text className="sn-t sn-t-light" x={px(12.5)} y={py((yardBox.y0 + yardBox.y1) / 2) + 4} textAnchor="middle">yard</text>
          <text className="sn-t sn-t-w2" x={px(12.5)} y={py(yard === "north" ? 27 : 73) + 4} textAnchor="middle">house</text>
          <g transform={`translate(${W - 14},16)`}>
            <path d="M0,-9 L5,4 L0,1 L-5,4 Z" fill="#131A25" />
            <text className="sn-t" x="0" y="16" textAnchor="middle">N</text>
          </g>
        </g>
      </svg>
      <b>{fmtH(avg)}<span> of sun on the yard</span></b>
    </div>
  );
}

export function LotPlan() {
  return (
    <figure className="mc-fig">
      <p className="mc-fig-h">The lot from above</p>
      <div className="sn-lotgrid">
        <span />
        <span className="sn-col-h">June 21</span>
        <span className="sn-col-h">December 21</span>

        <span className="sn-row-h">Yard <b>north</b> of the house</span>
        <LotPanel yard="north" season="jun" />
        <LotPanel yard="north" season="dec" />

        <span className="sn-row-h">Yard <b>south</b> of the house</span>
        <LotPanel yard="south" season="jun" />
        <LotPanel yard="south" season="dec" />
      </div>
      <div className="sn-heatkey">
        <span>Sun on the yard:</span>
        <span>0 h</span>
        <i style={{ background: `linear-gradient(90deg, ${heat(0)}, ${heat(HEAT_MAX / 2)}, ${heat(HEAT_MAX)})` }} />
        <span className="sn-heatkey-r">{HEAT_MAX} h</span>
        <em><i style={{ background: "#4E7398" }} /> the house</em>
        <em><i style={{ background: "#B9C0C7" }} /> neighbors</em>
      </div>
      <figcaption className="mc-cap">
        The winter sun stays low in the southern sky, so a yard north of its house sits in the house&rsquo;s
        shadow — and a yard south of it doesn&rsquo;t. 25 × 100 ft lot, 30 ft row houses, flat ground.
      </figcaption>
    </figure>
  );
}

// ---------------------------------------------- 2a. the neighbor to the south

export function NeighborShadow() {
  const S = 4.6, G = 250;                           // px per foot, ground y
  const nX = 150, gap = 50, nH = 40, myH = 30;       // neighbor wall x, feet apart, heights
  const myX = nX + gap * S;
  const dec = sunAt(DEC.dec, 12).alt, jun = sunAt(DEC.jun, 12).alt;
  const decWall = nH - gap * Math.tan(dec * R);      // feet up our wall still in shadow
  const junLen = nH / Math.tan(jun * R);
  const y = ft => G - ft * S;

  return (
    <figure className="mc-fig">
      <p className="mc-fig-h">A 40 ft neighbor to the south, at noon</p>
      <div className="mc-scroll">
        <svg viewBox="0 0 760 300" className="mc-svg mc-diagram" role="img"
          aria-label={`A 40-foot building 50 feet to the south: at December noon its shadow covers the lower ${Math.round(decWall)} feet of your rear wall; at June noon its shadow is only ${Math.round(junLen)} feet long.`}>
          <rect width="760" height="300" rx="14" fill="#F7F9FA" />
          <text className="mc-t-s" x="20" y="28">SOUTH</text>
          <text className="mc-t-s" x="740" y="28" textAnchor="end">NORTH</text>

          {/* December: shaded ground and the shaded band of our wall */}
          <polygon points={`${nX},${G} ${myX},${G} ${myX},${y(decWall)} ${nX},${y(nH)}`} fill="#203C5F" opacity="0.14" />
          <line x1={nX - 120} y1={y(nH) - 120 * Math.tan(dec * R)} x2={myX} y2={y(decWall)} stroke={C.warm} strokeWidth="2.5" />
          <line x1={nX - 30} y1={y(nH) - 30 * Math.tan(jun * R)} x2={nX + junLen * S} y2={G} stroke={C.cool} strokeWidth="2.5" />

          <rect x={nX - 90} y={y(nH)} width="90" height={nH * S} fill="#BFC6CC" />
          <rect x={myX} y={y(myH)} width="120" height={myH * S} fill="#7292AF" />
          {[8, 18].map(f => <rect key={f} x={myX + 6} y={y(f + 5)} width="14" height="20" fill="#DCE7EE" />)}
          <rect x={myX - 4} y={y(decWall)} width="4" height={decWall * S} fill={C.warmText} />

          <line x1="20" y1={G} x2="740" y2={G} stroke="#B7BEC4" strokeWidth="1.5" />
          <text className="mc-t-l" x={nX - 45} y={y(nH / 2)} textAnchor="middle">Neighbor</text>
          <text className="mc-t-s" x={nX - 45} y={y(nH / 2) + 18} textAnchor="middle">40 ft</text>
          <text className="mc-t-l" x={myX + 60} y={y(myH) - 10} textAnchor="middle">Your house</text>
          <text className="mc-t-s" x={(nX + myX) / 2} y={G + 22} textAnchor="middle">50 ft between walls</text>

          <text className="mc-t-l" x={myX - 12} y={G - 48} textAnchor="end" fill={C.warmText}>
            Dec noon · {Math.round(dec)}°
          </text>
          <text className="mc-t-s" x={myX - 12} y={G - 30} textAnchor="end">lowest {Math.round(decWall)} ft of</text>
          <text className="mc-t-s" x={myX - 12} y={G - 13} textAnchor="end">your wall in shadow</text>
          <text className="mc-t-l" x={nX + 16} y={y(nH) - 46} fill={C.cool}>Jun noon · {Math.round(jun)}°</text>
          <text className="mc-t-s" x={nX + 16} y={y(nH) - 28}>shadow ends {Math.round(junLen)} ft out</text>
        </svg>
      </div>
      <figcaption className="mc-cap">
        At noon a shadow is {(1 / Math.tan(dec * R)).toFixed(1)}× the height of what casts it in December,
        and {(1 / Math.tan(jun * R)).toFixed(2)}× in June.
      </figcaption>
    </figure>
  );
}

// ------------------------------------------------------------ 2b. slope

export function SlopeCompare() {
  const dec = sunAt(DEC.dec, 12).alt;
  const tilt = Math.atan(0.2) / R;                  // a 20% grade
  const panels = [
    { k: "South-facing slope", face: 1 },
    { k: "Flat ground", face: 0 },
    { k: "North-facing slope", face: -1 },
  ];
  return (
    <figure className="mc-fig">
      <p className="mc-fig-h">December noon sun on a 20% grade</p>
      <div className="sn-slopes">
        {panels.map(p => {
          const inc = dec + p.face * tilt;              // angle between sunbeam and ground
          const gain = Math.sin(inc * R) / Math.sin(dec * R) - 1;
          const a = p.face * tilt * R;
          // ground line through (120,110), rising toward the south (left) when it faces south
          const gx = 90;
          const g1 = [120 - gx * Math.cos(a), 110 - gx * Math.sin(a)];
          const g2 = [120 + gx * Math.cos(a), 110 + gx * Math.sin(a)];
          const sun = [120 - 95 * Math.cos(dec * R), 110 - 95 * Math.sin(dec * R)];
          return (
            <div key={p.k} className="sn-slope">
              <svg viewBox="0 0 240 150" className="mc-svg" role="img"
                aria-label={`${p.k}: December noon sun meets the ground at ${Math.round(inc)} degrees.`}>
                <rect width="240" height="150" rx="12" fill="#F7F9FA" />
                <polygon points={`${g1[0]},${g1[1]} ${g2[0]},${g2[1]} ${g2[0]},150 ${g1[0]},150`} fill="#C9CFD4" />
                <line x1={sun[0]} y1={sun[1]} x2="120" y2="110" stroke={C.warm} strokeWidth="2.5" />
                <circle cx={sun[0]} cy={sun[1]} r="8" fill="#E8B84B" />
                <circle cx="120" cy="110" r="3" fill={C.ink} />
                <text className="sn-t" x="16" y="20">S</text>
                <text className="sn-t" x="224" y="20" textAnchor="end">N</text>
              </svg>
              <b>{p.k}</b>
              <span className="sn-slope-v">Sun meets ground at <b>{Math.round(inc)}°</b></span>
              <span className={`sn-slope-g${gain > 0.01 ? " up" : gain < -0.01 ? " down" : ""}`}>
                {Math.abs(gain) < 0.01 ? "baseline" : `${gain > 0 ? "+" : "−"}${Math.round(Math.abs(gain) * 100)}% winter sun`}
              </span>
            </div>
          );
        })}
      </div>
      <figcaption className="mc-cap">Energy per square foot of ground scales with the sine of the angle the sun meets it at.</figcaption>
    </figure>
  );
}

// ------------------------------------------------------ 3. field rules

export function FieldRules() {
  const dec = sunAt(DEC.dec, 12).alt;
  const k = Math.tan(dec * R);
  const D = 40;
  return (
    <figure className="mc-fig">
      <p className="mc-fig-h">Measure it yourself</p>
      <div className="sn-rules">
        <div className="sn-rule">
          <svg viewBox="0 0 320 170" className="mc-svg" role="img"
            aria-label={`The half rule: anything to your south taller than about ${k.toFixed(2)} times its distance blocks the December noon sun.`}>
            <rect width="320" height="170" rx="12" fill="#F7F9FA" />
            <line x1="20" y1="140" x2="300" y2="140" stroke="#B7BEC4" strokeWidth="1.5" />
            <line x1="270" y1="140" x2={270 - 220} y2={140 - 220 * k} stroke={C.warm} strokeWidth="2.5" />
            <circle cx={270 - 235} cy={140 - 235 * k} r="8" fill="#E8B84B" />
            <rect x="66" y={140 - 220 * k * 0.8} width="16" height={220 * k * 0.8} rx="3" fill="#9CB3C6" />
            <rect x="96" y={140 - 170 * k * 1.25} width="16" height={170 * k * 1.25} rx="3" fill="#203C5F" />
            <circle cx="270" cy="134" r="6" fill={C.ink} />
            <text className="sn-t" x="74" y="156" textAnchor="middle">clear</text>
            <text className="sn-t sn-t-w" x="104" y="156" textAnchor="middle">blocks</text>
            <text className="sn-t" x="270" y="160" textAnchor="middle">you</text>
            <text className="sn-t" x="20" y="160">south</text>
          </svg>
          <b>The half rule</b>
          <span>Anything due south taller than <b>half its distance</b> from you blocks December noon sun.</span>
          <i>A tree {D} ft away has to stay under {Math.round(D * k)} ft.</i>
        </div>
        <div className="sn-rule">
          <svg viewBox="0 0 320 170" className="mc-svg" role="img"
            aria-label="The fist rule: a fist at arm's length covers about 10 degrees, so the December noon sun sits about three fists above the horizon.">
            <rect width="320" height="170" rx="12" fill="#F7F9FA" />
            <line x1="20" y1="140" x2="300" y2="140" stroke="#B7BEC4" strokeWidth="1.5" />
            {[0, 1, 2].map(i => {
              const a0 = i * 10 * R, a1 = (i + 1) * 10 * R, r = 200;
              return (
                <path key={i}
                  d={`M270,140 L${270 - r * Math.cos(a0)},${140 - r * Math.sin(a0)} A${r},${r} 0 0 1 ${270 - r * Math.cos(a1)},${140 - r * Math.sin(a1)} Z`}
                  fill={C.ramp[i + 1]} opacity="0.55" stroke="#fff" strokeWidth="2" />
              );
            })}
            {[0, 1, 2].map(i => (
              <text key={i} className="sn-t sn-t-light" x={270 - 150 * Math.cos((i * 10 + 5) * R)} y={140 - 150 * Math.sin((i * 10 + 5) * R) + 4} textAnchor="middle">{i + 1}</text>
            ))}
            <circle cx={270 - 210 * Math.cos(dec * R)} cy={140 - 210 * Math.sin(dec * R)} r="8" fill="#E8B84B" />
            <circle cx="270" cy="134" r="6" fill={C.ink} />
            <text className="sn-t" x="270" y="160" textAnchor="middle">you</text>
            <text className="sn-t" x="20" y="160">south</text>
          </svg>
          <b>The fist rule</b>
          <span>A fist at arm&rsquo;s length covers about 10°. December noon sun sits <b>three fists</b> up.</span>
          <i>If a roofline due south is above three fists, you lose winter noon sun.</i>
        </div>
      </div>
    </figure>
  );
}

// --------------------------------------------------------- 4. the sky chart

// An example skyline for a mid-block Noe Valley–style lot: a building to the
// south-southeast, a tree to the southwest, the hill to the west, low roofs
// everywhere else. Degrees above the horizon, by azimuth.
const SKYLINE = [
  { from: 0, to: 140, alt: 6 },
  { from: 140, to: 190, alt: 24, k: "building" },
  { from: 190, to: 205, alt: 6 },
  { from: 205, to: 235, alt: 34, k: "tree" },
  { from: 235, to: 300, alt: 14, k: "hill", at: 250 },
  { from: 300, to: 360, alt: 6 },
];
const obstruction = az => (SKYLINE.find(s => az >= s.from && az < s.to) || SKYLINE[0]).alt;

function directHours(decl) {
  const [rise, set] = dayBounds(decl);
  let sun = 0;
  const step = 1 / 60;
  for (let t = rise; t < set; t += step) {
    const s = sunAt(decl, t);
    if (s.alt > obstruction(s.az)) sun += step;
  }
  return { day: set - rise, sun };
}

export function SkyChart() {
  const cx = 210, cy = 210, Rr = 180;
  const pt = (alt, az) => {
    const r = Rr * (90 - Math.max(0, alt)) / 90;
    return [cx + r * Math.sin(az * R), cy - r * Math.cos(az * R)];
  };
  const path = decl => {
    const [rise, set] = dayBounds(decl);
    const pts = [];
    for (let t = rise; t <= set + 1e-6; t += 0.1) { const s = sunAt(decl, t); pts.push(pt(s.alt, s.az)); }
    return "M" + pts.map(p => p.map(v => v.toFixed(1)).join(",")).join(" L");
  };
  const sky = [];
  for (let az = 0; az <= 360; az += 1) sky.push(pt(obstruction(az % 360), az));
  const ring = [];
  for (let az = 360; az >= 0; az -= 2) ring.push(pt(0, az));
  const silhouette = "M" + sky.map(p => p.join(",")).join(" L") + " L" + ring.map(p => p.join(",")).join(" L") + " Z";

  const days = [
    { k: "June 21", d: DEC.jun, c: C.cool },
    { k: "Mar / Sep 21", d: DEC.eq, c: "#7292AF" },
    { k: "December 21", d: DEC.dec, c: C.warm },
  ];
  const stats = days.map(x => ({ ...x, ...directHours(x.d) }));

  return (
    <figure className="mc-fig">
      <p className="mc-fig-h">Sky chart — the whole sky, seen from the rear yard</p>
      <div className="sn-sky">
        <svg viewBox="0 0 420 420" className="mc-svg sn-sky-svg" role="img"
          aria-label={`Sun paths for June, the equinoxes and December over an example skyline. ${stats.map(s => `${s.k}: ${fmtH(s.sun)} of direct sun out of ${fmtH(s.day)} of daylight`).join(". ")}.`}>
          <circle cx={cx} cy={cy} r={Rr} fill="#F7F9FA" stroke="#C6C8CB" />
          {[30, 60].map(a => <circle key={a} cx={cx} cy={cy} r={Rr * (90 - a) / 90} fill="none" stroke={C.line} />)}
          <path d={silhouette} fill="#8E98A1" opacity="0.55" fillRule="evenodd" />
          {[30, 60].map(a => <text key={a} className="sn-t sn-t-m" x={cx + 4} y={cy - Rr * (90 - a) / 90 - 4}>{a}°</text>)}
          {[["N", 0], ["E", 90], ["S", 180], ["W", 270]].map(([k, az]) => {
            const [x, y] = [cx + (Rr + 16) * Math.sin(az * R), cy - (Rr + 16) * Math.cos(az * R)];
            return <text key={k} className="sn-t sn-t-b" x={x} y={y + 5} textAnchor="middle">{k}</text>;
          })}
          {SKYLINE.filter(s => s.k).map(s => {
            const [x, y] = pt(3, s.at ?? (s.from + s.to) / 2);
            return <text key={s.k} className="sn-t sn-t-light" x={x} y={y + 4} textAnchor="middle">{s.k}</text>;
          })}
          {days.map(x => (
            <g key={x.k}>
              <path d={path(x.d)} fill="none" stroke={x.c} strokeWidth="3" />
              {[9, 12, 15].map(h => {
                const s = sunAt(x.d, h);
                if (s.alt <= 0) return null;
                const [px, py] = pt(s.alt, s.az);
                return <circle key={h} cx={px} cy={py} r="4.5" fill="#fff" stroke={x.c} strokeWidth="2" />;
              })}
            </g>
          ))}
          <text className="sn-t sn-t-m" x={cx} y={cy + 4} textAnchor="middle">overhead</text>
        </svg>
        <div className="sn-sky-stats">
          {stats.map(s => (
            <div key={s.k} className="sn-sky-row">
              <i style={{ background: s.c }} />
              <div>
                <b>{s.k}</b>
                <span><em>{fmtH(s.sun)}</em> direct sun of {fmtH(s.day)} daylight</span>
                <span className="sn-bar"><span style={{ width: `${(s.sun / s.day) * 100}%`, background: s.c }} /></span>
              </div>
            </div>
          ))}
          <p className="mc-cap">
            Grey is the skyline: whatever the sun passes behind is lost sun. Dots mark 9am, noon and 3pm.
            An example lot — a phone sun app draws this for a real one.
          </p>
        </div>
      </div>
    </figure>
  );
}
