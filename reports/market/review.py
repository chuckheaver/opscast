#!/usr/bin/env python3
"""The market report's monthly sales-data review, for the owner to read after
each refresh:  python3 reports/market/review.py

The owner's rule: every closed sale is a reportable sale — below-market-rate
(BMR) units under $500K included, and reported square footage stands as
given. A sale with NO square footage reported can't have a $/sf, so it is
left out of $/sf figures (the grids' Median $/SF and The 10s' Top $/sf) and
of The 10s' Lowest 10 tables; it still counts in sale counts and medians.
The only records taken out are the owner's standing decisions in
data/sale-decisions.json — sales under $100K (parking, rentals, entry
errors) and the second copy of a duplicated sale — which
scripts/apply-sale-decisions.mjs removes on every data refresh and lists in
data/removed-sales.csv. This review prints that list every month (X1).
A sale over $25M is probably an entry error: it stays in, and is pointed
out every month (E8). List prices are not reviewed for their own sake —
the report uses sold data — only as a yardstick for the sale price (R4).

So this script only FLAGS. It never edits, drops or excludes a sale and it
changes none of the report's outputs; a new finding goes to the owner, whose
decision is recorded in data/sale-decisions.json. It looks at this year to
date (Jan 1 – the data date, mg.last_full_month()) and the same stretch last
year:

  likely-error  E1–E8   duplicates, impossible prices and dates, sales in no grid, over $25M
  review        R1–R10  figures worth a second look before the report goes out
  notable       N1–N6   real sales the narrative may want to mention
  left-out      X1      records the owner's decisions took out (data/removed-sales.csv)

A check's second rule gets its own id where it reads differently (E1b, E5b,
E7b, R1b, R9b); R1b, R9b and N5 are counts only, with no rows.

Writes out/review.json and out/review.csv (every finding) and out/outliers.csv
(every sale with no square footage — the list outliers.py used to write), then
prints a line per check, every likely error and the top sales.
"""
import bisect, csv, datetime, importlib.util, itertools, json, math, os, re, statistics
from collections import Counter, defaultdict

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
DEC = json.load(open(os.path.join(ROOT, "data", "sale-decisions.json")))
OVER = DEC.get("pointOut", {}).get("overPrice", 25_000_000)
KEEP = [set(map(str, k["ids"])) for k in DEC.get("keep", [])]          # owner: real, separate sales
decided = lambda *ids: any({str(i) for i in ids} <= k for k in KEEP)
spec = importlib.util.spec_from_file_location("mg", os.path.join(HERE, "market-grid-v2.py"))
mg = importlib.util.module_from_spec(spec); spec.loader.exec_module(mg)

RAW = json.load(open(mg.SRC))["features"]
F = [f["properties"] for f in RAW]
HAS = {k for r in F for k, v in r.items() if v not in (None, "", [])}   # fields this file carries
_, THRU = mg.last_full_month()
TY, LY = THRU.year, THRU.year - 1
try: LY_THRU = THRU.replace(year=LY)
except ValueError: LY_THRU = THRU.replace(year=LY, day=28)      # Feb 29
WINDOWS = {TY: (f"{TY}-01-01", THRU.isoformat()), LY: (f"{LY}-01-01", LY_THRU.isoformat())}
TODAY = datetime.date.today()
SFH, CONDO = mg.SEG["Single Family Residences"], mg.SEG["Condo / TIC / Other"]

CHECKS = [  # id, title — in report order
    ("E1", "duplicate-sale"), ("E1b", "conflicting-duplicate"),
    ("E3", "non-dwelling"), ("E4", "price-under-100k-or-digit-error"), ("E5", "segment-gap"),
    ("E5b", "neighborhood-in-no-area"), ("E6", "dates"), ("E7", "sfh-with-unit"), ("E7b", "typed-sfh-and-condo"),
    ("E8", f"over-${OVER / 1e6:.0f}M (point out)"),
    ("R1", "big-sale-no-sqft"), ("R1b", "no-sqft (all, out/outliers.csv)"), ("R2", "ppsf-vs-neighborhood"),
    ("R3", "sqft-vs-bedrooms"), ("R4", "sale-to-list-extreme"), ("R5", "drives-a-printed-figure"),
    ("R6", "round-million-placeholder"), ("R7", "zero-bedrooms-1m"), ("R8", "location"), ("R9", "dom"),
    ("R9b", "closed-with-0-dom (count only)"), ("R10", "copied-record"),
    ("N1", "top-sales"), ("N2", "far-above-neighborhood"), ("N3", "new-neighborhood-high"), ("N4", "flips"),
    ("N5", "bmr-looking (count only, valid sales)"), ("N6", "one-building-dominates"),
    ("X1", "left out by the owner's decisions")]
