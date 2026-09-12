# P08-T23 — Can an Operator end a PartnerLab session?

**Evidence tooling. Never current truth, never a spec, never cited as
authority.** PR-09 applies: this file justifies a later decision; it does
not replace `SECURITY_MODEL.md`, `DECISIONS.md` or OD-20. This task
authors nothing under `src/`, no migration, no RLS change, no grant, and
does not edit OD-20.

**Task:** P08-T23 · P08 read-first audit · 12 September 2026
**Git branch:** `p08-t23` from `origin/main` at `8632fbc` (merge of pull
request #125, `p08-t22`). `p08-t22` was merged. Tip of `p08-t22` was
`815a4d6`.
**This file authors no SQL, changes no file under `src/`, and applies
nothing.**

---

## RESIDUAL REPAIRS

None. No UNRATIFIED edit.

Observations that are not repairs, and were not applied:

1. **STEP 0c fragment count.** The fence asked to confirm the fragment
   `invalidateSessions reports non-ok on a completed revocation.` occurs
   exactly once in `docs/SESSION_CONTEXT.md` before editing. It occurred
   twice: the P08-T21-F Verdict cell, and the P08-T22 Task cell (historical
   copy of that verdict). Only the Verdict cell was replaced, with
   `invalidateSessions reports non-ok and the revocation does not complete (measured at P08-T22).`
   Python after the edit: old fragment count 1, new fragment count 1. The
   T22 Task cell was left unedited (PR-32).
2. **Signed addendum hash.** Fence Done-when named `2b63422e…340d`
   (M7B-1 countersigned blob). Current
   `docs/research/clinical-signoff-addendum.md` hashes
   `20b07ec87b8e19531d67f563c00d8081806118b0b595e9005221991393224545`,
   the same blob T21 and T21-F recorded. The file was not edited (PR-32).
3. **Laboratory Offer publication_state.** Done-when expected hashed
   `7cc7436e57b8` still published, one Offer row. Linked query at the end
   of this task: one row, `id_md5_12` `7cc7436e57b8`,
   `publication_state` **draft**. This window issued no UPDATE on that
   id. It was not republished.
4. **Cookie extractor.** The first `O11-rest-before` GET was never issued
   because `@supabase/ssr` stores the session cookie as `base64-` plus
   base64url. `scripts/smoke/partner-lab.mjs` `extractAccessToken` was
   then taught that encoding. A second `smoke:operator` run is forbidden,
   so the extractor is unproven against PostgREST on this branch.

---

## STEP 0 — housekeeping

Working tree was clean before any edit (P08-T16's halt).

Quoted at STEP 0, all exit 0:

- `npm run guard:naming` — PASS (28 SQL files)
- `npm run guard:schema` — PASS (14 forwards; inventory 33)
- `npm run guard:design` — PASS (205 files under `src/`)
- `npm run guard:phases` — PASS; R5 report-only 17 CF-100 rows
- `npm run guard:boundary` — PASS (22 `.html` under `.next/server/app/`)
- `npm run lint` — PASS (`eslint .`)
- `npm run typecheck` — PASS
- `npm run build` — PASS (Next.js 16.3.3; middleware deprecation
  warning only)
- `python -X utf8 data/seed/verify_seed.py` — `124 -> 71`, PASS

P08-T22 Verdict cell set to the mandated halt text. Box stays unchecked.
Unchecked `**P08-T23**` box added in `docs/PHASES.md` immediately after
`**P08-T22**`. P08-T21-F Verdict-cell fragment corrected as in
observation 1.

---

## STEP 1 — name the status. Route B.

**Route A was not available.** `SUPABASE_SERVICE_ROLE_KEY` was absent
from the shell. No POST was issued. The key was not read from
`.env.local`, not copied to Preview, and not written to a file (PR-10,
PR-23).

**Route B was used.** Platform Auth logs for
`POST /auth/v1/admin/users/{id}/logout` issued by the deployed
`invalidateSessions` (`src/lib/dashboard/partnerAccountAdmin.ts:104-117`)
during privilege-removing Operator POSTs:

- HTTP **status `404`**
- `level`: warning
- `msg`: `request completed`
- **`error_code` field absent** from the Auth log JSON

The same Auth Admin user id, on the same project, accepted
`GET /auth/v1/admin/users/{id}` with status 200 and
`PUT /auth/v1/admin/users/{id}` (claim merge) with status 200. Logout
is the call that 404s. Hosted GoTrue on this project does not implement
logout-by-id. `invalidateSessions` treats non-ok as failure, so
`revokeApproved` returns `"write"` and
`src/app/[locale]/dashboard/(session)/(modules)/partner-lab/submit/[action]/route.ts:71`
maps that to `error=write`.

Addresses, keys, JWT payloads and the project ref are redacted.

---

## STEP 2 — database-layer exposure. VOID.

Command, once, attended:

`npm run smoke:operator -- https://nel-nile-egypt-labs.vercel.app`

RESULT FAIL (expected: revoke still returns `error=write`). Do not run
it again.

Against PostgREST directly, not through any page:

`GET ${SUPABASE_URL}/rest/v1/Offer?select=id&publication_state=eq.published`
with `Authorization: Bearer <subject access token>` and the publishable
anon key.

Quoted:

- `O11-rest-ttl` — access-token TTL unreadable (token missing or payload
  lacked exp/iat)
- `O11-rest-before` — FAIL `HTTP 0; no access token`
- `O11-rest-after` — skipped: `positive control VOID; after-result not evidence`

The positive control did not return `[]`. The GET was never issued. The
leg is VOID either way: nothing discriminates. The after-result is not
evidence in either direction. No PostgREST leak or no-leak conclusion is
drawn.

`Offer_partner_read` remains, from the applied forward file
`supabase/migrations/20260908143000_m9_offer_partner_read.sql`:

```
using ((auth.jwt() -> 'app_metadata' ->> 'nel_principal') = 'PartnerLab')
```

on `public."Offer"` alone, `for select` `to authenticated`. The claim
lives in the token. Whether a revoked laboratory retains that read until
the access token expires is **UNMEASURED**.

Access-token TTL integer: **unmeasured**. `supabase/config.toml` is not
authoritative for hosted Auth (CF-158) and is not quoted as the TTL.

---

## STEP 3 — mechanisms, tested against the throwaway

Each verdict is AVAILABLE or NOT AVAILABLE **on this project, tested**.
Session counts are `auth.sessions` rows for that id, with live
`auth.refresh_tokens` where the uuid cast succeeded.

The Operator dashboard review POST sends only `subjectId`
(`route.ts:66-69`). It never holds the subject's JWT. That confirms the
comment at `partnerAccountAdmin.ts:100-103`.

### (i) `POST /auth/v1/admin/users/{id}/logout` — the current call

**NOT AVAILABLE.**

Command: the deployed revoke-to-pending path, which is
`invalidateSessions` → that POST with the service-role key from the
Vercel production runtime.

- Auth log: HTTP **404** (STEP 1 Route B)
- Smoke: `O11-sessions` **3 → 3** (live refresh tokens 3 → 3)
- Same shape on `O5-reject-sessions` 1 → 1, `O10-reject-sessions` 2 → 2,
  `O12-sessions` 3 → 3

STEP 1 names why it fails: hosted Auth returns 404 for logout-by-id.

### (ii) `supabase.auth.admin.signOut(jwt, scope)`

**NOT AVAILABLE to the Operator.** The mechanism requires the subject's
JWT. The Operator route does not hold it. Comment at
`partnerAccountAdmin.ts:100-103` **confirmed**.

What it requires, tested rather than typed: `POST /auth/v1/logout?scope=global`
with `Authorization: Bearer <subject access token>` and the publishable
apikey.

- Direct JWT POST this run: **sessions 4 → 4**, HTTP **0** (no access
  token extracted from the cookie jar; same extractor miss as STEP 2)
- When the caller *does* hold the session, the same global sign-out
  works — see (v)

Default scope on the client `signOut` used by this app is `"global"`
(`src/app/[locale]/partner-lab/sign-out/route.ts:15`).

### (iii) `DELETE /auth/v1/admin/users/{id}`

**NOT a revocation path.** OD-20 §1 returns an account to pending or
rejected. OD-20 §4: revocation is not deletion; the auth row survives.

Tested with the publishable apikey (service-role key absent from the
shell; no Route A):

- HTTP **401**
- body (redacted): `error_code` `no_authorization`; `msg` `This endpoint requires a valid Bearer token`
- sessions **0 → 0** (SQL at (iv) had already zeroed them)
- `auth.users` remaining **1**

Cost, if it ever succeeded with the service role: destroys the account.
That is not OD-20 §1.

### (iv) Deleting `auth.sessions` / `auth.refresh_tokens` via `npx supabase db query --linked`

**AVAILABLE to a human with the CLI. NOT AVAILABLE to the deployed
application.**

Command: linked SQL `delete from auth.sessions where user_id = '<id>'::uuid`
and the matching `auth.refresh_tokens` delete (uuid cast, with varchar
fallback).

- After a fresh subject sign-in: **sessions 1 → 0** (live refresh
  tokens 1 → 0)
- Deleted 1 session row, 0 refresh rows on the returning clause of that
  attempt (refresh rows were already gone or the returning set was empty);
  session count after the delete was 0

The deployed application reaches Postgres through PostgREST as `anon` /
`authenticated`. The `auth` schema is not exposed. An Operator dashboard
action that only a human with the CLI can perform is not an
implementation of OD-20 §2.

Authoring a migration, an RLS change, a grant, or exposing the `auth`
schema would be required to put this on the dashboard. That is a finding.
It is not authored here.

### (v) `POST /{locale}/partner-lab/sign-out`

**AVAILABLE to the subject. NOT AVAILABLE to the Operator.**

Command: `POST /ar/partner-lab/sign-out` with the subject's cookies.
Handler: `supabase.auth.signOut({ scope: "global" })`.

- **sessions 5 → 0** (live refresh tokens 5 → 0)
- HTTP **303** Location `/ar/offers`

This is the proof that global sign-out *can* zero sessions on this
project when the caller holds the session. The Operator review action
does not hold it.

No further mechanism was found that the Operator dashboard can call
without the subject's JWT, without deleting the account, and without a
human CLI session.

---

## STEP 4 — OD-20 §2, and a proposal, not a decision

**None of (i)–(v) is AVAILABLE to the deployed Operator dashboard as
OD-20 §2.** There is therefore no T24 mechanism to name. OD-20 is not
edited.

### What OD-20 §2 promised

Signed 10 September 2026. Revocation invalidates the account's sessions.
Approval may wait for the next token refresh because the delay grants
nothing. Revocation may not: a revoked laboratory holding a live token
would keep reading private Offers until it expired. The revoking action
signs the account out server-side, so access ends when the Operator acts
and not later.

### What is technically available

- Claim merge via Auth Admin `updateUserById` **works** (GET/PUT 200).
  That is OD-20 §1. It is why `O11-token` can PASS: the page refreshes
  and the new JWT has no `PartnerLab` principal.
- Logout-by-id **does not work** (HTTP 404). That is the call the
  dashboard already makes.
- Global sign-out **works** when the subject is the caller ((v) 5 → 0).
- CLI SQL against `auth.sessions` **works** ((iv) 1 → 0) and is not
  reachable from the app.
- Account deletion is forbidden by OD-20 §4 and is not a revocation.

Access tokens remain valid until `exp` even after refresh tokens are
destroyed. That is platform Auth behaviour, not measured at PostgREST
in this task (STEP 2 VOID).

### Two interim mitigations for the reviewer to weigh

Neither is applied here.

1. **Shorten the access-token TTL** so the exposure window is a project
   setting rather than application code. The integer is unmeasured on
   this run. Read it from the dashboard, or from a decoded throwaway
   `exp` minus `iat`, before choosing a value.
2. **Whether `Offer_partner_read` should test something other than a
   token claim.** Today it matches
   `(auth.jwt() -> 'app_metadata' ->> 'nel_principal') = 'PartnerLab'`.
   Clearing the claim in Auth Admin does not rewrite JWTs already
   issued. A policy that consulted live `app_metadata` (or anything
   other than `auth.jwt()`) would be a migration and an RLS change. That
   is a finding, not an implementation.

---

## STEP 5 — landing

This file. Row added to `docs/research/README.md`.

CF-169 appended, not rewritten. CF-170 allocated from live maximum 169.

`git ls-files supabase/migrations/` → 28, unchanged.

Catalogue `python` over quoted keys in `src/lib/catalog.ts`: ar 590,
en 590, identical, 0 duplicates.

SHA-256 of the three signed artefacts (`python hashlib` over the file
bytes):

- worklist `22b2c73b697460b2def3a86e4b6489c987874a071c4d9c0f792a46612197569f`
- sign-off `aa0469eedad99a4f55acd469912689df511311343ec8f31bb75cabf8c577aef7`
- addendum `20b07ec87b8e19531d67f563c00d8081806118b0b595e9005221991393224545`

Throwaways: `nel-smoke-%` Auth count 0 (linked SQL, read back).
Throwaway Offer gone (O13). Laboratory Offer hashed `7cc7436e57b8`
present, one row, `publication_state` draft — see observation 3.

Tracked research files, excluding README and `assets/`:

```
python -X utf8 -c "import subprocess; out=subprocess.check_output(['git','ls-files','docs/research/'], text=True); files=[l for l in out.splitlines() if l and 'README' not in l and '/assets/' not in l.replace(chr(92),'/')]; print(len(files))"
```

→ **27** before this file is tracked, **28** after `git add` of this file.

---

## End-of-task housekeeping (quoted again)

All exit 0:

- `npm run guard:naming` — PASS (28 SQL files)
- `npm run guard:schema` — PASS (14 forwards; inventory 33)
- `npm run guard:design` — PASS (205 files under `src/`)
- `npm run guard:phases` — PASS; R5 report-only 17 CF-100 rows
- `npm run lint` — PASS (`eslint .`)
- `npm run typecheck` — PASS
- `npm run build` — PASS (Next.js 16.3.3; middleware deprecation
  warning only)
- `npm run guard:boundary` — PASS (22 `.html` under `.next/server/app/`)
- `python -X utf8 data/seed/verify_seed.py` — `124 -> 71`, PASS

Do not start G8-R2 or P06 from this window. Do not edit OD-20. Do not
make `invalidateSessions` return true.

---

## Correction — 12 September 2026 · P08-T24

The addendum hashes at lines 35 and 315 of this file recorded
`20b07ec87b8e19531d67f563c00d8081806118b0b595e9005221991393224545`.
That digest is the sha256 of the CRLF-converted working file on a
Windows checkout without `.gitattributes`. The sha256 of the committed
bytes, by `git show HEAD:docs/research/clinical-signoff-addendum.md | sha256sum`,
is `2b63422efa63f256aef7fcac6f3a3ec3178148a60a3a85199810c75468b5340d`.
The file did not change. Blob
`612d7491119e03fb594026199f9ac3edc8cf1dd8` is identical on `origin/main`
and on `HEAD`. Body text above is unedited (PR-32). Precedent **PR-35**;
carry-forward **CF-171**.
