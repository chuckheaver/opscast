#!/usr/bin/env python3
"""Web edition of the market briefing, for /market/report.

Reads the two print documents the generator writes (out/cover3.html and
out/market-grid-v2.html), splits them into their pages, and regroups the pages
into the three sections of the site's Market menu:

  SF Market         — Right Now, Where the Money Came From, Who Is Buying,
                      In Depth, Latent Inventory
  SF Neighborhoods  — The Neighborhoods, and both market grids
  National Mkts     — The National Picture

On the way through it turns report text into drill-downs on the live map:
  • every area name → the map framed on that neighborhood, sold homes on
  • every Top 10 sale address → the map with a pin on that sale

The print documents are not touched, so the PDF stays exactly as designed.
Writes app/market/report/generated/{sheets.css, sf.html, hoods.html,
national.html, meta.json}.
"""
import html, json, pathlib, re, urllib.parse

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parents[1]
OUT = HERE / "out"
DEST = ROOT / "app" / "market" / "report" / "generated"

# The nine pages, in print order, and where each lands on the web.
PAGES = [
    ("San Francisco Real Estate", "sf"),
    ("The National Picture", "national"),
    ("Detail — Allocation of Money", "sf"),
    ("Who Is Buying", "sf"),
    ("The Neighborhoods", "hoods"),
    ("In Depth", "sf"),
    ("Latent Inventory", "sf"),
    ("Grid — Single Family", "hoods"),
    ("Grid — Condo / TIC / Co-op", "hoods"),
]

# Each report area opens the map on one representative neighborhood — the
# map's own names, checked against its geojson below so a link can never
# point at a neighborhood the map does not have.
AREA_TO_MAP = {
    "Marina / Cow Hollow": "Marina", "Pacific / Presidio Heights": "Pacific Heights",
    "Lower Pacific / Laurel Hts": "Lower Pacific Heights", "Russian Hill": "Russian Hill",
    "Nob Hill": "Nob Hill", "Telegraph Hill": "Telegraph Hill", "North Beach / Waterfront": "North Beach",
    "Downtown / Civic Center": "Civic Center", "Alamo Square / NOPA": "Alamo Square",
    "Western Addition": "Western Addition", "Hayes Valley": "Hayes Valley",
    "Cole Valley / Haight": "Cole Valley", "Buena Vista / Corona Heights": "Buena Vista",
    "Castro / Duboce Triangle": "Castro", "Noe Valley": "Noe Valley", "Mission Dolores": "Mission Dolores",
    "Mission": "Mission", "Bernal Heights / Glen Park": "Bernal Heights", "Potrero Hill": "Potrero Hill",
    "Dogpatch": "Dogpatch", "South Beach / Yerba Buena": "South Beach", "SOMA": "South of Market",
    "Mission Bay": "Mission Bay", "Diamond Heights": "Diamond Heights",
    "Twin Peaks / Midtown Terr": "Midtown Terrace", "Richmond / Lake Street": "Inner Richmond",
    "Sea Cliff / Lone Mountain": "Seacliff", "Sunset / Parkside": "Outer Sunset",
    "West Portal / Forest Hill": "West Portal", "Westwood Park / Sunnyside": "Westwood Park",
    "Ingleside Terrace / Lakeside": "Ingleside Terraces", "Lake Shore / Stonestown": "Lakeshore",
    "Ingleside / Oceanview": "Ingleside", "Excelsior / Portola": "Excelsior",
    "Bayview / Hunters Point": "Bayview", "Visitacion Vly / Silver Terr": "Visitacion Valley",
}

map_names = {f["properties"]["name"] for f in
             json.loads((ROOT / "public/data/sf-fog-neighborhoods.geojson").read_text())["features"]}
missing = sorted(v for v in AREA_TO_MAP.values() if v not in map_names)
assert not missing, f"map has no neighborhood named: {missing}"

def hood_url(area):
    return "/fog?" + urllib.parse.urlencode({"preset": "homes", "hood": AREA_TO_MAP[area]})

# ----------------------------------------------------------- split + scope
# The same splitting and CSS scoping proof.py uses for the proof viewer.
def split(path):
    s = pathlib.Path(path).read_text()
    css = re.search(r"<style>(.*?)</style>", s, re.S).group(1)
    body = re.search(r"</style>\s*</head>\s*<body>(.*?)</body>", s, re.S)
    body = body.group(1) if body else re.search(r"</style>(.*)$", s, re.S).group(1)
    return css, re.sub(r"</(body|html)>", "", body)

