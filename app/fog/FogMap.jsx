'use client';

// Mapbox GL JS map. Renders the SF neighborhood polygons colored by
// fog hours, and lets the user click one. The picked-point marker is
// driven by the parent (so address searches and map clicks share state).

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { riskColorStops, TRANSITION_RANGE } from "./lib/risk";

// 32×32 canvas pattern: light-yellow background with a few small grey
// cloud puffs weighted toward the west side of the tile. Read across a
// polygon's tiled fill, that lopsided distribution suggests marine layer
// spilling in from the Pacific. Used as the fog-transition fill-pattern.
//
// Each puff = [centerX, centerY, radius] in canvas coordinates.
// Two small clusters, both biased to the western half (x < 16):
const SCATTERED_PUFFS = [
  // Upper-left cluster — slightly bigger (the western "front edge")
  [5, 8, 2.5],
  [8, 8, 3],
  [11, 8, 2.5],
  [8, 6, 2],
  // Lower-left wisp — trailing, smaller
  [4, 22, 2],
  [7, 23, 2.5],
];

function buildScatteredCloudsPattern() {
  const size = 32;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#fef08a";
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = "rgba(120, 113, 108, 0.85)";
  SCATTERED_PUFFS.forEach(([cx, cy, r]) => {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  });
  return ctx.getImageData(0, 0, size, size);
}

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
const SF_CENTER = [-122.447, 37.7649];

