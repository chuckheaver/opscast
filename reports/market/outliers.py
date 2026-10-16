#!/usr/bin/env python3
"""Sales the market report treats as data errors, for the owner to review each
month. Run after a data refresh:  python3 reports/market/outliers.py

Rules (the same ones The 10s applies):
  price     sale under $100K — parking spaces, storage, placeholder prices.
            Left out of the Lowest 10 tables.
  list      list price under $300K, or sold for more than 3x list — a stale
            or placeholder list price, not a bid. Left out of the Overbids tables.
  sqft      $/sf more than 2.5x (houses) or 3x (condos) the sale's own
            neighborhood median — a square-footage error. Left out of Top $/sf.

Every flagged sale is still counted in the grids, the medians and By the
Numbers unless the owner decides otherwise. Writes out/outliers.csv and prints
a table; covers this year to date and the same stretch last year.
"""
import csv, json, os, statistics, collections, datetime, importlib.util

HERE = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location("mg", os.path.join(HERE, "market-grid-v2.py"))
mg = importlib.util.module_from_spec(spec); spec.loader.exec_module(mg)

F = [f["properties"] for f in json.load(open(mg.SRC))["features"]]
_, thru = mg.last_full_month()
WINDOWS = {thru.year: (f"{thru.year}-01-01", thru.isoformat()),
           thru.year - 1: (f"{thru.year-1}-01-01", thru.replace(year=thru.year - 1).isoformat())}
SFH = mg.SEG["Single Family Residences"]
seg_of = lambda r: "SFH" if r["propType"] in SFH else "Condo/TIC/Other"
CAP = {"SFH": 2.5, "Condo/TIC/Other": 3}

rows = []
for yr, (lo, hi) in WINDOWS.items():
    ys = [r for r in F if r.get("sellingPrice") and lo <= (r.get("sellingDate") or "")[:10] <= hi]
    psf = lambda r: r["sellingPrice"] / r["sqft"]
    med = {}
    for seg in ("SFH", "Condo/TIC/Other"):
        g = collections.defaultdict(list)
        for r in ys:
            if seg_of(r) == seg and r.get("sqft") and r.get("fogNeighborhood"): g[r["fogNeighborhood"]].append(psf(r))
        med[seg] = {k: statistics.median(v) for k, v in g.items()}
    for r in ys:
        seg = seg_of(r); why = []
        if r["sellingPrice"] < 100_000:
            why.append("price under $100K")
        lp = r.get("listPrice")
        if lp and lp < 300_000 and r["sellingPrice"] >= 100_000:
            why.append(f"list price ${lp:,.0f}")
        if lp and r["sellingPrice"] / lp > 3:
            why.append(f"sold at {100*r['sellingPrice']/lp:.0f}% of list")
        m = med[seg].get(r.get("fogNeighborhood"))
        if r.get("sqft") and m and psf(r) > CAP[seg] * m:
            why.append(f"$/sf {psf(r):,.0f} = {psf(r)/m:.1f}x neighborhood")
        if why:
            rows.append(dict(year=yr, id=r.get("id"), address=r["address"].split(",")[0], neighborhood=r.get("fogNeighborhood") or "",
                             type=r["propType"], segment=seg, date=r["sellingDate"][:10], price=r["sellingPrice"], list=lp or "",
                             sqft=r.get("sqft") or "", status=r.get("status") or "", why="; ".join(why)))

rows.sort(key=lambda x: (-x["year"], x["segment"], x["why"], x["price"]))
os.makedirs(os.path.join(HERE, "out"), exist_ok=True)
with open(os.path.join(HERE, "out", "outliers.csv"), "w", newline="") as fh:
    w = csv.DictWriter(fh, fieldnames=list(rows[0].keys()) if rows else ["year"]); w.writeheader(); w.writerows(rows)
for x in rows:
    print(f"{x['year']} | {x['segment']:<15} | {x['address']:<30} | {x['neighborhood']:<24} | ${x['price']:>11,.0f} | "
          f"list {('$'+format(x['list'],',.0f')) if x['list'] else '—':>12} | {str(x['sqft']):>6} sf | {x['date']} | {x['why']}")
print(f"{len(rows)} flagged sales → reports/market/out/outliers.csv")
