# SF Market Briefing

One generator, two outputs: the 11-page Letter-landscape PDF and the web
edition at `/market/report`.

```
npm i --no-save pdf-lib        # once per checkout
bash reports/market/build.sh
```

| Step | File | Output |
|---|---|---|
| Narrative pages | `cover3.py` (uses `cover.py`, `market-grid-v2.py`) | `out/cover3.html` |
| Market grids | `market-grid-v2.py` | `out/market-grid-v2.html` |
| Sales-data review (flags only; changes no outputs) | `review.py` | `out/review.json`, `out/review.csv`, `out/outliers.csv` |
| Proof viewer | `proof.py` | `out/sf-briefing-proof.html` |
| Web edition | `web.py` | `app/market/report/generated/` (committed) |
| PDF | `pdf.mjs` | `public/reports/sf-market-briefing.pdf` (committed) |

The report runs through the reporting period end the owner confirms before
each rebuild, `data/reporting-period.json` (`STATS_THROUGH` overrides it).
Sales come from `public/data/sf-listings.geojson`, after the owner's
standing decisions (`data/sale-decisions.json`: sales under $100K, second
copies of a duplicated sale, and corrections to a record) and the period end
are applied by `scripts/apply-sale-decisions.mjs` on every data refresh;
closings after the period end wait in `data/held-sales.geojson`. `review.py`
lists the records left out (X1) and corrected (X2), the closings held (E6),
and points out every sale over $25M (E8) each month. National figures (rates,
Treasuries, CPI, unemployment, rents) are set at the top of `cover.py` and
`cover3.py` and are updated by hand each month.

`web.py` regroups the pages into the Market menu's three sections and links
every area name to `/fog?preset=homes&hood=…` and every Top 10 sale to a pin
on the map. `AREA_TO_MAP` picks the map neighborhood each report area opens
on; the build fails if one of them is not on the map.
