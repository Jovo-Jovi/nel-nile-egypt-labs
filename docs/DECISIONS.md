# NEL — Decisions

**Status:** AUTHORED at P00-T02 · 2026-08-25
**Binding on:** every prompt issued, every document authored, every identifier written
**Supersedes:** the unsigned draft quotation where a row below says so. The draft is not deleted; the conflict is named and owned as a carry-forward.

Thirty-two decisions. Seven of them are filed as formal Operational Decisions (OD-01, OD-02, OD-03, OD-04, OD-05, OD-06, OD-07). A decision is in force when it appears here. Conversation does not amend this file.

---

## Formal Operational Decisions

### OD-01 — Hosting region

**Status:** DECIDED
**Decides:** the selection rule, not the region.
**Rule:** at Supabase project creation, enumerate the regions the CLI reports as available, select the nearest to Cairo, and paste that CLI output into this OD as the evidence. The resolved region lands as an OD-01 amendment at P01.
**Not a legal constraint:** the platform stores no personal data, so residency is a latency choice.
**CLI evidence (P01):** SUPERSEDED by the 26 August 2026 amendment below, which records the resolved region and states the evidence actually available.

**Amendment — 26 August 2026 · region resolved.**

**Region: `eu-central-2` (Central Europe — Zurich).** Selected 26 August
2026. The project exists and its region is fixed; Supabase does not permit
a region change after creation.

**Why this region.** OD-01's rule is the region nearest to Cairo. Great-
circle distances from Cairo (30.04N, 31.24E): Zurich ~2,750 km · Frankfurt
~2,940 km · Paris ~3,240 km · London ~3,510 km · Mumbai ~4,375 km. Zurich
is nearest. OD-01's instruction not to assume a Middle East region exists
was correct: Supabase's seventeen specific regions run from West US to São
Paulo and include none in the Middle East or Africa.

**Evidence, stated as it actually is.** OD-01 specified CLI enumeration at
project creation. The project was created through the Supabase dashboard,
so no CLI enumeration output exists. The evidence of record is instead the
published region list at
https://supabase.com/docs/guides/platform/regions, read 26 August 2026, and
the human's report of the selected region. This amendment does not
represent dashboard selection as CLI output.

**Project ref withheld.** OD-01 asked for the CLI output to be recorded
here. OD-04 condition 1 forbids a project ref in any commit. Where those
conflict, OD-04 wins: this amendment records the region and the enumeration
evidence, and the project ref is not written to any tracked file. OD-01's
recording requirement is discharged by the region and the reasoning, which
is what it existed to evidence.

**Open consequence.** Switzerland is not an EU member state. No patient or
visitor personal data exists anywhere in this system, so no PHI residency
question arises. From P05 the Supabase Auth schema will hold Operator email
addresses — the lab's own staff, not patients. Switzerland holds a GDPR
adequacy decision and its own revised FADP, so this is very likely
unproblematic, but it is not a determination this project is competent to
make. Tracked as a carry-forward against P05.

### OD-02 — Search

**Status:** DECIDED
**Decides:** a static index is built at build time and queried client-side across every `LabTest` name and alias in both locales. No server round trip. Seventy-two records do not justify one.
**Index shape:** `CONTENT_MODEL.md` §3f.

### OD-03 — Scope freeze

**Status:** SIGNED
**Signed:** 25 August 2026
**Lapses:** 15 September 2026 if no signed quotation is filed.
**Decides:** development proceeds against the draft quotation as amended by this OD and by D-01 through D-19. `SCOPE.md` still derives from a signed quotation; until that quotation is filed, this OD is the freeze.
**On lapse:** if 15 September 2026 arrives with no signed quotation, this OD expires and no further build task is issued until a new freeze is signed.

### OD-04 — Repository visibility

**Status:** SIGNED
**Signed:** 25 August 2026
**Decides:** the repository is PUBLIC during development, for review
convenience, and reverts to PRIVATE before production cutover.
**Reverts when:** at P07, before DNS cutover. The revert is a G7 checklist
item. Until it is done, G7 does not pass.
**Conditions, binding while public:**
1. No credential, key, token, project ref or connection string in any
   commit. PR-10 stands; the exposure window is now immediate rather than
   theoretical.
2. No operational weakness assessment of a third-party system in any tracked
   file. The dependency is tracked; the assessment lives in client
   correspondence.
