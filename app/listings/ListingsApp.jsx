'use client';

// Real-estate explorer. Loads the geocoded listing GeoJSON once, holds all
// filter state, and derives (a) the filtered feature list handed to the map
// and (b) the live stats shown in the sidebar. Map and stats are always
// computed from the same filtered set, so they never disagree.

import { useEffect, useMemo, useState, useCallback } from "react";
import ListingsMap from "./ListingsMap";
import { computeStats, groupStats, GROUP_BY, fogColor, daysBetween } from "./lib/stats";

const DATA_URL = "/data/sf-listings.geojson";

const fmtUSD = n =>
  n == null ? "—" : "$" + Math.round(n).toLocaleString("en-US");
const fmtUSDshort = n => {
  if (n == null) return "—";
  if (n >= 1e6) return "$" + (n / 1e6).toFixed(2) + "M";
  if (n >= 1e3) return "$" + Math.round(n / 1e3) + "K";
  return "$" + Math.round(n);
};
const fmtPct = n => (n == null ? "—" : n.toFixed(1) + "%");
const fmtSqft = n => (n == null ? "—" : Math.round(n).toLocaleString("en-US"));
const fmtPpsf = n => (n == null ? "—" : "$" + Math.round(n).toLocaleString("en-US"));
const uniqSorted = arr => [...new Set(arr.filter(Boolean))].sort();

// Bar colour for a breakdown group: fog hours use the fog gradient, every
// other dimension uses the accent blue.
function groupColor(groupDim, key) {
  if (groupDim === "fog") return fogColor(Number(key));
  return "#2563eb";
}

// Legend rows for the map, keyed to the active "Color by" mode. Must match
// the paint ramps in ListingsMap.jsx.
// Short labels for the property-subtype filter chips (Property Subtype 1
// Display → abbreviation). Anything not listed falls back to its first three
// letters, uppercased.
const SUBTYPE_ABBREV = {
  "Single Family Residence": "SFH",
  "Condominium": "CND",
  "Tenancy in Common": "TIC",
  "Townhouse": "TNH",
  "3+ Houses on Lot": "3+H",
  "Other": "OTH",
};
// Preferred chip order; any other subtypes follow in data order.
const SUBTYPE_ORDER = [
  "Single Family Residence",
  "Condominium",
  "Tenancy in Common",
  "Townhouse",
  "3+ Houses on Lot",
  "Other",
];
const subtypeAbbrev = t => SUBTYPE_ABBREV[t] || (t ? t.slice(0, 3).toUpperCase() : "?");

const STATUS_LEGEND = [
  ["Active", "#16a34a"],
  ["Pending", "#f59e0b"],
  ["Contingent", "#fb923c"],
  ["Coming Soon", "#06b6d4"],
  ["Closed", "#2563eb"],
  ["Sold Off MLS", "#7c3aed"],
];

