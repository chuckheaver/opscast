'use client';

// Homebuyer-facing profile for a residential tall building, opened from the
// "Tall Buildings" index. Mirrors NeighborhoodModal. Merges three layers:
//   • computed market + structural data  (building-profiles.json → `profile`)
//   • authored narrative / amenities / red flags  (lib/buildings.js → `authored`)
//   • a live link to the building's listings  (/listings?building=<objectid>)

import { useEffect } from "react";

const fmtUSD = n => (Number.isFinite(n) ? "$" + Math.round(n).toLocaleString("en-US") : null);
const fmtUSDshort = n => {
  if (!Number.isFinite(n)) return "—";
  if (n >= 1e6) return "$" + (n / 1e6).toFixed(2) + "M";
  if (n >= 1e3) return "$" + Math.round(n / 1e3) + "K";
  return "$" + Math.round(n);
};
const fmtDate = iso => {
  const m = iso && /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  return m ? `${+m[2]}/${+m[3]}/${m[1].slice(2)}` : (iso || "");
};
const fmtRangeUSD = r => (r ? `${fmtUSDshort(r[0])} – ${fmtUSDshort(r[1])}` : "—");
const fmtRange = (r, unit = "") => (r ? (r[0] === r[1] ? `${r[0]}${unit}` : `${r[0]}–${r[1]}${unit}`) : "—");

const SEC = { marginTop: 16 };
const ICON = { fontSize: 16, lineHeight: 1 };
const SECLBL = { fontSize: 13, fontWeight: 700 };
const BANNER = {
  display: "flex", alignItems: "center", gap: 8, marginBottom: 10,
  background: "#E6F1FB", color: "#042C53", padding: "7px 11px", borderRadius: 8,
};
const LINK = {
  display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13,
  color: "#2563eb", textDecoration: "none", border: "1px solid #ddd8d0",
  borderRadius: 8, padding: "6px 10px",
};
const BADGE = { fontSize: 12, padding: "3px 9px", borderRadius: 8, background: "#f1ede5", color: "#78716c" };

function Banner({ emoji, children }) {
  return (
    <div style={BANNER}>
      <span style={ICON} aria-hidden="true">{emoji}</span>
      <span style={SECLBL}>{children}</span>
    </div>
  );
}

// One labelled figure in the market-snapshot grid.
function Stat({ label, value }) {
  return (
    <div style={{ background: "#f7f5f1", borderRadius: 8, padding: "8px 10px" }}>
      <div style={{ fontSize: 11, color: "#78716c", marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 15, fontWeight: 700, color: "#1c1917" }}>{value}</div>
    </div>
  );
}

// Building & structure facts — friendly labels + units, blanks skipped.
const STRUCT_ROWS = [
  ["height_ft", "Height", " ft"],
  ["stories_above_grade", "Stories above grade", null],
  ["stories_below_grade", "Stories below grade", null],
  ["date", "Year built", null],
  ["retrofit_date", "Retrofit date", null],
  ["square_footage", "Building size", " sq ft"],
  ["structural_material", "Structural material", null],
  ["structural_system", "Structural system", null],
  ["facade_material", "Facade", null],
  ["foundation_system", "Foundation", null],
  ["fire_resistence_type", "Fire-resistance", null],
  ["percent_sprinklered", "Sprinklered", "%"],
  ["liquefaction_potential", "Liquefaction potential", null],
  ["building_code_year", "Building code year", null],
];

