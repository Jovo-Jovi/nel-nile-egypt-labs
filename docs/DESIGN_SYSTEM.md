# NEL — Design System

**Status:** v3, COMPLETE and landable. §3 values derive from
`docs/research/15-mark-colour-sampling.md`, landed at P02-X02; OD-07 bound 1 is
discharged. §4 typefaces selected at the P02-X02-A verdict against the four criteria,
verified against the font binaries. §5 elevation values ratified at the P02-T07 verdict.
§9, §10 and §11 authored at that verdict, after a mock built strictly from §3–§6 rendered
correctly and looked like nothing — tokens do not compose a page.

v3 adds the composition a reference design made obvious and the document lacked: a
full-bleed hero media column, a trust row, the four-card band, alternating neutral
section backgrounds, single-family gradients, video poster rules, seven component
specifications, two display type steps, and Bold 700 above `2xl`. It also adds **§12
approval states**, which is what lets the whole page be built now and its copy, imagery
and claims gated until the signatures that govern them arrive.
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

Four real cuts, no synthetic bold: **Regular 400 · Medium 500 · SemiBold 600 · Bold 700.**
The family ships eight; four carry the hierarchy.

**Bold 700 is permitted at `2xl` and above only.** Below that it is forbidden. Heavy
weights thicken Arabic joins and clog the counters at body size, which is why the first
cut of this document excluded 700 entirely. That exclusion was too broad: at 32px and
above the joins have room and Bold Arabic sets cleanly. Amended at P02-T10 so display
headlines can carry real weight without damaging running text.

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
| `3xl` | 40px | page hero headings |
| `4xl` | 56px | the landing hero headline, once per page |
| `5xl` | 72px | reserved; `lg` breakpoint and above only |

Nine steps. Nothing below 12px renders Arabic legibly with diacritics. `4xl` and `5xl`
step down two levels below `md` — a 72px headline on a 360px phone is one word per line.

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

| Level | Use | Border | Shadow |
|---|---|---|---|
| 0 | page canvas, inline text | none | `none` |
| 1 | cards, `Programme` tiles, `Offer` cards | 1px `border` | `0 1px 3px rgba(29,29,53,0.08), 0 1px 2px rgba(29,29,53,0.05)` |
| 2 | menus, dialogs, the language switcher when open | 1px `border` | `0 8px 24px rgba(29,29,53,0.10), 0 2px 8px rgba(29,29,53,0.06)` |

The shadow colour is `text` (`#1D1D35`) at low alpha, never neutral black. A black shadow
over a hue-tinted neutral ramp reads as dirt; the same hue at low alpha reads as depth.
These values were left descriptive in the first cut of this document and were supplied by
the P02-T07 builder, which flagged the gap rather than inventing silently. Ratified here.

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

## §9 Composition

Tokens do not compose a page. This section is what §1 through §8 were missing: the rules
that turn a token set into a layout. Authored at P02-T07's verdict, where a mock built
strictly from §3–§6 rendered correctly and looked like nothing.

### Grid and containers

A 12-column grid, gutter `24px`, applied at `md` and above. Below `md` the layout is a
single column and the grid is not used — a 12-column grid on a 360px phone is arithmetic
theatre.

| Container | Max inline size | Use |
|---|---|---|
| `narrow` | 720px | running prose — About, Privacy Policy, `Programme` description |
| `default` | 1120px | every standard page |
| `wide` | 1360px | the landing hero band and full-bleed sections only |

Breakpoints: `sm` 480 · `md` 768 · `lg` 1024 · `xl` 1280. Four. Containers centre with
`margin-inline: auto` and carry `padding-inline` of `16px` below `md`, `24px` above.

### Vertical rhythm

Section spacing comes from the §5 scale and nothing else.

| Slot | Below `md` | `md` and above |
|---|---|---|
| Between major sections | `48px` | `96px` |
| Section heading to its body | `24px` | `32px` |
| Between sibling cards | `16px` | `24px` |
| Inside a card | `16px` | `16px` |

**Whitespace is the product.** §2 principle 2 says the modern-laboratory impression comes
from restraint and rhythm. That is only true if the rhythm is generous: 96px between
sections looks wrong in a code review and correct on a screen. Do not compress it to fit
more above the fold.

