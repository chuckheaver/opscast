"""Product types: SFH, Duplex / 2 Homes, Condo, TIC, Co-op and Other (broken
out), side by side — median sale price, median sold $/sf, % of list, days on
market and units sold, year to date and by quarter, with the neighborhood
that sold the most of each and the sales left out of $/sf for want of square
footage. One computation feeds both the report page (cover3.py) and the
site's page (app/lib/product-types.json → /market/product-types)."""
import json, os, statistics, datetime

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
SRC = os.path.join(ROOT, "public", "data", "sf-listings.geojson")
OUT_JSON = os.path.join(ROOT, "app", "lib", "product-types.json")

# The product groups (the owner, Oct 20 2026). Anything not named lands in Other.
GROUPS = [
    ("sfh", "SFH", ["Single Family Residence", "Halfplex"]),
    ("duplex", "Duplex / 2 Homes", ["Duplex", "2 Houses on Lot"]),
    ("condo", "Condo", ["Condominium", "Townhouse", "Loft Condominium", "Loft"]),
    ("tic", "TIC", ["Tenancy in Common", "Co-Ownership"]),
    ("coop", "Co-op", ["Stock Cooperative"]),
    ("other", "Other", []),
]
OTHER_ORDER = ["Triplex", "Fourplex", "5+ Units", "3+ Houses on Lot", "Residential Income Other", "Other"]
BIG = 3_000_000   # a sale this size with no square footage is worth naming


def group_of(t):
    for k, _, ts in GROUPS:
        if t in ts: return k
    return "other"


def med(v):
    v = [x for x in v if x is not None]
    return statistics.median(v) if v else None


def stats(rows):
    sq = [r for r in rows if r["sqft"]]
    return {
        "n": len(rows),
        "price": med([r["price"] for r in rows]),
        "ppsf": med([r["price"] / r["sqft"] for r in sq]),
        "ppsfN": len(sq),
        "sqft": med([r["sqft"] for r in sq]),       # median building size, sales with reported sf
        "noSqft": len(rows) - len(sq),
        "pctList": med([100 * r["price"] / r["list"] for r in rows if r["list"]]),
        "dom": med([r["dom"] for r in rows if r["dom"] is not None]),
        "volume": sum(r["price"] for r in rows),
    }


def top_hood(rows):
    c = {}
    for r in rows:
        if r["hood"]: c.setdefault(r["hood"], []).append(r)
    if not c: return None
    h, v = max(c.items(), key=lambda kv: (len(kv[1]), kv[0]))
    return {"hood": h, "n": len(v), "price": med([r["price"] for r in v]), "share": len(v) / len(rows)}


def compute(period_end):
    end = datetime.date.fromisoformat(period_end)
    year = str(end.year)
    rows = []
    for f in json.load(open(SRC))["features"]:
        p = f["properties"]; d = str(p.get("sellingDate") or "")[:10]
        price = float(p.get("sellingPrice") or 0)
        if price <= 0 or not d.startswith(year) or d > period_end: continue
        num = lambda k: float(p[k]) if p.get(k) not in (None, "") and float(p[k]) > 0 else None
        rows.append({"id": str(p.get("id")), "addr": str(p.get("address") or "").split(",")[0], "type": p.get("propType") or "",
                     "group": group_of(p.get("propType") or ""), "date": d, "q": (int(d[5:7]) - 1) // 3 + 1,
                     "price": price, "sqft": num("sqft"), "list": num("listPrice"),
                     "dom": float(p["dom"]) if p.get("dom") not in (None, "") else None, "hood": p.get("fogNeighborhood")})
    quarters = sorted({r["q"] for r in rows})
    out = {"year": year, "through": period_end, "quarters": quarters, "groups": [], "other": [], "noSqftBig": []}
    for k, label, types in GROUPS:
        g = [r for r in rows if r["group"] == k]
        top = max(g, key=lambda r: r["price"]) if g else None
        out["groups"].append({
            "key": k, "label": label, "types": types or sorted({r["type"] for r in g}),
            **stats(g),
            "byQuarter": {str(q): stats([r for r in g if r["q"] == q]) for q in quarters},
            "topHood": top_hood(g),
            "topSale": {"addr": top["addr"], "price": top["price"], "hood": top["hood"], "date": top["date"]} if top else None,
        })
    for t in OTHER_ORDER + sorted({r["type"] for r in rows if r["group"] == "other"} - set(OTHER_ORDER)):
        g = [r for r in rows if r["group"] == "other" and r["type"] == t]
        if g: out["other"].append({"type": t, **stats(g), "topHood": top_hood(g)})
    big = [r for r in rows if not r["sqft"] and r["price"] >= BIG and r["group"] in ("duplex", "other")]
    out["noSqftBig"] = [{"addr": r["addr"], "type": r["type"], "price": r["price"], "hood": r["hood"], "date": r["date"]}
                        for r in sorted(big, key=lambda r: -r["price"])]
    out["noSqftBigTotal"] = len(big)
    json.dump(out, open(OUT_JSON, "w"), indent=1)
    return out


