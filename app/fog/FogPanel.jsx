'use client';

// Modal host for the map. Renders the Neighborhood-highlights pop-up and the
// Building profile pop-up — there is no longer a visible bottom panel; the
// point-level facts (ZIP, elevation, seismic, tsunami) that used to live in a
// bottom strip are now folded into the neighborhood summary modal. The
// Neighborhoods / Buildings lists and layer toggles live in the on-map toolbar
// (FogMapTools).

import { findNeighborhoodForPoint, featureIntersectsAny } from "./lib/spatial";
import { fogLabel } from "./lib/risk";
import { getNeighborhood } from "./lib/neighborhoods";
import { getBuilding } from "./lib/buildings";
import NeighborhoodModal from "./NeighborhoodModal";
import BuildingModal from "./BuildingModal";

export default function FogPanel({
  picked,
  openHood,
  onCloseHood,
  zips,
  supervisorDistricts,
  realtorNeighborhoods,
  seismicHazards,
  tsunamiHazard,
  buildingProfiles, openBuilding, onCloseBuilding,
}) {
  // Per-location lookups for the picked point.
  const point = picked?.point;
  const zipFeat = point && zips ? findNeighborhoodForPoint(zips, point) : null;
  const supFeat = point && supervisorDistricts
    ? findNeighborhoodForPoint(supervisorDistricts, point) : null;
  const realtorFeat = point && realtorNeighborhoods
    ? findNeighborhoodForPoint(realtorNeighborhoods, point) : null;

  const neighborhoodName = picked?.feature?.properties?.name;
  const zipCode = zipFeat?.properties?.zip;
  const elevationFt = picked?.elevation_ft;
  const realtorLabel = realtorFeat
    ? `${realtorFeat.properties.nbrhood} (${realtorFeat.properties.nid})`
    : null;
  // Microclimate Zone derives from the USGS fog contour at the picked point.
  const fogHrs = picked?.contour?.properties?.hours;
  const microZoneLabel = Number.isFinite(fogHrs) ? fogLabel(fogHrs) : null;

  // Hazard checks — "Yes"/"No" once the location AND the hazard dataset have
  // both arrived. A neighborhood pick tests polygon overlap; an exact point
  // tests containment.
  const isNeighborhoodScope = picked?.scope === "neighborhood" && !!picked?.feature;
  const hazardYN = fc => {
    if (!fc) return null;
    if (isNeighborhoodScope) return featureIntersectsAny(picked.feature, fc) ? "Yes" : "No";
    return point ? (findNeighborhoodForPoint(fc, point) ? "Yes" : "No") : null;
  };
  const seismicYN = hazardYN(seismicHazards);
  const tsunamiYN = hazardYN(tsunamiHazard);

  // The neighborhood whose pop-up is open. Point-derived facts only apply when
  // the picked point is actually inside the open neighborhood.
  const openData = openHood ? getNeighborhood(openHood) : null;
  const factsMatch = neighborhoodName === openHood;

  return (
    <>
      {openHood && openData && (
        <NeighborhoodModal
          name={openHood}
          data={openData}
          fogHrs={factsMatch && Number.isFinite(fogHrs) ? fogHrs : null}
          zoneLabel={factsMatch ? microZoneLabel : null}
          supervisorDistrict={factsMatch ? supFeat?.properties?.district : null}
          realtorDistrict={factsMatch ? realtorLabel : null}
          zipCode={factsMatch ? zipCode : null}
          elevationFt={factsMatch && Number.isFinite(elevationFt) ? elevationFt : null}
          seismicYN={factsMatch ? seismicYN : null}
          tsunamiYN={factsMatch ? tsunamiYN : null}
          loc={factsMatch ? picked : null}
          onClose={onCloseHood}
        />
      )}
      {openBuilding && buildingProfiles?.[openBuilding] && (
        <BuildingModal
          profile={buildingProfiles[openBuilding]}
          authored={getBuilding(openBuilding)}
          onClose={onCloseBuilding}
        />
      )}
    </>
  );
}
