# G10 — production evidence, 15 September 2026

**This is the evidence pack.** P10-T04. Read-only against production apart
from this task's own throwaways. No source, migration or schema change.

**Precedence:** none — evidence. Never a parity target (PR-09). This file
decides nothing. **The reviewer issues G10.** This task does not record
G10 as PASSED and does not check the **G10** box.

**Redaction.** Email addresses other than synthetic `nel.invalid`
addresses, keys, tokens, JWT payloads, connection strings, the Supabase
project ref, hotline and WhatsApp numbers, Branch addresses and
coordinate values do not appear here. Numeric identifiers, synthetic
`nel.invalid` addresses, statuses, Locations, timings and counts are
reported in full. Passwords are never reported.

**No source, migration or schema change.**
`git diff --stat origin/main -- src/ supabase/ data/seed/` is empty.

---

## STEP 0 — tree, guards, digests, ledger

Working tree clean at cut. Branch `p10-t04` cut from `origin/main` at
`b1a24f2ef7660d8864a4b3f058aa4fa78ac7dc9a` (merge of pull request #159 /
`p10-t03`).

Quoted, all exit 0:

- `npm run guard:naming` — PASS (36 SQL files)
- `npm run guard:schema` — PASS (18 forwards; inventory 35)
- `npm run guard:design` — PASS (231 files under `src/`)
- `npm run guard:phases` — PASS (R5 report-only 17 historical rows)
- `npm run lint` — PASS
- `npm run typecheck` — PASS
- `npm run build` — PASS (Next.js 16.3.3; middleware deprecation warning
  only)
- `python -X utf8 data/seed/verify_seed.py` — `124 -> 71`, PASS, QA-flagged
  0
- `npm run guard:boundary` — PASS after the build, scanned 24 html under
  `.next/server/app/`

P10-T03 Verdict cell set to exactly:

`PASS at reviewer verdict — 14 September 2026; two-field form, createUser with no app_metadata so the account is pending under ADR-001, password proved absent from the result object by property assertion, item 9 re-read against all three creation paths. Seven production legs correctly deferred. R3 residual repair RATIFIED.`

`**P10-T03**` checked. Unchecked `**P10-T04**` added. `**P06-T11**` and
`**P06-T03**` stay unchecked (PR-36). **G10** stays unchecked.

**Clinical digests by PR-37.**
`subprocess.run(["git","show",f"HEAD:{path}"], capture_output=True).stdout`
hashed with `hashlib.sha256` — no shell pipe.

| Artefact | Digest |
|---|---|
| `docs/research/clinical-worklist.md` | `22b2c73b697460b2def3a86e4b6489c987874a071c4d9c0f792a46612197569f` |
| `docs/research/clinical-signoff.md` | `aa0469eedad99a4f55acd469912689df511311343ec8f31bb75cabf8c577aef7` |
| `docs/research/clinical-signoff-addendum.md` | `2b63422efa63f256aef7fcac6f3a3ec3178148a60a3a85199810c75468b5340d` |

No mismatch. No halt.

**CF-200** OPEN, owner builder, P09. The PartnerLab provisioning form has
not been rendered in a browser because it sits behind AAL2, so its RTL
layout, keyboard order and focus behaviour are asserted from source. Do
not repair it. Open arithmetic at landing: 103 + 1 − 0 = 104. Next free
id CF-201. CF-198 closed later in this file once STEP 3 resolved it.

**html 24** (python `Path('.next/server/app').rglob('*.html')` after the
STEP 0 build). The provision route is a POST handler and emits none, as
T03 recorded. Read from `.next/app-path-routes-manifest.json`:
`/[locale]/dashboard/(session)/(modules)/partner-lab/provision/route` →
`/[locale]/dashboard/partner-lab/provision`. Route table unchanged from
T03.

---

## STEP 1 — production identity

Command. `npx vercel api /v13/deployments/nel-nile-egypt-labs.vercel.app`

| Field | Value |
|---|---|
| `gitSource.sha` | `b1a24f2ef7660d8864a4b3f058aa4fa78ac7dc9a` |
| `readyState` | READY |
| `readySubstate` | PROMOTED |
| `target` | production |
| `githubCommitMessage` | Merge pull request #159 from Jovo-Jovi/p10-t03 |

