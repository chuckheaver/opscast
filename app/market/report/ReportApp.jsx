"use client";

// Market Stats on the web: the market report's pages as interactive sections.
// Same figures as the PDF (reports/market/webdata.py writes them from the
// report's own code); here every chart has a hover read-out, and every
// neighborhood, fog zone, tier, month and sale opens the sales behind it.

import { useMemo, useState } from "react";
import SalesPanel from "./SalesPanel";
import { money, bn, usd, int, sgnPct, pctTxt, MON, SEGS } from "./fmt";

const mapHood = name => `/fog?${new URLSearchParams({ hood: name, details: "all" })}`;
const mapSale = id => `/fog?${new URLSearchParams({ preset: "homes", sale: id })}`;
const SEGT = Object.fromEntries(SEGS.map(s => [s.k, s]));
const inWin = (w, d) => d >= w[0] && d <= w[1];

function Tabs({ value, onChange, items, label }) {
  return (
    <div className="mr-tabs" role="tablist" aria-label={label}>
      {items.map(it => (
        <button key={it.k} type="button" role="tab" aria-selected={value === it.k} className={value === it.k ? "on" : ""} onClick={() => onChange(it.k)}>
          {it.color ? <i style={{ background: it.color }} aria-hidden="true" /> : null}{it.label}
        </button>
      ))}
    </div>
  );
}

function Legend({ items }) {
  return <div className="mr-legend">{items.map(it => <span key={it.label}><i style={{ background: it.color }} />{it.label}</span>)}</div>;
}

// A tooltip that follows the pointer inside a chart's frame.
function useTip() {
  const [tip, setTip] = useState(null);
  const at = (e, body) => {
    const r = e.currentTarget.closest(".mr-chart").getBoundingClientRect();
    setTip({ x: e.clientX - r.left, y: e.clientY - r.top, w: r.width, body });
  };
  const el = tip ? <div className="mr-tip" style={{ left: Math.min(tip.x + 14, tip.w - 230), top: Math.max(tip.y - 10, 0) }}>{tip.body}</div> : null;
  return [at, () => setTip(null), el];
}

// ───────────────────────────────── units sold / volume by month
function MonthChart({ data, onDrill }) {
  const [mode, setMode] = useState("units");
  const [at, off, tipEl] = useTip();
  const { months, period, ytd } = data;
  const key = s => (mode === "units" ? s : `${s}_v`);
  const total = o => (o ? SEGS.reduce((t, s) => t + (o[key(s.k)] || 0), 0) : 0);
  const max = Math.max(...months.map(m => Math.max(total(m.prior), total(m.cur)))) * 1.08;
  const W = 760, H = 270, pl = 8, pb = 24, pt = 18, gw = (W - 2 * pl) / 12, bw = gw * 0.36;
  const Y = v => H - pb - (v / max) * (H - pb - pt);
  const fmt = v => (mode === "units" ? int(v) : `$${Math.round(v / 1e6).toLocaleString("en-US")}M`);
  const bar = (o, x, light, m, year) => {
    let y0 = H - pb;
    return SEGS.map(s => {
      const v = o?.[key(s.k)] || 0; if (!v) return null;
      const h = (v / max) * (H - pb - pt); y0 -= h;
      return <rect key={s.k} x={x} y={y0 + 1} width={bw} height={Math.max(h - 2, 0.5)} rx="2" fill={light ? s.light : s.color} />;
    });
  };
  const cmp = m => m.priorSame && period.partial ? m.priorSame : m.prior;
  return (
    <figure className="mr-fig">
      <div className="mr-fig-top">
        <Tabs value={mode} onChange={setMode} label="Measure" items={[{ k: "units", label: "Units sold" }, { k: "vol", label: "Dollar volume" }]} />
        <div className="mr-ytd">
          <b>YTD {mode === "units" ? `${int(ytd.units)} vs ${int(ytd.unitsPrior)}` : `${bn(ytd.vol)} vs ${bn(ytd.volPrior)}`} {pctTxt(sgnPct(mode === "units" ? ytd.units : ytd.vol, mode === "units" ? ytd.unitsPrior : ytd.volPrior))}</b>
          <span>{period.prior} full year {mode === "units" ? int(ytd.unitsPriorYear) : bn(ytd.volPriorYear)}</span>
        </div>
      </div>
      <Legend items={[...SEGS.map(s => ({ label: s.label, color: s.color })), { label: `${period.prior} (lighter)`, color: "#D5D9DE" }]} />
      <div className="mr-chart">
        <svg viewBox={`0 0 ${W} ${H}`} className="mr-svg" role="img" aria-label={`${mode === "units" ? "Units sold" : "Dollar volume"} by month, ${period.prior} and ${period.year}, by category`}>
          <line x1={pl} x2={W - pl} y1={H - pb} y2={H - pb} stroke="#DCDDDE" />
          {months.map((m, i) => {
            const cx = pl + i * gw + gw / 2;
            const tp = total(m.prior), tc = total(m.cur), cp = total(cmp(m));
            const body = (
              <>
                <b>{MON[i]}</b>
                {SEGS.map(s => <div key={s.k}><i style={{ background: s.color }} />{s.label}: {fmt(m.cur?.[key(s.k)] ?? null)} <em>vs {fmt(cmp(m)?.[key(s.k)] ?? null)}</em></div>)}
                <div className="t">Total {fmt(tc || null)} <em>vs {fmt(cp || null)}</em> {m.cur && cp ? pctTxt(sgnPct(tc, cp)) : ""}</div>
                {m.priorSame ? <small>Compared with the same days of {MON[i]} {period.prior}; its whole month was {fmt(tp)}.</small> : null}
                {m.cur ? <small>Click for the sales</small> : null}
              </>
            );
            return (
              <g key={i} className="mr-hit" onMouseMove={e => at(e, body)} onMouseLeave={off} onClick={() => m.cur && onDrill({ title: `${MON[i]} ${period.year}`, sub: "Closed sales", filter: s => s.d.startsWith(`${period.year}-${String(i + 1).padStart(2, "0")}`) && s.d <= period.y1[1] })}>
                <rect x={pl + i * gw} y={pt} width={gw} height={H - pt - pb} fill="transparent" />
                {bar(m.prior, cx - bw - 1, true)}
                {bar(m.cur, cx + 1, false)}
                {tp ? <text x={cx - bw / 2 - 1} y={Y(tp) - 4} className="mr-v mr-v-l" textAnchor="middle">{mode === "units" ? tp : Math.round(tp / 1e6)}</text> : null}
                {tc ? <text x={cx + bw / 2 + 1} y={Y(tc) - 4} className="mr-v" textAnchor="middle">{mode === "units" ? tc : Math.round(tc / 1e6)}</text> : null}
                <text x={cx} y={H - 7} className="mr-ax" textAnchor="middle">{MON[i]}</text>
              </g>
            );
          })}
        </svg>
        {tipEl}
      </div>
    </figure>
  );
}

