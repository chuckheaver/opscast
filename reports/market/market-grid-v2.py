import json, statistics, datetime, html
from collections import defaultdict
import os
HERE=os.path.dirname(os.path.abspath(__file__)); ROOT=os.path.abspath(os.path.join(HERE,"..",".."))
SRC=os.path.join(ROOT,"public/data/sf-listings.geojson")
NAV="#042C53"; NAV_LT="#E6F1FB"; GOLD="#854F0B"; GOLD_LT="#FAEEDA"; GOLD_MID="#C9A227"; UP="#15803d"; DOWN="#b91c1c"; INK="#1c1917"; MUTED="#6b6560"; LINE="#ddd8d0"
FIX={"Central Waterfront/D":"Central Waterfront/Dogpatch","Cole Valley/Parnassu":"Cole Valley/Parnassus Heights","Eureka Valley/Dolore":"Eureka Valley / Dolores Heights",
     "Financial District/B":"Financial District/Barbary Coast","Forest Hill Extensio":"Forest Hills Extension","Jordan Park/Laurel H":"Jordan Park / Laurel Heights",
     "Lower Pacific Height":"Lower Pacific Heights","Buena Vista/Ashbury":"Buena Vista Park/Ashbury Heights","Saint Francis Wood":"St. Francis Wood"}
AREAS={
 "Marina / Cow Hollow":["Marina","Cow Hollow"],
 "Pacific / Presidio Heights":["Pacific Heights","Presidio Heights"],
 "Lower Pacific / Laurel Hts":["Lower Pacific Heights","Jordan Park / Laurel Heights","Anza Vista"],
 "Russian Hill":["Russian Hill"], "Nob Hill":["Nob Hill"], "Telegraph Hill":["Telegraph Hill"],
 "North Beach / Waterfront":["North Beach","North Waterfront"],
 "Downtown / Civic Center":["Downtown","Van Ness/Civic Center","Tenderloin","Financial District/Barbary Coast"],
 "Alamo Square / NOPA":["Alamo Square","North Panhandle"],
 "Western Addition":["Western Addition"],
 "Hayes Valley":["Hayes Valley"],
 "Cole Valley / Haight":["Cole Valley/Parnassus Heights","Haight Ashbury"],
 "Buena Vista / Corona Heights":["Buena Vista Park/Ashbury Heights","Corona Heights","Clarendon Heights"],
 "Castro / Duboce Triangle":["Eureka Valley / Dolores Heights","Duboce Triangle"],
 "Noe Valley":["Noe Valley"], "Mission Dolores":["Mission Dolores"], "Mission":["Inner Mission"],
 "Bernal Heights / Glen Park":["Bernal Heights","Glen Park"],
 "Potrero Hill":["Potrero Hill"], "Dogpatch":["Central Waterfront/Dogpatch"],
 "South Beach / Yerba Buena":["South Beach","Yerba Buena"], "SOMA":["South of Market"], "Mission Bay":["Mission Bay"],
 "Diamond Heights":["Diamond Heights"],
 "Twin Peaks / Midtown Terr":["Twin Peaks","Midtown Terrace","Forest Knolls"],
 "Richmond / Lake Street":["Inner Richmond","Central Richmond","Outer Richmond","Lake Street"],
 "Sea Cliff / Lone Mountain":["Sea Cliff","Lone Mountain"],
 "Sunset / Parkside":["Inner Sunset","Central Sunset","Outer Sunset","Inner Parkside","Outer Parkside","Parkside","Golden Gate Heights"],
 "West Portal / Forest Hill":["West Portal","Forest Hill","Forest Hills Extension","St. Francis Wood","Sherwood Forest","Monterey Heights","Mount Davidson Manor","Miraloma Park","Westwood Highlands","Balboa Terrace"],
 "Westwood Park / Sunnyside":["Westwood Park","Sunnyside"],
 "Ingleside Terrace / Lakeside":["Ingleside Terrace","Lakeside"],
 "Lake Shore / Stonestown":["Lake Shore","Merced Manor","Pine Lake Park","Stonestown"],
 "Ingleside / Oceanview":["Ingleside","Ingleside Heights","Oceanview","Merced Heights"],
 "Excelsior / Portola":["Excelsior","Portola","Crocker Amazon","Outer Mission","Mission Terrace"],
 "Bayview / Hunters Point":["Bayview","Bayview Heights","Hunters Point","Candlestick Point"],
 "Visitacion Vly / Silver Terr":["Visitacion Valley","Silver Terrace","Little Hollywood"],
}
N2A={n:a for a,ns in AREAS.items() for n in ns}
SEG={"Single Family Residences":{"Single Family Residence","2 Houses on Lot","Halfplex"},
     "Condominiums / TIC / Co-ops":{"Condominium","Tenancy in Common","Stock Cooperative","Townhouse"}}