`git rev-parse origin/main` → `b1a24f2ef7660d8864a4b3f058aa4fa78ac7dc9a`.
Equal.

The provision handler exists at that SHA.
Command.
`git cat-file -e "b1a24f2ef7660d8864a4b3f058aa4fa78ac7dc9a:src/app/[locale]/dashboard/(session)/(modules)/partner-lab/provision/route.ts"`
Exit 0.

`SUPABASE_SERVICE_ROLE_KEY` is present on the production deployment env
list (name only; value not read). Preview was not given the key.

---

## STEP 2 — seven legs, as an Operator on production

AAL2 on the production alias was obtained by minting a throwaway
Operator through public signup, merging `nel_principal = Operator` on
that new row only (provider and providers survived), signing in through
`/dashboard/sign-in`, and enrolling TOTP through `/dashboard/enrol`.
`npm run smoke:operator` was not run. Lasting accounts were not modified.
The Operator sidecar was deleted in the same session; its Auth row and
identities read back 0. Baseline and end totals were both `auth.users` 6
and `auth.identities` 6.

The PartnerLab throwaway identifier is `00015092604` (leading zeros).
Synthetic address `00015092604@nel.invalid`. Password never reported.

### Provision

POST `https://nel-nile-egypt-labs.vercel.app/ar/dashboard/partner-lab/provision`
with `numeric_identifier` and `password` only.

HTTP 303. Location `/ar/dashboard/partner-lab?provision=created`.

### Leg 1 — `auth.users`, leading zeros, pending

Linked SELECT on `email = '00015092604@nel.invalid'`.

- email `00015092604@nel.invalid` (leading zeros intact)
- `nel_principal` absent
- `nel_partner_state` absent
- claim keys `provider`, `providers` only

Pending under ADR-001. Not anything else. No halt.

### Leg 2 — sign in, both locales

POST `/{locale}/partner-lab/sign-in/submit` with the numeric identifier.

| Locale | status | Location | Set-Cookie |
|---|---|---|---|
| ar | 303 | `/ar/offers` | 1 |
| en | 303 | `/en/offers` | 1 |

### Leg 3 — pending cannot read a private Offer

While pending, GET `/{locale}/offers` with the session:

- ar HTTP 200, pending title `الطلب قيد المراجعة` present
- en HTTP 200, pending title `Request pending review` present

PostgREST `GET /rest/v1/Offer?select=id&publication_state=eq.published`
with that session's bearer: HTTP 200, body `[]` (0 rows).

### Leg 4 — approve, then read. Positive control for leg 5

POST `/ar/dashboard/partner-lab/submit/approve` with `subjectId`.

HTTP 303. Location `/ar/dashboard/partner-lab?view=approved&saved=1`.

Linked re-read: `nel_principal = PartnerLab`; `nel_partner_state` absent.

Sign in again with the numeric identifier. HTTP 303 Location `/ar/offers`.
GET `/ar/offers` HTTP 200; pending title absent.

PostgREST with the **new** bearer: HTTP 200, **1** published row. That
is the positive control. Without it, leg 5 proves nothing.

### Leg 5 — revoke, identical bearer returns `[]`

POST `/ar/dashboard/partner-lab/submit/revoke-to-pending`.

HTTP 303. Location
`/ar/dashboard/partner-lab?view=pending&saved=1&ended=1`.

The **same** bearer from leg 4, no refresh: PostgREST HTTP 200, body
`[]`. The G8 identical-bearer check.

### Leg 6 — same state machine as self-signup

POST `/ar/dashboard/partner-lab/submit/reject` after the revoke-to-pending.

HTTP 303. Location `/ar/dashboard/partner-lab?view=rejected&saved=1`.

Linked re-read: `nel_principal` absent; `nel_partner_state = rejected`.

Compared against G8-R2 `O5-reject-claim` (principal absent, state
`rejected`) and against T02's self-signup pending shape (`provider`,
`providers` only at creation). Approve, reject and revoke used the
existing `submit/[action]` routes. No second self-signup throwaway was
created.

