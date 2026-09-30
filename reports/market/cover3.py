# "By the numbers" briefing: every bullet is STAT (bold blue) + description
# (black). Page 2 leads with a fog-zone map of the year's closings and stacks
# the three Top 10 tables. Figures come from the same build() as the grids.
import datetime, html, json, math, statistics, importlib.util
spec=importlib.util.spec_from_file_location("cv",__import__("os").path.join(__import__("os").path.dirname(__import__("os").path.abspath(__file__)),"cover.py")); cv=importlib.util.module_from_spec(spec); spec.loader.exec_module(cv)
mg=cv.mg; NAV,NAV_LT,GOLD,GOLD_LT,GOLD_MID,UP,DOWN,INK,MUTED,LINE=cv.NAV,cv.NAV_LT,cv.GOLD,cv.GOLD_LT,cv.GOLD_MID,cv.UP,cv.DOWN,cv.INK,cv.MUTED,cv.LINE
M,D,sgn=cv.M,cv.D,cv.sgn
RENTS=[("May",3480,4000),("Jun",3560,4060),("Jul",3400,4180),("Sep",3400,4250)]
RENT_NOW=4250; RENT_YOY=25.0; RENT_2BR=6020
def pmt(principal,rate,years=30):
    r=rate/100/12; n=years*12; return principal*r/(1-(1+r)**-n)

def rent_rows():
    return [dict(m=MON.index(mo)+1,r25=a_,r26=b_,d=100*(b_-a_)/a_) for mo,a_,b_ in RENTS]

def rent_chart(w=452,h=88):
    lo,hi=3000,4600; pad=14; n=len(RENTS); gw=(w-2*pad)/n; bw=gw*0.28
    Y=lambda v: h-22-(v-lo)/(hi-lo)*(h-40)
    o=[f"<svg width='100%' height='{h}' viewBox='0 0 {w} {h}' preserveAspectRatio='xMidYMid meet'>"]
    for i,(m,a,b) in enumerate(RENTS):
        x0=pad+i*gw+gw/2-bw-2; x1=pad+i*gw+gw/2+2
        o.append(f"<rect x='{x0:.1f}' y='{Y(a):.1f}' width='{bw:.1f}' height='{h-22-Y(a):.1f}' fill='#cfc9c0' rx='2'/>")
        o.append(f"<rect x='{x1:.1f}' y='{Y(b):.1f}' width='{bw:.1f}' height='{h-22-Y(b):.1f}' fill='{NAV}' rx='2'/>")
        o.append(f"<text x='{x0+bw/2:.1f}' y='{Y(a)-4:.1f}' font-size='7' fill='{MUTED}' text-anchor='middle'>{a/1000:.2f}K</text>")
        o.append(f"<text x='{x1+bw/2:.1f}' y='{Y(b)-4:.1f}' font-size='7.4' font-weight='700' fill='{NAV}' text-anchor='middle'>{b/1000:.2f}K</text>")
        o.append(f"<text x='{pad+i*gw+gw/2:.1f}' y='{h-8}' font-size='7.4' fill='{MUTED}' text-anchor='middle'>{m}</text>")
    o.append(f"<rect x='{w-118}' y='4' width='8' height='8' fill='#cfc9c0'/><text x='{w-106}' y='11' font-size='7' fill='{MUTED}'>2025</text>")
    o.append(f"<rect x='{w-72}' y='4' width='8' height='8' fill='{NAV}'/><text x='{w-60}' y='11' font-size='7' fill='{MUTED}'>2026</text>")
    return "".join(o)+"</svg>"


# Unemployment rate, 2026. U.S. seasonally adjusted (BLS Employment Situation);
# California and San Francisco County from EDD monthly releases. Charted through
# July, the last month all three are published — August county data lands Sept 18.
UNEMP=[(1,4.3,5.4,4.1),(2,4.4,5.4,3.8),(3,4.3,5.3,3.7),(4,4.3,5.3,3.5),
       (5,4.3,5.3,3.3),(6,4.2,5.2,3.7),(7,4.1,5.1,3.7)]
# U.S. CPI, year over year, 2026 (BLS monthly releases).
CPI=[(1,2.4),(2,2.4),(3,3.3),(4,3.8),(5,4.2),(6,3.5),(7,3.4),(8,3.4)]
# RentCafe cost-of-living index, San Francisco vs the U.S. average (published Sept 2026).
COL=[("Housing",156),("Utilities",47),("Transportation",41),("Groceries",16)]
COL_OVERALL=64

def monthly_series():
    """Closed sales by month, split single family / condo / other: unit counts,
    dollar volume, and the SFH median list vs median sold. Complete months."""
    import statistics
    F=[f["properties"] for f in json.load(open(mg.SRC))["features"]]
    SFH=mg.SEG["Single Family Residences"]; CO=mg.SEG["Condominiums / TIC / Co-ops"]
    out={}
    for yr in (2025,2026):
        rows=[]
        for m in range(1,13):
            k=f"{yr}-{m:02d}"
            rs=[r for r in F if (r.get("sellingDate") or "").startswith(k) and r.get("sellingPrice")]
            if not rs: continue
            sf=[r for r in rs if r["propType"] in SFH]
            cd=[r for r in rs if r["propType"] in CO]
            ot=[r for r in rs if r["propType"] not in SFH and r["propType"] not in CO]
            sl=[r["listPrice"] for r in sf if r.get("listPrice")]
            cl=[r["listPrice"] for r in (cd+ot) if r.get("listPrice")]
            cs=[r["sellingPrice"] for r in (cd+ot)]
            V=lambda g: sum(r["sellingPrice"] for r in g)
            rows.append(dict(m=m,sfh=len(sf),cd=len(cd),oth=len(ot),co=len(cd)+len(ot),
                             sfh_v=V(sf),cd_v=V(cd),oth_v=V(ot),vol=V(rs),
                             mlist=statistics.median(sl) if sl else None,
                             msold=statistics.median([r["sellingPrice"] for r in sf]) if sf else None,
                             clist=statistics.median(cl) if cl else None,
                             csold=statistics.median(cs) if cs else None))
        out[yr]=rows
    return out

MON="Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split()
def bars(rows,series,w=468,h=176,fmt=lambda v:f"{v:.0f}",ymax=None,legend=None,lab=7,val=6.2):
    """Grouped column chart. series = (label, colour, key[, delta-key]).
    A delta key draws the year-over-year change inside the bar."""
    pad_l,pad_b,pad_t=6,16,14
    keys=[t[2] for t in series]
    vals=[r[k] for r in rows for k in keys if r.get(k) is not None]
    hi=ymax or (max(vals)*1.16 if vals else 1)
    n=len(rows); gw=(w-2*pad_l)/max(n,1); bw=min(gw*0.38,17)
    Y=lambda v:h-pad_b-(v/hi)*(h-pad_b-pad_t)
    o=[f"<svg width='100%' height='{h}' viewBox='0 0 {w} {h}' preserveAspectRatio='xMidYMid meet'>"]
    o.append(f"<line x1='{pad_l}' y1='{h-pad_b}' x2='{w-pad_l}' y2='{h-pad_b}' stroke='{LINE}' stroke-width='0.8'/>")
    for i,r in enumerate(rows):
        cx=pad_l+i*gw+gw/2
        for j,t in enumerate(series):
            key=t[2]; col=t[1]; dk=t[3] if len(t)>3 else None
            v=r.get(key)
            if v is None: continue
            x=cx-bw*len(series)/2+j*bw; bh=h-pad_b-Y(v)
            o.append(f"<rect x='{x:.1f}' y='{Y(v):.1f}' width='{bw-1.5:.1f}' height='{bh:.1f}' fill='{col}' rx='1.5'/>")
            o.append(f"<text x='{x+(bw-1.5)/2:.1f}' y='{Y(v)-2.5:.1f}' font-size='{val}' fill='{MUTED}' text-anchor='middle'>{fmt(v)}</text>")
            d=r.get(dk) if dk else None
            if d and bh>26:
                mx=x+(bw-1.5)/2; my=Y(v)+bh/2
                tc="#ffffff" if col=="#12379E" else "#3F2E00"
                o.append(f"<text transform='rotate(-90 {mx:.1f} {my:.1f})' x='{mx:.1f}' y='{my:.1f}' font-size='{val-0.1}' font-weight='700' fill='{tc}' text-anchor='middle' dominant-baseline='middle'>{d}</text>")
        o.append(f"<text x='{cx:.1f}' y='{h-5}' font-size='{lab}' fill='{MUTED}' text-anchor='middle'>{MON[r['m']-1] if 'm' in r else r['w']}</text>")
    for j,t in enumerate(legend or series):
        lxx=pad_l+j*96
        o.append(f"<rect x='{lxx}' y='2' width='8' height='8' fill='{t[1]}' rx='1.5'/><text x='{lxx+11}' y='9' font-size='7' fill='{INK}'>{t[0]}</text>")
    return "".join(o)+"</svg>"

def stacked(rows,segs,ytd,w=468,h=150,fmt=lambda v:f"{v:.0f}",legend_gap=54):
    """Per month, two stacked columns — prior year (pale) and current (solid).
    segs = (label, pale, solid, key). Values are read as r[key] for the prior
    year and r[key+'_b'] for the current one."""
    pad_l,pad_b,pad_t=6,16,26
    tot=[sum((r.get(k) or 0) for _,_,_,k in segs) for r in rows]+[sum((r.get(k+"_b") or 0) for _,_,_,k in segs) for r in rows]
    hi=(max(tot) or 1)*1.1; n=len(rows); gw=(w-2*pad_l)/max(n,1); bw=min(gw*0.40,14)
    o=[f"<svg width='100%' height='{h}' viewBox='0 0 {w} {h}' preserveAspectRatio='xMidYMid meet'>"]
    o.append(f"<line x1='{pad_l}' y1='{h-pad_b}' x2='{w-pad_l}' y2='{h-pad_b}' stroke='{LINE}' stroke-width='0.8'/>")
    span=h-pad_b-pad_t
    for i,r in enumerate(rows):
        cx=pad_l+i*gw+gw/2
        for j,suf in enumerate(("","_b")):
            vals=[(sg,(r.get(sg[3]+suf) or 0)) for sg in segs]
            t=sum(v for _,v in vals)
            if not t: continue
            x=cx-bw+j*bw; base=h-pad_b
            for sg,v in vals:
                if not v: continue
                hgt=(v/hi)*span
                o.append(f"<rect x='{x:.1f}' y='{base-hgt:.1f}' width='{bw-1.4:.1f}' height='{hgt:.1f}' fill='{sg[2] if suf else sg[1]}' rx='1'/>")
                base-=hgt
            o.append(f"<text x='{x+(bw-1.4)/2:.1f}' y='{base-2.5:.1f}' font-size='5.6' fill='{MUTED}' text-anchor='middle'>{fmt(t)}</text>")
            if suf and r.get("d"):
                my=base+((h-pad_b)-base)/2
                o.append(f"<text transform='rotate(-90 {x+(bw-1.4)/2:.1f} {my:.1f})' x='{x+(bw-1.4)/2:.1f}' y='{my:.1f}' font-size='5.8' font-weight='700' fill='#ffffff' text-anchor='middle' dominant-baseline='middle'>{r['d']}</text>")
        o.append(f"<text x='{cx:.1f}' y='{h-5}' font-size='6.4' fill='{MUTED}' text-anchor='middle'>{MON[r['m']-1]}</text>")
    shown=[sg for sg in segs if sg[0]!="Other"]
    for j,sg in enumerate(shown):
        lxx=pad_l+j*legend_gap
        o.append(f"<rect x='{lxx}' y='2' width='8' height='8' fill='{sg[2]}' rx='1.5'/><text x='{lxx+11}' y='9' font-size='6.8' fill='{INK}'>{sg[0]}</text>")
    o.append(f"<text x='{pad_l+legend_gap*len(shown)+6}' y='9' font-size='6.4' fill='{MUTED}'>light = 2025 · dark = 2026</text>")
    o.append(f"<text x='{w-pad_l}' y='9' font-size='8.4' font-weight='800' fill='{NAV}' text-anchor='end'>YTD {ytd['label']}</text>")
    o.append(f"<text x='{w-pad_l}' y='19' font-size='7.4' fill='{MUTED}' text-anchor='end'>{ytd['sub']}</text>")
    return "".join(o)+"</svg>"

