# NEL landing preview — page report

**Route:** `/` only (no locale segment).  
**Status:** owner design-decision mock, not a production page.  
**Locales:** `ar` (default, `dir="rtl"`) and `en` (`dir="ltr"`), switched in the header. `dir` and `lang` sit on the page-root wrapper, not on `<html>`.  
**Typeface:** IBM Plex Sans Arabic, both scripts.  
**Date of this report:** 29 August 2026. Copy and behaviour are taken from the live mock in `src/`, not from memory.

This document describes the **landing** view only. A design-system gallery still exists in source (`SystemView`) but is **not** linked from this page (the former preview banner and landing/system toggle are gone).

---

## 1. Colour system

Eleven tokens. No twelfth colour. WhatsApp green `#25D366` is a brand-mark exception only (mark + filled button variant in the gallery), never a token, never paired with white text.

| Token | Hex | Role on this page |
|---|---|---|
| `primary` | `#2E3192` | Header/dock fill, trust-band start, offers section, icon wells, primary buttons |
| `primary-strong` | `#181D8C` | Hero overlay, trust-band end, Lab-to-Lab CTA panel, footer, elevated header, dark headings |
| `accent` | `#CC3533` | Eyebrow bar, second headline mix, Insights kickers, focus ring |
| `background` | `#FAFAFC` | Page wash, Programmes / Insights / Lab-to-Lab section fills, partner tiles |
| `surface` | `#FFFFFF` | Why / Branches / About / Videos, cards, type on indigo, loading screen, logo plates, outlined buttons |
| `border` | `#8B8CA7` | Card edges (idle), map frame, branch dividers |
| `text` | `#1D1D35` | Body on white, WhatsApp filled labels |
| `muted` | `#656686` | Standfirsts, excerpts, pending markers, branch awaiting copy |
| `warning` | `#8A5A00` | Insights caution block only (icon, kicker, light wash). Not decorative |
| `success` / `error` | `#1E7A4C` / `#B3261E` | Not used on the landing view |

**Preview overrides (landing chrome only):**

- Radius: `--nel-radius-sm` 8px, `--nel-radius-md` 16px (design system is 4px / 8px). Header and dock use 24px pills.
- Page wash: fixed behind the page — `background` → `surface` plus a `primary` radial at **6%** mix (design-system cap).
- Card hover-lift exists in the component (`data-lift="true"`, 4px). **Landing cards do not pass `lift`**, so they stay still.

---

## 2. Colour distribution (top to bottom)

White dominates. Indigo is reserved for hero overlay, trust, offers, Lab-to-Lab CTA, footer, and chrome.

| Layer | Fill | Type |
|---|---|---|
| Loading splash | `surface` | lockup only (`/mark/nel-mark.png`) |
| Header | translucent `primary` (stronger when scrolled) | `surface` links; mark on a `surface` plate |
| Hero photograph | owner-attached still + indigo wash from the text side | `surface` headline |
| Trust strip (under hero) | `primary` → `primary-strong` | `surface` |
| Why Nile Egypt Lab | `surface` | `primary-strong` heading |
| Programmes | `background` | `primary-strong` heading |
| Branches | `surface` | `primary-strong` heading |
| Offers | `primary` (flat, no gradient) | `surface` heading; white cards |
| About + Departments + Equipment | `surface` | `primary-strong` heading |
| Insights | `background` | `primary-strong` heading; `warning` caution |
| Videos | `surface` | `primary-strong` heading |
| Lab-to-Lab | `background` wrap; inner panel `primary-strong` | `surface` heading |
| Footer | `primary-strong` | `surface`; mark on a `surface` plate |
| Dock (viewport &lt; 1024px) | translucent `primary` | portal secondary; WhatsApp ghost |
| WhatsApp FAB (viewport ≥ 1024px) | `surface` circle | WhatsApp mark |

Section padding: 48px block; 96px from 768px up. Content column: 1120px (`Container` default). Hero and header are full-bleed / floating.

Breakpoints used: **768px** (md layout), **1024px** (header portal vs dock; FAB vs dock).

---

## 3. Shared interaction language

**Cards (Why Us, Programmes, Offers, Departments)**

- Idle: `surface`, 1px `border`, elevation 1, 16px radius, 16px padding.
- Hover lift is **off** on the landing view (`lift` defaults to false).
- `prefers-reduced-motion: reduce` removes transitions.

**Editorial tiles (Insights, Videos, Equipment mosaic)**  
No card chrome. Hierarchy from type, image, and whitespace.

