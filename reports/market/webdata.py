#!/usr/bin/env python3
"""The market report's figures as data, for the interactive web edition of
Market Stats (/market/report). The PDF and the web pages show the same content:
this script runs the report's own code (cover3.py, market-grid-v2.py,
product.py) and writes what each page shows, instead of drawing it.

    python3 reports/market/webdata.py        (build.sh runs it after the report)

Writes app/market/report/web-stats.json (every page's figures) and
public/data/report-sales.json (the sales behind them, fetched on demand when a
reader drills into a neighborhood, fog zone or chart).
"""
import collections, datetime, importlib.util, json, os, statistics

HERE = os.path.dirname(os.path.abspath(__file__))
_s = importlib.util.spec_from_file_location("cover3", os.path.join(HERE, "cover3.py"))
c3 = importlib.util.module_from_spec(_s); _s.loader.exec_module(c3)
cv, mg, pt = c3.cv, c3.mg, c3.pt
import micro

ROOT = mg.ROOT
SF, CO, OT = mg.SF, mg.CO, mg.OT
SEGS = [("sfh", SF), ("co", CO), ("ot", OT)]
SEGKEY = {t: k for k, s in SEGS for t in mg.SEG[s]}


def short(r):
    return r["address"].split(",")[0]


def main():
    pages, plabel, labels, W, seg, top, S, mon = cv.facts()
    mo = datetime.date.fromisoformat(W["m1"][0]); end = datetime.date.fromisoformat(W["m1"][1])
    partial = (end + datetime.timedelta(days=1)).day != 1
    yy = mo.year; py = yy - 1

    # ── By the Numbers band (the home page's figures) ──
    kboxes, kthru, kyy, kpy = c3.site_kpis()
    kpis = [dict(key=k, title=t, rows=[dict(label=l, now=str(n), then=str(th), chg=c, big=b) for l, n, th, c, b in rows]) for k, t, rows in kboxes]

    # ── monthly units / volume, and sale vs list ──
    ms = c3.monthly_series()
    r25m = {r["m"]: r for r in ms[py]}; r26m = {r["m"]: r for r in ms[yy] if r["m"] <= mo.month}
    m0 = S["m0"]
    m0seg = {k: [r for r in m0 if r["propType"] in mg.SEG[s]] for k, s in SEGS}
    months = []
    for m in range(1, 13):
        a, b = r25m.get(m), r26m.get(m)
        row = dict(m=m, prior=dict(sfh=a["sfh"], co=a["cd"], ot=a["oth"], sfh_v=a["sfh_v"], co_v=a["cd_v"], ot_v=a["oth_v"]) if a else None,
                   cur=dict(sfh=b["sfh"], co=b["cd"], ot=b["oth"], sfh_v=b["sfh_v"], co_v=b["cd_v"], ot_v=b["oth_v"]) if b else None,
                   list=dict(sfh=b["mlist"], co=b["clist"], ot=b["olist"]) if b else None,
                   sold=dict(sfh=b["msold"], co=b["csold"], ot=b["osold"]) if b else None,
                   priorSold=dict(sfh=a["msold"], co=a["csold"], ot=a["osold"]) if a else None)
        # The partial month is compared with the same days of last year's month.
        if partial and m == mo.month:
            row["priorSame"] = dict({k: len(v) for k, v in m0seg.items()}, **{k + "_v": sum(r["sellingPrice"] for r in v) for k, v in m0seg.items()},
                                    **{"sold_" + k: (statistics.median([r["sellingPrice"] for r in v]) if v else None) for k, v in m0seg.items()})
        months.append(row)
    ytd = dict(units=len(S["y1"]), unitsPrior=len(S["y0"]), vol=sum(r["sellingPrice"] for r in S["y1"]), volPrior=sum(r["sellingPrice"] for r in S["y0"]),
               unitsPriorYear=sum(r["sfh"] + r["cd"] + r["oth"] for r in ms[py]), volPriorYear=sum(r["vol"] for r in ms[py]))

    # ── allocation of money ──
    split, n, tot = c3.money_split(S["y1"])
    tiers = [dict(label=t["lab"], color=t["col"], n=t["n"], v=t["v"]) for t in split]
    types = [dict(key=k, label=mg.TITLE[s], n=sum(1 for r in S["y1"] if r["propType"] in mg.SEG[s]),
                  v=sum(r["sellingPrice"] for r in S["y1"] if r["propType"] in mg.SEG[s])) for k, s in SEGS]
    byh = collections.defaultdict(lambda: [0, 0])
    for r in S["y1"]:
        h = mg.hood(r)
        if h: byh[h][0] += r["sellingPrice"]; byh[h][1] += 1
    hoods = [dict(name=h, v=v, n=c) for h, (v, c) in sorted(byh.items(), key=lambda kv: -kv[1][0])]

    # ── the 10s (this year only) ──
    Y1 = S["y1"]
    ratio = lambda r: r["sellingPrice"] / r["listPrice"] if r.get("listPrice") else None
    sale = lambda r: dict(id=str(r.get("id", "")), a=short(r), p=r["sellingPrice"], l=r.get("listPrice"), s=r.get("sqft"),
                          pct=round(100 * ratio(r)) if ratio(r) else None, ppsf=round(r["sellingPrice"] / r["sqft"]) if r.get("sqft") else None,
                          d=r["sellingDate"][:10], h=mg.hood(r))
    def bynb(seg_types=None):
        out = collections.defaultdict(list)
        for r in Y1:
            if mg.hood(r) and (seg_types is None or r["propType"] in seg_types): out[mg.hood(r)].append(r)
        return out
    def nb_med(types_, low=False):
        rk = sorted([(a, statistics.median(r["sellingPrice"] for r in rs), len(rs)) for a, rs in bynb(types_).items() if rs], key=lambda t: (t[1] if low else -t[1]))[:10]
        return [dict(name=a, med=m, n=c) for a, m, c in rk]
    segrows = lambda types_: [r for r in Y1 if r["propType"] in types_]
    tens = {}
    for k, s in SEGS:
        T = mg.SEG[s]
        tens[k] = dict(
            hoods=nb_med(T), hoodsLow=nb_med(T, low=True),
            top=[sale(r) for r in sorted(segrows(T), key=lambda r: -r["sellingPrice"])[:10]],
            low=[sale(r) for r in sorted([r for r in segrows(T) if r.get("sqft")], key=lambda r: r["sellingPrice"])[:10]],
            ppsf=[sale(r) for r in sorted([r for r in segrows(T) if r.get("sqft")], key=lambda r: -r["sellingPrice"] / r["sqft"])[:10]],
            over=[sale(r) for r in sorted([r for r in segrows(T) if ratio(r)], key=lambda r: -ratio(r))[:10]],
        )
    busiest = [dict(name=a, n=len(rs), med=statistics.median(r["sellingPrice"] for r in rs)) for a, rs in sorted(bynb().items(), key=lambda kv: -len(kv[1]))[:10]]

    # ── By the Numbers tiles and units by week ──
    bn = c3.by_numbers(Y1, W["m1"][1])
    wrows, wcut, w25y, w26, wlast, w25 = c3.weekly_series(W["m1"][1])
    weeks = [dict(w=r["w"], a=r["a"], b=r["b"], d=r["d"]) for r in wrows]

    # ── market grids: every neighborhood, each segment, with the fog-zone rows ──
    keys = ("n", "price", "avg", "ppsf", "dom", "pct")
    pick = lambda st: {w: {k: st[w].get(k) for k in keys} for w in ("m1", "m0", "y1", "y0")}
    grids = []
    for name, byA, tot_, byZ, byD, notes in pages:
        k = {SF: "sfh", CO: "co", OT: "ot"}[name]
        grids.append(dict(key=k, title=mg.TITLE[name],
                          rows=[dict(name=nm, code=nid, st=pick(st), note=notes.get(nm)) for nm, nid, st in byD],
                          total=pick(tot_),
                          zones=[dict(name=zn, color=col, range=rng, st=pick(st)) for zn, col, rng, st in byZ]))

    # ── cost of ownership ──
    rates = [6.10, 6.50, c3.MTG_NOW, 7.50]
    P = lambda price, r: c3.mtg_pmt(price * 0.8, r)
    cost = dict(
        asOf="Oct 28, 2026", survey="Oct 22", medSfh=c3.MED_SFH, medCo=c3.MED_CO, propTax=c3.PROP_TAX,
        mtgNow=c3.MTG_NOW, tenNow=c3.TEN_NOW, twoNow=c3.TWO_NOW,
        payments=[dict(rate=r, sfh=P(c3.MED_SFH, r), co=P(c3.MED_CO, r)) for r in rates],
        spread=[dict(m=m, mtg=v, ten=t) for (m, v), t in zip(
            [(k, ({**dict(cv.RATES), "Sep": cv.RATE_SEP_END, "Oct": cv.RATE_NOW})[k]) for k in ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"]],
            [4.24, 4.04, 4.38, 4.30, 4.50, 4.44, 4.75, 4.78, 5.29, c3.TEN_NOW])],
        curve=[dict(t=t, v=v) for t, v in c3.CURVE],
        tenY=[dict(m=m, v=v) for m, v in c3.TEN_Y],
        lux={str(y): [c3.lux_series(yy)[y].get(m, 0) for m in range(1, 13)] for y in (py, yy)},
        luxYtd=sum(1 for r in Y1 if r["sellingPrice"] >= 5e6), luxYtdPrior=sum(1 for r in S["y0"] if r["sellingPrice"] >= 5e6),
    )

    out = dict(
        run=datetime.date.today().isoformat(), period=dict(m1=W["m1"], m0=W["m0"], y1=W["y1"], y0=W["y0"], partial=partial, year=yy, prior=py),
        labels=labels, plabel=plabel, kpis=dict(boxes=kpis, through=kthru, yy=kyy, py=kpy),
        months=months, ytd=ytd, alloc=dict(tiers=tiers, types=types, hoods=hoods, n=n, total=tot),
        tens=dict(segs=tens, busiest=busiest), bn=bn, weeks=dict(rows=weeks, cut=wcut, ytd=w26, ytdPrior=w25, priorYear=w25y),
        grids=grids, cost=cost,
    )
    p = os.path.join(ROOT, "app", "market", "report", "web-stats.json")
    json.dump(out, open(p, "w"), separators=(",", ":"), default=float)

    # The sales behind every figure, both years' stretches, fetched on demand.
    zone = lambda r: (micro.sale_zone(r) or {}).get("name")
    sales = []
    for w in ("y1", "y0"):
        for r in S[w]:
            k = SEGKEY.get(r["propType"])
            if not k: continue
            sales.append([str(r.get("id", "")), short(r), r["sellingDate"][:10], r["sellingPrice"], r.get("listPrice"), r.get("sqft"),
                          r.get("dom"), k, mg.hood(r), zone(r), r["propType"], 1 if r.get("status") == "Sold Off MLS" else 0])
    q = os.path.join(ROOT, "public", "data", "report-sales.json")
    json.dump(dict(cols=["id", "a", "d", "p", "l", "s", "dom", "seg", "h", "z", "t", "off"], rows=sales), open(q, "w"), separators=(",", ":"))
    print(f"wrote {os.path.relpath(p, ROOT)} ({os.path.getsize(p)//1024} KB) and {os.path.relpath(q, ROOT)} ({len(sales):,} sales, {os.path.getsize(q)//1024} KB)")


if __name__ == "__main__":
    main()
