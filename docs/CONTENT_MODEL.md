# NEL — Content Model

**Status:** AUTHORED at P00-T02 · 2026-08-25 · AMENDED at P00-T02-A · 2026-08-25
**Vocabulary:** frozen `GLOSSARY.md` · 2026-08-25, as superseded in part by its §7.
Every entity below is PascalCase and exact. Public path segments are Visitor-facing
strings governed by §3c, not identifiers — see `GLOSSARY.md` §7.
**Decisions this file records:** D-03, D-04, D-05, D-06, D-07, D-13, D-14, D-15, D-16, D-18.

Totals stated in this file are enumerated in the sections that follow and are verified programmatically before landing (PR-01). Seed cardinalities (9 Programmes, 72 LabTests, 121 relationships) are computed from `data/seed/catalogue.json`, not re-derived by hand.

---

## 3h. CF-16 closure check

The frozen GLOSSARY §2 defers two questions to this document. Both are answered here. Neither pointer dangles.

| GLOSSARY §2 deferral | Answer | Decision |
|---|---|---|
| Whether the Platinum sex split is a `ProgrammeTier` value or a second axis | Two axes. `ProgrammeTierAxis` and `AudienceAxis`. Recorded in §3a. | D-05 |
| Whether the `ResultsPortalLink` target is a build-time constant or an Operator-editable value | Build-time constant, host allowlisted, no Operator edit path, no dashboard field. Recorded in §3a. | D-07 |

CF-16 is closed on this confirmation.

---

## 3a. Entity model

Fourteen entities. Visitor-facing strings on every persisted entity that has any are bilingual (`_ar` / `_en`). No entity carries a price except `Offer` (D-04).

| # | Entity | What it is |
|---|---|---|
| 1 | `Programme` | One of nine published check-up programmes. No price field. |
| 2 | `ProgrammeTier` | One selectable slot on a `Programme`, identified by the two D-05 axes. |
| 3 | `ProgrammeLabTest` | Membership of one `LabTest` in one `ProgrammeTier`. |
| 4 | `LabTest` | One laboratory analysis. Seventy-two unique in the seed, PRE-SIGN-OFF. |
| 5 | `LabUnit` | One laboratory department. Four: Immunology, Chemistry, Haematology, Molecular Biology. |
| 6 | `Branch` | One physical laboratory location. Four records, three confirmed (CF-04). |
| 7 | `Offer` | One published promotional offer with validity dates and the price. |
| 8 | `Equipment` | One published piece of laboratory equipment. |
| 9 | `Video` | One published video record. YouTube only; never hosted here. |
| 10 | `Visitor` | A person browsing the public site. Holds no account, submits nothing, is not persisted. |
| 11 | `Operator` | A dashboard user. Minimum two accounts. MFA required (D-08). Touches published site material only. |
| 12 | `ResultsPortalLink` | The outbound link pair to the separate portal application. Not a table. Not Operator-editable. |
| 13 | `SiteSettings` | The singleton of published lab-wide values (hotline, WhatsApp, hours, social URLs, map, default SEO, Lab-to-Lab copy, About body, Privacy Policy body). |
| 14 | `MediaAsset` | One uploaded image in the Media Library, with bilingual alt text. |

### Fields

**`Programme`.** `slug` (data identity, and a public path segment under §3c) · `name_ar` · `name_en` · `description_ar` · `description_en` · `preparationNotes_ar` · `preparationNotes_en` · `published` · `displayOrder`. No price.

**`ProgrammeTier`.** `ProgrammeTierAxis` (`none` \| `Silver` \| `Gold` \| `Platinum` \| `Children`) · `AudienceAxis` (`none` \| `Male` \| `Female`) · `displayOrder`. Belongs to one `Programme`.

**`ProgrammeLabTest`.** `displayOrder` · `sourceName` · `eligibility`. Belongs to one `ProgrammeTier` and one `LabTest`. Seed storage is delta membership: Gold stores Gold-only rows, not the Silver rows the renderer will union in.

`sourceName` holds the seed's `source_name` string verbatim, byte for byte, including its spelling and its qualifier wording. Internal, never Visitor-facing. The clinical gate checks the lab's corrections against what the source said, and a string we did not keep cannot be checked.