// ───────────────────────────────── sale vs list, by month
function SaleVsList({ data }) {
  const [seg, setSeg] = useState("sfh");
  const [at, off, tipEl] = useTip();
  const rows = data.months.filter(m => m.cur).map((m, i) => ({
    m: m.m, list: m.list[seg], sold: m.sold[seg],
    yoy: sgnPct(m.sold[seg], m.priorSame ? m.priorSame[`sold_${seg}`] : m.priorSold?.[seg]),
  }));
  const vals = rows.flatMap(r => [r.list, r.sold]).filter(Boolean);
  const lo = Math.min(...vals) * 0.92, hi = Math.max(...vals) * 1.06;
  const W = 760, H = 250, pl = 30, pb = 40, pt = 22;
  const X = i => pl + (i * (W - 2 * pl)) / Math.max(rows.length - 1, 1);
  const Y = v => H - pb - ((v - lo) / (hi - lo)) * (H - pb - pt);
  const path = k => rows.map((r, i) => (r[k] ? `${i ? "L" : "M"}${X(i).toFixed(1)},${Y(r[k]).toFixed(1)}` : "")).join(" ");
  return (
    <figure className="mr-fig">
      <div className="mr-fig-top">
        <Tabs value={seg} onChange={setSeg} label="Category" items={SEGS.map(s => ({ k: s.k, label: s.label, color: s.color }))} />
      </div>
      <Legend items={[{ label: "Median list price", color: "#E9BC3F" }, { label: "Median sale price", color: "#203C5F" }]} />
      <div className="mr-chart">
        <svg viewBox={`0 0 ${W} ${H}`} className="mr-svg" role="img" aria-label={`Median list and sale price by month, ${SEGT[seg].label}`}>
          <path d={path("list")} fill="none" stroke="#E9BC3F" strokeWidth="2.4" />
          <path d={path("sold")} fill="none" stroke="#203C5F" strokeWidth="2.4" />
          {rows.map((r, i) => (
            <g key={r.m} className="mr-hit" onMouseMove={e => at(e, <><b>{MON[r.m - 1]} {data.period.year}</b><div>Median list {money(r.list)}</div><div>Median sale {money(r.sold)}</div>
              <div className="t">Sale vs list {r.list && r.sold ? `${Math.round((100 * r.sold) / r.list)}%` : "—"}</div><div>Sale vs {MON[r.m - 1]} {data.period.prior}: {pctTxt(r.yoy)}</div></>)} onMouseLeave={off}>
              <rect x={X(i) - (W - 2 * pl) / rows.length / 2} y={pt} width={(W - 2 * pl) / rows.length} height={H - pt - pb} fill="transparent" />
              {r.list ? <circle cx={X(i)} cy={Y(r.list)} r="4" fill="#E9BC3F" stroke="#fff" strokeWidth="1.5" /> : null}
              {r.sold ? <circle cx={X(i)} cy={Y(r.sold)} r="4" fill="#203C5F" stroke="#fff" strokeWidth="1.5" /> : null}
              {r.sold ? <text x={X(i)} y={Y(r.sold) - 9} className="mr-v" textAnchor="middle">{money(r.sold)}</text> : null}
              <text x={X(i)} y={H - 22} className="mr-ax" textAnchor="middle">{MON[r.m - 1]}</text>
              <text x={X(i)} y={H - 6} className={`mr-ax mr-yoy ${r.yoy == null ? "" : r.yoy >= 0 ? "up" : "dn"}`} textAnchor="middle">{pctTxt(r.yoy)}</text>
            </g>
          ))}
        </svg>
        {tipEl}
      </div>
    </figure>
  );
}

