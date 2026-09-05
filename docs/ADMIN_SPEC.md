# NEL — Admin Specification

**Status:** v1, COMPLETE and landable
**Authored at:** P05 entry · 2 September 2026 · document 9
**Precedence:** outranked by `PRODUCT_BRIEF.md`, `GLOSSARY.md`, `DECISIONS.md`, `SCOPE.md`,
`CONTENT_MODEL.md`, `BOUNDARY_MODEL.md`, `SECURITY_MODEL.md`, `I18N_MODEL.md`,
`DATA_MODEL.md` and `DESIGN_SYSTEM.md`, in that order. Where this document disagrees with any
of them, that document wins and this one is amended.

This closes the three deferrals `SECURITY_MODEL.md` §9 names: the MFA factor type, the
enrolment flow and the recovery procedure. It also takes the decisions
`CONTENT_MODEL.md` §3e leaves open.

---

## §1 What the dashboard is for

An `Operator` publishes the laboratory's own content without a developer. That is the whole
purpose, and it is what the owner was told he is buying:
«لوحة تحكم تديرون بها محتوى الموقع بأنفسكم».

It follows that the dashboard is judged by one question: **can the lab change what a Visitor
sees, unaided?** A module that requires a developer for any routine change has failed, however
correct it is.

Twenty-one regions on the public site currently render a pending state. The dashboard is what
clears them.

---

## §2 What this document does not decide

- Any table, column, type or index. `DATA_MODEL.md` decides those and eleven tables already
  exist.
- The exact SQL of any policy. Written at the migration that creates the table, against
  `SECURITY_MODEL.md` §3's two shapes. The eleven existing tables already carry both.
- Whether `"Announcement"` and `"ClinicalNotice"` exist. They do not. See §8.
- Cutover headers, the CSP directive list, backup and retention. `CUTOVER_RUNBOOK.md`.
- Hosting region. Recorded as D-47; remaining PDPL obligations as controller are CF-105.
  See §3f.

---

## §3 Operators and authentication

### §3a The account model

Minimum two accounts (D-08). No role hierarchy: every `Operator` can do everything every
other `Operator` can do.

That is deliberate and it follows from D-40. No table may carry `created_by`, `updated_by`,
`deleted_by` or `owner_id`, so the application cannot record which Operator changed a row. A
permission tier the system cannot audit is theatre — it constrains the honest and stops
nobody else. Auditing lives in Supabase's own authentication and Postgres logs, which are a
platform feature and not a module (D-16).

An `Operator` exists only in the Supabase `auth` schema. No public table references one.

### §3b MFA — factor type

**TOTP, and only TOTP.**

Rejected alternatives, with the reason, because the reason is the specification:

- **SMS** would require storing a mobile number for each Operator. That is a new class of
  personal data on a project whose entire boundary posture is that it holds none, and it
  would need `BOUNDARY_MODEL.md` amended. Egyptian SMS delivery is also unreliable and
  metered. Rejected on the boundary, not the cost.
- **Email one-time codes** are a second factor only in name; the email account is already the
  first factor's recovery path, so the two collapse into one.
- **WebAuthn / passkeys** are stronger than TOTP and are the right answer for a larger
  organisation. They are rejected here because they bind to a device or platform account, and
  a two-person lab that changes phones has no graceful path. Revisit if the Operator count
  grows.

TOTP requires no personal data beyond the account email that authentication already needs,
works with any authenticator application, and works offline.

### §3c MFA — enrolment

Enrolment is **mandatory and structural**, not a setting an Operator can postpone. D-08 says
MFA is required, not optional, and a requirement enforced by policy rather than by code is
not a requirement.

1. An Operator signs in with email and password.
2. If the account has no **verified** TOTP factor, the only route that resolves is the
   enrolment screen. No module route resolves. Not the dashboard home, not a list, not a
   form. An unenrolled session can enrol or sign out.
3. Enrolment shows the QR code and the secret in text, and requires one correct six-digit
   code before the factor is marked verified.
4. Only after a verified factor exists do module routes resolve.

