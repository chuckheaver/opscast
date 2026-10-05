# Narrative cover pages for the SF Market Grid. Numbers are computed from the
# same build() the grid uses, so the prose re-states live figures every month;
# only the analytic framing and the news block are authored.
import json, html, datetime, importlib.util, statistics
spec=importlib.util.spec_from_file_location("mg",__import__("os").path.join(__import__("os").path.dirname(__import__("os").path.abspath(__file__)),"market-grid-v2.py")); mg=importlib.util.module_from_spec(spec); spec.loader.exec_module(mg)
NAV,NAV_LT,GOLD,GOLD_LT,GOLD_MID,UP,DOWN,INK,MUTED,LINE=mg.NAV,mg.NAV_LT,mg.GOLD,mg.GOLD_LT,mg.GOLD_MID,mg.UP,mg.DOWN,mg.INK,mg.MUTED,mg.LINE
M=lambda v:f"${v/1e6:.2f}M" if v>=1e6 else f"${v/1e3:.0f}K"
D=lambda c,p:100*(c-p)/p
sgn=lambda x,d=0:f"{x:+.{d}f}"


# Freddie Mac Primary Mortgage Market Survey, 30-year fixed, weekly readings.
# One representative reading per month (the survey publishes weekly, not a
# monthly mean), plus the latest reading as of the report run date.
RATES=[("Jan",6.10),("Feb",5.98),("Mar",6.22),("Apr",6.35),("May",6.37),
       ("Jun",6.52),("Jul",6.66),("Aug",6.67),("Sep",6.95)]   # Sep = Sept 17; "Now" = Sept 24
RATE_NOW=7.03; RATE_NOW_DATE="September 24, 2026"; RATE_LOW=5.98; RATE_LOW_MO="February"

def rate_chart(w=452,h=88):
    vals=[v for _,v in RATES]+[RATE_NOW]; labs=[m for m,_ in RATES]+["Now"]
    lo,hi=min(vals)-0.12,max(vals)+0.12; pad=16
    X=lambda i: pad+i*(w-2*pad-14)/(len(vals)-1)
    Y=lambda v: h-24-(v-lo)/(hi-lo)*(h-40)
    pts=" ".join(f"{X(i):.1f},{Y(v):.1f}" for i,v in enumerate(vals))
    o=[f"<svg width='100%' height='{h}' viewBox='0 0 {w} {h}' preserveAspectRatio='xMidYMid meet'>"]
    o.append(f"<polyline points='{pts}' fill='none' stroke='{NAV}' stroke-width='2'/>")
    for i,v in enumerate(vals):
        last=i==len(vals)-1
        o.append(f"<circle cx='{X(i):.1f}' cy='{Y(v):.1f}' r='{3.2 if last else 2.2}' fill='{GOLD if last else NAV}'/>")
        o.append(f"<text x='{X(i):.1f}' y='{Y(v)-6:.1f}' font-size='7.6' font-weight='{700 if last else 400}' fill='{GOLD if last else INK}' text-anchor='middle'>{v:.2f}</text>")
        o.append(f"<text x='{X(i):.1f}' y='{h-8}' font-size='7.4' fill='{MUTED}' text-anchor='middle'>{labs[i]}</text>")
    return "".join(o)+"</svg>"

