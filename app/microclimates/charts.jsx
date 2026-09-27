// Every graphic on /microclimates, as server components — no chart library and
// no client JavaScript.
//
// Charts are HTML (bars are sized with CSS), so their text stays full-size on a
// phone instead of shrinking with a drawing. The three diagrams are SVG and
// scroll sideways on narrow screens rather than shrink.
//
// Colour rules, checked with a palette validator rather than by eye:
//   • one hue per chart, light → dark (#9CB3C6 → #203C5F), monotone lightness
//   • emphasis instead of a second hue — the row that matters goes dark navy
//   • warm/cool only where it means warm/cool (highs #A8741A, lows #203C5F)
//   • every bar carries its own number, so nothing is encoded by colour alone
// No dual-axis charts: temperature and rainfall are two charts, not one.

import CLIMATE from "../lib/sf-climate.json";

export const C = {
  bar: "#9CB3C6",
  barHi: "#203C5F",
  ramp: ["#9CB3C6", "#7292AF", "#4E7398", "#2F5479", "#203C5F"],
  warm: "#A8741A",
  warmText: "#8A5F12",   // the same gold, dark enough for small text (5.3:1)
  cool: "#203C5F",
  ink: "#131A25",
  line: "#DCDDDE",
};

// ---------------------------------------------------------------- bar rows

// Label | bar + value [| second bar + value]. A second measure is its own track
// with its own scale and header — never a second scale on the same bar.
export function BarRows({ rows, max, unit = "", head, max2, unit2 = "", head2, caption }) {
  const two = max2 != null;
  return (
    <figure className={`mc-fig mc-bars${two ? " mc-bars-2" : ""}`}>
      {head && (
        <div className="mc-bars-row mc-bars-head" aria-hidden="true">
          <span />
          <span>{head}</span>
          {two && <span>{head2}</span>}
        </div>
      )}
      <ul className="mc-bars-list">
        {rows.map(r => (
          <li key={r.k} className={`mc-bars-row${r.hi ? " is-hi" : ""}`}
              title={`${r.k}: ${r.v}${unit}${two ? ` · ${r.v2}${unit2}` : ""}`}>
            <span className="mc-bars-k">
              {r.k}
              {r.eg && <em>{r.eg}</em>}
            </span>
            <span className="mc-bars-track" style={{ "--p": r.v / max }}>
              <i /><b>{r.v}{unit}</b>
            </span>
            {two && (
              <span className="mc-bars-track" style={{ "--p": r.v2 / max2 }}>
                <i /><b>{r.v2}{unit2}</b>
              </span>
            )}
          </li>
        ))}
      </ul>
      {caption && <figcaption className="mc-cap">{caption}</figcaption>}
    </figure>
  );
}

// ------------------------------------------------- December vs July, and rain

// One row per place: a December–July line on a shared °F scale with both
// numbers printed, then annual rain as its own bar on its own scale.
// Temperature and rain never share an axis.
const T0 = 45, T1 = 95;
const tpos = f => ((f - T0) / (T1 - T0)) * 100;

export function SeasonRows({ rows, rainMax = 48, caption }) {
  return (
    <figure className="mc-fig mc-bars mc-bars-2 mc-season">
      <div className="mc-bars-row mc-bars-head" aria-hidden="true">
        <span />
        <span className="mc-season-h">
          Avg high
          <em><i style={{ background: C.cool }} />Dec</em>
          <em><i style={{ background: C.warm }} />Jul</em>
        </span>
        <span>Rain a year</span>
      </div>
      <ul className="mc-bars-list">
        {rows.map(r => (
          <li key={r.k} className={`mc-bars-row${r.hi ? " is-hi" : ""}`}
              title={`${r.k}: December ${r.dec}°, July ${r.jul}°, ${r.rain}" of rain a year`}>
            <span className="mc-bars-k">{r.k}{r.eg && <em>{r.eg}</em>}</span>
            <span className="mc-season-track" role="img" aria-label={`December ${r.dec} degrees, July ${r.jul} degrees`}>
              <span className="mc-season-line" style={{ left: `${tpos(r.dec)}%`, width: `${tpos(r.jul) - tpos(r.dec)}%` }} />
              <span className="mc-season-dot" style={{ left: `${tpos(r.dec)}%`, background: C.cool }} />
              <span className="mc-season-dot" style={{ left: `${tpos(r.jul)}%`, background: C.warm }} />
              <b className="mc-season-v mc-season-dec" style={{ left: `${tpos(r.dec)}%` }}>{r.dec}°</b>
              <b className="mc-season-v mc-season-jul" style={{ left: `${tpos(r.jul)}%` }}>{r.jul}°</b>
            </span>
            <span className="mc-bars-track" style={{ "--p": r.rain / rainMax }}>
              <i /><b>{r.rain}&Prime;</b>
            </span>
          </li>
        ))}
      </ul>
      {caption && <figcaption className="mc-cap">{caption}</figcaption>}
    </figure>
  );
}