The second Operator account is created and enrolled during P05, not after. An account that
exists without an enrolled factor is a hole in D-08 for as long as it exists.

### §3d MFA — recovery

**There are no recovery codes.** A printed list of bearer secrets in a laboratory drawer is a
worse risk than the lockout it prevents, and it defeats the factor it protects.

Recovery is break-glass and deliberately manual:

1. A locked-out Operator cannot be recovered by the other Operator. Operators hold no
   administrative API and cannot unenrol each other's factors. This is the point.
2. Recovery is performed by the **break-glass holder**, who has Supabase project access, by
   unenrolling the factor so the Operator re-enrols at next sign-in.
3. Every break-glass use is recorded in `DEVELOPMENT_JOURNAL.md` with the date, the account
   and the reason. An unrecorded use is indistinguishable from an intrusion.
4. The break-glass holder is named in `CUTOVER_RUNBOOK.md` and **transfers at handover**.

With two Operators, both losing their authenticator simultaneously is the failure this cannot
absorb. That is accepted: the cost is a delay and a break-glass, not data loss.

### §3e Sessions

- No "remember this device" and no "trust this browser". Both are MFA bypasses wearing a
  convenience label.
- A session ends on sign-out, and idle sessions expire. The dashboard is used from a
  laboratory reception area where a machine is shared.
- Sign-out is reachable from every dashboard screen in one action.
- No dashboard route is statically rendered, prerendered or cached at the edge.

### §3f Hosting region — accepted

The review is complete. The region is accepted. The decision is recorded in `DECISIONS.md`.
The laboratory's own PDPL obligations as controller sit with the client.

---

## §4 Behaviour common to all modules

### §4a Bilingual by rule

Every module edits `ar` and `en` for every Visitor-facing string, in the same form, side by
side. Neither is optional and neither is a translation of the other at save time.

`CONTENT_MODEL.md` §3e leaves the Operator UI language open. **It is decided here: the
dashboard chrome is bilingual with the same switch as the public site, Arabic default
(D-10).** The Operators are Arabic speakers and an English-only dashboard on an Arabic-first
site would be a second class of user in the lab's own building.

All of `I18N_MODEL.md` applies: logical properties, Western digits, Latin runs isolated inside
Arabic. RTL is not a public-site concern that stops at the login screen.

### §4b Publication

Every content row is `draft` or `published`. A row is created `draft` and nothing renders
publicly until an Operator publishes it (D-42 fails closed at the database).

Publishing is one action per row, available to any Operator, with one exception in §6.

**Unpublish is the safe verb and the default offer.** An Operator who wants something off the
site is offered unpublish, not delete.

### §4c Display order

Every listable entity carries `display_order`. The module presents drag-to-reorder, or an
explicit numeric field where dragging is impractical. Order is per entity, not global.

### §4d Deletion

Hard delete only, behind a typed confirmation naming the row. Soft delete is not available:
D-40 forbids a soft delete keyed to a person, and an unkeyed one is a second publication state
pretending to be a safety net.

Delete is refused where a foreign key would break — a `MediaAsset` in use, a `Video` attached
to `Equipment`. The module says which row is holding it.

### §4e What no module ever offers

No field that accepts a Visitor's name, phone number, email, address, date of birth or any
identifier. No field that accepts a medical or diagnostic value about a person. No upload of a
patient document. No import of a contact list. No analytics, telemetry or event table.

If a client request implies one of these, it is refused and raised as an OD. This is the
boundary gate, and it is not waivable (`BOUNDARY_MODEL.md`).

### §4f Dashboard composition

The dashboard is the same product as the public site seen from behind.
It is denser, because an Operator works in it rather than reads it, but
density is a spacing decision and not a licence to drop hierarchy.

**Three type levels, not one.** A module page title takes
`--nel-size-2xl` with `--nel-line-height-heading`. A section heading
within a module takes `--nel-size-lg`. Labels and help text take
`--nel-size-sm`. A page whose title is the same size as a field label
has no hierarchy, and at P05-T02 the dashboard used only `sm` and `base`
across every screen.

