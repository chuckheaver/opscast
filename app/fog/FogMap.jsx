'use client';

// Mapbox GL JS map. Renders:
//   - SF neighborhood polygons as OUTLINES ONLY (no fill colour) so streets
//     and labels stay visible underneath.
//   - The USGS fog-contour polygons as the primary data layer, with three
//     visual treatments by hours/day band:
//       • < 8.5  → yellow fill + scattered sun-icon pattern
//       • = 8.5  → light grey-yellow fill + scattered clouds pattern
//       • > 8.5  → grey gradient (darker for higher fog hours)
//
// Click and hover detection sit on an invisible "fog-click-target" fill
// over the neighborhoods, so the user can pick anywhere inside SF
// regardless of which (if any) contour layer the cursor is on.

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
const SF_CENTER = [-122.447, 37.7649];

// 32×32 canvas pattern: yellow background with two small sun icons.
// Used as the fill-pattern on the < 8.5 hrs contour layer.
function buildSunIconsPattern() {
  const size = 32;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  // Bright Sun-zone yellow.
  ctx.fillStyle = "#fde047";
  ctx.fillRect(0, 0, size, size);

  // Each sun: small amber disc + 8 radial rays.
  const drawSun = (cx, cy, r) => {
    ctx.fillStyle = "#f59e0b";
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    const inner = r * 1.5;
    const outer = inner + r * 0.9;
    for (let i = 0; i < 8; i++) {
      const a = (Math.PI * 2 / 8) * i;
      const ca = Math.cos(a), sa = Math.sin(a);
      ctx.beginPath();
      ctx.moveTo(cx + ca * inner, cy + sa * inner);
      ctx.lineTo(cx + ca * outer, cy + sa * outer);
      ctx.stroke();
    }
  };
  drawSun(9, 10, 2);
  drawSun(23, 22, 1.6);

  return ctx.getImageData(0, 0, size, size);
}

// 32×32 canvas pattern: transparent background with a couple small "fog"
// icons (three horizontal wavy lines — the universal weather symbol for
// fog). Drawn over the grey-gradient fog band, so the underlying gradient
// shade still drives the perceived intensity but each tile reads as
// "actively foggy" rather than just "dark grey".
function buildFogIconsPattern() {
  const size = 32;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, size, size);
  ctx.strokeStyle = "rgba(28, 25, 23, 0.8)";
  ctx.lineCap = "round";
  ctx.lineWidth = 1.1;

  // 3 horizontal lines stacked vertically, lengths varied so they read as
  // wisps. (cx, cy) is the icon centre.
  const drawFog = (cx, cy, scale = 1) => {
    const w = 8 * scale;
    const sp = 2.8 * scale;
    const lines = [
      [-w * 0.40,  w * 0.40, -sp],
      [-w * 0.50,  w * 0.50,   0],
      [-w * 0.45,  w * 0.30,  sp],
    ];
    lines.forEach(([x1, x2, dy]) => {
      ctx.beginPath();
      ctx.moveTo(cx + x1, cy + dy);
      ctx.lineTo(cx + x2, cy + dy);
      ctx.stroke();
    });
  };

  drawFog(9, 10, 1);
  drawFog(22, 22, 0.85);

  return ctx.getImageData(0, 0, size, size);
}

// 32×32 canvas pattern: light grey-yellow background with sparse grey
// cloud puffs, biased to the west side of the tile. Used as the fill-pattern
// on the = 8.5 hrs contour layer.
const SCATTERED_PUFFS = [
  [5, 8, 2.5],
  [8, 8, 3],
  [11, 8, 2.5],
  [8, 6, 2],
  [4, 22, 2],
  [7, 23, 2.5],
];
function buildScatteredCloudsPattern() {
  const size = 32;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  // Light grey-yellow base — "the air just before the marine layer rolls in".
  ctx.fillStyle = "#e5dfc5";
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = "rgba(120, 113, 108, 0.85)";
  SCATTERED_PUFFS.forEach(([cx, cy, r]) => {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  });
  return ctx.getImageData(0, 0, size, size);
}

// Layer IDs the "Show fog data" toggle flips on and off as a group.
const CONTOUR_LAYER_IDS = [
  "fog-contours-fog",
  "fog-contours-fog-icons",
  "fog-contours-transition",
  "fog-contours-sun",
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
      style: "mapbox://styles/mapbox/light-v11",
      center: SF_CENTER,
      zoom: 11.2,
      minZoom: 10,
      maxZoom: 16,
    });
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");
    mapRef.current = map;

    map.on("load", () => {
      // Register both patterns up-front so the contour layers below can
      // reference them.
      if (!map.hasImage("sun-icons")) {
        map.addImage("sun-icons", buildSunIconsPattern());
      }
      if (!map.hasImage("scattered-clouds")) {
        map.addImage("scattered-clouds", buildScatteredCloudsPattern());
      }
      if (!map.hasImage("fog-icons")) {
        map.addImage("fog-icons", buildFogIconsPattern());
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

      // High-fog band (>8.5): grey gradient, darker for higher hours.
      // Drawn before the lower bands so the small inner high-fog polygons
      // stack on top visually after we add the Transition / Sun layers.
      map.addLayer({
        id: "fog-contours-fog",
        type: "fill",
        source: "fog-contours",
        filter: [">", ["coalesce", ["get", "hours"], 0], 8.5],
        paint: {
          "fill-color": [
            "interpolate", ["linear"], ["get", "hours"],
            8.6,  "#d6d3d1",
            10.5, "#78716c",
            12.5, "#292524",
          ],
          "fill-opacity": 0.45,
        },
      });
      // Fog-icon overlay for the same band — the pattern has a transparent
      // background, so the gradient colour below still drives the shade
      // and these glyphs just add a "this is fog" cue per tile.
      map.addLayer({
        id: "fog-contours-fog-icons",
        type: "fill",
        source: "fog-contours",
        filter: [">", ["coalesce", ["get", "hours"], 0], 8.5],
        paint: {
          "fill-pattern": "fog-icons",
          "fill-opacity": 0.6,
        },
      });

      // Transition band (=8.5): scattered-clouds pattern on grey-yellow.
      map.addLayer({
        id: "fog-contours-transition",
        type: "fill",
        source: "fog-contours",
        filter: ["==", ["coalesce", ["get", "hours"], 0], 8.5],
        paint: {
          "fill-pattern": "scattered-clouds",
          "fill-opacity": 0.55,
        },
      });

      // Sun band (<8.5): sun-icons pattern on bright yellow.
      map.addLayer({
        id: "fog-contours-sun",
        type: "fill",
        source: "fog-contours",
        filter: ["<", ["coalesce", ["get", "hours"], 0], 8.5],
        paint: {
          "fill-pattern": "sun-icons",
          "fill-opacity": 0.55,
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