### Measure and density

Running prose caps at `70ch` in Latin and `55ch` in Arabic. Arabic sets wider per
character, so an identical `ch` cap produces a longer physical line and a harder return
sweep. This is one of the few places a value forks by locale outside line height.

One idea per card. A card that needs a scrollbar is two cards.

### Imagery

**All photography is client-supplied** (`docs/research/08-form-review-and-next-steps.md:73`
— the lab holds its own photos and handles them). No stock photography ships, and none
appears in a preview shown to the client: a stock image sets an expectation the client
has already agreed to fill, and it is a cost line the engagement removed.

Until real assets land, an image slot renders as a **labelled frame** — correct aspect
ratio, `border` at 1px, `radius` 8px, a centred label naming what belongs there. A
labelled frame reads as composed. An empty div reads as broken.

| Slot | Ratio | Where |
|---|---|---|
| Hero | 4:3 | landing, beside the headline at `md` and above; below it under `md` |
| `Equipment` | 4:3 | Equipment cards |
| `Branch` | 16:9 | Branch cards |
| `Video` poster | 16:9 | Video frames |

Text is never set over a photograph. A scrim makes contrast depend on the image behind
it, and §2 principle 3 rules out anything that makes contrast uncertifiable. Text sits
beside imagery, not on it.

### The landing hero

Two columns at `md` and above, Arabic-first so the text column takes the inline-start
position and the media the inline-end. One column below `md`, text first.

The media **may bleed to the inline-end viewport edge**, escaping the container while the
text column stays inside it. This is the only full-bleed element on the page and it is
what gives the hero its scale.

**Text never crosses into the media.** Not with a scrim, not with a gradient overlay, not
at a "safe" opacity. The moment text sits on an image its contrast depends on a file the
client can replace, and §8 criterion 1 stops being verifiable. Where a reference design
appears to put text on a photograph and still reads well, that is the particular
photograph, not a rule.

Order inside the text column: eyebrow (`sm`, `accent`, weight 600) · headline (`4xl`,
weight 700, two lines, the second line in `accent`) · standfirst (`lg`, `muted`, max
two lines) · the two actions · the trust row.

**The hero carries exactly two actions and they are not equal.** The portal action is a
filled `primary` button; the second is an outlined button on `surface`. Both clear 44px.
Two filled buttons side by side make a visitor choose between identical weights, which is
not a choice, it is a pause.

**The selective-colour headline.** The second line sets in `accent` at 5.09 against
`background`. Not a gradient — a gradient's contrast varies across every glyph and cannot
be certified, which is the argument that ruled out translucency in §2 principle 3.

### The trust row

Directly under the hero actions. Three or four entries, each an icon at 24px in `primary`
plus two lines: a label at `sm` weight 600 in `text`, and a qualifier at `xs` in `muted`.
No card, no border, no fill — separated by space alone.

**Every claim in this row is a factual assertion about the laboratory and each one needs
a source.** A certification badge names a scheme, a number and an issuing body, and it
does not render until those are verified against a document the client supplies. An
unverified accreditation claim on a laboratory site is a regulatory exposure, not a
design element. Claims with no verifiable source render under §12 `pending`.

### The card band

Directly under the hero, and the highest-value structure on the page: it answers what a
visitor came for without a scroll.

Four cards at `lg` and above, two-by-two at `md`, stacked below. Each is `surface` at
elevation 1, radius 8px, padding 16px, equal block size across the row.

| Card | Contains |
|---|---|
| News | two or three dated entries, each a 64px thumbnail, title, one-line excerpt |
| Cautions | three entries, each a 24px icon, title, two-line body |
| Locations | a map frame, the head-office address and hotline, one action |
| Programmes | three or four rows, each an icon, title, one-line subtitle, chevron |

Each card carries a header: title at `lg` weight 600 in `text`, and a `View all` text
link at the inline-end. The chevron on a Programme row is direction-encoding and
**mirrors** between locales (§4); the icons inside News and Cautions encode meaning and
**do not**.

