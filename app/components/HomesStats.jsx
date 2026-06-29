'use client';

// Stats bottom-sheet for the Homes overlay. Driven by the SAME filter as the
// map dots (the matching properties are passed in), so it always describes
// exactly what's on the map. Peek state shows the headline metrics; "Full
// report" expands to the by-neighborhood breakdown and the sales list. The map
// stays visible above — no backdrop.

import { useMemo } from "react";
import { computeStats } from "../listings/lib/stats";
import { isSoldStatus } from "../listings/lib/filter";

const usd = n => (n == null ? "—" : "$" + Math.round(n).toLocaleString("en-US"));
const usdShort = n => {
  if (n == null) return "—";
  if (n >= 1e6) return "$" + (n / 1e6).toFixed(2) + "M";
  if (n >= 1e3) return "$" + Math.round(n / 1e3) + "K";
  return "$" + Math.round(n);
};
const pct = n => (n == null ? "—" : Math.round(n) + "%");
const shortAddr = a => (a ? a.replace(/,\s*San Francisco.*$/i, "") : "—");
const fmtDate = iso => { const m = iso && /^(\d{4})-(\d{2})-(\d{2})/.exec(iso); return m ? `${+m[2]}/${+m[3]}/${m[1].slice(2)}` : "—"; };

export default function HomesStats({ props, count, expanded, onToggleExpand, onClose }) {
  const stats = useMemo(() => computeStats(props || []), [props]);
  const sold = useMemo(() => (props || []).filter(p => isSoldStatus(p.status) && p.sellingPrice > 0), [props]);

  const nbRows = useMemo(() => {
    const map = new Map();
    for (const p of sold) {
      const n = p.neighborhood;
      if (!n) continue;
      (map.get(n) || map.set(n, []).get(n)).push(p);
    }
    return [...map.entries()]
      .map(([n, ps]) => ({ n, stats: computeStats(ps), count: ps.length }))
      .sort((a, b) => (b.stats.medianSale ?? 0) - (a.stats.medianSale ?? 0));
  }, [sold]);

  const grid = useMemo(() => [...sold].sort((a, b) => (b.sellingPrice || 0) - (a.sellingPrice || 0)), [sold]);

  const metrics = [
    { v: usdShort(stats.medianSale), l: "Median" },
    { v: usd(stats.medianPpsf), l: "$/sqft" },
    { v: stats.medianDom ?? "—", l: "Days on mkt" },
    { v: pct(stats.avgPctOfList), l: "% of list" },
  ];

  return (
    <div className={"fog-stats-sheet" + (expanded ? " expanded" : "")} role="dialog" aria-label="Housing stats">
      <button type="button" className="fog-stats-grab" onClick={onClose} aria-label="Close stats" />
      <div className="fog-stats-head">
        <span className="fog-stats-title">Stats · {(count || 0).toLocaleString("en-US")} match · {sold.length.toLocaleString("en-US")} sold</span>
        <button type="button" className="fog-stats-exp" onClick={onToggleExpand}>{expanded ? "Less ↓" : "Full report ↑"}</button>
      </div>
      <div className="fog-stats-metrics">
        {metrics.map(m => (
          <div className="fog-stats-met" key={m.l}><div className="fog-stats-v">{m.v}</div><div className="fog-stats-l">{m.l}</div></div>
        ))}
      </div>

      {expanded && (
        <div className="fog-stats-body">
          {nbRows.length > 0 && (
            <>
              <h4 className="fog-stats-h">By neighborhood</h4>
              <table className="mk-table mk-nb">
                <thead><tr><th>Neighborhood</th><th>Median</th><th>%ofList</th><th># Sold</th></tr></thead>
                <tbody>
                  {nbRows.map(r => (
                    <tr key={r.n}>
                      <td>{r.n}{r.count < 50 ? <span className="mk-star" title="Small sample (n<50)">*</span> : null}</td>
                      <td className="mk-num">{usdShort(r.stats.medianSale)}</td>
                      <td className="mk-num">{r.stats.avgPctOfList == null ? "—" : Math.round(r.stats.avgPctOfList) + "%"}</td>
                      <td className="mk-num">{r.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          <h4 className="fog-stats-h">Sales ({grid.length.toLocaleString("en-US")})</h4>
          <div className="re-modal-scroll">
            <table className="re-modal-table">
              <thead><tr><th>Address</th><th>Bd/Ba</th><th>Sq Ft</th><th>List</th><th>Sale</th><th>$/SF</th><th>DOM</th><th>Sold</th></tr></thead>
              <tbody>
                {grid.map(p => {
                  const ppsf = p.sqft > 0 && p.sellingPrice ? p.sellingPrice / p.sqft : null;
                  return (
                    <tr key={p.id}>
                      <td className="re-m-addr">{shortAddr(p.address)}{p.unit ? ` #${p.unit}` : ""}</td>
                      <td className="re-m-num">{p.bedrooms ?? "—"}/{(p.bathrooms || "—").toString().split(" ")[0]}</td>
                      <td className="re-m-num">{p.sqft ? Math.round(p.sqft).toLocaleString("en-US") : "—"}</td>
                      <td className="re-m-num">{usd(p.listPrice)}</td>
                      <td className="re-m-num">{usd(p.sellingPrice)}</td>
                      <td className="re-m-num">{usd(ppsf)}</td>
                      <td className="re-m-num">{p.dom ?? "—"}</td>
                      <td className="re-m-num">{fmtDate(p.sellingDate)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="fog-stats-src">Source: SFAR MLS, geocoded. Medians use closed sales in the current filter.</p>
        </div>
      )}
    </div>
  );
}
