# NEL — Design System

**Status:** COMPLETE and landable. §3 values derive from
`docs/research/15-mark-colour-sampling.md`, landed at P02-X02; OD-07 bound 1 is
discharged. §4 typefaces selected at the P02-X02-A verdict against the four criteria,
verified against the font binaries; CF-53 closes on landing.
**Vocabulary:** frozen `GLOSSARY.md` · 2026-08-25, as superseded in part by its §7.
**Authored under:** OD-05 bound 3, after `I18N_MODEL.md`, which constrains this document.
**Decisions this file records:** D-29, and the decisions §3 and §4 will carry once
values exist.
**Precedence:** document 8. Everything above it wins on conflict, and a conflict is
raised as a formal amendment rather than reconciled silently.

`DATA_MODEL.md` (document 7) and `SECURITY_MODEL.md` (document 5) are unauthored.
Nothing here decides a data or security question and nothing here pre-empts either.

Counts stated below are enumerated in the sections that follow and are verified
programmatically before landing (PR-01, PR-28).

---

## §1 What this document is for

The visual language of the public site and the `Operator` dashboard: colour, type,
space, elevation, motion, and the component inventory both surfaces draw from.

It does not decide what the site says, its routing, or any data shape. It does not decide the mark
itself — OD-07 governs the refinement, and this document consumes its output.

**What constrains this document, and is not reopened here:**

| Source | Constraint |
|---|---|
| `I18N_MODEL.md` §4 | Logical properties only. Two carve-outs: elevation offsets, directional media. |
| `I18N_MODEL.md` §5 | Western digits, both locales. |
| `I18N_MODEL.md` §7 | Two families maximum. `letter-spacing: 0`. No `text-transform`, no small-caps. Arabic line height exceeds Latin at the same size. Self-hosted fonts only. |
| `D-29` | One chromatic family. Eleven tokens. |
| `OD-07` bound 1 | No hex until the mark is sampled at the glyph. |
| `OD-07` bound 2 | No deliverable reaches the results portal. Scalability constrained by favicon, 16px app icon, mobile header. |
| `OD-07` bound 4 | `StatusState` only. `result` and `patient` never enter a token, component or filename. |
| `BOUNDARY_MODEL.md` §2 | No form collects anything. WhatsApp is the only contact channel. |

---

## §2 Design principles

Five. Each one is a rule a reviewer can apply, not an adjective.

**1. Arabic first, mirrored to English.** Every component is composed and reviewed in
Arabic before its English rendering is looked at. A component that reads well in Arabic
mirrors cleanly; one composed in English and flipped produces Arabic that reads as a
translation of a Latin page.

**2. Whitespace and type scale carry the impression, not effects.** The "modern
laboratory" signal comes from restraint, rhythm and hierarchy. It does not come from
gradients, blur, or motion. A component that needs an effect to look finished is not
finished.

**3. Elevation is a 1px border plus a soft shadow. Never translucency.** Three reasons,
and the first is disqualifying: a translucent surface makes contrast un-certifiable,
because the effective contrast ratio depends on whatever happens to sit behind it, and
AA is a floor this project does not negotiate. Second, `backdrop-filter` is expensive on
the low-end Android hardware this audience carries. Third, it dates the site on launch
day. Glassmorphism was proposed and is rejected on all three grounds.

**4. Every interactive target is at least 44×44 CSS pixels.** Including in the
dashboard, including on desktop. This is not a mobile-only rule.

**5. AA contrast is a floor, verified per pair, in both locales.** Not "checked once on
the palette". Each token pair that renders text on a surface is measured, and the
measurement is recorded next to the token.

---

## §3 Colour

Values derive from `docs/research/15-mark-colour-sampling.md`. The 2018 favicon is the
source of record — lossless PNG, flat fills, no photographic pixels. Every ratio below
was computed with the WCAG relative-luminance formula, not estimated.

**Two values are the mark's own. Nine are derived from them.**

