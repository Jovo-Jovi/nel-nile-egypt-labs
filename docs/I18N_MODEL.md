# NEL — I18N Model

**Status:** AUTHORED at P02-T05 · 2026-08-26
**Vocabulary:** frozen `GLOSSARY.md` · 2026-08-25, as superseded in part by its §7.
Public path segments are Visitor-facing strings governed by `CONTENT_MODEL.md` §3c,
not identifiers.
**Authored under:** OD-05 bound 3 — this document precedes `DESIGN_SYSTEM.md` because
Arabic typography and RTL constrain the design system, not the reverse.
**Decisions this file records:** D-10, D-25, D-26, D-27, D-28.
**Precedence:** document 6. `PRODUCT_BRIEF.md`, `GLOSSARY.md`, `DECISIONS.md`,
`SCOPE.md`, `CONTENT_MODEL.md` and `BOUNDARY_MODEL.md` all outrank it. Where this
document appears to conflict with any of them, they win and the conflict is raised as
a formal amendment, never reconciled silently.

Counts stated here are enumerated in the sections that follow and are verified
programmatically before landing (PR-01, PR-28). Route and locale cardinalities are
computed from `CONTENT_MODEL.md` §3c, not re-derived by hand.

`SECURITY_MODEL.md` (document 5) is not yet authored. Nothing in this file decides a
security question, and nothing here pre-empts it.

---

## §1 What this document governs

Every Visitor-facing string, every locale-dependent route, the direction of every
layout, the typography of both scripts, and the rules a reviewer applies when checking
bilingual evidence at a gate.

It does not govern the Operator dashboard's own chrome language. That is a separate
question, deferred to `ADMIN_SPEC.md`, and it is named as a carry-forward rather than
assumed.

---

## §2 Locales

Two. No more are planned and none may be added without an OD.

| Locale | Tag | Script | Direction | Status |
|---|---|---|---|---|
| Arabic | `ar` | Arabic | RTL | **Default** (D-10) |
| English | `en` | Latin | LTR | Secondary |

**Arabic is the default and this is structural, not cosmetic.** `/` redirects to `/ar`
(`CONTENT_MODEL.md` §3c). Composition is authored Arabic-first and mirrored to English
(OD-07 bound 3). An English-first layout that is later flipped produces Arabic that
reads as a translation of a Latin page, and that is the defect this rule exists to
prevent.

**No locale is inferred from the Visitor.** No `Accept-Language` sniffing, no IP
geolocation, no stored preference. The locale is in the URL and nowhere else. Three
reasons, and the first is binding:

1. Any inference mechanism stores or reads something about the person. `BOUNDARY_MODEL.md`
   §2 holds the platform to no personal data of any kind, and a locale cookie keyed to a
   Visitor is a stored preference about a person.
2. A URL-only locale is cacheable, shareable, and printable. The lab prints addresses.
3. It is verifiable. A reviewer can enumerate 42 URLs and check every one. An inferred
   locale cannot be enumerated.

---

## §3 Routing

Locale is the first path segment on every public page. The complete route set is
`CONTENT_MODEL.md` §3c and is not restated here; this section states only what locale
adds to it.

**Rendered URL count: 42.** Static 12 × 2 locales = 24, dynamic 9 `Programme` detail
pages × 2 = 18. The `/` redirect is locale-agnostic, renders no content, and is not
among the 42. Verify by command against §3c before any claim about coverage.

**Slugs are Latin in both locales.** `/ar/programmes/kidney-profile` and
`/en/programmes/kidney-profile` carry the same slug. A slug is data identity promoted to
a public segment (`CONTENT_MODEL.md` §3c); it is not a translated string, no Arabic slug
set exists, and none is authored. Arabic-script URLs percent-encode to unreadable byte
sequences when copied, pasted or printed, which defeats the reason a slug is public.

**Every page carries an alternate.** Each of the 42 URLs declares `hreflang` for `ar`,
`en` and `x-default`, with `x-default` pointing at the Arabic page. The language switcher
navigates to the same page in the other locale — never to the home page. A switcher that
drops the Visitor at `/` is a defect, not a simplification.

**An unknown locale segment is a 404, not a redirect to default.** `/fr/about` does not
silently become `/ar/about`. Silent coercion makes a typo indistinguishable from a
supported locale and hides broken inbound links.

---

## §4 Direction and layout

**Logical properties only. This is a gate condition, not a preference.**

Forbidden in any stylesheet, inline style or component: `left`, `right`, `margin-left`,
`margin-right`, `padding-left`, `padding-right`, `border-left`, `border-right`,
`text-align: left`, `text-align: right`, `float: left`, `float: right`, and any
directional shorthand that expands to them.

