'use client';

// Top-level fog-map experience. Owns:
//   - the loaded neighborhood GeoJSON (one fetch on mount)
//   - the search-bar state (address text + selected suggestion)
//   - the currently "picked" neighborhood (driven by either a search result
//     or a click on the map)
// Renders FogMap (the actual map canvas) and FogSidebar (search + result card).

import { useEffect, useState, useCallback } from "react";
import FogMap from "./FogMap";
import FogSidebar from "./FogSidebar";
import { findNeighborhoodForPoint } from "./lib/spatial";

const DATA_URL = "/data/sf-fog-neighborhoods.geojson";

export default function FogApp() {
  const [geojson, setGeojson] = useState(null);
  const [dataErr, setDataErr] = useState("");
  const [picked, setPicked] = useState(null); // { feature, point: [lng, lat], address }

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
    return () => {
      cancelled = true;
    };
  }, []);

  // A search result resolved to a lng/lat — find the containing neighborhood
  // and update the picked state. If the address is outside SF, picked.feature
  // is null but we still set point + address so the map can fly there.
  const pickFromAddress = useCallback(
    (point, address) => {
      if (!geojson) return;
      const feature = findNeighborhoodForPoint(geojson, point);
      setPicked({ point, address, feature });
    },
    [geojson]
  );

  // User clicked a neighborhood directly on the map.
  const pickFromMap = useCallback((feature, point) => {
    setPicked({ point, address: null, feature });
  }, []);

  return (
    <div className="fog-app">
      <FogSidebar
        picked={picked}
        onPickFromAddress={pickFromAddress}
        dataErr={dataErr}
        ready={!!geojson}
      />
      <FogMap geojson={geojson} picked={picked} onPickFeature={pickFromMap} />
    </div>
  );
}
