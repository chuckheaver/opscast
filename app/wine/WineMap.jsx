'use client';

// Mapbox GL JS map for the Wine Country AVA page. Renders:
//   - Sub-AVA polygons as semi-transparent colored fills + matching
//     outlines. The source is pre-sorted large→small (lib/avas.js) so
//     nested AVAs (Green Valley inside Russian River Valley) paint on
//     top and stay visually distinct.
//   - Umbrella regions (Napa Valley, Northern Sonoma, Sonoma Coast) as
//     bold dashed outlines only — fills would swallow their sub-AVAs.
//     North Coast is in the data for point lookups but never drawn.
//   - Centroid name labels for the sub-AVAs.
//   - A bold highlight outline around the AVA selected in the panel.
//
// Clicks anywhere report the lng/lat up to WineApp, which answers with
// the full appellation stack via exact point-in-polygon (not the
// tile-clipped queryRenderedFeatures).

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { fogHoursAtPoint, fogMicroclimate, typicalGrapes } from "./lib/avas";
import { hasWineProfile } from "./lib/grapes";

// A <span> of comma-separated grape names; ones we have a profile for
// become clickable buttons that open the grape modal via onGrapeClick.
function grapeListEl(names, onGrapeClick) {
  const span = document.createElement("span");
  names.forEach((name, i) => {
    if (i > 0) span.appendChild(document.createTextNode(", "));
    if (onGrapeClick && hasWineProfile(name)) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "grape-link";
      b.textContent = name;
      b.addEventListener("click", () => onGrapeClick(name));
      span.appendChild(b);
    } else {
      span.appendChild(document.createTextNode(name));
    }
  });
  return span;
}

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

// Soil-order fill ramp (USDA taxonomy). Earthy, distinct hues; shared by
// the map layer and the panel legend (SOIL_ORDER_LEGEND mirrors it).
const SOIL_ORDER_COLOR = [
  "match", ["get", "order"],
  "Mollisols", "#6b4423",    // dark fertile valley-floor/grassland soils
  "Alfisols", "#c8772e",     // orange-brown forested soils
  "Ultisols", "#a83a2c",     // weathered red hill soils
  "Inceptisols", "#cbb079",  // young tan soils
  "Entisols", "#ecd9a6",     // very young / alluvial
  "Vertisols", "#5c6b3a",    // shrink-swell clays
  "#c9c9c9",                  // Not ranked / other
];
// Plain-English meaning of each USDA soil order, framed for what it means
// to a vine/visitor — the scientific term ("Mollisols") is kept as a muted
// secondary label. `plain` is the headline; `note` is the one-line why.
export const SOIL_ORDER_INFO = {
  Mollisols:    { color: "#6b4423", plain: "Rich valley-floor loam", note: "deep & fertile — vigorous vines" },
  Alfisols:     { color: "#c8772e", plain: "Clay-rich woodland soil", note: "holds water well" },
  Ultisols:     { color: "#a83a2c", plain: "Weathered red hillside soil", note: "free-draining, lower vigor" },
  Inceptisols:  { color: "#cbb079", plain: "Young hillside soil", note: "thin, still developing" },
  Entisols:     { color: "#ecd9a6", plain: "Young riverwash soil", note: "alluvial, free-draining" },
  Vertisols:    { color: "#5c6b3a", plain: "Heavy cracking clay", note: "swells wet, cracks dry" },
  "Not ranked": { color: "#c9c9c9", plain: "Mixed / unclassified", note: "" },
};
// Display order for the legend.
export const SOIL_ORDER_LIST = [
  "Mollisols", "Alfisols", "Ultisols", "Inceptisols", "Entisols", "Vertisols", "Not ranked",
];
// Plain-English description for a given soil order (falls back gracefully).
export function soilPlain(order) {
  return (SOIL_ORDER_INFO[order] || SOIL_ORDER_INFO["Not ranked"]).plain;
}

// Soil readout label: scientific order first, then plain meaning, then the
// specific series — e.g. "Mollisols — Rich valley-floor loam (Bale)".
export function formatSoil(soil) {
  if (!soil) return null;
  const order = soil.order && soil.order !== "Not ranked" ? soil.order : null;
  const head = order ? `${order} — ${soilPlain(soil.order)}` : soilPlain(soil.order);
  const series = soil.series || soil.name;
  return series ? `${head} (${series})` : head;
}

