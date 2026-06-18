// Header for the weather sub-page (/weather), shown on both the forecast
// result and the gear-accessed settings view. The facet icon grid that
// used to live here moved to the home hub (HomeHub.jsx); this is now just
// the Location bar (top), the "Your SF Micro Life" title, and the
// call-to-action subhead with the ⚙ gear that opens the threshold form.
//
// Stateless apart from the autocomplete inside LocationBar; everything
// else (zip text, selected location, loading flags) is driven by props so
// the parent decides what each interaction does.

import LocationBar from "./LocationBar";

export default function MicroLifeHeader({
  zip, setZip,
  selectedLoc,
  loading, geoLoad,
  onSubmit, onGeo, onSelectLocation,
  // When provided, renders a ⚙ gear button inline next to the subhead
  // that opens the settings form. Omitted on the settings page itself
  // (where it would be redundant).
  onOpenSettings,
}) {
  return (
    <div className="ml-header">
      <LocationBar
        zip={zip}
        setZip={setZip}
        selectedLoc={selectedLoc}
        loading={loading}
        geoLoad={geoLoad}
        onSubmit={onSubmit}
        onGeo={onGeo}
        onSelectLocation={onSelectLocation}
      />

      <div className="page-h" style={{ marginTop: 18 }}>
        SF <em>Ideal Weather</em>
      </div>
      <div className="page-sub">
        Set Your Ideal Weather and Times Here
        {onOpenSettings && (
          <button
            type="button"
            className="gear-btn gear-btn-inline"
            onClick={onOpenSettings}
            aria-label="Settings"
            title="Settings"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#ea580c"
                d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm9.43 4.92l-2.05-1.16a7.6 7.6 0 0 0 0-2.52l2.05-1.16a.5.5 0 0 0 .2-.62l-1.94-3.36a.5.5 0 0 0-.6-.23l-2.4.84a7.5 7.5 0 0 0-2.18-1.26l-.36-2.53a.5.5 0 0 0-.5-.42h-3.88a.5.5 0 0 0-.5.42l-.36 2.53a7.5 7.5 0 0 0-2.18 1.26l-2.4-.84a.5.5 0 0 0-.6.23L2.32 7.96a.5.5 0 0 0 .2.62l2.05 1.16a7.6 7.6 0 0 0 0 2.52L2.52 13.42a.5.5 0 0 0-.2.62l1.94 3.36c.13.22.4.32.6.23l2.4-.84a7.5 7.5 0 0 0 2.18 1.26l.36 2.53c.04.24.25.42.5.42h3.88a.5.5 0 0 0 .5-.42l.36-2.53a7.5 7.5 0 0 0 2.18-1.26l2.4.84a.5.5 0 0 0 .6-.23l1.94-3.36a.5.5 0 0 0-.2-.62z"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
