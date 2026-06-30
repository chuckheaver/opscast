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
import { NAME_OVERRIDES, getBuilding, RENTAL_OBJECTIDS, FORCE_COMMERCIAL_OBJECTIDS } from "./lib/buildings";

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
const SF_CENTER = [-122.447, 37.7649];
// Bounding box that frames just SF — Ocean Beach / Daly City to the
// Embarcadero / Bayview — so the city fills the map without the
// surrounding Bay competing for attention.
const SF_BOUNDS = [
  [-122.520, 37.708], // SW
  [-122.355, 37.812], // NE
];

// Three large weather glyphs placed at the same latitude across the
// east-west fog gradient so a user can read the three zones at a
// glance: ☀️ in the Sun band (east), 🌤️ in the Transition belt (mid),
// ☁️ in the Fog band (west). The hand-picked emoji-per-neighborhood
// pins from the original markup are gone — they were doing more visual
// noise than information.
const FOG_PIN_GROUPS = [
  { emoji: "☀️", points: [[-122.410, 37.785]] },   // Sun (S)         — Downtown / Union Square (NE)
  { emoji: "🌤️", points: [[-122.438, 37.757]] },   // Transition (PC) — between Castro / Dolores Heights / Clarendon Heights
  { emoji: "☁️", points: [[-122.472, 37.731]] },   // Fog (C)         — Stonestown / Merced Manor (SW)
];

// Layer IDs the "Show fog data" toggle flips on and off as a group.
const CONTOUR_LAYER_IDS = [
  "fog-contours-sun",
  "fog-contours-fog",
  "fog-contours-transition-outline",
];