export default function BuildingModal({ profile, authored, onClose }) {
  useEffect(() => {
    const onKey = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!profile) return null;
  const m = profile.market || {};
  const s = profile.struct || {};
  const rental = profile.rental;
  const hoa = Number.isFinite(m.hoaAvg)
    ? `${fmtUSD(m.hoaAvg)}/mo`
    : Number.isFinite(authored?.hoaApprox)
    ? `~${fmtUSD(authored.hoaApprox)}/mo (approx)`
    : "—";

  return (
    <div className="nh-backdrop" onClick={onClose}>
      <div className="nh-modal" onClick={e => e.stopPropagation()} role="dialog" aria-label={`${profile.name} building profile`}>
        <button className="nh-x" onClick={onClose} aria-label="Close">×</button>

        <div style={{ fontSize: 22, fontWeight: 800, color: "#1c1917", lineHeight: 1.1, letterSpacing: "-0.5px" }}>{profile.name}</div>
        <div style={{ fontSize: 13, color: "#78716c", marginTop: 3 }}>{profile.address}</div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, margin: "12px 0 2px" }}>
          {rental
            ? <span style={{ ...BADGE, background: "#FCEBEB", color: "#A32D2D" }}>Rental — not for sale</span>
            : <span style={BADGE}>Condominium</span>}
          {s.date && <span style={BADGE}>Built {s.date}</span>}
          {s.height_ft && <span style={BADGE}>{s.height_ft} ft</span>}
          {s.stories_above_grade && <span style={BADGE}>{s.stories_above_grade} stories</span>}
          {Number.isFinite(authored?.units) && <span style={BADGE}>{authored.units} units</span>}
        </div>

        {authored?.narrative && (
          <div style={{ background: "#FAEEDA", borderRadius: 12, padding: "14px 16px", marginTop: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={ICON} aria-hidden="true">✨</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#854F0B" }}>Why live here?</span>
            </div>
            <p style={{ fontSize: 15, lineHeight: 1.55, color: "#412402", margin: 0 }}>{authored.narrative}</p>
          </div>
        )}

        {/* Quick facts every buyer asks first. */}
        <section style={SEC}>
          <Banner emoji="🏢">Building at a glance</Banner>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: 8 }}>
            <Stat label="Units" value={Number.isFinite(authored?.units) ? authored.units : "—"} />
            <Stat label="Built" value={s.date || "—"} />
            <Stat label="Height" value={s.height_ft ? `${s.height_ft} ft` : "—"} />
            <Stat label="Stories" value={s.stories_above_grade || "—"} />
            <Stat label="HOA dues" value={hoa} />
          </div>
        </section>

        {/* Market snapshot — skipped for rentals (no purchase market). */}
        {rental ? (
          <section style={SEC}>
            <Banner emoji="🔑">Market</Banner>
            <p style={{ fontSize: 13.5, lineHeight: 1.55, color: "#78716c", margin: 0 }}>
              This is a rental building — homes here lease rather than sell, so there's no
              purchase market data. Availability is handled by the building's leasing office.
            </p>
          </section>
        ) : (
          <section style={SEC}>
            <Banner emoji="📈">Market activity</Banner>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: 8, marginBottom: 10 }}>
              <Stat label="For sale now" value={m.active ?? 0} />
              <Stat label="Sold (on record)" value={m.sold ?? 0} />
              <Stat label="Median sold" value={fmtUSDshort(m.medianSale)} />
              <Stat label="Price range" value={fmtRangeUSD(m.priceRange)} />
              <Stat label="$ / sq ft" value={Number.isFinite(m.medianPpsf) ? "$" + Math.round(m.medianPpsf).toLocaleString("en-US") : "—"} />
              <Stat label="Beds" value={fmtRange(m.bedsRange)} />
              <Stat label="Interior" value={m.sqftRange ? `${fmtRange(m.sqftRange)} sf` : "—"} />
              <Stat label="Median days on mkt" value={Number.isFinite(m.medianDom) ? Math.round(m.medianDom) : "—"} />
              <Stat label="% of list" value={Number.isFinite(m.medianPctList) ? Math.round(m.medianPctList) + "%" : "—"} />
            </div>
            {m.recent?.length > 0 && (
              <div style={{ marginBottom: 10 }}>
                {m.recent.slice(0, 6).map((r, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 10, fontSize: 13, padding: "4px 0", borderTop: i ? "1px solid #ece8df" : "none" }}>
                    <span style={{ color: "#78716c" }}>{[r.unit ? `#${r.unit}` : null, r.status].filter(Boolean).join(" · ") || "—"}</span>
                    <span style={{ color: "#1c1917", fontWeight: 600 }}>{[fmtUSD(r.price), r.date ? fmtDate(r.date) : null].filter(Boolean).join(" · ")}</span>
                  </div>
                ))}
              </div>
            )}
            <a style={LINK} href={`/listings?building=${encodeURIComponent(profile.objectid)}`}>↗ See all sold / active activity</a>
          </section>
        )}

        {authored?.amenities?.length > 0 && (
          <section style={SEC}>
            <Banner emoji="🛎️">Amenities</Banner>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {authored.amenities.map(a => (
                <span key={a} style={{ fontSize: 12.5, padding: "4px 10px", borderRadius: 8, background: "#fff", border: "1px solid #ece8df", color: "#44403c" }}>{a}</span>
              ))}
            </div>
          </section>
        )}

        {authored?.thingsToKnow?.length > 0 && (
          <section style={SEC}>
            <Banner emoji="⚠️">Things to know</Banner>
            {authored.thingsToKnow.map((t, i) => (
              <div key={i} style={{ background: "#FCEBEB", border: "1px solid #F7C1C1", borderRadius: 8, padding: "10px 12px", marginBottom: i < authored.thingsToKnow.length - 1 ? 8 : 0 }}>
                <p style={{ fontSize: 13.5, lineHeight: 1.55, color: "#501313", margin: 0 }}>{t.text}</p>
                {(t.source || t.date) && (
                  <div style={{ fontSize: 11.5, color: "#A32D2D", marginTop: 5 }}>
                    {[t.source, t.date].filter(Boolean).join(" · ")}
                  </div>
                )}
              </div>
            ))}
          </section>
        )}

        {authored?.website && (
          <section style={SEC}>
            <a style={LINK} href={authored.website} target="_blank" rel="noopener noreferrer">🌐 Building website ↗</a>
          </section>
        )}

        {/* Structural record from the city Tall Building Inventory. */}
        {Object.keys(s).length > 0 && (
          <section style={SEC}>
            <Banner emoji="🏗️">Building &amp; structure</Banner>
            <div>
              {STRUCT_ROWS.filter(([k]) => s[k] != null && s[k] !== "").map(([k, label, unit]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 13, padding: "4px 0", borderBottom: "1px dashed rgba(0,0,0,0.08)" }}>
                  <span style={{ color: "#78716c" }}>{label}</span>
                  <span style={{ color: "#1c1917", fontWeight: 600, textAlign: "right" }}>{s[k]}{unit || ""}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        <p style={{ fontSize: 11.5, color: "#a8a29e", lineHeight: 1.5, margin: "16px 0 0" }}>
          Market figures are computed from recent MLS activity and may lag the live market.
          Building facts are from the SF Tall Building Inventory. Always verify against the
          building's current HOA and resale disclosures before making an offer.
        </p>
      </div>
    </div>
  );
}