Two of these four cards carry material that cannot render as approved without sign-off —
see §12. The band is built now and gated.

Nothing else enters the hero region. No search, no third action.

### The stat band

Directly under the hero, four cells at `md` and above, two-by-two below.

Structural facts only — branch count, head-office flag, `Programme` count, `LabUnit`
count. **A count is not a medical claim, but a name is.** No `Programme` name, no
`LabTest` name, and no count of LabTests within a `Programme`, ever appears here. That distinction is what
separates this from the mockups a general-purpose tool produces, which reach for
`45 تحليل` because it looks impressive and lands squarely inside the clinical gate.

Numbers set at `2xl`, weight 600, `primary`. Labels at `sm`, `muted`. Western digits
(D-25).

### The mark

| Placement | Variant | Size |
|---|---|---|
| Header | primary horizontal | 40px block size, inline size auto |
| Footer | light or dark monochrome | 32px block size |
| Favicon and app icon | compact | 16px, 32px, 180px |

Clear space is one flask-width on all sides (§7). The mark never mirrors, never rotates,
never recolours, and never sits on a photograph. Its own pink `#F7A8A7` survives inside
it and is not a UI token (§3).

### Section pattern

Every section: heading at `xl` in `primary-strong` · optional standfirst at
`base` in `muted` · body · optional single text link in `accent`.

**Sections may alternate between `background` and `surface`**, and nothing else. Two
existing neutrals, no new chromatic family, no per-section colour. A section that wants
its own colour is a template signalling a change it has not earned; a system alternates
two neutrals or uses space.

### Gradients

Permitted, within one hue family only. `primary` → `primary-strong`, or `background` →
`surface`. Never multi-hue, never lavender-to-pink-to-blue: that is three chromatic
families and D-29 fixes one.

A gradient may sit behind a section or a hero band. It may **not** sit behind text
unless the text clears its floor against **both** stops, verified at each end and
recorded — a single measurement in the middle proves nothing about the corners. It may
never be applied to text itself (§9, the selective-colour headline).

### Video posters

A video poster is a self-hosted `MediaAsset` or a §9 labelled frame. **Never a
YouTube-hosted thumbnail URL.** Hot-linking `img.youtube.com/vi/{id}/…` transmits the
`Visitor`'s IP to a third party on page load, exactly as an autoloading player does, and
it voids the `BOUNDARY_MODEL.md` §5 no-banner position without touching a column.

The poster carries a centred play affordance at 48px and a duration badge at the
block-end inline-end corner: `xs`, `surface` text on `text` at 80% — the one permitted
use of a translucent fill, because it sits on a poster whose contrast is already
unverifiable and it carries no information the title does not repeat.

The play triangle encodes meaning, not direction. It **does not mirror** (§4).

---

## §10 Component specifications

§6 enumerates 24 components. This section specifies eighteen: the eleven that carry a
rule easy to get wrong, plus the seven the v3 landing composition introduced. The remaining thirteen are specified
at the phase that builds them, and this section is extended rather than rewritten.

Every component inherits: logical properties only · 44px minimum target · visible focus ·
`letter-spacing: 0` · no `text-transform`.

**Button.** Three variants. `primary` — `primary` fill, `surface` text, radius 4px,
padding `12px` block and `24px` inline, weight 600, `base` size. `secondary` — `surface`
fill, 1px `primary` border, `primary` text, same metrics. `text` — no fill, no border,
`accent` text, underline on hover only. Minimum block size 44px in all three. Icon, when
present, sits inline-start of the label in both locales and mirrors only if it encodes
direction (`I18N_MODEL.md` §4).

**Card.** `surface` fill, elevation 1, radius 8px, padding 16px. Heading `lg` weight 600
`text`; body `base` `muted`. Optional image slot at the block-start, full bleed to the
card edge, radius clipped to 8px on the leading corners only. Whole card is not a link;
the action inside it is.

**Header.** Block size 72px at `md` and above, 56px below. Mark at inline-start,
navigation centred, language switcher and WhatsApp action at inline-end. Elevation 0
until scroll, elevation 1 after. Sticky. Below `md` the navigation collapses to a
disclosure; the language switcher never collapses — a visitor in the wrong locale must
never have to open a menu to leave it.

