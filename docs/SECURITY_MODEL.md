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
**Amended at P07-T03 · authored 24 September 2026:** §3, §4, §7, §8 and §9 are brought to
the delivered state — the Offer read after M10 and OD-28, the Operator claim of M7B-2, the
bounded service-role use of ADR-001 and OD-30, and the fourth policy shape of OD-27. One
§4 requirement is recorded as not delivered rather than removed.

`DATA_MODEL.md` (document 7) is authored after this one. No table, column or policy is
fixed here; this document fixes the **rules** every table and policy must satisfy.

---

## §1 The posture in one paragraph

This platform publishes a laboratory's own marketing material and nothing else. It has no
customers, no messages, no submissions of personal or medical information, and no
medical values. It authenticates a handful of the lab's own staff as `Operator`, and
under OD-15 other laboratories as `PartnerLab`, who hold an authentication credential
and read approved `Offer` rows. Both are business parties. Neither is a member of the
public seeking care, and no one who is ever holds an account here. **A breach of this
database exposes opening hours and equipment photographs.** Every rule below exists to
keep that true, because the moment it stops being true this becomes a very different
system with very different obligations.

---

## §2 Three principals

**RATIFIED at P08-T02 under PR-15.** The §2 three-principal repair is ratified because landing partner-read in §3 while §2 read "There is no third" would have made one file contradict itself.

| Principal | Authenticates | Holds a row | Can read | Can write |
|---|---|---|---|---|
| `Visitor` | never | never | published material only | never |
| `Operator` | yes, with MFA | in the auth schema only | everything in the application schema | published material only |
| `PartnerLab` | yes, without MFA | in the auth schema only | approved Offers only | never |

No API consumer, no machine account, no integration identity. `ResultsPortalLink` is
a build-time constant and not a principal (D-07).

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

**Four policy shapes, and every table uses one or more of them.** Twenty-five policies on
thirteen tables in `public`, plus two on `storage.objects` for the `media-asset` bucket,
counted by `scripts/audit/inventory.py` from the forward migrations.

*Published-read.* Anonymous `SELECT` restricted to rows whose publication state is
published, and nothing else. No `INSERT`, no `UPDATE`, no `DELETE` for the anonymous
role, ever. Applies to `Programme`, `ProgrammeTier`, `ProgrammeLabTest`, `LabTest`,
`LabUnit`, `Branch`, `Equipment`, `Video`, `SiteSettings`, `MediaAsset` and
`Announcement`, and to the `media-asset` bucket for objects a published `MediaAsset` row
names. **Not to `Offer`**: its anonymous read policy was dropped at M10 (OD-15), so an
anonymous request reads no `Offer` row, published or not.

*Operator-write.* Full `SELECT`, `INSERT`, `UPDATE` and `DELETE` for an authenticated
`Operator`, on the same tables and on `Offer` — twelve tables and the bucket. Since M7B-2
every write policy requires `app_metadata.nel_principal = 'Operator'` in the session token,
and the application gate checks the same claim before AAL2 (M7C). There is no per-`Operator` partition: every `Operator`
manages the whole site. A two-person lab does not need a permission matrix, and inventing
one produces a system where a mistake is untraceable rather than one where it is
impossible.

*Partner-read.* `for select to authenticated`, gated on the approved claim. A
`PartnerLab` with that claim may `SELECT` published Offers; rejected and pending
accounts read nothing (OD-15 §8). No write of any kind. The two shapes above are
unchanged. As delivered the policy reads the principal from live server-side account
state through `public."currentNelPrincipal"()`, not from the session token, so a revoked
`PartnerLab` reads nothing on its next request (OD-28, ADR-002).

*Operator-read.* `PublicationMaximum` is readable by an `Operator` and writable by no
role through the API. Its values change by migration (OD-27).

**An unpublished row is not visible to an anonymous request.** This is the mechanism
behind `DESIGN_SYSTEM.md` §12 and behind the clinical gate: a clinical record that has not
been published does not leave the database, so it cannot reach a page. **The gate is a policy, not a rendering choice.** A front-end that forgets to check
still shows nothing.

**The `service_role` key is never used by the application for data.** Not for a table read
or write, not on a public or `PartnerLab` route, not in a Client Component, not in a build
step. It bypasses RLS entirely. If a data task appears to need it, the policy is wrong and
the policy gets fixed.

**One bounded use, decided by ADR-001 and OD-30 §8.** Account administration that only the
Auth Admin API can perform uses the key server-side, on `Operator` routes behind AAL2 and
the `Operator` claim: approving, rejecting, reinstating and revoking a `PartnerLab`
(OD-15, OD-18, OD-20), and provisioning one with a numeric identifier (OD-30). The client
is created in `src/lib/supabase/serviceRole.ts` and calls `auth.admin` only. Production
holds the key; Preview does not and must not, and the provisioning surface says so when it
is absent.

---

## §4 Authentication

