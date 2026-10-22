#!/usr/bin/env python3
"""SFH vs Duplex by neighborhood — the data for /market/duplex-vs-sfh.

This is the ONE report that includes the closings after the reporting period
end (the October closings that apply-sale-decisions.mjs holds out of the sales
file, data/held-sales.geojson): the owner asked for it that way (Oct 22 2026).
Nothing else reads them. It is deliberately NOT part of build.sh, so the monthly
report and the site's stats still stop at the period end. Run it by hand after
a data refresh:

    python3 reports/market/duplex_sfh.py     →  app/lib/duplex-vs-sfh.json

Medians throughout. SFH = Single Family Residence and Halfplex; Duplex =
Duplex (product.py's groups; 2 Houses on Lot is SFH, the owner, Oct 22 2026). Every sale of the year so far
counts except the ones in LEFT_OUT.
"""
import json, os, statistics, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
sys.path.insert(0, HERE)
import product as P

PUBLISHED = os.path.join(ROOT, "public", "data", "sf-listings.geojson")
HELD = os.path.join(ROOT, "data", "held-sales.geojson")
OUT = os.path.join(ROOT, "app", "lib", "duplex-vs-sfh.json")

# Left out of this analysis by the owner (Oct 22 2026), footnoted on the page.
LEFT_OUT = {"425057328": "67-69 Belcher St (Duboce Triangle, sold 9/25/26 for $6.78M) is left out: it is a flex space / loft building of about 19,000 sf, not a true duplex."}
OUTLIER_PPSF = 1.5      # a duplex above this multiple of the city's duplex median $/sf
OUTLIER_OVER = 50.0     # or sold this much over list (percent)


def med(v):
    v = [x for x in v if x is not None]
    return statistics.median(v) if v else None


def load():
    rows, held_ids = [], set()
    for src, path in (("published", PUBLISHED), ("held", HELD)):
        for f in json.load(open(path))["features"]:
            p = f["properties"]
            sid = str(p.get("id"))
            if src == "held": held_ids.add(sid)
            if sid in LEFT_OUT: continue
            d = str(p.get("sellingDate") or "")[:10]
            pr = float(p.get("sellingPrice") or 0)
            if pr <= 0 or not d.startswith("2026"): continue
            g = P.group_of(p.get("propType") or "")
            if g not in ("sfh", "duplex"): continue
            num = lambda k: float(p[k]) if p.get(k) not in (None, "") and float(p[k]) > 0 else None
            sq, ls = num("sqft"), num("listPrice")
            rows.append(dict(id=sid, g=g, h=p.get("fogNeighborhood") or "", a=str(p.get("address") or "").split(",")[0], d=d,
                             p=pr, l=ls, s=sq, pp=pr / sq if sq else None, o=100 * (pr / ls - 1) if ls else None, late=src == "held"))
    return rows


def stats(rs):
    return dict(n=len(rs), price=med([r["p"] for r in rs]), over=med([r["o"] for r in rs]), ppsf=med([r["pp"] for r in rs]))


def sale(r):
    return dict(id=r["id"], a=r["a"], d=r["d"], p=round(r["p"]), l=round(r["l"]) if r["l"] else None,
                o=round(r["o"], 1) if r["o"] is not None else None, s=round(r["s"]) if r["s"] else None,
                pp=round(r["pp"]) if r["pp"] else None, **({"late": 1} if r["late"] else {}))


def rnd(st):
    return dict(n=st["n"], price=round(st["price"]) if st["price"] else None,
                over=round(st["over"], 1) if st["over"] is not None else None, ppsf=round(st["ppsf"]) if st["ppsf"] else None)


def main():
    rows = load()
    last = max(r["d"] for r in rows)
    city_pp = med([r["pp"] for r in rows if r["g"] == "duplex"])
    out = dict(from_="2026-01-01", through=last, cityDuplexPpsf=round(city_pp),
               excluded=list(LEFT_OUT.values()), hoods=[])
    by = {}
    for r in rows: by.setdefault(r["h"], {"sfh": [], "duplex": []})[r["g"]].append(r)
    for h, v in sorted(by.items(), key=lambda kv: kv[0].lower()):
        if not v["duplex"] and h: continue                     # only neighborhoods with a duplex sale
        s, d = stats(v["sfh"]), stats(v["duplex"])
        flags = []
        for r in sorted(v["duplex"], key=lambda r: -(r["pp"] or 0)):
            hi = bool(r["pp"] and r["pp"] > OUTLIER_PPSF * city_pp)
            ov = r["o"] is not None and r["o"] >= OUTLIER_OVER
            if hi or ov: flags.append(dict(id=r["id"], a=r["a"], pp=round(r["pp"]) if hi else None, pct=round(r["o"] + 100) if ov else None, late=int(r["late"])))
        ok = s["n"] >= 3
        out["hoods"].append(dict(
            name=h or "No neighborhood", thin=d["n"] < 4,
            sfh=rnd(s), duplex=rnd(d),
            diff=dict(price=round(100 * (d["price"] / s["price"] - 1), 1) if ok and d["price"] and s["price"] else None,
                      over=round(d["over"] - s["over"], 1) if ok and d["over"] is not None and s["over"] is not None else None,
                      ppsf=round(100 * (d["ppsf"] / s["ppsf"] - 1), 1) if ok and d["ppsf"] and s["ppsf"] else None),
            outliers=flags,
            sales=dict(sfh=[sale(r) for r in sorted(v["sfh"], key=lambda r: -r["p"])], duplex=[sale(r) for r in sorted(v["duplex"], key=lambda r: -r["p"])])))
    # San Francisco: every sale, including any with no neighborhood
    sf, dp = [r for r in rows if r["g"] == "sfh"], [r for r in rows if r["g"] == "duplex"]
    s, d = stats(sf), stats(dp)
    out["city"] = dict(sfh=rnd(s), duplex=rnd(d),
                       diff=dict(price=round(100 * (d["price"] / s["price"] - 1), 1), over=round(d["over"] - s["over"], 1), ppsf=round(100 * (d["ppsf"] / s["ppsf"] - 1), 1)))
    listed = {id(r) for v in by.values() if v["duplex"] for k in ("sfh", "duplex") for r in v[k]}
    out["unlisted"] = dict(sfh=[sale(r) for r in sf if id(r) not in listed], duplex=[sale(r) for r in dp if id(r) not in listed])
    json.dump(out, open(OUT, "w"), separators=(",", ":"))
    print(f"wrote {os.path.relpath(OUT, ROOT)}: {len(out['hoods'])} neighborhoods through {last}; SF {s['n']} SFH, {d['n']} duplex; "
          f"{os.path.getsize(OUT)/1024:.0f} KB; {len(out['unlisted']['sfh'])}+{len(out['unlisted']['duplex'])} sales outside the listed neighborhoods")


if __name__ == "__main__":
    main()
