"use client";

// Prices by microclimate, interactive. The report's Heat Map and "Microclimates
// and Real Estate" pages, as a page you can use: the fog-zone map (shade it by
// zone or by a figure, zoom in, hover or click a neighborhood), the fog zones as
// filters, a sortable neighborhood index, and the closings-by-fog-zone grid —
// all for one sales category at a time. Data: app/lib/microclimate-market.json,
// built by reports/market/microclimate_market.py.

import { useMemo, useRef, useState } from "react";
import Link from "next/link";

const mShort = v => (v == null ? "—" : v >= 995_000 ? `$${(v / 1e6).toFixed(v >= 1e7 ? 0 : 1)}M` : `$${Math.round(v / 1e3)}K`);
const money = v => (v == null ? "—" : v >= 995_000 ? `$${(v / 1e6).toFixed(2)}M` : `$${Math.round(v / 1e3)}K`);
const usd = v => (v == null ? "—" : `$${Math.round(v).toLocaleString("en-US")}`);
const num = v => (v == null ? "—" : Math.round(v).toLocaleString("en-US"));
const pct = v => (v == null ? "—" : `${Math.round(v)}%`);
const chg = (a, b) => (a != null && b ? 100 * (a / b - 1) : null);
const sgn = v => (v == null ? "—" : `${v >= 0 ? "+" : ""}${Math.round(v)}%`);

// A neighborhood's figures for one category: [n, price, avg, ppsf, dom, pctList], this year (a) and last (b).
const S = (h, cat) => h.s[cat] || { a: [0], b: [0] };
const METRICS = [
  { k: "price", label: "Median price", val: (a, b) => a[1], lab: v => mShort(v) },
  { k: "ppsf", label: "Median $/sf", val: (a, b) => a[3], lab: v => usd(v) },
  { k: "n", label: "Homes sold", val: (a, b) => (a[0] ? a[0] : null), lab: v => num(v) },
  { k: "chg", label: "Price vs last year", val: (a, b) => (a[0] >= 3 && b[0] >= 3 ? chg(a[1], b[1]) : null), lab: v => sgn(v) },
];

const mix = (lo, hi, t) => lo.map((c, i) => Math.round(c + (hi[i] - c) * t));
const rgb = c => `rgb(${c.join(",")})`;
function scale(values) {
  const v = values.filter(x => x != null).sort((a, b) => a - b);
  return x => (x == null || v.length < 2 ? null : v.findIndex(y => y >= x) / (v.length - 1));
}

