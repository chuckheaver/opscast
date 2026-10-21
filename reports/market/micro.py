"""The microclimate pages of the market report.

  1. The Heat Map — the city shaded by fog zone (1–4), each neighborhood
     labeled with this year's median sale prices, single-family / Condo/TIC/
     Other in their segment colors, with the neighborhood index beside it
     (zone, mix of zones and the same two medians).
  2. Microclimates and Real Estate — the four zones side by side, the
     warmest and coolest neighborhoods, fog facts, the city's year in
     temperatures, and the closings grids by fog zone.

Fog hours are the site's own neighborhood data (USGS analysis of GOES
satellite imagery, 1999–2009). There is no thermometer in every
neighborhood, so the temperatures are an estimate read off the fog hours
(est_temp below) and are labelled as such wherever they appear.
"""
import json, math, html, statistics, datetime, os

HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
NAV = "#203C5F"; NAV_LT = "#E4EEF0"; GOLD_MID = "#E9BC3F"; GOLD_LT = "#FBF3D9"; GOLD_TXT = "#94700F"
INK = "#131A25"; MUTED = "#6B6F75"; LINE = "#DCDDDE"
# The Heat Map's two numbers, in the report's segment colors (navy single-
# family, gold Condo/TIC/Other, as in the Units Sold chart).
SFH_INK = NAV; CTO_INK = GOLD_TXT

# The four zones, numbered 1 (sunniest) to 4 (foggiest) — the site's rule (app/lib/fog-zones.js). A POINT
# (a sale, the map's shading) takes the zone of the fog polygon it sits in:
# 8 hrs or less Sun · 8.5 Transition · 9 – 11 Fog · over 11 Persistent Fog.
# A NEIGHBORHOOD's category and its mix of zones come from the ground it
# covers (scripts/build-neighborhood-fog-zones.mjs): Transition when 10%+ of
# it is in the 8.5 polygon or it spans sun and fog, else its main zone.
ZONES = [
    dict(k="1", name="Sun", fill="#F7CF5C", ink="#131A25", rng="8 hrs or less", desc="8 hrs or less of fog a day"),
    dict(k="2", name="Transition", fill="#E9D3A2", ink="#131A25", rng="8.5 hrs", desc="on or across the 8.5-hr line"),
    dict(k="3", name="Fog", fill="#AFC0CF", ink="#131A25", rng="9 – 11 hrs", desc="mostly 9 – 11 hrs of fog a day"),
    dict(k="4", name="Persistent Fog", fill="#6F8497", ink="#ffffff", rng="over 11 hrs", desc="mostly over 11 hrs of fog a day"),
]
_BY_NAME = {z["name"]: z for z in ZONES}
try: NZ = json.load(open(os.path.join(ROOT, "public/data/neighborhood-fog-zones.json")))
except Exception: NZ = {}
def zone_of_hours(h):
    return ZONES[0] if h <= 8 else ZONES[1] if h < 9 else ZONES[2] if h <= 11 else ZONES[3]
def zone(name, hours=None):
    """A neighborhood's zone; by its fog hours if it was never sampled."""
    v = NZ.get(name)
    return _BY_NAME[v["zone"]] if v else zone_of_hours(hours)
def sale_zone(r):
    """A sale's zone: the fog polygon at the property; its neighborhood's
    category only when the sale has no fog reading."""
    if r.get("fogHours") is not None: return zone_of_hours(r["fogHours"])
    if r.get("fogNeighborhood") in NZ: return _BY_NAME[NZ[r["fogNeighborhood"]]["zone"]]
    return None

FOG_NOTE = ("Summer fog: daily totals averaged across the four summer months, from ~26,000 hourly GOES satellite images (USGS) "
            "applied to observations on the ground — 8 hrs or less Sun · 8.5 Transition · 9 – 11 Fog · over 11 Persistent Fog.")

