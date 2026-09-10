#!/usr/bin/env python3
"""
Estimate coordinates for listings the MLS export left un-geocoded, using
addresses already placed in public/data/sf-listings.geojson.

Some exports carry no lat/lng for brand-new streets (new-construction
subdivisions) and the Census geocoder isn't always reachable. But the
published file usually already holds neighbors on the same street — and
for a comps dot, a same-building match is exact and a same-street
interpolation is within a block. This script writes those estimates to
data/geocode-interpolated.json, which scripts/geocode-listings.mjs loads
as a FALLBACK tier: any real geocode (export lat/lng, Census, a manual
OVERRIDE) takes precedence, and Census is still retried for these
addresses whenever it is reachable. Every resulting feature is stamped
geoSource: "interpolated" so the map can show it as approximate.

Methods, in descending confidence (anything weaker is skipped and left
for a real geocoder):
  same-building  another unit at the same house number is already placed
  interpolated   known neighbors on both sides (same parity preferred);
                 linear interpolation by house number, nearest gap <= 30
                 or both gaps <= 150
  extrapolated   one side only, nearest gap <= 30, >= 2 known points on
                 the street: extend along the street's direction, capped
                 at 150 m
  nearest        one side only, nearest gap <= 30, a single known point:
                 snap to it

Usage:
    python3 scripts/interpolate-unmapped.py
    node scripts/geocode-listings.mjs
"""
import csv, glob, json, math, os, re
from collections import defaultdict

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLISHED = os.path.join(ROOT, "public", "data", "sf-listings.geojson")
RAW_GLOB = os.path.join(ROOT, "data", "raw", "sold_*.csv")
OUT = os.path.join(ROOT, "data", "geocode-interpolated.json")

UNIT_RE = re.compile(r"\s+(#|unit\s+|apt\s+)\S+$", re.I)
NUM_RE = re.compile(r"^(\d+)\s+(.+)$")

def street_line(address):
    """Segment before the first comma, whitespace-collapsed — exactly how
    geocode-listings.mjs derives `street` (and the cache key) for
    canonical rows. Keeps the unit."""
    return re.sub(r"\s+", " ", address.split(",")[0]).strip()

def parse(address):
    """(house number, street name without unit) or (None, None)."""
    s = UNIT_RE.sub("", street_line(address))
    m = NUM_RE.match(s)
    return (int(m.group(1)), m.group(2).lower().strip()) if m else (None, None)

def addr_key(address, zip5):
    return f"{street_line(address)}|san francisco|ca|{zip5}".lower()

def meters(a, b):
    """Approximate planar distance between two [lng, lat] points."""
    lat = math.radians((a[1] + b[1]) / 2)
    dx = (b[0] - a[0]) * 111320 * math.cos(lat)
    dy = (b[1] - a[1]) * 110540
    return math.hypot(dx, dy), dx, dy

def lerp(a, b, t):
    return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]

