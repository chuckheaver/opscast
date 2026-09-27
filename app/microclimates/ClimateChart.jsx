// San Francisco's year in one picture: the temperature ribbon (average high
// down to average low) laid over monthly rainfall bars — a climograph.
//
// Pure SVG in a server component: no chart library, no client JavaScript, and
// it scales with the container because everything is drawn in viewBox units.
// The numbers live in app/lib/sf-climate.json so the drawing never disagrees
// with the table underneath it.

import CLIMATE from "../lib/sf-climate.json";

const W = 820, H = 372;
const PAD = { t: 22, r: 50, b: 52, l: 50 };
const PLOT = { w: W - PAD.l - PAD.r, h: H - PAD.t - PAD.b };
const BASE = PAD.t + PLOT.h;          // y of the zero line
const BAND = PLOT.w / 12;

// Two scales sharing one plot box, the way a climograph does it: degrees on
// the left, inches on the right.
const T_MIN = 40, T_MAX = 75;
const P_MAX = 5;
const yT = f => BASE - ((f - T_MIN) / (T_MAX - T_MIN)) * PLOT.h;
const yP = i => BASE - (i / P_MAX) * PLOT.h;
const xM = i => PAD.l + i * BAND + BAND / 2;

export default function ClimateChart() {
  const m = CLIMATE.months;
  const total = m.reduce((a, b) => a + b.precip, 0);
  const wet = m.filter(x => ["Nov", "Dec", "Jan", "Feb", "Mar"].includes(x.m))
    .reduce((a, b) => a + b.precip, 0);
  const warmest = m.reduce((a, b) => (b.high > a.high ? b : a));
  const coolest = m.reduce((a, b) => (b.high < a.high ? b : a));

  const highPath = m.map((d, i) => `${i ? "L" : "M"}${xM(i)},${yT(d.high)}`).join(" ");
  const lowPath = m.map((d, i) => `${i ? "L" : "M"}${xM(i)},${yT(d.low)}`).join(" ");
  const ribbon = `${highPath} ` +
    m.slice().reverse().map((d, i) => `L${xM(11 - i)},${yT(d.low)}`).join(" ") + " Z";

  return (
    <figure className="mc-chart">
      {/* The drawing keeps a readable minimum width and scrolls sideways on a
          phone rather than shrinking its labels into nothing. */}
      <div className="mc-chart-scroll">
      <svg
        viewBox={`0 0 ${W} ${H}`} className="mc-chart-svg" role="img"
        aria-label={
          `San Francisco monthly climate normals. Average highs run from ` +
          `${coolest.high} degrees in ${coolest.m} to ${warmest.high} degrees in ${warmest.m}. ` +
          `Rainfall totals about ${total.toFixed(1)} inches a year, almost all of it between November and March.`
        }
      >
        {/* Degree gridlines, drawn first so everything sits on top of them. */}
        {[40, 50, 60, 70].map(f => (
          <g key={f}>
            <line className="mc-grid" x1={PAD.l} x2={PAD.l + PLOT.w} y1={yT(f)} y2={yT(f)} />
            <text className="mc-axis" x={PAD.l - 10} y={yT(f) + 4} textAnchor="end">{f}°</text>
          </g>
        ))}
        {[1, 2, 3, 4, 5].map(i => (
          <text key={i} className="mc-axis" x={PAD.l + PLOT.w + 10} y={yP(i) + 4}>{i}&Prime;</text>
        ))}

        {/* Rain first, temperature over it: the bars are the ground. */}
        {m.map((d, i) => {
          const h = BASE - yP(d.precip);
          return h < 0.5 ? null : (
            <rect key={d.m} className="mc-rain" x={xM(i) - 15} y={yP(d.precip)} width={30} height={h} rx={3} />
          );
        })}

        <path className="mc-ribbon" d={ribbon} />
        <path className="mc-line-high" d={highPath} />
        <path className="mc-line-low" d={lowPath} />

        {m.map((d, i) => (
          <g key={d.m}>
            <circle className="mc-dot-high" cx={xM(i)} cy={yT(d.high)} r={3.4} />
            <circle className="mc-dot-low" cx={xM(i)} cy={yT(d.low)} r={3.4} />
            <text className="mc-val" x={xM(i)} y={yT(d.high) - 9} textAnchor="middle">{d.high}</text>
            <text className="mc-val mc-val-low" x={xM(i)} y={yT(d.low) + 17} textAnchor="middle">{d.low}</text>
            <text className="mc-month" x={xM(i)} y={BASE + 20} textAnchor="middle">{d.m}</text>
            <text className="mc-rain-val" x={xM(i)} y={BASE + 38} textAnchor="middle">
              {d.precip === 0 ? "—" : d.precip.toFixed(1)}
            </text>
          </g>
        ))}

        <line className="mc-base" x1={PAD.l} x2={PAD.l + PLOT.w} y1={BASE} y2={BASE} />
      </svg>
      </div>

      <p className="mc-scroll-hint" aria-hidden="true">Scroll the chart sideways for the rest of the year &rarr;</p>

      <div className="mc-chart-key">
        <span><i className="mc-k-temp" /> Average high and low, °F</span>
        <span><i className="mc-k-rain" /> Rainfall, inches</span>
      </div>

      <figcaption className="mc-chart-cap">
        {CLIMATE.station}, {CLIMATE.period}. Highs move only {warmest.high - coolest.high}°F across
        the whole year — {coolest.m} to {warmest.m} — and {Math.round((wet / total) * 100)}% of
        the {total.toFixed(1)} inches of annual rain falls between November and March.
        {" "}{CLIMATE.note}
      </figcaption>
    </figure>
  );
}

// The same numbers as a table, for readers who want to look one month up
// rather than read a shape — and for anything that cannot see the drawing.
export function ClimateTable() {
  const m = CLIMATE.months;
  return (
    <div className="mc-table-wrap">
      <table className="mc-table mc-climate-table">
        <caption className="lp-fine">{CLIMATE.station} · {CLIMATE.period}</caption>
        <thead>
          <tr>
            <th scope="col">Month</th>
            <th scope="col">Avg high</th>
            <th scope="col">Avg low</th>
            <th scope="col">Rain</th>
          </tr>
        </thead>
        <tbody>
          {m.map(d => (
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
    <div className="mc-extremes">
      {CLIMATE.extremes.map(e => (
        <div className="mc-extreme" key={e.k}>
          <div className="mc-extreme-v">{e.v}</div>
          <div className="mc-extreme-k">{e.k}<span className="lp-fine"> · {e.when}</span></div>
        </div>
      ))}
    </div>
  );
}