// ───────────────────────────────── allocation of money
function Split({ title, parts, total, fmtv, onPick }) {
  return (
    <div className="mr-split">
      <h4>{title}</h4>
      <div className="mr-split-bar">
        {parts.map(p => (
          <button key={p.label} type="button" className="mr-split-seg" style={{ flexGrow: Math.max(p.v, total * 0.001), background: p.color, color: p.dark ? "#fff" : "#131A25" }}
            onClick={() => onPick(p)} title={`${p.label}: ${fmtv(p.v)} (${Math.round((100 * p.v) / total)}%)`}>
            <b>{fmtv(p.v)}</b><span>{Math.round((100 * p.v) / total)}%</span>
          </button>
        ))}
      </div>
    </div>
  );
}
function Allocation({ data, onDrill }) {
  const [all, setAll] = useState(false);
  const { tiers, types, hoods, n, total } = data.alloc;
  const y1 = data.period.y1;
  const DARK = new Set(["#203C5F", "#7E9AB8", "#6B6F75"]);
  const tierBounds = [[0, 1e6], [1e6, 3e6], [3e6, 5e6], [5e6, 1e13]];
  const tierPick = (t, i) => onDrill({ title: `${t.label} sales`, sub: `Jan 1 – ${y1[1]}`, filter: s => inWin(y1, s.d) && s.p >= tierBounds[i][0] && s.p < tierBounds[i][1] });
  const typePick = t => onDrill({ title: t.label, sub: `Jan 1 – ${y1[1]}`, filter: s => inWin(y1, s.d) && s.seg === t.key });
  const shown = all ? hoods : hoods.slice(0, 20);
  const maxv = hoods[0]?.v || 1;
  let cum = 0, half = null;
  hoods.forEach((h, i) => { cum += h.v; if (half == null && cum >= total / 2) half = i; });
  return (
    <div className="mr-cols">
      <div>
        <h3 className="mr-h3">By price tier</h3>
        <Split title="Units sold" total={n} fmtv={int} parts={tiers.map((t, i) => ({ ...t, v: t.n, i, dark: DARK.has(t.color) }))} onPick={p => tierPick(p, p.i)} />
        <Split title="Dollars" total={total} fmtv={bn} parts={tiers.map((t, i) => ({ ...t, v: t.v, i, dark: DARK.has(t.color) }))} onPick={p => tierPick(p, p.i)} />
        <Legend items={tiers.map(t => ({ label: t.label, color: t.color }))} />
        <h3 className="mr-h3">By type</h3>
        <Split title="Units sold" total={n} fmtv={int} parts={types.map(t => ({ ...t, v: t.n, color: SEGT[t.key].color, dark: t.key !== "co" }))} onPick={typePick} />
        <Split title="Dollars" total={total} fmtv={bn} parts={types.map(t => ({ ...t, v: t.v, color: SEGT[t.key].color, dark: t.key !== "co" }))} onPick={typePick} />
        <Legend items={SEGS.map(s => ({ label: s.label, color: s.color }))} />
      </div>
      <div>
        <h3 className="mr-h3">By neighborhood, dollars</h3>
        <ol className="mr-hbars">
          {shown.map((h, i) => (
            <li key={h.name} className={i === half ? "half" : ""}>
              <button type="button" onClick={() => onDrill({ title: h.name, sub: "All sales", filter: s => inWin(y1, s.d) && s.h === h.name, prior: s => inWin(data.period.y0, s.d) && s.h === h.name, years: [data.period.year, data.period.prior] })}>
                <span className="nm">{h.name}</span>
                <span className="tr"><i style={{ width: `${(100 * h.v) / maxv}%` }} /></span>
                <b>{bn(h.v)}</b><em>{int(h.n)}</em>
              </button>
            </li>
          ))}
        </ol>
        <button type="button" className="mr-more" onClick={() => setAll(a => !a)}>{all ? "Show the top 20" : `Show all ${hoods.length} neighborhoods`}</button>
      </div>
    </div>
  );
}