**Fields are grouped into named sections, never listed flat.** Each
section is a surface at elevation 1 with `--nel-radius-md`, carries a
§10 section header, and is separated from its neighbours by
`--nel-space-48`. Twenty-four controls in one column is a defect.

**A bilingual pair is one field with two inputs**, laid out as a
two-column grid with the language named once per section, not as two
labelled fields repeated. It stacks to one column below the §5 breakpoint.

**Actions are weighted by consequence.** The action that changes what a
Visitor sees is the primary button. Save is secondary. Unpublish is
separated from both and never adjacent to publish. Three identical
buttons in a row make the consequential one indistinguishable.

**The header is a sibling of the public header.** It carries `MarkSlot`,
sits at elevation 1, and uses the same bar height. The active module is
marked in the navigation, and a module's name is not printed twice on the
same screen.

### §4g Validation

**The server is authoritative.** Client-side validation is assistance
that makes a form pleasant; it is not a control, because a form can be
bypassed and at P05-T10C one was. Every rule below is enforced in the
route handler. A rule that exists only in the browser has not been
implemented.

**Required fields are marked before they are submitted**, not discovered
on failure. A field required only when publishing says so — §8's
bilingual-complete checks bind on publish, not on draft, and the form
must not demand on create what the database demands on publish.

**A field's control matches its data.** A phone number is a country code
and a number, normalised to E.164 before storage; it is not a text box.
A coordinate pair is two numbers validated together or both empty; never
one. A URL field accepts `https://` only. A field with a length that
matters carries a counter.

**Errors appear beside the field, on blur, in both languages**, and say
what is wrong rather than that something is. A summary at the top of a
long form links to the first failing field.

**A counter warns; it does not truncate or block.** An over-length SEO
description is a search-result consideration, not invalid data, and the
Operator decides.

---

### §4h Content completeness

The dashboard reports, **field by field**, which required content fields are
populated and which are empty or hold a placeholder. It is a checklist, not a
binary indicator: a module reported incomplete always names the fields
responsible, and a module reported complete can be opened to see what was
checked. That is the entire claim. It says nothing about whether the
content is correct, whether the laboratory has approved it, whether the
commercial terms are settled, or whether the site is ready to launch. A module
showing complete means every required field holds a value; it does not mean
anyone has read that value.

The rules below are derived from two sources and from nowhere else: the `NOT
NULL` columns in `DATA_MODEL.md` §6 as the migrations actually created them,
and §8's publish-time bilingual checks. A requirement the database does not
have is not invented here. Where the dashboard is stricter than the database,
this section says which field and why.

#### §4h.1 The three states

A module is **COMPLETE**, **INCOMPLETE**, or **AWAITING SIGN-OFF**. There is no
fourth state and no percentage that mixes them.

- **Complete** — every required field on every published row holds a value, and
  no required field holds a placeholder. Stated as "all required content
  populated", never as ready, operational, approved or live.
- **Incomplete** — at least one required field is empty, or holds a
  placeholder. The module names which fields, per row.
- **Awaiting sign-off** — Programmes only. See §4h.5.

Every state carries an icon and a word. Colour never carries the state alone
(`DESIGN_SYSTEM.md` §8).

#### §4h.2 A placeholder counts as empty

A required field holding a placeholder is **incomplete**, not complete. A field
that looks filled and is not is worse than an empty one, because nothing draws
the eye to it and it ships.

A value is a placeholder when it matches any of:

- a string from `src/lib/placeholders.ts`, including
  `https://example.invalid/portal-placeholder` and the
  `wa.me/200000000000` number
- a value containing `PROOF`, `PLACEHOLDER`, `TEST`, `SAMPLE`, `TODO`, `XXX`,
  `lorem`, or `example.invalid`, case-insensitive
- a task identifier of the form `P0n-Tnn` or `M n`, which is verification
  residue rather than content

The list lives in one module and the completeness check and the tests read the
same list. It is extended when a new placeholder shape is found, not
rediscovered each time.

