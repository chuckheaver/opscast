<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Market report: the monthly data review

Always build from the latest data load, and report only full calendar
months: the period end is the last day of the last FULL month in that load.
A month the load is still in (e.g. the early-October closings of an Oct 1
load) is never reported until a later load completes it. Before every
rebuild, tell the owner that date and have them confirm it, then set it in
`data/reporting-period.json` (`periodEnd`, and the day they confirmed it in
`confirmedByOwner`); `scripts/apply-sale-decisions.mjs` stops if it falls
inside an unfinished month. The monthly report and the site's Market Update
PDF are always the whole city.
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
- The current year runs Jan 1 through the period end the owner gives. A
  comparison with last year uses the same stretch of last year (YTD vs YTD
  through the same date, the month vs the same month). Where last year is
  shown as a year — its totals, its monthly or weekly activity — show all of
  it, labeled as the full year. The 10s is the current year only ("The 10s of
  2026"), with no prior-year columns.
- Every closed sale counts (BMR units included) and reported square footage
  stands. A sale with no square footage is left out of $/sf figures only.
- Every data load includes "Residential Income" properties (2-4 unit
  buildings), and they count with Condo/TIC/Other. The owner's MLS export
  leaves that class out unless it is selected: when a new load arrives,
  check it has Residential Income sales (`scripts/geocode-listings.mjs`
  prints the property types and warns when there are none) and, if not,
  remind the owner to add Residential Income to the export before
  rebuilding. When Residential Income types first appear, add their exact
  names to the Condo/TIC/Other segment everywhere a segment is decided:
  `SEG` in `reports/market/market-grid-v2.py` (the report stops on a type
  in no segment), the condo test in `scripts/build-neighborhood-stats.mjs`
  and `scripts/build-landing-stats.mjs`, `collectFor` in
  `app/fog/NeighborhoodModal.jsx` and `SEG_TYPES` in `app/fog/FogApp.jsx`
  (the map's dot colours already treat any type that isn't single-family
  as Condo/TIC/Other).
- A sale under $100K is parking, a rental or an entry error: it is left out.
- A duplicated sale counts once, keeping the Closed record.
- A sale over $25M is probably an entry error: it stays in, but always point
  it out to the owner (E8).
- Bedrooms, bathrooms and unit details decide nothing. The property type as
  recorded sets a sale's segment; question a type only when records of the
  same property disagree (same address, building or parcel typed differently).
  Otherwise review the numbers: prices, $/sf, dates, duplicates, sale vs list.
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

# Neighborhood guides: the owner's rules

Each neighborhood page (`app/fog/lib/neighborhoods.js`) carries a history,
"Did You Know?" facts and a walking tour through them (numbered stops in
walking order, each with `place`, `where` and `at`).
- Every claim is confirmed by a source; what can't be confirmed is left out.
- Fair housing: describe places, history, architecture and streets. Never
  say who lives there now or whom a neighborhood suits, and make no claims
  about crime, safety or schools. Historical settlement is fine.
- Keep sourced historical facts a buyer should know, as written, even when
  they are hard ones: environmental history (the Hunters Point shipyard's
  radiological lab and its 1989 Superfund listing), redevelopment and
  displacement, deed covenants, notable incidents. It is important for
  people to know the facts when buying property.
- Every tour passes along the neighborhood's shopping street, if it has one,
  as a numbered stop described without naming any business.
- No store, restaurant, café or bar is named in a tour unless the business
  or its building is a designated landmark (city, California, or National
  Register).
- No labels that classify people: never "working class", "middle class",
  "class", "blue collar", "white collar", and no phrases that sort a group,
  family, sex or race ("Irish families", "wealthy families", "young
  professionals", "family-friendly"). History and facts stay accurate:
  say what happened and who it happened to (the Japanese American
  incarceration, the Chinese Exclusion Act, wartime migration, the Compton's
  Cafeteria uprising) without attaching labels to residents or households.
  Describe what people did or built ("dockworkers' cottages", "built for
  Union Iron Works employees"), not what class they were.
- Write with 2026 in mind: these communities are changing with an influx of
  new money and there is real tension between people who have lived here
  for decades and newcomers. Don't celebrate change or the new money
  ("renaissance", "revitalized", "up-and-coming", "transformed", "buzzing",
  "hip", "gritty", "the whole city comes here"); describe change neutrally
  and factually, and give longtime residents, institutions and traditions
  their due.

# Publishing

Content edits — neighborhood text, walking tours, wording, copy — are
committed and pushed to main as they are done; the owner doesn't approve
each one. Major structural changes to the code wait for the owner's
approval before they are pushed. A data load is never pushed to the live
site until the owner has reviewed it: give them the exception report (the
review's findings, every anomaly and every inconsistency with earlier loads
and fields) and wait for their go-ahead.