TITLE = dict(CHECKS); ORDER = {c: i for i, (c, _) in enumerate(CHECKS)}
SEV = {"E": "likely-error", "R": "review", "N": "notable", "X": "left-out"}
SEV_ORDER = {"likely-error": 0, "review": 1, "notable": 2, "left-out": 3}
SKIP = {}            # check → the field it needed and the file lacks
COUNTS = {}          # count-only checks → {year: n}

def need(check, *fields):
    miss = [f for f in fields if f not in HAS]
    if miss: SKIP[check] = ", ".join(miss)
    return not miss

# ── the sales, with what the checks match on ────────────────────────────────
SUFFIX = {"st", "street", "ave", "avenue", "blvd", "ter", "way", "ln", "ct", "pl", "dr", "cir"}
def split_addr(a):
    """'2050 Divisadero St #APT 2, San Francisco…' → ('2050 divisadero', '2', '2'):
    the building for matching, the unit for matching, the unit as written.
    '#…', 'unit …' and 'apt …' are all a unit."""
    s = (a or "").split(",")[0].strip(); unit = ""
    m = re.search(r"#\s*(.*)$", s)
    if m: unit, s = m.group(1), s[:m.start()]
    else:
        m = re.search(r"\b(?:unit|apt)\.?\s+(\S+)", s, re.I)
        if m: unit, s = m.group(1), s[:m.start()] + " " + s[m.end():]
    unit = re.sub(r"^(?:apt|unit)\b\.?\s*", "", unit.strip(), flags=re.I)
    s = re.sub(r"[^\w\s]", "", s.lower())
    return " ".join(t for t in s.split() if t not in SUFFIX), re.sub(r"[^a-z0-9]", "", unit.lower()), unit.upper()

def day(s):
    try: return datetime.date.fromisoformat(str(s)[:10])
    except ValueError: return None

S = []               # every sale in the file, as read, plus derived keys (_…)
for i, (f, r) in enumerate(zip(RAW, F)):
    if not (r.get("sellingPrice") and r.get("sellingDate")): continue
    x = dict(r); x["_i"] = i
    b, u, uw = split_addr(r.get("address"))
    if r.get("unit") and not u: u, uw = re.sub(r"[^a-z0-9]", "", str(r["unit"]).lower()), str(r["unit"]).upper()
    x["_bldg"], x["_unit"], x["_unitw"] = b, u, uw
    x["_key"] = b + ("#" + u if u else "")
    a = re.sub(r"[^0-9A-Z]", "", str(r.get("apn") or "").upper())
    x["_apn"] = a if len(re.sub(r"\D", "", a)) >= 5 else ""          # 'UNDEFINED', block-only stubs → none
    x["_seg"] = "SFH" if r.get("propType") in SFH else "Condo/TIC/Other" if r.get("propType") in CONDO else ""
    x["_sfar"] = mg.FIX.get(r.get("neighborhood") or "", r.get("neighborhood") or "")
    x["_d"] = day(r["sellingDate"]); d = r["sellingDate"][:10]
    if not x["_d"]: continue                       # not a date: the grids can't place it either
    x["_win"] = next((y for y, (lo, hi) in WINDOWS.items() if lo <= d <= hi), None)
    g = (f.get("geometry") or {}).get("coordinates") or [r.get("lng"), r.get("lat")]
    x["_xy"] = g if g and None not in g else None
    S.append(x)
W = [x for x in S if x["_win"]]                     # the sales the YTD windows hold
P = lambda x: x["sellingPrice"]
M = lambda v: "—" if v is None else f"${v:,.0f}" if v < 100_000 else "$" + mg.usdM(v)
PCT = lambda q: f"{100 * q:.1f}%" if q < 0.01 else f"{100 * q:.0f}%"
DAYS = lambda n: f"{n} day" + ("" if n == 1 else "s")
idnum = lambda x: int(re.sub(r"\D", "", str(x.get("id") or "")) or 0)
gap = lambda a, b: abs((a["_d"] - b["_d"]).days)
med = statistics.median