// ───────────────────────────────── the 10s
function TenCard({ title, head, rows }) {
  return (
    <div className="mr-ten">
      <h4>{title}</h4>
      <table><thead><tr>{head.map((h, i) => <th key={h} className={i ? "" : "l"}>{h}</th>)}</tr></thead>
        <tbody>{rows}</tbody></table>
    </div>
  );
}
function Tens({ data, onDrill }) {
  const [seg, setSeg] = useState("sfh");
  const T = data.tens.segs[seg], y1 = data.period.y1, lab = SEGT[seg].label;
  const star = n => (n < 10 ? "*" : "");
  const hoodRows = list => list.map((h, i) => (
    <tr key={h.name}><td className="l"><button type="button" className="mr-link" onClick={() => onDrill({ title: h.name, sub: `${lab}, Jan 1 – ${y1[1]}`, filter: s => inWin(y1, s.d) && s.h === h.name && s.seg === seg })}>{i + 1}. {h.name}{star(h.n)}</button></td><td className="b">{money(h.med)}</td><td>{h.n}</td></tr>));
  const saleRows = (list, kind) => list.map((s, i) => (
    <tr key={s.id}><td className="l"><a href={mapSale(s.id)}>{i + 1}. {s.a}</a></td>
      {kind === "ppsf" ? <><td className="b">{usd(s.ppsf)}</td><td>{money(s.p)}</td></> : <><td className="b">{money(s.p)}</td><td className={s.pct > 100 ? "up" : ""}>{s.pct ? `${s.pct}%` : "—"}</td></>}</tr>));
  return (
    <>
      <div className="mr-fig-top"><Tabs value={seg} onChange={setSeg} label="Category" items={SEGS.map(s => ({ k: s.k, label: s.label, color: s.color }))} /></div>
      <div className="mr-tens">
        <TenCard title={`Neighborhood ${lab}`} head={["Neighborhood", "Median", "Sales"]} rows={hoodRows(T.hoods)} />
        <TenCard title={`Top 10 ${lab}`} head={["Address", "Closed", "% list"]} rows={saleRows(T.top)} />
        <TenCard title={`Top $/sf ${lab}`} head={["Address", "$/sf", "Closed"]} rows={saleRows(T.ppsf, "ppsf")} />
        <TenCard title={`Overbids – ${lab}`} head={["Address", "Closed", "% list"]} rows={saleRows(T.over)} />
        <TenCard title={`Lowest neighborhood ${lab}`} head={["Neighborhood", "Median", "Sales"]} rows={hoodRows(T.hoodsLow)} />
        <TenCard title={`Lowest 10 ${lab}`} head={["Address", "Closed", "% list"]} rows={saleRows(T.low)} />
        <TenCard title="Top # units sold (all)" head={["Neighborhood", "Sales", "Median"]} rows={data.tens.busiest.map((h, i) => (
          <tr key={h.name}><td className="l"><button type="button" className="mr-link" onClick={() => onDrill({ title: h.name, sub: `All sales, Jan 1 – ${y1[1]}`, filter: s => inWin(y1, s.d) && s.h === h.name })}>{i + 1}. {h.name}</button></td><td className="b">{int(h.n)}</td><td>{money(h.med)}</td></tr>))} />
      </div>
    </>
  );
}

