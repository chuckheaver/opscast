#!/usr/bin/env python3
"""Prices by microclimate — the data for /microclimates/real-estate.

The report's Heat Map page and its "Microclimates and Real Estate" closings
grid, as data for an interactive page. It reuses micro.py (the fog zones, the
neighborhoods, the map projection and label points) so the page and the PDF
read the same fog zones, and the site's four sales categories
(app/lib/segments.js) instead of the report's three.

Published sales only — through the reporting period end, like the monthly
report (the October closings appear only on /market/duplex-vs-sfh).

    python3 reports/market/microclimate_market.py   →  app/lib/microclimate-market.json

Run it by hand after a data refresh (it is not part of build.sh).
"""
import datetime, json, math, os, statistics, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
sys.path.insert(0, HERE)
import micro

SRC = os.path.join(ROOT, "public", "data", "sf-listings.geojson")
OUT = os.path.join(ROOT, "app", "lib", "microclimate-market.json")
W_PX, H_PX = 612, 628
BBOX = (-122.516, 37.703, -122.355, 37.833)


def segments():
    js = "import('./app/lib/segments.js').then(m=>console.log(JSON.stringify(m.SEGMENTS)))"
    out = subprocess.check_output(["node", "--no-warnings", "-e", js], cwd=ROOT)
    return json.loads(out)


SEGS = segments()
CATS = [dict(key="all", label="All sales")] + [dict(key=s["key"], label=s["label"], short=s["short"]) for s in SEGS]
TYPE_CAT = {t: s["key"] for s in SEGS for t in s["types"]}


def cat_of(t): return TYPE_CAT.get(t or "", "other")        # any type not listed lands in Other


def same_day_last_year(d):
    try: return d.replace(year=d.year - 1)
    except ValueError: return d.replace(year=d.year - 1, day=28)


def window():
    end = datetime.date.fromisoformat(json.load(open(os.path.join(ROOT, "data", "reporting-period.json")))["periodEnd"])
    m1 = (end.replace(day=1), end)
    y1 = (datetime.date(end.year, 1, 1), end)
    return end, dict(m1=m1, m0=tuple(same_day_last_year(d) for d in m1), y1=y1, y0=tuple(same_day_last_year(d) for d in y1))


def med(v):
    v = [x for x in v if x is not None]
    return statistics.median(v) if v else None


def st(rows):
    """[n, median price, average price, median $/sf, median days on market, median sale-to-list %]"""
    if not rows: return [0, None, None, None, None, None]
    pr = [r["p"] for r in rows]
    return [len(rows), round(med(pr)), round(sum(pr) / len(pr)),
            round(med([r["p"] / r["s"] for r in rows if r["s"]]) or 0) or None,
            round(med([r["dom"] for r in rows if r["dom"] is not None]) or 0) if any(r["dom"] is not None for r in rows) else None,
            round(med([100 * r["p"] / r["l"] for r in rows if r["l"]]) or 0) or None]


def load(end):
    rows = []
    for f in json.load(open(SRC))["features"]:
        p = f["properties"]; d = str(p.get("sellingDate") or "")[:10]
        pr = float(p.get("sellingPrice") or 0)
        if pr <= 0 or not d or d > end.isoformat(): continue
        num = lambda k: float(p[k]) if p.get(k) not in (None, "") and float(p[k]) > 0 else None
        z = micro.sale_zone(p)
        rows.append(dict(d=d, p=pr, s=num("sqft"), l=num("listPrice"), dom=float(p["dom"]) if p.get("dom") not in (None, "") else None,
                         cat=cat_of(p.get("propType")), hood=p.get("fogNeighborhood"), zone=z["name"] if z else None))
    return rows


def project():
    W0, S0, E0, N0 = BBOX
    lat0 = math.radians((S0 + N0) / 2); sx = (E0 - W0) * math.cos(lat0); sy = N0 - S0
    sc = min(W_PX / sx, H_PX / sy); ox = (W_PX - sx * sc) / 2; oy = (H_PX - sy * sc) / 2
    P = lambda lng, lat: (ox + (lng - W0) * math.cos(lat0) * sc, oy + (N0 - lat) * sc)
    return P, sc


