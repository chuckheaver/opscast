#!/usr/bin/env python3
"""Rebuild sf-briefing-proof.html from cover3.html + market-grid-v2.html.

Both source documents are standalone print sheets with their own bare-element
CSS (body, table, h2 ...). Combining them in one page means scoping every rule:
cover pages get .sheetA, grid pages get .sheetB.
"""
import re, datetime, pathlib

OUT = pathlib.Path(__file__).resolve().parent / "out"
SRC = [(OUT / "cover3.html", "sheetA"), (OUT / "market-grid-v2.html", "sheetB")]
PAGE_LABELS = ["San Francisco Real Estate", "The National Picture", "Detail — Allocation of Money",
               "Who Is Buying", "The Neighborhoods", "In Depth", "Latent Inventory",
               "Grid — Single Family", "Grid — Condo / TIC / Co-op"]

def split(path):
    s = pathlib.Path(path).read_text()
    css = re.search(r"<style>(.*?)</style>", s, re.S).group(1)
    body = re.search(r"</style>\s*</head>\s*<body>(.*?)</body>", s, re.S)
    body = body.group(1) if body else re.search(r"</style>(.*)$", s, re.S).group(1)
    body = re.sub(r"</(body|html)>", "", body)
    return css, body

def scope(css, cls):
    """Prefix every selector in the stylesheet with .<cls>, dropping @page."""
    css = re.sub(r"@page\s*\{[^}]*\}", "", css)
    out, i = [], 0
    for m in re.finditer(r"([^{}]+)\{([^{}]*)\}", css, re.S):
        sel, decl = m.group(1).strip(), m.group(2)
        if not sel or sel.startswith("@"):
            out.append(m.group(0)); continue
        parts = []
        for one in sel.split(","):
            one = one.strip()
            if not one: continue
            if one in ("body", "html", "*"):
                parts.append(f".{cls}")
            else:
                parts.append(f".{cls} {one}")
        out.append(", ".join(parts) + " {" + decl + "}")
    return "\n".join(out)

pages, css_all = [], []
for path, cls in SRC:
    css, body = split(path)
    css_all.append(scope(css, cls))
    for p in re.findall(r"<div class='page'>.*?(?=<div class='page'>|$)", body, re.S):
        pages.append((cls, p.rstrip()))

assert len(pages) == 9, f"expected 9 pages, got {len(pages)}"

SHELL_CSS = """
:root { --ground:#E9ECF1; --ground-2:#DDE2EA; --ink:#101720; --muted:#5A6472;
  --navy:#042C53; --gold:#C9A227; --line:#C9D0DA; --paper:#FFFFFF; --shadow:rgba(16,23,32,.18); }
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) {
  --ground:#151A21; --ground-2:#1E242D; --ink:#E7ECF3; --muted:#9AA6B6;
  --navy:#8FB3DE; --gold:#E3C765; --line:#2C3542; --shadow:rgba(0,0,0,.55); } }
:root[data-theme="dark"] { --ground:#151A21; --ground-2:#1E242D; --ink:#E7ECF3; --muted:#9AA6B6;
  --navy:#8FB3DE; --gold:#E3C765; --line:#2C3542; --shadow:rgba(0,0,0,.55); }
* { box-sizing:border-box; }
body { margin:0; background:var(--ground); color:var(--ink);
  font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif; }
.bar { position:sticky; top:0; z-index:20; background:var(--ground-2);
  border-bottom:1px solid var(--line); padding:10px 16px; display:flex; align-items:baseline;
  gap:12px; flex-wrap:wrap; }
.bar h1 { font-size:15px; margin:0; letter-spacing:-.2px; font-weight:700; }
.bar .sub { font-size:12px; color:var(--muted); }
.chips { margin-left:auto; display:flex; gap:5px; flex-wrap:wrap; }
.chip { display:grid; place-items:center; width:26px; height:26px; border-radius:6px;
  border:1px solid var(--line); background:var(--paper); color:var(--navy);
  font-size:12px; font-weight:700; text-decoration:none; }
.chip:hover, .chip:focus-visible { background:var(--navy); color:var(--paper); outline:none; }
main { padding:16px 16px 40px; display:flex; flex-direction:column; gap:26px; }
.sheet { scroll-margin-top:64px; }
.sheet-head { display:flex; align-items:center; gap:8px; margin-bottom:7px; }
.pnum { display:grid; place-items:center; width:20px; height:20px; border-radius:5px;
  background:var(--navy); color:#fff; font-size:11px; font-weight:800; }
:root[data-theme="dark"] .pnum { color:#0B1017; }
.plab { font-size:12.5px; font-weight:600; color:var(--muted); letter-spacing:.2px; }
.paper { background:#fff; border:1px solid var(--line); border-radius:3px;
  box-shadow:0 6px 20px var(--shadow); overflow:hidden; }
.scaler { transform-origin:top left; }
.foot-note { font-size:12px; color:var(--muted); line-height:1.5; max-width:70ch; }
"""

SCRIPT = """
// Scale each print sheet down to the column width, keeping its aspect ratio.
function fit(){
  document.querySelectorAll('.paper').forEach(function(p){
    var s = p.querySelector('.scaler'), inner = s.firstElementChild;
    s.style.transform = 'none';
    var w = inner.getBoundingClientRect().width || 989;
    var h = inner.getBoundingClientRect().height || 730;
    var k = p.clientWidth / w;
    s.style.transform = 'scale(' + k + ')';
    p.style.height = Math.round(h * k) + 'px';
  });
}
addEventListener('resize', fit); addEventListener('load', fit); fit();
"""

chips = "".join(f"<a class='chip' href='#p{i+1}' title='{lab}'>{i+1}</a>"
                for i, lab in enumerate(PAGE_LABELS))
sheets = "".join(
    f"<section class='sheet' id='p{i+1}'>"
    f"<div class='sheet-head'><span class='pnum'>{i+1}</span>"
    f"<span class='plab'>{PAGE_LABELS[i]}</span></div>"
    f"<div class='paper'><div class='scaler'><div class='{cls}'>{html}</div></div></div>"
    f"</section>"
    for i, (cls, html) in enumerate(pages))

today = datetime.date.today().strftime("%b %-d, %Y")
doc = f"""<!doctype html><html lang='en'><head><meta charset='utf-8'>
<meta name='viewport' content='width=device-width,initial-scale=1'>
<title>Market Briefing Proof</title>
<style>{SHELL_CSS}
{chr(10).join(css_all)}
.sheetA, .sheetB {{ width:989px; }}
.sheetA .page, .sheetB .page {{ page-break-after:auto; }}
</style></head><body>
<div class='bar'><h1>SF Market Briefing — August 2026</h1>
  <span class='sub'>9 pages · on-screen proof · {today}</span>
  <nav class='chips'>{chips}</nav></div>
<main>{sheets}
<p class='foot-note'>Screen proof of the print briefing. Each sheet is one landscape letter page,
scaled to fit. Figures are closed sales from my database, Jan 1 – August 31, 2026.</p>
</main><script>{SCRIPT}</script></body></html>"""

(OUT / "sf-briefing-proof.html").write_text(doc)
print("wrote sf-briefing-proof.html", len(doc), "bytes /", len(pages), "pages")
