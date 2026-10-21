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
- Every data load is TWO files: the Residential export (…_RESI_….csv:
  condos, single-family, TICs, co-ops…) and the Residential Income export
  (…_INCP_….csv: duplexes, triplexes, fourplexes, 5+ unit buildings, other
  income). The MLS can't put both in one feed, so always ask the owner for
  both, and don't rebuild with only one (`scripts/geocode-listings.mjs`
  prints the property types and warns when there is no Residential Income).
  The report and the site use the same three categories (owner, Oct 21
  2026): (1) SFH, (2) Condo/TIC/Co-op, (3) Other (all Residential Income,
  5+ units included, and the other types). Never "Condo/TIC/Other". The
  site's list is `app/lib/segments.js` (pages, map dots, pop-ups and the
  stats scripts all read it); the report's is `SEG` in
  `reports/market/market-grid-v2.py`, which stops on a type in no category —
  a new MLS type goes in both, in the same category.
- A sale under $100K is parking, a rental or an entry error: it is left out.
- A duplicated sale counts once, keeping the Closed record.
- A sale over $25M is probably an entry error: it stays in, but always point
  it out to the owner (E8).
- Bedrooms, bathrooms and unit details decide nothing. The property type as
  recorded sets a sale's segment; question a type only when records of the
  same property disagree (same address, building or parcel typed differently).
  Otherwise review the numbers: prices, $/sf, dates, duplicates, sale vs list.
- Stats pages (the report's pages and the site's market pages) state the
  stats and nothing else: no summary comments, takeaways, leads or
  explanatory lines under headings. Anything a reader must know (periods
  compared, definitions, what is left out) goes in the footnotes at the
  bottom of the page.
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
- A sale's property type follows the city. Check the land-use layer (units
  on the parcel, `public/tiles/parcels`) and the zoning (`public/data/
  sf-zoning.geojson`): RH-1 is a single-family house even when it has two
  addresses; RH-2 is Residential Income, two-family. When two records of a
  sale disagree, use the city's type; if that still leaves a question, ask
  the owner.
