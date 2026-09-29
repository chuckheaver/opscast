"use client";

// The home page's neighborhood map: the live street map with every
// neighborhood outlined and named, and nothing else. Hover highlights one;
// a click opens its guide page (or the full map, for the few neighborhoods
// without a guide page yet). Mouse wheel scrolls the page unless Ctrl/⌘ is
// held, so it never traps someone reading down the page.

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
const SF_BOUNDS = [[-122.515, 37.705], [-122.355, 37.815]];

export default function LiveHoodMap({ guides }) {
  const box = useRef(null);
  const router = useRouter();
  const [failed, setFailed] = useState(!TOKEN);

  useEffect(() => {
    if (!TOKEN || !box.current) return;
    let map;
    try {
      mapboxgl.accessToken = TOKEN;
      map = new mapboxgl.Map({
        container: box.current,
        style: "mapbox://styles/mapbox/streets-v12",
        bounds: SF_BOUNDS, fitBoundsOptions: { padding: 12 },
        minZoom: 10.5, maxZoom: 16,
        cooperativeGestures: true,
      });
    } catch { setFailed(true); return; }
    map.on("error", () => { if (!map.loaded()) setFailed(true); });
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "bottom-right");

    map.on("load", async () => {
      const hoods = await fetch("/data/sf-fog-neighborhoods.geojson").then(r => r.json());
      hoods.features.forEach((f, i) => { f.id = i; });
      map.addSource("hoods", { type: "geojson", data: hoods });
      map.addLayer({ id: "hood-fill", type: "fill", source: "hoods",
        paint: { "fill-color": "#203C5F",
                 "fill-opacity": ["case", ["boolean", ["feature-state", "hover"], false], 0.28, 0.06] } });
      map.addLayer({ id: "hood-lines", type: "line", source: "hoods",
        paint: { "line-color": "#203C5F", "line-width": 1.2, "line-opacity": 0.7 } });
      map.addLayer({ id: "hood-names", type: "symbol", source: "hoods",
        layout: { "text-field": ["get", "name"], "text-size": 11.5, "text-font": ["DIN Pro Medium", "Arial Unicode MS Regular"], "text-max-width": 7 },
        paint: { "text-color": "#131A25", "text-halo-color": "#ffffff", "text-halo-width": 1.5 } });

      let hovered = null;
      map.on("mousemove", "hood-fill", e => {
        const f = e.features[0];
        if (hovered !== null && hovered !== f.id) map.setFeatureState({ source: "hoods", id: hovered }, { hover: false });
        hovered = f.id;
        map.setFeatureState({ source: "hoods", id: hovered }, { hover: true });
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "hood-fill", () => {
        if (hovered !== null) map.setFeatureState({ source: "hoods", id: hovered }, { hover: false });
        hovered = null;
        map.getCanvas().style.cursor = "";
      });
      map.on("click", "hood-fill", e => {
        const name = e.features[0]?.properties?.name;
        if (!name) return;
        const slug = guides[name];
        router.push(slug ? `/neighborhoods/${slug}` : `/fog?hood=${encodeURIComponent(name)}`);
      });
    });
    return () => map && map.remove();
  }, [guides, router]);

  if (failed) return null;
  return <div ref={box} className="lp-hood-map" role="region" aria-label="Map of San Francisco neighborhoods — click one to open its guide" />;
}
