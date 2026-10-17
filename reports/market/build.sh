#!/usr/bin/env bash
# Rebuild the market briefing (print PDF and web edition) and the site's
# market stats, from one run.
#   bash reports/market/build.sh
# Needs python3, and once per checkout:  npm i --no-save pdf-lib
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p out
# The period end the owner confirmed for this rebuild (AGENTS.md: ask first).
python3 -c "import json; p=json.load(open('../../data/reporting-period.json')); print(f\"Reporting period ends {p['periodEnd']} (confirmed by the owner {p.get('confirmedByOwner','?')})\")"
# The owner's decisions and the period end, applied to the sales file; then
# the site's own stats from that same file, so the site and the report agree.
(cd ../.. && node scripts/apply-sale-decisions.mjs \
  && node --no-warnings scripts/build-landing-stats.mjs \
  && node --no-warnings scripts/build-neighborhood-stats.mjs \
  && node --no-warnings scripts/build-building-sales.mjs)
python3 cover3.py            # the narrative pages  → out/cover3.html
python3 market-grid-v2.py    # the two grids        → out/market-grid-v2.html
python3 review.py            # sales-data review    → out/review.json (flags only; changes no outputs)
python3 renumber.py         # page n / N across both documents
python3 proof.py             # side-by-side proof   → out/sf-briefing-proof.html
python3 web.py               # web edition          → app/market/report/generated/
node pdf.mjs                 # the PDF              → public/reports/sf-market-briefing.pdf