Required instead: `inline-start`, `inline-end`, `margin-inline-start`,
`margin-inline-end`, `padding-inline-*`, `border-inline-*`, `text-align: start`,
`text-align: end`, and the `inset-*` logical forms.

`dir` is set once, on `<html>`, from the locale segment. No component sets `dir` on
itself except under §6. No component branches on locale to choose a physical side; if a
component needs to know the direction, the stylesheet was written wrong.

**Physical properties remain legal in exactly two places**, because neither mirrors:

1. Box shadows and elevation offsets, which are lighting, not reading order.
2. Media assets whose own content is directional — an image is not flipped by the
   layout engine and must not be.

Any other physical property is a FAIL at the bilingual gate.

**Icons that encode direction mirror; icons that encode meaning do not.** Arrows, chevrons,
back and next controls, and progress indicators mirror with the layout. A magnifying
glass, a flask, a clock, a play triangle and the WhatsApp mark do not. A mirrored play
triangle points backwards and a mirrored logo is a different logo.

---

## §5 Numerals

**Western Arabic digits — `0 1 2 3 4 5 6 7 8 9` — in both locales, uniformly.** Ruled
26 August 2026. Eastern Arabic digits (`٠١٢٣٤٥٦٧٨٩`) do not appear anywhere in the
platform, in either locale, in any field.

Rationale, stated so a future instance does not reopen it:

- Egyptian medical and commercial practice overwhelmingly sets Western digits inside
  otherwise-Arabic copy. Prices, hotlines, opening hours and reference values are read
  in Western digits by the audience this site serves.
- Mixing the two systems inside one page is the most common bilingual defect in Arabic
  interfaces and it is very hard to see at review, because both render as "numbers".
  A single rule is checkable by grep; a contextual rule is not.
- The WhatsApp number must be dialable and copy-pasteable. A number set in Eastern
  digits breaks paste into a dialer.

**Enforcement.** No Eastern Arabic digit codepoint (`U+0660`–`U+0669`) appears in any
string catalogue, seed file, `SiteSettings` value or rendered page. This is checkable by
command and the check runs at every bilingual gate.

The check scopes to those four surfaces and excludes this document, which quotes the
forbidden digits above in order to define them. A rulebook that fails its own rule is a
false positive, and a check that has to be explained at every gate gets switched off.

Number, currency and date formatting uses the `ar-EG` locale with the Latin numbering
system explicitly pinned, never the runtime default, because the runtime default varies
by platform and would produce Eastern digits on some platforms and not others. The same
value must render identically everywhere or the rule is not a rule.

---

## §6 Latin inside Arabic, and the isolation rule

Arabic text that contains a Latin run — a `LabTest` abbreviation, a `Programme` slug, a
URL, a `ProgrammeTier` name, an email, a number followed by a Latin measurement abbreviation — reorders under
the bidirectional algorithm unless the run is isolated. Unisolated, `CBC` inside an Arabic
sentence can render adjacent punctuation on the wrong side, and a reviewer reading Arabic
will see it while a reviewer who does not will not.

**Every Latin run inside Arabic text is explicitly isolated.** Either by wrapping in an
element carrying `dir="ltr"`, or by the Unicode isolate pair `U+2066` / `U+2069`. Never
by `U+202A`–`U+202E` embedding or override characters, which do not nest correctly and
which persist past the end of the string.

This is the one place §4's "no component sets `dir` on itself" is relaxed, and the
relaxation is narrow: an isolate wrapper around a Latin run inside Arabic text. It is not
a licence to set direction on a layout container.

**Applies to, non-exhaustively:** `LabTest` names and aliases carrying Latin
abbreviations · `ProgrammeTier` axis values (`Silver`, `Gold`, `Platinum`, `Children`) ·
the `ResultsPortalLink` target when displayed as text · the WhatsApp number · social URLs
· any `SiteSettings` value containing Latin.

---

## §7 Typography

**Two families, maximum. One Arabic, one Latin.** They are matched at optical weight and
at x-height-to-Arabic-body-height, not at nominal weight number. A 400-weight Latin face
next to a 400-weight Arabic face routinely looks mismatched because the numbers describe
different things.

**Rules that bind both families:**

- `letter-spacing: 0`, always, in both locales. Arabic is a connected script and
  letter-spacing breaks the joins. A tracking value applied globally will silently
  disfigure every Arabic word on the site.
- No `text-transform`. Arabic has no case. `text-transform: uppercase` applied to a
  bilingual component is a no-op in Arabic and a style divergence between locales.
- No small-caps, for the same reason.
- Line height is set larger for Arabic than for Latin at the same size. Arabic ascenders,
  descenders and diacritics occupy more vertical space, and a line height tuned to Latin
  crowds Arabic.