def weekly_bars(rows,w=960,h=172,ytd=None):
    """52-week grid, prior year vs current, with the % change above each
    current-year column and the unit counts for both years below the axis."""
    pad_l,pad_b,pad_t=20,36,16
    vals=[v for r in rows for v in (r["a"],r.get("b")) if v]
    hi=max(vals)*1.22; n=len(rows); gw=(w-pad_l-8)/max(n,1); bw=gw*0.40
    Y=lambda v:h-pad_b-(v/hi)*(h-pad_b-pad_t)
    ax=h-pad_b
    o=[f"<svg width='100%' height='{h}' viewBox='0 0 {w} {h}' preserveAspectRatio='xMidYMid meet'>"]
    o.append(f"<line x1='{pad_l-6}' y1='{ax}' x2='{w-6}' y2='{ax}' stroke='{LINE}' stroke-width='0.8'/>")
    o.append(f"<text x='{pad_l-8}' y='{ax+9}' font-size='5.4' font-weight='700' fill='{MUTED}' text-anchor='end'>'25</text>")
    o.append(f"<text x='{pad_l-8}' y='{ax+17}' font-size='5.4' font-weight='700' fill='{NAV}' text-anchor='end'>'26</text>")
    o.append(f"<text x='{pad_l-8}' y='{ax+27}' font-size='5.4' fill='{MUTED}' text-anchor='end'>wk</text>")
    for i,r in enumerate(rows):
        cx=pad_l+i*gw+gw/2
        for j,(v,col) in enumerate(((r["a"],"#B9BDC4"),(r.get("b"),"#12379E"))):
            if not v: continue
            x=cx-bw+j*bw
            o.append(f"<rect x='{x:.1f}' y='{Y(v):.1f}' width='{bw-1.1:.1f}' height='{ax-Y(v):.1f}' fill='{col}' rx='1'/>")
        if r.get("d"):
            yy=min(Y(r["a"] or 0),Y(r.get("b") or 0))-3
            o.append(f"<text transform='rotate(-90 {cx:.1f} {yy:.1f})' x='{cx:.1f}' y='{yy:.1f}' font-size='5.4' font-weight='700' fill='{r['dc']}' text-anchor='start' dominant-baseline='middle'>{r['d']}</text>")
        o.append(f"<text x='{cx:.1f}' y='{ax+9}' font-size='5.2' fill='{MUTED}' text-anchor='middle'>{r['a'] or ''}</text>")
        o.append(f"<text x='{cx:.1f}' y='{ax+17}' font-size='5.2' font-weight='700' fill='{NAV}' text-anchor='middle'>{r.get('b') if r.get('b') is not None else ''}</text>")
        if r["w"]==1 or r["w"]%4==0:
            o.append(f"<text x='{cx:.1f}' y='{ax+27}' font-size='5.4' fill='{MUTED}' text-anchor='middle'>{r['w']}</text>")
    for j,(lab,col) in enumerate((("2025","#B9BDC4"),("2026","#12379E"))):
        lxx=pad_l+j*54
        o.append(f"<rect x='{lxx}' y='2' width='8' height='8' fill='{col}' rx='1.5'/><text x='{lxx+11}' y='9' font-size='7' fill='{INK}'>{lab}</text>")
    if ytd:
        o.append(f"<text x='{w-6}' y='9' font-size='8.4' font-weight='800' fill='{NAV}' text-anchor='end'>YTD {ytd['label']}</text>")
        o.append(f"<text x='{w-6}' y='19' font-size='7.4' fill='{MUTED}' text-anchor='end'>{ytd['sub']}</text>")
    return "".join(o)+"</svg>"

def weekly_series(through):
    """Closed sales by ISO week: 2025 for the full year, 2026 through the last
    complete month, with the year-over-year change where both years have data."""
    import datetime as _dt, collections as _c
    F=[f["properties"] for f in json.load(open(mg.SRC))["features"]]
    W=lambda d:_dt.date.fromisoformat(d).isocalendar()[1]
    cut=W(through)
    cnt={}
    for yr in (2025,2026):
        cnt[yr]=_c.Counter(W(r["sellingDate"]) for r in F
                           if (r.get("sellingDate") or "").startswith(str(yr)) and r.get("sellingPrice")
                           and (yr==2025 or W(r["sellingDate"])<=cut))
    last=max(max(cnt[2025] or [0]),cut)
    rows=[]
    for k in range(1,last+1):
        a_=cnt[2025].get(k,0); b_=cnt[2026].get(k,0) if k<=cut else None
        d,dc=("",MUTED)
        if a_ and b_: p=100*(b_-a_)/a_; d=f"{p:+.0f}%"; dc=UP if p>=0 else DOWN
        rows.append(dict(w=k,a=a_,b=b_,d=d,dc=dc))
    return rows,cut,sum(cnt[2025].values()),sum(cnt[2026].values()),last

ZONE_FILL=[("Sun","#FBDC7E"),("Transition","#EDCF95"),("Fog","#C3CBD2"),("Persistent Fog","#8D9BA6")]
def zone_color(h):
    if h<8.5: return "#FBDC7E"
    if h<9: return "#EDCF95"
    if h<11: return "#C3CBD2"
    return "#8D9BA6"

def lines(rows,series,w=468,h=176,fmt=lambda v:f"{v/1e6:.2f}M",dkey=None):
    """Line chart. With dkey, each point's year-over-year change is printed
    under its month label so the trend reads straight off the axis."""
    pad_l,pad_b,pad_t=6,(26 if dkey else 16),14
    vals=[r[k] for r in rows for _,_,k in series if r.get(k) is not None]
    lo,hi=min(vals)*0.93,max(vals)*1.07
    n=len(rows); gw=(w-2*pad_l)/max(n-1,1)
    X=lambda i:pad_l+i*gw; Y=lambda v:h-pad_b-(v-lo)/(hi-lo)*(h-pad_b-pad_t)
    o=[f"<svg width='100%' height='{h}' viewBox='0 0 {w} {h}' preserveAspectRatio='xMidYMid meet'>"]
    o.append(f"<line x1='{pad_l}' y1='{h-pad_b}' x2='{w-pad_l}' y2='{h-pad_b}' stroke='{LINE}' stroke-width='0.8'/>")
    for lab,col,key in series:
        pts=[(X(i),Y(r[key])) for i,r in enumerate(rows) if r.get(key) is not None]
        o.append(f"<polyline points='{' '.join(f'{x:.1f},{y:.1f}' for x,y in pts)}' fill='none' stroke='{col}' stroke-width='2'/>")
        for i,(x,y) in enumerate(pts):
            o.append(f"<circle cx='{x:.1f}' cy='{y:.1f}' r='2.1' fill='{col}'/>")
            o.append(f"<text x='{x:.1f}' y='{y-5:.1f}' font-size='6.2' font-weight='700' fill='{col}' text-anchor='middle'>{fmt(rows[i][key])}</text>")
    for i,r in enumerate(rows):
        o.append(f"<text x='{X(i):.1f}' y='{h-(16 if dkey else 5)}' font-size='7' fill='{MUTED}' text-anchor='middle'>{MON[r['m']-1]}</text>")
        if dkey and r.get(dkey) is not None:
            col=UP if r[dkey]>=0 else DOWN
            o.append(f"<text x='{X(i):.1f}' y='{h-4}' font-size='6.6' font-weight='700' fill='{col}' text-anchor='middle'>{r[dkey]:+.0f}%</text>")
    for j,(lab,col,_) in enumerate(series):
        lxx=pad_l+j*120
        o.append(f"<rect x='{lxx}' y='2' width='8' height='8' fill='{col}' rx='1.5'/><text x='{lxx+11}' y='9' font-size='7' fill='{INK}'>{lab}</text>")
    return "".join(o)+"</svg>"

def sales_map(W0,S0,E0,N0,w=352,h=326,window=("2026-01-01","2026-08-31")):
    """The city's land shape coloured by fog zone, one blue dot per closing.
    Zone shapes are pre-intersected with the land outline (map-shapes.json) so
    every part of the city is shaded exactly once."""
    shp=json.load(open(mg.os.path.join(mg.ROOT,"public/data/map-shapes.json")))
    lis=json.load(open(mg.SRC))["features"]
    lat0=math.radians((S0+N0)/2); sx=(E0-W0)*math.cos(lat0); sy=(N0-S0)
    sc=min(w/sx,h/sy); ox=(w-sx*sc)/2; oy=(h-sy*sc)/2
    X=lambda lng:ox+(lng-W0)*math.cos(lat0)*sc; Y=lambda lat:oy+(N0-lat)*sc
    def draw(geom,fill,stroke="none",sw=0):
        out=[]
        parts=[geom["coordinates"]] if geom["type"]=="Polygon" else geom["coordinates"]
        for rings in parts:
            d="".join("M"+" L".join(f"{X(x):.1f},{Y(y):.1f}" for x,y in r)+"Z" for r in rings)
            out.append(f"<path d='{d}' fill='{fill}' fill-rule='evenodd' stroke='{stroke}' stroke-width='{sw}'/>")
        return "".join(out)
    o=[f"<svg width='100%' height='{h}' viewBox='0 0 {w} {h}' preserveAspectRatio='xMidYMid meet'>",
       f"<rect width='{w}' height='{h}' fill='#EDF2F7'/>"]
    for nm,col in ZONE_FILL:
        g=shp["zones"].get(nm)
        if g: o.append(draw(g,col))
    o.append(draw(shp["land"],"none","#ffffff",0.5))
    n=0
    for f in lis:
        d=f["properties"].get("sellingDate") or ""
        if not (window[0]<=d<=window[1]): continue
        x,y=f["geometry"]["coordinates"]
        o.append(f"<circle cx='{X(x):.1f}' cy='{Y(y):.1f}' r='1.45' fill='#12379E' fill-opacity='0.85'/>"); n+=1
    return "".join(o)+"</svg>", n


# Parcel-stock neighborhoods use SF planning names; the listings use MLS names.
# This maps the planning-only names onto the report's areas so stock and sales
# can be compared side by side.
PARCEL_FIX={
 "Mission":"Mission","Dolores Heights":"Castro / Duboce Triangle","Eureka Valley":"Castro / Duboce Triangle",
 "Castro":"Castro / Duboce Triangle","Upper Market":"Castro / Duboce Triangle","Mint Hill":"Mission Dolores",
 "Cayuga":"Excelsior / Portola","University Mound":"Excelsior / Portola","St. Marys Park":"Excelsior / Portola",
 "McLaren Park":"Excelsior / Portola","Bret Harte":"Bayview / Hunters Point","Produce Market":"Bayview / Hunters Point",
 "Apparel City":"Bayview / Hunters Point","India Basin":"Bayview / Hunters Point","Candlestick Point SRA":"Bayview / Hunters Point",
 "Fairmount":"Bernal Heights / Glen Park","Holly Park":"Bernal Heights / Glen Park","Peralta Heights":"Bernal Heights / Glen Park",
 "Buena Vista":"Buena Vista / Corona Heights","Ashbury Heights":"Buena Vista / Corona Heights",
 "Cole Valley":"Cole Valley / Haight","Parnassus Heights":"Cole Valley / Haight",
 "Union Street":"Marina / Cow Hollow","Aquatic Park / Ft. Mason":"Marina / Cow Hollow",
 "Laguna Honda":"West Portal / Forest Hill","Mt. Davidson Manor":"West Portal / Forest Hill",
 "Sutro Heights":"Richmond / Lake Street","Lincoln Park / Ft. Miley":"Richmond / Lake Street",
 "Lower Haight":"Alamo Square / NOPA","Panhandle":"Alamo Square / NOPA",
 "Laurel Heights / Jordan Park":"Lower Pacific / Laurel Hts","Presidio Terrace":"Pacific / Presidio Heights",
 "Presidio National Park":"Pacific / Presidio Heights","Seacliff":"Sea Cliff / Lone Mountain",
 "Lakeshore":"Lake Shore / Stonestown","Parkmerced":"Lake Shore / Stonestown",
 "Ingleside Terraces":"Ingleside Terrace / Lakeside","Sunnydale":"Visitacion Vly / Silver Terr",
 "Lower Nob Hill":"Nob Hill","Polk Gulch":"Nob Hill",
 "Chinatown":"Downtown / Civic Center","Financial District":"Downtown / Civic Center",
 "Downtown / Union Square":"Downtown / Civic Center","Civic Center":"Downtown / Civic Center",
 "Japantown":"Western Addition","Cathedral Hill":"Western Addition",
 "Dogpatch":"Dogpatch","Central Waterfront":"Dogpatch","Showplace Square":"Potrero Hill",
 "Fishermans Wharf":"North Beach / Waterfront","Northern Waterfront":"North Beach / Waterfront",
 "Rincon Hill":"South Beach / Yerba Buena","Golden Gate Park":"Sunset / Parkside",
}
PARCEL_ROWS=[("u1","1 Unit"),("u2_4","2–4"),("u5_9","5–9"),("u10","10+"),("othr","Other")]

