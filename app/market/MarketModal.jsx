'use client';

// "Stats" pop-up (launched from the MySFMap "Stats" chip). Uses the same shared
// market filter as the Homes overlay, and reports stats for whatever matches:
// a summary, a by-neighborhood breakdown, and the underlying sales by address.
// Lazy-loads the listings GeoJSON on first open (cached module-wide).

import { useEffect, useMemo, useState } from "react";
import { computeStats } from "../listings/lib/stats";
import { loadListingsFeatures } from "../listings/lib/load";
import { defaultFilter, matchesFilter, deriveOptions, isSoldStatus } from "../listings/lib/filter";
import ListingFilter from "../components/ListingFilter";

const usd = n => (n == null ? "—" : "$" + Math.round(n).toLocaleString("en-US"));
const usdShort = n => {
  if (n == null) return "—";
  if (n >= 1e6) return "$" + (n / 1e6).toFixed(2) + "M";
  if (n >= 1e3) return "$" + Math.round(n / 1e3) + "K";
  return "$" + Math.round(n);
};
const pct = n => (n == null ? "—" : n.toFixed(1) + "%");
const intf = n => (n == null ? "—" : Math.round(n).toLocaleString("en-US"));
const shortAddr = a => (a ? a.replace(/,\s*San Francisco.*$/i, "") : "—");
const fmtDate = iso => { const m = iso && /^(\d{4})-(\d{2})-(\d{2})/.exec(iso); return m ? `${+m[2]}/${+m[3]}/${m[1].slice(2)}` : "—"; };