// Default frame: tight on the Napa + Sonoma wine country — the Sonoma coast
// near Tomales across to Napa's eastern hills (Chiles Valley / Lake Berryessa),
// Carneros/Petaluma up to the north end of Alexander Valley.
const WINE_BOUNDS = [
  [-123.15, 38.10], // SW
  [-122.00, 38.78], // NE
];

// Build the winery popup DOM. Constructed with createElement (not an
// HTML string) so scraped text can never inject markup. Rows with no
// data show an em-dash, matching the panel's KeyRow convention.
function buildWineryPopup(p, microclimate, soil, grapes, onGrapeClick) {
  const root = document.createElement("div");
  root.className = "wine-popup";

  const h = document.createElement("div");
  h.className = "wine-popup-name";
  h.textContent = p.name;
  root.appendChild(h);

  const row = (label, contentEl) => {
    const r = document.createElement("div");
    r.className = "wine-popup-row";
    const l = document.createElement("span");
    l.className = "wine-popup-label";
    l.textContent = label;
    r.appendChild(l);
    const v = document.createElement("span");
    v.className = "wine-popup-value";
    if (contentEl == null || contentEl === "") {
      v.textContent = "—";
    } else if (typeof contentEl === "string") {
      v.textContent = contentEl;
    } else {
      v.appendChild(contentEl);
    }
    r.appendChild(v);
    root.appendChild(r);
  };

  const link = (href, text) => {
    const a = document.createElement("a");
    a.href = href;
    a.target = "_blank";
    a.rel = "noreferrer";
    a.textContent = text;
    return a;
  };

  row("Address", p.address);
  row("Phone", p.phone ? link(`tel:${p.phone}`, p.phone) : null);
  let websiteHost = null;
  if (p.website) {
    try {
      websiteHost = new URL(p.website).hostname.replace(/^www\./, "");
    } catch {}
  }
  row("Website", p.website ? link(p.website, `${websiteHost || "website"} ↗`) : null);
  row(
    "Varietals",
    p.varietals
      ? grapeListEl(p.varietals.split("|").map(s => s.trim()).filter(Boolean), onGrapeClick)
      : null
  );
  row("Elevation", Number.isFinite(p.elevationFt) ? `${p.elevationFt.toLocaleString()} ft` : null);
  row("AVA", p.ava || "Outside any AVA");
  row("Microclimate", microclimate || "Toggle Summer Fog on");
  row("Soil", soil ? formatSoil(soil) : "Toggle Soils on");
  if (grapes) {
    const span = grapeListEl(grapes.list, onGrapeClick);
    if (grapes.character) {
      const note = document.createElement("span");
      note.className = "wine-soil-note";
      note.textContent = ` · ${grapes.character}`;
      span.appendChild(note);
    }
    row("Typical grapes", span);
  }
  return root;
}