def latent_inventory(window):
    """Residential parcel stock per area beside the year's closings, so the
    share of each neighborhood that actually traded is visible."""
    import collections
    par=json.load(open(mg.os.path.join(mg.ROOT,"public/data/parcel-res-by-neighborhood.json")))
    area=lambda n: PARCEL_FIX.get(n) or N2A_(n)
    stock=collections.defaultdict(collections.Counter); skipped=0
    for n,v in par.items():
        a=area(n)
        if not a: skipped+=v.get("total",0); continue
        for k,_ in PARCEL_ROWS: stock[a][k]+=v.get(k,0)
        stock[a]["total"]+=v.get("total",0)
    F=[f["properties"] for f in json.load(open(mg.SRC))["features"]]
    SFH=mg.SEG["Single Family Residences"]
    sold=collections.defaultdict(collections.Counter)
    sfh_rows=collections.defaultdict(list)   # the houses themselves, for price / pace
    for r in F:
        d=r.get("sellingDate") or ""
        if not (window[0]<=d<=window[1]): continue
        a=N2A_(r.get("neighborhood") or "")
        if not a: continue
        sold[a]["sfh" if r["propType"] in SFH else "co"]+=1
        if r["propType"] in SFH: sfh_rows[a].append(r)
    rows=[]
    for a,v in stock.items():
        s=sold.get(a,collections.Counter())
        tot=s["sfh"]+s["co"]
        rows.append(dict(area=a,**{k:v[k] for k,_ in PARCEL_ROWS},total=v["total"],
                         sfh=s["sfh"],co=s["co"],sold=tot,
                         turn=(100*s["sfh"]/v["u1"]) if v["u1"] else None,
                         turn_all=(100*tot/v["total"]) if v["total"] else None,
                         st=mg.stats(sfh_rows.get(a,[]))))
    rows.sort(key=lambda r:-r["total"])
    city=mg.stats([r for rs in sfh_rows.values() for r in rs])
    return rows,skipped,city

def N2A_(n):
    return mg.N2A.get(mg.FIX.get(n or "", n or ""))

# ── Where the money came from ────────────────────────────────────────────
TIERS=[(0,1e6,"Under $1M","#C7D3EA"),(1e6,3e6,"$1–3M","#5273B4"),(3e6,5e6,"$3–5M","#1F3A7A"),(5e6,1e12,"$5M+","#C9A227")]

SGAP=2          # surface gap between touching segments — white does the separating
BARH=44

def fg(fill):
    """White or ink on this fill, whichever clears contrast. Never guessed."""
    r,g,b=(int(fill[i:i+2],16)/255 for i in (1,3,5))
    f=lambda c: c/12.92 if c<=0.04045 else ((c+0.055)/1.055)**2.4
    L=0.2126*f(r)+0.7152*f(g)+0.0722*f(b)
    Li=0.0114                                   # luminance of INK #1c1917
    return "#ffffff" if (1.05/(L+0.05)) > ((L+0.05)/(Li+0.05)) else INK

_W={**{c:0.556 for c in "0123456789$"},",":0.278,".":0.278,"M":0.889,"B":0.667,
    "%":0.889," ":0.278,"\u00b7":0.35,"\u2013":0.556}
def tw(t,size):
    """Approximate Helvetica-Bold advance width, so a label is measured before
    it is placed rather than clipped after."""
    return sum(_W.get(ch,0.6) for ch in t)*size

def fit(txt,avail):
    """Largest type size this block can hold, or None if even the smallest
    would crowd the edges. Padding eases off as the block narrows."""
    for size,pad in ((11,10),(10,6),(9.2,5),(8.4,4)):
        if tw(txt,size)+pad <= avail: return size
    return None

def callouts(o,items,w,ytop):
    """Values too big for their segment ride below the bar on a leader line,
    with a swatch carrying the identity so the text can stay in ink tokens."""
    if not items: return
    laid=[]
    for cx,col,val,pct in sorted(items):
        lab=" \u00b7 "+pct
        width=9+4+tw(val,9.5)+tw(lab,8)
        gx=min(max(cx-width/2,1),w-width-1)
        for px,pw in laid:                       # never let two callouts touch
            if gx < px+pw+8: gx=px+pw+8
        gx=min(gx,w-width-1); laid.append((gx,width))
        o.append(f"<polyline points='{cx:.1f},{ytop+1} {cx:.1f},{ytop+8} "
                 f"{gx+width/2:.1f},{ytop+12} ' fill='none' stroke='{LINE}' stroke-width='1'/>")
        o.append(f"<rect x='{gx:.1f}' y='{ytop+14:.1f}' width='9' height='9' fill='{col}' rx='1.5'/>")
        o.append(f"<text x='{gx+13:.1f}' y='{ytop+22:.1f}' font-size='9.5' font-weight='800' fill='{INK}'>{val}"
                 f"<tspan font-size='8' font-weight='500' fill='{MUTED}'>{lab}</tspan></text>")

def money_split(rows):
    """Sales count and dollar total for each price tier."""
    out=[]
    n=len(rows); tot=sum(r["sellingPrice"] for r in rows)
    for lo,hi,lab,col in TIERS:
        seg=[r for r in rows if lo<=r["sellingPrice"]<hi]
        v=sum(r["sellingPrice"] for r in seg)
        out.append(dict(lab=lab,col=col,n=len(seg),v=v,pn=100*len(seg)/n,pv=100*v/tot))
    return out,n,tot

def mirror_bars(split,w=470,h=206):
    """Two bars on one scale. The top counts homes sold, the bottom counts the
    dollars they brought in. Blocks are sized by share and labelled with the real
    figure; the heading over each bar says which count it is, so the bars get the
    full width and the numbers sit inside."""
    pad_l,gap=2,38; bw=w-pad_l-2; y1=34; y2=y1+BARH+gap
    o=[f"<svg width='100%' height='{h}' viewBox='0 0 {w} {h}' preserveAspectRatio='xMidYMid meet'>"]
    for yy,key,title,fmt in ((y1,"pn","UNITS SOLD — ALL TYPES",lambda d:f"{d['n']:,}"),
                             (y2,"pv","MONEY SPENT",lambda d:f"${d['v']/1e6:,.0f}M")):
        o.append(f"<text x='{pad_l}' y='{yy-8}' font-size='8.6' font-weight='800' fill='{NAV}' letter-spacing='0.4'>{title}</text>")
        x=pad_l; out=[]
        for d in split:
            wseg=bw*d[key]/100; col=d["col"]; tc=fg(col)
            val=fmt(d); pct=f"{d[key]:.0f}%"; avail=max(wseg-SGAP,0.8)
            o.append(f"<rect x='{x:.1f}' y='{yy}' width='{avail:.1f}' height='{BARH}' fill='{col}'/>")
            fs=fit(val,avail)
            if fs:
                ps=min(7.6,fs*0.74); cx=x+avail/2
                o.append(f"<text x='{cx:.1f}' y='{yy+21:.1f}' font-size='{fs}' font-weight='800' fill='{tc}' text-anchor='middle'>{val}</text>")
                o.append(f"<text x='{cx:.1f}' y='{yy+34:.1f}' font-size='{ps:.1f}' fill='{tc}' fill-opacity='0.82' text-anchor='middle'>{pct}</text>")
            else:
                out.append((x+wseg/2,col,val,pct))
            x+=wseg
        callouts(o,out,w,yy+BARH)
    lx=pad_l; ly=h-6; step=bw/len(split)
    for d in split:
        o.append(f"<rect x='{lx:.1f}' y='{ly-8}' width='9' height='9' fill='{d['col']}' rx='1.5'/>")
        o.append(f"<text x='{lx+12:.1f}' y='{ly-1}' font-size='7.6' fill='{INK}'>{d['lab']}</text>")
        lx+=step
    return "".join(o)+"</svg>"

def hood_bars(rank,tot,w=300,h=300,top=11):
    """Neighborhoods ranked by dollars closed, with a line marking where half
    the city's money sits. Values print inside the bar so nothing runs off."""
    mx=rank[0][1]; nw=124; bx=nw+6; bw=w-bx-4
    rowh=(h-30)/top
    o=[f"<svg width='100%' height='{h}' viewBox='0 0 {w} {h}' preserveAspectRatio='xMidYMid meet'>"]
    cum=0; half_y=None
    for i,(a_,v) in enumerate(rank[:top]):
        cum+=v; y=6+i*rowh
        nm=a_ if len(a_)<=27 else a_[:26]+"…"
        o.append(f"<text x='0' y='{y+rowh*0.66:.1f}' font-size='7.4' fill='{INK}'>{nm}</text>")
        wseg=bw*v/mx
        o.append(f"<rect x='{bx}' y='{y+1.5:.1f}' width='{wseg:.1f}' height='{rowh-5:.1f}' fill='{NAV}' rx='1.5'/>")
        inside = wseg>44
        o.append(f"<text x='{bx+wseg-4 if inside else bx+wseg+3:.1f}' y='{y+rowh*0.66:.1f}' font-size='7.2' font-weight='700' "
                 f"fill='{'#ffffff' if inside else NAV}' text-anchor='{'end' if inside else 'start'}'>${v/1e6:,.0f}M</text>")
        if half_y is None and cum>=tot/2: half_y=y+rowh-1.5
    if half_y:
        o.append(f"<line x1='0' y1='{half_y:.1f}' x2='{w}' y2='{half_y:.1f}' stroke='{GOLD}' stroke-width='1.5' stroke-dasharray='4 3'/>")
        o.append(f"<text x='{w}' y='{half_y-3.5:.1f}' font-size='7.4' font-weight='800' fill='{GOLD}' text-anchor='end'>↑ half of all the money in the city</text>")
    return "".join(o)+"</svg>"

def type_mirror(rows,w=470,h=168):
    """Houses against condos, counted the same two ways as the chart above."""
    SFH=mg.SEG["Single Family Residences"]
    n=len(rows); tot=sum(r["sellingPrice"] for r in rows)
    h_=[r for r in rows if r["propType"] in SFH]; c_=[r for r in rows if r["propType"] not in SFH]
    segs=[("Houses","#12379E",len(h_),sum(r["sellingPrice"] for r in h_)),
          ("Condo / TIC / Other","#C9A227",len(c_),sum(r["sellingPrice"] for r in c_))]
    pad_l,gap=2,34; bw=w-pad_l-2; y1=22; y2=y1+BARH+gap
    o=[f"<svg width='100%' height='{h}' viewBox='0 0 {w} {h}' preserveAspectRatio='xMidYMid meet'>"]
    for yy,idx,total,title,fmt in ((y1,2,n,"UNITS SOLD",lambda v:f"{v:,}"),
                                   (y2,3,tot,"MONEY SPENT",lambda v:f"${v/1e9:.2f}B")):
        o.append(f"<text x='{pad_l}' y='{yy-8}' font-size='8.6' font-weight='800' fill='{NAV}' letter-spacing='0.4'>{title}</text>")
        x=pad_l; out=[]
        for lab,col,cnt,val in segs:
            v=cnt if idx==2 else val; share=100*v/total
            wseg=bw*share/100; tc=fg(col); txt=fmt(v); pct=f"{share:.0f}%"; avail=max(wseg-SGAP,0.8)
            o.append(f"<rect x='{x:.1f}' y='{yy}' width='{avail:.1f}' height='{BARH}' fill='{col}'/>")
            fs=fit(txt,avail)
            if fs:
                ps=min(7.6,fs*0.74); cx=x+avail/2
                o.append(f"<text x='{cx:.1f}' y='{yy+21:.1f}' font-size='{fs}' font-weight='800' fill='{tc}' text-anchor='middle'>{txt}</text>")
                o.append(f"<text x='{cx:.1f}' y='{yy+34:.1f}' font-size='{ps:.1f}' fill='{tc}' fill-opacity='0.82' text-anchor='middle'>{pct}</text>")
            else:
                out.append((x+wseg/2,col,txt,pct))
            x+=wseg
        callouts(o,out,w,yy+BARH)
    lx=pad_l; ly=h-6
    for lab,col,_,_ in segs:
        o.append(f"<rect x='{lx:.1f}' y='{ly-8}' width='9' height='9' fill='{col}' rx='1.5'/>")
        o.append(f"<text x='{lx+12:.1f}' y='{ly-1}' font-size='7.6' fill='{INK}'>{lab}</text>")
        lx+=bw/2
    return "".join(o)+"</svg>"

