# NEL — Decisions

**Status:** AUTHORED at P00-T02 · 2026-08-25
**Binding on:** every prompt issued, every document authored, every identifier written
**Supersedes:** the unsigned draft quotation where a row below says so. The draft is not deleted; the conflict is named and owned as a carry-forward.

Forty decisions. Ten of them are filed as formal Operational Decisions (OD-01, OD-02, OD-03, OD-04, OD-05, OD-06, OD-07, OD-08, OD-09, OD-10). A decision is in force when it appears here. Conversation does not amend this file.

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

### OD-08 — The composition is promoted, not replaced

**Status:** SIGNED
**Signed:** 29 August 2026
**Amends:** OD-05 bound 4, which read that the landing-page mock "is not a P03 deliverable, does not satisfy any part of G3, and is replaced wholesale at P03." That bound is superseded.
**Decides:** the composition approved by the client on 29 August 2026 and recorded in `docs/PAGE_REPORT.md` becomes the **production baseline for the public site**. It is carried forward into P03 and refined in place rather than discarded. `DESIGN_SYSTEM.md` v5 is its specification; where the two disagree, v5 wins and `PAGE_REPORT.md` is amended, never the reverse.
**What promotion changes:**
1. G3 applies to this surface. It is no longer exempt.
2. `DESIGN_SYSTEM.md` §12 approval gates are restored before any `Visitor` can reach it. An ungated composition was correct for a review session and is not correct for a served page.
3. No stock photography ships. `public/preview-stock/` is removed at the production pass; every image slot returns to a §9 labelled frame until client photography lands.
4. The mark ships as vector. The 83×100 raster is a review placeholder and does not satisfy §7, which requires 16px favicon and 180px app icon.
5. Copy moves from the compiled catalogue to the data layer at the wiring phase for every field an `Operator` may edit. Chrome strings stay in the catalogue (`I18N_MODEL.md` §8).
**What promotion does not change:** the boundary gate and the clinical gate, both non-waivable. No route beyond the existing placeholder until P03 opens routing. No `LabTest` or `Programme` name, no medical instruction, no certification claim without a verified source. OD-03's freeze and its 15 September 2026 lapse are untouched.
**Does not decide:** the ninth dashboard module the client has requested for news, posts and cautions. That remains forbidden by D-15 and D-16 and requires its own OD and its own price.

---

### OD-09 — Announcements and Clinical notices

**Status:** DRAFT — awaiting the human's signature and a price
**Drafted:** 29 August 2026
**Amends:** `D-15`, which states there is "no ninth dashboard module", and `D-16`, which enumerates eight. Both are superseded to the extent stated here and in no other respect.
**Requested by:** the client, 29 August 2026, alongside four other dashboard capabilities. The other four — video links and descriptions, the hero image, other page images, and Operator login — are already in scope and are **not** part of this OD.

**Decides:** two modules, not one. Ten in total.

| # | Module | Entity | Gate |
|---|---|---|---|
| 9 | Announcements | `Announcement` | operational |
| 10 | Clinical notices | `ClinicalNotice` | **clinical, non-waivable** |

**Why two and not one.** The client asked for "posts and news" and "cautions" together. They cannot share a module. A caution from a medical laboratory — fasting hours, medication guidance, sample-collection instruction — is a **medical description** and passes the clinical gate. An announcement — a new branch, changed hours, an equipment arrival — does not. One module means one editor screen and one publish action, and the first time a clinical entry is published through an operational workflow the gate has been bypassed by convenience rather than by decision. Separating them makes the workflow difference structural rather than a matter of the `Operator` remembering.

**`Announcement`.** Bilingual by rule (`ar` and `en` required, `I18N_MODEL.md` §8). Fields: title, body, publication date, optional `MediaAsset`, `StatusState` for draft and published, display order. Published by any `Operator`. Surfaces in the §9 card band and on its own listing.

**`ClinicalNotice`.** Bilingual by rule. Fields: title, body, optional `MediaAsset`, `StatusState`, display order, **and a sign-off record** — who signed, when, and against which version of the text. Publication requires that record. Without it the entity exists, the module edits it, and the public surface renders it `pending` under `DESIGN_SYSTEM.md` §12. **This is the clinical gate expressed as a schema constraint rather than a policy anyone has to remember.**