def med_without(sv, v):
    """Median of the sorted list sv with one copy of v taken out."""
    k = bisect.bisect_left(sv, v); m = len(sv) - 1
    if m <= 0: return None
    at = lambda j: sv[j] if j < k else sv[j + 1]
    return at(m // 2) if m % 2 else (at(m // 2 - 1) + at(m // 2)) / 2

# ── findings ────────────────────────────────────────────────────────────────
FIND = {}
def flag(check, x, why, related=(), year=None, key=None, **fields):
    """One row per check and sale; a second reason for the same sale joins the first."""
    if x is not None:
        row = dict(id=str(x.get("id") or ""), address=(x.get("address") or "").split(",")[0], neighborhood=x.get("fogNeighborhood") or "",
                   sfar=x["_sfar"], segment=x["_seg"], propType=x.get("propType") or "", date=x["sellingDate"][:10],
                   price=x.get("sellingPrice"), list=x.get("listPrice"), sqft=x.get("sqft"), beds=x.get("bedrooms"), status=x.get("status") or "")
    else:
        row = dict(id="", address="", neighborhood="", sfar="", segment="", propType="", date="", price=None, list=None, sqft=None, beds=None, status="")
    row.update(fields)
    y = year if year is not None else (x["_win"] if x is not None else None)
    k = (check, y, key or row["id"])
    rel = {str(r) for r in related if r} - {row["id"]}
    if k in FIND:
        f = FIND[k]
        if why not in f["why"]: f["why"] += "; " + why
        f["related_ids"] = sorted(set(f["related_ids"]) | rel)
        return
    FIND[k] = dict(check=check, severity=SEV[check[0]], title=TITLE[check], year=y, **row, why=why, related_ids=sorted(rel))

by_key, by_apn, by_bldg = defaultdict(list), defaultdict(list), defaultdict(list)
for x in S:
    by_key[x["_key"]].append(x)
    if x["_apn"]: by_apn[x["_apn"]].append(x)
for x in W:
    if x["_bldg"]: by_bldg[x["_bldg"]].append(x)
orig_first = lambda x: (x.get("status") != "Closed", idnum(x))      # the Closed one, then the earlier id, is the original

# E1 duplicate-sale: one sale entered twice (the two MLSs, or Closed + Sold Off MLS).
parent = {}
def root(i):
    while parent.get(i, i) != i: i = parent[i]
    return i
basis, linked = {}, set()
for grp, days, what in [(by_key, 31, "address")] + ([(by_apn, 7, "APN")] if "apn" in HAS else []):
    for rs in grp.values():
        for a, b in itertools.combinations(rs, 2):
            if P(a) == P(b) and gap(a, b) <= days:
                ra, rb = root(a["_i"]), root(b["_i"])
                if ra != rb: parent[ra] = rb
                linked |= {a["_i"], b["_i"]}
                basis.setdefault(frozenset((a["_i"], b["_i"])), what)
clusters = defaultdict(list)
for x in S:
    if x["_i"] in linked: clusters[root(x["_i"])].append(x)
for rs in clusters.values():
    if len(rs) < 2 or not any(x["_win"] for x in rs) or decided(*(r["id"] for r in rs)): continue
    o = min(rs, key=orig_first)
    for x in rs:
        if x is o: continue
        how = basis.get(frozenset((x["_i"], o["_i"]))) or "address/APN"
        same = f"same {how}" + (f" {x['_apn']}" if how == "APN" else "")
        flag("E1", x, f"duplicate of MLS {o['id']} ({o.get('status')}, {o['sellingDate'][:10]}, {o['address'].split(',')[0]}, {o.get('propType')}): "
                      f"{same}, same price {M(P(x))}, {DAYS(gap(x, o))} apart — counted twice",
             related=[r["id"] for r in rs], year=x["_win"] or o["_win"])

# E1b conflicting-duplicate: the same home twice within 30 days at different prices. By APN only
# when both are single-family: a condo or TIC building's units share one parcel number.
seen = set()
for grp, what in [(by_key, "address")] + ([(by_apn, "APN")] if "apn" in HAS else []):
    for rs in grp.values():
        for a, b in itertools.combinations(rs, 2):
            if P(a) == P(b) or gap(a, b) > 30 or not (a["_win"] or b["_win"]): continue
            if what == "APN" and not (a["_seg"] == b["_seg"] == "SFH"): continue
            if decided(a["id"], b["id"]): continue
            pair = frozenset((a["_i"], b["_i"]))
            if pair in seen: continue
            seen.add(pair)
            o, x = sorted((a, b), key=orig_first)
            flag("E1b", x, f"same {what} as MLS {o['id']} ({o['address'].split(',')[0]}, {o.get('status')}, {o['sellingDate'][:10]}) {DAYS(gap(a, b))} apart "
                           f"at a different price: {M(P(x))} here vs {M(P(o))}", related=[o["id"]], year=x["_win"] or o["_win"])

# E3 non-dwelling: a parking space, storage locker or boat slip sold as a unit.
NONDWELL = re.compile(r"^(P-?\d+|PKG\w*|PK\d*|PS\d*|PARK\w*|STOR\w*|STG\d*|SLIP\w*|BS\d+|BOAT\w*|GAR(?!DEN)\w*|SPACE\w*)$", re.I)  # a garden unit is a home
baths = lambda x: (lambda m: float(m.group(1)) if m else None)(re.match(r"\s*(\d+(?:\.\d+)?)", str(x.get("bathrooms") or "")))
for x in W:
    if x["_unitw"] and NONDWELL.match(re.sub(r"\s", "", x["_unitw"])): flag("E3", x, f"unit '#{x['_unitw']}' reads as parking/storage/slip")
    if "bathrooms" in HAS and x.get("bedrooms") == 0 and baths(x) == 0 and P(x) < 150_000:
        flag("E3", x, f"0 bed / 0 bath at {M(P(x))}")

# E4 price-under-100k-or-digit-error: a dropped digit, or a parking space priced as a home.
pp = defaultdict(list)
for x in W: pp[(x["_win"], x["_seg"], x["_sfar"])].append(P(x))
for v in pp.values(): v.sort()
for x in W:
    sp = P(x)
    if sp < 100_000: flag("E4", x, f"sold for {M(sp)}, under $100K")
    others = [P(r) for r in by_bldg.get(x["_bldg"], []) if r is not x]
    if len(others) >= 3 and sp <= 0.15 * med(others):
        flag("E4", x, f"{PCT(sp / med(others))} of the building's median {M(med(others))} ({len(others)} other sales, both years)")
    v = pp[(x["_win"], x["_seg"], x["_sfar"])]
    if x["_seg"] and len(v) - 1 >= 3 and sp <= 0.1 * med_without(v, sp):
        flag("E4", x, f"{PCT(sp / med_without(v, sp))} of the {x['_sfar']} {x['_seg']} median {M(med_without(v, sp))} ({len(v) - 1} other sales, {x['_win']})")

# E5 segment-gap: a type in neither segment is in no grid; an SFAR neighborhood in no AREA is
# in no area row (one row per neighborhood).
gapn = defaultdict(list)
for x in W:
    if not x["_seg"]: flag("E5", x, f"propType '{x.get('propType')}' is in neither mg.SEG set — in no grid")
    if x["_sfar"] not in mg.N2A: gapn[(x["_win"], x["_sfar"])].append(x)
for (y, n), rs in gapn.items():
    flag("E5b", None, f"{len(rs)} sales, {M(sum(map(P, rs)))} in all: SFAR neighborhood '{n or '(none)'}' is in no report AREA (mg.AREAS / mg.FIX)",
         related=[r["id"] for r in rs], year=y, key=n or "(none)", sfar=n, neighborhood=", ".join(sorted({r.get("fogNeighborhood") or "" for r in rs})),
         price=sum(map(P, rs)))

# E6 dates
for x in W:
    if "contractDate" in HAS and x.get("contractDate") and x["contractDate"][:10] > x["sellingDate"][:10]:
        flag("E6", x, f"contract date {x['contractDate'][:10]} after the closing {x['sellingDate'][:10]}")
    if "listDate" in HAS and x.get("listDate") and x["listDate"][:10] > x["sellingDate"][:10]:
        flag("E6", x, f"list date {x['listDate'][:10]} after the closing {x['sellingDate'][:10]}")
for x in S:
    if x["_d"] > TODAY: flag("E6", x, f"closing date {x['_d']} is in the future (today {TODAY})", year=x["_d"].year)
    elif x["_d"] > THRU and x["_d"].year == TY:
        flag("E6", x, f"closed {x['_d']}, after the data date {THRU}: in the file but in no window until the next refresh", year=TY)

# E7 sfh-with-unit, and E7b one address typed both single-family and condo.
for x in W:
    if x["_seg"] == "SFH" and "#" in (x.get("address") or "").split(",")[0]:
        flag("E7", x, f"single-family type ({x.get('propType')}) with a unit number '#{x['address'].split(',')[0].split('#', 1)[1].strip()}'")
for rs in by_key.values():
    segs = {r["_seg"] for r in rs}
    if not {"SFH", "Condo/TIC/Other"} <= segs: continue
    for x in rs:
        if not x["_win"]: continue
        other = [r for r in rs if r["_seg"] and r["_seg"] != x["_seg"]]
        flag("E7b", x, f"typed {x.get('propType')} here, " + ", ".join(f"{r.get('propType')} on MLS {r['id']} ({r['sellingDate'][:10]})" for r in other),
             related=[r["id"] for r in other])

# E8 over-$25M: probably an entry error (the owner's rule) — kept, and pointed out every month.
for x in W:
    if P(x) > OVER:
        flag("E8", x, f"{M(P(x))} is over {M(OVER)}: probably an entry error — confirm the price"
                      + (f" (${P(x) / x['sqft']:,.0f}/sf on {x['sqft']:,} sf)" if x.get("sqft") else " (no sqft)"))

# R1 big-sale-no-sqft; R1b every no-sqft sale → out/outliers.csv (outliers.py's list, unchanged).
if need("R1", "sqft"):
    for x in W:
        if not x.get("sqft") and P(x) >= 3_000_000:
            flag("R1", x, "no square footage on a $3M+ sale: it drops out of Median $/SF, Top $/sf and the Lowest 10s")
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
COUNTS["R1b"] = Counter(x["year"] for x in rows)

# R2 ppsf-vs-neighborhood: against the leave-one-out median of the SFAR neighborhood
# (8+ other sales with footage), else the SFAR district.
psf = lambda x: P(x) / x["sqft"]
if need("R2", "sqft"):
    nb, dist = defaultdict(list), defaultdict(list)
    dkey = lambda x: x.get("district") or x.get("areaDesc") or ""
    for x in W:
        if x.get("sqft") and x["_seg"]:
            nb[(x["_win"], x["_seg"], x["_sfar"])].append(psf(x)); dist[(x["_win"], x["_seg"], dkey(x))].append(psf(x))
    for v in list(nb.values()) + list(dist.values()): v.sort()
    for x in W:
        if not (x.get("sqft") and x["_seg"]): continue
        v, where = nb[(x["_win"], x["_seg"], x["_sfar"])], x["_sfar"]
        if len(v) - 1 < 8: v, where = dist[(x["_win"], x["_seg"], dkey(x))], dkey(x)
        if len(v) - 1 < 8 or not where: continue
        ref = med_without(v, psf(x)); q = psf(x) / ref
        if q >= 2.0 or q <= 0.4:
            flag("R2", x, f"${psf(x):,.0f}/sf is {q:.2f}× the {where} {x['_seg']} median ${ref:,.0f}/sf ({len(v) - 1} other sales, {x['_win']}; {x['sqft']:,} sf)")

# R3 sqft-vs-bedrooms: against the city median footage for the segment and bedroom count.
if need("R3", "sqft", "bedrooms"):
    bed = lambda x: min(x["bedrooms"], 6)
    sq = defaultdict(list)
    for x in W:
        if x.get("sqft") and x["_seg"] and (x.get("bedrooms") or 0) >= 1: sq[(x["_seg"], bed(x))].append(x["sqft"])
    for x in W:
        if not (x.get("sqft") and x["_seg"] and (x.get("bedrooms") or 0) >= 1): continue
        m = med(sq[(x["_seg"], bed(x))]); q = x["sqft"] / m
        if q <= 0.45 or q >= 3.0:
            flag("R3", x, f"{x['sqft']:,} sf for {x['bedrooms']} bed is {q:.2f}× the city {x['_seg']} median of {m:,.0f} sf for {bed(x)}{'+' if bed(x) == 6 else ''} bed")

# R4 sale-to-list-extreme: list price is only a yardstick for the sale price here (the report
# uses sold data; list price feeds only The 10s' Overbids tables). Far over list tops an Overbids
# table, as a mistyped list price would; far under list may be a mistyped sale price. Under 15%
# of list is a list-price typo, which the owner ignores.
for x in W if need("R4", "listPrice") else []:
    lp = x.get("listPrice")
    if not (lp and lp > 0 and 0.15 < P(x) / lp): continue
    if P(x) / lp >= 1.90: flag("R4", x, f"sold at {100 * P(x) / lp:.0f}% of list ({M(lp)}): tops an Overbids table — a mistyped list price would too")
    elif P(x) / lp <= 0.60: flag("R4", x, f"sold at {100 * P(x) / lp:.0f}% of list ({M(lp)}): is the sale price right?")

# R5 drives-a-printed-figure: the grid rows (fog neighborhood × segment) whose YTD median change
# or YTD average hangs on one or two sales.
grid = defaultdict(lambda: {TY: [], LY: []})
for x in W:
    if x["_seg"] and x.get("fogNeighborhood"): grid[(x["fogNeighborhood"], x["_seg"])][x["_win"]].append(x)
for (nb_, seg), byw in sorted(grid.items()) if need("R5", "fogNeighborhood") else []:
    for y, rs in byw.items():
        n = len(rs)
        if n < 3: continue
        tot = sum(map(P, rs)); avg = tot / n
        for x in rs:
            wo = (tot - P(x)) / (n - 1)
            if abs(wo / avg - 1) >= 0.5:
                flag("R5", x, f"{nb_} {seg} YTD {y} average {M(avg)} is {M(wo)} without this sale ({100 * (wo / avg - 1):+.0f}%, {n} sales)")
    sa, sb = sorted(byw[TY], key=P), sorted(byw[LY], key=P)
    if not sa or not sb: continue
    chg = lambda a, b: med(list(map(P, a))) / med(list(map(P, b))) - 1
    c0 = chg(sa, sb)
    if abs(c0) < 0.5: continue
    def cands(y, s):    # the extremes first; any other sale off the middle moves the median as they do
        n = len(s); out = []
        for j in [0, n - 1, 1, n - 2] + list(range(n // 2 - 2, n // 2 + 3)):
            if 0 <= j < n and (y, j) not in out: out.append((y, j))
        return out
    C = cands(TY, sa) + cands(LY, sb); best = None
    for k in (1, 2):
        for combo in itertools.combinations(C, k):
            ra = [r for j, r in enumerate(sa) if (TY, j) not in combo]; rb = [r for j, r in enumerate(sb) if (LY, j) not in combo]
            if not ra or not rb: continue
            c1 = chg(ra, rb)
            if abs(c1) < 0.25 and (best is None or abs(c1) < abs(best[0])): best = (c1, combo)
        if best: break
    if best:
        c1, combo = best
        hit = [(sa if y == TY else sb)[j] for y, j in combo]
        for x in hit:
            also = [r["id"] for r in hit if r is not x]
            flag("R5", x, f"{nb_} {seg} YTD median change {100 * c0:+.0f}% ({M(med(list(map(P, sa))))} vs {M(med(list(map(P, sb))))}, {len(sa)} vs {len(sb)} sales) "
                          f"is {100 * c1:+.{1 if abs(c1) >= 0.245 else 0}f}% without this sale" + (f" and MLS {also[0]}" if also else ""), related=also)

# R6 round-million-placeholder
if need("R6", "dom"):
    for x in W:
        if P(x) % 1_000_000 == 0 and x.get("listPrice") == P(x) and (x.get("dom") == 0 or x.get("status") != "Closed"):
            flag("R6", x, f"round {M(P(x))} = list, {x.get('dom')} DOM, {x.get('status')}: a placeholder price?")

# R7 zero-bedrooms-1m
for x in W if need("R7", "bedrooms") else []:
    if x.get("bedrooms") == 0 and P(x) >= 1_000_000: flag("R7", x, f"0 bedrooms at {M(P(x))}")

# R8 location: stand-in points, pins the validator moved far, unverified $10M+ addresses.
def km(a, b):
    (lo1, la1), (lo2, la2) = [list(map(math.radians, p)) for p in (a, b)]
    h = math.sin((la2 - la1) / 2) ** 2 + math.cos(la1) * math.cos(la2) * math.sin((lo2 - lo1) / 2) ** 2
    return 12742 * math.asin(math.sqrt(h))
if need("R8", "geoSource"):
    for x in W:
        if x.get("geoSource") == "neighborhood":
            flag("R8", x, f"stand-in point for {x.get('placeholder') or x.get('fogNeighborhood')}: not mapped at the address")
if "pinMls" in HAS:
    for x in W:
        if x.get("pinMls") and x["_xy"] and km(x["pinMls"], x["_xy"]) > 1:
            flag("R8", x, f"validator moved the pin {km(x['pinMls'], x['_xy']):.1f} km from the MLS point (addrMatch {x.get('addrMatch')})")
if "addrMatch" in HAS:
    for x in W:
        if P(x) >= 10_000_000 and x.get("addrMatch") in ("unverified", "unknown"):
            flag("R8", x, f"{M(P(x))} sale with address {x['addrMatch']} by the validator")

# R9 dom; R9b Closed at 0 DOM, a count only.
if need("R9", "dom"):
    for x in W:
        dom = x.get("dom")
        if dom is None: continue
        if dom > 365: flag("R9", x, f"{dom:,} days on market")
        if x.get("status") == "Sold Off MLS" and dom >= 90: flag("R9", x, f"Sold Off MLS with {dom} DOM")
if need("R9b", "dom"):
    COUNTS["R9b"] = Counter(x["_win"] for x in W if x.get("status") == "Closed" and x.get("dom") == 0)

# R10 copied-record: one listing agent, one price, one date, different buildings.
if need("R10", "agent"):
    cp = defaultdict(list)
    for x in S:
        if x.get("agent"): cp[(x["agent"].strip().lower(), P(x), x["sellingDate"][:10])].append(x)
    for rs in cp.values():
        if len({r["_bldg"] for r in rs}) < 2: continue
        for x in rs:
            if not x["_win"]: continue
            other = [r for r in rs if r["_bldg"] != x["_bldg"]]
            flag("R10", x, f"same agent ({x['agent']}), price and date as " + ", ".join(f"{r['address'].split(',')[0]} (MLS {r['id']})" for r in other),
                 related=[r["id"] for r in other])

# N1 top-sales, each segment's #1, and whether this year's #1 beats last year's.
TOP = {"SFH": 15_000_000, "Condo/TIC/Other": 7_500_000}
full_ly = [x for x in S if x["_d"].year == LY]
for seg, floor in TOP.items():
    best = {y: max((x for x in W if x["_win"] == y and x["_seg"] == seg), key=P, default=None) for y in WINDOWS}
    fy = max((x for x in full_ly if x["_seg"] == seg), key=P, default=None)
    for x in W:
        if x["_seg"] != seg or (P(x) < floor and x is not best[x["_win"]]): continue
        why = f"{M(P(x))} {seg} sale"
        if x is best[x["_win"]]:
            why = f"#1 {seg} sale YTD {x['_win']}"
            if x["_win"] == TY and best[LY]:
                b = best[LY]
                why += (f"; {'beats' if P(x) > P(b) else 'does not beat'} last year's #1 to {LY_THRU:%b %-d}, {M(P(b))} at {b['address'].split(',')[0]}")
                if fy is not None and fy is not b:
                    why += f" (all of {LY}: {M(P(fy))} at {fy['address'].split(',')[0]})"
        flag("N1", x, why)

# N2 far-above-neighborhood: 5× the leave-one-out median of the SFAR neighborhood (segment-wide under 8 others).
segp = defaultdict(list)
for x in W: segp[(x["_win"], x["_seg"])].append(P(x))
for v in segp.values(): v.sort()
for x in W:
    if not x["_seg"]: continue
    v, where = pp[(x["_win"], x["_seg"], x["_sfar"])], x["_sfar"]
    if len(v) - 1 < 8: v, where = segp[(x["_win"], x["_seg"])], "citywide"
    ref = med_without(v, P(x))
    if ref and P(x) >= 5 * ref:
        flag("N2", x, f"{P(x) / ref:.1f}× the {where} {x['_seg']} median {M(ref)} ({len(v) - 1} other sales, {x['_win']})")

# N3 new-neighborhood-high: this year's top sale beats all of last year's by half.
if need("N3", "fogNeighborhood"):
    lymax = defaultdict(int)
    for x in full_ly:
        if x["_seg"] and x.get("fogNeighborhood"): lymax[(x["fogNeighborhood"], x["_seg"])] = max(lymax[(x["fogNeighborhood"], x["_seg"])], P(x))
    for (nb_, seg), byw in sorted(grid.items()):
        rs = byw[TY]
        if len(rs) < 5 or not lymax.get((nb_, seg)): continue
        top = max(rs, key=P)
        if P(top) > 1.5 * lymax[(nb_, seg)]:
            flag("N3", top, f"{nb_} {seg} high {M(P(top))} is {P(top) / lymax[(nb_, seg)]:.1f}× all of {LY}'s high {M(lymax[(nb_, seg)])} ({len(rs)} sales this year)")

# N4 flips: the same home bought and sold again, more than 30 days apart.
for rs in by_key.values():
    rs = sorted(rs, key=lambda r: r["_d"])
    for a, b in zip(rs, rs[1:]):
        if not b["_win"] or gap(a, b) <= 30 or (a["_apn"] and b["_apn"] and a["_apn"] != b["_apn"]): continue
        q, g = P(b) / P(a), gap(a, b)
        if (g <= 365 and q >= 2.0) or (g <= 180 and q >= 1.3):
            flag("N4", b, f"bought {M(P(a))} on {a['sellingDate'][:10]} (MLS {a['id']}), sold {M(P(b))} {DAYS(g)} later: {q:.2f}×", related=[a["id"]])

# N5 bmr-looking: a count only — they are valid sales.
COUNTS["N5"] = Counter(x["_win"] for x in W if P(x) < 500_000 and P(x) % 1000)

# N6 one-building-dominates: one building is 40%+ of a neighborhood's condo sales.
if need("N6", "fogNeighborhood"):
    cn = defaultdict(list)
    for x in W:
        if x["_seg"] == "Condo/TIC/Other" and x.get("fogNeighborhood"): cn[(x["_win"], x["fogNeighborhood"])].append(x)
    for (y, nb_), rs in sorted(cn.items()):
        if len(rs) < 5: continue
        b, k = Counter(r["_bldg"] for r in rs).most_common(1)[0]
        if k / len(rs) < 0.4: continue
        inb = [r for r in rs if r["_bldg"] == b]
        flag("N6", None, f"{k} of its {len(rs)} condo sales ({100 * k / len(rs):.0f}%) are in one building, so its condo figures lean on {inb[0]['address'].split(',')[0].split('#')[0].strip()}",
             related=[r["id"] for r in inb], year=y, key=nb_, address=inb[0]["address"].split(",")[0].split("#")[0].strip(), neighborhood=nb_,
             sfar=inb[0]["_sfar"], segment="Condo/TIC/Other", price=round(med(list(map(P, inb)))))

# X1 left out by the owner's decisions (data/removed-sales.csv, written by scripts/apply-sale-decisions.mjs).
REMOVED = []
try:
    with open(os.path.join(ROOT, "data", "removed-sales.csv"), newline="") as fh: REMOVED = list(csv.DictReader(fh))
except FileNotFoundError: pass
for r in REMOVED:
    d = (r.get("sellingDate") or "")[:10]
    y = next((yy for yy, (lo, hi) in WINDOWS.items() if lo <= d <= hi), int(d[:4]) if d[:4].isdigit() else None)
    pt = r.get("propType") or ""
    FIND[("X1", y, r["id"])] = dict(check="X1", severity="left-out", title=TITLE["X1"], year=y, id=r["id"], address=(r.get("address") or "").split(",")[0],
        neighborhood=r.get("fogNeighborhood") or "", sfar="", segment="SFH" if pt in SFH else "Condo/TIC/Other" if pt in CONDO else "",
        propType=pt, date=d, price=int(float(r["sellingPrice"])) if r.get("sellingPrice") else None, list=None, sqft=None, beds=None,
        status=r.get("status") or "", why=r.get("reason") or "", related_ids=[])

# ── out ─────────────────────────────────────────────────────────────────────
findings = sorted(FIND.values(), key=lambda f: (SEV_ORDER[f["severity"]], ORDER[f["check"]], -(f["price"] or 0), -(f["year"] or 0), f["id"]))
summary = []
for c, t in CHECKS:
    n = COUNTS.get(c) or Counter(f["year"] for f in findings if f["check"] == c)
    summary.append(dict(check=c, severity=SEV[c[0]], title=t + (f" — skipped, no {SKIP[c]} field" if c in SKIP else ""),
                        count_this_year=n.get(TY, 0), count_last_year=n.get(LY, 0)))
OUT = os.path.join(HERE, "out")
with open(os.path.join(OUT, "review.json"), "w") as fh:
    json.dump(dict(generated=datetime.datetime.now().isoformat(timespec="seconds"), statsThrough=THRU.isoformat(),
                   windows={str(y): list(w) for y, w in WINDOWS.items()}, summary=summary, findings=findings), fh, indent=1)
FIELDS = ["check", "severity", "title", "year", "id", "address", "neighborhood", "sfar", "segment", "propType", "date", "price", "list", "sqft", "beds", "status", "why", "related_ids"]
with open(os.path.join(OUT, "review.csv"), "w", newline="") as fh:
    w = csv.DictWriter(fh, fieldnames=FIELDS); w.writeheader()
    w.writerows(dict(f, related_ids=" ".join(f["related_ids"])) for f in findings)

print(f"Sales-data review — YTD {TY} ({WINDOWS[TY][0]} – {WINDOWS[TY][1]}) vs YTD {LY} ({WINDOWS[LY][0]} – {WINDOWS[LY][1]}); {len(W):,} sales")
print(f"{'':4} {'':12} {'':40} {TY:>6} {LY:>6}")
for s in summary:
    print(f"{s['check']:<4} {s['severity']:<12} {s['title']:<40} {s['count_this_year']:>6} {s['count_last_year']:>6}")
def show(f):
    rel = f" (+ {' '.join(f['related_ids'])})" if f["related_ids"] else ""
    print(f"{f['check']:<4} {f['year']} | {f['segment'] or '—':<15} | {f['address']:<32} | {f['neighborhood']:<24} | {M(f['price']):>8} | list {M(f['list']):>8} | {f['date'] or '—'} | {f['status'] or '—'} | MLS {f['id'] or '—'}{rel}")
    print(f"     {f['propType'] or '—'}, SFAR {f['sfar'] or '—'}, {f['beds'] if f['beds'] is not None else '—'} bd, {f['sqft'] if f['sqft'] else '—'} sf — {f['why']}")
for head, pick in (("LIKELY ERRORS", lambda f: f["severity"] == "likely-error"), ("TOP SALES (N1)", lambda f: f["check"] == "N1"),
                   ("LEFT OUT BY THE OWNER'S DECISIONS (X1, data/sale-decisions.json)", lambda f: f["check"] == "X1")):
    rs = [f for f in findings if pick(f)]
    print(f"\n{head} — {len(rs)}")
    for f in rs: show(f)
print("\n→ reports/market/out/review.json, review.csv, outliers.csv  (flags only — the only records left out are the owner's decisions, X1)")
