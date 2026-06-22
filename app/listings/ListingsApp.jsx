'use client';

// Real-estate explorer. Loads the geocoded listing GeoJSON once, holds all
// filter state, and derives (a) the filtered feature list handed to the map
// and (b) the live stats shown in the sidebar. Map and stats are always
// computed from the same filtered set, so they never disagree.

import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import ListingsMap from "./ListingsMap";
import { computeStats, groupStats, GROUP_BY, fogZoneLabel, daysBetween } from "./lib/stats";
import { elevationAtPoint } from "../fog/lib/geocode";
import { findNeighborhoodForPoint } from "../fog/lib/spatial";
import { normalizeStreetAddress } from "../lib/buildingMatch";

const DATA_URL = "/data/sf-listings.geojson";
const LISTING_BUILDINGS_URL = "/data/listing-buildings.json";
const SUPERVISOR_URL = "/data/sf-supervisor-districts.geojson";
const REALTOR_NBHD_URL = "/data/sf-realtor-neighborhoods.geojson";

// Breakdown-table columns the user can click to sort. "str" sorts
// alphanumerically (the group name), "num" numerically (the stats).
const SORT_COLS = {
  label:  { get: g => g.label,            type: "str" },
  count:  { get: g => g.stats.count,      type: "num" },
  median: { get: g => g.stats.medianSale, type: "num" },
  ppsf:   { get: g => g.stats.medianPpsf, type: "num" },
  dom:    { get: g => g.stats.medianDom,  type: "num" },
  pctAsk: { get: g => g.stats.pctAsk,     type: "num" },
};

const fmtUSD = n =>
  n == null ? "—" : "$" + Math.round(n).toLocaleString("en-US");