- Font loading is self-hosted, `font-display: swap`, subset per script. No third-party
  font CDN: an external font request leaks the Visitor's IP and referer to a third party
  on every page load, which is a `BOUNDARY_MODEL.md` §2 concern independent of any
  performance argument.

**The Arabic face must carry the full diacritic set** and must render `معامل النيل مصر`
correctly at the sizes the mark is used. It is selected before `DESIGN_SYSTEM.md` fixes
a type scale, and the selection is recorded as a decision with the tested string.

**Arabic is not a fallback.** A stack that lists a Latin face first and an Arabic face
second renders Arabic through whatever the system supplies, which is the defect the 2018
site shipped — it loaded three Latin webfonts and no Arabic-capable face at all
(`docs/research/13-brand-extraction.md`).

---

## §8 The string catalogue

**Every Visitor-facing string exists in both `ar` and `en`. No exceptions, no fallback
to the other locale at render time.**

A missing key is a build failure, not a silent fallback. Falling back to English inside
an Arabic page produces a page that is neither locale, passes a smoke test, and reaches
production. The build fails instead.

**Shape.** One catalogue per locale, same key set, keys verified equal by command. Keys
are namespaced by route or component, never by English sentence. `nav.programmes` is a
key; `"Our Programmes"` is not.

**Persisted entity strings are not in the catalogue.** `Programme.name_ar` and
`name_en` live in the database per `CONTENT_MODEL.md` §3a and are Operator-editable. The
catalogue holds chrome: navigation, labels, buttons, error text, empty states, form
labels in the dashboard, and SEO defaults. The dividing line is ownership — if an
`Operator` may edit it, it is data; if only a developer may, it is a catalogue string.

**Bilingual completeness is computed, never asserted.** The count of keys in `ar` equals
the count in `en`, and the key sets are identical, verified by command at every gate that
touches Visitor-facing or Operator-facing text.

---

## §9 What the boundary forbids here

Restating, because i18n is where these leak:

- **No locale preference is stored about a Visitor.** No cookie, no `localStorage`, no
  stored preference record of any kind. §2.
- **No third-party font, translation or analytics request.** Each one discloses the
  Visitor to a party outside this system. §7.
- **No machine translation of clinical content, in either direction.** `LabTest` names,
  `Programme` membership and medical descriptions reach production only under the clinical
  gate with the lab's written sign-off. Arabic clinical terminology is Opus Max and then
  goes to the lab. A mistranslated `LabTest` name on a laboratory site is a harm vector
  and it is invisible to a reviewer who does not read clinical Arabic.
- **The `ResultsPortalLink` is not localised into a frame.** It is an outbound `https://`
  link opening a new browsing context, in both locales. §3c row 10, D-17,
  `BOUNDARY_MODEL.md` §2.

---

## §10 The bilingual acceptance standard, made checkable

A gate touching Visitor-facing or Operator-facing text closes on all six. No evidence is FAIL.

| # | Criterion | How it is proven |
|---|---|---|
| 1 | Both locales render | Rendered evidence at both `/ar/…` and `/en/…` for every route in scope |
| 2 | Logical properties only | Command over the stylesheet and component tree for the §4 forbidden list → 0 |
| 3 | No Eastern Arabic digits | Command for `U+0660`–`U+0669` across catalogues, seed and rendered output → 0 |
| 4 | Latin isolated inside Arabic | Every Latin run in Arabic copy carries an isolate; checked on the rendered Arabic page, not the source string |
| 5 | Catalogue parity | `ar` and `en` key sets identical, verified by command |
| 6 | `dir` and `lang` correct | `<html lang="ar" dir="rtl">` on every `/ar/…` page and `lang="en" dir="ltr"` on every `/en/…` page |

Criterion 4 is the one that cannot be closed by a reviewer who does not read Arabic.
Where that is the case, the verdict says so rather than claiming a pass.

---

## §11 What this document does not decide

Named so no future instance assumes silence is permission.

- The Operator dashboard's own chrome language. Deferred to `ADMIN_SPEC.md`.
- The specific Arabic and Latin faces. Selected before `DESIGN_SYSTEM.md` fixes a type
  scale; the selection lands as a decision with the tested string.
- The type scale, spacing scale and any colour value. `DESIGN_SYSTEM.md`, constrained by
  this document and by OD-07 bound 1.
- Whether search matches across scripts — an Arabic query returning a Latin-named
  `LabTest`. `CONTENT_MODEL.md` records a build-time index across both locales (D-06,
  OD-02); the cross-script matching rule is a search-architecture question and is carried
  forward, not answered here.
- Any security question. `SECURITY_MODEL.md` is unauthored.
