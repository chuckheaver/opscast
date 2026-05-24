'use client';

// Mapbox canvas for the micro-climate page. Renders the SF neighborhood
// outlines + labels and the three terrain-derived sub-zone fills (sun /
// wind / fog), each toggleable, plus a marker for the picked address.
//
// Data + toggle state are mirrored into refs so the stable addLayers /
// applyVisibility callbacks always read the latest values — this avoids
// the stale-closure race when the GeoJSON loads before the map style.

import { useCallback, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
const SF_BOUNDS = [
  [-122.520, 37.708],
  [-122.355, 37.812],
];

const ZONE_COLOR = {
  sun: "#f59e0b",  // amber — warm 20–30° south-facing sun pockets
  cool: "#38bdf8", // sky blue — cooler north-facing slopes
  wind: "#2dd4bf", // teal — wind-channeling valleys
  fog: "#a78bfa",  // violet — persistent-fog ridges
};

export default function MicroMap({
  neighborhoods,
  zones,
  showSun,
  showCool,
  showWind,
  showFog,
  showContours,
  showNeighborhoods,
  picked,
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const readyRef = useRef(false);

  // Latest data + toggle state, readable from the stable callbacks below.
  const dataRef = useRef({ neighborhoods, zones });
  const visRef = useRef({ showSun, showCool, showWind, showFog, showContours, showNeighborhoods });

  const applyVisibility = useCallback(() => {
    const map = mapRef.current;
    if (!map || !readyRef.current) return;
    const v = visRef.current;
    const set = (id, on) => {
      if (map.getLayer(id)) map.setLayoutProperty(id, "visibility", on ? "visible" : "none");
    };
    set("micro-sun-fill", v.showSun);   set("micro-sun-line", v.showSun);
    set("micro-cool-fill", v.showCool); set("micro-cool-line", v.showCool);
    set("micro-wind-fill", v.showWind); set("micro-wind-line", v.showWind);
    set("micro-fog-fill", v.showFog);   set("micro-fog-line", v.showFog);
    set("micro-contour-lines", v.showContours);
    set("micro-contour-labels", v.showContours);
    set("micro-contour-peaks", v.showContours);
    set("micro-neigh-outline", v.showNeighborhoods);
    set("micro-neigh-labels", v.showNeighborhoods);
  }, []);

  const addLayers = useCallback(() => {
    const map = mapRef.current;
    if (!map || !readyRef.current) return;
    const { neighborhoods: neigh, zones: zn } = dataRef.current;

    if (zn && !map.getSource("micro-zones")) {
      map.addSource("micro-zones", { type: "geojson", data: zn });
      ["sun", "cool", "wind", "fog"].forEach(zone => {
        map.addLayer({
          id: `micro-${zone}-fill`,
          type: "fill",
          source: "micro-zones",
          filter: ["==", ["get", "zone"], zone],
          paint: { "fill-color": ZONE_COLOR[zone], "fill-opacity": 0.42 },
        });
        map.addLayer({
          id: `micro-${zone}-line`,
          type: "line",
          source: "micro-zones",
          filter: ["==", ["get", "zone"], zone],
          paint: { "line-color": ZONE_COLOR[zone], "line-width": 1, "line-opacity": 0.85 },
        });
      });
    }

    // Elevation contour LINES come from Mapbox Terrain v2 (smooth, accurate
    // vector tiles); we only relabel them in feet. Topo-brown, darkening
    // with elevation; index contours (every 100 m) drawn heavier.
    if (!map.getSource("micro-terrain")) {
      map.addSource("micro-terrain", { type: "vector", url: "mapbox://mapbox.mapbox-terrain-v2" });
      map.addLayer({
        id: "micro-contour-lines",
        type: "line",
        source: "micro-terrain",
        "source-layer": "contour",
        layout: { visibility: "none", "line-cap": "round", "line-join": "round" },
        paint: {
          "line-color": [
            "interpolate", ["linear"], ["get", "ele"],
            0,   "#6b3f1e",  // low ground — deep tan-brown
            120, "#4a2c12",  // mid slopes — dark brown
            285, "#26160a",  // ridgelines/peaks — near-espresso
          ],
          "line-width": ["match", ["get", "index"], 10, 2, 5, 1.3, 0.9],
          "line-opacity": ["match", ["get", "index"], 10, 1, 5, 0.95, 0.8],
        },
      });
      // Relabel the metric contours in feet: round(ele_m × 3.28084) + " ft".
      // No index filter — lower contour lines get labelled too (Mapbox
      // collision-thins them); index (100 m) lines are drawn a bit larger.
      map.addLayer({
        id: "micro-contour-labels",
        type: "symbol",
        source: "micro-terrain",
        "source-layer": "contour",
        layout: {
          visibility: "none",
          "text-field": ["concat", ["to-string", ["round", ["*", ["get", "ele"], 3.28084]]], " ft"],
          "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
          "text-size": ["match", ["get", "index"], 10, 11, 9.5],
          "text-padding": 10,
          "symbol-placement": "line",
          "symbol-spacing": 300,
          "text-allow-overlap": false,
        },
        paint: {
          "text-color": "#3d2410",
          "text-halo-color": "#ffffff",
          "text-halo-width": 1.6,
          "text-opacity": ["interpolate", ["linear"], ["zoom"], 12.5, 0, 13.5, 1],
        },
      });
    }
    // Hill peak labels from the DEM — always-on (higher peaks win
    // collisions) so every hilltop shows its elevation in feet.
    if (!map.getSource("micro-peaks")) {
      map.addSource("micro-peaks", { type: "geojson", data: "/data/sf-peaks.geojson" });
      map.addLayer({
        id: "micro-contour-peaks",
        type: "symbol",
        source: "micro-peaks",
        layout: {
          visibility: "none",
          "text-field": ["concat", "▲ ", ["to-string", ["get", "ele_ft"]], " ft"],
          "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
          "text-size": 12,
          "symbol-sort-key": ["-", 0, ["get", "ele_ft"]], // higher peaks first
          "text-allow-overlap": false,
          "text-padding": 2,
        },
        paint: {
          "text-color": "#26160a",
          "text-halo-color": "#ffffff",
          "text-halo-width": 2,
        },
      });
    }

    // Neighborhood outline + labels go ON TOP of the zone fills.
    if (neigh && !map.getSource("micro-neigh")) {
      map.addSource("micro-neigh", { type: "geojson", data: neigh });
      map.addLayer({
        id: "micro-neigh-outline",
        type: "line",
        source: "micro-neigh",
        paint: { "line-color": "#1c1917", "line-opacity": 0.5, "line-width": 0.7 },
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
    applyVisibility();
  }, [applyVisibility]);

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
  }, [addLayers]);

  // Data arrives (possibly after or before map load) → refresh refs + add.
  useEffect(() => {
    dataRef.current = { neighborhoods, zones };
    addLayers();
  }, [neighborhoods, zones, addLayers]);

  // Toggle changes → refresh refs + apply.
  useEffect(() => {
    visRef.current = { showSun, showCool, showWind, showFog, showContours, showNeighborhoods };
    applyVisibility();
  }, [showSun, showCool, showWind, showFog, showContours, showNeighborhoods, applyVisibility]);

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
