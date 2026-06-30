'use client';

// Top-level fog-map experience. Owns:
//   - the loaded neighborhood GeoJSON (one fetch on mount)
//   - the search-bar state (address text + selected suggestion)
//   - the currently "picked" neighborhood (driven by either a search result
//     or a click on the map)
// Renders FogMap (the actual map canvas) and FogSidebar (search + result card).

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import FogMap from "./FogMap";
import FogPanel from "./FogPanel";
import FogMapTools from "./FogMapTools";
import HomesStats from "../components/HomesStats";
import { loadListingsGeo } from "../listings/lib/load";
import { defaultFilter, matchesFilter, deriveOptions, isSoldStatus } from "../listings/lib/filter";
import { buildReportData } from "../listings/lib/report";
import { findNeighborhoodForPoint, findContourForPoint, findFeatureByName, centroidOfFeature, bboxOfFeature } from "./lib/spatial";
import { reverseGeocode, elevationAtPoint } from "./lib/geocode";
import { ALL_TRANSIT_KEYS, isAllSelected, routesForSelection } from "./lib/transit";
import { ALL_BIKE_KEYS } from "./lib/bikes";

// Where each overlay's saved default selection is stored.
const TRANSIT_PREF_KEY = "mysf.transit.v1";
const BIKE_PREF_KEY = "mysf.bikes.v1";
const HAZARD_PREF_KEY = "mysf.hazards.v1";
const MICRO_PREF_KEY = "mysf.micro.v1";
const DATA_URL = "/data/sf-fog-neighborhoods.geojson";
const CONTOURS_URL = "/data/sf-fog-contours.geojson";
// Geographic centre of San Francisco — the default placeholder for the
// "Neighborhoods" entry, so the map opens centred on the city for browsing.
const SF_CENTER = [-122.4376, 37.7577];

