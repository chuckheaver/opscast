// Renders the home page's hero map: San Francisco's four summer-fog zones,
// numbered 1 (sunniest) to 4 (foggiest), with every neighborhood outlined and
// named inside its own shape — no prices, no sale dots, no pointer lines. A
// name that won't fit is set smaller, then shortened ("Cole Vly", "Nrth Wtr").
//
// The SVG carries two label sets and picks one by its own drawn width (it
// ships as an <img>): every neighborhood at desktop size (~600px), and the
// larger ones, bigger, on a phone (~360px). Labels are measured in the real
// font (headless Chromium) and placed in code, so none overlap. Lato Bold is
// embedded, so it renders the same everywhere.
//
// It depends only on the neighborhood and fog-contour shapes, not on the
// sales, so it needs a rebuild only when those change:
//   node scripts/build-fog-hero.mjs        → public/brand/sf-fog-hero.svg

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const REPO = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(REPO, "public/brand/sf-fog-hero.svg");
const rd = p => JSON.parse(readFileSync(join(REPO, p), "utf8"));

// Playwright as the report's pdf.mjs finds it: the project's, else a global one.
let chromium;
try { ({ chromium } = await import("playwright")); }
catch { ({ chromium } = await import(join(execSync("npm root -g").toString().trim(), "playwright", "index.mjs"))); }
const EXE = ["/opt/pw-browsers/chromium", "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"]
  .find(p => { try { readFileSync(p); return true; } catch { return false; } });
const launch = () => chromium.launch(EXE ? { executablePath: EXE } : {});

const shapes = rd("public/data/map-shapes.json");
const contours = rd("public/data/sf-fog-contours.geojson");
const hoodsFC = rd("public/data/sf-fog-neighborhoods.geojson");
const FONT_B64 = readFileSync(join(REPO, "public/fonts/Lato-Bold.woff2")).toString("base64");


// ── canvas & projection ──────────────────────────────────────────────────
const [W0, S0, E0, N0] = [-122.517, 37.705, -122.353, 37.833];
const W = 1000, H = 780;
const lat0 = ((S0 + N0) / 2) * Math.PI / 180;
const sx = (E0 - W0) * Math.cos(lat0), sy = N0 - S0;
const sc = Math.min(W / sx, H / sy);
const ox = (W - sx * sc) / 2, oy = (H - sy * sc) / 2;
const X = lng => ox + (lng - W0) * Math.cos(lat0) * sc;
const Y = lat => oy + (N0 - lat) * sc;

// Dark-ground palette of today's hero, used opaque so the labels sit on a
// steady ground (the hero's 0.78–0.90 opacities blended over the navy).
const NAVY = [0x1A, 0x2C, 0x45];
const mix = (hex, base, t) => {
  const c = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));
  return "#" + c.map((v, i) => Math.round(v * t + base[i] * (1 - t)).toString(16).padStart(2, "0")).join("");
};
const ZONES = [
  { k: "1", name: "Sun", hex: "#E8B84B", op: 0.94 },
  { k: "2", name: "Transition", hex: "#C9A882", op: 0.90 },
  { k: "3", name: "Fog", hex: "#A8BCCD", op: 0.90 },
  { k: "4", name: "Persistent Fog", hex: "#8DA2B5", op: 0.86 },
];
for (const z of ZONES) {
  z.fill = mix(z.hex, NAVY, z.op);
  z.halo = mix(z.fill, [255, 255, 255], 0.62);   // the zone colour, lifted
}
const zoneOfHours = h => (h <= 8 ? ZONES[0] : h < 9 ? ZONES[1] : h <= 11 ? ZONES[2] : ZONES[3]);
const INK_SFH = "#131A25";      // deep navy
const INK_CTO = "#5E4A33";      // muted brown-grey
const OUTLINE = "#FFFFFF";

