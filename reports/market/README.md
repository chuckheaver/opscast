# SF Market Briefing

One generator, two outputs: the 9-page Letter-landscape PDF and the web
edition at `/market/report`.

```
npm i --no-save pdf-lib        # once per checkout
bash reports/market/build.sh
```

| Step | File | Output |
|---|---|---|
| Narrative pages | `cover3.py` (uses `cover.py`, `market-grid-v2.py`) | `out/cover3.html` |
| Market grids | `market-grid-v2.py` | `out/market-grid-v2.html` |
| Proof viewer | `proof.py` | `out/sf-briefing-proof.html` |
| Web edition | `web.py` | `app/market/report/generated/` (committed) |
| PDF | `pdf.mjs` | `public/reports/sf-market-briefing.pdf` (committed) |

Sales come from `public/data/sf-listings.geojson`. National figures (rates,
Treasuries, CPI, unemployment, rents) are set at the top of `cover.py` and
`cover3.py` and are updated by hand each month.

`web.py` regroups the pages into the Market menu's three sections and links
every area name to `/fog?preset=homes&hood=…` and every Top 10 sale to a pin
on the map. `AREA_TO_MAP` picks the map neighborhood each report area opens
on; the build fails if one of them is not on the map.