| # | Token | Value | Origin | vs `background` | vs `surface` | Floor |
|---|---|---|---|---|---|---|
| 1 | `primary` | `#2E3192` | **the mark**, 59.25% of mark pixels | 10.22 | 10.66 | 4.5 |
| 2 | `primary-strong` | `#181D8C` | **the mark**, 8.51% | 12.64 | 13.18 | 4.5 |
| 3 | `accent` | `#CC3533` | derived from the mark's pink | 4.88 | 5.09 | 4.5 |
| 4 | `background` | `#FAFAFC` | tinted to hue 238° | — | — | — |
| 5 | `surface` | `#FFFFFF` | untinted by design | — | — | — |
| 6 | `border` | `#8B8CA7` | tinted to hue 238° | 3.14 | 3.28 | 3.0 |
| 7 | `text` | `#1D1D35` | tinted to hue 238° | 15.75 | 16.41 | 7.0 |
| 8 | `muted` | `#656686` | tinted to hue 238° | 5.30 | 5.53 | 4.5 |
| 9 | `success` | `#1E7A4C` | functional | 5.11 | 5.33 | 4.5 |
| 10 | `warning` | `#8A5A00` | functional | 5.69 | 5.93 | 4.5 |
| 11 | `error` | `#B3261E` | functional | 6.27 | 6.54 | 4.5 |

**Every pair passes its floor. Zero failures.** White text also clears 4.5 on all six
solid fills — `primary` 10.66, `primary-strong` 13.18, `accent` 5.09, `success` 5.33,
`warning` 5.93, `error` 6.54.

**`primary-strong` is not a computed darkening of `primary`.** The mark already contains
its own darker stop, and the sampling found it at 8.51% of mark pixels. Using the mark's
own value rather than a `darken()` call means the hover state is the lab's colour, not a
function's output.

**The neutral ramp is tinted to hue 238°**, taken from `primary`. Tokens 4, 6, 7 and 8
carry that hue at low saturation. This costs nothing and is most of the difference
between a palette that reads as designed and one that reads as a framework default.
`surface` is the one deliberate exception: pure white, so cards read as paper against a
faintly cool canvas.

**`accent` is derived, and the derivation is the one judgement call in this section.**
The mark's pink is `#F7A8A7`, which reaches **1.89** against white — it fails AA as text
by a wide margin and cannot be used for any interactive affordance. This is exactly the
decision CF-56 anticipated. The mark's hue (0.7°) is preserved and the value is darkened
until it clears the floor, giving `#CC3533` at 5.09. The mark's literal `#F7A8A7`
remains correct **inside the mark**, which is a graphic and not an interface element; it
is never a UI token.

**`accent` against `primary` is 2.09**, which is not a contrast failure — neither is ever
rendered on the other. They are separated by hue, not by luminance, and no state depends
on telling them apart at a glance.

**`success`, `warning` and `error` never render clinical or `Visitor` status.** OD-07
bound 4. They exist for `Operator` feedback and for `Offer` validity and `Programme`
publication state. This platform has no results, so it has no result state to colour.

**Green and red are not sufficient signals on their own.** Every semantic state carries
an icon or a text label alongside the colour. Roughly one man in twelve cannot
distinguish the two reliably, and a lab's dashboard is not the place to find out.

**What §3 does not settle.** The mark's pink survives in the mark itself, so the
reconstruction under OD-07 must preserve `#F7A8A7` even though no token carries it. And
these ratios are computed against flat fills; they are re-verified on rendered pages in
both locales at the first gate that ships a screen — a computed ratio is a necessary
condition, not evidence.

---

## §4 Typography

**One family, both scripts: IBM Plex Sans Arabic.** SIL OFL 1.1, self-hosted, no CDN.
`I18N_MODEL.md` §7 permits two; one is better here and the reason is §6, not economy.

Every claim below was verified against the font binaries with `fontTools`, not taken
from a specification page or a secondary source.

### Why one family rather than a pair

The hard criterion in `I18N_MODEL.md` §7 is matching at optical weight and at the ratio
of Latin x-height to Arabic body height. Matching two independently drawn faces by eye is
guesswork. Measured:

| | unitsPerEm | x-height | hhea ascent | hhea descent |
|---|---|---|---|---|
| IBM Plex Sans Arabic | 1000 | **516** | 1085 | −415 |
| IBM Plex Sans | 1000 | **516** | 1025 | −275 |

Identical x-height at identical em. They were drawn to match — Wael Morcos on the Arabic
alongside the Plex Sans team at Bold Monday. And the Arabic family ships **complete
Latin**: advance widths are identical to Plex Sans for all 62 A–Z, a–z and 0–9 glyphs.

That last fact decides it. §6 requires every Latin run inside Arabic text to be isolated
— `LabTest` abbreviations, `ProgrammeTier` values, the WhatsApp number. With one family
those runs render in the same face automatically. With two, every isolated run becomes a
per-string decision about which face applies, and that decision will be made
inconsistently.

### Weights