Match `PROOF`, `PLACEHOLDER`, `TEST`, `SAMPLE`, `TODO` and `XXX` **on a word
boundary**, not as a substring. P05-T18's residue classify found four
substring hits on `TEST` inside the laboratory's own English copy across
`lab_to_lab_en`, `privacy_body_en`, `seo_description_en` and `seo_title_en` —
a laboratory's marketing copy will contain the word *test* constantly, and a
check that reads those as verification residue reports a permanently
incomplete module and teaches the Operator to ignore it. `lorem` and
`example.invalid` match as substrings, because neither belongs in a sentence.

#### §4h.3 Required per module, derived

**Site Settings** — one row. Two single columns are required when published:
`hotline` and `whatsapp_e164`.

Sixteen bilingual pairs are required when published. Each is required because
the database carries a `SiteSettings_<field>_bilingual_when_published` check of
the form `publication_state <> 'published' or (both is not null)`. This
section invents none of them and omits none of them:

| Pair | Landed by |
|---|---|
| `whatsapp_message_ar` / `_en` | M2 |
| `hours_ar` / `_en` | M2 |
| `about_body_ar` / `_en` | M2 |
| `privacy_body_ar` / `_en` | M2 |
| `lab_to_lab_ar` / `_en` | M2 |
| `seo_title_ar` / `_en` | M2 |
| `seo_description_ar` / `_en` | M2 |
| `hero_eyebrow_ar` / `_en` | M6 |
| `hero_headline_ar` / `_en` | M6 |
| `hero_standfirst_ar` / `_en` | M6 |
| `reason1_title_ar` / `_en` | M6 |
| `reason1_body_ar` / `_en` | M6 |
| `reason2_title_ar` / `_en` | M6 |
| `reason2_body_ar` / `_en` | M6 |
| `reason3_title_ar` / `_en` | M6 |
| `reason3_body_ar` / `_en` | M6 |

**This list is trustworthy because a guard enforces it, not because it was read
carefully.** It was read carefully once and it was wrong. The first draft of
this section listed the seven M2 pairs and none of the nine M6 added, because
it was derived against the schema as it stood before M6 and nothing obliged it
to be re-derived. A module reporting COMPLETE against that list would have
reported complete on a singleton the database refuses to publish, which is the
exact failure §4h.1 exists to prevent — and it is what happened in production
on 5 September 2026, when the laboratory filled every field the form offered,
pressed publish, and was told only that saving had failed and to try again.

`scripts/guard/schema.mjs`, landed at **P05-T18**, parses the forward
migrations for `<Table>_<field>_bilingual_when_published` and fails CI when the
application's pair lists and the database's constraint set differ in either
direction. **Until P05-T18 has landed on `main` and `npm run guard:schema`
exits 0, treat the table above as a proposal and not as verified.** The
sixteen entries are what that guard proves for `"SiteSettings"`; before the
guard existed there was no mechanism by which such a list could be right other
than someone remembering to check, and someone did not.

Two limits on what the guard proves, stated so this section is not read as
claiming more than it can:

- The guard reads the **migrations**, not the live database. The migrations
  are the record of what was pushed to the linked remote; they are the best
  available evidence and they are not the database itself. A constraint added
  or dropped outside a migration is invisible to it.
- The guard compares against the pair lists the application **declares**. For
  a table whose module does not yet exist, a declared list is not an enforced
  one. See CF-114.

The four social URLs are **not required** — a laboratory without a LinkedIn
page is not incomplete. Required only in the sense that a populated one must be
a valid `https://` URL, which §4g already enforces.

`hero_media`, `favicon_media` and `app_icon_media` are **not required**. They
are nullable, carry no check constraint, and have no form field until the
media-role task lands. A missing app icon is reported under §4h.4 as a client
material, never as an incomplete field the Operator could have filled.

`privacy_body_*` is required for completeness and is separately blocked by
CF-06: the laboratory has not supplied its policy text. Populated is not
signed.

`hero_*` and `reason*` are required for completeness and are separately
blocked by CF-113: the hero copy is the client's to write and the three reason
cards are reviewer-authored proposals awaiting his approval or his own
wording. A populated hero is not an approved hero.