def path(P, geom):
    return "".join("M" + "L".join("%.1f,%.1f" % P(x, y) for x, y in r) + "Z" for rings in micro._rings(geom) for r in rings)


def main():
    end, win = window()
    rows = load(end)
    P, sc = project()
    shp = json.load(open(os.path.join(ROOT, "public/data/map-shapes.json")))
    con = json.load(open(os.path.join(ROOT, "public/data/sf-fog-contours.geojson")))
    size = lambda f: sum(micro._area(rs[0]) for rs in micro._rings(f["geometry"]))
    zidx = {z["name"]: i for i, z in enumerate(micro.ZONES)}
    contours = [dict(z=zidx[micro.zone_of_hours(f["properties"]["hours"])["name"]], d=path(P, f["geometry"]))
                for f in sorted(con["features"], key=size, reverse=True)]          # largest first; smaller ones cover them

    inw = lambda r, w: w[0].isoformat() <= r["d"] <= w[1].isoformat()
    hoods = []
    for hd in micro.neighborhoods([], set(), lambda r: {}, (), ()):
        rs_all = [r for r in rows if r["hood"] == hd["name"]]
        rings = max(micro._rings(hd["geom"]), key=lambda rs: micro._area(rs[0]))
        (lx, ly), depth = micro.label_point(rings)
        x, y = P(lx, ly)
        s = {}
        for c in CATS:
            rs = rs_all if c["key"] == "all" else [r for r in rs_all if r["cat"] == c["key"]]
            s[c["key"]] = dict(a=st([r for r in rs if inw(r, win["y1"])]), b=st([r for r in rs if inw(r, win["y0"])]))
        hoods.append(dict(name=hd["name"], d=path(P, hd["geom"]), x=round(x, 1), y=round(y, 1), depth=round(depth * sc, 1),
                          zone=zidx[hd["zone"]["name"]], temp=hd["temp"], hours=round(hd["hours"], 1), homes=hd["homes"],
                          mix={k: round(v, 2) for k, v in hd["mix"].items() if v}, s=s))
    # Closings by fog zone: category × zone (+ all zones) × month / same month last year / YTD / same stretch last year
    zones = []
    for i, z in enumerate(micro.ZONES):
        hs = [h for h in hoods if h["zone"] == i]
        zones.append(dict(k=z["k"], name=z["name"], fill=z["fill"], ink=z["ink"], rng=z["rng"], count=len(hs),
                          temp=[min(h["temp"] for h in hs), max(h["temp"] for h in hs)]))
    grid = {}
    for c in CATS:
        rs_c = rows if c["key"] == "all" else [r for r in rows if r["cat"] == c["key"]]
        for zn in [z["name"] for z in micro.ZONES] + ["All zones"]:
            rs_z = rs_c if zn == "All zones" else [r for r in rs_c if r["zone"] == zn]
            grid.setdefault(c["key"], {})[zn] = {k: st([r for r in rs_z if inw(r, w)]) for k, w in win.items()}
    km = sc / 111.32
    out = dict(through=end.isoformat(), month=end.strftime("%b %y"), monthPrior=same_day_last_year(end).strftime("%b %y"),
               ytd=f"YTD {str(end.year)[2:]}", ytdPrior=f"YTD {str(end.year - 1)[2:]}", year=end.year,
               cats=CATS, zones=zones, map=dict(w=W_PX, h=H_PX, land=path(P, shp["land"]), contours=contours, mile=round(km * 1.609, 1)),
               hoods=hoods, grid=grid, fogNote=micro.FOG_NOTE)
    json.dump(out, open(OUT, "w"), separators=(",", ":"))
    print(f"wrote {os.path.relpath(OUT, ROOT)}: {len(hoods)} neighborhoods, {len(rows):,} sales through {end}; {os.path.getsize(OUT)/1024:.0f} KB")


if __name__ == "__main__":
    main()