### Leg 7 — delete and read back

SQL `delete from auth.users` on the throwaway id (Auth Admin DELETE was
attempted and returned HTTP 0 in this shell; SQL was used). Identities
deleted with the user.

Read back:

- `auth.users` where email `00015092604@nel.invalid` → 0
- `auth.identities` for that user id → 0
- totals `auth.users` 6, `auth.identities` 6 (same as baseline)

The Operator sidecar: users 0, identities 0.

---

## STEP 3 — CF-198, timing through the Vercel edge

Against `https://nel-nile-egypt-labs.vercel.app`, not a local build.
The six T02 neutrality cases, both locales.

Warmup discarded: **12** (one of each case × locale). Then **30 samples
per case per locale**, **360** measured requests. Order randomised
across the 360, not measured case by case. Quantiles: linear
interpolation on sorted samples.

Wrong password on every sample. Known identifier is `00015092604` /
`00015092604@nel.invalid` while that row still existed.

| Case | locale | n | median ms | p90 ms | IQR ms |
|---|---|---|---|---|---|
| known-numeric | ar | 30 | 324.5 | 406.0 | 56.9 |
| known-email | ar | 30 | 302.4 | 381.7 | 42.4 |
| unknown-same-len | ar | 30 | 306.8 | 456.2 | 33.6 |
| unknown-diff-len | ar | 30 | 316.3 | 358.4 | 40.0 |
| unknown-email | ar | 30 | 300.2 | 360.5 | 37.5 |
| malformed | ar | 30 | 190.3 | 251.1 | 33.0 |
| known-numeric | en | 30 | 313.5 | 389.9 | 72.2 |
| known-email | en | 30 | 314.4 | 401.7 | 68.0 |
| unknown-same-len | en | 30 | 310.4 | 388.8 | 31.9 |
| unknown-diff-len | en | 30 | 303.0 | 350.9 | 20.9 |
| unknown-email | en | 30 | 311.1 | 371.1 | 23.9 |
| malformed | en | 30 | 186.3 | 231.6 | 21.4 |

### Five HTTP fields, per locale

Every sample in `ar`, all six cases:

| Field | Value |
|---|---|
| status | 303 |
| Location | `/ar/partner-lab/sign-in?error=1` |
| body length | 0 |
| body sha256 | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| Set-Cookie count | 0 |

Every sample in `en`, all six cases: the same five fields with Location
`/en/partner-lab/sign-in?error=1`. Identical across the six. The empty
body digest is T02's.

A first script compared the twelve (case × locale) field tuples to each
other and treated `/ar/…` ≠ `/en/…` as a difference. That is a
locale-path difference T02 already named, not a case difference. It is
not a HALT. The six cases are identical inside each locale.

### Two timing questions

**1. Is a recognised format separable from a malformed one?**
Yes. Malformed medians 190.3 ms (`ar`) and 186.3 ms (`en`). Auth-backed
recognised-format medians sit at 300–325 ms. Median gap about 130 ms,
several times the malformed IQR (33.0 / 21.4). That is the T02 local
split (3–4 ms vs 109–466 ms) seen through the edge: the malformed path
does not call Auth (`resolvePartnerLabSignInIdentifier` returns
`neutral`). OD-18 §6 does not turn on this question.

**2. Is a known identifier separable from an unknown one of the same
format?**
No. This is the OD-18 §6 question.

| locale | known-numeric median | unknown-same-len median | Δ | known IQR | unknown IQR | Δ / larger IQR |
|---|---|---|---|---|---|---|
| ar | 324.5 | 306.8 | 17.7 | 56.9 | 33.6 | 0.31 |
| en | 313.5 | 310.4 | 3.1 | 72.2 | 31.9 | 0.04 |

The medians overlap inside the IQRs. The `en` gap is 3 ms on a 72 ms
IQR. That is not an enumeration oracle. Not a HALT. No mitigation in
this task.

CF-198 is closed on this measurement.

---

## STEP 4 — the rest of G10's evidence

