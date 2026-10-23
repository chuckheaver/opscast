#!/usr/bin/env python3
"""Smooth, labelled Köppen-Geiger picture for /microclimates (informational only).

Reads the two inputs build-koppen-map.py wrote (the 1 km climate-group raster and
the 0.5° class grid) and writes public/data/koppen-bay.png plus
app/lib/koppen-bay.json (the area labels and the classes present). Each class's
0.5° cells are blurred into a smooth surface; a pixel takes the strongest class
among those of its own 1 km group, so coasts and mountain edges follow the 1 km
data and boundaries between classes are smooth curves rather than 55 km squares.
Approximate by construction — the page says so.
"""
import json, os, re
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
KG = json.load(open(os.path.join(ROOT, "app/lib/koppen-ca.json")))
F, G = KG["frame"], KG["grid"]
V = dict(lon0=-124.2, lon1=-117.9, lat0=35.4, lat1=40.2)          # same as the page's old Bay Area view
Z = 3                                                              # output pixels per 1 km pixel

# classes and colours from the page's list
src = open(os.path.join(ROOT, "app/microclimates/koppen-classes.js")).read()
CL = re.findall(r'\["([A-Za-z]{2,3})", "([^"]+)", "(#[0-9A-Fa-f]{6})"\]', src)
codes = [c[0] for c in CL]; hexc = {c[0]: c[2] for c in CL}; names = {c[0]: c[1] for c in CL}

groups = np.array(Image.open(os.path.join(ROOT, "public/data/koppen-ca-groups.png"))).astype(int) // 40
r0, r1 = int((F["lat1"] - V["lat1"]) / F["res"]), int((F["lat1"] - V["lat0"]) / F["res"])
c0, c1 = int((V["lon0"] - F["lon0"]) / F["res"]), int((V["lon1"] - F["lon0"]) / F["res"])
g = groups[r0:r1, c0:c1]
H, W = g.shape
GL = [None, "A", "B", "C", "D", "E"]

# the 0.5° class of each 1 km pixel's cell, as a per-class indicator on the 1 km grid
rows = [r.split(",") for r in G["rows"]]
lat = F["lat1"] - (np.arange(r0, r1) + 0.5) * F["res"]
lon = F["lon0"] + (np.arange(c0, c1) + 0.5) * F["res"]
gi = np.round((G["lat"] - lat) / G["step"]).astype(int)
gj = np.round((lon - G["lon"]) / G["step"]).astype(int)
cell = np.empty((H, W), dtype=object)
for y in range(H):
    for x in range(W):
        try: cell[y, x] = rows[gi[y]][gj[x]]
        except IndexError: cell[y, x] = ""

present = sorted({c for c in np.unique(cell) if c in hexc}, key=codes.index)
S = {}
for c in present:
    ind = (cell == c) & (g == GL.index(c[0]) if False else True)
    ind = (cell == c).astype(float)
    # keep only cells whose 1 km group agrees (the 0.5° cell is an average over mixed terrain elsewhere)
    ind *= (g == "ABCDE".index(c[0]) + 1)
    S[c] = ndi.gaussian_filter(ind, 30) + 0.02 * ndi.gaussian_filter(ind, 90)

# upsample scores and the group mask, smooth the mask so coasts are curves
def up(a, order=1): return ndi.zoom(a, Z, order=order)
gz = np.zeros((H * Z, W * Z), dtype=np.int16)
msk = {k: ndi.gaussian_filter(up((g == k).astype(float), 0), Z * 0.9) for k in range(1, 6)}
stack = np.stack([msk[k] for k in range(1, 6)])
land = stack.max(0) > 0.0
gz = stack.argmax(0) + 1
water = np.zeros_like(gz, dtype=bool)
wz = ndi.gaussian_filter(up((g == 0).astype(float), 0), Z * 0.9)
water = wz > np.maximum(stack.max(0), 0.5) - 0.0
water = wz > 0.5

lab = np.full(gz.shape, -1, dtype=int)
best = np.full(gz.shape, -1.0)
for c in present:
    s = up(S[c])
    ok = (gz == "ABCDE".index(c[0]) + 1) & ~water
    sel = ok & (s > best)
    lab[sel] = codes.index(c); best[sel] = s[sel]
# any land pixel left (no class of its group nearby): take the nearest labelled pixel of the same group
for k in range(1, 6):
    m = (gz == k) & ~water; have = m & (lab >= 0)
    if have.any() and (m & ~have).any():
        d, (iy, ix) = ndi.distance_transform_edt(~have, return_indices=True)
        miss = m & ~have; lab[miss] = lab[iy[miss], ix[miss]]
# tidy specks
lab = np.where(water, -1, lab)

WATER = (188, 211, 225)
img = np.zeros(lab.shape + (3,), dtype=np.uint8); img[:] = WATER
for i, c in enumerate(codes):
    h = hexc[c]; img[lab == i] = [int(h[j:j + 2], 16) for j in (1, 3, 5)]
Image.fromarray(img).save(os.path.join(ROOT, "public/data/koppen-bay.png"), optimize=True)

# one label per sizeable area: the point deepest inside each large patch of a class
labels = []
Hz, Wz = lab.shape
for i, c in enumerate(codes):
    m = lab == i
    if not m.any(): continue
    cc, n = ndi.label(m)
    sizes = ndi.sum(m, cc, range(1, n + 1))
    dist = ndi.distance_transform_edt(m)
    for k in np.argsort(sizes)[::-1][:3]:
        if sizes[k] < 0.012 * Hz * Wz * 0.6: continue
        mk = cc == k + 1
        y, x = np.unravel_index(np.argmax(np.where(mk, dist, 0)), dist.shape)
        if dist[y, x] < 28 or not (4 < 100 * x / Wz < 96 and 5 < 100 * y / Hz < 95): continue
        labels.append(dict(code=c, name=names[c], color=hexc[c], x=round(100 * x / Wz, 2), y=round(100 * y / Hz, 2), area=int(sizes[k])))
# every class in the key gets at least one label: its deepest point inside the picture's margins
yy, xx = np.mgrid[0:Hz, 0:Wz]
inner = (xx > 0.06 * Wz) & (xx < 0.94 * Wz) & (yy > 0.05 * Hz) & (yy < 0.95 * Hz)
for i, c in enumerate(codes):
    if c not in present or any(l["code"] == c for l in labels): continue
    m = lab == i
    if (m & inner).sum() < 0.004 * Hz * Wz: continue
    d = ndi.distance_transform_edt(m)
    y, x = np.unravel_index(np.argmax(np.where(inner, d, 0)), d.shape)
    labels.append(dict(code=c, name=names[c], color=hexc[c], x=round(100 * x / Wz, 2), y=round(100 * y / Hz, 2), area=int(m.sum())))
shares = {c: float((lab == codes.index(c)).sum()) for c in present}
tot = sum(shares.values())
out = dict(w=Wz, h=Hz, view=V, labels=labels,
           classes=[dict(code=c, name=names[c], color=hexc[c], pct=round(100 * shares[c] / tot, 1)) for c in sorted(present, key=lambda c: -shares[c]) if shares[c] / tot > 0.004])
json.dump(out, open(os.path.join(ROOT, "app/lib/koppen-bay.json"), "w"), ensure_ascii=False, separators=(",", ":"))
print(Wz, Hz, [(l["code"], l["x"], l["y"]) for l in labels]); print([(c["code"], c["pct"]) for c in out["classes"]])
