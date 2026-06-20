'use client';

// Teleprompter view for a single neighborhood's walking-tour script.
// Big CAPS script you can read on a phone in the field, an optional
// auto-scroll, the B-roll shot list per section, and the production schedule.

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import FieldMap from "./FieldMap";

const WPM = 145; // assumed speaking pace for the runtime estimate

export default function FieldScript({ name, data, geo }) {
  const [scroll, setScroll] = useState(false);
  const [speed, setSpeed] = useState(45); // px/sec
  const [big, setBig] = useState(true);
  const posRef = useRef(0);
  const rafRef = useRef(null);

  // Auto-scroll the window at `speed` px/sec while enabled.
  useEffect(() => {
    if (!scroll) return;
    posRef.current = window.scrollY;
    let last = null;
    const step = t => {
      if (last != null) posRef.current += (speed * (t - last)) / 1000;
      last = t;
      window.scrollTo(0, posRef.current);
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [scroll, speed]);

  if (!name) {
    return (
      <Shell>
        <p style={P}>That neighborhood name isn&apos;t recognized. <Link href="/field" style={A}>Back to the index →</Link></p>
      </Shell>
    );
  }

  if (!data) {
    return (
      <Shell>
        <h1 style={H1}>{name}</h1>
        <p style={{ ...P, color: "#a8a29e" }}>Script not written yet — this one&apos;s in the queue.</p>
        <p style={P}><Link href="/field" style={A}>← Back to the index</Link></p>
      </Shell>
    );
  }

  const totalWords = data.sections.reduce((n, s) => n + (s.words || 0), 0);
  const estMin = Math.round(totalWords / WPM);
  const scriptSize = big ? 26 : 18;

  return (
    <Shell>
      {/* Sticky control bar */}
      <div style={BAR}>
        <Link href="/field" style={{ ...A, fontSize: 13 }}>← Index</Link>
        <button style={BTN(scroll)} onClick={() => setScroll(s => !s)}>
          {scroll ? "⏸ Pause" : "▶ Auto-scroll"}
        </button>
        <button style={BTN(false)} onClick={() => setSpeed(s => Math.max(15, s - 10))} aria-label="Slower">– speed</button>
        <button style={BTN(false)} onClick={() => setSpeed(s => Math.min(120, s + 10))} aria-label="Faster">+ speed</button>
        <button style={BTN(big)} onClick={() => setBig(b => !b)}>{big ? "A− text" : "A+ text"}</button>
      </div>

      <h1 style={H1}>{name}</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", marginBottom: 6 }}>
        {data.aka && <span style={CHIP}>{data.aka}</span>}
        <span style={CHIP}>{data.runtime}</span>
        <span style={CHIP}>{totalWords} words · ~{estMin} min</span>
      </div>
      {data.marketLink && (
        <a href={data.marketLink} target="_blank" rel="noopener noreferrer" style={{ ...A, fontSize: 14 }}>
          ↗ Open the live market update for this neighborhood
        </a>
      )}

      {geo && <GeoStrip geo={geo} />}

      {data.route && <FieldMap name={name} route={data.route} />}

      {/* Script sections */}
      {data.sections.map((s, i) => (
        <section key={i} style={{ marginTop: 26 }}>
          <div style={SECLBL}>
            <span>{s.label}</span>
            {s.words ? <span style={{ color: "#a8a29e", fontWeight: 400 }}>~{s.words} words</span> : null}
          </div>
          <p style={{ whiteSpace: "pre-wrap", fontSize: scriptSize, lineHeight: 1.5, color: "#111", margin: "8px 0 0", fontWeight: 600, letterSpacing: "0.01em" }}>
            {s.script}
          </p>
          {s.broll?.length > 0 && (
            <details style={DETAILS}>
              <summary style={SUMMARY}>🎥 B-roll ({s.broll.length})</summary>
              <ul style={{ margin: "8px 0 0", paddingLeft: 20 }}>
                {s.broll.map((b, j) => <li key={j} style={{ fontSize: 14, lineHeight: 1.5, color: "#44403c" }}>{b}</li>)}
              </ul>
            </details>
          )}
        </section>
      ))}

      {/* Production schedule */}
      {data.schedule?.length > 0 && (
        <section style={{ marginTop: 34 }}>
          <div style={SECLBL}><span>🎬 PRODUCTION SCHEDULE</span></div>
          <div style={{ marginTop: 10 }}>
            {data.schedule.map((row, i) => (
              <div key={i} style={{ display: "flex", gap: 12, padding: "10px 0", borderTop: i ? "1px solid #ece8df" : "none" }}>
                <div style={{ minWidth: 150, fontWeight: 700, fontSize: 14, color: "#1c1917" }}>{row.step}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, color: "#44403c", lineHeight: 1.45 }}>{row.detail}</div>
                  <div style={{ fontSize: 12, color: "#a8a29e", marginTop: 2 }}>{row.time}</div>
                </div>
              </div>
            ))}
          </div>
          {data.batchTip && (
            <p style={{ fontSize: 13, fontStyle: "italic", color: "#78716c", marginTop: 12 }}>Tip: {data.batchTip}</p>
          )}
        </section>
      )}

      <p style={{ ...P, marginTop: 28 }}><Link href="/field" style={A}>← Back to the index</Link></p>
    </Shell>
  );
}

