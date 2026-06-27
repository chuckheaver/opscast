'use client';

// House-market stats shown as a pop-up (launched from the fog map's "House
// Market Stats" chip). Same data + math as the /market report, but scoped to a
// selected neighborhood when one is picked, otherwise city-wide. Lazy-loads the
// listings GeoJSON the first time it's opened (cached module-wide afterward).

import { useEffect, useMemo, useState } from "react";
import { computeStats } from "../listings/lib/stats";

const DATA_URL = "/data/sf-listings.geojson";

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

// Cache the (largish) listings fetch so re-opening the pop-up is instant.
let featuresPromise = null;
function loadFeatures() {
  if (!featuresPromise) {
    featuresPromise = fetch(DATA_URL)
      .then(r => (r.ok ? r.json() : { features: [] }))
      .then(d => d.features || [])
      .catch(() => []);
  }
  return featuresPromise;
}

export default function MarketModal({ neighborhood, onClose }) {
  const [features, setFeatures] = useState(null);
  const [month, setMonth] = useState("");

  useEffect(() => {
    let cancelled = false;
    loadFeatures().then(f => { if (!cancelled) setFeatures(f); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const onKey = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Scope to the selected neighborhood (matching either the MLS name or the
  // fog-map name), else the whole city.
  const scoped = useMemo(() => {
    if (!features) return [];
    if (!neighborhood) return features;
    return features.filter(f => {
      const p = f.properties;
      return p.neighborhood === neighborhood || p.fogNeighborhood === neighborhood;
    });
  }, [features, neighborhood]);

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

  const heading = neighborhood || "San Francisco";
  const loading = features === null;

  return (
    <div className="nh-backdrop" onClick={onClose}>
      <div className="nh-modal" onClick={e => e.stopPropagation()} role="dialog" aria-label={`${heading} house market stats`}>
        <button className="nh-x" onClick={onClose} aria-label="Close">×</button>

        <div style={{ fontSize: 22, fontWeight: 800, color: "#1c1917", lineHeight: 1.1, letterSpacing: "-0.5px" }}>{heading}</div>
        <div style={{ fontSize: 13, color: "#78716c", marginTop: 3 }}>House market stats</div>

        {loading ? (
          <p style={{ marginTop: 16, color: "#78716c" }}>Loading market data…</p>
        ) : !selected ? (
          <p style={{ marginTop: 16, color: "#78716c" }}>
            No closed sales on record{neighborhood ? ` for ${neighborhood}` : ""} yet.
          </p>
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
            </p>

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
              return (
                <section key={seg.key} style={{ marginTop: 16 }}>
                  <h2 className="mk-seg-title" style={{ fontSize: 16, marginBottom: 8 }}>{seg.label}</h2>
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

            {/* City-wide view adds the by-neighborhood breakdown. */}
            {!neighborhood && <NeighborhoodBreakdown bySegMonth={bySegMonth} selected={selected} />}

            <p style={{ fontSize: 11, color: "#a8a29e", marginTop: 14, lineHeight: 1.5 }}>
              Source: SFAR MLS closed sales, geocoded. $/sq ft fills in once the export includes square footage.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

// City-wide neighborhood breakdown for the selected month (Single-Family +
// Condo pooled), sorted by median sale price.
function NeighborhoodBreakdown({ bySegMonth, selected }) {
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
            <tr key={r.n}>
              <td>{r.n}{r.count < 50 ? <span className="mk-star" title="Small sample (n<50)">*</span> : null}</td>
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