`eligibility` is a structured qualifier, never free text. Three parts: `audience` (`all` \| `male` \| `female`) · `minAge` (nullable integer) · `note_ar` / `note_en`, the Visitor-facing wording. `minAge` is descriptive and reaches the Visitor only through the note; the platform never asks a Visitor for an age, and no age is stored (`BOUNDARY_MODEL.md` §2).

Four seed rows carry a qualifier inside `sourceName`, computed by matching `/male|female|both|only|>/i` against `programme_tests[].source_name` in `data/seed/catalogue.json`. They map as follows.

| `Programme` | Seed tier | `LabTest` | `sourceName` verbatim | `audience` | `minAge` |
|---|---|---|---|---|---|
| General Checkup | `Silver` | `psa` | `PSA Total (male>45only)` | `male` | 45 |
| General Checkup | `Platinum — Male` | `psa` | `PSA(total & Free)for male>45 year only` | `male` | 45 |
| Pre-Marital | `''` | `semen-analysis` | `Semen Analysis (Males)` | `male` | null |
| Pre-Marital | `''` | `genetic-counselling` | `Genetic Counseling (Both)` | `all` | null |

The remaining 117 rows default to `audience` = `all`, `minAge` = null, no note. No qualifier is inferred for a row the seed does not qualify.

**`LabTest`.** `slug` · `name_ar` · `name_en` · `aliases` (both locales, one list) · `qaFlag` (internal; never Visitor-facing). `name_ar` is empty on all seventy-two seed rows (CF-14). Material ships behind a feature flag (D-19 / PR-08).

**`LabUnit`.** `name_ar` · `name_en` · `description_ar` · `description_en` · `published` · `displayOrder`. Optional `MediaAsset`.

**`Branch`.** `name_ar` · `name_en` · `isHeadOffice` · `addressLine_ar` · `addressLine_en` · `phone` · `workingHours` · `latitude` · `longitude` · `published` · `displayOrder`. Optional `MediaAsset`. `workingHours` is a structured value rendered by locale formatting, not a translated string. Published business data lives here, never as a literal in application source (PR-16).

**`Offer`.** `title_ar` · `title_en` · `description_ar` · `description_en` · `validFrom` · `validUntil` · `priceAmount` · `priceCurrency` · `published` · `displayOrder`. Optional `MediaAsset`. Optional `Programme` (D-18). `priceCurrency` is stored per `Offer`. No currency is hardcoded in application source, and none is named in this document.

**`Equipment`.** `name_ar` · `name_en` · `description_ar` · `description_en` · `published` · `displayOrder`. Optional `MediaAsset`. Optional `Video`.

**`Video`.** `youtubeId` (YouTube host only) · `title_ar` · `title_en` · `description_ar` · `description_en` · `published` · `displayOrder` · `featured`. Rendered under D-13: privacy-enhanced mode, placeholder until the Visitor clicks. An autoloading embed voids `BOUNDARY_MODEL.md` §5.

**`Visitor`.** No fields. No table. No account.

**`Operator`.** Auth identity only. MFA required. Minimum two. No medical fields. No `ResultsPortalLink` field.

**`ResultsPortalLink`.** Two build-time HTTPS URLs on an allowlisted host: Visitor entry, Lab-to-Lab entry. Either URL may equal the other. No Operator edit path, no dashboard field, no table (D-07). Linked, never framed (D-17). Carry no parameters (`BOUNDARY_MODEL.md` §4 item 6).

**`SiteSettings`.** Singleton. Hotline · WhatsApp number · WhatsApp predefined message (`_ar` / `_en`) · default working hours · social URLs · map · default SEO title and description (`_ar` / `_en`) · Lab-to-Lab copy (`_ar` / `_en`, D-15) · About body (`_ar` / `_en`) · Privacy Policy body (`_ar` / `_en`). No partner-laboratory list (D-15). The public site builds the WhatsApp deep link from these values and opens it client-side (D-09).

**`MediaAsset`.** Storage path · `altText_ar` · `altText_en` · mime type · byte size · width · height.

### Relations and cardinality

