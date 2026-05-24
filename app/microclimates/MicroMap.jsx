'use client';

// Mapbox canvas for the micro-climate page. Renders the SF neighborhood
// outlines + labels and the three terrain-derived sub-zone fills (sun /
// wind / fog), each toggleable, plus a marker for the picked address.

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
const SF_BOUNDS = [
  [-122.520, 37.708],
  [-122.355, 37.812],
];

// Per-zone fill colours — distinct from the grey fog scale on /fog.
const ZONE_COLOR = {
  sun: "#f59e0b",  // amber — warm south-facing slopes
  wind: "#22d3ee", // cyan — wind-channeling valleys
  fog: "#818cf8",  // indigo — persistent-fog ridges
};

export default function MicroMap({
  neighborhoods,
  zones,
  showSun,
  showWind,
  showFog,
  showNeighborhoods,
  picked,
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const readyRef = useRef(false);

  // Mount once.
  useEffect(() => {
    if (!TOKEN || mapRef.current) return;
    mapboxgl.accessToken = TOKEN;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      bounds: SF_BOUNDS,
      fitBoundsOptions: { padding: 24 },
      minZoom: 10,
      maxZoom: 16,
    });
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");
    mapRef.current = map;
    map.on("load", () => {
      readyRef.current = true;
      addLayers();
    });
    return () => { map.remove(); mapRef.current = null; readyRef.current = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Build sources + layers once both the map and the data are ready.
  const addLayers = () => {
    const map = mapRef.current;
    if (!map || !readyRef.current) return;

    if (neighborhoods && !map.getSource("micro-neigh")) {
      map.addSource("micro-neigh", { type: "geojson", data: neighborhoods });
      map.addLayer({
        id: "micro-neigh-outline",
        type: "line",
        source: "micro-neigh",
        paint: { "line-color": "#1c1917", "line-opacity": 0.55, "line-width": 0.7 },
      });
      map.addLayer({
        id: "micro-neigh-labels",
        type: "symbol",
        source: "micro-neigh",
        layout: {
          "text-field": ["get", "name"],
          "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
          "text-size": ["interpolate", ["linear"], ["zoom"], 11, 9, 13, 11, 15, 13],
          "text-max-width": 8,
          "text-allow-overlap": false,
        },
        paint: {
          "text-color": "#1c1917",
          "text-halo-color": "#ffffff",
          "text-halo-width": 1.4,
          "text-opacity": ["interpolate", ["linear"], ["zoom"], 10.5, 0, 11.5, 0.85, 14, 1],
        },
      });
    }

    if (zones && !map.getSource("micro-zones")) {
      map.addSource("micro-zones", { type: "geojson", data: zones });
      // Insert zone fills BENEATH the neighborhood outline so labels/edges
      // stay readable on top.
      const before = map.getLayer("micro-neigh-outline") ? "micro-neigh-outline" : undefined;
      ["sun", "wind", "fog"].forEach(zone => {
        map.addLayer({
          id: `micro-${zone}-fill`,
          type: "fill",
          source: "micro-zones",
          filter: ["==", ["get", "zone"], zone],
          paint: { "fill-color": ZONE_COLOR[zone], "fill-opacity": 0.42 },
        }, before);
        map.addLayer({
          id: `micro-${zone}-line`,
          type: "line",
          source: "micro-zones",
          filter: ["==", ["get", "zone"], zone],
          paint: { "line-color": ZONE_COLOR[zone], "line-width": 1, "line-opacity": 0.8 },
        }, before);
      });
    }
    applyVisibility();
  };

  const applyVisibility = () => {
    const map = mapRef.current;
    if (!map || !readyRef.current) return;
    const set = (id, on) => {
      if (map.getLayer(id)) map.setLayoutProperty(id, "visibility", on ? "visible" : "none");
    };
    set("micro-sun-fill", showSun);  set("micro-sun-line", showSun);
    set("micro-wind-fill", showWind); set("micro-wind-line", showWind);
    set("micro-fog-fill", showFog);  set("micro-fog-line", showFog);
    set("micro-neigh-outline", showNeighborhoods);
    set("micro-neigh-labels", showNeighborhoods);
  };

  // Add layers when data arrives after the map has loaded.
  useEffect(() => {
    if (readyRef.current) addLayers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [neighborhoods, zones]);

  // Reflect toggle changes.
  useEffect(() => {
    applyVisibility();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showSun, showWind, showFog, showNeighborhoods]);

  // Picked address → drop a marker, keep the city framed.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (markerRef.current) { markerRef.current.remove(); markerRef.current = null; }
    if (!picked?.point) return;
    markerRef.current = new mapboxgl.Marker({ color: "#2563eb" }).setLngLat(picked.point).addTo(map);
    map.fitBounds(SF_BOUNDS, { padding: 24, duration: 800 });
  }, [picked]);

  if (!TOKEN) {
    return (
      <div className="fog-map-missing-token">
        <div>
          <h2>Map unavailable</h2>
          <p>Set <code>NEXT_PUBLIC_MAPBOX_TOKEN</code> to enable the map.</p>
        </div>
      </div>
    );
  }
  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
}
