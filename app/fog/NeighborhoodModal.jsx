'use client';

// Neighborhood highlights pop-up, opened from the Neighborhood name on the
// fog/neighborhoods card. Curated editorial content comes from
// lib/neighborhoods.js; the home-price figure (section 7) is computed live
// from the listings GeoJSON and the microclimate line (section 8) is
// derived from the picked fog contour, so neither goes stale.

import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { entryKeyFor } from "./lib/neighborhoods";
import { statsFor, slugify, money, ZONE_COLOR, statsYear } from "../neighborhoods/lib";

const LISTINGS_URL = "/data/sf-listings.geojson";
const RES_COUNTS_URL = "/data/parcel-res-by-neighborhood.json";
const CUR_YEAR = String(new Date().getFullYear()); // always the current calendar year

// Parcel-count rows for the "By the Numbers" section. The four residential
// bucket colors match the map's "Residential parcels (by units)" legend;
// OTHR (all non-residential parcels) gets a neutral grey.
const PARCEL_ROWS = [
  ["u1", "#7fb3dd", "1 Unit - SFH"],
  ["u2_4", "#4287c9", "2-4 (CND/TIC)"],
  ["u5_9", "#275e9e", "5-9 (MULTI)"],
  ["u10", "#123a70", "10+ (APTS)"],
  ["othr", "#9ca3af", "OTHR"],
];

function fmtPrice(n) {
  if (!Number.isFinite(n)) return null;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  return `$${Math.round(n / 1000)}k`;
}

// Join a list of place names into prose: ["A"] → "A", ["A","B"] → "A and B",
// ["A","B","C"] → "A, B, and C".
function fmtList(arr) {
  if (!arr?.length) return "";
  if (arr.length === 1) return arr[0];
  if (arr.length === 2) return `${arr[0]} and ${arr[1]}`;
  return `${arr.slice(0, -1).join(", ")}, and ${arr[arr.length - 1]}`;
}

// One median line in the Home-prices section. Always renders (so the condo
// row shows even with no sales), dashing the price and showing "0 sold" when
// `data` is null. `data` is { value, n } or null.
const usd = n => (Number.isFinite(n) ? "$" + Math.round(n).toLocaleString("en-US") : "—");
const mdy = iso => { const m = iso && /^(\d{4})-(\d{2})-(\d{2})/.exec(iso); return m ? `${+m[2]}/${+m[3]}/${m[1].slice(2)}` : "—"; };