**Information blocks (Branches, About story, Lab-to-Lab, Cautions)**  
Not wrapped in bordered cards. Branches use a divider; Lab-to-Lab uses an indigo panel; cautions use a `warning` wash.

**Buttons (44×44px minimum)**

| Variant | Idle | Hover |
|---|---|---|
| Primary | `primary` fill, `surface` label | `primary-strong` |
| Secondary | `surface` fill, `primary` border and label | `background` fill |
| Text | transparent, `accent` label | `background` + underline |
| WhatsApp filled | `#25D366`, `text` label | slightly darker (`brightness` 0.94) — **not used on landing CTAs** |
| WhatsApp outlined | `surface` fill, `primary` border, `text` label | `background` fill |

On the **hero photograph** and the **compact dock**, the outlined WhatsApp control is restyled to a ghost: transparent fill, `surface` border and label, so the Results Portal (secondary / white) stays visually primary.

Focus: 2px `accent` outline, 2px offset, never removed.  
Disabled: `muted` on `background`, **never opacity**. Landing no longer shows disabled View all, Read more, play, Get directions, or map-pin buttons.

**Pending material (dashed frame)**  
1px dashed `muted` border plus an `xs` `muted` sentence naming what is awaited (photography, news module, clinical sign-off, business data, video). Content inside is still drawn; it is not greyed out. The **mark** is no longer pending.

---

## 4. Page chrome (always on, not a content section)

### 4.1 Loading screen

- Full-viewport `surface` overlay, ~1200ms, skipped if reduced motion.
- Owner lockup at `/mark/nel-mark.png`, 96px block-size, no extra wordmark line (the PNG already carries **معامل النيل مصر**). Accessible name: **معامل النيل مصر / Nile Egypt Lab**.

### 4.2 Header (sticky, 8px from the top, 16–24px inline inset)

- Height 56px; 72px from 768px. 24px pill radius. Frosted indigo.
- After 4px scroll: `primary-strong` mix, elevation 2.
- **Mark:** `/mark/nel-mark.png` on a white plate (readable on indigo). 40px block-size below 768px, 52px from 768px. Links to `#home`. Accessible name معامل النيل مصر / Nile Egypt Lab. No dashed pending frame.
- **Nav** (same-page hashes only):

| href | AR | EN |
|---|---|---|
| `#home` | الرئيسية | Home |
| `#about` | عن المعمل | About |
| `#programmes` | البرامج | Programmes |
| `#branches` | الفروع | Locations |
| `#offers` | العروض | Offers |
| `#insights` | المستجدات | Insights |

Equipment, Departments, Videos, Cautions, Lab-to-Lab, and Contact are **not** in the primary nav. They sit in the page (About, Insights, Videos, footer).

- Below 768px: hamburger **القائمة / Menu**; links drop onto a white sheet with dark type.
- Nav hover (desktop, on indigo): `surface` type on a 16% white mix.
- **Language switcher:** pill, shows the *target* (`EN` on Arabic, `AR` on English).
- **Results Portal** in the header from **1024px** up (secondary). Compact viewports use the dock instead. Landing header does **not** carry WhatsApp.

### 4.3 Floating WhatsApp (desktop)

- 56px circle, bottom-end, `surface`, elevation 2.
- **Shown from 1024px up** (`display: none` below). Compact viewports use the dock instead — FAB and dock never show together.
- Opens `https://wa.me/200000000000` (placeholder number, not a real hotline).
- Accessible name: **تواصل عبر واتساب / Chat on WhatsApp**.

### 4.4 Dock (compact)

- Fixed 24px pill, indigo, 16px from the edges.
- **Shown below 1024px**; hidden from 1024px up. Always present on compact (not scroll-gated). Region name **تواصل معنا / Get in touch**.
- Actions: Results Portal (secondary / white) + WhatsApp outlined, restyled as a ghost so the portal stays heavier.
- `main` has 96px padding-block-end below 1024px so the last section clears the dock.

---

## 5. Landing sections (in render order)

Hero is full-bleed. Other sections use the 1120px container unless noted.

### 5.1 Hero (`#home`)

**Layout.** Photograph under the floating header (~88–92vh). Copy sits on the photo at inline-start in English and inline-end in Arabic — physically the left in both locales, because the still is cropped at `object-position: 68% center` so the lab stays on the right. Indigo wash from the copy side plus a fade from the block-end. Trust strip is a full-bleed indigo band under the photo.