**Bounds:**
1. **`Announcement` carries no clinical copy.** Publication requires the `Operator` to affirm that the text contains no medical instruction, and the affirmation is recorded with the publish action. This is an audit control and **not a guarantee** — a text box cannot be prevented from holding a sentence. It exists so that a clinical entry published as an announcement is a traceable act rather than an invisible one, and so the correct route is the obvious one.
2. **Neither entity collects anything from a `Visitor`.** No comments, no reactions, no subscription, no share tracking. `BOUNDARY_MODEL.md` §2 is unaffected.
3. **Neither carries a `LabTest` name, a `Programme` name or a count of LabTests** without the same clinical sign-off those names require elsewhere. A `ClinicalNotice` is not a route around the naming gate.
4. **Both are bilingual or neither publishes.** A missing locale blocks publication; it never falls back (`I18N_MODEL.md` §8).
5. **The clinical sign-off record is immutable once written.** Editing the text of a signed `ClinicalNotice` clears the record and returns the notice to `pending`. A signature covers the words that were signed and nothing later.
6. **Media follows §12.** Any `MediaAsset` on either entity is client-supplied; no stock imagery ships (`DESIGN_SYSTEM.md` §9).

**Commercial position:** both modules are additions to the draft quotation and are unpriced. Recorded as A3 and A4 in `docs/QUOTATION_AMENDMENTS.md`. This OD does not take effect until the quotation carrying them is signed.

**Does not decide:** the dashboard's own chrome language (CF-52, deferred to `ADMIN_SPEC.md`) · whether an `Announcement` can be scheduled for future publication · retention or archival of either entity · any schema detail beyond the fields above, which `DATA_MODEL.md` fixes when CF-34 clears and P01-T03-R resumes.

---

### OD-10 — Migration route, and no staging database

**Status:** SIGNED
**Signed:** 29 August 2026
**Resolves:** CF-34, open since P01. The blocker was that the migration authoring and verification route was undecided, because the build machine has no local Postgres, no container runtime, and no shell elevation. `P01-T03-R` has been blocked on it for the entire life of P02.
**Evidence:** the `P01-T03-E` environment probe, 29 August 2026. Every command below was run and its exit code recorded; secrets redacted under OD-04 condition 1.

**Decides: migrations are hand-authored and pushed to the linked remote. No local database is used at any point.**

| Step | Command | Needs Docker | Probe outcome |
|---|---|---|---|
| 1. Create the file | `supabase migration new <name>` | no | file write only |
| 2. Author the SQL | by hand, from `CONTENT_MODEL.md` and `DATA_MODEL.md` | no | — |
| 3. Rehearse | `supabase db push --dry-run` | no | exit 0, reached the remote |
| 4. Apply | `supabase db push` | no | not run at the probe; the apply path |
| 5. Verify | `supabase migration list` + MCP `list_tables` | no | exit 0, both read the remote |

**`supabase db diff` is not on the critical path.** It builds a local shadow database and needs Docker, which this machine does not have. It is a *generation* convenience, not an apply or verify step. Migrations on this project are written, not generated.

Also unavailable and not required: `supabase start`, `stop`, `db start`, `db reset`, `status`, `test`. Each inspects or builds a local container.

**Region confirmed.** `eu-central-2`, reported identically by CLI `projects list`, MCP `get_project`, and the linked-project payload. Matches the OD-01 amendment of 26 August 2026. Not a finding. CF-39 — Zurich sits outside the EU and `Operator` accounts arrive at P05 — is unaffected and stays open.

**Accepted risk: there is no staging database, and every push lands on production.**

This is the material consequence of the route and it is recorded as an acceptance, not an oversight. The organisation is on the **free** plan, so Supabase branching is unavailable (MCP `get_organization` → plan `free`; `list_branches` → empty). With no branching and no local shadow, the linked remote is the only database that exists. A migration cannot be tried anywhere before it lands.

**Controls, binding on every migration from T03-R onward:**

1. **Every migration ships with a verified reverse.** A `down` path is authored at the same time as the `up`, in the same task, and the reverse is stated in the task report. A migration whose reverse is "restore from backup" is not reversible.
2. **`--dry-run` before every apply, without exception**, and its output is quoted in the report. The probe showed it reaches the remote and reports `upToDate`; it is the only rehearsal available.
3. **One migration per task.** No task applies two. A failed push is then unambiguous about what failed.
4. **Additive before destructive.** Within P01 to P03 no migration drops a column, drops a table, or narrows a type. Destructive changes wait for a separate OD once real records exist.
5. **Verify by reading, never by assuming.** After every push, `migration list` and MCP `list_tables` are both run and their output quoted. A push that exits 0 is not evidence that the schema is what the migration intended.
6. **No `db reset`, ever, on the linked project.** It is skipped by fence rule in every task, as it was in the probe.