# Estimated typical summer (Jun–Sep) afternoon high, °F, from fog hours.
# Anchors: NOAA downtown normals (Sep 70°F, Aug 68°F) for the sunbelt; the
# site's guide for the rest — the sunbelt 8–10° warmer than the west side,
# the fog belt in the low 60s, the southwest corner coolest.
_ANCHORS = [(6.0, 72), (7.5, 70), (8.5, 67), (9.0, 65), (10.0, 63), (11.0, 62), (12.5, 60)]
def est_temp(h):
    if h <= _ANCHORS[0][0]: return _ANCHORS[0][1]
    for (h0, t0), (h1, t1) in zip(_ANCHORS, _ANCHORS[1:]):
        if h <= h1: return round(t0 + (t1 - t0) * (h - h0) / (h1 - h0))
    return _ANCHORS[-1][1]

def Mm(v):
    """Millions, one decimal: 4.9M, 0.9M."""
    return "—" if not v else f"{v/1e6:.1f}M"

def M(v):
    return "—" if not v else (f"${v/1e6:.2f}M" if v >= 995_000 else f"${v/1e3:.0f}K")

# ── geometry ──────────────────────────────────────────────────────────────
def _rings(geom):
    return [geom["coordinates"]] if geom["type"] == "Polygon" else geom["coordinates"]

def _area(r):
    return abs(sum(x0 * y1 - x1 * y0 for (x0, y0), (x1, y1) in zip(r, r[1:] + r[:1]))) / 2

def _inside(x, y, rings):
    c = False
    for r in rings:
        for (x0, y0), (x1, y1) in zip(r, r[1:] + r[:1]):
            if (y0 > y) != (y1 > y) and x < (x1 - x0) * (y - y0) / (y1 - y0) + x0: c = not c
    return c

def _edge_d(x, y, rings):
    d = float("inf")
    for r in rings:
        for (x0, y0), (x1, y1) in zip(r, r[1:] + r[:1]):
            dx, dy = x1 - x0, y1 - y0; L = dx * dx + dy * dy
            t = max(0, min(1, ((x - x0) * dx + (y - y0) * dy) / L)) if L else 0
            d = min(d, math.hypot(x - x0 - t * dx, y - y0 - t * dy))
    return d

def label_point(rings):
    """The point deepest inside the polygon (a coarse pole of
    inaccessibility), so a number never sits on a border."""
    xs = [p[0] for p in rings[0]]; ys = [p[1] for p in rings[0]]
    x0, x1, y0, y1 = min(xs), max(xs), min(ys), max(ys)
    best, bd = ((x0 + x1) / 2, (y0 + y1) / 2), -1
    for step in range(2):
        n = 14
        for i in range(n + 1):
            for j in range(n + 1):
                x = x0 + (x1 - x0) * i / n; y = y0 + (y1 - y0) * j / n
                if _inside(x, y, rings):
                    d = _edge_d(x, y, rings)
                    if d > bd: bd, best = d, (x, y)
        w, h = (x1 - x0) / 7, (y1 - y0) / 7
        x0, x1, y0, y1 = best[0] - w, best[0] + w, best[1] - h, best[1] + h
    return best, bd

