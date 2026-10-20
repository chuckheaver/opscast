"""Product types: SFH, Duplex / 2 Homes, Condo, TIC, Co-op and Other (broken
out), side by side, this year against the same stretch of last year — median sale price, median sold $/sf, % of list, days on
market and units sold, year to date and by quarter, with the neighborhood
that sold the most of each and the sales left out of $/sf for want of square
footage. One computation feeds both the report page (cover3.py) and the
site's page (app/lib/product-types.json → /market/product-types)."""
import json, os, statistics, datetime
from decimal import Decimal, ROUND_FLOOR

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


def chg(a, b):
    """Year-over-year change, a (this year) against b (the same stretch of last year)."""
    return (a / b - 1) * 100 if a is not None and b else None


def yoy(cur, prev):
    return {"n": chg(cur["n"], prev["n"]), "price": chg(cur["price"], prev["price"]), "ppsf": chg(cur["ppsf"], prev["ppsf"]),
            "sqft": chg(cur["sqft"], prev["sqft"]),
            "pctList": cur["pctList"] - prev["pctList"] if cur["pctList"] is not None and prev["pctList"] is not None else None,
            "dom": cur["dom"] - prev["dom"] if cur["dom"] is not None and prev["dom"] is not None else None}


def load(period_end):
    """Closed sales of this year through the period end and all of last year."""
    end = datetime.date.fromisoformat(period_end)
    years = (str(end.year - 1), str(end.year))
    rows = []
    for f in json.load(open(SRC))["features"]:
        p = f["properties"]; d = str(p.get("sellingDate") or "")[:10]
        price = float(p.get("sellingPrice") or 0)
        if price <= 0 or d[:4] not in years or d > period_end: continue
        num = lambda k: float(p[k]) if p.get(k) not in (None, "") and float(p[k]) > 0 else None
        rows.append({"id": str(p.get("id")), "addr": str(p.get("address") or "").split(",")[0], "type": p.get("propType") or "",
                     "group": group_of(p.get("propType") or ""), "year": d[:4], "date": d, "q": (int(d[5:7]) - 1) // 3 + 1,
                     "price": price, "sqft": num("sqft"), "list": num("listPrice"),
                     "dom": float(p["dom"]) if p.get("dom") not in (None, "") else None, "hood": p.get("fogNeighborhood")})
    return rows


def compute(period_end):
    end = datetime.date.fromisoformat(period_end)
    year, prior = str(end.year), str(end.year - 1)
    try: prior_end = end.replace(year=end.year - 1).isoformat()
    except ValueError: prior_end = end.replace(year=end.year - 1, day=28).isoformat()   # Feb 29
    allrows = load(period_end)
    rows = [r for r in allrows if r["year"] == year]
    prev = [r for r in allrows if r["year"] == prior and r["date"] <= prior_end]    # the same stretch of last year
    full = [r for r in allrows if r["year"] == prior]                               # all of last year
    quarters = sorted({r["q"] for r in rows})
    out = {"year": year, "through": period_end, "priorYear": prior, "priorThrough": prior_end,
           "quarters": quarters, "priorQuarters": sorted({r["q"] for r in full}),
           "groups": [], "other": [], "noSqftBig": []}
    for k, label, types in GROUPS:
        g = [r for r in rows if r["group"] == k]
        gp = [r for r in prev if r["group"] == k]
        gf = [r for r in full if r["group"] == k]
        top = max(g, key=lambda r: r["price"]) if g else None
        cur, pr = stats(g), stats(gp)
        out["groups"].append({
            "key": k, "label": label, "types": types or sorted({r["type"] for r in g}),
            **cur,
            "prior": pr, "yoy": yoy(cur, pr), "priorFull": stats(gf),
            "byQuarter": {str(q): stats([r for r in g if r["q"] == q]) for q in quarters},
            "priorByQuarter": {str(q): stats([r for r in gf if r["q"] == q]) for q in out["priorQuarters"]},
            "topHood": top_hood(g),
            "topSale": {"addr": top["addr"], "price": top["price"], "hood": top["hood"], "date": top["date"]} if top else None,
        })
    others = sorted({r["type"] for r in rows + prev if r["group"] == "other"})
    for t in [t for t in OTHER_ORDER if t in others] + [t for t in others if t not in OTHER_ORDER]:
        g = [r for r in rows if r["group"] == "other" and r["type"] == t]
        gp = [r for r in prev if r["group"] == "other" and r["type"] == t]
        cur, pr = stats(g), stats(gp)
        out["other"].append({"type": t, **cur, "prior": pr, "yoy": yoy(cur, pr), "topHood": top_hood(g)})
    big = [r for r in rows if not r["sqft"] and r["price"] >= BIG and r["group"] in ("duplex", "other")]
    out["noSqftBig"] = [{"addr": r["addr"], "type": r["type"], "price": r["price"], "hood": r["hood"], "date": r["date"]}
                        for r in sorted(big, key=lambda r: -r["price"])]
    out["noSqftBigTotal"] = len(big)
    json.dump(out, open(OUT_JSON, "w"), indent=1)
    return out


