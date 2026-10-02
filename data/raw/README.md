# Raw shapefile inputs

Drop your two shapefile bundles here:

```
data/raw/
  neighborhoods.shp   (+ .dbf, .shx, .prj)
  fog.shp             (+ .dbf, .shx, .prj)
```

Then run:

```
node scripts/process-fog-data.mjs
```

That writes `public/data/sf-fog-neighborhoods.geojson`, which the `/fog`
page fetches at runtime.

## Attribute names

The script assumes:

- `fog.shp` has a numeric field named `FOG_HRS` (annual fog hours)
- `neighborhoods.shp` has a text field named `name`

If yours are named differently, edit `FOG_HOURS_FIELD` and
`NEIGH_NAME_FIELD` at the top of `scripts/process-fog-data.mjs`.

## Why these files aren't committed

Shapefiles can be large (and may have licensing constraints). The repo
ignores `data/raw/*.shp` and friends — see `.gitignore`. The processed
output GeoJSON in `public/data/` is small and IS committed.

## MLS listing exports (the `/listings` + Homes overlay data)

Raw MLS exports (BrokerMetrics / SFAR `.csv` or `.xlsx`, as downloaded)
are NOT committed. Drop one anywhere and run the converter:

```
python3 scripts/convert-mls-history.py --sold-only <export.csv> sold_2026_<label>.csv
```

That writes a canonical, sanitized CSV here as `data/raw/sold_*.csv` —
agent columns reduced to names (no phone numbers or MLS IDs), subtype
codes expanded, and only sold rows when `--sold-only` is given. Those
`sold_*.csv` files ARE committed (see `.gitignore`) so that

```
node scripts/geocode-listings.mjs
```

is reproducible from a clean clone and rebuilds the same
`public/data/sf-listings.geojson` on any machine.

The geocoder merges every `.csv` sitting directly in this folder (de-duped
by listing number, newest status date wins). Subfolders are not read, so
move superseded exports into e.g. `data/raw/_archive/` rather than leaving
them beside the current set.

### Coordinate provenance (`geoSource` on every feature)

In order of precedence: `export` (lat/lng in the MLS file) · `census` /
`published` (a real geocode — from the Census batch geocoder, or carried
over from the previously published file) · `override` (a hand-placed
coordinate in `OVERRIDES`) · `nearest` (the true number isn't in any address range — e.g. 192 Museum
Way — so the listing sits at the closest house number on that street that
does geocode, same side of the street preferred; `geoVia` names it) ·
`interpolated` (estimated from same-building
or same-street neighbors by `scripts/interpolate-unmapped.py`) ·
`neighborhood` (no findable position at all — pinned to the inferred
neighborhood's anchor point so the sale still counts; the map draws these
as one larger blue dot per neighborhood whose pop-up lists every listing).
Estimates and placeholders are never cached, so a run with the Census
geocoder reachable replaces them with real positions automatically.

## Validation (runs automatically)

`geocode-listings.mjs` finishes by running `scripts/validate-listings.mjs`,
which checks every agent-entered location field against where the sale sits
and corrects typos:

- **Pin vs APN** — the APN's city block should be under the pin. When it isn't
  and the APN's parcel sits in the ZIP the agent typed, the address/APN/ZIP
  agree and the pin moves to the APN parcel (`geoSource: "apn"`, old pin kept
  as `pinMls`). If nothing agrees the sale is flagged `geoCheck: "apn-far"`.
- **ZIP** — compared with the ZIPs typed for the other sales on the same block;
  3+ neighbors agreeing 80%+ override a different ZIP, and non-SF ZIPs are
  always replaced (MLS value kept as `zipMls`).
- **SF District** — from the SFAR district at the pin (`areaDescMls` keeps
  the typed value). Neighborhood was already taken from the pin.

Every change and flag is listed in `data/mls-corrections.csv` for review.
Per-sale incline (`data/sale-incline.json`) is rebuilt right after.