### BOUNDARY_MODEL.md §2 item 9 — three handlers at the deployed SHA

Read at `b1a24f2`, not inferred.

1. **Self-signup** `src/app/[locale]/partner-lab/sign-up/submit/route.ts`
   loop at lines 94–98: only `email`, `password`, `confirm_password`.
   Extra key `lab_name` live POST: HTTP 303, Location
   `/ar/partner-lab/sign-up?error=1`. Zero `p10t04extra-` Auth rows.

2. **Sign-in** `src/app/[locale]/partner-lab/sign-in/submit/route.ts`
   lines 25–32: reads `email` and `password` only. There is no extra-key
   loop; extra keys are ignored. Neutral failure is still `?error=1`.

3. **Provisioning** `src/app/[locale]/dashboard/(session)/(modules)/partner-lab/provision/route.ts`
   loop at lines 34–37: only `numeric_identifier` and `password`. Extra
   key `lab_name` live POST behind AAL2: HTTP 303, Location
   `/ar/dashboard/partner-lab?provision=write`.

### Item 10 — `information_schema`

Command. `npx supabase db query --linked` over `information_schema`.

public tables **13**, public columns **182**. Columns named
`created_by` / `owner` / `email` / `password` / `patient*` / `birth*` :
**0**. D-40 untouched. Nothing in `public` identifies an account holder.

### Item 11 — live privacy text

Unauthenticated GET:

- `/ar/privacy-policy` HTTP 200. Contains
  `يحتفظ الموقع بعنوان البريد الإلكتروني وكلمة` and `PartnerLab`.
- `/en/privacy-policy` HTTP 200. Contains “When a PartnerLab account is
  created, the website stores the email address and password required
  for that account.”

### Existing self-signup and existing email sign-in

Measured, not assumed.

- POST `/ar/partner-lab/sign-up/submit` with the throwaway's already-held
  `00015092604@nel.invalid`: HTTP 303, Location
  `/ar/partner-lab/sign-up?created=1`. Users for that address remained 1
  (OD-18 §2 inert).
- POST `/ar/partner-lab/sign-in/submit` with that mapped address and the
  provisioned password: HTTP 303, Location `/ar/offers`. Email-path
  sign-in still works.

Lasting accounts were not signed into. Totals 6 / 6 before and after.

### T01 injectivity, restated not re-derived

P10-T01: mapping injective and round-trip over 1,111,110 generated
1-to-6-digit strings; `123`, `0123` and `00123` are three addresses.
This run's specs include those tests unchanged (81 pass, 0 fail,
excluding `brandHead.spec.ts`, CF-184). Leg 1 of this task is the live
leading-zero counterpart: `00015092604` stored exactly.

### P10 carry-forwards

| Id | Status | Blocks G10? |
|---|---|---|
| CF-198 | CLOSED at P10-T04 | No. STEP 3 answers OD-18 §6 for numeric identifiers: known vs unknown of the same format is not separable. |
| CF-199 | CLOSED at P10-T03 | No. Identities for the T02 throwaway were already 0. |
| CF-200 | OPEN, P09 | No. AAL2-behind layout is the same class as CF-197. G10 does not require a rendered Operator form. |

Nothing else in the ledger has Lands-at P10 or G10.

---

## Counts

- `git ls-files supabase/migrations/ \| wc -l` → 36 (python over
  `git ls-files`)
- html 24
- route table unchanged from T03 (provision POST present, no new html)
- catalogue `python -X utf8 scripts/audit/p06-standing-counts.py`:
  ar 636, en 636, identical order, identical set, dup 0 / 0
- `grep -c "^### OD-"` → 30
- `grep -c "^### D-"` → 49
- DRAFT status lines 0
- OD-21 §3 still SUSPENDED
- Open CF 103 + 1 − 1 = 103 (base 103; CF-200 added; CF-198 closed)
- Research excluding README and `assets/`: base 32, this file 33
- Specs: `node --import ./scripts/spec/register.mjs --test` over ten
  spec files excluding `brandHead.spec.ts` (CF-184): **81 pass, 0 fail**

G10 is not recorded as PASSED.