| Relation | Cardinality | Notes |
|---|---|---|
| `Programme` → `ProgrammeTier` | one to many | A `Programme` has one or more slots. |
| `ProgrammeTier` → `ProgrammeLabTest` | one to many | Delta membership. |
| `LabTest` → `ProgrammeLabTest` | one to many | One `LabTest` appears on many slots. |
| `Offer` → `Programme` | many to zero-or-one | Nullable. An `Offer` may reference one `Programme`; it is never required to (D-18). |
| `Equipment` → `Video` | many to zero-or-one | Optional linked `Video`. |
| `Offer` → `MediaAsset` | many to zero-or-one | |
| `Equipment` → `MediaAsset` | many to zero-or-one | |
| `LabUnit` → `MediaAsset` | many to zero-or-one | |
| `Branch` → `MediaAsset` | many to zero-or-one | |
| `SiteSettings` | one | Singleton. No relation to a partner-laboratory list. |
| `Visitor` | zero | Not persisted. |
| `ResultsPortalLink` | zero rows | Build-time constants, not a relation. |
| `Operator` | many (minimum two) | Auth, not a catalogue relation. |

### D-05 mapping of the seed's eight `ProgrammeTier` values

The seed carries eight distinct values, computed from `data/seed/catalogue.json`. They resolve onto the two axes as follows. This mapping produces fourteen `ProgrammeTier` rows.

| Seed value | `ProgrammeTierAxis` | `AudienceAxis` | On `Programme` | Rows |
|---|---|---|---|---|
| `Silver` | `Silver` | `none` | General Checkup | 1 |
| `Gold` | `Gold` | `none` | General Checkup | 1 |
| `Platinum — Female` | `Platinum` | `Female` | General Checkup | 1 |
| `Platinum — Male` | `Platinum` | `Male` | General Checkup | 1 |
| `Children` | `Children` | `none` | General Checkup | 1 |
| `Male` | `none` | `Male` | Infertility | 1 |
| `Female` | `none` | `Female` | Infertility | 1 |
| `''` (empty) | `none` | `none` | the seven untiered Programmes | 7 |

Seven untiered Programmes, enumerated: Kidney Profile · Liver Profile · Diabetes · Cardiovascular Profile · Joint & Bone Pain · Pregnancy Follow-Up · Pre-Marital.

Nine Programmes, enumerated: General Checkup · Kidney Profile · Liver Profile · Diabetes · Cardiovascular Profile · Joint & Bone Pain · Infertility · Pregnancy Follow-Up · Pre-Marital.

Four `LabUnit` records, enumerated: Immunology · Chemistry · Haematology · Molecular Biology.

---

## 3b. Cumulation rule

A renderer given a `Programme` and a selected (`ProgrammeTierAxis`, `AudienceAxis`) pair returns the `LabTest` set as follows. Seed membership is delta: Gold stores Gold-only rows.

1. If `ProgrammeTierAxis` is `Children`: return only the membership rows of that `Programme` whose `ProgrammeTierAxis` is `Children`. Stop. Do not union Silver, Gold, Platinum, or any other slot.
2. If `ProgrammeTierAxis` is `Silver`, `Gold`, or `Platinum`:
   - Start with membership whose `ProgrammeTierAxis` is `Silver`.
   - If the selection is `Gold` or `Platinum`, union membership whose `ProgrammeTierAxis` is `Gold`.
   - If the selection is `Platinum`, union membership whose `ProgrammeTierAxis` is `Platinum` and whose `AudienceAxis` matches the selected `AudienceAxis`.
3. If `ProgrammeTierAxis` is `none`: return membership whose `ProgrammeTierAxis` is `none` and whose `AudienceAxis` matches the selected `AudienceAxis` (`Male`, `Female`, or `none`). No cumulation.
4. **Eligibility filter.** Apply to the set produced by step 2 or step 3, after the union. Step 1 returns before this step and is not governed by it. For each row in the set, read `eligibility.audience`:
   - `all` — the row always renders. No note.
   - `male` or `female`, and the selected `AudienceAxis` is `Male` or `Female` — the row renders if the two match, and is **excluded from the rendered set** if they do not. An excluded row is removed, not annotated, not greyed, not shown with a caveat.
   - `male` or `female`, and the selected `AudienceAxis` is `none` — the row renders **with its `note_ar` / `note_en` shown inline**, in the active locale. It is not silently dropped and it is not silently shown bare.