**Branches** — at least one published row. Per row: `name_ar`, `name_en`,
`address_ar`, `address_en`, `hours_ar`, `hours_en`. `whatsapp_e164` is
required per row because a branch a Visitor cannot contact is not a listing.
`latitude` and `longitude` are **not required** — CF-69 records that the
addresses have not been verified, and an invented coordinate is a defect, not
a completion. Exactly one row must carry `is_head_office`; zero is incomplete,
and the database already prevents two.

**Departments** — at least one published `LabUnit`. Per row: `slug`,
`name_ar`, `name_en`, `description_ar`, `description_en`.

**Offers** — **zero published Offers is COMPLETE, not incomplete.** A
laboratory running no promotion this month is in a correct state, and a
dashboard that nags for one invites invented content. Where a published Offer
exists: `title_ar`, `title_en`, `description_ar`, `description_en`,
`valid_from`, `valid_until`. `price_amount` and `price_currency` are required
together or neither — a price without a currency is meaningless and a currency
without a price is noise. An Offer past its `valid_until` is complete and
expired, not incomplete; expiry is a visibility filter and never a state
(D-48).

**Videos** — zero published Videos is complete, on the same reasoning. Where
one exists: `youtube_id`, `title_ar`, `title_en`, `description_ar`,
`description_en`, and a linked `"MediaAsset"` poster. The poster is required
because D-13 forbids the host's thumbnail and a card with neither has no image.

**Equipment** — zero published Equipment is complete. Where one exists:
`name_ar`, `name_en`, `description_ar`, `description_en`. The `"MediaAsset"`
and `"Video"` links are optional.

**Media Library** — complete when every published `"MediaAsset"` carries
`alt_ar` and `alt_en`. An asset without alt text in both languages fails the
bilingual rule and the accessibility floor. The count of assets is never a
completeness criterion; one correct asset is complete and forty without alt
text are not.

#### §4h.4 What the Operator cannot supply

Four inputs are the client's and no amount of dashboard work produces them.
They are listed separately, never mixed into a module's state, and never
counted toward or against completeness:

- the mark as a scalable file (CF-74) — the favicon and app icon
- photography for frontage, departments, equipment and branches (CF-65)
- accreditation evidence: scheme, number, issuing body, expiry
- the four verified branch addresses (CF-69)

Shown as outstanding client materials with the region count each one unblocks.
An Operator seeing a module incomplete should be able to tell at a glance
whether it is their work or the client's.

Hero copy and reason-card approval (CF-113) belong to the client in the same
way, and differ in one respect that matters to the display: their destination
is a required field, so they appear in **both** places — as an incomplete
field under Site Settings, and here as a client material with the note that no
Operator can close it. A field the Operator cannot fill must never be shown as
though they had simply not got to it yet.

#### §4h.5 Programmes is never graded

Programmes reports **awaiting clinical sign-off** and reports nothing else,
whatever its fields hold.

Publishing a Programme is a clinical act. All 72 `LabTest` Arabic names are
empty (CF-81), 121 memberships default to `unreviewed` eligibility (CF-82),
and five records carry QA flags of which two are high severity (CF-83). A
green tick on that module would tell an Operator the work is done while the
laboratory has signed nothing, and that is the failure the clinical gate
exists to prevent.

The module may report progress against the clinical work — names translated,
memberships reviewed, flags resolved — as counts. It never converts those
counts into a completeness state, and it never turns green.

#### §4h.6 The check is server-side and recomputed on write

Completeness is evaluated where the rows are, not in the browser, and it is
recomputed after every write so a save updates the header without a reload.
The evaluation reads published rows through the same path the public site
uses, so the header answers the question a Visitor's page would answer.

The header reads the same `BILINGUAL_PAIRS` lists the write path enforces and
`guard:schema` checks. One list, three readers. A completeness header with its
own copy of the requirements is a second thing to keep in step with the
database, and the first one already fell out of step.

#### §4h.7 Presented by page, derived by column

