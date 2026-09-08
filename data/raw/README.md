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
coordinate in `OVERRIDES`) · `interpolated` (estimated from same-building
or same-street neighbors by `scripts/interpolate-unmapped.py`) ·
`neighborhood` (no findable position at all — pinned to the inferred
neighborhood's anchor point so the sale still counts; the map draws these
as one larger blue dot per neighborhood whose pop-up lists every listing).
Estimates and placeholders are never cached, so a run with the Census
geocoder reachable replaces them with real positions automatically.
