'use client';

// House-market stats shown as a pop-up (launched from the fog map's "House
// Market Stats" chip). Same data + math as the /market report, but scoped to a
// selected neighborhood when one is picked, otherwise city-wide. Lazy-loads the
// listings GeoJSON the first time it's opened (cached module-wide afterward).

import { useEffect, useMemo, useState } from "react";
import { computeStats } from "../listings/lib/stats";
import { loadListingsFeatures } from "../listings/lib/load";

const SEGMENTS = [
  { key: "sfr", label: "Single-Family", types: ["Single Family Residence"] },
  {
    key: "condo",
    label: "Condo / TIC / Coop",
    types: ["Condominium", "Loft Condominium", "Loft", "Tenancy in Common", "Stock Cooperative", "Co-Ownership"],
  },
];

const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthLabel = ym => { const [y, m] = ym.split("-").map(Number); return `${MON[m - 1]} ${y}`; };
const monthLabelShort = ym => { const [y, m] = ym.split("-").map(Number); return `${MON[m - 1]} '${String(y).slice(2)}`; };
const shiftMonth = (ym, delta) => {
  const [y, m] = ym.split("-").map(Number);
  const idx = y * 12 + (m - 1) + delta;
  return `${Math.floor(idx / 12)}-${String((idx % 12) + 1).padStart(2, "0")}`;
};

const usd = n => (n == null ? "—" : "$" + Math.round(n).toLocaleString("en-US"));
const usdShort = n => {
  if (n == null) return "—";
  if (n >= 1e6) return "$" + (n / 1e6).toFixed(2) + "M";
  if (n >= 1e3) return "$" + Math.round(n / 1e3) + "K";
  return "$" + Math.round(n);
};
const pct = n => (n == null ? "—" : n.toFixed(1) + "%");
const intf = n => (n == null ? "—" : Math.round(n).toLocaleString("en-US"));
function deltaPct(cur, prev) {
  if (cur == null || prev == null || prev === 0) return null;
  return (cur / prev - 1) * 100;
}
const fmtDelta = d => (d == null ? "n/a" : (d >= 0 ? "+" : "") + d.toFixed(1) + "%");
const deltaClass = d => (d == null ? "" : d >= 0 ? "up" : "down");

// "4117 Judah St, San Francisco, CA 94122" → "4117 Judah St"
const shortAddr = a => (a ? a.replace(/,\s*San Francisco.*$/i, "") : "—");
// "2025-02-18" → "2/18/25"
const fmtDate = iso => {
  const m = iso && /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  return m ? `${+m[2]}/${+m[3]}/${m[1].slice(2)}` : "—";
};