The rules above are defined per column because that is where the requirement
lives. The header presents them **per page**, because that is what an Operator
sees and what a Visitor sees. One column can appear under several pages —
`hotline` and `whatsapp_e164` render in the chrome on every public URL, while
`about_body_ar` renders only on `/about`, and the three `hero_*` pairs and six
`reason*` pairs render only on the home page. The mapping is the one the
wiring audit produced at P05-T12, extended by M6's columns, and it is read
from that mapping rather than restated.

Each page lists its required fields with a filled or missing mark and the
field's name in the Operator's language. **An optional field does not appear
at all** — not greyed, not marked satisfied. A checklist that lists things
nobody needs teaches the reader to skim it.

The summary is a count of the same checklist: *"32 of 38 required fields
populated."* The denominator is computed, never fixed. It grows with published
rows — each published `Branch` contributes its seven required fields, each
published `Video` its six — so the count answers "what is missing from what
exists", not "how close is this to a target nobody set". State the denominator
alongside the numerator so a reader can see it move when a row is added.

Three things stay out of that count and are shown beside it, never inside it:

- **Client-owned materials** (§4h.4). Listed with the field or region each one
  unblocks, so an Operator can see at a glance that the gap is not theirs.
- **Programmes** (§4h.5), which reports clinical progress and no completeness
  state.
- **Fields the system does not have.** No email address, no contact form
  field, no enquiry inbox — D-09 struck the inbox and WhatsApp is the only
  channel. A checklist entry for a field this system will never hold is a
  standing invitation to add one.

## §5 The eight modules

Eight (D-16, first eight). Login is authentication, not a module. The activity log is a
platform feature. The incoming-message inbox is struck (D-09).

| # | Module | Entity | What the Operator does |
|---|---|---|---|
| 1 | Offers | `Offer` | Title, description, validity dates, price amount and currency, optional image, optional Programme |
| 2 | Videos | `Video` | YouTube id, title, description, featured flag, poster image |
| 3 | Equipment | `Equipment` | Name, description, optional image, optional Video |
| 4 | Branches | `Branch` | Name, address, hours, head-office flag, coordinates |
| 5 | Programmes | `Programme`, `ProgrammeTier`, `ProgrammeLabTest` | Name, description, tiers, memberships — see §6 |
| 6 | LabUnits | `LabUnit` | Department name and description |
| 7 | Site Settings | `SiteSettings` | WhatsApp number, hours, portal URLs, social links |
| 8 | Media Library | `MediaAsset` | Upload, bilingual alt text, replace, delete |

Notes that change behaviour rather than describe it:

- **Offers.** `price_currency` is stored per row and no currency is named in application
  source (CF-21). The form offers a currency field; it does not default to one.
- **Videos.** The poster comes from `MediaAsset`, never from the video host. D-13 forbids a
  host-supplied thumbnail URL and an autoloading embed, and `guard:design` now enforces the
  first. The public card is a placeholder until the Visitor clicks.
- **Branches.** Coordinates cannot currently be placed on the drawn map, which is a schematic
  with no georeference. The module stores them; whether the map can use them is an open
  design question and the module must not wait on it.
- **Site Settings.** One row. Every value here is one the public site renders and no value is
  hardcoded anywhere in source (PR-16). Publishing this row is what clears most of the
  twenty-one pending regions.
- **Media Library.** Images only. The bucket accepts image MIME types and rejects everything
  else at the policy, not in the form — a PDF upload path is a route by which a patient result
  could enter this system, and the boundary gate forbids it. Alt text in both languages is
  required before an asset can be attached to a published row.

---

## §6 The Programmes module and the clinical gate

This module is different from the other seven and the difference is not cosmetic.

Everything it edits is clinical content. `LabTest` names, panel membership and medical
descriptions **do not reach production without the lab's written sign-off**. That gate is not
waivable, by anyone, including the client (`BOUNDARY_MODEL.md`, and the standing rules).

Consequences for the module:

1. **The clinical flag governs the public surface, not the dashboard.** Operators may edit and
   review with the flag off. Nothing they edit renders publicly until the flag is on, and the
   flag turns on when sign-off lands — not when the content looks finished.
