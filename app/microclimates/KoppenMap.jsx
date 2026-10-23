"use client";

// The Köppen-Geiger climate map for California and the Bay Area, with the
// classification itself as a sunburst key (group → rainfall → heat). Hover a
// place on the map for its climate; hover or click a slice of the sunburst to
// light every place of that kind on the map; click a place on the map to hold
// its climate.
//
// Two real datasets, each at its own scale (scripts/build-koppen-map.py):
//   groups  — Beck et al. 2018, 1 km (the first letter: A tropical … E polar)
//   classes — the Köppen-Geiger 0.5° grid (all letters, about 55 km cells)
// The class layer shows a class only where the 0.5° cell and the 1 km group
// agree; elsewhere (mostly the Sierra, where a 55 km cell averages over the
// range) it shows the 1 km group, pale and striped, and says so in the key.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import KG from "../lib/koppen-ca.json";
import { CLASSES, BY_CODE, GROUPS, GROUP, TREE, LEAF_WORD, CITIES, VIEWS } from "./koppen-classes";

const F = KG.frame;
const WATER = [188, 211, 225], LAND = [243, 240, 233];
const rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const mixc = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
const GROUP_OF = [null, "A", "B", "C", "D", "E"];                     // raster value → group letter
const CLASS_IDX = Object.fromEntries(CLASSES.map((c, i) => [c.code, i]));
const NONE = 255;

// ---- the 0.5° grid, parsed once
const GRID = KG.grid.rows.map(r => r.split(",").map(c => (c in CLASS_IDX ? CLASS_IDX[c] : NONE)));

// ---- the sunburst's geometry
const CX = 210, CY = 210, R = [46, 90, 138, 200];
const polar = (r, deg) => [CX + r * Math.sin((deg * Math.PI) / 180), CY - r * Math.cos((deg * Math.PI) / 180)];
const arc = (r0, r1, a0, a1) => {
  const [x0, y0] = polar(r1, a0), [x1, y1] = polar(r1, a1), [x2, y2] = polar(r0, a1), [x3, y3] = polar(r0, a0);
  const big = a1 - a0 > 180 ? 1 : 0;
  return `M${x0},${y0} A${r1},${r1} 0 ${big} 1 ${x1},${y1} L${x2},${y2} A${r0},${r0} 0 ${big} 0 ${x3},${y3} Z`;
};
const STEP = 360 / CLASSES.length;
const SLICES = (() => {
  let a = 0;
  const out = { groups: [], mids: [], leaves: [] };
  for (const t of TREE) {
    const g0 = a;
    for (const m of t.mid) {
      const m0 = a;
      for (const c of m.leaves) { out.leaves.push({ c, a0: a, a1: a + STEP, g: t.g }); a += STEP; }
      if (m.label) out.mids.push({ label: m.label, a0: m0, a1: a, g: t.g, codes: m.leaves.map(l => l.code) });
    }
    out.groups.push({ g: t.g, a0: g0, a1: a, codes: t.mid.flatMap(m => m.leaves.map(l => l.code)) });
  }
  return out;
})();
const labelRot = deg => (deg > 180 ? deg + 90 : deg - 90);

