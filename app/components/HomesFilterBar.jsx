'use client';

// Compact one-line Homes filter bar: grouped status chips, grouped type chips,
// a month range, and price min/max — all on one scrolling line — plus a live
// match count and a Stats button. Drives the map dots and (via the same filter)
// the Stats sheet. The selection persists in the parent's filter state.

import { STATUS_GROUPS, TYPE_GROUPS, otherTypes, groupOn, toggleGroup, ALL_STATUSES } from "../listings/lib/filter";

const monthEnd = ym => {
  if (!ym) return "";
  const [y, m] = ym.split("-").map(Number);
  const d = new Date(y, m, 0).getDate();
  return `${ym}-${String(d).padStart(2, "0")}`;
};

export default function HomesFilterBar({ filter, options, count, onChange, onOpenStats }) {
  const subUniverse = options?.subtypes || [];
  const set = patch => onChange({ ...filter, ...patch });
  const toggleStatus = g => set({ statuses: toggleGroup(filter.statuses, g.statuses, ALL_STATUSES) });
  const toggleType = g => {
    const members = g.other ? otherTypes(subUniverse) : g.types;
    set({ subtypes: toggleGroup(filter.subtypes, members, subUniverse) });
  };

  return (
    <div className="fog-float-panel left fog-homesbar">
      <div className="fog-homesbar-row">
        {STATUS_GROUPS.map(g => {
          const on = groupOn(filter.statuses, g.statuses);
          return (
            <button key={g.key} type="button" className={"fog-fchip" + (on ? " on" : "")} onClick={() => toggleStatus(g)} aria-pressed={on}>{g.key}</button>
          );
        })}
        <span className="fog-fsep" aria-hidden="true" />
        {TYPE_GROUPS.map(g => {
          const members = g.other ? otherTypes(subUniverse) : g.types;
          const on = groupOn(filter.subtypes, members);
          return (
            <button key={g.key} type="button" className={"fog-fchip" + (on ? " on" : "")} onClick={() => toggleType(g)} aria-pressed={on}>{g.key}</button>
          );
        })}
        <span className="fog-fsep" aria-hidden="true" />
        <input
          type="month" className="fog-ffld" aria-label="Sold from month"
          value={filter.closedFrom ? filter.closedFrom.slice(0, 7) : ""}
          max={filter.closedTo ? filter.closedTo.slice(0, 7) : undefined}
          onChange={e => set({ closedFrom: e.target.value ? `${e.target.value}-01` : "" })}
        />
        <span className="fog-farr" aria-hidden="true">→</span>
        <input
          type="month" className="fog-ffld" aria-label="Sold to month"
          value={filter.closedTo ? filter.closedTo.slice(0, 7) : ""}
          min={filter.closedFrom ? filter.closedFrom.slice(0, 7) : undefined}
          onChange={e => set({ closedTo: monthEnd(e.target.value) })}
        />
        <span className="fog-fsep" aria-hidden="true" />
        <input type="number" inputMode="numeric" className="fog-ffld fog-fprice" placeholder="$ min" aria-label="Min price" value={filter.minPrice} onChange={e => set({ minPrice: e.target.value })} />
        <input type="number" inputMode="numeric" className="fog-ffld fog-fprice" placeholder="$ max" aria-label="Max price" value={filter.maxPrice} onChange={e => set({ maxPrice: e.target.value })} />
      </div>
      <span className="fog-homesbar-end">
        <span className="fog-fcount">{count != null ? count.toLocaleString("en-US") : "…"}</span>
        <button type="button" className="fog-statsbtn" onClick={onOpenStats}>Stats ▸</button>
      </span>
    </div>
  );
}
