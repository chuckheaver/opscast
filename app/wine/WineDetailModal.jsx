'use client';

// Appellation / winery detail, shown as a modal (mirrors the fog map's
// NeighborhoodModal: heading + subtitle + a bulleted at-a-glance list). Opens
// when the user clicks the map, searches an address, uses "find me", or picks
// an AVA / winery from the toolbar chips. Replaces the old bottom WinePanel.

import { useState, useEffect } from "react";
import { fogMicroclimate, typicalGrapes } from "./lib/avas";
import { formatSoil } from "./WineMap";
import { hasWineProfile } from "./lib/grapes";

// Grape names, comma-separated, with the ones we have a profile for as links.
function GrapeList({ names, onGrapeClick }) {
  return (
    <>
      {names.map((name, i) => (
        <span key={`${name}-${i}`}>
          {i > 0 ? ", " : ""}
          {hasWineProfile(name) && onGrapeClick ? (
            <button type="button" className="grape-link" onClick={() => onGrapeClick(name)}>{name}</button>
          ) : name}
        </span>
      ))}
    </>
  );
}

function linkLabel(url) {
  try { return new URL(url).hostname.replace(/^(www|en)\./, ""); } catch { return "link"; }
}

export default function WineDetailModal({
  picked, selected, onSelect,
  varietalsByAva = {}, fogByAva = {}, wineriesByAva = {},
  onGrapeClick, onClose,
}) {
  const [listOpen, setListOpen] = useState(false);
  const winery = picked?.winery;
  const p = selected?.properties;

  useEffect(() => { setListOpen(false); }, [p?.ava_id, winery]);

  // Esc to close.
  useEffect(() => {
    const onKey = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!picked) return null;

  const avaWineries = (p && wineriesByAva[p.name]) || [];
  const avaFog = p ? fogByAva[p.name] : null;
  const climateLabel = avaFog != null ? `${fogMicroclimate(avaFog)} · ~${avaFog.toFixed(1)} hr fog/day` : null;
  const knownFor = (p && varietalsByAva[p.name]) || [];
  const soil = picked?.soil;
  const soilLabel = formatSoil(soil);
  const grapes = typicalGrapes(soil?.order, avaFog);
  const countyLabel = p ? [p.inNapa && "Napa", p.inSonoma && "Sonoma"].filter(Boolean).join(" & ") : null;
  const within = p?.within?.filter(w => w !== "North Coast") || [];
  const withinLabel = p ? ((within.length ? within : p.within || []).join(", ") || null) : null;

  // The appellation stack at the clicked point (smallest-first), so the user
  // can switch which appellation the detail describes.
  const stack = (!winery && picked?.stack) || [];

  // Build the bullet rows. Each is { label, value } where value may be JSX.
  const bullets = [];
  if (winery) {
    if (winery.address) bullets.push(["Address", winery.address]);
    bullets.push(["Appellation", winery.ava || "Outside any AVA"]);
    const href = winery.website || winery.listingUrl;
    if (href) bullets.push(["Website", <a href={href} target="_blank" rel="noreferrer">{linkLabel(href)} ↗</a>]);
  } else if (p) {
    if (countyLabel) bullets.push(["County", countyLabel]);
    if (p.established) bullets.push(["AVA established", p.established]);
    if (withinLabel) bullets.push(["Part of", withinLabel]);
    bullets.push(["Sub-AVAs", p.contains?.length ? `${p.contains.length} — ${p.contains.join(", ")}` : "None"]);
    if (avaWineries.length > 0) bullets.push(["Wineries", (
      <button type="button" className="wine-count-link" onClick={() => setListOpen(o => !o)}>
        {avaWineries.length} {listOpen ? "▾" : "›"}
      </button>
    )]);
    if (climateLabel) bullets.push(["Climate", climateLabel]);
    if (knownFor.length > 0) bullets.push(["Known for", <GrapeList names={knownFor.slice(0, 5).map(v => v.variety)} onGrapeClick={onGrapeClick} />]);
    if (soilLabel) bullets.push(["Soil (at point)", soilLabel]);
    if (grapes) bullets.push(["Typical grapes", (
      <><GrapeList names={grapes.list} onGrapeClick={onGrapeClick} />{grapes.character ? <span className="wine-soil-note"> · {grapes.character}</span> : null}</>
    )]);
  }

  const heading = winery ? winery.name : (p ? p.name : "Outside any AVA");
  const subtitle = winery ? "Winery" : "Appellation";

  return (
    <div className="nh-backdrop" onClick={onClose}>
      <div className="nh-modal" onClick={e => e.stopPropagation()} role="dialog" aria-label={`${heading} details`}>
        <button className="nh-x" onClick={onClose} aria-label="Close">×</button>

        <div style={{ fontSize: 22, fontWeight: 800, color: "#1c1917", lineHeight: 1.1, letterSpacing: "-0.5px" }}>
          {winery ? <>🍷 {heading}</> : heading}
        </div>
        <div style={{ fontSize: 13, color: "#78716c", marginTop: 3 }}>{subtitle}</div>

        {/* Appellation stack — pick a different AVA at this spot. */}
        {stack.length > 1 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, margin: "10px 0 2px" }}>
            {stack.map(f => (
              <button
                key={f.properties.ava_id}
                type="button"
                className={"wine-stack-chip" + (f.properties.ava_id === p?.ava_id ? " on" : "")}
                onClick={() => onSelect(f)}
              >
                {f.properties.name}
              </button>
            ))}
          </div>
        )}

        {bullets.length > 0 && (
          <ul style={{ margin: "10px 0 2px", padding: "0 0 0 18px", listStyle: "disc" }}>
            {bullets.map(([label, value]) => (
              <li key={label} style={{ fontSize: 13.5, color: "#57534e", lineHeight: 1.55, marginBottom: 3 }}>
                <span style={{ color: "#78716c" }}>{label}:</span> {value}
              </li>
            ))}
          </ul>
        )}

        {/* Inline winery roster for this AVA. */}
        {listOpen && avaWineries.length > 0 && (
          <div style={{ marginTop: 10, borderTop: "1px solid #ece8df", paddingTop: 10 }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: "#1c1917", marginBottom: 6 }}>
              {avaWineries.length} wineries · {p.name}
            </div>
            {avaWineries.map((w, i) => (
              <div key={`${w.name}-${i}`} style={{ padding: "6px 0", borderTop: i === 0 ? "none" : "1px solid #f0ece6" }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1c1917" }}>{w.name}</div>
                <div style={{ fontSize: 12, color: "#78716c" }}>{w.address || "—"}</div>
                {w.website && (
                  <a href={w.website} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: "#2563eb" }}>
                    {linkLabel(w.website)} ↗
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