export default function FogMap({
  geojson,
  contours,
  showContours,
  showTerrain,
  showElevation,
  showSeismic,
  showTsunami,
  showFaults,
  showSatellite,
  showMuni,
  showBikes,
  showZips,
  showDistricts,
  showZoning,
  showRealtor,
  showCBD,
  showResBuildings,
  showComBuildings,
  buildingSales,
  showNeighborhoods,
  picked,
  onPickFeature,
  activityData,
  microZones,
  showMicroSun,
  showMicroCool,
  showMicroWind,
  flyTo,
  transitRoutes,
  transitStops,
  bikeSel,
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const transitionMarkersRef = useRef([]);
  // Mirrors `showContours` for the once-only marker create effect — so
  // newly-spawned markers respect the latest toggle state even if the
  // map's load event fires long after mount.
  const showContoursRef = useRef(showContours);
  useEffect(() => {
    showContoursRef.current = showContours;
  }, [showContours]);
  // Mirrors whether EITHER buildings layer is on, so the always-bound
  // neighborhood click handler can step aside when a building is clicked
  // (showing only the building pop-up).
  const showBuildingsRef = useRef(showResBuildings || showComBuildings);
  useEffect(() => {
    showBuildingsRef.current = showResBuildings || showComBuildings;
  }, [showResBuildings, showComBuildings]);
  // Latest building→sales lookup, reachable from the once-bound click handler.
  const buildingSalesRef = useRef(buildingSales);
  useEffect(() => {
    buildingSalesRef.current = buildingSales;
  }, [buildingSales]);
  const dataAppliedRef = useRef(false);
  // Cached parsed tall-buildings GeoJSON, fetched once the first time a
  // buildings layer is toggled on so we can frame the footprints.
  const buildingsGeoRef = useRef(null);
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
      bounds: SF_BOUNDS,
      fitBoundsOptions: { padding: 24 },
      minZoom: 10,
      maxZoom: 16,
    });
    // Zoom +/- in the bottom-left (above the Mapbox logo); the top-right and
    // bottom-right corners belong to our own controls (Layers / find-me).
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "bottom-left");
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

      // Satellite imagery (Mapbox Satellite raster). Inserted below the basemap
      // labels so place names stay legible over the imagery; all our data
      // overlays still draw on top. Hidden until toggled on.
      map.addSource("satellite", { type: "raster", url: "mapbox://mapbox.satellite", tileSize: 256 });
      map.addLayer(
        {
          id: "satellite",
          type: "raster",
          source: "satellite",
          layout: { visibility: "none" },
          paint: { "raster-opacity": 1 },
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
          "text-field": [
            "concat",
            ["to-string", ["round", ["*", ["get", "ele"], 3.28084]]],
            " ft",
          ],
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

      // Precise 50 ft and 100 ft contour lines derived from the local
      // USGS NED 10 m DEM (scripts/build-elevation-contours.mjs). These
      // land exactly on imperial heights — Mapbox's terrain-v2 grid is
      // in 10 m steps and can't hit them — so they're visually distinct
      // from the metric contours and useful for reading the fog floor.
      map.addSource("ft-contours", {
        type: "geojson",
        data: "/data/sf-contours-50-100ft.geojson",
      });
      // Hypsometric colour ramp — lowland cool, summit warm. Matches
      // the colours surfaced in the panel legend so the on-map ramp
      // and the legend agree.
      const FT_COLOR = [
        "match", ["get", "ft"],
        50,  "#0ea5e9",  // sky blue   — sea-level fog floor
        100, "#0d9488",  // teal       — low corridor
        200, "#65a30d",  // lime       — mid slope
        300, "#ca8a04",  // gold       — ridge
        600, "#b91c1c",  // red        — summit
        "#1c1917",
      ];
      map.addLayer({
        id: "ft-contour-lines",
        type: "line",
        source: "ft-contours",
        layout: { visibility: "none", "line-cap": "round", "line-join": "round" },
        paint: {
          "line-color": FT_COLOR,
          "line-width": [
            "match", ["get", "ft"],
            50,  1.1,
            100, 1.4,
            200, 1.4,
            300, 1.6,
            600, 1.8,
            1.2,
          ],
          "line-opacity": 0.9,
        },
      });
      map.addLayer({
        id: "ft-contour-labels",
        type: "symbol",
        source: "ft-contours",
        layout: {
          visibility: "none",
          "text-field": ["concat", ["to-string", ["get", "ft"]], " ft"],
          "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
          "text-size": 10,
          "text-padding": 28,
          "symbol-placement": "line",
          "text-allow-overlap": false,
        },
        paint: {
          "text-color": FT_COLOR,
          "text-halo-color": "#ffffff",
          "text-halo-width": 1.6,
          "text-opacity": [
            "interpolate", ["linear"], ["zoom"],
            13, 0,
            14, 1,
          ],
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

      // Sun band (< 8.5 hrs/day): a very light yellow wash so the
      // lowest-fog corner of the city reads as "sunny", instead of
      // sitting transparent against the basemap. Covers both the
      // < 8 polygons and the 8.0 boundary polygon.
      map.addLayer({
        id: "fog-contours-sun",
        type: "fill",
        source: "fog-contours",
        filter: ["<", ["coalesce", ["get", "hours"], 0], 8.5],
        paint: {
          "fill-color": "#fef9c3",
          "fill-opacity": 0.45,
        },
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

      // Community Benefit Districts (DataSF) — 16 special-assessment
      // districts that fund neighborhood services. Toggleable purple
      // fill + outline + name labels; the district name lives in the
      // `community_benefit_district` property.
      map.addSource("cbd", {
        type: "geojson",
        data: "/data/sf-community-benefit-districts.geojson",
      });
      map.addLayer({
        id: "cbd-fill",
        type: "fill",
        source: "cbd",
        layout: { visibility: "none" },
        paint: {
          "fill-color": "#7c3aed",
          "fill-opacity": 0.18,
        },
      });
      map.addLayer({
        id: "cbd-outline",
        type: "line",
        source: "cbd",
        layout: { visibility: "none", "line-join": "round" },
        paint: {
          "line-color": "#6d28d9",
          "line-width": 1.8,
          "line-opacity": 0.95,
        },
      });
      map.addLayer({
        id: "cbd-labels",
        type: "symbol",
        source: "cbd",
        layout: {
          visibility: "none",
          "text-field": ["get", "community_benefit_district"],
          "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
          "text-size": [
            "interpolate", ["linear"], ["zoom"],
            11, 9,
            13, 11,
            15, 13,
          ],
          "text-max-width": 8,
          "text-padding": 4,
          "text-allow-overlap": false,
        },
        paint: {
          "text-color": "#5b21b6",
          "text-halo-color": "#ffffff",
          "text-halo-width": 1.4,
          "text-halo-blur": 0.5,
        },
      });

      // Click a Community Benefit District to open a popup with its name
      // and a link to the latest annual report. Mapbox only fires these
      // layer-scoped handlers when cbd-fill is actually visible, so the
      // popup is inert until the "Benefit Districts" toggle is on.
      let cbdPopup = null;
      map.on("mouseenter", "cbd-fill", () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "cbd-fill", () => {
        map.getCanvas().style.cursor = "";
      });
      map.on("click", "cbd-fill", e => {
        if (!e.features?.length) return;
        const p = e.features[0].properties;
        // Nested GeoJSON objects arrive as JSON strings through Mapbox, so
        // the {url} object on annual_report_url needs parsing back out.
        let reportUrl = "";
        const raw = p.annual_report_url;
        try {
          reportUrl = typeof raw === "string" ? (JSON.parse(raw).url || "") : (raw?.url || "");
        } catch {
          reportUrl = typeof raw === "string" ? raw : "";
        }
        const name = p.community_benefit_district || "Benefit District";
        const link = reportUrl
          ? `<a href="${reportUrl}" target="_blank" rel="noopener noreferrer">More Information ↗</a>`
          : `<span style="color:#888">No more information available</span>`;

        // Build the detail rows from the DataSF attributes. Each is optional
        // so districts with missing values (e.g. no renewal yet) just skip it.
        const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        const revNum = parseInt(p.revenue, 10);
        const revenue = Number.isFinite(revNum) ? `$${revNum.toLocaleString("en-US")}/yr` : null;
        const em = p.expiration && /^(\d{4})-(\d{2})/.exec(p.expiration);
        const expires = em ? `${MONTHS[+em[2] - 1]} ${em[1]}` : null;
        const term = p.contract_duration ? p.contract_duration.replace(/\s*years?$/i, "-yr term") : "";
        const rows = [];
        if (revenue) rows.push(["Revenue", revenue]);
        if (p.established) rows.push(["Established", p.established]);
        if (expires) rows.push(["Expires", term ? `${expires} (${term})` : expires]);
        if (p.renewed) rows.push(["Renewed", p.renewed]);
        if (p.annual_report_latest_year) rows.push(["Latest report", p.annual_report_latest_year]);
        const details = rows
          .map(([k, v]) => `<div><span style="color:#6b7280">${k}:</span> ${v}</div>`)
          .join("");

        const html = `<div class="cbd-popup" style="font-size:12.5px;line-height:1.5">`
          + `<strong style="font-size:13.5px">${name}</strong>`
          + `<div style="margin:4px 0 6px">${details}</div>`
          + link
          + `</div>`;
        if (cbdPopup) cbdPopup.remove();
        cbdPopup = new mapboxgl.Popup({ closeButton: true, maxWidth: "260px" })
          .setLngLat(e.lngLat)
          .setHTML(html)
          .addTo(map);
      });

      // SF Tall Building Inventory (DataSF) — every high-rise as a filled
      // footprint, coloured by primary occupancy: residential = light sky
      // blue, office = light cream, and mixed-use buildings get a half
      // blue / half cream diagonal pattern. Click any footprint for a
      // pop-up listing the full structural / seismic record for that
      // building. Toggleable; off until the "Tall Buildings" switch is on.
      //
      // The mixed-use split can't be expressed as a flat fill-color, so we
      // generate a 16×16 diagonal two-tone tile once and paint it with
      // fill-pattern on a second layer filtered to just the mixed-use rows.
      const BLDG_BLUE = "#5B9BD5";   // residential (condo) — medium blue
      const BLDG_CREAM = "#E6CE78";  // commercial — darker cream / tan
      const BLDG_ORANGE = "#F59E0B"; // rentals — orange
      const BLDG_YELLOW = "#F5C518"; // mixed-use pattern — yellow (paired with blue)
      const tile = 16;
      const cnv = document.createElement("canvas");
      cnv.width = tile;
      cnv.height = tile;
      const ctx = cnv.getContext("2d");
      // Mixed-use tile: lower-left triangle yellow, upper-right triangle blue.
      ctx.fillStyle = BLDG_YELLOW;
      ctx.fillRect(0, 0, tile, tile);
      ctx.fillStyle = BLDG_BLUE;
      ctx.beginPath();
      ctx.moveTo(tile, 0);
      ctx.lineTo(tile, tile);
      ctx.lineTo(0, 0);
      ctx.closePath();
      ctx.fill();
      if (!map.hasImage("mixed-use-split")) {
        map.addImage("mixed-use-split", ctx.getImageData(0, 0, tile, tile), { pixelRatio: 2 });
      }

      map.addSource("buildings", {
        type: "geojson",
        data: "/data/sf-tall-buildings.geojson",
      });
      // The layer is split into two independently-toggleable occupancy groups:
      //   • Residential / Mixed   (condo blue, rental orange, mixed blue/yellow)
      //   • Commercial            (office/hotel/medical/cultural all cream)
      // Both groups share one fill-colour expression; a per-group filter decides
      // which footprints each draws. Rentals (a tenure, not in the geojson) are
      // matched by objectid, so they shade orange regardless of occupancy.
      const RENTAL_IDS = [...RENTAL_OBJECTIDS];
      // Office towers the city mistagged as residential — forced to the
      // Commercial group so they don't masquerade as homebuyer properties.
      const FORCE_COM_IDS = [...FORCE_COMMERCIAL_OBJECTIDS];
      const BLDG_FILL_COLOR = [
        "case",
        ["in", ["get", "objectid"], ["literal", RENTAL_IDS]], BLDG_ORANGE,
        ["in", ["get", "objectid"], ["literal", FORCE_COM_IDS]], BLDG_CREAM,
        [
          "match",
          ["get", "occupancy"],
          "Residential", BLDG_BLUE,
          "Mixed Uses (With Residential)", BLDG_BLUE,
          // Commercial: office, cultural, hotel, medical, and mixed-WITHOUT-
          // residential (those have no homes) → cream.
          ["Office (Management, Information, Professional Services)", "Cultural, Institutional, Educational", "Hotels, Visitor Services", "Medical", "Mixed Uses (Without Residential)"], BLDG_CREAM,
          /* anything else */ "#c9c6bd",
        ],
      ];
      // Residential/Mixed group = has homes; Commercial = everything else
      // (incl. mixed-without-residential and the mistagged office towers).
      const RES_OCC = ["Residential", "Mixed Uses (With Residential)"];
      const COM_OCC = ["Office (Management, Information, Professional Services)", "Hotels, Visitor Services", "Medical", "Cultural, Institutional, Educational", "Mixed Uses (Without Residential)"];
      const resFilter = ["all",
        ["in", ["get", "occupancy"], ["literal", RES_OCC]],
        ["!", ["in", ["get", "objectid"], ["literal", FORCE_COM_IDS]]],
      ];
      const comFilter = ["any",
        ["in", ["get", "occupancy"], ["literal", COM_OCC]],
        ["in", ["get", "objectid"], ["literal", FORCE_COM_IDS]],
      ];
      // Footprint label = the building name, with display-name overrides applied
      // (e.g. objectid 333 "450 Folsom [Transbay Block 8]" → "The Avery").
      const nameOverridePairs = Object.entries(NAME_OVERRIDES).flat();
      const bldgNameExpr = nameOverridePairs.length
        ? ["match", ["get", "objectid"], ...nameOverridePairs, ["get", "name"]]
        : ["get", "name"];
      const bldgLabelLayout = {
        visibility: "none",
        "text-field": bldgNameExpr,
        "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
        "text-size": ["interpolate", ["linear"], ["zoom"], 14.5, 10, 16, 12.5],
        "text-max-width": 9,
        "text-padding": 6,
        "text-allow-overlap": false,
        "text-optional": true,
      };
      const bldgLabelPaint = {
        "text-color": "#1c1917",
        "text-halo-color": "#ffffff",
        "text-halo-width": 1.6,
        "text-halo-blur": 0.4,
      };

      // ── Residential / Mixed group ──
      map.addLayer({
        id: "buildings-res-fill",
        type: "fill",
        source: "buildings",
        filter: resFilter,
        layout: { visibility: "none" },
        paint: { "fill-color": BLDG_FILL_COLOR, "fill-opacity": 0.9 },
      });
      // Mixed-use overlay: the diagonal blue/cream tile, only on mixed rows (a
      // subset of the residential group).
      map.addLayer({
        id: "buildings-mixed",
        type: "fill",
        source: "buildings",
        layout: { visibility: "none" },
        filter: ["all",
          ["==", ["get", "occupancy"], "Mixed Uses (With Residential)"], // residential-mixed only
          ["!", ["in", ["get", "objectid"], ["literal", RENTAL_IDS]]],    // rentals stay solid orange
          ["!", ["in", ["get", "objectid"], ["literal", FORCE_COM_IDS]]], // mistagged offices stay cream
        ],
        paint: { "fill-pattern": "mixed-use-split", "fill-opacity": 0.95 },
      });
      map.addLayer({
        id: "buildings-res-outline",
        type: "line",
        source: "buildings",
        filter: resFilter,
        layout: { visibility: "none", "line-join": "round" },
        paint: { "line-color": "#57534e", "line-width": 0.8, "line-opacity": 0.9 },
      });
      // Building name labels fade in from zoom 14.5 so the city-wide view stays
      // clean; one labels layer per group so each toggle controls its own.
      map.addLayer({
        id: "buildings-res-labels",
        type: "symbol",
        source: "buildings",
        filter: resFilter,
        minzoom: 14.5,
        layout: bldgLabelLayout,
        paint: bldgLabelPaint,
      });

      // ── Commercial / Office / Hotel / Hospital group ──
      map.addLayer({
        id: "buildings-com-fill",
        type: "fill",
        source: "buildings",
        filter: comFilter,
        layout: { visibility: "none" },
        paint: { "fill-color": BLDG_FILL_COLOR, "fill-opacity": 0.9 },
      });
      map.addLayer({
        id: "buildings-com-outline",
        type: "line",
        source: "buildings",
        filter: comFilter,
        layout: { visibility: "none", "line-join": "round" },
        paint: { "line-color": "#57534e", "line-width": 0.8, "line-opacity": 0.9 },
      });
      map.addLayer({
        id: "buildings-com-labels",
        type: "symbol",
        source: "buildings",
        filter: comFilter,
        minzoom: 14.5,
        layout: bldgLabelLayout,
        paint: bldgLabelPaint,
      });

      // Click a footprint → pop-up with the building's full record. We list
      // every populated attribute from the export (skipping the DataSF
      // housekeeping/system columns and projection artefacts), with friendly
      // labels and units where it helps.
      const BLDG_FIELDS = [
        ["occupancy", "Occupancy", null],
        ["height_ft", "Height", " ft"],
        ["stories_above_grade", "Stories above grade", null],
        ["stories_below_grade", "Stories below grade", null],
        ["date", "Year built", null],
        ["completion_date", "Completion date", null],
        ["retrofit_date", "Retrofit date", null],
        ["building_code_year", "Building code year", null],
        ["square_footage", "Square footage", " sq ft"],
        ["structural_material", "Structural material", null],
        ["structural_system", "Structural system", null],
        ["structural_types", "Structural type", null],
        ["facade_material", "Facade material", null],
        ["foundation_system", "Foundation system", null],
        ["foundation_info", "Foundation info", null],
        ["fire_resistence_type", "Fire-resistance type", null],
        ["percent_sprinklered", "Sprinklered", "%"],
        ["borp_report", "BORP report", null],
        ["instrumented", "Instrumented", null],
        ["liquefaction_potential", "Liquefaction potential", null],
        ["site_class", "Site class", null],
        ["bedrockdepth_mean", "Bedrock depth (mean)", " ft"],
        ["bedrockdepth_min", "Bedrock depth (min)", " ft"],
        ["bedrockdepth_max", "Bedrock depth (max)", " ft"],
        ["base_plan_size", "Base plan size", null],
        ["tower_plan_size", "Tower plan size", null],
        ["typ_story_height", "Typical story height", null],
        ["attyp_story_height", "Atypical story height", null],
        ["mep_levels", "MEP levels", null],
        ["atrium_location", "Atrium location", null],
        ["mapblocklot", "Block / lot", null],
        ["permit_date_1", "Permit date 1", null],
        ["permit_date_2", "Permit date 2", null],
        ["permit_date_3", "Permit date 3", null],
        ["architectural_notes", "Architectural notes", null],
        ["description", "Description", null],
        ["primary_source", "Primary source", null],
        ["collected_on", "Data collected", null],
      ];
      const blank = v => v == null || v === "" || /^(null|unknown|n\/?a)$/i.test(String(v).trim());
      const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
      const usd = n => (Number.isFinite(n) ? "$" + Math.round(n).toLocaleString("en-US") : null);
      const usdShort = n => {
        if (!Number.isFinite(n)) return "—";
        if (n >= 1e6) return "$" + (n / 1e6).toFixed(2) + "M";
        if (n >= 1e3) return "$" + Math.round(n / 1e3) + "K";
        return "$" + Math.round(n);
      };
      const shortDate = iso => {
        const m = iso && /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
        return m ? `${+m[2]}/${+m[3]}/${m[1].slice(2)}` : (iso || "");
      };
      // Builds the "Market activity" block from the building→sales lookup, when
      // this building has matching MLS listings. Summary line + recent sales +
      // a link into the full filtered listings view.
      const marketHtml = objectid => {
        const rec = buildingSalesRef.current?.[objectid];
        if (!rec || !rec.total) return "";
        const summary = [
          `${rec.total} listing${rec.total === 1 ? "" : "s"} on record`,
          rec.closedCount ? `${rec.closedCount} sold` : null,
          rec.medianSale ? `median ${usdShort(rec.medianSale)}` : null,
        ].filter(Boolean).join(" · ");
        const items = (rec.recent || []).slice(0, 6).map(s => {
          const left = [s.unit ? `#${esc(s.unit)}` : null, s.status ? esc(s.status) : null].filter(Boolean).join(" · ");
          const right = [usd(s.price), s.date ? shortDate(s.date) : null].filter(Boolean).join(" · ");
          return `<div style="display:flex;justify-content:space-between;gap:10px"><span style="color:#6b7280">${left || "—"}</span><span>${right}</span></div>`;
        }).join("");
        const link = `<a href="/fog?preset=homes" style="display:inline-block;margin-top:6px">See all market activity ↗</a>`;
        return `<div style="margin-top:8px;padding-top:8px;border-top:1px solid #e5e7eb">`
          + `<strong style="font-size:12.5px">🏢 Market activity</strong>`
          + `<div style="color:#374151;margin:2px 0 6px">${summary}</div>`
          + items
          + link
          + `</div>`;
      };
      // Authored homebuyer layer (narrative / amenities / things-to-know /
      // website) for buildings that have a profile — rendered in the pop-up so a
      // map click shows the same story as the index card.
      const whyLiveHtml = a => {
        if (!a?.narrative) return "";
        const am = a.amenities?.length
          ? `<div style="margin-top:6px"><strong style="font-size:12px">Amenities</strong>`
            + `<div style="color:#374151;margin-top:2px">${a.amenities.map(x => `• ${esc(x)}`).join("<br>")}</div></div>`
          : "";
        return `<div style="margin:6px 0 8px;padding:8px;background:#FEF9EC;border-radius:6px">`
          + `<strong style="font-size:12.5px;color:#92400e">✨ Why live here</strong>`
          + `<div style="color:#412402;margin-top:3px">${esc(a.narrative)}</div>`
          + am
          + `</div>`;
      };
      const knowHtml = a => {
        if (!a?.thingsToKnow?.length) return "";
        const items = a.thingsToKnow.map(t =>
          `<div style="background:#FCEBEB;border:1px solid #F7C1C1;border-radius:6px;padding:6px 8px;margin-top:4px">`
          + `${esc(t.text)}`
          + (t.source ? ` <span style="color:#6b7280">— ${esc(t.source)}${t.date ? `, ${esc(t.date)}` : ""}</span>` : "")
          + `</div>`).join("");
        return `<div style="margin-top:8px;padding-top:8px;border-top:1px solid #e5e7eb">`
          + `<strong style="font-size:12.5px">⚠️ Good to know</strong>${items}</div>`;
      };
      const websiteHtml = a => {
        if (!a?.website) return "";
        return `<div style="margin-top:8px;padding-top:8px;border-top:1px solid #e5e7eb">`
          + `<a href="${esc(a.website)}" target="_blank" rel="noopener noreferrer">🌐 Building website ↗</a></div>`;
      };
      let bldgPopup = null;
      const onBldgEnter = () => { map.getCanvas().style.cursor = "pointer"; };
      const onBldgLeave = () => { map.getCanvas().style.cursor = ""; };
      const onBldgClick = e => {
        if (!e.features?.length) return;
        const p = e.features[0].properties;
        const name = NAME_OVERRIDES[String(p.objectid)] || (!blank(p.name) ? p.name : "Tall building");
        const addr = !blank(p.address) ? `<div style="color:#6b7280;margin-bottom:6px">${esc(p.address)}</div>` : "";
        const a = getBuilding(p.objectid);
        const rows = BLDG_FIELDS
          .filter(([k]) => !blank(p[k]))
          .map(([k, label, unit]) => {
            const val = esc(p[k]) + (unit ? unit : "");
            return `<div class="bldg-row"><span style="color:#6b7280">${label}:</span> ${val}</div>`;
          })
          .join("");
        const html = `<div class="bldg-popup" style="font-size:12.5px;line-height:1.5;max-height:360px;overflow-y:auto">`
          + `<strong style="font-size:13.5px">${esc(name)}</strong>`
          + addr
          + whyLiveHtml(a)
          + rows
          + knowHtml(a)
          + marketHtml(p.objectid)
          + websiteHtml(a)
          + `</div>`;
        if (bldgPopup) bldgPopup.remove();
        // focusAfterOpen:false stops Mapbox from focusing a control inside the
        // scrollable body on open — that focus made tall pop-ups open scrolled
        // part-way down. We also reset scrollTop so every pop-up starts at the
        // first row of data (the building name/header), not mid-list.
        bldgPopup = new mapboxgl.Popup({ closeButton: true, maxWidth: "300px", focusAfterOpen: false })
          .setLngLat(e.lngLat)
          .setHTML(html)
          .addTo(map);
        const body = bldgPopup.getElement()?.querySelector(".bldg-popup");
        if (body) body.scrollTop = 0;
      };
      ["buildings-res-fill", "buildings-com-fill"].forEach(id => {
        map.on("mouseenter", id, onBldgEnter);
        map.on("mouseleave", id, onBldgLeave);
        map.on("click", id, onBldgClick);
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
          // Light fill so the zone reads without going dark, and so the
          // tsunami layer stays visible where the two overlap.
          "fill-opacity": 0.15,
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

      // Housing Activity dots — listings for the chosen status / type / period.
      // Empty until the FogApp filter feeds setData (see the activityData
      // effect). Each feature is tagged actKind: blue = sold, green = active.
      map.addSource("activity", { type: "geojson", data: { type: "FeatureCollection", features: [] } });
      map.addLayer({
        id: "activity-dots",
        type: "circle",
        source: "activity",
        paint: {
          "circle-radius": ["interpolate", ["linear"], ["zoom"], 10, 3, 14, 5, 16, 7],
          "circle-color": ["case", ["==", ["get", "actKind"], "sold"], "#2563eb", "#16a34a"],
          "circle-stroke-color": "#ffffff",
          "circle-stroke-width": 1,
          "circle-opacity": 0.9,
        },
      });
      // MicroClimates zones — terrain-derived sun / cool / wind areas, fed by
      // the microZones prop. Each zone is a fill + matching outline, hidden
      // until its toggle turns on.
      const MZ_COLOR = { sun: "#fdba74", cool: "#7dd3fc", wind: "#2dd4bf" };
      const MZ_OPACITY = { sun: 0.55, cool: 0.55, wind: 0.45 };
      map.addSource("micro-zones", { type: "geojson", data: { type: "FeatureCollection", features: [] } });
      ["sun", "cool", "wind"].forEach(z => {
        map.addLayer({
          id: `fmicro-${z}-fill`,
          type: "fill",
          source: "micro-zones",
          filter: ["==", ["get", "zone"], z],
          layout: { visibility: "none" },
          paint: { "fill-color": MZ_COLOR[z], "fill-opacity": MZ_OPACITY[z] },
        });
        map.addLayer({
          id: `fmicro-${z}-line`,
          type: "line",
          source: "micro-zones",
          filter: ["==", ["get", "zone"], z],
          layout: { visibility: "none", "line-join": "round" },
          paint: { "line-color": MZ_COLOR[z], "line-width": 1, "line-opacity": 0.85 },
        });
      });

      let actPopup = null;
      map.on("mouseenter", "activity-dots", () => { map.getCanvas().style.cursor = "pointer"; });
      map.on("mouseleave", "activity-dots", () => { map.getCanvas().style.cursor = ""; });
      const fmtMDY = iso => { const m = iso && /^(\d{4})-(\d{2})-(\d{2})/.exec(iso); return m ? `${+m[2]}/${+m[3]}/${m[1].slice(2)}` : ""; };
      map.on("click", "activity-dots", e => {
        const p = e.features?.[0]?.properties;
        if (!p) return;
        const sold = p.actKind === "sold";
        const addr = esc((p.address || "").replace(/,\s*San Francisco.*$/i, "")) + (p.unit ? ` #${esc(p.unit)}` : "");
        // Sold: close price + date. Active: list price + status since status date.
        const price = sold
          ? (p.sellingPrice ? "$" + Math.round(p.sellingPrice).toLocaleString("en-US") : "—")
          : (p.listPrice ? "$" + Math.round(p.listPrice).toLocaleString("en-US") : "—");
        const when = sold
          ? (fmtMDY(p.sellingDate) ? ` · sold ${fmtMDY(p.sellingDate)}` : "")
          : (fmtMDY(p.statusDate) ? ` · ${esc(p.status)} ${fmtMDY(p.statusDate)}` : ` · ${esc(p.status || "")}`);
        const bb = [p.bedrooms != null ? `${p.bedrooms} bd` : null, p.sqft ? `${Math.round(p.sqft).toLocaleString("en-US")} sqft` : null].filter(Boolean).join(" · ");
        const html = `<div style="font-size:12.5px;line-height:1.5">`
          + `<strong>${addr}</strong><br>`
          + `<span style="font-weight:600">${price}</span>${when}`
          + (bb ? `<br><span style="color:#6b7280">${bb}</span>` : "")
          + `</div>`;
        if (actPopup) actPopup.remove();
        actPopup = new mapboxgl.Popup({ closeButton: true, maxWidth: "240px", focusAfterOpen: false })
          .setLngLat(e.lngLat).setHTML(html).addTo(map);
      });

      // Tsunami inundation hazard zone — CGS 2021 update. Marks the
      // low-lying coastal area that an emergency-planning tsunami would
      // reach. Cool blue fill so it reads as "water-related hazard"
      // distinct from the warm-red seismic zones above.
      map.addSource("tsunami", {
        type: "geojson",
        data: "/data/sf-tsunami-hazard.geojson",
      });
      map.addLayer({
        id: "tsunami-fill",
        type: "fill",
        source: "tsunami",
        layout: { visibility: "none" },
        paint: {
          "fill-color": "#0ea5e9",
          // Light fill so it layers readably over the seismic zone.
          "fill-opacity": 0.18,
        },
      });
      map.addLayer({
        id: "tsunami-outline",
        type: "line",
        source: "tsunami",
        layout: { visibility: "none", "line-join": "round" },
        paint: {
          "line-color": "#0369a1",
          "line-width": 1.2,
          "line-dasharray": [3, 2],
          "line-opacity": 0.85,
        },
      });

      // Active fault traces (USGS — San Andreas, Hayward, Calaveras, etc.).
      // A white casing under a bold dark-red line so the trace reads on any
      // basemap and stays distinct from the translucent seismic fill.
      map.addSource("faults", { type: "geojson", data: "/data/sf-faults.geojson" });
      map.addLayer({
        id: "faults-casing",
        type: "line",
        source: "faults",
        layout: { visibility: "none", "line-cap": "round", "line-join": "round" },
        paint: {
          "line-color": "#ffffff",
          "line-width": ["interpolate", ["linear"], ["zoom"], 9, 3, 13, 5, 16, 7],
          "line-opacity": 0.7,
        },
      });
      map.addLayer({
        id: "faults-line",
        type: "line",
        source: "faults",
        layout: { visibility: "none", "line-cap": "round", "line-join": "round" },
        paint: {
          "line-color": "#b91c1c",
          "line-width": ["interpolate", ["linear"], ["zoom"], 9, 1.2, 13, 2.2, 16, 3.4],
          "line-opacity": 0.95,
        },
      });
      map.addLayer({
        id: "faults-labels",
        type: "symbol",
        source: "faults",
        layout: {
          visibility: "none",
          "symbol-placement": "line",
          "text-field": ["concat", ["get", "fault"], " Fault"],
          "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
          "text-size": ["interpolate", ["linear"], ["zoom"], 10, 10, 14, 13],
          "text-letter-spacing": 0.04,
          "symbol-spacing": 350,
        },
        paint: {
          "text-color": "#7f1d1d",
          "text-halo-color": "#ffffff",
          "text-halo-width": 1.4,
        },
      });
      // Click a fault trace for its name + USGS description.
      map.on("mouseenter", "faults-line", () => { map.getCanvas().style.cursor = "pointer"; });
      map.on("mouseleave", "faults-line", () => { map.getCanvas().style.cursor = ""; });
      map.on("click", "faults-line", e => {
        const p = e.features?.[0]?.properties;
        if (!p) return;
        const desc = p.description ? `<div style="margin-top:4px;color:#57534e;line-height:1.45">${esc(p.description)}</div>` : "";
        const html = `<div style="font-weight:700;color:#7f1d1d">${esc(p.fault)} Fault</div>${desc}`;
        new mapboxgl.Popup({ closeButton: true, maxWidth: "260px", focusAfterOpen: false })
          .setLngLat(e.lngLat).setHTML(html).addTo(map);
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
      // Muni routes — 135 service patterns from DataSF "Muni Simple
      // Routes." Drawn under the dots so the markers stay on top.
      // Coloured by route_name using SFMTA's brand palette for the
      // metro letters / cable lines; buses fall through to a neutral
      // grey, with Rapid (R suffix) / Express (X suffix) / Owl (90, 91)
      // picking up distinct accents.
      map.addSource("muni-routes", {
        type: "geojson",
        data: "/data/sf-muni-routes.geojson",
      });
      const MUNI_ROUTE_COLOR = [
        "match", ["get", "route_name"],
        "J", "#D85F2A",
        "K", "#5B6770",
        "KBUS", "#5B6770",
        "L", "#92278F",
        "M", "#007749",
        "N", "#005DAA",
        "NBUS", "#005DAA",
        "T", "#BC1E2D",
        "TBUS", "#BC1E2D",
        "F", "#C99729",
        "FBUS", "#C99729",
        "C", "#B11116",
        "PH", "#B11116",
        "PM", "#B11116",
        "5R", "#EA580C",
        "9R", "#EA580C",
        "14R", "#EA580C",
        "28R", "#EA580C",
        "38R", "#EA580C",
        "1X", "#6D28D9",
        "8AX", "#6D28D9",
        "8BX", "#6D28D9",
        "30X", "#6D28D9",
        "90", "#1E3A8A",
        "91", "#1E3A8A",
        "#6B7280",
      ];
      const MUNI_ROUTE_WIDTH = [
        "match", ["get", "route_name"],
        "J", 3,
        "K", 3, "KBUS", 3,
        "L", 3,
        "M", 3,
        "N", 3, "NBUS", 3,
        "T", 3, "TBUS", 3,
        "F", 3, "FBUS", 3,
        "C", 3, "PH", 3, "PM", 3,
        "5R", 2.2, "9R", 2.2, "14R", 2.2, "28R", 2.2, "38R", 2.2,
        "1X", 2.2, "8AX", 2.2, "8BX", 2.2, "30X", 2.2,
        1.4,
      ];
      map.addLayer({
        id: "muni-routes-lines",
        type: "line",
        source: "muni-routes",
        layout: { visibility: "none", "line-cap": "round", "line-join": "round" },
        paint: {
          "line-color": MUNI_ROUTE_COLOR,
          "line-width": MUNI_ROUTE_WIDTH,
          "line-opacity": 0.85,
        },
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
          // Two lines: cross-street name on top, route list below in a
          // smaller font. When `routes` is missing the second line stays
          // empty and the label collapses to just the name.
          "text-field": [
            "format",
            ["get", "name"], {},
            ["case",
              ["has", "routes"], ["concat", "\n", ["get", "routes"]],
              "",
            ],
            { "font-scale": 0.85, "text-color": "#2563eb" },
          ],
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
          "line-opacity": 0.55,
          "line-width": 0.9,
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
        // When Tall Buildings is on, a click on a building footprint should
        // open only the building pop-up — suppress the neighborhood pick if
        // the click landed on a building.
        if (showBuildingsRef.current) {
          const fillLayers = ["buildings-res-fill", "buildings-com-fill"].filter(id => map.getLayer(id));
          if (fillLayers.length && map.queryRenderedFeatures(e.point, { layers: fillLayers }).length) return;
        }
        // Likewise, a click on a Housing Activity dot opens only its pop-up.
        if (map.getLayer("activity-dots") && map.queryRenderedFeatures(e.point, { layers: ["activity-dots"] }).length) return;
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
    // Call apply() directly (each apply is guarded by getLayer/getSource, so
    // it's a no-op before the layers exist) and also bind once to first load.
    // NB: don't gate on map.isStyleLoaded() — a sibling effect's setLayoutProperty
    // in the same render flips it to false, so a second simultaneous toggle would
    // defer to a "load" event that already fired and never apply.
    apply();
    map.once("load", apply);
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
    // Call apply() directly (each apply is guarded by getLayer/getSource, so
    // it's a no-op before the layers exist) and also bind once to first load.
    // NB: don't gate on map.isStyleLoaded() — a sibling effect's setLayoutProperty
    // in the same render flips it to false, so a second simultaneous toggle would
    // defer to a "load" event that already fired and never apply.
    apply();
    map.once("load", apply);
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
      const visible = showContoursRef.current;
      FOG_PIN_GROUPS.forEach(({ emoji, points }) => {
        points.forEach(pt => {
          const el = document.createElement("div");
          el.className = "fog-cloud-marker";
          el.textContent = emoji;
          if (!visible) el.style.display = "none";
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

  // Toggle the satellite imagery base.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const apply = () => {
      if (map.getLayer("satellite")) map.setLayoutProperty("satellite", "visibility", showSatellite ? "visible" : "none");
    };
    apply();
    map.once("load", apply);
  }, [showSatellite]);

  // Toggle the hillshade terrain overlay.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const apply = () => {
      const vis = showTerrain ? "visible" : "none";
      ["hillshade", "hillshade-2"].forEach(id => {
        if (map.getLayer(id)) map.setLayoutProperty(id, "visibility", vis);
      });
    };
    // Call apply() directly (each apply is guarded by getLayer/getSource, so
    // it's a no-op before the layers exist) and also bind once to first load.
    // NB: don't gate on map.isStyleLoaded() — a sibling effect's setLayoutProperty
    // in the same render flips it to false, so a second simultaneous toggle would
    // defer to a "load" event that already fired and never apply.
    apply();
    map.once("load", apply);
  }, [showTerrain]);

  // Toggle the elevation contour lines + ft labels + peak labels +
  // the precise 50/100 ft USGS-derived overlay.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const apply = () => {
      const vis = showElevation ? "visible" : "none";
      [
        "contour-lines",
        "contour-labels",
        "peaks-labels",
        "ft-contour-lines",
        "ft-contour-labels",
      ].forEach(id => {
        if (map.getLayer(id)) map.setLayoutProperty(id, "visibility", vis);
      });
    };
    // Call apply() directly (each apply is guarded by getLayer/getSource, so
    // it's a no-op before the layers exist) and also bind once to first load.
    // NB: don't gate on map.isStyleLoaded() — a sibling effect's setLayoutProperty
    // in the same render flips it to false, so a second simultaneous toggle would
    // defer to a "load" event that already fired and never apply.
    apply();
    map.once("load", apply);
  }, [showElevation]);

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
    // Call apply() directly (each apply is guarded by getLayer/getSource, so
    // it's a no-op before the layers exist) and also bind once to first load.
    // NB: don't gate on map.isStyleLoaded() — a sibling effect's setLayoutProperty
    // in the same render flips it to false, so a second simultaneous toggle would
    // defer to a "load" event that already fired and never apply.
    apply();
    map.once("load", apply);
  }, [showSeismic]);

  // Toggle the CGS tsunami hazard zone (fill + dashed outline).
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const apply = () => {
      const vis = showTsunami ? "visible" : "none";
      ["tsunami-fill", "tsunami-outline"].forEach(id => {
        if (map.getLayer(id)) map.setLayoutProperty(id, "visibility", vis);
      });
    };
    // Call apply() directly (each apply is guarded by getLayer/getSource, so
    // it's a no-op before the layers exist) and also bind once to first load.
    // NB: don't gate on map.isStyleLoaded() — a sibling effect's setLayoutProperty
    // in the same render flips it to false, so a second simultaneous toggle would
    // defer to a "load" event that already fired and never apply.
    apply();
    map.once("load", apply);
  }, [showTsunami]);

  // Toggle the fault traces (casing + line + labels).
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const apply = () => {
      const vis = showFaults ? "visible" : "none";
      ["faults-casing", "faults-line", "faults-labels"].forEach(id => {
        if (map.getLayer(id)) map.setLayoutProperty(id, "visibility", vis);
      });
    };
    apply();
    map.once("load", apply);
  }, [showFaults]);

  // Muni visibility + line filter, in one place. The route lines show whenever
  // transit is on; the stop dots/labels are tied to the "Bus route" category —
  // they show whenever transit is on and that category is selected, regardless
  // of which rail lines are also on.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const apply = () => {
      const linesVis = showMuni ? "visible" : "none";
      const dotsVis = showMuni && transitStops ? "visible" : "none";
      if (map.getLayer("muni-routes-lines")) map.setLayoutProperty("muni-routes-lines", "visibility", linesVis);
      ["muni-dots", "muni-labels"].forEach(id => {
        if (map.getLayer(id)) map.setLayoutProperty(id, "visibility", dotsVis);
      });
    };
    // Call apply() directly (each apply is guarded by getLayer/getSource, so
    // it's a no-op before the layers exist) and also bind once to first load.
    // NB: don't gate on map.isStyleLoaded() — a sibling effect's setLayoutProperty
    // in the same render flips it to false, so a second simultaneous toggle would
    // defer to a "load" event that already fired and never apply.
    apply();
    map.once("load", apply);
  }, [showMuni, transitRoutes, transitStops]);

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
    // Call apply() directly (each apply is guarded by getLayer/getSource, so
    // it's a no-op before the layers exist) and also bind once to first load.
    // NB: don't gate on map.isStyleLoaded() — a sibling effect's setLayoutProperty
    // in the same render flips it to false, so a second simultaneous toggle would
    // defer to a "load" event that already fired and never apply.
    apply();
    map.once("load", apply);
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
    // Call apply() directly (each apply is guarded by getLayer/getSource, so
    // it's a no-op before the layers exist) and also bind once to first load.
    // NB: don't gate on map.isStyleLoaded() — a sibling effect's setLayoutProperty
    // in the same render flips it to false, so a second simultaneous toggle would
    // defer to a "load" event that already fired and never apply.
    apply();
    map.once("load", apply);
  }, [showRealtor]);

  // Toggle the Community Benefit Districts overlay (fill + outline + labels).
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const apply = () => {
      const vis = showCBD ? "visible" : "none";
      ["cbd-fill", "cbd-outline", "cbd-labels"].forEach(id => {
        if (map.getLayer(id)) map.setLayoutProperty(id, "visibility", vis);
      });
    };
    // Call apply() directly (each apply is guarded by getLayer/getSource, so
    // it's a no-op before the layers exist) and also bind once to first load.
    // NB: don't gate on map.isStyleLoaded() — a sibling effect's setLayoutProperty
    // in the same render flips it to false, so a second simultaneous toggle would
    // defer to a "load" event that already fired and never apply.
    apply();
    map.once("load", apply);
  }, [showCBD]);

  // Toggle the Residential / Mixed buildings group (fill + mixed pattern +
  // outline + labels).
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const apply = () => {
      const vis = showResBuildings ? "visible" : "none";
      ["buildings-res-fill", "buildings-mixed", "buildings-res-outline", "buildings-res-labels"].forEach(id => {
        if (map.getLayer(id)) map.setLayoutProperty(id, "visibility", vis);
      });
    };
    // Call apply() directly (each apply is guarded by getLayer/getSource, so
    // it's a no-op before the layers exist) and also bind once to first load.
    // NB: don't gate on map.isStyleLoaded() — a sibling effect's setLayoutProperty
    // in the same render flips it to false, so a second simultaneous toggle would
    // defer to a "load" event that already fired and never apply.
    apply();
    map.once("load", apply);
  }, [showResBuildings]);

  // Toggle the Commercial / Office / Hotel / Hospital buildings group.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const apply = () => {
      const vis = showComBuildings ? "visible" : "none";
      ["buildings-com-fill", "buildings-com-outline", "buildings-com-labels"].forEach(id => {
        if (map.getLayer(id)) map.setLayoutProperty(id, "visibility", vis);
      });
    };
    // Call apply() directly (each apply is guarded by getLayer/getSource, so
    // it's a no-op before the layers exist) and also bind once to first load.
    // NB: don't gate on map.isStyleLoaded() — a sibling effect's setLayoutProperty
    // in the same render flips it to false, so a second simultaneous toggle would
    // defer to a "load" event that already fired and never apply.
    apply();
    map.once("load", apply);
  }, [showComBuildings]);

  // When a buildings layer turns on, zoom from the city-wide frame in to
  // the footprints. We frame "most" of the active group(s) — trimming the
  // few outlier towers via a 2.5–97.5 percentile box on the footprint
  // centroids — so the view isn't stretched far out by one stray building.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (!showResBuildings && !showComBuildings) return;

    // Same occupancy split the layer filters use (see the buildings layer
    // setup above); rentals/force-com only affect colour, not membership.
    const RES_OCC = ["Residential", "Mixed Uses (With Residential)"];
    const FORCE_COM = new Set([...FORCE_COMMERCIAL_OBJECTIDS]);

    const fit = geo => {
      const lngs = [];
      const lats = [];
      for (const f of geo.features || []) {
        const p = f.properties || {};
        const isRes = RES_OCC.includes(p.occupancy) && !FORCE_COM.has(p.objectid);
        const wanted = (isRes && showResBuildings) || (!isRes && showComBuildings);
        if (!wanted) continue;
        // Footprint centroid = mean of the exterior ring vertices.
        const ring = f.geometry?.coordinates?.[0];
        if (!ring || !ring.length) continue;
        let sx = 0, sy = 0;
        for (const [x, y] of ring) { sx += x; sy += y; }
        lngs.push(sx / ring.length);
        lats.push(sy / ring.length);
      }
      if (lngs.length < 2) return;
      lngs.sort((a, b) => a - b);
      lats.sort((a, b) => a - b);
      const pct = (arr, q) => arr[Math.min(arr.length - 1, Math.max(0, Math.round((arr.length - 1) * q)))];
      const bounds = [
        [pct(lngs, 0.025), pct(lats, 0.025)],
        [pct(lngs, 0.975), pct(lats, 0.975)],
      ];
      map.fitBounds(bounds, { padding: 60, maxZoom: 14.5, duration: 800 });
    };

    if (buildingsGeoRef.current) {
      fit(buildingsGeoRef.current);
    } else {
      fetch("/data/sf-tall-buildings.geojson")
        .then(r => r.json())
        .then(geo => { buildingsGeoRef.current = geo; fit(geo); })
        .catch(() => {});
    }
  }, [showResBuildings, showComBuildings]);

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
    // Call apply() directly (each apply is guarded by getLayer/getSource, so
    // it's a no-op before the layers exist) and also bind once to first load.
    // NB: don't gate on map.isStyleLoaded() — a sibling effect's setLayoutProperty
    // in the same render flips it to false, so a second simultaneous toggle would
    // defer to a "load" event that already fired and never apply.
    apply();
    map.once("load", apply);
  }, [showZoning]);

  // Feed the Housing Activity dots — the filtered FeatureCollection from
  // FogApp (or empty when the overlay is off).
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const apply = () => {
      const src = map.getSource("activity");
      if (src) src.setData(activityData || { type: "FeatureCollection", features: [] });
    };
    // Call apply() directly (each apply is guarded by getLayer/getSource, so
    // it's a no-op before the layers exist) and also bind once to first load.
    // NB: don't gate on map.isStyleLoaded() — a sibling effect's setLayoutProperty
    // in the same render flips it to false, so a second simultaneous toggle would
    // defer to a "load" event that already fired and never apply.
    apply();
    map.once("load", apply);
  }, [activityData]);

  // Feed the MicroClimates zones once loaded.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const apply = () => {
      const src = map.getSource("micro-zones");
      if (src) src.setData(microZones || { type: "FeatureCollection", features: [] });
    };
    // Call apply() directly (each apply is guarded by getLayer/getSource, so
    // it's a no-op before the layers exist) and also bind once to first load.
    // NB: don't gate on map.isStyleLoaded() — a sibling effect's setLayoutProperty
    // in the same render flips it to false, so a second simultaneous toggle would
    // defer to a "load" event that already fired and never apply.
    apply();
    map.once("load", apply);
  }, [microZones]);

  // Toggle the MicroClimates sun / cool / wind zone overlays.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const apply = () => {
      const set = (z, on) => ["fill", "line"].forEach(t => {
        const id = `fmicro-${z}-${t}`;
        if (map.getLayer(id)) map.setLayoutProperty(id, "visibility", on ? "visible" : "none");
      });
      set("sun", showMicroSun);
      set("cool", showMicroCool);
      set("wind", showMicroWind);
    };
    // Call apply() directly (each apply is guarded by getLayer/getSource, so
    // it's a no-op before the layers exist) and also bind once to first load.
    // NB: don't gate on map.isStyleLoaded() — a sibling effect's setLayoutProperty
    // in the same render flips it to false, so a second simultaneous toggle would
    // defer to a "load" event that already fired and never apply.
    apply();
    map.once("load", apply);
  }, [showMicroSun, showMicroCool, showMicroWind]);

  // Fly the camera to a requested target (e.g. a building chosen from the
  // Bldgs list). Keyed on identity so each request animates once.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !flyTo?.center) return;
    map.flyTo({ center: flyTo.center, zoom: flyTo.zoom ?? map.getZoom(), duration: 1000 });
  }, [flyTo]);

  // Transit: filter the route lines to the selected categories' route_names,
  // or show all when transitRoutes is null.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const apply = () => {
      if (!map.getLayer("muni-routes-lines")) return;
      const inNames = arr => ["match", ["get", "route_name"], arr, true, false];
      // Canonical service only: regular (pattern "F") routes, minus the *BUS
      // rail-replacement shuttles; plus the Owl routes 90/91, which exist only
      // as pattern "N". Drops the bus substitutes and owl variants that follow
      // different surface streets (e.g. the N shuttle down Haight/Cole), so each
      // rail line draws just its real route.
      const base = ["any",
        inNames(["90", "91"]),
        ["all",
          ["==", ["get", "pattern_type"], "F"],
          ["!", inNames(["KBUS", "NBUS", "TBUS", "FBUS"])],
        ],
      ];
      const names = transitRoutes && transitRoutes.length ? transitRoutes : null;
      const filter = !transitRoutes
        ? base
        : names
        ? ["all", base, inNames(names)]
        : ["==", ["get", "route_name"], "__none__"];
      map.setFilter("muni-routes-lines", filter);
    };
    // Call directly (setFilter on an existing layer is safe even mid-style-
    // update); also bind once to the first load for the initial mount.
    apply();
    map.once("load", apply);
  }, [transitRoutes]);

  // Bikes: show only the selected facility classes. Solid layer carries
  // Class I/II/IV, the dashed layer Class III. An empty selection blanks both.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const apply = () => {
      const solid = map.getLayer("bikes-solid");
      const dashed = map.getLayer("bikes-dashed");
      if (!solid || !dashed) return;
      const has = c => !bikeSel || bikeSel.has(c); // no set = show all
      const NONE = ["==", ["get", "facility"], "__none__"];
      const solidClasses = ["CLASS I", "CLASS II", "CLASS IV"].filter(has);
      map.setFilter("bikes-solid", solidClasses.length ? ["match", ["get", "facility"], solidClasses, true, false] : NONE);
      map.setFilter("bikes-dashed", has("CLASS III") ? ["==", ["get", "facility"], "CLASS III"] : NONE);
    };
    apply();
    map.once("load", apply);
  }, [bikeSel]);

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
    // Call apply() directly (each apply is guarded by getLayer/getSource, so
    // it's a no-op before the layers exist) and also bind once to first load.
    // NB: don't gate on map.isStyleLoaded() — a sibling effect's setLayoutProperty
    // in the same render flips it to false, so a second simultaneous toggle would
    // defer to a "load" event that already fired and never apply.
    apply();
    map.once("load", apply);
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
    // Call apply() directly (each apply is guarded by getLayer/getSource, so
    // it's a no-op before the layers exist) and also bind once to first load.
    // NB: don't gate on map.isStyleLoaded() — a sibling effect's setLayoutProperty
    // in the same render flips it to false, so a second simultaneous toggle would
    // defer to a "load" event that already fired and never apply.
    apply();
    map.once("load", apply);
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
    // Call apply() directly (each apply is guarded by getLayer/getSource, so
    // it's a no-op before the layers exist) and also bind once to first load.
    // NB: don't gate on map.isStyleLoaded() — a sibling effect's setLayoutProperty
    // in the same render flips it to false, so a second simultaneous toggle would
    // defer to a "load" event that already fired and never apply.
    apply();
    map.once("load", apply);
  }, [showBikes]);

  // Sync picked state: drop a marker at the address and frame the
  // whole city. The map deliberately stays at the city-wide view so the
  // pin reads in context — no zoom-in, no neighborhood polygon
  // highlight (the marker alone marks the spot).
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }

    if (!picked) return;

    if (picked.point) {
      markerRef.current = new mapboxgl.Marker({ color: "#2563eb" })
        .setLngLat(picked.point)
        .addTo(map);
      // A neighborhood pick (picked.bounds) frames that polygon; a building
      // deep-link (picked.zoom) flies in to the footprint; every other pick
      // keeps the city-wide frame.
      if (picked.bounds) {
        map.fitBounds(picked.bounds, { padding: 60, maxZoom: 15, duration: 900 });
      } else if (picked.zoom) {
        map.flyTo({ center: picked.point, zoom: picked.zoom, duration: 1000 });
      } else {
        map.fitBounds(SF_BOUNDS, { padding: 24, duration: 800 });
      }
    }
  }, [picked]);

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