export default function MicroRealEstate({ data, guides }) {
  const [cat, setCat] = useState("all");
  const [metric, setMetric] = useState("price");
  const [shade, setShade] = useState("zone");
  const [on, setOn] = useState([true, true, true, true]);          // which fog zones are showing
  const [sel, setSel] = useState(null);                             // selected neighborhood name
  const [tip, setTip] = useState(null);                             // { name, x, y }
  const [view, setView] = useState({ z: 1, cx: data.map.w / 2, cy: data.map.h / 2 });
  const [sort, setSort] = useState({ k: "hours", dir: 1 });
  const [q, setQ] = useState("");
  const drag = useRef(null);
  const wrap = useRef(null);
  const M = METRICS.find(m => m.k === metric);
  const { w, h } = data.map;

  const rows = useMemo(() => data.hoods.map(hd => {
    const { a, b } = S(hd, cat);
    return { hd, a, b, v: M.val(a, b), name: hd.name, zone: hd.zone, temp: hd.temp, hours: hd.hours,
             n: a[0], price: a[1], ppsf: a[3], dom: a[4], pl: a[5], vs: a[0] >= 3 && b[0] >= 3 ? chg(a[1], b[1]) : null };
  }), [data, cat, M]);
  const byName = useMemo(() => Object.fromEntries(rows.map(r => [r.name, r])), [rows]);
  const visible = r => on[r.zone];
  const toRank = useMemo(() => scale(rows.filter(visible).map(r => r.v)), [rows, on]);    // eslint-disable-line react-hooks/exhaustive-deps

  const fillFor = r => {
    if (shade === "zone") return "rgba(0,0,0,0)";
    const t = toRank(r.v);
    if (t == null) return "#EEF0F2";
    if (metric === "chg") return r.v >= 0 ? rgb(mix([226, 240, 231], [31, 111, 67], t)) : rgb(mix([248, 226, 224], [179, 38, 30], 1 - t));
    return rgb(mix([226, 233, 241], [32, 60, 95], t));
  };

  // zoom + pan
  const vw = w / view.z, vh = h / view.z;
  const vx = Math.min(Math.max(view.cx - vw / 2, 0), w - vw), vy = Math.min(Math.max(view.cy - vh / 2, 0), h - vh);
  const zoom = f => setView(v => ({ ...v, z: Math.min(6, Math.max(1, v.z * f)) }));
  const onDown = e => { drag.current = { x: e.clientX, y: e.clientY, cx: view.cx, cy: view.cy, moved: false }; };
  const onMove = e => {
    const d = drag.current;
    if (d && view.z > 1) {
      const r = e.currentTarget.getBoundingClientRect();
      const dx = (e.clientX - d.x) * (vw / r.width), dy = (e.clientY - d.y) * (vh / r.height);
      if (Math.abs(e.clientX - d.x) + Math.abs(e.clientY - d.y) > 4) d.moved = true;
      if (d.moved) { setView(v => ({ ...v, cx: d.cx - dx, cy: d.cy - dy })); setTip(null); return; }
    }
  };
  const onUp = () => { setTimeout(() => { drag.current = null; }, 0); };
  const hover = (e, name) => {
    if (drag.current?.moved) return;
    const r = wrap.current.getBoundingClientRect();
    setTip({ name, x: e.clientX - r.left, y: e.clientY - r.top });
  };
  const pick = name => { if (!drag.current?.moved) setSel(s => (s === name ? null : name)); };

  const lab = r => {                                              // label for a neighborhood on the map, if it fits
    if (!visible(r) || r.v == null) return null;
    const text = M.lab(r.v);
    const fs = Math.min(7.5, (r.hd.depth * 2.1) / (0.56 * text.length));
    return fs * view.z >= 3.4 ? { text, fs } : null;
  };

  const shown = rows.filter(r => visible(r) && (!q || r.name.toLowerCase().includes(q.toLowerCase())));
  const sorted = [...shown].sort((a, b) => {
    const x = a[sort.k], y = b[sort.k];
    if (typeof x === "string") return sort.dir * x.localeCompare(y);
    if (x == null && y == null) return 0;
    if (x == null) return 1;
    if (y == null) return -1;
    return sort.dir * (x - y);
  });
  const sortBy = k => setSort(s => ({ k, dir: s.k === k ? -s.dir : ["name", "zone", "hours"].includes(k) ? 1 : -1 }));
  const hov = tip && byName[tip.name];
  const cur = sel && byName[sel];

  const zoneCard = (z, i) => {
    const g = data.grid[cat][z.name].y1;
    return (
      <button key={z.k} type="button" className={`mre-zone${on[i] ? "" : " off"}`} aria-pressed={on[i]}
        onClick={() => setOn(o => o.map((v, j) => (j === i ? !v : v)))} style={{ "--z": z.fill }}>
        <span className="mre-zk" style={{ background: z.fill, color: z.ink }}>{z.k}</span>
        <b>{z.name}</b>
        <small>{z.count} neighborhoods · {z.temp[0]}–{z.temp[1]}°F</small>
        <span className="mre-zv">{money(g[1])}<i> · {usd(g[3])}/sf · {num(g[0])} sold</i></span>
      </button>
    );
  };

  const th = (k, label, cls = "") => (
    <th className={cls} aria-sort={sort.k === k ? (sort.dir > 0 ? "ascending" : "descending") : "none"}>
      <button type="button" onClick={() => sortBy(k)}>{label}{sort.k === k ? (sort.dir > 0 ? " ▲" : " ▼") : ""}</button>
    </th>
  );

  const GROUPS = [["Qty sold", 0, num], ["Median sale price", 1, money], ["Average sale price", 2, money], ["Median $/sf", 3, usd], ["Median DOM", 4, num], ["Sale price vs list", 5, pct]];
  const PERIODS = [["m1", data.month], ["m0", data.monthPrior], ["y1", data.ytd], ["y0", data.ytdPrior]];

  return (
    <>
      <div className="mre-bar">
        <div className="mre-tabs" role="tablist" aria-label="Sales category">
          {data.cats.map(c => (
            <button key={c.key} role="tab" type="button" aria-selected={cat === c.key} className={cat === c.key ? "on" : ""} onClick={() => setCat(c.key)}>{c.short || c.label}</button>
          ))}
        </div>
        <label>Show <select value={metric} onChange={e => setMetric(e.target.value)}>{METRICS.map(m => <option key={m.k} value={m.k}>{m.label}</option>)}</select></label>
        <label>Shade by <select value={shade} onChange={e => setShade(e.target.value)}><option value="zone">Fog zone</option><option value="metric">{M.label}</option></select></label>
      </div>

      <div className="mre-zones">{data.zones.map(zoneCard)}</div>

      <div className="mre-main">
        <div className="mre-map" ref={wrap}>
          <svg viewBox={`${vx} ${vy} ${vw} ${vh}`} role="group" aria-label="Map of San Francisco's neighborhoods by fog zone"
            onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerLeave={() => { onUp(); setTip(null); }}
            style={{ cursor: view.z > 1 ? "grab" : "default", touchAction: view.z > 1 ? "none" : "auto" }}>
            <defs><clipPath id="mre-land"><path d={data.map.land} clipRule="evenodd" /></clipPath></defs>
            <rect width={w} height={h} fill="#EAF1F6" />
            <path d={data.map.land} fill={shade === "zone" ? data.zones[0].fill : "#F3F4F5"} fillRule="evenodd" />
            {shade === "zone" && (
              <g clipPath="url(#mre-land)">
                {data.map.contours.map((c, i) => <path key={i} d={c.d} fill={data.zones[c.z].fill} fillRule="evenodd" opacity={on[c.z] ? 1 : 0.2} />)}
              </g>
            )}
            <g>
              {rows.map(r => (
                <path key={r.name} d={r.hd.d} fill={fillFor(r)} fillOpacity={visible(r) ? 1 : 0.25} stroke="#fff" strokeWidth={0.6 / view.z ** 0.3} strokeLinejoin="round"
                  style={{ pointerEvents: visible(r) ? "all" : "none", cursor: "pointer" }}
                  onPointerEnter={e => visible(r) && hover(e, r.name)} onPointerMove={e => visible(r) && hover(e, r.name)} onClick={() => visible(r) && pick(r.name)} />
              ))}
              {sel && byName[sel] && <path d={byName[sel].hd.d} fill="none" stroke="#131A25" strokeWidth={2 / view.z ** 0.6} strokeLinejoin="round" style={{ pointerEvents: "none" }} />}
              {hov && hov.name !== sel && <path d={hov.hd.d} fill="none" stroke="#203C5F" strokeWidth={1.4 / view.z ** 0.6} strokeLinejoin="round" style={{ pointerEvents: "none" }} />}
            </g>
            <g style={{ pointerEvents: "none" }} fontFamily="Lato, Helvetica, Arial, sans-serif" fontWeight="700" textAnchor="middle">
              {rows.map(r => {
                const L = lab(r);
                return L ? <text key={r.name} x={r.hd.x} y={r.hd.y + L.fs * 0.36} fontSize={L.fs} fill="#131A25" stroke="#fff" strokeWidth={L.fs * 0.32} paintOrder="stroke" strokeLinejoin="round">{L.text}</text> : null;
              })}
            </g>
            <g transform={`translate(${vx + vw - 70 / view.z},${vy + vh - 22 / view.z}) scale(${1 / view.z})`} style={{ pointerEvents: "none" }}>
              <rect x="0" y="-3" width={data.map.mile} height="4" fill="#203C5F" /><text x={data.map.mile / 2} y="12" fontSize="8" fill="#203C5F" textAnchor="middle">1 mile</text>
            </g>
            <g transform={`translate(${vx + vw - 24 / view.z},${vy + 28 / view.z}) scale(${1 / view.z})`} style={{ pointerEvents: "none" }}>
              <path d="M0,-14 L6,4 L0,0 L-6,4Z" fill="#203C5F" /><text x="0" y="15" fontSize="9" fontWeight="700" fill="#203C5F" textAnchor="middle">N</text>
            </g>
          </svg>
          <div className="mre-zoom">
            <button type="button" onClick={() => zoom(1.5)} aria-label="Zoom in">+</button>
            <button type="button" onClick={() => zoom(1 / 1.5)} aria-label="Zoom out">−</button>
            <button type="button" onClick={() => setView({ z: 1, cx: w / 2, cy: h / 2 })} aria-label="Reset the map" className="r">Reset</button>
          </div>
          {tip && hov && (
            <div className="mre-tip" style={{ left: Math.min(tip.x + 14, (wrap.current?.clientWidth || 600) - 190), top: tip.y + 14 }}>
              <b>{hov.name}</b>
              <span style={{ color: data.zones[hov.zone].ink === "#ffffff" ? "#fff" : "#131A25", background: data.zones[hov.zone].fill }} className="mre-tz">{data.zones[hov.zone].name}</span>
              <span>{hov.temp}°F est. · {hov.hours} fog hrs</span>
              <span>{hov.n ? <>{money(hov.price)} · {usd(hov.ppsf)}/sf · {hov.n} sold</> : "No sales yet this year"}</span>
            </div>
          )}
          {shade === "metric" && <div className="mre-key"><span>Lower</span><i /><span>Higher {M.label.toLowerCase()}</span></div>}
        </div>

        <aside className="mre-side" aria-live="polite">
          {cur ? (
            <>
              <div className="mre-sh">
                <div><b>{cur.name}</b><span className="mre-tz" style={{ background: data.zones[cur.zone].fill, color: data.zones[cur.zone].ink }}>{data.zones[cur.zone].name}</span></div>
                <button type="button" className="mre-x" onClick={() => setSel(null)} aria-label="Clear the selection">×</button>
              </div>
              <p className="mre-sm">{cur.temp}°F typical summer afternoon · {cur.hours} fog hours a day{cur.hd.homes ? ` · ${num(cur.hd.homes)} homes` : ""}</p>
              <span className="mre-mix" aria-hidden="true">{data.zones.map(z => <i key={z.name} style={{ width: `${100 * (cur.hd.mix[z.name] || 0)}%`, background: z.fill }} />)}</span>
              <table className="mre-st">
                <thead><tr><th className="l">{data.year} (last year lighter)</th><th># Sold</th><th>Median price</th><th>vs {data.year - 1}</th><th>$/sf</th><th>DOM</th></tr></thead>
                <tbody>{data.cats.map(c => {
                  const { a, b } = S(cur.hd, c.key);
                  return (
                    <tr key={c.key} className={c.key === cat ? "cur" : ""}>
                      <td className="l"><button type="button" onClick={() => setCat(c.key)}>{c.short || c.label}</button></td>
                      <td>{num(a[0])}<i>{num(b[0])}</i></td><td>{money(a[1])}<i>{money(b[1])}</i></td>
                      <td>{a[0] >= 3 && b[0] >= 3 ? sgn(chg(a[1], b[1])) : "—"}</td><td>{usd(a[3])}<i>{usd(b[3])}</i></td><td>{num(a[4])}<i>{num(b[4])}</i></td>
                    </tr>
                  );
                })}</tbody>
              </table>
              <div className="mre-links">
                <Link href={`/fog?${new URLSearchParams({ hood: cur.name, details: "all" })}`}>Sold homes on the map →</Link>
                {guides[cur.name] ? <Link href={`/neighborhoods/${guides[cur.name]}`}>Neighborhood guide →</Link> : null}
              </div>
            </>
          ) : (
            <p className="mre-empty">Select a neighborhood on the map or in the index.</p>
          )}
        </aside>
      </div>

      <section className="mre-sec">
        <div className="mre-sech"><h2>Neighborhood index</h2>
          <input type="search" value={q} onChange={e => setQ(e.target.value)} placeholder="Find a neighborhood" aria-label="Find a neighborhood" /></div>
        <div className="mre-scroll"><table className="mre-t">
          <thead><tr>{th("name", "Neighborhood", "l")}{th("zone", "Zone")}{th("temp", "Est. °F")}{th("hours", "Fog hrs")}{th("n", "# Sold")}{th("price", "Median price")}{th("vs", `vs ${data.year - 1}`)}{th("ppsf", "$/sf")}{th("dom", "DOM")}</tr></thead>
          <tbody>{sorted.map(r => (
            <tr key={r.name} className={sel === r.name ? "sel" : ""} onClick={() => setSel(r.name)}>
              <td className="l"><button type="button" onClick={e => { e.stopPropagation(); setSel(r.name); }}>{r.name}</button></td>
              <td><span className="mre-zk sm" style={{ background: data.zones[r.zone].fill, color: data.zones[r.zone].ink }}>{data.zones[r.zone].k}</span></td>
              <td>{r.temp}°</td><td>{r.hours}</td><td>{num(r.n)}</td><td>{money(r.price)}</td><td>{sgn(r.vs)}</td><td>{usd(r.ppsf)}</td><td>{num(r.dom)}</td>
            </tr>
          ))}</tbody>
        </table></div>
      </section>

      <section className="mre-sec">
        <div className="mre-sech"><h2>Closings by fog zone — {data.cats.find(c => c.key === cat).label}</h2></div>
        <div className="mre-scroll"><table className="mre-g">
          <thead>
            <tr><th className="l" rowSpan="2">Fog zone</th>{GROUPS.map(([t]) => <th key={t} colSpan="4" className="grp">{t}</th>)}</tr>
            <tr>{GROUPS.flatMap(([t]) => PERIODS.map(([k, l], j) => <th key={`${t}${k}`} className={`${j === 0 ? "g0" : ""}${k === "y1" || k === "y0" ? " ytd" : ""}`}>{l}</th>))}</tr>
          </thead>
          <tbody>
            {[...data.zones, { name: "All zones", k: "" }].map((z, i) => (
              <tr key={z.name} className={z.name === "All zones" ? "tot" : on[i] ? "" : "off"}>
                <td className="l">{z.k ? <span className="mre-zk sm" style={{ background: z.fill, color: z.ink }}>{z.k}</span> : null}{z.name}</td>
                {GROUPS.flatMap(([t, gi, f]) => PERIODS.map(([k], j) => {
                  const row = data.grid[cat][z.name];
                  return <td key={`${t}${k}`} className={`${j === 0 ? "g0" : ""}${k === "m0" || k === "y0" ? " prior" : ""}`}>{f(row[k][gi])}</td>;
                }))}
              </tr>
            ))}
          </tbody>
        </table></div>
      </section>
    </>
  );
}