function Sunburst({ present, active, onHover, onPick, center }) {
  const on = code => !active || active.codes.has(code);
  return (
    <svg viewBox="0 0 420 420" className="kg-sun" role="group" aria-label="The Köppen-Geiger classification: climate group, then rainfall pattern, then summer heat">
      {SLICES.groups.map(s => {
        const m = (s.a0 + s.a1) / 2, [x, y] = polar((R[0] + R[1]) / 2, m);
        const lit = !active || s.codes.some(c => active.codes.has(c));
        return (
          <g key={s.g} className="kg-seg" tabIndex={0} role="button" aria-label={`${GROUP[s.g].name} climates`} onMouseEnter={() => onHover({ id: `g${s.g}`, codes: new Set(s.codes), title: GROUP[s.g].name, sub: "climate group" })}
            onMouseLeave={() => onHover(null)} onFocus={() => onHover({ id: `g${s.g}`, codes: new Set(s.codes), title: GROUP[s.g].name, sub: "climate group" })} onBlur={() => onHover(null)}
            onClick={() => onPick({ id: `g${s.g}`, codes: new Set(s.codes), group: s.g, title: GROUP[s.g].name, sub: "climate group" })}
            onKeyDown={e => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onPick({ id: `g${s.g}`, codes: new Set(s.codes), group: s.g, title: GROUP[s.g].name, sub: "climate group" }))}>
            <path d={arc(R[0], R[1], s.a0, s.a1)} fill={GROUP[s.g].color} opacity={lit ? 1 : 0.28} stroke="#fff" strokeWidth="1.5" />
            <text x={x} y={y} transform={`rotate(${labelRot(m)} ${x} ${y})`} className="kg-t kg-t-g" textAnchor="middle" dominantBaseline="middle" opacity={lit ? 1 : 0.4}>{GROUP[s.g].name}</text>
          </g>
        );
      })}
      {SLICES.mids.map(s => {
        const m = (s.a0 + s.a1) / 2, [x, y] = polar((R[1] + R[2]) / 2, m);
        const pick = { id: `m${s.g}${s.label}`, codes: new Set(s.codes), group: s.g, title: `${GROUP[s.g].name} · ${s.label.toLowerCase()}`, sub: "rainfall pattern" };
        const lit = !active || s.codes.some(c => active.codes.has(c));
        return (
          <g key={s.g + s.label} className="kg-seg" tabIndex={0} role="button" aria-label={`${GROUP[s.g].name}, ${s.label}`} onMouseEnter={() => onHover(pick)} onMouseLeave={() => onHover(null)}
            onFocus={() => onHover(pick)} onBlur={() => onHover(null)} onClick={() => onPick(pick)} onKeyDown={e => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onPick(pick))}>
            <path d={arc(R[1], R[2], s.a0, s.a1)} fill="#EEF0F2" stroke="#fff" strokeWidth="1.5" opacity={lit ? 1 : 0.45} />
            <text x={x} y={y} transform={`rotate(${labelRot(m)} ${x} ${y})`} className="kg-t kg-t-m" textAnchor="middle" dominantBaseline="middle" opacity={lit ? 1 : 0.45}>{s.label}</text>
          </g>
        );
      })}
      {SLICES.leaves.map(s => {
        const m = (s.a0 + s.a1) / 2, [x, y] = polar((R[2] + R[3]) / 2, m), c = s.c;
        const pick = { id: c.code, codes: new Set([c.code]), group: c.group, title: `${c.code} · ${c.name}`, sub: [GROUP[c.group].name, c.rain, c.heat].filter(Boolean).join(" · "), cls: c.code };
        const lit = on(c.code), here = present.has(c.code);
        return (
          <g key={c.code} className="kg-seg" tabIndex={0} role="button" aria-label={`${c.code}, ${c.name}${here ? ", on this map" : ""}`} onMouseEnter={() => onHover(pick)} onMouseLeave={() => onHover(null)}
            onFocus={() => onHover(pick)} onBlur={() => onHover(null)} onClick={() => onPick(pick)} onKeyDown={e => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onPick(pick))}>
            <path d={arc(R[2], R[3], s.a0, s.a1)} fill={c.color} opacity={lit ? (here ? 1 : 0.42) : 0.18} stroke="#fff" strokeWidth="1.5" />
            <text x={x} y={y} transform={`rotate(${labelRot(m)} ${x} ${y})`} className="kg-t kg-t-c" textAnchor="middle" dominantBaseline="middle" opacity={lit ? 1 : 0.35}
              fill={["BWh", "Af", "Am", "Dsc", "Dwc", "Dwd", "Dfc", "Dfd", "Cwc", "Dsd", "EF", "Csc", "Cwb"].includes(c.code) ? "#fff" : "#131A25"}>{LEAF_WORD[c.code] || c.heat?.replace(" summer", "").replace("very cold winter", "v. cold") || c.code}</text>
          </g>
        );
      })}
      <g style={{ pointerEvents: "none" }} textAnchor="middle">
        {center ? (
          <>
            <text x={CX} y={CY - 4} className={center.code ? "kg-cc" : "kg-cc kg-cc-s"}>{center.code || center.title.split(" · ")[0]}</text>
            <text x={CX} y={CY + 14} className="kg-cs">{center.code ? "" : center.sub}</text>
          </>
        ) : (
          <>
            <text x={CX} y={CY - 2} className="kg-cs">Köppen-</text>
            <text x={CX} y={CY + 12} className="kg-cs">Geiger</text>
          </>
        )}
      </g>
    </svg>
  );
}

