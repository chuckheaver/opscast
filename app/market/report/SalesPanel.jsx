"use client";

// The drill-down behind every figure on Market Stats: a side panel listing the
// sales a neighborhood, fog zone, tier or month is made of, sortable, with the
// medians on top. Same look as the Duplex vs SFH page's list. The sales come
// from public/data/report-sales.json (reports/market/webdata.py), fetched the
// first time a panel opens.

import { useEffect, useMemo, useState } from "react";
import { money, usd, sfmt, dshort, median } from "./fmt";

let cache = null;
export function useSales() {
  const [rows, setRows] = useState(cache);
  useEffect(() => {
    if (cache) return;
    fetch("/data/report-sales.json").then(r => r.json()).then(j => {
      cache = j.rows.map(r => Object.fromEntries(j.cols.map((c, i) => [c, r[i]])));
      setRows(cache);
    });
  }, []);
  return rows;
}

const SEGNAME = { sfh: "SFH", co: "Condo/TIC/Co-op", du: "Duplex", ot: "Other (Tri+)" };
const mapSale = id => `/fog?${new URLSearchParams({ preset: "homes", sale: id })}`;
const pctList = s => (s.l ? (100 * s.p) / s.l : null);
const ppsf = s => (s.s ? s.p / s.s : null);

const COLS = [
  { k: "a", label: "Address", left: true },
  { k: "d", label: "Closed" },
  { k: "p", label: "Sold", fmt: money },
  { k: "pl", label: "% of list", fmt: v => (v == null ? "—" : `${Math.round(v)}%`) },
  { k: "s", label: "SF", fmt: sfmt },
  { k: "pp", label: "$/sf", fmt: usd },
  { k: "dom", label: "DOM", fmt: v => (v == null ? "—" : v) },
];

export default function SalesPanel({ open, onClose }) {
  const all = useSales();
  const [sort, setSort] = useState({ k: "p", dir: -1 });
  const [yr, setYr] = useState(0);                 // 0 this year, 1 last year's same stretch (when offered)
  const list = useMemo(() => {
    if (!all) return null;
    return all.filter(yr && open.prior ? open.prior : open.filter).map(s => ({ ...s, pl: pctList(s), pp: ppsf(s) }));
  }, [all, open, yr]);
  const rows = useMemo(() => {
    if (!list) return [];
    const r = [...list];
    r.sort((a, b) => {
      if (sort.k === "a") return sort.dir * a.a.localeCompare(b.a, "en", { numeric: true });
      if (sort.k === "d") return sort.dir * a.d.localeCompare(b.d);
      const x = a[sort.k], y = b[sort.k];
      if (x == null && y == null) return 0;
      if (x == null) return 1;
      if (y == null) return -1;
      return sort.dir * (x - y);
    });
    return r;
  }, [list, sort]);
  useEffect(() => {
    const onKey = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [onClose]);
  const m = list && { p: median(list.map(s => s.p)), pl: median(list.map(s => s.pl)), s: median(list.map(s => s.s)), pp: median(list.map(s => s.pp)), dom: median(list.map(s => s.dom)) };
  return (
    <div className="dv-shade" onClick={onClose}>
      <div className="dv-panel" role="dialog" aria-modal="true" aria-label={open.title} onClick={e => e.stopPropagation()}>
        <div className="dv-ph">
          <div><b>{open.title}</b><span>{open.sub}{list ? ` · ${list.length.toLocaleString("en-US")} sold` : ""}</span></div>
          <button type="button" className="dv-x" onClick={onClose} aria-label="Close">×</button>
        </div>
        {open.prior ? (
          <div className="mr-tabs mr-panel-tabs" role="tablist" aria-label="Year">
            {open.years.map((y, i) => <button key={y} type="button" role="tab" aria-selected={yr === i} className={yr === i ? "on" : ""} onClick={() => setYr(i)}>{i ? `${y}, same stretch` : `${y} to date`}</button>)}
          </div>
        ) : null}
        <div className="dv-scroll">
          {!list ? <p className="mr-loading">Loading the sales…</p> : (
            <table className="dv-list">
              <thead>
                <tr>{COLS.map(c => (
                  <th key={c.k} className={c.left ? "l" : ""} aria-sort={sort.k === c.k ? (sort.dir > 0 ? "ascending" : "descending") : "none"}>
                    <button type="button" onClick={() => setSort(s => ({ k: c.k, dir: s.k === c.k ? -s.dir : c.k === "a" ? 1 : -1 }))}>
                      {c.label}{sort.k === c.k ? (sort.dir > 0 ? " ▲" : " ▼") : ""}
                    </button>
                  </th>
                ))}</tr>
                <tr className="dv-med"><td className="l">Median</td><td /><td>{money(m.p)}</td><td>{m.pl == null ? "—" : `${Math.round(m.pl)}%`}</td><td>{sfmt(m.s)}</td><td>{usd(m.pp)}</td><td>{m.dom == null ? "—" : Math.round(m.dom)}</td></tr>
              </thead>
              <tbody>
                {rows.map(s => (
                  <tr key={s.id + s.d}>
                    <td className="l"><a href={mapSale(s.id)}>{s.a}</a><small>{SEGNAME[s.seg]}{s.t && SEGNAME[s.seg] !== s.t ? ` · ${s.t}` : ""}{s.off ? " · off MLS" : ""}</small></td>
                    <td>{dshort(s.d)}</td><td>{money(s.p)}</td><td>{s.pl == null ? "—" : `${Math.round(s.pl)}%`}</td><td>{sfmt(s.s)}</td><td>{usd(s.pp)}</td><td>{s.dom ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
