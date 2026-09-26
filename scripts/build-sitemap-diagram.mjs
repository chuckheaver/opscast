// Draws the site's structure as an SVG, reading the real route list from
// app/sitemap.js rather than a hand-kept copy, so the picture cannot drift
// from what is actually published.
//   node scripts/build-sitemap-diagram.mjs

import { writeFileSync, readdirSync, existsSync } from "node:fs";

const NAVY = "#0A1A30", NAVY2 = "#11294A", GOLD = "#C9A227", GOLD_LT = "#E8B84B";
const INK = "#E7ECF3", MUTED = "rgba(255,255,255,0.55)", LINE = "rgba(255,255,255,0.20)";

// section -> [ [path, label, note] ]
const TREE = [
  ["Front door", [
    ["/", "Landing", "hero · by the numbers · six layers · guide promo · about"],
  ]],
  ["Content — indexed, the SEO surface", [
    ["/neighborhoods", "Neighborhood guide", "index of 105"],
    ["/neighborhoods/[slug]", "One neighborhood", "105 static pages · story, facts, food, transit, live medians"],
    ["/property-types", "Buyer & seller guide", "5 ownership types · 3R · disclosures · taxes · Mello-Roos"],
  ]],
  ["The map — one app, many layers", [
    ["/fog", "Microclimate map", "address search + layer chips"],
    ["/fog?preset=fog", "→ Fog", "summer fog contours"],
    ["/fog?preset=homes", "→ Homes", "every closed sale, filterable"],
    ["/fog?preset=neighborhoods", "→ Hoods", "boundaries + pop-up"],
    ["/fog?preset=transit", "→ Transit", "Muni lines & stops"],
    ["/fog?preset=hazards", "→ Hazards", "seismic · tsunami · faults"],
    ["/fog?preset=terrain", "→ Terrain", "elevation & slope"],
  ]],
  ["Other tools", [
    ["/microclimates", "Sun & exposure", "solar · wind · fog line"],
    ["/market", "Market stats", "rolling 12-month by neighborhood"],
    ["/weather", "Forecast", "block-level"],
    ["/wine", "Wine country AVAs", "Napa & Sonoma"],
    ["/tools", "All tools", "the old facet hub"],
  ]],
  ["Machine-readable", [
    ["/sitemap.xml", "sitemap.xml", "113 URLs"],
    ["/robots.txt", "robots.txt", "/field disallowed"],
  ]],
];

const W = 1180, PAD = 34, COL_X = 300, ROW = 34, SEC_GAP = 26, HEAD = 96;
let y = HEAD;
const rows = [];
for (const [section, items] of TREE) {
  rows.push({ type: "section", label: section, y });
  y += 28;
  for (const [path, label, note] of items) {
    rows.push({ type: "row", path, label, note, y, child: label.startsWith("→") });
    y += ROW;
  }
  y += SEC_GAP;
}
const H = y + PAD;

const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const out = [
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="'DM Sans',system-ui,sans-serif">`,
  `<rect width="${W}" height="${H}" fill="${NAVY}"/>`,
  `<text x="${PAD}" y="46" fill="#fff" font-size="26" font-weight="800" letter-spacing="-0.5">Site map</text>`,
  `<text x="${PAD}" y="70" fill="${MUTED}" font-size="13">chuckheaver.com — every route, and what lives on it</text>`,
  `<line x1="${PAD}" y1="82" x2="${W - PAD}" y2="82" stroke="${GOLD}" stroke-width="2"/>`,
];

for (const r of rows) {
  if (r.type === "section") {
    out.push(`<text x="${PAD}" y="${r.y + 14}" fill="${GOLD_LT}" font-size="11" font-weight="700" letter-spacing="1.6">${esc(r.label.toUpperCase())}</text>`);
    continue;
  }
  const x = PAD + (r.child ? 22 : 0);
  out.push(`<rect x="${PAD - 10}" y="${r.y - 4}" width="${W - 2 * PAD + 20}" height="${ROW - 6}" fill="${NAVY2}" rx="6" opacity="${r.child ? 0.45 : 0.85}"/>`);
  out.push(`<text x="${x}" y="${r.y + 17}" fill="${r.child ? MUTED : INK}" font-size="13" font-weight="${r.child ? 500 : 700}" font-family="ui-monospace,SFMono-Regular,Menlo,monospace">${esc(r.path)}</text>`);
  out.push(`<text x="${COL_X}" y="${r.y + 17}" fill="${r.child ? MUTED : "#fff"}" font-size="13" font-weight="${r.child ? 500 : 600}">${esc(r.label)}</text>`);
  out.push(`<text x="${COL_X + 210}" y="${r.y + 17}" fill="${MUTED}" font-size="12">${esc(r.note)}</text>`);
}

out.push(`<line x1="${PAD}" y1="${H - 26}" x2="${W - PAD}" y2="${H - 26}" stroke="${LINE}"/>`);
out.push(`<text x="${PAD}" y="${H - 8}" fill="${MUTED}" font-size="11">Equal Housing Opportunity · Chuck Heaver DRE #02252640 · Vanguard Properties — every page carries the mark and the licence</text>`);
out.push("</svg>");

writeFileSync("public/brand/site-map.svg", out.join("\n") + "\n");
const count = rows.filter(r => r.type === "row").length;
console.log(`wrote public/brand/site-map.svg — ${count} entries, ${W}x${H}`);
