// One section of related threshold sliders (e.g. "Temperature").
// Looks up each key in SLIDERS to get its label/range/formatter.

import SliderItem from "./SliderItem";
import { SLIDERS } from "../lib/thresholds";

export default function SliderGroup({ title, keys, thresh, setThresh }) {
  return (
    <div className="slider-group">
      <div className="group-title">{title}</div>
      <div className="slider-grid">
        {keys.map(k => {
          const slider = SLIDERS.find(s => s.k === k);
          return (
            <SliderItem
              key={k}
              slider={slider}
              value={thresh[k]}
              onChange={v => setThresh(prev => ({ ...prev, [k]: v }))}
            />
          );
        })}
      </div>
    </div>
  );
}
