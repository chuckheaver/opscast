# "By the numbers" briefing: every bullet is STAT (bold blue) + description
# (black). Page 2 leads with a fog-zone map of the year's closings and stacks
# the three Top 10 tables. Figures come from the same build() as the grids.
import datetime, html, json, math, re, statistics, importlib.util
spec=importlib.util.spec_from_file_location("cv",__import__("os").path.join(__import__("os").path.dirname(__import__("os").path.abspath(__file__)),"cover.py")); cv=importlib.util.module_from_spec(spec); spec.loader.exec_module(cv)
mg=cv.mg; NAV,NAV_LT,GOLD,GOLD_LT,GOLD_MID,UP,DOWN,INK,MUTED,LINE=cv.NAV,cv.NAV_LT,cv.GOLD,cv.GOLD_LT,cv.GOLD_MID,cv.UP,cv.DOWN,cv.INK,cv.MUTED,cv.LINE
_spec=importlib.util.spec_from_file_location("product", __import__("os").path.join(__import__("os").path.dirname(__import__("os").path.abspath(__file__)),"product.py")); pt=importlib.util.module_from_spec(_spec); _spec.loader.exec_module(pt)
M,D,sgn=cv.M,cv.D,cv.sgn
RENTS=[("May",3480,4000),("Jun",3560,4060),("Jul",3400,4180),("Sep",3400,4250)]
RENT_NOW=4400; RENT_YOY=25.4; RENT_2BR=6340   # Zumper, September 2026 report (Sept 29)
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
        o.append(f"<rect x='{x0:.1f}' y='{Y(a):.1f}' width='{bw:.1f}' height='{h-22-Y(a):.1f}' fill='#C9CCD0' rx='2'/>")
        o.append(f"<rect x='{x1:.1f}' y='{Y(b):.1f}' width='{bw:.1f}' height='{h-22-Y(b):.1f}' fill='{NAV}' rx='2'/>")
        o.append(f"<text x='{x0+bw/2:.1f}' y='{Y(a)-4:.1f}' font-size='7' fill='{MUTED}' text-anchor='middle'>{a/1000:.2f}K</text>")
        o.append(f"<text x='{x1+bw/2:.1f}' y='{Y(b)-4:.1f}' font-size='7.4' font-weight='700' fill='{NAV}' text-anchor='middle'>{b/1000:.2f}K</text>")
        o.append(f"<text x='{pad+i*gw+gw/2:.1f}' y='{h-8}' font-size='7.4' fill='{MUTED}' text-anchor='middle'>{m}</text>")
    o.append(f"<rect x='{w-118}' y='4' width='8' height='8' fill='#C9CCD0'/><text x='{w-106}' y='11' font-size='7' fill='{MUTED}'>2025</text>")
    o.append(f"<rect x='{w-72}' y='4' width='8' height='8' fill='{NAV}'/><text x='{w-60}' y='11' font-size='7' fill='{MUTED}'>2026</text>")
    return "".join(o)+"</svg>"


# Unemployment rate, 2026. U.S. seasonally adjusted (BLS Employment Situation);
# California and San Francisco County from EDD monthly releases. Charted through
# August, the last month all three are published as of Sept 30 (EDD, Sept 18).
# September U.S. data lands Oct 2; California and county data Oct 16.
UNEMP=[(1,4.3,5.4,4.1),(2,4.4,5.4,3.8),(3,4.3,5.3,3.7),(4,4.3,5.3,3.5),
       (5,4.3,5.3,3.3),(6,4.2,5.2,3.7),(7,4.1,5.1,3.7),(8,4.1,5.1,4.2)]
# U.S. CPI, year over year, 2026 (BLS monthly releases). August released Sept 11;
# September lands Oct 14.
CPI=[(1,2.4),(2,2.4),(3,3.3),(4,3.8),(5,4.2),(6,3.5),(7,3.4),(8,3.4)]
# RentCafe cost-of-living index, San Francisco vs the U.S. average (published Sept 2026).
COL=[("Housing",156),("Utilities",47),("Transportation",41),("Groceries",16)]
COL_OVERALL=64

def monthly_series():
    """Closed sales by month, split single family / condo / other: unit counts,
    dollar volume, and the SFH median list vs median sold. Complete months."""
    import statistics
    F=[f["properties"] for f in json.load(open(mg.SRC))["features"]]
    SFH=mg.SEG[mg.SF]; CO=mg.SEG[mg.CO]
    out={}
    for yr in (2025,2026):
        rows=[]
        for m in range(1,13):
            k=f"{yr}-{m:02d}"
            rs=[r for r in F if (r.get("sellingDate") or "").startswith(k) and r.get("sellingPrice")]
            if not rs: continue
            sf=[r for r in rs if r["propType"] in SFH]
            cd=[r for r in rs if r["propType"] in CO]
            du=[r for r in rs if r["propType"] in mg.SEG[mg.DU]]
            ot=[r for r in rs if r["propType"] in mg.SEG[mg.OT]]
            sl=[r["listPrice"] for r in sf if r.get("listPrice")]
            cl=[r["listPrice"] for r in cd if r.get("listPrice")]
            cs=[r["sellingPrice"] for r in cd]
            dl=[r["listPrice"] for r in du if r.get("listPrice")]
            ol=[r["listPrice"] for r in ot if r.get("listPrice")]
            os_=[r["sellingPrice"] for r in ot]
            V=lambda g: sum(r["sellingPrice"] for r in g)
            rows.append(dict(m=m,sfh=len(sf),cd=len(cd),du=len(du),oth=len(ot),co=len(cd)+len(du)+len(ot),
                             sfh_v=V(sf),cd_v=V(cd),du_v=V(du),oth_v=V(ot),vol=V(rs),
                             dlist=statistics.median(dl) if dl else None,
                             dsold=statistics.median([r["sellingPrice"] for r in du]) if du else None,
                             mlist=statistics.median(sl) if sl else None,
                             msold=statistics.median([r["sellingPrice"] for r in sf]) if sf else None,
                             clist=statistics.median(cl) if cl else None,
                             csold=statistics.median(cs) if cs else None,
                             olist=statistics.median(ol) if ol else None,
                             osold=statistics.median(os_) if os_ else None))
        out[yr]=rows
    return out

MON="Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split()
DUP, DUP_LT = "#3C8D7F", "#B5D6CF"    # Duplex: the site's teal (app/lib/segments.js)
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
                tc="#ffffff" if col=="#203C5F" else "#131A25"
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
    # Each legend entry is as wide as its label, so a long one never runs into the next.
    lxx=pad_l
    for sg in segs:
        o.append(f"<rect x='{lxx}' y='2' width='8' height='8' fill='{sg[2]}' rx='1.5'/><text x='{lxx+11}' y='9' font-size='6.8' fill='{INK}'>{sg[0]}</text>")
        lxx+=11+len(sg[0])*3.7+12
    o.append(f"<text x='{lxx+4}' y='9' font-size='6.4' fill='{MUTED}'>light = 2025 · dark = 2026</text>")
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
        for j,(v,col) in enumerate(((r["a"],"#B9BDC4"),(r.get("b"),"#203C5F"))):
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
    for j,(lab,col) in enumerate((("2025","#B9BDC4"),("2026","#203C5F"))):
        lxx=pad_l+j*54
        o.append(f"<rect x='{lxx}' y='2' width='8' height='8' fill='{col}' rx='1.5'/><text x='{lxx+11}' y='9' font-size='7' fill='{INK}'>{lab}</text>")
    if ytd:
        o.append(f"<text x='{w-6}' y='9' font-size='8.4' font-weight='800' fill='{NAV}' text-anchor='end'>YTD {ytd['label']}</text>")
        o.append(f"<text x='{w-6}' y='19' font-size='7.4' fill='{MUTED}' text-anchor='end'>{ytd['sub']}</text>")
    return "".join(o)+"</svg>"

