'use client';

// Mapbox GL JS map for the real-estate explorer. Renders:
//   - The USGS fog contours as a faint backdrop (the microclimate context).
//   - One circle per listing, driven by a GeoJSON source the parent swaps
//     out whenever the filters change (so map + stats always agree).
//   - A click handler that selects a property (parent shows the drill-down).
//
// Circle colour is driven by the `colorBy` prop: status | fog | price.

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
const SF_BOUNDS = [
  [-122.520, 37.708], // SW
  [-122.355, 37.812], // NE
];

const EMPTY_FC = { type: "FeatureCollection", features: [] };

// Categorical colour ramp for the status field.
const STATUS_COLOR = [
  "match", ["get", "status"],
  "Active", "#16a34a",
  "Pending", "#f59e0b",
  "Contingent - Show", "#fb923c",
  "Contingent - No Show", "#fb923c",
  "Coming Soon", "#06b6d4",
  "Closed", "#2563eb",
  "Sold Off MLS", "#7c3aed",
  "#9ca3af",
];

// Foggier (higher hours) → darker. Mirrors fogColor() in lib/stats.js.
const FOG_COLOR = [
  "interpolate", ["linear"], ["coalesce", ["get", "fogHours"], 9],
  8.5, "#fcd34d",
  9.5, "#cbd5e1",
  10.5, "#6b7280",
  11.5, "#1f2937",
];

// Price ramp (sale price if closed, else list price — pre-computed as `price`).
const PRICE_COLOR = [
  "interpolate", ["linear"], ["coalesce", ["get", "price"], 0],
  800000, "#dbeafe",
  1800000, "#60a5fa",
  3000000, "#2563eb",
  6000000, "#1e3a8a",
  12000000, "#312e81",
];

function colorExpr(colorBy) {
  if (colorBy === "fog") return FOG_COLOR;
  if (colorBy === "price") return PRICE_COLOR;
  return STATUS_COLOR;
}

export default function ListingsMap({ features, colorBy, showFog, selectedId, onSelect }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const readyRef = useRef(false);
  const onSelectRef = useRef(onSelect);
  // Latest props captured for callbacks / deferred-apply on style load.
  const featuresRef = useRef(features);
  const colorByRef = useRef(colorBy);

  useEffect(() => { onSelectRef.current = onSelect; }, [onSelect]);
  useEffect(() => { featuresRef.current = features; }, [features]);
  useEffect(() => { colorByRef.current = colorBy; }, [colorBy]);

  // Mount once.
  useEffect(() => {
    if (!TOKEN || mapRef.current) return;
    mapboxgl.accessToken = TOKEN;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      // Same basemap as the /fog map so the grey fog-contour fills read the
      // same way here as they do there.
      style: "mapbox://styles/mapbox/streets-v12",
      bounds: SF_BOUNDS,
      fitBoundsOptions: { padding: 24 },
      minZoom: 10,
      maxZoom: 17,
    });
    // Bottom-right so the zoom buttons never sit on top of the drill-down
    // card (top-right) and block its close button.
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "bottom-right");
    mapRef.current = map;

    map.on("load", () => {
      // Fog contour backdrop — same source the /fog map uses.
      map.addSource("fog-contours", {
        type: "geojson",
        data: "/data/sf-fog-contours.geojson",
      });
      // Two fog fill layers identical to the /fog map so the backdrop lines
      // up exactly: a light-yellow "sun" band under 8.5 hrs, and a grey
      // gradient from 8.5 hrs (lightest) to 12.5 hrs (near-black).
      map.addLayer({
        id: "re-fog-sun",
        type: "fill",
        source: "fog-contours",
        filter: ["<", ["coalesce", ["get", "hours"], 0], 8.5],
        layout: { visibility: showFog ? "visible" : "none" },
        paint: {
          "fill-color": "#fef9c3",
          "fill-opacity": 0.45,
        },
      });
      map.addLayer({
        id: "re-fog-fog",
        type: "fill",
        source: "fog-contours",
        filter: [">=", ["coalesce", ["get", "hours"], 0], 8.5],
        layout: { visibility: showFog ? "visible" : "none" },
        paint: {
          "fill-color": [
            "interpolate", ["linear"], ["get", "hours"],
            8.5,  "#e5e5e4",
            11,   "#78716c",
            12.5, "#292524",
          ],
          "fill-opacity": 0.5,
        },
      });

      // Listings source + circle layer.
      map.addSource("listings", {
        type: "geojson",
        data: EMPTY_FC,
        promoteId: "id",
      });
      map.addLayer({
        id: "listings-circles",
        type: "circle",
        source: "listings",
        paint: {
          "circle-radius": [
            "interpolate", ["linear"], ["zoom"],
            10, 3.5,
            13, 6,
            16, 10,
          ],
          "circle-color": colorExpr(colorByRef.current),
          "circle-stroke-width": 1,
          "circle-stroke-color": "#ffffff",
          "circle-opacity": 0.9,
        },
      });
      // Selected-property highlight ring.
      map.addLayer({
        id: "listings-selected",
        type: "circle",
        source: "listings",
        filter: ["==", ["get", "id"], ""],
        paint: {
          "circle-radius": [
            "interpolate", ["linear"], ["zoom"],
            10, 7,
            13, 11,
            16, 16,
          ],
          "circle-color": "rgba(0,0,0,0)",
          "circle-stroke-width": 3,
          "circle-stroke-color": "#dc2626",
        },
      });

      map.on("mouseenter", "listings-circles", () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "listings-circles", () => {
        map.getCanvas().style.cursor = "";
      });
      map.on("click", "listings-circles", e => {
        if (!e.features?.length) return;
        onSelectRef.current?.(e.features[0].properties);
      });

      readyRef.current = true;
      // Apply whatever data/colour the parent already has.
      map.getSource("listings")?.setData({
        type: "FeatureCollection",
        features: featuresRef.current || [],
      });
      map.setPaintProperty("listings-circles", "circle-color", colorExpr(colorByRef.current));
    });

    return () => {
      map.remove();
      mapRef.current = null;
      readyRef.current = false;
    };
  }, []);

  // Push filtered features into the source.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !readyRef.current) return;
    map.getSource("listings")?.setData({
      type: "FeatureCollection",
      features: features || [],
    });
  }, [features]);

  // Re-colour when the colorBy selector changes.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !readyRef.current) return;
    map.setPaintProperty("listings-circles", "circle-color", colorExpr(colorBy));
  }, [colorBy]);

  // Toggle the fog backdrop.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !readyRef.current) return;
    ["re-fog-sun", "re-fog-fog"].forEach(id => {
      if (map.getLayer(id)) {
        map.setLayoutProperty(id, "visibility", showFog ? "visible" : "none");
      }
    });
  }, [showFog]);

  // Highlight the selected property.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !readyRef.current) return;
    map.setFilter("listings-selected", ["==", ["get", "id"], selectedId || ""]);
  }, [selectedId]);

  if (!TOKEN) {
    return (
      <div className="re-map-missing-token">
        <div>
          <h2>Mapbox token missing</h2>
          <p>
            <code>NEXT_PUBLIC_MAPBOX_TOKEN</code> isn&apos;t set. Add it to
            <code> .env.local</code> (get one at{" "}
            <a href="https://account.mapbox.com/access-tokens/" target="_blank" rel="noreferrer">mapbox.com</a>),
            then restart the dev server.
          </p>
        </div>
      </div>
    );
  }

  return <div ref={containerRef} className="re-map" />;
}
