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
- Whether `eu-central-2` is an acceptable region once Operator accounts exist. That is CF-39,
  it goes live with this document, and it is the human's to answer. See §3f.

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

### §3f The region question — CF-39, live from here

The Supabase project is in `eu-central-2`, Zurich. Until now the database has held no personal
data of any kind. **From the moment an Operator account exists, the `auth` schema holds lab
staff email addresses** — personal data, though not patient data.

This document does not resolve it. It records that the question is now live, that it is the
human's to answer with the client, and that the possible answers are: accept the position and
record why; move the project to an EU region before Operators are created, which is cheapest
now and expensive later; or take the client's written acceptance. **The cheapest moment to
move regions is before the first Operator account exists.** After that it is a migration.

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

---

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