2. **Eligibility is a clinical judgement, one per membership.** `eligibility_audience`
   defaults to `unreviewed` and an `unreviewed` row never renders (D-42). The module presents
   the 121 memberships for review and records the judgement. It offers no bulk "set all",
   because a bulk action on a clinical judgement is the failure mode the default exists to
   prevent.
3. **The Children tier is standalone and never cumulative** (D-06, D-43). The module must not
   present Children as inheriting from another tier, and must not offer an interface that
   implies it could. The cumulation rule lives in `public."programmeLabTests"` and is not
   reimplemented here.
4. **Five QA-flagged records are shown as flagged**, with the flag text, until the lab
   resolves them: `ast`, `esr`, `fsh`, `app-afp`, `creatinine-urea-combined`. Two are high
   severity — FSH appears in a thyroid-described tier and is very likely TSH; APP is very
   likely AFP. The module never silently corrects one. It shows the flag and records what the
   lab decides.
5. **All 72 Arabic `LabTest` names are empty.** The module is the surface through which they
   arrive, and it must not accept a row as complete with an empty `name_ar`.

---

## §7 The dashboard's own boundary

Everything in `BOUNDARY_MODEL.md` binds here. Restated because a dashboard is where it will
be tested:

- No route handler, form, column, bucket or log accepts or retains personal or medical data
  about any Visitor or patient.
- The results portal is linked and never touched. The dashboard does not read it, embed it,
  proxy it, authenticate to it or store anything from it. There is no Operator edit path for
  `ResultsPortalLink` (D-07); the two URLs are build-time values.
- WhatsApp is the only contact channel. The dashboard has no inbox, no form submissions view
  and no message list, because none exists to view (D-09).
- No dashboard page is publicly cacheable and no dashboard data reaches a static build.

---

## §8 Announcements and Clinical notices — drafted, unsigned

OD-09 would add modules 9 and 10. **It is DRAFT, unsigned and unpriced.** Neither table
exists; `DATA_MODEL.md` §6 rows 12 and 13 say so in terms. They would need an M6 migration.

The owner's Arabic summary lists both and marks them `+ إضافة` requiring separate pricing,
which is accurate and consistent with D-16 gating its last two modules on the signature.

**One thing to resolve before signing, not after.** Row 13 gives `"ClinicalNotice"` a
`signed_by` column. D-40 forbids any audit column that references a person — no `created_by`,
no `updated_by`, no `owner_id` — and `signed_by` is one. Signing OD-09 as drafted therefore
requires a choice: amend D-40 for this one table with the reason recorded, or store the
sign-off as `signed_at` plus `signed_text_hash` only and let *who* signed live in the Supabase
authentication log where every other Operator action already lives. The second keeps D-40
intact and still satisfies the rule the client actually asked for — that an edited notice
reverts to pending, which the hash delivers on its own.

---

## §9 What G5 must show

The gate is not "the modules exist". It is:

1. **An Operator publishes a change and a Visitor sees it.** End to end, both locales, on a
   real deployment. At least one of the twenty-one pending regions clears by a dashboard
   action and no other means.
2. **Two Operator accounts exist, both with a verified TOTP factor.** Proved by reading the
   auth state, not asserted. An account without a verified factor fails this gate.
3. **An unenrolled session reaches only the enrolment screen.** Demonstrated, not described.
4. **No anonymous write path exists.** Zero anonymous INSERT, UPDATE or DELETE policies across
   every table in the schema, read from `pg_policies`, as at G3.
5. **Boundary holds.** No form field, column, bucket or log in the dashboard accepts personal
   or medical data. The Media Library rejects a non-image upload at the policy.
6. **Bilingual holds.** Every dashboard screen renders in `ar` and `en` with rendered
   evidence, and the Programmes module refuses a row with an empty `name_ar`.
7. **Nothing clinical reached production.** The flag is off unless sign-off has landed, and
   `eligibility_audience` was not set to anything except by a clinical review that is recorded.

Nothing about the region question is a G5 criterion. It is a decision, not a build output, and
it needs answering before the first Operator account is created rather than before the gate.