Three real cuts, no synthetic bold: **Regular 400 · Medium 500 · SemiBold 600.**
The family ships eight (Thin, ExtraLight, Light, Regular, Text, Medium, SemiBold, Bold);
three carry the whole hierarchy. Bold 700 is deliberately unused — heavy weights thicken
Arabic joins and the scale earns its hierarchy from size and space, per §2 principle 2.

### Size scale

One set of sizes, both locales. `I18N_MODEL.md` §7 — two scales drift within a release.

| Step | Size | Use |
|---|---|---|
| `xs` | 12px | labels, captions, table meta |
| `sm` | 14px | secondary text, form help |
| `base` | 16px | body, the floor for running text |
| `lg` | 18px | lead paragraphs, card titles |
| `xl` | 24px | section headings |
| `2xl` | 32px | page headings |
| `3xl` | 40px | the landing hero, once per page |

Seven steps. Nothing below 12px renders Arabic legibly with diacritics.

### Line height forks by locale, and the fork is computed

Arabic occupies more vertical space. Measured from the same binaries: the Arabic hhea
span is 1500/1000 em against Latin's 1300/1000, so Arabic needs **15.4% more leading**.
Applied and rounded to the nearest 0.05:

| Context | `en` | `ar` |
|---|---|---|
| Body and running text | 1.50 | **1.75** |
| Headings | 1.20 | **1.40** |
| Tight single lines | 1.10 | **1.25** |

These are derived from font metrics, not chosen by eye. If the face ever changes, the
fork is recomputed from the new metrics rather than carried over.

### Figures

**Plex's digits are uniform-width by default** — every digit 0–9 has an advance of 600 em
units in both scripts. Prices, opening hours and any numeric column align with no CSS at
all.

Neither font declares a `tnum` OpenType feature, and that is correct rather than a gap:
`tnum` substitutes proportional figures for tabular ones, and there are no proportional
figures to substitute. **`font-variant-numeric: tabular-nums` is a no-op here.** Do not
add it and do not treat its absence as a defect — at least one widely-cited source lists
Plex among fonts that "support tnum", which is wrong about the mechanism while being
right about the outcome.

Western digits only, both locales (D-25). Verified present in both subsets.

### Coverage, verified

- The mark string `معامل النيل مصر` — **every glyph present**, checked codepoint by
  codepoint against the cmap.
- Harakat `U+064B`–`U+0652` — **8 of 8 present**. The face carries full vocalisation.
- Arabic shaping features present: `init` `medi` `fina` `rlig` `calt` `ccmp` `mark`
  `mkmk` `locl`. Contextual joining and mark positioning are real, not synthesised.

### Loading

Self-hosted `woff2`, subset by script, `font-display: swap`. An `/ar/…` page loads the
Arabic subset; an `/en/…` page loads the Latin subset. Three weights per subset, so any
one page fetches three files.

No third-party CDN. `I18N_MODEL.md` §7 — an external font request discloses the
`Visitor`'s IP and referer on every page load, which is a `BOUNDARY_MODEL.md` §2 concern
before it is a performance one.

### The trade-off, named rather than hidden

Plex Sans Arabic is a low-contrast, Latin-harmonised Arabic. Some Arabic typographers
consider that harmonisation a compromise of Arabic's own proportions. For display type
set large that criticism has force; for a bilingual interface at body size, where the
binding constraint is that both scripts sit on one baseline grid at one optical weight,
the harmonisation is the reason to choose it. If the lab's clinical staff read the
rendered Arabic and find it wrong, that judgement outranks this one.

### Rejected, and why

**Noto Sans Arabic** — the system fallback. Choosing it deliberately makes the site look
like it has no typeface, which is precisely the defect the results portal exhibits.

**Cairo** — ubiquitous in Egyptian web design, so it reads as a default rather than a
choice, and its Latin companion is weak enough to force a second family and reopen the
matching problem.

---

## §5 Space, radius, elevation

These do not depend on colour or on face selection, and they are fixed here.

**Spacing scale.** A single 4px base, stepped `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96`.
Nine steps. Every margin, padding and gap uses one; no arbitrary value enters a
component. Expressed as logical properties only (`I18N_MODEL.md` §4).

**Radius scale.** Four values: `0` for full-bleed edges · `4px` for inputs and small
controls · `8px` for cards and raised areas · `full` for pills and avatars. Radius is uniform
per component; no component mixes two.

**Elevation.** Three levels, each a 1px `border` plus a shadow. No blur surface, no
translucency, per §2 principle 3.

| Level | Use | Composition |
|---|---|---|
| 0 | page canvas, inline text | no border, no shadow |
| 1 | cards, `Programme` tiles, `Offer` cards | 1px `border` + soft short shadow |
| 2 | menus, dialogs, the language switcher when open | 1px `border` + softer long shadow |

