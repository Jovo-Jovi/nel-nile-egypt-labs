# NEL public site — page report

**Route:** `/` only (no locale segment). Entry: `SiteRoot`.  
**Status:** production baseline for the public site under OD-08, refined in place. G3 applies.  
**Locales:** `ar` (default, `dir="rtl"`) and `en` (`dir="ltr"`), switched in the header. `dir` and `lang` sit on the page-root wrapper, not on `<html>`.  
**Typeface:** IBM Plex Sans Arabic, both scripts.  
**Date of this report:** 29 August 2026. Copy and behaviour are taken from `src/components/site/`, not from memory.

`DESIGN_SYSTEM.md` v5 §9 governs this surface; this file describes an implementation of that specification, not a second authority. Same mark slot (`/mark/nel-mark.svg`, labelled-frame fallback until the SVG lands), same eleven colour tokens, same catalogue strings, same outbound contracts (Results Portal HTTPS, WhatsApp `wa.me`). No booking form. No invented LabTest names.

---

## 1. Colour system

Eleven tokens. No twelfth colour. WhatsApp green `#25D366` is a brand-mark exception only.

| Token | Hex | Role on this page |
|---|---|---|
| `primary` | `#2E3192` | Header portal, selected tab, hex stroke, skip icon, card hover border |
| `primary-strong` | `#181D8C` | Hero veil, footer, Lab-to-Lab panel, headings |
| `accent` | `#CC3533` | Kickers, list indexes, focus ring, nav underline, stat bar, footer/CTA edge |
| `background` | `#FAFAFC` | Page; cards sitting on inset `surface` panels |
| `surface` | `#FFFFFF` | Pill header, sidebar, inset section wells, skip control, mark plate, play disc |
| `border` | `#8B8CA7` | Pill, map, cards, tabs |
| `text` | `#1D1D35` | Body on white |
| `muted` | `#656686` | Standfirsts, pending copy |
| `warning` | `#8A5A00` | Insights caution |
| `success` / `error` | `#1E7A4C` / `#B3261E` | Not used here |

**Preview chrome**

- `--nel-preview-well` (2rem) is landing composition only, not a fifth `DESIGN_SYSTEM.md` §5 radius.
- Hero photograph sits under a **flat** `primary-strong` veil (74% mix) across the **copy column** (0–44% of the well), then a single-hue fade to 22% mix in the photo-only zone (`to inline-end`). Type is `surface` and does not sit on the fade. Image `brightness(0.58)`. Named §9 deviation: text on a uniform indigo field over photography. No stock caption under the well.
- Hex lattice is decorative, `primary` stroke at 12% opacity, no type on it.
- Header pill and dock-less chrome are solid `surface`. Compact after 24px scroll: tighter bar (60px from 768px).
- **§12 pending frames restored.** Catalogue copy that is unsigned material renders as crafted bars. `ApprovalGate` wraps every region in §12's pending table. A `Visitor` can reach this surface, so gates are required (OD-08).

---

## 2. Colour distribution

| Layer | Fill | Type |
|---|---|---|
| Loading | `surface` | lockup |
| Header | floating `surface` pill, `radius-full` | `text` links; portal **primary** pill ≥1024px |
| Hero well | photograph + flat indigo under copy, fade at inline-end | `surface` |
| Departments | page `background` + organic stills | `primary-strong` |
| About | page + overlapping stills + `surface` tab card | `primary-strong` |
| Why / Offers / Insights | inset `surface` wells | `primary-strong` headings; `background` inner cards |
| Branches / videos | page `background` | `primary-strong` |
| Lab-to-Lab | full-bleed `primary-strong` band; `surface` action plate | `surface` on the band; `text` on the plate |
| Footer | rounded `primary-strong` card on page `background` | `surface` |

Breakpoints: **768px** (nav in pill vs hamburger), **1024px** (header portal, 5xl headline).

---

## 3. Interaction

**Header.** Sticky pill. Six hashes (Home, About, Programmes, Locations, Offers, Insights). Hamburger + sidebar below 768px. Language switcher always visible. WhatsApp outlined pill always. Portal filled pill from 1024px. Compact on scroll.

