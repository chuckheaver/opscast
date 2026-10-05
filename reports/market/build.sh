#!/usr/bin/env bash
# Rebuild the market briefing: print PDF and the web edition, from one run.
#   bash reports/market/build.sh
# Needs python3, and once per checkout:  npm i --no-save pdf-lib
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p out
python3 cover3.py            # the narrative pages  → out/cover3.html
python3 market-grid-v2.py    # the two grids        → out/market-grid-v2.html
python3 renumber.py         # page n / N across both documents
python3 proof.py             # side-by-side proof   → out/sf-briefing-proof.html
python3 web.py               # web edition          → app/market/report/generated/
node pdf.mjs                 # the PDF              → public/reports/sf-market-briefing.pdf