# ── Bond market ──────────────────────────────────────────────────────────
# 10-year Treasury, month-end readings (U.S. Treasury via Advisor Perspectives,
# CNBC and Bloomberg reporting of the daily close). Sept 2026 is the current level.
TEN_Y=[("Sep'25",4.04),("Oct",4.11),("Nov",4.14),("Dec",4.16),("Jan'26",4.24),("Feb",4.04),
       ("Mar",4.38),("Apr",4.30),("May",4.50),("Jun",4.44),("Jul",4.75),("Aug",4.78),("Sep'26",5.02)]
CURVE=[("3 mo",3.91),("2 yr",4.37),("10 yr",4.78),("30 yr",5.24)]   # full par curve, Sept 4 2026
TWO_NOW, TEN_NOW, MTG_NOW = 4.74, 5.02, 6.76                        # after the Sept 16 Fed hike
MED_SFH, MED_CO = 2_075_000, 1_275_000

def yield_chart(w=470,h=150):
    """10-year Treasury over twelve months, with the 5% line marked."""
    lo,hi=3.85,5.30; pad_l,pad_b,pad_t=8,17,18
    n=len(TEN_Y); gw=(w-2*pad_l)/(n-1)
    X=lambda i:pad_l+i*gw; Y=lambda v:h-pad_b-(v-lo)/(hi-lo)*(h-pad_b-pad_t)
    o=[f"<svg width='100%' height='{h}' viewBox='0 0 {w} {h}' preserveAspectRatio='xMidYMid meet'>"]
    o.append(f"<line x1='{pad_l}' y1='{Y(5.0):.1f}' x2='{w-pad_l}' y2='{Y(5.0):.1f}' stroke='{DOWN}' stroke-width='0.9' stroke-dasharray='3 3'/>")
    o.append(f"<text x='{pad_l+2}' y='{Y(5.0)-3:.1f}' font-size='6.4' font-weight='700' fill='{DOWN}'>5% — first time since 2007</text>")
    pts=[(X(i),Y(v)) for i,(_,v) in enumerate(TEN_Y)]
    o.append(f"<polygon points='{' '.join(f'{x:.1f},{y:.1f}' for x,y in pts)} {X(n-1):.1f},{h-pad_b} {pad_l},{h-pad_b}' fill='{NAV}' fill-opacity='0.08'/>")
    o.append(f"<polyline points='{' '.join(f'{x:.1f},{y:.1f}' for x,y in pts)}' fill='none' stroke='{NAV}' stroke-width='2.2'/>")
    for i,(lab,v) in enumerate(TEN_Y):
        last=i==len(TEN_Y)-1
        o.append(f"<circle cx='{X(i):.1f}' cy='{Y(v):.1f}' r='{3.2 if last else 2}' fill='{DOWN if last else NAV}'/>")
        o.append(f"<text x='{X(i):.1f}' y='{Y(v)-5:.1f}' font-size='6.2' font-weight='{800 if last else 400}' fill='{DOWN if last else MUTED}' text-anchor='middle'>{v:.2f}</text>")
        o.append(f"<text x='{X(i):.1f}' y='{h-5}' font-size='6.2' fill='{MUTED}' text-anchor='middle'>{lab}</text>")
    return "".join(o)+"</svg>"

def curve_chart(w=228,h=116):
    """The par curve: short money on the left, long money on the right."""
    vs=[v for _,v in CURVE]; lo,hi=min(vs)-0.25,max(vs)+0.35
    pad_l,pad_b,pad_t=12,16,16; n=len(CURVE); gw=(w-2*pad_l)/(n-1)
    X=lambda i:pad_l+i*gw; Y=lambda v:h-pad_b-(v-lo)/(hi-lo)*(h-pad_b-pad_t)
    o=[f"<svg width='100%' height='{h}' viewBox='0 0 {w} {h}' preserveAspectRatio='xMidYMid meet'>"]
    pts=[(X(i),Y(v)) for i,(_,v) in enumerate(CURVE)]
    o.append(f"<polyline points='{' '.join(f'{x:.1f},{y:.1f}' for x,y in pts)}' fill='none' stroke='{GOLD}' stroke-width='2.2'/>")
    for i,(lab,v) in enumerate(CURVE):
        o.append(f"<circle cx='{X(i):.1f}' cy='{Y(v):.1f}' r='2.4' fill='{GOLD}'/>")
        o.append(f"<text x='{X(i):.1f}' y='{Y(v)-5:.1f}' font-size='6.6' font-weight='700' fill='{GOLD}' text-anchor='middle'>{v:.2f}</text>")
        o.append(f"<text x='{X(i):.1f}' y='{h-4}' font-size='6.6' fill='{MUTED}' text-anchor='middle'>{lab}</text>")
    o.append(f"<text x='{w-pad_l}' y='10' font-size='6.2' fill='{UP}' text-anchor='end' font-weight='700'>rising = normal</text>")
    return "".join(o)+"</svg>"

def spread_chart(w=470,h=158):
    """The 10-year and the 30-year mortgage on one scale: the shaded band
    between them is the lender spread, and it barely moves."""
    ten={"Jan":4.24,"Feb":4.04,"Mar":4.38,"Apr":4.30,"May":4.50,"Jun":4.44,"Jul":4.75,"Aug":4.78,"Now":5.02}
    mtg=dict(cv.RATES); mtg["Now"]=cv.RATE_NOW
    labs=[k for k in ten if k in mtg]
    lo,hi=3.8,7.1; pad_l,pad_b,pad_t=8,26,16
    n=len(labs); gw=(w-2*pad_l)/(n-1)
    X=lambda i:pad_l+i*gw; Y=lambda v:h-pad_b-(v-lo)/(hi-lo)*(h-pad_b-pad_t)
    top=[(X(i),Y(mtg[k])) for i,k in enumerate(labs)]
    bot=[(X(i),Y(ten[k])) for i,k in enumerate(labs)]
    o=[f"<svg width='100%' height='{h}' viewBox='0 0 {w} {h}' preserveAspectRatio='xMidYMid meet'>"]
    o.append(f"<polygon points='{' '.join(f'{x:.1f},{y:.1f}' for x,y in top)} {' '.join(f'{x:.1f},{y:.1f}' for x,y in reversed(bot))}' fill='{GOLD}' fill-opacity='0.18'/>")
    for pts,col,lab in ((top,GOLD,"30-yr mortgage"),(bot,NAV,"10-yr Treasury")):
        o.append(f"<polyline points='{' '.join(f'{x:.1f},{y:.1f}' for x,y in pts)}' fill='none' stroke='{col}' stroke-width='2.2'/>")
        for x,y in pts: o.append(f"<circle cx='{x:.1f}' cy='{y:.1f}' r='2' fill='{col}'/>")
    for i,k in enumerate(labs):
        o.append(f"<text x='{X(i):.1f}' y='{Y(mtg[k])-5:.1f}' font-size='6' fill='{GOLD}' text-anchor='middle' font-weight='700'>{mtg[k]:.2f}</text>")
        o.append(f"<text x='{X(i):.1f}' y='{Y(ten[k])+9:.1f}' font-size='6' fill='{NAV}' text-anchor='middle' font-weight='700'>{ten[k]:.2f}</text>")
        o.append(f"<text x='{X(i):.1f}' y='{h-14}' font-size='6.4' fill='{MUTED}' text-anchor='middle'>{k}</text>")
        sp=mtg[k]-ten[k]
        o.append(f"<text x='{X(i):.1f}' y='{h-4}' font-size='6.2' font-weight='700' fill='{INK}' text-anchor='middle'>{sp:.2f}</text>")
    o.append(f"<text x='{pad_l}' y='10' font-size='6.6' fill='{GOLD}' font-weight='700'>30-yr mortgage</text>")
    o.append(f"<text x='{pad_l+86}' y='10' font-size='6.6' fill='{NAV}' font-weight='700'>10-yr Treasury</text>")
    o.append(f"<text x='{w-pad_l}' y='10' font-size='6.2' fill='{MUTED}' text-anchor='end'>shaded band = lender spread (bottom row)</text>")
    return "".join(o)+"</svg>"

PROP_TAX=0.0118        # San Francisco property tax, roughly 1.18% of assessed value
LUX_EVENTS={6:"Nasdaq peak",7:"Nasdaq −10%",8:"OpenAI $7B tender"}

def lux_series(lo=5e6,hi=float("inf")):
    """Monthly count of sales in a price band, prior year and current."""
    import collections
    F=[f["properties"] for f in json.load(open(mg.SRC))["features"]]
    c={}
    for yr in (2025,2026):
        c[yr]=collections.Counter(int(r["sellingDate"][5:7]) for r in F
            if (r.get("sellingDate") or "").startswith(str(yr)) and r.get("sellingPrice") and lo<=r["sellingPrice"]<hi)
    return c

def lux_chart(w=470,h=176,through=8):
    c=lux_series(); hi_=max(max(c[2025].values()),max(c[2026].values()))*1.34
    pad_l,pad_b,pad_t=10,17,14; n=through; gw=(w-2*pad_l)/n; bw=gw*0.34
    Y=lambda v:h-pad_b-(v/hi_)*(h-pad_b-pad_t)
    o=[f"<svg width='100%' height='{h}' viewBox='0 0 {w} {h}' preserveAspectRatio='xMidYMid meet'>"]
    o.append(f"<line x1='{pad_l}' y1='{h-pad_b}' x2='{w-pad_l}' y2='{h-pad_b}' stroke='{LINE}' stroke-width='0.8'/>")
    for i in range(n):
        m=i+1; cx=pad_l+i*gw+gw/2
        for j,(v,col) in enumerate(((c[2025].get(m,0),"#B9BDC4"),(c[2026].get(m,0),"#12379E"))):
            if not v: continue
            x=cx-bw+j*bw
            o.append(f"<rect x='{x:.1f}' y='{Y(v):.1f}' width='{bw-1.5:.1f}' height='{h-pad_b-Y(v):.1f}' fill='{col}' rx='1.5'/>")
            o.append(f"<text x='{x+(bw-1.5)/2:.1f}' y='{Y(v)-2.5:.1f}' font-size='6.4' font-weight='700' fill='{col if j else MUTED}' text-anchor='middle'>{v}</text>")
        o.append(f"<text x='{cx:.1f}' y='{h-5}' font-size='6.8' fill='{MUTED}' text-anchor='middle'>{MON[i]}</text>")
        if m in LUX_EVENTS:
            yy=Y(c[2026].get(m,0))-12
            o.append(f"<line x1='{cx:.1f}' y1='{yy+3:.1f}' x2='{cx:.1f}' y2='{Y(c[2026].get(m,0))-4:.1f}' stroke='{DOWN}' stroke-width='0.7'/>")
            o.append(f"<text x='{cx:.1f}' y='{yy:.1f}' font-size='5.8' font-weight='700' fill='{DOWN}' text-anchor='middle'>{LUX_EVENTS[m]}</text>")
    for j,(lab,col) in enumerate((("2025","#B9BDC4"),("2026","#12379E"))):
        lxx=pad_l+j*48
        o.append(f"<rect x='{lxx}' y='2' width='8' height='8' fill='{col}' rx='1.5'/><text x='{lxx+11}' y='9' font-size='7' fill='{INK}'>{lab}</text>")
    return "".join(o)+"</svg>"

def carry_chart(w=228,h=120,price=8e6):
    """What the 10-year yield costs a cash buyer each year on an $8M house."""
    pts=[(lab,price*v/100) for lab,v in TEN_Y]
    lo,hi=min(v for _,v in pts)*0.95,max(v for _,v in pts)*1.10
    pad_l,pad_b,pad_t=10,16,16; n=len(pts); gw=(w-2*pad_l)/(n-1)
    X=lambda i:pad_l+i*gw; Y=lambda v:h-pad_b-(v-lo)/(hi-lo)*(h-pad_b-pad_t)
    o=[f"<svg width='100%' height='{h}' viewBox='0 0 {w} {h}' preserveAspectRatio='xMidYMid meet'>"]
    poly=[(X(i),Y(v)) for i,(_,v) in enumerate(pts)]
    o.append(f"<polygon points='{' '.join(f'{x:.1f},{y:.1f}' for x,y in poly)} {X(n-1):.1f},{h-pad_b} {pad_l},{h-pad_b}' fill='{DOWN}' fill-opacity='0.10'/>")
    o.append(f"<polyline points='{' '.join(f'{x:.1f},{y:.1f}' for x,y in poly)}' fill='none' stroke='{DOWN}' stroke-width='2'/>")
    for i in (0,len(pts)-1):
        lab,v=pts[i]
        o.append(f"<circle cx='{X(i):.1f}' cy='{Y(v):.1f}' r='2.6' fill='{DOWN}'/>")
        o.append(f"<text x='{X(i):.1f}' y='{Y(v)-5:.1f}' font-size='7' font-weight='800' fill='{DOWN}' text-anchor='{'start' if i==0 else 'end'}'>${v/1000:.0f}K</text>")
        o.append(f"<text x='{X(i):.1f}' y='{h-4}' font-size='6.4' fill='{MUTED}' text-anchor='{'start' if i==0 else 'end'}'>{lab}</text>")
    return "".join(o)+"</svg>"

