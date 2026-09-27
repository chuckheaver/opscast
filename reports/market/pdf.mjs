// Prints the two report documents to Letter-landscape PDFs and merges them
// into the one briefing the site links to. Needs playwright (already a dev
// dependency) and pdf-lib:  npm i --no-save pdf-lib
import { PDFDocument } from "pdf-lib";
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "../..");
const OUT = path.join(HERE, "out");
const meta = JSON.parse(readFileSync(path.join(ROOT, "app/market/report/generated/meta.json"), "utf8"));

// Playwright: the project's copy if installed, otherwise the global one.
let chromium;
try { ({ chromium } = await import("playwright")); }
catch {
  const g = execSync("npm root -g").toString().trim();
  ({ chromium } = await import(path.join(g, "playwright", "index.mjs")));
}

// Chromium: the sandbox build if present, else Playwright's own.
const exe = ["/opt/pw-browsers/chromium-1194/chrome-linux/chrome"].find(p => { try { readFileSync(p); return true; } catch { return false; } });
const browser = await chromium.launch(exe ? { executablePath: exe } : {});
const parts = [];
for (const src of ["cover3.html", "market-grid-v2.html"]) {
  const page = await browser.newPage({ viewport: { width: 1500, height: 1000 } });
  await page.goto("file://" + path.join(OUT, src));
  parts.push(await page.pdf({ format: "Letter", landscape: true, printBackground: true,
    margin: { top: "0.32in", bottom: "0.32in", left: "0.35in", right: "0.35in" } }));
  await page.close();
}
await browser.close();

const doc = await PDFDocument.create();
for (const bytes of parts) {
  const src = await PDFDocument.load(bytes);
  for (const p of await doc.copyPages(src, src.getPageIndices())) doc.addPage(p);
}
doc.setTitle(`San Francisco Market Briefing — ${meta.period}`);
doc.setAuthor("Chuck Heaver · Vanguard Properties");

const dir = path.join(ROOT, "public/reports");
mkdirSync(dir, { recursive: true });
const file = path.join(dir, "sf-market-briefing.pdf");
writeFileSync(file, await doc.save());
console.log(`wrote ${path.relative(ROOT, file)} — ${doc.getPageCount()} pages`);