export default function MarketModal({ onClose }) {
  const [features, setFeatures] = useState(null);
  const [month, setMonth] = useState("");
  // Always opens on the all-neighborhoods view; drill into one by clicking a
  // row in the breakdown. `drill` is the neighborhood name or null (all).
  const [drill, setDrill] = useState(null);
  // Per-segment property grid (the list of individual sales by address).
  // { segKey, segLabel } or null.
  const [propsView, setPropsView] = useState(null);

  useEffect(() => {
    let cancelled = false;
    loadListingsFeatures().then(f => { if (!cancelled) setFeatures(f); });
    return () => { cancelled = true; };
  }, []);

  // Esc steps back: property grid → neighborhood → close the pop-up.
  useEffect(() => {
    const onKey = e => {
      if (e.key !== "Escape") return;
      if (propsView) setPropsView(null);
      else if (drill) setDrill(null);
      else onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, drill, propsView]);

  // Leaving a neighborhood also closes any open property grid.
  useEffect(() => { setPropsView(null); }, [drill]);

  // Scope to the drilled neighborhood (matching the MLS or fog-map name), else
  // the whole city.
  const scoped = useMemo(() => {
    if (!features) return [];
    if (!drill) return features;
    return features.filter(f => {
      const p = f.properties;
      return p.neighborhood === drill || p.fogNeighborhood === drill;
    });
  }, [features, drill]);

  const { bySegMonth, months } = useMemo(() => {
    const idx = {};
    SEGMENTS.forEach(s => (idx[s.key] = {}));
    const typeToSeg = {};
    SEGMENTS.forEach(s => s.types.forEach(t => (typeToSeg[t] = s.key)));
    const monthSet = new Set();
    for (const f of scoped) {
      const p = f.properties;
      if (!p.sellingDate || !(p.sellingPrice > 0)) continue;
      const seg = typeToSeg[p.propType];
      if (!seg) continue;
      const ym = p.sellingDate.slice(0, 7);
      monthSet.add(ym);
      (idx[seg][ym] = idx[seg][ym] || []).push(p);
    }
    const sorted = [...monthSet].sort();
    const latest = sorted[sorted.length - 1];
    const valid = latest ? sorted.filter(m => m > shiftMonth(latest, -18)) : [];
    return { bySegMonth: idx, months: valid };
  }, [scoped]);

  const currentYM = (() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`; })();
  const defaultMonth = useMemo(() => {
    const complete = months.filter(m => m < currentYM);
    return (complete.length ? complete[complete.length - 1] : months[months.length - 1]) || "";
  }, [months, currentYM]);
  const selected = month || defaultMonth;

  const trailing12 = useMemo(() => {
    if (!selected) return [];
    return Array.from({ length: 12 }, (_, i) => shiftMonth(selected, -(11 - i)));
  }, [selected]);

  const statsFor = (segKey, ym) => computeStats(bySegMonth[segKey]?.[ym] || []);
  const propsFor = (segKey, ym) => bySegMonth[segKey]?.[ym] || [];

  const heading = drill || "San Francisco";
  const loading = features === null;

  return (
    <div className="nh-backdrop" onClick={onClose}>
      <div className="nh-modal" onClick={e => e.stopPropagation()} role="dialog" aria-label={`${heading} house market stats`}>
        <button className="nh-x" onClick={onClose} aria-label="Close">×</button>

        {propsView ? (
          <button type="button" className="mk-back" onClick={() => setPropsView(null)}>‹ Back to stats</button>
        ) : drill ? (
          <button type="button" className="mk-back" onClick={() => setDrill(null)}>‹ All neighborhoods</button>
        ) : null}
        <div style={{ fontSize: 22, fontWeight: 800, color: "#1c1917", lineHeight: 1.1, letterSpacing: "-0.5px" }}>{heading}</div>
        <div style={{ fontSize: 13, color: "#78716c", marginTop: 3 }}>
          {propsView
            ? `${propsView.segLabel} · sold ${monthLabel(selected)}`
            : `House market stats${drill ? "" : " · all neighborhoods"}`}
        </div>

        {loading ? (
          <p style={{ marginTop: 16, color: "#78716c" }}>Loading market data…</p>
        ) : !selected ? (
          <p style={{ marginTop: 16, color: "#78716c" }}>
            No closed sales on record{drill ? ` for ${drill}` : ""} yet.
          </p>
        ) : propsView ? (
          <PropertiesGrid rows={propsFor(propsView.segKey, selected)} />
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "14px 0 6px" }}>
              <label className="mk-lbl" style={{ fontSize: 12, fontWeight: 700, color: "#57534e" }}>Report month</label>
              <select className="mk-select" value={selected} onChange={e => setMonth(e.target.value)}>
                {[...months].reverse().map(m => (
                  <option key={m} value={m}>{monthLabel(m)}{m === currentYM ? " (partial)" : ""}</option>
                ))}
              </select>
            </div>
            <p style={{ fontSize: 12, color: "#78716c", margin: "0 0 8px", lineHeight: 1.5 }}>
              SFAR MLS closed sales · MoM vs prior month · YoY vs same month last year.
              {!drill && " Tap a neighborhood to drill in."}
            </p>

            {/* All-neighborhoods view leads with the clickable breakdown. */}
            {!drill && <NeighborhoodBreakdown bySegMonth={bySegMonth} selected={selected} onDrill={setDrill} />}
            {!drill && <h3 className="mk-h3" style={{ marginTop: 20 }}>Citywide totals</h3>}

            {SEGMENTS.map(seg => {
              const cur = statsFor(seg.key, selected);
              const mom = statsFor(seg.key, shiftMonth(selected, -1));
              const yoy = statsFor(seg.key, shiftMonth(selected, -12));
              const hasYoY = propsFor(seg.key, shiftMonth(selected, -12)).length > 0;
              const rows = [
                { label: "Median Sale Price", get: s => s.medianSale, fmt: usd },
                { label: "Days on Market", get: s => s.medianDom, fmt: intf },
                { label: "$ / Sq Ft", get: s => s.medianPpsf, fmt: usd },
                { label: "Properties Sold", get: s => s.soldCount, fmt: intf },
                { label: "% Sold Over List", get: s => s.pctOverList, fmt: pct },
                { label: "% of List Received", get: s => s.avgPctOfList, fmt: pct },
              ];
              const soldThisMonth = propsFor(seg.key, selected).length;
              return (
                <section key={seg.key} style={{ marginTop: 16 }}>
                  <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
                    <h2 className="mk-seg-title" style={{ fontSize: 16, margin: 0, border: "none", padding: 0 }}>{seg.label}</h2>
                    {soldThisMonth > 0 && (
                      <button type="button" className="mk-props-link" onClick={() => setPropsView({ segKey: seg.key, segLabel: seg.label })}>
                        Properties ({soldThisMonth}) ›
                      </button>
                    )}
                  </div>
                  <table className="mk-table">
                    <thead>
                      <tr><th>Metric</th><th>{monthLabelShort(selected)}</th><th>MoM Δ</th><th>YoY Δ</th></tr>
                    </thead>
                    <tbody>
                      {rows.map(r => {
                        const c = r.get(cur), m = r.get(mom), y = r.get(yoy);
                        return (
                          <tr key={r.label}>
                            <td>{r.label}</td>
                            <td className="mk-num">{r.fmt(c)}</td>
                            <td className={"mk-num " + deltaClass(deltaPct(c, m))}>{fmtDelta(deltaPct(c, m))}</td>
                            <td className={"mk-num " + (hasYoY ? deltaClass(deltaPct(c, y)) : "")}>{hasYoY ? fmtDelta(deltaPct(c, y)) : "n/a"}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  <h3 className="mk-h3">Rolling 12 months</h3>
                  <table className="mk-table mk-trend">
                    <thead>
                      <tr><th>Month</th><th># Sold</th><th>Median</th><th>DOM</th><th>%Over</th></tr>
                    </thead>
                    <tbody>
                      {trailing12.map(ym => {
                        const s = statsFor(seg.key, ym);
                        return (
                          <tr key={ym} className={ym === selected ? "mk-sel" : ""}>
                            <td>{monthLabelShort(ym)}</td>
                            <td className="mk-num">{s.soldCount || 0}</td>
                            <td className="mk-num">{usdShort(s.medianSale)}</td>
                            <td className="mk-num">{s.medianDom ?? "—"}</td>
                            <td className="mk-num">{s.pctOverList == null ? "—" : Math.round(s.pctOverList) + "%"}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </section>
              );
            })}

            <p style={{ fontSize: 11, color: "#a8a29e", marginTop: 14, lineHeight: 1.5 }}>
              Source: SFAR MLS closed sales, geocoded. $/sq ft fills in once the export includes square footage.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

// The individual closed sales behind a segment's stats, by address — the same
// grid as the listings page. Reuses the .re-modal-table styling.
function PropertiesGrid({ rows }) {
  const sorted = useMemo(
    () => [...rows].sort((a, b) => (b.sellingPrice || 0) - (a.sellingPrice || 0)),
    [rows]
  );
  if (!sorted.length) {
    return <div className="re-modal-empty">No closed sales this month.</div>;
  }
  return (
    <div className="re-modal-scroll mk-props" style={{ marginTop: 14 }}>
      <table className="re-modal-table">
        <thead>
          <tr>
            <th>Address</th><th>Bd/Ba</th><th>Sq Ft</th><th>List</th>
            <th>Sale</th><th>$/SF</th><th>vs list</th><th>DOM</th><th>Sold</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map(p => {
            const delta = p.listPrice ? (p.sellingPrice / p.listPrice - 1) * 100 : null;
            const ppsf = p.sqft > 0 ? p.sellingPrice / p.sqft : null;
            return (
              <tr key={p.id}>
                <td className="re-m-addr">{shortAddr(p.address)}{p.unit ? ` #${p.unit}` : ""}</td>
                <td className="re-m-num">{p.bedrooms ?? "—"}/{(p.bathrooms || "—").toString().split(" ")[0]}</td>
                <td className="re-m-num">{p.sqft ? Math.round(p.sqft).toLocaleString("en-US") : "—"}</td>
                <td className="re-m-num">{usd(p.listPrice)}</td>
                <td className="re-m-num">{usd(p.sellingPrice)}</td>
                <td className="re-m-num">{usd(ppsf)}</td>
                <td className={"re-m-num " + (delta == null ? "" : delta >= 0 ? "up" : "down")}>
                  {delta == null ? "—" : (delta >= 0 ? "+" : "") + delta.toFixed(1) + "%"}
                </td>
                <td className="re-m-num">{p.dom ?? "—"}</td>
                <td className="re-m-num">{fmtDate(p.sellingDate)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// City-wide neighborhood breakdown for the selected month (Single-Family +
// Condo pooled), sorted by median sale price.
function NeighborhoodBreakdown({ bySegMonth, selected, onDrill }) {
  const nbRows = useMemo(() => {
    const map = new Map();
    for (const seg of Object.keys(bySegMonth)) {
      for (const p of bySegMonth[seg]?.[selected] || []) {
        const n = p.neighborhood;
        if (!n) continue;
        (map.get(n) || map.set(n, []).get(n)).push(p);
      }
    }
    return [...map.entries()]
      .map(([n, ps]) => ({ n, stats: computeStats(ps), count: ps.length }))
      .sort((a, b) => (b.stats.medianSale ?? 0) - (a.stats.medianSale ?? 0));
  }, [bySegMonth, selected]);

  return (
    <section style={{ marginTop: 18 }}>
      <h3 className="mk-h3">By neighborhood · {monthLabel(selected)}</h3>
      <table className="mk-table mk-nb">
        <thead>
          <tr><th>Neighborhood</th><th>Median</th><th>%ofList</th><th># Sold</th></tr>
        </thead>
        <tbody>
          {nbRows.map(r => (
            <tr key={r.n} className="mk-nb-row" onClick={() => onDrill(r.n)} title={`Drill into ${r.n}`}>
              <td>
                <span className="mk-nb-name">{r.n}</span>
                {r.count < 50 ? <span className="mk-star" title="Small sample (n<50)">*</span> : null}
                <span className="mk-nb-arrow" aria-hidden="true">›</span>
              </td>
              <td className="mk-num">{usdShort(r.stats.medianSale)}</td>
              <td className="mk-num">{r.stats.avgPctOfList == null ? "—" : Math.round(r.stats.avgPctOfList) + "%"}</td>
              <td className="mk-num">{r.count}</td>
            </tr>
          ))}
          {!nbRows.length && <tr><td colSpan={4} className="mk-empty">No closed sales this month</td></tr>}
        </tbody>
      </table>
    </section>
  );
}
