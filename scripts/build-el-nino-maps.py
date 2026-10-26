#!/usr/bin/env python3
"""Strong El Niño winters, rain and snow as percent of average, for /microclimates/el-nino.

Redraws NOAA NCEI's "Strong El Niño Precipitation Percent of Average, West Climate
Region, December–May" panels (data: nClimGrid Monthly; average period 1991–2020)
in the site's colours. Input: the two NCEI figure images, saved as
data/raw/ncei-strong-el-nino-precip-1.webp (1957–58 … 1972–73) and
data/raw/ncei-strong-el-nino-precip-2.webp (1982–83 … 2015–16 and the composite).
Each pixel's colour is matched to the figure's 11 colour bins; the bins are
NOAA's, only the colours change. Writes public/data/el-nino/precip-*.png and
app/microclimates/el-nino/history-maps.json (each winter's bin at the Bay Area).

    python3 scripts/build-el-nino-maps.py
"""
import json, os
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
RAW = os.path.join(ROOT, "data", "raw")
# NCEI's colour bar, driest to wettest
PAL = np.array([(84, 48, 1), (151, 96, 28), (173, 125, 66), (194, 157, 101), (214, 187, 141), (240, 240, 240),
                (140, 194, 187), (100, 168, 161), (61, 142, 133), (21, 115, 108), (0, 62, 48)])
BINS = ["under 5%", "5–10%", "10–25%", "25–50%", "50–75%", "75–125%", "125–150%", "150–175%", "175–200%", "200–250%", "over 250%"]
# the site's colours: gold for dry, navy for wet, the near-average bin a warm white
OURS = ["#5A3608", "#7D5214", "#A8741A", "#C99A4E", "#E8D0A0", "#F4F2EE", "#B5CCDD", "#86A8C6", "#5A80A6", "#33587F", "#1A3352"]
PANELS = [("1", 267, 1040, 46, 523, "1957–58"), ("1", 267, 1040, 531, 1008, "1963–64"), ("1", 267, 1040, 1016, 1494, "1965–66"),
          ("1", 267, 1040, 1501, 1979, "1972–73"), ("2", 9, 780, 30, 507, "1982–83"), ("2", 9, 780, 514, 991, "1986–87"),
          ("2", 9, 780, 999, 1475, "1991–92"), ("2", 9, 780, 1483, 1961, "1997–98"), ("2", 788, 1559, 30, 507, "2002–03"),
          ("2", 788, 1559, 514, 991, "2009–10"), ("2", 788, 1559, 999, 1475, "2015–16"), ("2", 788, 1559, 1483, 1961, "Composite")]
W, H = 474, 680                       # common panel size (the map's bounding box)
SF, TAHOE = (56, 292), (186, 258)     # pixel positions in that box
BAY = (66, 306)                       # where the Bay Area's bin is read (the Peninsula, clear of the outline)

rgb = np.array([[int(h[i:i + 2], 16) for i in (1, 3, 5)] for h in OURS])
out, src = [], {}
for f, y0, y1, x0, x1, name in PANELS:
    if f not in src:
        src[f] = np.array(Image.open(os.path.join(RAW, f"ncei-strong-el-nino-precip-{f}.webp")).convert("RGB")).astype(int)
    a = src[f][y0:y1, x0:x1]
    d = ((a[:, :, None, :] - PAL[None, None]) ** 2).sum(-1)
    cls, ok, black = d.argmin(-1), d.min(-1) < 900, a.sum(-1) < 150
    land = ok | black
    land[:90] = False                                   # the panel's title
    lab, _ = ndi.label(ndi.binary_closing(land, iterations=2))
    big = ndi.binary_fill_holes(lab == np.bincount(lab.ravel())[1:].argmax() + 1)
    have = big & ok & ~black
    _, (iy, ix) = ndi.distance_transform_edt(~have, return_indices=True)
    full = ndi.median_filter(cls[iy, ix], size=3)
    ys, xs = np.where(big)
    sl = (slice(ys.min(), ys.min() + H), slice(xs.min(), xs.min() + W))
    c, m, ln = full[sl], big[sl], (black & big)[sl]
    im = np.zeros(c.shape + (4,), np.uint8)
    im[..., :3] = rgb[c]
    im[..., 3] = np.where(m, 255, 0)
    im[ln] = [32, 60, 95, 255]                          # coast and state line, site navy
    slug = "composite" if name == "Composite" else name[:4]
    Image.fromarray(im).resize((W * 2 // 3, H * 2 // 3), Image.LANCZOS).quantize(64, method=Image.Quantize.FASTOCTREE).save(os.path.join(ROOT, "public", "data", "el-nino", f"precip-{slug}.png"), optimize=True)
    win = c[BAY[1] - 6:BAY[1] + 7, BAY[0] - 6:BAY[0] + 7][m[BAY[1] - 6:BAY[1] + 7, BAY[0] - 6:BAY[0] + 7]]
    bay = int(np.bincount(win).argmax())
    out.append(dict(name=name, src=f"/data/el-nino/precip-{slug}.png", bay=bay))
    print(name, "Bay Area:", BINS[bay])

json.dump(dict(w=W, h=H, sf=SF, tahoe=TAHOE, bins=BINS, colors=OURS, maps=out,
               source="NOAA NCEI, Strong El Niño Precipitation Percent of Average, West Climate Region, December–May; nClimGrid Monthly; average 1991–2020"),
          open(os.path.join(ROOT, "app", "microclimates", "el-nino", "history-maps.json"), "w"), ensure_ascii=False, indent=1)