**Photograph.** Owner-attached laboratory still at `/preview-stock/hero.jpg` (layout judgment, not production photography).

**Copy**

| Key | AR | EN |
|---|---|---|
| Eyebrow | مختبرات تحاليل طبية | Medical laboratory services |
| Headline 1 | رعاية صحية شاملة | Complete health care |
| Headline 2 | لكل أسرة في القاهرة الكبرى | for every family in Greater Cairo |
| Standfirst | شبكة فروع تغطي القاهرة الكبرى وتشكيلة من البرامج الصحية، بخبرة تراكمت على مدى سنوات في خدمة الأسرة المصرية. | A branch network across Greater Cairo and a range of health programmes, built on years of experience serving Egyptian families. |
| Note | صورة معاينة مرفقة للحكم على التخطيط. | Attached preview photograph for layout judgment. |

**Type colour.** Eyebrow `surface` with a 3px `accent` inline-start bar. Line 1 `surface`. Line 2 `accent` mixed with `surface`. Standfirst ~88% `surface`. Headline is `4xl` / weight 700 (56px from 768px).

**Actions (always in the hero)**

1. **الدخول إلى بوابة النتائج / Access the results portal** — secondary (white) button, visually primary. `https://example.invalid/portal-placeholder`, new tab, `noopener noreferrer`. Not a frame.
2. **تواصل عبر واتساب / Chat on WhatsApp** — outlined WhatsApp, ghosted on the overlay (transparent fill, `surface` type). `wa.me` placeholder.

**Trust strip (approved facts, not pending)**

| AR | EN | Qualifier AR | Qualifier EN |
|---|---|---|---|
| 4 فروع | 4 Branches | في القاهرة الكبرى، أحدها المقر الرئيسي | Across Greater Cairo, one head office |
| 9 برامج | 9 Programmes | برامج فحص شاملة منشورة | Published check-up programmes |
| 4 أقسام | 4 Departments | أقسام معملية متخصصة | Specialised laboratory departments |

Plus visual chips: **ISO** (no scheme number) with note شارة اعتماد نائبة — بلا رقم / Placeholder accreditation mark — no number; **الخط الساخن / Hotline** with a skeleton bar (no real number).

Icons are `surface` on the indigo band.

---

### 5.2 Why Nile Egypt Lab (`#why`) — white section

**AR heading / standfirst:** لماذا معامل النيل مصر / أسباب يختارنا عليها الزائر في القاهرة الكبرى.  
**EN:** Why Nile Egypt Lab / Reasons a visitor in Greater Cairo chooses the laboratory.

**Grid:** 1 column → 3 at 768px. Icon wells are `primary` circles with `surface` glyphs. No WhatsApp actions. No request-a-call bar.

| Card | AR title | EN title | Body (short) |
|---|---|---|---|
| Contact | تواصل بسهولة | Contact easily | No booking form; contact uses the page actions |
| Care | رعاية متكاملة | Complete care | Branch network + programmes |
| Support | تواصل مباشر | Direct contact | Enquiries answered; support hours not approved |

**Partners row:** heading شركاؤنا في التأمين / Insurance partners. Five dashed tiles on `background`, labelled شعار شريك (نائب) / Partner mark (placeholder). No real insurer marks.

---

### 5.3 Programmes (`#programmes`) — `background` fill

**البرامج / Programmes**  
برامج فحص شاملة — الأسماء المعتمدة تصل بعد توقيع الفريق الطبي. / Published screening programmes — approved names arrive after clinical sign-off.

Pending clinical gate around three feature cards (not a “View all” row). Titles are synthetic placeholders, not seeded Programme names:

| AR title | EN title | Subtitle |
|---|---|---|
| برنامج فحص نائب 1 — بانتظار توقيع الفريق الطبي | Placeholder programme 1 — awaiting clinical sign-off | نص فرعي تجريبي / Sample subtitle |
| برنامج فحص نائب 2 — … | Placeholder programme 2 — … | same |
| برنامج فحص نائب 3 — … | Placeholder programme 3 — … | same |

Indigo icon wells. Grid 1 → 3 at 768px. No disabled View all.

---

### 5.4 Branches / فروعنا (`#branches`) — white section

The former Locations card-band module is **merged here**. Header **الفروع / Locations** points at this single `#branches` region.

**فروعنا / Our branches**  
اعثر على أقرب فرع / Find a branch near you

