'use client';

// Click-through grape encyclopedia modal. Rendered at the WineApp level
// so it opens from anywhere a grape name appears (winery popup, AVA
// "Known For", "Typical grapes"). Every grape uses the same compact
// field set, so the layout is identical variety to variety. Reuses the
// .wine-list-overlay / .wine-list-box shell.

export default function GrapeModal({ grape, onClose }) {
  if (!grape) return null;
  const rows = [
    ["Origin", grape.origin],
    ["Parentage", grape.parentage],
    ["Also called", grape.aka?.length ? grape.aka.join(", ") : null],
    ["Grown in", grape.regions?.join(", ")],
    ["Tastes like", grape.tastes?.join(", ")],
    ["Style", grape.style],
  ].filter(([, v]) => v);

  return (
    <div className="wine-list-overlay" onClick={onClose}>
      <div className="wine-list-box grape-box" onClick={e => e.stopPropagation()}>
        <div className="wine-list-head">
          <span>
            🍇 {grape.name}
            {grape.type ? <span className="grape-type"> · {grape.type}</span> : null}
          </span>
          <button type="button" className="wine-list-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <div className="wine-list-body grape-body">
          {rows.map(([label, value]) => (
            <div key={label} className="grape-row">
              <span className="grape-row-label">{label}</span>
              <span className="grape-row-value">{value}</span>
            </div>
          ))}
          {grape.facts?.length ? (
            <div className="grape-facts">
              <div className="grape-row-label">Good to know</div>
              <ul>
                {grape.facts.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
