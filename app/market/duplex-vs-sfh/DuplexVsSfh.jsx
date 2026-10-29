"use client";

// The grid and the sales list behind it. Click anywhere in a neighborhood's
// SFH or Duplex figures (the # Sold button is the keyboard route) to open a
// basic list of those sales: address, sold, over list, sf, $/sf. Addresses open
// the sale on the map; October closings (not on the map yet) open the neighborhood.

import { useEffect, useMemo, useState } from "react";

const mapHood = name => `/fog?${new URLSearchParams({ hood: name, details: "all" })}`;
const mapSale = (s, hood) => (s.late
  ? (hood === "San Francisco" ? "/fog?preset=homes" : mapHood(hood))
  : `/fog?${new URLSearchParams({ preset: "homes", sale: s.id })}`);

const money = v => (v == null ? "—" : v >= 995_000 ? `$${(v / 1e6).toFixed(2)}M` : `$${Math.round(v / 1e3)}K`);
const usd = v => (v == null ? "—" : `$${Math.round(v).toLocaleString("en-US")}`);
const over = v => (v == null ? "—" : `${v >= 0 ? "+" : ""}${Math.round(v)}%`);
const sgn = v => (v == null ? "—" : `${v >= 0 ? "+" : ""}${Math.round(v)}%`);
const pts = v => (v == null ? "—" : `${v >= 0 ? "+" : ""}${Math.round(v)} pts`);
const sf = v => (v == null ? "—" : Math.round(v).toLocaleString("en-US"));
const dshort = iso => new Date(`${iso}T12:00:00`).toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "2-digit" });
const med = a => {
  const v = a.filter(x => x != null).sort((x, y) => x - y);
  if (!v.length) return null;
  const m = v.length >> 1;
  return v.length % 2 ? v[m] : (v[m - 1] + v[m]) / 2;
};

const COLS = [
  { k: "a", label: "Address", left: true },
  { k: "p", label: "Sold", fmt: money },
  { k: "o", label: "Over list", fmt: over },
  { k: "s", label: "SF", fmt: sf },
  { k: "pp", label: "$/sf", fmt: usd },
];