3. No CI trigger that runs fork-supplied code with repository context.
4. The clinical QA flags are unconfirmed readings of a public 2018 page, not
   assertions of clinical error, and every file carrying them says so.
**Not decided here:** whether the client consented to publication. That
question is open and is tracked as a carry-forward owned by the human.
**Known limit:** anything already pushed at `45ef104` is already public.
This OD governs forward state only. Removing published history requires a
rewrite and a force-push and is not authorised by this OD.

### OD-05 — Phase order: P02 design work pulled ahead of P01 completion

**Status:** SIGNED
**Signed:** 26 August 2026
**Decides:** P02 design work — brand extraction, I18N_MODEL.md,
DESIGN_SYSTEM.md, and a single static landing-page mock — proceeds while
P01 is incomplete.
**Why:** P01-T03-R is blocked on CF-34 (no local Postgres, no container
runtime, no elevation) with no resolution date. OD-03's scope freeze lapses
15 September 2026 and a visual is the artefact most likely to convert the
unsigned quotation. Idle sequencing serves nobody.
**Bounds:**
1. G1 is not reached and is not claimed. P01 remains open.
2. No design task touches schema, routes beyond the existing placeholder,
   storage, or LabTest content. The boundary and clinical gates are
   unaffected and remain non-waivable.
3. I18N_MODEL.md is authored before DESIGN_SYSTEM.md, per the precedence
   order. RTL and Arabic typography constrain the design system.
4. The landing-page mock is a mock. It is not a P03 deliverable, does not
   satisfy any part of G3, and is replaced wholesale at P03.
5. P01 resumes at T03-R the moment CF-34 clears. Design work does not
   become an excuse to leave the schema unbuilt.
**Does not decide:** whether the mock is shown to the client before the
quotation is signed. That is a commercial call owned by the human.

---

### OD-06 — Bounded brand read of the results portal

**Status:** SIGNED
**Signed:** 26 August 2026
**Records retroactively:** two fetches of `nileegyptlabresults.com` performed 26
August 2026 for brand extraction, authorised in conversation before this OD existed.
`BOUNDARY_MODEL.md` §3 requires separate written scope for any assessment of that
system, and PR-18 holds that conversation is not authority. This OD supplies the
written scope and records what was done.
**Decides:** a bounded read of the results portal is authorised for brand extraction
only — a `GET` of the listed URL and its redirect target, plus only the stylesheet,
webfont, favicon and image URLs appearing in those documents' own markup.
**Forbidden, and observed as forbidden in both fetches:** submitting any credential ·
following any navigation link · any URL bearing a query parameter not delivered in
the markup · any path containing `report`, `result`, `patient` or a record id · any
archive or mirror · fetching the application JavaScript bundles.
**Not authorised, explicitly:** the Angular application bundles. Component styles
live there, so the painted login view is UNDETERMINED. That limit stands and is not
reopened for marginal certainty about a palette.
**Does not decide:** any integration, modification or coupling with the results
portal. D-17 stands — linked, never framed. No brand asset produced by this project
is applied to that system.
**Boundary position:** no patient record was rendered on any fetched URL and none was
sought. The portal remains the patient-data surface and remains out of scope.

### OD-07 — Brand refinement enters website scope

**Status:** SIGNED
**Signed:** 26 August 2026
**Amends:** OD-03. Brand refinement is absent from the draft quotation; adding it
under an active freeze requires this OD.
**Client position, recorded as it is:** approved **verbally** on 26 August 2026. Not
filed in writing. This OD does not represent a verbal approval as written
confirmation. Carried forward until the quotation is signed.
**Commercial position:** pricing deferred by the human. This OD adds unpriced work to
a quotation already carrying CF-17 and CF-18 as outstanding repricing items.
**Decides:** the engagement includes **Website UI/UX Modernization + Light Brand
Refinement**, not Brand Identity Design. The existing bilingual flask lockup is the
primary identity reference. The expression is modernised; the identity is preserved.
**In scope:** logo refinement and vector-style reconstruction from the existing mark ·
primary, compact, light and dark variants · a restrained digital colour palette ·
bilingual typography direction · a UI design system · application across the website.
**Out of scope, quotable separately:** alternative logo concepts · logo exploration ·
corporate identity manual · stationery, signage, vehicle or packaging systems ·
brand guidelines · naming or positioning · any full rebrand.
**Bounds:**
1. **No hex value is fixed by this OD.** Blue / navy / teal is a stated direction,
   not a token set. `DESIGN_SYSTEM.md` fixes hex only after the mark is sampled at
   the glyph. Neither stock palette — Medinova `#ffd133`, Kendo `#ff6358`, Bootstrap
   `#007bff` — is a source.