// Quick field-reference facts computed from the DEM + hazard data (timeless).
function GeoStrip({ geo }) {
  const slopeLabel = { flat: "Flat / walkable", rolling: "Rolling", steep: "Steep — hilly" }[geo.slope] || geo.slope;
  const facts = [
    ["Elevation", `${geo.elevLow}–${geo.elevHigh} ft`],
    ["Terrain", slopeLabel],
    geo.summit ? ["Summit", `${geo.summit.ft} ft`] : null,
    ["Seismic zone", geo.seismic ? "Yes — in a state seismic hazard zone" : "No"],
    ["Tsunami zone", geo.tsunami ? "Yes" : "No"],
    geo.ferryMi != null ? ["Ferry Building", `~${geo.ferryMi} mi`] : null,
  ].filter(Boolean);
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12, padding: "10px 12px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10 }}>
      {facts.map(([k, v]) => (
        <span key={k} style={{ fontSize: 12, padding: "4px 9px", borderRadius: 7, background: "#fff", border: "1px solid #e2e8f0", color: "#334155" }}>
          <strong style={{ color: "#0f172a" }}>{k}:</strong> {v}
        </span>
      ))}
    </div>
  );
}

function Shell({ children }) {
  return (
    <main style={{ maxWidth: 760, minHeight: "100vh", margin: "0 auto", padding: "20px 18px 140px", background: "#fff", color: "#1c1917", fontFamily: "system-ui, -apple-system, sans-serif", boxShadow: "0 0 40px rgba(0,0,0,0.25)" }}>
      {children}
    </main>
  );
}

const H1 = { fontSize: 30, fontWeight: 800, color: "#1c1917", margin: "10px 0 8px", letterSpacing: "-0.5px" };
const P = { fontSize: 15, lineHeight: 1.6, color: "#1c1917" };
const A = { color: "#2563eb", textDecoration: "none", fontWeight: 600 };
const CHIP = { fontSize: 12, padding: "3px 9px", borderRadius: 8, background: "#f1ede5", color: "#78716c" };
const SECLBL = { display: "flex", justifyContent: "space-between", alignItems: "baseline", fontSize: 13, fontWeight: 700, color: "#854F0B", background: "#FAEEDA", padding: "7px 11px", borderRadius: 8 };
const DETAILS = { marginTop: 8 };
const SUMMARY = { cursor: "pointer", fontSize: 13, color: "#2563eb", fontWeight: 600 };
const BAR = { position: "sticky", top: 0, zIndex: 10, display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center", padding: "8px 0", background: "rgba(255,255,255,0.95)", backdropFilter: "blur(4px)", borderBottom: "1px solid #ece8df", marginBottom: 8 };
function BTN(active) {
  return { fontSize: 13, fontWeight: 600, padding: "5px 10px", borderRadius: 8, cursor: "pointer", border: "1px solid " + (active ? "#2563eb" : "#ddd8d0"), background: active ? "#2563eb" : "#fff", color: active ? "#fff" : "#44403c" };
}