**Language switcher.** A single control showing the *target* locale, not the current one:
on an Arabic page it reads `EN`. Showing the current locale is the most common bilingual
UI defect and it inverts the meaning of the click. 44px, radius `full`, 1px `border`,
`text` label.

**Stat cell.** Number `2xl` weight 600 `primary`; label `sm` `muted`; no border, no fill,
separated by space alone.

**Image frame.** Fixed ratio per §9, 1px `border`, radius 8px, `background` fill, label
centred at `sm` in `muted`. Never a spinner and never a broken-image icon.

**WhatsApp action.** Builds `https://wa.me/<number>?text=<message>` client-side from
`SiteSettings` and opens it in a new browsing context. Not a form, no input, nothing
posted (D-09, `BOUNDARY_MODEL.md` §2). The number is never a literal in source (PR-16).

**Outbound `ResultsPortalLink` action.** `https://` anchor, `target="_blank"`,
`rel="noopener noreferrer"`. **Never a frame, iframe or embed.** Framing that portal puts
its login inside our origin where a `Visitor` cannot verify the address bar, which is a
credential-phishing shape and is forbidden regardless of who asks (D-17). Carries no
portal styling and no portal colour — OD-07 bound 2 means nothing this project designs is
applied to that system.

**Bilingual field pair.** Both locales visible simultaneously, never behind a tab. Arabic
field in the inline-start position, composed first. Each field labelled with its locale.
A tabbed pair lets an `Operator` save with one locale empty.

**`StatusState` badge.** Radius `full`, `sm`, weight 500, padding `4px` block `12px`
inline. Carries an icon **and** a text label — never colour alone (§3). Covers `Offer`
validity, `Programme` publication and `Operator` invite state. Never clinical or
`Visitor` status (OD-07 bound 4).

**Section header.** Title at `lg` weight 600 in `text` at the inline-start, optional
`View all` text link in `accent` at the inline-end, baseline-aligned. Used by every card
in the band and by every section.

**News card entry.** 64px square thumbnail at the inline-start, radius 4px. Date at `xs`
in `muted` above the title. Title at `base` weight 600 in `text`, two lines maximum.
Excerpt at `sm` in `muted`, one line, truncated with an ellipsis rather than faded — a
fade is a gradient over text.

**Caution card entry.** 24px icon at the inline-start in `primary`, no fill behind it.
Title at `base` weight 600 in `text`. Body at `sm` in `muted`, two lines. The icon
encodes meaning and does not mirror. **Content is gated — see §12.**

**Location card.** A 16:9 map frame at the block-start, radius 4px, then the head-office
address at `sm` in `text` and the hotline at `sm` weight 600. One outlined action at the
block-end. The map is a static image asset, never an embedded third-party map: an
embedded map is an evidence-item-7 surface and discloses the `Visitor` on page load.

**Programme row.** 32px icon in a `background` circle at the inline-start, title at
`base` weight 600, subtitle at `sm` in `muted`, chevron at the inline-end. The chevron is
direction-encoding and **mirrors**. The whole row is the target and clears 44px.
**Content is gated — see §12.**

**Video card.** Poster per §9 with its play affordance and duration badge, then title at
`base` weight 600 and description at `sm` in `muted`, two lines. Click loads the player
in privacy-enhanced mode; nothing loads before the click (D-13).

**Trust entry.** 24px icon in `primary`, label at `sm` weight 600 in `text`, qualifier at
`xs` in `muted`. No card, no border. **Every claim needs a verified source — see §12.**

**Footer.** `background` fill, `border` 1px on the block-start edge only. Mark at 32px,
`SiteSettings`-sourced contact block, locale-appropriate column order. No newsletter
signup, no contact form, nothing that collects anything.

---

## §11 States

Six states, specified once, inherited by every interactive component.