export default function FogApp() {
  const searchParams = useSearchParams();
  // Preset chosen by the icon clicked on the Ur4cast home page. Each
  // preset names exactly which layer(s) start on. Neighborhoods is
  // always on regardless. No preset → keep the historical defaults
  // (neighborhoods + fog data) so a direct nav to /fog still shows
  // the headline layer.
  const preset = searchParams?.get("preset") || "";
  const [geojson, setGeojson] = useState(null);
  const [contours, setContours] = useState(null);
  // Building → MLS sales lookup (keyed by building objectid). Tiny file, so we
  // load it once on mount and hand it to the map for the pop-up's "Market
  // activity" section.
  const [buildingSales, setBuildingSales] = useState(null);
  // Residential building profiles (homebuyer index + profile modal). Tiny file.
  const [buildingProfiles, setBuildingProfiles] = useState(null);
  // objectid of the building whose profile modal is open (from the index).
  const [openBuilding, setOpenBuilding] = useState(null);
  const [zips, setZips] = useState(null);
  const [supervisorDistricts, setSupervisorDistricts] = useState(null);
  const [realtorNeighborhoods, setRealtorNeighborhoods] = useState(null);
  const [seismicHazards, setSeismicHazards] = useState(null);
  const [tsunamiHazard, setTsunamiHazard] = useState(null);
  const [dataErr, setDataErr] = useState("");
  const [picked, setPicked] = useState(null); // { feature, point, address, contour, elevation_ft, zip, supervisor, realtor, microZone }
  const [openHood, setOpenHood] = useState(null); // neighborhood name whose highlights pop-up is open
  const [statsOpen, setStatsOpen] = useState(false);     // Homes Stats bottom-sheet
  const [statsExpanded, setStatsExpanded] = useState(false);
  const [reporting, setReporting] = useState(false);     // PDF report generating
  // "Housing Activity" map overlay: listings GeoJSON + the active filter.
  const [listingsGeo, setListingsGeo] = useState(null);
  const [activityWanted, setActivityWanted] = useState(preset === "homes"); // Homes dots on
  const [homesFilter, setHomesFilter] = useState(defaultFilter); // shared market filter
  // "MicroClimates" overlay: terrain-derived sun/cool/wind zones (lazy-loaded).
  const [microWanted, setMicroWanted] = useState(false);
  const [microZones, setMicroZones] = useState(null);
  const [showMicroSun, setShowMicroSun] = useState(false);
  const [showMicroCool, setShowMicroCool] = useState(false);
  const [showMicroWind, setShowMicroWind] = useState(false);
  // Camera fly-to target (e.g. zoom to a building picked from the Bldgs list).
  const [flyTo, setFlyTo] = useState(null); // { center: [lng,lat], zoom } | null
  // Transit: which line categories are shown (a Set of TRANSIT_CATS keys).
  // Defaults to all; a saved default (localStorage) is loaded on mount.
  const [transitSel, setTransitSel] = useState(() => new Set(ALL_TRANSIT_KEYS));
  // Bikes: which facility classes are shown (a Set of BIKE_CLASSES keys).
  const [bikeSel, setBikeSel] = useState(() => new Set(ALL_BIKE_KEYS));
  // Hazards: which hazard layers are shown when the overlay is on.
  const [hazardDefault, setHazardDefault] = useState({ seismic: true, tsunami: true, faults: true });
  // Microclimates: which zones are shown when the overlay is on.
  const [microDefault, setMicroDefault] = useState({ sun: true, cool: true, wind: true });

  // Load saved overlay defaults once on the client.
  useEffect(() => {
    const loadSet = (key, all) => {
      try {
        const arr = JSON.parse(localStorage.getItem(key) || "null");
        if (Array.isArray(arr)) return new Set(arr.filter(k => all.includes(k)));
      } catch {}
      return null;
    };
    const t = loadSet(TRANSIT_PREF_KEY, ALL_TRANSIT_KEYS); if (t) setTransitSel(t);
    const b = loadSet(BIKE_PREF_KEY, ALL_BIKE_KEYS); if (b) setBikeSel(b);
    try {
      const h = JSON.parse(localStorage.getItem(HAZARD_PREF_KEY) || "null");
      if (h && typeof h === "object") setHazardDefault({ seismic: !!h.seismic, tsunami: !!h.tsunami, faults: !!h.faults });
    } catch {}
    try {
      const m = JSON.parse(localStorage.getItem(MICRO_PREF_KEY) || "null");
      if (m && typeof m === "object") setMicroDefault({ sun: !!m.sun, cool: !!m.cool, wind: !!m.wind });
    } catch {}
  }, []);

  // The route_name allow-list for the map (null = show every route).
  const transitRoutes = useMemo(
    () => (isAllSelected(transitSel) ? null : routesForSelection(transitSel)),
    [transitSel]
  );
  // The current selection IS the saved default — persist on every change.
  const persistTransit = n => { try { localStorage.setItem(TRANSIT_PREF_KEY, JSON.stringify([...n])); } catch {} };
  const applyTransit = n => { setTransitSel(n); persistTransit(n); };
  const toggleTransitCat = key => {
    const n = new Set(transitSel);
    n.has(key) ? n.delete(key) : n.add(key);
    applyTransit(n);
  };
  const showAllTransit = () => applyTransit(new Set(ALL_TRANSIT_KEYS));
  const selectNoneTransit = () => applyTransit(new Set());

  // Bikes selector handlers — the current selection is the saved default.
  const persistBike = n => { try { localStorage.setItem(BIKE_PREF_KEY, JSON.stringify([...n])); } catch {} };
  const applyBike = n => { setBikeSel(n); persistBike(n); };
  const toggleBikeClass = key => {
    const n = new Set(bikeSel);
    n.has(key) ? n.delete(key) : n.add(key);
    applyBike(n);
  };
  const showAllBikes = () => applyBike(new Set(ALL_BIKE_KEYS));
  const selectNoneBikes = () => applyBike(new Set());
  // Summer fog overlay — on for the "Fog Map" preset; off otherwise.
  const [showContours, setShowContours] = useState(preset === "fog");
  // Transit (Muni stops) — on for the "Transit" preset.
  const [showMuni, setShowMuni] = useState(preset === "transit");
  // Bike network — on for the "Bike Paths" preset.
  const [showBikes, setShowBikes] = useState(preset === "bikes");
  // SF neighborhood outlines + name labels — always on by default and
  // every preset keeps them on as the anchor layer.
  const [showNeighborhoods, setShowNeighborhoods] = useState(true);
  // Supervisor district boundaries — on for the "Districts" preset.
  const [showDistricts, setShowDistricts] = useState(preset === "districts");
  // ZIP code boundaries — independent toggle.
  const [showZips, setShowZips] = useState(false);
  // Topographic hillshade overlay.
  const [showTerrain, setShowTerrain] = useState(false);
  // Satellite imagery base.
  const [showSatellite, setShowSatellite] = useState(false);
  // Elevation contour lines + ft labels + peak labels — the layer set
  // pulled in from /microclimates.
  const [showElevation, setShowElevation] = useState(false);
  // CA Geological Survey seismic hazard zones.
  const [showSeismic, setShowSeismic] = useState(false);
  // CGS Tsunami Hazard Area for Emergency Planning, 2021 update.
  const [showTsunami, setShowTsunami] = useState(false);
  // USGS active fault traces (San Andreas, Hayward, Calaveras, …).
  const [showFaults, setShowFaults] = useState(false);

  // Hazards selector handlers. The bar's picks ARE the saved default; opening
  // restores them, and turning the chip off hides without clobbering them.
  const applyHaz = d => { setShowSeismic(d.seismic); setShowTsunami(d.tsunami); setShowFaults(d.faults); };
  const persistHaz = d => { setHazardDefault(d); try { localStorage.setItem(HAZARD_PREF_KEY, JSON.stringify(d)); } catch {} };
  const openHazards = () => applyHaz(hazardDefault);
  const hideHazards = () => applyHaz({ seismic: false, tsunami: false, faults: false });
  const toggleHazard = key => { const d = { seismic: showSeismic, tsunami: showTsunami, faults: showFaults }; d[key] = !d[key]; applyHaz(d); persistHaz(d); };
  const showAllHazards = () => { const d = { seismic: true, tsunami: true, faults: true }; applyHaz(d); persistHaz(d); };
  const selectNoneHazards = () => { const d = { seismic: false, tsunami: false, faults: false }; applyHaz(d); persistHaz(d); };

  // Microclimates selector handlers — bar picks are the saved default; opening
  // loads the zones + restores them, chip-off hides without clobbering them.
  const applyMicro = d => { setShowMicroSun(d.sun); setShowMicroCool(d.cool); setShowMicroWind(d.wind); };
  const persistMicro = d => { setMicroDefault(d); try { localStorage.setItem(MICRO_PREF_KEY, JSON.stringify(d)); } catch {} };
  const openMicro = () => { setMicroWanted(true); applyMicro(microDefault); };
  const hideMicro = () => applyMicro({ sun: false, cool: false, wind: false });
  const toggleMicro = key => { const d = { sun: showMicroSun, cool: showMicroCool, wind: showMicroWind }; d[key] = !d[key]; applyMicro(d); persistMicro(d); };
  const showAllMicro = () => { const d = { sun: true, cool: true, wind: true }; applyMicro(d); persistMicro(d); };
  const selectNoneMicro = () => { const d = { sun: false, cool: false, wind: false }; applyMicro(d); persistMicro(d); };

  // SFAR Realtor neighborhoods (blue outlines + nbrhood (nid) labels).
  const [showRealtor, setShowRealtor] = useState(false);
  // SF Community Benefit Districts (purple fill + outline + name labels).
  const [showCBD, setShowCBD] = useState(false);
  // SF Tall Building Inventory — split into two independently-toggleable
  // occupancy groups. Click a footprint for the full structural/seismic record.
  const [showResBuildings, setShowResBuildings] = useState(preset === "buildings");
  const [showComBuildings, setShowComBuildings] = useState(false);
  // Background layers kept off — used for lookups, not for the UI toggle set.
  const [showZoning] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoErr, setGeoErr] = useState("");
  const autoGeoTriedRef = useRef(false);
  const urlLocAppliedRef = useRef(false);

  // If the page was opened with ?lat=&lng=&name= (e.g. the Fog Forecast
  // button on Ur4cast), parse those once.
  const urlLoc = (() => {
    const lat = Number(searchParams?.get("lat"));
    const lng = Number(searchParams?.get("lng"));
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    // ?bz=1 (building zoom) — from a "View building structure" link — flies in
    // to the footprint instead of framing the whole city.
    const zoom = searchParams?.get("bz") ? 15.5 : null;
    return { point: [lng, lat], name: searchParams.get("name") || "", zoom };
  })();
  // Holds the latest contours/geojson for use inside async callbacks that
  // were captured before the data finished loading.
  const dataRef = useRef({ geojson: null, contours: null });
  useEffect(() => {
    dataRef.current = { geojson, contours };
  }, [geojson, contours]);

  useEffect(() => {
    let cancelled = false;
    fetch(DATA_URL)
      .then(r => {
        if (!r.ok) throw new Error(`Failed to load fog data (${r.status})`);
        return r.json();
      })
      .then(d => {
        if (!cancelled) setGeojson(d);
      })
      .catch(e => {
        if (!cancelled) setDataErr(e.message);
      });

    // Contour overlay is optional — silently skip if the file isn't there.
    fetch(CONTOURS_URL)
      .then(r => (r.ok ? r.json() : null))
      .then(d => {
        if (!cancelled && d) setContours(d);
      })
      .catch(() => {});

    // Extra layers used only for the key/legend lookups (not toggleable
    // in the simplified toggle set). Loaded once on mount, in parallel.
    const loadLookup = (url, setter) =>
      fetch(url)
        .then(r => (r.ok ? r.json() : null))
        .then(d => { if (!cancelled && d) setter(d); })
        .catch(() => {});
    loadLookup("/data/building-sales.json", setBuildingSales);
    loadLookup("/data/building-profiles.json", setBuildingProfiles);
    loadLookup("/data/sf-zip-codes.geojson", setZips);
    loadLookup("/data/sf-supervisor-districts.geojson", setSupervisorDistricts);
    loadLookup("/data/sf-realtor-neighborhoods.geojson", setRealtorNeighborhoods);
    loadLookup("/data/sf-seismic-hazards.geojson", setSeismicHazards);
    loadLookup("/data/sf-tsunami-hazard.geojson", setTsunamiHazard);

    return () => {
      cancelled = true;
    };
  }, []);

  // A search result resolved to a lng/lat — find both the containing
  // neighborhood (for context) and the containing fog contour (for the
  // primary value). If the address is outside SF, feature/contour are null
  // but we still set point + address so the map can fly there.
  const pickFromAddress = useCallback(
    (point, address) => {
      if (!geojson) return;
      const feature = findNeighborhoodForPoint(geojson, point);
      const contour = findContourForPoint(contours, point);
      setPicked({ point, address, feature, contour });
      // Surface the neighborhood summary (with the point-level facts) for the
      // address the user entered — that pop-up is now the only place details
      // show, since there's no bottom panel.
      setOpenHood(feature?.properties?.name || null);
    },
    [geojson, contours]
  );

  // User clicked a neighborhood directly on the map — pick the point and
  // open that neighborhood's highlights pop-up.
  const pickFromMap = useCallback(
    (feature, point) => {
      const contour = findContourForPoint(contours, point);
      setPicked({ point, address: null, feature, contour });
      setOpenHood(feature?.properties?.name || null);
    },
    [contours]
  );

  // User clicked a neighborhood name in the A–Z index — treat it like
  // clicking the centre of that neighborhood on the map: drop a pin at its
  // centroid (so the point-level lookups + elevation resolve) and open the
  // highlights pop-up.
  const pickFromNeighborhood = useCallback(
    name => {
      if (!geojson) return;
      const feature = findFeatureByName(geojson, name);
      if (!feature) return;
      const point = centroidOfFeature(feature);
      const contour = point ? findContourForPoint(contours, point) : null;
      // Frame the whole neighborhood polygon so the map zooms to it while the
      // info pop-up opens.
      const bounds = bboxOfFeature(feature);
      setPicked({ point, address: null, feature, contour, scope: "neighborhood", bounds });
      setOpenHood(name);
    },
    [geojson, contours]
  );

  // Browser geolocation → reverse-geocoded address → pick. The dataRef
  // dance lets us run the spatial lookups against the latest data even
  // if the user triggers geo before contours / neighborhoods finish loading.
  const requestGeoLocation = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setGeoErr("Geolocation isn't available in this browser.");
      return;
    }
    setGeoLoading(true);
    setGeoErr("");
    navigator.geolocation.getCurrentPosition(
      async pos => {
        const point = [pos.coords.longitude, pos.coords.latitude];
        const address = await reverseGeocode(point);
        const { geojson: g, contours: c } = dataRef.current;
        const feature = g ? findNeighborhoodForPoint(g, point) : null;
        const contour = findContourForPoint(c, point);
        setPicked({ point, address, feature, contour });
        setOpenHood(feature?.properties?.name || null);
        setGeoLoading(false);
      },
      err => {
        setGeoErr(
          err.code === err.PERMISSION_DENIED
            ? "Location access denied. Search an address instead."
            : "Couldn't get your location. Search an address instead."
        );
        setGeoLoading(false);
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 }
    );
  }, []);

  // The "Neighborhoods" entry opens the map centred on SF with the placeholder
  // pin at the city's geographic centre (for browsing all neighborhoods),
  // rather than geolocating or using a passed point.
  useEffect(() => {
    if (urlLocAppliedRef.current) return;
    if (preset !== "neighborhoods") return;
    if (!geojson || !contours) return;
    urlLocAppliedRef.current = true;
    autoGeoTriedRef.current = true;
    const feature = findNeighborhoodForPoint(geojson, SF_CENTER);
    const contour = findContourForPoint(contours, SF_CENTER);
    setPicked({ point: SF_CENTER, address: null, feature, contour });
  }, [preset, geojson, contours]);

  // If a URL location was provided (e.g. linked from Ur4cast with
  // ?lat=&lng=&name=), apply it as the initial pick as soon as the data
  // loads. This pre-empts the auto-geolocation prompt — the user can
  // still override with the search bar or 📍 button.
  useEffect(() => {
    if (urlLocAppliedRef.current) return;
    if (!urlLoc) return;
    if (!geojson || !contours) return; // wait for BOTH so neighborhood + fog zone resolve
    urlLocAppliedRef.current = true;
    autoGeoTriedRef.current = true; // suppress the auto-geo prompt below
    const feature = findNeighborhoodForPoint(geojson, urlLoc.point);
    const contour = findContourForPoint(contours, urlLoc.point);
    setPicked({
      point: urlLoc.point,
      address: urlLoc.name || null,
      zoom: urlLoc.zoom,
      feature,
      contour,
    });
  }, [urlLoc, geojson, contours]);

  // Fallback initial pick from localStorage when no URL params present.
  // Ur4cast writes the user's selected location to opscast.loc.v1 — so
  // navigating to /fog directly carries that location over without needing
  // to round-trip through the Fog Forecast button's query string.
  useEffect(() => {
    if (urlLocAppliedRef.current) return;
    if (autoGeoTriedRef.current) return;
    if (urlLoc) return;
    if (!geojson) return;
    let stored;
    try {
      const raw = localStorage.getItem("opscast.loc.v1");
      if (raw) stored = JSON.parse(raw);
    } catch {}
    const lat = Number(stored?.latitude);
    const lng = Number(stored?.longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
    urlLocAppliedRef.current = true;
    autoGeoTriedRef.current = true;
    const point = [lng, lat];
    const feature = findNeighborhoodForPoint(geojson, point);
    const contour = findContourForPoint(contours, point);
    setPicked({
      point,
      address: stored.name || null,
      feature,
      contour,
    });
  }, [urlLoc, geojson, contours]);

  // When a picked point lands, ask Mapbox for the terrain elevation at
  // that lng/lat. Updates `picked.elevation_ft` once the async lookup
  // resolves; the result card renders the number when present, hides
  // the row when not.
  useEffect(() => {
    const point = picked?.point;
    if (!point) return;
    let cancelled = false;
    elevationAtPoint(point).then(ft => {
      if (cancelled) return;
      setPicked(p => {
        if (!p || p.point !== point) return p;
        return { ...p, elevation_ft: ft };
      });
    });
    return () => {
      cancelled = true;
    };
  }, [picked?.point]);

  // Auto-prompt for location on first mount, but only if permission isn't
  // already denied — otherwise we'd just be re-asking for a no. Skipped
  // entirely when a URL location was provided.
  useEffect(() => {
    if (autoGeoTriedRef.current) return;
    if (urlLoc) return; // URL-provided location takes precedence
    autoGeoTriedRef.current = true;
    if (typeof navigator === "undefined" || !navigator.geolocation) return;
    const trigger = () => queueMicrotask(requestGeoLocation);
    if (navigator.permissions?.query) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then(res => {
          if (res.state !== "denied") trigger();
        })
        .catch(trigger);
    } else {
      trigger();
    }
  }, [requestGeoLocation, urlLoc]);

  // Turning on either buildings layer hides the neighborhood outlines/labels
  // so the tall-building footprints read cleanly (the two overlays clutter
  // each other). Turning a buildings layer off leaves neighborhoods as-is —
  // the user can switch them back on manually.
  const handleToggleResBuildings = useCallback(next => {
    setShowResBuildings(next);
    if (next) setShowNeighborhoods(false);
  }, []);
  const handleToggleComBuildings = useCallback(next => {
    setShowComBuildings(next);
    if (next) setShowNeighborhoods(false);
  }, []);

  // Zoom the map to a building chosen from the Bldgs list (the residential
  // layer is already on from opening that list).
  const zoomToBuilding = useCallback(b => {
    const lng = Number(b?.lng), lat = Number(b?.lat);
    const center = Number.isFinite(lng) && Number.isFinite(lat) ? [lng, lat] : null;
    // Frame the building's footprint polygon (falls back to its centre).
    setFlyTo({ buildingId: b?.objectid, center, zoom: 17 });
  }, []);

  // ── Housing Activity overlay ──
  // Lazy-load the listings GeoJSON the first time the user opens the panel.
  useEffect(() => {
    if (!activityWanted || listingsGeo) return;
    let cancelled = false;
    loadListingsGeo().then(g => { if (!cancelled) setListingsGeo(g); });
    return () => { cancelled = true; };
  }, [activityWanted, listingsGeo]);

  // ── MicroClimates overlay ──
  // Lazy-load the terrain-derived sun/cool/wind zones on first panel open.
  useEffect(() => {
    if (!microWanted || microZones) return;
    let cancelled = false;
    fetch("/data/sf-microclimates.geojson")
      .then(r => (r.ok ? r.json() : null))
      .then(d => { if (!cancelled && d) setMicroZones(d); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [microWanted, microZones]);

  // Option lists for the shared filter, derived from the listings data.
  const homesOptions = useMemo(() => deriveOptions(listingsGeo?.features), [listingsGeo]);

  // Properties matching the shared Homes filter — feeds the live count, the
  // map dots, and the Stats sheet (all from one filter). Empty when Homes off.
  const homesMatches = useMemo(() => {
    if (!listingsGeo || !activityWanted) return [];
    return listingsGeo.features.filter(f => matchesFilter(f.properties, homesFilter));
  }, [listingsGeo, activityWanted, homesFilter]);
  const homesCount = homesMatches.length;
  const homesProps = useMemo(() => homesMatches.map(f => f.properties), [homesMatches]);

  // From a neighborhood pop-up's "N sold" link → focus the Homes overlay on
  // that neighborhood + segment and open the Stats sheet (the address grid).
  const SEG_TYPES = { sfh: ["Single Family Residence"], condo: ["Condominium", "Tenancy in Common"] };
  const showNeighborhoodProperties = useCallback((nbhd, seg) => {
    setHomesFilter({ ...defaultFilter(), neighborhood: nbhd, subtypes: new Set(SEG_TYPES[seg] || []) });
    setActivityWanted(true);
    setOpenHood(null);
    setStatsOpen(true);
    setStatsExpanded(true);
  }, []);

  // Generate + download the market-update PDF for the current filter. The PDF
  // renderer is dynamically imported so it only loads on demand.
  const downloadReport = useCallback(async () => {
    if (!listingsGeo) return;
    setReporting(true);
    try {
      const data = buildReportData(listingsGeo.features, homesFilter);
      const { downloadReport: dl } = await import("../listings/lib/reportPdf");
      const slug = data.periodLabel.replace(/[^a-z0-9]+/gi, "_").replace(/^_|_$/g, "");
      await dl(data, `SF_Market_Update_${slug}.pdf`);
    } catch (e) {
      console.error("report failed", e);
    }
    setReporting(false);
  }, [listingsGeo, homesFilter]);

  // The matching listings as map dots, each tagged actKind ("sold"|"active").
  const activityData = useMemo(() => {
    if (!activityWanted) return null;
    return {
      type: "FeatureCollection",
      features: homesMatches.map(f => ({
        type: "Feature",
        geometry: f.geometry,
        properties: { ...f.properties, actKind: isSoldStatus(f.properties.status) ? "sold" : "active" },
      })),
    };
  }, [homesMatches, activityWanted]);

  return (
    <div className="fog-app fog-app-vertical">
      <div className="fog-map-wrap fog-map-wrap-full">
        <FogMap
          geojson={geojson}
          contours={contours}
          showContours={showContours}
          showTerrain={showTerrain}
          showSatellite={showSatellite}
          showElevation={showElevation}
          showSeismic={showSeismic}
          showTsunami={showTsunami}
          showFaults={showFaults}
          showMuni={showMuni}
          showBikes={showBikes}
          showZips={showZips}
          showDistricts={showDistricts}
          showZoning={showZoning}
          showRealtor={showRealtor}
          showCBD={showCBD}
          showResBuildings={showResBuildings}
          showComBuildings={showComBuildings}
          buildingSales={buildingSales}
          showNeighborhoods={showNeighborhoods}
          picked={picked}
          onPickFeature={pickFromMap}
          activityData={activityData}
          microZones={microZones}
          showMicroSun={showMicroSun}
          showMicroCool={showMicroCool}
          showMicroWind={showMicroWind}
          flyTo={flyTo}
          transitRoutes={transitRoutes}
          transitStops={transitSel.has("bus")}
          bikeSel={bikeSel}
        />
        <FogMapTools
          contoursAvailable={!!contours}
          showNeighborhoods={showNeighborhoods}
          onToggleNeighborhoods={setShowNeighborhoods}
          showContours={showContours}
          onToggleContours={setShowContours}
          showMuni={showMuni}
          onToggleMuni={setShowMuni}
          showBikes={showBikes}
          onToggleBikes={setShowBikes}
          showDistricts={showDistricts}
          onToggleDistricts={setShowDistricts}
          showZips={showZips}
          onToggleZips={setShowZips}
          showTerrain={showTerrain}
          onToggleTerrain={setShowTerrain}
          showSatellite={showSatellite}
          onToggleSatellite={setShowSatellite}
          showElevation={showElevation}
          onToggleElevation={setShowElevation}
          showSeismic={showSeismic}
          onToggleSeismic={setShowSeismic}
          showTsunami={showTsunami}
          onToggleTsunami={setShowTsunami}
          showFaults={showFaults}
          showRealtor={showRealtor}
          onToggleRealtor={setShowRealtor}
          showCBD={showCBD}
          onToggleCBD={setShowCBD}
          showResBuildings={showResBuildings}
          onToggleResBuildings={handleToggleResBuildings}
          showComBuildings={showComBuildings}
          onToggleComBuildings={handleToggleComBuildings}
          buildingProfiles={buildingProfiles}
          openBuilding={openBuilding}
          onOpenBuilding={setOpenBuilding}
          onZoomBuilding={zoomToBuilding}
          onShowResBuildings={() => handleToggleResBuildings(true)}
          transitSel={transitSel}
          onToggleTransitCat={toggleTransitCat}
          onShowAllTransit={showAllTransit}
          onSelectNoneTransit={selectNoneTransit}
          onTransitOpen={() => setShowMuni(true)}
          bikeSel={bikeSel}
          onToggleBikeClass={toggleBikeClass}
          onShowAllBikes={showAllBikes}
          onSelectNoneBikes={selectNoneBikes}
          onBikesOpen={() => setShowBikes(true)}
          onHazardsOpen={openHazards}
          onHazardsHide={hideHazards}
          onToggleHazard={toggleHazard}
          onShowAllHazards={showAllHazards}
          onSelectNoneHazards={selectNoneHazards}
          onToggleMicroZone={toggleMicro}
          onShowAllMicro={showAllMicro}
          onSelectNoneMicro={selectNoneMicro}
          onMicroHide={hideMicro}
          onPickNeighborhood={pickFromNeighborhood}
          openHood={openHood}
          initialMenu={preset === "homes" ? "activity" : preset === "transit" ? "transit" : undefined}
          activityOn={activityWanted}
          homesFilter={homesFilter}
          homesOptions={homesOptions}
          homesCount={homesCount}
          onActivityOpen={() => setActivityWanted(true)}
          onHomesFilterChange={setHomesFilter}
          onClearActivity={() => setActivityWanted(false)}
          onOpenStats={() => setStatsOpen(true)}
          showMicroSun={showMicroSun}
          onToggleMicroSun={setShowMicroSun}
          showMicroCool={showMicroCool}
          onToggleMicroCool={setShowMicroCool}
          showMicroWind={showMicroWind}
          onToggleMicroWind={setShowMicroWind}
          onMicroOpen={openMicro}
          onPickFromAddress={pickFromAddress}
          onUseGeoLocation={requestGeoLocation}
          ready={!!geojson}
          geoLoading={geoLoading}
          picked={picked}
          dataErr={dataErr}
          geoErr={geoErr}
        />
        {statsOpen && activityWanted && (
          <HomesStats
            props={homesProps}
            count={homesCount}
            expanded={statsExpanded}
            onToggleExpand={() => setStatsExpanded(e => !e)}
            onClose={() => setStatsOpen(false)}
            onDownload={downloadReport}
            downloading={reporting}
          />
        )}
      </div>
      <FogPanel
        picked={picked}
        openHood={openHood}
        onCloseHood={() => setOpenHood(null)}
        onShowProperties={showNeighborhoodProperties}
        zips={zips}
        supervisorDistricts={supervisorDistricts}
        realtorNeighborhoods={realtorNeighborhoods}
        seismicHazards={seismicHazards}
        tsunamiHazard={tsunamiHazard}
        buildingProfiles={buildingProfiles}
        openBuilding={openBuilding}
        onCloseBuilding={() => setOpenBuilding(null)}
      />
    </div>
  );
}