// ── geometry helpers ──────────────────────────────────────────────────────
const polys = g => (g.type === "Polygon" ? [g.coordinates] : g.coordinates);
const proj = r => r.map(([x, y]) => [X(x), Y(y)]);
const ringArea = r => { let a = 0; for (let i = 0, j = r.length - 1; i < r.length; j = i++) a += r[j][0] * r[i][1] - r[i][0] * r[j][1]; return Math.abs(a) / 2; };

function dp(pts, tol) {               // Douglas–Peucker on a closed ring
  if (pts.length < 5) return pts;
  const keep = new Uint8Array(pts.length); keep[0] = keep[pts.length - 1] = 1;
  const st = [[0, pts.length - 1]];
  while (st.length) {
    const [a, b] = st.pop(); let md = 0, mi = -1;
    const [x0, y0] = pts[a], [x1, y1] = pts[b]; const dx = x1 - x0, dy = y1 - y0; const L = dx * dx + dy * dy;
    for (let i = a + 1; i < b; i++) {
      const [x, y] = pts[i];
      const t = L ? Math.max(0, Math.min(1, ((x - x0) * dx + (y - y0) * dy) / L)) : 0;
      const d = Math.hypot(x - x0 - t * dx, y - y0 - t * dy);
      if (d > md) { md = d; mi = i; }
    }
    if (md > tol && mi > 0) { keep[mi] = 1; st.push([a, mi], [mi, b]); }
  }
  return pts.filter((_, i) => keep[i]);
}
const pathD = (rings, tol = 0.45) => rings.map(r => {
  const s = dp(r, tol); if (s.length < 3) return "";
  let px = Math.round(s[0][0] * 10), py = Math.round(s[0][1] * 10);
  let d = `M${px / 10} ${py / 10}l`, n = 0;
  for (let i = 1; i < s.length; i++) {
    const qx = Math.round(s[i][0] * 10), qy = Math.round(s[i][1] * 10);
    if (qx === px && qy === py) continue;
    const dx = (qx - px) / 10, dy = (qy - py) / 10;
    d += (n && dx >= 0 ? " " : "") + dx + (dy >= 0 ? " " : "") + dy; px = qx; py = qy; n++;
  }
  return n >= 2 ? d + "z" : "";
}).join("");

function inside(x, y, rings) {
  let c = false;
  for (const r of rings) for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
    const [xi, yi] = r[i], [xj, yj] = r[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
}
function edgeDist(x, y, rings) {
  let d = Infinity;
  for (const r of rings) for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
    const [x0, y0] = r[j], [x1, y1] = r[i]; const dx = x1 - x0, dy = y1 - y0; const L = dx * dx + dy * dy;
    const t = L ? Math.max(0, Math.min(1, ((x - x0) * dx + (y - y0) * dy) / L)) : 0;
    d = Math.min(d, Math.hypot(x - x0 - t * dx, y - y0 - t * dy));
  }
  return d;
}
const sdist = (x, y, rings) => (inside(x, y, rings) ? 1 : -1) * edgeDist(x, y, rings);

