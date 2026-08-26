"""P02-X02 — sample the flask mark. No network access. Reads two committed
binaries and performs the exact pixel-accounting and merge-pass method
specified in the task fence. Prints results for manual transcription into
docs/research/15-mark-colour-sampling.md.
"""
import sys
from collections import Counter
from PIL import Image

FAVICON = "docs/research/assets/mark-2018-favicon.png"
COVER = "docs/research/assets/mark-2025-cover.jpg"


def dist(a, b):
    return ((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2) ** 0.5


def load_pixels(path, box=None):
    img = Image.open(path).convert("RGB")
    if box is not None:
        img = img.crop(box)
    w, h = img.size
    px = img.load()
    grid = [[px[x, y] for x in range(w)] for y in range(h)]
    return grid, w, h


def sample(grid, w, h, bg_dist_threshold, label):
    total = w * h
    white = (255, 255, 255)

    is_bg = [[False] * w for _ in range(h)]
    bg_count = 0
    for y in range(h):
        for x in range(w):
            if dist(grid[y][x], white) <= bg_dist_threshold:
                is_bg[y][x] = True
                bg_count += 1

    is_fringe = [[False] * w for _ in range(h)]
    fringe_count = 0
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
                fringe_count += 1

    survivors = []
    for y in range(h):
        for x in range(w):
            if not is_bg[y][x] and not is_fringe[y][x]:
                survivors.append(grid[y][x])

    surv_count = len(survivors)

    print(f"=== {label} ===")
    print(f"total={total}")
    print(f"background_excluded={bg_count}")
    print(f"fringe_excluded={fringe_count}")
    print(f"surviving={surv_count}")
    print(f"sum_check={bg_count + fringe_count + surv_count} (expect {total})")

    freq = Counter(survivors)
    distinct = len(freq)
    print(f"distinct_rgb_among_survivors={distinct}")

    # Merge pass, radius 20, walking survivors in descending frequency.
    ordered = freq.most_common()  # list of (rgb, count), descending by count
    seeds = []  # list of [seed_rgb, total_count, members:list of (rgb,count)]
    for rgb, cnt in ordered:
        placed = False
        for seed in seeds:
            if dist(rgb, seed[0]) <= 20:
                seed[1] += cnt
                seed[2].append((rgb, cnt))
                placed = True
                break
        if not placed:
            seeds.append([rgb, cnt, [(rgb, cnt)]])

    print(f"merged_group_count={len(seeds)}")
    print("groups_>=1pct (hex, pixel_count, percentage, seed_rgb):")
    seeds_sorted = sorted(seeds, key=lambda s: s[1], reverse=True)
    for seed in seeds_sorted:
        pct = 100.0 * seed[1] / surv_count
        if pct >= 1.0:
            r, g, b = seed[0]
            hexv = f"#{r:02X}{g:02X}{b:02X}"
            print(f"  {hexv}  seed_rgb={seed[0]}  count={seed[1]}  pct={pct:.4f}%")

    return {
        "total": total,
        "bg": bg_count,
        "fringe": fringe_count,
        "surv": surv_count,
        "distinct": distinct,
        "seeds_sorted": seeds_sorted,
        "surv_count": surv_count,
    }


def main():
    grid, w, h = load_pixels(FAVICON)
    assert w * h == 19460, f"favicon pixel count mismatch: {w}x{h}={w*h}"
    r1 = sample(grid, w, h, 12, "STEP 1 — favicon (bg dist 12)")

    print()
    box = (792, 322, 950, 505)  # left, top, right, bottom (PIL crop is exclusive on right/bottom)
    grid2, w2, h2 = load_pixels(COVER, box=box)
    print(f"cover crop size: {w2} x {h2} = {w2*h2} pixels")
    r2 = sample(grid2, w2, h2, 30, "STEP 2 — cover crop (bg dist 30)")

    print()
    print("=== STEP 3 — comparison ===")
    for seed in r1["seeds_sorted"]:
        pct = 100.0 * seed[1] / r1["surv_count"]
        if pct < 1.0:
            continue
        r, g, b = seed[0]
        hexv = f"#{r:02X}{g:02X}{b:02X}"
        best = None
        best_d = None
        for seed2 in r2["seeds_sorted"]:
            d = dist(seed[0], seed2[0])
            if best_d is None or d < best_d:
                best_d = d
                best = seed2
        r2v, g2v, b2v = best[0]
        hex2 = f"#{r2v:02X}{g2v:02X}{b2v:02X}"
        within = best_d <= 20
        print(f"  favicon {hexv} ({pct:.2f}%) -> nearest cover group {hex2} dist={best_d:.2f} within20={within}")


if __name__ == "__main__":
    main()