def main():
    pub = json.load(open(PUBLISHED))
    placed_ids = set()
    by_street = defaultdict(list)  # (street, zip) -> [(num, [lng,lat], id)]
    for f in pub["features"]:
        p = f["properties"]
        placed_ids.add(str(p.get("id", "")).strip())
        num, st = parse(p.get("address") or "")
        if num is None or p.get("geoSource") in ("interpolated", "nearest", "neighborhood"):
            continue  # never chain estimates off other estimates or placeholder dots
        by_street[(st, (p.get("zip") or "").strip())].append((num, f["geometry"]["coordinates"], p["id"]))

    def fnum(s):
        try:
            return float(str(s).strip())
        except (TypeError, ValueError):
            return None

    candidates = []
    for path in sorted(glob.glob(RAW_GLOB)):
        for r in csv.DictReader(open(path)):
            lat, lng = fnum(r.get("Latitude")), fnum(r.get("Longitude"))
            if lat and lng:
                continue  # export placed it
            if r["Listing Number"].strip() in placed_ids:
                continue  # already placed by a prior run
            if not re.search(r"san\s*francisco", r.get("City", ""), re.I):
                continue  # not an SF comp; the geocoder drops these anyway
            candidates.append(r)

    out, report = {}, []
    for r in candidates:
        addr, zip5 = r["Address"], r["Address - ZIP"].strip()
        num, st = parse(addr)
        if num is None:
            report.append((r["Listing Number"], addr, "skip", "unparseable")); continue
        pts = by_street.get((st, zip5), [])
        if not pts:
            report.append((r["Listing Number"], addr, "skip", "no placed listing on this street")); continue

        same = [x for x in pts if x[0] == num]
        if same:
            pt, src = same[0][1], [same[0][2]]
            method, note = "same-building", "another unit at this number"
        else:
            def nearest_side(keep):
                # Per side: the same-parity neighbor if it's within 30 numbers
                # (same side of the street), otherwise the nearest of any
                # parity — proximity beats parity once the gap is wide.
                cand = [x for x in pts if keep(x[0])]
                if not cand:
                    return None
                same = [x for x in cand if x[0] % 2 == num % 2]
                best_same = min(same, key=lambda x: abs(x[0] - num)) if same else None
                best_any = min(cand, key=lambda x: abs(x[0] - num))
                return best_same if best_same and abs(best_same[0] - num) <= 30 else best_any
            lo = nearest_side(lambda n: n < num)
            hi = nearest_side(lambda n: n > num)
            near = min(abs(x[0] - num) for x in pts)
            if lo and hi and (near <= 30 or (num - lo[0] <= 150 and hi[0] - num <= 150)):
                t = (num - lo[0]) / (hi[0] - lo[0])
                pt, src = lerp(lo[1], hi[1], t), [lo[2], hi[2]]
                method, note = "interpolated", f"between #{lo[0]} and #{hi[0]}"
            elif near <= 30 and len(pts) >= 2:
                a, b = sorted(pts, key=lambda x: abs(x[0] - num))[:2]
                (na, pa), (nb, pb) = (a[0], a[1]), (b[0], b[1])
                if na == nb:
                    pt, src, method, note = pa, [a[2]], "nearest", f"snapped to #{na}"
                else:
                    d, dx, dy = meters(pa, pb)
                    per_num = d / abs(nb - na)
                    off = max(-150.0, min(150.0, (num - na) * per_num * (1 if nb > na else -1)))
                    ux, uy = dx / d, dy / d
                    lat = math.radians(pa[1])
                    pt = [pa[0] + off * ux / (111320 * math.cos(lat)), pa[1] + off * uy / 110540]
                    src, method, note = [a[2], b[2]], "extrapolated", f"from #{na} along the street ({off:+.0f} m)"
            elif near <= 30:
                a = min(pts, key=lambda x: abs(x[0] - num))
                pt, src, method, note = a[1], [a[2]], "nearest", f"snapped to #{a[0]}"
            else:
                report.append((r["Listing Number"], addr, "skip", f"nearest known number is {near} away")); continue

        out[addr_key(addr, zip5)] = {
            "point": [round(pt[0], 6), round(pt[1], 6)],
            "method": method, "from": src, "address": street_line(addr), "zip": zip5, "id": r["Listing Number"].strip(),
        }
        report.append((r["Listing Number"], addr, method, note))

    with open(OUT, "w") as fh:
        json.dump(out, fh, indent=1, sort_keys=True)

    from collections import Counter
    c = Counter(m for _, _, m, _ in report)
    print(f"{len(candidates)} un-geocoded SF rows -> {len(out)} estimated, {c.get('skip', 0)} left for a real geocoder")
    for k in ("same-building", "interpolated", "extrapolated", "nearest", "skip"):
        if c.get(k): print(f"  {c[k]:3}  {k}")
    print(f"\nwrote {os.path.relpath(OUT, ROOT)}\n")
    for id_, addr, m, note in report:
        print(f"  {id_} | {street_line(addr):32} | {m:13} | {note}")

if __name__ == "__main__":
    main()
