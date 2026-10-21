'use client';

// A neighborhood's walking tour: the "Did You Know?" stops as numbered pins,
// joined by a thin line in walking order over the street map, with the
// neighborhood outlined. The line follows the streets (Mapbox's walking
// directions, kept in the browser so a page view asks only once); if that
// can't be had, a plain line through the stops stands in. Renders nothing if
// Mapbox can't load, so the numbered cards below it still read on their own.

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
const LINE = "#203C5F";          // the site's navy, as on the report
const PIN = 26;                  // a pin's width plus its white ring, px

function bboxOf(coords) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const [x, y] of coords) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  return [[x0, y0], [x1, y1]];
}

// The tour as Google Maps walking directions: stop 1 to the last stop, through
// the others in order (Google takes up to 9 in between; our tours have at most 9 stops).
const googleWalk = stops => {
  const ll = s => `${s.at[1]},${s.at[0]}`;
  const q = new URLSearchParams({ api: "1", travelmode: "walking", origin: ll(stops[0]), destination: ll(stops.at(-1)) });
  if (stops.length > 2) q.set("waypoints", stops.slice(1, -1).slice(0, 9).map(ll).join("|"));
  return `https://www.google.com/maps/dir/?${q}`;
};

// The walking route through the stops, from the browser's store or Mapbox.
async function walkingRoute(stops, key) {
  try { const hit = JSON.parse(localStorage.getItem(key) || "null"); if (hit?.geometry) return hit; } catch {}
  const path = stops.map(s => `${s.at[0]},${s.at[1]}`).join(";");
  const r = await fetch(`https://api.mapbox.com/directions/v5/mapbox/walking/${path}?geometries=geojson&overview=full&access_token=${TOKEN}`);
  if (!r.ok) throw new Error(`directions ${r.status}`);
  const d = await r.json();
  const route = d.routes?.[0];
  if (!route?.geometry) throw new Error("no route");
  const out = { geometry: route.geometry, meters: route.distance, seconds: route.duration };
  try { localStorage.setItem(key, JSON.stringify(out)); } catch {}
  return out;
}

export default function WalkTour({ name, polygons = [], stops = [], walk }) {
  const ref = useRef(null);
  const [failed, setFailed] = useState(!TOKEN);
  const [measure, setMeasure] = useState(null);     // { miles, minutes } from the route
  const located = stops.filter(s => Array.isArray(s.at) && s.at.length === 2);

  useEffect(() => {
    if (!TOKEN || !ref.current || located.length < 2) return;
    mapboxgl.accessToken = TOKEN;
    let map, cancelled = false;
    try {
      map = new mapboxgl.Map({
        container: ref.current,
        style: "mapbox://styles/mapbox/streets-v12",
        bounds: bboxOf(located.map(s => s.at)),
        fitBoundsOptions: { padding: 56 },
        cooperativeGestures: true,
        attributionControl: true,
      });
    } catch { setFailed(true); return; }
    map.on("error", () => { if (!map.loaded()) setFailed(true); });
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "bottom-right");

    map.on("load", async () => {
      // the neighborhood's outline, thin
      try {
        const g = await fetch("/data/sf-fog-neighborhoods.geojson").then(r => r.json());
        const mine = g.features.filter(f => polygons.includes(f.properties.name));
        if (mine.length && !cancelled) {
          map.addSource("hood", { type: "geojson", data: { type: "FeatureCollection", features: mine } });
          map.addLayer({ id: "hood-fill", type: "fill", source: "hood", paint: { "fill-color": LINE, "fill-opacity": 0.05 } });
          map.addLayer({ id: "hood-line", type: "line", source: "hood", paint: { "line-color": LINE, "line-width": 1.2, "line-opacity": 0.45, "line-dasharray": [3, 2] } });
        }
      } catch {}
      // the walk: along the streets if Mapbox gives a route, else stop to stop
      const straight = { type: "LineString", coordinates: located.map(s => s.at) };
      map.addSource("walk", { type: "geojson", data: { type: "Feature", geometry: straight, properties: {} } });
      map.addLayer({ id: "walk-halo", type: "line", source: "walk", layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": "#ffffff", "line-width": 5, "line-opacity": 0.85 } });
      map.addLayer({ id: "walk-line", type: "line", source: "walk", layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": LINE, "line-width": 2.5 } });
      // numbered stops, in walking order
      const pins = located.map(s => {
        const el = document.createElement("div");
        el.className = "walk-pin";
        el.textContent = String(s.n);
        el.title = s.place || s.title || "";
        el.style.zIndex = String(100 - s.n);   // where a loop ends beside its start, 1 stays on top
        return new mapboxgl.Marker({ element: el }).setLngLat(s.at).addTo(map);
      });
      // Stops a few doors apart would hide one another at this zoom: a pin
      // that lands on an earlier one is set just beside it, until a zoom in
      // gives them room.
      const spread = () => {
        const xy = located.map(s => map.project(s.at));
        pins.forEach((m, i) => {
          let off = [0, 0];
          for (let j = 0; j < i; j++) {
            const dx = xy[i].x - xy[j].x, dy = xy[i].y - xy[j].y, d = Math.hypot(dx, dy);
            if (d < PIN) { const ux = d > 1 ? dx / d : 0.7, uy = d > 1 ? dy / d : -0.7; off = [ux * (PIN - d), uy * (PIN - d)]; }
          }
          m.setOffset(off);
        });
      };
      spread();
      map.on("zoomend", spread);
      try {
        const key = `walk:v1:${name}:${located.map(s => s.at.join(",")).join(";")}`;
        const r = await walkingRoute(located, key);
        if (cancelled) return;
        map.getSource("walk")?.setData({ type: "Feature", geometry: r.geometry, properties: {} });
        setMeasure({ miles: r.meters / 1609.34, minutes: r.seconds / 60 });
      } catch { /* the straight line stays */ }
    });
    return () => { cancelled = true; map && map.remove(); };
  }, [name]);

  if (failed || located.length < 2) return null;
  const miles = measure?.miles ?? walk?.miles;
  const minutes = measure?.minutes ?? walk?.minutes;
  return (
    <div className="walk">
      {walk?.intro && <p className="walk-intro">{walk.intro}</p>}
      <div className="walk-meta">
        <b>{located.length} stops</b>
        {miles ? <span>{miles.toFixed(1)} mi</span> : null}
        {minutes ? <span>about {Math.round(minutes / 5) * 5} min on foot</span> : null}
        <a className="walk-gmaps" href={googleWalk(located)} target="_blank" rel="noopener noreferrer">Launch Walking Tour in Google Maps</a>
      </div>
      <div ref={ref} className="walk-map" role="region" aria-label={`Walking tour of ${name}: ${located.length} stops on a map`} />
      {walk?.tip && <p className="walk-tip"><b>Tip.</b> {walk.tip}</p>}
    </div>
  );
}