def weekly_series(through):
    """Closed sales by week: 2025 for the full year, 2026 through the data date,
    with the year-over-year change where both years have data. Weeks count
    from January 1 in each year (week 1 = Jan 1–7), so week k covers the same
    calendar days in both years; the odd day or two after week 52 (Dec 30–31)
    folds into week 52."""
    import datetime as _dt, collections as _c
    F=[f["properties"] for f in json.load(open(mg.SRC))["features"]]
    day=lambda d:(_dt.date.fromisoformat(d[:10])-_dt.date(int(d[:4]),1,1)).days
    W=lambda d:min(day(d)//7+1,52)
    cut=W(through)
    cnt={}
    for yr in (2025,2026):
        cnt[yr]=_c.Counter(W(r["sellingDate"]) for r in F
                           if (r.get("sellingDate") or "").startswith(str(yr)) and r.get("sellingPrice")
                           and (yr==2025 or r["sellingDate"][:10]<=through))
    last=max(max(cnt[2025] or [0]),cut)
    rows=[]
    for k in range(1,last+1):
        a_=cnt[2025].get(k,0); b_=cnt[2026].get(k,0) if k<=cut else None
        d,dc=("",MUTED)
        # The cutoff week is partial unless the data date is its last day —
        # no % change against a full week of last year.
        partial=k==cut and day(through)%7!=6
        if a_ and b_ and not partial: p=100*(b_-a_)/a_; d=f"{p:+.0f}%"; dc=UP if p>=0 else DOWN
        rows.append(dict(w=k,a=a_,b=b_,d=d,dc=dc))
    # Year to date against the same calendar date last year.
    ly=str(int(through[:4])-1)+through[4:10]
    ytd25=sum(1 for r in F if (r.get("sellingDate") or "")[:4]=="2025" and r["sellingDate"][:10]<=ly and r.get("sellingPrice"))
    return rows,cut,sum(cnt[2025].values()),sum(cnt[2026].values()),last,ytd25

def week_peak_after(rows,cut,year=2025):
    """'its busiest week was Oct 8–14 (138 sales)' — last year's top week
    after the cutoff, from the counts."""
    import datetime as _dt
    after=[r for r in rows if r["w"]>cut and r["a"]]
    if not after: return "its pace after that is not in the data"
    pk=max(after,key=lambda r:r["a"])
    a=_dt.date(year,1,1)+_dt.timedelta(days=7*(pk["w"]-1)); b=a+_dt.timedelta(days=6)
    rng=f"{a.strftime('%b')} {a.day}–{b.day}" if a.month==b.month else f"{a.strftime('%b')} {a.day} – {b.strftime('%b')} {b.day}"
    return f"its busiest week was {rng} ({pk['a']:,} sales)"

def txt(col):
    """Yellow reads as a line but not as small text on white — labels for a
    yellow series are set in the darker gold."""
    return mg.GOLD_TXT if col.upper()==GOLD_MID.upper() else col

def lines(rows,series,w=468,h=176,fmt=lambda v:f"{v/1e6:.2f}M",dkey=None,lab=True):
    """Line chart. With dkey, each point's year-over-year change is printed
    under its month label so the trend reads straight off the axis."""
    pad_l,pad_b,pad_t=17,(26 if dkey else 16),14
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
            if lab or i in (0,len(pts)-1) or col!="#E9BC3F":
                o.append(f"<text x='{x:.1f}' y='{y-5:.1f}' font-size='{6.2 if lab else 5.6}' font-weight='700' fill='{txt(col)}' text-anchor='middle'>{fmt(rows[i][key]) if lab else fmt(rows[i][key]).replace('.00M','M')}</text>")
    for i,r in enumerate(rows):
        o.append(f"<text x='{X(i):.1f}' y='{h-(16 if dkey else 5)}' font-size='7' fill='{MUTED}' text-anchor='middle'>{MON[r['m']-1]}</text>")
        if dkey and r.get(dkey) is not None:
            col=UP if r[dkey]>=0 else DOWN
            o.append(f"<text x='{X(i):.1f}' y='{h-4}' font-size='6.6' font-weight='700' fill='{col}' text-anchor='middle'>{r[dkey]:+.0f}%</text>")
    for j,(lab_,col,_) in enumerate(series):
        lxx=pad_l+j*(120 if lab else 100)
        o.append(f"<rect x='{lxx}' y='2' width='8' height='8' fill='{col}' rx='1.5'/><text x='{lxx+11}' y='9' font-size='7' fill='{INK}'>{lab_}</text>")
    return "".join(o)+"</svg>"

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

def N2A_(n):
    return mg.N2A.get(mg.FIX.get(n or "", n or ""))

# ── Where the money came from ────────────────────────────────────────────
TIERS=[(0,1e6,"Under $1M","#CEE2E6"),(1e6,3e6,"$1–3M","#7E9AB8"),(3e6,5e6,"$3–5M","#203C5F"),(5e6,1e12,"$5M+","#E9BC3F")]

SGAP=2          # surface gap between touching segments — white does the separating
BARH=44

def fg(fill):
    """White or ink on this fill, whichever clears contrast. Never guessed."""
    r,g,b=(int(fill[i:i+2],16)/255 for i in (1,3,5))
    f=lambda c: c/12.92 if c<=0.04045 else ((c+0.055)/1.055)**2.4
    L=0.2126*f(r)+0.7152*f(g)+0.0722*f(b)
    Li=0.0114                                   # luminance of INK #131A25
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
                             (y2,"pv","MONEY SPENT",lambda d:BN(d['v']))):
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
        o.append(f"<line x1='0' y1='{half_y:.1f}' x2='{w}' y2='{half_y:.1f}' stroke='{GOLD_MID}' stroke-width='1.5' stroke-dasharray='4 3'/>")
        o.append(f"<text x='{w}' y='{half_y-3.5:.1f}' font-size='7.4' font-weight='800' fill='{mg.GOLD_TXT}' text-anchor='end'>↑ 50% of city dollar volume</text>")
    return "".join(o)+"</svg>"

def type_mirror(rows,w=470,h=168):
    """The four categories, counted the same two ways as the chart above."""
    n=len(rows); tot=sum(r["sellingPrice"] for r in rows)
    segs=[]
    for k,col in ((mg.SF,"#203C5F"),(mg.CO,"#E9BC3F"),(mg.DU,DUP),(mg.OT,"#6B6F75")):
        g=[r for r in rows if r["propType"] in mg.SEG[k]]
        segs.append((mg.TITLE[k],col,len(g),sum(r["sellingPrice"] for r in g)))
    pad_l,gap=2,34; bw=w-pad_l-2; y1=22; y2=y1+BARH+gap
    o=[f"<svg width='100%' height='{h}' viewBox='0 0 {w} {h}' preserveAspectRatio='xMidYMid meet'>"]
    for yy,idx,total,title,fmt in ((y1,2,n,"UNITS SOLD",lambda v:f"{v:,}"),
                                   (y2,3,tot,"MONEY SPENT",lambda v:BN(v))):
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
        lx+=bw/len(segs)
    return "".join(o)+"</svg>"

# ── Bond market ──────────────────────────────────────────────────────────
# 10-year Treasury, month-end readings (U.S. Treasury via Advisor Perspectives,
# CNBC and Bloomberg reporting of the daily close). Oct 2026 is the Oct 28 close
# (the interim update, owner Oct 29 2026); the month-end reading replaces it on Nov 1.
TEN_Y=[("Oct'25",4.11),("Nov",4.14),("Dec",4.16),("Jan'26",4.24),("Feb",4.04),("Mar",4.38),
       ("Apr",4.30),("May",4.50),("Jun",4.44),("Jul",4.75),("Aug",4.78),("Sep",5.29),("Oct 28",5.02)]
CURVE=[("3 mo",4.13),("2 yr",4.71),("10 yr",5.02),("30 yr",5.35)]   # Oct 28 2026 closes (CNBC, Kiplinger, Investing.com)
TWO_NOW, TEN_NOW, MTG_NOW = 4.71, 5.02, cv.RATE_NOW                 # Oct 28 closes; PMMS Oct 22 (Fed held at 3.75–4.00% Oct 28)
def _ytd_medians():
    """Year-to-date SFH and Condo/TIC/Co-op medians, same window as the report, so the
    payment example always prices the typical home of the current data."""
    F=[f["properties"] for f in json.load(open(mg.SRC))["features"]]
    _,mt=mg.last_full_month(); lo,hi=f"{mt.year}-01-01",mt.isoformat()
    ytd=[r for r in F if r.get("sellingPrice") and lo<=(r.get("sellingDate") or "")<=hi]
    med=lambda seg: statistics.median(r["sellingPrice"] for r in ytd if r["propType"] in mg.SEG[seg])
    return round(med(mg.SF),-3), round(med(mg.CO),-3)
MED_SFH, MED_CO = _ytd_medians()

def yield_chart(w=470,h=150):
    """10-year Treasury over twelve months, with the 5% line marked."""
    lo,hi=3.85,5.45; pad_l,pad_b,pad_t=8,17,18
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
        # A steep climb into the next point would run through a label set
        # above this one, so it drops below the line instead.
        below=not last and TEN_Y[i+1][1]-v>0.2
        o.append(f"<text x='{X(i):.1f}' y='{Y(v)+(10 if below else -5):.1f}' font-size='6.2' font-weight='{800 if last else 400}' fill='{DOWN if last else MUTED}' text-anchor='middle'>{v:.2f}</text>")
        o.append(f"<text x='{X(i):.1f}' y='{h-5}' font-size='6.2' fill='{MUTED}' text-anchor='middle'>{lab}</text>")
    return "".join(o)+"</svg>"