export default function ListingsApp() {
  const [features, setFeatures] = useState([]);
  const [err, setErr] = useState("");

  // Filters
  const [statuses, setStatuses] = useState(new Set()); // empty = all
  const [subtypes, setSubtypes] = useState(new Set()); // property subtype, empty = all
  const [district, setDistrict] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [fogHrs, setFogHrs] = useState(""); // exact fog-hours value, "" = all
  const [closedFrom, setClosedFrom] = useState("");
  const [closedTo, setClosedTo] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // Display options
  const [colorBy, setColorBy] = useState("status");
  const [showFog, setShowFog] = useState(true);
  const [groupDim, setGroupDim] = useState("fog");
  const [selected, setSelected] = useState(null);
  const [groupModal, setGroupModal] = useState(null); // clicked breakdown group

  useEffect(() => {
    fetch(DATA_URL)
      .then(r => {
        if (!r.ok) throw new Error(`Failed to load listings (${r.status})`);
        return r.json();
      })
      .then(d => setFeatures(d.features || []))
      .catch(e => setErr(e.message));
  }, []);

  // Distinct filter option lists, derived from the loaded data.
  const allProps = useMemo(() => features.map(f => f.properties), [features]);
  const statusOptions = useMemo(() => uniqSorted(allProps.map(p => p.status)), [allProps]);
  const subtypeOptions = useMemo(() => {
    const present = new Set(allProps.map(p => p.propType).filter(Boolean));
    const ordered = SUBTYPE_ORDER.filter(t => present.has(t));
    const extras = [...present].filter(t => !SUBTYPE_ORDER.includes(t)).sort();
    return [...ordered, ...extras];
  }, [allProps]);
  const districtOptions = useMemo(
    () =>
      [...new Set(allProps.map(p => p.areaDesc).filter(Boolean))].sort(
        (a, b) => (parseInt(a.replace(/\D/g, ""), 10) || 999) - (parseInt(b.replace(/\D/g, ""), 10) || 999)
      ),
    [allProps]
  );
  const neighborhoodOptions = useMemo(
    () => uniqSorted(allProps.map(p => p.neighborhood)),
    [allProps]
  );
  const fogHrsOptions = useMemo(
    () =>
      [...new Set(allProps.map(p => p.fogHours).filter(h => h != null))].sort(
        (a, b) => a - b
      ),
    [allProps]
  );

  // Apply filters → filtered feature list.
  const filtered = useMemo(() => {
    const lo = minPrice ? Number(minPrice) : null;
    const hi = maxPrice ? Number(maxPrice) : null;
    return features.filter(f => {
      const p = f.properties;
      if (statuses.size && !statuses.has(p.status)) return false;
      if (subtypes.size && !subtypes.has(p.propType)) return false;
      if (district && p.areaDesc !== district) return false;
      if (neighborhood && p.neighborhood !== neighborhood) return false;
      if (fogHrs && String(p.fogHours) !== fogHrs) return false;
      if (closedFrom && (!p.sellingDate || p.sellingDate < closedFrom)) return false;
      if (closedTo && (!p.sellingDate || p.sellingDate > closedTo)) return false;
      const price = p.price;
      if (lo != null && (price == null || price < lo)) return false;
      if (hi != null && (price == null || price > hi)) return false;
      return true;
    });
  }, [features, statuses, subtypes, district, neighborhood, fogHrs, closedFrom, closedTo, minPrice, maxPrice]);

  const filteredProps = useMemo(() => filtered.map(f => f.properties), [filtered]);
  const stats = useMemo(() => computeStats(filteredProps), [filteredProps]);
  const groups = useMemo(() => {
    const g = GROUP_BY[groupDim];
    return groupStats(filteredProps, g.keyFn, g.labelFn, g.sortFn);
  }, [filteredProps, groupDim]);

  const toggleStatus = useCallback(s => {
    setStatuses(prev => {
      const next = new Set(prev);
      next.has(s) ? next.delete(s) : next.add(s);
      return next;
    });
  }, []);

  const toggleSubtype = useCallback(t => {
    setSubtypes(prev => {
      const next = new Set(prev);
      next.has(t) ? next.delete(t) : next.add(t);
      return next;
    });
  }, []);

  const resetFilters = useCallback(() => {
    setStatuses(new Set());
    setSubtypes(new Set());
    setDistrict("");
    setNeighborhood("");
    setFogHrs("");
    setClosedFrom("");
    setClosedTo("");
    setMinPrice("");
    setMaxPrice("");
  }, []);

  const selDom =
    selected ? daysBetween(selected.listDate, selected.sellingDate) : null;
  const selOverUnder =
    selected && selected.sellingPrice && selected.listPrice
      ? (selected.sellingPrice / selected.listPrice - 1) * 100
      : null;

  return (
    <div className="re-app">
      <aside className="re-sidebar">
        <header className="re-head">
          <h1 className="re-brand">SF Microclimate <em>Real Estate</em></h1>
          <p className="re-tag">Fog zones · Neighborhoods · Sales</p>
        </header>

        {err && <div className="re-err">{err}</div>}

        {/* Headline stats */}
        <div className="re-stats-grid">
          <Stat label="Properties" value={stats.count.toLocaleString()} />
          <Stat label="Closed" value={stats.soldCount.toLocaleString()} />
          <Stat label="Median sale" value={fmtUSDshort(stats.medianSale)} />
          <Stat label="Avg sale" value={fmtUSDshort(stats.avgSale)} />
          <Stat label="Median days on mkt" value={stats.medianDom ?? "—"} />
          <Stat label="% over asking" value={fmtPct(stats.pctOverList)} />
          <Stat label="Avg % of list" value={fmtPct(stats.avgPctOfList)} />
          <Stat label="Median fog hrs" value={stats.medianFogHours ?? "—"} />
          <Stat label="Avg sq ft" value={fmtSqft(stats.avgSqft)} />
          <Stat label="$ / sq ft" value={fmtPpsf(stats.medianPpsf)} />
        </div>

        {/* Group-by table — the microclimate story */}
        <section className="re-section">
          <div className="re-section-head">
            <h2>Breakdown by</h2>
            <select value={groupDim} onChange={e => setGroupDim(e.target.value)} className="re-select re-select-sm">
              {Object.entries(GROUP_BY).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
          </div>
          <table className="re-table">
            <thead>
              <tr><th>{GROUP_BY[groupDim].label}</th><th>#</th><th>Median</th><th>$/SF</th><th>DOM</th><th>%&gt;ask</th></tr>
            </thead>
            <tbody>
              {groups.map(g => (
                <tr key={g.key}>
                  <td className="re-grp">{g.label}</td>
                  <td>{g.stats.count}</td>
                  <td>{fmtUSDshort(g.stats.medianSale)}</td>
                  <td>{fmtPpsf(g.stats.medianPpsf)}</td>
                  <td>{g.stats.medianDom ?? "—"}</td>
                  <td>{g.stats.pctOverList == null ? "—" : Math.round(g.stats.pctOverList) + "%"}</td>
                </tr>
              ))}
              {!groups.length && <tr><td colSpan={6} className="re-empty">No matching properties</td></tr>}
            </tbody>
          </table>

          {/* Median-price bars — the headline microclimate visual */}
          {groups.length > 0 && (
            <div className="re-chart" role="img" aria-label={`Median sale price by ${GROUP_BY[groupDim].label}`}>
              <div className="re-chart-title">Median sale price by {GROUP_BY[groupDim].label.toLowerCase()}</div>
              {(() => {
                const max = Math.max(...groups.map(g => g.stats.medianSale || 0)) || 1;
                return groups.map(g => (
                  <div className="re-bar-row" key={g.key}>
                    <span className="re-bar-label" title={g.label}>{g.label}</span>
                    <div className="re-bar-track">
                      <div
                        className="re-bar-fill"
                        style={{
                          width: `${((g.stats.medianSale || 0) / max) * 100}%`,
                          background: groupColor(groupDim, g.key),
                        }}
                      />
                    </div>
                    <button
                      className="re-bar-val re-bar-link"
                      onClick={() => setGroupModal(g)}
                      title={`Show the ${g.stats.soldCount} sold listings behind this median`}
                    >
                      {fmtUSDshort(g.stats.medianSale)}
                    </button>
                  </div>
                ));
              })()}
            </div>
          )}
        </section>

        {/* Filters */}
        <section className="re-section">
          <div className="re-section-head">
            <h2>Filters</h2>
            <button className="re-reset" onClick={resetFilters}>Reset</button>
          </div>

          <label className="re-lbl">Status</label>
          <div className="re-chips">
            {statusOptions.map(s => (
              <button
                key={s}
                className={"re-chip" + (statuses.has(s) ? " on" : "")}
                onClick={() => toggleStatus(s)}
              >
                {s}
              </button>
            ))}
          </div>

          <label className="re-lbl">Property type</label>
          <div className="re-chips">
            {subtypeOptions.map(t => (
              <button
                key={t}
                className={"re-chip" + (subtypes.has(t) ? " on" : "")}
                onClick={() => toggleSubtype(t)}
                title={t}
              >
                {subtypeAbbrev(t)}
              </button>
            ))}
          </div>

          <label className="re-lbl">Closed between</label>
          <div className="re-row">
            <input type="date" className="re-input" value={closedFrom} onChange={e => setClosedFrom(e.target.value)} />
            <input type="date" className="re-input" value={closedTo} onChange={e => setClosedTo(e.target.value)} />
          </div>

          <label className="re-lbl">Fog hours</label>
          <select className="re-select" value={fogHrs} onChange={e => setFogHrs(e.target.value)}>
            <option value="">All fog levels</option>
            {fogHrsOptions.map(h => <option key={h} value={String(h)}>{h} fog hrs/day</option>)}
          </select>

          <label className="re-lbl">District</label>
          <select className="re-select" value={district} onChange={e => setDistrict(e.target.value)}>
            <option value="">All districts</option>
            {districtOptions.map(d => <option key={d} value={d}>{d}</option>)}
          </select>

          <label className="re-lbl">Neighborhood</label>
          <select className="re-select" value={neighborhood} onChange={e => setNeighborhood(e.target.value)}>
            <option value="">All neighborhoods</option>
            {neighborhoodOptions.map(n => <option key={n} value={n}>{n}</option>)}
          </select>

          <label className="re-lbl">Price range</label>
          <div className="re-row">
            <input type="number" placeholder="Min $" className="re-input" value={minPrice} onChange={e => setMinPrice(e.target.value)} />
            <input type="number" placeholder="Max $" className="re-input" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} />
          </div>
        </section>

        <p className="re-foot">
          {features.length} geocoded listings · USGS summer fog hours · US Census geocoder
        </p>
      </aside>

      <div className="re-map-wrap">
        <ListingsMap
          features={filtered}
          colorBy={colorBy}
          showFog={showFog}
          selectedId={selected?.id}
          onSelect={setSelected}
        />

        {/* Map controls overlay */}
        <div className="re-map-controls">
          <span className="re-ctrl-label">Color by</span>
          {["status", "fog", "price"].map(c => (
            <button key={c} className={"re-seg" + (colorBy === c ? " on" : "")} onClick={() => setColorBy(c)}>
              {c === "fog" ? "Fog" : c === "price" ? "Price" : "Status"}
            </button>
          ))}
          <label className="re-ctrl-check">
            <input type="checkbox" checked={showFog} onChange={e => setShowFog(e.target.checked)} /> Fog overlay
          </label>
        </div>

        {/* Color legend — reflects the active "Color by" mode */}
        <div className="re-legend">
          {colorBy === "status" && (
            <div className="re-legend-items">
              {STATUS_LEGEND.map(([label, color]) => (
                <span className="re-legend-item" key={label}>
                  <span className="re-legend-dot" style={{ background: color }} />{label}
                </span>
              ))}
            </div>
          )}
          {colorBy === "fog" && (
            <div className="re-legend-grad">
              <span>8.5 hrs (sunnier)</span>
              <span className="re-grad-bar" style={{ background: "linear-gradient(90deg,#fcd34d,#cbd5e1,#6b7280,#1f2937)" }} />
              <span>11.5 hrs (foggiest)</span>
            </div>
          )}
          {colorBy === "price" && (
            <div className="re-legend-grad">
              <span>$800K</span>
              <span className="re-grad-bar" style={{ background: "linear-gradient(90deg,#dbeafe,#60a5fa,#2563eb,#1e3a8a,#312e81)" }} />
              <span>$12M+</span>
            </div>
          )}
        </div>

        {/* Drill-down card */}
        {selected && (
          <div className="re-detail">
            <button className="re-detail-x" onClick={() => setSelected(null)}>×</button>
            <div className="re-detail-status" data-status={selected.status}>{selected.status}</div>
            <h3 className="re-detail-addr">{selected.address}</h3>
            <div className="re-detail-price">
              {fmtUSD(selected.sellingPrice ?? selected.listPrice)}
              {selected.sellingPrice && selected.listPrice && (
                <span className={"re-detail-delta " + (selOverUnder >= 0 ? "up" : "down")}>
                  {selOverUnder >= 0 ? "▲" : "▼"} {Math.abs(selOverUnder).toFixed(1)}% vs list
                </span>
              )}
            </div>
            <dl className="re-detail-grid">
              <Field k="Type" v={selected.propType} />
              <Field k="Beds / Baths" v={`${selected.bedrooms ?? "—"} / ${selected.bathrooms ?? "—"}`} />
              <Field k="Sq ft" v={selected.sqft ? fmtSqft(selected.sqft) : "—"} />
              <Field k="$ / sq ft" v={selected.sqft && (selected.sellingPrice ?? selected.listPrice) ? fmtPpsf((selected.sellingPrice ?? selected.listPrice) / selected.sqft) : "—"} />
              <Field k="List price" v={fmtUSD(selected.listPrice)} />
              <Field k="Sale price" v={fmtUSD(selected.sellingPrice)} />
              <Field k="Listed" v={selected.listDate ?? "—"} />
              <Field k="Closed" v={selected.sellingDate ?? "—"} />
              <Field k="Days on market" v={selDom ?? "—"} />
              <Field k="Neighborhood" v={selected.neighborhood} />
              <Field k="District" v={selected.areaDesc} />
              <Field k="Fog hours" v={selected.fogHours != null ? `${selected.fogHours} hrs/day` : "—"} />
              <Field k="Fog neighborhood" v={selected.fogNeighborhood} />
              <Field k="APN" v={selected.apn} />
              <Field k="Agent" v={selected.agent} />
            </dl>
          </div>
        )}
      </div>

      {/* Group drill-in modal: the listings behind a breakdown median */}
      {groupModal && (() => {
        const sold = groupModal.items
          .filter(p => Number.isFinite(p.sellingPrice) && p.sellingPrice > 0)
          .sort((a, b) => b.sellingPrice - a.sellingPrice);
        return (
          <div className="re-modal-backdrop" onClick={() => setGroupModal(null)}>
            <div className="re-modal" onClick={e => e.stopPropagation()}>
              <button className="re-modal-x" onClick={() => setGroupModal(null)}>×</button>
              <h3 className="re-modal-title">{groupModal.label}</h3>
              <div className="re-modal-sub">
                Median sale <strong>{fmtUSD(groupModal.stats.medianSale)}</strong>
                {" · "}{sold.length} sold of {groupModal.stats.count} listings
              </div>
              {sold.length === 0 ? (
                <div className="re-modal-empty">No sold listings in this group.</div>
              ) : (
                <div className="re-modal-scroll">
                  <table className="re-modal-table">
                    <thead>
                      <tr>
                        <th>Address</th><th>Status</th><th>Sale</th>
                        <th>vs list</th><th>Closed</th><th>Neighborhood</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sold.map(p => {
                        const delta = p.listPrice ? (p.sellingPrice / p.listPrice - 1) * 100 : null;
                        return (
                          <tr key={p.id} onClick={() => { setSelected(p); setGroupModal(null); }} title="Show on map">
                            <td className="re-m-addr">{p.address}</td>
                            <td>{p.status}</td>
                            <td className="re-m-num">{fmtUSD(p.sellingPrice)}</td>
                            <td className={"re-m-num " + (delta == null ? "" : delta >= 0 ? "up" : "down")}>
                              {delta == null ? "—" : (delta >= 0 ? "+" : "") + delta.toFixed(1) + "%"}
                            </td>
                            <td>{p.sellingDate ?? "—"}</td>
                            <td>{p.neighborhood ?? "—"}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="re-stat">
      <div className="re-stat-v">{value}</div>
      <div className="re-stat-l">{label}</div>
    </div>
  );
}

function Field({ k, v }) {
  return (
    <>
      <dt>{k}</dt>
      <dd>{v || "—"}</dd>
    </>
  );
}