def _m(v):
    if v is None: return "—"
    return f"${v / 1e6:.2f}M" if v >= 995_000 else f"${v / 1e3:.0f}K"


def page_html(d, thru, yy):
    """The report page: the six-way table, the quarterly trend, the
    neighborhood facts and the no-square-footage note."""
    G = d["groups"]; qs = d["quarters"]
    sf = next(g for g in G if g["key"] == "sfh"); dx = next(g for g in G if g["key"] == "duplex")
    ppsf = lambda g: f"${g['ppsf']:,.0f}" if g["ppsf"] else "—"
    pct = lambda g: f"{g['pctList']:.0f}%" if g["pctList"] else "—"
    dom = lambda g: f"{g['dom']:.0f}" if g["dom"] is not None else "—"
    size = lambda g: f"{g['sqft']:,.0f} sf" if g.get("sqft") else "—"
    nosf = lambda g: f"<small> ({g['noSqft']} no sf)</small>" if g["noSqft"] else ""
    rows = "".join(f"<tr><td class='l'><b>{g['label']}</b></td><td>{g['n']:,}</td><td><b>{_m(g['price'])}</b></td>"
                   f"<td>{size(g)}</td><td>{ppsf(g)}{nosf(g)}</td><td>{pct(g)}</td><td>{dom(g)}</td></tr>" for g in G)
    qh = "".join(f"<th>Q{q}</th>" for q in qs)
    trend = "".join(f"<tr><td class='l'>{g['label']}</td>" + "".join(
        f"<td>{_m(g['byQuarter'][str(q)]['price'])}<small> · {('$' + format(round(g['byQuarter'][str(q)]['ppsf']), ',')) if g['byQuarter'][str(q)]['ppsf'] else '—'}/sf"
        f" · {format(round(g['byQuarter'][str(q)]['sqft']), ',') + ' sf' if g['byQuarter'][str(q)].get('sqft') else '—'}</small></td>"
        for q in qs) + "</tr>" for g in G)
    other = "".join(f"<tr><td class='l'>{o['type']}</td><td>{o['n']}</td><td>{_m(o['price'])}</td><td>{format(round(o['sqft']), ',') + ' sf' if o.get('sqft') else '—'}</td><td>{('$' + format(round(o['ppsf']), ',')) if o['ppsf'] else '—'}</td>"
                    f"<td class='l'>{o['topHood']['hood'] if o['topHood'] else '—'} ({o['topHood']['n'] if o['topHood'] else 0})</td></tr>" for o in d["other"])
    facts = "".join(f"<li><b>{g['label']}:</b> {g['topHood']['hood']} sold the most, {g['topHood']['n']} "
                    f"({g['topHood']['share']:.0%} of all), median {_m(g['topHood']['price'])}. Top sale {_m(g['topSale']['price'])}, {g['topSale']['addr']}.</li>"
                    for g in G if g["topHood"])
    nsf = d["noSqftBig"][:6]
    nsf_txt = (f"{d['noSqftBigTotal']} duplex and Other sales of $3M+ report no square footage and are left out of $/sf: "
               + "; ".join(f"{r['addr']} ({r['type']}, {_m(r['price'])})" for r in nsf)
               + ("…" if d["noSqftBigTotal"] > len(nsf) else "") + ".") if nsf else ""
    nsf_box = ("<p>" + " · ".join(f"{g['label']}: <b>{g['noSqft']}</b> of {g['n']:,}" for g in G) + " sales report no square footage; they count in every figure except $/sf.</p>"
               + (f"<p>Big ones: " + "; ".join(f"<b>{r['addr']}</b> ({r['type']}, {_m(r['price'])}, {r['hood']})" for r in d['noSqftBig']) + ".</p>" if d["noSqftBig"] else ""))
    gap = (dx["price"] / sf["price"] - 1) * 100 if dx["price"] and sf["price"] else 0
    sfgap = (dx["ppsf"] / sf["ppsf"] - 1) * 100 if dx["ppsf"] and sf["ppsf"] else 0
    return f"""<div class='page'><div class='mast'><div><div class='t'>Product Types</div>
      <div class='p'>What each kind of property really sells for — Jan 1 – {thru}, 20{yy}</div></div>
      <div class='by'>Chuck Heaver · Vanguard Properties<br>Closed sales, SFAR MLS (Residential + Residential Income)</div></div>
      <div class='pt-lead'>Duplexes are not the cheaper buy: the median duplex sold for <b>{_m(dx['price'])}</b>, {gap:+.0f}% against the median house
      ({_m(sf['price'])}) — but at <b>${dx['ppsf']:,.0f}/sf</b>, {sfgap:+.0f}% per square foot, because it is more building.</div>
      <div class='pt-grid'><div>
      <h2>Year to date by product type</h2>
      <table class='pt'><tr><th class='l'>Type</th><th>Units sold</th><th>Median price</th><th>Median size</th><th>Median $/sf</th><th>% of list</th><th>DOM</th></tr>{rows}</table>
      <h2>Median price · $/sf · size by quarter</h2>
      <table class='pt'><tr><th class='l'>Type</th>{qh}</tr>{trend}</table></div>
      <div><h2>Inside “Other”</h2>
      <table class='pt'><tr><th class='l'>Type</th><th>Sold</th><th>Median</th><th>Size</th><th>$/sf</th><th class='l'>Most sold in</th></tr>{other}</table>
      <h2>Where each type sells</h2><ul class='pt-facts'>{facts}</ul></div></div>
      <h2>Left out of $/sf: no square footage</h2><div class='pt-note'>{nsf_box}</div>
      <div class='foot'><span>Closed sales (SFAR MLS), Jan 1 – {thru}, 20{yy}. Medians throughout; size and $/sf use only sales with reported square footage. 
      2025 Residential Income is not yet loaded, so there is no year-over-year comparison by type.</span><span>page 7 / 9</span></div></div>"""


CSS = """
.pt-lead { font-size:12.5px; line-height:1.45; margin:4px 0 8px; padding:7px 10px; background:#F6F1E2; border-left:4px solid #C9A227; }
.pt-grid { display:grid; grid-template-columns:1.15fr 1fr; gap:14px; }
.pt-grid h2 { font-size:13px; margin:6px 0 4px; }
table.pt { border-collapse:collapse; width:100%; font-size:10.5px; }
table.pt th, table.pt td { padding:3px 5px; border-bottom:1px solid #E3E1DA; text-align:right; }
table.pt th { font-size:9px; text-transform:uppercase; letter-spacing:.04em; color:#6B6F75; }
table.pt .l { text-align:left; } table.pt small { color:#6B6F75; font-size:8.5px; }
.pt-note { font-size:10.3px; line-height:1.45; } .pt-note p { margin:2px 0 5px; }
ul.pt-facts { margin:0; padding-left:15px; font-size:10.3px; line-height:1.45; } ul.pt-facts li { margin:2px 0; }
"""
