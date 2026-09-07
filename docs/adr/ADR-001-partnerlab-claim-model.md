# ADR-001 — The `PartnerLab` claim model

Status: ACCEPTED · 7 September 2026 · reviewer-authored at P08-T03
Decides for: OD-15 §4 ("state lives as a claim in the auth schema")

## Context

OD-15 gives a `PartnerLab` three states — pending, approved, rejected — and says
state lives as a claim, "the same pattern as `Operator`". But `Operator` is one
value of one claim, and three states are not. M7B-1 stamped
`app_metadata.nel_principal = "Operator"`; twelve write policies and
`src/lib/dashboard/assurance.ts` both test that exact string. Whatever this
decides has to leave both untouched.

## Decision

**Two claims, with different jobs. Only one of them is ever security-bearing.**

`app_metadata.nel_principal` — the principal. Exactly two values exist:

| Value | Meaning |
|---|---|
| `Operator` | Lab staff. AAL2, writes the application schema. Unchanged. |
| `PartnerLab` | An approved partner laboratory. Reads approved `Offer` rows. Never writes. |

Absent, empty, unrecognised, or any other value means **no principal**, and a
request with no principal reads nothing and writes nothing. That is the
fail-closed property and it is the whole point: every policy and every
application gate tests for one exact string and treats everything else as
refusal. A typo grants nothing.

`app_metadata.nel_partner_state` — the review record, for the Operator's queue.
Present only while an account is not approved:

| Value | Meaning |
|---|---|
| `rejected` | An `Operator` reviewed and declined it. |
| absent | Never reviewed. This is `pending`. |

**`nel_partner_state` is never tested in SQL and never gates a read.** It exists
so the review queue can tell "not yet looked at" from "looked at and declined".
If it were a policy input, two claims would have to agree for access to be
correct, and disagreement would fail open somewhere. One claim decides access.

## Consequences

**Signup writes no claim.** A new account carries neither claim, which is
exactly `pending`. So the signup route calls ordinary `signUp` and never needs
the service role key. A public route holding that key is a far larger risk than
anything this phase is trying to solve, and this decision removes the reason to
have one there.

**Approval is an `Operator` action.** It sets `nel_principal = "PartnerLab"` via
Auth Admin, server-side, behind AAL2, merging `app_metadata` rather than
replacing it — the same merge M7B-1 used to preserve `provider` and `providers`.
Rejection sets `nel_partner_state = "rejected"` and never sets `nel_principal`.

**The claim takes effect on a refreshed token, not immediately.** M7B-1 proved
this for `Operator`. An approved partner sees Offers after their next refresh or
sign-in, not the instant an `Operator` clicks approve. Any screen that implies
otherwise is wrong.

**The partner-read policy, when it lands, tests exactly:**
`(auth.jwt() -> 'app_metadata' ->> 'nel_principal') = 'PartnerLab'`
matching the shape of the twelve Operator-write policies. It is not written by
this ADR and not by P08-T03.

**No public table gains anything.** D-40 stands. The review queue enumerates
accounts through the Auth Admin API server-side; no account row exists in
`public`, satisfying BOUNDARY_MODEL §2 evidence item 10. An applicant's email is
never written to a log line.

## Rejected alternatives

**One claim with four values** (`Operator`, `PartnerLab`, `PartnerLabPending`,
`PartnerLabRejected`). `PartnerLabPending` is a state wearing an entity's name;
GLOSSARY sanctions `PartnerLab` as an exact entity and nothing built from it.
It also makes every policy predicate a set membership rather than an equality.

**Pending as an explicit claim set at signup.** Requires the signup route to
call Auth Admin, which requires the service role key on a public route. Refused
on that ground alone.

**A `PartnerLab` row in a public table.** Contradicts OD-15 §4 and D-40, and
would put an email address in `public` against BOUNDARY_MODEL §2 item 10.
