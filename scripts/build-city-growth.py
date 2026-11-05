#!/usr/bin/env python3
"""How the city's housing was built out, for the presentation's growth map
(/microclimates/presentation): every residential building on the San Francisco
Assessor's secured roll, with the year it was built, its type in the site's four
categories and its summer fog zone.

    python3 scripts/build-city-growth.py            (downloads the roll, ~200k parcels)
    python3 scripts/build-city-growth.py --cache DIR (reuses p*.json pages saved there)

Source: DataSF, Assessor Historical Secured Property Tax Rolls (wv5m-vpq2), the
latest closed roll. Condo units are separate parcels on the roll; they are
grouped into their building (same location) and the building takes its earliest
year. Year built is the Assessor's; many older buildings carry 1900 when the
true year is not recorded, so the map treats pre-1906 dates as "by 1906".

Writes public/data/city-growth.bin (every building: x, y as uint16 in 1/50 px of
the site's city map — the projection of app/lib/microclimate-market.json — then
year − 1800 and type as uint8, 6 bytes each, oldest first) and
app/lib/city-growth.json (summaries by decade, type and fog zone).
"""
import collections, glob, json, math, os, statistics, struct, sys, urllib.parse, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, ".."))
sys.path.insert(0, os.path.join(ROOT, "reports", "market"))
import micro                                                   # fog zones, ring helpers

BBOX = (-122.516, 37.703, -122.355, 37.833)                    # microclimate_market.py
W_PX, H_PX = 612, 628
API = "https://data.sf.gov/resource/wv5m-vpq2.json"
FIELDS = "parcel_number,use_code,property_class_code_definition,year_property_built,number_of_units,the_geom"

# Assessor property classes → the site's four categories (app/lib/segments.js).
CONDO = ("Condominium", "Coop", "TIC", "Town House", "PUD", "TI Apartment")
SFH = ("Dwelling", "2 Dwellings on 1 Parcel")


def project():
    W0, S0, E0, N0 = BBOX
    lat0 = math.radians((S0 + N0) / 2); sx = (E0 - W0) * math.cos(lat0); sy = N0 - S0
    sc = min(W_PX / sx, H_PX / sy); ox = (W_PX - sx * sc) / 2; oy = (H_PX - sy * sc) / 2
    return lambda lng, lat: (ox + (lng - W0) * math.cos(lat0) * sc, oy + (N0 - lat) * sc)


def fetch(cache):
    rows = []
    if cache and glob.glob(os.path.join(cache, "p*.json")):
        for f in sorted(glob.glob(os.path.join(cache, "p*.json"))): rows += json.load(open(f))
        return rows
    yr = json.load(urllib.request.urlopen(API + "?" + urllib.parse.urlencode({"$select": "max(closed_roll_year)"})))[0]["max_closed_roll_year"]
    off = 0
    while True:
        q = urllib.parse.urlencode({"$select": FIELDS, "$where": f"closed_roll_year='{yr}'", "$order": "parcel_number", "$limit": 50000, "$offset": off})
        page = json.load(urllib.request.urlopen(API + "?" + q, timeout=300))
        rows += page; off += len(page)
        if len(page) < 50000: return rows


def category(cls, units):
    cls = cls or ""
    if any(k in cls for k in CONDO): return "condo"
    if cls.startswith(SFH) and "Apt" not in cls: return "sfh"
    if units == 2: return "duplex"
    return "other"