def mtg_pmt(P,r,yrs=30):
    i=r/100/12; n=yrs*12; return P*i/(1-(1+i)**-n)

def _money_by_hood(rows):
    import collections
    out=collections.Counter()
    for r in rows:
        a=N2A_(r.get("neighborhood") or "")
        if a: out[a]+=r["sellingPrice"]
    return out

def zone_gap():
    """Sun (incl. Transition) vs Fog (incl. Persistent) across ALL property
    types. Reported per square foot: the Sun zone is 84% condos and the Fog
    zone 80% houses, so a raw median compares condos with houses and inverts."""
    import statistics
    F=[f["properties"] for f in json.load(open(mg.SRC))["features"]]
    g=lambda h: None if h is None else ("Sun" if h<9 else "Fog")
    out={}
    for yr,(a,b) in (("cur",("2026-01-01","2026-08-31")),("prior",("2025-01-01","2025-08-31"))):
        rs=[r for r in F if r.get("sellingDate") and a<=r["sellingDate"]<=b]
        v={}
        for z in ("Sun","Fog"):
            ps=[r["sellingPrice"]/r["sqft"] for r in rs if g(r.get("fogHours"))==z and r.get("sellingPrice") and r.get("sqft")]
            v[z]=statistics.median(ps) if ps else None
        out[yr]=v
    return out