export default function KoppenMap() {
  const [view, setView] = useState("bay");
  const [layer, setLayer] = useState("class");
  const [raster, setRaster] = useState(null);                   // { groups, cls }
  const [sel, setSel] = useState(null);                         // held selection
  const [hov, setHov] = useState(null);                         // sunburst hover
  const [tip, setTip] = useState(null);                         // map hover
  const canvas = useRef(null), off = useRef(null), wrap = useRef(null), frame = useRef(0);
  const V = VIEWS[view];
  const aspect = (V.lat1 - V.lat0) / ((V.lon1 - V.lon0) * Math.cos(((V.lat0 + V.lat1) / 2) * Math.PI / 180));
  const CW = 1100, CH = Math.round(CW * aspect);

  // ---- load the 1 km groups raster; build the class index per pixel
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas"); c.width = F.w; c.height = F.h;
      const x = c.getContext("2d", { willReadFrequently: true }); x.drawImage(img, 0, 0);
      const d = x.getImageData(0, 0, F.w, F.h).data;
      const groups = new Uint8Array(F.w * F.h), cls = new Uint8Array(F.w * F.h).fill(NONE);
      const gi = new Int16Array(F.h), gj = new Int16Array(F.w);
      for (let r = 0; r < F.h; r++) gi[r] = Math.round((KG.grid.lat - (F.lat1 - (r + 0.5) * F.res)) / KG.grid.step);
      for (let k = 0; k < F.w; k++) gj[k] = Math.round(((F.lon0 + (k + 0.5) * F.res) - KG.grid.lon) / KG.grid.step);
      for (let r = 0; r < F.h; r++) for (let k = 0; k < F.w; k++) {
        const i = r * F.w + k, g = Math.round(d[i * 4] / 40);
        groups[i] = g;
        if (g) {
          const ci = GRID[gi[r]]?.[gj[k]];
          if (ci !== undefined && ci !== NONE && CLASSES[ci].group === GROUP_OF[g]) cls[i] = ci;
        }
      }
      setRaster({ groups, cls });
    };
    img.src = "/data/koppen-ca-groups.png";
  }, []);

  // ---- what is lit on the map: a hover on the key, else the held selection
  const active = hov || sel;
  const palette = useMemo(() => ({
    groups: [null, ...["A", "B", "C", "D", "E"].map(g => rgb(GROUP[g].color))],
    cls: CLASSES.map(c => rgb(c.color)),
  }), []);

  // ---- paint the full raster for this layer and selection, then the visible crop
  const paint = useCallback(() => {
    if (!raster || !canvas.current) return;
    if (!off.current) { off.current = document.createElement("canvas"); off.current.width = F.w; off.current.height = F.h; }
    const ox = off.current.getContext("2d");
    const im = ox.createImageData(F.w, F.h), px = im.data;
    const { groups, cls } = raster;
    const codes = active?.codes, grp = active?.group && active.id.startsWith("g") ? active.group : null;
    const litGroups = new Set(codes ? [...codes].map(code => code[0]) : []);
    for (let r = 0, i = 0; r < F.h; r++) for (let k = 0; k < F.w; k++, i++) {
      const g = groups[i];
      let col;
      if (!g) col = WATER;
      else {
        const c = cls[i];
        if (layer === "class" && c !== NONE) col = palette.cls[c];
        else {
          const base = palette.groups[g];
          col = layer === "class" ? mixc(base, [255, 255, 255], 0.5) : base;
          if (layer === "class" && ((r + k) % 7) < 2) col = mixc(col, [60, 60, 60], 0.2);   // striped: class not resolved at 0.5°
        }
        if (active) {
          const hit = layer === "class"
            ? (c !== NONE ? codes.has(CLASSES[c].code) : grp === GROUP_OF[g])
            : litGroups.has(GROUP_OF[g]);
          if (!hit) col = mixc(col, LAND, 0.82);
        }
      }
      const j = i * 4; px[j] = col[0]; px[j + 1] = col[1]; px[j + 2] = col[2]; px[j + 3] = 255;
    }
    ox.putImageData(im, 0, 0);
    const cx = canvas.current.getContext("2d");
    cx.imageSmoothingEnabled = true; cx.imageSmoothingQuality = "high";
    const sx = (V.lon0 - F.lon0) / F.res, sy = (F.lat1 - V.lat1) / F.res, sw = (V.lon1 - V.lon0) / F.res, sh = (V.lat1 - V.lat0) / F.res;
    cx.drawImage(off.current, sx, sy, sw, sh, 0, 0, CW, CH);
  }, [raster, layer, active, palette, V, CW, CH]);
  useEffect(() => { cancelAnimationFrame(frame.current); frame.current = requestAnimationFrame(paint); return () => cancelAnimationFrame(frame.current); }, [paint]);

  // ---- what is in this view, by group and by class
  const stats = useMemo(() => {
    if (!raster) return null;
    const r0 = Math.max(0, Math.floor((F.lat1 - V.lat1) / F.res)), r1 = Math.min(F.h, Math.ceil((F.lat1 - V.lat0) / F.res));
    const c0 = Math.max(0, Math.floor((V.lon0 - F.lon0) / F.res)), c1 = Math.min(F.w, Math.ceil((V.lon1 - F.lon0) / F.res));
    const g = [0, 0, 0, 0, 0, 0], k = new Map();
    let land = 0;
    for (let r = r0; r < r1; r++) for (let c = c0; c < c1; c++) {
      const i = r * F.w + c, v = raster.groups[i];
      if (!v) continue;
      g[v]++; land++;
      const q = raster.cls[i];
      if (q !== NONE) k.set(CLASSES[q].code, (k.get(CLASSES[q].code) || 0) + 1);
    }
    return { land, groups: g, classes: k };
  }, [raster, V]);
  const present = useMemo(() => new Set(stats ? [...stats.classes.entries()].filter(([, n]) => n > stats.land * 0.001).map(([c]) => c) : []), [stats]);

  // ---- hover on the map
  const at = e => {
    if (!raster || !canvas.current) return null;
    const rc = canvas.current.getBoundingClientRect();
    const fx = (e.clientX - rc.left) / rc.width, fy = (e.clientY - rc.top) / rc.height;
    if (fx < 0 || fx > 1 || fy < 0 || fy > 1) return null;
    const lon = V.lon0 + fx * (V.lon1 - V.lon0), lat = V.lat1 - fy * (V.lat1 - V.lat0);
    const c = Math.floor((lon - F.lon0) / F.res), r = Math.floor((F.lat1 - lat) / F.res);
    if (c < 0 || r < 0 || c >= F.w || r >= F.h) return null;
    const i = r * F.w + c, g = raster.groups[i];
    return { x: e.clientX - wrap.current.getBoundingClientRect().left, y: e.clientY - wrap.current.getBoundingClientRect().top, g: GROUP_OF[g], cls: raster.cls[i] === NONE ? null : CLASSES[raster.cls[i]], lat, lon };
  };
  const onMove = e => setTip(at(e));
  const onClickMap = e => {
    const t = at(e);
    if (!t || !t.g) return;
    if (layer === "class" && t.cls) {
      const c = t.cls, pick = { id: c.code, codes: new Set([c.code]), group: c.group, title: `${c.code} · ${c.name}`, sub: [GROUP[c.group].name, c.rain, c.heat].filter(Boolean).join(" · "), cls: c.code };
      setSel(s => (s?.id === pick.id ? null : pick));
    } else {
      const codes = new Set(CLASSES.filter(c => c.group === t.g).map(c => c.code));
      const pick = { id: `g${t.g}`, codes, group: t.g, title: GROUP[t.g].name, sub: "climate group" };
      setSel(s => (s?.id === pick.id ? null : pick));
    }
  };
  const onPick = p => setSel(s => (s?.id === p.id ? null : p));

  const shown = CITIES.filter(c => c.v.includes(view === "bay" ? "b" : "s") && c.lon > V.lon0 && c.lon < V.lon1 && c.lat > V.lat0 && c.lat < V.lat1);
  const pos = c => ({ left: `${(100 * (c.lon - V.lon0)) / (V.lon1 - V.lon0)}%`, top: `${(100 * (V.lat1 - c.lat)) / (V.lat1 - V.lat0)}%` });
  const center = active ? { code: active.cls || null, title: active.title, sub: active.sub } : null;
  const detail = active && active.cls ? BY_CODE[active.cls] : null;

  return (
    <figure className="mc-fig kg">
      <div className="kg-bar">
        <div className="kg-seg2" role="tablist" aria-label="Map layer">
          <button type="button" role="tab" aria-selected={layer === "class"} className={layer === "class" ? "on" : ""} onClick={() => setLayer("class")}>Full classification</button>
          <button type="button" role="tab" aria-selected={layer === "group"} className={layer === "group" ? "on" : ""} onClick={() => setLayer("group")}>Climate groups · 1 km</button>
        </div>
        <div className="kg-seg2" role="tablist" aria-label="Map area">
          {Object.entries(VIEWS).map(([k, v]) => (
            <button key={k} type="button" role="tab" aria-selected={view === k} className={view === k ? "on" : ""} onClick={() => setView(k)}>{v.label}</button>
          ))}
        </div>
      </div>

      <div className="kg-main">
        <div className="kg-map" ref={wrap}>
          <canvas ref={canvas} width={CW} height={CH} style={{ aspectRatio: `${CW} / ${CH}` }} onPointerMove={onMove} onPointerLeave={() => setTip(null)} onClick={onClickMap}
            role="img" aria-label={`Köppen-Geiger climate map of ${V.label}. San Francisco is Csb, warm-summer Mediterranean.`} />
          {!raster && <div className="kg-load">Loading the map…</div>}
          <div className="kg-places" aria-hidden="true">
            {shown.map(c => <span key={c.n} className={`kg-city${c.me ? " me" : ""}${c.left ? " l" : ""}`} style={pos(c)}><i />{c.n}</span>)}
          </div>
          {tip && tip.g && (
            <div className="kg-tip" style={{ left: Math.min(tip.x + 14, (wrap.current?.clientWidth || 600) - 210), top: tip.y + 14 }}>
              {layer === "class" && tip.cls ? (
                <>
                  <b><i style={{ background: tip.cls.color }} />{tip.cls.code}</b>
                  <span>{tip.cls.name}</span>
                  <small>{[GROUP[tip.cls.group].name, tip.cls.rain, tip.cls.heat].filter(Boolean).join(" · ")}</small>
                </>
              ) : (
                <>
                  <b><i style={{ background: GROUP[tip.g].color }} />{GROUP[tip.g].name}</b>
                  <small>{layer === "class" ? "Group only: the 0.5° grid doesn’t resolve a class here" : "Climate group, 1 km"}</small>
                </>
              )}
            </div>
          )}
        </div>

        <div className="kg-side">
          <Sunburst present={present} active={active} onHover={setHov} onPick={onPick} center={center} />
          <div className="kg-hint">{active ? <><b>{active.title}</b> <span>{active.sub}</span></> : "Hover or click a slice to light it on the map"}</div>
          {detail && <p className="kg-detail">{detail.group === "C" && detail.code === "Csb" ? "San Francisco is here. " : ""}{detail.name}.</p>}
          {sel && <button type="button" className="kg-clear" onClick={() => setSel(null)}>Clear selection</button>}
        </div>
      </div>

      {stats && (
        <div className="kg-share" aria-label="Share of the land in view, by climate group">
          {GROUPS.map((g, i) => stats.groups[i + 1] ? (
            <div key={g.k} className="kg-sh"><i style={{ background: g.color }} /><b>{g.name}</b><span>{Math.round((100 * stats.groups[i + 1]) / stats.land)}%</span></div>
          ) : null)}
        </div>
      )}
      <figcaption className="mc-cap">
        Climate groups: Beck et al. 2018, 1 km. Full classification: the Köppen-Geiger 0.5° grid (cells about 55 km across), shown only where its group matches the 1 km map; pale striped areas have a group but no
        class at this scale, mostly the Sierra. Classes in the key that are faded are not on this map. Percent of land in view, by group.
      </figcaption>
    </figure>
  );
}