def curve_chart(w=228,h=116):
    """The par curve: short money on the left, long money on the right."""
    vs=[v for _,v in CURVE]; lo,hi=min(vs)-0.25,max(vs)+0.35
    pad_l,pad_b,pad_t=12,16,16; n=len(CURVE); gw=(w-2*pad_l)/(n-1)
    X=lambda i:pad_l+i*gw; Y=lambda v:h-pad_b-(v-lo)/(hi-lo)*(h-pad_b-pad_t)
    o=[f"<svg width='100%' height='{h}' viewBox='0 0 {w} {h}' preserveAspectRatio='xMidYMid meet'>"]
    pts=[(X(i),Y(v)) for i,(_,v) in enumerate(CURVE)]
    o.append(f"<polyline points='{' '.join(f'{x:.1f},{y:.1f}' for x,y in pts)}' fill='none' stroke='{GOLD_MID}' stroke-width='2.2'/>")
    for i,(lab,v) in enumerate(CURVE):
        o.append(f"<circle cx='{X(i):.1f}' cy='{Y(v):.1f}' r='2.4' fill='{GOLD_MID}'/>")
        o.append(f"<text x='{X(i):.1f}' y='{Y(v)-5:.1f}' font-size='6.6' font-weight='700' fill='{mg.GOLD_TXT}' text-anchor='middle'>{v:.2f}</text>")
        o.append(f"<text x='{X(i):.1f}' y='{h-4}' font-size='6.6' fill='{MUTED}' text-anchor='middle'>{lab}</text>")
    return "".join(o)+"</svg>"

def spread_chart(w=470,h=158):
    """The 10-year and the 30-year mortgage on one scale: the shaded band
    between them is the lender spread, and it barely moves."""
    # September = the 10-year's Sept 30 close against the last Freddie Mac
    # survey of the month (Sept 24); October = the Oct 28 close against the
    # latest survey (Oct 22) — the report's data date, not "now".
    ten={"Jan":4.24,"Feb":4.04,"Mar":4.38,"Apr":4.30,"May":4.50,"Jun":4.44,"Jul":4.75,"Aug":4.78,"Sep":5.29,"Oct":TEN_NOW}
    mtg=dict(cv.RATES); mtg["Sep"]=cv.RATE_SEP_END; mtg["Oct"]=cv.RATE_NOW
    labs=[k for k in ten if k in mtg]
    lo,hi=3.8,7.6; pad_l,pad_b,pad_t=8,26,16
    n=len(labs); gw=(w-2*pad_l)/(n-1)
    X=lambda i:pad_l+i*gw; Y=lambda v:h-pad_b-(v-lo)/(hi-lo)*(h-pad_b-pad_t)
    top=[(X(i),Y(mtg[k])) for i,k in enumerate(labs)]
    bot=[(X(i),Y(ten[k])) for i,k in enumerate(labs)]
    o=[f"<svg width='100%' height='{h}' viewBox='0 0 {w} {h}' preserveAspectRatio='xMidYMid meet'>"]
    o.append(f"<polygon points='{' '.join(f'{x:.1f},{y:.1f}' for x,y in top)} {' '.join(f'{x:.1f},{y:.1f}' for x,y in reversed(bot))}' fill='{GOLD_MID}' fill-opacity='0.18'/>")
    for pts,col,lab in ((top,GOLD_MID,"30-yr mortgage"),(bot,NAV,"10-yr Treasury")):
        o.append(f"<polyline points='{' '.join(f'{x:.1f},{y:.1f}' for x,y in pts)}' fill='none' stroke='{col}' stroke-width='2.2'/>")
        for x,y in pts: o.append(f"<circle cx='{x:.1f}' cy='{y:.1f}' r='2' fill='{col}'/>")
    for i,k in enumerate(labs):
        o.append(f"<text x='{X(i):.1f}' y='{Y(mtg[k])-5:.1f}' font-size='6' fill='{mg.GOLD_TXT}' text-anchor='middle' font-weight='700'>{mtg[k]:.2f}</text>")
        o.append(f"<text x='{X(i):.1f}' y='{Y(ten[k])+9:.1f}' font-size='6' fill='{NAV}' text-anchor='middle' font-weight='700'>{ten[k]:.2f}</text>")
        o.append(f"<text x='{X(i):.1f}' y='{h-14}' font-size='6.4' fill='{MUTED}' text-anchor='middle'>{k}</text>")
        sp=mtg[k]-ten[k]
        o.append(f"<text x='{X(i):.1f}' y='{h-4}' font-size='6.2' font-weight='700' fill='{INK}' text-anchor='middle'>{sp:.2f}</text>")
    o.append(f"<text x='{pad_l}' y='10' font-size='6.6' fill='{mg.GOLD_TXT}' font-weight='700'>30-yr mortgage</text>")
    o.append(f"<text x='{pad_l+86}' y='10' font-size='6.6' fill='{NAV}' font-weight='700'>10-yr Treasury</text>")
    o.append(f"<text x='{w-pad_l}' y='10' font-size='6.2' fill='{MUTED}' text-anchor='end'>shaded band = lender spread (bottom row)</text>")
    return "".join(o)+"</svg>"

PROP_TAX=0.0118        # San Francisco property tax, roughly 1.18% of assessed value

def lux_series(cy,lo=5e6,hi=float("inf")):
    """Monthly count of sales in a price band: all of the prior year, and the
    current year `cy` (the sales file runs only to the period end)."""
    import collections
    F=[f["properties"] for f in json.load(open(mg.SRC))["features"]]
    c={}
    for yr in (cy-1,cy):
        c[yr]=collections.Counter(int(r["sellingDate"][5:7]) for r in F
            if (r.get("sellingDate") or "").startswith(str(yr)) and r.get("sellingPrice") and lo<=r["sellingPrice"]<hi)
    return c

def lux_chart(cy,w=470,h=176,through=9):
    """Twelve months: the prior year's bars all year (its activity is the full
    year), the current year's January through the period month (`through`)."""
    c=lux_series(cy); py_,cy_=cy-1,cy
    hi_=max([c[py_].get(m,0) for m in range(1,13)]+[c[cy_].get(m,0) for m in range(1,through+1)])*1.34
    pad_l,pad_b,pad_t=10,17,14; n=12; gw=(w-2*pad_l)/n; bw=gw*0.34
    Y=lambda v:h-pad_b-(v/hi_)*(h-pad_b-pad_t)
    o=[f"<svg width='100%' height='{h}' viewBox='0 0 {w} {h}' preserveAspectRatio='xMidYMid meet'>"]
    o.append(f"<line x1='{pad_l}' y1='{h-pad_b}' x2='{w-pad_l}' y2='{h-pad_b}' stroke='{LINE}' stroke-width='0.8'/>")
    for i in range(n):
        m=i+1; cx=pad_l+i*gw+gw/2
        for j,(v,col) in enumerate(((c[py_].get(m,0),"#B9BDC4"),(c[cy_].get(m,0) if m<=through else 0,"#203C5F"))):
            if not v: continue
            x=cx-bw+j*bw
            o.append(f"<rect x='{x:.1f}' y='{Y(v):.1f}' width='{bw-1.5:.1f}' height='{h-pad_b-Y(v):.1f}' fill='{col}' rx='1.5'/>")
            o.append(f"<text x='{x+(bw-1.5)/2:.1f}' y='{Y(v)-2.5:.1f}' font-size='6.4' font-weight='700' fill='{col if j else MUTED}' text-anchor='middle'>{v}</text>")
        o.append(f"<text x='{cx:.1f}' y='{h-5}' font-size='6.8' fill='{MUTED}' text-anchor='middle'>{MON[i]}</text>")
    for j,(lab,col) in enumerate(((f"{py_} (full year)","#B9BDC4"),(str(cy_),"#203C5F"))):
        lxx=pad_l+j*82
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