// ───────────────────────────────── by the numbers
function Numbers({ data }) {
  const b = data.bn;
  const [at, off, tipEl] = useTip();
  const { rows, cut, ytd, ytdPrior, priorYear } = data.weeks;
  const max = Math.max(...rows.map(r => Math.max(r.a || 0, r.b || 0))) * 1.1;
  const W = 960, H = 210, pl = 6, pb = 20, pt = 12, gw = (W - 2 * pl) / rows.length, bw = gw * 0.42;
  const Y = v => H - pb - (v / max) * (H - pb - pt);
  const T = (cls, v, l, s) => <div className={`mr-bn ${cls}`}><b>{v}</b><span>{l}</span>{s ? <i>{s}</i> : null}</div>;
  return (
    <>
      <div className="mr-bns">
        {T("navy big", b.per_day, "Avg daily sales volume", `${b.vol} over ${b.days} days`)}
        {T("gold wide", b.every, "between sales, on average")}
        {T("light wide", b.off, "properties sold off-market", `${b.offpct} of ${b.n} sales`)}
        {T("light", b.topday, `Most frequent close day, ${b.toppct} of total`)}
        {T("light", b.week, "sold within a week")}
        {T("navy wide", <>{b.bid150}<small> of {b.bidn} ({b.bidpct})</small></>, "homes sold for 150% of list or more", `${b.bid130} went for 130%+`)}
        {T("light wide", b.steep, "properties on a steep incline (15%+)", `${b.steeppct} of ${b.slopen} sales · ground slope at the address`)}
        {T("gold", b.zip, "highest volume ZIP", `${b.zipv} · ${b.zhoods}`)}
        {T("light", b.under, "sold below asking")}
        {T("light", b.tenm, "sales of $10M or more")}
        {T("navy pair", `${b.sqft.replace(" sf", "")} / ${b.csqft.replace(" sf", "")} / ${b.osqft.replace(" sf", "")}`, "median sq ft — SFH, Condo/TIC/Co-op, Other")}
      </div>
      <h3 className="mr-h3">Units sold by week, every week of both years</h3>
      <div className="mr-fig-top">
        <Legend items={[{ label: `${data.period.prior}`, color: "#B9BDC4" }, { label: `${data.period.year}`, color: "#203C5F" }]} />
        <div className="mr-ytd"><b>YTD {int(ytd)} vs {int(ytdPrior)} {pctTxt(sgnPct(ytd, ytdPrior))}</b><span>{data.period.prior} full year {int(priorYear)}</span></div>
      </div>
      <div className="mr-chart">
        <svg viewBox={`0 0 ${W} ${H}`} className="mr-svg" role="img" aria-label="Units sold by week, both years">
          <line x1={pl} x2={W - pl} y1={H - pb} y2={H - pb} stroke="#DCDDDE" />
          {rows.map((r, i) => {
            const x = pl + i * gw;
            const d0 = new Date(Date.UTC(data.period.year, 0, 1 + 7 * (r.w - 1)));
            const lab = `${MON[d0.getUTCMonth()]} ${d0.getUTCDate()}`;
            return (
              <g key={r.w} className="mr-hit" onMouseMove={e => at(e, <><b>Week {r.w} · from {lab}</b><div>{data.period.prior}: {int(r.a)}</div><div>{data.period.year}: {r.b == null ? "—" : int(r.b)}</div>{r.d ? <div className="t">{r.d}</div> : null}</>)} onMouseLeave={off}>
                <rect x={x} y={pt} width={gw} height={H - pt - pb} fill="transparent" />
                {r.a ? <rect x={x + gw / 2 - bw} y={Y(r.a)} width={bw - 1} height={H - pb - Y(r.a)} rx="1.5" fill="#B9BDC4" /> : null}
                {r.b ? <rect x={x + gw / 2} y={Y(r.b)} width={bw - 1} height={H - pb - Y(r.b)} rx="1.5" fill="#203C5F" /> : null}
                {r.w % 4 === 1 ? <text x={x + gw / 2} y={H - 5} className="mr-ax" textAnchor="middle">{lab}</text> : null}
              </g>
            );
          })}
          <line x1={pl + cut * gw} x2={pl + cut * gw} y1={pt} y2={H - pb} stroke="#9AA0A6" strokeDasharray="3 3" />
        </svg>
        {tipEl}
      </div>
    </>
  );
}