def scope(css, cls):
    css = re.sub(r"@page\s*\{[^}]*\}", "", css)
    out = []
    for m in re.finditer(r"([^{}]+)\{([^{}]*)\}", css, re.S):
        sel, decl = m.group(1).strip(), m.group(2)
        if not sel or sel.startswith("@"):
            out.append(m.group(0)); continue
        parts = [f".{cls}" if one.strip() in ("body", "html", "*") else f".{cls} {one.strip()}"
                 for one in sel.split(",") if one.strip()]
        out.append(", ".join(parts) + " {" + decl + "}")
    return "\n".join(out)

pages, css = [], []
for src, cls in [(OUT / "cover3.html", "sheetA"), (OUT / "market-grid-v2.html", "sheetB")]:
    c, body = split(src)
    css.append(scope(c, cls))
    for p in re.findall(r"<div class='page'>.*?(?=<div class='page'>|$)", body, re.S):
        pages.append((cls, p.rstrip()))
assert len(pages) == len(PAGES), f"expected {len(PAGES)} pages, got {len(pages)}"

# ------------------------------------------------------------------ links
# Area names appear as whole text nodes: a table cell, a ranked "3. Name", an
# SVG label, sometimes with a trailing * (thin sample). Match only whole
# nodes so "Mission" never catches inside "Mission Bay".
area_alt = "|".join(re.escape(html.escape(a, quote=False)) for a in sorted(AREA_TO_MAP, key=len, reverse=True))
AREA_RX = re.compile(r">(\s*(?:\d+\.\s*)?)(" + area_alt + r")(\*?)(\s*)<")

def link_areas(s):
    """Link area names, except inside the employers table — its "Where"
    column is an office location, not a place homes sold."""
    parts = re.split(r"(<table.*?</table>)", s, flags=re.S)
    return "".join(p if (p.startswith("<table") and ">Company<" in p) else _link_areas(p) for p in parts)

def _link_areas(s):
    def sub(m):
        area = html.unescape(m.group(2))
        return (f">{m.group(1)}<a class='rp-link' href='{html.escape(hood_url(area))}' "
                f"title='Open {html.escape(area)} on the map — sold homes'>{m.group(2)}</a>{m.group(3)}{m.group(4)}<")
    return AREA_RX.sub(sub, s)

# Top 10 sales: "1. 2830 Pacific Ave" → a pin on that sale.
sold = {}
for f in json.loads((ROOT / "public/data/sf-listings.geojson").read_text())["features"]:
    p = f["properties"]
    if p.get("sellingDate") and p.get("address") and p.get("lat") and p.get("lng"):
        sold.setdefault(p["address"].strip(), p)

ADDR_RX = re.compile(r">(\s*\d+\.\s*)(\d+[^<>]*?(?:St|Ave|Blvd|Way|Ter|Dr|Rd|Ct|Pl|Ln|Hwy|Street|Avenue))(\s*)<")
def link_sales(s):
    def sub(m):
        addr = html.unescape(m.group(2)).strip()
        p = sold.get(addr)
        if not p: return m.group(0)
        url = "/fog?" + urllib.parse.urlencode({"preset": "homes", "lat": p["lat"], "lng": p["lng"], "name": addr})
        return f">{m.group(1)}<a class='rp-link' href='{html.escape(url)}' title='Show this sale on the map'>{m.group(2)}</a>{m.group(3)}<"
    return ADDR_RX.sub(sub, s)

# -------------------------------------------------------------- write out
DEST.mkdir(parents=True, exist_ok=True)
sections = {"sf": [], "hoods": [], "national": []}
counts = {"areas": 0, "sales": 0}
for (label, sec), (cls, body) in zip(PAGES, pages):
    b1 = link_areas(body); counts["areas"] += b1.count("class='rp-link'")
    b2 = link_sales(b1); counts["sales"] += b2.count("class='rp-link'") - b1.count("class='rp-link'")
    sections[sec].append(f"<div class='rp-sheet {cls}' data-label='{html.escape(label)}'>{b2}</div>")

for sec, sheets in sections.items():
    (DEST / f"{sec}.html").write_text("\n".join(sheets))
(DEST / "sheets.css").write_text("\n".join(css))

run = re.search(r"run ([A-Z][a-z]{2} \d{1,2}, \d{4})", pages[-1][1])
period = re.search(r"Year to date: (Jan 1 – [A-Z][a-z]{2} \d{1,2}, \d{4})", pages[-1][1])
meta = {
    "period": period.group(1) if period else "",
    "run": run.group(1) if run else "",
    "pages": {sec: [l for l, s in PAGES if s == sec] for sec in sections},
    "links": counts,
}
(DEST / "meta.json").write_text(json.dumps(meta, indent=2))
print(f"wrote web edition → {DEST.relative_to(ROOT)}  "
      f"sf {len(sections['sf'])} · hoods {len(sections['hoods'])} · national {len(sections['national'])} pages  "
      f"· {counts['areas']} area links · {counts['sales']} sale links")