def fog_map(hoods, w=560, h=560, bbox=(-122.516, 37.703, -122.355, 37.833)):
    """The city shaded straight from the fog contour polygons (the layers the
    site's fog map draws), so a neighborhood that spans more than one zone
    shows each part in its own zone. Thin white neighborhood boundaries on
    top, each neighborhood numbered at its deepest point. No sale dots."""
    W0, S0, E0, N0 = bbox
    shp = json.load(open(os.path.join(ROOT, "public/data/map-shapes.json")))
    con = json.load(open(os.path.join(ROOT, "public/data/sf-fog-contours.geojson")))
    lat0 = math.radians((S0 + N0) / 2); sx = (E0 - W0) * math.cos(lat0); sy = N0 - S0
    sc = min(w / sx, h / sy); ox = (w - sx * sc) / 2; oy = (h - sy * sc) / 2
    P = lambda lng, lat: (ox + (lng - W0) * math.cos(lat0) * sc, oy + (N0 - lat) * sc)
    def path(geom):
        return "".join("M" + " L".join("%.1f,%.1f" % P(x, y) for x, y in r) + "Z" for rings in _rings(geom) for r in rings)
    land = path(shp["land"])
    o = [f"<svg viewBox='0 0 {w} {h}' width='100%' preserveAspectRatio='xMidYMid meet' font-family=\"'Lato',Helvetica,Arial,sans-serif\">",
         f"<defs><clipPath id='fm-land'><path d='{land}' clip-rule='evenodd'/></clipPath></defs>",
         f"<rect width='{w}' height='{h}' fill='#EAF1F6'/>",
         f"<path d='{land}' fill='{ZONES[0]['fill']}' fill-rule='evenodd'/>",
         "<g clip-path='url(#fm-land)'>"]
    # Contours nest: a point takes the smallest polygon around it, so paint
    # largest first and let the smaller ones cover them.
    size = lambda f: sum(_area(rs[0]) for rs in _rings(f["geometry"]))
    for f in sorted(con["features"], key=size, reverse=True):
        o.append(f"<path d='{path(f['geometry'])}' fill='{zone_of_hours(f['properties']['hours'])['fill']}' fill-rule='evenodd'/>")
    o.append("</g>")
    def shade_at(lng, lat):
        """The zone the map paints at a point: the smallest contour around it."""
        best, ba = None, float("inf")
        for f in con["features"]:
            for rs in _rings(f["geometry"]):
                if _inside(lng, lat, rs) and _area(rs[0]) < ba: best, ba = f, _area(rs[0])
        return zone_of_hours(best["properties"]["hours"]) if best else ZONES[0]
    for hd in hoods:
        o.append(f"<path d='{path(hd['geom'])}' fill='none' stroke='#ffffff' stroke-width='0.6' stroke-linejoin='round'/>")
    # This year's medians, in millions, side by side: single-family in navy,
    # then Condo/TIC/Other a size smaller in gold (the page's subtitle says
    # which is which); one figure where only one type sold, no label where
    # nothing sold. A white halo keeps both readable on every shade.
    labels = []
    for hd in hoods:
        if not (hd["sfh"]["price"] or hd["cto"]["price"]): continue
        rings = max(_rings(hd["geom"]), key=lambda rs: _area(rs[0]))
        (lx, ly), depth = label_point(rings)
        x, y = P(lx, ly)
        a = ("$" + Mm(hd["sfh"]["price"])) if hd["sfh"]["price"] else ""
        b = ("$" + Mm(hd["cto"]["price"])) if hd["cto"]["price"] else ""
        n = len(a) + 0.82 * len(b) + (1 if a and b else 0)   # the condo figure is set smaller
        # smaller in the smallest neighborhoods: sized to the room the shape leaves
        labels.append(dict(x=x, y=y, a=a, b=b, n=n, fs=max(3.4, min(6.4, depth * sc * 2.3 / (0.56 * n)))))
    # Where two labels still overlap in a tight cluster, shrink the larger.
    box = lambda L: (L["x"] - 0.29 * L["fs"] * L["n"], L["y"] - 0.5 * L["fs"], L["x"] + 0.29 * L["fs"] * L["n"], L["y"] + 0.5 * L["fs"])
    hit = lambda p, q: p[0] < q[2] and q[0] < p[2] and p[1] < q[3] and q[1] < p[3]
    for _ in range(40):
        moved = False
        for i, L in enumerate(labels):
            for K in labels[i + 1:]:
                if hit(box(L), box(K)):
                    big = L if L["fs"] >= K["fs"] else K
                    if big["fs"] > 3.0: big["fs"] *= 0.92; moved = True
        if not moved: break
    for L in labels:
        fs = L["fs"]
        sfh_t = f"<tspan fill='{SFH_INK}'>{L['a']}</tspan>" if L["a"] else ""
        gap = f" dx='{fs * 0.32:.2f}'" if L["a"] else ""
        cto_t = f"<tspan{gap} fill='{CTO_INK}' font-size='{fs * 0.82:.2f}'>{L['b']}</tspan>" if L["b"] else ""
        o.append(f"<text x='{L['x']:.1f}' y='{L['y'] + fs * 0.36:.1f}' font-size='{fs:.2f}' font-weight='700' text-anchor='middle' "
                 f"stroke='#ffffff' stroke-width='{fs * 0.32:.2f}' stroke-linejoin='round' paint-order='stroke'>{sfh_t}{cto_t}</text>")
    # compass + scale
    km = sc * (1 / 111.32)                 # px per km (east–west, at lat0 via cos already in sc)
    mi = km * 1.609
    o.append(f"<g transform='translate({w-70},{h-22})'><rect x='0' y='-3' width='{mi:.1f}' height='4' fill='{NAV}'/>"
             f"<text x='{mi/2:.1f}' y='12' font-size='8' fill='{NAV}' text-anchor='middle'>1 mile</text></g>")
    o.append(f"<g transform='translate({w-24},28)'><path d='M0,-14 L6,4 L0,0 L-6,4Z' fill='{NAV}'/>"
             f"<text x='0' y='15' font-size='9' font-weight='700' fill='{NAV}' text-anchor='middle'>N</text></g>")
    o.append(f"<text x='12' y='24' font-size='12' font-weight='700' fill='{NAV}' opacity='0.55' font-style='italic'>Pacific Ocean</text>")
    o.append(f"<text x='{w-150}' y='{h*0.62:.0f}' font-size='11' font-weight='700' fill='{NAV}' opacity='0.55' font-style='italic'>San Francisco Bay</text>")
    return "".join(o) + "</svg>"

