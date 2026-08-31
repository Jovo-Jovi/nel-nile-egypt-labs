# NEL — Security Model

**Status:** AUTHORED at P02-T17 · 29 August 2026
**Vocabulary:** frozen `GLOSSARY.md` · 2026-08-25, as superseded in part by its §7.
**Precedence:** document 5. `PRODUCT_BRIEF.md`, `GLOSSARY.md`, `DECISIONS.md`, `SCOPE.md`,
`CONTENT_MODEL.md` and `BOUNDARY_MODEL.md` all outrank it. Where this document appears to
conflict with any of them, they win and the conflict is raised as a formal amendment,
never reconciled in SQL.
**Decisions this file records:** D-08, and the decisions §3 and §6 will carry once the
schema exists.
**Governs:** authentication, authorisation, row-level security, secret handling, and the
database-layer expression of the boundary gate.

`DATA_MODEL.md` (document 7) is authored after this one. No table, column or policy is
fixed here; this document fixes the **rules** every table and policy must satisfy.

---

## §1 The posture in one paragraph

This platform publishes a laboratory's own marketing material and nothing else. It has no
customers, no accounts for the public, no submissions, no messages, and no medical values.
The only humans it authenticates are a handful of the lab's own staff. **A breach of this
database exposes opening hours and equipment photographs.** Every rule below exists to
keep that true, because the moment it stops being true this becomes a very different
system with very different obligations.

---

## §2 Two principals, and only two

| Principal | Authenticates | Holds a row | Can read | Can write |
|---|---|---|---|---|
| `Visitor` | never | never | published material only | never |
| `Operator` | yes, with MFA | in the auth schema only | everything in the application schema | published material only |

There is no third. No API consumer, no machine account for a partner, no integration
identity. `ResultsPortalLink` is a build-time constant and not a principal (D-07).

**`Visitor` is unauthenticated and is never given a session.** No cookie, no token, no
local storage, no hardware fingerprint, no locale preference (`I18N_MODEL.md` §2). A
`Visitor` reading the site leaves nothing behind that could later identify them.

---

## §3 Row-level security

**RLS is enabled on every table in the application schema. Without exception, including
tables that appear to hold nothing sensitive.** A table with RLS disabled is readable and
writable by anyone holding the publishable key, and the publishable key ships in the
browser by design. "This table is only opening hours" is how the first unprotected table
gets created, and the second one is never only opening hours.

**Two policy shapes, and every table uses one of them.**

*Published-read.* Anonymous `SELECT` restricted to rows whose publication state is
published, and nothing else. No `INSERT`, no `UPDATE`, no `DELETE` for the anonymous
role, ever. Applies to `Programme`, `ProgrammeTier`, `ProgrammeLabTest`, `LabTest`,
`LabUnit`, `Branch`, `Offer`, `Equipment`, `Video`, `SiteSettings`, `MediaAsset`, and to
`Announcement` and `ClinicalNotice` when OD-09 takes effect.

*Operator-write.* Full `SELECT`, `INSERT`, `UPDATE` and `DELETE` for an authenticated
`Operator`, on the same tables. There is no per-`Operator` partition: every `Operator`
manages the whole site. A two-person lab does not need a permission matrix, and inventing
one produces a system where a mistake is untraceable rather than one where it is
impossible.

**An unpublished row is not visible to an anonymous request.** This is the mechanism
behind `DESIGN_SYSTEM.md` §12 and behind the clinical gate: a `ClinicalNotice` without a
sign-off record is unpublished, so it does not leave the database, so it cannot reach a
page. **The gate is a policy, not a rendering choice.** A front-end that forgets to check
still shows nothing.

**The `service_role` key is never used by the application.** Not in a route handler, not
in a server component, not in a build step. It bypasses RLS entirely and exists for
administrative tooling run by a human. If a task appears to need it, the policy is wrong
and the policy gets fixed.

---

## §4 Authentication

**Minimum two `Operator` accounts. MFA is required, not optional (D-08.)** Two, because a
single account is a single point of lockout for a business that cannot phone its
developer at midnight. MFA required rather than encouraged, because an optional control on
a two-person team is an absent control.

**Enrolment precedes access.** An `Operator` that has not completed MFA enrolment can
authenticate and can do nothing else. There is no grace period and no "remind me later" —
a grace period on a two-account system is permanent.

**No public sign-up. No password reset by email alone without a second factor. No
social login.** Accounts are created deliberately by a human and there is no route by
which one appears on its own.