2. **No deliverable is applied to the results portal.** OD-06 and D-17 bind.
   Scalability is constrained by favicon, app icon at 16px, and mobile header.
3. **Composition is Arabic-first, mirrored to English** (D-10). `I18N_MODEL.md` is
   authored before `DESIGN_SYSTEM.md` per OD-05 bound 3; Arabic typography
   constrains the type system, not the reverse.
4. **`result` and `patient` do not enter the design system.** Publishing status
   tokens are `StatusState` and cover `Offer`, `Programme` and `Operator` states
   only. No token renders clinical or patient status. GLOSSARY §5 binds.
5. **Glyph provenance is confirmed.** The client confirmed verbally on 26 August 2026
   that the flask symbol is theirs. Reconstruction may therefore proceed and its
   output is NEL's to own.
6. **No editable original exists.** The client holds no AI, EPS, SVG, PDF or
   high-resolution raster. Reconstruction sources are the 2018 favicon at 139×140 and
   the 2025 Facebook cover at 960×541, and nothing else. A reconstruction from
   compressed raster is stated as such wherever the mark is documented.
**Does not decide:** the number of chromatic families, or whether the refined mark
needs the lab's written approval before launch. Both are carried forward.

---

## Decision log

### D-01 — Scope freeze

OD-03, signed 25 August 2026, lapses 15 September 2026 if no signed quotation is filed. Development proceeds against the draft quotation as amended by OD-03.

### D-02 — Hosting region

OD-01. Decides the selection rule, not the region: enumerate available Supabase regions by CLI at project creation, select the nearest to Cairo, record the CLI output in this file as the evidence. The resolved region lands as an OD-01 amendment at P01. The platform stores no personal data, so residency is a latency choice and not a legal constraint.

### D-03 — Search

OD-02. Static index built at build time, queried client-side across all `LabTest` names and aliases in both locales. No server round trip. Seventy-two records do not justify one.

### D-04 — Prices

No price field on `Programme`. Price lives on `Offer`, which already carries validity dates, so a stale price expires by itself. Adding a price to `Programme` later is a migration.

### D-05 — ProgrammeTier

Two axes. `ProgrammeTierAxis` (`none` | `Silver` | `Gold` | `Platinum` | `Children`) and `AudienceAxis` (`none` | `Male` | `Female`). The seed's "Platinum — Female" resolves to (`Platinum`, `Female`); Infertility "Male" resolves to (`none`, `Male`); the seven untiered Programmes resolve to (`none`, `none`). Supersedes the single-axis reading the frozen GLOSSARY defers to `CONTENT_MODEL.md`.

### D-06 — Cumulation

Silver → Gold → Platinum cumulative. Children is standalone and never inherits from any `ProgrammeTierAxis`. Reason: a cumulative Children axis renders PSA and seven tumour markers on a child's page. This is a harm vector, not a display preference, and it is not a configuration flag. The renderer rule is in `CONTENT_MODEL.md` §3b.

### D-07 — ResultsPortalLink

Build-time constant, target host allowlisted, no Operator edit path, no dashboard field. Supersedes the deferral in the frozen GLOSSARY.

### D-08 — Operator accounts

Minimum two. MFA is REQUIRED, not optional. GLOSSARY §2 is precedence 1 and beats draft quotation §2.3; the quotation is amended to match the build, never the reverse.

### D-09 — Contact

WhatsApp deep link only, opened client-side. No form, no booking, no inbox. The quotation's incoming-message inbox module is struck from the module list. Adding a form later is a `BOUNDARY_MODEL.md` amendment plus a changed compliance position plus separate paid scope — not a version bump.

### D-10 — Language

Bilingual, Arabic default. Draft quotation §7 and §9 exclude bilingual and must be amended and repriced.

### D-11 — Catalogue volume

9 Programmes · 72 LabTests PRE-SIGN-OFF · 121 relationships · 4 Branches, 3 confirmed · 4 LabUnits. Fills those blanks in draft §4. Remaining §4 blanks (Offers, Videos, Equipment, FAQ entries, website pages, Operator accounts) are not filled here: Operator accounts are D-08; website pages are enumerated in `CONTENT_MODEL.md` §3c; Offers, Videos, Equipment and FAQ entries have no signed quantity.