// --------------------------------------------------------------- the fog day

// A typical July day on the west side: darker is more fog. The pattern is well
// established; the shading is a schematic of it, not an hourly measurement.
const CLOCK = [
  4, 4, 4, 4, 4, 4, 4, 4,   // midnight – 8am
  3, 2, 1, 0,               // 8am – noon
  0, 0, 1, 2,               // noon – 4pm
  3, 3, 4, 4,               // 4pm – 8pm
  4, 4, 4, 4,               // 8pm – midnight
];
const LEVEL = ["clear", "thin", "patchy", "thick", "solid"];
const PHASES = [
  ["Thickest", 8], ["Burns back", 4], ["Clearest", 3], ["The push", 4], ["Over the ridge", 5],
];
const hourLabel = h => (h === 0 || h === 24 ? "12am" : h === 12 ? "noon" : h < 12 ? `${h}am` : `${h - 12}pm`);

export function FogClock() {
  return (
    <figure className="mc-fig">
      <p className="mc-fig-h">A July day on the west side</p>
      <div className="mc-clock" role="img"
        aria-label="Fog is thickest from late night to 8am, burns back late morning, is clearest around midday, pushes back through the Golden Gate mid-afternoon and covers the west side again by evening.">
        {CLOCK.map((v, h) => (
          <span key={h} style={{ background: C.ramp[v] }} title={`${hourLabel(h)} — ${LEVEL[v]}`} />
        ))}
      </div>
      <div className="mc-clock-hours" aria-hidden="true">
        {[0, 6, 12, 18, 24].map(h => <span key={h}>{hourLabel(h)}</span>)}
      </div>
      <div className="mc-clock-phases" aria-hidden="true">
        {PHASES.map(([k, n]) => <span key={k} style={{ flex: n }}>{k}</span>)}
      </div>
      <div className="mc-key">
        <span>clear</span>
        {C.ramp.map(c => <i key={c} style={{ background: c }} />)}
        <span>solid</span>
      </div>
      <figcaption className="mc-cap">Schematic of the daily pattern, not an hourly measurement.</figcaption>
    </figure>
  );
}

// -------------------------------------------------------- temperature & rain

const T_LO = 40, T_HI = 75;
const tp = f => ((f - T_LO) / (T_HI - T_LO)) * 100;

export function TempChart({ months = CLIMATE.months }) {
  const warmest = months.reduce((a, b) => (b.high > a.high ? b : a));
  const coolest = months.reduce((a, b) => (b.high < a.high ? b : a));
  return (
    <figure className="mc-fig">
      <p className="mc-fig-h">Average high and low, °F</p>
      <div className="mc-cols" role="img"
        aria-label={`Average highs run from ${coolest.high}°F in ${coolest.m} to ${warmest.high}°F in ${warmest.m}.`}>
        <div className="mc-grid" aria-hidden="true">
          {[70, 60, 50].map(f => <span key={f} style={{ bottom: `${tp(f)}%` }}><em>{f}°</em></span>)}
        </div>
        {months.map(d => {
          const label = d === warmest || d === coolest;
          return (
            <div className="mc-col" key={d.m} title={`${d.m}: high ${d.high}°, low ${d.low}°`}>
              <div className="mc-col-plot">
                <span className="mc-range" style={{ bottom: `${tp(d.low)}%`, height: `${tp(d.high) - tp(d.low)}%` }} />
                <span className="mc-dot" style={{ bottom: `${tp(d.high)}%`, background: C.warm }} />
                <span className="mc-dot" style={{ bottom: `${tp(d.low)}%`, background: C.cool }} />
                {label && <b className="mc-col-v" style={{ bottom: `calc(${tp(d.high)}% + 10px)` }}>{d.high}°</b>}
                {label && <b className="mc-col-v" style={{ bottom: `calc(${tp(d.low)}% - 26px)` }}>{d.low}°</b>}
              </div>
              <span className="mc-col-m">{d.m}</span>
            </div>
          );
        })}
      </div>
      <div className="mc-key">
        <i style={{ background: C.warm }} /><span>high</span>
        <i style={{ background: C.cool }} /><span>low</span>
      </div>
    </figure>
  );
}

