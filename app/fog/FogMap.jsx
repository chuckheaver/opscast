'use client';

// Mapbox GL JS map. Renders:
//   - SF neighborhood polygons as OUTLINES ONLY (no fill colour) so streets
//     and labels stay visible underneath.
//   - The USGS fog-contour polygons as the primary data layer, in three
//     solid-colour bands by hours/day value:
//       • < 8.5  → bright yellow
//       • = 8.5  → warm grey-yellow (transition)
//       • ≥ 9    → grey gradient (darker for higher fog hours)
//
// Click and hover detection sit on an invisible "fog-click-target" fill
// over the neighborhoods, so the user can pick anywhere inside SF
// regardless of which (if any) contour layer the cursor is on.

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
const SF_CENTER = [-122.447, 37.7649];

// 32×32 canvas pattern: two small white cloud puffs on a transparent
// background. Painted on top of the 8.5 (Transition) grey fill so the
// polygon reads as "lightly cloudy" while the underlying gradient still
// carries the colour information.
function buildTransitionCloudsPattern() {
  const size = 32;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = "rgba(255, 255, 255, 0.92)";

  const drawCloud = (cx, cy, scale = 1) => {
    const r = 2.4 * scale;
    ctx.beginPath();
    ctx.arc(cx - r * 0.8, cy + r * 0.3, r * 0.7, 0, Math.PI * 2);
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.arc(cx + r * 0.9, cy + r * 0.2, r * 0.65, 0, Math.PI * 2);
    ctx.arc(cx, cy + r * 0.6, r * 0.55, 0, Math.PI * 2);
    ctx.fill();
  };

  drawCloud(9, 11);
  drawCloud(22, 22, 0.8);

  return ctx.getImageData(0, 0, size, size);
}

// Layer IDs the "Show fog data" toggle flips on and off as a group.
const CONTOUR_LAYER_IDS = [
  "fog-contours-fog",
  "fog-contours-transition-icons",
  "fog-contours-sun",
  "fog-contours-eight-outline",
];

export default function FogMap({ geojson, contours, showContours, picked, onPickFeature }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const dataAppliedRef = useRef(false);
  const contoursAppliedRef = useRef(false);
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
      style: "mapbox://styles/mapbox/streets-v12",
      center: SF_CENTER,
      zoom: 11.2,
      minZoom: 10,
      maxZoom: 16,
    });
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");
    mapRef.current = map;

    map.on("load", () => {
      // Register the transition-zone cloud pattern up-front so the layer
      // below can reference it by name.
      if (!map.hasImage("transition-clouds")) {
        map.addImage("transition-clouds", buildTransitionCloudsPattern());
      }

      // ── Neighborhood source ─────────────────────────────────────────
      map.addSource("fog", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
        promoteId: "id",
      });

      // Invisible fill — exists purely to catch click/hover events anywhere
      // inside an SF neighborhood. fill-opacity 0 still registers hits.
      map.addLayer({
        id: "fog-click-target",
        type: "fill",
        source: "fog",
        paint: { "fill-color": "#000", "fill-opacity": 0 },
      });

      // ── Contour source (USGS fog isolines clipped to SF) ────────────
      map.addSource("fog-contours", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });

      // Grey gradient band (≥8.5 hrs): starts at light grey on the 8.5
      // contour and steps to near-black at the foggiest 12.5 contour.
      // The 8.5 polygon is also flagged by the cloud-icon overlay below.
      map.addLayer({
        id: "fog-contours-fog",
        type: "fill",
        source: "fog-contours",
        filter: [">=", ["coalesce", ["get", "hours"], 0], 8.5],
        paint: {
          "fill-color": [
            "interpolate", ["linear"], ["get", "hours"],
            8.5,  "#d6d3d1",
            11,   "#78716c",
            12.5, "#292524",
          ],
          "fill-opacity": 0.5,
        },
      });

      // Sun band (<8.5 hrs, includes the 8.0 polygon): soft pale yellow.
      map.addLayer({
        id: "fog-contours-sun",
        type: "fill",
        source: "fog-contours",
        filter: ["<", ["coalesce", ["get", "hours"], 0], 8.5],
        paint: {
          "fill-color": "#fef08a",
          "fill-opacity": 0.4,
        },
      });

      // Cloud icon overlay just on the 8.5 transition polygon. Pattern has
      // a transparent background so the underlying light-grey fill stays
      // visible; little white clouds sit on top to flag it as Transition.
      map.addLayer({
        id: "fog-contours-transition-icons",
        type: "fill",
        source: "fog-contours",
        filter: ["==", ["coalesce", ["get", "hours"], 0], 8.5],
        paint: {
          "fill-pattern": "transition-clouds",
          "fill-opacity": 0.95,
        },
      });

      // Dashed outline ONLY on the 8.0 polygon — it's the "edge of Sun"
      // and we want that boundary visible against the surrounding yellow
      // and the 8.5 transition next to it. All other polygons stay solid.
      map.addLayer({
        id: "fog-contours-eight-outline",
        type: "line",
        source: "fog-contours",
        filter: ["==", ["coalesce", ["get", "hours"], 0], 8],
        layout: { "line-cap": "round", "line-join": "round" },
        paint: {
          "line-color": "#9ca3af",
          "line-width": 1,
          "line-dasharray": [2, 2.5],
          "line-opacity": 0.7,
        },
      });

      // ── Neighborhood outlines + hover highlight (on top of contours) ─
      map.addLayer({
        id: "fog-outline",
        type: "line",
        source: "fog",
        paint: {
          "line-color": "#1c1917",
          "line-opacity": 0.7,
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
        paint: { "line-color": "#2563eb", "line-width": 2 },
        filter: ["==", ["get", "id"], ""],
      });

      // Neighborhood name labels — same as before, fade in past zoom 11.5.
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

      // Click + hover handlers ride the invisible fog-click-target so they
      // fire regardless of which contour layer the cursor is over.
      map.on("mousemove", "fog-click-target", e => {
        if (!e.features?.length) return;
        map.getCanvas().style.cursor = "pointer";
        map.setFilter("fog-hover", ["==", ["get", "id"], e.features[0].properties.id]);
      });
      map.on("mouseleave", "fog-click-target", () => {
        map.getCanvas().style.cursor = "";
        map.setFilter("fog-hover", ["==", ["get", "id"], ""]);
      });
      map.on("click", "fog-click-target", e => {
        if (!e.features?.length) return;
        onPickRef.current(e.features[0], [e.lngLat.lng, e.lngLat.lat]);
      });
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Push neighborhood GeoJSON into its source once the style loads.
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

  // Push the raw USGS contours into their source when the prop arrives.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !contours || contoursAppliedRef.current) return;
    const apply = () => {
      const src = map.getSource("fog-contours");
      if (!src) return;
      src.setData(contours);
      contoursAppliedRef.current = true;
    };
    if (map.isStyleLoaded()) apply();
    else map.once("load", apply);
  }, [contours]);

  // Flip the entire fog-data layer group on/off (sidebar checkbox).
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const apply = () => {
      const vis = showContours ? "visible" : "none";
      CONTOUR_LAYER_IDS.forEach(id => {
        if (map.getLayer(id)) map.setLayoutProperty(id, "visibility", vis);
      });
    };
    if (map.isStyleLoaded()) apply();
    else map.once("load", apply);
  }, [showContours]);

  // Sync picked state: drop a marker, highlight the feature, fly there.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !geojson) return;

    if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }
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