### D-12 — Payment

30% at signature · 20% at P03 exit · 20% at P05 exit · 30% at P07 launch. Supersedes the three-milestone schedule in draft §5 and §13.

### D-13 — Analytics and cookies

Neither ships at launch. The Privacy Policy page ships; the consent banner and the analytics do not. Every YouTube embed uses privacy-enhanced mode and does not load until the Visitor clicks a placeholder. An autoloading embed voids `BOUNDARY_MODEL.md` §5 — see evidence item 7.

### D-14 — Outbound portal page

One page carrying up to two clearly labelled outbound links, Visitor entry and Lab-to-Lab entry. Answers quotation D11. The page is the `ResultsPortalLink` public route in `CONTENT_MODEL.md` §3c.

### D-15 — Lab-to-Lab

In scope. Static page, copy sourced from `SiteSettings`, no ninth dashboard module. A managed partner-laboratory list is a priced change.

### D-16 — Dashboard modules

Eight: Offers · Videos · Equipment · Branches · Programmes · LabUnits · Site Settings · Media Library. Login is authentication, not a module. Activity log is a platform feature. The quotation's incoming-message inbox is struck per D-09.

### D-17 — Portal coupling

Linked, never framed. Confirmed 25 August 2026. See `BOUNDARY_MODEL.md` §2 and §4 item 8.

### D-18 — Offer to Programme

Optional nullable relation. An `Offer` may reference one `Programme`; it is never required to.

### D-19 — Clinical QA dispatch

Deferred by client decision, 25 August 2026. PR-08 holds: `LabTest` material ships behind a feature flag and Programmes render descriptions only. The gate binds release, not development. This becomes critical path the moment a launch date is agreed, and the dispatch date is then derived by working backwards from it.

### D-20 — Repository visibility

OD-04, signed 25 August 2026. The repository is PUBLIC during development, for review convenience, and reverts to PRIVATE before production cutover — the revert is a G7 checklist item.

### D-21 — Phase order

OD-05, signed 26 August 2026. P02 design work — brand extraction, I18N_MODEL.md, DESIGN_SYSTEM.md, and a single static landing-page mock — proceeds while P01 is incomplete, bounded so that G1 is not claimed, no schema/route/storage/LabTest content is touched, I18N_MODEL.md precedes DESIGN_SYSTEM.md, and the mock is replaced wholesale at P03.

### D-22 — Bounded portal read

OD-06, signed 26 August 2026. A brand-extraction read of the results portal is authorised for stylesheet, webfont, favicon and image URLs only, retroactively covering two fetches of 26 August 2026. Application bundles are not authorised and the painted login view stays UNDETERMINED. No integration, modification or coupling; D-17 stands.

### D-23 — Brand refinement in scope

OD-07, signed 26 August 2026. The engagement includes Website UI/UX Modernization and Light Brand Refinement, not Brand Identity Design. The bilingual flask lockup is the primary identity reference and the client has confirmed the flask symbol is theirs. No editable original exists; reconstruction sources are the 2018 favicon and the 2025 Facebook cover. No hex is fixed until the mark is sampled at the glyph; no deliverable reaches the results portal; composition is Arabic-first; `result` and `patient` stay out of the design system. Client approval is verbal and unfiled; pricing is deferred. Amends OD-03 and reprices alongside CF-17 and CF-18.

### D-24 — Brand provenance

Brand extraction, 26 August 2026, across three NEL web properties. The results portal's palette is Kendo UI Default and Bootstrap 4 stock values and its favicon is the Angular framework logo. The 2018 site's palette is the WpFreeware Medinova template's and its unused `logo.png` carries the template vendor's wordmark. The only genuine NEL brand asset in evidence is the bilingual flask lockup — `Nile` / `EGYPT LAB` / `معامل النيل مصر` — surviving in the 2018 favicon and on the 2025 Facebook cover, present on neither website's interface. `DESIGN_SYSTEM.md` derives from that mark, never from either stock palette.

### D-25 — Numerals

Western Arabic digits (0-9) in both locales, uniformly. Eastern Arabic digits (U+0660–U+0669) appear nowhere in the platform, in either locale, in any field. Number, currency and date formatting pins the `ar-EG` locale with the Latin numbering system explicitly, never the runtime default. Ruled 26 August 2026. Recorded in `I18N_MODEL.md` §5.

### D-26 — Locale routing