def build():
    pages,plabel,labels,W,seg,top,S,mon=cv.facts()
    SF="Single Family Residences"; CO="Condominiums / TIC / Co-ops"
    s,c=seg[SF],seg[CO]; st,ct=s["tot"],c["tot"]
    mo=datetime.date.fromisoformat(W["m1"][0]); mname=mo.strftime("%B"); yy=str(mo.year)[2:]; py=str(mo.year-1)[2:]
    thru=datetime.date.fromisoformat(W["m1"][1]).strftime("%B %-d")
    allv1=sum(r["sellingPrice"] for r in S["y1"]); allv0=sum(r["sellingPrice"] for r in S["y0"])
    zs={z[0]:z[3] for z in s["byZ"]}; zc={z[0]:z[3] for z in c["byZ"]}
    sun,pf,tr,fg=zs["Sun"]["y1"],zs["Persistent Fog"]["y1"],zs["Transition"]["y1"],zs["Fog"]["y1"]
    peak=max(mon,key=lambda x:x[1]); ratio0=zs['Sun']['y0']['price']/zs['Persistent Fog']['y0']['price']
    byA={name:{a:stt for a,stt in byA_} for (name,byA_,_,_) in pages}
    sb=byA[CO].get("South Beach / Yerba Buena"); mb=byA[CO].get("Mission Bay")
    loan=RENT_NOW/pmt(1,cv.RATE_NOW)
    pac=[x for x in s['top']+s['bot'] if 'Pacific / Presidio' in x[1]]; pacpct=sgn(pac[0][0]) if pac else "+7"
    mapsvg,ndots=sales_map(-122.517,37.705,-122.353,37.833,w=352,h=430)
    css=f"""
    @page {{ size: letter landscape; margin: 0.32in 0.35in; }}
    body {{ margin:0; font-family: Helvetica, Arial, sans-serif; color:{INK}; }}
    .page {{ width:10.3in; height:7.6in; page-break-after:always; position:relative; box-sizing:border-box; background:#fff; }}
    .mast {{ border-bottom:3px solid {GOLD_MID}; padding-bottom:4px; margin-bottom:5px; display:flex; justify-content:space-between; align-items:flex-end; }}
    .mast .t {{ font-size:24px; font-weight:800; color:{NAV}; letter-spacing:-0.5px; }}
    .mast .p {{ font-size:11.5px; color:{NAV}; margin-top:2px; }} .mast .p b {{ color:{GOLD}; }}
    .mast .by {{ font-size:9px; color:{MUTED}; text-align:right; line-height:1.5; }}
    .kpis {{ display:flex; gap:8px; margin-bottom:7px; }}
    .kpi {{ flex:1; min-width:0; background:{NAV_LT}; border-radius:8px; padding:10px 8px 11px; border-left:5px solid {GOLD_MID}; text-align:center; display:flex; flex-direction:column; justify-content:space-between; height:62px; }}
    .kl {{ font-size:8.6px; color:{INK}; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; line-height:1.1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }}
    .kv {{ font-family:Georgia,'Bitstream Charter','Liberation Serif',serif; font-size:22px; font-weight:700; letter-spacing:-0.6px; line-height:1; margin:0; color:{NAV}; white-space:nowrap; font-variant-numeric:tabular-nums; }}
    .ks {{ font-size:9.6px; font-weight:700; line-height:1; white-space:nowrap; }}
    .cols {{ display:flex; gap:12px; }} .col {{ flex:1; min-width:0; }}
    h2.band {{ font-size:12.5px; margin-bottom:5px; }}
    h2 {{ font-size:12px; font-weight:800; color:#fff; background:{NAV}; padding:3px 8px; border-radius:4px; margin:0 0 5px; letter-spacing:0.3px; }}
    ul {{ margin:0 0 7px; padding-left:0; list-style:none; }}
    li {{ font-size:10px; line-height:1.35; margin:0 0 6px; padding-left:11px; position:relative; color:{INK}; }}
    li:before {{ content:''; position:absolute; left:0; top:4.5px; width:5px; height:5px; border-radius:50%; background:{NAV}; }}
    .st {{ color:{NAV}; font-weight:800; }}
    .hl li {{ padding-left:0; }} .hl li:before {{ display:none; }}
    .tag {{ display:inline-block; font-size:7.6px; font-weight:800; color:#fff; background:{NAV}; padding:1px 5px; border-radius:3px; margin-right:5px; vertical-align:1px; letter-spacing:0.3px; }}
    .tag.y {{ background:{GOLD}; }}
    .charts {{ display:flex; gap:12px; margin-top:4px; border-top:1.5px solid {GOLD_MID}; padding-top:6px; }}
    .cap {{ font-size:8.4px; line-height:1.3; margin-top:1px; }} .src {{ font-size:7.2px; color:{MUTED}; }}
    .charts .ch {{ flex:1; min-width:0; }} .charts .cap {{ font-size:9.6px; line-height:1.4; margin-top:-2px; }} .charts .src {{ font-size:7.4px; color:{MUTED}; }}
    table.top {{ border-collapse:collapse; width:100%; font-size:8.6px; margin-bottom:6px; }}
    table.top th {{ background:{NAV}; color:#fff; font-size:6.9px; text-transform:uppercase; padding:2px 4px; text-align:right; }}
    table.top th.l, table.top td.l {{ text-align:left; }}
    table.top td {{ padding:1.9px 4px; text-align:right; border-bottom:0.4px solid {LINE}; white-space:nowrap; overflow:hidden; }}
    table.top tr:nth-child(even) td {{ background:#faf9f7; }}
    table.top td.b {{ font-weight:800; color:{NAV}; }}
    .mapwrap {{ border:1px solid {LINE}; border-radius:6px; overflow:hidden; line-height:0; }}
    .maplegend {{ display:flex; align-items:center; flex-wrap:nowrap; gap:7px; font-size:7.6px; white-space:nowrap; color:{INK}; margin:4px 0 2px; }}
    .maplegend b {{ color:{NAV}; }}
    .dotkey {{ display:inline-block; width:7px; height:7px; border-radius:50%; background:#12379E; margin-right:3px; }}
    .zk {{ display:inline-flex; align-items:center; gap:3px; }}
    .zc {{ display:inline-block; width:9px; height:9px; border-radius:2px; border:0.5px solid #a8a29e; }}
    .mapcap {{ font-size:8.4px; color:{MUTED}; margin:3px 0 6px; line-height:1.35; }}
    .pull {{ margin-top:8px; border-left:5px solid {GOLD_MID}; background:{NAV_LT}; border-radius:7px; padding:11px 14px; }}
    .pq {{ font-family:Georgia,'Bitstream Charter','Liberation Serif',serif; font-size:17px; font-weight:700; color:{NAV}; line-height:1.25; letter-spacing:-0.3px; }}
    .pqs {{ font-size:10px; color:{INK}; margin-top:5px; }}
    .sig {{ background:{GOLD_LT}; border-left:3px solid {GOLD_MID}; border-radius:6px; padding:8px 11px; font-size:10px; line-height:1.45; }}
    .sig b {{ color:{GOLD}; }}
    table.linv {{ border-collapse:collapse; width:100%; font-size:8.2px; table-layout:fixed; }}
    table.linv th, table.linv td {{ padding:2.1px 3px; text-align:right; white-space:nowrap; }}
    table.linv thead tr.g th {{ background:{NAV}; color:#fff; font-size:7.6px; text-transform:uppercase; letter-spacing:0.2px; text-align:center; padding:3px; border-left:2px solid #fff; }}
    table.linv thead tr.g th.l {{ text-align:left; border-left:none; }}
    table.linv thead tr.sub th {{ background:{NAV_LT}; color:{NAV}; font-size:7px; font-weight:700; border-bottom:1.5px solid {NAV}; }}
    table.linv td.l, table.linv tfoot td.l {{ text-align:left; font-weight:600; overflow:hidden; text-overflow:ellipsis; }}
    table.linv tbody td {{ border-bottom:0.4px solid {LINE}; }}
    table.linv tbody tr:nth-child(even) td {{ background:#faf9f7; }}
    table.linv td.b {{ font-weight:800; color:{NAV}; }}
    table.linv td.g0, table.linv th.g0 {{ border-left:1.5px solid #cfc9c0; }}
    ul.math {{ list-style:none; margin:4px 0 0; padding:0; font-size:9px; }}
    ul.math li {{ display:flex; justify-content:space-between; padding:2.5px 0; margin:0; border-bottom:0.5px solid {LINE}; }}
    ul.math li::before {{ content:none !important; display:none !important; }}
    ul.math li.tot {{ border-bottom:none; border-top:1.2px solid {NAV}; font-weight:700; }}
    ul.math li.tot b {{ font-size:11px; color:{NAV}; }}
    ul.sigl {{ margin:3px 0 0; padding-left:14px; }}
    ul.sigl li {{ margin:2px 0; }}
    .lkpi {{ display:grid; grid-template-columns:repeat(4,1fr); gap:8px; margin:6px 0 8px; }}
    .lkpi div {{ background:{NAV_LT}; border-left:3px solid {GOLD_MID}; border-radius:4px; padding:5px 8px; }}
    .lkpi b {{ display:block; font-size:17px; color:{NAV}; font-weight:800; }}
    .lkpi span {{ font-size:8px; color:{MUTED}; }}
    table.lsfh {{ font-size:8.4px; }}
    table.lsfh thead tr.g th {{ text-align:left; }}
    table.lsfh td.bar {{ text-align:left; }}
    table.lsfh td.one {{ color:{MUTED}; }}
    .lh, .lt {{ display:inline-block; vertical-align:middle; height:7px; border-radius:2px; background:#eceae6; }}
    .lh {{ width:96px; }} .lt {{ width:70px; }}
    table.lsfh thead tr.g th.r {{ text-align:right; }}
    table.lsfh tfoot td {{ font-weight:800; color:{NAV}; border-top:1.5px solid {NAV}; padding-top:3px; }}
    .lhf, .ltf {{ display:block; height:7px; border-radius:2px; }}
    .lhf {{ background:#b9c7d8; }} .ltf {{ background:{NAV}; }} .ltf.thin {{ background:#9aa6b6; }}
    .lhv, .ltv {{ display:inline-block; margin-left:5px; vertical-align:middle; font-weight:700; color:{INK}; }}
    table.linv tfoot td {{ background:{GOLD_LT}; font-weight:800; border-top:2px solid {GOLD_MID}; border-bottom:2px solid {GOLD_MID}; }}
    td.bar {{ text-align:left; }}
    .db {{ display:inline-block; width:46px; height:7px; background:#e7e3dc; border-radius:2px; vertical-align:-1px; overflow:hidden; }}
    .dbf {{ display:block; height:7px; border-radius:2px; }}
    .dbv {{ margin-left:4px; font-weight:700; }}
    .foot {{ position:absolute; bottom:0; left:0; right:0; font-size:7px; color:{MUTED}; border-top:0.5px solid {LINE}; padding-top:3px; display:flex; justify-content:space-between; }}
    """
    CHIP=lambda c: f"<span style='display:inline-block;width:9px;height:9px;border-radius:2px;background:{c};border:0.5px solid #a8a29e;vertical-align:-1px;margin-left:2px'></span>"
    B=lambda stat,desc: f"<li><span class='st'>{stat}</span> — {desc}</li>"
    H=lambda tag,stat,desc,gold=False: f"<li><span class='tag{' y' if gold else ''}'>{tag}</span><span class='st'>{stat}</span> — {desc}</li>"
    def kpi(label,value,vs,color=UP):
        return (f"<div class='kpi'><div class='kl'>{label}</div><div class='kv'>{value}</div>"
                f"<div class='ks' style='color:{color}'>Versus {py}: {vs}</div></div>")
    sl="<span style='font-size:15px;color:#6B6560;font-weight:400;padding:0 5px'>/</span>"
    zg=zone_gap(); gap_c=zg["cur"]["Sun"]/zg["cur"]["Fog"]; gap_p=zg["prior"]["Sun"]/zg["prior"]["Fog"]
    mm=lambda v: f"{v/1e6:.2f}"
    o=[f"<!doctype html><html><head><meta charset='utf-8'><style>{css}</style></head><body>"]
    # monthly series feeding the two stacked charts
    ms=monthly_series(); r26=[r for r in ms[2026] if r["m"]<=mo.month]; r25=ms[2025]
    r25m={r["m"]:r for r in r25}; r26m={r["m"]:r for r in r26}
    def two_year(keys,dfmt):
        rows=[]
        for m_ in range(1,13):
            a_=r25m.get(m_); b_=r26m.get(m_); row=dict(m=m_); ta=tb=0
            for k in keys:
                va=a_[k] if a_ else None; vb=b_[k] if b_ else None
                row[k]=va; row[k+"_b"]=vb; ta+=va or 0; tb+=vb or 0
            row["d"]=dfmt(tb-ta) if (ta and tb) else ""
            rows.append(row)
        return rows
    mlrows=[dict(r, d=(100*(r["msold"]-r25m[r["m"]]["msold"])/r25m[r["m"]]["msold"]) if r["m"] in r25m and r25m[r["m"]]["msold"] else None) for r in r26]
    clrows=[dict(r, d=(100*(r["csold"]-r25m[r["m"]]["csold"])/r25m[r["m"]]["csold"]) if r["m"] in r25m and r25m[r["m"]]["csold"] else None) for r in r26]
    ukeys=["sfh","cd","oth"]; vkeys=["sfh_v","cd_v","oth_v"]
    urows=two_year(ukeys,lambda d:f"{d:+.0f}")
    vrows=two_year(vkeys,lambda d:f"{d/1e6:+.0f}M")
    tot=lambda rows,keys,suf: sum((r.get(k+suf) or 0) for r in rows for k in keys)
    ytd_now=lambda rows,keys: sum((r.get(k+"_b") or 0) for r in rows for k in keys)
    ytd_then=lambda rows,keys: sum((r.get(k) or 0) for r in rows for k in keys if r["m"] in r26m)
    u26,u25=ytd_now(urows,ukeys),ytd_then(urows,ukeys); u25y=tot(urows,ukeys,"")
    v26,v25=ytd_now(vrows,vkeys),ytd_then(vrows,vkeys); v25y=tot(vrows,vkeys,"")
    uytd=dict(label=f"{u26:,} vs {u25:,}  {sgn(D(u26,u25))}%", sub=f"through {mname} · 2025 full year {u25y:,}")
    vytd=dict(label=f"${v26/1e9:.2f}B vs ${v25/1e9:.2f}B  {sgn(D(v26,v25))}%", sub=f"through {mname} · 2025 full year ${v25y/1e9:.2f}B")
    USEG=[("SFH","#9FB0D6","#12379E","sfh"),("Condo/TIC","#E4D9A8","#C9A227","cd"),("Other","#CFCBC4","#6B6560","oth")]
    VSEG=[("SFH","#9FB0D6","#12379E","sfh_v"),("Condo/TIC","#E4D9A8","#C9A227","cd_v"),("Other","#CFCBC4","#6B6560","oth_v")]
    # ── PAGE 1 — San Francisco right now ─────────────────────────────────
    # The local snapshot. Headline numbers, then four charts. One sentence
    # under each; anything longer belongs on the In Depth page.
    o.append(f"""<div class='page'><div class='mast'><div><div class='t'>San Francisco Real Estate</div>
      <div class='p'><b>{mname} {mo.year}</b> and the year through <b>{thru}</b>, each against the same stretch last year.</div></div>
      <div class='by'>Chuck Heaver · Vanguard Properties<br>Closed sales, SFAR MLS · run {datetime.date.today().strftime('%B %-d, %Y')}</div></div>""")
    o.append("<div class='kpis'>"
        +kpi("SFH — Med / Avg", f"${mm(st['y1']['price'])}{sl}${mm(st['y1']['avg'])}M", f"{sgn(D(st['y1']['price'],st['y0']['price']))}% / {sgn(D(st['y1']['avg'],st['y0']['avg']))}%")
        +kpi("Condo — Med / Avg", f"${mm(ct['y1']['price'])}{sl}${mm(ct['y1']['avg'])}M", f"{sgn(D(ct['y1']['price'],ct['y0']['price']))}% / {sgn(D(ct['y1']['avg'],ct['y0']['avg']))}%")
        +kpi("Sales Volume — All Homes", f"${allv1/1e9:.1f}B", f"{sgn(D(allv1,allv0))}%")
        +kpi("Days on Mkt — SFH / Condo", f"{st['y1']['dom']:.0f}{sl}{ct['y1']['dom']:.0f}", f"{st['y1']['dom']-st['y0']['dom']:+.0f} / {ct['y1']['dom']-ct['y0']['dom']:+.0f} days")
        +kpi("Sold Over Ask — SFH / Condo", f"{st['y1']['over']:.0f}{sl}{ct['y1']['over']:.0f}%", f"{st['y1']['over']-st['y0']['over']:+.0f} / {ct['y1']['over']-ct['y0']['over']:+.0f} pts")
        +"</div>")
    o.append("<div class='cols' style='margin-top:7px'>")
    o.append(f"""<div class='col'><h2>Units Sold</h2>
      {stacked(urows,USEG,uytd,h=212)}
      <div class='cap'>Light bars are last year, dark bars this year. <span class='st'>{u26:,}</span> homes have sold, against <span class='st'>{u25:,}</span> by this point last year.</div></div>""")
    o.append(f"""<div class='col'><h2>Volume Allocation</h2>
      {stacked(vrows,VSEG,vytd,h=212,fmt=lambda v:f"{v/1e6:.0f}")}
      <div class='cap'>Millions of dollars a month. <span class='st'>${v26/1e9:.2f}B</span> so far against <span class='st'>${v25/1e9:.2f}B</span> — far more money on only {sgn(D(u26,u25))}% more sales.</div></div>""")
    o.append("</div>")
    o.append("<div class='cols' style='margin-top:7px'>")
    o.append(f"""<div class='col'><h2>Sale vs List — SFH</h2>
      {lines(mlrows,[("What sellers asked","#C9A227","mlist"),("What buyers paid","#12379E","msold")],h=196,dkey="d")}
      <div class='cap'>Blue sits above gold every month this year: buyers paid over asking all year. The figure under each month is the change from last year.</div></div>""")
    o.append(f"""<div class='col'><h2>Sale vs List — Condo/TIC</h2>
      {lines(clrows,[("What sellers asked","#C9A227","clist"),("What buyers paid","#12379E","csold")],h=196,dkey="d")}
      <div class='cap'>Same story for condos, with a narrower gap — sellers ask about {M(statistics.median([r['clist'] for r in clrows if r['clist']]))} and get about {M(statistics.median([r['csold'] for r in clrows if r['csold']]))}.</div></div>""")
    o.append("</div>")
    o.append(f"<div class='foot'><span>Source: SFAR MLS via BrokerMetrics, closed sales (Closed + Sold Off MLS), geocoded to the site's fog-contour layer. Data through {W['m1'][1]}. Deemed reliable, not guaranteed.</span><span>page 1 / 9</span></div></div>")

    # ── PAGE 2 — the national picture ────────────────────────────────────
    # Four national numbers, four charts, four sentences. The mechanics of
    # how they connect live on the In Depth page.
    urows2=[dict(m=m_,us=u,ca=c_,sf=f_) for m_,u,c_,f_ in UNEMP]
    mspread=MTG_NOW-TEN_NOW
    yr_ago=TEN_Y[0][1]
    o.append(f"""<div class='page'><div class='mast'><div><div class='t'>The National Picture</div>
      <div class='p'>Four numbers set the rules for every sale in the city. None of them are decided in San Francisco.</div></div>
      <div class='by'>Chuck Heaver · Vanguard Properties<br>Freddie Mac · U.S. Treasury · BLS · EDD</div></div>""")
    o.append("<div class='cols'>")
    o.append(f"""<div class='col'><h2>Mortgage Rates — What a Loan Costs</h2>{cv.rate_chart(h=196)}
      <div class='cap'>The rate on an ordinary 30-year loan: <span class='st'>{cv.RATES[0][1]:.2f}%</span> in January, down to {cv.RATE_LOW:.2f}% in {cv.RATE_LOW_MO}, <span class='st'>{cv.RATE_NOW:.2f}%</span> now. A higher rate means a bigger payment for the very same house.</div></div>""")
    o.append(f"""<div class='col'><h2>The 10-Year Treasury — What Sets That Rate</h2>{yield_chart(h=212)}
      <div class='cap'>What the government pays to borrow for ten years. Banks price home loans off this, then add about {mspread:.1f} points. It was {yr_ago:.2f}% a year ago and is <span class='st'>{TEN_NOW:.2f}%</span> today — the highest since 2007.</div></div>""")
    o.append("</div>")
    o.append("<div class='cols' style='margin-top:7px'>")
    o.append(f"""<div class='col'><h2>Inflation — How Fast Everything Costs More</h2>{lines([dict(m=m_,cpi=v) for m_,v in CPI],[("Prices vs a year ago","#C9A227","cpi")],h=200,fmt=lambda v:f"{v:.1f}%")}
      <div class='cap'>How much more things cost than a year ago: {CPI[0][1]:.1f}% in January, up to {max(v for _,v in CPI):.1f}% in May, <span class='st'>{CPI[-1][1]:.1f}%</span> now. While this stays high, loans stay expensive.</div></div>""")
    o.append(f"""<div class='col'><h2>Jobs — Who Is Working</h2>{lines(urows2,[("San Francisco","#12379E","sf"),("California","#C9A227","ca"),("United States","#8A8F98","us")],h=200,fmt=lambda v:f"{v:.1f}%")}
      <div class='cap'>Share of people looking for work. San Francisco is at <span class='st'>{UNEMP[-1][3]:.1f}%</span> against {UNEMP[-1][2]:.1f}% statewide and {UNEMP[-1][1]:.1f}% nationally — more people working here means more people able to buy.</div></div>""")
    o.append("</div>")
    o.append(f"""<div class='sig' style='margin-top:8px'><b>How the four fit together.</b> Inflation keeps the Treasury high. The Treasury sets the mortgage rate. The mortgage rate decides what a financed buyer can pay.
      Jobs decide how many buyers there are at all. Right now the first three are working against buyers and the fourth is working for them — which is why prices rose
      <b>{sgn(D(st['y1']['price'],st['y0']['price']))}%</b> in a year of expensive money.</div>""")
    o.append(f"<div class='foot'><span>30-year fixed from Freddie Mac PMMS; 10-year Treasury month-end readings via U.S. Treasury and market reporting; CPI from BLS; unemployment from BLS and California EDD.</span><span>page 2 / 9</span></div></div>")

    # ── PAGE 3 — where the money came from ───────────────────────────────
    msplit,mn,mtot=money_split(S["y1"])
    hrank=sorted(((a,v) for a,v in _money_by_hood(S["y1"]).items()), key=lambda kv:-kv[1])
    khalf,run=0,0
    for a,v in hrank:
        run+=v; khalf+=1
        if run>=mtot/2: break
    top3=sum(v for _,v in hrank[:3])
    cheap=msplit[0]; rich=msplit[-1]
    o.append(f"""<div class='page'><div class='mast'><div><div class='t'>Detail — Allocation of Money</div>
      <div class='p'><b>${mtot/1e9:.2f} billion</b> changed hands in <b>{mn:,}</b> sales this year. It did not come from where most people assume.</div></div>
      <div class='by'>Chuck Heaver · Vanguard Properties<br>Closed sales, Jan 1 – {thru}</div></div>""")
    o.append("<div class='cols'>")
    o.append(f"""<div class='col' style='flex:1.5'><h2>Allocation by Tier</h2>
      {mirror_bars(msplit)}
      <div class='cap'>The top bar counts <b>units</b>, the bottom counts <b>dollars</b> — same four price ranges, completely different shapes.
      <span class='st'>{cheap['n']:,}</span> units sold under $1M and brought <span class='st'>${cheap['v']/1e6:,.0f}M</span>; just <span class='st'>{rich['n']}</span> sold over $5M and brought <span class='st'>${rich['v']/1e6:,.0f}M</span>.</div>
      <h2 style='margin-top:6px'>Allocation by Type</h2>
      {type_mirror(S["y1"])}
      <div class='cap'>More condos change hands than houses, yet houses bring in more money.</div>
      <div class='pull'><div class='pq'>{rich['n']} homes — one sale in twenty — brought in ${rich['v']/1e9:.2f} billion.</div>
      <div class='pqs'>More than twice what the {cheap['n']:,} homes under $1M brought in, from a fifth as many sales.</div></div></div>""")
    o.append(f"""<div class='col' style='flex:1.1'><h2>Allocation by Neighborhood</h2>
      {hood_bars(hrank,mtot,w=380,h=470,top=20)}
      <div class='cap'>Top twenty by dollars closed. <span class='st'>{hrank[0][0]}</span> alone took <span class='st'>${hrank[0][1]/1e6:,.0f}M</span> — <span class='st'>{100*hrank[0][1]/mtot:.0f}%</span> of the city — on {100*len([r for r in S['y1'] if N2A_(r.get('neighborhood') or '')==hrank[0][0]])/mn:.0f}% of its sales.</div>
      <div class='sig' style='margin-top:5px'><b>The one to remember.</b> Half the money in San Francisco real estate this year came from <b>{khalf} neighborhoods</b>.
      If your home is in one of them, your buyer pool is deeper than the citywide numbers suggest. If it is not, price and presentation carry the whole job.</div></div>""")
    o.append("</div>")
    o.append(f"""<div class='foot'><span>All closed sales, Jan 1 – {thru}. Tiers by final sale price. Neighborhood totals use the report's combined areas.</span><span>page 3 / 9</span></div></div>""")

    # ── PAGE 4 — who's buying ────────────────────────────────────────────
    # The two buyers side by side. They respond to completely different
    # things, which is the whole point of putting them on one page.
    spread=TEN_NOW-TWO_NOW
    rise=TEN_NOW-yr_ago
    P=lambda price,r: mtg_pmt(price*0.8,r)
    def afford(payment,r):
        i=r/100/12; return (payment*(1-(1+i)**-360)/i)/0.8
    rate_rows="".join(
        f"<tr><td class='l'>{r:.2f}%</td><td class='b'>${P(MED_SFH,r):,.0f}</td>"
        f"<td style='color:{DOWN if r>6.10 else MUTED}'>{'+' if r>6.10 else ''}{P(MED_SFH,r)-P(MED_SFH,6.10):,.0f}</td>"
        f"<td class='b'>${P(MED_CO,r):,.0f}</td>"
        f"<td style='color:{DOWN if r>6.10 else MUTED}'>{'+' if r>6.10 else ''}{P(MED_CO,r)-P(MED_CO,6.10):,.0f}</td></tr>"
        for r in (6.10,6.76,7.00,7.25))
    lux=[r for r in S["y1"] if r["sellingPrice"]>=5e6]
    lux0=[r for r in S["y0"] if r["sellingPrice"]>=5e6]
    lc=lux_series()[2026]                   # month → count, for the caption
    top5=[r for r in S["y1"] if r["sellingPrice"]>=5e6]
    luxv=sum(r["sellingPrice"] for r in lux); top5v=sum(r["sellingPrice"] for r in top5)
    zero=[r for r in top5 if r.get("dom")==0 or r["status"]=="Sold Off MLS"]
    carry=lambda p,y: p*y/100+p*PROP_TAX
    o.append(f"""<div class='page'><div class='mast'><div><div class='t'>The Cost of Ownership</div>
      <div class='p'>Two buyers, two completely different triggers. One watches the mortgage rate. The other never thinks about it.</div></div>
      <div class='by'>Chuck Heaver · Vanguard Properties<br>Closed sales · Treasury &amp; Freddie Mac</div></div>""")
    o.append("<div class='cols'>")
    o.append(f"""<div class='col'><h2 class='band'>The Financed Buyer</h2>
      <div class='cap' style='margin-bottom:5px'>Most of the market. What they can pay is set by the mortgage rate, and the mortgage rate is set by the bond market.</div>
      <h2>What a Rate Move Costs, Every Month</h2>
      <table class='top'><tr><th class='l'>30-yr rate</th><th>SFH median</th><th>vs 6.10%</th><th>Condo median</th><th>vs 6.10%</th></tr>{rate_rows}</table>
      <div class='cap'>Monthly payment on a typical {M(MED_SFH)} house and {M(MED_CO)} condo with 20% down.
      January's {6.10:.2f}% to today's {MTG_NOW:.2f}% costs a house buyer <span class='st'>${P(MED_SFH,MTG_NOW)-P(MED_SFH,6.10):,.0f} more a month</span> — <span class='st'>${12*(P(MED_SFH,MTG_NOW)-P(MED_SFH,6.10)):,.0f} a year</span> — for the same house.</div>
      <h2 style='margin-top:6px'>Home Loans Follow the Bond</h2>{spread_chart(h=190)}
      <div class='cap'>Gold is your home loan, blue is what the government pays. The gap between them barely moves, so the bond leads and your rate follows.</div></div>""")
    o.append(f"""<div class='col'><h2 class='band'>The Cash Buyer</h2>
      <div class='cap' style='margin-bottom:5px'><b>{100*len(top5)/len(S['y1']):.1f}%</b> of the sales, <b>{100*top5v/allv1:.0f}%</b> of the money. They pay cash, so the mortgage rate is beside the point.</div>
      <h2>Over $5M — Sales by Month, 2025 vs 2026</h2>
      {lux_chart(h=190)}
      <div class='cap'><span class='st'>{len(lux)}</span> sales against <span class='st'>{len(lux0)}</span> last year, <span class='st'>{sgn(D(len(lux),len(lux0)))}%</span>.
      Sales peaked at {lc.get(6,0)} in June and fell to {lc.get(7,0)} in July, the month the Nasdaq dropped 10%.</div>
      <h2 style='margin-top:6px'>Annual Opportunity Cost of Owning an $8M Home</h2>
      {carry_chart(w=470,h=112)}
      <ul class='math'>
        <li>Lost bond earnings ({TEN_NOW:.2f}%) <b>${round(8e6*TEN_NOW/100,-3):,.0f}</b></li>
        <li>Real estate taxes ({100*PROP_TAX:.2f}%) <b>${8e6*PROP_TAX:,.0f}</b></li>
        <li class='tot'>Total <b>${round(8e6*TEN_NOW/100,-3)+8e6*PROP_TAX:,.0f}</b></li>
      </ul></div>""")
    o.append("</div>")
    o.append(f"""<div class='cols' style='margin-top:7px'>
      <div class='col'><div class='sig'><b>What moves the financed buyer</b>
        <ul class='sigl'>
          <li>The 10-year Treasury leads; home loans run about 1.8 points above it.</li>
          <li>Treasury under <b>4.5%</b> → loans in the low 6s → buyers come back.</li>
          <li>Treasury at <b>5%</b> → loans toward {5.02+1.80:.2f}% → fewer buyers qualify.</li>
          <li>Watch the bond, not the Fed.</li>
        </ul></div></div>
      <div class='col'><div class='sig'><b>What moves the cash buyer</b>
        <ul class='sigl'>
          <li><b>1. Need</b> — a family that has outgrown the house buys this year, at whatever the market asks. Outranks the other two.</li>
          <li><b>2. Liquidity</b> — can they get at the money: share sales, tender offers, IPOs.</li>
          <li><b>3. Opportunity cost</b> — cash left in 10-year Treasuries earns <b>{TEN_NOW:.2f}%</b>, free of California tax.</li>
        </ul></div></div>
    </div>""")
    o.append(f"""<div class='foot'><span>Payments are principal and interest only. Foregone yield uses the 10-year Treasury; property tax at {100*PROP_TAX:.2f}%. Insurance, upkeep and illiquidity are additional.</span><span>page 4 / 9</span></div></div>""")

    # ── PAGE 5 — the neighborhoods ───────────────────────────────────────
    erows=[("UCSF","Mission Bay"),("Salesforce","SoMa"),("OpenAI","Mission Bay"),("Anthropic","Howard St"),("Uber","Mission Bay"),
           ("Wells Fargo","Financial Dist"),("Airbnb","SoMa"),("Databricks","Financial Dist"),("Cognition","South Beach"),("Together AI","Showplace Sq")]
    er="".join(f"<tr><td class='l b'>{i+1}. {n}</td><td class='l'>{loc}</td></tr>" for i,(n,loc) in enumerate(erows))
    def pol(r):
        return f"{100*r['sellingPrice']/r['listPrice']:.0f}%" if r.get("listPrice") else "—"
    def polc(r):
        return UP if r.get("listPrice") and r["sellingPrice"]>r["listPrice"] else MUTED
    cr="".join(f"<tr><td class='l'>{i+1}. {html.escape(r['address'].split(',')[0])}</td><td class='b'>{M(r['sellingPrice'])}</td>"
               f"<td style='color:{polc(r)};font-weight:700'>{pol(r)}</td></tr>" for i,r in enumerate(top))
    ranked=sorted([(a,stt) for a,stt in byA[SF].items() if stt["y1"]["n"]>=5 and stt["y1"]["price"]],key=lambda t:-t[1]["y1"]["price"])[:10]
    def yoy(stt):
        p0=stt["y0"]["price"]; return (f"{D(stt['y1']['price'],p0):+.0f}%", UP if stt['y1']['price']>=p0 else DOWN) if p0 else ("—",MUTED)
    def cmed(a):
        x=byA[CO].get(a); return M(x["y1"]["price"]) if x and x["y1"]["price"] else "—"
    nr="".join(f"<tr><td class='l'>{i+1}. {html.escape(a)}</td><td class='b'>{M(stt['y1']['price'])}</td>"
               f"<td>{cmed(a)}</td><td style='color:{yoy(stt)[1]};font-weight:700'>{yoy(stt)[0]}</td></tr>" for i,(a,stt) in enumerate(ranked))
    o.append(f"""<div class='page'><div class='mast'><div><div class='t'>The Neighborhoods</div>
      <div class='p'>Where the sales landed, what they went for, and what the fog has to do with the price</div></div>
      <div class='by'>Chuck Heaver · Vanguard Properties</div></div>""")
    o.append("<div class='cols'>")
    o.append(f"""<div class='col'><h2>Every Sale This Year, on the Fog Map</h2>
      <div class='mapwrap'>{mapsvg}</div>
      <div class='maplegend'><span class='dotkey'></span><b>{ndots:,}</b> closings, 2026 YTD
        {"".join(f"<span class='zk'><span class='zc' style='background:{col}'></span>{nm}</span>" for nm,col in ZONE_FILL)}</div>
      <div class='mapcap'>Every 2026 closing over the city's summer-fog zones — my database, my map, and nobody else publishes it.
        Zones by daily summer fog hours: Sun ≤8.0 · Transition 8.5–8.9 · Fog 9.0–10.9 · Persistent Fog ≥11.</div>
      <h2>What the Fog Is Worth</h2><ul>"""
      +B(M(sun['price']), f"Median sale price, Sun zone {CHIP('#FBDC7E')}")
      +B(M(fg['price']), f"Median sale price, Fog zone {CHIP('#C3CBD2')}")
      +B(M(pf['price']), f"Median sale price, Persistent Fog {CHIP('#8D9BA6')}")
      +B(f"{sun['ppsf']:.0f}", f"$/SF in the sun against ${pf['ppsf']:.0f} in persistent fog")
      +"</ul></div>")
    o.append(f"""<div class='col'><h2>Top 10 Neighborhoods — SFH &amp; Condo</h2>
      <table class='top'><tr><th class='l'>Neighborhood</th><th>SFH</th><th>Condo</th><th>vs {py}</th></tr>{nr}</table>
      <h2 style='margin-top:6px'>Top 10 Sales — SFH / Condo / Other</h2>
      <table class='top'><tr><th class='l'>Address</th><th>Closed</th><th>% ask</th></tr>{cr}</table></div>""")
    o.append(f"""<div class='col'><h2>Top 10 City Employers</h2>
      <table class='top'><tr><th class='l'>Company</th><th class='l'>Where</th></tr>{er}</table>
      <h2 style='margin-top:6px'>What Changed on the Ground</h2><ul>"""
      +B("58", "% of first-half office leasing went to AI. Near a 30-year high")
      +B("25", "% drop in property crime. Homelessness at a 15-year low")
      +B(f"{sb['y1']['n']-sb['y0']['n']}", "Extra South Beach condo sales — 1M sq ft of AI is a walk away")
      +B("3,491", "Homes approved at Stonestown, the west side's first big supply")
      +B("0", "New supply in the fog belt. All of it is sun-side")
      +"</ul>"
      +f"""<div class='sig' style='margin-top:5px'><b>Why me.</b> Every number here comes from my own database of every closed sale in San Francisco, mapped to its neighborhood <i>and</i> its microclimate. I price to the crowd a home will actually draw. Ask me to run your street.</div></div>""")
    o.append("</div>")
    o.append(f"<div class='foot'><span>Map: {ndots:,} closed sales, Jan 1 – {thru}, over USGS-derived summer-fog contours. City figures from CBRE, The Real Deal, SF Chronicle, SF Standard, Bisnow, CNBC, KQED and SF.gov.</span><span>page 5 / 9</span></div></div>")

    # ── PAGE 6 — in depth ────────────────────────────────────────────────
    # Everything a reader can skip. The narrative pages stay light because
    # the long explanations were moved down here.
    wrows,wcut,w25y,w26,wlast=weekly_series(W["m1"][1])
    w25=sum(r["a"] for r in wrows if r["w"]<=wcut)
    o.append(f"""<div class='page'><div class='mast'><div><div class='t'>In Depth</div>
      <div class='p'>The detail behind the charts — read it if you want it, skip it if you don't</div></div>
      <div class='by'>Chuck Heaver · Vanguard Properties</div></div>""")
    o.append("<div class='cols'>")
    o.append("<div class='col'><h2>Attention Sellers</h2><ul>"
        +B(f"{s['big']:.0f}", "% of house closings at least 20% over ask")
        +B(f"{st['y1']['dom']:.0f}", "Days to sell a house (median)")
        +B(f"{s['wk']:.0f}", "% of houses under contract in a week")
        +B(f"{st['y1']['pct']:.0f}", f"% of list the winning house bid paid. Was {st['y0']['pct']:.0f}% in '{py}")
        +B(f"{ct['y1']['dom']:.0f}", f"Days to sell a condo. Was {ct['y0']['dom']:.0f} in '{py}")
        +B(f"{ct['y1']['over']:.0f}", "% of condos now selling over list")
        +B("35", f"% drop in active listings vs '{py}")
        +"</ul><h2 style='margin-top:6px'>Attention Buyers</h2><ul>"
        +B(f"{st['y1']['pct']:.0f}", "% of ask to budget on a house")
        +B(f"{ct['y1']['pct']:.0f}", "% of ask to budget on a condo")
        +B(f"{M(loan)}", f"Mortgage that ${RENT_NOW:,} rent carries at {cv.RATE_NOW:.2f}%")
        +B(f"{c['dm_slow'][-1][0]:.0f}", f"Days to sell a {c['dm_slow'][-1][1]} condo. Take your time")
        +B(f"{M(pf['price'])}", f"Cheapest way in — fog-belt house at ${pf['ppsf']:.0f}/sf")
        +"</ul></div>")
    o.append(f"""<div class='col'><h2>How a Mortgage Rate Actually Gets Set</h2><ul>"""
      +B(f"{TEN_NOW:.2f}", "% — what the government pays to borrow for ten years")
      +B(f"{mspread:.2f}", "Points the bank adds on top for its costs and its risk")
      +B(f"{MTG_NOW:.2f}", "% — your home loan rate. Those two, added together")
      +B(f"{rise:.2f}", "Points the government's rate rose in twelve months")
      +"</ul>"
      +f"""<h2 style='margin-top:6px'>The Yield Curve Today</h2>{curve_chart()}
      <div class='cap'>What you earn lending the government money for three months, two years, ten years and thirty. Normally the line rises — lend longer, earn more — and it does today.
      When it tips the other way, short money paying more than long, it is called <b>inverted</b>, and that has come before every U.S. recession since the 1970s. We are not there.</div>
      <div class='cap' style='margin-top:4px'><b>Rents.</b> A one-bedroom now runs ${RENT_NOW:,} a month, {sgn(RENT_YOY)}% more than last year — the fastest rise in the country.
      That same ${RENT_NOW:,} covers the payment on a {M(loan)} mortgage, which is why renters keep turning into buyers.</div></div>""")
    o.append(f"""<div class='col'><h2>What Pulls a Cash Buyer Back</h2><ul>"""
      +B("Stocks", "falling. Their shares are the down payment, and the market dropped twice this year")
      +B(f"{TEN_NOW:.2f}", "% — what cash earns doing nothing. The higher that goes, the better waiting looks")
      +B("No way", "to sell shares. Rich on paper is not the same as able to buy")
      +"</ul><h2 style='margin-top:4px'>What Brings Them In</h2><ul>"
      +B("Need", "first. A growing family, a move, a school year — none of it waits for the Nasdaq")
      +B("$7B", "OpenAI tender in August at an $852B valuation. 300+ new decamillionaires")
      +B("Scarcity", "41 trophy sales a year in Pacific Heights. You buy when one appears")
      +B("Prop 13", "Buy now and the assessment is locked at today's price for as long as you hold")
      +"</ul>"
      +f"""<div class='sig' style='margin-top:5px'><b>How to read this report.</b> <b>Median</b> is the middle sale — half sold for more, half for less, and it ignores extremes.
      <b>Average</b> is the total divided by the count, so one $30M sale drags it up. <b>Homes</b> means every residential type unless a chart says SFH or Condo.
      <b>YTD</b> is January 1 to {thru}, always compared with the identical stretch of {py}.</div></div>""")
    o.append("</div>")
    o.append(f"""<div style='margin-top:7px'><h2>Units Sold by Week — Every Week of Both Years</h2>
      {weekly_bars(wrows,h=150,ytd=dict(label=f"{w26:,} vs {w25:,}  {sgn(D(w26,w25))}%", sub=f"weeks 1–{wcut} · 2025 full year {w25y:,}"))}
      <div class='cap'>Grey bars after week {wcut} show where last year kept going — its busiest stretch was early October, which is what a full autumn looks like.</div></div>""")
    o.append(f"<div class='foot'><span>Rents from Zumper median 1BR, San Francisco. Equity and tender figures from CNBC, Bloomberg, PitchBook and Motley Fool reporting. Commentary is interpretation, not a forecast.</span><span>page 6 / 9</span></div></div>")

    # ── PAGE 7 — latent inventory (single-family only) ───────────────────
    # Only houses give a true turnover rate: one parcel is one house is one
    # possible sale. Condo sales are units while multi-unit parcels are
    # buildings, so mixing them compares different things — left out.
    linv,lskip,lcity=latent_inventory((W["m1"][0][:4]+"-01-01",W["m1"][1]))
    MIN_SHOW, MIN_SOLID = 50, 250            # houses: to list at all / to trust the rate
    shown=[r for r in linv if r["u1"]>=MIN_SHOW]
    hidden=[r for r in linv if r["u1"]<MIN_SHOW]
    shown.sort(key=lambda r:-r["u1"])
    T=lambda k,rows=linv: sum(r[k] for r in rows)
    houses, sold_h = T("u1"), T("sfh")
    rate=100*sold_h/houses
    months=int(W["m1"][1][5:7])
    pace=rate*12/months                      # the year-to-date rate, run to a full year
    solid=[r for r in shown if r["u1"]>=MIN_SOLID and r["turn"] is not None]
    tmax=max(r["turn"] for r in solid)
    hmax=max(r["u1"] for r in shown)
    def hbar(v):
        return (f"<span class='lh'><span class='lhf' style='width:{max(2,round(96*v/hmax))}px'></span></span>"
                f"<span class='lhv'>{v:,}</span>")
    def tbar(r):
        v=r["turn"]
        if v is None: return "—"
        w_=max(2,round(70*min(v,tmax)/tmax))
        thin=r["u1"]<MIN_SOLID
        return (f"<span class='lt'><span class='ltf{' thin' if thin else ''}' style='width:{w_}px'></span></span>"
                f"<span class='ltv'>{v:.1f}%{'*' if thin else ''}</span>")
    def sale_cells(st):
        if not st["n"]: return "<td class='g0'>—</td><td>—</td><td>—</td><td>—</td>"
        return (f"<td class='g0 b'>{mg.usdM(st['price'])}</td>"
                f"<td>{mg.usd(st['ppsf']) if st['ppsf'] else '—'}</td>"
                f"<td>{mg.i(st['dom'])}</td>"
                f"<td>{mg.pct1(st['over'])}%</td>")
    lrows="".join(
        f"<tr><td class='l'>{html.escape(r['area'])}</td>"
        f"<td class='bar'>{hbar(r['u1'])}</td>"
        f"<td class='b'>{r['sfh']:,}</td>"
        f"<td class='bar g0'>{tbar(r)}</td>"
        f"<td class='one'>{('1 in ' + format(round(100/r['turn']), ',')) if r['turn'] else '—'}</td>"
        f"{sale_cells(r['st'])}</tr>"
        for r in shown)
    lo_r=min(solid,key=lambda r:r["turn"]); hi_r=max(solid,key=lambda r:r["turn"])
    big=shown[0]
    hidden_names=", ".join(html.escape(r["area"]) for r in sorted(hidden,key=lambda r:r["area"]))
    o.append(f"""<div class='page'><div class='mast'><div><div class='t'>Latent Inventory — Single-Family Houses</div>
      <div class='p'>Every house in the city beside the ones that sold. <b>{rate:.1f}%</b> changed hands January through {mname} — about one house in {round(100/rate)}.</div></div>
      <div class='by'>Chuck Heaver · Vanguard Properties<br>SF Land Use parcels · SFAR MLS closings</div></div>
      <div class='lkpi'>
        <div><b>{houses:,}</b><span>single-family houses in the city</span></div>
        <div><b>{sold_h:,}</b><span>sold, Jan 1 – {thru}</span></div>
        <div><b>{rate:.1f}%</b><span>of all houses traded so far this year</span></div>
        <div><b>~{pace:.1f}%</b><span>a year at this pace — one house in {round(100/pace)}</span></div>
      </div>
      <table class='linv lsfh'>
        <colgroup><col style='width:19%'><col style='width:17%'><col style='width:6%'><col style='width:14%'><col style='width:8%'>
          <col style='width:9%'><col style='width:8%'><col style='width:7%'><col style='width:12%'></colgroup>
        <thead>
          <tr class='g'><th class='l'>Neighborhood</th><th>SFH — latent inventory</th><th>Sold YTD</th>
            <th class='g0'>Share traded</th><th>1 house in</th>
            <th class='g0 r'>Median price</th><th class='r'>$/sf</th><th class='r'>DOM</th><th class='r'>% over list</th></tr>
        </thead>
        <tbody>{lrows}</tbody>
        <tfoot><tr><td class='l'>All single-family</td><td class='bar'><span class='lhv' style='margin-left:0'>{houses:,}</span></td>
          <td class='b'>{sold_h:,}</td><td class='bar g0'><span class='ltv' style='margin-left:0'>{rate:.1f}%</span></td>
          <td class='one'>1 in {round(100/rate)}</td>{sale_cells(lcity)}</tr></tfoot>
      </table>
      <div class='cap' style='margin-top:6px'>Size is not supply. {html.escape(big['area'])} holds the most houses — {big['u1']:,} — and released {big['sfh']:,} ({big['turn']:.1f}%).
      Turnover runs from {lo_r['turn']:.1f}% in {html.escape(lo_r['area'])} to {hi_r['turn']:.1f}% in {html.escape(hi_r['area'])}:
      the same buyer sees very different odds of a house coming up depending on where they are looking.</div>
      <div class='src'>SFH are single-unit residential parcels in the SF Land Use dataset; sales are single-family closings (SFAR MLS).
      * Fewer than {MIN_SOLID} houses in the area — a handful of sales moves the rate, so read it with care.
      Not listed (fewer than {MIN_SHOW} houses — condo districts): {hidden_names}. {lskip} parcel(s) fell outside the mapped areas.</div>
      <div class='foot'><span>Latent inventory = every house that exists, sold or not. Sales are closed transactions, Jan 1 – {thru}.</span><span>page 7 / 9</span></div></div>""")

    o.append("</body></html>")
    return "".join(o)

if __name__=="__main__":
    open(mg.os.path.join(mg.HERE,"out","cover3.html"),"w").write(build()); print("wrote cover3.html")