Large map (drawn Greater Cairo SVG, pending coordinates). District labels: الجيزة، القاهرة، المعادي / Giza, Cairo, Maadi. Pins are non-interactive marks (not disabled buttons). Head-office pin uses `accent`.

Then four **information blocks** (not cards): **فرع 1–4 / Branch 1–4** with pin icon wells and  
العنوان وساعات العمل يصلان بعد اعتماد بيانات العميل. / Address and opening hours arrive after client data is approved.  
Grid 1 → 2 at 768px. No Get directions control.

---

### 5.5 Offers (`#offers`) — indigo (`primary`) section

**العروض / Offers** (white title). No View all.  
عروض قيد الاعتماد — بلا سعر حتى يوافق العميل على المحتوى. / Offers awaiting approval — no price until the client signs off the copy.

Three white pending cards, 1 → 3 columns at 768px:

| AR title | EN title | Body |
|---|---|---|
| عرض قيد الاعتماد 1 | Offer awaiting approval 1 | التفاصيل والسعر يصلان بعد اعتماد العميل. / Details and price arrive after client approval. |
| عرض قيد الاعتماد 2 | Offer awaiting approval 2 | same |
| عرض قيد الاعتماد 3 | Offer awaiting approval 3 | same |

No invented prices.

---

### 5.6 About + Departments + Equipment (`#about`) — white section

One institutional block. `#departments` and `#equipment` remain as in-page ids for deep links; they are not separate colour bands.

**عن المعمل / About the laboratory**  
معمل تحاليل طبية يخدم الأسر في القاهرة الكبرى. / A medical laboratory serving families in Greater Cairo.

**Story:** large family stock photograph (4:3) beside **من نحن / Who we are** and  
النص المعتمد يصل بعد موافقة العميل. هذه الفقرة تملأ التخطيط فقط، وليست وصفاً طبياً. / Approved copy arrives after client sign-off. This paragraph fills the layout only and is not a medical description.

**أقسام المعمل / Departments** (`h3` when nested)  
أربعة أقسام متخصصة تدير عملنا اليومي. / Four specialised departments run our day-to-day work.

Four **approved** name cards (organisational LabUnit names, not LabTest names). No booking action.

| AR | EN |
|---|---|
| علم المناعة | Immunology |
| الكيمياء الحيوية | Chemistry |
| أمراض الدم | Haematology |
| الأحياء الجزيئية | Molecular Biology |

Icon well: `primary` fill, `surface` flask. Grid 2 → 4 at 768px.

**الأجهزة / Equipment** (`#equipment`)  
أجهزة المعمل — بانتظار الصور من العميل. / Laboratory equipment — awaiting client-supplied photographs.

Pending photography mosaic: one large still (microscope) + two smaller (clean lab, samples). Caption صورة جهاز (يوفرها العميل) / Equipment photograph (client-supplied). No View all. Not three identical cards.

---

### 5.7 Insights / المستجدات (`#insights`) — `background` fill

News and Insights are **one** region. Heading **المستجدات / Insights**.  
أخبار من المعمل، محتوى للأسرة، وتنبيهات عند الحاجة. / News from the laboratory, family-facing notes, and cautions when they apply.

Three editorial tiles (not feature cards), 1 → 3 at 768px. Stock photos (microscope, samples, clean lab). Each tile is **pending** (ninth dashboard module). No Read more control.

| | Kicker AR/EN | Date | Title AR | Title EN |
|---|---|---|---|---|
| 1 | من المعمل / From the laboratory | اغسطس 2026 / August 2026 | كيف نجهّز يوم الاستقبال في الفروع | How a branch prepares for the morning intake |
| 2 | للأسرة / For families | same | ماذا تتوقع الأسرة في أول زيارة للمعمل | What a family can expect on a first visit |
| 3 | الجودة / Quality | same | روتين يومي داخل أقسام المعمل | A day inside the laboratory departments |

Kicker is `accent` `xs`. Title `lg` 600 `text`. Excerpt `sm` `muted`. Copy is layout-only; no LabTest names.

**Caution (semantic, not a news card).** Pending clinical. `warning` icon + kicker **تنبيه / Caution**, light `warning` wash, `text` heading:  
تنبيه عام للزائر — بانتظار توقيع الفريق الطبي / General visitor caution — awaiting clinical sign-off.  
Body states the frame is not medical instruction.

---

### 5.8 Videos (`#videos`) — white section

**فيديوهات / Videos**  
ثلاثة مقاطع — ملفات الفيديو لم تُسلَّم بعد. / Three films — video files have not been supplied yet.

