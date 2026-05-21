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

// Hand-picked weather emoji at SF locations chosen from the user's
// markup. Each pin renders as a DOM marker so the system emoji font
// is honoured. Coordinates are eyeballed neighborhood centers and
// can be tuned in place.
const FOG_PIN_GROUPS = [
  // ☀️ — fully sunny neighborhoods (squares in markup)
  {
    emoji: "☀️",
    points: [
      [-122.412, 37.792], // Nob Hill
      [-122.418, 37.781], // Civic Center
      [-122.391, 37.780], // South Beach
      [-122.416, 37.762], // Mission Dolores / 18th
      [-122.434, 37.762], // Castro
    ],
  },
  // 🌤️ — partly-sunny transition belt (stars in markup)
  {
    emoji: "🌤️",
    points: [
      [-122.460, 37.797], // Presidio (west)
      [-122.443, 37.795], // Presidio (east)
      [-122.450, 37.787], // Presidio Heights
      [-122.444, 37.781], // Anza Vista
      [-122.447, 37.773], // Panhandle
      [-122.451, 37.755], // Clarendon Heights
      [-122.431, 37.751], // Noe Valley
      [-122.415, 37.745], // Peralta Heights
      [-122.420, 37.741], // Diamond Heights / Bernal
      [-122.388, 37.762], // Central Waterfront / Dogpatch
      [-122.379, 37.737], // India Basin
      [-122.371, 37.728], // Hunters Point
    ],
  },
  // ⛅️ — partly cloudy (circles in markup)
  {
    emoji: "⛅️",
    points: [
      [-122.493, 37.781], // Outer Richmond (NE)
      [-122.474, 37.778], // Inner Richmond
      [-122.488, 37.772], // Outer Richmond (mid)
      [-122.480, 37.770], // Golden Gate Park center
      [-122.464, 37.762], // Inner Sunset / Parnassus
      [-122.503, 37.756], // Outer Sunset (Kirkham)
      [-122.484, 37.754], // Sunset 24th Ave
      [-122.456, 37.748], // Forest Knolls
      [-122.438, 37.737], // Glen Park
      [-122.408, 37.723], // Portola / University Mound
      [-122.388, 37.728], // Bayview (north slope)
    ],
  },
  // ☁️ — full fog (octagons in markup)
  {
    emoji: "☁️",
    points: [
      [-122.475, 37.732], // Parkside / Stoat Blvd
      [-122.466, 37.720], // Ingleside Terraces
      [-122.452, 37.722], // Westwood Park / Sunnyside
      [-122.440, 37.713], // Cayuga / Excelsior
    ],
  },
];

// Layer IDs the "Show fog data" toggle flips on and off as a group.
const CONTOUR_LAYER_IDS = [
  "fog-contours-fog",
  "fog-contours-transition-outline",
];