# ── the city's year ──────────────────────────────────────────────────────
def year_chart(months, w=300, h=112):
    """Monthly normal highs and lows, downtown; the warmest month in gold."""
    lo, hi = 40, 74
    pl, pb, pt = 4, 14, 10; bw = (w - 2 * pl) / 12
    Y = lambda v: pt + (hi - v) / (hi - lo) * (h - pt - pb)
    warm = max(months, key=lambda m: m["high"])
    o = [f"<svg viewBox='0 0 {w} {h}' width='100%' font-family=\"'Lato',Helvetica,Arial,sans-serif\">"]
    for i, m in enumerate(months):
        x = pl + i * bw + bw * 0.18; bwid = bw * 0.64
        col = GOLD_MID if m is warm else "#9FB4C6"
        o.append(f"<rect x='{x:.1f}' y='{Y(m['high']):.1f}' width='{bwid:.1f}' height='{Y(m['low']) - Y(m['high']):.1f}' rx='2' fill='{col}'/>")
        o.append(f"<text x='{x + bwid/2:.1f}' y='{Y(m['high']) - 2:.1f}' font-size='6.6' font-weight='700' fill='{GOLD_TXT if m is warm else NAV}' text-anchor='middle'>{m['high']}°</text>")
        o.append(f"<text x='{x + bwid/2:.1f}' y='{Y(m['low']) + 7:.1f}' font-size='5.8' fill='{MUTED}' text-anchor='middle'>{m['low']}°</text>")
        o.append(f"<text x='{x + bwid/2:.1f}' y='{h - 3}' font-size='6.6' fill='{INK if m is warm else MUTED}' font-weight='{700 if m is warm else 400}' text-anchor='middle'>{m['m']}</text>")
    return "".join(o) + "</svg>"