def by_numbers(rows, thru):
    """Figures for the By the Numbers page, from the year's closed sales.
    Robust counts only — single extreme records (a stale list price, a
    listing left open for years) are not headline material."""
    import collections
    SFH=mg.SEG[mg.SF]
    n=len(rows); vol=sum(r["sellingPrice"] for r in rows)
    days=(datetime.date.fromisoformat(thru)-datetime.date(int(thru[:4]),1,1)).days+1
    hrs=days*24/n
    dom=[r["dom"] for r in rows if r.get("dom") is not None]
    rat=[r["sellingPrice"]/r["listPrice"] for r in rows if r.get("listPrice")]
    sfh=[r for r in rows if r["propType"] in SFH]
    beds=[r["sellingPrice"]/r["bedrooms"] for r in sfh if isinstance(r.get("bedrooms"),(int,float)) and r["bedrooms"]>0]
    CO=mg.SEG[mg.CO]; OT=mg.SEG[mg.OT]
    wd=collections.Counter(datetime.date.fromisoformat(r["sellingDate"][:10]).weekday() for r in rows)
    topday,topn=wd.most_common(1)[0]
    # Highest-volume ZIP by dollars closed, and its three busiest neighborhoods.
    zv=collections.Counter()
    for r in rows:
        if zip_of(r): zv[zip_of(r)]+=r["sellingPrice"]
    zip_,zipv=zv.most_common(1)[0]
    zhoods=[h for h,_ in collections.Counter(mg.hood(r) for r in rows if zip_of(r)==zip_ and mg.hood(r)).most_common(3)]
    off=sum(1 for r in rows if r.get("status")=="Sold Off MLS")
    # Ground incline at each sale (scripts/build-sale-incline.mjs).
    import os
    inc=json.load(open(os.path.join(mg.ROOT,"data/sale-incline.json")))
    slopes=[inc[str(r["id"])] for r in rows if str(r.get("id")) in inc]
    steep=sum(1 for v in slopes if v>=15)
    sq=lambda rs: statistics.median([r["sqft"] for r in rs if r.get("sqft")])
    return dict(
        per_day=f"${vol/days/1e6:.1f}M", vol=BN(vol), days=days,
        every=f"Every {int(hrs)}h {round((hrs%1)*60):02d}m",
        off=f"{off:,}", offpct=f"{100*off/n:.0f}%", n=f"{n:,}",
        topday=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"][topday],
        toppct=f"{100*topn/n:.0f}%",
        week=f"{100*sum(1 for d in dom if d<=7)/len(dom):.0f}%",
        bid150=f"{sum(1 for x in rat if x>=1.5):,}", bid130=f"{sum(1 for x in rat if x>=1.3):,}",
        bidn=f"{len(rat):,}", bidpct=f"{100*sum(1 for x in rat if x>=1.5)/len(rat):.1f}%",
        steep=f"{steep:,}", steeppct=f"{100*steep/len(slopes):.0f}%", slopen=f"{len(slopes):,}",
        per_bed=f"${statistics.median(beds)/1e3:,.0f}K",
        zip=zip_, zipv=f"${zipv/1e6:,.0f}M", zhoods=", ".join(zhoods),
        under=f"{100*sum(1 for x in rat if x<1)/len(rat):.0f}%",
        tenm=f"{sum(1 for r in rows if r['sellingPrice']>=10e6)}",
        sqft=f"{sq(sfh):,.0f} sf", csqft=f"{sq([r for r in rows if r['propType'] in CO]):,.0f} sf",
        osqft=f"{sq([r for r in rows if r['propType'] in OT]):,.0f} sf",
        dsqft=f"{sq([r for r in rows if r['propType'] in mg.SEG[mg.DU]]):,.0f} sf",
    )

def BN(v):
    """Money totals: whole millions under $1B ($666M), two decimals from $1B
    up ($4.17B). Ordinary rounding, so parts add to the total and figures
    match the site's stats band ($8.16B)."""
    return f"${v/1e6:,.0f}M" if v<1e9 else f"${v/1e9:.2f}B"

_ZIPS=None
def zip_of(r):
    """The sale's ZIP: the MLS value when it is a well-formed SF ZIP (941xx),
    otherwise the ZIP polygon the sale sits in (typos like "9411" exist)."""
    global _ZIPS
    z=str(r.get("zip") or "")
    if re.fullmatch(r"941\d\d",z): return z
    if _ZIPS is None:
        import os
        _ZIPS=json.load(open(os.path.join(mg.ROOT,"public/data/sf-zip-codes.geojson")))["features"]
    x,y=r.get("lng"),r.get("lat")
    if x is None or y is None: return None
    def inring(ring):
        c=False; j=len(ring)-1
        for i in range(len(ring)):
            xi,yi=ring[i][0],ring[i][1]; xj,yj=ring[j][0],ring[j][1]
            if (yi>y)!=(yj>y) and x<(xj-xi)*(y-yi)/(yj-yi)+xi: c=not c
            j=i
        return c
    for f in _ZIPS:
        g=f["geometry"]; polys=[g["coordinates"]] if g["type"]=="Polygon" else g["coordinates"]
        for poly in polys:
            if inring(poly[0]) and not any(inring(h) for h in poly[1:]): return str(f["properties"].get("zip"))
    return None

def site_kpis():
    """The home page's By the Numbers boxes, figure for figure: same file
    (app/lib/landing-stats.json), same labels and rounding as Landing.jsx, so
    the report and the site can never show different numbers. Four boxes:
    SFH, Condo / TIC / Co-op and Other (the site's three categories), then
    All sales."""
    import os, math
    L=json.load(open(os.path.join(mg.ROOT,"app/lib/landing-stats.json")))
    m,p=L["market"]["current"],L["market"]["prior"]
    rnd=lambda v: math.floor(v+0.5)                                  # JS Math.round
    money=lambda v: f"${v/1e6:.2f}M"
    usd=lambda v: f"${rnd(v):,}" if v is not None else "—"
    pct=lambda a,b: f"{'+' if a/b-1>=0 else ''}{rnd((a/b-1)*100)}%" if a is not None and b else ""
    unit=lambda a,b,one,many: f"{'+' if a-b>=0 else ''}{rnd(a-b)} {one if abs(rnd(a)-rnd(b))==1 else many}"
    def seg(k):
        a,b=m[k],p[k]
        return [("Median sale",money(a["median"]),money(b["median"]),pct(a["median"],b["median"]),True),
                ("Units sold",f"{a['n']:,}",f"{b['n']:,}",pct(a["n"],b["n"]),False),
                ("Median $/sf",usd(a.get("ppsf")),usd(b.get("ppsf")),pct(a.get("ppsf"),b.get("ppsf")),False),
                ("DOM",rnd(a["dom"]),rnd(b["dom"]),unit(a["dom"],b["dom"],"day","days"),False),
                ("Sale price vs list",f"{rnd(a['saleToList'])}%",f"{rnd(b['saleToList'])}%",unit(a["saleToList"],b["saleToList"],"pt","pts"),False)]
    boxes=[("sfh","SFH",seg("sfh")),("condo","Condo / TIC / Co-op",seg("condo")),("duplex","Duplex",seg("duplex")),("other","Other (Tri+)",seg("other")),
           ("all","All sales",[("Total sales volume",f"${m['volume']/1e9:.2f}B",f"${p['volume']/1e9:.2f}B",pct(m["volume"],p["volume"]),True),
                               ("Total units sold",f"{m['n']:,}",f"{p['n']:,}",pct(m["n"],p["n"]),True)])]
    d=datetime.date.fromisoformat(L["market"]["through"])
    through=d.strftime("%b %-d, %Y").replace("Sep ","Sept ")
    yy,py=L["market"]["year"][2:],L["market"]["priorYear"][2:]
    return boxes,through,yy,py

def mtg_pmt(P,r,yrs=30):
    i=r/100/12; n=yrs*12; return P*i/(1-(1+i)**-n)

def _money_by_hood(rows):
    import collections
    out=collections.Counter()
    for r in rows:
        a=mg.hood(r)
        if a: out[a]+=r["sellingPrice"]
    return out

