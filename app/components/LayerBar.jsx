'use client';

// Compact one-line selector bar: tiny colored letter chips that scroll
// horizontally, each toggling its sub-layer on/off, plus a single "All" control
// that turns every line on or off. The current selection is the user's default
// automatically (the parent persists it) — there's no Save button.

export default function LayerBar({ items, onToggle, onAll, onNone }) {
  const allOn = items.length > 0 && items.every(i => i.on);
  const anyOff = items.some(i => !i.on);
  return (
    <div className="fog-float-panel left fog-layerbar">
      <div className="fog-layerbar-row">
        {items.map(it => (
          <button
            key={it.key}
            type="button"
            className={"fog-lk" + (it.on ? " on" : "")}
            style={it.on ? { color: it.color, borderColor: it.color } : undefined}
            onClick={() => onToggle(it.key)}
            aria-pressed={!!it.on}
          >
            {it.short}
          </button>
        ))}
      </div>
      <button
        type="button"
        className={"fog-lk-all" + (allOn ? " on" : "")}
        onClick={() => (anyOff ? onAll() : onNone())}
        aria-label={anyOff ? "Show all lines" : "Hide all lines"}
      >
        {allOn ? "✓ All" : "All"}
      </button>
    </div>
  );
}
