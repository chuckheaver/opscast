#!/usr/bin/env bash
# The SFPUC 100-Year Storm Flood Risk Zone for the map's Hazards layer
# (public/data/sf-flood-risk.geojson), from DataSF (jzu3-4yxp), simplified for
# the map. This is the zone boundary itself: the SFPUC's December 2024 update
# added flood elevations inside it (DataSF wppz-u2hi), which cover parcels only
# and leave out the streets, so they are not used for the outline. The SFPUC
# updates the map at least once a year — re-run after each update.
#   bash scripts/build-flood-zone.sh
set -euo pipefail
cd "$(dirname "$0")/.."
TMP=$(mktemp -d)
curl -sS -m 300 "https://data.sf.gov/resource/jzu3-4yxp.geojson?\$limit=50000" -o "$TMP/zone.geojson"
npx -y mapshaper@0.6.102 "$TMP/zone.geojson" -clean -simplify 30% keep-shapes \
  -each 'zone="100-Year Storm Flood Risk Zone", source="SFPUC (DataSF jzu3-4yxp)"' -filter-fields zone,source \
  -o precision=0.000001 format=geojson geojson-type=FeatureCollection public/data/sf-flood-risk.geojson
rm -rf "$TMP"
ls -la public/data/sf-flood-risk.geojson
