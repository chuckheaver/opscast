'use client';

// Mapbox GL JS map. Renders the SF neighborhood polygons colored by
// fog hours, and lets the user click one. The picked-point marker is
// driven by the parent (so address searches and map clicks share state).

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { riskColorStops } from "./lib/risk";

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
      map.addSource("fog", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
        promoteId: "id",
      });
      map.addLayer({
        id: "fog-fill",
        type: "fill",
        source: "fog",
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

      map.on("mousemove", "fog-fill", e => {
        if (!e.features?.length) return;
        map.getCanvas().style.cursor = "pointer";
        map.setFilter("fog-hover", ["==", ["get", "id"], e.features[0].properties.id]);
      });
      map.on("mouseleave", "fog-fill", () => {
        map.getCanvas().style.cursor = "";
        map.setFilter("fog-hover", ["==", ["get", "id"], ""]);
      });
      map.on("click", "fog-fill", e => {
        if (!e.features?.length) return;
        onPickRef.current(e.features[0], [e.lngLat.lng, e.lngLat.lat]);
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