**Hard constraint — Children is standalone.** Step 1 is not a display preference and is not a configuration flag. Reason: Silver membership includes PSA (source wording "PSA Total (male>45only)"); Platinum — Female membership is seven tumour markers (CEA, CA 15.3, CA 125, APP, CA 242, CA 19.9, NSE). A cumulative Children slot would render PSA and those seven tumour markers on a child's page. That is a harm vector (D-06).

**Hard constraint — the eligibility filter is not cosmetic.** PSA is carried by Silver. Silver unions into Gold, and Silver unions into Platinum. Without step 4 the renderer shows a prostate marker to every Visitor selecting Gold, and to every Visitor selecting Platinum — Female. That is the same harm class as the Children constraint, reached by a different route: not an inherited slot, but an inherited row inside a slot the Visitor did select. Step 4 is therefore a rendering constraint of the same rank as step 1, and neither is a configuration flag.

Selected-set sizes under this rule, computed against `data/seed/catalogue.json`:

| Selection | Rendered size | `psa` rendered |
|---|---|---|
| `Silver` / `none` | 13 | yes, with its note |
| `Gold` / `none` | 21 | yes, with its note |
| `Platinum` / `Female` | 27 | no — excluded by step 4 |
| `Platinum` / `Male` | 26 | yes |
| `Children` / `none` | 13 | no — never unioned |

---

## 3c. Route enumeration

Public routes only. The Operator dashboard is not public and is not counted here. FAQ is optional in the draft quotation if copy is supplied; no OD includes it; it is not a route. The phase-map claim of 13 is not authoritative (PR-01).

Path segments below are Visitor-facing strings, not identifiers. They are governed by this mapping table and by `GLOSSARY.md` §7, which supersedes the words "route segments" in §6. Every segment is lowercase-kebab. Locale segment `{locale}` is `ar` or `en`.

| # | Kind | Pattern | Entity | Page |
|---|---|---|---|---|
| — | redirect | `/` | — | Redirects to `/ar`. Arabic is default. Renders no content. |
| 1 | static | `/{locale}` | — | Home |
| 2 | static | `/{locale}/about` | `SiteSettings` | About |
| 3 | static | `/{locale}/departments` | `LabUnit` | `LabUnit` listing |
| 4 | static | `/{locale}/programmes` | `Programme` | `Programme` listing, and the search UI |
| 5 | static | `/{locale}/offers` | `Offer` | `Offer` listing |
| 6 | static | `/{locale}/videos` | `Video` | `Video` listing |
| 7 | static | `/{locale}/equipment` | `Equipment` | `Equipment` listing |
| 8 | static | `/{locale}/locations` | `Branch` | `Branch` listing |
| 9 | static | `/{locale}/contact` | `SiteSettings` | Contact — WhatsApp deep link, no form |
| 10 | static | `/{locale}/online-results` | `ResultsPortalLink` | Outbound portal page (D-14) |
| 11 | static | `/{locale}/privacy-policy` | `SiteSettings` | Privacy Policy (D-13) |
| 12 | static | `/{locale}/lab-to-lab` | `SiteSettings` | Lab-to-Lab copy (D-15) |
| 13 | dynamic | `/{locale}/programmes/{slug}` | `Programme` | One detail page per `Programme` |

`{slug}` is `Programme.slug`, which is now a public path segment and no longer data identity only. Slugs are Latin in both locales: the Arabic page at `/ar/programmes/kidney-profile` carries the same slug as the English one. A slug is not a translated string, so no Arabic slug set exists and none is authored.

**Static pattern count:** 12.
**Dynamic pattern count:** 1.
**Locales:** 2 (`ar`, `en`).
**Programmes:** 9, computed from `data/seed/catalogue.json`.
**Rendered URL count:** static 12 × 2 = 24 · dynamic 9 × 2 = 18 · **total 42.**

The `/` redirect is locale-agnostic, exists once, and renders no content, so it is not among the 42.

This differs from the phase-map claim of 13, and from the 24 this document stated at 3bf5dd2. The 13 was never enumerated. The 24 omitted the `Programme` detail route entirely. `SESSION_CONTEXT.md` is amended to 42.

