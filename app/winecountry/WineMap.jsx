'use client';

// Mapbox canvas for the wine-country page. Renders Napa + Sonoma AVAs, the
// six schematic sub-zone fills (sun / cool / wind / marine fog fingers /
// morning valley fog / south→north temperature gradient), a hillshade +
// contour terrain pair, and named peaks.
//
// Click any AVA polygon → a Mapbox popup opens at the click point with
// the AVA's Winkler region, soil archetype, elevation + slope aspect,
// and the grapes that thrive there and why (sourced from ava-content.js).
//
// Data + toggle state are mirrored into refs so the stable addLayers /
// applyVisibility callbacks always read the latest values.

import { useCallback, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { AVA_CONTENT } from "./lib/ava-content";
import { WINKLER, SOILS } from "./lib/education-content";

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
// Bounds framing Napa + Sonoma counties — coast to Vaca range, San Pablo
// Bay up to the north edge of Alexander Valley / Cobb Mountain.
const WINE_BOUNDS = [
  [-123.140, 38.150],
  [-122.180, 38.780],
];

const ZONE_COLOR = {
  sun:         "#fdba74",
  cool:        "#7dd3fc",
  wind:        "#2dd4bf",
  fog_marine:  "#334155",
  fog_valley:  "#94a3b8",
};
const ZONE_OPACITY = {
  sun: 0.55, cool: 0.55, wind: 0.45,
  fog_marine: 0.5, fog_valley: 0.4,
};
const TEMP_COLOR = {
  1: "#7dd3fc",
  2: "#a3e635",
  3: "#fde68a",
  4: "#fdba74",
  5: "#f97316",
};
const SLOPE_ZONES = ["sun", "cool", "wind"];
const FOG_ZONES = ["fog_marine", "fog_valley"];

// Build the HTML for the AVA popup card from the ava-content entry. Fields
// come from a curated table (see lib/ava-content.js); missing entries
// fall back to a minimal "AVA name only" card.
function buildPopupHtml(avaName, county, kind) {
  const c = AVA_CONTENT[avaName];
  const kindLabel = kind === "parent" ? "Parent AVA" : kind === "mountain" ? "Mountain AVA" : "Sub-AVA";
  if (!c) {
    return `
      <div class="wine-pop-h">
        <div class="wine-pop-h-name">${escapeHtml(avaName)}</div>
        <div class="wine-pop-h-sub">${escapeHtml(county || "")} · ${escapeHtml(kindLabel)}</div>
      </div>
      <div class="wine-pop-body">
        <div class="wine-pop-row"><div class="wine-pop-k">Info</div><div class="wine-pop-v">Content coming soon.</div></div>
      </div>
    `;
  }
  const varietyRows = (c.varieties || []).map(v => `
    <div class="wine-pop-variety">
      <div class="wine-pop-variety-name">${escapeHtml(v.name)}</div>
      <div class="wine-pop-variety-why">${escapeHtml(v.why)}</div>
    </div>
  `).join("");
  return `
    <div class="wine-pop-h">
      <div class="wine-pop-h-name">${escapeHtml(avaName)}</div>
      <div class="wine-pop-h-sub">${escapeHtml(county || "")} · ${escapeHtml(kindLabel)}</div>
    </div>
    <div class="wine-pop-body">
      <div class="wine-pop-row"><div class="wine-pop-k">Winkler</div><div class="wine-pop-v">${escapeHtml(c.winkler)}</div></div>
      <div class="wine-pop-row"><div class="wine-pop-k">Soil</div><div class="wine-pop-v">${escapeHtml(c.soil)}</div></div>
      <div class="wine-pop-row"><div class="wine-pop-k">Elevation</div><div class="wine-pop-v">${escapeHtml(c.elevation)}</div></div>
      <div class="wine-pop-row"><div class="wine-pop-k">Slope / aspect</div><div class="wine-pop-v">${escapeHtml(c.slopeAspect)}</div></div>
      <div class="wine-pop-row"><div class="wine-pop-k">Grapes &amp; why</div><div class="wine-pop-v"><div class="wine-pop-varieties">${varietyRows}</div></div></div>
      ${c.summary ? `<div class="wine-pop-summary">${escapeHtml(c.summary)}</div>` : ""}
    </div>
  `;
}
function escapeHtml(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

// Popup for a Winkler heat band. Looked up by `band` (1..5).
function buildWinklerPopupHtml(band, label) {
  const w = WINKLER[band];
  if (!w) return `<div class="wine-pop-body">Unknown Winkler band.</div>`;
  return `
    <div class="wine-pop-h" style="background:${w.swatch};color:#1c1917;">
      <div class="wine-pop-h-name" style="color:#1c1917;">${escapeHtml(w.region)}</div>
      <div class="wine-pop-h-sub" style="color:rgba(28,25,23,0.7);">${escapeHtml(label || "")}</div>
    </div>
    <div class="wine-pop-body">
      <div class="wine-pop-row"><div class="wine-pop-k">GDD</div><div class="wine-pop-v">${escapeHtml(w.gdd)}</div></div>
      <div class="wine-pop-row"><div class="wine-pop-k">Afternoon</div><div class="wine-pop-v">${escapeHtml(w.temp)}</div></div>
      <div class="wine-pop-row"><div class="wine-pop-k">Style</div><div class="wine-pop-v">${escapeHtml(w.style)}</div></div>
      <div class="wine-pop-row"><div class="wine-pop-k">Grapes</div><div class="wine-pop-v">${w.grapes.map(g => `<div>&middot; ${escapeHtml(g)}</div>`).join("")}</div></div>
      <div class="wine-pop-row"><div class="wine-pop-k">Examples</div><div class="wine-pop-v">${escapeHtml(w.examples.join(", "))}</div></div>
      <div class="wine-pop-summary">GDD (Growing Degree Days) = sum of daily-average temps above 50 &deg;F, Apr 1&ndash;Oct 31. The single number that says which grapes will ripen here.</div>
    </div>
  `;
}

// Popup for a soil-archetype polygon. Looked up by `soil` id.
function buildSoilPopupHtml(soilId, label) {
  const s = SOILS[soilId];
  if (!s) return `<div class="wine-pop-body">Unknown soil.</div>`;
  return `
    <div class="wine-pop-h" style="background:${s.swatch};">
      <div class="wine-pop-h-name">${escapeHtml(s.name)}</div>
      <div class="wine-pop-h-sub">${escapeHtml(s.tag)}${label ? " · " + escapeHtml(label) : ""}</div>
    </div>
    <div class="wine-pop-body">
      <div class="wine-pop-row"><div class="wine-pop-k">Traits</div><div class="wine-pop-v">${escapeHtml(s.traits)}</div></div>
      <div class="wine-pop-row"><div class="wine-pop-k">Where</div><div class="wine-pop-v">${escapeHtml(s.sites.join(" · "))}</div></div>
      <div class="wine-pop-row"><div class="wine-pop-k">Wines</div><div class="wine-pop-v">${escapeHtml(s.wines.join(" · "))}</div></div>
    </div>
  `;
}

export default function WineMap({
  avas, zones, soils,
  showSun, showCool, showWind, showFogMarine, showFogValley,
  showTemp, showTerrain, showContours, showFogLine, showPeaks, showAvas, showSoils,
  picked,
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const popupRef = useRef(null);
  const readyRef = useRef(false);

  const dataRef = useRef({ avas, zones, soils });
  const visRef = useRef({
    showSun, showCool, showWind, showFogMarine, showFogValley,
    showTemp, showTerrain, showContours, showFogLine, showPeaks, showAvas, showSoils,
  });

  const applyVisibility = useCallback(() => {
    const map = mapRef.current;
    if (!map || !readyRef.current) return;
    const v = visRef.current;
    const set = (id, on) => {
      if (map.getLayer(id)) map.setLayoutProperty(id, "visibility", on ? "visible" : "none");
    };
    set("wine-sun-fill",  v.showSun);  set("wine-sun-line",  v.showSun);
    set("wine-cool-fill", v.showCool); set("wine-cool-line", v.showCool);
    set("wine-wind-fill", v.showWind); set("wine-wind-line", v.showWind);
    set("wine-fog_marine-fill", v.showFogMarine);
    set("wine-fog_valley-fill", v.showFogValley);
    set("wine-temp-fill", v.showTemp); set("wine-temp-labels", v.showTemp);
    set("wine-hillshade",   v.showTerrain);
    set("wine-hillshade-2", v.showTerrain);
    set("wine-contour-lines",  v.showContours);
    set("wine-contour-labels", v.showContours);
    set("wine-peaks",       v.showPeaks);
    set("wine-fog-inversion",       v.showFogLine);
    set("wine-fog-inversion-label", v.showFogLine);
    set("wine-ava-outline",   v.showAvas);
    set("wine-ava-fill-click", v.showAvas);
    set("wine-ava-labels",    v.showAvas);
    set("wine-soils-fill",    v.showSoils);
    set("wine-soils-outline", v.showSoils);
  }, []);

  const addLayers = useCallback(() => {
    const map = mapRef.current;
    if (!map || !readyRef.current) return;
    const { avas: av, zones: zn, soils: sl } = dataRef.current;

    // Hillshade pair.
    if (!map.getSource("wine-dem")) {
      map.addSource("wine-dem", {
        type: "raster-dem",
        url: "mapbox://mapbox.mapbox-terrain-dem-v1",
      });
      map.addLayer({
        id: "wine-hillshade",
        type: "hillshade",
        source: "wine-dem",
        layout: { visibility: "none" },
        paint: {
          "hillshade-exaggeration": 1,
          "hillshade-shadow-color": "#000000",
          "hillshade-accent-color": "#1c1917",
          "hillshade-highlight-color": "#a8a29e",
        },
      });
      map.addLayer({
        id: "wine-hillshade-2",
        type: "hillshade",
        source: "wine-dem",
        layout: { visibility: "none" },
        paint: {
          "hillshade-exaggeration": 1,
          "hillshade-illumination-direction": 155,
          "hillshade-shadow-color": "rgba(0, 0, 0, 0.6)",
          "hillshade-accent-color": "rgba(28, 25, 23, 0.5)",
          "hillshade-highlight-color": "rgba(168, 162, 158, 0)",
        },
      });
    }

    if (zn && !map.getSource("wine-zones")) {
      map.addSource("wine-zones", { type: "geojson", data: zn });

      // Temperature gradient at the bottom — background wash.
      map.addLayer({
        id: "wine-temp-fill",
        type: "fill",
        source: "wine-zones",
        filter: ["==", ["get", "zone"], "temp"],
        paint: {
          "fill-color": [
            "match", ["get", "band"],
            1, TEMP_COLOR[1],
            2, TEMP_COLOR[2],
            3, TEMP_COLOR[3],
            4, TEMP_COLOR[4],
            5, TEMP_COLOR[5],
            /* other */ TEMP_COLOR[3],
          ],
          "fill-opacity": 0.4,
        },
      });
      map.addLayer({
        id: "wine-temp-labels",
        type: "symbol",
        source: "wine-zones",
        filter: ["==", ["get", "zone"], "temp"],
        layout: {
          "text-field": ["get", "label"],
          "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
          "text-size": ["interpolate", ["linear"], ["zoom"], 8, 10, 11, 12, 13, 13],
          "text-max-width": 10,
          "text-allow-overlap": false,
        },
        paint: {
          "text-color": "#1c1917",
          "text-halo-color": "#ffffff",
          "text-halo-width": 1.6,
          "text-opacity": ["interpolate", ["linear"], ["zoom"], 8, 0, 9.5, 1],
        },
      });

      // Click on any Winkler temperature band → popup with the region's
      // GDD / temp / grapes / example AVAs. Only fires when the temp
      // layer is visible (Mapbox suppresses hits on hidden layers).
      const onTempClick = e => {
        const f = e.features?.[0];
        if (!f) return;
        const { band, label } = f.properties || {};
        if (popupRef.current) popupRef.current.remove();
        popupRef.current = new mapboxgl.Popup({
          className: "wine-popup",
          maxWidth: "320px",
          closeButton: true,
          closeOnClick: false,
        })
          .setLngLat(e.lngLat)
          .setHTML(buildWinklerPopupHtml(Number(band), label))
          .addTo(map);
      };
      map.on("click", "wine-temp-fill", onTempClick);
      map.on("mouseenter", "wine-temp-fill", () => { map.getCanvas().style.cursor = "pointer"; });
      map.on("mouseleave", "wine-temp-fill", () => { map.getCanvas().style.cursor = ""; });

      // Fog fills UNDER slope zones.
      FOG_ZONES.forEach(zone => {
        map.addLayer({
          id: `wine-${zone}-fill`,
          type: "fill",
          source: "wine-zones",
          filter: ["==", ["get", "zone"], zone],
          paint: { "fill-color": ZONE_COLOR[zone], "fill-opacity": ZONE_OPACITY[zone] },
        });
      });

      // Slope + wind zones on top.
      SLOPE_ZONES.forEach(zone => {
        map.addLayer({
          id: `wine-${zone}-fill`,
          type: "fill",
          source: "wine-zones",
          filter: ["==", ["get", "zone"], zone],
          paint: { "fill-color": ZONE_COLOR[zone], "fill-opacity": ZONE_OPACITY[zone] },
        });
        map.addLayer({
          id: `wine-${zone}-line`,
          type: "line",
          source: "wine-zones",
          filter: ["==", ["get", "zone"], zone],
          paint: { "line-color": ZONE_COLOR[zone], "line-width": 1, "line-opacity": 0.85 },
        });
      });
    }

    // Soil archetype layer — polygons colored by soil family. Off by
    // default; toggle it on from the sidebar. Click any polygon → popup
    // with the archetype's traits + example sites + wines it makes.
    if (sl && !map.getSource("wine-soils")) {
      map.addSource("wine-soils", { type: "geojson", data: sl });
      const soilColor = [
        "match", ["get", "soil"],
        "volcanic",         SOILS.volcanic.swatch,
        "alluvial_gravel",  SOILS.alluvial_gravel.swatch,
        "alluvial_fan",     SOILS.alluvial_fan.swatch,
        "clay",             SOILS.clay.swatch,
        "marine_sed",       SOILS.marine_sed.swatch,
        "limestone_chalk",  SOILS.limestone_chalk.swatch,
        "#8a6f4a",
      ];
      map.addLayer({
        id: "wine-soils-fill",
        type: "fill",
        source: "wine-soils",
        layout: { visibility: "none" },
        paint: { "fill-color": soilColor, "fill-opacity": 0.5 },
      });
      map.addLayer({
        id: "wine-soils-outline",
        type: "line",
        source: "wine-soils",
        layout: { visibility: "none" },
        paint: { "line-color": soilColor, "line-width": 1.2, "line-opacity": 0.9 },
      });
      const onSoilClick = e => {
        const f = e.features?.[0];
        if (!f) return;
        const { soil, label } = f.properties || {};
        if (popupRef.current) popupRef.current.remove();
        popupRef.current = new mapboxgl.Popup({
          className: "wine-popup",
          maxWidth: "320px",
          closeButton: true,
          closeOnClick: false,
        })
          .setLngLat(e.lngLat)
          .setHTML(buildSoilPopupHtml(soil, label))
          .addTo(map);
      };
      map.on("click", "wine-soils-fill", onSoilClick);
      map.on("mouseenter", "wine-soils-fill", () => { map.getCanvas().style.cursor = "pointer"; });
      map.on("mouseleave", "wine-soils-fill", () => { map.getCanvas().style.cursor = ""; });
    }

    // Elevation contours from Mapbox Terrain v2, relabelled in feet.
    if (!map.getSource("wine-terrain")) {
      map.addSource("wine-terrain", { type: "vector", url: "mapbox://mapbox.mapbox-terrain-v2" });
      map.addLayer({
        id: "wine-contour-lines",
        type: "line",
        source: "wine-terrain",
        "source-layer": "contour",
        layout: { visibility: "none", "line-cap": "round", "line-join": "round" },
        paint: {
          "line-color": [
            "interpolate", ["linear"], ["get", "ele"],
            0,    "#6b3f1e",
            600,  "#4a2c12",
            1300, "#26160a",
          ],
          "line-width": ["match", ["get", "index"], 10, 2, 5, 1.3, 0.9],
          "line-opacity": ["match", ["get", "index"], 10, 1, 5, 0.95, 0.8],
        },
      });
      map.addLayer({
        id: "wine-contour-labels",
        type: "symbol",
        source: "wine-terrain",
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
          "text-opacity": ["interpolate", ["linear"], ["zoom"], 11.5, 0, 12.5, 1],
        },
      });
      // Fog inversion line — pinned to the ~1000 ft contour.
      map.addLayer({
        id: "wine-fog-inversion",
        type: "line",
        source: "wine-terrain",
        "source-layer": "contour",
        filter: ["==", ["get", "ele"], 300],
        layout: { visibility: "none", "line-cap": "round", "line-join": "round" },
        paint: {
          "line-color": "#1d4ed8",
          "line-width": 2.5,
          "line-dasharray": [2, 1.4],
          "line-opacity": 0.9,
        },
      });
      map.addLayer({
        id: "wine-fog-inversion-label",
        type: "symbol",
        source: "wine-terrain",
        "source-layer": "contour",
        filter: ["==", ["get", "ele"], 300],
        layout: {
          visibility: "none",
          "text-field": "Fog inversion ≈1000 ft",
          "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
          "text-size": 11,
          "symbol-placement": "line",
          "symbol-spacing": 600,
          "text-padding": 20,
          "text-allow-overlap": false,
        },
        paint: {
          "text-color": "#1d4ed8",
          "text-halo-color": "#ffffff",
          "text-halo-width": 2,
          "text-opacity": ["interpolate", ["linear"], ["zoom"], 10.5, 0, 11.5, 1],
        },
      });
    }

    // Named peaks.
    if (!map.getSource("wine-peaks")) {
      map.addSource("wine-peaks", { type: "geojson", data: "/data/wine-peaks.geojson" });
      map.addLayer({
        id: "wine-peaks",
        type: "symbol",
        source: "wine-peaks",
        layout: {
          "text-field": ["concat", "▲ ", ["get", "name"], "  ", ["to-string", ["get", "ele_ft"]], " ft"],
          "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
          "text-size": 12,
          "symbol-sort-key": ["-", 0, ["get", "ele_ft"]],
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

    // AVA outlines + labels on top + INVISIBLE fill for click hit-testing.
    // We can't attach click handlers to a line-only layer with any real
    // hit tolerance, so we paint a transparent fill polygon that captures
    // clicks anywhere inside the AVA.
    if (av && !map.getSource("wine-avas")) {
      map.addSource("wine-avas", { type: "geojson", data: av });
      map.addLayer({
        id: "wine-ava-fill-click",
        type: "fill",
        source: "wine-avas",
        paint: {
          "fill-color": "#000000",
          "fill-opacity": 0, // transparent — just for the click handler
        },
      });
      map.addLayer({
        id: "wine-ava-outline",
        type: "line",
        source: "wine-avas",
        paint: {
          "line-color": [
            "match", ["get", "kind"],
            "parent",   "#7f1d1d",
            "mountain", "#4c1d95",
            "sub",      "#1c1917",
            "#1c1917",
          ],
          "line-opacity": [
            "match", ["get", "kind"],
            "parent",   0.9,
            "mountain", 0.75,
            0.55,
          ],
          "line-width": [
            "match", ["get", "kind"],
            "parent",   2.2,
            "mountain", 1.5,
            1,
          ],
          "line-dasharray": [
            "case",
            ["==", ["get", "kind"], "parent"], ["literal", [1, 0]],
            ["==", ["get", "kind"], "mountain"], ["literal", [3, 2]],
            ["literal", [1, 0]],
          ],
        },
      });
      map.addLayer({
        id: "wine-ava-labels",
        type: "symbol",
        source: "wine-avas",
        filter: ["!=", ["get", "kind"], "parent"],
        layout: {
          "text-field": ["get", "name"],
          "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
          "text-size": ["interpolate", ["linear"], ["zoom"], 8, 9, 11, 12, 14, 14],
          "text-max-width": 8,
          "text-allow-overlap": false,
        },
        paint: {
          "text-color": [
            "match", ["get", "kind"],
            "mountain", "#4c1d95",
            "#1c1917",
          ],
          "text-halo-color": "#ffffff",
          "text-halo-width": 1.6,
          "text-opacity": ["interpolate", ["linear"], ["zoom"], 8, 0.7, 10, 0.95, 14, 1],
        },
      });

      // Click handler → open a popup for the top-most AVA under the cursor.
      // When two AVAs overlap (mountain AVA inside the parent Napa Valley
      // outline), prefer the more-specific kind: mountain > sub > parent.
      const kindPriority = { mountain: 3, sub: 2, parent: 1 };
      const onClick = e => {
        const features = map.queryRenderedFeatures(e.point, { layers: ["wine-ava-fill-click"] });
        if (!features.length) return;
        // Pick the highest-priority feature at this point.
        const best = features.reduce((acc, f) => {
          const p = kindPriority[f.properties?.kind] ?? 0;
          return p > (acc.p ?? 0) ? { f, p } : acc;
        }, { f: null, p: -1 }).f;
        if (!best) return;
        const { name, county, kind } = best.properties || {};
        // Close any existing popup, then open a fresh one at the click.
        if (popupRef.current) popupRef.current.remove();
        popupRef.current = new mapboxgl.Popup({
          className: "wine-popup",
          maxWidth: "320px",
          closeButton: true,
          closeOnClick: false,
        })
          .setLngLat(e.lngLat)
          .setHTML(buildPopupHtml(name, county, kind))
          .addTo(map);
      };
      map.on("click", "wine-ava-fill-click", onClick);
      map.on("mouseenter", "wine-ava-fill-click", () => { map.getCanvas().style.cursor = "pointer"; });
      map.on("mouseleave", "wine-ava-fill-click", () => { map.getCanvas().style.cursor = ""; });
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
      bounds: WINE_BOUNDS,
      fitBoundsOptions: { padding: 24 },
      minZoom: 7,
      maxZoom: 15,
    });
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");
    mapRef.current = map;
    map.on("load", () => {
      readyRef.current = true;
      addLayers();
    });
    return () => {
      if (popupRef.current) { popupRef.current.remove(); popupRef.current = null; }
      map.remove();
      mapRef.current = null;
      readyRef.current = false;
    };
  }, [addLayers]);

  // Data arrives → refresh refs + add.
  useEffect(() => {
    dataRef.current = { avas, zones, soils };
    addLayers();
  }, [avas, zones, soils, addLayers]);

  // Toggle changes → refresh refs + apply.
  useEffect(() => {
    visRef.current = {
      showSun, showCool, showWind, showFogMarine, showFogValley,
      showTemp, showTerrain, showContours, showFogLine, showPeaks, showAvas, showSoils,
    };
    applyVisibility();
  }, [
    showSun, showCool, showWind, showFogMarine, showFogValley,
    showTemp, showTerrain, showContours, showFogLine, showPeaks, showAvas, showSoils,
    applyVisibility,
  ]);

  // Picked address → drop a marker, keep the region framed.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (markerRef.current) { markerRef.current.remove(); markerRef.current = null; }
    if (!picked?.point) return;
    markerRef.current = new mapboxgl.Marker({ color: "#7b1e2f" }).setLngLat(picked.point).addTo(map);
    const [lng, lat] = picked.point;
    const inBounds =
      lng >= WINE_BOUNDS[0][0] && lng <= WINE_BOUNDS[1][0] &&
      lat >= WINE_BOUNDS[0][1] && lat <= WINE_BOUNDS[1][1];
    if (inBounds) {
      map.fitBounds(WINE_BOUNDS, { padding: 24, duration: 800 });
    } else {
      map.easeTo({ center: picked.point, zoom: 10, duration: 800 });
    }
  }, [picked]);

  if (!TOKEN) {
    return (
      <div className="fog-map-missing-token">
        <div>
          <h2>Map unavailable</h2>
          <p>
            Set <code>NEXT_PUBLIC_MAPBOX_TOKEN</code> to enable the map.
            In local dev, copy <code>.env.example</code> to <code>.env.local</code>
            and paste your Mapbox token.
          </p>
        </div>
      </div>
    );
  }
  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
}
