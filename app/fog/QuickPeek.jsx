'use client';

// Quick Peek: the small card on a searched address's marker. The point facts
// FogPanel already computes (neighborhood, district, ZIP, fog, elevation,
// hazards) arrive as props; the rest — Muni, bikes, land use, special
// districts — are looked up here once the card opens.

import { useEffect, useState } from "react";
import { nearestMuni, nearestBike, parcelLandUse, zoningAndDistricts, incline } from "./lib/quickpeek";

// Same four zones the neighborhood guide and the market report use.
function zoneOf(h) {
  if (!Number.isFinite(h)) return null;
  if (h <= 8) return "Sun";
  if (h < 9) return "Transition";
  if (h < 11) return "Fog";
  return "Persistent Fog";
}
const ZONE_COLOR = { Sun: "#E8B84B", Transition: "#D8C08E", Fog: "#A8BCCD", "Persistent Fog": "#8DA2B5" };

const routesShort = r => {
  let list = String(r || "").split("·").map(s => s.trim()).filter(Boolean);
  // "FBUS" / "KBUS" are bus substitutes for the F and K — skip when the line is listed.
  list = list.filter(x => !(x.endsWith("BUS") && list.includes(x.slice(0, -3))));
  return list.length > 6 ? `${list.slice(0, 6).join(", ")} +${list.length - 6}` : list.join(", ");
};

export default function QuickPeek({
  point, address, neighborhood, district, zip, fogHrs, elevationFt,
  seismicYN, tsunamiYN, onMore, onClose,
}) {
  const [muni, setMuni] = useState(undefined);
  const [bike, setBike] = useState(undefined);
  const [land, setLand] = useState(undefined);
  const [zd, setZd] = useState(undefined);
  const [slope, setSlope] = useState(undefined);
  const key = point ? point.join(",") : "";

  useEffect(() => {
    if (!point) return;
    let live = true;
    setMuni(undefined); setBike(undefined); setLand(undefined); setZd(undefined); setSlope(undefined);
    nearestMuni(point).then(v => live && setMuni(v));
    nearestBike(point).then(v => live && setBike(v));
    parcelLandUse(point).then(v => live && setLand(v));
    zoningAndDistricts(point).then(v => live && setZd(v));
    incline(point).then(v => live && setSlope(v));
    return () => { live = false; };
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps

  const zone = zoneOf(fogHrs);
  const wait = <span className="qp-wait">…</span>;
  const hazards = (() => {
    if (seismicYN == null && tsunamiYN == null) return wait;
    const hit = [seismicYN === "Yes" && "Seismic", tsunamiYN === "Yes" && "Tsunami"].filter(Boolean);
    return hit.length ? <b className="qp-yes">{hit.join(", ")}</b> : "No";
  })();
  const elev = Number.isFinite(elevationFt) ? `${Math.round(elevationFt).toLocaleString("en-US")} ft` : null;
  const street = String(address || "").split(",")[0] || "Dropped pin";

  const rows = [
    ["Street Address", street],
    ["Neighborhood", neighborhood || "—"],
    ["District", district || "—"],
    ["Zip Code", zip || "—"],
    ["Microclimate Zone", zone ? <span className="qp-zone" style={{ "--z": ZONE_COLOR[zone] }}>{zone}</span> : "—"],
    ["Elevation / Incline", !elev ? wait
      : slope === undefined ? <>{elev} / {wait}</>
      : slope ? `${elev} / ${slope.pct}% (${slope.label})` : elev],
    ["Hazards", hazards],
    ["Muni", muni === undefined ? wait : muni ? <>{routesShort(muni.routes) || muni.name} <i>· {muni.dist}</i></> : "—"],
    ["Bike Path", bike === undefined ? wait : bike ? <>{bike.street} / {bike.cls} <i>· {bike.dist}</i></> : "—"],
    ["Land Use", land === undefined ? wait
      : land ? <>{land.use}{land.units ? <i> · {land.units} unit{land.units === 1 ? "" : "s"}</i> : null}{zd?.zoning ? <i> · {zd.zoning}</i> : null}</> : "—"],
    ["Abutting Land Use", land === undefined ? wait : land?.abutting?.length ? land.abutting.join(", ") : "—"],
    ["Special Distr", zd === undefined ? wait : zd.special.length ? zd.special.join("; ") : "No"],
  ];

  return (
    <div className="qp">
      <div className="qp-top">
        <span className="qp-title">Quick Peek</span>
        <button type="button" className="qp-x" onClick={onClose} aria-label="Close Quick Peek">×</button>
      </div>
      <dl className="qp-rows">
        {rows.map(([k, v]) => (
          <div className="qp-row" key={k}><dt>{k}</dt><dd>{v}</dd></div>
        ))}
      </dl>
      {neighborhood && onMore && (
        <button type="button" className="qp-more" onClick={onMore}>{neighborhood} — neighborhood details →</button>
      )}
    </div>
  );
}