Locale is the first path segment and is not inferred from the Visitor. No `Accept-Language` sniffing, no geolocation, no stored preference — a locale preference keyed to a Visitor is a stored preference about a person and `BOUNDARY_MODEL.md` §2 forbids it. An unrecognised locale segment returns 404 rather than coercing to the default. The language switcher navigates to the same page in the other locale. Recorded in `I18N_MODEL.md` §2 and §3.

### D-27 — Logical properties

Layout uses logical properties only. `left`, `right`, and every directional margin, padding, border, float and text-align are forbidden in any stylesheet, inline style or component. `dir` is set once on `<html>` from the locale segment. Two carve-outs, both because neither mirrors: box shadow and elevation offsets, and media assets whose own content is directional. Direction-encoding icons mirror; meaning-encoding icons do not. Recorded in `I18N_MODEL.md` §4.

### D-28 — String catalogue parity

Every Visitor-facing and Operator-facing chrome string exists in `ar` and `en`. A missing key is a build failure, never a render-time fallback to the other locale. Persisted entity strings are not catalogue strings: if an `Operator` may edit it, it is data; if only a developer may, it is a catalogue string. Parity is computed by command at every gate, never asserted. Recorded in `I18N_MODEL.md` §8.

### D-29 — Chromatic families

One chromatic family, not three. The P02 scope decision proposed a blue-to-cyan range; sampling at P02-X02 found the mark carries no cyan and no teal, so the family is the mark's own hue and the mark's second colour occupies the `accent` slot. Amended at P02-X02. Structure: `primary`, `primary-strong`, `accent` (interactive affordance only, never a surface fill), a five-step neutral ramp cool-tinted from the primary hue rather than pure grey, and three semantic colours used functionally and never decoratively. Eleven tokens. Ruled at the P02-T04-A verdict on RTL verification cost, AA contrast-pair count, the absence of any sampled colour from the mark, and the scope decision's own instruction to avoid a colourful result. No hex value is fixed by this decision — OD-07 bound 1 binds until the mark is sampled at the glyph. Closes CF-48. Lands in full in `DESIGN_SYSTEM.md`.

### D-30 — Mark hue, corrected

The P02 scope decision recommended deep Nile blue, navy, teal and controlled cyan. Sampling the preserved 2018 favicon at P02-X02 found neither teal nor cyan present in the mark. The dominant hue and the mark's second colour are recorded in `docs/research/15-mark-colour-sampling.md`; that document assigns no token role and fixes no hex, and `DESIGN_SYSTEM.md` maps sampled values onto the eleven-token structure D-29 fixes. The recommended direction is superseded by the measurement. D-29's structure stands unchanged; only its hue assumption is amended.

### D-31 — Typefaces

IBM Plex Sans Arabic, SIL OFL 1.1, self-hosted, one family for both locales. Selected at the P02-X02-A verdict against the four criteria in `DESIGN_SYSTEM.md` §4, each verified against the font binaries rather than a specification page: full harakat coverage and complete coverage of the mark string; a permissive licence; eight real weight cuts of which three are used, so no synthetic bold; and uniform-width figures by default, which makes `tnum` correctly absent rather than missing. One family rather than two because the Arabic family ships Latin metrically identical to IBM Plex Sans across all sixty-two Latin glyphs at the same x-height and em, so every Latin run isolated inside Arabic under `I18N_MODEL.md` §6 renders in the same face without a per-string decision. The per-locale line-height fork is computed from the two scripts' measured vertical spans, not chosen. Noto Sans Arabic was rejected as the system fallback and Cairo as a regional default with a weak Latin. Closes CF-53. Recorded in `DESIGN_SYSTEM.md` §4.

### D-32 — Composition layer

`DESIGN_SYSTEM.md` v2, authored at the P02-T07 verdict. The first cut carried colour, type, space, elevation and a component list, and a mock built strictly from it rendered correctly and looked like nothing: tokens do not compose a page. v2 adds §9 composition (grid, containers, vertical rhythm, measure, imagery policy, hero pattern, stat band, mark placement, section pattern), §10 specifications for eleven components, and §11 six interaction states plus empty and error. It also ratifies the §5 elevation shadow values, which the first cut left descriptive and which the P02-T07 builder flagged rather than inventing silently. Two rules bind beyond styling: all photography is client-supplied and no stock imagery ships or appears in a client preview, and in the stat band a count is permitted where a name is not — no `Programme` name, no `LabTest` name, and no count of LabTests within a `Programme`.
