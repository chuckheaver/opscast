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