# ── data ─────────────────────────────────────────────────────────────────
def neighborhoods(sales_y1, sfh_types, stats, cto_types=()):
    """Every map neighborhood, numbered zone by zone, sunniest (1) to foggiest, with its
    zone, estimated temperature and this year's single-family and Condo/TIC/Other medians."""
    fc = json.load(open(os.path.join(ROOT, "public/data/sf-fog-neighborhoods.geojson")))
    try: stock = json.load(open(os.path.join(ROOT, "public/data/parcel-res-by-fog.json")))
    except Exception: stock = {}
    by = {}
    for r in sales_y1:
        if r.get("fogNeighborhood"): by.setdefault(r["fogNeighborhood"], []).append(r)
    out = []
    key = lambda f: (ZONES.index(zone(f["properties"]["name"], f["properties"]["fogHours"])), f["properties"]["fogHours"], f["properties"]["name"].lower())
    for f in sorted(fc["features"], key=key):
        p = f["properties"]; nm = p["name"]; rs = by.get(nm, [])
        st = stock.get(nm) or {}
        out.append(dict(name=nm, hours=p["fogHours"], zone=zone(nm, p["fogHours"]), temp=est_temp(p["fogHours"]),
                        mix=(NZ.get(nm) or {}).get("mix") or {zone(nm, p["fogHours"])["name"]: 1},
                        geom=f["geometry"], homes=(st.get("u1", 0) + st.get("units2", 0)),
                        sfh=stats([r for r in rs if r.get("propType") in sfh_types]),
                        cto=stats([r for r in rs if r.get("propType") in cto_types]), all=stats(rs), sales=len(rs)))
    for i, hd in enumerate(out): hd["n"] = i + 1
    return out

CSS = f"""
    .fm-wrap {{ display:flex; gap:14px; margin-top:4px; }}
    .fm-map {{ flex:0 0 612px; position:relative; }}
    .fm-map .mapbox {{ border:1px solid {LINE}; border-radius:8px; overflow:hidden; line-height:0; }}
    .fm-zkey {{ position:absolute; left:8px; top:32px; width:138px; display:flex; flex-direction:column; gap:4px; }}
    .fm-zkey div {{ border-radius:6px; padding:3px 6px; font-size:6.9px; line-height:1.2; box-shadow:0 0 0 1px rgba(255,255,255,.7); }}
    .fm-zkey b {{ font-family:'Montserrat','Lato',sans-serif; font-size:13px; font-weight:800; margin-right:5px; vertical-align:-1px; }}
    .fm-zkey span {{ font-weight:700; font-size:8.6px; }}
    .fm-side {{ flex:1; min-width:0; }}
    .fm-h {{ font-family:'Montserrat','Lato',sans-serif; font-size:10.5px; font-weight:800; color:#fff; background:{NAV}; padding:3px 7px; border-radius:4px; display:flex; justify-content:space-between; }}
    .fm-h i {{ font-style:normal; font-weight:600; font-size:7.6px; opacity:.85; }}
    .fm-idx {{ display:flex; gap:9px; margin-top:2px; font-size:7px; }} .fm-idx > section {{ flex:1; min-width:0; }}
    .fm-idx div {{ display:flex; align-items:center; gap:3px; break-inside:avoid; height:9.7px; padding:0; border-bottom:0.4px solid {LINE}; }}
    .fm-idx .no {{ flex:0 0 13px; font-weight:800; color:{NAV}; text-align:right; }}
    .fm-idx .mx {{ flex:0 0 14px; height:5px; display:flex; border-radius:1.5px; overflow:hidden; background:#EEE; }}
    .fm-idx .mx i {{ display:block; height:100%; }}
    .fm-idx .zc {{ flex:0 0 9px; height:9px; border-radius:2px; font-size:6px; font-weight:800; text-align:center; line-height:9px; }}
    .fm-idx .nm {{ flex:1; min-width:0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }}
    .fm-idx .hr {{ color:{MUTED}; }}
    .fm-idx .md {{ flex:0 0 24px; text-align:right; font-weight:800; color:{SFH_INK}; }}
    .fm-idx .md.cto {{ color:{CTO_INK}; }}
    .hdr .p b.sfh, .fm-h b.sfh {{ color:{SFH_INK}; }} .hdr .p b.cto {{ color:{CTO_INK}; }}
    .fm-h b {{ font-weight:800; }} .fm-h b.sfh {{ color:#fff; }} .fm-h b.cto {{ color:{GOLD_MID}; }}
    .fm-note {{ font-size:7.4px; color:{MUTED}; margin-top:5px; line-height:1.35; }}
    .mz-cards {{ display:grid; grid-template-columns:repeat(4,1fr); gap:8px; margin:4px 0 5px; }}
    .mz-card {{ border-radius:7px; padding:7px 9px 6px; background:{NAV_LT}; border-top:6px solid var(--z); position:relative; }}
    .mz-card .L {{ position:absolute; right:8px; top:4px; font-family:'Montserrat','Lato',sans-serif; font-size:24px; font-weight:800; color:var(--z); opacity:.9; }}
    .mz-card .nm {{ font-family:'Montserrat','Lato',sans-serif; font-size:10.5px; font-weight:800; color:{NAV}; }}
    .mz-card .rg {{ font-size:7.4px; color:{MUTED}; }}
    .mz-card .tp {{ font-family:Georgia,serif; font-size:21px; font-weight:700; color:{NAV}; margin-top:2px; }}
    .mz-card .tp small {{ font-family:'Lato',sans-serif; font-size:7.4px; font-weight:400; color:{MUTED}; }}
    .mz-card .row {{ display:flex; justify-content:space-between; font-size:7.8px; margin-top:2px; }}
    .mz-card .row b {{ color:{NAV}; }}
    .mz-mid {{ display:flex; gap:10px; }}
    .mz-col {{ flex:1; min-width:0; }}
    .mz-h {{ font-family:'Montserrat','Lato',sans-serif; font-size:10px; font-weight:800; color:#fff; background:{NAV}; padding:2.5px 7px; border-radius:4px; margin-bottom:3px; }}
    table.mz {{ width:100%; border-collapse:collapse; font-size:7.6px; table-layout:fixed; }}
    table.mz th {{ font-size:6.6px; color:{MUTED}; text-transform:uppercase; text-align:right; font-weight:700; padding:1px 2px; border-bottom:1px solid {NAV}; }}
    table.mz th.l, table.mz td.l {{ text-align:left; }}
    table.mz td {{ padding:1.2px 2px; text-align:right; border-bottom:0.4px solid {LINE}; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }}
    table.mz td.b {{ font-weight:800; color:{NAV}; }}
    table.mz .zc {{ display:inline-block; width:9px; height:9px; border-radius:2px; font-size:6px; font-weight:800; text-align:center; line-height:9px; margin-right:3px; vertical-align:-1px; }}
    .mz-facts {{ display:grid; grid-template-columns:repeat(4,1fr); gap:5px; }}
    .mz-fact {{ background:{GOLD_LT}; border-left:3px solid {GOLD_MID}; border-radius:5px; padding:3px 7px; font-size:7.3px; line-height:1.25; }}
    .mz-fact b {{ display:block; font-family:Georgia,serif; font-size:12.5px; color:{NAV}; line-height:1.1; }}
    .mz-cap {{ font-size:7px; color:{MUTED}; margin-top:2px; line-height:1.3; }}
"""