// ───────────────────────────────── market grids
const METRICS = [
  { k: "n", label: "Qty sold", fmt: int },
  { k: "price", label: "Median sale price", fmt: money },
  { k: "avg", label: "Average sale price", fmt: money },
  { k: "ppsf", label: "Median $/sf", fmt: usd },
  { k: "dom", label: "Median DOM", fmt: v => (v == null ? "—" : Math.round(v)), lowGood: true },
  { k: "pct", label: "Sold price vs list %", fmt: v => (v == null ? "—" : Math.round(v)) },
];
const WINS = ["m1", "m0", "y1", "y0"];
function tone(st, w, m) {
  if (w !== "m1" && w !== "y1") return "pri";
  const v = st[w][m.k], p = st[w === "m1" ? "m0" : "y0"][m.k];
  if (v == null || p == null || v === p) return "cur";
  const better = m.lowGood ? v < p : v > p;
  return better ? "cur up" : "cur dn";
}
function Grids({ data, onDrill }) {
  const [seg, setSeg] = useState("sfh");
  const [metric, setMetric] = useState("all");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState({ k: "name", w: "y1", dir: 1 });
  const g = data.grids.find(x => x.key === seg);
  const lab = data.labels;
  const mets = metric === "all" ? METRICS : METRICS.filter(m => m.k === metric);
  const rows = useMemo(() => {
    const r = g.rows.filter(x => !q || x.name.toLowerCase().includes(q.toLowerCase()));
    r.sort((a, b) => {
      if (sort.k === "name") return sort.dir * a.name.localeCompare(b.name);
      const x = a.st[sort.w][sort.k], y = b.st[sort.w][sort.k];
      if (x == null && y == null) return 0;
      if (x == null) return 1;
      if (y == null) return -1;
      return sort.dir * (x - y);
    });
    return r;
  }, [g, q, sort]);
  const P = data.period;
  const drill = (title, f) => onDrill({ title, sub: g.title, filter: s => s.seg === seg && inWin(P.y1, s.d) && f(s), prior: s => s.seg === seg && inWin(P.y0, s.d) && f(s), years: [P.year, P.prior] });
  const cells = st => mets.map(m => WINS.map((w, j) => (
    <td key={m.k + w} className={`${tone(st, w, m)}${j === 0 ? " g0" : j === 2 ? " g2" : ""}`}>{m.fmt(st[w][m.k])}</td>)));
  const sortBtn = (k, w, text) => (
    <button type="button" onClick={() => setSort(s => ({ k, w, dir: s.k === k && s.w === w ? -s.dir : k === "name" ? 1 : -1 }))}>
      {text}{sort.k === k && sort.w === w ? (sort.dir > 0 ? " ▲" : " ▼") : ""}
    </button>
  );
  const notes = g.rows.filter(r => r.note);
  return (
    <>
      <div className="mr-fig-top mr-grid-ctl">
        <Tabs value={seg} onChange={setSeg} label="Category" items={SEGS.map(s => ({ k: s.k, label: s.label, color: s.color }))} />
        <select value={metric} onChange={e => setMetric(e.target.value)} aria-label="Measures shown">
          <option value="all">All measures</option>
          {METRICS.map(m => <option key={m.k} value={m.k}>{m.label}</option>)}
        </select>
        <input type="search" placeholder="Find a neighborhood" value={q} onChange={e => setQ(e.target.value)} aria-label="Find a neighborhood" />
      </div>
      <div className="dv-scroll-x">
        <table className="dv-t mr-grid">
          <thead>
            <tr className="grp"><th rowSpan="2" className="l">{sortBtn("name", "y1", "Neighborhood")}</th>{mets.map(m => <th key={m.k} colSpan="4" className="g1">{m.label}</th>)}</tr>
            <tr>{mets.map(m => WINS.map((w, j) => <th key={m.k + w} className={`${j === 0 ? "g1" : ""} ${w[0] === "y" ? "ytd" : ""}`}>{sortBtn(m.k, w, lab[w])}</th>))}</tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.name} className="dv-hit" onClick={() => drill(r.name, s => s.h === r.name)}>
                <td className="l"><button type="button" className="dv-n" onClick={e => { e.stopPropagation(); drill(r.name, s => s.h === r.name); }}>{r.name}{r.note ? "†" : ""}</button> <small>{r.code}</small></td>
                {cells(r.st)}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="city dv-hit" onClick={() => drill("All San Francisco", () => true)}><td className="l">All San Francisco (pooled)</td>{cells(g.total)}</tr>
          </tfoot>
        </table>
      </div>
      <h3 className="mr-h3">By fog zone</h3>
      <div className="dv-scroll-x">
        <table className="dv-t mr-grid">
          <thead>
            <tr className="grp"><th rowSpan="2" className="l">Fog zone</th>{mets.map(m => <th key={m.k} colSpan="4" className="g1">{m.label}</th>)}</tr>
            <tr>{mets.map(m => WINS.map((w, j) => <th key={m.k + w} className={`${j === 0 ? "g1" : ""} ${w[0] === "y" ? "ytd" : ""}`}>{lab[w]}</th>))}</tr>
          </thead>
          <tbody>
            {g.zones.map((z, i) => (
              <tr key={z.name} className="dv-hit" onClick={() => drill(`${z.name} zone`, s => s.z === z.name)}>
                <td className="l"><span className="mr-zone" style={{ background: z.color }}>{i + 1}</span>{z.name}</td>{cells(z.st)}
              </tr>
            ))}
          </tbody>
          <tfoot><tr className="city"><td className="l">Total — all zones</td>{cells(g.total)}</tr></tfoot>
        </table>
      </div>
      {notes.length ? <p className="mr-note">{notes.map(r => <span key={r.name}>† {r.name}: {r.note.join(" ")} </span>)}</p> : null}
    </>
  );
}