Shadow offsets are physical, not logical, and this is one of the two carve-outs
`I18N_MODEL.md` §4 permits: light does not mirror when the layout does. A shadow that
flips between locales looks like a rendering bug.

**Motion.** Duration `150ms` for state change, `250ms` for entry and exit. Standard
easing on both. Every transition respects `prefers-reduced-motion` and resolves to no
animation when it is set. No parallax, no scroll-driven effects, no autoplay.

---

## §6 Component inventory

Enumerated so the count is verifiable and so nothing is invented later without a
decision. Two surfaces draw from one system.

**Public site — 14 components.** Header · language switcher · navigation ·
`Programme` card · `Programme` detail header · `LabTest` list row · `Offer` card ·
`Equipment` card · `Branch` card with map link · `Video` embed frame · search input
with match list · WhatsApp action · outbound `ResultsPortalLink` action · footer.

**`Operator` dashboard — 10 components.** Sign-in form · module navigation ·
data table · bilingual field pair (`_ar` / `_en` side by side) · rich-text body editor ·
media picker · date-range control for `Offer` validity · publish toggle ·
`StatusState` badge · confirmation dialog.

**Total: 24.** Verify by counting the two lists above before landing.

**Three components carry rules that are easy to get wrong:**

**Bilingual field pair.** Both locales visible simultaneously, never behind a tab. A
tabbed pair lets an `Operator` save with one locale empty, which `I18N_MODEL.md` §8
forbids for chrome and which produces a half-translated page for entity strings. The
Arabic field is composed first and sits in the inline-start position.

**WhatsApp action.** Builds its deep link client-side from `SiteSettings` and opens it.
It is not a form. It collects nothing, stores nothing, and posts nowhere
(`BOUNDARY_MODEL.md` §2, D-09).

**Outbound `ResultsPortalLink` action.** An `https://` link opening a new browsing
context, in both locales. Never a frame, never an iframe, never an embed. Framing that
portal renders its login inside our origin where the `Visitor` cannot verify the address
bar — a credential-phishing shape, forbidden regardless of who asks (`BOUNDARY_MODEL.md`
§2, D-17). The component carries no portal styling and no portal colour; OD-07 bound 2
means nothing this project designs is applied to that system.

---

## §7 The mark in use

Consuming OD-07's output, not deciding it.

**Four variants** (OD-07): primary horizontal · compact icon · light · dark monochrome.

**Minimum sizes are set by the smallest place the mark must survive**, which OD-07
bound 2 fixes as the favicon and the 16px app icon. At 16px only the flask reads; the
bilingual wordmark does not. The compact variant exists for exactly this and is not an
optional convenience.

**The mark is never mirrored.** It encodes meaning, not direction (`I18N_MODEL.md` §4).
The same file renders in both locales. Its bilingual lockup already carries both scripts,
so no locale-specific mark is authored.

**Clear space** is one flask-width on all four sides, expressed logically.

**The mark is a reconstruction from compressed raster and every artefact says so**
(OD-07 bound 6, CF-45). No editable original exists.

---

## §8 Accessibility floor

Non-negotiable, and each line is a check rather than an aspiration.

| # | Requirement | How it is proven |
|---|---|---|
| 1 | AA contrast on every text-on-surface pair | measured per pair, recorded beside the token, both locales |
| 2 | 44×44 CSS px minimum target | measured on the rendered component, both locales |
| 3 | Visible focus on every interactive element | keyboard traversal of each route, both locales |
| 4 | Semantic state never colour-only | icon or text label present alongside every semantic colour |
| 5 | `prefers-reduced-motion` honoured | every transition resolves to none when set |
| 6 | Logical properties only | command over the stylesheet for the `I18N_MODEL.md` §4 forbidden list → 0 |

Six requirements. Criterion 1 cannot be closed until §3 carries values.

---

## §9 What this document does not decide

- The mark's refinement itself. OD-07 governs it; §7 consumes it.
- Whether the rendered pages actually hit the §3 ratios and the §8 floor. Computed
  ratios and font metrics are necessary conditions, not evidence. Both are re-verified
  on rendered pages in both locales at the first gate that ships a screen.
- Page composition and layout for any specific route. That is P03 build work against
  `CONTENT_MODEL.md` §3c.
- The `Operator` dashboard's chrome language. CF-52, deferred to `ADMIN_SPEC.md`.
- Anything about data shape or security. `DATA_MODEL.md` and `SECURITY_MODEL.md` are
  unauthored.
