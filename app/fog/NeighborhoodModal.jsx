'use client';

// Neighborhood highlights pop-up, opened from the Neighborhood name on the
// fog/neighborhoods card. Curated editorial content comes from
// lib/neighborhoods.js; the home-price figure (section 7) is computed live
// from the listings GeoJSON and the microclimate line (section 8) is
// derived from the picked fog contour, so neither goes stale.

import { Fragment, useEffect, useState } from "react";

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

// Section / fact icons. The app is emoji-forward (see the home hub), so we
// use emoji here rather than pulling in an icon font.
const FACT_EMOJI = {
  flag: "🏳️‍🌈", shop: "📷", movie: "🎬", confetti: "🎉", pin: "📍",
  mayor: "🏛️", quake: "🏚️", stroller: "👶", tram: "🚊", shopping: "🛍️",
  fair: "🎡", wave: "🌊", park: "🌳", art: "🎨",
  money: "💰", house: "🏠", star: "⭐", church: "⛪", burrito: "🌯",
  sun: "☀️", subway: "🚇", book: "📖", coffee: "☕", tower: "🗼",
  pizza: "🍕", bird: "🦜", road: "🛣️", stairs: "🪜", bridge: "🌉",
  dog: "🐕", beer: "🍺", factory: "🏭", cow: "🐄", water: "💧",
  music: "🎷",
};

function buildUrl(base, loc, extra = {}) {
  const qs = new URLSearchParams();
  const lng = loc?.point?.[0];
  const lat = loc?.point?.[1];
  if (Number.isFinite(lat) && Number.isFinite(lng)) {
    qs.set("lat", String(lat));
    qs.set("lng", String(lng));
    if (loc?.address) qs.set("name", loc.address);
  }
  for (const [k, v] of Object.entries(extra)) if (v) qs.set(k, v);
  const s = qs.toString();
  return s ? `${base}?${s}` : base;
}

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
const _median = a => { const s = [...a].sort((x, y) => x - y); return s[Math.floor((s.length - 1) / 2)]; };
// Average / Median across the comps for each numeric column (skips blanks).
function summarize(homes, fn) {
  const col = k => { const c = homes.map(h => h[k]).filter(v => typeof v === "number" && Number.isFinite(v)); return c.length ? fn(c) : null; };
  return { list: col("list"), sale: col("sale"), sqft: col("sqft"), ppsf: col("ppsf"), pctList: col("pctList"), dom: col("dom") };
}

