'use client';

// Click-through wine encyclopedia modal. Opens from anywhere a grape or
// wine-style name appears (winery popup, AVA "Known For", "Typical
// grapes"). Two layouts, same shell:
//   kind "grape" → variety profile (origin, climate, soils, …)
//   kind "style" → wine-style explainer (how it's made + what's blended)
// Reuses the .wine-list-overlay / .wine-list-box shell.

export default function GrapeModal({ grape, onClose }) {
  if (!grape) return null;
  const isStyle = grape.kind === "style";

  const rows = isStyle
    ? [
        ["What it is", grape.summary],
        ["How it's made", grape.how],
      ].filter(([, v]) => v)
    : [
        ["Origin", grape.origin],
        ["Parentage", grape.parentage],
        ["Also called", grape.aka?.length ? grape.aka.join(", ") : null],
        ["Grown in", grape.regions?.join(", ")],
        ["Ideal climate", grape.climate],
        ["Site & exposure", grape.site],
        ["Preferred soils", grape.soils],
        ["Tastes like", grape.tastes?.join(", ")],
        ["Style", grape.style],
      ].filter(([, v]) => v);

  const heading = isStyle
    ? `🍷 ${grape.name}`
    : `🍇 ${grape.name}`;

  return (
    <div className="wine-list-overlay" onClick={onClose}>
      <div className="wine-list-box grape-box" onClick={e => e.stopPropagation()}>
        <div className="wine-list-head">
          <span>
            {heading}
            <span className="grape-type"> · {isStyle ? "Wine style" : grape.type}</span>
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
          {isStyle && grape.blends?.length ? (
            <div className="grape-facts">
              <div className="grape-row-label">Typically blended from</div>
              <ul>
                {grape.blends.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>
          ) : null}
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