export function RainChart({ months = CLIMATE.months }) {
  const max = 5;
  return (
    <figure className="mc-fig">
      <p className="mc-fig-h">Rain, inches a month</p>
      <div className="mc-cols mc-cols-rain" role="img"
        aria-label="Almost all rain falls November through March; July normally records none.">
        {months.map(d => (
          <div className="mc-col" key={d.m} title={`${d.m}: ${d.precip.toFixed(1)} inches`}>
            <div className="mc-col-plot">
              {d.precip > 0 && <span className="mc-rain" style={{ height: `${(d.precip / max) * 100}%` }} />}
              <b className="mc-col-v" style={{ bottom: `calc(${(d.precip / max) * 100}% + 4px)` }}>
                {d.precip === 0 ? "—" : d.precip.toFixed(1)}
              </b>
            </div>
            <span className="mc-col-m">{d.m}</span>
          </div>
        ))}
      </div>
    </figure>
  );
}

// The same numbers, for looking one month up — and for anything that cannot
// see the charts.
export function ClimateTable() {
  return (
    <div className="mc-table-wrap">
      <table className="mc-table">
        <caption className="lp-fine">{CLIMATE.station} · {CLIMATE.period}</caption>
        <thead>
          <tr><th scope="col">Month</th><th scope="col">High</th><th scope="col">Low</th><th scope="col">Rain</th></tr>
        </thead>
        <tbody>
          {CLIMATE.months.map(d => (
            <tr key={d.m}>
              <th scope="row">{d.m}</th>
              <td>{d.high}°</td>
              <td>{d.low}°</td>
              <td>{d.precip === 0 ? "—" : `${d.precip.toFixed(1)}"`}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ClimateExtremes() {
  return (
    <div className="mc-tiles">
      {CLIMATE.extremes.map(e => (
        <div className="mc-tile" key={e.k}>
          <b>{e.v}</b>
          <span>{e.k}</span>
          <i>{e.when}</i>
        </div>
      ))}
    </div>
  );
}

// ------------------------------------------------------ the Köppen scorecard

// Each Csb test, its threshold, and San Francisco's value — computed from the
// normals, so the card can never claim a pass the numbers do not support.
// Monthly mean = (average high + average low) / 2.
export function KoppenTests({ months = CLIMATE.months }) {
  const mean = d => (d.high + d.low) / 2;
  const summer = months.filter(d => ["Apr", "May", "Jun", "Jul", "Aug", "Sep"].includes(d.m));
  const winter = months.filter(d => ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"].includes(d.m));
  const coldest = months.reduce((a, b) => (mean(b) < mean(a) ? b : a));
  const warmest = months.reduce((a, b) => (mean(b) > mean(a) ? b : a));
  const dry = summer.reduce((a, b) => (b.precip < a.precip ? b : a));
  const wet = winter.reduce((a, b) => (b.precip > a.precip ? b : a));
  const over50 = months.filter(d => mean(d) > 50).length;
  const f = v => `${Math.round(v)}°F`;

  const tests = [
    { l: "C", k: "Coldest month", need: "above 32°F", sf: `${f(mean(coldest))} (${coldest.m})`, ok: mean(coldest) > 32 },
    { l: "s", k: "Driest summer month", need: "under 1.6 in", sf: `${dry.precip.toFixed(1)} in (${dry.m})`, ok: dry.precip < 1.6 },
    { l: "s", k: "Wettest winter vs driest summer", need: "3× or more",
      sf: dry.precip === 0 ? `${wet.precip} in vs none` : `${(wet.precip / dry.precip).toFixed(0)}×`,
      ok: wet.precip >= 3 * dry.precip },
    { l: "b", k: "Warmest month", need: "under 71.6°F", sf: `${f(mean(warmest))} (${warmest.m})`, ok: mean(warmest) < 71.6 },
    { l: "b", k: "Months above 50°F", need: "4 or more", sf: `${over50} of 12`, ok: over50 >= 4 },
  ];

  return (
    <figure className="mc-fig">
      <p className="mc-fig-h">Does San Francisco qualify?</p>
      <div className="mc-tests">
        <div className="mc-test mc-test-head" aria-hidden="true">
          <span /><span>Test</span><span>Needs</span><span>San Francisco</span><span />
        </div>
        {tests.map(t => (
          <div className="mc-test" key={t.k}>
            <span className="mc-test-l">{t.l}</span>
            <span className="mc-test-k">{t.k}</span>
            <span className="mc-test-n">{t.need}</span>
            <b className="mc-test-v">{t.sf}</b>
            <span className={`mc-test-ok${t.ok ? "" : " is-fail"}`} aria-label={t.ok ? "pass" : "fail"}>
              {t.ok ? "✓" : "✕"}
            </span>
          </div>
        ))}
      </div>
      <figcaption className="mc-cap">Monthly mean = average of the daily high and low. Summer is April–September.</figcaption>
    </figure>
  );
}

// ================================================================ diagrams

const Arrow = ({ id, color }) => (
  <marker id={id} markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
    <path d="M0,0 L8,4 L0,8 Z" fill={color} />
  </marker>
);

// Ocean → coast → Coast Range → Central Valley, with the four drivers on it.
export function OceanSection() {
  return (
    <figure className="mc-fig">
      <div className="mc-scroll">
        <svg viewBox="0 0 820 340" className="mc-svg mc-diagram" role="img"
          aria-label="Cross-section from the Pacific to the Central Valley: cold upwelled water off the coast, a marine layer capped by an inversion of sinking air from the North Pacific High, and hot air rising over the Central Valley pulling that marine air through the Golden Gate.">
          <defs>
            <Arrow id="mcA" color={C.barHi} />
            <Arrow id="mcW" color={C.warm} />
          </defs>
          <rect width="820" height="340" rx="14" fill="#F7F9FA" />

          <circle cx="150" cy="48" r="22" fill="none" stroke={C.barHi} strokeWidth="2" />
          <text className="mc-t-big" x="150" y="55" textAnchor="middle">H</text>
          {[100, 150, 200].map(x => (
            <path key={x} d={`M${x},76 V104`} stroke={C.barHi} strokeWidth="2" markerEnd="url(#mcA)" />
          ))}
          <text className="mc-t-l" x="190" y="44">North Pacific High</text>
          <text className="mc-t-s" x="190" y="62">air sinks and warms</text>

          <line x1="30" y1="120" x2="660" y2="120" stroke={C.warm} strokeWidth="2.5" />
          <text className="mc-t-l" x="668" y="118" fill={C.warmText}>Inversion</text>
          <text className="mc-t-s" x="668" y="136">the lid</text>

          <path d="M30,126 H420 Q462,126 462,156 H30 Z" fill={C.bar} />
          <text className="mc-t-k" x="130" y="147" fill={C.barHi}>MARINE LAYER</text>

          <path d="M0,200 H250 V340 H0 Z" fill="#DCE7EE" />
          <text className="mc-t-l" x="20" y="232">Pacific</text>
          <text className="mc-t-s" x="20" y="252">52–56°F</text>
          <path d="M70,322 C70,296 104,286 104,262" stroke={C.barHi} strokeWidth="2" fill="none" markerEnd="url(#mcA)" />
          <text className="mc-t-s" x="114" y="310">upwelling</text>

          <path d="M250,200 L300,152 L340,172 L372,154 L392,200 Z" fill="#C9CFD4" />
          <path d="M412,200 L452,144 L500,180 L548,134 L610,200 Z" fill="#C9CFD4" />
          <path d="M318,172 H486" stroke={C.barHi} strokeWidth="2.5" markerEnd="url(#mcA)" />
          <text className="mc-t-l" x="330" y="232">Golden Gate</text>
          <text className="mc-t-s" x="330" y="252">sea-level gap</text>

          <rect x="610" y="200" width="210" height="140" fill="#F0E6D2" />
          {[650, 700, 750].map(x => (
            <path key={x} d={`M${x},196 V150`} stroke={C.warm} strokeWidth="2" markerEnd="url(#mcW)" />
          ))}
          <text className="mc-t-l" x="628" y="232">Central Valley</text>
          <text className="mc-t-s" x="628" y="252">95–105°F</text>
          <text className="mc-t-s" x="628" y="276">rising heat pulls</text>
          <text className="mc-t-s" x="628" y="294">the coast inland</text>

          <line x1="0" y1="200" x2="820" y2="200" stroke={C.line} />
        </svg>
      </div>
      <figcaption className="mc-cap">Schematic, west to east. Not to scale.</figcaption>
    </figure>
  );
}

// West → east across the city on a shallow-deck day: the fog fills the west
// side, the ridge stands above it, the east side is clear.
export function CityProfile() {
  const spots = [
    ["Lakeshore", 70, 12.5], ["Sunset", 190, 9.0], ["Cole Valley", 300, 9.0],
    ["Noe Valley", 520, 8.5], ["Mission", 630, 7.5], ["North Beach", 745, 6.5],
  ];
  return (
    <figure className="mc-fig">
      <div className="mc-scroll">
        <svg viewBox="0 0 820 290" className="mc-svg mc-diagram" role="img"
          aria-label="West to east across San Francisco: fog fills the west side up to the top of the marine layer, Twin Peaks stands above it in sun, and the east side is clear. Summer fog runs from 12.5 hours a day in the southwest to 6.5 on the bayside.">
          <rect width="820" height="290" rx="14" fill="#F7F9FA" />
          <circle cx="720" cy="54" r="18" fill="#E8B84B" />

          <path d="M30,232 L150,228 L240,218 L320,186 L392,84 L440,92 L486,160 L550,196 L632,216 L712,224 L790,228 V246 H30 Z" fill="#C9CFD4" />
          <path d="M30,150 L346,150 L320,186 L240,218 L150,228 L30,232 Z" fill={C.bar} />
          <line x1="30" y1="150" x2="346" y2="150" stroke={C.warm} strokeWidth="2" />
          <text className="mc-t-s" x="30" y="140" fill={C.warmText}>top of the marine layer</text>
          <text className="mc-t-s" x="560" y="120">clear</text>
          <text className="mc-t-k" x="120" y="196" fill={C.barHi}>FOG</text>

          <circle cx="392" cy="84" r="4" fill={C.ink} />
          <text className="mc-t-l" x="392" y="68" textAnchor="middle">Twin Peaks 922 ft</text>

          {spots.map(([k, x, v]) => (
            <g key={k}>
              <text className="mc-t-v" x={x} y="266" textAnchor="middle">{v}h</text>
              <text className="mc-t-s" x={x} y="283" textAnchor="middle">{k}</text>
            </g>
          ))}
        </svg>
      </div>
      <figcaption className="mc-cap">Schematic. Hours are each neighborhood&rsquo;s measured summer fog average.</figcaption>
    </figure>
  );
}

// Three depths of the same marine layer against a 922 ft hill. Each panel is
// its own small drawing so they stack full-width on a phone.
export function DeckHeights({ decks }) {
  const base = 150, px = 120 / 2000;               // 2,000 ft = 120px
  const peak = base - 922 * px;
  return (
    <figure className="mc-fig">
      <p className="mc-fig-h">How deep the fog is</p>
      <div className="mc-deck">
        {decks.map(d => {
          const top = base - d.ft * px;
          return (
            <div className="mc-deck-p" key={d.k}>
              <svg viewBox="0 0 240 160" className="mc-svg" role="img"
                   aria-label={`${d.k} marine layer, ${d.sub}: ${d.p}.`}>
                <rect width="240" height="160" rx="12" fill="#F7F9FA" />
                {d.ft < 922 && <circle cx="196" cy="30" r="12" fill="#E8B84B" />}
                {/* a quadratic's apex sits halfway to its control point */}
                <path d={`M40,${base} Q120,${2 * peak - base} 200,${base} Z`} fill="#C9CFD4" />
                <rect x="0" y={top} width="240" height={base - top} fill={C.bar} opacity="0.82" />
                <line x1="0" y1={top} x2="240" y2={top} stroke={C.warm} strokeWidth="2" />
                <line x1="0" y1={base} x2="240" y2={base} stroke="#B7BEC4" />
              </svg>
              <b>{d.k} <span>{d.sub}</span></b>
              <i>{d.p}</i>
            </div>
          );
        })}
      </div>
      <figcaption className="mc-cap">The hill is 922 ft, the height of Twin Peaks. Gold line: the inversion capping the layer.</figcaption>
    </figure>
  );
}

// June vs December noon sun at 37.8°N.
export function SunAngle() {
  const cx = 320, cy = 220, r = 160;
  const at = deg => {
    const t = (deg * Math.PI) / 180;
    return { x: cx - r * Math.cos(t), y: cy - r * Math.sin(t) };
  };
  const jun = at(76), dec = at(29);
  return (
    <figure className="mc-fig">
      <div className="mc-scroll">
        <svg viewBox="0 0 640 270" className="mc-svg mc-diagram" role="img"
          aria-label="At San Francisco's latitude the noon sun stands 76 degrees above the horizon on June 21 and 29 degrees on December 21, so a house throws a short summer shadow and a long winter one.">
          <rect width="640" height="270" rx="14" fill="#F7F9FA" />
          <line x1="60" y1={cy} x2="600" y2={cy} stroke={C.line} />
          <path d={`M${cx - r},${cy} A${r},${r} 0 0 1 ${cx + r},${cy}`} fill="none" stroke={C.line} />

          <line x1={cx} y1={cy} x2={dec.x} y2={dec.y} stroke={C.warm} strokeWidth="2.5" />
          <circle cx={dec.x} cy={dec.y} r="9" fill={C.warm} />
          <text className="mc-t-l" x={dec.x + 4} y={dec.y - 18} textAnchor="middle" fill={C.warmText}>Dec 21 · 29°</text>

          <line x1={cx} y1={cy} x2={jun.x} y2={jun.y} stroke={C.cool} strokeWidth="2.5" />
          <circle cx={jun.x} cy={jun.y} r="9" fill={C.cool} />
          <text className="mc-t-l" x={jun.x} y={jun.y - 18} textAnchor="middle">Jun 21 · 76°</text>

          <rect x={cx - 18} y={cy - 44} width="36" height="44" fill="#C9CFD4" />
          <path d={`M${cx - 24},${cy - 44} L${cx},${cy - 64} L${cx + 24},${cy - 44} Z`} fill="#A9B2BA" />
          {/* shadow lengths follow from the angles: h / tan(angle) */}
          <rect x={cx + 18} y={cy + 4} width={64 / Math.tan((76 * Math.PI) / 180)} height="8" rx="2" fill={C.cool} />
          <rect x={cx + 18} y={cy + 16} width={64 / Math.tan((29 * Math.PI) / 180)} height="8" rx="2" fill={C.warm} />
          <text className="mc-t-s" x={cx + 18 + 64 / Math.tan((29 * Math.PI) / 180) + 10} y={cy + 12}>June</text>
          <text className="mc-t-s" x={cx + 18 + 64 / Math.tan((29 * Math.PI) / 180) + 10} y={cy + 25}>December</text>
        </svg>
      </div>
      <figcaption className="mc-cap">Noon sun at 37.8°N. Same house, six months apart.</figcaption>
    </figure>
  );
}
