'use client';

// Market Update — a data-only, rolling-12-month version of the monthly PDF
// market reports. Two segments (Single-Family, Condo/TIC/Coop). For the
// selected month it shows the report's comparison block (with MoM/YoY), a
// trailing-12-month trend table, and a neighborhood breakdown.
//
// Everything is computed from the same geocoded closed-sale data the rest of
// the app uses. Metrics that need data we don't have yet ($/sqft, contracts,
// month-end inventory) render as "—" with a note, ready to light up when the
// export gains those fields.

import { useEffect, useMemo, useState } from "react";
import { computeStats } from "./../listings/lib/stats";

const DATA_URL = "/data/sf-listings.geojson";

const SEGMENTS = [
  { key: "sfr", label: "Single-Family Residences", types: ["Single Family Residence"] },
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

// Percent change between two numbers, formatted with sign; null-safe.
function deltaPct(cur, prev) {
  if (cur == null || prev == null || prev === 0) return null;
  return ((cur / prev - 1) * 100);
}
const fmtDelta = d => (d == null ? "n/a" : (d >= 0 ? "+" : "") + d.toFixed(1) + "%");

export default function MarketApp() {
  const [features, setFeatures] = useState([]);
  const [err, setErr] = useState("");
  const [month, setMonth] = useState("");

  useEffect(() => {
    fetch(DATA_URL)
      .then(r => { if (!r.ok) throw new Error(`Failed to load data (${r.status})`); return r.json(); })
      .then(d => setFeatures(d.features || []))
      .catch(e => setErr(e.message));
  }, []);

  // Closed sales only, indexed by segment → month → [property objects].
  const { bySegMonth, months } = useMemo(() => {
    const idx = {};
    SEGMENTS.forEach(s => (idx[s.key] = {}));
    const typeToSeg = {};
    SEGMENTS.forEach(s => s.types.forEach(t => (typeToSeg[t] = s.key)));
    const monthSet = new Set();
    for (const f of features) {
      const p = f.properties;
      if (!p.sellingDate || !(p.sellingPrice > 0)) continue;
      const seg = typeToSeg[p.propType];
      if (!seg) continue;
      const ym = p.sellingDate.slice(0, 7);
      monthSet.add(ym);
      (idx[seg][ym] = idx[seg][ym] || []).push(p);
    }
    // Sane, contiguous month list: trailing 18 from the latest real month
    // (drops stray bad dates like a lone 2002 entry).
    const sorted = [...monthSet].sort();
    const latest = sorted[sorted.length - 1];
    const valid = latest
      ? sorted.filter(m => m > shiftMonth(latest, -18))
      : [];
    return { bySegMonth: idx, months: valid };
  }, [features]);

  // Default to the latest *complete* month — skip the current calendar month,
  // which is still accruing sales (matches how the PDF reports the prior month).
  const currentYM = (() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`; })();
  const defaultMonth = useMemo(() => {
    const complete = months.filter(m => m < currentYM);
    return (complete.length ? complete[complete.length - 1] : months[months.length - 1]) || "";
  }, [months, currentYM]);
  const selected = month || defaultMonth;
  const isPartial = selected === currentYM;

  // Trailing 12 months ending at the selected month.
  const trailing12 = useMemo(() => {
    if (!selected) return [];
    return Array.from({ length: 12 }, (_, i) => shiftMonth(selected, -(11 - i)));
  }, [selected]);

  const statsFor = (segKey, ym) => {
    const props = bySegMonth[segKey]?.[ym] || [];
    return { props, stats: computeStats(props) };
  };

  if (err) return <div className="mk-page"><div className="mk-wrap"><div className="mk-err">{err}</div></div></div>;
  if (!features.length) return <div className="mk-page"><div className="mk-wrap"><p className="mk-loading">Loading market data…</p></div></div>;

  return (
    <div className="mk-page">
    <div className="mk-wrap">
      <header className="mk-head">
        <h1 className="mk-title">SF <em>Market Update</em></h1>
        <div className="mk-controls">
          <label className="mk-lbl">Report month</label>
          <select className="mk-select" value={selected} onChange={e => setMonth(e.target.value)}>
            {[...months].reverse().map(m => <option key={m} value={m}>{monthLabel(m)}{m === currentYM ? " (partial)" : ""}</option>)}
          </select>
        </div>
      </header>
      {isPartial && <p className="mk-partial">⚠ {monthLabel(selected)} is still in progress — figures are partial and MoM/YoY will look skewed until the month closes.</p>}
      <p className="mk-sub">
        Rolling view from SFAR MLS closed sales · MoM vs prior month · YoY vs same month last year.
        Cells marked “—” await data the export doesn’t carry yet ($/sq ft, contracts, month-end inventory).
      </p>

      {SEGMENTS.map(seg => {
        const cur = statsFor(seg.key, selected);
        const mom = statsFor(seg.key, shiftMonth(selected, -1));
        const yoy = statsFor(seg.key, shiftMonth(selected, -12));
        const hasYoY = (bySegMonth[seg.key]?.[shiftMonth(selected, -12)] || []).length > 0;

        const rows = [
          { label: "Median Sale Price", get: s => s.medianSale, fmt: usd, comp: true },
          { label: "Days on Market (median)", get: s => s.medianDom, fmt: intf, comp: true },
          { label: "$ / Sq Ft (median)", get: s => s.medianPpsf, fmt: usd, comp: true, note: "needs sq ft" },
          { label: "Properties Sold", get: s => s.soldCount, fmt: intf, comp: true },
          { label: "% Sold Over List", get: s => s.pctOverList, fmt: pct, comp: true },
          { label: "% of List Received (avg)", get: s => s.avgPctOfList, fmt: pct, comp: true },
          { label: "%Ask (med sale / med list)", get: s => s.pctAsk, fmt: pct, comp: true },
          { label: "Went Into Contract", placeholderNote: "needs contract date" },
          { label: "# For Sale (month-end)", placeholderNote: "needs inventory feed" },
        ];

        // Neighborhood breakdown for the selected month.
        const nbMap = new Map();
        for (const p of cur.props) {
          const n = p.neighborhood;
          if (!n) continue;
          (nbMap.get(n) || nbMap.set(n, []).get(n)).push(p);
        }
        const nbRows = [...nbMap.entries()]
          .map(([n, ps]) => ({ n, stats: computeStats(ps), count: ps.length }))
          .sort((a, b) => (b.stats.medianSale ?? 0) - (a.stats.medianSale ?? 0));

        return (
          <section className="mk-seg" key={seg.key}>
            <h2 className="mk-seg-title">{seg.label}</h2>

            {/* Comparison block */}
            <table className="mk-table">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>{monthLabelShort(selected)}</th>
                  <th>MoM Δ</th>
                  <th>YoY Δ</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(r => {
                  if (r.placeholderNote) {
                    return (
                      <tr key={r.label} className="mk-ph">
                        <td>{r.label}</td><td>—</td><td>—</td>
                        <td className="mk-note">{r.placeholderNote}</td>
                      </tr>
                    );
                  }
                  const c = r.get(cur.stats);
                  const m = r.get(mom.stats);
                  const y = r.get(yoy.stats);
                  return (
                    <tr key={r.label}>
                      <td>{r.label}{r.note && c == null ? <span className="mk-note"> · {r.note}</span> : null}</td>
                      <td className="mk-num">{r.fmt(c)}</td>
                      <td className={"mk-num " + deltaClass(deltaPct(c, m))}>{fmtDelta(deltaPct(c, m))}</td>
                      <td className={"mk-num " + (hasYoY ? deltaClass(deltaPct(c, y)) : "")}>{hasYoY ? fmtDelta(deltaPct(c, y)) : "n/a"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Rolling 12-month trend */}
            <h3 className="mk-h3">Rolling 12 months</h3>
            <table className="mk-table mk-trend">
              <thead>
                <tr><th>Month</th><th># Sold</th><th>Median</th><th>DOM</th><th>%Over</th><th>%ofList</th></tr>
              </thead>
              <tbody>
                {trailing12.map(ym => {
                  const s = statsFor(seg.key, ym).stats;
                  const isSel = ym === selected;
                  return (
                    <tr key={ym} className={isSel ? "mk-sel" : ""}>
                      <td>{monthLabelShort(ym)}</td>
                      <td className="mk-num">{s.soldCount || 0}</td>
                      <td className="mk-num">{usdShort(s.medianSale)}</td>
                      <td className="mk-num">{s.medianDom ?? "—"}</td>
                      <td className="mk-num">{s.pctOverList == null ? "—" : Math.round(s.pctOverList) + "%"}</td>
                      <td className="mk-num">{s.avgPctOfList == null ? "—" : Math.round(s.avgPctOfList) + "%"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Neighborhood breakdown */}
            <h3 className="mk-h3">By neighborhood · {monthLabel(selected)}</h3>
            <table className="mk-table mk-nb">
              <thead>
                <tr><th>Neighborhood</th><th>Median</th><th>$/SF</th><th>%ofList</th><th># Sold</th></tr>
              </thead>
              <tbody>
                {nbRows.map(r => (
                  <tr key={r.n}>
                    <td>{r.n}{r.count < 50 ? <span className="mk-star" title="Small sample (n<50)">*</span> : null}</td>
                    <td className="mk-num">{usdShort(r.stats.medianSale)}</td>
                    <td className="mk-num">{usd(r.stats.medianPpsf)}</td>
                    <td className="mk-num">{r.stats.avgPctOfList == null ? "—" : Math.round(r.stats.avgPctOfList) + "%"}</td>
                    <td className="mk-num">{r.count}</td>
                  </tr>
                ))}
                {!nbRows.length && <tr><td colSpan={5} className="mk-empty">No closed sales this month</td></tr>}
              </tbody>
            </table>
          </section>
        );
      })}

      <p className="mk-foot">
        * small sample (n&lt;50). Source: SFAR MLS closed sales, geocoded. $/sq ft, “Went Into Contract,”
        and “# For Sale” populate once the export includes square footage, contract dates, and active inventory.
      </p>
    </div>
    </div>
  );
}

function deltaClass(d) {
  if (d == null) return "";
  return d >= 0 ? "up" : "down";
}
