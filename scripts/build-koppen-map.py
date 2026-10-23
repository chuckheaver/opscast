#!/usr/bin/env python3
"""Köppen-Geiger climate map data for /microclimates (California and the Bay Area).

Two published datasets, each at its own resolution, and the page says so:

  • Climate GROUPS (the first letter: tropical, arid, temperate, cold, polar) at
    1 km — Beck et al. 2018, "Present and future Köppen-Geiger climate
    classification maps at 1-km resolution", Scientific Data 5:180214, from the
    `KG_simplified_uint8.tif` that ships in the `koppengeiger` PyPI package
    (values 0 water, 1 A, 2 B, 3 C, 4 D, 5 E).
  • The full CLASS (all letters, e.g. Csb) on a 0.5° grid (about 55 km cells) —
    the Köppen-Geiger grid in the `koppen-climate-lookup` npm package.

How to refetch the inputs (the registries are the only hosts reachable from the
build sandbox), then run this script:

    pip download koppengeiger==1.1.0 --no-deps && unzip -o koppengeiger-*.whl
    npm pack koppen-climate-lookup && tar xzf koppen-climate-lookup-*.tgz
    python3 scripts/build-koppen-map.py koppengeiger/KG_simplified_uint8.tif package/dist/index.mjs

Writes public/data/koppen-ca-groups.png (the groups raster, one value per 1 km
pixel, value = group × 40 in a grey PNG so a canvas can read it back exactly)
and app/lib/koppen-ca.json (the 0.5° grid and the frame). If the full 1 km
30-class Beck raster is ever dropped into data/raw/, the classes can be read at
1 km instead of 0.5° (the page's component reads either).
"""
import json, os, re, sys
import numpy as np
import tifffile
from PIL import Image

ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
TIF, JS = sys.argv[1], sys.argv[2]
RES = 1 / 120                                    # 0.008333° ≈ 1 km
# California with a margin: the state view; the Bay Area view is a crop of it.
LON0, LON1, LAT0, LAT1 = -124.6, -114.0, 32.4, 42.1


def main():
    a = tifffile.imread(TIF)
    r0, r1 = int((90 - LAT1) / RES), int((90 - LAT0) / RES)
    c0, c1 = int((LON0 + 180) / RES), int((LON1 + 180) / RES)
    sub = a[r0:r1, c0:c1]
    print("groups raster", sub.shape, np.bincount(sub.ravel(), minlength=6).tolist())
    Image.fromarray((sub * 40).astype(np.uint8), "L").save(os.path.join(ROOT, "public", "data", "koppen-ca-groups.png"), optimize=True)

    s = open(JS).read()
    csv = re.search(r'var koppen_default = "(.*?)";\n', s, re.S).group(1).encode().decode("unicode_escape")
    g = {}
    for line in csv.strip().split("\n")[1:]:
        la, lo, c = line.split(","); g[(float(la), float(lo))] = c
    las = [la for la in sorted({k[0] for k in g}, reverse=True) if LAT0 - 0.5 <= la <= LAT1 + 0.5]
    los = [lo for lo in sorted({k[1] for k in g}) if LON0 - 0.5 <= lo <= LON1 + 0.5]
    rows = [",".join(g.get((la, lo), "") for lo in los) for la in las]
    out = dict(
        frame=dict(lon0=LON0, lon1=LON1, lat0=LAT0, lat1=LAT1, w=int(sub.shape[1]), h=int(sub.shape[0]), res=RES),
        grid=dict(lat=las[0], lon=los[0], step=0.5, rows=rows),
        source=dict(groups="Beck et al. 2018, 1 km (Scientific Data 5:180214)", classes="Köppen-Geiger 0.5° grid"),
    )
    json.dump(out, open(os.path.join(ROOT, "app", "lib", "koppen-ca.json"), "w"), separators=(",", ":"))
    print("grid", len(las), "x", len(los), "cells;", os.path.getsize(os.path.join(ROOT, "app", "lib", "koppen-ca.json")) // 1024, "KB;",
          "png", os.path.getsize(os.path.join(ROOT, "public", "data", "koppen-ca-groups.png")) // 1024, "KB")


if __name__ == "__main__":
    main()
