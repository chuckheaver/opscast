'use client';

// Left rail. Address search (debounced Mapbox geocoder, SF-scoped) +
// the picked-neighborhood result card.

import { useEffect, useRef, useState } from "react";
import { geocodeSuggest } from "./lib/geocode";
import { fogLabel, fogColor } from "./lib/risk";

export default function FogSidebar({
  picked,
  onPickFromAddress,
  dataErr,
  ready,
  contoursAvailable,
  showContours,
  onToggleContours,
  onUseGeoLocation,
  geoLoading,
  geoErr,
}) {
  const [q, setQ] = useState("");
  const [sugs, setSugs] = useState([]);
  const [open, setOpen] = useState(false);
  const [err, setErr] = useState("");
  const debounceRef = useRef(null);
  const blurTimerRef = useRef(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      if (q.trim().length < 3) {
        setSugs([]);
        return;
      }
      try {
        const results = await geocodeSuggest(q);
        setSugs(results);
        setOpen(true);
      } catch (e) {
        setErr(e.message);
      }
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [q]);

  const pick = sug => {
    setQ(sug.place_name);
    setSugs([]);
    setOpen(false);
    setErr("");
    onPickFromAddress(sug.center, sug.place_name);
  };

  const onBlur = () => {
    blurTimerRef.current = setTimeout(() => setOpen(false), 150);
  };
  const onFocus = () => {
    if (blurTimerRef.current) clearTimeout(blurTimerRef.current);
    if (sugs.length) setOpen(true);
  };

  return (
    <aside className="fog-sidebar">
      <header className="fog-h">
        <div className="fog-brand">Summer Fog Map</div>
        <div className="fog-tag">Jun–Aug</div>
        <div className="fog-note">
          *Satellite historic driven data of the average hrs per day that a specific location receives fog.
        </div>
      </header>

      <label className="fog-lbl">San Francisco address</label>
      <div className="fog-search">
        <div className="fog-search-row">
          <input
            className="fog-input"
            placeholder="1 Dr Carlton B Goodlett Pl…"
            value={q}
            onChange={e => setQ(e.target.value)}
            onFocus={onFocus}
            onBlur={onBlur}
            disabled={!ready}
          />
          <button
            type="button"
            className="fog-geo-btn"
            onClick={onUseGeoLocation}
            disabled={geoLoading || !ready}
            title="Use my current location"
          >
            {geoLoading ? "⏳" : "📍"}
          </button>
        </div>
        {open && sugs.length > 0 && (
          <div className="fog-autocomplete">
            {sugs.map(s => (
              <div
                key={s.id}
                className="fog-autocomplete-item"
                onMouseDown={e => {
                  e.preventDefault();
                  pick(s);
                }}
              >
                <div className="fog-ac-name">{s.text}</div>
                <div className="fog-ac-meta">{s.place_name}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {!ready && !dataErr && (
        <div className="fog-note">Loading neighborhood data…</div>
      )}
      {dataErr && <div className="fog-err">⚠ {dataErr}</div>}
      {err && <div className="fog-err">⚠ {err}</div>}
      {geoErr && <div className="fog-err">⚠ {geoErr}</div>}

      {picked && <Result picked={picked} />}

      {!picked && ready && (
        <div className="fog-empty">
          Search for an address above, or click a neighborhood on the map.
        </div>
      )}

      {contoursAvailable && (
        <label className="fog-toggle">
          <input
            type="checkbox"
            checked={showContours}
            onChange={e => onToggleContours(e.target.checked)}
          />
          <span className="fog-toggle-label">Show fog data</span>
          <span className="fog-toggle-help">
            Toggle the colored USGS fog contour layer on or off. Off shows
            just the neighborhood outlines on the basemap.
          </span>
        </label>
      )}


      <footer className="fog-footer">
        <div>
          Fog data: USGS GOES summertime fog &amp; low-cloud indices, 1999–2009
          (Torregrosa et al., 2016). Neighborhood boundaries: DataSF.
        </div>
      </footer>
    </aside>
  );
}

function Result({ picked }) {
  const f = picked.feature;
  const contourHours = picked.contour?.properties?.hours;
  const neighborhoodHours = f?.properties?.fogHours;

  // No neighborhood AND no contour — totally outside coverage.
  if (!f && contourHours == null) {
    return (
      <div className="fog-result fog-result-miss">
        <div className="fog-result-h">Outside coverage</div>
        <div className="fog-result-sub">{picked.address}</div>
        <p>This point falls outside the Bay Area fog dataset.</p>
      </div>
    );
  }

  // Inside the Bay Area contours but outside the SF neighborhood layer.
  // Still show the fog value — just without the neighborhood-average sidebar.
  if (!f) {
    return (
      <div className="fog-result">
        <div className="fog-result-score" style={{ background: fogColor(contourHours) }}>
          <div className="fog-score-num">{contourHours.toFixed(1)}</div>
          <div className="fog-score-unit">summer fog hrs / day · at this point</div>
        </div>
        <div className="fog-result-label">{fogLabel(contourHours)}</div>
        <div className="fog-result-h">Outside SF</div>
        {picked.address && (
          <div className="fog-result-sub">{picked.address}</div>
        )}
      </div>
    );
  }

  // Inside SF — prefer the point-specific contour value over the
  // neighborhood average, but show both when they differ.
  const primary = contourHours ?? neighborhoodHours;
  const source = contourHours != null ? "at this point" : "neighborhood avg";
  return (
    <div className="fog-result">
      <div className="fog-result-score" style={{ background: fogColor(primary) }}>
        <div className="fog-score-num">{primary.toFixed(1)}</div>
        <div className="fog-score-unit">summer fog hrs / day · {source}</div>
      </div>
      <div className="fog-result-label">{fogLabel(primary)}</div>
      <div className="fog-result-h">{f.properties.name}</div>
      {picked.address && (
        <div className="fog-result-sub">{picked.address}</div>
      )}
      {contourHours != null && contourHours !== neighborhoodHours && (
        <div className="fog-result-aux">
          Neighborhood avg: {neighborhoodHours.toFixed(1)} hrs / day
        </div>
      )}
    </div>
  );
}
