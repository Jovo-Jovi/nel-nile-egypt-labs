# G8-R2 — gate re-run, 14 September 2026

**This is the gate run.** P08-T29. One attended `npm run smoke:operator --
https://nel-nile-egypt-labs.vercel.app`. That run is not repeated.

**Precedence:** none — evidence. Never a parity target (PR-09). This file
decides nothing. **The reviewer issues G8.** This task does not record G8
as PASSED and does not check the **G8** or **G8-R2** boxes.

`docs/research/g8r-evidence.md` is the failed G8-R record of 10 September
2026 and is not edited.

**Redaction.** Email addresses, keys, tokens, JWT payloads, connection
strings, the Supabase project ref, hotline and WhatsApp numbers, Branch
addresses and coordinate values do not appear here. Locations, HTTP
statuses, response bodies carrying only ids, claim key names, counts and
route tables are reported in full.

**No source, migration or schema change.**
`git diff --stat origin/main -- src/ supabase/ data/seed/` is empty.

---

## P10 restatement (P08-T20) — still in force

G8-R could not restore published `Offer` count to 0 without unpublishing
a laboratory row (hashed id `7cc7436e57b8`, published 9 September 2026).
That row was not created by the suite. P10 as "published count back to 0"
therefore asked the gate to disturb live laboratory data. That is the
defect.

**Restatement, in force for G8-R2 and `smoke:operator`.** A run cleans up
only data it created, identified by its own marker in the Offer titles.
It may unpublish and delete that throwaway row after the marker check.
It must refuse to unpublish or delete any Offer whose title lacks the
marker. It must not assert the published Offer count back to 0. The
laboratory Offer is protected. Presence of that row is not a P10 failure.

This run measured: throwaway Auth rows this run created are absent
(`O13-subject`, `O13-operator`); the throwaway Offer this run created is
absent (`O13-offer-gone`); the laboratory Offer hashed `7cc7436e57b8`
remains `published` at H-start and H-end.

---

## STEP 0 — tree, guards, digests