export default function MarketModal({ onClose }) {
  const [features, setFeatures] = useState(null);
  const [filter, setFilter] = useState(defaultFilter);
  const [showProps, setShowProps] = useState(false); // expand the by-address grid

  useEffect(() => {
    let cancelled = false;
    loadListingsFeatures().then(f => { if (!cancelled) setFeatures(f); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const onKey = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const options = useMemo(() => deriveOptions(features), [features]);

  // Properties passing the filter.
  const props = useMemo(() => {
    if (!features) return [];
    const out = [];
    for (const f of features) if (matchesFilter(f.properties, filter)) out.push(f.properties);
    return out;
  }, [features, filter]);

  const stats = useMemo(() => computeStats(props), [props]);
  const soldProps = useMemo(() => props.filter(p => isSoldStatus(p.status) && p.sellingPrice > 0), [props]);

  // By-neighborhood breakdown over the filtered set (sold rows), sorted by
  // median price. Clicking a row narrows the filter to that neighborhood.
  const nbRows = useMemo(() => {
    const map = new Map();
    for (const p of soldProps) {
      const n = p.neighborhood;
      if (!n) continue;
      (map.get(n) || map.set(n, []).get(n)).push(p);
    }
    return [...map.entries()]
      .map(([n, ps]) => ({ n, stats: computeStats(ps), count: ps.length }))
      .sort((a, b) => (b.stats.medianSale ?? 0) - (a.stats.medianSale ?? 0));
  }, [soldProps]);

  const loading = features === null;
  const summaryRows = [
    { label: "Median Sale Price", v: usd(stats.medianSale) },
    { label: "$ / Sq Ft (median)", v: usd(stats.medianPpsf) },
    { label: "Days on Market (median)", v: intf(stats.medianDom) },
    { label: "Sold", v: intf(stats.soldCount) },
    { label: "% Sold Over List", v: pct(stats.pctOverList) },
    { label: "% of List Received (avg)", v: pct(stats.avgPctOfList) },
  ];

  return (
    <div className="nh-backdrop" onClick={onClose}>
      <div className="nh-modal" onClick={e => e.stopPropagation()} role="dialog" aria-label="Housing market stats">
        <button className="nh-x" onClick={onClose} aria-label="Close">×</button>

        <div style={{ fontSize: 22, fontWeight: 800, color: "#1c1917", lineHeight: 1.1, letterSpacing: "-0.5px" }}>Housing market stats</div>
        <div style={{ fontSize: 13, color: "#78716c", marginTop: 3 }}>
          {loading ? "Loading…" : `${props.length.toLocaleString("en-US")} listings match · ${soldProps.length.toLocaleString("en-US")} sold`}
        </div>

        {!loading && (
          <ListingFilter filter={filter} options={options} onChange={setFilter} onReset={() => setFilter(defaultFilter())} />
        )}

        {loading ? (
          <p style={{ marginTop: 16, color: "#78716c" }}>Loading market data…</p>
        ) : props.length === 0 ? (
          <p style={{ marginTop: 16, color: "#78716c" }}>No listings match these filters.</p>
        ) : (
          <>
            <h3 className="mk-h3" style={{ marginTop: 18 }}>Summary{stats.soldCount ? "" : " (no sales in filter)"}</h3>
            <table className="mk-table">
              <tbody>
                {summaryRows.map(r => (
                  <tr key={r.label}><td>{r.label}</td><td className="mk-num">{r.v}</td></tr>
                ))}
              </tbody>
            </table>

            {!filter.neighborhood && nbRows.length > 0 && (
              <>
                <h3 className="mk-h3">By neighborhood</h3>
                <p style={{ fontSize: 11, color: "#a8a29e", margin: "0 0 6px" }}>Tap a neighborhood to filter to it.</p>
                <table className="mk-table mk-nb">
                  <thead><tr><th>Neighborhood</th><th>Median</th><th>%ofList</th><th># Sold</th></tr></thead>
                  <tbody>
                    {nbRows.map(r => (
                      <tr key={r.n} className="mk-nb-row" onClick={() => setFilter({ ...filter, neighborhood: r.n })} title={`Filter to ${r.n}`}>
                        <td><span className="mk-nb-name">{r.n}</span>{r.count < 50 ? <span className="mk-star" title="Small sample (n<50)">*</span> : null}<span className="mk-nb-arrow" aria-hidden="true">›</span></td>
                        <td className="mk-num">{usdShort(r.stats.medianSale)}</td>
                        <td className="mk-num">{r.stats.avgPctOfList == null ? "—" : Math.round(r.stats.avgPctOfList) + "%"}</td>
                        <td className="mk-num">{r.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8, marginTop: 18 }}>
              <h3 className="mk-h3" style={{ margin: 0 }}>Properties ({props.length.toLocaleString("en-US")})</h3>
              <button type="button" className="mk-props-link" onClick={() => setShowProps(o => !o)}>{showProps ? "Hide ▾" : "Show ›"}</button>
            </div>
            {showProps && <PropertiesGrid rows={props} />}

            <p style={{ fontSize: 11, color: "#a8a29e", marginTop: 14, lineHeight: 1.5 }}>
              Source: SFAR MLS, geocoded. Medians use closed sales; active/pending listings are counted but have no sale price.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

// The underlying listings by address — same grid as the old listings page.
function PropertiesGrid({ rows }) {
  const sorted = useMemo(
    () => [...rows].sort((a, b) => (b.sellingPrice || b.price || 0) - (a.sellingPrice || a.price || 0)),
    [rows]
  );
  if (!sorted.length) return <div className="re-modal-empty">No matching listings.</div>;
  return (
    <div className="re-modal-scroll mk-props" style={{ marginTop: 10 }}>
      <table className="re-modal-table">
        <thead>
          <tr><th>Address</th><th>Status</th><th>Bd/Ba</th><th>Sq Ft</th><th>List</th><th>Sale</th><th>$/SF</th><th>DOM</th><th>Sold</th></tr>
        </thead>
        <tbody>
          {sorted.map(p => {
            const ppsf = p.sqft > 0 && p.sellingPrice ? p.sellingPrice / p.sqft : null;
            return (
              <tr key={p.id}>
                <td className="re-m-addr">{shortAddr(p.address)}{p.unit ? ` #${p.unit}` : ""}</td>
                <td>{p.status}</td>
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
  );
}