const _mean = a => a.reduce((s, x) => s + x, 0) / a.length;
// True median (mean of the two middle values on an even count) — the same
// rule as the stats file, so the pop-up's figures match the guide page's.
const _median = a => { const s = [...a].sort((x, y) => x - y); const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
// Average / Median across the comps for each numeric column (skips blanks).
function summarize(homes, fn) {
  const col = k => { const c = homes.map(h => h[k]).filter(v => typeof v === "number" && Number.isFinite(v)); return c.length ? fn(c) : null; };
  return { list: col("list"), sale: col("sale"), sqft: col("sqft"), ppsf: col("ppsf"), pctList: col("pctList"), dom: col("dom") };
}

function PriceLine({ data, label, gap, sect, reportComps, onFocusComp }) {
  const [open, setOpen] = useState(false);
  const homes = data?.homes || [];
  const summaries = homes.length ? [["Average", summarize(homes, _mean)], ["Median", summarize(homes, _median)]] : [];
  const toggle = () => {
    const nx = !open;
    setOpen(nx);
    // Expanding plots this list's homes as map dots; collapsing removes them.
    // (Dots persist if the pop-up is simply closed, so they stay clickable.)
    reportComps?.(sect, nx ? homes.map(h => h.feat).filter(Boolean) : null);
  };
  return (
    <div style={{ marginBottom: gap ? 10 : 2 }}>
    <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
      <span style={{ fontSize: 24, fontWeight: 700, color: data ? "#131A25" : "#8A8E93" }}>{data ? data.value : "—"}</span>
      <span style={{ fontSize: 13.5, fontWeight: 700, color: "#131A25" }}>{label}</span>
      {homes.length > 0 && (
        <button type="button" onClick={toggle}
          style={{ marginLeft: "auto", background: "none", border: "none", padding: 0, font: "inherit", fontSize: 12.5, fontWeight: 600, color: "#203C5F", cursor: "pointer" }}>
          {open ? "Hide details ▲" : "Details ▼"}
        </button>
      )}
    </div>
    {open && homes.length > 0 && (
      <div style={{ marginTop: 6, borderTop: "1px solid #DCDDDE", paddingTop: 6,
        display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr) auto auto auto auto auto",
        columnGap: 8, rowGap: 1, fontSize: 11.5, color: "#505050", alignItems: "baseline" }}>
        {["List", "Sale", "SF", "$/sf", "%L", "Sold", "DM"].map((hd, k) => (
          <div key={"h" + k} style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3px", textTransform: "uppercase", color: "#8A8E93", textAlign: k >= 3 ? "right" : "left" }}>{hd}</div>
        ))}
        {homes.map((h, i) => (
          <Fragment key={i}>
            <button
              type="button"
              onClick={() => h.feat && onFocusComp?.(h.feat)}
              title="Show this sale on the map"
              style={{ gridColumn: "1 / -1", display: "flex", alignItems: "baseline", gap: 8, marginTop: i ? 9 : 5,
                background: "none", border: "none", padding: 0, font: "inherit", textAlign: "left",
                fontSize: 13, fontWeight: 600, color: "#131A25", cursor: h.feat ? "pointer" : "default" }}
            >
              <span>{h.addr || "—"}</span>
              {h.feat && <span style={{ fontSize: 11, fontWeight: 600, color: "#203C5F", whiteSpace: "nowrap" }}>◉ map</span>}
            </button>
            <div>{usd(h.list)}</div>
            <div style={{ fontWeight: 700, color: "#131A25" }}>{usd(h.sale)}</div>
            <div>{h.sqft ? h.sqft.toLocaleString("en-US") : "—"}</div>
            <div style={{ textAlign: "right" }}>{h.ppsf ? "$" + h.ppsf.toLocaleString("en-US") : "—"}</div>
            <div style={{ textAlign: "right" }}>{h.pctList != null ? h.pctList + "%" : "—"}</div>
            <div style={{ textAlign: "right" }}>{mdy(h.sold)}</div>
            <div style={{ textAlign: "right" }}>{h.dom != null ? h.dom : "—"}</div>
          </Fragment>
        ))}
        {summaries.map(([lbl, s], si) => (
          <div key={lbl} style={{ gridColumn: "1 / -1", display: "grid", gridTemplateColumns: "subgrid",
            columnGap: 8, alignItems: "baseline", padding: "5px 0", borderRadius: 6,
            marginTop: si ? 3 : 9,
            background: lbl === "Average" ? "#e8f1fc" : "#fdf7e0" }}>
            <div style={{ gridColumn: "1 / -1", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.4px", color: "#505050", marginBottom: 2 }}>{lbl}</div>
            <div style={{ fontWeight: 700, color: "#131A25" }}>{s.list != null ? usd(s.list) : "—"}</div>
            <div style={{ fontWeight: 700, color: "#131A25" }}>{s.sale != null ? usd(s.sale) : "—"}</div>
            <div>{s.sqft != null ? Math.round(s.sqft).toLocaleString("en-US") : "—"}</div>
            <div style={{ textAlign: "right" }}>{s.ppsf != null ? "$" + Math.round(s.ppsf).toLocaleString("en-US") : "—"}</div>
            <div style={{ textAlign: "right" }}>{s.pctList != null ? Math.round(s.pctList) + "%" : "—"}</div>
            <div style={{ textAlign: "right" }}>—</div>
            <div style={{ textAlign: "right" }}>{s.dom != null ? Math.round(s.dom) : "—"}</div>
          </div>
        ))}
      </div>
    )}
    </div>
  );
}

// Section headings match the neighborhood guide page (.lp-nsec h2): small,
// uppercase, letter-spaced navy — no tinted box, no emoji.
const BANNER = {
  display: "flex", alignItems: "center", gap: 8, marginBottom: 9,
  color: "#203C5F", padding: "0 0 6px", borderBottom: "1px solid #DCDDDE",
};
const SEC = { marginTop: 22 };
const SECLBL = { fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" };
const LINK = {
  display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13,
  color: "#203C5F", textDecoration: "none", border: "1px solid #DCDDDE",
  borderRadius: 8, padding: "6px 10px",
};
const NEARBY_NOTE = {
  fontSize: 12, fontStyle: "italic", color: "#6B6F75",
  margin: "0 0 9px", lineHeight: 1.5,
};

// "Show … layer" toggle: switches the overlay on/off in place while this
// pop-up stays open (like the Details lists). Filled dot = layer is on.
function LayerButton({ on, onClick, children }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={!!on}
      style={{ ...LINK, cursor: "pointer", font: "inherit", fontSize: 13,
        background: on ? "#E4EEF0" : "#fff", borderColor: on ? "#203C5F" : LINK.border.split(" ").pop(), fontWeight: on ? 700 : 400 }}>
      <span aria-hidden="true">{on ? "◉" : "○"}</span> {on ? "Hide" : "Show"} {children}
    </button>
  );
}

function Banner({ children }) {
  return (
    <div style={BANNER}>
      <span style={SECLBL}>{children}</span>
    </div>
  );
}

function PlaceRow({ p, first }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", gap: 10,
      padding: first ? "0 0 7px" : "7px 0",
      borderTop: first ? "none" : "1px solid #ece8df",
    }}>
      <div>
        {p.url ? (
          <a href={p.url} target="_blank" rel="noopener noreferrer" style={{
            fontSize: 14, fontWeight: 600, color: "#131A25", textDecoration: "none",
            display: "inline-flex", alignItems: "center", gap: 5,
          }}>
            {p.name} <span style={{ fontSize: 12, color: "#203C5F" }} aria-hidden="true">↗</span>
          </a>
        ) : (
          <span style={{ fontSize: 14, fontWeight: 600, color: "#131A25" }}>{p.name}</span>
        )}
        <div style={{ fontSize: 12, color: "#6B6F75" }}>{p.address}</div>
      </div>
      {p.phone && (
        <a href={`tel:${p.phone.replace(/[^0-9+]/g, "")}`} style={{
          fontSize: 12, color: "#203C5F", whiteSpace: "nowrap", textDecoration: "none",
        }}>{p.phone}</a>
      )}
    </div>
  );
}

