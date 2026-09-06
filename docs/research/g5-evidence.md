# G5 — gate run, 6 September 2026

**Result: FAIL.** Halted at criterion 7.
**Precedence:** none — this is evidence. This file decides nothing and is never a
parity target (PR-09). It records what was measured on 6 September 2026 and the
command that measured it.

Every criterion below is marked one of three ways:

- **PASS** — evidence gathered and it holds.
- **FAIL** — evidence gathered and it does not.
- **NOT REACHED** — the run halted before this criterion was tested.

No section is marked NOT REACHED. The halt fired inside criterion 7, the last
criterion in §9 order, after its own legs had been read; criteria 1 to 6 were
each tested before it.

**Deployment under test.** `https://nel-nile-egypt-labs.vercel.app`, serving
`main` at `1e0ef6d` (the P05-T26B merge, pull request #90). The tree of that
commit is byte-identical to `9b344ba` (`git diff HEAD origin/main --stat` →
empty).

**Redaction.** Account identifiers, project refs, keys, JWTs, connection
strings, the hotline, WhatsApp numbers, branch addresses and Arabic clinical
names do not appear here. Counts, hashes, structural markers and per-account
hashes only (PR-16, PR-21). Region evidence quotes the tag skeleton with each
text node replaced by its byte length, so no laboratory copy is reproduced.

---

## Criterion 1 — an Operator publishes a change and a Visitor sees it — PASS

**Route taken: (a), the evidence of what already cleared.** Androw published the
`"SiteSettings"` singleton at P05-T21; this run reads the two regions that
publish cleared, off the deployment, in both locales.

**Route (b) was not available and was not manufactured.** `"Branch"`,
`"LabUnit"`, `"Offer"`, `"Video"` and `"Equipment"` each hold **0 rows**
(`select count(*)` per table via `supabase db query --linked`). A fresh
non-clinical publish would have required entering content first, which this
fence forbids.

**Command.** `GET https://nel-nile-egypt-labs.vercel.app/ar` and `/en`.

**Result.**

```
/ar  200  x-nextjs-prerender 1  x-vercel-cache PRERENDER  <html lang="ar" dir="rtl">
/en  200  x-nextjs-prerender 1  x-vercel-cache PRERENDER  <html lang="en" dir="ltr">
```

**`home.hero`.** Tag skeleton of the hero copy block, `/ar` then `/en`, text
nodes shown as `#text(<bytes>)`:

```
/ar  <div class=".copy"> <p class=".eyebrow"> #text(18) </p>
     <h1 class=".headline"> #text(35) </h1>
     <p class=".standfirst"> #text(157) </p> …
/en  <div class=".copy"> <p class=".eyebrow"> #text(15) </p>
     <h1 class=".headline"> #text(33) </h1>
     <p class=".standfirst"> #text(208) </p> …
```

`data-approval-state` occurrences inside that block: **0** in both locales. The
region is rendering content, not the §12 pending state.

**`home.reasons`.**

```
/ar  <ol class=".reasons"> <li> <div> <h3> #text(27) </h3> <p> #text(93) </p> </div> </li>
                           <li> <div> <h3> #text(18) </h3> <p> #text(70) </p> </div> </li>
                           <li> <div> <h3> #text(13) </h3> <p> #text(46) </p> </div> </li> </ol>
/en  <ol class=".reasons"> <li> <div> <h3> #text(37) </h3> <p> #text(115) </p> </div> </li>
                           <li> <div> <h3> #text(27) </h3> <p> #text(84) </p> </div> </li>
                           <li> <div> <h3> #text(18) </h3> <p> #text(66) </p> </div> </li> </ol>
```

`data-approval-state` inside the `<ol>`: **0**. No pending wrapper precedes it.

**The decisive marker.** `home.hero` and `home.reasons` both render
`approval.pending.signedCopy` when they are in their §12 pending state
(`SiteHome.tsx:201` and `:336`). That label's rendered string occurs **0 times
page-wide** on `/ar` and **0 times page-wide** on `/en`. For contrast,
`approval.pending.photography` occurs 10 times on each page and the page carries
21 pending gates in total — the two regions under test are not among them.

Per-locale text lengths differ on every node, so neither locale is falling back
to the other's copy.

**Region count — both figures, neither reconciled (CF-121).**

| Source | Figure |
|---|---|
| `docs/ADMIN_SPEC.md:562` and `:642` | twenty-one |
| `docs/research/region-map.md`, data rows | 27 |
| `src/lib/regions.ts`, region entries | 27 |

`src/lib/regions.ts` is the authority under CF-121. Neither the specification nor
the region map was edited by this run.

---

## Criterion 2 — two Operator accounts, both with a verified TOTP factor — PASS

**Command.** `supabase db query --linked` over `auth.users` left-joined to
`auth.mfa_factors`. Identifiers are redacted at the query: the only per-account
value returned is `left(md5(id::text), 12)`. No address left the database.

**Result, totals.**

```
accounts                        2
totp_factors                    2
totp_verified                   2
totp_unverified                 0
accounts_without_verified_totp  0
```

**Result, per account.**

| Account hash | TOTP factors | Verified | Unverified | Email confirmed | Not banned | Created |
|---|---|---|---|---|---|---|
| `0f0f3f538685` | 1 | 1 | 0 | true | true | 2026-09-03 |
| `2f4da8bd2950` | 1 | 1 | 0 | true | true | 2026-09-05 |

No account lacks a verified factor. `raw_app_meta_data ->> 'nel_principal'` is
`null` on both, which is M7A's finding and M7B's work, after G5.

---

## Criterion 3 — an unenrolled session reaches only the enrolment screen — PASS

A throwaway account was created with no MFA factor, signed in through the
application's own `POST /ar/dashboard/sign-in/submit` — a real session, not a
fabricated cookie — and every dashboard route was requested with redirects not
followed.

```
POST /ar/dashboard/sign-in/submit   -> 303  Location: /ar/dashboard/enrol
session cookie set: nel-operator-session
```

| Route | Status | `Location` |
|---|---|---|
| `/ar/dashboard` | 307 | `/ar/dashboard/enrol` |
| `/ar/dashboard/offers` | 307 | `/ar/dashboard/enrol` |
| `/ar/dashboard/videos` | 307 | `/ar/dashboard/enrol` |
| `/ar/dashboard/equipment` | 307 | `/ar/dashboard/enrol` |
| `/ar/dashboard/branches` | 307 | `/ar/dashboard/enrol` |
| `/ar/dashboard/programmes` | 307 | `/ar/dashboard/enrol` |
| `/ar/dashboard/lab-tests` | 307 | `/ar/dashboard/enrol` |
| `/ar/dashboard/lab-units` | 307 | `/ar/dashboard/enrol` |
| `/ar/dashboard/site-settings` | 307 | `/ar/dashboard/enrol` |
| `/ar/dashboard/media-assets` | 307 | `/ar/dashboard/enrol` |

Ten routes: the dashboard home plus nine module route trees. Nine, not eight —
`lab-tests` is a route tree of its own alongside the eight D-16 modules.

The enrolment screen is the one reachable screen, and the challenge cannot be
reached ahead of it:

```
GET /ar/dashboard/enrol      -> 200   carries id="dashboard-enrol-secret" and name="factorId"
GET /ar/dashboard/challenge  -> 307   Location: /ar/dashboard/enrol
```

**Then the account was deleted and its absence read, not asserted.**

```
DELETE /auth/v1/admin/users/{id}  -> 200
GET    /auth/v1/admin/users/{id}  -> 404
       {"code":404,"error_code":"user_not_found","msg":"User not found"}
```

---

## Criterion 4 — zero anonymous INSERT, UPDATE or DELETE policies — PASS

**Source query.** `pg_policies`, filtered to `schemaname in ('public',
'storage')`. An anonymous write policy is one whose `cmd` admits a write and
whose `roles` array reaches anon — `anon` named directly, or the catch-all
`public`, which every role inherits:

```sql
count(*) filter (
  where cmd in ('ALL', 'INSERT', 'UPDATE', 'DELETE')
    and roles::text[] && array['anon', 'public']
)
```

**Result.**

```
policies_total          24
policies_public_schema  22
policies_storage_schema  2
cmd_select              12
cmd_all                 12
cmd_insert / update / delete   0 / 0 / 0
anon_write_policies      0
```

**Per relation.** Twelve relations, two policies each, `anon_write` 0 on every
one: `public."Branch"`, `"Equipment"`, `"LabTest"`, `"LabUnit"`, `"MediaAsset"`,
`"Offer"`, `"Programme"`, `"ProgrammeLabTest"`, `"ProgrammeTier"`,
`"SiteSettings"`, `"Video"`, and `storage.objects`.

**The cmd/role pairing, so a distinct-aggregate cannot hide an ALL-to-anon
policy.** Exactly two shapes exist across all 24:

| `cmd` | `roles` | Policies | Relations |
|---|---|---|---|
| `ALL` | `authenticated` | 12 | 12 |
| `SELECT` | `anon` | 12 | 12 |

The `public` role appears in no policy. Row-level security is enabled on all
eleven `public` tables (`pg_class.relrowsecurity` true on each), so the policy
count is not defeated by an unprotected table.

---

## Criterion 5 — no personal or medical data, and the Media Library refuses at the policy — PASS

**The refusal, with the form bypassed.** A direct `POST` to Storage carrying an
authenticated Operator JWT. No dashboard form, no client check anywhere in the
path:

```
POST /storage/v1/object/media-asset/<probe>.pdf
     content-type: application/pdf
-> HTTP 400
{"statusCode":"415","error":"invalid_mime_type",
 "message":"mime type application/pdf is not supported","code":"InvalidMimeType"}
```

**The positive control, same endpoint, same session.** A refusal without one
proves nothing:

```
POST /storage/v1/object/media-asset/<control>.png
     content-type: image/png
-> HTTP 200
{"Key":"media-asset/<control>.png","Id":"…"}
```

The control object was deleted afterwards (`DELETE` → HTTP 200). It never had a
`"MediaAsset"` row, so the published-read policy could not have exposed it.

**Two further refusals on the same endpoint**, both excluded from the bucket
allowlist by `20260903150000_media_asset_bucket.sql`:

```
image/svg+xml -> HTTP 400  statusCode 415  invalid_mime_type
image/gif     -> HTTP 400  statusCode 415  invalid_mime_type
```

**And anon cannot write at all** — a different refusal, at row-level security
rather than at the MIME allowlist:

```
anon JWT, content-type: image/png
-> HTTP 400
{"statusCode":"403","error":"Unauthorized",
 "message":"new row violates row-level security policy","code":"AccessDenied"}
```

**Columns, read from `information_schema.columns` where `table_schema =
'public'`.** 163 columns across eleven tables:

| Pattern | Count |
|---|---|
| `created_by` | **0** |
| `updated_by`, `deleted_by`, `owner_id`, `user_id` | 0 |
| `patient` | 0 |
| result-like (`result`, `results`) | 0 |
| `date_of_birth`, `dob`, `birth` | 0 |
| `diagnos*`, `medical`, `clinical_note`, `specimen`, `sample_id`, `referral` | 0 |
| `national_id`, `passport`, `ssn`, `insurance` | 0 |
| `email` | 0 |
| `full_name`, `first_name`, `last_name`, `person` | 0 |

**On the `created_by` figure specifically (D-40).** A text grep over
`supabase/migrations/*.sql` returns three hits, and all three are inside SQL
comments asserting that no such column exists — M2 line 15, M3 line 19, M5
line 16. A grep therefore reports the opposite of what it appears to report,
which is why the figure above is read from the live schema instead.
`git grep -n -i created_by -- src/` exits 1, no matches.

**Dashboard form fields.** 46 distinct field-name literals across
`src/components/dashboard/**` and `src/app/[locale]/dashboard/**`, taken from
`name="…"` attributes, `formData.get("…")` reads and field descriptors. Matches
against the banned personal and medical vocabulary — patient, result, birth,
diagnosis, medical, specimen, referral, national id, passport, insurance,
full/first/last name, person, surname, mobile, personal: **0**.

Every field is one of: a bilingual content pair (`*_ar` / `*_en`), a business
fact belonging to the laboratory rather than to an individual (`hotline`,
`whatsapp_e164`, `maps_url`, `hours_*`), a catalogue identifier (`slug`,
`aliases`, `qa_flag`, `eligibility_audience`, `tier_axis`, `audience_axis`,
`source_name`), a media or commerce descriptor (`file`, `poster_file`,
`youtube_url`, `is_featured`, `price_amount`, `price_currency`, `valid_from`,
`valid_until`, `display_order`, `MediaAsset`, `Video`, `Programme`,
`ProgrammeTier`, `LabTest`, `LabUnit`), a delete-confirmation or row control
(`row_id`, `confirm_name`), or the Operator's own authentication input
(`email`, `password`, `code`, `factorId`). `Branch.address_*` is a branch
address; no column or field holds an individual's.

**Log surface.** `git grep -n "console\." -- src` exits 1, no matches.

---

## Criterion 6 — every dashboard screen in `ar` and `en`, and the Programmes refusal — PASS

Every screen was requested on the deployment in both locales. The
locale-distinguishing markers are the `<html>` tag and the translated
`<title>`; every screen returned **200**.

| Screen | `ar` | `en` |
|---|---|---|
| `/{locale}/dashboard/sign-in` | `<html lang="ar" dir="rtl">` | `<html lang="en" dir="ltr">` |
| `/{locale}/dashboard/enrol` | `lang="ar" dir="rtl"` | `lang="en" dir="ltr"` |
| `/{locale}/dashboard/challenge` | `lang="ar" dir="rtl"` | `lang="en" dir="ltr"` |
| `/{locale}/dashboard` | `lang="ar" dir="rtl"` | `lang="en" dir="ltr"` |
| nine module listings, each carrying its create form | `lang="ar" dir="rtl"` | `lang="en" dir="ltr"` |
| eight module edit forms — nine modules less `site-settings`, which has no `[id]` route | `lang="ar" dir="rtl"` | `lang="en" dir="ltr"` |
| `/{locale}/dashboard/programmes/<id>/tiers/<tierId>` | `lang="ar" dir="rtl"` | `lang="en" dir="ltr"` |
| `…/tiers/<tierId>/memberships/<id>` | `lang="ar" dir="rtl"` | `lang="en" dir="ltr"` |

`<title>` per module, `ar` then `en`: العروض / Offers · الفيديوهات / Videos ·
الأجهزة / Equipment · الفروع / Branches · البرامج / Programmes · التحاليل /
LabTests · الأقسام / LabUnits · إعدادات الموقع / Site Settings · مكتبة الوسائط /
Media Library. Auth screens: دخول لوحة التحكم / Dashboard sign-in · تفعيل عامل
التحقق / Enrol authenticator · التحقق بخطوتين / Two-step verification · لوحة
التحكم / Dashboard.

`site-settings` is a singleton module: its listing route *is* its form, and it
has no `[id]` route. Its form carries 22 `<input>` in both locales. Of the eight
edit forms, three rendered against rows that already existed — `programmes`,
`lab-tests`, `media-assets` — and five required a throwaway row, below.

**How the five empty modules were covered, and what it cost.** `"Branch"`,
`"LabUnit"`, `"Offer"`, `"Video"` and `"Equipment"` hold zero rows, so their
`[id]` edit screens had no row to render and no evidence. One throwaway **draft**
row per module was created through the dashboard's own create form, its edit
screen fetched in both locales, and the row deleted through the dashboard's own
delete action. Nothing was published. Each deleted row then returned 404, and
the row counts were re-read afterwards: `"Branch"` 0, `"LabUnit"` 0, `"Offer"`
0, `"Video"` 0, `"Equipment"` 0 — the counts before the exercise, exactly. No
residue.

**The Programmes refusal.** A throwaway `Programme` was created draft, then
published with `name_ar` empty:

```
POST /ar/dashboard/programmes/submit/publish
  slug=g5-proof-…  name_ar=(empty)  name_en=…  description_ar=…  description_en=…
-> 303
Location: /ar/dashboard/programmes/<row id>?error=bilingual&groups=name
```

The refusal names the failing pair group. The throwaway was deleted; the row
then returned 404. It was not published when it passed — see criterion 7, where
it did pass, and should not have.

---

## Criterion 7 — nothing clinical reached production — FAIL

Four of this criterion's five legs hold. The fifth is the reason this file
exists.

### 7a. Published count across the four clinical tables — 0

Read directly off the tables, not inferred from M8's assertion block:

| Relation | Rows | `published` | `draft` |
|---|---|---|---|
| `"Programme"` | 9 | **0** | 9 |
| `"ProgrammeTier"` | 14 | **0** | 14 |
| `"ProgrammeLabTest"` | 124 | **0** | 124 |
| `"LabTest"` | 71 | **0** | 71 |

### 7b. The recorded clinical review — intact

```
docs/research/clinical-worklist.md
  git ls-files --error-unmatch -> exit 0 (tracked)
  git status --porcelain       -> '' (unmodified)
  git hash-object              -> e79b5624cfc9a02d9f380a6287604e5b002fbb1c
  git rev-parse HEAD:<path>    -> e79b5624cfc9a02d9f380a6287604e5b002fbb1c   (equal)
  bytes 24896
  sha256 22b2c73b697460b2def3a86e4b6489c987874a071c4d9c0f792a46612197569f

docs/research/clinical-signoff.md
  git ls-files --error-unmatch -> exit 0 (tracked)
  git status --porcelain       -> '' (unmodified)
  git hash-object              -> 3e02117fccbd450ecb5fe885fdd90044d593145d
  git rev-parse HEAD:<path>    -> 3e02117fccbd450ecb5fe885fdd90044d593145d   (equal)
  bytes 6346
  sha256 aa0469eedad99a4f55acd469912689df511311343ec8f31bb75cabf8c577aef7
```

The status line and both hash lines are intact:

```
clinical-signoff.md:3   Status: SIGNED
clinical-signoff.md:8   Approved worklist SHA-256: `22b2c73b…7569f`
clinical-signoff.md:25  - SHA-256: `22b2c73b…7569f`
```

`sha256` recomputed over `clinical-worklist.md` equals the hash the sign-off
names. The sign-off binds this exact worklist.

`eligibility_audience` over the 124 membership rows: `all` 94, `female` 16,
`male` 14, **`unreviewed` 0**. `qa_flag` non-empty 0. Empty `name_ar` on
`"LabTest"` 0.

### 7c. Nothing clinical is on any public page

24 locale pages fetched on the deployment (12 static patterns × 2 locales; the
build's twenty-fifth static HTML file is `_not-found.html`, not a locale URL).

```
LabTest name occurrences, all 24 pages : 0     (71 distinct ar+en strings)
Programme slug occurrences, all 24 pages: 0     (9 slugs, read from the database)
18 Programme detail URLs (9 slugs × 2 locales): 404 × 18
/{locale}/programmes: still the §12 pending shell — 4 pending gates, 0 <article>
```

### 7d. `NEL_LABTEST_CONTENT` — NOT MEASURED, and inert in this deployment

The flag's value in the deployment environment could not be read, and no proxy
is computed for it.

- `src/lib/clinicalFlag.ts:9` is the only read of the variable in the
  repository. Its only caller is
  `src/app/[locale]/(public)/programmes/[slug]/page.tsx:37`, inside the
  Programme detail page.
- That page sets `export const dynamicParams = false` at line 14, and
  `generateStaticParams()` returns the published Programme slugs at build time,
  which was the empty list. So line 37 is **unreachable at runtime** in this
  deployment, whatever the flag holds. The flag cannot change what a Visitor
  sees today.
- Reading it authoritatively was attempted and failed: the local
  `VERCEL_OIDC_TOKEN` is rejected by the Vercel API
  (`HTTP 403 {"error":{"code":"forbidden","message":"Not authorized","invalidToken":true}}`),
  there is no Vercel CLI or `auth.json` on this machine, and
  `.env.production.local` omits the variable — but that file also omits the
  Supabase variables the deployment demonstrably has, so its silence is not
  evidence.
- The remaining route to a reading is to publish a clinical row and observe the
  detail page. That is forbidden this window and was not done.

### 7e. CF-128 tested on the deployment — the publish SUCCEEDED — FAIL

The request. A throwaway `Programme`, created draft in this window, carrying no
laboratory content — every text field holds a literal proof marker — with its
bilingual pairs complete so that the parse would pass and the request would
reach `hasClinicalCatalogueSignOff()`:

```
POST /ar/dashboard/programmes/submit/publish
  row_id=674be330-a2c7-4225-af80-c556aa3d582a
  slug=g5-proof-…
  name_ar=G5-PROOF-RESIDUE-AR
  name_en=G5-PROOF-RESIDUE-EN
  description_ar=G5-PROOF-RESIDUE-AR
  description_en=G5-PROOF-RESIDUE-EN
```

The response, verbatim:

```
-> 303
Location: /ar/dashboard/programmes/674be330-a2c7-4225-af80-c556aa3d582a?saved=1
error=signOff present: False
```

`?saved=1` and no `error=signOff`. `src/lib/dashboard/catalogSubmit.ts:382`
redirects to `error=signOff` when `params.action === "publish" &&
!hasClinicalCatalogueSignOff()`. The redirect carried `saved=1`, which is
reached only after `writeProgrammeRow(supabase, rowId, columns, "published")`
returns ok. The gate did not refuse. **A clinical row is publishable in
production today.**

**Published count before the unpublish — not read, and that is a gap in this
run's method.** No query was issued between the publish and the unpublish; the
window was closed first. What is known from the response: `saved=1` is reached
only after the write of `publication_state = 'published'` returns ok on exactly
one `"Programme"` row, and a `Programme` publish does not cascade, so
`"ProgrammeTier"`, `"ProgrammeLabTest"` and `"LabTest"` stood at 0 throughout.
The first read taken after the window returned 0 on all four tables. The
instantaneous figure inside the window is therefore inferred, not measured, and
is recorded here as inferred.

**The exposure window — about one second.** The two calls were not timestamped,
so rather than state an unmeasured figure, the endpoint that closed the window
was measured afterwards: `.../programmes/submit/unpublish` against a throwaway
`Programme` that stayed `draft` throughout, which takes the identical code path
— parse, write, `revalidate()`, redirect — and publishes nothing.

```
unpublish #1 -> 303 ?saved=1 in 1078 ms
unpublish #2 -> 303 ?saved=1 in  804 ms
unpublish #3 -> 303 ?saved=1 in  897 ms
unpublish #4 -> 303 ?saved=1 in 1167 ms
min 804 ms | max 1167 ms | mean 987 ms
```

The comparable `create` write on the same module measured 829 ms.

**What could have been served inside that second.** One region, and not the
one that matters most. `dynamicParams = false` means the detail route serves
only slugs baked in at build time, and the throwaway's slug was not among them,
so `/{locale}/programmes/g5-proof-…` would have returned 404 throughout — as
all 18 seed-slug detail URLs still do. The reachable surface was
`programmes.listing` on `/ar/programmes` and `/en/programmes`, which the
publish's `revalidate()` would have regenerated with one card bearing the
marker strings. Whether a Visitor request landed inside that second cannot be
determined from outside the platform's logs. No LabTest name could have
rendered under any flag value, because the only code path that reads the flag
is the detail page.

---

## What the halt found

**CF-128's premise is disproved.** CF-128 asserted that
`hasClinicalCatalogueSignOff()` reads `docs/research/clinical-signoff.md` from
`process.cwd()` at request time, that `next.config.ts` sets no
`outputFileTracingIncludes`, that Next therefore does not trace `docs/` into a
deployment bundle, and that in production the file is absent, the catch returns
false, and publish is refused even after the laboratory signs. The publish
succeeding disproves it. The reasoning was the reviewer's and it was wrong.

The configuration half of the claim is still true —
`next.config.ts` sets no `outputFileTracingIncludes`, so CF-128's *remedy* was
never applied. What is false is the conclusion drawn from that.
`CLINICAL_SIGN_OFF_RELATIVE_PATH` in
`src/lib/dashboard/clinicalSignOff.ts:14` is a module-level constant folded
from string literals, and the read is
`readFileSync(join(process.cwd(), CLINICAL_SIGN_OFF_RELATIVE_PATH), "utf8")`.
Next's file tracer resolves that statically and includes the artefact. The file
is present at request time in the deployed function, `Status: SIGNED` validates,
and the gate opens.

**CF-134's second half is also disproved.** CF-134 states that local
`npx next start` from the repository and production disagree about whether
publishing is possible, because CF-128 keeps the gate shut in a Vercel
deployment. They do not disagree. Both are open. The throwaway publish that
succeeded locally at P05-T26B succeeds in production too.

**Remediation performed.** The row was unpublished on the next request, then
deleted, and the published count read afterwards rather than assumed:

```
POST .../programmes/submit/unpublish -> 303  ...?saved=1
POST .../programmes/submit/delete    -> 303  /ar/dashboard/programmes?saved=1
GET  the deleted row                 -> 404
```

Published count across `"Programme"`, `"ProgrammeTier"`, `"ProgrammeLabTest"`
and `"LabTest"`: **0**, read twice — once immediately after the halt and once
after the timing measurement above. Rows carrying the throwaway slug prefix: 0.
Rows carrying the proof marker in `name_ar` or `name_en`: 0.

**A control that was not planned and is worth recording.** The same query
returned the newest `updated_at` per table: `"Programme"`, `"ProgrammeTier"`
and `"LabTest"` all `2026-08-31 11:24:42+00`, the M4c seed load, and
`"ProgrammeLabTest"` `2026-09-06 11:12:15+00`, which is M8. No row on any
clinical table carries an `updated_at` from this window. The nine signed
Programmes were never written to; the publish and unpublish touched only the
throwaway, which no longer exists.

**Public surface after remediation.** `/ar`, `/en`, `/{locale}/programmes` and
`/{locale}/departments` each return 200 with 0 occurrences of either proof
marker and 0 of the throwaway slug prefix. `/{locale}/programmes` serves
`x-vercel-cache: REVALIDATED` with 4 pending gates and 0 `<article>`. The 18
Programme detail URLs return 404.

---

## Secondary findings

Four, described and not fixed. No edit was made for any of them and none
carries a carry-forward id; they are numbered when the reviewer rules on them.

**1. The deployment serves the D-07 results-portal placeholder in both
locales.** Anchors carrying `href="https://example.invalid/portal-placeholder"`,
counted on the deployment and identical in `ar` and `en`: **6** on `/{locale}`,
**5** on `/{locale}/online-results`, **3** on `/{locale}/lab-to-lab`, **3** on
`/{locale}/contact`. The only other absolute hosts on any of those pages are the
four published social URLs.
`assertResultsPortalEnvPair()` in `src/lib/resultsPortalLink.ts:38` throws when
exactly one of `RESULTS_PORTAL_VISITOR_URL` and `RESULTS_PORTAL_LAB_TO_LAB_URL`
is set, and the pages render, so **both are unset or empty in the production
build environment**. `docs/SESSION_CONTEXT.md` states the opposite — that the
results portal production URL is set in the deployment environment and is not in
the repository. Seen in the rendered HTML of `/ar` and `/en`, and in the
`ResultsPortalLinkAction` anchor on every page that carries one.

**2. `NEL_LABTEST_CONTENT` cannot be read from outside the platform.** Criterion
7d records this in full. The flag is the PR-08 release gate, it is named in a
G5 criterion, and there is no route to a reading that does not either publish a
clinical row or hold a Vercel credential this machine does not have. A gate
criterion that cannot be evidenced without violating a different constraint is a
method defect, not a measurement.

**3. `docs/research/README.md` carries two rows for the same file, and one
stale description.** `clinical-worklist.md` appears twice, at lines 29 and 31,
with different descriptions and different counts — the first says 72 Arabic
names and 121 judgements, the second says 71 names and 124 memberships. The
`clinical-signoff.md` row at line 32 reads "Status PENDING as received. …The
status line is not altered", which the file contradicts at line 3, where it
reads `Status: SIGNED`.

**4. `docs/admin_spec_4h6_v2.md` was untracked residue in the working tree, and
disappeared during this run.** It is the §4h.6 replacement payload from P05-T25
STEP 0, left behind after that task landed the text into `docs/ADMIN_SPEC.md`,
which carries the same heading at line 452.

Observed at the start of this run and repeatedly during it, as
`?? docs/admin_spec_4h6_v2.md` in `git status --porcelain`. Read successfully
mid-run: 2,839 bytes, first line
`#### §4h.6 The check is server-side, recomputed on write, and honest…`, the
section sign encoded correctly as `c2 a7`. The file is well-formed UTF-8; an
earlier reading in this run called it mojibake and that reading was a console
codepage artefact, not a defect in the file.

By the time this run committed, the file was gone: `Test-Path` false,
`git status --porcelain --untracked-files=all -- docs/` empty, and the commit
contains four files, none of them this one. **No step of this run deleted it**
— nothing here issued a delete, a `git clean`, or a checkout that could remove
an untracked file — and the cause is therefore undetermined and is not
speculated about here. The finding is recorded as observed rather than dropped,
because a finding that disappears without a recorded reason is exactly the kind
of thing that should not vanish from the record.