const fmtUSDshort = n => {
  if (n == null) return "—";
  if (n >= 1e6) return "$" + (n / 1e6).toFixed(2) + "M";
  if (n >= 1e3) return "$" + Math.round(n / 1e3) + "K";
  return "$" + Math.round(n);
};
const fmtPct0 = n => (n == null ? "—" : Math.round(n) + "%"); // whole-number percent
// ISO "2026-04-23" → "4/23/26"
const fmtDate = iso => {
  if (!iso) return "—";
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!m) return iso;
  return `${Number(m[2])}/${Number(m[3])}/${m[1].slice(2)}`;
};
// All listings are in SF — drop the ", San Francisco, CA 94XXX" tail to save
// space, keeping the street (and unit if present).
const shortAddr = a => (a ? a.split(",")[0].trim() : "—");
const fmtSqft = n => (n == null ? "—" : Math.round(n).toLocaleString("en-US"));
const fmtPpsf = n => (n == null ? "—" : "$" + Math.round(n).toLocaleString("en-US"));
const uniqSorted = arr => [...new Set(arr.filter(Boolean))].sort();

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
  // Deep-link from the fog neighborhood pop-up's "See Market data" button:
  //   /listings?nbhd=<name>&layer=nbhd  → open with that neighborhood
  //   highlighted, zoomed to, the neighborhood layer on, and the three
  //   ownership product types (SFH, condo, TIC) shown so the activity
  //   matches the pop-up's single-family and condo/TIC stat lines.
  const searchParams = useSearchParams();
  const initialNbhd = searchParams?.get("nbhd") || "";
  const deepLinked = !!initialNbhd || searchParams?.get("layer") === "nbhd";
  // Deep-link from a Tall Building pop-up's "See all market activity" link:
  //   /listings?building=<objectid> → show every listing in that one building,
  //   all statuses / types / dates, so the full sales history is visible.
  const initialBuilding = searchParams?.get("building") || "";

  const [features, setFeatures] = useState([]);
  const [supDistricts, setSupDistricts] = useState(null);
  const [reNbhds, setReNbhds] = useState(null);
  // Reverse lookup (normalized address → tall-building record) powering the
  // "View building structure" link in the property detail card.
  const [buildingsByAddr, setBuildingsByAddr] = useState(null);
  const [err, setErr] = useState("");

  // Filters
  // Default view: completed (Closed + Sold Off MLS) single-family sales this year.
  // A building deep-link wants the FULL history for that one address — so it
  // opens with no status / subtype / date constraints (empty set = all).
  const [statuses, setStatuses] = useState(() => initialBuilding
    ? new Set()
    : new Set(["Closed", "Sold Off MLS"]));
  const [subtypes, setSubtypes] = useState(() => initialBuilding
    ? new Set()
    : deepLinked
    ? new Set(["Single Family Residence", "Condominium", "Tenancy in Common"])
    : new Set(["Single Family Residence"]));
  const [district, setDistrict] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [fogHrs, setFogHrs] = useState(""); // exact fog-hours value, "" = all
  const [closedFrom, setClosedFrom] = useState(initialBuilding ? "" : "2026-01-01");
  const [closedTo, setClosedTo] = useState(""); // set to the last close date once data loads
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // Display options
  const [showFog, setShowFog] = useState(false);
  const [showNbhds, setShowNbhds] = useState(() => deepLinked);
  const [focusNbhd] = useState(initialNbhd); // neighborhood to highlight + zoom to (from deep-link)
  const [groupDim, setGroupDim] = useState("neighborhood");
  // Optional click-to-sort override for the breakdown table. null = the
  // dimension's natural order (e.g. districts 1→10, microclimate Sun→Fog).
  const [sort, setSort] = useState(null);
  const [selected, setSelected] = useState(null);
  const [groupModal, setGroupModal] = useState(null); // clicked breakdown group
  const [elevation, setElevation] = useState(null); // elevation (ft) of the selected property
  const [filtersOpen, setFiltersOpen] = useState(false); // collapsible filters, default collapsed

  useEffect(() => {
    fetch(DATA_URL)
      .then(r => {
        if (!r.ok) throw new Error(`Failed to load listings (${r.status})`);
        return r.json();
      })
      .then(d => setFeatures(d.features || []))
      .catch(e => setErr(e.message));
  }, []);

  // Boundary lookups used to tag each listing geographically, so the
  // breakdown can group by lenses the listing doesn't carry natively:
  //   • Supervisor ("City") districts  • SFAR realtor neighborhoods
  useEffect(() => {
    fetch(SUPERVISOR_URL).then(r => (r.ok ? r.json() : null)).then(d => d && setSupDistricts(d)).catch(() => {});
    fetch(REALTOR_NBHD_URL).then(r => (r.ok ? r.json() : null)).then(d => d && setReNbhds(d)).catch(() => {});
    fetch(LISTING_BUILDINGS_URL).then(r => (r.ok ? r.json() : null)).then(d => d && setBuildingsByAddr(d)).catch(() => {});
  }, []);

  // Resolve a listing's address to a tall-building record (if any).
  const buildingForAddress = useCallback(
    addr => {
      if (!buildingsByAddr) return null;
      const key = normalizeStreetAddress(addr);
      return key ? buildingsByAddr[key] || null : null;
    },
    [buildingsByAddr]
  );

  // The active building deep-link, resolved to its normalized address key +
  // display name (by reversing the address→building lookup on objectid).
  const buildingFilter = useMemo(() => {
    if (!initialBuilding || !buildingsByAddr) return null;
    for (const [key, b] of Object.entries(buildingsByAddr)) {
      if (String(b.objectid) === String(initialBuilding)) return { key, name: b.name };
    }
    return null;
  }, [initialBuilding, buildingsByAddr]);

  // Tag each listing's supervisor district and realtor neighborhood via
  // point-in-polygon, once the listings + each boundary set are loaded.
  // Idempotent — tags whichever field is still missing.
  useEffect(() => {
    if (!features.length) return;
    const needCity = supDistricts && features[0].properties.cityDistrict === undefined;
    const needRe = reNbhds && features[0].properties.reNeighborhood === undefined;
    if (!needCity && !needRe) return;
    for (const f of features) {
      const { lng, lat } = f.properties;
      const pt = Number.isFinite(lng) && Number.isFinite(lat) ? [lng, lat] : null;
      if (needCity) {
        const hit = pt && findNeighborhoodForPoint(supDistricts, pt);
        f.properties.cityDistrict = hit ? `District ${hit.properties.district}` : null;
      }
      if (needRe) {
        const hit = pt && findNeighborhoodForPoint(reNbhds, pt);
        f.properties.reNeighborhood = hit ? hit.properties.nbrhood : null;
      }
    }
    setFeatures(prev => [...prev]);
  }, [supDistricts, reNbhds, features]);

  // Look up the selected property's elevation (Mapbox terrain) on demand.
  useEffect(() => {
    setElevation(null);
    if (!selected || selected.lng == null || selected.lat == null) return;
    let cancelled = false;
    elevationAtPoint([selected.lng, selected.lat]).then(ft => {
      if (!cancelled) setElevation(ft);
    });
    return () => { cancelled = true; };
  }, [selected]);

  // Distinct filter option lists, derived from the loaded data.
  const allProps = useMemo(() => features.map(f => f.properties), [features]);

  // Most recent close date present in the data — the default "to" boundary.
  const lastCloseDate = useMemo(
    () => allProps.reduce((m, p) => (p.sellingDate && p.sellingDate > m ? p.sellingDate : m), ""),
    [allProps]
  );
  // Apply it as the default end date once, after the data loads.
  const dateInitRef = useRef(false);
  useEffect(() => {
    if (dateInitRef.current || !lastCloseDate) return;
    dateInitRef.current = true;
    setClosedTo(prev => prev || lastCloseDate);
  }, [lastCloseDate]);
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
      if (buildingFilter && normalizeStreetAddress(p.address) !== buildingFilter.key) return false;
      if (statuses.size && !statuses.has(p.status)) return false;
      if (subtypes.size && !subtypes.has(p.propType)) return false;
      if (district && p.areaDesc !== district) return false;
      if (neighborhood && p.neighborhood !== neighborhood) return false;
      if (fogHrs && String(p.fogHours) !== fogHrs) return false;
      // "Closed between" only constrains listings that actually closed; a
      // listing with no sale date (Active/Pending/Coming Soon) isn't excluded
      // by a closing-date range — the Status chips govern those instead.
      if (closedFrom && p.sellingDate && p.sellingDate < closedFrom) return false;
      if (closedTo && p.sellingDate && p.sellingDate > closedTo) return false;
      const price = p.price;
      if (lo != null && (price == null || price < lo)) return false;
      if (hi != null && (price == null || price > hi)) return false;
      return true;
    });
  }, [features, buildingFilter, statuses, subtypes, district, neighborhood, fogHrs, closedFrom, closedTo, minPrice, maxPrice]);

  const filteredProps = useMemo(() => filtered.map(f => f.properties), [filtered]);
  const stats = useMemo(() => computeStats(filteredProps), [filteredProps]);
  const groups = useMemo(() => {
    const g = GROUP_BY[groupDim];
    return groupStats(filteredProps, g.keyFn, g.labelFn, g.sortFn);
  }, [filteredProps, groupDim]);

  // Apply the click-to-sort override (if any) on top of the natural order.
  const sortedGroups = useMemo(() => {
    if (!sort) return groups;
    const { get, type } = SORT_COLS[sort.col];
    const arr = [...groups];
    arr.sort((a, b) => {
      const va = get(a), vb = get(b);
      if (va == null && vb == null) return 0;
      if (va == null) return 1;   // missing values sort last regardless of dir
      if (vb == null) return -1;
      const cmp = type === "str"
        ? String(va).localeCompare(String(vb), undefined, { numeric: true, sensitivity: "base" })
        : va - vb;
      return sort.dir === "asc" ? cmp : -cmp;
    });
    return arr;
  }, [groups, sort]);

  // Click a header: first click sorts descending for numbers (high→low) and
  // ascending for the name column (A→Z); clicking the active column flips it.
  const onSort = useCallback(col => {
    setSort(s => (s && s.col === col
      ? { col, dir: s.dir === "asc" ? "desc" : "asc" }
      : { col, dir: col === "label" ? "asc" : "desc" }));
  }, []);
  const sortArrow = col => (sort?.col === col ? (sort.dir === "asc" ? " ▲" : " ▼") : "");

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

  // Reset restores the default view (Closed · SFH · this year), not a blank slate.
  const resetFilters = useCallback(() => {
    setStatuses(new Set(["Closed", "Sold Off MLS"]));
    setSubtypes(new Set(["Single Family Residence"]));
    setDistrict("");
    setNeighborhood("");
    setFogHrs("");
    setClosedFrom("2026-01-01");
    setClosedTo(lastCloseDate);
    setMinPrice("");
    setMaxPrice("");
  }, [lastCloseDate]);

  const selDom =
    selected ? daysBetween(selected.listDate, selected.sellingDate) : null;
  const selOverUnder =
    selected && selected.sellingPrice && selected.listPrice
      ? (selected.sellingPrice / selected.listPrice - 1) * 100
      : null;

  // Compact, human-readable summary of the active filters — shown next to
  // "Filters" when the section is collapsed. e.g. "Closed, SFH, 1/1/26 to 6/10/26"
  const criteriaText = (() => {
    const parts = [];
    if (statuses.size) parts.push([...statuses].join(" / "));
    if (subtypes.size) parts.push([...subtypes].map(subtypeAbbrev).join(" / "));
    if (closedFrom || closedTo) parts.push(`${fmtDate(closedFrom)} to ${fmtDate(closedTo)}`);
    if (fogHrs) parts.push(fogZoneLabel(Number(fogHrs)));
    if (district) parts.push(district);
    if (neighborhood) parts.push(neighborhood);
    if (minPrice || maxPrice) parts.push(`$${minPrice || "0"}–${maxPrice || "∞"}`);
    return parts.join(", ") || "All listings";
  })();

  return (
    <div className="re-app">
      <aside className="re-sidebar">
        <a className="fog-topbar-lbl" href="/" style={{ display: "inline-block", marginBottom: 10 }}>← UrMicroLife</a>
        <header className="re-head">
          <h1 className="re-brand">SF <em>Real Estate Market</em></h1>
          <p className="re-tag">Fog zones · Neighborhoods · Sales</p>
        </header>

        {err && <div className="re-err">{err}</div>}

        {/* Filters — collapsible; first so you choose the set, then read summary + detail */}
        <section className="re-section re-section-top">
          <div className="re-section-head">
            <button className="re-collapse" onClick={() => setFiltersOpen(o => !o)} aria-expanded={filtersOpen}>
              <span className="re-chevron">{filtersOpen ? "▾" : "▸"}</span>
              <h2>Filters</h2>
              {!filtersOpen && <span className="re-filter-crit">{criteriaText}</span>}
            </button>
            {filtersOpen && <button className="re-reset" onClick={resetFilters}>Reset</button>}
          </div>

          {filtersOpen && (<>
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

          <label className="re-lbl">Fog Hr Exp</label>
          <select className="re-select" value={fogHrs} onChange={e => setFogHrs(e.target.value)}>
            <option value="">All fog levels</option>
            {fogHrsOptions.map(h => <option key={h} value={String(h)}>{fogZoneLabel(h)}</option>)}
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
          </>)}
        </section>

        {/* Market Summary — condensed left-justified lines, always shown */}
        <section className="re-section">
          <div className="re-sum-head">
            <h2>Market Summary</h2>
            <span className="re-sum-qty">Qty: {stats.count.toLocaleString()}</span>
          </div>
          <div className="re-sum-lines">
            <div>Median Price: {fmtUSDshort(stats.medianSale)} · DOM: {stats.medianDom ?? "—"} · $/sf: {fmtPpsf(stats.medianPpsf)} · %List: {fmtPct0(stats.medianPctOfList)}</div>
            <div>Average Price: {fmtUSDshort(stats.avgSale)} · DOM: {stats.avgDom ?? "—"} · $/sf: {fmtPpsf(stats.avgPpsf)} · %List: {fmtPct0(stats.avgPctOfList)}</div>
          </div>
        </section>

        {/* Group-by table — the detail by metric */}
        <section className="re-section">
          <div className="re-section-head">
            <h2>Breakdown by</h2>
            <select value={groupDim} onChange={e => { setGroupDim(e.target.value); setSort(null); }} className="re-select re-select-sm">
              {Object.entries(GROUP_BY).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
          </div>
          <table className="re-table">
            <thead>
              <tr>
                <th className="re-th-sort" onClick={() => onSort("label")}>{GROUP_BY[groupDim].label}{sortArrow("label")}</th>
                <th className="re-th-sort" onClick={() => onSort("count")}>#{sortArrow("count")}</th>
                <th className="re-th-sort" onClick={() => onSort("median")}>Median{sortArrow("median")}</th>
                <th className="re-th-sort" onClick={() => onSort("ppsf")}>$/SF{sortArrow("ppsf")}</th>
                <th className="re-th-sort" onClick={() => onSort("dom")}>DOM{sortArrow("dom")}</th>
                <th className="re-th-sort" onClick={() => onSort("pctAsk")}>%Ask{sortArrow("pctAsk")}</th>
              </tr>
            </thead>
            <tbody>
              {sortedGroups.map(g => (
                <tr key={g.key}>
                  <td className="re-grp">
                    <button
                      className="re-grp-link"
                      onClick={() => setGroupModal(g)}
                      title={`Show the ${g.stats.soldCount} sold listings`}
                    >
                      {g.label}
                    </button>
                  </td>
                  <td>{g.stats.count}</td>
                  <td>{fmtUSDshort(g.stats.medianSale)}</td>
                  <td>{fmtPpsf(g.stats.medianPpsf)}</td>
                  <td>{g.stats.medianDom ?? "—"}</td>
                  <td>{g.stats.pctAsk == null ? "—" : Math.round(g.stats.pctAsk) + "%"}</td>
                </tr>
              ))}
              {!groups.length && <tr><td colSpan={6} className="re-empty">No matching properties</td></tr>}
            </tbody>
          </table>
        </section>

        <p className="re-foot">
          {features.length} geocoded listings · USGS summer fog hours · US Census geocoder
        </p>
      </aside>

      <div className="re-map-wrap">
        <ListingsMap
          features={filtered}
          colorBy="status"
          showFog={showFog}
          showNbhds={showNbhds}
          focusNbhd={focusNbhd}
          selectedId={selected?.id}
          onSelect={setSelected}
        />

        {/* Map controls overlay — layer toggles */}
        <div className="re-map-controls">
          <label className="re-ctrl-check">
            <input type="checkbox" checked={showFog} onChange={e => setShowFog(e.target.checked)} /> <strong>Fog Layer</strong>
          </label>
          <label className="re-ctrl-check">
            <input type="checkbox" checked={showNbhds} onChange={e => setShowNbhds(e.target.checked)} /> <strong>Neighborhoods</strong>
          </label>
        </div>

        {/* Status color legend */}
        <div className="re-legend">
          <div className="re-legend-items">
            {STATUS_LEGEND.map(([label, color]) => (
              <span className="re-legend-item" key={label}>
                <span className="re-legend-dot" style={{ background: color }} />{label}
              </span>
            ))}
          </div>
        </div>

        {/* Drill-down card */}
        {selected && (
          <div className="re-detail">
            <button className="re-detail-x" onClick={() => setSelected(null)}>×</button>
            <div className="re-detail-status" data-status={selected.status}>{selected.status}</div>
            <h3 className="re-detail-addr">{shortAddr(selected.address)}</h3>
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
              <Field k="Listed" v={fmtDate(selected.listDate)} />
              <Field k="Closed" v={fmtDate(selected.sellingDate)} />
              <Field k="Days on market" v={selected.dom ?? selDom} />
              <Field k="Neighborhood" v={selected.neighborhood} />
              <Field k="District" v={selected.areaDesc} />
              <Field k="Real Estate District" v={selected.district} />
              <Field k="Elevation" v={elevation != null ? elevation.toLocaleString() + " ft" : "—"} />
              <Field k="Zip" v={selected.zip} />
              <Field k="Fog Hr Exp" v={selected.fogHours != null ? fogZoneLabel(selected.fogHours) : "—"} />
              <Field k="APN" v={selected.apn} />
              <Field k="MLS #" v={selected.id} />
              <Field k="Listing Agent" v={selected.agent} />
              <Field k="Selling Agent" v={selected.sellingAgent} />
            </dl>
            {(() => {
              const b = buildingForAddress(selected.address);
              if (!b) return null;
              const href = `/fog?preset=buildings&bz=1`
                + `&lat=${b.lat}&lng=${b.lng}`
                + `&name=${encodeURIComponent(b.name)}`;
              return (
                <a className="re-detail-link" href={href}>
                  🏢 View building structure — {b.name} ›
                </a>
              );
            })()}
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
              <div className="re-modal-head">
                <h3 className="re-modal-title">{groupModal.label}</h3>
                <span className="re-modal-sub">{sold.length} sold of {groupModal.stats.count} listings</span>
              </div>
              <div className="re-sum-lines re-modal-lines">
                <div>Median Price: {fmtUSDshort(groupModal.stats.medianSale)} · DOM: {groupModal.stats.medianDom ?? "—"} · $/sf: {fmtPpsf(groupModal.stats.medianPpsf)} · %List: {fmtPct0(groupModal.stats.medianPctOfList)}</div>
                <div>Average Price: {fmtUSDshort(groupModal.stats.avgSale)} · DOM: {groupModal.stats.avgDom ?? "—"} · $/sf: {fmtPpsf(groupModal.stats.avgPpsf)} · %List: {fmtPct0(groupModal.stats.avgPctOfList)}</div>
              </div>
              {sold.length === 0 ? (
                <div className="re-modal-empty">No sold listings in this group.</div>
              ) : (
                <div className="re-modal-scroll">
                  <table className="re-modal-table">
                    <thead>
                      <tr>
                        <th>Address</th><th>Closed</th><th>List</th><th>Sale</th>
                        <th>vs list</th><th>DOM</th><th>Status</th><th>Neighborhood</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sold.map(p => {
                        const delta = p.listPrice ? (p.sellingPrice / p.listPrice - 1) * 100 : null;
                        const dom = p.dom ?? daysBetween(p.listDate, p.sellingDate);
                        return (
                          <tr key={p.id} onClick={() => { setSelected(p); setGroupModal(null); }} title="Show on map">
                            <td className="re-m-addr">{shortAddr(p.address)}</td>
                            <td className="re-m-num">{fmtDate(p.sellingDate)}</td>
                            <td className="re-m-num">{fmtUSD(p.listPrice)}</td>
                            <td className="re-m-num">{fmtUSD(p.sellingPrice)}</td>
                            <td className={"re-m-num " + (delta == null ? "" : delta >= 0 ? "up" : "down")}>
                              {delta == null ? "—" : (delta >= 0 ? "+" : "") + delta.toFixed(1) + "%"}
                            </td>
                            <td className="re-m-num">{dom == null ? "—" : dom}</td>
                            <td>{p.status}</td>
                            <td>{p.fogNeighborhood ?? "—"}</td>
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

function Field({ k, v }) {
  return (
    <>
      <dt>{k}</dt>
      <dd>{v == null || v === "" ? "—" : v}</dd>
    </>
  );
}