// ───────────────────────────────── cost of ownership
function Cost({ data }) {
  const c = data.cost;
  const [rate, setRate] = useState(c.mtgNow);
  const pmt = (price, r) => { const i = r / 100 / 12, n = 360, P = price * 0.8; return (P * i) / (1 - (1 + i) ** -n); };
  const base = 6.1;
  const [at, off, tipEl] = useTip();
  const [at2, off2, tip2] = useTip();
  const W = 620, H = 220, pl = 24, pb = 26, pt = 18;
  const lo = 3.8, hi = 7.6, X = i => pl + (i * (W - 2 * pl)) / (c.spread.length - 1), Y = v => H - pb - ((v - lo) / (hi - lo)) * (H - pb - pt);
  const lux = c.lux, years = Object.keys(lux).sort(), lmax = Math.max(...years.flatMap(y => lux[y])) * 1.2;
  const LW = 620, LH = 220, lgw = (LW - 2 * 10) / 12, lbw = lgw * 0.36, LY = v => LH - 24 - (v / lmax) * (LH - 24 - 16);
  const carry = 8e6 * c.tenNow / 100, tax = 8e6 * c.propTax;
  const diff = v => { const r = Math.round(v); return r === 0 ? "0" : `${r > 0 ? "+" : "−"}${Math.abs(r).toLocaleString("en-US")}`; };
  const longDate = iso => new Date(`${iso}T12:00:00`).toLocaleDateString("en-US", { month: "long", day: "numeric" });
  return (
    <div className="mr-cols">
      <div>
        <h3 className="mr-h3">The cost of financing a median home</h3>
        <div className="mr-calc">
          <label>30-year rate <b>{rate.toFixed(2)}%</b>
            <input type="range" min="5" max="8.5" step="0.05" value={rate} onChange={e => setRate(+e.target.value)} />
          </label>
          <div className="mr-calc-out">
            <div><span>SFH median {money(c.medSfh)}</span><b>{usd(pmt(c.medSfh, rate))}/mo</b><em>{diff(pmt(c.medSfh, rate) - pmt(c.medSfh, base))} a month vs {base.toFixed(2)}%</em></div>
            <div><span>Condo/TIC/Co-op median {money(c.medCo)}</span><b>{usd(pmt(c.medCo, rate))}/mo</b><em>{diff(pmt(c.medCo, rate) - pmt(c.medCo, base))} a month vs {base.toFixed(2)}%</em></div>
          </div>
          <button type="button" className="mr-more" onClick={() => setRate(c.mtgNow)}>Today&rsquo;s rate ({c.mtgNow.toFixed(2)}%, Freddie Mac {c.survey})</button>
        </div>
        <div className="dv-scroll-x"><table className="dv-t mr-pay">
          <thead><tr><th className="l">30-yr rate</th><th>SFH median</th><th>vs 6.10%</th><th>Condo/TIC/Co-op</th><th>vs 6.10%</th></tr></thead>
          <tbody>{c.payments.map(p => (
            <tr key={p.rate}><td className="l">{p.rate.toFixed(2)}%</td><td className="b">{usd(p.sfh)}</td><td className={p.rate > base ? "dn" : ""}>{diff(p.sfh - pmt(c.medSfh, base))}</td>
              <td className="b">{usd(p.co)}</td><td className={p.rate > base ? "dn" : ""}>{diff(p.co - pmt(c.medCo, base))}</td></tr>))}</tbody>
        </table></div>
        <h3 className="mr-h3">30-year mortgage vs 10-year Treasury</h3>
        <Legend items={[{ label: "30-yr mortgage (Freddie Mac)", color: "#E9BC3F" }, { label: "10-yr Treasury", color: "#203C5F" }]} />
        <div className="mr-chart">
          <svg viewBox={`0 0 ${W} ${H}`} className="mr-svg" role="img" aria-label="30-year mortgage rate and 10-year Treasury yield by month">
            <polygon points={`${c.spread.map((r, i) => `${X(i)},${Y(r.mtg)}`).join(" ")} ${[...c.spread].reverse().map((r, i) => `${X(c.spread.length - 1 - i)},${Y(r.ten)}`).join(" ")}`} fill="#E9BC3F" fillOpacity="0.15" />
            {["mtg", "ten"].map(k => <path key={k} d={c.spread.map((r, i) => `${i ? "L" : "M"}${X(i)},${Y(r[k])}`).join(" ")} fill="none" stroke={k === "mtg" ? "#E9BC3F" : "#203C5F"} strokeWidth="2.4" />)}
            {c.spread.map((r, i) => (
              <g key={r.m} className="mr-hit" onMouseMove={e => at(e, <><b>{r.m}</b><div>30-yr mortgage {r.mtg.toFixed(2)}%</div><div>10-yr Treasury {r.ten.toFixed(2)}%</div><div className="t">Spread {(r.mtg - r.ten).toFixed(2)} pts</div></>)} onMouseLeave={off}>
                <rect x={X(i) - 25} y={pt} width="50" height={H - pt - pb} fill="transparent" />
                <circle cx={X(i)} cy={Y(r.mtg)} r="4" fill="#E9BC3F" stroke="#fff" strokeWidth="1.5" />
                <circle cx={X(i)} cy={Y(r.ten)} r="4" fill="#203C5F" stroke="#fff" strokeWidth="1.5" />
                {i === 0 || i === c.spread.length - 1 ? <><text x={X(i)} y={Y(r.mtg) - 9} className="mr-v" textAnchor={i ? "end" : "start"}>{r.mtg.toFixed(2)}%</text><text x={X(i)} y={Y(r.ten) + 17} className="mr-v" textAnchor={i ? "end" : "start"}>{r.ten.toFixed(2)}%</text></> : null}
                <text x={X(i)} y={H - 8} className="mr-ax" textAnchor="middle">{r.m}</text>
              </g>
            ))}
          </svg>
          {tipEl}
        </div>
        <h3 className="mr-h3">The yield curve, {c.asOf}</h3>
        <div className="mr-curve">{c.curve.map(p => <div key={p.t}><b>{p.v.toFixed(2)}%</b><span>{p.t}</span></div>)}</div>
      </div>
      <div>
        <h3 className="mr-h3">Over $5M — sales by month</h3>
        <Legend items={[{ label: `${years[0]} (full year)`, color: "#B9BDC4" }, { label: years[1], color: "#203C5F" }]} />
        <div className="mr-chart">
          <svg viewBox={`0 0 ${LW} ${LH}`} className="mr-svg" role="img" aria-label="Sales over $5 million by month, both years">
            <line x1="10" x2={LW - 10} y1={LH - 24} y2={LH - 24} stroke="#DCDDDE" />
            {MON.map((m, i) => {
              const cx = 10 + i * lgw + lgw / 2, a = lux[years[0]][i], b = i + 1 <= +data.period.m1[0].slice(5, 7) ? lux[years[1]][i] : null;
              return (
                <g key={m} className="mr-hit" onMouseMove={e => at2(e, <><b>{m}</b><div>{years[0]}: {a}</div><div>{years[1]}: {b ?? "—"}</div></>)} onMouseLeave={off2}>
                  <rect x={cx - lgw / 2} y="10" width={lgw} height={LH - 34} fill="transparent" />
                  {a ? <rect x={cx - lbw - 1} y={LY(a)} width={lbw} height={LH - 24 - LY(a)} rx="2" fill="#B9BDC4" /> : null}
                  {b ? <rect x={cx + 1} y={LY(b)} width={lbw} height={LH - 24 - LY(b)} rx="2" fill="#203C5F" /> : null}
                  {b ? <text x={cx + 1 + lbw / 2} y={LY(b) - 4} className="mr-v" textAnchor="middle">{b}</text> : null}
                  <text x={cx} y={LH - 8} className="mr-ax" textAnchor="middle">{m}</text>
                </g>
              );
            })}
          </svg>
          {tip2}
        </div>
        <p className="mr-stat"><b>{c.luxYtd}</b> sales Jan 1 – {longDate(data.period.y1[1])} against <b>{c.luxYtdPrior}</b> in the same stretch of {years[0]}, {pctTxt(sgnPct(c.luxYtd, c.luxYtdPrior))}.</p>
        <h3 className="mr-h3">Annual opportunity cost of owning an $8M home</h3>
        <ul className="mr-math">
          <li>Lost bond earnings ({c.tenNow.toFixed(2)}%, 10-yr Treasury) <b>{usd(Math.round(carry / 1000) * 1000)}</b></li>
          <li>Real estate taxes ({(100 * c.propTax).toFixed(2)}%) <b>{usd(tax)}</b></li>
          <li className="tot">Total <b>{usd(Math.round(carry / 1000) * 1000 + tax)}</b></li>
        </ul>
        <div className="mr-carry">{c.tenY.map((t, i) => <div key={t.m} style={{ "--h": `${12 + ((t.v - 3.9) / (5.4 - 3.9)) * 80}%` }} title={`${t.m}: ${t.v.toFixed(2)}% → $${Math.round(8e6 * t.v / 100 / 1000)}K a year`}>{i === 0 || i === c.tenY.length - 1 ? <b>${Math.round(8e6 * t.v / 100 / 1000)}K</b> : null}<i /><span>{t.m}</span></div>)}</div>
      </div>
    </div>
  );
}