function SalesList({ list, onClose }) {
  const [sort, setSort] = useState({ k: "d", dir: -1 });   // newest closing first (owner, Oct 29 2026)
  const rows = useMemo(() => {
    const r = [...list.sales];
    r.sort((a, b) => {
      if (sort.k === "a") return sort.dir * a.a.localeCompare(b.a, "en", { numeric: true });
      if (sort.k === "d") return sort.dir * a.d.localeCompare(b.d) || b.p - a.p;
      const x = a[sort.k], y = b[sort.k];
      if (x == null && y == null) return 0;
      if (x == null) return 1;                      // blanks last, whichever way it sorts
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
  const m = { p: med(list.sales.map(s => s.p)), o: med(list.sales.map(s => s.o)), s: med(list.sales.map(s => s.s)), pp: med(list.sales.map(s => s.pp)) };
  return (
    <div className="dv-shade" onClick={onClose}>
      <div className="dv-panel" role="dialog" aria-modal="true" aria-label={list.title} onClick={e => e.stopPropagation()}>
        <div className="dv-ph">
          <div><b>{list.hood}</b><span>{list.kind} · {list.sales.length.toLocaleString("en-US")} sold</span></div>
          <button type="button" className="dv-x" onClick={onClose} aria-label="Close">×</button>
        </div>
        <div className="dv-scroll">
          <table className="dv-list">
            <thead>
              <tr>{COLS.map(c => (
                <th key={c.k} className={c.left ? "l" : ""} aria-sort={sort.k === c.k ? (sort.dir > 0 ? "ascending" : "descending") : "none"}>
                  <button type="button" onClick={() => setSort(s => ({ k: c.k, dir: s.k === c.k ? -s.dir : c.k === "a" ? 1 : -1 }))}>
                    {c.label}{sort.k === c.k ? (sort.dir > 0 ? " ▲" : " ▼") : ""}
                  </button>
                </th>
              ))}</tr>
              <tr className="dv-med"><td className="l">Median</td><td>{money(m.p)}</td><td>{over(m.o)}</td><td>{sf(m.s)}</td><td>{usd(m.pp)}</td></tr>
            </thead>
            <tbody>
              {rows.map(s => (
                <tr key={s.id}>
                  <td className="l"><a href={mapSale(s, list.hood)}>{s.a}</a>{s.late ? <i title="Closed in October"> Oct</i> : null}<small>{dshort(s.d)}</small></td>
                  <td>{money(s.p)}</td><td>{over(s.o)}</td><td>{sf(s.s)}</td><td>{usd(s.pp)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function DuplexVsSfh({ data }) {
  const [open, setOpen] = useState(null);           // { hood, kind, sales }
  const unl = data.unlisted;
  const show = (hood, kind, sales) => setOpen({ hood, kind: kind === "sfh" ? "SFH" : "Duplex", sales, title: `${hood} ${kind}` });
  const sfhAll = useMemo(() => [...data.hoods.flatMap(h => h.sales.sfh), ...unl.sfh], [data, unl]);
  const dupAll = useMemo(() => [...data.hoods.flatMap(h => h.sales.duplex), ...unl.duplex], [data, unl]);

  const Row = ({ name, sfh, duplex, diff, outliers, thin, onSfh, onDup, city, hood }) => {
    const ok = diff.price != null || diff.ppsf != null || diff.over != null;
    const grp = (g, n, cls, fn, label) => (
      <>
        <td className={`n ${cls} dv-hit`} onClick={fn}>
          <button type="button" className="dv-n" onClick={e => { e.stopPropagation(); fn(); }} aria-label={`${label}: ${n} sold, show the sales`}>{n.toLocaleString("en-US")}</button>
        </td>
        <td className="dv-hit" onClick={fn}>{money(g.price)}</td>
        <td className="dv-hit" onClick={fn}>{over(g.over)}</td>
        <td className="dv-hit" onClick={fn}>{usd(g.ppsf)}</td>
      </>
    );
    return (
      <tr className={city ? "city" : ""}>
        <td className="l">{hood ? <a href={mapHood(hood)}>{name}{thin ? "*" : ""}</a> : name}</td>
        {grp(sfh, sfh.n, "g1", onSfh, `${name} SFH`)}
        {grp(duplex, duplex.n, "g2", onDup, `${name} Duplex`)}
        <td className="g3 df">{ok ? sgn(diff.price) : "—"}</td><td className="df">{ok ? pts(diff.over) : "—"}</td><td className="df">{ok ? sgn(diff.ppsf) : "—"}</td>
        <td className="l g4 out">
          {outliers.map((o, i) => (
            <span key={o.id}>{i ? ", " : ""}<a href={mapSale({ id: o.id, late: o.late }, hood || name)}>{o.a}</a>{" "}
              {[o.pp != null ? `${usd(o.pp)}/sf` : null, o.pct != null ? `${o.pct}% of list` : null].filter(Boolean).join(" · ")}</span>
          ))}
        </td>
      </tr>
    );
  };

  return (
    <>
      <div className="dv-scroll-x">
        <table className="dv-t">
          <thead>
            <tr className="grp"><th rowSpan="2" className="gap" /><th colSpan="4" className="g1">SFH</th><th colSpan="4" className="g2">Duplex</th><th colSpan="3" className="g3">Difference</th><th className="g4">Outliers</th></tr>
            <tr>
              <th className="g1"># Sold</th><th>Median price</th><th>% over list</th><th>$/sf</th>
              <th className="g2"># Sold</th><th>Median price</th><th>% over list</th><th>$/sf</th>
              <th className="g3">Price</th><th>% over list</th><th>$/sf</th>
              <th className="g4 l">Duplex sales to look at</th>
            </tr>
          </thead>
          <tbody>
            <Row city name="San Francisco" sfh={data.city.sfh} duplex={data.city.duplex} diff={data.city.diff} outliers={[]}
              onSfh={() => show("San Francisco", "sfh", sfhAll)} onDup={() => show("San Francisco", "duplex", dupAll)} />
            {data.hoods.map(h => (
              <Row key={h.name} hood={h.name} name={h.name} sfh={h.sfh} duplex={h.duplex} diff={h.diff} outliers={h.outliers} thin={h.thin}
                onSfh={() => show(h.name, "sfh", h.sales.sfh)} onDup={() => show(h.name, "duplex", h.sales.duplex)} />
            ))}
          </tbody>
        </table>
      </div>
      {open && <SalesList list={open} onClose={() => setOpen(null)} />}
    </>
  );
}
