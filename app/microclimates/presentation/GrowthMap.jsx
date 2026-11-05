"use client";

// How the city's housing was built out: every residential building on the
// Assessor's roll (public/data/city-growth.bin, scripts/build-city-growth.py)
// drawn on the site's city map as the year slider moves, coloured by when it was
// built or by property type. Dates before 1906 are shown together "by 1906":
// the Assessor carries many older buildings as 1900.

import { useEffect, useMemo, useRef, useState } from "react";

const TYPES = [
  { k: "sfh", label: "SFH", color: "#203C5F" },
  { k: "condo", label: "Condo/TIC/Co-op", color: "#E9BC3F" },
  { k: "duplex", label: "Duplex", color: "#3C8D7F" },
  { k: "other", label: "Other (Tri+)", color: "#8A8E93" },
];
const ERAS = [
  { to: 1906, label: "By 1906", color: "#7A2E1F" },
  { to: 1929, label: "1907–1929", color: "#C2562E" },
  { to: 1949, label: "1930–1949", color: "#E39B3A" },
  { to: 1979, label: "1950–1979", color: "#6FA7C9" },
  { to: 2100, label: "1980 on", color: "#1F5C8C" },
];
const eraOf = y => ERAS.findIndex(e => y <= e.to);
const START = 1906, END = 2025;

export default function GrowthMap({ land, hoods, events, w = 612, h = 628 }) {
  const cv = useRef(null);
  const [pts, setPts] = useState(null);
  const [year, setYear] = useState(START);
  const [mode, setMode] = useState("era");
  const [playing, setPlaying] = useState(false);
  const landP = useMemo(() => (typeof Path2D !== "undefined" ? new Path2D(land) : null), [land]);
  const hoodP = useMemo(() => (typeof Path2D !== "undefined" ? new Path2D(hoods.join("")) : null), [hoods]);

  useEffect(() => {
    fetch("/data/city-growth.bin").then(r => r.arrayBuffer()).then(b => {
      const dv = new DataView(b), n = b.byteLength / 6, a = new Float32Array(n * 2), y = new Uint16Array(n), t = new Uint8Array(n);
      for (let i = 0; i < n; i++) {
        a[2 * i] = dv.getUint16(6 * i, true) / 50; a[2 * i + 1] = dv.getUint16(6 * i + 2, true) / 50;
        y[i] = dv.getUint8(6 * i + 4) + 1800; t[i] = dv.getUint8(6 * i + 5);
      }
      setPts({ n, a, y, t });
    });
  }, []);

  // Play: 1906 → 2025 in about 12 seconds.
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setYear(v => { if (v >= END) { setPlaying(false); return END; } return v + 1; }), 100);
    return () => clearInterval(id);
  }, [playing]);

  useEffect(() => {
    const c = cv.current; if (!c || !landP) return;
    const dpr = window.devicePixelRatio || 1, cw = c.clientWidth, s = (cw / w) * dpr;
    c.width = cw * dpr; c.height = (cw * h / w) * dpr;
    const g = c.getContext("2d");
    g.setTransform(s, 0, 0, s, 0, 0);
    g.fillStyle = "#EEF2F5"; g.fillRect(0, 0, w, h);
    g.fillStyle = "#FBFAF7"; g.fill(landP, "evenodd");
    if (pts) {
      const r = 0.75;
      for (let i = 0; i < pts.n; i++) {
        const yr = pts.y[i]; if (yr > year) break;
        g.fillStyle = mode === "era" ? ERAS[eraOf(yr)].color : TYPES[pts.t[i]].color;
        g.fillRect(pts.a[2 * i] - r / 2, pts.a[2 * i + 1] - r / 2, r, r);
      }
      // The last five years' buildings drawn larger, so the edge of growth shows.
      if (year > START && year < END) {
        for (let i = pts.n - 1; i >= 0; i--) {
          const yr = pts.y[i]; if (yr > year) continue; if (yr <= year - 5) break;
          g.fillStyle = mode === "era" ? ERAS[eraOf(yr)].color : TYPES[pts.t[i]].color;
          g.fillRect(pts.a[2 * i] - 1.1, pts.a[2 * i + 1] - 1.1, 2.2, 2.2);
        }
      }
    }
    g.strokeStyle = "rgba(32,60,95,.22)"; g.lineWidth = 0.5; g.stroke(hoodP);
    g.strokeStyle = "rgba(32,60,95,.55)"; g.lineWidth = 0.8; g.stroke(landP);
  }, [pts, year, mode, landP, hoodP, w, h]);

  const built = useMemo(() => {
    if (!pts) return null;
    let n = 0; for (let i = 0; i < pts.n && pts.y[i] <= Math.max(year, START); i++) n++;
    return n;
  }, [pts, year]);
  const past = events.filter(e => e.y <= year);
  const ev = past[past.length - 1];

  return (
    <div className="gm">
      <div className="gm-map">
        <canvas ref={cv} className="gm-cv" style={{ aspectRatio: `${w} / ${h}` }} role="img" aria-label={`Residential buildings standing by ${year}`} />
        <div className="gm-year"><b>{year === START ? "By 1906" : year}</b>{built != null ? <span>{built.toLocaleString("en-US")} buildings</span> : <span>Loading…</span>}</div>
      </div>
      <div className="gm-side">
        <div className="gm-ctl">
          <button type="button" className="lp-btn lp-btn-navy gm-play" onClick={() => { if (year >= END) setYear(START); setPlaying(p => !p); }}>{playing ? "❚❚ Pause" : "▶ Play"}</button>
          <div className="mr-tabs" role="tablist" aria-label="Colour by">
            {[["era", "By era built"], ["type", "By type"]].map(([k, l]) => <button key={k} type="button" role="tab" aria-selected={mode === k} className={mode === k ? "on" : ""} onClick={() => setMode(k)}>{l}</button>)}
          </div>
        </div>
        <input className="gm-slider" type="range" min={START} max={END} value={year} onChange={e => { setPlaying(false); setYear(+e.target.value); }} aria-label="Year" />
        <div className="gm-ticks">{[1906, 1930, 1950, 1980, 2025].map(t => <span key={t} style={{ left: `${((t - START) / (END - START)) * 100}%` }}>{t}</span>)}</div>
        <p className="gm-key">{(mode === "era" ? ERAS : TYPES).map(x => <span key={x.label}><i style={{ background: x.color }} />{x.label}</span>)}</p>
        <ol className="gm-events">
          {events.map(e => (
            <li key={e.y + e.h} className={e === ev ? "is-now" : e.y <= year ? "is-past" : ""}>
              <button type="button" onClick={() => { setPlaying(false); setYear(Math.max(START, Math.min(END, e.at ?? e.y))); }}><b>{e.label ?? e.y}</b><span>{e.h}</span></button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