**Does not decide:** whether to move to a paid plan. Branching would supply a real staging database and remove the accepted risk above, and CF-37 already tracks plan tier against P07 for pausing and backups. That is a commercial call for the human, and it belongs in the same conversation as the quotation rather than here.

**Does not decide:** any table, column, type, constraint or policy. `DATA_MODEL.md` fixes the schema and `SECURITY_MODEL.md` fixes RLS; neither is authored yet, and no migration is authored before both exist for the objects it touches.

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

In scope. Static page, copy sourced from `SiteSettings`, no dashboard module of its own. A managed partner-laboratory list is a priced change. The "no ninth module" clause is superseded by OD-09, which adds Announcements and Clinical notices as modules 9 and 10; Lab-to-Lab remains a static page and is not among them.

### D-16 — Dashboard modules

Ten, as amended by OD-09: Offers · Videos · Equipment · Branches · Programmes · LabUnits · Site Settings · Media Library · Announcements · Clinical notices. The first eight were fixed at P00; the last two are additions requiring a signed price and do not take effect until the quotation carrying them is signed. Login is authentication, not a module. Activity log is a platform feature. The quotation's incoming-message inbox is struck per D-09.

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

### D-33 — Composition v3 and approval states

`DESIGN_SYSTEM.md` v3, authored at P02-T10 after a competitor reference made plain what the document still lacked. Adds to §9 a full-bleed hero media column with text never crossing into it, a trust row whose every claim requires a verified source, the four-card band (News, Cautions, Locations, Programmes), alternating `background`/`surface` section fills, single-hue-family gradients only, and video poster rules forbidding any YouTube-hosted thumbnail URL. Adds two display type steps and permits Bold 700 at `2xl` and above only, superseding v2's blanket exclusion: Arabic joins clog at body size, not at display size. Adds seven component specifications, taking §10 to eighteen of twenty-four. Adds **§12 approval states** — `approved`, `pending`, `withheld` — so structure can be built before the material inside it is signed, with seven classes gated by default including every `LabTest` and `Programme` name, health cautions, and certification claims. A `pending` region renders at full fidelity with a visible marker and never carries a real clinical string to show the shape. Supersedes D-32's §9 stat band, which the card band replaces; closes CF-64.

### D-34 — Atmosphere, motion, map and the brand-mark exception

`DESIGN_SYSTEM.md` v4, authored at P02-T12. Corrects two rules that were written too broadly. §2 principle 3 read "never translucency" and now reads "never translucency on a surface that carries text": a decorative layer nothing is read off has no ratio to certify, which permits the single page-level wash §9 now specifies — `background` easing to `surface` with a `primary` tint at no more than 6%, fixed to the viewport, the site's entire atmosphere budget. §12 read that a `pending` region is "never styled to look finished", which forbade the right answer; it now requires a `pending` region to be built to the same standard as an approved one while remaining unmistakably not real — real geometry and icon, a 2000ms neutral shimmer, content as bars at true type sizes, the marker retained. Removing the marker or writing realistic fake copy stays forbidden. Adds card hover at elevation 1 → 2 and hover-reveal via `grid-template-rows`; **refuses flip cards**, because content on a reverse face is unreachable by keyboard and invisible to assistive technology, and this is a laboratory. Replaces the Location card's static map image with a drawn SVG of Greater Cairo in project tokens — no embed, no tile request, no API key, no third-party disclosure — rendering `pending` until `Branch` records carry addresses. Adds a named exception to D-29: a third-party brand mark renders in its own brand colour and is not a design token. The WhatsApp mark is the only such exception; white text on `#25D366` measures 1.98 and is forbidden, so the filled treatment pairs it with `text` `#1D1D35` at 8.28. D-29's one-family rule is otherwise unaffected.

### D-35 — Composition ratified