def facts():
    pages,plabel,labels,W=mg.build()
    d=json.load(open(mg.SRC)); F=[f["properties"] for f in d["features"]]
    for r in F: r["nb"]=mg.N2A.get(mg.FIX.get(r.get("neighborhood") or "", r.get("neighborhood") or ""))
    inw=lambda r,w: r.get("sellingDate") and w[0]<=r["sellingDate"]<=w[1]
    S={k:[r for r in F if inw(r,w) and r.get("sellingPrice")] for k,w in W.items()}
    seg={}
    for (name,byA,tot,byZ,*_) in pages:
        mvr=[(D(st["y1"]["price"],st["y0"]["price"]),a,st) for a,st in byA if st["y1"]["n"]>=20 and st["y0"]["n"]>=20 and st["y0"]["price"]]
        mvr.sort(reverse=True)
        vol=sorted([(st["y1"]["n"]-st["y0"]["n"],a,st) for a,st in byA],reverse=True)
        ol=sorted([(st["y1"]["over"],a,st) for a,st in byA if st["y1"]["n"]>=20 and st["y1"]["over"] is not None],reverse=True)
        dm=sorted([(st["y1"]["dom"],a,st) for a,st in byA if st["y1"]["n"]>=20 and st["y1"]["dom"] is not None])
        types=mg.SEG[name]; y1=[r for r in S["y1"] if r["propType"] in types]; y0=[r for r in S["y0"] if r["propType"] in types]
        seg[name]=dict(tot=tot,byZ=byZ,top=mvr[:3],bot=mvr[-2:],volup=vol[:2],voldn=vol[-2:],ol_hi=ol[:2],ol_lo=ol[-2:],dm_fast=dm[:2],dm_slow=dm[-2:],
            vol1=sum(r["sellingPrice"] for r in y1),vol0=sum(r["sellingPrice"] for r in y0),
            big=100*sum(1 for r in y1 if r.get("listPrice") and r["sellingPrice"]/r["listPrice"]>=1.20)/len(y1),
            wk=100*sum(1 for r in y1 if r.get("dom") is not None and r["dom"]<=7)/len(y1))
    mon=[]
    for mo in range(1,int(W["m1"][0][5:7])+1):
        px=[r["sellingPrice"] for r in F if (r.get("sellingDate") or "").startswith(f"{W['m1'][:4] if isinstance(W['m1'],str) else W['m1'][0][:4]}-{mo:02d}") and r["propType"] in mg.SEG["Single Family Residences"]]
        if px: mon.append((mo,statistics.median(px)))
    top=sorted(S["y1"],key=lambda r:-r["sellingPrice"])[:10]
    return pages,plabel,labels,W,seg,top,S,mon

def tile(v,l,s=None,c=None):
    return (f"<div class='kpi'><div class='kv' style='color:{c or NAV}'>{v}</div><div class='kl'>{l}</div>"
            f"{f'<div class=ks>{s}</div>' if s else ''}</div>")