**Minimum two `Operator` accounts. MFA is required, not optional (D-08.)** Two, because a
single account is a single point of lockout for a business that cannot phone its
developer at midnight. MFA required rather than encouraged, because an optional control on
a two-person team is an absent control.

**Enrolment precedes access.** An `Operator` that has not completed MFA enrolment can
authenticate and can do nothing else. There is no grace period and no "remind me later" —
a grace period on a two-account system is permanent.

**No social login. No password reset for an `Operator` by email alone without a second
factor.** An `Operator` account is created deliberately by a human and there is no route
by which one appears on its own.

**One bounded exception, added at P08-T20.** The `operator` smoke mode creates a
temporary `Operator` by signing up through the public form and promoting the account
through the authenticated Supabase CLI. It is still created deliberately by a human —
the human invokes the run — and it deletes itself in the same run. It is not a standing
account and it must never run unattended: no scheduler, no CI trigger, no hook. While it
exists it holds write access to every `Operator`-writable table, the clinical catalogue
among them, so a failed cleanup is a security incident and the mode reports it as one.

**`PartnerLab` signup is open when enabled; access is not (OD-15 §4).** The signup route
resolves only while `NEL_PARTNER_SIGNUP` is `on`. OD-30 adds a second path: an `Operator`
provisions an account with a numeric identifier and a password, and it enters the same
approval state machine. Anyone may create an account.
A new account is `pending`, may sign in, and reads nothing — no `Offer`, no title, no
price, no image. An `Operator` approves or rejects it. A rejected account reads nothing
either. Open signup is not open access: the approved claim is what grants reading, and
only an `Operator` sets it.

**MFA is an `Operator` requirement and is not a `PartnerLab` one (OD-15 §5).** AAL2 and
TOTP under D-08 gate write access to the application schema. A `PartnerLab` never writes
anywhere, so a second factor would protect nothing and would gate approval on an
unrelated step. `Operator` is AAL2 plus an operator claim; `PartnerLab` is a normal
authenticated session plus an approved claim. Neither implies the other.

**Sessions are short and re-authentication is required for destructive actions.** Deleting
a `Programme` or unpublishing the site's contact details asks for the factor again.
**Not delivered.** As built, a destructive action requires a typed confirmation naming the
row (`ADMIN_SPEC.md` §4d) inside an AAL2 session; no route asks for the factor again. The
requirement is unchanged and is not met. OD-37 §4 records it as a finding of the delivered
state, and a carry-forward landed at P07-T03 holds it for the G7 triage.

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
- **CF-39 is closed at P05-T01**: the project sits in `eu-central-2`, which is Zurich, outside the
  EU. `Operator` personal data in a non-EU jurisdiction is an adequacy question, and it
  becomes live at P05 when accounts are created rather than now while none exist. It is
  named here so it is not discovered at P05.

---

## §7 Secrets

**No key, token, project reference, connection string or password enters a commit.**
OD-04 condition 1, and it applies to reports, fences and documents as well as source.

- The publishable key is public by design and ships in the browser. It is protected by
  RLS and by nothing else, which is why §3 admits no exception.
- The `service_role` key is never present in the repository or in an environment file that
  is committed. It is present in the Production deployment environment only, for the §3
  bounded use, and never under a `NEXT_PUBLIC_` name.
- The project reference is treated as a secret in this repository even though it is not
  strictly one, because a consistent rule survives where a nuanced one does not.
- Secrets referenced in a report are replaced with `[redacted under OD-04 condition 1]`
  and the field is named.

---

## §8 Transport and headers

HTTPS everywhere and no insecure subresource. Security headers are set site-wide in
`next.config.ts` (OD-38): `Strict-Transport-Security` without `includeSubDomains` or
`preload`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`,
`X-Frame-Options: DENY`, and an enforced Content-Security-Policy whose `frame-src` permits
only the Operator's YouTube preview and Vercel's preview tooling, excluding the
results-portal host. The full script and connect allow-list is deferred (OD-38 §4). OD-17
made the model tiers advisory.

**CSP is enforceable on this project in a way it usually is not**, because the site loads
nothing from anywhere else: fonts are self-hosted, the map is drawn, video posters are
self-hosted, and there is no analytics, no tag manager and no third-party script. A
restrictive policy costs nothing here and should be written tightly rather than loosely.

The outbound destinations are the WhatsApp deep link, the `ResultsPortalLink`, the
published hotline as a `tel:` link (OD-33), the four published social profiles, each
`Video`'s YouTube page, and the development-credit link (OD-32). Every one is a
`Visitor`-initiated navigation, none is a subresource, and none carries data from this
system.

---

## §9 What this document does not decide

- Any table, column, type or index. `DATA_MODEL.md`.
- The exact SQL of any policy. Written per table at the migration that creates it, against
  the shapes in §3.
- The MFA factor type, enrolment flow or recovery procedure. `ADMIN_SPEC.md`.
- The cutover header values and the CSP directive list. `CUTOVER_RUNBOOK.md`.
- The hosting region is settled by D-47; CF-39 is closed.
- Backup, retention and plan tier. CF-37, live at P07.
