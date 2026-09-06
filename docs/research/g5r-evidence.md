# G5-R — gate re-run, 7 September 2026

**Result: PASS.** All seven `ADMIN_SPEC.md` §9 criteria hold.
**Precedence:** none — this is evidence. This file decides nothing and is never a
parity target (PR-09). It records what was measured on 7 September 2026 and the
command that measured it. `docs/research/g5-evidence.md` is the failed run's
record and is not edited.

Every criterion below is marked **PASS**. None is NOT REACHED.

**Deployment under test.** `https://nel-nile-egypt-labs.vercel.app`.
**Code identity.** `git diff --stat 1e0ef6d origin/main -- src/ public/ package.json next.config.ts` → empty. `1e0ef6d` is the P05-T26B merge (pull request #90). `origin/main` is `fb231c7` (the P05-T29 merge, pull request #94). Every commit between them is documents and ledger; the application tree is the tree G5 measured.

**Redaction.** Account identifiers, project refs, keys, JWTs, connection
strings, the hotline, WhatsApp numbers, branch addresses and Arabic clinical
names do not appear here. Counts, hashes, structural markers and per-account
hashes only (PR-16, PR-21).

**Nothing was published.** No write to `"Programme"`, `"ProgrammeTier"`,
`"ProgrammeLabTest"` or `"LabTest"`. No Operator session was minted. No Storage
object was uploaded. The sign-off gate is proved open by the P05-T26B local
publish already on the record and the 6 September production publish already on
the record. This run did not publish on any environment.

---

## STEP 0 — P05-T29 verdict

P05-T29 Verdict cell set to `PASS at reviewer verdict — 7 September 2026`.
PHASES.md P05-T29 box checked. `npm run guard:phases` → exit 0. R5 still the
seventeen CF-100 rows, report-only.

---

## STEP 1 — code identity

**Command.** `git diff --stat 1e0ef6d origin/main -- src/ public/ package.json next.config.ts`

**Result.** Empty. Criteria 1, 3 and 6 are therefore discharged by reference to
`g5-evidence.md`, with one live spot-check each against the deployment.

**Currency of the deployment.** The English home hero text-node byte lengths on
the live deployment are 15 / 33 / 208, identical to `g5-evidence.md:59-61`.
`GET /ar` returns `200`, `x-nextjs-prerender: 1`, `x-vercel-cache: PRERENDER`,
`<html lang="ar" dir="rtl">`. `GET /en` returns `200`, `x-nextjs-prerender: 1`,
`x-vercel-cache: HIT`, `<html lang="en" dir="ltr">`. The application tree has
not moved.

---

## Criterion 1 — an Operator publishes a change and a Visitor sees it — PASS

**Discharged by reference.** `docs/research/g5-evidence.md:31-100`. Androw
published the `"SiteSettings"` singleton at P05-T21; `home.hero` and
`home.reasons` render content, not the §12 pending state, in both locales. The
decisive marker is that `approval.pending.signedCopy`'s rendered string occurs
0 times page-wide.

**Currency.** STEP 1: the application tree is unchanged.

**Live spot-check.** `curl.exe -sI --max-redirs 0` against the deployment, then
a GET of the body searched for the catalog key and both rendered strings.

```
GET https://nel-nile-egypt-labs.vercel.app/ar
  200  x-nextjs-prerender 1  x-vercel-cache PRERENDER  <html lang="ar" dir="rtl">
GET https://nel-nile-egypt-labs.vercel.app/en
  200  x-nextjs-prerender 1  x-vercel-cache HIT        <html lang="en" dir="ltr">

approval.pending.signedCopy (key)                         0  page-wide on all 24 public URLs
rendered ar string (catalog.ts:409)                       0
rendered en string (catalog.ts:1027)                      0
```

---

## Criterion 2 — two Operator accounts, both with a verified TOTP factor — PASS

**Re-read.** Not referenced. `npx supabase db query --linked --output-format json`.
Identifiers redacted at the query: the only per-account value returned is
`left(md5(id::text), 12)`.

**Totals.**

```
accounts                        2
totp_factors                    2
totp_verified                   2
totp_unverified                 0
accounts_without_verified_totp  0
```

**Per account.**

| Account hash | TOTP factors | Verified | Unverified | Email confirmed | Not banned | Created |
|---|---|---|---|---|---|---|
| `0f0f3f538685` | 1 | 1 | 0 | true | true | 2026-09-03 |
| `2f4da8bd2950` | 1 | 1 | 0 | true | true | 2026-09-05 |

`raw_app_meta_data ->> 'nel_principal'` is `null` on both. No account lacks a
verified factor.

---

## Criterion 3 — an unenrolled session reaches only the enrolment screen — PASS

**Discharged by reference.** `docs/research/g5-evidence.md:131-174`. G5 minted a
throwaway account with no MFA factor, signed in through the application's own
POST, and every module route returned 307 to `/ar/dashboard/enrol`. Challenge
with that session returned 307 to enrol. The account was then deleted.

**Currency.** STEP 1: the application tree is unchanged. `src/lib/dashboard/gates.ts:20-22`
still reads: unsigned-in → sign-in; signed-in without verified TOTP → enrol.

**Live spot-check.** Unauthenticated `GET /ar/dashboard/challenge` (no session
cookie; this run does not mint one):

```
GET https://nel-nile-egypt-labs.vercel.app/ar/dashboard/challenge
  307  Location: /ar/dashboard/sign-in
```

`gateChallengePage` redirects an unsigned-in request to sign-in
(`gates.ts:21`) and an unenrolled session to enrol (`gates.ts:22`). The
fence's "unauthenticated → enrol" hop is the unenrolled-session case G5
already proved. Repeating that case requires creating an auth user, which
this run does not do. The challenge URL is not a public 200.

---

## Criterion 4 — zero anonymous INSERT, UPDATE or DELETE policies — PASS

**Re-read.** `pg_policies`, `schemaname in ('public', 'storage')`. An anonymous
write policy is one whose `cmd` admits a write and whose `roles` array reaches
anon — `anon` named directly, or the catch-all `public`:

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

**Shapes.** Exactly two, across all 24:

| `cmd` | `roles` | Policies | Relations |
|---|---|---|---|
| `ALL` | `{authenticated}` | 12 | 12 |
| `SELECT` | `{anon}` | 12 | 12 |

The `public` role appears in no policy. `anon_write` is 0 on every one of the
twelve relations: `public."Branch"`, `"Equipment"`, `"LabTest"`, `"LabUnit"`,
`"MediaAsset"`, `"Offer"`, `"Programme"`, `"ProgrammeLabTest"`,
`"ProgrammeTier"`, `"SiteSettings"`, `"Video"`, and `storage.objects`.

Row-level security is enabled on all eleven `public` tables
(`pg_class.relrowsecurity` true on each).

---

## Criterion 5 — no personal or medical data, and the Media Library refuses at the policy — PASS

**Re-read.** Live schema and live bucket, not referenced.

**Columns**, `information_schema.columns` where `table_schema = 'public'`.
163 columns across eleven tables:

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

`git grep -n created_by -- src/` → no matches. Three hits in
`supabase/migrations/*.sql`, all inside comments asserting that no such column
exists (M2 line 15, M3 line 19, M5 line 16).

**Live bucket**, `storage.buckets` where `id = 'media-asset'`:

```
public              false
file_size_limit     5242880
allowed_mime_types  image/jpeg, image/png, image/webp
```

`application/pdf`, `image/svg+xml` and `image/gif` are absent. The G5
authenticated POSTs (PDF refused, PNG accepted then deleted, SVG/GIF refused)
write to production Storage. This run does not repeat them. The allowlist they
exercised is the row just read. Anon write policies on `storage.objects` remain
0 (criterion 4).

**Dashboard form fields.** `name="…"` literals across
`src/components/dashboard/**` and `src/app/[locale]/dashboard/**`: 38 distinct.
Banned-vocabulary hits (patient, result, birth, diagnosis, medical, specimen,
referral, national id, passport, insurance, full/first/last name, person,
surname, mobile, personal): **0**. Bilingual pairs are passed as `nameAr` /
`nameEn` props (`name_ar`, `name_en`, `title_ar`, `description_ar`, `alt_ar`,
and the Site Settings pairs) rather than as `name=""` attributes; those names
are catalogue fields, not personal data. Operator authentication inputs `email`,
`password`, `code`, `factorId` remain the Operator's own credentials.

**Log surface.** Search of `src/` for `console.` → 0 matches.

---

## Criterion 6 — every dashboard screen in `ar` and `en`, and the Programmes refusal — PASS

**Discharged by reference.** `docs/research/g5-evidence.md:312-364`. Every
dashboard screen returned 200 in both locales with `<html lang dir>` matching
the locale. The Programmes publish path refused an empty `name_ar`
(`error=bilingual&groups=name`).

**Currency.** STEP 1: the application tree is unchanged.

**Live spot-check.**

```
GET /ar/dashboard/sign-in  200  <html lang="ar" dir="rtl">
GET /en/dashboard/sign-in  200  <html lang="en" dir="ltr">
```

---

## Criterion 7 — nothing clinical reached production — PASS

Three legs, each measured without a hosting-platform credential. No leg was
tested by an action that can write to the production database.

### 7a. No LabTest name and no Programme slug on any public URL — PASS

**Catalogue, read from the database at the gate**
(`npx supabase db query --linked --output-format json`):

```
"LabTest" rows     71   name_en nonempty 71   name_ar nonempty 71
distinct name_en   71
distinct name_ar   68   (three Arabic names are shared across rows)
"Programme" slugs   9   cardiovascular-profile, diabetes, general-checkup,
                        infertility, joint-bone-pain, kidney-profile,
                        liver-profile, pre-marital, pregnancy-follow-up
```

Needles searched: every `name_en`, every `name_ar`, and every slug = **151**.
Arabic names are not reproduced here.

**Public URLs.** 12 static patterns × 2 locales = **24**, from
`CONTENT_MODEL.md` §3c. Each fetched on the deployment. All 24 returned **200**.

```
/{locale}
/{locale}/about
/{locale}/departments
/{locale}/programmes
/{locale}/offers
/{locale}/videos
/{locale}/equipment
/{locale}/locations
/{locale}/contact
/{locale}/online-results
/{locale}/privacy-policy
/{locale}/lab-to-lab
  locale in {ar, en}
```

**Occurrences of any needle across all 24 bodies: 0.** Needles with at least
one hit: 0.

### 7b. eligibility_audience matches the bound worklist — PASS

**Worklist and sign-off, unmodified.**

```
docs/research/clinical-worklist.md
  git ls-files --error-unmatch → exit 0 (tracked)
  git status --porcelain       → '' (unmodified)
  git hash-object              → e79b5624cfc9a02d9f380a6287604e5b002fbb1c
  git rev-parse HEAD:<path>    → e79b5624cfc9a02d9f380a6287604e5b002fbb1c   (equal)
  bytes 24896
  sha256 22b2c73b697460b2def3a86e4b6489c987874a071c4d9c0f792a46612197569f

docs/research/clinical-signoff.md
  git ls-files --error-unmatch → exit 0 (tracked)
  git status --porcelain       → '' (unmodified)
  git hash-object              → 3e02117fccbd450ecb5fe885fdd90044d593145d
  git rev-parse HEAD:<path>    → 3e02117fccbd450ecb5fe885fdd90044d593145d   (equal)
  bytes 6346
  sha256 aa0469eedad99a4f55acd469912689df511311343ec8f31bb75cabf8c577aef7
```

Sign-off line 8: `Approved worklist SHA-256: \`22b2c73b697460b2def3a86e4b6489c987874a071c4d9c0f792a46612197569f\``.
Line 25 repeats the same hash. Recomputed sha256 over the worklist equals
that line. The sign-off binds this exact worklist.

**Join.** Database: `"Programme".name_en` × `ProgrammeTier` axes rendered as
the worklist's Tier cell × `"LabTest".slug` → `eligibility_audience`.
Worklist Section B: English programme name × Tier × backtick slug →
`**eligibility**`. The Section B header row (`LabTest` / `Eligibility`) is
not a membership and is excluded.

```
worklist data rows     124
database memberships   124
mismatches               0
unreviewed               0
database-only keys       0
worklist-only keys       0
eligibility_audience     all 94 · female 16 · male 14
"LabTest" qa_flag nonempty  0
"LabTest" name_ar empty     0
```

Zero mismatches, zero unreviewed.

### 7c. NEL_LABTEST_CONTENT is inert — PASS

The flag's value was not read. Its only read and its only caller are named,
and the caller is unreachable in this deployment.

**Only read.** `src/lib/clinicalFlag.ts:9` —
`return process.env.NEL_LABTEST_CONTENT === "on";`
A repository search for `NEL_LABTEST_CONTENT` hits that line only.

**Only caller.** `src/app/[locale]/(public)/programmes/[slug]/page.tsx:37` —
`const labTestContent = isLabTestContentEnabled();`

**Caller unreachable.** Same file:

```
14  export const dynamicParams = false;

16  export async function generateStaticParams() {
17    const slugs = await listPublishedProgrammeSlugs();
18    return slugs.map((slug) => ({ slug }));
19  }
```

`listPublishedProgrammeSlugs` selects published `"Programme"` slugs only.
Published `"Programme"` count at the gate: **0**. The generated param list
is therefore `[]`. With `dynamicParams = false`, unknown slugs 404.

**18 detail URLs, all 404.** 9 slugs × 2 locales, fetched on the deployment
with redirects not followed:

```
/{locale}/programmes/cardiovascular-profile
/{locale}/programmes/diabetes
/{locale}/programmes/general-checkup
/{locale}/programmes/infertility
/{locale}/programmes/joint-bone-pain
/{locale}/programmes/kidney-profile
/{locale}/programmes/liver-profile
/{locale}/programmes/pre-marital
/{locale}/programmes/pregnancy-follow-up
  locale in {ar, en}

404 × 18
```

Line 37 cannot run for any Visitor request in this deployment.

### Published count across the four clinical tables — 0

Read, not assumed:

| Relation | Rows | `published` | `draft` |
|---|---|---|---|
| `"Programme"` | 9 | **0** | 9 |
| `"ProgrammeTier"` | 14 | **0** | 14 |
| `"ProgrammeLabTest"` | 124 | **0** | 124 |
| `"LabTest"` | 71 | **0** | 71 |

---

## STEP 5 — CF-131 and CF-142

`src/app/[locale]/dashboard/(session)/page.tsx:59-65`:

```
function clinicalLines(locale: Locale, progress: ClinicalProgressCounts): string[] {
  return [
    translate(locale, "dashboard.home.awaitingSignOff"),
    `${progress.labTestArabicNamed} / ${progress.labTestTotal} ${translate(locale, "dashboard.home.arabicNames")}`,
    `${progress.membershipsReviewed} / ${progress.membershipsTotal} ${translate(locale, "dashboard.home.membershipsReviewed")}`,
    `${progress.qaFlagsOutstanding} ${translate(locale, "dashboard.home.qaFlagsOutstanding")}`,
  ];
}
```

`python -X utf8` count of `%` in that file → **0** (0 characters, 0 lines).
The clinical cards call `CompletenessAwaitingLine` with the awaiting-sign-off
string (`page.tsx:101-106`); they do not call the complete / incomplete
summary. `CompletenessAwaitingLine` (`CompletenessHeader.tsx:183-189`) renders
`stateAwaiting` only.

CF-131 closed at G5-R. CF-142 closed at G5-R.

---

## STEP 6 — CF-87

An RLS-subject anonymous row-level read on `public.*` was **not** executed.

**Command.** `npx supabase db query --linked --output-format json`
`select current_user as login_role, (select rolbypassrls from pg_roles where rolname = current_user) as login_bypassrls`

**Result.** `login_role` `postgres`, `login_bypassrls` **true**. The CLI
`--linked` path bypasses RLS. It cannot be the subject of a policy. No other
connection on this machine is known to run as `anon` with `rolbypassrls`
false. `has_table_privilege` / `pg_class.relacl` are not substituted.
CF-87 stays OPEN.

---

## What this run did not do

- No publish, unpublish, insert, update or delete on any clinical table.
- No Operator session created or destroyed.
- No Storage object uploaded or deleted.
- No edit to `g5-evidence.md`, `clinical-signoff.md`, `clinical-worklist.md`
  or `clinical-signoff-addendum.md`.
- No `src/` change, no migration, no schema change.
