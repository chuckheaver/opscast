'use client';

// Shared dropdown selector for map overlays that have multiple sub-layers —
// Transit lines, Hazard types, Bike classes, Microclimate zones. Same format
// for all: a header with "Show all" / "Select none", one tap-to-toggle row per
// item (colour swatch + label + check), and "Save default" at the bottom to
// persist the picks. The overlay itself is shown/hidden by its map chip.

export default function LayerSelector({ title, hint, items, onToggle, onAll, onNone, onSaveDefault, saveLabel = "Save default" }) {
  return (
    <div className="fog-float-panel left fog-transit-panel">
      <div className="fog-transit-head">
        <span>{title}</span>
        <div className="fog-transit-head-btns">
          <button type="button" className="fog-transit-act" onClick={onAll}>Show all</button>
          <button type="button" className="fog-transit-act none" onClick={onNone}>Select none</button>
        </div>
      </div>
      {hint && <p className="fog-transit-hint">{hint}</p>}
      <div className="fog-transit-list">
        {items.map(it => {
          const sw = it.dashed
            ? { backgroundImage: `repeating-linear-gradient(90deg, ${it.color} 0 4px, transparent 4px 7px)` }
            : { background: it.color };
          return (
            <button
              key={it.key}
              type="button"
              className={"fog-transit-row" + (it.on ? " on" : "")}
              onClick={() => onToggle(it.key)}
              aria-pressed={!!it.on}
            >
              <span className="fog-transit-sw" style={sw} />
              <span className="fog-transit-label">{it.label}</span>
              <span className="fog-transit-check">{it.on ? "✓" : ""}</span>
            </button>
          );
        })}
      </div>
      {onSaveDefault && (
        <button type="button" className="fog-transit-save-btn" onClick={onSaveDefault}>{saveLabel}</button>
      )}
    </div>
  );
}