export default function FogMap({ geojson, picked, onPickFeature }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const dataAppliedRef = useRef(false);
  const onPickRef = useRef(onPickFeature);

  // Keep latest click handler reachable from the map's event listener
  // without re-binding on every render.
  useEffect(() => {
    onPickRef.current = onPickFeature;
  }, [onPickFeature]);

  // Mount the map exactly once.
  useEffect(() => {
    if (!TOKEN) return;
    if (mapRef.current) return;
    mapboxgl.accessToken = TOKEN;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: SF_CENTER,
      zoom: 11.2,
      minZoom: 10,
      maxZoom: 16,
    });
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");
    mapRef.current = map;

    map.on("load", () => {
      // Register the scattered-clouds pattern before any layer uses it.
      if (!map.hasImage("scattered-clouds")) {
        map.addImage("scattered-clouds", buildScatteredCloudsPattern());
      }
      map.addSource("fog", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
        promoteId: "id",
      });
      map.addLayer({
        id: "fog-fill",
        type: "fill",
        source: "fog",
        // Skip the transition band on the base layer so the pattern overlay
        // below isn't tinted by the underlying yellow→grey interpolation.
        filter: ["any",
          ["<", ["coalesce", ["get", "fogHours"], 0], TRANSITION_RANGE[0]],
          [">", ["coalesce", ["get", "fogHours"], 0], TRANSITION_RANGE[1]],
        ],
        paint: {
          "fill-color": [
            "interpolate",
            ["linear"],
            ["coalesce", ["get", "fogHours"], 0],
            ...riskColorStops.flat(),
          ],
          "fill-opacity": [
            "case",
            ["boolean", ["feature-state", "picked"], false],
            0.9,
            0.72,
          ],
        },
      });
      // Transition-zone overlay: sparse scattered-clouds pattern on a
      // light-yellow base, weighted toward the western edge of each tile
      // so the polygon reads as marine layer rolling in from the Pacific.
      // Filter mirrors the Sun/Fog split above so every feature is
      // rendered by exactly one fill layer.
      map.addLayer({
        id: "fog-transition",
        type: "fill",
        source: "fog",
        filter: ["all",
          [">=", ["coalesce", ["get", "fogHours"], 0], TRANSITION_RANGE[0]],
          ["<=", ["coalesce", ["get", "fogHours"], 0], TRANSITION_RANGE[1]],
        ],
        paint: {
          "fill-pattern": "scattered-clouds",
          "fill-opacity": [
            "case",
            ["boolean", ["feature-state", "picked"], false],
            1,
            0.88,
          ],
        },
      });
      map.addLayer({
        id: "fog-outline",
        type: "line",
        source: "fog",
        paint: {
          "line-color": "#1c1917",
          "line-width": [
            "case",
            ["boolean", ["feature-state", "picked"], false],
            2.5,
            0.6,
          ],
        },
      });
      map.addLayer({
        id: "fog-hover",
        type: "line",
        source: "fog",
        paint: {
          "line-color": "#2563eb",
          "line-width": 2,
        },
        filter: ["==", ["get", "id"], ""],
      });
      // Neighborhood name labels. Placed at each polygon's pole-of-inaccessibility
      // by Mapbox, with a white halo so they stay readable over any color in the
      // choropleth. Faded out at far zooms where labels would crowd each other.
      map.addLayer({
        id: "fog-labels",
        type: "symbol",
        source: "fog",
        layout: {
          "text-field": ["get", "name"],
          "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
          "text-size": [
            "interpolate", ["linear"], ["zoom"],
            11, 9,
            13, 11,
            15, 13,
          ],
          "text-max-width": 8,
          "text-padding": 2,
          "text-allow-overlap": false,
          "symbol-placement": "point",
        },
        paint: {
          "text-color": "#1c1917",
          "text-halo-color": "#ffffff",
          "text-halo-width": 1.4,
          "text-halo-blur": 0.4,
          "text-opacity": [
            "interpolate", ["linear"], ["zoom"],
            10.5, 0,
            11.5, 0.85,
            14, 1,
          ],
        },
      });

      // Same handlers apply to both fill layers (Sun/Fog gradient + Transition
      // pattern). Listening on both ensures every neighborhood is clickable.
      const PICK_LAYERS = ["fog-fill", "fog-transition"];
      PICK_LAYERS.forEach(layerId => {
        map.on("mousemove", layerId, e => {
          if (!e.features?.length) return;
          map.getCanvas().style.cursor = "pointer";
          map.setFilter("fog-hover", ["==", ["get", "id"], e.features[0].properties.id]);
        });
        map.on("mouseleave", layerId, () => {
          map.getCanvas().style.cursor = "";
          map.setFilter("fog-hover", ["==", ["get", "id"], ""]);
        });
        map.on("click", layerId, e => {
          if (!e.features?.length) return;
          onPickRef.current(e.features[0], [e.lngLat.lng, e.lngLat.lat]);
        });
      });
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Push GeoJSON into the source once it's loaded.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !geojson || dataAppliedRef.current) return;
    const apply = () => {
      const src = map.getSource("fog");
      if (!src) return;
      src.setData(geojson);
      dataAppliedRef.current = true;
    };
    if (map.isStyleLoaded()) apply();
    else map.once("load", apply);
  }, [geojson]);

  // Sync picked state: drop a marker, highlight the feature, fly there.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !geojson) return;

    if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }
    // Clear previous picked feature-state. (Tracking the prior id avoids
    // having to iterate all features.)
    if (map.getSource("fog")) {
      geojson.features.forEach(f => {
        map.setFeatureState({ source: "fog", id: f.properties.id }, { picked: false });
      });
    }

    if (!picked) return;

    if (picked.point) {
      markerRef.current = new mapboxgl.Marker({ color: "#2563eb" })
        .setLngLat(picked.point)
        .addTo(map);
      map.flyTo({ center: picked.point, zoom: 13, duration: 800 });
    }
    if (picked.feature?.properties?.id) {
      map.setFeatureState(
        { source: "fog", id: picked.feature.properties.id },
        { picked: true }
      );
    }
  }, [picked, geojson]);

  if (!TOKEN) {
    return (
      <div className="fog-map-missing-token">
        <div>
          <h2>Mapbox token missing</h2>
          <p>
            <code>NEXT_PUBLIC_MAPBOX_TOKEN</code> isn&apos;t set in this
            environment. Add it (get one at{" "}
            <a href="https://account.mapbox.com/access-tokens/" target="_blank" rel="noreferrer">mapbox.com</a>),
            then redeploy (or restart the dev server if running locally).
          </p>
        </div>
      </div>
    );
  }

  return <div ref={containerRef} className="fog-map" />;
}
