"""Spatial diagnostic for STEP 2 bleed attribution — not part of the
reviewer-specified method itself (STEP 1/2 counts and merge pass are
produced by sample_mark_colours.py unmodified). This script only reports
WHERE each merged group's pixels sit in the crop, to support the bleed/mark
attribution reasoning required by STEP 2. No thresholds are changed.
"""
from collections import Counter
from PIL import Image

COVER = "docs/research/assets/mark-2025-cover.jpg"


def dist(a, b):
    return ((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2) ** 0.5


def main():
    img = Image.open(COVER).convert("RGB")
    box = (792, 322, 950, 505)
    crop = img.crop(box)
    w, h = crop.size
    px = crop.load()

    white = (255, 255, 255)
    is_bg = [[False] * w for _ in range(h)]
    for y in range(h):
        for x in range(w):
            if dist(px[x, y], white) <= 30:
                is_bg[y][x] = True

    is_fringe = [[False] * w for _ in range(h)]
    for y in range(h):
        for x in range(w):
            if is_bg[y][x]:
                continue
            neighbours = []
            if y > 0:
                neighbours.append((x, y - 1))
            if y < h - 1:
                neighbours.append((x, y + 1))
            if x > 0:
                neighbours.append((x - 1, y))
            if x < w - 1:
                neighbours.append((x + 1, y))
            if any(is_bg[ny][nx] for nx, ny in neighbours):
                is_fringe[y][x] = True

    survivors = []  # (rgb, x, y)
    for y in range(h):
        for x in range(w):
            if not is_bg[y][x] and not is_fringe[y][x]:
                survivors.append((px[x, y], x, y))

    freq = Counter(rgb for rgb, x, y in survivors)
    ordered = freq.most_common()
    seeds = []  # [seed_rgb, count, [(x,y), ...]]
    for rgb, cnt in ordered:
        placed = False
        for seed in seeds:
            if dist(rgb, seed[0]) <= 20:
                placed = True
                seed[1] += cnt
                seed[2].append(rgb)
                break
        if not placed:
            seeds.append([rgb, cnt, [rgb]])

    # Now assign every survivor pixel to its seed for spatial stats.
    seed_of = {}
    for seed in seeds:
        for rgb in seed[2]:
            seed_of[rgb] = seed[0]

    coords_by_seed = {}
    for rgb, x, y in survivors:
        s = seed_of[rgb]
        coords_by_seed.setdefault(s, []).append((x, y))

    surv_count = len(survivors)
    seeds_sorted = sorted(seeds, key=lambda s: s[1], reverse=True)
    print(f"crop size {w}x{h}, survivors={surv_count}")
    for seed in seeds_sorted:
        pct = 100.0 * seed[1] / surv_count
        if pct < 1.0:
            continue
        coords = coords_by_seed[seed[0]]
        xs = [c[0] for c in coords]
        ys = [c[1] for c in coords]
        n = len(coords)
        # fraction near top edge (y < 25) and near left/right corners (x<40 or x>w-40) simultaneously with y<40
        top_edge = sum(1 for (x, y) in coords if y < 25)
        corner_zone = sum(1 for (x, y) in coords if y < 40 and (x < 40 or x > w - 40))
        r, g, b = seed[0]
        hexv = f"#{r:02X}{g:02X}{b:02X}"
        print(f"{hexv} n={n} pct={pct:.2f}% x[{min(xs)}-{max(xs)}] y[{min(ys)}-{max(ys)}] "
              f"meanxy=({sum(xs)/n:.0f},{sum(ys)/n:.0f}) top_edge(y<25)={top_edge} "
              f"corner_zone(y<40,x<40|x>{w-40})={corner_zone}")


if __name__ == "__main__":
    main()