def main():
    cache = sys.argv[sys.argv.index("--cache") + 1] if "--cache" in sys.argv else None
    rows = fetch(cache)
    P = project()

    # Fog hours at a point: the smallest fog contour that holds it (they nest).
    con = json.load(open(os.path.join(ROOT, "public/data/sf-fog-contours.geojson")))["features"]
    polys = []
    for f in con:
        for rs in micro._rings(f["geometry"]):
            xs = [p[0] for p in rs[0]]; ys = [p[1] for p in rs[0]]
            polys.append((micro._area(rs[0]), (min(xs), min(ys), max(xs), max(ys)), rs, f["properties"]["hours"]))
    polys.sort(key=lambda t: t[0])
    def inside(x, y, ring):
        c = False
        for (x1, y1), (x2, y2) in zip(ring, ring[1:] + ring[:1]):
            if (y1 > y) != (y2 > y) and x < (x2 - x1) * (y - y1) / (y2 - y1) + x1: c = not c
        return c
    def fog_zone(lng, lat):
        for _, (a, b, c, d), rs, h in polys:
            if a <= lng <= c and b <= lat <= d and inside(lng, lat, rs[0]) and not any(inside(lng, lat, hole) for hole in rs[1:]):
                return micro.zone_of_hours(h)["name"]
        return None

    # Residential parcels → buildings (condo units share a location).
    bld = {}
    for r in rows:
        if r.get("use_code") not in ("SRES", "MRES", "MISC") or not r.get("the_geom") or not r.get("year_property_built"): continue
        y = int(float(r["year_property_built"])); u = float(r.get("number_of_units") or 0)
        if y < 1800 or y > 2030: continue
        if r["use_code"] == "MISC" and u <= 0: continue          # mixed use with no homes
        lng, lat = r["the_geom"]["coordinates"]
        k = (round(lng, 5), round(lat, 5))
        b = bld.setdefault(k, {"y": y, "units": 0, "cats": collections.Counter()})
        b["y"] = min(b["y"], y); b["units"] += max(u, 1)
        b["cats"][category(r.get("property_class_code_definition"), u)] += 1
    pts, units_dec, bld_dec, zone_years, zone_units = [], collections.defaultdict(collections.Counter), collections.defaultdict(collections.Counter), collections.defaultdict(list), collections.defaultdict(collections.Counter)
    TYPES = ["sfh", "condo", "duplex", "other"]
    for (lng, lat), b in bld.items():
        cat = "condo" if b["cats"]["condo"] else b["cats"].most_common(1)[0][0]
        x, y = P(lng, lat)
        if not (0 <= x <= W_PX and 0 <= y <= H_PX): continue
        pts.append([round(x, 1), round(y, 1), b["y"], TYPES.index(cat)])
        dec = max(1900, b["y"] // 10 * 10) if b["y"] >= 1900 else 1890        # "by 1900" bucket
        units_dec[dec][cat] += b["units"]; bld_dec[dec][cat] += 1
        z = fog_zone(lng, lat)
        if z: zone_years[z].append(b["y"]); zone_units[z][cat] += b["units"]
    pts.sort(key=lambda p: p[2])
    zones = []
    for z in micro.ZONES:
        ys = zone_years.get(z["name"], [])
        tot = sum(zone_units[z["name"]].values()) or 1
        zones.append(dict(name=z["name"], buildings=len(ys), median=int(statistics.median(ys)) if ys else None,
                          pre1940=round(sum(1 for v in ys if v < 1940) / max(len(ys), 1), 3),
                          units={t: zone_units[z["name"]][t] for t in TYPES}, unitShare={t: round(zone_units[z["name"]][t] / tot, 3) for t in TYPES}))
    out = dict(source="San Francisco Assessor, secured roll (DataSF wv5m-vpq2)", buildings=len(pts), types=TYPES,
               decades=[dict(d=d, units={t: int(units_dec[d][t]) for t in TYPES}, buildings={t: bld_dec[d][t] for t in TYPES}) for d in sorted(units_dec)],
               zones=zones, w=W_PX, h=H_PX, scale=50, record=6,
               yearsMin=pts[0][2], yearsMax=pts[-1][2])
    q = os.path.join(ROOT, "public", "data", "city-growth.bin")
    with open(q, "wb") as f:
        for x, y, yr, t in pts: f.write(struct.pack("<HHBB", round(x * 50), round(y * 50), yr - 1800, t))
    p = os.path.join(ROOT, "app", "lib", "city-growth.json")
    json.dump(out, open(p, "w"), indent=1)
    print(f"wrote {os.path.relpath(q, ROOT)}: {len(pts):,} buildings, {os.path.getsize(q) // 1024} KB; {os.path.relpath(p, ROOT)}")
    for z in zones: print(f"  {z['name']:15s} {z['buildings']:6,} bldgs  median built {z['median']}  pre-1940 {z['pre1940']:.0%}  units {z['unitShare']}")


if __name__ == "__main__":
    main()
