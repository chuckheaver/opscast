<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Market report: the monthly data review

Every time the market report is rebuilt (`bash reports/market/build.sh`), read
the output of `reports/market/review.py` (also `reports/market/out/review.csv`)
and show the owner every likely-error and notable finding — duplicates, typos,
odd list prices, big sales, new neighborhood highs, flips — before pushing.
The owner's rules: every closed sale counts (BMR units included), reported
square footage stands, and the only exclusion is a sale with no square footage
from $/sf figures. Never drop or edit a sale without the owner's decision.
