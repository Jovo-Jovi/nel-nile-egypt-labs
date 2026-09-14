# ADR-002 — Private `Offer` reads use a live principal

Status: ACCEPTED · 14 September 2026 · builder-authored at P08-T28
Decides for: OD-28 ("Revocation is enforced by a live-principal policy")

## Context

ADR-001 records two claims. Private `Offer` reads were authorised by
testing claim 1 on the access token:

`(auth.jwt() -> 'app_metadata' ->> 'nel_principal') = 'PartnerLab'`

That predicate is true for as long as the token is valid. PostgREST
checks signature and `exp`; it does not consult `auth.sessions`. An
Operator who clears the claim in `auth.users` therefore leaves a revoked
laboratory reading private Offers until the token expires.

Three measurements, none inferred:

- P08-T23 STEP 1: `POST /auth/v1/admin/users/{id}/logout` returns HTTP
  404 on this project's hosted Auth. `GET` user and `PUT` claim-merge
  return 200 on the same id in the same window. STEP 3 (i): that same
  dashboard call leaves sessions 3 → 3. STEP 3 (v): the subject's own
  `POST /ar/partner-lab/sign-out` takes sessions 5 → 0, so global
  sign-out works when the caller holds the session. The Operator never
  does.
- P08-T24 STEP 2: identical bearer, no refresh, no cookie-jar touch.
  `O11-rest-before` HTTP 200, throwaway id present.
  `O11-rest-after` HTTP 200, same throwaway id present.
  `O11-rest-ttl` 3600 seconds.
- P08-T26 Measured output: a `SECURITY DEFINER` function that reads
  `auth.users` for `auth.uid()` can be executed by `authenticated` on
  this project. `positive_count` 1. After clearing `nel_principal` on
  the same session, `negative_count` 0. `anon_count` 0. Seq Scan Filter
  actual time 0.173 ms for one row. STEP 2d rolled the rehearsal back:
  the original M9 `auth.jwt()` predicate quoted intact and the function
  absent.

OD-21 §3 named a `PartnerLabAccount` table in `public` as the authority.
That section is SUSPENDED: OD-20 §3 and BOUNDARY_MODEL.md §2 item 10
forbid a new table or a column identifying an account holder. OD-28
replaces that mechanism without amending OD-20 §3.

## Decision

**Authorization for a private `Offer` read is a live read of
`auth.users`, not a token claim.**

`public."currentNelPrincipal"()` is `SECURITY DEFINER`, `stable`, with
`search_path = public, pg_temp`. It returns
`raw_app_meta_data ->> 'nel_principal'` for `auth.uid()` and no other
column. `Offer_partner_read` tests
`public."currentNelPrincipal"() = 'PartnerLab'`.

Revocation already clears that claim in `auth.users` in the same
request (OD-20 §1). Pointing the policy at the live row makes the next
request a denial, with no token involved.

**ADR-001 still governs. Both of its claims stand.**

Claim 1: `app_metadata.nel_principal` is the principal. Exactly two
values exist, `Operator` and `PartnerLab`. Absent, empty, unrecognised,
or any other value means no principal. That remains the fail-closed
routing gate. It is no longer sufficient on its own for a private
`Offer` read.

Claim 2: `app_metadata.nel_partner_state` is the review record. It is
still never tested in SQL and never gates a read.

This ADR does not supersede those two claims. It changes where claim 1
is read for `Offer`.

**Absence of a principal is denial.** `anon` does not hold `EXECUTE`.
If the function is reached with `auth.uid()` null, it returns null, and
null is not `'PartnerLab'`. That is fail-closed, not access.

**A definer function reads past RLS.** That is why the return type is a
single `text` value: the calling identity's principal string, and
nothing else from `auth.users`. EXECUTE is granted to `authenticated`
alone; `anon` and `service_role` are revoked by name. `postgres` remains
the owner.

## Consequences

The partner-read policy tests the live row. An approved `PartnerLab`
still reads published Offers. A revoked laboratory holding an unexpired
token reads nothing privileged.

Session termination stays out of scope. A revoked session may continue
until it expires or the subject signs out. Under this decision it reads
nothing privileged, which is what OD-20 §2 was trying to achieve.

No new table, column, or claim. BOUNDARY_MODEL.md §2 item 10 and D-40
stand.

## Rejected alternatives

**A `PartnerLabAccount` row in `public`.** OD-21 §3.1–§3.2. Contradicts
OD-20 §3 and BOUNDARY_MODEL.md §2 item 10. Suspended; not this
decision.

**Keep `auth.jwt()` on `Offer_partner_read` and bound exposure by TTL.**
P08-T24 measured the residual as a full private read for 3600 seconds.
OD-28 refuses that residual as the control.

**Repair `invalidateSessions` against a working logout endpoint.**
P08-T23 STEP 1 measured HTTP 404. Session death would not have been
sufficient in any case: PostgREST does not consult `auth.sessions`.
