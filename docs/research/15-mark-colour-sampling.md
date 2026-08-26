> Extraction evidence only (PR-09). Never current truth, never a parity target.

# P02-X02 — sample the flask mark

No network request was made to produce this document. Both sources are committed
binaries already preserved at P02-X02-F (`b1be2c2`). This report samples pixels from
those files on disk.

Interpreter invoked in explicit UTF-8 mode throughout (`python -X utf8 …`), per this
environment's non-UTF-8 default codepage and the repo's Arabic content.

---

## Source records

| File | SHA-256 | PROVENANCE entry |
|---|---|---|
| `docs/research/assets/mark-2018-favicon.png` | `ccc1513db479b2b90cd02a7dde6890fd98d07bb8b92ebc2a3f4621cde98d9320` | 139 × 140, PNG, 8-bit, colorType=2, no alpha. Byte size 9621. Source URL `http://nileegyptlabs.com/images/favicon.ico`, fetched 2026-08-26T21:59:59Z. |
| `docs/research/assets/mark-2025-cover.jpg` | `9d242d2a3555c12ee34e16b23fc0fcce5018ca062ef5b5549847a8352686373d` | 960 × 541, JPEG SOF2, 8-bit, 3 components, no alpha. Byte size 66532. Source URL is the Facebook CDN cover image, fetched 2026-08-26T22:05:30Z. |

Recomputed via `Get-FileHash -Algorithm SHA256` against `docs/research/assets/PROVENANCE.md`.
Both match. No mismatch, no HALT.

---

## Method as run

Every threshold below is reviewer-supplied in the task fence and was applied exactly
as given — not tuned, not substituted for k-means or any other clustering.

