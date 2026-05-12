// One labeled threshold slider (used in the setup view).
// Stateless — value + onChange are owned by the parent.

export default function SliderItem({ slider, value, onChange }) {
  return (
    <div className="sl-item">
      <div className="sl-top">
        <span className="sl-name">{slider.label}</span>
        <span className="sl-val mono">{slider.fmt(value)}</span>
      </div>
      <input
        type="range"
        min={slider.min}
        max={slider.max}
        step={slider.step}
        value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
      />
    </div>
  );
}
