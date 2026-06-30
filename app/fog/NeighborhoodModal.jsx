'use client';

// Neighborhood highlights pop-up, opened from the Neighborhood name on the
// fog/neighborhoods card. Curated editorial content comes from
// lib/neighborhoods.js; the home-price figure (section 7) is computed live
// from the listings GeoJSON and the microclimate line (section 8) is
// derived from the picked fog contour, so neither goes stale.

import { useEffect, useState } from "react";

const LISTINGS_URL = "/data/sf-listings.geojson";
const CUR_YEAR = "2026";

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
function PriceLine({ data, label, gap }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: gap ? 6 : 0 }}>
      <span style={{ fontSize: 24, fontWeight: 700, color: data ? "#1c1917" : "#a8a29e" }}>{data ? data.value : "—"}</span>
      <span style={{ fontSize: 13, color: "#78716c" }}>median {label}, {CUR_YEAR} YTD ({data ? data.n : 0} sold)</span>
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
  zipCode, elevationFt, seismicYN, tsunamiYN, loc, onClose,
}) {
  const [prices, setPrices] = useState("loading"); // "loading" | { sfh, condo } | null

  // Compute the current-year median sale price for this neighborhood —
  // single-family homes vs. attached ownership units (condos + TICs) —
  // straight from the listings dataset. Each is { value, n } or null.
  useEffect(() => {
    let cancelled = false;
    fetch(LISTINGS_URL)
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then(g => {
        if (cancelled) return;
        const feats = g.features || [];
        const medianFor = typeRe => {
          const sales = feats
            .filter(f => {
              const p = f.properties || {};
              const inHood = p.neighborhood === name || p.fogNeighborhood === name;
              return inHood
                && typeRe.test(p.propType || "")
                && Number(p.sellingPrice) > 0
                && String(p.sellingDate || "").slice(0, 4) === CUR_YEAR;
            })
            .map(f => Number(f.properties.sellingPrice))
            .sort((a, b) => a - b);
          if (!sales.length) return null;
          const median = sales[Math.floor((sales.length - 1) / 2)];
          return { value: fmtPrice(median), n: sales.length };
        };
        setPrices({ sfh: medianFor(/single family/i), condo: medianFor(/condo|tenancy in common/i) });
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

        <section style={SEC}>
          <Banner emoji="🏠">1 · Home prices</Banner>
          {prices === "loading" ? (
            <div style={{ marginBottom: 8 }}><span style={{ fontSize: 14, color: "#78716c" }}>Loading…</span></div>
          ) : prices ? (
            <div style={{ marginBottom: 8 }}>
              <PriceLine data={prices.sfh} label="single-family" gap />
              <PriceLine data={prices.condo} label="condo/TIC" />
            </div>
          ) : (
            <div style={{ marginBottom: 8 }}><span style={{ fontSize: 13, color: "#78716c" }}>Market data unavailable.</span></div>
          )}
          <a style={LINK} href="/fog?preset=homes">↗ See Market data</a>
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