def build():
    pages,plabel,labels,W,seg,top,S,mon=cv.facts()
    SF,CO,OT=mg.SF,mg.CO,mg.OT
    s,c=seg[SF],seg[CO]; st,ct=s["tot"],c["tot"]
    mo=datetime.date.fromisoformat(W["m1"][0]); mname=mo.strftime("%B"); yy=str(mo.year)[2:]; py=str(mo.year-1)[2:]
    # Through the end of the month, or through its last day when the owner runs a partial month.
    _end=datetime.date.fromisoformat(W["m1"][1]); mthru=mname if (_end+datetime.timedelta(days=1)).day==1 else f"{mname} {_end.day}"
    thru=datetime.date.fromisoformat(W["m1"][1]).strftime("%B %-d")
    allv1=sum(r["sellingPrice"] for r in S["y1"]); allv0=sum(r["sellingPrice"] for r in S["y0"])
    zs={z[0]:z[3] for z in s["byZ"]}; zc={z[0]:z[3] for z in c["byZ"]}
    sun,pf,tr,fg=zs["Sun"]["y1"],zs["Persistent Fog"]["y1"],zs["Transition"]["y1"],zs["Fog"]["y1"]
    peak=max(mon,key=lambda x:x[1]); ratio0=zs['Sun']['y0']['price']/zs['Persistent Fog']['y0']['price']
    byA={name:{a:stt for a,stt in byA_} for (name,byA_,*_) in pages}
    sb=byA[CO].get("South Beach / Yerba Buena"); mb=byA[CO].get("Mission Bay")
    loan=RENT_NOW/pmt(1,cv.RATE_NOW)
    pac=[x for x in s['top']+s['bot'] if 'Pacific / Presidio' in x[1]]; pacpct=sgn(pac[0][0]) if pac else "+7"

    css=mg.FONT_CSS+pt.CSS+f"""
    @page {{ size: letter landscape; margin: 0.32in 0.35in; }}
    body {{ margin:0; font-family: {mg.SANS}; color:{INK}; }}
    .mast .t, h2, .sig b {{ font-family:{mg.DISPLAY}; }}
    .page {{ width:10.3in; height:7.6in; page-break-after:always; position:relative; box-sizing:border-box; background:#fff; }}
    .mast {{ border-bottom:3px solid {GOLD_MID}; padding-bottom:4px; margin-bottom:5px; display:flex; justify-content:space-between; align-items:flex-end; }}
    .mast .t {{ font-size:24px; font-weight:800; color:{NAV}; letter-spacing:-0.5px; }}
    .mast .p {{ font-size:11.5px; color:{NAV}; margin-top:2px; }} .mast .p b {{ color:{GOLD}; }}
    .mast .by {{ font-size:9px; color:{MUTED}; text-align:right; line-height:1.5; }}
    .kpis {{ display:flex; gap:8px; margin-bottom:7px; }}
    .sband {{ background:#131A25; border-radius:6px; padding:9px 16px 2px; margin-bottom:7px; }}
    .sband-h {{ font-size:9.5px; font-weight:700; letter-spacing:0.14em; text-transform:uppercase; color:#CEE2E6; margin-bottom:3px; }}
    .sband-h span {{ color:rgba(255,255,255,0.50); }}
    .sband-row {{ display:grid; grid-template-columns:repeat(5,1fr); gap:7px; padding-bottom:8px; }}
    .sbx {{ border:1px solid rgba(255,255,255,0.14); border-radius:7px; padding:5px 9px 2px; background:rgba(255,255,255,0.025); }}
    .sbx-h {{ font-size:8px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:#fff; margin-bottom:1px; }}
    .sbx-r {{ display:flex; justify-content:space-between; align-items:baseline; gap:6px; padding:2px 0; border-top:1px solid rgba(255,255,255,0.09); }}
    .sbx-l {{ font-size:7.4px; line-height:1.25; color:rgba(255,255,255,0.72); }} .sbx-l b {{ color:#fff; font-weight:700; white-space:nowrap; }}
    .sbx-v {{ font-family:Georgia,'Times New Roman',serif; font-weight:700; color:#CEE2E6; font-size:9.6px; line-height:1.2; white-space:nowrap; text-align:right; }}
    .sbx-v span {{ margin-left:0.44em; font-size:0.66em; font-weight:600; color:rgba(255,255,255,0.50); }}
    .sbx-r.big .sbx-v {{ font-size:13px; }}
    .sbx-all .sbx-r {{ flex-direction:column; align-items:flex-start; gap:1px; padding:4px 0; }}
    .sbx-all .sbx-v {{ font-size:17px; }}
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
    .nb4 {{ gap:9px; }} .nb4 table.top {{ font-size:7.9px; table-layout:auto; }} .nb4 h2 {{ font-size:10.5px; }}
    .nb4 .col {{ min-width:0; }} .nn {{ font-weight:400; color:{MUTED}; font-size:0.85em; }} .nb4 table.top {{ table-layout:auto; font-size:7.2px; }}
    .nb4 table.top td, .nb4 table.top th {{ white-space:nowrap; overflow:visible; padding-left:3px; padding-right:3px; }}
    .nb8 table.top {{ font-size:9.4px; }} .nb8 table.top th {{ font-size:7.6px; }} .nb8 table.top td {{ padding-top:2.6px; padding-bottom:2.6px; }} .nb8 h2 {{ font-size:12px; margin-top:8px; }}
    .nb12 table.top {{ font-size:8.3px; }} .nb12 table.top th {{ font-size:7.2px; }} .nb12 table.top td {{ padding-top:1.9px; padding-bottom:1.9px; }} .nb12 h2 {{ font-size:11.5px; margin-top:6px; }}
    .nb16 table.top {{ font-size:7.3px; margin-bottom:2px; }} .nb16 table.top th {{ font-size:6.3px; padding-top:1.2px; padding-bottom:1.2px; }}
    .nb16 table.top td {{ padding-top:0.7px; padding-bottom:0.7px; }} .nb16 h2 {{ font-size:10px; margin-top:3px; margin-bottom:2px; padding-top:2px; padding-bottom:2px; }}
    table.top th {{ background:{NAV}; color:#fff; font-size:6.9px; text-transform:uppercase; padding:2px 4px; text-align:right; }}
    table.top th.l, table.top td.l {{ text-align:left; }}
    table.top td {{ padding:1.9px 4px; text-align:right; border-bottom:0.4px solid {LINE}; white-space:nowrap; overflow:hidden; }}
    table.top tr:nth-child(even) td {{ background:#F6F7F7; }}
    table.top td.b {{ font-weight:800; color:{NAV}; }}
    .mapwrap {{ border:1px solid {LINE}; border-radius:6px; overflow:hidden; line-height:0; }}
    .maplegend {{ display:flex; align-items:center; flex-wrap:nowrap; gap:7px; font-size:7.6px; white-space:nowrap; color:{INK}; margin:4px 0 2px; }}
    .maplegend b {{ color:{NAV}; }}
    .dotkey {{ display:inline-block; width:7px; height:7px; border-radius:50%; background:#203C5F; margin-right:3px; }}
    .zk {{ display:inline-flex; align-items:center; gap:3px; }}
    .zc {{ display:inline-block; width:9px; height:9px; border-radius:2px; border:0.5px solid #a8a29e; }}
    .mapcap {{ font-size:8.4px; color:{MUTED}; margin:3px 0 6px; line-height:1.35; }}
    .pull {{ margin-top:8px; border-left:5px solid {GOLD_MID}; background:{NAV_LT}; border-radius:7px; padding:11px 14px; }}
    .pq {{ font-family:Georgia,'Bitstream Charter','Liberation Serif',serif; font-size:17px; font-weight:700; color:{NAV}; line-height:1.25; letter-spacing:-0.3px; }}
    .pqs {{ font-size:10px; color:{INK}; margin-top:5px; }}
    .sig {{ background:{GOLD_LT}; border-left:3px solid {GOLD_MID}; border-radius:6px; padding:8px 11px; font-size:10px; line-height:1.45; }}
    .sig b {{ color:{GOLD}; }}
    .mast .t .part {{ font-size:12px; font-weight:700; color:{MUTED}; letter-spacing:0; }}
    table.mzp {{ width:100%; border-collapse:collapse; font-size:10px; margin-top:3px; }}
    table.mzp td {{ padding:4px 2px; border-bottom:0.5px solid {LINE}; }}
    table.mzp td.b {{ text-align:right; font-weight:800; color:{NAV}; font-size:11px; }}
    .bn {{ display:grid; grid-template-columns:repeat(6,1fr); grid-auto-rows:118px; gap:7px; margin:8px 0 4px; }}
    .bn-t {{ border-radius:6px; padding:10px 12px; display:flex; flex-direction:column; justify-content:center; overflow:hidden; }}
    .bn-t b {{ font-family:Georgia,serif; font-weight:700; line-height:1; font-size:30px; }}
    .bn-t span {{ margin-top:5px; font-size:10px; line-height:1.3; }}
    .bn-t i {{ margin-top:3px; font-style:normal; font-size:8px; opacity:.75; }}
    .bn-t.big {{ grid-column:span 2; grid-row:span 2; }}
    .bn-t.big b {{ font-size:64px; }} .bn-t.big span {{ font-size:14px; }} .bn-t.big i {{ font-size:10px; }}
    .bn-t.wide {{ grid-column:span 2; }} .bn-t.wide b {{ font-size:40px; }} .bn-t.wide span {{ font-size:11px; }}
    .bn-t.navy {{ background:{NAV}; color:#fff; }}
    .bn-t.gold {{ background:{GOLD_MID}; color:#131A25; }}
    .bn-t.light {{ background:{NAV_LT}; color:{NAV}; }}
    .bn-t.pair b {{ font-size:15px; white-space:nowrap; }}   /* two figures in one tile */
    .bn-t b small {{ font-size:0.45em; font-weight:600; opacity:.85; letter-spacing:0; }}
    .bn-t.light span {{ color:{INK}; }}
    ul.math {{ list-style:none; margin:4px 0 0; padding:0; font-size:9px; }}
    ul.math li {{ display:flex; justify-content:space-between; padding:2.5px 0; margin:0; border-bottom:0.5px solid {LINE}; }}
    ul.math li::before {{ content:none !important; display:none !important; }}
    ul.math li.tot {{ border-bottom:none; border-top:1.2px solid {NAV}; font-weight:700; }}
    ul.math li.tot b {{ font-size:11px; color:{NAV}; }}
    ul.sigl {{ margin:3px 0 0; padding-left:14px; }}
    ul.sigl li {{ margin:2px 0; }}
    td.bar {{ text-align:left; }}
    .db {{ display:inline-block; width:46px; height:7px; background:#E6E7E8; border-radius:2px; vertical-align:-1px; overflow:hidden; }}
    .dbf {{ display:block; height:7px; border-radius:2px; }}
    .dbv {{ margin-left:4px; font-weight:700; }}
    .foot {{ position:absolute; bottom:0; left:0; right:0; font-size:7px; color:{MUTED}; border-top:0.5px solid {LINE}; padding-top:3px; display:flex; justify-content:space-between; }}
    .foot span:last-child {{ white-space:nowrap; padding-left:8px; }}
    """
    CHIP=lambda c: f"<span style='display:inline-block;width:9px;height:9px;border-radius:2px;background:{c};border:0.5px solid #a8a29e;vertical-align:-1px;margin-left:2px'></span>"
    B=lambda stat,desc: f"<li><span class='st'>{stat}</span> — {desc}</li>"
    H=lambda tag,stat,desc,gold=False: f"<li><span class='tag{' y' if gold else ''}'>{tag}</span><span class='st'>{stat}</span> — {desc}</li>"
    def kpi(label,value,vs,color=UP):
        return (f"<div class='kpi'><div class='kl'>{label}</div><div class='kv'>{value}</div>"
                f"<div class='ks' style='color:{color}'>Versus {py}: {vs}</div></div>")
    sl="<span style='font-size:15px;color:#6B6F75;font-weight:400;padding:0 5px'>/</span>"
    mm=lambda v: f"{v/1e6:.2f}"
    o=[f"<!doctype html><html><head><meta charset='utf-8'><style>{css}</style></head><body>"]
    # monthly series feeding the two stacked charts
    ms=monthly_series(); r26=[r for r in ms[2026] if r["m"]<=mo.month]; r25=ms[2025]
    r25m={r["m"]:r for r in r25}; r26m={r["m"]:r for r in r26}
    partial = mthru!=mname     # an interim, partial-month update (owner's decision)
    def two_year(keys,dfmt,m0_total=None):
        rows=[]
        for m_ in range(1,13):
            a_=r25m.get(m_); b_=r26m.get(m_); row=dict(m=m_); ta=tb=0
            for k in keys:
                va=a_[k] if a_ else None; vb=b_[k] if b_ else None
                row[k]=va; row[k+"_b"]=vb; ta+=va or 0; tb+=vb or 0
            # The partial month is compared with the same days of last year's month,
            # not with last year's whole month (whose full bar still shows).
            if partial and m_==mo.month and m0_total is not None: ta=m0_total
            row["d"]=dfmt(tb-ta) if (ta and tb) else ""
            rows.append(row)
        return rows
    mlrows=[dict(r, d=(100*(r["msold"]-r25m[r["m"]]["msold"])/r25m[r["m"]]["msold"]) if r["m"] in r25m and r25m[r["m"]]["msold"] else None) for r in r26]
    clrows=[dict(r, d=(100*(r["csold"]-r25m[r["m"]]["csold"])/r25m[r["m"]]["csold"]) if r["m"] in r25m and r25m[r["m"]]["csold"] else None) for r in r26]
    olrows=[dict(r, d=(100*(r["osold"]-r25m[r["m"]]["osold"])/r25m[r["m"]]["osold"]) if r["m"] in r25m and r25m[r["m"]]["osold"] else None) for r in r26]
    dlrows=[dict(r, d=(100*(r["dsold"]-r25m[r["m"]]["dsold"])/r25m[r["m"]]["dsold"]) if r["m"] in r25m and r25m[r["m"]].get("dsold") and r.get("dsold") else None) for r in r26]
    ukeys=["sfh","cd","du","oth"]; vkeys=["sfh_v","cd_v","du_v","oth_v"]
    urows=two_year(ukeys,lambda d:f"{d:+.0f}",len(S["m0"]))
    vrows=two_year(vkeys,lambda d:f"{d/1e6:+.0f}M",sum(r["sellingPrice"] for r in S["m0"]))
    tot=lambda rows,keys,suf: sum((r.get(k+suf) or 0) for r in rows for k in keys)
    ytd_now=lambda rows,keys: sum((r.get(k+"_b") or 0) for r in rows for k in keys)
    ytd_then=lambda rows,keys: sum((r.get(k) or 0) for r in rows for k in keys if r["m"] in r26m)
    u26,u25=ytd_now(urows,ukeys),ytd_then(urows,ukeys); u25y=tot(urows,ukeys,"")
    v26,v25=ytd_now(vrows,vkeys),ytd_then(vrows,vkeys); v25y=tot(vrows,vkeys,"")
    if partial:   # last year's same stretch, Jan 1 to the same day
        u25=len(S["y0"]); v25=sum(r["sellingPrice"] for r in S["y0"])
    uytd=dict(label=f"{u26:,} vs {u25:,}  {sgn(D(u26,u25))}%", sub=f"through {mthru} · 2025 full year {u25y:,}")
    vytd=dict(label=f"{BN(v26)} vs {BN(v25)}  {sgn(D(v26,v25))}%", sub=f"through {mthru} · 2025 full year {BN(v25y)}")
    USEG=[("SFH","#AFC0D0","#203C5F","sfh"),("Condo/TIC/Co-op","#F6E3A6","#E9BC3F","cd"),("Duplex",DUP_LT,DUP,"du"),("Other (Tri+)","#C9CCD0","#6B6F75","oth")]
    VSEG=[("SFH","#AFC0D0","#203C5F","sfh_v"),("Condo/TIC/Co-op","#F6E3A6","#E9BC3F","cd_v"),("Duplex",DUP_LT,DUP,"du_v"),("Other (Tri+)","#C9CCD0","#6B6F75","oth_v")]
    # ── PAGE 1 — San Francisco right now ─────────────────────────────────
    # The local snapshot. Headline numbers, then four charts. Stats only, no
    # captions (the owner, Oct 21 2026): definitions go in the footer.
    o.append(f"""<div class='page'><div class='mast'><div><div class='t'>San Francisco Real Estate</div>
      <div class='p'>YTD through <b>{mthru}{',' if mthru!=mname else ''} {mo.year}</b> vs {mo.year-1}.</div></div>
      <div class='by'>Chuck Heaver · Vanguard Properties<br>Closed sales, SFAR MLS · run {datetime.date.today().strftime('%B %-d, %Y')}</div></div>""")
    kboxes,kthru,kyy,kpy=site_kpis()
    o.append(f"<div class='sband'><div class='sband-h'>By the Numbers: \u2019{kyy} vs <span>\u2019{kpy}</span> YTD ({kthru})</div><div class='sband-row'>"
        +"".join(f"<div class='sbx sbx-{k}'><div class='sbx-h'>{t}</div>"
                 +"".join(f"<div class='sbx-r{' big' if big else ''}'><div class='sbx-l'>{lab}{': <b>'+chg+'</b>' if chg else ''}</div>"
                          f"<div class='sbx-v'>{now}<span>{then}</span></div></div>" for lab,now,then,chg,big in rows)
                 +"</div>" for k,t,rows in kboxes)
        +"</div></div>")
    o.append("<div class='cols' style='margin-top:7px'>")
    o.append(f"""<div class='col'><h2>Units Sold</h2>
      {stacked(urows,USEG,uytd,h=212)}</div>""")
    o.append(f"""<div class='col'><h2>Volume Allocation ($M a month)</h2>
      {stacked(vrows,VSEG,vytd,h=212,fmt=lambda v:f"{v/1e6:.0f}")}</div>""")
    o.append("</div>")
    o.append("<div class='cols' style='margin-top:7px'>")
    SL=[("What sellers asked","#E9BC3F"),("What buyers paid","#203C5F")]
    for t_,rows_,k_ in (("SFH",mlrows,"m"),("Condo/TIC/Co-op",clrows,"c"),("Duplex",dlrows,"d"),("Other (Tri+)",olrows,"o")):
        o.append(f"""<div class='col'><h2>Sale vs List — {t_}</h2>
      {lines(rows_,[(SL[0][0],SL[0][1],k_+"list"),(SL[1][0],SL[1][1],k_+"sold")],w=300,h=224,dkey="d",lab=False)}</div>""")
    o.append("</div>")
    o.append(f"<div class='foot'><span>Source: SFAR MLS via BrokerMetrics, closed sales (Closed + Sold Off MLS), geocoded to the site's fog-contour layer. Data through {W['m1'][1]}. Sale vs List: monthly medians; the figure under each month is the change in the median sale from the same month last year. Deemed reliable, not guaranteed.</span><span>page 1 / 9</span></div></div>")

    # (The National Picture page was removed; these values still feed the Cost of Ownership page.)
    urows2=[dict(m=m_,us=u,ca=c_,sf=f_) for m_,u,c_,f_ in UNEMP]
    mspread=MTG_NOW-TEN_NOW
    yr_ago=TEN_Y[0][1]

    # ── PAGE 3 — where the money came from ───────────────────────────────
    msplit,mn,mtot=money_split(S["y1"])
    hrank=sorted(((a,v) for a,v in _money_by_hood(S["y1"]).items()), key=lambda kv:-kv[1])
    top3=sum(v for _,v in hrank[:3])
    cheap=msplit[0]; rich=msplit[-1]
    o.append(f"""<div class='page'><div class='mast'><div><div class='t'>Detail — Allocation of Money</div>
      <div class='p'>{BN(mtot)} · {mn:,} sales · Jan 1 – {thru}, 20{yy}</div></div>
      <div class='by'>Chuck Heaver · Vanguard Properties<br>Closed sales, Jan 1 – {thru}</div></div>""")
    o.append("<div class='cols'>")
    o.append(f"""<div class='col' style='flex:1.5'><h2>Allocation by Tier</h2>
      {mirror_bars(msplit)}
      <h2 style='margin-top:6px'>Allocation by Type</h2>
      {type_mirror(S["y1"],h=196)}</div>""")
    o.append(f"""<div class='col' style='flex:1.1'><h2>Allocation by Neighborhood: Top 20 by Dollars</h2>
      {hood_bars(hrank,mtot,w=380,h=470,top=20)}</div>""")
    o.append("</div>")
    o.append(f"""<div class='foot'><span>All closed sales, Jan 1 – {thru}. Tiers by final sale price; top bar units, bottom bar dollars. Every neighborhood counted on its own.</span><span>page 3 / 9</span></div></div>""")

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
        for r in (6.10,6.50,MTG_NOW,7.50))
    lux=[r for r in S["y1"] if r["sellingPrice"]>=5e6]
    lux0=[r for r in S["y0"] if r["sellingPrice"]>=5e6]
    lux_py=sum(lux_series(mo.year)[mo.year-1].values())   # the prior year's whole-year count
    top5=[r for r in S["y1"] if r["sellingPrice"]>=5e6]
    luxv=sum(r["sellingPrice"] for r in lux); top5v=sum(r["sellingPrice"] for r in top5)
    zero=[r for r in top5 if r.get("dom")==0 or r["status"]=="Sold Off MLS"]
    carry=lambda p,y: p*y/100+p*PROP_TAX
    cost_at=len(o)                        # The Cost of Ownership prints last (see build's end)
    o.append(f"""<div class='page'><div class='mast'><div><div class='t'>The Cost of Ownership</div>
      <div class='p'>Rates as of Oct 28, 2026</div></div>
      <div class='by'>Chuck Heaver · Vanguard Properties<br>Closed sales · rates as of Oct 28 (mortgage: Oct 22 survey)</div></div>""")
    o.append("<div class='cols'>")
    o.append(f"""<div class='col'><h2 class='band'>The Financed Buyer</h2>
      <h2>The Cost of Financing an Average Home</h2>
      <table class='top'><tr><th class='l'>30-yr rate</th><th>SFH median</th><th>vs 6.10%</th><th>Condo/TIC/Co-op median</th><th>vs 6.10%</th></tr>{rate_rows}</table>
      <h2 style='margin-top:6px'>30-yr Mortgage vs 10-yr Treasury</h2>{spread_chart(h=140)}
      <h2 style='margin-top:5px'>The Yield Curve, Oct 28</h2>{curve_chart(w=470,h=92)}</div>""")
    o.append(f"""<div class='col'><h2 class='band'>The Cash Buyer</h2>
      <h2>Over $5M — Sales by Month, 20{py} vs 20{yy}</h2>
      {lux_chart(mo.year,h=190,through=mo.month)}
      <div class='cap'><span class='st'>{len(lux)}</span> sales Jan 1 – {thru} against <span class='st'>{len(lux0)}</span> in the same stretch of 20{py}, <span class='st'>{sgn(D(len(lux),len(lux0)))}%</span> (20{py} full year: {lux_py}).</div>
      <h2 style='margin-top:6px'>Annual Opportunity Cost of Owning an $8M Home</h2>
      {carry_chart(w=470,h=112)}
      <ul class='math'>
        <li>Lost bond earnings ({TEN_NOW:.2f}%) <b>${round(8e6*TEN_NOW/100,-3):,.0f}</b></li>
        <li>Real estate taxes ({100*PROP_TAX:.2f}%) <b>${8e6*PROP_TAX:,.0f}</b></li>
        <li class='tot'>Total <b>${round(8e6*TEN_NOW/100,-3)+8e6*PROP_TAX:,.0f}</b></li>
      </ul></div>""")
    o.append("</div>")
    o.append(f"""<div class='foot'><span>Monthly payment on the {M(MED_SFH)} SFH and {M(MED_CO)} Condo/TIC/Co-op medians with 20% down; principal and interest only. Foregone yield uses the 10-year Treasury; property tax at {100*PROP_TAX:.2f}%. Insurance, upkeep and illiquidity are additional.</span><span>page 4 / 9</span></div></div>""")

    cost_end=len(o)
    # ── PAGE 5 — the neighborhoods ───────────────────────────────────────
    # The 10s of the current year: sixteen Top 10s, four across in four rows,
    # in the owner's order — row 1 SFH (neighborhoods, sales, $/sf, overbids),
    # rows 2 and 3 the same for Condo/TIC/Co-op and Other, row 4 the lows and
    # the busiest neighborhoods. This year only (owner, Oct 16 2026): no prior-year column.
    Y1=S["y1"]; SFHs=mg.SEG[SF]; COs=mg.SEG[CO]; OTs=mg.SEG[OT]
    ratio=lambda r: r["sellingPrice"]/r["listPrice"] if r.get("listPrice") else None
    def pol(r):
        return f"{100*ratio(r):.0f}%" if ratio(r) else "—"
    def polc(r):
        return UP if ratio(r) and ratio(r)>1 else MUTED
    short=lambda r: html.escape(r['address'].split(',')[0])
    def sales_rows(rs):
        return "".join(f"<tr><td class='l' data-sale='{html.escape(str(r.get('id','')))}'>{i+1}. {short(r)}</td><td class='b'>{M(r['sellingPrice'])}</td>"
                       f"<td style='color:{polc(r)};font-weight:700'>{pol(r)}</td></tr>" for i,r in enumerate(rs))
    # Every neighborhood in our database on its own; every area with a sale
    # counts, thin samples carry a * (fewer than 10 sales) instead of being dropped.
    star=lambda n: "*" if n<10 else ""
    import collections as _c
    nbk=mg.hood
    def bynb(rows, seg=None):
        out=_c.defaultdict(list)
        for r in rows:
            if nbk(r) and (seg is None or r["propType"] in seg): out[nbk(r)].append(r)
        return out
    def nb_median_rows(seg, low=False):
        """Neighborhoods by median sale price in one segment, with this year's
        sales."""
        now=bynb(Y1,seg)
        rk=sorted([(a,statistics.median(r["sellingPrice"] for r in rs),len(rs)) for a,rs in now.items() if rs],
                  key=lambda t:(t[1] if low else -t[1]))[:10]
        return "".join(f"<tr><td class='l'>{i+1}. {html.escape(a)}{star(n)}</td><td class='b'>{M(m)}</td><td>{n}</td></tr>"
                       for i,(a,m,n) in enumerate(rk))
    def ppsf_sales_rows(seg):
        """The ten individual sales with the highest price per square foot in
        one segment — every sale with square footage reported (the owner's
        rule: the reported figures stand; only a sale with no footage is
        left out, and the footer says so)."""
        psf=lambda r: r["sellingPrice"]/r["sqft"]
        top=sorted([r for r in Y1 if r["propType"] in seg and r.get("sqft")],key=lambda r:-psf(r))[:10]
        return "".join(f"<tr><td class='l' data-sale='{html.escape(str(r.get('id','')))}'>{i+1}. {short(r)}</td>"
                       f"<td class='b'>${psf(r):,.0f}</td><td>{M(r['sellingPrice'])}</td></tr>" for i,r in enumerate(top))
    def nb_count_rows():
        """Neighborhoods by number of sales, every property type."""
        rk=sorted(bynb(Y1).items(),key=lambda kv:-len(kv[1]))[:10]
        return "".join(f"<tr><td class='l'>{i+1}. {html.escape(a)}</td><td class='b'>{len(rs):,}</td>"
                       f"<td>{M(statistics.median(r['sellingPrice'] for r in rs))}</td></tr>" for i,(a,rs) in enumerate(rk))
    seg_sales=lambda seg: [r for r in Y1 if r["propType"] in seg]
    top_sales=lambda seg: sorted(seg_sales(seg),key=lambda r:-r["sellingPrice"])[:10]
    # Every sale is a reportable sale, below-market-rate (BMR) units included;
    # the one thing left out is a sale with no square footage reported (the
    # footer says so), which also keeps a parking space off the lows.
    low_sales=lambda seg: sorted([r for r in seg_sales(seg) if r.get("sqft")],key=lambda r:r["sellingPrice"])[:10]
    # Biggest overbids by sale-to-list, every sale with a list price.
    overbids=lambda seg: sorted([r for r in seg_sales(seg) if ratio(r)],key=lambda r:-ratio(r))[:10]
    TH=lambda *cols: "<tr>"+"".join(f"<th class='l'>{c[1:]}</th>" if c.startswith("<") else f"<th>{c}</th>" for c in cols)+"</tr>"
    NB=TH("<Neighborhood","Median","Sales")
    SALE=TH("<Address","Closed","% list")
    PSF=TH("<Address","$/sf","Closed")
    panel=lambda title,head,rows: f"<h2>{title}</h2><table class='top'>{head}{rows}</table>"
    # Four categories (owner, Oct 29 2026), so The 10s is two pages: a row per
    # category — its neighborhoods, top sales, top $/sf and overbids — with the
    # lows and the busiest neighborhoods as the second page's last row.
    yr10=datetime.date.fromisoformat(W['m1'][1]).year
    def seg_row(segk):
        T=mg.TITLE[segk]; types=mg.SEG[segk]
        return [(f"Neighborhood {T}",NB,nb_median_rows(types)), (f"Top 10 {T}",SALE,sales_rows(top_sales(types))),
                (f"Top $/sf {T}",PSF,ppsf_sales_rows(types)), (f"Overbids - {T}",SALE,sales_rows(overbids(types)))]
    low_row=[("Lowest Neighborhood SFH",NB,nb_median_rows(SFHs,low=True)), ("Lowest 10 SFH",SALE,sales_rows(low_sales(SFHs))),
             (f"Lowest 10 {mg.TITLE[CO]}",SALE,sales_rows(low_sales(COs))), ("Top # Units Sold (All)",TH("<Neighborhood","Sales","Median"),nb_count_rows())]
    for part,rows_ in ((1,[seg_row(SF),seg_row(CO)]),(2,[seg_row(mg.DU),seg_row(OT),low_row])):
        o.append(f"""<div class='page'><div class='mast'><div><div class='t'>The 10s of {yr10} <span class='part'>{part} of 2</span></div>
      <div class='p'>Year to date: Jan 1 – {datetime.date.fromisoformat(W['m1'][1]).strftime('%b %-d, %Y')}</div></div>
      <div class='by'>Chuck Heaver · Vanguard Properties</div></div>""")
        o.append(f"<div class='cols nb4 {'nb12' if len(rows_)==3 else 'nb8'}'>")
        for c in range(4):
            o.append("<div class='col'>"+"".join(panel(*row[c]) for row in rows_)+"</div>")
        o.append("</div>")
        o.append(f"<div class='foot'><span>Closed sales, Jan 1 – {thru} (SFAR MLS), this year only. * fewer than 10 sales. Every sale counts, BMR units included; sales under $100K (parking, rentals, entry errors) and duplicate entries left out. Top $/sf and Lowest 10 leave out sales with no sq ft reported. SFH = Single Family Residence, Halfplex and 2 Houses on Lot; Other (Tri+) = triplexes, fourplexes, 5+ units and the other types.</span><span>page 5 / 9</span></div></div>")

    # ── PAGE 6 — in depth ────────────────────────────────────────────────
    # Everything a reader can skip. The narrative pages stay light because
    # the long explanations were moved down here.
    wrows,wcut,w25y,w26,wlast,w25=weekly_series(W["m1"][1])
    bn=by_numbers(S["y1"], W["m1"][1])
    T_=lambda cls,v,lab,sub="": f"<div class='bn-t {cls}'><b>{v}</b><span>{lab}</span>{f'<i>{sub}</i>' if sub else ''}</div>"
    o.append(f"""<div class='page'><div class='mast'><div><div class='t'>By the Numbers</div>
      <div class='p'>Jan 1 – {thru}, 20{yy}</div></div>
      <div class='by'>Chuck Heaver · Vanguard Properties<br>Closed sales, SFAR MLS</div></div>
      <div class='bn'>"""
      +T_("navy big", bn['per_day'], "Avg Daily Sales Volume", f"{bn['vol']} over {bn['days']} days")
      +T_("gold wide", bn['every'], "between sales, on average")
      +T_("light wide", bn['off'], "properties sold off-market", f"{bn['offpct']} of {bn['n']} sales")
      +T_("light", bn['topday'], f"Most frequent Close Day, {bn['toppct']} of total")
      +T_("light", bn['week'], "sold within a week")
      +T_("navy wide", f"{bn['bid150']}<small> of {bn['bidn']} ({bn['bidpct']})</small>", "homes sold for 150% of list or more", f"{bn['bid130']} went for 130%+")
      +T_("light wide", bn['steep'], "properties on a steep incline (15%+)", f"{bn['steeppct']} of {bn['slopen']} sales · ground slope at the address, USGS 10 m elevation")
      +T_("gold", bn['zip'], "highest volume ZIP", f"{bn['zipv']} · {bn['zhoods']}")
      +T_("light", bn['under'], "sold below asking")
      +T_("light", bn['tenm'], "sales of $10M or more")
      +T_("navy pair", f"{bn['sqft'][:-3]} / {bn['csqft'][:-3]} / {bn['dsqft'][:-3]} / {bn['osqft'][:-3]}", "median sq ft — SFH, Condo/TIC/Co-op, Duplex, Other (Tri+)")
      +"</div>")
    o.append(f"""<div style='margin-top:7px'><h2>Units Sold by Week — Every Week of Both Years</h2>
      {weekly_bars(wrows,h=150,ytd=dict(label=f"{w26:,} vs {w25:,}  {sgn(D(w26,w25))}%", sub=f"Jan 1 – {thru}, both years · 2025 full year {w25y:,}"))}</div>""")
    o.append(f"<div class='foot'><span>Closed sales (SFAR MLS), Jan 1 – {thru}, 20{yy}; comparisons with 20{py} use the same stretch, and 20{py} activity marked “full year” runs Jan 1 – Dec 31. Days on market as reported; list-to-sale ratios use the final list price. Units by week: grey bars after week {wcut} are 20{py} only.</span><span>page 6 / 9</span></div></div>")

    # Product types (product.py): SFH, Duplex / 2 Homes, Condo, TIC, Co-op, Other.
    o.append(pt.page_html(pt.compute(mg.period_end() or W["m1"][1]), thru, yy))

    o.append("</body></html>")
    # The Cost of Ownership is the report's last page, after the grids and the
    # microclimate pages, so it goes to its own document (same styles) that
    # renumber.py, proof.py, web.py and pdf.mjs take last.
    cost=o[cost_at:cost_end]; del o[cost_at:cost_end]
    return "".join(o), o[0]+"".join(cost)+"</body></html>"

if __name__=="__main__":
    main, cost = build()
    open(mg.os.path.join(mg.HERE,"out","cover3.html"),"w").write(main)
    open(mg.os.path.join(mg.HERE,"out","cover3-cost.html"),"w").write(cost)
    print("wrote cover3.html, cover3-cost.html")
