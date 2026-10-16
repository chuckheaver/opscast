#!/usr/bin/env python3
"""Sales the market report leaves out of anything, for the owner to review
after each monthly refresh:  python3 reports/market/outliers.py

The owner's rule: every closed sale is a reportable sale — below-market-rate
(BMR) units under $500K included, and reported square footage stands as
given. The one exclusion is a sale with NO square footage reported: it can't
have a $/sf, so it is left out of $/sf figures (the grids' Median $/SF and
The 10s' Top $/sf) and of The 10s' Lowest 10 tables, and the notes say so.
It is still counted in sale counts and price medians.

Lists those sales for this year to date and the same stretch last year, and
writes out/outliers.csv.
"""
import csv, json, os, importlib.util

HERE = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location("mg", os.path.join(HERE, "market-grid-v2.py"))
mg = importlib.util.module_from_spec(spec); spec.loader.exec_module(mg)

F = [f["properties"] for f in json.load(open(mg.SRC))["features"]]
_, thru = mg.last_full_month()
WINDOWS = {thru.year: (f"{thru.year}-01-01", thru.isoformat()),
           thru.year - 1: (f"{thru.year-1}-01-01", thru.replace(year=thru.year - 1).isoformat())}
SFH = mg.SEG["Single Family Residences"]

rows = []
for yr, (lo, hi) in WINDOWS.items():
    for r in F:
        if r.get("sellingPrice") and lo <= (r.get("sellingDate") or "")[:10] <= hi and not r.get("sqft"):
            rows.append(dict(year=yr, id=r.get("id"), address=r["address"].split(",")[0],
                             neighborhood=r.get("fogNeighborhood") or "", type=r["propType"],
                             segment="SFH" if r["propType"] in SFH else "Condo/TIC/Other",
                             date=r["sellingDate"][:10], price=r["sellingPrice"], list=r.get("listPrice") or "",
                             status=r.get("status") or "", why="no square footage reported"))
rows.sort(key=lambda x: (-x["year"], x["segment"], x["price"]))
os.makedirs(os.path.join(HERE, "out"), exist_ok=True)
with open(os.path.join(HERE, "out", "outliers.csv"), "w", newline="") as fh:
    w = csv.DictWriter(fh, fieldnames=["year", "id", "address", "neighborhood", "type", "segment", "date", "price", "list", "status", "why"])
    w.writeheader(); w.writerows(rows)
for x in rows:
    print(f"{x['year']} | {x['segment']:<15} | {x['address']:<32} | {x['neighborhood']:<24} | ${x['price']:>11,.0f} | {x['date']} | MLS {x['id']}")
for yr in WINDOWS:
    print(f"{yr}: {sum(1 for x in rows if x['year']==yr)} sales with no square footage")
print("→ reports/market/out/outliers.csv")
