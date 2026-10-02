'use client';

// A snapshot of one neighborhood in its city: the map framed on the
// neighborhood with its neighbors outlined and named around it. Not a map to
// pan — the whole card is a link that opens the full map on this
// neighborhood. Renders nothing if Mapbox can't load, so the page never
// shows a broken frame.

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

function bboxOf(features) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  const walk = c => {
    if (typeof c[0] === "number") {
      if (c[0] < x0) x0 = c[0]; if (c[0] > x1) x1 = c[0];
      if (c[1] < y0) y0 = c[1]; if (c[1] > y1) y1 = c[1];
    } else c.forEach(walk);
  };
  features.forEach(f => walk(f.geometry.coordinates));
  return [[x0, y0], [x1, y1]];
}

export default function HoodPreviewMap({ name, label, polygons }) {
  const ref = useRef(null);
  const [failed, setFailed] = useState(!TOKEN);
  const href = `/fog?hood=${encodeURIComponent(name)}`;

  useEffect(() => {
    if (!TOKEN || !ref.current) return;
    mapboxgl.accessToken = TOKEN;
    let map;
    try {
      map = new mapboxgl.Map({
        container: ref.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [-122.44, 37.76], zoom: 12,
        interactive: false, attributionControl: false,
      });
    } catch { setFailed(true); return; }
    // Hide the frame only if the map never comes up — a stray tile or font
    // error after that shouldn't blank an otherwise working map.
    let up = false;
    const giveUp = setTimeout(() => { if (!up) setFailed(true); }, 10000);
    map.on("load", async () => {
      up = true; clearTimeout(giveUp);
      let fc;
      try { fc = await (await fetch("/data/sf-fog-neighborhoods.geojson")).json(); }
      catch { setFailed(true); return; }
      const mine = fc.features.filter(f => polygons.includes(f.properties?.name));
      if (!mine.length) { setFailed(true); return; }
      map.addSource("hoods", { type: "geojson", data: fc });
      // Labels read their own copy, so the outlines never wait on fonts.
      map.addSource("hood-labels", { type: "geojson", data: fc });
      map.addSource("mine", { type: "geojson", data: { type: "FeatureCollection", features: mine } });
      map.addLayer({ id: "hood-tint", type: "fill", source: "hoods",
        paint: { "fill-color": "#203C5F", "fill-opacity": 0.05 } });
      map.addLayer({ id: "hood-lines", type: "line", source: "hoods",
        paint: { "line-color": "#203C5F", "line-opacity": 0.45, "line-width": 1 } });
      map.addLayer({ id: "mine-fill", type: "fill", source: "mine",
        paint: { "fill-color": "#203C5F", "fill-opacity": 0.32 } });
      map.addLayer({ id: "mine-line", type: "line", source: "mine",
        paint: { "line-color": "#131A25", "line-width": 2.6 } });
      map.addLayer({ id: "hood-names", type: "symbol", source: "hood-labels",
        layout: { "text-field": ["get", "name"], "text-size": 11.5, "text-font": ["DIN Pro Medium", "Arial Unicode MS Regular"],
                  "text-max-width": 8 },
        paint: { "text-color": "#131A25", "text-halo-color": "#ffffff", "text-halo-width": 1.4 } });
      // Frame the neighborhood at the center of a ring of its neighbors:
      // about 1.4x its own size on every side, never tighter than ~1 km.
      const [[x0, y0], [x1, y1]] = bboxOf(mine);
      const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
      const hw = Math.max((x1 - x0) * 1.4, 0.012), hh = Math.max((y1 - y0) * 1.4, 0.008);
      map.fitBounds([[cx - hw, cy - hh], [cx + hw, cy + hh]], { padding: 0, duration: 0 });
    });
    return () => { clearTimeout(giveUp); map.remove(); };
  }, [name, polygons]);

  if (failed) return null;
  return (
    <section className="lp-nsec lp-nmap-sec">
      <h2>On the map</h2>
      <Link href={href} className="lp-nmap" aria-label={`Open ${label} on the interactive map`}>
        <div ref={ref} className="lp-nmap-canvas" />
        <span className="lp-nmap-cta">Open {label} on the map →</span>
      </Link>
    </section>
  );
}