Working tree clean at cut. Branch `p08-t29` from `origin/main` at
`bbb1312b213c5999333b3c9cb6c35ce951cded29` (merge of `p08-t28`, pull
request #151).

Quoted, all exit 0:

- `npm run guard:naming` — PASS (36 SQL files)
- `npm run guard:schema` — PASS (18 forwards; inventory 35)
- `npm run guard:design` — PASS (214 files under `src/`)
- `npm run guard:phases` — PASS (R5 report-only 17 CF-100 rows)
- `npm run lint` — PASS
- `npm run typecheck` — PASS
- `npm run build` — PASS (Next.js 16.3.3; middleware deprecation warning
  only)
- `npm run guard:boundary` — PASS, scanned 24 html under
  `.next/server/app/`
- `python -X utf8 data/seed/verify_seed.py` — `124 -> 71`, PASS, QA-flagged
  0

P08-T28 Verdict cell set to the mandated PASS text. `**P08-T28**` checked.
Unchecked `**P08-T29**` added. `**P06-T11**` and `**P06-T03**` stay
unchecked (PR-36). **G8** and **G8-R2** stay unchecked.

**Clinical digests by PR-37.**
`subprocess.run(["git","show",f"HEAD:{path}"], capture_output=True).stdout`
hashed with `hashlib.sha256` — no shell pipe.

| Artefact | Digest |
|---|---|
| `docs/research/clinical-worklist.md` | `22b2c73b697460b2def3a86e4b6489c987874a071c4d9c0f792a46612197569f` |
| `docs/research/clinical-signoff.md` | `aa0469eedad99a4f55acd469912689df511311343ec8f31bb75cabf8c577aef7` |
| `docs/research/clinical-signoff-addendum.md` | `2b63422efa63f256aef7fcac6f3a3ec3178148a60a3a85199810c75468b5340d` |

No LabTest content in this task's scope. Clinical: N/A, stated.

**html 24** (python `Path('.next/server/app').rglob('*.html')` after the
STEP 0 build). Prerendered routes:

```
/_global-error
/_not-found
/ar/about
/ar/announcements
/ar/contact
/ar/departments
/ar/equipment
/ar/lab-to-lab
/ar/locations
/ar/online-results
/ar/privacy-policy
/ar/programmes
/ar/videos
/en/about
/en/announcements
/en/contact
/en/departments
/en/equipment
/en/lab-to-lab
/en/locations
/en/online-results
/en/privacy-policy
/en/programmes
/en/videos
```

Identical to the T28 set. Home, Offers, Programme detail, partner-lab and
dashboard remain `ƒ`. No `src/` change, so the route table cannot have
moved.

Existing specs: 38 pass
(`src/lib/supabaseRest.spec.ts`, `src/lib/dashboard/fieldRules.spec.ts`,
`src/lib/dashboard/completeness.spec.ts`,
`src/lib/dashboard/catalogEntities.spec.ts`,
`src/components/site/CopyCard.escape.spec.ts`). `brandHead.spec.ts` is
CF-184 (`next/headers`) and is not in that 38.

---

## STEP 1 — production identity

**Command.** `npx vercel api /v13/deployments/nel-nile-egypt-labs.vercel.app`

| Field | Value |
|---|---|
| `gitSource.sha` | `bbb1312b213c5999333b3c9cb6c35ce951cded29` |
| `readyState` | `READY` |
| `readySubstate` | `PROMOTED` |
| `target` | `production` |
| `githubCommitMessage` | `Merge pull request #151 from Jovo-Jovi/p08-t28` |

SHA equals `origin/main`. This is the failure that sank P08-T21; it did
not sink this gate.

**`invalidateSessions` at that SHA, not merely the working tree.**

- `git grep invalidateSessions bbb1312 -- src scripts` → two comments
  only, `src/lib/dashboard/partnerAccountAdmin.ts` lines 114 and 138
- `git grep "function invalidateSessions" bbb1312` → empty
- `git grep "await invalidateSessions" bbb1312` → empty

`"write"` remains for a real metadata failure
(`createSupabaseServiceRoleClient() === null` or `updateUserById` error).

---

## STEP 2 — the gate run

**Command (once).**
`npm run smoke:operator -- https://nel-nile-egypt-labs.vercel.app`

Runner exit 1, `RESULT FAIL`. Expected: the four session legs call
`fail()` when counts stay nonzero. That is OD-28's accepted residual, not
a gate failure. The fence required those legs reported and labelled as
such.

Verbatim (already redacted by the runner):

```
NEL PartnerLab smoke MODE operator against https://nel-nile-egypt-labs.vercel.app
PASS extractor-self-check — synthetic base64- session cookie yielded the access token
PASS H-start — row count 1; publication_state published
PASS O0 — credentials generated at runtime, never written
PASS O1 — HTTP 303 created=1
PASS O2 — one row updated; provider and providers survived
PASS O3 — HTTP 303 through the dashboard sign-in
PASS O4 — AAL2 on a refreshed token
PASS O5 — HTTP 303 created=1
FAIL O5-reject-sessions — sessions 1 → 1; live_refresh_tokens 1 → 1
PASS O5-reject — HTTP 303 saved=1
PASS O5-reject-claim — nel_principal absent; nel_partner_state rejected; keys provider,providers,nel_partner_state
PASS O6 — HTTP 303 saved=1
PASS O7 — throwaway Offer created and published
PASS O8 — throwaway title present on /ar/offers and /en/offers
PASS O9 — anon PostgREST still [] with a published Offer (O7+O9)
FAIL O10-reject-sessions — sessions 2 → 2; live_refresh_tokens 2 → 2
PASS O10-reject — HTTP 303 saved=1
PASS O10-reject-claim — nel_principal key absent; keys provider,providers,nel_partner_state
PASS O10-token — previously valid token no longer reads Offers
PASS O10-reinstate — HTTP 303 saved=1
PASS O10-reinstate-claim — pending; nel_principal absent; nel_partner_state absent
O11-rest-ttl access-token TTL 3600 seconds
PASS O11-rest-before — HTTP 200; body [{"id":"04d32784-4599-496b-a365-795e9ab1e454"},{"id":"decd19c3-785b-4c09-908e-ac9fb87f318d"}]; throwaway id present
FAIL O11-sessions — sessions 3 → 3; live_refresh_tokens 3 → 3
PASS O11-rest-after — HTTP 200; body []; throwaway id absent
PASS O11 — HTTP 303 saved=1
PASS O11-token — previously valid token no longer reads Offers
FAIL O12-sessions — sessions 3 → 3; live_refresh_tokens 3 → 3
PASS O12 — HTTP 303 saved=1
PASS O12-claim — principal cleared; nel_partner_state rejected
AUDIT M-i-admin-logout-by-id — sessions 3 → 3; live_refresh_tokens 3 → 3; current call: dashboard revoke-to-pending → POST /auth/v1/admin/users/{id}/logout (Auth log status named at STEP 1 Route B)
AUDIT M-ii-admin-signOut-jwt-global — sessions 4 → 0; live_refresh_tokens 4 → 0; POST /auth/v1/logout?scope=global with subject JWT; HTTP 204 No Content; content-type (none); body (empty)
AUDIT M-v-partner-sign-out-route — sessions 1 → 0; live_refresh_tokens 1 → 0; POST /ar/partner-lab/sign-out (supabase.auth.signOut scope=global on the subject's cookies); HTTP 303 location /ar/offers
AUDIT M-iv-sql-sessions — sessions 1 → 0; live_refresh_tokens 1 → 0; npx supabase db query --linked delete auth.sessions (1 rows) and auth.refresh_tokens (0 rows); refresh delete ok
AUDIT M-iii-admin-delete-user — sessions 0 → 0; live_refresh_tokens 0 → 0; DELETE /auth/v1/admin/users/{id} with publishable apikey (service-role key absent from the shell); HTTP 401 Unauthorized; content-type application/json; body {"code":401,"error_code":"no_authorization","msg":"This endpoint requires a valid Bearer token"}; auth.users remaining 1
PASS O13-unpublish — HTTP 303 saved=1
PASS O13-delete-offer — HTTP 303 saved=1
PASS O13-offer-gone — throwaway Offer absent
PASS O13-subject — subject account absent
PASS O13-operator — temporary Operator absent
PASS H-end — row count 1; publication_state unchanged (published)
RESULT FAIL
```

### Gate-deciding legs against prior values

**O8 — positive control.** PASS. Throwaway title present on `/ar/offers`
and `/en/offers`. Without this, nothing below discriminates. T28 also
PASS O8.

**O9.** PASS. Anonymous PostgREST returns `[]` while that Offer is
published.

**O11-rest-before / O11-rest-after.** Identical bearer, no refresh. TTL
3600 seconds (human has not reduced Auth TTL).

- Before: HTTP 200, body
  `[{"id":"04d32784-4599-496b-a365-795e9ab1e454"},{"id":"decd19c3-785b-4c09-908e-ac9fb87f318d"}]`,
  throwaway id present.
- After: HTTP 200, body `[]`, throwaway id absent.

P08-T24 measured 200/200 with the same id both times. P08-T28 after the
live swap: 200 then `[]`. `04d32784-…` is the laboratory Offer (still
published at H-end); `[]` after revoke is RLS denial, not unpublish.

**Four privilege-removing Locations.** The PASS path of
`savedWithoutWrite` prints `HTTP 303 saved=1` and does not emit the raw
Location header. That helper requires status 303,
`location.includes("saved=1")` and `!location.includes("error=")`. The
runner POSTs to `/ar/dashboard/partner-lab/submit/…`. Deployed `back()`
at SHA `bbb1312` (`src/app/[locale]/dashboard/(session)/(modules)/partner-lab/submit/[action]/route.ts`):

| Leg | T28 | T29 smoke line | Reconstructed Location |
|---|---|---|---|
| O5-reject | `error=write` | `PASS O5-reject — HTTP 303 saved=1` | `/ar/dashboard/partner-lab?view=rejected&saved=1` |
| O10-reject | `error=write` | `PASS O10-reject — HTTP 303 saved=1` | `/ar/dashboard/partner-lab?view=rejected&saved=1` |
| O11 | `error=write` | `PASS O11 — HTTP 303 saved=1` | `/ar/dashboard/partner-lab?view=pending&saved=1&ended=1` |
| O12 | `error=write` | `PASS O12 — HTTP 303 saved=1` | `/ar/dashboard/partner-lab?view=rejected&saved=1&ended=1` |

None of the four carries `error=`. The gate does not pass on three of
four; it has all four.

**Claims.**

- `PASS O5-reject-claim — nel_principal absent; nel_partner_state rejected; keys provider,providers,nel_partner_state`
- `PASS O10-reject-claim — nel_principal key absent; keys provider,providers,nel_partner_state`
- `PASS O10-reinstate-claim — pending; nel_principal absent; nel_partner_state absent`
- `PASS O12-claim — principal cleared; nel_partner_state rejected`

**O10-token and O11-token.** PASS. They measure that the page refuses
after `loadPartnerFacingSession` refreshes. They are not evidence of
session death. CF-170 recorded why; the database-layer pair above is.

**Session legs — OD-28 residual, not a gate fail.**

- FAIL O5-reject-sessions — sessions 1 → 1; live_refresh_tokens 1 → 1
- FAIL O10-reject-sessions — sessions 2 → 2; live_refresh_tokens 2 → 2
- FAIL O11-sessions — sessions 3 → 3; live_refresh_tokens 3 → 3
- FAIL O12-sessions — sessions 3 → 3; live_refresh_tokens 3 → 3

**O13-\* and H-start / H-end.** Cleanup PASS. Laboratory Offer hashed
`7cc7436e57b8` published at start, unchanged published at end. Linked
re-read after the run: one `"Offer"` row, `publication_state` published,
hashed id `7cc7436e57b8`. Published Offer count 1. This window did not
publish, unpublish or delete that row.

---

## STEP 3 — four acceptance standards, measured

### Boundary — access control and no-PHI

`BOUNDARY_MODEL.md` §4 walked item by item.

**Item 1.** `git diff` empty under `supabase/`. Linked
`information_schema`: public tables 13, public columns 182, `created_by`
0. Name scan for `patient`, `email`, `password`, `created_by`, `owner`,
`birth`, `result` on `public` columns: 0.

**Item 2.** Signup handler
(`src/app/[locale]/partner-lab/sign-up/submit/route.ts`) accepts only
`email`, `password`, `confirm_password`; any other key redirects
`?error=1`. Live POST with a fourth key `lab_name`: HTTP 303, Location
`/ar/partner-lab/sign-up?error=1`, Set-Cookie 0. Extra-field local part
created 0 Auth rows.

**Item 3.** Bucket `media-asset`, `public` false, `file_size_limit`
5242880. Policies: Operator-write ALL to `{authenticated}`; published
SELECT to `{anon}` only. No anon write.

**Item 4.** `console.` under `src/` → 0.

**Item 5.** `patient` only in comments that forbid Visitor or patient
fields. `result` is not a domain identifier. `ResultsPortalLink*` is the
permitted compound.

**Item 6.** Live portal href
`https://www.nileegyptlabresults.com/Login/` (no query, no hash) present
on `/ar`. `ResultsPortalLinkAction`: `target="_blank"`
`rel="noopener noreferrer"`.

**Item 7.** Unauthenticated GET `/ar`: no `fonts.googleapis`, no `gtag(`,
no `googletagmanager`. Framing tags 0 (item 8 half). YouTube strings on
contact/footer are outbound hrefs / catalogue copy, not
`<iframe>`/`src=` embeds.

**Item 8.** Framing half PASS: `iframe` / `embed` / `object` / `frame` =
0 on `/ar`, `/ar/privacy-policy` and `/en/privacy-policy`. CSP half FAIL:
unauthenticated GET `/ar` (`curl.exe -sI`) has
`Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
and no `Content-Security-Policy` header, so there is no `frame-src`
directive that excludes the results-portal host. This is CF-177, owner
reviewer, phase P07, recorded at P06-T02. P07 lists security headers.
G6 PASSED with this OPEN. This task does not add a CSP header (Do-NOT).
This file does not record G8 as PASSED.

**§2 item 9.** Proved by reading the signup route handler (loop at
lines 94–98), not the form, plus the extra-field POST above.

**§2 item 10.** No public column identifying an account holder (schema
scan). `createSupabaseServiceRoleClient` lives only in
`partnerAccountAdmin.ts` (dashboard, behind `gateModuleRoute`). Zero
hits under `src/app/[locale]/partner-lab/`.

**§2 item 11.** Live GET `/ar/privacy-policy` and `/en/privacy-policy`
HTTP 200. English contains “When a PartnerLab account is created, the
website stores the email address and password required for that
account.” Arabic contains “يحتفظ الموقع بعنوان البريد الإلكتروني وكلمة
المرور اللازمة للحساب” with `PartnerLab` present. Matches CF-149 close.

### Clinical

Three digests by PR-37 match the known values. No LabTest content in
scope. N/A, stated.

### Data integrity

- `verify_seed` `124 -> 71`
- Published Offer count after the smoke: 1
- Laboratory Offer hashed `7cc7436e57b8` published at H-start and H-end;
  linked re-read after the run: `publication_state` published

### Bilingual

- O8 both locales
- O10-token and O11-token both locales (page refusal)
- Sign-up and sign-in GET both locales HTTP 200; `lang`/`dir` ar/rtl and
  en/ltr
- Status chrome keys exist in both catalogues:
  `partnerLab.status.pendingTitle` / `pendingBody` / `declinedTitle` /
  `declinedBody`
- The four Locations were measured on `/ar/dashboard/…` because the
  runner hardcodes `/ar/`. The helper is locale-parameterised. A flow
  that works in one locale only would be a FAIL; the partner-facing
  Offers path was measured in both.

### OD-18 §6 neutrality — measured, not inherited from P08-T03

Two POSTs to `/ar/partner-lab/sign-up/submit` with the same generated
`@example.invalid` address (address not printed):

| | unknown (first) | known (second) |
|---|---|---|
| status | 303 | 303 |
| Location | `/ar/partner-lab/sign-up?created=1` | `/ar/partner-lab/sign-up?created=1` |
| body length | 0 | 0 |
| body sha256 | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` | same |
| Set-Cookie count | 3 | 3 |

All equal. Throwaway deleted; remaining 0 for that local part.

---

## STEP 4 — P08 carry-forward sweep

Every CF whose phase is P08:

| Id | Status | Blocks G8? |
|---|---|---|
| CF-148 | CLOSED at P08-T01 | no |
| CF-149 | CLOSED at P08-T12 | no |
| CF-150 | OPEN (unpriced) | no — commercial, not boundary |
| CF-151 | OPEN (R3 allowlist) | no — signup already works |
| CF-152 | CLOSED at P08-T20-F | no |
| CF-153 | CLOSED at P08-T14 | no |
| CF-154 | CLOSED at P08-T14 | no |
| CF-155 | OPEN (Auth byte-identity) | no — §6 status/Location/body measured |
| CF-156 | OPEN (text still says OD-09 DRAFT) | no — OD-09 is SIGNED; not closed here |
| CF-157 | OPEN (timing oracle) | no — §6 excludes TIME |
| CF-158 | CLOSED at P08-T17 | no |
| CF-159 | CLOSED at P08-T10 | no |
| CF-167 | CLOSED at P08-T20 | no |
| CF-168 | CLOSED at P08-T21 | no |
| CF-169 | CLOSED at P08-T29 | Locations all `saved=1`, no `error=` |
| CF-170 | CLOSED at P08-T29 | `O11-rest-after` body `[]` |
| CF-171 | OPEN (hash method) | no — PR-37 matched |
| CF-172 | CLOSED at P08-T25 | no |
| CF-173 | OPEN (O13 enrol redirect at T24) | no — this run O13-unpublish `saved=1` |

G8-phase OPEN rows not closed here: CF-160, CF-164, CF-166. CF-164 was
ruled not a gate blocker at G8-R. CF-160 records remaining
`*_published_read` policies; Offer is not among them. CF-166 is hosted
password-policy drift; not this gate's close condition.

CF-177 (P07) is the CSP half of §4 item 8. Left OPEN. Not repaired.

**CF-169 close evidence.** All four privilege-removing Locations read
`saved=1` and none carried `error=`. Quoted: `PASS O5-reject — HTTP 303
saved=1`; `PASS O10-reject — HTTP 303 saved=1`; `PASS O11 — HTTP 303
saved=1`; `PASS O12 — HTTP 303 saved=1`. At P08-T28 those four read
`error=write`. Session counts remaining nonzero is OD-28's residual, not
this row's close condition.

**CF-170 close evidence.** `PASS O11-rest-after — HTTP 200; body [];
throwaway id absent` on the identical bearer, no refresh. Against T24's
200/200 with the same id both times.

Nothing else closed.

**Open CF arithmetic (PR-28).** Base 103
(`python` count of `^\| CF-[0-9]+ .*\| OPEN \|` before this task's
closes). + 0 − 2 = **101**. Next free id CF-195. No id allocated.

---

## What this file does not do

It does not declare G8 passed. It does not start P04 or P09. It does not
set `NEL_LABTEST_CONTENT`. It does not start the numeric-identifier
feature. It does not publish, unpublish or delete the Offer hashed
`7cc7436e57b8`.