ZONES=[("Sun","#FDE68A","\u2264 8.0 hrs/day",lambda h:h<8.5),
       ("Transition","#E7E5E4","8.5 \u2013 8.9",lambda h:8.5<=h<9),
       ("Fog","#C1BEBC","9.0 \u2013 10.9",lambda h:9<=h<11),
       ("Persistent Fog","#78716C","\u2265 11.0",lambda h:h>=11)]
def zone_of(h):
    if h is None: return None
    for n,_,_,t in ZONES:
        if t(h): return n
    return None
def med(v): v=[x for x in v if x is not None]; return statistics.median(v) if v else None
def stats(rows):
    n=len(rows)
    if not n: return dict(n=0,price=None,avg=None,ppsf=None,dom=None,over=None,pct=None,vol=0)
    sale=[r["sellingPrice"] for r in rows if r.get("sellingPrice")]
    ppsf=[r["sellingPrice"]/r["sqft"] for r in rows if r.get("sellingPrice") and r.get("sqft")]
    dom=[r["dom"] for r in rows if r.get("dom") is not None]
    ratio=[r["sellingPrice"]/r["listPrice"] for r in rows if r.get("sellingPrice") and r.get("listPrice")]
    return dict(n=n,price=med(sale),avg=(sum(sale)/len(sale)) if sale else None,ppsf=med(ppsf),dom=med(dom),over=(100*sum(1 for x in ratio if x>1.0)/len(ratio)) if ratio else None,
                pct=(100*sum(ratio)/len(ratio)) if ratio else None,vol=sum(sale))
def usdM(v): return "—" if v is None else (f"{v/1e6:.2f}M" if v>=995000 else f"{v/1e3:.0f}K")
def usd(v): return "—" if v is None else f"{v:,.0f}"
def i(v): return "—" if v is None else f"{v:,.0f}"
def pct1(v): return "—" if v is None else f"{v:.0f}"
def d_pct(c,p):
    if c is None or p is None or p==0: return ("—",MUTED)
    d=100*(c-p)/p; return (f"{d:+.0f}%", UP if d>=0 else DOWN)
def d_abs(c,p,unit=""):
    if c is None or p is None: return ("—",MUTED)
    d=c-p; return (f"{d:+,.0f}{unit}", UP if d<=0 else DOWN) if unit=="d" else (f"{d:+.0f}{unit}", UP if d>=0 else DOWN)
def d_int(c,p):
    if c is None or p is None: return ("—",MUTED)
    d=c-p; return (f"{d:+,}", UP if d>=0 else DOWN)
def last_full_month(F):
    latest=max(r["sellingDate"] for r in F if r.get("sellingDate"))
    y,m=int(latest[:4]),int(latest[5:7])
    first=datetime.date(y,m,1)-datetime.timedelta(days=1)   # last day of prior month
    return first.replace(day=1), first

def build(anchor=None):
    d=json.load(open(SRC)); F=[f["properties"] for f in d["features"]]
    for r in F: r["nb"]=N2A.get(FIX.get(r.get("neighborhood") or "", r.get("neighborhood") or ""))
    mf,mt = last_full_month(F) if anchor is None else anchor
    yf = datetime.date(mt.year,1,1)
    P = lambda a,b: (a.isoformat(), b.isoformat())
    W = {"m1":P(mf,mt), "m0":P(mf.replace(year=mf.year-1),mt.replace(year=mt.year-1)),
         "y1":P(yf,mt), "y0":P(yf.replace(year=yf.year-1),mt.replace(year=mt.year-1))}
    mlab=mt.strftime("%b %y").replace(" 2"," 2"); 
    labels={"m1":mt.strftime("%b %y"),"m0":mt.replace(year=mt.year-1).strftime("%b %y"),
            "y1":f"YTD {str(mt.year)[2:]}","y0":f"YTD {str(mt.year-1)[2:]}"}
    plabel=(f"Month: {mf.strftime('%b %-d')} \u2013 {mt.strftime('%b %-d, %Y')} vs {mt.replace(year=mt.year-1).strftime('%b %Y')}"
            f"   \u00b7   Year to date: {yf.strftime('%b %-d')} \u2013 {mt.strftime('%b %-d, %Y')} vs same period {mt.year-1}")
    inw=lambda r,w: r.get("sellingDate") and w[0]<=r["sellingDate"]<=w[1]
    pages=[]
    for seg,types in SEG.items():
        rows=[r for r in F if r.get("propType") in types]
        S={k:[r for r in rows if inw(r,w)] for k,w in W.items()}
        byA=[]
        for a in AREAS:
            st={k:stats([r for r in S[k] if r["nb"]==a]) for k in W}
            if sum(st[k]["n"] for k in W)==0: continue
            byA.append((a,st))
        byA.sort(key=lambda t:-(t[1]["y1"]["price"] or 0))
        byZ=[(zn,col,rng,{k:stats([r for r in S[k] if zone_of(r.get("fogHours"))==zn]) for k in W}) for zn,col,rng,_ in ZONES]
        tot={k:stats(S[k]) for k in W}
        pages.append((seg,byA,tot,byZ))
    return pages,plabel,labels,W