export default function FogMap({
  geojson,
  contours,
  showContours,
  showTerrain,
  showSeismic,
  showMuni,
  showBikes,
  showZips,
  showDistricts,
  showZoning,
  showRealtor,
  showNeighborhoods,
  picked,
  onPickFeature,
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const transitionMarkersRef = useRef([]);
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
      style: "mapbox://styles/mapbox/streets-v12",
      center: SF_CENTER,
      zoom: 11.2,
      minZoom: 10,
      maxZoom: 16,
    });
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");
    mapRef.current = map;

    map.on("load", () => {
      // Hillshade overlay (toggleable). Lives between the basemap land/
      // water and the basemap labels, so SF's hills (Twin Peaks, Mt Tam,
      // San Bruno Mtn) shade visibly while street and place names stay
      // legible on top. A second hillshade pass from the opposite
      // illumination angle stacks on top to deepen the shadows on slopes
      // the primary light leaves flat.
      map.addSource("mapbox-dem", {
        type: "raster-dem",
        url: "mapbox://mapbox.mapbox-terrain-dem-v1",
        tileSize: 512,
        maxzoom: 14,
      });
      const firstLabelLayer = map.getStyle().layers.find(l => l.type === "symbol");
      map.addLayer(
        {
          id: "hillshade",
          type: "hillshade",
          source: "mapbox-dem",
          layout: { visibility: "none" },
          paint: {
            "hillshade-exaggeration": 1,
            "hillshade-shadow-color": "#000000",
            "hillshade-accent-color": "#1c1917",
            "hillshade-highlight-color": "#a8a29e",
          },
        },
        firstLabelLayer?.id
      );
      // Second hillshade pass from the SE (155°) lights the slopes the
      // default 335° leaves shadowed, doubling up the relief feel.
      map.addLayer(
        {
          id: "hillshade-2",
          type: "hillshade",
          source: "mapbox-dem",
          layout: { visibility: "none" },
          paint: {
            "hillshade-exaggeration": 1,
            "hillshade-illumination-direction": 155,
            "hillshade-shadow-color": "rgba(0, 0, 0, 0.6)",
            "hillshade-accent-color": "rgba(28, 25, 23, 0.5)",
            "hillshade-highlight-color": "rgba(168, 162, 158, 0)",
          },
        },
        firstLabelLayer?.id
      );

      // Mapbox Terrain v2 vector tileset — provides true topographic
      // contour lines (every 10m fine / 100m major). Combined with the
      // hillshade below, this gives the /fog map a proper USGS feel
      // when the user toggles terrain on.
      map.addSource("terrain-v2", {
        type: "vector",
        url: "mapbox://mapbox.mapbox-terrain-v2",
      });
      map.addLayer(
        {
          id: "contour-lines",
          type: "line",
          source: "terrain-v2",
          "source-layer": "contour",
          layout: { visibility: "none", "line-cap": "round" },
          paint: {
            "line-color": "#4b5563",
            "line-width": [
              "match", ["get", "index"],
              10, 1.1,   // major contours (every 100m) — bolder
              5,  0.7,   // medium contours
              0.35,       // fine 10m contours
            ],
            "line-opacity": [
              "match", ["get", "index"],
              10, 0.85,
              5,  0.55,
              0.3,
            ],
          },
        },
        firstLabelLayer?.id
      );
      // Elevation labels along major contour lines, only at street zoom
      // so the map doesn't fill with numbers when you're zoomed out.
      map.addLayer({
        id: "contour-labels",
        type: "symbol",
        source: "terrain-v2",
        "source-layer": "contour",
        filter: ["==", ["get", "index"], 10],
        layout: {
          visibility: "none",
          "text-field": ["concat", ["to-string", ["get", "ele"]], " m"],
          "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
          "text-size": 10,
          "text-padding": 12,
          "symbol-placement": "line",
          "text-allow-overlap": false,
        },
        paint: {
          "text-color": "#374151",
          "text-halo-color": "#ffffff",
          "text-halo-width": 1.5,
          "text-opacity": [
            "interpolate", ["linear"], ["zoom"],
            13, 0,
            14, 1,
          ],
        },
      });

      // Curated Bay Area peaks — labelled with name + elevation. Same
      // toggle as the hillshade so they appear and hide together.
      map.addSource("peaks", {
        type: "geojson",
        data: "/data/sf-bay-peaks.geojson",
      });
      map.addLayer({
        id: "peaks-labels",
        type: "symbol",
        source: "peaks",
        layout: {
          visibility: "none",
          "text-field": [
            "format",
            "▲ ", { "font-scale": 0.9 },
            ["get", "name"], {},
            "\n", {},
            ["concat", ["to-string", ["get", "elevation_ft"]], " ft"],
            { "font-scale": 0.85 },
          ],
          "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
          "text-size": 12,
          "text-anchor": "left",
          "text-offset": [0.7, 0],
          "text-allow-overlap": false,
          "text-padding": 4,
        },
        paint: {
          "text-color": "#1c1917",
          "text-halo-color": "#ffffff",
          "text-halo-width": 1.6,
          "text-halo-blur": 0.5,
        },
      });

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
      // Mapbox fetches the GeoJSON directly so the polygons render
      // independent of FogApp's parallel fetch (which still happens so
      // findContourForPoint can answer point-in-polygon queries).
      map.addSource("fog-contours", {
        type: "geojson",
        data: "/data/sf-fog-contours.geojson",
      });

      // Grey gradient band (≥8.5 hrs): light grey at 8.5 → near-black
      // at 12.5. The 8.5 polygon is the lightest step in the sequence;
      // each darker shade above signals more daily fog hours.
      map.addLayer({
        id: "fog-contours-fog",
        type: "fill",
        source: "fog-contours",
        filter: [">=", ["coalesce", ["get", "hours"], 0], 8.5],
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

      // (Sun band — < 8.5 hrs — intentionally has no fill layer. Polygons
      //  in that band are left transparent so the basemap reads through.
      //  The 8.0 contour still gets a dashed outline below as a visible
      //  boundary cue.)


      // SF Zoning Districts (DataSF) — 1,647 simplified polygons. Toggleable
      // colored fill by generalized category so the user can see at a
      // glance how Mission Bay reads as Mixed Use, the Marina as Residential,
      // etc. Outline kept very thin so it doesn't compete with other layers.
      map.addSource("zoning", {
        type: "geojson",
        data: "/data/sf-zoning.geojson",
      });
      map.addLayer({
        id: "zoning-fill",
        type: "fill",
        source: "zoning",
        layout: { visibility: "none" },
        paint: {
          "fill-color": [
            "match", ["get", "gen"],
            "Residential", "#a3e635",
            "Public",      "#06b6d4",
            "Mixed Use",   "#fb923c",
            "Mixed",       "#fb923c",
            "Industrial",  "#71717a",
            "Commercial",  "#fbbf24",
            "#d4d4d8",
          ],
          "fill-opacity": 0.3,
        },
      });
      map.addLayer({
        id: "zoning-outline",
        type: "line",
        source: "zoning",
        layout: { visibility: "none" },
        paint: {
          "line-color": "#52525b",
          "line-width": 0.3,
          "line-opacity": 0.5,
        },
      });

      // Realtor Neighborhoods (DataSF) — 92 neighborhoods grouped into
      // 10 SFAR districts. Each feature has a per-neighborhood `color`
      // baked into properties by the slimming pass: the district number
      // (1–10) picks a base hue, and the sub-letter (a, b, c, …) shifts
      // lightness so e.g. 5a/5b/5c are all greens but visibly distinct
      // from each other. Mapbox reads the property directly.
      map.addSource("realtor", {
        type: "geojson",
        data: "/data/sf-realtor-neighborhoods.geojson",
      });
      // (Realtor fill removed by request — boundary lines + labels carry
      //  the boundary line is a single solid blue so the realtor
      //  districts read distinctly against the black neighborhood
      //  outlines.)
      map.addLayer({
        id: "realtor-outline",
        type: "line",
        source: "realtor",
        layout: { visibility: "none", "line-join": "round" },
        paint: {
          "line-color": "#1d4ed8",
          "line-width": 1.8,
          "line-opacity": 0.95,
          // Inset each feature's outline into its own interior so adjacent
          // neighborhoods don't share a single seam — at shared edges the
          // two offset lines sit side-by-side.
          "line-offset": 1.5,
        },
      });
      map.addLayer({
        id: "realtor-labels",
        type: "symbol",
        source: "realtor",
        layout: {
          visibility: "none",
          // `display_label` is pre-baked into the GeoJSON as
          // "<nbrhood>\n<nid>" so the renderer sees a single string
          // with an embedded newline — bypasses any quirks with
          // multi-section format expressions.
          "text-field": ["coalesce", ["get", "display_label"], ["get", "nbrhood"]],
          "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
          "text-size": [
            "interpolate", ["linear"], ["zoom"],
            11, 9,
            13, 11,
            15, 13,
          ],
          "text-line-height": 1.1,
          "text-max-width": 9,
          "text-padding": 3,
          "text-allow-overlap": false,
          "symbol-placement": "point",
        },
        paint: {
          "text-color": "#1d4ed8",
          "text-halo-color": "#ffffff",
          "text-halo-width": 1.4,
          "text-halo-blur": 0.5,
          "text-opacity": [
            "interpolate", ["linear"], ["zoom"],
            10.5, 0,
            11.5, 0.9,
            14, 1,
          ],
        },
      });

      // Seismic hazard zones (CA Geological Survey, via DataSF). Toggleable
      // overlay separate from the fog data. Painted between the fog layers
      // and the neighborhood outlines so the hazard zones sit on top of
      // the fog colour but underneath the boundary lines and labels.
      map.addSource("seismic", {
        type: "geojson",
        data: "/data/sf-seismic-hazards.geojson",
      });
      map.addLayer({
        id: "seismic-fill",
        type: "fill",
        source: "seismic",
        layout: { visibility: "none" },
        paint: {
          "fill-color": "#dc2626",
          "fill-opacity": 0.28,
        },
      });
      map.addLayer({
        id: "seismic-outline",
        type: "line",
        source: "seismic",
        layout: { visibility: "none", "line-join": "round" },
        paint: {
          "line-color": "#991b1b",
          "line-width": 0.8,
          "line-opacity": 0.7,
        },
      });

      // Dashed outline ONLY on the 8.0 polygon — it's the "edge of Sun"
      // SFMTA bike network — 5,455 segments from DataSF. Color-coded by
      // facility class:
      //   CLASS I   (BIKE PATH)         → dark green, solid    — off-street, gold standard
      //   CLASS IV  (SEPARATED BIKEWAY) → green, solid          — protected lane
      //   CLASS II  (BIKE LANE)         → cyan, solid           — striped lane
      //   CLASS III (BIKE ROUTE)        → grey, dashed          — sharrow / shared route
      map.addSource("bikes", {
        type: "geojson",
        data: "/data/sf-bike-network.geojson",
      });
      // Solid lines for Class I / II / IV (the real infrastructure).
      map.addLayer({
        id: "bikes-solid",
        type: "line",
        source: "bikes",
        layout: {
          visibility: "none",
          "line-cap": "round",
          "line-join": "round",
        },
        filter: ["in", ["get", "facility"], ["literal", ["CLASS I", "CLASS II", "CLASS IV"]]],
        paint: {
          "line-color": [
            "match", ["get", "facility"],
            "CLASS I",  "#15803d",
            "CLASS IV", "#22c55e",
            "CLASS II", "#06b6d4",
            "#06b6d4",
          ],
          "line-width": [
            "interpolate", ["linear"], ["zoom"],
            10, 1,
            13, 2,
            16, 3.5,
          ],
          "line-opacity": 0.9,
        },
      });
      // Dashed lines for Class III (shared routes / sharrows).
      map.addLayer({
        id: "bikes-dashed",
        type: "line",
        source: "bikes",
        layout: {
          visibility: "none",
          "line-cap": "round",
          "line-join": "round",
        },
        filter: ["==", ["get", "facility"], "CLASS III"],
        paint: {
          "line-color": "#6b7280",
          "line-width": [
            "interpolate", ["linear"], ["zoom"],
            10, 0.8,
            13, 1.6,
            16, 2.4,
          ],
          "line-dasharray": [2, 2.5],
          "line-opacity": 0.75,
        },
      });

      // Muni stops — 3,260 points from DataSF/SFMTA. Small dots that
      // densify the city grid when toggled on; names appear at zoom 14+.
      map.addSource("muni", {
        type: "geojson",
        data: "/data/sf-muni-stops.geojson",
      });
      map.addLayer({
        id: "muni-dots",
        type: "circle",
        source: "muni",
        layout: { visibility: "none" },
        paint: {
          "circle-radius": [
            "interpolate", ["linear"], ["zoom"],
            10, 1.5,
            13, 3,
            16, 5,
          ],
          "circle-color": "#dc2626",
          "circle-stroke-width": 1,
          "circle-stroke-color": "#fff",
          "circle-stroke-opacity": 0.9,
          "circle-opacity": 0.85,
        },
      });
      map.addLayer({
        id: "muni-labels",
        type: "symbol",
        source: "muni",
        layout: {
          visibility: "none",
          "text-field": ["get", "name"],
          "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
          "text-size": 10,
          "text-anchor": "top",
          "text-offset": [0, 0.5],
          "text-allow-overlap": false,
          "text-padding": 2,
          "text-optional": true,
        },
        paint: {
          "text-color": "#1c1917",
          "text-halo-color": "#ffffff",
          "text-halo-width": 1.4,
          "text-opacity": [
            "interpolate", ["linear"], ["zoom"],
            13.5, 0,
            14.5, 1,
          ],
        },
      });

      // Supervisor Districts (DataSF, 2022 boundaries) — 11 polygons,
      // outlined with bold lines and labelled with the district number
      // inside a pill so the political map reads cleanly when on.
      map.addSource("districts", {
        type: "geojson",
        data: "/data/sf-supervisor-districts.geojson",
      });
      // Per-district colour ramp so each Supervisor district reads as a
      // distinct boundary. Same key (district number) drives both the
      // outline and the matching label colour so the two read as a pair.
      const districtColorMatch = [
        "match", ["get", "district"],
        1,  "#dc2626", // D1 — Richmond
        2,  "#ea580c", // D2 — Marina / Pac Heights
        3,  "#ca8a04", // D3 — North Beach / Russian Hill
        4,  "#16a34a", // D4 — Sunset
        5,  "#0891b2", // D5 — Western Addition / Haight
        6,  "#2563eb", // D6 — SoMa / Tenderloin
        7,  "#7c3aed", // D7 — West of Twin Peaks
        8,  "#c026d3", // D8 — Castro / Noe
        9,  "#db2777", // D9 — Mission / Bernal
        10, "#475569", // D10 — Bayview / Hunters Point
        11, "#65a30d", // D11 — Excelsior / OMI
        "#525252",
      ];
      map.addLayer({
        id: "districts-line",
        type: "line",
        source: "districts",
        layout: { visibility: "none", "line-join": "round" },
        paint: {
          "line-color": districtColorMatch,
          "line-width": 2.6,
          "line-opacity": 0.95,
        },
      });
      map.addLayer({
        id: "districts-labels",
        type: "symbol",
        source: "districts",
        layout: {
          visibility: "none",
          "text-field": ["concat", "D", ["to-string", ["get", "district"]]],
          "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
          "text-size": 18,
          "text-allow-overlap": false,
          "symbol-placement": "point",
        },
        paint: {
          "text-color": districtColorMatch,
          "text-halo-color": "#ffffff",
          "text-halo-width": 2,
          "text-halo-blur": 0.5,
        },
      });

      // ZIP codes (DataSF) — 32 polygons. Just outlines + the 5-digit ZIP
      // label centered in each so the user can see which ZIP a picked
      // address falls in without obscuring everything else.
      map.addSource("zips", {
        type: "geojson",
        data: "/data/sf-zip-codes.geojson",
      });
      map.addLayer({
        id: "zips-line",
        type: "line",
        source: "zips",
        layout: { visibility: "none", "line-join": "round", "line-cap": "round" },
        paint: {
          "line-color": ["get", "color"],
          "line-width": 2,
          "line-dasharray": [3, 1.5],
          "line-opacity": 0.9,
        },
      });
      map.addLayer({
        id: "zips-labels",
        type: "symbol",
        source: "zips",
        layout: {
          visibility: "none",
          "text-field": ["to-string", ["get", "zip"]],
          "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
          "text-size": 13,
          "text-allow-overlap": false,
          "symbol-placement": "point",
        },
        paint: {
          "text-color": ["get", "color"],
          "text-halo-color": "#ffffff",
          "text-halo-width": 2,
          "text-halo-blur": 0.5,
        },
      });

      // Dashed outline on the entire 8.5 (Transition) polygon boundary.
      // Reads natively off the contour source, no LineString preprocessing
      // needed — so the dashes stay continuous wherever the contour goes.
      map.addLayer({
        id: "fog-contours-transition-outline",
        type: "line",
        source: "fog-contours",
        filter: ["==", ["coalesce", ["get", "hours"], 0], 8.5],
        layout: {
          visibility: "none",
          "line-cap": "round",
          "line-join": "round",
        },
        paint: {
          "line-color": "#9ca3af",
          "line-width": 1.2,
          "line-dasharray": [2, 2.6],
          "line-opacity": 0.45,
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

  // Weather-emoji DOM markers at hand-picked SF locations. Mounted as
  // mapboxgl.Markers so the system emoji font renders natively. Each
  // group in FOG_PIN_GROUPS contributes a different emoji at its own
  // list of coordinates. Markers are created once and their CSS
  // visibility is toggled in lockstep with the Fog-data layer — so the
  // emojis turn on and off with the contour polygons.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const create = () => {
      transitionMarkersRef.current.forEach(m => m.remove());
      transitionMarkersRef.current = [];
      FOG_PIN_GROUPS.forEach(({ emoji, points }) => {
        points.forEach(pt => {
          const el = document.createElement("div");
          el.className = "fog-cloud-marker";
          el.textContent = emoji;
          const marker = new mapboxgl.Marker({ element: el, anchor: "center" })
            .setLngLat(pt)
            .addTo(map);
          transitionMarkersRef.current.push(marker);
        });
      });
    };
    if (map.isStyleLoaded()) create();
    else map.once("load", create);
    return () => {
      transitionMarkersRef.current.forEach(m => m.remove());
      transitionMarkersRef.current = [];
    };
  }, []);

  // Show/hide the emoji markers alongside the Fog-data toggle.
  useEffect(() => {
    transitionMarkersRef.current.forEach(m => {
      const el = m.getElement();
      if (el) el.style.display = showContours ? "" : "none";
    });
  }, [showContours]);

  // Toggle the hillshade terrain overlay + peak labels.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const apply = () => {
      const vis = showTerrain ? "visible" : "none";
      ["hillshade", "hillshade-2", "contour-lines", "contour-labels", "peaks-labels"].forEach(id => {
        if (map.getLayer(id)) map.setLayoutProperty(id, "visibility", vis);
      });
    };
    if (map.isStyleLoaded()) apply();
    else map.once("load", apply);
  }, [showTerrain]);

  // Toggle the seismic hazard overlay (fill + outline).
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const apply = () => {
      const vis = showSeismic ? "visible" : "none";
      ["seismic-fill", "seismic-outline"].forEach(id => {
        if (map.getLayer(id)) map.setLayoutProperty(id, "visibility", vis);
      });
    };
    if (map.isStyleLoaded()) apply();
    else map.once("load", apply);
  }, [showSeismic]);

  // Toggle the Muni stops overlay (dots + zoom-in labels).
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const apply = () => {
      const vis = showMuni ? "visible" : "none";
      ["muni-dots", "muni-labels"].forEach(id => {
        if (map.getLayer(id)) map.setLayoutProperty(id, "visibility", vis);
      });
    };
    if (map.isStyleLoaded()) apply();
    else map.once("load", apply);
  }, [showMuni]);

  // Toggle the SF neighborhood outlines + name labels. The invisible
  // click-target layer stays visible always so map clicks still resolve
  // to a neighborhood regardless of whether the boundary is on screen.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const apply = () => {
      const vis = showNeighborhoods ? "visible" : "none";
      ["fog-outline", "fog-hover", "fog-labels"].forEach(id => {
        if (map.getLayer(id)) map.setLayoutProperty(id, "visibility", vis);
      });
    };
    if (map.isStyleLoaded()) apply();
    else map.once("load", apply);
  }, [showNeighborhoods]);

  // Toggle the Realtor Neighborhoods overlay (fill + outline + labels).
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const apply = () => {
      const vis = showRealtor ? "visible" : "none";
      ["realtor-outline", "realtor-labels"].forEach(id => {
        if (map.getLayer(id)) map.setLayoutProperty(id, "visibility", vis);
      });
    };
    if (map.isStyleLoaded()) apply();
    else map.once("load", apply);
  }, [showRealtor]);

  // Toggle the zoning overlay (color-coded fills + thin outline).
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const apply = () => {
      const vis = showZoning ? "visible" : "none";
      ["zoning-fill", "zoning-outline"].forEach(id => {
        if (map.getLayer(id)) map.setLayoutProperty(id, "visibility", vis);
      });
    };
    if (map.isStyleLoaded()) apply();
    else map.once("load", apply);
  }, [showZoning]);

  // Toggle the supervisor district outlines + labels.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const apply = () => {
      const vis = showDistricts ? "visible" : "none";
      ["districts-line", "districts-labels"].forEach(id => {
        if (map.getLayer(id)) map.setLayoutProperty(id, "visibility", vis);
      });
    };
    if (map.isStyleLoaded()) apply();
    else map.once("load", apply);
  }, [showDistricts]);

  // Toggle the ZIP code outlines + labels.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const apply = () => {
      const vis = showZips ? "visible" : "none";
      ["zips-line", "zips-labels"].forEach(id => {
        if (map.getLayer(id)) map.setLayoutProperty(id, "visibility", vis);
      });
    };
    if (map.isStyleLoaded()) apply();
    else map.once("load", apply);
  }, [showZips]);

  // Toggle the bike network overlay (solid + dashed line layers).
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const apply = () => {
      const vis = showBikes ? "visible" : "none";
      ["bikes-solid", "bikes-dashed"].forEach(id => {
        if (map.getLayer(id)) map.setLayoutProperty(id, "visibility", vis);
      });
    };
    if (map.isStyleLoaded()) apply();
    else map.once("load", apply);
  }, [showBikes]);

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