function PriceLine({ data, label, gap }) {
  const [open, setOpen] = useState(false);
  const homes = data?.homes || [];
  const summaries = homes.length ? [["Average", summarize(homes, _mean)], ["Median", summarize(homes, _median)]] : [];
  return (
    <div style={{ marginBottom: gap ? 10 : 2 }}>
    <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
      <span style={{ fontSize: 24, fontWeight: 700, color: data ? "#1c1917" : "#a8a29e" }}>{data ? data.value : "—"}</span>
      <span style={{ fontSize: 13.5, fontWeight: 700, color: "#1c1917" }}>{label}</span>
      {homes.length > 0 && (
        <button type="button" onClick={() => setOpen(o => !o)}
          style={{ marginLeft: "auto", background: "none", border: "none", padding: 0, font: "inherit", fontSize: 12.5, fontWeight: 600, color: "#2563eb", cursor: "pointer" }}>
          {open ? "Hide details ▲" : "Details ▼"}
        </button>
      )}
    </div>
    {open && homes.length > 0 && (
      <div style={{ marginTop: 6, borderTop: "1px solid #f0ece6", paddingTop: 6,
        display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr) auto auto auto auto auto",
        columnGap: 8, rowGap: 1, fontSize: 11.5, color: "#44403c", alignItems: "baseline" }}>
        {["List", "Sale", "SF", "$/sf", "%L", "Sold", "DM"].map((hd, k) => (
          <div key={"h" + k} style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3px", textTransform: "uppercase", color: "#a8a29e", textAlign: k >= 3 ? "right" : "left" }}>{hd}</div>
        ))}
        {homes.map((h, i) => (
          <Fragment key={i}>
            <div style={{ gridColumn: "1 / -1", fontSize: 13, fontWeight: 600, color: "#1c1917", marginTop: i ? 9 : 5 }}>
              {h.addr || "—"}
            </div>
            <div>{usd(h.list)}</div>
            <div style={{ fontWeight: 700, color: "#1c1917" }}>{usd(h.sale)}</div>
            <div>{h.sqft ? h.sqft.toLocaleString("en-US") : "—"}</div>
            <div style={{ textAlign: "right" }}>{h.ppsf ? "$" + h.ppsf.toLocaleString("en-US") : "—"}</div>
            <div style={{ textAlign: "right" }}>{h.pctList != null ? h.pctList + "%" : "—"}</div>
            <div style={{ textAlign: "right" }}>{mdy(h.sold)}</div>
            <div style={{ textAlign: "right" }}>{h.dom != null ? h.dom : "—"}</div>
          </Fragment>
        ))}
        {summaries.map(([lbl, s], si) => (
          <Fragment key={lbl}>
            <div style={{ gridColumn: "1 / -1", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.3px", color: "#78716c",
              marginTop: si ? 4 : 9, paddingTop: si ? 0 : 6, borderTop: si ? "none" : "1px solid #e7e2da" }}>{lbl}</div>
            <div style={{ fontWeight: 700, color: "#1c1917" }}>{s.list != null ? usd(s.list) : "—"}</div>
            <div style={{ fontWeight: 700, color: "#1c1917" }}>{s.sale != null ? usd(s.sale) : "—"}</div>
            <div>{s.sqft != null ? Math.round(s.sqft).toLocaleString("en-US") : "—"}</div>
            <div style={{ textAlign: "right" }}>{s.ppsf != null ? "$" + Math.round(s.ppsf).toLocaleString("en-US") : "—"}</div>
            <div style={{ textAlign: "right" }}>{s.pctList != null ? Math.round(s.pctList) + "%" : "—"}</div>
            <div style={{ textAlign: "right" }}>—</div>
            <div style={{ textAlign: "right" }}>{s.dom != null ? Math.round(s.dom) : "—"}</div>
          </Fragment>
        ))}
      </div>
    )}
    </div>
  );
}

const BANNER = {
  display: "flex", alignItems: "center", gap: 8, marginBottom: 10,
  background: "#E6F1FB", color: "#042C53", padding: "7px 11px", borderRadius: 8,
};
const SEC = { marginTop: 16 };
const SECLBL = { fontSize: 13, fontWeight: 700 };
const ICON = { fontSize: 16, lineHeight: 1 };
const LINK = {
  display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13,
  color: "#2563eb", textDecoration: "none", border: "1px solid #ddd8d0",
  borderRadius: 8, padding: "6px 10px",
};
const NEARBY_NOTE = {
  fontSize: 12, fontStyle: "italic", color: "#78716c",
  margin: "0 0 9px", lineHeight: 1.5,
};

function Banner({ emoji, children }) {
  return (
    <div style={BANNER}>
      <span style={ICON} aria-hidden="true">{emoji}</span>
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
            fontSize: 14, fontWeight: 600, color: "#1c1917", textDecoration: "none",
            display: "inline-flex", alignItems: "center", gap: 5,
          }}>
            {p.name} <span style={{ fontSize: 12, color: "#2563eb" }} aria-hidden="true">↗</span>
          </a>
        ) : (
          <span style={{ fontSize: 14, fontWeight: 600, color: "#1c1917" }}>{p.name}</span>
        )}
        <div style={{ fontSize: 12, color: "#78716c" }}>{p.address}</div>
      </div>
      {p.phone && (
        <a href={`tel:${p.phone.replace(/[^0-9+]/g, "")}`} style={{
          fontSize: 12, color: "#2563eb", whiteSpace: "nowrap", textDecoration: "none",
        }}>{p.phone}</a>
      )}
    </div>
  );
}

