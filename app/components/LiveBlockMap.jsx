"use client";

// The home page's live map: the same Mapbox street map the full map uses,
// with the neighborhood outlines and names and a blue dot for every home
// sold this year. The dots come from public/data/sold-points-ytd.json,
// which scripts/build-landing-stats.mjs rewrites on every data load — so
// this updates with the data, no screenshot to refresh.
//
// It pans and pinch-zooms, but a mouse wheel scrolls the page (hold Ctrl or
// ⌘ to zoom), so it never traps someone reading down the page. If Mapbox
// cannot load, the picture of the map stands in.

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
const SF_BOUNDS = [[-122.515, 37.705], [-122.355, 37.815]];

export default function LiveBlockMap({ fallback }) {
  const box = useRef(null);
  const [failed, setFailed] = useState(!TOKEN);

  useEffect(() => {
    if (!TOKEN || !box.current) return;
    let map;
    try {
      mapboxgl.accessToken = TOKEN;
      map = new mapboxgl.Map({
        container: box.current,
        style: "mapbox://styles/mapbox/streets-v12",
        bounds: SF_BOUNDS,
        fitBoundsOptions: { padding: 12 },
        minZoom: 10.5, maxZoom: 17,
        cooperativeGestures: true,
        attributionControl: true,
      });
    } catch {
      setFailed(true);
      return;
    }
    map.on("error", e => { if (!map.loaded()) setFailed(true); });
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "bottom-right");

    map.on("load", async () => {
      const [hoods, sold] = await Promise.all([
        fetch("/data/sf-fog-neighborhoods.geojson").then(r => r.json()),
        fetch("/data/sold-points-ytd.json").then(r => r.json()),
      ]);
      map.addSource("hoods", { type: "geojson", data: hoods });
      map.addLayer({ id: "hood-lines", type: "line", source: "hoods",
        paint: { "line-color": "#334155", "line-width": 1, "line-opacity": 0.55 } });
      map.addSource("sold", { type: "geojson", data: {
        type: "FeatureCollection",
        features: sold.points.map(c => ({ type: "Feature", geometry: { type: "Point", coordinates: c } })),
      } });
      map.addLayer({ id: "sold-dots", type: "circle", source: "sold",
        paint: {
          "circle-radius": ["interpolate", ["linear"], ["zoom"], 11, 2.6, 13, 4, 15, 6],
          "circle-color": "#2563eb", "circle-stroke-color": "#ffffff", "circle-stroke-width": 1,
          "circle-opacity": 0.9,
        } });
      map.addLayer({ id: "hood-names", type: "symbol", source: "hoods",
        layout: { "text-field": ["get", "name"], "text-size": 11, "text-font": ["DIN Pro Medium", "Arial Unicode MS Regular"],
                  "text-max-width": 7, "symbol-placement": "point" },
        paint: { "text-color": "#1f2937", "text-halo-color": "#ffffff", "text-halo-width": 1.4 } });
    });
    return () => map && map.remove();
  }, []);

  if (failed) return fallback;
  return <div ref={box} className="lp-live-map" role="region" aria-label="Live map of San Francisco with this year's sold homes" />;
}