export default function WineMap({
  merged,
  labels,
  wineries,
  showNapa,
  showSonoma,
  showRegions,
  showLabels,
  showWineries,
  showVineyards,
  fog,
  showFog,
  soils,
  showSoils,
  showTerrain,
  showElevation,
  selectedId,
  picked,
  flyTo,
  onPickPoint,
  onGrapeClick,
}) {
  const containerRef = useRef(null);
  const markerRef = useRef(null);
  const popupRef = useRef(null);
  // Latest fog FeatureCollection, reachable from the once-bound click
  // handler without rebinding it on every data change.
  const fogRef = useRef(fog);
  useEffect(() => {
    fogRef.current = fog;
  }, [fog]);
  // Same pattern for the grape-modal opener.
  const onGrapeClickRef = useRef(onGrapeClick);
  useEffect(() => {
    onGrapeClickRef.current = onGrapeClick;
  }, [onGrapeClick]);
  const dataAppliedRef = useRef(false);
  const onPickRef = useRef(onPickPoint);
  // The map lives in state (not just a ref) so the data/filter effects
  // below re-run when it finishes being created a frame after mount.
  const [mapObj, setMapObj] = useState(null);

  useEffect(() => {
    onPickRef.current = onPickPoint;
  }, [onPickPoint]);

  // Mount the map exactly once — but one animation frame late. React's
  // dev-mode StrictMode double-mount otherwise creates two maps
  // back-to-back fetching the same style URL; the first map's teardown
  // aborts the shared browser request and mapbox-gl treats the abort as
  // a silent cancel, leaving the surviving map blank forever. Deferring
  // creation means the throwaway first mount is cleaned up before any
  // map (or network request) exists.
  useEffect(() => {
    if (!TOKEN) return;
    let map = null;
    // setTimeout (not requestAnimationFrame) so the map still initializes
    // in hidden/background tabs, where rAF is paused.
    const timer = setTimeout(() => {
      mapboxgl.accessToken = TOKEN;
      map = new mapboxgl.Map({
        container: containerRef.current,
        style: "mapbox://styles/mapbox/streets-v12",
        bounds: WINE_BOUNDS,
        fitBoundsOptions: { padding: 24 },
        minZoom: 7.5,
        maxZoom: 15,
      });
      // Zoom +/- in the bottom-left (above the Mapbox logo); the top-right and
      // bottom-right corners belong to our own controls (Layers / find-me).
      map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "bottom-left");
      setMapObj(map);
      // Dev-only escape hatch so the map can be driven from the console /
      // browser automation (synthetic DOM clicks don't reach mapbox).
      if (process.env.NODE_ENV === "development") window.__wineMap = map;

      map.on("load", () => {
      // Layer ids are prefixed "wine-" because Mapbox's hosted streets-v12
      // style ships its own layer literally named "hillshade" — an
      // unprefixed addLayer("hillshade") collides, the throw aborts this
      // handler, and mapbox re-fires "load" every frame (the endless
      // "already exists" console loop /fog exhibits). The guard makes
      // re-fires of this handler harmless.
      if (map.getLayer("wine-hillshade")) return;
      // Hillshade between the basemap land and its labels — the mountain
      // AVAs (Howell Mountain, Atlas Peak, Moon Mountain) only make sense
      // with relief visible.
      map.addSource("mapbox-dem", {
        type: "raster-dem",
        url: "mapbox://mapbox.mapbox-terrain-dem-v1",
        tileSize: 512,
        maxzoom: 14,
      });
      const firstLabelLayer = map.getStyle().layers.find(l => l.type === "symbol");
      map.addLayer(
        {
          id: "wine-hillshade",
          type: "hillshade",
          source: "mapbox-dem",
          layout: { visibility: "none" },
          // Gentler than /fog's USGS-dark settings — at valley zooms a
          // full-strength double pass buries the basemap in shadow.
          paint: {
            "hillshade-exaggeration": 0.45,
            "hillshade-shadow-color": "rgba(0, 0, 0, 0.45)",
            "hillshade-accent-color": "rgba(28, 25, 23, 0.35)",
            "hillshade-highlight-color": "rgba(255, 255, 255, 0.5)",
          },
        },
        firstLabelLayer?.id
      );
      // Second hillshade pass from the SE (155°) lights the slopes the
      // default 335° leaves shadowed — same double-pass relief as /fog.
      map.addLayer(
        {
          id: "wine-hillshade-2",
          type: "hillshade",
          source: "mapbox-dem",
          layout: { visibility: "none" },
          paint: {
            "hillshade-exaggeration": 0.3,
            "hillshade-illumination-direction": 155,
            "hillshade-shadow-color": "rgba(0, 0, 0, 0.25)",
            "hillshade-accent-color": "rgba(28, 25, 23, 0.2)",
            "hillshade-highlight-color": "rgba(168, 162, 158, 0)",
          },
        },
        firstLabelLayer?.id
      );

      // Mapbox Terrain v2 vector tileset — true topographic contour
      // lines (10 m fine / 100 m major), the same Elevation layer set
      // as /fog. Mountain AVAs (Howell Mountain, Atlas Peak, Moon
      // Mountain) are defined by elevation, so this earns its toggle.
      map.addSource("terrain-v2", {
        type: "vector",
        url: "mapbox://mapbox.mapbox-terrain-v2",
      });
      map.addLayer(
        {
          id: "wine-contour-lines",
          type: "line",
          source: "terrain-v2",
          "source-layer": "contour",
          layout: { visibility: "none", "line-cap": "round" },
          // Bolder when zoomed out (z9–11, where the whole hillside is a
          // few hundred pixels) and tapering to fine lines at street
          // zooms, so toggling Elevation reads instantly at valley scale.
          paint: {
            "line-color": "#292524",
            "line-width": [
              "interpolate", ["linear"], ["zoom"],
              9, [
                "match", ["get", "index"],
                10, 2.7,   // major contours (every 100m)
                5,  1.7,   // medium contours
                0.95,       // fine 10m contours
              ],
              13, [
                "match", ["get", "index"],
                10, 2.0,
                5,  1.2,
                0.6,
              ],
            ],
            "line-opacity": [
              "interpolate", ["linear"], ["zoom"],
              9, [
                "match", ["get", "index"],
                10, 1,
                5,  0.9,
                0.6,
              ],
              13, [
                "match", ["get", "index"],
                10, 1,
                5,  0.75,
                0.45,
              ],
            ],
          },
        },
        firstLabelLayer?.id
      );
      // Elevation labels along major contours. Wine country is read at
      // valley zooms (not SF street zooms), so labels fade in earlier
      // than /fog's 13→14.
      map.addLayer({
        id: "wine-contour-labels",
        type: "symbol",
        source: "terrain-v2",
        "source-layer": "contour",
        // Medium (50 m) and major (100 m) contours both get labels —
        // wine-country slopes are curvy enough that index-10 alone
        // yields almost no placements at valley zooms.
        filter: ["match", ["get", "index"], [5, 10], true, false],
        layout: {
          visibility: "none",
          "text-field": [
            "concat",
            ["to-string", ["round", ["*", ["get", "ele"], 3.28084]]],
            " ft",
          ],
          "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
          "text-size": 11,
          "text-padding": 2,
          "symbol-spacing": 200,
          "symbol-placement": "line",
          "text-allow-overlap": false,
        },
        paint: {
          "text-color": "#1c1917",
          "text-halo-color": "#ffffff",
          "text-halo-width": 1.6,
          "text-opacity": [
            "interpolate", ["linear"], ["zoom"],
            10.5, 0,
            11.5, 1,
          ],
        },
      });

      map.addSource("avas", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
        promoteId: "ava_id",
      });
      map.addSource("ava-labels", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });

      // Summer fog/low-cloud bands (USGS GOES, build-wine-fog.mjs).
      // Painted first (lowest) so vineyards, AVA lines and dots sit on
      // top. Warm amber = sunny/low-fog inland, deepening to cool
      // blue-grey on the foggy coast. Source order is large→small so the
      // small high-fog cores layer correctly with per-band opacity.
      map.addSource("fog", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });
      map.addLayer({
        id: "fog-fill",
        type: "fill",
        source: "fog",
        layout: { visibility: "none" },
        paint: {
          // Ramp tuned to the land range (most polygons over Napa/Sonoma
          // are 3–8 hrs; 10–13 sit offshore). Warm amber inland → cool
          // blue marine, with the steepest color change across 3.5–6
          // where the wineries actually live.
          "fill-color": [
            "interpolate", ["linear"], ["get", "hours"],
            2.5, "#fcd34d",  // warm amber — hot, sunny, minimal fog
            3.5, "#fde68a",
            4.5, "#dce7a0",  // gold-green transition
            5.5, "#9ecfd6",  // cooling — regular marine influence
            7,   "#6b9bb3",  // cool blue-grey
            10,  "#3f6d88",  // deep coastal fog (mostly offshore)
          ],
          "fill-opacity": 0.45,
        },
      });

      // SSURGO soil map units (USDA-NRCS, build-soils.mjs), colored by
      // taxonomic soil ORDER — the headline terroir layer. Lazy-loaded
      // (data arrives only when the toggle is first switched on). Drawn
      // above fog but below vineyards / AVA lines / dots.
      map.addSource("soils", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });
      map.addLayer({
        id: "soil-fill",
        type: "fill",
        source: "soils",
        layout: { visibility: "none" },
        paint: {
          "fill-color": SOIL_ORDER_COLOR,
          "fill-opacity": 0.15,
        },
      });
      map.addLayer({
        id: "soil-line",
        type: "line",
        source: "soils",
        layout: { visibility: "none" },
        paint: {
          "line-color": "#57534e",
          "line-width": 0.4,
          "line-opacity": 0.4,
        },
      });

      // Sub-AVA fills. Source order (large→small) controls paint order
      // within the layer, keeping nested AVAs on top.
      // Actual planted vineyard blocks — DWR Statewide Crop Mapping 2023
      // (scripts/build-vineyard-blocks.mjs). Mapbox streams the 7.7 MB
      // file itself; drawn beneath the AVA boundary lines and winery
      // dots so they read as the "what's planted where" ground truth.
      map.addSource("vineyards", {
        type: "geojson",
        data: "/data/avas/vineyard-blocks.geojson",
      });
      map.addLayer({
        id: "vineyard-fill",
        type: "fill",
        source: "vineyards",
        paint: {
          "fill-color": "#4d7c0f",
          "fill-opacity": 0.45,
        },
      });
      // Block outlines only at close zoom — 24k polygons of always-on
      // stroke would just read as noise from valley scale.
      map.addLayer({
        id: "vineyard-line",
        type: "line",
        source: "vineyards",
        minzoom: 12,
        paint: {
          "line-color": "#3f6212",
          "line-width": 0.5,
          "line-opacity": 0.5,
        },
      });

      // No fill shading (Charles's call) — each AVA is a colored
      // boundary line; the invisible fill stays only so the cursor turns
      // into a pointer anywhere inside an AVA.
      map.addLayer({
        id: "ava-fills",
        type: "fill",
        source: "avas",
        filter: ["==", ["get", "kind"], "ava"],
        paint: {
          "fill-color": ["get", "color"],
          "fill-opacity": 0,
        },
      });
      map.addLayer({
        id: "ava-borders",
        type: "line",
        source: "avas",
        layout: { "line-join": "round" },
        filter: ["==", ["get", "kind"], "ava"],
        paint: {
          "line-color": ["get", "color"],
          "line-width": [
            "interpolate", ["linear"], ["zoom"],
            8, 1.0,
            12, 1.6,
          ],
          "line-opacity": 0.95,
        },
      });

      // Umbrella region outlines — dashed charcoal so they read as
      // context, not as another fill AVA. North Coast and Sonoma Coast
      // are never drawn (huge coastal umbrellas, boundary lines just add
      // noise) — they still show up in the click stack.
      map.addLayer({
        id: "region-lines",
        type: "line",
        source: "avas",
        layout: { "line-join": "round" },
        filter: [
          "all",
          ["==", ["get", "kind"], "region"],
          ["match", ["get", "name"], ["North Coast", "Sonoma Coast"], false, true],
        ],
        paint: {
          "line-color": "#57534e",
          "line-width": 0.9,
          "line-opacity": 0.6,
          "line-dasharray": [2.2, 1.6],
        },
      });

      // Selected-AVA highlight, above everything else.
      map.addLayer({
        id: "ava-selected",
        type: "line",
        source: "avas",
        filter: ["==", ["get", "ava_id"], ""],
        paint: {
          "line-color": "#1c1917",
          "line-width": 2,
        },
      });

      // Winery points (sonoma.com directory, built by
      // scripts/build-sonoma-wineries.mjs). Dots at all zooms, names once
      // zoomed into a valley.
      map.addSource("wineries", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });
      map.addLayer({
        id: "winery-dots",
        type: "circle",
        source: "wineries",
        paint: {
          "circle-radius": [
            "interpolate", ["linear"], ["zoom"],
            8, 2.5,
            11, 4.5,
            14, 7,
          ],
          // Same blue as a Closed listing on /listings, per Charles.
          "circle-color": "#2563eb",
          "circle-stroke-color": "#ffffff",
          "circle-stroke-width": 1.2,
          "circle-opacity": 0.9,
        },
      });
      map.addLayer({
        id: "winery-labels",
        type: "symbol",
        source: "wineries",
        minzoom: 11.5,
        layout: {
          "text-field": ["get", "name"],
          "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
          "text-size": 10,
          "text-anchor": "top",
          "text-offset": [0, 0.6],
          "text-padding": 2,
          "text-allow-overlap": false,
        },
        paint: {
          "text-color": "#2563eb",
          "text-halo-color": "#ffffff",
          "text-halo-width": 1.4,
        },
      });

      map.addLayer({
        id: "ava-name-labels",
        type: "symbol",
        source: "ava-labels",
        layout: {
          "text-field": ["get", "name"],
          "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
          "text-size": 11,
          "text-padding": 6,
          "text-allow-overlap": false,
        },
        paint: {
          "text-color": ["get", "color"],
          "text-halo-color": "#ffffff",
          "text-halo-width": 1.6,
        },
      });

      map.on("mousemove", "ava-fills", () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "ava-fills", () => {
        map.getCanvas().style.cursor = "";
      });
      map.on("mousemove", "winery-dots", () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "winery-dots", () => {
        map.getCanvas().style.cursor = "";
      });
      map.on("click", e => {
        // A winery dot under the cursor wins over the AVA underneath it.
        const hits = map.queryRenderedFeatures(e.point, { layers: ["winery-dots"] });
        const winery = hits.length ? hits[0].properties : null;
        // Soil under the cursor — only resolves when the Soils layer is
        // toggled on (and thus rendered), which is when it's relevant.
        const soilHits = map.getLayer("soil-fill")
          ? map.queryRenderedFeatures(e.point, { layers: ["soil-fill"] })
          : [];
        const soil = soilHits.length ? soilHits[0].properties : null;
        popupRef.current?.remove();
        popupRef.current = null;
        if (winery) {
          const coords = hits[0].geometry.coordinates;
          const fogH = fogHoursAtPoint(fogRef.current, coords);
          const microclimate = fogMicroclimate(fogH);
          const grapes = typicalGrapes(soil?.order, fogH);
          popupRef.current = new mapboxgl.Popup({
            offset: 10,
            maxWidth: "300px",
            closeButton: true,
          })
            .setLngLat(coords)
            .setDOMContent(buildWineryPopup(winery, microclimate, soil, grapes, onGrapeClickRef.current))
            .addTo(map);
        }
        onPickRef.current([e.lngLat.lng, e.lngLat.lat], winery, soil);
      });
      });
    }, 0);

    return () => {
      clearTimeout(timer);
      if (map) map.remove();
    };
  }, []);

  // Readiness probe for the effects below. mapbox's isStyleLoaded() can
  // report false even after "load" has fired (style churn), and a
  // once("load") registered at that point never fires — data would be
  // silently dropped. Whether OUR sources exist is the truth that
  // matters: they're created by the load handler above.
  const whenReady = (map, apply) => {
    if (map.getSource("avas")) apply();
    else map.once("load", apply);
  };

  // Push the merged AVA data into the sources once both have arrived.
  useEffect(() => {
    const map = mapObj;
    if (!map || !merged || dataAppliedRef.current) return;
    whenReady(map, () => {
      const src = map.getSource("avas");
      if (!src) return;
      src.setData(merged);
      if (labels) map.getSource("ava-labels")?.setData(labels);
      dataAppliedRef.current = true;
    });
  }, [mapObj, merged, labels]);

  // Winery points arrive from their own fetch.
  useEffect(() => {
    const map = mapObj;
    if (!map || !wineries) return;
    whenReady(map, () => map.getSource("wineries")?.setData(wineries));
  }, [mapObj, wineries]);

  // Fog bands arrive from their own fetch.
  useEffect(() => {
    const map = mapObj;
    if (!map || !fog) return;
    whenReady(map, () => map.getSource("fog")?.setData(fog));
  }, [mapObj, fog]);

  // Soils arrive lazily (only after the toggle is first switched on).
  useEffect(() => {
    const map = mapObj;
    if (!map || !soils) return;
    whenReady(map, () => map.getSource("soils")?.setData(soils));
  }, [mapObj, soils]);

  // County toggles rebuild the filters on the fill/border/label layers.
  // Los Carneros and North Coast belong to both counties, so visibility
  // is an OR across the enabled county flags.
  useEffect(() => {
    const map = mapObj;
    if (!map) return;
    const apply = () => {
      const countyOr = [];
      if (showNapa) countyOr.push(["==", ["get", "inNapa"], true]);
      if (showSonoma) countyOr.push(["==", ["get", "inSonoma"], true]);
      const countyExpr = countyOr.length ? ["any", ...countyOr] : ["boolean", false];
      const setF = (id, kind) => {
        if (map.getLayer(id)) {
          map.setFilter(id, ["all", ["==", ["get", "kind"], kind], countyExpr]);
        }
      };
      setF("ava-fills", "ava");
      setF("ava-borders", "ava");
      if (map.getLayer("ava-name-labels")) {
        map.setFilter("ava-name-labels", countyExpr);
      }
      if (map.getLayer("region-lines")) {
        map.setFilter("region-lines", [
          "all",
          ["==", ["get", "kind"], "region"],
          // Coastal umbrellas stay undrawn — see the layer definition.
          ["match", ["get", "name"], ["North Coast", "Sonoma Coast"], false, true],
          countyExpr,
        ]);
      }
    };
    whenReady(map, apply);
  }, [mapObj, showNapa, showSonoma]);

  // Mapbox's terrain-v2 tiles carry no contour geometry below zoom ~9,
  // so flipping Elevation on at the county-wide view would show nothing
  // and read as broken. Remember the previous toggle state so switching
  // it ON while zoomed out glides the camera in to where lines exist.
  const prevElevationRef = useRef(showElevation);

  // Simple visibility toggles.
  useEffect(() => {
    const map = mapObj;
    if (!map) return;
    if (showElevation && !prevElevationRef.current && map.getZoom() < 9.2) {
      map.easeTo({ zoom: 9.7, duration: 1500 });
    }
    prevElevationRef.current = showElevation;
    const apply = () => {
      const flips = [
        ["region-lines", showRegions],
        ["ava-name-labels", showLabels],
        ["winery-dots", showWineries],
        ["winery-labels", showWineries],
        ["vineyard-fill", showVineyards],
        ["vineyard-line", showVineyards],
        ["fog-fill", showFog],
        ["soil-fill", showSoils],
        ["soil-line", showSoils],
        ["wine-hillshade", showTerrain],
        ["wine-hillshade-2", showTerrain],
        ["wine-contour-lines", showElevation],
        ["wine-contour-labels", showElevation],
      ];
      flips.forEach(([id, on]) => {
        if (map.getLayer(id)) {
          map.setLayoutProperty(id, "visibility", on ? "visible" : "none");
        }
      });
    };
    whenReady(map, apply);
  }, [mapObj, showRegions, showLabels, showWineries, showVineyards, showFog, showSoils, showTerrain, showElevation]);

  // Highlight the panel-selected AVA.
  useEffect(() => {
    const map = mapObj;
    if (!map) return;
    const apply = () => {
      if (map.getLayer("ava-selected")) {
        map.setFilter("ava-selected", ["==", ["get", "ava_id"], selectedId || ""]);
      }
    };
    whenReady(map, apply);
  }, [mapObj, selectedId]);

  // Wine-glass marker at the clicked point.
  useEffect(() => {
    const map = mapObj;
    if (!map) return;
    if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }
    if (!picked?.point) return;
    const el = document.createElement("div");
    el.className = "wine-pick-marker";
    el.textContent = "🍷";
    markerRef.current = new mapboxgl.Marker({ element: el, anchor: "bottom" })
      .setLngLat(picked.point)
      .addTo(map);
  }, [mapObj, picked]);

  // Fly the camera to a requested target (address search, "find me", or a
  // chip-picked AVA / winery). Keyed on the object identity so each request
  // animates once.
  useEffect(() => {
    const map = mapObj;
    if (!map || !flyTo?.center) return;
    map.easeTo({ center: flyTo.center, zoom: flyTo.zoom ?? map.getZoom(), duration: 1200 });
  }, [mapObj, flyTo]);

  if (!TOKEN) {
    return (
      <div className="fog-map-missing-token">
        <div>
          <h2>Mapbox token missing</h2>
          <p>
            <code>NEXT_PUBLIC_MAPBOX_TOKEN</code> isn&apos;t set in this
            environment. Add it to <code>.env.local</code> (token from{" "}
            <a href="https://account.mapbox.com/access-tokens/" target="_blank" rel="noreferrer">mapbox.com</a>),
            then restart the dev server.
          </p>
        </div>
      </div>
    );
  }

  return <div ref={containerRef} className="fog-map" />;
}