export default function NeighborhoodModal({
  name, data, fogHrs, zoneLabel, supervisorDistrict, realtorDistrict,
  zipCode, elevationFt, seismicYN, tsunamiYN, loc, onClose, onShowProperties,
}) {
  const [prices, setPrices] = useState("loading"); // "loading" | { sfh, condo } | null
  const [dataThrough, setDataThrough] = useState(""); // M/D/YY of the last data load
  const [resCounts, setResCounts] = useState(undefined); // undefined loading | counts obj | null

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
        setDataThrough(g.metadata?.builtAt ? mdy(g.metadata.builtAt) : "");
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
                && String(p.sellingDate || "").slice(0, 4) === CUR_YEAR;
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
              };
            })
            .sort((a, b) => b.sale - a.sale); // highest sold price first
          if (!homes.length) return null;
          const prices = homes.map(h => h.sale).sort((a, b) => a - b);
          const median = prices[Math.floor((prices.length - 1) / 2)];
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

  return (
    <div className="nh-backdrop" onClick={onClose}>
      <div className="nh-modal" onClick={e => e.stopPropagation()} role="dialog" aria-label={`${heading} neighborhood highlights`}>
        <button className="nh-x" onClick={onClose} aria-label="Close">×</button>

        <div style={{ fontSize: 22, fontWeight: 800, color: "#1c1917", lineHeight: 1.1, letterSpacing: "-0.5px" }}>{heading}</div>
        <div style={{ fontSize: 13, color: "#78716c", marginTop: 3 }}>Neighborhood highlights</div>

        <div style={{ background: "#FAEEDA", borderRadius: 12, padding: "14px 16px", marginTop: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span style={ICON} aria-hidden="true">✨</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#854F0B" }}>Why live here?</span>
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.6, color: "#1c1917", margin: 0 }}>{data.spirit}</p>
        </div>

        {resCounts && resCounts.total > 0 && (
          <section style={SEC}>
            <Banner emoji="📊">By the Numbers - Inventory Count</Banner>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase", color: "#a8a29e", margin: "0 0 4px" }}>
              Inventory Types
            </div>
            <div style={{ marginBottom: 2 }}>
              {PARCEL_ROWS.map(([key, color, label]) => (
                <div key={key} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, lineHeight: 1.9 }}>
                  <span style={{ width: 11, height: 11, borderRadius: 2, background: color, flex: "0 0 auto" }} />
                  <span style={{ color: "#44403c", flex: 1 }}>{label}</span>
                  <span style={{ fontWeight: 700, color: "#1c1917" }}>{(resCounts[key] || 0).toLocaleString("en-US")}</span>
                </div>
              ))}
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, lineHeight: 1.9, borderTop: "1px solid #f0ece6", marginTop: 4, paddingTop: 4 }}>
                <span style={{ width: 11, flex: "0 0 auto" }} />
                <span style={{ color: "#57534e", flex: 1, fontWeight: 700 }}>Total parcels</span>
                <span style={{ fontWeight: 800, color: "#1c1917" }}>{resCounts.total.toLocaleString("en-US")}</span>
              </div>
            </div>
          </section>
        )}

        <section style={SEC}>
          <Banner emoji="🏠">{dataThrough ? `1 · Home Prices - YTD Through ${dataThrough}` : "1 · Home Prices - YTD"}</Banner>
          {prices === "loading" ? (
            <div style={{ marginBottom: 8 }}><span style={{ fontSize: 14, color: "#78716c" }}>Loading…</span></div>
          ) : prices ? (
            <div style={{ marginBottom: 2 }}>
              <PriceLine data={prices.sfh} label="Median Single-Family" gap />
              <PriceLine data={prices.condo} label="Median Condo/TIC" />
            </div>
          ) : (
            <div style={{ marginBottom: 8 }}><span style={{ fontSize: 13, color: "#78716c" }}>Market data unavailable.</span></div>
          )}
        </section>

        {microText && (
          <section style={SEC}>
            <Banner emoji="☀️">2 · Microclimate</Banner>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: "#1c1917", margin: "0 0 10px" }}>{microText}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              <a style={LINK} href={buildUrl("/fog", loc, { preset: "fog" })}>↗ Open Fog Map</a>
              <a style={LINK} href={buildUrl("/microclimates", loc, { layer: "solar" })}>↗ Micro-Climate map</a>
            </div>
          </section>
        )}

        {data.history && (
          <section style={SEC}>
            <Banner emoji="📜">3 · Name &amp; origins</Banner>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: "#1c1917", margin: 0 }}>{data.history}</p>
          </section>
        )}

        {data.facts?.length > 0 && (
          <section style={SEC}>
            <Banner emoji="💡">4 · Did you know?</Banner>
            {data.facts.map((f, i) => (
              <div key={f.title} style={{ display: "flex", gap: 10, marginBottom: i < data.facts.length - 1 ? 12 : 0 }}>
                <span style={{ fontSize: 16, marginTop: 1 }} aria-hidden="true">{FACT_EMOJI[f.icon] || "•"}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#1c1917" }}>{f.title}</div>
                  <p style={{ fontSize: 13, lineHeight: 1.55, color: "#78716c", margin: "2px 0 0" }}>{f.text}</p>
                </div>
              </div>
            ))}
          </section>
        )}

        {data.restaurants?.length > 0 && (
          <section style={SEC}>
            <Banner emoji="🍽️">5 · {data.nearby ? "Nearby" : "Top"} {data.restaurants.length} restaurant{data.restaurants.length === 1 ? "" : "s"}</Banner>
            {data.nearby && (
              <p style={NEARBY_NOTE}>Primarily a residential neighborhood — the closest restaurants are nearby in {fmtList(data.nearby)}.</p>
            )}
            {data.restaurants.map((p, i) => <PlaceRow key={p.name} p={p} first={i === 0} />)}
          </section>
        )}

        {data.bars?.length > 0 && (
          <section style={SEC}>
            <Banner emoji="🍸">6 · {data.nearby ? "Nearby" : "Top"} {data.bars.length} bar{data.bars.length === 1 ? "" : "s"}</Banner>
            {data.nearby && (
              <p style={NEARBY_NOTE}>Primarily a residential neighborhood — the closest bars are nearby in {fmtList(data.nearby)}.</p>
            )}
            {data.bars.map((p, i) => <PlaceRow key={p.name} p={p} first={i === 0} />)}
          </section>
        )}

        {data.hospital && (
          <section style={SEC}>
            <Banner emoji="🏥">7 · Nearest hospital</Banner>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
              <div>
                <a href={data.hospital.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 14, fontWeight: 600, color: "#1c1917", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 5 }}>
                  {data.hospital.name} <span style={{ fontSize: 12, color: "#2563eb" }} aria-hidden="true">↗</span>
                </a>
                <div style={{ fontSize: 12, color: "#78716c" }}>{data.hospital.address}{data.hospital.dist ? ` · ${data.hospital.dist}` : ""}</div>
              </div>
              {data.hospital.phone && (
                <a href={`tel:${data.hospital.phone.replace(/[^0-9+]/g, "")}`} style={{ fontSize: 12, color: "#2563eb", whiteSpace: "nowrap", textDecoration: "none" }}>{data.hospital.phone}</a>
              )}
            </div>
          </section>
        )}

        {data.transit && (
          <section style={SEC}>
            <Banner emoji="🚊">8 · Getting around</Banner>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: "#1c1917", margin: "0 0 8px" }}>{data.transit}</p>
            <a style={LINK} href={buildUrl("/fog", loc, { preset: "transit" })}>↗ Open Transit map</a>
          </section>
        )}
      </div>
    </div>
  );
}