// Pole of inaccessibility (polylabel, grid refinement) and a list of other
// deep points to fall back on when the pole's spot is taken.
function deepPoints(rings) {
  const xs = rings[0].map(p => p[0]), ys = rings[0].map(p => p[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const step = Math.max(2, Math.min(x1 - x0, y1 - y0) / 18);
  const cand = [];
  for (let x = x0 + step / 2; x < x1; x += step) for (let y = y0 + step / 2; y < y1; y += step) {
    const d = sdist(x, y, rings); if (d > 0) cand.push({ x, y, d });
  }
  cand.sort((a, b) => b.d - a.d);
  // refine the best few
  for (const c of cand.slice(0, 6)) {
    let s = step / 2;
    for (let it = 0; it < 8; it++, s /= 2) {
      let best = c;
      for (const [dx, dy] of [[s, 0], [-s, 0], [0, s], [0, -s], [s, s], [-s, -s], [s, -s], [-s, s]]) {
        const d = sdist(c.x + dx, c.y + dy, rings); if (d > best.d) best = { x: c.x + dx, y: c.y + dy, d };
      }
      Object.assign(c, best);
    }
  }
  cand.sort((a, b) => b.d - a.d);
  return cand;
}

// ── contours: shade lookup ────────────────────────────────────────────────
const conP = contours.features.map(f => ({
  hours: f.properties.hours,
  polys: polys(f.geometry).map(rs => rs.map(proj)),
})).map(c => ({ ...c, area: c.polys.reduce((s, rs) => s + ringArea(rs[0]), 0) }));
conP.sort((a, b) => b.area - a.area);
function shadeAt(x, y) {
  let best = null, ba = Infinity;
  for (const c of conP) for (const rs of c.polys) { const a = ringArea(rs[0]); if (a < ba && inside(x, y, rs)) { best = c; ba = a; } }
  return best ? zoneOfHours(best.hours) : ZONES[0];
}

// ── neighborhoods ─────────────────────────────────────────────────────────
const PARK_NAMES = ["Golden Gate Park", "Presidio National Park", "McLaren Park", "Lincoln Park / Ft. Miley"];
const hoods = hoodsFC.features.map(f => {
  const name = f.properties.name;
  const ps = polys(f.geometry).map(rs => rs.map(proj));
  const main = ps.reduce((a, b) => (ringArea(b[0]) > ringArea(a[0]) ? b : a));
  // names only (owner): no prices; every neighborhood can carry its name
  return { name, ps, main, area: ringArea(main[0]), sfh: null, cto: null, n: PARK_NAMES.includes(name) ? 0 : 1 };
});

// ── text measurement in the real font (headless Chromium) ─────────────────
const NAME_LS = 0.07;                  // letter-spacing of the small-caps names, em
const NUM_RATIO = 1.22;                // number line size / name size
const CTO_RATIO = 0.86;                // condo figure / SFH figure
const GAP_EM = 0.36;                   // space between the two figures, em of SFH size
const nameLines = nm => {
  const up = nm.toUpperCase();
  const v = [[up]];
  if (up.includes(" / ")) v.push(up.split(" / ").map((s, i, a) => (i < a.length - 1 ? s + " /" : s)));
  else {
    const w = up.split(" ");
    if (w.length >= 2) {
      let best = null;
      for (let i = 1; i < w.length; i++) {
        const a = w.slice(0, i).join(" "), b = w.slice(i).join(" ");
        const sc = Math.max(a.length, b.length);
        if (!best || sc < best.sc) best = { sc, l: [a, b] };
      }
      v.push(best.l);
      if (w.length >= 3) for (let i = 1; i < w.length - 1; i++) for (let j = i + 1; j < w.length; j++)
        v.push([w.slice(0, i).join(" "), w.slice(i, j).join(" "), w.slice(j).join(" ")]);
    }
  }
  return v;
};
// Shorter forms for a name that won't fit inside its neighborhood (the owner:
// no names outside a shape, no pointer lines — abbreviate or go smaller).
const ABBR = [["Heights", "Hts"], ["Terraces", "Ter"], ["Terrace", "Ter"], ["Park", "Pk"], ["Valley", "Vly"],
  ["Street", "St"], ["Square", "Sq"], ["Mountain", "Mtn"], ["Manor", "Mnr"], ["Highlands", "Hlnds"], ["Point", "Pt"],
  ["Island", "Is"], ["Wharf", "Whf"], ["District", "Dist"], ["Center", "Ctr"],
  ["Lower", "Lwr"], ["Upper", "Upr"], ["Triangle", "Tri"], ["Addition", "Add"], ["Gardens", "Gdns"]];
const abbr1 = nm => ABBR.reduce((t, [a, b]) => t.replace(new RegExp(`\\b${a}\\b`, "g"), b), nm).replace(/\bSRA\b/, "").replace(/\s+/g, " ").trim();
const abbr2 = nm => abbr1(nm.split(" / ")[0]);       // first half of a two-part name
// Hand-made short forms where the rules give something unclear.
const SHORT = {
  "Northern Waterfront": ["Nrth Wtr"], "North Beach": ["N. Beach"], "Little Hollywood": ["L. Hollywood"],
  "India Basin": ["India Bsn"], "Apparel City": ["Apparel Cty"], "University Mound": ["Univ. Mound"],
  "Telegraph Hill": ["Telegraph Hl", "Telegraph"], "Westwood Highlands": ["Westwood Hlnds", "Wstwd Hlnds"], "Monterey Heights": ["Monterey Hts", "Mntry Hts"],
  "Mt. Davidson Manor": ["Mt. Davidson Mnr", "Mt. Davidson"], "Candlestick Point SRA": ["Candlestick Pt"],
  "South of Market": ["SoMa"], "Polk Gulch": ["Polk Gulch", "Polk"], "St. Marys Park": ["St. Marys Pk"],
  "Downtown / Union Square": ["Union Sq"], "Cathedral Hill": ["Cathedral Hl", "Cathedral"],
};
// last resort: drop the trailing word ("Rincon Hill" → "Rincon") — never to a
// word that can't stand on its own.
const LONE = /^(Little|North|Northern|South|N\.|S\.|Lower|Upper|Lwr|Upr|Inner|Outer|Buena|India|Apparel|University|Univ\.|St\.|Mt\.|Central|Mission|West|East|Westwood|Golden|Forest|Corona|Diamond|Laguna|Ingleside|Merced)$/;
const abbr3 = nm => { const w = abbr2(nm).split(" "); const r = w.length > 1 ? w.slice(0, -1).join(" ") : w[0]; return LONE.test(r) ? abbr2(nm) : r; };
const forms = nm => [...new Set([nm, abbr1(nm), abbr2(nm), ...(SHORT[nm] || []), abbr3(nm)])];
const strings = new Set();
for (const h of hoods) {
  for (const f of forms(h.name)) for (const v of nameLines(f)) v.forEach(s => strings.add(s));
}
const browser = await launch();
const page = await browser.newPage();
await page.setContent(`<style>@font-face{font-family:LatoM;font-weight:700;src:url(data:font/woff2;base64,${FONT_B64}) format("woff2")}</style><span style="font:700 20px LatoM">x</span>`);
await page.evaluate(() => document.fonts.ready);
const widths = await page.evaluate(list => {
  const c = document.createElement("canvas").getContext("2d"); c.font = "700 100px LatoM";
  return Object.fromEntries(list.map(s => [s, c.measureText(s).width / 100]));
}, [...strings]);
await browser.close();
const wName = (s, fs) => (widths[s] + NAME_LS * (s.length - 1)) * fs;
const wNum = (s, fs) => widths[s] * fs;

// ── label layout ──────────────────────────────────────────────────────────
// Block (centred on cx, cy): name line(s) in small caps, then the figures.
// Vertical metrics in em of each line's size (Lato caps ≈ 0.72em).
const CAP = 0.72;
function block(h, lines, fn) {
  const fv = fn * NUM_RATIO, fc = fv * CTO_RATIO;
  const a = null, b = null;                     // names only: no figures
  const wa = a ? wNum(a, fv) : 0, wb = b ? wNum(b, fc) : 0, gap = a && b ? GAP_EM * fv : 0;
  const numW = wa + gap + wb;
  const nameW = Math.max(...lines.map(s => wName(s, fn)));
  const lineGap = fn * 0.30, nameStep = fn * 1.02;
  const nums = !!(a || b);
  const hgt = CAP * fn + (lines.length - 1) * nameStep + (nums ? lineGap + CAP * fv : 0);
  const halo = fn * 0.18;
  return { lines, fn, fv, fc, a, b, nums, wa, wb, gap, numW, nameW, w: Math.max(numW, nameW) + 2 * halo, h: hgt + 2 * halo, halo };
}
const hit = (p, q, pad = 0) => p.x0 - pad < q.x1 && q.x0 - pad < p.x1 && p.y0 - pad < q.y1 && q.y0 - pad < p.y1;
// A label may run a little past its outline (the halo hides the line under
// it) but most of the box must sit inside the neighborhood, and no point of
// it may stray more than `tol` units outside.
function fits(rings, bx, tol, wet = 2) {
  const nx = 8, ny = 4; let ins = 0, n = 0;
  for (let i = 0; i <= nx; i++) for (let j = 0; j <= ny; j++) {
    const x = bx.x0 + (bx.x1 - bx.x0) * i / nx, y = bx.y0 + (bx.y1 - bx.y0) * j / ny;
    const d = sdist(x, y, rings); n++;
    if (d >= 0) ins++; else if (d < -tol) return -1;
    // never out over the water
    if (!LAND.some(rs => inside(x, y, rs)) && edgeDist(x, y, LAND_RINGS) > wet) return -1;
  }
  return ins / n;
}

// Greedy, largest neighborhood first, in passes from strict (label sits
// almost wholly in its shape) to loose, so clean placements claim room first.
// Within a size, the candidate spot that keeps most of the box inside wins.
function layout(cfg) {
  const placed = [];
  const order = hoods.filter(h => h.n > 0 || cfg.parks.includes(h.name)).map(h => ({ h, deep: deepPoints(h.main) }))
    .filter(o => o.deep.length && o.deep[0].d >= (o.h.n ? cfg.rMin : 0))
    .sort((a, b) => cfg.smallFirst ? a.h.area - b.h.area : cfg.byArea ? b.h.area - a.h.area : b.deep[0].d - a.deep[0].d);
  // names a previous run couldn't place go first (bestOf)
  if (cfg.first?.length) order.sort((a, b) => (cfg.first.includes(b.h.name) ? 1 : 0) - (cfg.first.includes(a.h.name) ? 1 : 0));
  // Sizes and name forms to try, best first: the full name down to fullMin,
  // then the shorter forms, then the full name smaller; on the last pass,
  // every form down to last.fnMin.
  const triesFor = (h, last) => {
    const t = [];
    const [nm1, ...short] = forms(h.name);
    for (let fn = cfg.fnMax; fn >= (cfg.fullMin ?? cfg.fnMin) - 1e-9; fn -= 0.5) t.push([fn, nameLines(nm1)]);
    for (const nm of short) for (let fn = Math.min(cfg.fnMax, (cfg.fullMin ?? cfg.fnMin) + 1); fn >= cfg.fnMin - 1e-9; fn -= 0.5) t.push([fn, nameLines(nm)]);
    for (let fn = (cfg.fullMin ?? cfg.fnMin) - 0.5; fn >= cfg.fnMin - 1e-9; fn -= 0.5) t.push([fn, nameLines(nm1)]);
    if (last && cfg.last) for (const nm of forms(h.name)) for (let fn = cfg.fnMin; fn >= cfg.last.fnMin - 1e-9; fn -= 0.25) t.push([fn, nameLines(nm)]);
    return t;
  };
  // The best spot inside the neighborhood's own shape, clear of `others`.
  const spot = (h, deep, others, fin, tol, tries, pad = cfg.pad) => {
    for (const [fn, variants] of tries) {
      let best = null;
      for (const lines of variants) {
        const B = block(h, lines, fn);
        for (const c of deep.slice(0, 30)) {
          if (c.d < B.h * 0.40) break;
          const bx = { x0: c.x - B.w / 2, x1: c.x + B.w / 2, y0: c.y - B.h / 2, y1: c.y + B.h / 2 };
          if (bx.x0 < 4 || bx.x1 > W - 4 || bx.y0 < 4 || bx.y1 > H - 4) continue;
          if (cfg.reserved.some(r => hit(bx, r, 2))) continue;
          if (others.some(p => hit(bx, p.bx, pad))) continue;
          const f = fits(h.main, bx, tol, cfg.wet);
          if (f < fin) continue;
          const score = f + c.d / 400 - (lines.length - 1) * 0.04;
          if (!best || score > best.score) best = { h, B, bx, cx: c.x, cy: c.y, score };
        }
      }
      if (best) return best;
    }
    return null;
  };
  const passes = [...cfg.passes.map(f => [...f, false, false]), [...cfg.passes[cfg.passes.length - 1], true, false]];
  if (cfg.last) passes.push([cfg.last.fin, cfg.last.tol, false, true]);
  for (const [fin, tol, parks, last] of passes) {
    for (const { h, deep } of order) {
      if (!h.n !== parks) continue;
      if (placed.some(p => p.h === h)) continue;
      const done = spot(h, deep, placed, fin, tol, triesFor(h, last));
      if (done) placed.push(done);
    }
  }
  // Repair: a name still without a spot takes its best one inside its own
  // shape, and each neighbor label it bumps is re-placed inside that
  // neighbor's shape; if any can't be, nothing changes.
  if (cfg.last) for (const { h, deep } of order) {
    if (placed.some(p => p.h === h)) continue;
    // each size/form in turn, until one can be made room for
    for (const t of triesFor(h, true)) {
      const cand = spot(h, deep, [], cfg.last.fin, cfg.last.tol, [t]);
      if (!cand) continue;
      const tight = cfg.last.pad ?? cfg.pad;
      const bumped = placed.filter(p => hit(cand.bx, p.bx, tight));
      const trial = [...placed.filter(p => !bumped.includes(p)), cand];
      let ok = true;
      for (const b of bumped) {
        const o = order.find(x => x.h === b.h); let re = null;
        for (const [fin, tol, , last] of passes) { re = spot(b.h, o.deep, trial, fin, tol, triesFor(b.h, last), last ? tight : cfg.pad); if (re) break; }
        if (!re) { ok = false; break; }
        trial.push(re);
      }
      if (ok) { placed.length = 0; placed.push(...trial); break; }
    }
  }
  for (const L of placed) L.zone = shadeAt(L.cx, L.cy);
  // final guarantee: no two boxes overlap, nothing under a reserved box
  for (let i = 0; i < placed.length; i++) {
    for (let j = i + 1; j < placed.length; j++)
      if (hit(placed[i].bx, placed[j].bx)) throw new Error(`overlap ${placed[i].h.name} / ${placed[j].h.name}`);
    for (const r of cfg.reserved) if (hit(placed[i].bx, r)) throw new Error(`reserved hit ${placed[i].h.name}`);
  }
  return placed;
}

const f1 = v => +v.toFixed(1);
function labelSVG(L) {
  const { B, cx, cy, zone } = L;
  const top = cy - B.h / 2 + B.halo;
  const out = [];
  const sw = (fs) => `stroke="${zone.halo}" stroke-width="${f1(fs * 0.30)}"`;
  let y = top + CAP * B.fn;
  B.lines.forEach((s, i) => {
    if (i) y += B.fn * 1.02;
    // letter-spacing adds after the last letter too; nudge right by half of it
    out.push(`<text class="nm" x="${f1(cx + NAME_LS * B.fn / 2)}" y="${f1(y)}" font-size="${f1(B.fn)}" ${sw(B.fn)}>${esc(s)}</text>`);
  });
  if (!B.nums) return PARK_NAMES.includes(L.h.name) ? out.join("").replace(/class="nm"/g, 'class="nm pk"') : out.join("");
  y += B.fn * 0.30 + CAP * B.fv;
  const x0 = cx - B.numW / 2;
  const parts = [];
  if (B.a) parts.push(`<tspan fill="${INK_SFH}">${B.a}</tspan>`);
  if (B.b) parts.push(`<tspan${B.a ? ` dx="${f1(B.gap)}"` : ""} fill="${INK_CTO}" font-size="${f1(B.fc)}">${B.b}</tspan>`);
  out.push(`<text class="nb" x="${f1(x0)}" y="${f1(y)}" font-size="${f1(B.fv)}" ${sw(B.fv)}>${parts.join("")}</text>`);
  return out.join("");
}
const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

// ── key & note (top-left water) and the site's pill (bottom centre) ───────
// Desktop pill: "Open the Summer Fog Map →" 12.5px bold, 8×17 padding, at
// bottom:5% — about 215×34 CSS px at a 620px-wide map; phone 11.5px, 7×13.
const pill = (cssW, pw, ph) => {
  const u = W / cssW; const w = pw * u, h = ph * u; const yb = H * 0.95;
  return { x0: W / 2 - w / 2 - 6, x1: W / 2 + w / 2 + 6, y0: yb - h - 6, y1: H };
};

function keySVG(s, cls, x0 = 22) {
  // s: font size of the key text in viewBox units; x0: where the row starts
  const sw = s * 1.55, gapIn = s * 0.45, gapOut = s * 1.0;
  let x = x0, y = 16;
  const o = [`<g class="${cls}">`];
  const row1 = [];
  for (const z of ZONES) {
    const tw = widthOf(z.name, s);
    row1.push(`<rect x="${f1(x)}" y="${f1(y)}" width="${f1(sw)}" height="${f1(sw)}" rx="${f1(s * 0.3)}" fill="${z.fill}"/>` +
      `<text x="${f1(x + sw / 2)}" y="${f1(y + sw / 2 + s * 0.36)}" font-size="${f1(s)}" text-anchor="middle" fill="${INK_SFH}">${z.k}</text>` +
      `<text x="${f1(x + sw + gapIn)}" y="${f1(y + sw / 2 + s * 0.36)}" font-size="${f1(s)}" fill="#E7EEF4">${z.name}</text>`);
    x += sw + gapIn + tw + gapOut;
  }
  const keyW = x - gapOut - x0;
  o.push(row1.join(""));
  o.push("</g>");
  const kb = { x0: x0 - 8, y0: 14, x1: x0 + keyW + 8, y1: y + sw + 8 };
  for (let i = 0; i <= 20; i++) for (let j = 0; j <= 6; j++) {
    const px = kb.x0 + (kb.x1 - kb.x0) * i / 20, py = kb.y0 + (kb.y1 - kb.y0) * j / 6;
    if (LAND.some(rs => inside(px, py, rs))) throw new Error(`key ${cls} sits on land at ${px.toFixed(0)},${py.toFixed(0)}`);
  }
  return { svg: o.join(""), box: kb };
}
// widths for key/note strings: rough Lato Bold metrics (no letter-spacing)
const LATO = { " ": 0.193, "/": 0.36, ":": 0.26, ".": 0.25, "-": 0.32, $: 0.58 };
function widthOf(t, fs) {
  let w = 0;
  for (const ch of t) w += LATO[ch] ?? (/[0-9]/.test(ch) ? 0.58 : /[A-Z]/.test(ch) ? (ch === "M" ? 0.86 : ch === "I" ? 0.3 : 0.66) : /[mw]/.test(ch) ? 0.84 : /[ijlft]/.test(ch) ? 0.31 : 0.54);
  return w * fs;
}

const LAND = polys(shapes.land).map(rs => rs.map(proj));
const LAND_RINGS = LAND.flat();
// Several orders of placement; keep the run that names the most
// neighborhoods, then the one with the largest type overall.
function bestOf(run, rounds = 5) {
  // Run the layout; any name left out moves to the front of the line and it
  // runs again, until every neighborhood has its name or the rounds run out.
  let first = [], best = null;
  for (let k = 0; k < rounds; k++) {
    const r = run(first);
    if (!best || r.length > best.length) best = r;
    const miss = hoods.filter(h => !r.some(L => L.h === h)).map(h => h.name);
    console.log(`  layout round ${k + 1}: ${r.length} of ${hoods.length} named${miss.length ? " — left: " + miss.join(", ") : ""}`);
    if (!miss.length) break;
    first = [...new Set([...first, ...miss])];
  }
  return best;
}
// On desktop the hero's headline reaches over the map's top-left corner
// (about 120 units across), so the key starts clear of it.
const keyD = keySVG(17, "d", 150);
const keyP = keySVG(26, "p");
const PARKS = PARK_NAMES;
// Every name inside its own neighborhood: most of the box in the shape and no
// point more than a few units past its edge (the halo covers the line there).
const D = bestOf(first => layout({ smallFirst: true, first, last: { fin: 0.5, tol: 12, fnMin: 4.5, pad: 1.2 }, fnMin: 5.5, fullMin: 7.5, fnMax: 15, byArea: true, wet: 3, rMin: 0, passes: [[0.86, 5], [0.74, 7], [0.64, 9], [0.56, 11]], pad: 3, parks: PARKS, reserved: [keyD.box] }));   // the map link sits below the map now
const P = layout({ fnMin: 15, fullMin: 17, fnMax: 24, wet: 9, rMin: 14, passes: [[0.8, 10], [0.68, 14], [0.58, 18]], pad: 5, parks: PARKS, reserved: [keyP.box] });

// ── assemble ──────────────────────────────────────────────────────────────
const landD = pathD(LAND.flat(), 0.5);
const o = [];
o.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="San Francisco's four summer-fog zones, sunniest to foggiest, with its neighborhoods">`);
o.push(`<style>@font-face{font-family:"LatoH";font-weight:700;src:url(data:font/woff2;base64,${FONT_B64}) format("woff2")}` +
  `text{font-family:"LatoH",Lato,"Helvetica Neue",Arial,sans-serif;font-weight:700}` +
  `.nm{fill:${INK_SFH};fill-opacity:.82;letter-spacing:${NAME_LS}em;text-anchor:middle;paint-order:stroke;stroke-linejoin:round;stroke-opacity:.92}` +
  `.pk{fill-opacity:.6;font-style:italic}.nb{paint-order:stroke;stroke-linejoin:round;stroke-opacity:.92}` +
  `.p{display:none}@media (max-width:460px){.d{display:none}.p{display:inline}}</style>`);
o.push(`<defs><clipPath id="land"><path d="${landD}" clip-rule="evenodd"/></clipPath></defs>`);
o.push(`<path d="${landD}" fill="${ZONES[0].fill}" fill-rule="evenodd"/>`);
o.push(`<g clip-path="url(#land)">`);
for (const c of conP) o.push(`<path d="${pathD(c.polys.flat(), 0.9)}" fill="${zoneOfHours(c.hours).fill}" fill-rule="evenodd"/>`);
o.push(`</g>`);
// neighborhood outlines: thin, light, constant width on every screen
o.push(`<g fill="none" stroke="${OUTLINE}" stroke-opacity=".78" stroke-width=".8" stroke-linejoin="round" vector-effect="non-scaling-stroke">` +
  hoods.map(h => `<path d="${pathD(h.ps.flat(), 0.6)}" vector-effect="non-scaling-stroke"/>`).join("") + `</g>`);
o.push(`<path d="${landD}" fill="none" stroke="#FFFFFF" stroke-opacity=".55" stroke-width="1.1" vector-effect="non-scaling-stroke" fill-rule="evenodd"/>`);
o.push(`<g class="d">${D.map(labelSVG).join("")}</g>`);
o.push(`<g class="p">${P.map(labelSVG).join("")}</g>`);
o.push(keyD.svg, keyP.svg);
o.push(`</svg>`);
const svg = o.join("\n") + "\n";
writeFileSync(OUT, svg);
for (const h of hoods) if (!D.some(L => L.h === h)) console.warn(`  ! no room for ${h.name} on the desktop map`);
console.log(`wrote public/brand/sf-fog-hero.svg — ${(svg.length / 1024).toFixed(0)} KB · ${D.length} of ${hoods.length} neighborhoods named (desktop) · ${P.length} (phone)`);