export function Overview({ data }) {
  const [open, setOpen] = useState(null);
  return (<>
    <div className="mr-cols mr-cols-even">
      <div><h3 className="mr-h3">Units sold and volume by month</h3><MonthChart data={data} onDrill={setOpen} /></div>
      <div><h3 className="mr-h3">Sale vs list</h3><SaleVsList data={data} /></div>
    </div>
    {open && <SalesPanel open={open} onClose={() => setOpen(null)} />}
  </>);
}
export function AllocationSection({ data }) {
  const [open, setOpen] = useState(null);
  return (<><Allocation data={data} onDrill={setOpen} />{open && <SalesPanel open={open} onClose={() => setOpen(null)} />}</>);
}
export function TensSection({ data }) {
  const [open, setOpen] = useState(null);
  return (<><Tens data={data} onDrill={setOpen} />{open && <SalesPanel open={open} onClose={() => setOpen(null)} />}</>);
}
export function NumbersSection({ data }) { return <Numbers data={data} />; }
export function GridsSection({ data }) {
  const [open, setOpen] = useState(null);
  return (<><Grids data={data} onDrill={setOpen} />{open && <SalesPanel open={open} onClose={() => setOpen(null)} />}</>);
}
export function CostSection({ data }) { return <Cost data={data} />; }