| State | Rule |
|---|---|
| Default | as specified in §10 |
| Hover | fill moves to `primary-strong`; outlined and text variants gain a `background` fill. 150ms (§5) |
| Focus | 2px `accent` outline at 2px offset, **always visible**, never removed. `:focus-visible` for pointer input, but never `outline: none` without a replacement |
| Active | `primary-strong` fill, no transform, no scale |
| Disabled | `muted` text on `background`, 1px `border`, `cursor: not-allowed`. **Not reduced opacity** — opacity makes the effective contrast depend on what sits behind, which §2 principle 3 rules out |
| Loading | inline spinner replacing the icon slot, label retained, control non-interactive. Never a full-page overlay |

Two states that are not interaction and are specified because they are always forgotten:

**Empty.** A heading at `base` weight 600, one line of `muted` explanation, and an action
where one exists. Never a bare "No data". Both locales.

**Error.** `error` colour, an icon, and text saying what failed and what to do. Never a
raw exception, never a status code alone, never English inside an Arabic page.

Focus is the one in this table most likely to be quietly removed by a builder who thinks
the outline is ugly. It is an §8 criterion and it is not negotiable.

---

## §12 Approval states

The structure of this site can be built before the material inside it is approved. The
two must not be confused, and confusing them is how unsigned clinical copy reaches
production.

Every region carries one of three states. The state is a property of the material, not of
the component, and the same component renders all three.

| State | Renders | Marked |
|---|---|---|
| `approved` | the real material | no |
| `pending` | real structure, placeholder copy | yes, visibly |
| `withheld` | nothing — the region is absent | n/a |

**`pending` treatment.** The component renders at full fidelity with its real spacing,
type and elevation, so the layout is honest. Copy is synthetic and reads as synthetic.
The region carries a marker: a 1px dashed `border` in `muted` and a `xs` label in `muted`
naming what is awaited. A `pending` region is never styled to look finished — a
placeholder that passes for real content is worse than an empty one, because nobody
chases it.

**What is `pending` by default, and why.** These are not stylistic judgements.

| Material | Why | Clears when |
|---|---|---|
| Any `LabTest` name, `Programme` name, `ProgrammeLabTest` membership or medical description | Clinical gate, **non-waivable** | the lab's clinical staff sign the copy in writing |
| Health cautions and pre-test instructions | Medical instruction. Fasting hours and medication guidance are clinical content whatever heading sits above them | same signature |
| Certification and accreditation claims | A regulatory assertion. Scheme, number, issuing body and expiry must match a document the client supplies | the document is supplied and checked |
| Hotline, WhatsApp number, addresses, hours | Published business data, never a literal in source (PR-16) | `SiteSettings` carries them |
| The mark | No editable original exists; reconstruction is undelivered (CF-45, CF-65) | the client supplies the SVG |
| Photography | Client-supplied; no stock ships (§9) | the client supplies the files |
| News entries | The module that would manage them is a ninth module, which D-15 and D-16 forbid without an OD | the OD is signed |

**Two rules that hold regardless of state.**

A `pending` region never carries a real clinical string "just to show the shape". If the
placeholder needs to look like a `Programme` name, the placeholder is the problem, not
the gate.

**A whole page of `pending` regions is still a preview, not a deliverable.** OD-05 bound
4 governs the mock and is not softened by how finished it looks. Anything shown to the
client carries a visible banner saying so, and that banner survives a screenshot.

---

## §13 What this document does not decide

- The mark's refinement itself. OD-07 governs it; §7 and §9 consume its output.
- Whether the rendered pages actually hit the §3 ratios and the §8 floor. Computed
  ratios and font metrics are necessary conditions, not evidence. Both are re-verified
  on rendered pages in both locales at the first gate that ships a screen.
- The thirteen components §10 does not yet specify. Each is specified at the phase that
  builds it, by extending §10 rather than rewriting it.
- Page composition for any specific route beyond the landing surface. §9 fixes the
  grid, rhythm and patterns; applying them route by route is P03 build work against
  `CONTENT_MODEL.md` §3c.
- The `Operator` dashboard's chrome language. CF-52, deferred to `ADMIN_SPEC.md`.
- Anything about data shape or security. `DATA_MODEL.md` and `SECURITY_MODEL.md` are
  unauthored.
- Whether any `pending` region in §12 is ever approved. That is the client's and the
  lab's, and no design decision substitutes for a signature.