---

## 3d. Module enumeration

Eight dashboard modules (D-16). Login is authentication, not a module. Activity log is a platform feature. The quotation's incoming-message inbox is struck (D-09). There is no ninth module (D-15). There is no Operator edit path for `ResultsPortalLink` (D-07).

| # | Module | Entity it manages |
|---|---|---|
| 1 | Offers | `Offer` |
| 2 | Videos | `Video` |
| 3 | Equipment | `Equipment` |
| 4 | Branches | `Branch` |
| 5 | Programmes | `Programme`, `ProgrammeTier`, `ProgrammeLabTest` |
| 6 | LabUnits | `LabUnit` |
| 7 | Site Settings | `SiteSettings` |
| 8 | Media Library | `MediaAsset` |

---

## 3e. Bilingual rule

Every Visitor-facing string exists in `ar` and `en`. Arabic is default (D-10).

CF-14 block, recomputed from `data/seed/catalogue.json` at T02:

- All 72 `LabTest` `name_ar` values are empty. P04 cannot match an Arabic query on `name_ar` for any `LabTest`. P06 cannot publish bilingual `LabTest` names until those values are filled and clinically signed off.
- Twelve `LabTest` rows also carry no Arabic alias, so they have no Arabic search surface at all. Enumerated: `hscrp` · `ca-242` · `ca-19-9` · `nse` · `ggt` · `beta-crosslaps` · `rose-waaler` · `lh-fsh-ratio` · `cmv-igg` · `cmv-igm` · `hsv-igg` · `hsv-igm`.

Operator UI language is not decided here.

---

## 3f. Search index shape

Built at build time. Queried client-side. No server round trip (D-03). One record per `LabTest`.

**The index is gated by the PR-08 clinical flag.** The build emits the index only when the `LabTest` flag is on. With the flag off, no index artefact is emitted at all — not an empty one, not a partial one — and the search UI does not render on `/{locale}/programmes`. A flag that hides a listing while a static file serves the same names is not a flag: the artefact is fetchable, and a `LabTest` name that has not been signed off would be published by anyone who requested it directly.

**P04 consequence, stated plainly.** Search does not ship until the lab's written clinical sign-off lands. P04 must be sequenced after sign-off, or shipped dark behind the same flag and opened when sign-off arrives. It cannot be sequenced as though the flag were a display toggle. Tracked as a carry-forward owned by the reviewer.

| Field | Locales | Source |
|---|---|---|
| `slug` | — | `LabTest.slug` |
| `name_en` | `en` | `LabTest.name_en` |
| `name_ar` | `ar` | `LabTest.name_ar` (empty × 72 until CF-14 closes) |
| `aliases` | `ar` and `en`, one list | `LabTest.aliases` |
| `membership` | — | Distinct `Programme.slug` values reached through `ProgrammeLabTest` / `ProgrammeTier`, any axis |

A query matches `name_en`, `name_ar`, and every alias. A hit returns the `LabTest` and the Programmes that contain it.

**Where a hit lands.** A hit lands on `/{locale}/programmes/{slug}`, the detail route added in §3c, one link per `Programme` in `membership`. The WhatsApp deep link remains available from that page and from `/{locale}/contact`; it is no longer the only destination a hit can offer. The index itself is a build artefact, not a public route.

---

## 3g. Boundary statement

No entity, relation or field in this document accepts personal or medical data. `Visitor` is not persisted. `Operator` holds an Auth identity and MFA, and touches published site material only. `LabTest` names, `ProgrammeTier` membership and medical descriptions are the lab's published catalogue, not a person's medical record, and they ship behind the PR-08 feature flag until written clinical sign-off lands.

Two outbound surfaces, and only two:

1. **WhatsApp deep link** — built from `SiteSettings`, opened client-side. No form, no booking, no inbox (D-09).
2. **`ResultsPortalLink`** — two build-time HTTPS URLs, allowlisted host, no parameters, new browsing context, never framed (D-07, D-17).

An autoloading YouTube embed is not an outbound surface in this list; it is a boundary breach of `BOUNDARY_MODEL.md` §5 and evidence item 7, and D-13 forbids it.