def render(pages,plabel,labels,W,run_date):
    css=f"""
    @page {{ size: letter landscape; margin: 0.32in 0.35in; }}
    body {{ margin:0; font-family: Helvetica, Arial, sans-serif; color:{INK}; }}
    .page {{ width: 10.3in; height: 7.6in; page-break-after: always; position: relative; background:#fff; box-sizing: border-box; }}
    .hdr {{ display:flex; align-items:flex-end; justify-content:space-between; border-bottom: 3px solid {GOLD_MID}; padding-bottom:4px; margin-bottom:4px; }}
    .hdr .t {{ font-size:19px; font-weight:800; color:{NAV}; letter-spacing:-0.3px; }}
    .hdr .p {{ font-size:10.5px; color:{NAV}; margin-top:3px; }}
    .hdr .p b {{ color:{GOLD}; }}
    .hdr .s {{ font-size:8.5px; color:{MUTED}; margin-top:2px; }}
    .hdr .seg {{ font-size:12.5px; font-weight:800; color:{GOLD}; background:{GOLD_LT}; padding:5px 12px; border-radius:6px; white-space:nowrap; }}
    table {{ border-collapse:collapse; width:100%; font-size:7.3px; table-layout:fixed; }}
    th, td {{ padding: 1.1px 1.5px; text-align:right; white-space:nowrap; overflow:hidden; }}
    col.nm {{ width:13.4%; }}
    thead tr.g th {{ background:{NAV}; color:#fff; font-size:7.2px; letter-spacing:0.2px; text-transform:uppercase; border-left:2px solid #fff; text-align:center; padding:3px 2px; }}
    thead tr.g th.name {{ text-align:left; border-left:none; }}
    thead tr.g th u {{ display:block; font-size:6.6px; font-weight:400; letter-spacing:0; text-transform:none; opacity:0.75; text-decoration:none; }}
    thead tr.sub th {{ background:{NAV_LT}; color:{NAV}; font-size:6.6px; border-bottom:1.5px solid {NAV}; font-weight:700; }}
    thead tr.sub th.ytd {{ color:{GOLD}; }}
    tbody td.name, tfoot td.name {{ text-align:left; font-weight:600; overflow:hidden; text-overflow:ellipsis; }}
    tbody tr:nth-child(even) td {{ background:#faf9f7; }}
    tbody td {{ border-bottom:0.4px solid {LINE}; }}
    td.g0, th.g0 {{ border-left:2px solid #cfc9c0; }}
    td.g2 {{ border-left:0.8px dotted #cfc9c0; }}
    td.cur {{ font-weight:700; }}
    td.pri {{ color:{MUTED}; }}
    tfoot td {{ background:{GOLD_LT}; color:{INK}; font-weight:800; border-top:2px solid {GOLD_MID}; border-bottom:2px solid {GOLD_MID}; font-size:7.6px; }}
    .zh {{ font-size:10px; font-weight:800; color:{NAV}; margin:5px 0 2px; }}
    .zh span {{ font-weight:400; font-size:8px; color:{MUTED}; }}
    table.zone tbody td {{ background:#fbfaf8; font-size:7.8px; padding:2.2px 1.5px; }}
    table.zone tbody tr:last-child td {{ border-bottom:0.4px solid {LINE}; }}
    table.zone tfoot td {{ font-size:7.8px; padding:2.2px 1.5px; }}
    table.zone tbody td.name {{ font-weight:700; }}
    .chip {{ display:inline-block; width:9px; height:9px; border-radius:2px; border:0.5px solid #a8a29e; margin-right:4px; vertical-align:-1px; }}
    .rng {{ color:{MUTED}; font-weight:400; font-size:7.4px; }}
    .legend {{ font-size:7.2px; color:{MUTED}; margin-top:4px; line-height:1.35; }}
    .foot {{ position:absolute; bottom:0; left:0; right:0; font-size:7.2px; color:{MUTED}; border-top:0.5px solid {LINE}; padding-top:3px; display:flex; justify-content:space-between; }}
    """
    groups=[("Qty Sold","","int","n"),("Median Sale Price","M / K","usdM","price"),("Average Sale Price","M / K","usdM","avg"),("Median $/SF","","usd","ppsf"),
            ("Median DOM","days","dom","dom"),("% Sold Over List","","pts","over"),("% SP/LP","","pts","pct")]
    F={"int":i,"usdM":usdM,"usd":usd,"dom":i,"pts":pct1}
    def cells(st,kind,key):
        out=[]
        for j,k in enumerate(("m1","m0","y1","y0")):
            v=st[k][key]; prior=st["m0" if k=="m1" else "y0"][key] if k in("m1","y1") else None
            cls="cur" if k in("m1","y1") else "pri"
            edge=" g0" if j==0 else (" g2" if j==2 else "")
            col=""
            if prior is not None and v is not None:
                better = (v<prior) if kind=="dom" else (v>prior)
                if v!=prior: col=f"color:{UP if better else DOWN};"
            out.append(f"<td class='{cls}{edge}' style='{col}'>{F[kind](v)}</td>")
        return "".join(out)
    def head():
        h="<colgroup><col class='nm'>"+"<col>"*28+"</colgroup><thead><tr class='g'><th class='name'>Neighborhood</th>"
        h+="".join(f"<th colspan='4'>{g}{('<u>'+u+'</u>') if u else ''}</th>" for g,u,_,_ in groups)+"</tr><tr class='sub'><th></th>"
        h+="".join(f"<th class='g0'>{labels['m1']}</th><th>{labels['m0']}</th><th class='ytd g2'>{labels['y1']}</th><th class='ytd'>{labels['y0']}</th>" for _ in groups)
        return h+"</tr></thead>"
    out=[f"<!doctype html><html><head><meta charset='utf-8'><style>{css}</style></head><body>"]
    for pi,(seg,byA,tot,byZ) in enumerate(pages):
        out.append(f"<div class='page'><div class='hdr'><div><div class='t'>San Francisco Market Grid</div>"
                   f"<div class='p'>{html.escape(plabel)}</div>"
                   f"<div class='s'>Closed sales, SFAR MLS &nbsp;\u00b7&nbsp; run {run_date.strftime('%b %-d, %Y')}</div></div>"
                   f"<div class='seg'>{html.escape(seg)}</div></div>")
        out.append("<div class='zh'>Closings by Microclimate Fog Zone <span>summer fog hours per day at the property, from the site's fog-contour layer</span></div>")
        out.append("<table class='zone'>"+head().replace("<th class='name'>Neighborhood</th>","<th class='name'>Fog Zone</th>")+"<tbody>")
        for zn,col,rng,st in byZ:
            out.append(f"<tr><td class='name'><span class='chip' style='background:{col}'></span>{html.escape(zn)} <span class='rng'>{html.escape(rng)}</span></td>"
                       +"".join(cells(st,kind,key) for _,_,kind,key in groups)+"</tr>")
        out.append("</tbody><tfoot><tr><td class='name'>Total \u2014 all zones</td>"
                   +"".join(cells(tot,kind,key) for _,_,kind,key in groups)+"</tr></tfoot></table>")
        out.append("<div class='zh'>Closings by Neighborhood</div>")
        out.append("<table>"+head()+"<tbody>")
        for a,st in byA:
            small="*" if st["y1"]["n"]<10 else ""
            out.append(f"<tr><td class='name'>{html.escape(a)}{small}</td>"+"".join(cells(st,kind,key) for _,_,kind,key in groups)+"</tr>")
        out.append("</tbody><tfoot><tr><td class='name'>All areas (pooled)</td>"+"".join(cells(tot,kind,key) for _,_,kind,key in groups)+"</tr></tfoot></table>")
        out.append("<div class='legend'>Median and average sale prices in millions (M) or thousands (K); $/SF and DOM as whole numbers; list-price columns are percentages. "
                   "Current-period figures are bold and colored against the same period a year earlier \u2014 green better, red worse (for DOM, fewer days is better). "
                   "Prior-year columns in grey. * fewer than 10 YTD sales \u2014 read with care. Sorted by YTD median price. Totals are pooled medians (the median of every sale, not an average of area medians).</div>")
        out.append(f"<div class='foot'><span>Source: SFAR MLS via BrokerMetrics, closed sales only (Closed + Sold Off MLS). Data through {W['m1'][1]}. Deemed reliable, not guaranteed.</span>"
                   f"<span>Chuck Heaver \u00b7 Vanguard Properties \u00b7 page {pi+8} / 9</span></div></div>")
    out.append("</body></html>")
    return "".join(out)

if __name__=="__main__":
    import sys
    run=datetime.date(2026,9,14)
    pages,plabel,labels,W=build()
    open(os.path.join(HERE,"out","market-grid-v2.html"),"w").write(render(pages,plabel,labels,W,run))
    print("windows:",W)
    for seg,byA,tot,byZ in pages:
        print(f"{seg}: {len(byA)} areas | month {tot['m1']['n']} vs {tot['m0']['n']} | ytd {tot['y1']['n']} vs {tot['y0']['n']}")
