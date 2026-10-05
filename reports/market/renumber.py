#!/usr/bin/env python3
"""Number every page "page n / N" in print order (cover3 pages, then the grid
document), so adding or splitting pages never leaves stale numbers."""
import pathlib, re
OUT = pathlib.Path(__file__).resolve().parent / "out"
docs = [OUT / "cover3.html", OUT / "market-grid-v2.html"]
texts = [d.read_text() for d in docs]
RX = re.compile(r"page \d+ / \d+")
total = sum(len(RX.findall(t)) for t in texts)
n = 0
def sub(m):
    global n
    n += 1
    return f"page {n} / {total}"
for d, t in zip(docs, texts):
    d.write_text(RX.sub(sub, t))
print(f"numbered {total} pages")
