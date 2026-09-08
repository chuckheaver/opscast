'use client';

// Full-viewport "Learn" modal — the educational content from the
// tasting-presentation card (Five Influencers, Winkler regions,
// Six Soil Archetypes, Slope-angle table, Winkler history), minus
// the tasting-menu-specific portion. Opened by the "i" button in the
// sidebar header; closes on X, Esc, or backdrop click.

import { useEffect } from "react";
import { INFLUENCERS, WINKLER, SOILS, SLOPE_TABLE, WINKLER_HISTORY } from "./lib/education-content";

export default function InfoModal({ open, onClose }) {
  useEffect(() => {
    if (!open) return;
    const onKey = e => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="learn-scrim" onClick={onClose}>
      <div
        className="learn-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="learn-title"
        onClick={e => e.stopPropagation()}
      >
        <button className="learn-close" type="button" onClick={onClose} aria-label="Close">×</button>

        <header className="learn-h">
          <div id="learn-title" className="learn-h-title">
            Microclimates &amp; <em>Wine</em> — the physics
          </div>
          <div className="learn-h-sub">
            Five forces shape every wine you'll ever taste: heat, fog, wind, slope aspect, and elevation. This is the reference behind every layer on the map.
          </div>
        </header>

        <div className="learn-body">
          <FiveInfluencers />
          <WinklerReference />
          <SixSoils />
          <SlopeAngle />
          <WinklerHistorySection />
        </div>
      </div>
    </div>
  );
}

function FiveInfluencers() {
  return (
    <section>
      <h2 className="learn-section-title">
        <span>The Five <em>Microclimate Influencers</em></span>
        <span className="learn-section-kicker">what actually moves the needle</span>
      </h2>
      <div className="learn-influencers">
        {INFLUENCERS.map(inf => (
          <div key={inf.name} className="learn-influencer">
            <div className="learn-influencer-h">
              <span aria-hidden="true" style={{ fontSize: 18, lineHeight: 1 }}>{inf.emoji}</span>
              <span className="learn-influencer-name">{inf.name}</span>
              <span className="learn-influencer-tag">{inf.tag}</span>
            </div>
            <div className="learn-influencer-body">{inf.body}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function WinklerReference() {
  return (
    <section>
      <h2 className="learn-section-title">
        <span>Winkler Heat <em>Regions</em></span>
        <span className="learn-section-kicker">UC Davis, 1944 · GDD &gt; 50 °F, Apr–Oct</span>
      </h2>
      <table className="learn-table">
        <thead>
          <tr>
            <th style={{ width: 130 }}>Region</th>
            <th style={{ width: 140 }}>GDD</th>
            <th style={{ width: 150 }}>Afternoon avg</th>
            <th>Grapes it ripens</th>
            <th>Example sites</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(WINKLER).map(w => (
            <tr key={w.region}>
              <td>
                <span className="learn-swatch" style={{ background: w.swatch }} />
                <span className="learn-region">{w.region}</span>
              </td>
              <td>{w.gdd}</td>
              <td>{w.temp}</td>
              <td>{w.grapes.join(" · ")}</td>
              <td>{w.examples.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: 8, fontSize: 11, color: "#78716c", fontStyle: "italic", lineHeight: 1.5 }}>
        <strong>GDD = Growing Degree Days.</strong> Sum of daily-average temps above 50 °F between Apr 1 and Oct 31 — the season when vines actively grow. Region I stays cool (Pinot, Chard); Region IV bakes (Zin, Cab of the bold kind). Click any band on the map for a fuller card.
      </div>
    </section>
  );
}

function SixSoils() {
  return (
    <section>
      <h2 className="learn-section-title">
        <span>The Six <em>Soil Archetypes</em></span>
        <span className="learn-section-kicker">rock + water + drainage = style</span>
      </h2>
      <div className="learn-soils">
        {Object.values(SOILS).map(s => (
          <div key={s.name} className="learn-soil" style={{ borderLeftColor: s.swatch }}>
            <div className="learn-soil-h">
              <span className="learn-soil-name">{s.name}</span>
              <span className="learn-soil-tag">{s.tag}</span>
            </div>
            <div className="learn-soil-traits">{s.traits}</div>
            <div className="learn-soil-list-lbl">Example sites</div>
            <div className="learn-soil-list">{s.sites.join(" · ")}</div>
            <div className="learn-soil-list-lbl">Wines it makes</div>
            <div className="learn-soil-list">{s.wines.join(" · ")}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SlopeAngle() {
  return (
    <section>
      <h2 className="learn-section-title">
        <span>Slope Angle &amp; <em>Angle of Incidence</em></span>
        <span className="learn-section-kicker">why a 30° south face out-ripens the valley floor</span>
      </h2>
      <table className="learn-table">
        <thead>
          <tr>
            <th style={{ width: 160 }}>Slope</th>
            <th style={{ width: 110 }}>Sun vs flat</th>
            <th>What that means in the vineyard</th>
          </tr>
        </thead>
        <tbody>
          {SLOPE_TABLE.map(r => (
            <tr key={r.angle}>
              <td><span className="learn-region">{r.angle}</span></td>
              <td><strong style={{ color: r.gain.startsWith("+") ? "#7b1e2f" : r.gain.startsWith("-") ? "#0369a1" : "#4a3628" }}>{r.gain}</strong></td>
              <td>{r.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: 8, fontSize: 11, color: "#78716c", fontStyle: "italic", lineHeight: 1.5 }}>
        The <strong>angle of incidence</strong> is how directly the sun hits a surface. A 30° south-facing slope in Napa takes ~25 % more solar energy per m² of vine row than the valley floor — that's the difference between Cabernet ripening and Cabernet stalling.
      </div>
    </section>
  );
}

function WinklerHistorySection() {
  return (
    <section>
      <h2 className="learn-section-title">
        <span>Where the Winkler System <em>Came From</em></span>
        <span className="learn-section-kicker">80 years of ripeness data</span>
      </h2>
      <div className="learn-history">
        {Object.values(WINKLER_HISTORY).map(c => (
          <div key={c.title} className="learn-history-col">
            <strong>{c.title}</strong>
            <div>{c.body}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