def pages(*, F, W, plabel, mg, head, cells, groups, zone_rows):
    """Both microclimate pages, as HTML. zone_rows: [(title, byZ, tot)] for
    the closings-by-zone grids, rendered with the grid's own head/cells."""
    sfh = mg.SEG["Single Family Residences"]; cto = mg.SEG["Condo / TIC / Other"]
    y1 = [r for r in F if r.get("sellingDate") and W["y1"][0] <= r["sellingDate"] <= W["y1"][1]]
    hoods = neighborhoods(y1, sfh, mg.stats, cto)
    clim = json.load(open(os.path.join(ROOT, "app/lib/sf-climate.json")))
    thru = datetime.date.fromisoformat(W["y1"][1]).strftime("%b %-d, %Y")
    mprior = datetime.date.fromisoformat(W["m0"][0]).strftime("%b %Y")      # the same month last year
    pyear = datetime.date.fromisoformat(W["y0"][0]).year
    zc = lambda z: f"<span class='zc' style='background:{z['fill']};color:{z['ink']}'>{z['k']}</span>"
    foot = lambda txt: (f"<div class='foot'><span>{txt}</span><span>Chuck Heaver · Vanguard Properties · page 0 / 0</span></div></div>")

    # ── page 1: the fog map ──
    # The neighborhood's mix of zones: a thin bar, a segment per zone it covers.
    mixbar = lambda h: ("<span class='mx'>" + "".join(
        f"<i style='width:{100 * h['mix'].get(z['name'], 0):.0f}%;background:{z['fill']}'></i>" for z in ZONES) + "</span>")
    item = lambda h: (f"<div>{zc(h['zone'])}{mixbar(h)}<span class='nm'>{html.escape(h['name'])}</span>"
                  f"<span class='md'>{Mm(h['sfh']['price']) if h['sfh']['price'] else '—'}</span>"
                  f"<span class='md cto'>{Mm(h['cto']['price']) if h['cto']['price'] else '—'}</span></div>")
    az = sorted(hoods, key=lambda h: (ZONES.index(h["zone"]), h["name"].lower()))   # zone by zone, A–Z
    half = -(-len(az) // 2)
    idx = "".join("<section>" + "".join(item(h) for h in part) + "</section>" for part in (az[:half], az[half:]))
    zkey = "".join(
        f"<div style='background:{z['fill']};color:{z['ink']}'><b>{z['k']}</b><span>{z['name']}</span><br>"
        f"{sum(1 for h in hoods if h['zone'] is z)} neighborhoods · ~{min(h['temp'] for h in hoods if h['zone'] is z)}–{max(h['temp'] for h in hoods if h['zone'] is z)}°F</div>" for z in ZONES)
    o = [f"<div class='page'><div class='hdr'><div><div class='t'>Heat Map</div>"
         f"<div class='p'>Median sale price by neighborhood, in millions, Jan 1 – {thru}: <b class='sfh'>SFH in navy</b> · <b class='cto'>Condo/TIC/Other in gold</b> · on the city's four fog zones, 1 to 4</div></div></div>",
         "<div class='fm-wrap'><div class='fm-map'>",
         f"<div class='mapbox'>{fog_map(hoods, w=612, h=628)}</div><div class='fm-zkey'>{zkey}</div></div>",
         "<div class='fm-side'><div class='fm-h'>Neighborhood index<i>median: <b class='sfh'>SFH</b> · <b class='cto'>Condo/TIC/Other</b></i></div>",
         f"<div class='fm-idx'>{idx}</div>",
         "</div></div>",
         foot(FOG_NOTE + " Shading: the fog contours. Number: each neighborhood's zone; bar: its mix of zones. Medians this year: single-family (navy), then Condo/TIC/Other (gold); one figure = only that type sold; no label = no sales. °F estimated.")]

    # ── page 2: microclimates and real estate ──
    zst = {z["k"]: mg.stats([r for r in y1 if r.get("propType") in sfh and sale_zone(r) is z]) for z in ZONES}
    cards = []
    for z in ZONES:
        hs = [h for h in hoods if h["zone"] is z]
        t0, t1 = min(h["temp"] for h in hs), max(h["temp"] for h in hs)
        s = zst[z["k"]]
        cards.append(f"<div class='mz-card' style='--z:{z['fill']}'><span class='L'>{z['k']}</span><div class='nm'>{z['name']}</div>"
                     f"<div class='rg'>{len(hs)} neighborhoods</div>"
                     f"<div class='tp'>{t0}–{t1}°<small> est. summer afternoon</small></div>"
                     f"<div class='row'><span>SFH median</span><b>{M(s['price'])}</b></div>"
                     f"<div class='row'><span>$/sf · sales</span><b>${(s['ppsf'] or 0):,.0f} · {s['n']:,}</b></div></div>")
    res = [h for h in hoods if h["homes"] >= 300 and h["sales"] >= 5]  # places people live and buy
    def rows(hs):
        return "".join(f"<tr><td class='l'>{zc(h['zone'])}{html.escape(h['name'])}</td><td class='b'>{h['temp']}°</td>"
                       f"<td>{M(h['all']['price'])}</td><td>{h['all']['n'] or '—'}</td></tr>" for h in hs)
    th = "<tr><th class='l'>Neighborhood</th><th>Est. °F</th><th>Median</th><th>Sales</th></tr>"
    colg = "<colgroup><col style='width:54%'><col style='width:15%'><col style='width:18%'><col style='width:13%'></colgroup>"
    warm = res[:10]; cool = list(reversed(res[-10:]))
    months = clim["months"]; hot = max(months, key=lambda m: m["high"])
    jul = next(m for m in months if m["m"] == "Jul")
    ext = {e["k"]: e for e in clim["extremes"]}
    spread = warm[0]["temp"] - cool[0]["temp"]
    sun_k, pf_k = zst["1"], zst["4"]
    facts = [
        (f"{hot['m']}", f"is the city's warmest month — a {hot['high']}°F normal high, against {jul['high']}°F in July."),
        (f"{spread}°F", f"between the warmest and coolest neighborhoods on a typical summer afternoon: {html.escape(warm[0]['name'])} and {html.escape(cool[0]['name'])}."),
        ("928 ft", "Mount Davidson, the city's highest point (Twin Peaks 922, Sutro 909)."),
        ("52–56°F", "the ocean off Ocean Beach in August."),
        (ext.get("Hottest day on record", {}).get("v", "106°F"), f"the hottest day on record downtown, {ext.get('Hottest day on record', {}).get('when', 'Sep 1, 2017')}."),
        (f"{(sun_k['price'] or 0)/(pf_k['price'] or 1):.1f}×", f"SFH median, Zone 1 vs Zone 4 this year: {M(sun_k['price'])} vs {M(pf_k['price'])}."),
    ]
    facts.append(("800–1,500 ft", "the usual top of the summer fog deck."))
    fact_html = "".join(f"<div class='mz-fact'><b>{a}</b>{b}</div>" for a, b in facts[:8])
    o += [f"<div class='page'><div class='hdr'><div><div class='t'>Microclimates and Real Estate</div>"
          f"<div class='p'>{html.escape(plabel)}</div></div></div>",
          f"<div class='mz-cards'>{''.join(cards)}</div>",
          "<div class='mz-mid'>",
          f"<div class='mz-col'><div class='mz-h'>Warmest 10 ☀</div><table class='mz'>{colg}{th}{rows(warm)}</table></div>",
          f"<div class='mz-col'><div class='mz-h'>Coolest 10 ☁</div><table class='mz'>{colg}{th}{rows(cool)}</table></div>",
          f"<div class='mz-col' style='flex:0.95'><div class='mz-h'>The year downtown, °F</div>{year_chart(months, w=250, h=104)}"
          f"<div class='mz-cap'>Normal high and low by month, downtown, NOAA 1991–2020.</div></div>",
          "</div>"]
    for title, byZ, tot in zone_rows:
        o.append(f"<div class='zh'>Closings by Fog Zone — {title}</div>")
        o.append("<table class='zone'>" + head().replace("<th class='name'>Neighborhood</th>", "<th class='name'>Fog Zone</th>") + "<tbody>")
        for (zn, _, _, st), z in zip(byZ, ZONES):
            o.append(f"<tr><td class='name'>{zc(z)}{html.escape(zn)}</td>"
                     + "".join(cells(st, kind, key) for _, _, kind, key in groups) + "</tr>")
        o.append("</tbody><tfoot><tr><td class='name'>Total — all zones</td>" + "".join(cells(tot, kind, key) for _, _, kind, key in groups) + "</tr></tfoot></table>")
    o.append(f"<div class='mz-h' style='margin-top:5px'>Microclimate facts</div><div class='mz-facts'>{fact_html}</div>")
    o.append(foot(f"{FOG_NOTE} Sales: SFAR MLS closed sales, Jan 1 – {thru}, against {mprior} and the same stretch of {pyear}, each counted by the fog zone at the property — not a valuation of "
                  "any property. Weather and climate figures are approximations. Warmest/coolest: 300+ homes and 5+ sales; °F estimated."))
    return "".join(o)