def hu(v, nd=0):
    """Round halves up (Math.round), as the site's page does (Python's own rounding takes
    halves to even, so a median of $1,125,000 would read $1.12M here, $1.13M there)."""
    d = (Decimal(repr(v)).scaleb(nd) + Decimal("0.5")).to_integral_value(rounding=ROUND_FLOOR).scaleb(-nd)
    return int(d) if nd == 0 else float(d)


def _m(v):
    if v is None: return "—"
    return f"${hu(v / 1e6, 2):.2f}M" if v >= 999_500 else f"${hu(v / 1e3)}K"


def _pc(v, unit="%"):
    """A year-over-year change, signed and shaded."""
    if v is None: return "—"
    cls = "up" if v > 0.05 else "dn" if v < -0.05 else ""
    txt = f"{hu(v, 1):+.1f}{unit}" if unit == "%" else f"{hu(v):+d}{unit}"
    if unit == " days" and abs(hu(v)) == 1: txt = txt[:-1]
    return f"<span class='{cls}'>{txt}</span>"


def page_html(d, thru, yy):
    """The report page: the six-way table this year against the same stretch
    of last year, the quarterly trend (last year in full), Inside "Other",
    the neighborhood facts and the no-square-footage note."""
    G = d["groups"]; qs = d["quarters"]; pqs = d["priorQuarters"]
    y, py = d["year"], d["priorYear"]
    ppsf = lambda g: f"${hu(g['ppsf']):,}" if g["ppsf"] else "—"
    pct = lambda g: f"{hu(g['pctList'])}%" if g["pctList"] else "—"
    dom = lambda g: f"{hu(g['dom'])}" if g["dom"] is not None else "—"
    size = lambda g: f"{hu(g['sqft']):,} sf" if g.get("sqft") else "—"
    nosf = lambda g: f"<small> ({g['noSqft']} no sf)</small>" if g["noSqft"] else ""
    def ytd(g):
        p, c = g["prior"], g["yoy"]
        return (f"<tr class='y1'><td class='l' rowspan='3'><b>{g['label']}</b></td><td class='l'>{y}</td><td>{g['n']:,}</td><td><b>{_m(g['price'])}</b></td>"
                f"<td>{size(g)}</td><td>{ppsf(g)}{nosf(g)}</td><td>{pct(g)}</td><td>{dom(g)}</td></tr>"
                f"<tr class='y0'><td class='l'>{py}</td><td>{p['n']:,}</td><td>{_m(p['price'])}</td><td>{size(p)}</td><td>{ppsf(p)}{nosf(p)}</td><td>{pct(p)}</td><td>{dom(p)}</td></tr>"
                f"<tr class='yc'><td class='l'>YoY</td><td>{_pc(c['n'])}</td><td>{_pc(c['price'])}</td><td>{_pc(c['sqft'])}</td><td>{_pc(c['ppsf'])}</td>"
                f"<td>{_pc(c['pctList'], ' pts')}</td><td>{_pc(c['dom'], ' days')}</td></tr>")
    rows = "".join(ytd(g) for g in G)
    allq = sorted(set(qs) | set(pqs))
    qh = "".join(f"<th>Q{q}</th>" for q in allq)
    def qcell(s):
        if not s or not s["n"]: return "<td>—</td>"
        return (f"<td>{_m(s['price'])}<small> · {('$' + format(hu(s['ppsf']), ',')) if s['ppsf'] else '—'}/sf"
                f" · {format(hu(s['sqft']), ',') + ' sf' if s.get('sqft') else '—'} · {s['n']:,}</small></td>")
    def qchg(g, q):
        a, b = g["byQuarter"].get(str(q)), g["priorByQuarter"].get(str(q))
        if not a or not b or not a["n"]: return "<td>—</td>"
        return f"<td>{_pc(chg(a['price'], b['price']))}<small> · $/sf {_pc(chg(a['ppsf'], b['ppsf']))} · units {_pc(chg(a['n'], b['n']))}</small></td>"
    trend = "".join(
        f"<tr class='y1'><td class='l' rowspan='3'>{g['label']}</td><td class='l'>{y}</td>" + "".join(qcell(g["byQuarter"].get(str(q))) for q in allq) + "</tr>"
        f"<tr class='y0'><td class='l'>{py}</td>" + "".join(qcell(g["priorByQuarter"].get(str(q))) for q in allq) + "</tr>"
        f"<tr class='yc'><td class='l'>YoY</td>" + "".join(qchg(g, q) for q in allq) + "</tr>" for g in G)
    other = "".join(f"<tr><td class='l'>{o['type']}</td><td>{o['n']}</td><td>{o['prior']['n']}</td><td>{_m(o['price'])}</td><td>{_m(o['prior']['price'])}</td><td>{_pc(o['yoy']['price'])}</td>"
                    f"<td>{format(hu(o['sqft']), ',') + ' sf' if o.get('sqft') else '—'}</td><td>{('$' + format(hu(o['ppsf']), ',')) if o['ppsf'] else '—'}</td>"
                    f"<td class='l'>{(o['topHood']['hood'] + ' (' + str(o['topHood']['n']) + ')') if o['topHood'] else '—'}</td></tr>" for o in d["other"])
    facts = "".join(f"<li><b>{g['label']}:</b> {g['topHood']['hood']} sold the most, {g['topHood']['n']} "
                    f"({g['topHood']['share']:.0%} of all), median {_m(g['topHood']['price'])}. Top sale {_m(g['topSale']['price'])}, {g['topSale']['addr']}.</li>"
                    for g in G if g["topHood"])
    nsf_box = ("<p>" + " · ".join(f"{g['label']}: <b>{g['noSqft']}</b> of {g['n']:,}" for g in G) + f" {y} sales report no square footage; they count in every figure except $/sf.</p>"
               + (f"<p>Big ones: " + "; ".join(f"<b>{r['addr']}</b> ({r['type']}, {_m(r['price'])}, {r['hood']})" for r in d['noSqftBig']) + ".</p>" if d["noSqftBig"] else ""))
    pthru = datetime.date.fromisoformat(d["priorThrough"]).strftime("%b %-d")
    mast = lambda t, sub: (f"<div class='page'><div class='mast'><div><div class='t'>{t}</div><div class='p'>{sub}</div></div>"
                           "<div class='by'>Chuck Heaver · Vanguard Properties<br>Closed sales, SFAR MLS (Residential + Residential Income)</div></div>")
    foot = (f"<div class='foot'><span>Closed sales (SFAR MLS, Residential + Residential Income). {y}: Jan 1 – {thru}; {py}: Jan 1 – {pthru} for "
            "year over year, the full year by quarter. Medians throughout; size and $/sf use only sales with reported square footage. "
            "YoY: % change; % of list in points, DOM in days.</span><span>page 7 / 9</span></div></div>")
    return (mast("Product Types", f"What each kind of property sells for — {y} vs {py}, Jan 1 – {thru}") + f"""
      <h2 class='pt-h'>Year to date by product type: Jan 1 – {thru}, {y} vs the same stretch of {py}</h2>
      <table class='pt'><tr><th class='l'>Type</th><th class='l'>Year</th><th>Units sold</th><th>Median price</th><th>Median size</th><th>Median $/sf</th><th>% of list</th><th>DOM</th></tr>{rows}</table>
      <div class='pt-grid'><div><h2>Inside “Other”: Jan 1 – {thru}</h2>
      <table class='pt'><tr><th class='l'>Type</th><th>Sold {y}</th><th>Sold {py}</th><th>Median {y}</th><th>Median {py}</th><th>YoY</th><th>Size {y}</th><th>$/sf {y}</th><th class='l'>Most sold in</th></tr>{other}</table></div>
      <div><h2>Where each type sells, {y}</h2><ul class='pt-facts'>{facts}</ul>
      <h2>Left out of $/sf: no square footage</h2><div class='pt-note'>{nsf_box}</div></div></div>""" + foot
      + mast("Product Types by Quarter", f"Each quarter of {y} against the same quarter of {py}; {py} shown in full") + f"""
      <h2 class='pt-h'>By quarter: median price · $/sf · size · units sold</h2>
      <table class='pt pt-q'><tr><th class='l'>Type</th><th class='l'>Year</th>{qh}</tr>{trend}</table>""" + foot)