**Sessions are short and re-authentication is required for destructive actions.** Deleting
a `Programme` or unpublishing the site's contact details asks for the factor again.

---

## §5 The boundary at the database layer

`BOUNDARY_MODEL.md` §2 is FROZEN and non-waivable: the platform holds **no personal data
and no medical data of any kind.** Expressed as schema rules:

1. **No table holds a name, phone number, email, address, date of birth or identifier of
   any `Visitor` or any patient.** There is no such table and none is added.
2. **No column stores a medical or diagnostic value.** `LabTest` holds the *name of an
   analysis the lab offers*, which is catalogue material and not a measurement.
3. **No audit column references a person.** No `created_by`, no `updated_by`, no
   `deleted_by`, no `owner_id`. Timestamps are permitted; attribution is not. Where
   attribution is genuinely needed later it is a decision, not a default.
4. **No soft-delete keyed to a human.** A `deleted_at` timestamp is acceptable; a
   `deleted_by` is not.
5. **No analytics, telemetry or event table.** Nothing records that a `Visitor` viewed
   anything.
6. **Logs hold no request body and no IP address beyond the platform's own retention**,
   which is outside our control and inside the provider's.

**This is where the tooling will argue with you.** Postgres and Supabase best-practice
guidance recommends `created_by`, account tables, ownership columns and soft deletes keyed
to an actor. That guidance is correct for systems with public accounts. This one has a `Visitor`
who is never persisted and an `Operator` who exists only in the auth schema. Applying the
guidance here produces boundary defects that look exactly like hygiene, and CF-78 tracks
the risk. **Rules 3 and 4 above exist specifically to be quoted back at a suggestion that
seems obviously right.**

---

## §6 The `Operator` and the boundary — the honest tension

An `Operator` account holds an email address and an authentication factor. That is
personal data about a member of the lab's staff.

**This does not contradict §5, and the distinction is deliberate rather than convenient.**
The boundary forbids holding data about `Visitor`s and about patients — the people the
platform serves and never meets. An `Operator` is a named member of the client's own team
who consents to an account in order to do their job, and authenticating them is not
optional if the dashboard is to exist at all.

What binds it:

- `Operator` identity lives in the provider's auth schema and **is never copied into the
  application schema.** No `operators` table, no attribute row, no display-name column.
- The minimum viable set: an email and a factor. No name, no phone, no photograph, no
  role description, no last-seen.
- Two accounts, not ten. The exposure scales with the number and the number is two.
- **CF-39 stays open**: the project sits in `eu-central-2`, which is Zurich, outside the
  EU. `Operator` personal data in a non-EU jurisdiction is an adequacy question, and it
  becomes live at P05 when accounts are created rather than now while none exist. It is
  named here so it is not discovered at P05.

---

## §7 Secrets

**No key, token, project reference, connection string or password enters a commit.**
OD-04 condition 1, and it applies to reports, fences and documents as well as source.

- The publishable key is public by design and ships in the browser. It is protected by
  RLS and by nothing else, which is why §3 admits no exception.
- The `service_role` key is never present in the repository, in an environment file that
  is committed, or in a deployment environment the application reads.
- The project reference is treated as a secret in this repository even though it is not
  strictly one, because a consistent rule survives where a nuanced one does not.
- Secrets referenced in a report are replaced with `[redacted under OD-04 condition 1]`
  and the field is named.

---

## §8 Transport and headers

HTTPS everywhere, HSTS on the production host, and no insecure subresource. Security headers —
CSP, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` — are set at the
cutover and are Opus-class work under the model rule, never Grok.

**CSP is enforceable on this project in a way it usually is not**, because the site loads
nothing from anywhere else: fonts are self-hosted, the map is drawn, video posters are
self-hosted, and there is no analytics, no tag manager and no third-party script. A
restrictive policy costs nothing here and should be written tightly rather than loosely.

The only outbound destinations are the WhatsApp deep link and the `ResultsPortalLink`,
both `Visitor`-initiated navigations to a new browsing context, neither a subresource.

---

## §9 What this document does not decide

- Any table, column, type or index. `DATA_MODEL.md`, authored next.
- The exact SQL of any policy. Written per table at the migration that creates it, against
  the two shapes in §3.
- The MFA factor type, enrolment flow or recovery procedure. `ADMIN_SPEC.md`.
- The cutover header values and the CSP directive list. `CUTOVER_RUNBOOK.md`.
- Whether `eu-central-2` remains acceptable once `Operator` accounts exist. CF-39, live at
  P05.
- Backup, retention and plan tier. CF-37, live at P07.