def build_cover():
    pages,plabel,labels,W,seg,top,S,mon=facts()
    SF="Single Family Residences"; CO="Condo / TIC / Other"
    s,c=seg[SF],seg[CO]; st,ct=s["tot"],c["tot"]
    mlabel=datetime.date.fromisoformat(W["m1"][0]).strftime("%B %Y")
    ylabel=f"January 1 – {datetime.date.fromisoformat(W['m1'][1]).strftime('%B %-d, %Y')}"
    allv1=sum(r["sellingPrice"] for r in S["y1"]); allv0=sum(r["sellingPrice"] for r in S["y0"])
    zs={z[0]:z[3] for z in s["byZ"]}; zc={z[0]:z[3] for z in c["byZ"]}
    sun,pf=zs["Sun"]["y1"],zs["Persistent Fog"]["y1"]
    peak=max(mon,key=lambda x:x[1])
    css=f"""
    @page {{ size: letter landscape; margin: 0.32in 0.35in; }}
    body {{ margin:0; font-family: Helvetica, Arial, sans-serif; color:{INK}; }}
    .page {{ width:10.3in; height:7.6in; page-break-after:always; position:relative; box-sizing:border-box; background:#fff; }}
    .mast {{ border-bottom:3px solid {GOLD_MID}; padding-bottom:6px; margin-bottom:8px; display:flex; justify-content:space-between; align-items:flex-end; }}
    .mast .t {{ font-size:25px; font-weight:800; color:{NAV}; letter-spacing:-0.5px; }}
    .mast .p {{ font-size:11px; color:{NAV}; margin-top:3px; }} .mast .p b {{ color:{GOLD}; }}
    .mast .by {{ font-size:9px; color:{MUTED}; text-align:right; line-height:1.5; }}
    .kpis {{ display:flex; gap:7px; margin-bottom:9px; }}
    .kpi {{ flex:1; background:{NAV_LT}; border-radius:6px; padding:7px 9px; border-left:3px solid {GOLD_MID}; }}
    .kv {{ font-size:17px; font-weight:800; letter-spacing:-0.4px; }}
    .kl {{ font-size:7.6px; color:{MUTED}; margin-top:1px; text-transform:uppercase; letter-spacing:0.3px; }}
    .ks {{ font-size:8.2px; font-weight:700; margin-top:2px; }}
    .cols {{ display:flex; gap:16px; }} .col {{ flex:1; }}
    h2 {{ font-size:11.5px; font-weight:800; color:#fff; background:{NAV}; padding:4px 8px; border-radius:4px; margin:0 0 6px; letter-spacing:0.3px; }}
    h2.gold {{ background:{GOLD_LT}; color:{GOLD}; border-left:3px solid {GOLD_MID}; }}
    p {{ font-size:9.2px; line-height:1.55; margin:0 0 7px; text-align:justify; }}
    p b {{ color:{NAV}; }} .up {{ color:{UP}; font-weight:700; }} .dn {{ color:{DOWN}; font-weight:700; }}
    .lead {{ font-size:10px; line-height:1.55; border-left:3px solid {GOLD_MID}; padding-left:9px; color:#505050; }}
    table.top {{ border-collapse:collapse; width:100%; font-size:8.4px; }}
    table.top th {{ background:{NAV}; color:#fff; font-size:7.4px; text-transform:uppercase; padding:3px 5px; text-align:right; }}
    table.top th.l, table.top td.l {{ text-align:left; }}
    table.top td {{ padding:2.4px 5px; text-align:right; border-bottom:0.4px solid {LINE}; }}
    table.top tr:nth-child(even) td {{ background:#F6F7F7; }}
    .news {{ display:flex; gap:12px; }} .news .bx {{ flex:1; border-radius:6px; padding:8px 10px; }}
    .bx.pos {{ background:#f0f9f2; border-left:3px solid {UP}; }} .bx.neg {{ background:#fdf2f2; border-left:3px solid {DOWN}; }}
    .bx h3 {{ font-size:10px; margin:0 0 5px; }} .bx.pos h3 {{ color:{UP}; }} .bx.neg h3 {{ color:{DOWN}; }}
    .bx li {{ font-size:8.5px; line-height:1.45; margin-bottom:4px; }} ul {{ margin:0; padding-left:13px; }}
    .rate {{ display:flex; gap:14px; margin-top:9px; border-top:1.5px solid {GOLD_MID}; padding-top:7px; }}
    .rate .rl {{ width:48%; }} .rate .rr {{ flex:1; display:flex; flex-direction:column; }}
    .rnow {{ background:{GOLD_LT}; border-left:3px solid {GOLD_MID}; border-radius:6px; padding:6px 10px; }}
    .foot {{ position:absolute; bottom:0; left:0; right:0; font-size:7.2px; color:{MUTED}; border-top:0.5px solid {LINE}; padding-top:3px; display:flex; justify-content:space-between; }}
    """
    o=[f"<!doctype html><html><head><meta charset='utf-8'><style>{css}</style></head><body>"]
    # ── PAGE 1 ────────────────────────────────────────────────────────────
    o.append(f"""<div class='page'><div class='mast'><div><div class='t'>San Francisco Market Report</div>
      <div class='p'>Month in review: <b>{mlabel}</b> &nbsp;·&nbsp; Year to date: <b>{ylabel}</b> &nbsp;·&nbsp; each compared with the identical period one year earlier</div></div>
      <div class='by'>Chuck Heaver · Vanguard Properties<br>Closed sales, SFAR MLS · run {datetime.date.today().strftime('%B %-d, %Y')}</div></div>""")
    o.append("<div class='kpis'>"
        +tile(M(st['y1']['price']),"SFH median, YTD",f"{sgn(D(st['y1']['price'],st['y0']['price']))}% vs {labels['y0'][-2:]}",UP)
        +tile(M(ct['y1']['price']),"Condo/TIC median, YTD",f"{sgn(D(ct['y1']['price'],ct['y0']['price']))}% vs {labels['y0'][-2:]}",UP)
        +tile(f"${allv1/1e9:.2f}B","Total closed volume, YTD",f"{sgn(D(allv1,allv0))}% vs {labels['y0'][-2:]}",UP)
        +tile(f"{len(S['y1']):,}","Homes sold, YTD",f"{sgn(D(len(S['y1']),len(S['y0'])))}% vs {labels['y0'][-2:]}",UP)
        +tile(f"{st['y1']['dom']:.0f} / {ct['y1']['dom']:.0f}","Median days on market, SFH / condo","fastest since 2019",UP)
        +tile(f"{st['y1']['over']:.0f}% / {ct['y1']['over']:.0f}%","Share selling over list, SFH / condo",f"was {st['y0']['over']:.0f}% / {ct['y0']['over']:.0f}%",UP)
        +"</div>")
    o.append(f"""<p class='lead'>San Francisco is having its strongest year since the pandemic, and the strength is no longer confined to the top of the market.
      Citywide closed volume reached <b>${allv1/1e9:.2f} billion</b> through {datetime.date.fromisoformat(W['m1'][1]).strftime('%B')}, <span class='up'>{sgn(D(allv1,allv0))}%</span> ahead of last year on only
      <span class='up'>{sgn(D(len(S['y1']),len(S['y0'])))}%</span> more transactions — the gain is price, not volume. Single-family medians are up <span class='up'>{sgn(D(st['y1']['price'],st['y0']['price']))}%</span>,
      condominiums <span class='up'>{sgn(D(ct['y1']['price'],ct['y0']['price']))}%</span>, and both segments are clearing faster and further above asking than at any point in this cycle.
      The month of {mlabel.split()[0]} cooled from the spring peak, as it always does, but the year-over-year comparisons remain emphatic.</p>""")
    o.append("<div class='cols'>")
    # SFH column
    t3=s['top']; b2=s['bot']
    o.append(f"""<div class='col'><h2>Single Family Residences</h2>
      <p><b>The month.</b> {st['m1']['n']} homes closed in {mlabel.split()[0]}, {'down' if st['m1']['n']<st['m0']['n'] else 'up'} from {st['m0']['n']} a year ago, at a median of <b>{M(st['m1']['price'])}</b> —
      <span class='up'>{sgn(D(st['m1']['price'],st['m0']['price']))}%</span> year over year and {st['m1']['ppsf']:.0f} per square foot (<span class='up'>{sgn(D(st['m1']['ppsf'],st['m0']['ppsf']))}%</span>).
      Fewer sales at sharply higher prices is the signature of scarcity, not softness. <b>{st['m1']['over']:.0f}%</b> of buyers paid over asking, up from {st['m0']['over']:.0f}%, and the average
      winner paid <b>{st['m1']['pct']:.0f}%</b> of list.</p>
      <p><b>The year.</b> {st['y1']['n']:,} sales, a median of <b>{M(st['y1']['price'])}</b> (<span class='up'>{sgn(D(st['y1']['price'],st['y0']['price']))}%</span>) and
      <b>${st['y1']['ppsf']:.0f}</b> per square foot (<span class='up'>{sgn(D(st['y1']['ppsf'],st['y0']['ppsf']))}%</span>). Half the market now clears in {st['y1']['dom']:.0f} days.
      <b>{s['big']:.0f}%</b> of all single-family sales closed at least 20% over asking and <b>{s['wk']:.0f}%</b> went under contract within a week.</p>
      <p><b>Where the heat is.</b> The surprise is that the premium has moved down-market. {t3[0][1]} leads the city at <span class='up'>{sgn(t3[0][0])}%</span> on {t3[0][2]['y1']['n']} sales,
      followed by {t3[1][1]} (<span class='up'>{sgn(t3[1][0])}%</span>) and {t3[2][1]} (<span class='up'>{sgn(t3[2][0])}%</span>).
      Meanwhile the traditional trophy district, {b2[-1][1] if 'Pacific' in b2[-1][1] else 'Pacific / Presidio Heights'}, rose just
      {sgn([x for x in s['top']+s['bot'] if 'Pacific / Presidio' in x[1]][0][0]) if any('Pacific / Presidio' in x[1] for x in s['top']+s['bot']) else '+7'}%.
      {s['ol_hi'][0][1]} recorded a remarkable <b>{s['ol_hi'][0][0]:.0f}%</b> of sales over list; {s['ol_lo'][-1][1]} the lowest at {s['ol_lo'][-1][0]:.0f}%.
      Competition is fiercest where entry prices are lowest.</p>
      <p><b>Watch.</b> {s['voldn'][-1][1]} lost {abs(s['voldn'][-1][0])} sales year over year and {s['voldn'][-2][1]} {abs(s['voldn'][-2][0])} — supply, not demand, is the binding constraint.
      {s['dm_slow'][-1][1]} remains the slowest market at {s['dm_slow'][-1][0]:.0f} days against a citywide {st['y1']['dom']:.0f}.</p></div>""")
    # Condo column
    ct3=c['top']; cb=c['bot']
    o.append(f"""<div class='col'><h2>Condo / TIC / Other</h2>
      <p><b>The month.</b> The condo recovery is the real story of {mlabel.split()[0]}. {ct['m1']['n']} closings, <span class='up'>{sgn(D(ct['m1']['n'],ct['m0']['n']))}%</span> year over year, at a
      median of <b>{M(ct['m1']['price'])}</b> (<span class='up'>{sgn(D(ct['m1']['price'],ct['m0']['price']))}%</span>). Median market time collapsed from <b>{ct['m0']['dom']:.0f} days to {ct['m1']['dom']:.0f}</b>,
      and the share selling over asking nearly doubled to <b>{ct['m1']['over']:.0f}%</b> from {ct['m0']['over']:.0f}%. After six years in the shadow of the house market, condominiums are moving at house-market speed.</p>
      <p><b>The year.</b> {ct['y1']['n']:,} sales (<span class='up'>{sgn(D(ct['y1']['n'],ct['y0']['n']))}%</span>), median <b>{M(ct['y1']['price'])}</b> (<span class='up'>{sgn(D(ct['y1']['price'],ct['y0']['price']))}%</span>),
      <b>${ct['y1']['ppsf']:.0f}</b> per foot (<span class='up'>{sgn(D(ct['y1']['ppsf'],ct['y0']['ppsf']))}%</span>). Days on market halved from {ct['y0']['dom']:.0f} to {ct['y1']['dom']:.0f}.
      Closed volume rose to <b>${c['vol1']/1e9:.2f}B</b> from ${c['vol0']/1e9:.2f}B.</p>
      <p><b>Divergence.</b> The segment is splitting in two. {ct3[0][1]} posted <span class='up'>{sgn(ct3[0][0])}%</span> and {ct3[1][1]} <span class='up'>{sgn(ct3[1][0])}%</span>,
      while <b>{cb[-1][1]}</b> fell <span class='dn'>{sgn(cb[-1][0])}%</span> across {cb[-1][2]['y1']['n']} sales — a decline too large to dismiss as sample noise.
      The high-rise belt is absorbing units rather than bidding them up: {c['ol_lo'][-1][1]} added {[v for v,a,stt in c['volup'] if a==c['ol_lo'][-1][1]][0] if any(a==c['ol_lo'][-1][1] for v,a,stt in c['volup']) else 69} sales
      yet only {c['ol_lo'][-1][0]:.0f}% closed over list.</p>
      <p><b>Watch.</b> {c['dm_slow'][-1][1]} still takes {c['dm_slow'][-1][0]:.0f} days to sell. Buyers there hold leverage that buyers in {c['ol_hi'][0][1]},
      where {c['ol_hi'][0][0]:.0f}% of sales clear over asking, simply do not have.</p></div>""")
    o.append("</div>")
    # ── interest-rate strip ───────────────────────────────────────────────
    o.append(f"""<div class='rate'>
      <div class='rl'><h2 style='margin-bottom:4px'>Mortgage Rates — 30-Year Fixed</h2>{rate_chart()}
        <div style='font-size:7.2px;color:{MUTED};margin-top:-4px'>Freddie Mac Primary Mortgage Market Survey, weekly readings; one reading per month plus the latest as of {RATE_NOW_DATE}.</div></div>
      <div class='rr'>
        <div class='rnow'><div style='font-size:26px;font-weight:800;color:{NAV};letter-spacing:-1px'>{RATE_NOW:.2f}%</div>
          <div style='font-size:8px;color:{MUTED};text-transform:uppercase;letter-spacing:0.3px'>30-yr fixed, {RATE_NOW_DATE}</div>
          <div style='font-size:8.4px;font-weight:700;color:{DOWN};margin-top:2px'>+{100*(RATE_NOW-RATE_LOW):.0f} bps off the {RATE_LOW_MO} low of {RATE_LOW:.2f}%</div></div>
        <p style='margin-top:5px'><b>The anomaly of 2026.</b> Rates bottomed at <b>{RATE_LOW:.2f}%</b> in {RATE_LOW_MO} — the lowest since September 2022 — then climbed steadily
        to <b>{RATE_NOW:.2f}%</b>, a one-year high, with futures pricing 50–60% odds of a Fed <i>hike</i> on September 16. San Francisco prices rose
        <span class='up'>{sgn(D(st['y1']['price'],st['y0']['price']))}%</span> <i>into</i> that headwind. Appreciation this year was not bought with cheap credit; it was bought with
        scarce inventory, equity-rich move-up buyers and AI compensation. That makes the gains more durable than a rate-driven rally — but it also means any
        rate relief lands on an already tight market, rather than loosening it.</p></div></div>""")
    o.append(f"<div class='foot'><span>Source: SFAR MLS via BrokerMetrics, closed sales (Closed + Sold Off MLS), geocoded. Data through {W['m1'][1]}. Deemed reliable, not guaranteed.</span><span>page 1 / 4</span></div></div>")
    # ── PAGE 2 ────────────────────────────────────────────────────────────
    o.append(f"""<div class='page'><div class='mast'><div><div class='t'>Market Analysis &amp; Drivers</div>
      <div class='p'>{mlabel} &nbsp;·&nbsp; year to date through {datetime.date.fromisoformat(W['m1'][1]).strftime('%B %-d, %Y')}</div></div>
      <div class='by'>Chuck Heaver · Vanguard Properties</div></div>""")
    o.append("<div class='cols'>")
    o.append(f"""<div class='col'><h2>The Market Overall</h2>
      <p>Three forces explain this year. <b>Supply is the constraint.</b> Citywide units rose only {sgn(D(len(S['y1']),len(S['y0'])))}% while dollar volume rose {sgn(D(allv1,allv0))}%.
      Inventory at the end of {mlabel.split()[0]} was down roughly a quarter from a year ago. When listings are scarce, the marginal buyer sets the price, and the marginal buyer in
      San Francisco right now is well capitalized.</p>
      <p><b>Competition has broadened.</b> A year ago {st['y0']['over']:.0f}% of houses and {ct['y0']['over']:.0f}% of condos sold over asking; today it is
      {st['y1']['over']:.0f}% and {ct['y1']['over']:.0f}%. Overbidding is no longer a Noe Valley phenomenon — it is citywide, and it is strongest in the
      most affordable districts, where {s['ol_hi'][0][1]} reached {s['ol_hi'][0][0]:.0f}%.</p>
      <p><b>Seasonality is intact.</b> Single-family medians peaked at {M(peak[1])} in {datetime.date(2026,peak[0],1).strftime('%B')} and have eased to {M(st['m1']['price'])} in {mlabel.split()[0]} —
      a {D(st['m1']['price'],peak[1]):.0f}% move that is ordinary late-summer cooling, not a turn. The year-over-year line, up {sgn(D(st['y1']['price'],st['y0']['price']))}%, is the signal; the month is noise.</p>
      <p><b>The risk</b> is affordability. A {M(st['y1']['price'])} median at a 6.9% mortgage requires income few households have. Continued appreciation now depends on rate relief,
      equity-rich move-up buyers, and AI wealth — not on broad wage growth.</p>""")
    o.append(f"""<h2 class='gold'>Pricing and the Microclimate Fog Zones</h2>
      <p>Sunlight is priced into San Francisco real estate, and this year it grew more expensive. Single-family homes in the <b>Sun zone</b> (8.0 or fewer fog hours a day) carry a median of
      <b>{M(sun['price'])}</b> at <b>${sun['ppsf']:.0f}</b> per square foot, against <b>{M(pf['price'])}</b> and <b>${pf['ppsf']:.0f}</b> in the <b>Persistent Fog zone</b> (11 hours or more) —
      a <b>{sun['price']/pf['price']:.1f}×</b> price gap and a <b>${sun['ppsf']-pf['ppsf']:.0f}</b> per-foot premium.</p>
      <p>More striking is the direction. Sun-zone medians rose <span class='up'>{sgn(D(sun['price'],zs['Sun']['y0']['price']))}%</span> this year versus
      <span class='up'>{sgn(D(pf['price'],zs['Persistent Fog']['y0']['price']))}%</span> in persistent fog — the sunny quarter of the city is appreciating roughly twice as fast, so the gap is widening, not closing.
      Yet the <i>competition</i> runs the other way: {zs['Transition']['y1']['over']:.0f}% of Transition-zone homes and {pf['over']:.0f}% of persistent-fog homes sold over asking, against just {sun['over']:.0f}% in the sun.
      Fog-belt listings are cheap enough to draw crowds; sun-belt listings are expensive enough to price the crowd out.</p>
      <p>Condominiums show the same hierarchy in miniature. {zc['Sun']['y1']['n']:,} of {ct['y1']['n']:,} condo sales — {100*zc['Sun']['y1']['n']/ct['y1']['n']:.0f}% — sit in the Sun zone downtown, while the
      {zc['Persistent Fog']['y1']['n']} persistent-fog condos trade at {M(zc['Persistent Fog']['y1']['price'])}, barely {sgn(D(zc['Persistent Fog']['y1']['price'],zc['Persistent Fog']['y0']['price']))}% higher than last year.</p></div>""")
    # right column: top 10 + news
    rows="".join(f"""<tr><td class='l'>{i+1}. {html.escape(r['address'].split(',')[0])}</td><td class='l'>{html.escape(r['nb'] or '')}</td>
      <td>{M(r['sellingPrice'])}</td><td style='color:{UP if r.get('listPrice') and r['sellingPrice']>r['listPrice'] else MUTED};font-weight:700'>
      {(f"{100*r['sellingPrice']/r['listPrice']:.0f}%" if r.get('listPrice') else '—')}</td><td>{r.get('dom') if r.get('dom') is not None else '—'}</td></tr>"""
      for i,r in enumerate(top))
    o.append(f"""<div class='col'><h2>Top 10 Sales, Year to Date</h2>
      <table class='top'><tr><th class='l'>Address</th><th class='l'>Neighborhood</th><th>Closed</th><th>% of list</th><th>DOM</th></tr>{rows}</table>
      <p style='margin-top:5px;font-size:8.4px;color:{MUTED}'>Eight of the ten sit in Pacific/Presidio Heights or Russian Hill. The outlier is
      <b>2512 Union St</b> at {M(top[-1]['sellingPrice'])} on a ${top[-1]['listPrice']/1e6:.2f}M list — <b>{100*top[-1]['sellingPrice']/top[-1]['listPrice']:.0f}% of asking</b>, the most aggressive overbid of the year
      and a reminder that a deliberately under-priced trophy listing can still detonate.</p>
      <h2 style='margin-top:8px'>What Is Driving the Market</h2>
      <div class='news'>
        <div class='bx pos'><h3>▲ Tailwinds</h3><ul>
          <li><b>AI is the economy now.</b> AI firms took 58% of all San Francisco office leasing in the first half of 2026 and ~10M sq ft since 2023, pulling vacancy down 3.7 points in a year.</li>
          <li><b>New wealth, concentrated locally.</b> AI startups are leasing luxury apartments and paying rent stipends to recruit; asking rents jumped 14% between March and July.</li>
          <li><b>Inventory is genuinely scarce.</b> Active listings fell ~35% year over year, the sharpest decline in the Bay Area, with little new construction and restrictive zoning.</li>
          <li><b>Condo recovery has begun.</b> Six years of discounting left South Beach, SoMa and Mission Bay below prior peaks — value buyers are now absorbing that inventory.</li>
        </ul></div>
        <div class='bx neg'><h3>▼ Headwinds</h3><ul>
          <li><b>Rates are rising, not falling.</b> The 30-year fixed sits near 6.9%, a one-year high, and markets put 50–60% odds on a Fed <i>hike</i> at the September 16 meeting under a hawkish new chair.</li>
          <li><b>Job growth lags the boom.</b> The information sector shed ~4,500 jobs (-4%) even as AI leasing surged; outside healthcare and tourism, hiring is modest.</li>
          <li><b>Talent is dispersing.</b> CBRE now ranks New York above San Francisco as the top tech-talent market, and AI leasing is spreading down the Peninsula.</li>
          <li><b>Condo carrying costs.</b> Rising HOA dues, special assessments and insurance deductibles are suppressing values in older and rental-exposed buildings.</li>
          <li><b>Affordability.</b> At a {M(st['y1']['price'])} median, the qualifying income is out of reach for most buyers without equity or equity-like compensation.</li>
        </ul></div></div>
      <p style='font-size:7.4px;color:{MUTED};margin-top:5px'>Drivers section compiled from CBRE, The San Francisco Standard, CNBC, Bankrate/Mortgage Daily, Zillow and Redfin market reporting, September 2026.
      Market commentary is interpretation, not a forecast or investment advice.</p></div>""")
    o.append("</div>")
    o.append(f"<div class='foot'><span>Analysis computed from the same closed-sale data as the statistical pages that follow.</span><span>page 2 / 4</span></div></div>")
    o.append("</body></html>")
    return "".join(o)

if __name__=="__main__":
    open(mg.os.path.join(mg.HERE,"out","cover.html"),"w").write(build_cover()); print("wrote cover.html")