`DESIGN_SYSTEM.md` v5, authored at P02-T14, absorbs the owner-approved composition of 29 August 2026 so that `PAGE_REPORT.md` describes an implementation rather than acting as a second authority. Ratified: the certified hero veil, a fifth radius value at `32px` for wells, the loading screen, the floating header pill, inset wells, the full-bleed band with its actions on a `surface` plate, the footer island and its full anatomy, numbered stills running in reading order, the decorative lattice, and the magazine and tabbed blocks. Tab state is not a route. §12 now states when approval gates may be omitted — a design-decision mock reviewed and discarded — and when they may not, which is anything a `Visitor` can reach. Social marks render monochrome in `surface` rather than in brand colour, which resolves CF-70 and keeps §3's third-party exception at exactly one, the WhatsApp mark; a mark with no destination does not render.

### D-36 — Text over media

`DESIGN_SYSTEM.md` §9 previously banned text over media outright. The ban existed to protect the §8 contrast floor and forbade cases that satisfy it. Replaced with the certification condition: the veil is flat rather than a gradient, the image carries a luminance cap, the worst-case composite is computed and recorded, and no type enters a fade zone. Ratified against the approved hero — `primary-strong` at 74% over `brightness(0.58)`, worst-case composite `#383B8E`, `surface` text at 9.52:1, which is AAA and holds for any photograph substituted. Text still never sits on an unveiled photograph.

### D-37 — Announcements and Clinical notices

OD-09, drafted 29 August 2026, awaiting signature and price. Two dashboard modules, not one, taking the total from eight to ten. The client requested posts, news and cautions together; they cannot share a module, because a caution from a laboratory is a medical description that passes the clinical gate and an announcement is not. One module would mean one publish action, and the first clinical entry routed through an operational workflow would bypass the gate by convenience rather than by decision. `ClinicalNotice` carries a sign-off record as a field — who signed, when, against which version — and publication requires it, which makes the clinical gate a schema constraint rather than a policy anyone has to remember. Editing signed text clears the record and returns the notice to `pending`. `Announcement` publication records an affirmation that the copy carries no medical instruction; that is an audit control and not a guarantee, and it is stated as such. Neither entity collects anything from a `Visitor`. Both are bilingual or neither publishes. Amends D-15 and D-16. Priced as A3 and A4 in `docs/QUOTATION_AMENDMENTS.md`.

### D-38 — Migration route

OD-10, signed 29 August 2026, resolving CF-34. Migrations are hand-authored and pushed to the linked remote; no local database is used. `supabase migration new` writes the file, the SQL is written from `CONTENT_MODEL.md` and `DATA_MODEL.md`, `db push --dry-run` rehearses, `db push` applies, and `migration list` with MCP `list_tables` verifies. `db diff` is a generation convenience and is not on the critical path. The route was established by the P01-T03-E probe, which recorded an exit code for every command. The accepted risk is that no staging database exists on the current plan, so every push lands on the only database there is; OD-10 carries six binding controls, of which the first is that every migration ships with a verified reverse authored in the same task.

### D-39 — Row-level security

`SECURITY_MODEL.md` §3. RLS is enabled on every table in the application schema without exception, because the publishable key ships in the browser by design and RLS is the only thing protecting anything behind it. Two policy shapes: published-read, granting anonymous `SELECT` on published rows and no write of any kind; and Operator-write, granting an authenticated `Operator` full access to the same tables. There is no per-`Operator` partition — a two-account system does not need a permission matrix and inventing one produces untraceable mistakes rather than impossible ones. An unpublished row never leaves the database, which makes `DESIGN_SYSTEM.md` §12 and the clinical gate policies rather than rendering choices: a front-end that forgets to check still shows nothing. The `service_role` key is never used by the application; if a task appears to need it, the policy is wrong.

### D-40 — No attribution at the database layer

`SECURITY_MODEL.md` §5. No table holds a name, phone number, email, address, date of birth or identifier of any `Visitor` or any patient. No column stores a medical or diagnostic value. **No audit column references a person** — no `created_by`, no `updated_by`, no `deleted_by`, no `owner_id` — and no soft delete is keyed to a human; timestamps are permitted and attribution is not. No analytics, telemetry or event table exists. Postgres and Supabase best-practice guidance recommends the opposite and is correct for systems with public accounts; this one has a `Visitor` who is never persisted and an `Operator` who exists only in the auth schema. CF-78 tracks the risk and this decision is what gets quoted back at a suggestion that looks obviously right.