1. Load the source as RGB.
2. **Background** = any pixel within Euclidean RGB distance of pure white
   (255, 255, 255). Threshold **12** for the favicon, **30** for the cover (the
   cover's white panel is JPEG-rendered and does not sit at pure 255). Excluded.
3. **Fringe** = any surviving (non-background) pixel whose 4-neighbour set (up,
   down, left, right; edge pixels have fewer neighbours) contains a background
   pixel. Excluded. This removes anti-aliasing without touching interior fills.
4. **Merge pass, radius 20.** Survivors are walked in descending frequency of their
   exact RGB value. Each value is assigned to the first existing seed within
   Euclidean RGB distance 20 of that value; if none exists, the value becomes a new
   seed. Seed identity is fixed at creation — a later value merges into a seed only
   if it is itself within 20 of that seed's original RGB, not of any value already
   merged into it.

Reproduction script: `scripts/sample_mark_colours.py`, run as
`python -X utf8 scripts/sample_mark_colours.py`. It implements only the four steps
above, against the two committed files, with no network access.

A second, non-mandated diagnostic (`scripts/analyze_cover_groups.py`) is used only in
STEP 2's bleed-attribution reasoning below: for each merged group in the cover crop it
records where that group's pixels sit — how many fall in the top 25 rows of the crop,
and how many fall in a top-left/top-right 40×40 corner zone — to distinguish banner
background caught by the fixed box from the flask shape's own rendering. It changes no
threshold and produces no pixel count used in the accounting above.

---

## STEP 1 — favicon (colour source of record)

Lossless PNG, 139 × 140, flat fills, no photographic content. Background distance 12.

**Pixel accounting**

| Total | Background excluded | Fringe excluded | Surviving | Sum |
|---|---|---|---|---|
| 19460 | 13931 | 1097 | 4432 | 19460 |

19460 = 139 × 140. The four figures sum to 19460, confirmed.

**Distinct RGB values among survivors: 1010.** A flat mark rasterised at 139×140
still spreads across roughly a thousand distinct values (anti-aliasing interior to the
shape, dithering-scale variation within nominally flat fills), consistent with the
"roughly a thousand" expectation stated in the task fence.

**Merged groups: 38** (merge radius 20, descending frequency). Groups holding ≥1% of
survivors (4432), descending:

| Hex | Seed RGB | Pixel count | % of survivors |
|---|---|---|---|
| `#2E3192` | (46, 49, 146) | 2626 | 59.25% |
| `#181D8C` | (24, 29, 140) | 377 | 8.51% |
| `#F7A8A7` | (247, 168, 167) | 347 | 7.83% |
| `#FBD4C8` | (251, 212, 200) | 310 | 6.99% |
| `#F8BDB1` | (248, 189, 177) | 140 | 3.16% |
| `#000588` | (0, 5, 136) | 118 | 2.66% |
| `#5F61A7` | (95, 97, 167) | 67 | 1.51% |
| `#FDE2D8` | (253, 226, 216) | 65 | 1.47% |

These eight groups total 91.38% of survivors; the remaining 30 groups (38 total) share
the long tail below 1% each.

Two colour families are visible even at this stage: a dark indigo/blue family
(`#2E3192`, `#181D8C`, `#000588` — 70.42% combined) and a pink/salmon family
(`#F7A8A7`, `#FBD4C8`, `#F8BDB1`, `#FDE2D8` — 19.45% combined), with `#5F61A7`
(1.51%) reading as a blend between the two.

---

## STEP 2 — cover (corroboration only)

Bounding box, fixed, in original 960 × 541 coordinates: **(792, 322) to (950, 505)**,
left/top inclusive, right/bottom exclusive — 158 × 183 = 28914 pixels. This box was
not chosen by the builder; it is stated verbatim in the task fence. Background
distance 30, merge radius 20 (unchanged from STEP 1).

**Pixel accounting**

| Total | Background excluded | Fringe excluded | Surviving | Sum |
|---|---|---|---|---|
| 28914 | 902 | 319 | 27693 | 28914 |

**Distinct RGB values among survivors: 15395.** A subsampled JPEG crop of this size
spreads far more than the favicon's flat fills — expected, and itself evidence for the
fidelity ruling in STEP 3.

**Merged groups: 137.** Groups holding ≥1% of survivors (27693), descending, with a
bleed/mark attribution:

**This box catches photographic bleed, stated plainly.** The 158×183 rectangle is a
fixed axis-aligned box; the flask badge inside it is not axis-aligned to that box's
corners. The badge sits inside a larger banner composition — a light cyan-to-white
gradient background, a white diagonal ribbon, and a dark navy wedge — and that
background is visible in the box wherever the badge doesn't fill it, concentrated at
the top edge and the top-left/top-right corners.

| Hex | Pixel count | % of survivors | Attribution | Reasoning |
|---|---|---|---|---|
| `#024EFC` | 4924 | 17.78% | Mark, colour-shifted | Spread through the shape's interior (near-zero corner-zone hits); reads far brighter/more saturated than any favicon blue — banner glow, not bleed |
| `#395A85` | 2312 | 8.35% | Mark, colour-shifted | Near-zero top-edge/corner hits, spans most of the crop height — shading/gradient applied to the outline for the banner composition |
| `#536F94` | 1613 | 5.82% | Mark, colour-shifted | Same shading family as `#395A85` |
| `#0C4BE8` | 1180 | 4.26% | Mark, colour-shifted | Same bright family as `#024EFC` |
| `#A3DDF5` | 1059 | 3.82% | Bleed | 31% of its pixels in the top 25 rows, 39% in the corner zone — banner background gradient |
| `#748DAB` | 999 | 3.61% | Mark, colour-shifted | Near-zero corner hits, wide interior spread |
| `#FDB3B2` | 948 | 3.42% | **Mark, confirmed** | Within distance 20 of favicon `#F8BDB1` (dist 11.2) — the pink liquid |
| `#2B4D7B` | 915 | 3.30% | Mark, colour-shifted | Zero corner hits; nearest favicon group is `#2E3192` at dist 36.4 — same family, shifted |
| `#A9CDDD` | 794 | 2.87% | Bleed | 71% of its pixels in the top 25 rows, 4% in the corner zone — banner gradient |
| `#C3E6FA` | 794 | 2.87% | Mark, colour-shifted (glow) | Low top-edge/corner hits despite being near-white-blue — a highlight/glow treatment over the graphic, not a discrete corner patch |
| `#022D64` | 791 | 2.86% | Bleed | Confined to x∈[138,157] (the crop's right edge) and the top rows — the dark navy wedge beside the diagonal ribbon, outside the flask silhouette |
| `#3965D2` | 742 | 2.68% | Mark, colour-shifted | Bright family, interior spread |
| `#1D56E1` | 723 | 2.61% | Mark, colour-shifted | Bright family, interior spread |
| `#FDCFCF` | 599 | 2.16% | **Mark, confirmed** | Within distance 20 of favicon `#FBD4C8` (dist 8.8) |
| `#D1B7C2` | 517 | 1.87% | Mark, confirmed (blend) | Within distance 20 of a minor favicon blend colour (dist 14.9) — pink/blue transition, present in both |
| `#153A6F` | 444 | 1.60% | Mark, colour-shifted | Shading family |
| `#A4A0AF` | 432 | 1.56% | Mark, confirmed (blend) | Within distance 20 of a minor favicon blend colour (dist 15.1) |
| `#8DD6F6` | 412 | 1.49% | Bleed | 53% of pixels in top 25 rows, 64% in corner zone |
| `#BCAFB9` | 403 | 1.46% | Mark, confirmed (blend) | Within distance 20 of a minor favicon blend colour (dist 13.9) |
| `#90C8E3` | 382 | 1.38% | Bleed | 51% of pixels in top 25 rows, 22% in corner zone |
| `#DEF1F8` | 346 | 1.25% | Mark, confirmed (blend) | Within distance 20 of a minor favicon blend colour (dist 14.5) |
| `#4B7DF8` | 343 | 1.24% | Mark, colour-shifted | Bright family, interior spread |
| `#A1C3CC` | 320 | 1.16% | Bleed | 59% of pixels in top 25 rows, 30% in corner zone |
| `#5B7FCD` | 311 | 1.12% | Mark, colour-shifted | Bright family, interior spread |
| `#85B2F3` | 300 | 1.08% | Mark, colour-shifted | Bright family, interior spread |
| `#627D9B` | 281 | 1.01% | Mark, colour-shifted | Shading family, zero corner hits |

Combined: confirmed-mark groups 11.72%, colour-shifted-mark groups 57.33%, bleed groups
13.58% — 82.63% of survivors across 26 groups; the remaining 111 groups (137 total)
share the long tail below 1% each.

---

## STEP 3 — comparison table

For each STEP 1 group at ≥1%, the nearest STEP 2 merged group (searched across all 137
STEP 2 groups, not only the ≥1% list) and the distance between them:

| Favicon group | % of favicon survivors | Nearest cover group | Distance | Within 20? |
|---|---|---|---|---|
| `#2E3192` | 59.25% | `#2B4D7B` | 36.4 | No |
| `#181D8C` | 8.51% | `#153A6F` | 41.1 | No |
| `#F7A8A7` | 7.83% | `#FAA1A7` | 7.6 | Yes |
| `#FBD4C8` | 6.99% | `#FDCFCF` | 8.8 | Yes |
| `#F8BDB1` | 3.16% | `#FDB3B2` | 11.2 | Yes |
| `#000588` | 2.66% | `#022D64` | 53.9 | No |
| `#5F61A7` | 1.51% | `#5E5BB2` | 12.6 | Yes |
| `#FDE2D8` | 1.47% | `#FAE2E0` | 8.5 | Yes |

**Where they disagree, the favicon wins and this is why.** The favicon is a lossless
PNG with flat fills; the cover is a subsampled JPEG carrying a glow effect from the
banner composition. The pink/salmon family (`#F7A8A7`, `#FBD4C8`, `#F8BDB1`,
`#FDE2D8`) and the pink-blue blend (`#5F61A7`) agree closely (distance 7.6–12.6) —
these are corroborated by both sources. The dominant blue/indigo family (`#2E3192`,
`#181D8C`, `#000588`, 70.42% of the favicon) does **not** find a close cover match —
the nearest cover groups run 36–54 distance away, all of them brighter and more
saturated than the favicon's flat indigo. This is not a tie needing a convention; it is
a fidelity ruling. A lossless PNG's flat fill is the accurate record of the printed
colour. A JPEG banner crop, chroma-subsampled and carrying a photographic glow
treatment applied to the whole composition, is not. The favicon's blue/indigo values
are the ones carried forward as evidence; the cover's brighter, shading-family, and
glow-family blues are not additional data points against them.

---

## Closing: mark colours versus artefacts

**The mark's own colours**, on this evidence, are the two families the favicon
establishes as flat fills: a dark indigo/blue (`#2E3192` principal, with `#181D8C` and
`#000588` reading as anti-aliasing/dithering bands inside the same nominally-flat fill
rather than three separate hues) and a pink/salmon (`#F7A8A7` principal, with
`#FBD4C8`, `#F8BDB1`, `#FDE2D8` as lighter bands of the same fill), with `#5F61A7` as
the blend where the two meet. The pink family is corroborated directly by the cover at
distances of 7.6–12.6; the blue family is not corroborated by the cover but is not
contradicted either — the cover simply cannot render it accurately, per the fidelity
ruling above.

**Rasterisation and compression artefacts**, not additional brand colours: the
cover's bright, saturated blue family (`#024EFC` and neighbours) and its muted
shadow-toned family (`#395A85` and neighbours) are the same outline hue pushed in two
directions by a photographic banner treatment — a lighting/glow pass brightening it,
and a shading/gradient pass darkening it for depth. The pale `#C3E6FA` reads as a
highlight or glow layer over the graphic. The corner-concentrated group `#A3DDF5`,
`#A9CDDD`, `#022D64`, `#8DD6F6`, `#90C8E3`, `#A1C3CC` is the banner's own background
gradient and a dark design wedge, caught by the fixed box because the box does not
trace the badge's silhouette. None of these six or the shading/glow groups exist as
distinct values in the flat favicon PNG, and none is treated as evidence of a third
family or a fourth colour.

---

## No token role, no fixed hex

**This document assigns no token role and fixes no hex.** OD-07 bound 1 reserves that
to `DESIGN_SYSTEM.md`, which fixes hex only after this sampling pass, mapping sampled
values onto the eleven-token structure D-29 fixes. Every hex value above is sampling
evidence, not a design decision.
