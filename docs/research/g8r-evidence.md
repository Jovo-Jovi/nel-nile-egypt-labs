# G8-R — Boundary gate re-run, 10 September 2026

**Result: FAIL.** Named: P4 not executed; P5 incomplete (reinstate and
claim read-back not measured); P10 cannot restore published `Offer` count
to 0 without disturbing a laboratory row. P8 is recorded, not gating.
**Precedence:** none — this is evidence. This file decides nothing and is
never a parity target (PR-09). It records what was measured on 10
September 2026 and the command that measured it.
`docs/research/g8-evidence.md` was never landed as a file; P08-T12's
failed-run record stays in that task's done-step and is not edited.

P1, P2, P6, P7, P9 and STEP 3 hold. P3 was not measured on this
deployment (no Operator session). CF-165 is closed from a human
attestation, which is not a P3 measurement.

**Deployment under test.** `https://nel-nile-egypt-labs.vercel.app`.
**Code identity.** `git diff --stat ef5671b origin/main -- src/ public/ package.json next.config.ts` is **not empty**. `ef5671b` is the production SHA G8 tested at P08-T12 (`P08-T12: approve the live mark, close CF-149, and land the G8 carry-forwards.`). `origin/main` is `6f511d2` (the P08-T19 merge, pull request #119). Source HAS changed since G8 — T15, T17, T18 and T19 all touched `src/` — so criteria are NOT discharged by reference. Every leg is measured fresh.

**Parent.** Cut from `origin/main` at `6f511d2`. Branch `g8-r`.

**Redaction.** Account identifiers, project refs, keys, JWTs, connection
strings, the hotline, WhatsApp numbers and branch addresses do not appear
here (PR-16, PR-21). The published `Offer` title is quoted because P7
must search the live body bytes for it.

**No source, migration, schema or SQL write of laboratory data.** The
public smoke runner deleted its own Auth throwaway (`auth.users`
remaining 0 for that id). The one published `Offer` row was not
unpublished, not deleted, and not edited.

**Operator session.** `NEL_OPERATOR_SESSION` unset. Sidecar
`nel-p08-t13-operator.env` absent. No `createUser`. No local Admin
client. No metadata fallback.

---

## STEP 0 — P08-T19 verdict and CF-165

P08-T19 Verdict cell set to `PASS at reviewer verdict — 9 September 2026`.
PHASES.md P08-T19 box checked. Unchecked **G8-R** box added immediately
before **G8**. `npm run guard:phases` → exit 0. R5 still the seventeen
CF-100 rows, report-only.

CF-165 CLOSED at G8-R. Mandated close text:

> Closed at G8-R. A real dashboard reject returned `?view=rejected&saved=1`
> on 9 September 2026, confirmed by the human.
> `applyPartnerLabReviewAction` returns "write" only when the service-role
> client is null; one `saved=1` from any of the three actions proves it is
> non-null. The cause was a missing `SUPABASE_SERVICE_ROLE_KEY` in the
> production runtime, added at P08-T13 STEP 5.

That close is an attestation with its date, not a measurement on this run.
`src/lib/dashboard/partnerAccountAdmin.ts:82-83` still returns `"write"`
when `createSupabaseServiceRoleClient()` is null, and `:90` also returns
`"write"` when `updateUserById` errors.

---

## STEP 1 — code identity

**Command.** `git diff --stat ef5671b origin/main -- src/ public/ package.json next.config.ts`

**Result.** Not empty. Quoted in full:

```
 package.json                                       |  2 +
 src/app/[locale]/(public)/offers/page.tsx          | 17 ++--
 src/app/[locale]/(public)/page.tsx                 |  8 +-
 .../media-assets/submit/[action]/route.ts          | 29 ++++++-
 .../(session)/(modules)/site-settings/page.tsx     |  1 +
 .../site-settings/submit/[action]/route.ts         | 5 +-
 src/app/[locale]/dashboard/sign-in/page.tsx        |  6 +-
 src/app/[locale]/dashboard/sign-out/route.ts       | 11 ++-
 src/app/[locale]/partner-lab/sign-in/page.tsx      | 99 ++++++++++++++++++++++
 .../[locale]/partner-lab/sign-in/submit/route.ts   | 41 +++++++++
 src/app/[locale]/partner-lab/sign-out/route.ts     | 22 +++++
 .../[locale]/partner-lab/sign-up/submit/route.ts   | 41 ++++++---
 .../dashboard/CompletenessHeader.module.css        | 21 +++++
 src/components/dashboard/CompletenessHeader.tsx    | 54 ++++++++++++
 src/components/dashboard/DashboardChrome.tsx       |  6 +-
 src/components/dashboard/MediaAssetForm.tsx        | 55 ++++++++++--
 src/components/dashboard/OfferForm.tsx             |  5 ++
 src/components/dashboard/PartnerLabReviewForm.tsx  | 35 ++++++--
 src/components/dashboard/SiteSettingsForm.tsx      |  7 ++
 src/components/dashboard/catalogFormChrome.tsx     | 24 +++---
 src/components/partner-lab/PartnerLabStatus.tsx    | 20 +++--
 src/components/site/HeroPhoto.tsx                  | 13 ++-
 src/components/site/SiteFooter.tsx                 |  6 ++
 src/components/ui/Button.tsx                       |  3 +
 src/components/ui/MarkSlot.tsx                     | 13 ++-
 src/components/ui/useClientReady.ts                | 22 +++++
 src/lib/catalog.ts                                 | 53 +++++++++---
 src/lib/dashboard/gates.ts                         |  4 +-
 src/lib/dashboard/mediaAsset.ts                    |  2 +
 src/lib/nelSession.ts                              | 23 +++++
 src/lib/publishedListings.ts                       | 11 ++-
 31 files changed, 572 insertions(+), 87 deletions(-)
```

`public/` is absent from the stat, so it is unchanged against `ef5671b`.
Criteria are measured fresh. Nothing is discharged by reference to
P08-T12.

`git diff --stat origin/main -- supabase data/seed docs/adr` → empty.

---

## STEP 2 — the ten proofs

Live alias `https://nel-nile-egypt-labs.vercel.app`. Where a leg is an
attestation, it is labelled **ATTESTATION** with its date. Measurements
are dated 10 September 2026.

### P1 — public signup, live — PASS (measured)

**Command.** `npm run smoke:public` (MODE public against the live alias).
The runner POSTs the public signup form. No `createUser`.

**Quoted.** `PASS S3 — HTTP 303 created=1`

Signup pages: `GET /ar/partner-lab/sign-up` 200 `lang=ar` `dir=rtl`;
`GET /en/partner-lab/sign-up` 200 `lang=en` `dir=ltr`.

### P2 — that row read back — PASS (measured)

**Command.** same smoke run; `npx supabase db query --linked` inside the
runner.

**Quoted.**

```
PASS S4-exists — row exists
PASS S4-principal — nel_principal absent
PASS S4-state — nel_partner_state absent
PASS S4-keys — claim keys provider,providers
```

Hashed id only. Neither `nel_principal` nor `nel_partner_state`. That is
the ADR-001 store at signup.

### P3 — approve through the dashboard → saved=1 — FAIL (not measured)

No Operator session on this run. Review POSTs were not sent.

**ATTESTATION, 9 September 2026, the human (quoted in the P08-T19
reviewer verdict, not a Location):** the approve worked. The Location was
never quoted. That is not `saved=1` and is not a measurement.

CF-165's close uses a **different** action (reject). One `saved=1` from
reject proves the service-role client is non-null; it does not quote an
approve Location. P3 remains unmeasured.

### P4 — approved session sees a published Offer title — FAIL (not measured)

**POSITIVE CONTROL required.** An empty listing proves nothing.

Live `"Offer"` at this run (`npx supabase db query --linked` on
`public."Offer"`):

```
offer_total      1
offer_published  1
offer_draft      0
id_hash          7cc7436e57b8
created          2026-09-09
title_en         Complete Blood Count (CBC) Test Offer
title_ar         عرض تحليل صورة الدم الكاملة
```

That row is a laboratory Offer, not a named throwaway. HALT forbids
disturbing it. It was not unpublished.

This run had no approved `PartnerLab` session, so the title was not read
from `/ar/offers` or `/en/offers` behind a refreshed token.

**ATTESTATION, 9 September 2026, the human (P08-T18 FAIL verdict):**
sign-out present on the partner Offers page, and an approved PartnerLab
at `/ar/dashboard` lands on `/offers`. No title was quoted. An Offers
page with sign-out is not a positive-control title.

### P5 — reject then reinstate, claims read back — FAIL (incomplete)

**ATTESTATION, 9 September 2026, the human (this fence's STEP 0 close):**
a real dashboard reject returned `?view=rejected&saved=1`.

Reinstate `saved=1` was not quoted. Claim read-back after reject and
after reinstate was not run. `nel_principal never set by reject` was not
re-read. No Admin fallback.

### P6 — anon PostgREST on Offer, that Offer published → [] — PASS (measured)

**REGRESSION for M10.** The published row in P4's table is the same row:
total 1, published 1, hashed id `7cc7436e57b8`.

**Command.** `npm run smoke:public` S8, which GETs PostgREST as anon
using the publishable/web key from the linked CLI listing **without**
`--reveal`. `Offer_published_read` is absent (`pg_policies` count 0);
`Offer_partner_read` is present (count 1).

**Quoted.** `PASS S8 — anon PostgREST body is []`

Array length 0 while that Offer is published. P6 did not return a row.

Pending session (S7) also lacked the title in both locales, which is the
pending-reads-nothing half, not P4.

### P7 — unauthenticated /ar/offers and /en/offers — PASS (measured)

**Commands.** `curl.exe` of the four URLs into `%TEMP%`, then
`python -X utf8` membership of the published titles and the invite
copy. Confirmed again by smoke S9, which loaded the live published
titles from `"Offer"` and asserted they are absent.

Unauthenticated `/ar/offers` HTTP 200, `Cache-Control: private, no-store`:

- invite «العروض متاحة للمعامل الشريكة المعتمدة» present
- «إنشاء حساب» present
- published title_ar absent
- published title_en absent
- sign-out copy absent

Unauthenticated `/en/offers` HTTP 200:

- invite "Offers are available to approved partner laboratories" present
- "Create an account" present
- published titles absent
- sign-out copy absent

`/ar` and `/en` home: same title-absent and invite-present figures.
No `iframe`/`embed`/`object` on the 24 public URLs (live scan).

### P8 — React #418 — recorded, not gating

**Reviewer ruling, 9 September 2026 (this fence):** a symptom which has
not reproduced on `/ar`, `/en`, `/ar/offers`, `/en/offers`, two dashboard
views, in dev and in a production build, unauthenticated and with a
partner session, is a carry-forward with a named closing condition and
not a gate blocker.

**CF-164 closing condition:** if it recurs, capture the unminified
message and name the component before changing anything.

**Captures on the record.**

| When | Where | Result |
|---|---|---|
| P08-T12, 8 September 2026 | `next dev` unauthenticated `/ar`, `/en`, `/ar/offers`, `/en/offers` | no #418; component, server text and client text therefore not named |
| P08-T13, 9 September 2026 | Edge console, same four routes, local `next start` and the production alias | `hydration_hits=0`, React #418 not named. Absence is not proof of cause. No approved PartnerLab session in that capture |
| G8-R, 10 September 2026 | this run | no new browser console capture |

Suppressing the warning is not a fix. Status stays OPEN.

### P9 — four clinical tables 0 published — PASS (measured)

**Command.** `npx supabase db query --linked --output-format json` over
`public."LabTest"`, `"Programme"`, `"ProgrammeTier"`, `"ProgrammeLabTest"`.
Read, not assumed.

```
LabTest           published 0  total 71
Programme         published 0  total 9
ProgrammeTier     published 0  total 14
ProgrammeLabTest  published 0  total 124
```

Smoke S10: `PASS S10 — published counts 0/0/0/0`.

### P10 — 24 public URLs 200; throwaway gone; published Offer count — FAIL

**24/24 HTTP 200.** Live scan over the twelve static patterns × two
locales, and smoke S1: `PASS S1 — 24/24 HTTP 200`.

**Throwaway.** Smoke cleanup: `PASS cleanup — throwaway deleted`
(`auth.users` remaining 0 for that id). There is no public URL for an
Auth row, so the 404-read in the fence applies to a deleted Offer page;
no synthetic Offer was created on this run.

**Published Offer count.** Still 1. The laboratory CBC Offer (hashed id
`7cc7436e57b8`, created 9 September 2026) was not unpublished and not
deleted. HALT: a real Offer of the laboratory's is published; do not
disturb it. P10's "published count back to 0" therefore does not hold.

---

## STEP 3 — remaining BOUNDARY_MODEL §2 items, service-role, console

### Item 9 — signup handler accepts email, password, confirm_password only — PASS

**Read.** `src/app/[locale]/partner-lab/sign-up/submit/route.ts:94-98`:

```
for (const key of form.keys()) {
  if (key !== "email" && key !== "password" && key !== "confirm_password") {
    redirect(signUpHref(locale, "error"));
  }
}
```

**Live POST.** `POST /en/partner-lab/sign-up/submit` with
`email`, `password`, `confirm_password`, and a fourth key `lab_name`.

Quoted: HTTP 303, Location `/en/partner-lab/sign-up?error=1`, Set-Cookie
count 0.

Smoke S5 independently: `PASS S5 — HTTP 303 error=1` (fourth key
`lab_name`). S6 mismatch: `PASS S6 — HTTP 303 error=confirm`.

### Item 10 — no public table holds an account-identifying column — PASS

**Command.** `npx supabase db query --linked` on
`information_schema.columns` where `table_schema = 'public'` and
`column_name` matches email, password, owner, account, user_id, auth_id,
full_name, date_of_birth, dob, or patient.

**Result.** `matching_columns 0`.

Same information_schema, 163 columns: `created_by` 0, ownerish 0,
patient 0, result-like 0, birth 0, email 0, nameish 0.

### Item 11 — published privacy text, both locales — PASS

**Command.** live GET `/ar/privacy-policy` and `/en/privacy-policy`.
CF-149 closed at P08-T12; this re-confirms it.

Quoted from the live pages, 10 September 2026:

- ar: «عند إنشاء حساب PartnerLab ، يحتفظ الموقع بعنوان البريد الإلكتروني وكلمة المرور اللازمة للحساب.»
- en: «When a PartnerLab account is created, the website stores the email address and password required for that account.»

Both sentences present in the body bytes.

### Service-role key not reachable from a public route — PASS

`createSupabaseServiceRoleClient` is defined in
`src/lib/supabase/serviceRole.ts` and imported only by
`src/lib/dashboard/partnerAccountAdmin.ts`. Callers of that module are
the dashboard PartnerLab review page and its submit route, both behind
`gateModuleRoute`. Zero hits under `src/app/[locale]/partner-lab/`.
Repository search for `NEXT_PUBLIC_` plus `SERVICE` → 0.

Live 24 public URLs: 0 `<form>`/`<input>`/`<textarea>`/`<select>`, 0
`<iframe>`/`<embed>`/`<object>`, every results-portal href
`https://www.nileegyptlabresults.com/Login/` (no query, no hash), 0
portal frame sources, 0 analytics-script hosts.

`ResultsPortalLinkAction` is an outbound `https://` control with
`target="_blank"` `rel="noopener noreferrer"`. `resolveResultsPortalHref`
rejects non-https, userinfo, search, and hash.

### `git grep "console\." -- src/` — PASS

Exit 1. No matches.

---

## STEP 4 — verdict

**FAIL.** P8 is recorded, not gating. P1, P2, P6, P7, P9 and STEP 3 hold.
Named failures:

1. **P4** — approved session did not read a published Offer title on this
   run. Operator session unset. The laboratory Offer that would have been
   the positive control was left untouched.
2. **P5** — reject `saved=1` is an attestation dated 9 September 2026;
   reinstate and claim read-back were not measured.
3. **P10** — published `Offer` count remains 1 because unpublishing the
   laboratory row is a HALT.

P3 is also unmeasured (approve Location never quoted). CF-165 is closed
from the reject attestation and is not a substitute for P3.

G8's Verdict cell (P08-T12) keeps its FAIL. The **G8-R** box stays
unchecked. The **G8** box stays unchecked. The P08 Gate cell is not set
to PASSED.

---

## Floor (computed)

| Floor | Command | Result |
|---|---|---|
| Catalogue | python parse of quoted keys in `const ar` / `const en` in `src/lib/catalog.ts` | ar 586 · en 586 · identical · 0 duplicates |
| Migrations | `git ls-files supabase/migrations/` | 28 |
| Open CF | `python -X utf8` count of `^\| CF-[0-9]+ .*\| OPEN \|` over `docs/method/CARRY_FORWARDS.md` | 95 after CF-165 closed (96 − 1) |
| Next free CF | — | CF-168 |
| R3 allowlist | quoted paths in `R3_EXEMPT_PATHS` | 19 |
| `pg_policies` | `npx supabase db query --linked` | total 24 · public 22 · storage 2 · SELECT 12 · ALL 12 · anon_write 0 · `Offer_published_read` 0 · `Offer_partner_read` 1 |
| Signed artefacts | `git show HEAD:<path>` sha256; `git status --porcelain` empty; blob equals `33e5a2d:<path>` | worklist `22b2c73b…7569f` · sign-off `aa0469ee…aef7` · addendum `2b63422e…340d` |

Five guards exit 0 (`naming`, `schema`, `design`, `phases`, `boundary`).
Boundary scanned 22 `.html` files under `.next/server/app/`.
`git grep "console\." -- src/` exit 1.

No migration. No source change. Do not merge before the verdict. Do not
start P06 or P09. Do not build a revoke control (OD-20 is DRAFT;
P08-T20 follows a passing G8).