export default function NeighborhoodModal({
  // Phone: render as a bottom sheet over the lower half of the screen so the
  // map, its marker and the layer chips all stay visible and usable above.
  sheet, name, data, fogHrs, zoneLabel, supervisorDistrict, realtorDistrict,
  zipCode, elevationFt, seismicYN, tsunamiYN, loc, onClose, onShowProperties, onToggleLayer, layerStates, onComps, onFocusComp,
}) {
  const [prices, setPrices] = useState("loading"); // "loading" | { sfh, condo } | null
  // Which Details lists are expanded → map dots. Each PriceLine reports its
  // features here; we merge them and hand the set to the map.
  const compsRef = useRef({ sfh: null, condo: null });
  const reportComps = useCallback((sect, feats) => {
    compsRef.current[sect] = feats && feats.length ? feats : null;
    const all = [...(compsRef.current.sfh || []), ...(compsRef.current.condo || [])];
    onComps?.(all.length ? { type: "FeatureCollection", features: all } : null);
  }, [onComps]);
  const [dataThrough, setDataThrough] = useState(""); // M/D/YY of the last data load
  const [resCounts, setResCounts] = useState(undefined); // undefined loading | counts obj | null
  // "By the Numbers" starts collapsed to save space; the header shows the
  // parcel total so the headline number is visible without expanding.
  const [invOpen, setInvOpen] = useState(false);

  // Residential parcel counts for this neighborhood, by unit bucket
  // (precomputed from the SF Land Use dataset).
  useEffect(() => {
    let cancelled = false;
    fetch(RES_COUNTS_URL)
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then(all => { if (!cancelled) setResCounts(all[name] || null); })
      .catch(() => { if (!cancelled) setResCounts(null); });
    return () => { cancelled = true; };
  }, [name]);

  // Compute the current-year median sale price for this neighborhood —
  // single-family homes vs. attached ownership units (condos + TICs) —
  // straight from the listings dataset. Each is { value, n } or null.
  useEffect(() => {
    let cancelled = false;
    fetch(LISTINGS_URL)
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then(g => {
        if (cancelled) return;
        // Stats run through the end of the last full month (metadata.statsThrough).
        const through = g.metadata?.statsThrough || "";
        const shown = through || g.metadata?.builtAt;
        setDataThrough(shown ? mdy(shown) : "");
        const feats = g.features || [];
        // Only homes physically IN this neighborhood (strict point-in-polygon
        // fogNeighborhood match) — not ones merely MLS-tagged to it.
        const collectFor = typeRe => {
          const homes = feats
            .filter(f => {
              const p = f.properties || {};
              return p.fogNeighborhood === name
                && typeRe.test(p.propType || "")
                && Number(p.sellingPrice) > 0
                && String(p.sellingDate || "").slice(0, 4) === CUR_YEAR
                && (!through || String(p.sellingDate).slice(0, 10) <= through);
            })
            .map(f => {
              const p = f.properties;
              const sale = Number(p.sellingPrice) || 0;
              const sqft = Number(p.sqft) || 0;
              const list = Number(p.listPrice) || null;
              return {
                addr: (p.address || "").replace(/,\s*San Francisco.*$/i, "").trim() + (p.unit ? ` #${p.unit}` : ""),
                sqft: sqft > 0 ? sqft : null,
                list,
                sale,
                pctList: list > 0 ? Math.round((sale / list) * 100) : null, // sold ÷ list
                ppsf: sqft > 0 ? Math.round(sale / sqft) : null,
                dom: Number.isFinite(Number(p.dom)) ? Math.round(Number(p.dom)) : null,
                sold: p.sellingDate || null,
                // Map-dot feature (sold → blue-style handled by the map layer).
                feat: f.geometry ? { type: "Feature", geometry: f.geometry, properties: { ...p, actKind: "sold" } } : null,
              };
            })
            .sort((a, b) => b.sale - a.sale); // highest sold price first
          if (!homes.length) return null;
          const prices = homes.map(h => h.sale).sort((a, b) => a - b);
          const median = _median(prices);
          return { value: fmtPrice(median), n: homes.length, homes };
        };
        setPrices({ sfh: collectFor(/single family/i), condo: collectFor(/condo|tenancy in common/i) });
      })
      .catch(() => { if (!cancelled) setPrices(null); });
    return () => { cancelled = true; };
  }, [name]);

  // Esc to close.
  useEffect(() => {
    const onKey = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const microText = (() => {
    if (!Number.isFinite(fogHrs)) return null;
    const tail = zoneLabel === "Sun"
      ? " — sunnier than the foggier west side of the city."
      : zoneLabel === "Fog"
        ? " — among the foggier, cooler parts of the city."
        : ", a mix of sun and marine-layer fog.";
    return `${name} sits in a ${zoneLabel || "microclimate"} zone, averaging about ${fogHrs.toFixed(1)} hours of summer fog a day${tail}`;
  })();

  // When one entry covers two fog polygons (e.g. Cow Hollow / Union Street),
  // the entry sets `title` so the header credits both, regardless of which
  // polygon was clicked.
  const heading = data.title || name;
  const key = entryKeyFor(name);
  const st = key ? statsFor(key) : null;

  return (
    <div className={"nh-backdrop" + (sheet ? " nh-backdrop-sheet" : "")}>
      <div
        className={"nh-modal" + (sheet ? " nh-sheet" : "")}
        role="dialog"
        aria-label={`${heading} neighborhood highlights`}
      >
        {sheet && <div className="nh-grip" aria-hidden="true" />}
        <button className="nh-x" onClick={onClose} aria-label="Close">×</button>

        {/* The same summary as the neighborhood's guide page: title, alias,
            zone pill, spirit line, reasons, and the six stats from the same
            stats file — so the pop-up and the page always agree. */}
        <p className="nhm-crumb">San Francisco Neighborhoods</p>
        <div className="nhm-head">
          <h2>{heading}</h2>
          {data.aka && <span className="nhm-aka">also {data.aka}</span>}
          {st?.zone && <span className="nhm-zone" style={{ "--z": ZONE_COLOR[st.zone] }}>{st.zone} zone</span>}
        </div>
        <p className="nhm-spirit">{data.spirit}</p>
        {data.reasons?.length ? (
          <ul className="nhm-reasons">{data.reasons.map(r => <li key={r}>{r}</li>)}</ul>
        ) : null}
        {st && st.n > 0 && (
          <div className="nhm-stats">
            {[
              ["Median house", money(st.sfhMedian), st.sfhN ? `${st.sfhN} sold` : null],
              ["Median condo / TIC", money(st.condoMedian), st.condoN ? `${st.condoN} sold` : null],
              ["Per square foot", st.ppsf ? `$${Math.round(st.ppsf).toLocaleString("en-US")}` : null, null],
              ["Days to sell", st.dom != null ? Math.round(st.dom) : null, "median"],
              ["Summer fog", Number.isFinite(st.fogHours) ? `${st.fogHours.toFixed(1)}h` : null, "a day"],
              ["Homes sold", st.n, statsYear],
            ].filter(([, v]) => v != null).map(([l, v, sub]) => (
              <div className="nhm-stat" key={l}>
                <div className="nhm-stat-v">{v}</div>
                <div className="nhm-stat-l">{l}{sub ? <span> {sub}</span> : null}</div>
              </div>
            ))}
          </div>
        )}
        {key && (
          <Link className="nhm-guide" href={`/neighborhoods/${slugify(key)}`}>Full neighborhood guide →</Link>
        )}

        {resCounts && resCounts.total > 0 && (
          <section style={SEC}>
            <button
              type="button"
              onClick={() => setInvOpen(o => !o)}
              aria-expanded={invOpen}
              style={{ ...BANNER, width: "100%", border: "none", borderBottom: BANNER.borderBottom, background: "none", cursor: "pointer", font: "inherit", textAlign: "left", marginBottom: invOpen ? 10 : 0 }}
            >
              <span style={SECLBL}>Inventory — parcels</span>
              <span style={{ marginLeft: "auto", fontSize: 12, fontWeight: 700, color: "#203C5F", whiteSpace: "nowrap" }}>
                {invOpen ? "Hide ▲" : `${resCounts.total.toLocaleString("en-US")} parcels ▼`}
              </span>
            </button>
            {invOpen && (<>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase", color: "#8A8E93", margin: "0 0 4px" }}>
              Inventory Types
            </div>
            <div style={{ marginBottom: 2 }}>
              {PARCEL_ROWS.map(([key, color, label]) => (
                <div key={key} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, lineHeight: 1.9 }}>
                  <span style={{ width: 11, height: 11, borderRadius: 2, background: color, flex: "0 0 auto" }} />
                  <span style={{ color: "#505050", flex: 1 }}>{label}</span>
                  <span style={{ fontWeight: 700, color: "#131A25" }}>{(resCounts[key] || 0).toLocaleString("en-US")}</span>
                </div>
              ))}
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, lineHeight: 1.9, borderTop: "1px solid #DCDDDE", marginTop: 4, paddingTop: 4 }}>
                <span style={{ width: 11, flex: "0 0 auto" }} />
                <span style={{ color: "#505050", flex: 1, fontWeight: 700 }}>Total parcels</span>
                <span style={{ fontWeight: 800, color: "#131A25" }}>{resCounts.total.toLocaleString("en-US")}</span>
              </div>
            </div>
            </>)}
          </section>
        )}

        <section style={SEC}>
          <Banner>{dataThrough ? `Home prices — YTD through ${dataThrough}` : "Home prices — YTD"}</Banner>
          {prices === "loading" ? (
            <div style={{ marginBottom: 8 }}><span style={{ fontSize: 14, color: "#6B6F75" }}>Loading…</span></div>
          ) : prices ? (
            <div style={{ marginBottom: 2 }}>
              <PriceLine data={prices.sfh} label="Median Single-Family" gap sect="sfh" reportComps={reportComps} onFocusComp={onFocusComp} />
              <PriceLine data={prices.condo} label="Median Condo/TIC" sect="condo" reportComps={reportComps} onFocusComp={onFocusComp} />
            </div>
          ) : (
            <div style={{ marginBottom: 8 }}><span style={{ fontSize: 13, color: "#6B6F75" }}>Market data unavailable.</span></div>
          )}
        </section>

        {microText && (
          <section style={SEC}>
            <Banner>Microclimate</Banner>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: "#131A25", margin: "0 0 10px" }}>{microText}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              <LayerButton on={layerStates?.fog} onClick={() => onToggleLayer?.("fog")}>fog layer</LayerButton>
              <LayerButton on={layerStates?.micro} onClick={() => onToggleLayer?.("micro")}>microclimate layer</LayerButton>
            </div>
          </section>
        )}

        {data.history && (
          <section style={SEC}>
            <Banner>The story</Banner>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: "#131A25", margin: 0 }}>{data.history}</p>
          </section>
        )}

        {data.facts?.length > 0 && (
          <section style={SEC}>
            <Banner>Things most people don&rsquo;t know</Banner>
            {data.facts.map((f, i) => (
              <div key={f.title} className="nhm-fact" style={{ marginBottom: i < data.facts.length - 1 ? 10 : 0 }}>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </div>
            ))}
          </section>
        )}

        {data.restaurants?.length > 0 && (
          <section style={SEC}>
            <Banner>{data.nearby ? "Nearby" : "Top"} {data.restaurants.length} restaurant{data.restaurants.length === 1 ? "" : "s"}</Banner>
            {data.nearby && (
              <p style={NEARBY_NOTE}>Primarily a residential neighborhood — the closest restaurants are nearby in {fmtList(data.nearby)}.</p>
            )}
            {data.restaurants.map((p, i) => <PlaceRow key={p.name} p={p} first={i === 0} />)}
          </section>
        )}

        {data.bars?.length > 0 && (
          <section style={SEC}>
            <Banner>{data.nearby ? "Nearby" : "Top"} {data.bars.length} bar{data.bars.length === 1 ? "" : "s"}</Banner>
            {data.nearby && (
              <p style={NEARBY_NOTE}>Primarily a residential neighborhood — the closest bars are nearby in {fmtList(data.nearby)}.</p>
            )}
            {data.bars.map((p, i) => <PlaceRow key={p.name} p={p} first={i === 0} />)}
          </section>
        )}

        {data.hospital && (
          <section style={SEC}>
            <Banner>Nearest hospital</Banner>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
              <div>
                <a href={data.hospital.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 14, fontWeight: 600, color: "#131A25", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 5 }}>
                  {data.hospital.name} <span style={{ fontSize: 12, color: "#203C5F" }} aria-hidden="true">↗</span>
                </a>
                <div style={{ fontSize: 12, color: "#6B6F75" }}>{data.hospital.address}{data.hospital.dist ? ` · ${data.hospital.dist}` : ""}</div>
              </div>
              {data.hospital.phone && (
                <a href={`tel:${data.hospital.phone.replace(/[^0-9+]/g, "")}`} style={{ fontSize: 12, color: "#203C5F", whiteSpace: "nowrap", textDecoration: "none" }}>{data.hospital.phone}</a>
              )}
            </div>
          </section>
        )}

        {data.transit && (
          <section style={SEC}>
            <Banner>Getting around</Banner>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: "#131A25", margin: "0 0 8px" }}>{data.transit}</p>
            <LayerButton on={layerStates?.transit} onClick={() => onToggleLayer?.("transit")}>transit layer</LayerButton>
          </section>
        )}
      </div>
    </div>
  );
}
