<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Market report: the monthly data review

Before every rebuild, ask the owner what the reporting period end date
should be, and set it in `data/reporting-period.json` (`periodEnd`, and the
day they confirmed it in `confirmedByOwner`). Never infer it from the data.
No closing after that date goes into any statistic — site, map counts or
report: `scripts/apply-sale-decisions.mjs` holds them out of the sales file
(`data/held-sales.geojson`) until the period moves. `build.sh` applies the
decisions and the period end first, rebuilds the site's stats from the same
file, and stops if the sales file isn't cut to the period end.

Every time the market report is rebuilt (`bash reports/market/build.sh`), read
the output of `reports/market/review.py` (also `reports/market/out/review.csv`)
and show the owner every likely-error and notable finding — duplicates, typos,
big sales, new neighborhood highs, flips, and the records left out (X1) —
before pushing.
The owner's rules:
- Every closed sale counts (BMR units included) and reported square footage
  stands. A sale with no square footage is left out of $/sf figures only.
- A sale under $100K is parking, a rental or an entry error: it is left out.
- A duplicated sale counts once, keeping the Closed record.
- A sale over $25M is probably an entry error: it stays in, but always point
  it out to the owner (E8).
- Listing data isn't reviewed — the report uses sold data (list price only
  feeds the Overbids tables).
- Never drop or edit a sale without the owner's decision. Decisions live in
  `data/sale-decisions.json`; `scripts/apply-sale-decisions.mjs` applies them
  on every data refresh and lists what it took out in `data/removed-sales.csv`
  and what it corrected in `data/edited-sales.csv`. A correction the owner
  asks to footnote carries a `footnote`, printed on the grid pages it touches.
- Before applying a correction, check the record against its neighbors (same
  address, APN, agents, dates): the sale the owner means may be a different
  listing already in the data.