**Hero.** One rounded well. Portal **secondary** pill + WhatsApp filled pill. Skip circle → `#departments`.

**Departments.** Centred kicker + standfirst used as title. Four organic stills, **01–04** + approved LabUnit names only.

**About.** Copy + two overlapping stills (microscope + care). In-page tabs (Programmes / Locations / Insights) reuse catalogue copy; `#programmes` anchors the tab block.

**Why.** Three catalogue reason cards (booking / care / support — no booking form) plus three structural stat tiles.

**Offers.** Numbered 01–03 cards. **Insights.** Magazine: featured still + two index cards + caution. **Videos.** Decorative 48px play disc (not a player) + duration.

**Lab-to-Lab.** Full-bleed `primary-strong` band. `surface` action plate holds `labToLab.ctaBody` plus Portal **primary** pill and WhatsApp filled pill.

**Footer.** Rounded `primary-strong` island on page `background` (attached layout). Brand lockup + four social marks (no URLs). Three link columns: sitemap hashes, contact (WhatsApp + Portal + Lab-to-Lab + awaiting hotline/address), media (departments, videos, privacy label). Bottom hairline: notice, privacy, Portal/WhatsApp pills. No ISO/GDPR chips.

**Cards / reasons.** Hover: elevation 1→2, `border` toward `primary`, `translateY(-2px)`, 150ms. No scale. Reduced-motion: no transform, no transition.

**Buttons.** 44px minimum. `data-pill` uses `--nel-radius-full`.

Focus: 2px `accent` outline. No dashed pending frames.

---

## 4. Copy (unchanged catalogue)

Hero, trust facts, departments, about, offers, insights, videos, lab-to-lab, and footer strings are the existing `ar`/`en` keys. No new clinical sentences. No `patient` label.

**Departments (approved LabUnit names)**

| # | AR | EN |
|---|---|---|
| 01 | علم المناعة | Immunology |
| 02 | الكيمياء الحيوية | Chemistry |
| 03 | أمراض الدم | Haematology |
| 04 | الأحياء الجزيئية | Molecular Biology |

---

## 5. Actions

| Action | Where | Target |
|---|---|---|
| Results portal | Hero (secondary pill); About (primary pill); Lab-to-Lab action plate (primary pill); header ≥1024px (primary pill); footer contact list + bottom chip (secondary pill) | `https://example.invalid/portal-placeholder` |
| WhatsApp | Hero (filled pill); Lab-to-Lab action plate (filled pill); header (outlined pill); footer contact list + bottom chip (filled pill) | `https://wa.me/200000000000` |

**Never on this page:** contact form, booking form, newsletter, `tel:` links, embedded third-party maps, YouTube, real addresses/hotline/ISO number, LabTest names, seeded Programme names, patient data.

---

## 6. Layout summary

```
[loading 1.2s — lockup]
[floating surface pill — compact on scroll]
[rounded photo well — flat veil under copy, fade at inline-end, skip]
[departments — 4 numbered organic stills]
[about — copy, tabs, two overlapping stills]
[why — inset well: 3 reason cards + 3 stat tiles]
[branches — map]
[offers — inset well, 3 numbered cards]
[insights — inset well: feature + 2 index cards + caution]
[videos — 3 posters with play disc]
[lab-to-lab full-bleed indigo band + surface action plate]
[footer — rounded indigo card: brand + social marks, 3 columns, legal bar]
```

Logical CSS properties throughout. Arabic line-height 1.75 body / 1.40 headings; English 1.50 / 1.20.

---

## 7. What this implementation is

This is the **production baseline** for the public site, promoted under OD-08 from the owner-approved composition of 29 August 2026. `DESIGN_SYSTEM.md` v5 is the specification; this file describes the implementation. G3 applies. §12 dashed pending markers are present: every region in §12's pending table renders through `ApprovalGate` with the crafted treatment. It is **not** signed content. Unsigned material clears on a signature or a supplied asset, not on a further design task.
