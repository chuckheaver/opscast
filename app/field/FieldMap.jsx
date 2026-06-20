'use client';

// Walking-route map for a neighborhood's field kit: the neighborhood outline,
// the suggested walking route, and numbered pins for the interesting spots.
// Deliberately minimal (no terrain/hillshade) so it loads clean. Use it in the
// field to follow the route, and screen-record the trace for the video.

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

function bboxOf(coords, pad = 0.0015) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const [x, y] of coords) { if (x < minX) minX = x; if (y < minY) minY = y; if (x > maxX) maxX = x; if (y > maxY) maxY = y; }
  return [[minX - pad, minY - pad], [maxX + pad, maxY + pad]];
}
function allCoords(geom) {
  const t = geom.type, c = geom.coordinates;
  if (t === "Polygon") return c.flat();
  if (t === "MultiPolygon") return c.flat(2);
  return [];
}

export default function FieldMap({ name, route }) {
  const ref = useRef(null);
  const mapRef = useRef(null);
  const featRef = useRef(null); // cached neighborhood polygon
  const [sat, setSat] = useState(false);
  const [err, setErr] = useState(null);

  // (Re)add the outline + route line as sources/layers. Safe to call again
  // after a style swap (which drops custom layers). DOM markers persist.
  function addOverlays(map) {
    const feat = featRef.current;
    if (feat && !map.getSource("hood")) {
      map.addSource("hood", { type: "geojson", data: feat });
      map.addLayer({ id: "hood-fill", type: "fill", source: "hood", paint: { "fill-color": "#2563eb", "fill-opacity": 0.06 } });
      map.addLayer({ id: "hood-line", type: "line", source: "hood", paint: { "line-color": "#2563eb", "line-width": 2, "line-dasharray": [2, 1] } });
    }
    if (route?.path?.length > 1 && !map.getSource("route")) {
      map.addSource("route", { type: "geojson", data: { type: "Feature", geometry: { type: "LineString", coordinates: route.path } } });
      map.addLayer({ id: "route-line", type: "line", source: "route", layout: { "line-cap": "round", "line-join": "round" }, paint: { "line-color": "#ef4444", "line-width": 4, "line-opacity": 0.9 } });
    }
  }

  useEffect(() => {
    if (!TOKEN) { setErr("map token not set"); return; }
    if (!ref.current || mapRef.current) return;
    mapboxgl.accessToken = TOKEN;
    const map = new mapboxgl.Map({
      container: ref.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: route?.spots?.[0]?.coord || [-122.4194, 37.7749],
      zoom: 13.5,
    });
    mapRef.current = map;
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");

    map.on("load", async () => {
      try {
        const fc = await (await fetch("/data/sf-fog-neighborhoods.geojson")).json();
        featRef.current = fc.features.find(f => f.properties?.name === name) || null;
      } catch { featRef.current = null; }
      addOverlays(map);
      if (featRef.current) map.fitBounds(bboxOf(allCoords(featRef.current.geometry)), { padding: 30, duration: 0 });

      // Numbered spot markers (added once; survive style swaps).
      for (const s of route?.spots || []) {
        const el = document.createElement("div");
        el.textContent = String(s.n);
        Object.assign(el.style, {
          width: "26px", height: "26px", borderRadius: "50%", background: "#ef4444", color: "#fff",
          fontSize: "13px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center",
          border: "2px solid #fff", boxShadow: "0 1px 4px rgba(0,0,0,0.4)", cursor: "pointer",
        });
        const popup = new mapboxgl.Popup({ offset: 16, closeButton: false }).setHTML(
          `<div style="font-size:13px"><strong>${s.n}. ${s.name}</strong>${s.note ? `<br/><span style="color:#555">${s.note}</span>` : ""}</div>`
        );
        new mapboxgl.Marker({ element: el, anchor: "center" }).setLngLat(s.coord).setPopup(popup).addTo(map);
      }
    });

    // Re-add overlays whenever the base style changes (satellite toggle).
    map.on("style.load", () => { if (mapRef.current) addOverlays(map); });

    return () => { map.remove(); mapRef.current = null; };
  }, [name, route]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.setStyle(sat ? "mapbox://styles/mapbox/satellite-streets-v12" : "mapbox://styles/mapbox/streets-v12");
  }, [sat]);

  if (err) {
    return <div style={NOTE}>Route map unavailable ({err}); the numbered stops are listed below.</div>;
  }

  return (
    <div style={{ marginTop: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#854F0B" }}>🚶 Walking route</span>
        <button onClick={() => setSat(s => !s)} style={{ fontSize: 12, fontWeight: 600, padding: "4px 9px", borderRadius: 7, border: "1px solid #ddd8d0", background: "#fff", color: "#44403c", cursor: "pointer" }}>
          {sat ? "Streets" : "Satellite"}
        </button>
      </div>
      <div ref={ref} style={{ height: 340, width: "100%", borderRadius: 12, overflow: "hidden", border: "1px solid #e2e8f0" }} />
      {route?.spots?.length > 0 && (
        <ol style={{ margin: "10px 0 0", paddingLeft: 22 }}>
          {route.spots.map(s => (
            <li key={s.n} style={{ fontSize: 13.5, lineHeight: 1.5, color: "#1c1917" }}>
              <strong>{s.name}</strong>{s.note ? <span style={{ color: "#78716c" }}> — {s.note}</span> : null}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

const NOTE = { marginTop: 14, padding: "10px 12px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, fontSize: 13, color: "#7f1d1d" };