CSS = """
.pt-lead { font-size:12.5px; line-height:1.45; margin:4px 0 8px; padding:7px 10px; background:#F6F1E2; border-left:4px solid #C9A227; }
.pt-grid { display:grid; grid-template-columns:1.15fr 1fr; gap:14px; }
.pt-grid h2, h2.pt-h { font-size:13px; margin:6px 0 4px; }
table.pt tr.y0 td { color:#6B6F75; } table.pt tr.yc td { font-size:9.5px; border-bottom:1.5px solid #C9C6BC; }
table.pt tr.y1 td, table.pt tr.y0 td { border-bottom:none; } table.pt td[rowspan] { border-bottom:1.5px solid #C9C6BC; vertical-align:top; }
table.pt .up { color:#1F6F43; } table.pt .dn { color:#A3332B; }
table.pt.pt-q td { font-size:11.5px; padding:6px 5px; } table.pt.pt-q small { font-size:10px; }
.pt-grid { margin-top:4px; }
table.pt { border-collapse:collapse; width:100%; font-size:10.5px; }
table.pt th, table.pt td { padding:3px 5px; border-bottom:1px solid #E3E1DA; text-align:right; }
table.pt th { font-size:9px; text-transform:uppercase; letter-spacing:.04em; color:#6B6F75; }
table.pt td { white-space:nowrap; } table.pt .l { text-align:left; white-space:normal; } table.pt small { color:#6B6F75; font-size:8.5px; }
.pt-note { font-size:10.3px; line-height:1.45; } .pt-note p { margin:2px 0 5px; }
ul.pt-facts { margin:0; padding-left:15px; font-size:10.3px; line-height:1.45; } ul.pt-facts li { margin:2px 0; }
"""