Three editorial tiles (not the Why Us card). Stock posters (clinic, care, family). Decorative play mark (`aria-hidden`, not a disabled button). Duration badges `2:30`, `3:15`, `1:45` on a dark translucent chip (the one allowed translucent fill — on a poster, not on body text). Titles and descriptions are placeholder copy, not skeletons. Nothing loads a player or YouTube.

---

### 5.9 Lab-to-Lab (`#lab-to-lab`) — `background` wrap, indigo panel

Pending clinical. Inner `primary-strong` panel (not a generic card).

**معامل للمعامل / Lab-to-Lab**  
مقدمة قصيرة لشراكات المعامل. النص الكامل يصل بعد اعتماد العميل، ولا يُعرض محتوى سريري هنا. / A short introduction to laboratory partnerships. Full copy arrives after client approval. No clinical content is shown here.

Note: التواصل مع هذا المسار يتم عبر أزرار الصفحة، وليس عبر نموذج. / Contact for this path uses the page actions, not a form.

No extra Portal or WhatsApp cluster in this section.

---

### 5.10 Footer (`#contact`) — `primary-strong`

No sitemap. No extra Portal + WhatsApp CTA cluster.

1. **Four square media tiles** (clinic, care, family, stethoscope stock), 1:1, 16px radius.
2. **تابعنا / Follow us** — Facebook, Instagram, X, YouTube as **non-controls** (dashed circles, `role="img"`, no disabled buttons). WhatsApp is the live `wa.me` placeholder icon.
3. Note: روابط الحسابات تظهر بعد إدخالها في إعدادات الموقع. / Account links appear once they are entered in Site Settings.
4. **Mark** `/mark/nel-mark.png` on a white plate (64px). Contact chips pending business data, values **يُستكمل لاحقاً / To be confirmed** (not skeleton bars): الخط الساخن، واتساب، المقر الرئيسي / Hotline, WhatsApp, Head office.
5. **سياسة الخصوصية** (text only, no page) and **معامل للمعامل / Lab-to-Lab** → `#lab-to-lab`.
6. Notice: معاينة داخلية فقط، وليست نسخة منشورة. جميع البيانات وهمية. / Internal preview only, not a published version. All data is synthetic.

---

## 6. Action inventory

Live outbound (new tab):

| Action | Where | Target |
|---|---|---|
| Results portal | Hero (primary visual); header ≥1024px; dock &lt;1024px | `https://example.invalid/portal-placeholder` |
| WhatsApp | Hero (secondary ghost); FAB ≥1024px; dock &lt;1024px; footer icon | `https://wa.me/200000000000` |

Same-page hashes: header nav (six items), header mark → `#home`, footer Lab-to-Lab.

In-page only: locale toggle, mobile menu.

**Not on this page as controls:** View all, Read more, video play button, map pin buttons, Get directions, Facebook/Instagram/X/YouTube as links, privacy (plain text), ISO (not a link), insurance tiles.

**Never on this page:** contact form, booking form, newsletter, insurance checkout, phone `tel:` links, embedded maps, YouTube, real addresses, real hotline, real ISO number, real social URLs, LabTest names, seeded Programme names, patient data, 24/7 support claim, implied online booking.

---

## 7. Layout summary

```
[loading 1.2s — lockup]
[floating indigo header — logo, 6 nav items, language, portal ≥1024]
[hero photo + overlay copy + Portal primary / WhatsApp secondary]
[indigo trust strip]
[white: why — 3 feature cards + 5 partner tiles]
[wash: 3 programme cards]
[white: map + 4 branch information blocks]
[indigo: 3 offer cards]
[white: about story + 4 departments + equipment mosaic]
[wash: 3 insight tiles + warning caution]
[white: 3 video tiles]
[wash: indigo lab-to-lab panel]
[indigo footer: 4 photos, social placeholders, logo, awaiting chips]
[FAB ≥1024] [dock <1024]
```

Logical CSS properties throughout (inline-start/end, block-start/end). Arabic line-height 1.75 body / 1.40 headings; English 1.50 / 1.20.

---

## 8. What this mock is for

Judge structure and colour rhythm (white-led, indigo reserved), photography-on-hero, Results Portal as the primary conversion, WhatsApp as a global action (not repeated in cards), header vs FAB vs dock exclusivity, merged Branches / Insights, and the owner lockup on indigo chrome.

It is **not** signed content, **not** a G3 public-site deliverable, and **not** a change to `DESIGN_SYSTEM.md` until those choices are frozen.
