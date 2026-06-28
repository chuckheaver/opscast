'use client';

// The shared market filter UI (status, property type, closed-between dates,
// fog hours, district, neighborhood, price). Stateless — the parent owns the
// filter object and option lists; this just renders controls and reports
// changes. Used by the MySFMap "Homes" overlay and the "Stats" pop-up.

import { subtypeAbbrev, fogZoneLabel } from "../listings/lib/filter";

export default function ListingFilter({ filter, options, onChange, onReset }) {
  const toggleSet = (key, val) => {
    const s = new Set(filter[key]);
    s.has(val) ? s.delete(val) : s.add(val);
    onChange({ ...filter, [key]: s });
  };
  const set = (key, val) => onChange({ ...filter, [key]: val });

  return (
    <div className="lf">
      <div className="lf-head">
        <span>Filters</span>
        {onReset && <button type="button" className="lf-reset" onClick={onReset}>Reset</button>}
      </div>

      <div className="lf-section">
        <div className="lf-label">Status</div>
        <div className="lf-chips">
          {options.statuses.map(s => (
            <button key={s} type="button"
              className={"lf-chip" + (filter.statuses.has(s) ? " on" : "")}
              onClick={() => toggleSet("statuses", s)}>{s}</button>
          ))}
        </div>
      </div>

      <div className="lf-section">
        <div className="lf-label">Property type</div>
        <div className="lf-chips">
          {options.subtypes.map(t => (
            <button key={t} type="button" title={t}
              className={"lf-chip" + (filter.subtypes.has(t) ? " on" : "")}
              onClick={() => toggleSet("subtypes", t)}>{subtypeAbbrev(t)}</button>
          ))}
        </div>
      </div>

      <div className="lf-section">
        <div className="lf-label">Closed between</div>
        <div className="lf-row">
          <input type="date" className="lf-input" value={filter.closedFrom} max={filter.closedTo || undefined}
            onChange={e => set("closedFrom", e.target.value)} />
          <input type="date" className="lf-input" value={filter.closedTo} min={filter.closedFrom || undefined}
            onChange={e => set("closedTo", e.target.value)} />
        </div>
      </div>

      <div className="lf-section">
        <div className="lf-label">Fog Hr Exp</div>
        <select className="lf-select" value={filter.fogHrs} onChange={e => set("fogHrs", e.target.value)}>
          <option value="">All fog levels</option>
          {options.fogHrs.map(h => <option key={h} value={String(h)}>{fogZoneLabel(h)}</option>)}
        </select>
      </div>

      <div className="lf-section">
        <div className="lf-label">District</div>
        <select className="lf-select" value={filter.district} onChange={e => set("district", e.target.value)}>
          <option value="">All districts</option>
          {options.districts.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      <div className="lf-section">
        <div className="lf-label">Neighborhood</div>
        <select className="lf-select" value={filter.neighborhood} onChange={e => set("neighborhood", e.target.value)}>
          <option value="">All neighborhoods</option>
          {options.neighborhoods.map(n => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>

      <div className="lf-section">
        <div className="lf-label">Price range</div>
        <div className="lf-row">
          <input className="lf-input" placeholder="Min $" inputMode="numeric" value={filter.minPrice}
            onChange={e => set("minPrice", e.target.value.replace(/[^0-9]/g, ""))} />
          <input className="lf-input" placeholder="Max $" inputMode="numeric" value={filter.maxPrice}
            onChange={e => set("maxPrice", e.target.value.replace(/[^0-9]/g, ""))} />
        </div>
      </div>
    </div>
  );
}
