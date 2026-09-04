# M7A — Role-split audit

**Evidence tooling. Never current truth, never a spec, never cited as
authority.** PR-09 applies: this file justifies a later migration; it does
not replace `SECURITY_MODEL.md`, `DECISIONS.md` or `ADMIN_SPEC.md`.

**Task:** M7A · P05 audit only · 4 September 2026
**Git branch:** `m7a` from `origin/main` at
`6282fb6c4c388de48db7c3cad1b8a375bf885c86`
(merge of pull request #68, `p05-t14`).
**This file authors no SQL, changes no file under `src/`, and applies
nothing.**

---

## STEP 0 — predecessor

P05-T14 verdict, recorded in `docs/SESSION_CONTEXT.md` and
`docs/PHASES.md` in the same commit as this file:

`PASS at reviewer verdict — 4 September 2026`

---

## How the counts were computed

PR-01. Each number below names its command.

Forward `create policy` statements, excluding `*.down.sql`:

```
python -X utf8 -c "import pathlib,re; root=pathlib.Path('supabase/migrations'); pat=re.compile(r'^create policy', re.I|re.M); files=sorted(p for p in root.glob('*.sql') if not p.name.endswith('.down.sql')); total=0
for p in files:
 n=len(pat.findall(p.read_text(encoding='utf-8'))); total+=n
 print(f'{n}\t{p.name}')
print(f'TOTAL\t{total}')"
```

→ `16` in `20260831111522_m4b_policies_and_write_grants.sql` · `6` in
`20260901084408_m5_offer_equipment_video.sql` · `2` in
`20260903150000_media_asset_bucket.sql` · **TOTAL 24**. Arithmetic:
16 + 6 + 2 = 24.

Live database, read only:

```
npx supabase db query --linked "select count(*) as policy_count from pg_policies where schemaname in ('public', 'storage')"
```

→ `policy_count` **24**.

```
npx supabase db query --linked "select cmd, count(*)::int as n from pg_policies where schemaname in ('public', 'storage') group by cmd order by cmd"
```

→ **ALL 12 · SELECT 12**. Arithmetic: 12 + 12 = 24.

```
git ls-files supabase/migrations/
python -X utf8 -c "import subprocess; out=subprocess.check_output(['git','ls-files','supabase/migrations/'], text=True); print(len([l for l in out.splitlines() if l]))"
```

→ **18** (9 timestamped forwards + 9 reverses). Unchanged by this task.

`npx supabase migration list --linked` → nine timestamped forwards, each
`local` equal to `remote`. Reverse files are skipped by filename pattern;
that is the CLI, not a missing apply.

Expressions below are copied from those three forward files. A full
`pg_policies` dump of `qual` / `with_check` was attempted and failed with
`LegacyDbConfigConnectTempRoleError` after concurrent reads; it was not
retried. File text is the inventory the fence asked for. Live `cmd` counts
agree with the files.

---

## STEP 1 — inventory of 24 policies

Two shapes, `SECURITY_MODEL.md` §3. **KEEP** means the split does not
rewrite the policy. **CHANGE** means M7B must replace `USING` / `WITH CHECK`
so that `TO authenticated` is no longer sufficient.

Postgres `FOR ALL` is SELECT + INSERT + UPDATE + DELETE. There is no
separate INSERT, UPDATE or DELETE policy on any of these tables.

### Count by command

| Command | Count | Shape |
|---|---|---|
| SELECT | 12 | `*_published_read`, all KEEP |
| ALL | 12 | `*_operator_write`, all CHANGE |
| INSERT / UPDATE / DELETE as named commands | 0 | — |

### KEEP — published-read (12)

Anonymous SELECT of published rows. No `WITH CHECK` (SELECT has none).

1. **LabUnit_published_read** · `public."LabUnit"` · SELECT · `TO anon` ·
   USING `publication_state = 'published'` · WITH CHECK none · KEEP
2. **Branch_published_read** · `public."Branch"` · SELECT · `TO anon` ·
   USING `publication_state = 'published'` · WITH CHECK none · KEEP
3. **SiteSettings_published_read** · `public."SiteSettings"` · SELECT ·
   `TO anon` · USING `publication_state = 'published'` · WITH CHECK none ·
   KEEP
4. **MediaAsset_published_read** · `public."MediaAsset"` · SELECT ·
   `TO anon` · USING `publication_state = 'published'` · WITH CHECK none ·
   KEEP
5. **LabTest_published_read** · `public."LabTest"` · SELECT · `TO anon` ·
   USING `publication_state = 'published'` · WITH CHECK none · KEEP
6. **Programme_published_read** · `public."Programme"` · SELECT · `TO anon` ·
   USING `publication_state = 'published'` · WITH CHECK none · KEEP
7. **ProgrammeTier_published_read** · `public."ProgrammeTier"` · SELECT ·
   `TO anon` · USING `publication_state = 'published'` · WITH CHECK none ·
   KEEP
8. **ProgrammeLabTest_published_read** · `public."ProgrammeLabTest"` ·
   SELECT · `TO anon` · USING `publication_state = 'published'` · WITH CHECK
   none · KEEP
9. **Offer_published_read** · `public."Offer"` · SELECT · `TO anon` ·
   USING `publication_state = 'published'` · WITH CHECK none · KEEP
10. **Video_published_read** · `public."Video"` · SELECT · `TO anon` ·
    USING `publication_state = 'published'` · WITH CHECK none · KEEP
11. **Equipment_published_read** · `public."Equipment"` · SELECT · `TO anon`
    · USING `publication_state = 'published'` · WITH CHECK none · KEEP
12. **MediaAsset_objects_published_read** · `storage.objects` · SELECT ·
    `TO anon` · USING, verbatim from
    `20260903150000_media_asset_bucket.sql`:

    ```
    bucket_id = 'media-asset'
    and exists (
      select 1
      from public."MediaAsset" media_row
      where media_row.storage_path = name
        and media_row.publication_state = 'published'
    )
    ```

    WITH CHECK none · KEEP

### CHANGE — operator-write (12)

Full access for the Postgres role `authenticated`, no claim, no
per-Operator partition. That is today's hole: any authenticated session
writes.

On the eleven application tables, USING and WITH CHECK are both `true`.

13. **LabUnit_operator_write** · `public."LabUnit"` · ALL ·
    `TO authenticated` · USING `true` · WITH CHECK `true` · CHANGE
14. **Branch_operator_write** · `public."Branch"` · ALL ·
    `TO authenticated` · USING `true` · WITH CHECK `true` · CHANGE
15. **SiteSettings_operator_write** · `public."SiteSettings"` · ALL ·
    `TO authenticated` · USING `true` · WITH CHECK `true` · CHANGE
16. **MediaAsset_operator_write** · `public."MediaAsset"` · ALL ·
    `TO authenticated` · USING `true` · WITH CHECK `true` · CHANGE
17. **LabTest_operator_write** · `public."LabTest"` · ALL ·
    `TO authenticated` · USING `true` · WITH CHECK `true` · CHANGE
18. **Programme_operator_write** · `public."Programme"` · ALL ·
    `TO authenticated` · USING `true` · WITH CHECK `true` · CHANGE
19. **ProgrammeTier_operator_write** · `public."ProgrammeTier"` · ALL ·
    `TO authenticated` · USING `true` · WITH CHECK `true` · CHANGE
20. **ProgrammeLabTest_operator_write** · `public."ProgrammeLabTest"` · ALL
    · `TO authenticated` · USING `true` · WITH CHECK `true` · CHANGE
21. **Offer_operator_write** · `public."Offer"` · ALL ·
    `TO authenticated` · USING `true` · WITH CHECK `true` · CHANGE
22. **Video_operator_write** · `public."Video"` · ALL ·
    `TO authenticated` · USING `true` · WITH CHECK `true` · CHANGE
23. **Equipment_operator_write** · `public."Equipment"` · ALL ·
    `TO authenticated` · USING `true` · WITH CHECK `true` · CHANGE
24. **MediaAsset_objects_operator_write** · `storage.objects` · ALL ·
    `TO authenticated` · USING `bucket_id = 'media-asset'` · WITH CHECK
    `bucket_id = 'media-asset'` · CHANGE (the bucket predicate stays; the
    missing Operator claim is what M7B adds)

The eleven application tables plus `storage.objects` are the lockout
surface named in STEP 3.

### Consequence the split does not repair by itself

`*_published_read` is `TO anon` only. The Postgres role `authenticated` is
not `anon`, so those twelve KEEP policies do not cover an authenticated
session. Today an Operator still reads unpublished rows because
`*_operator_write` is `FOR ALL` with `USING true`. After the split, a
session that is authenticated and lacks the Operator claim matches **no**
policy: writes fail, and SELECT of published rows fails too. That is
correct for a principal who must not use the dashboard. If a later
`PartnerLab` principal needs published catalogue reads, that is a third
policy shape, not M7B, and it is not specified here. OD-15's documentation
is a later task.

GRANTs are unchanged by this audit and should stay unchanged in M7B.
`authenticated` already holds INSERT, UPDATE and DELETE on the eleven
tables (M4b, M5). RLS is the control. CF-106 records that `anon` holds
table-level INSERT, UPDATE and DELETE on `storage.objects` from
`supabase_storage_admin`; RLS still denies anon writes (P05-T11). M7B does
not revoke that platform grant.

---

## STEP 2 — how an Operator claim reaches a policy

Two mechanisms. Recommend one.

### What the JWT already carries

This window did not decode a live access token. Minting an authenticated
JWT requires a sign-in or an Admin create, both writes, and this task
forbids writes. The publishable key was not loaded into this file
(OD-04 condition 1). The claim **names** below are from Supabase's JWT
Claims Reference (`https://supabase.com/docs/guides/auth/jwt-fields`),
which `readOperatorAccessFrom` already depends on via `getClaims()`.

**Publishable anon token** (the Visitor request; P05-T11 called this the
publishable anon JWT). Documented anonymous-token keys, values redacted:

```
iss:  [redacted under OD-04 condition 1]
ref:  [redacted under OD-04 condition 1]
role: anon
iat:  [redacted under OD-04 condition 1]
exp:  [redacted under OD-04 condition 1]
```

`role` is the Postgres role name `anon`, not a credential. There is no
`app_metadata` on this token.

**Authenticated access token** (password sign-in and every refresh).
Documented required keys, values redacted except enumerations:

```
iss:          [redacted under OD-04 condition 1]
aud:          authenticated
exp:          [redacted under OD-04 condition 1]
iat:          [redacted under OD-04 condition 1]
sub:          [redacted under OD-04 condition 1]
role:         authenticated
aal:          aal1 | aal2
session_id:   [redacted under OD-04 condition 1]
email:        [redacted under OD-04 condition 1]
phone:        [redacted under OD-04 condition 1]
is_anonymous: [redacted under OD-04 condition 1]
```

Optional keys that GoTrue commonly includes:

```
jti:           [redacted under OD-04 condition 1]
nbf:           [redacted under OD-04 condition 1]
app_metadata:  { provider, providers }   — see live read below
user_metadata: [redacted under OD-04 condition 1]
amr:           [redacted under OD-04 condition 1]
```

`role` on this token is the Postgres role `authenticated`. Overwriting that
field with `operator` would make PostgREST look for a Postgres role that
does not exist. That is why the Operator mark must not live at JWT `role`.

**Live `auth.users` row, not a JWT.** Read:

```
npx supabase db query --linked "select count(*) as user_count from auth.users"
```

→ **1**.

```
npx supabase db query --linked "select count(*) filter (where coalesce(raw_app_meta_data, '{}'::jsonb) ? 'operator') as users_with_operator_key, count(*) filter (where coalesce(raw_app_meta_data, '{}'::jsonb) ? 'nel_principal') as users_with_nel_principal_key from auth.users"
```

→ **0** and **0**. No existing account carries an Operator claim.

```
npx supabase db query --linked "select (coalesce(raw_app_meta_data, '{}'::jsonb) ? 'provider') as has_provider, (coalesce(raw_app_meta_data, '{}'::jsonb) ? 'providers') as has_providers from auth.users"
```

→ both **true**. The next access token issued for that row will copy
`app_metadata` containing `provider` and `providers` and will not contain
`operator` or `nel_principal`. That is the lockout input to STEP 3.

`user_metadata` is user-editable and appears in `auth.jwt()`. It is
unsafe for authorization. The Supabase skill's security checklist and
GoTrue's own split both say so. It is not a candidate.

### Mechanism A — `app_metadata` (recommended)

GoTrue copies `auth.users.raw_app_meta_data` into every access token it
issues, including refresh (`authentication_method` `token_refresh`). The
client cannot write this object. Only the Auth Admin API (service role,
never in the application — `SECURITY_MODEL.md` §7) or a SQL update of
`auth.users` can.

Recommended key, chosen so it does not collide with JWT `role` and so a
later `PartnerLab` value does not require a second boolean:

- Path in the JWT: `app_metadata.nel_principal`
- Value for an Operator: `Operator` (the GLOSSARY entity, PascalCase)
- Policy predicate M7B should install, described not landed:
  `(auth.jwt() -> 'app_metadata' ->> 'nel_principal') = 'Operator'`
- Application gate reads the same path from `getClaims()`, which
  `readOperatorAccessFrom` already calls and currently discards.

**Cost.** One Admin `updateUser` per lasting Operator account. No Postgres
function. No hook on the refresh path. No public table of Operators
(D-40 / `SECURITY_MODEL.md` §6: Operator identity is never copied into the
application schema).

**Survives token refresh.** Yes. GoTrue re-reads `raw_app_meta_data` when
it mints the next access token. `jwt_expiry` in `supabase/config.toml` is
3600 seconds, so a stamp is visible on the next refresh or the next
sign-in, not necessarily on the currently presented JWT.

**Client influence.** None, provided the application never exposes the
service-role key (it does not: `src/lib/supabase/env.ts` reads only the
publishable key).

**Staleness.** `auth.jwt()` in RLS sees the presented token, not a live
lookup of `auth.users`. Stamping the row does not change an unexpired
JWT. That is the whole of STEP 3.

### Mechanism B — Custom Access Token hook (rejected)

`supabase/config.toml` has `[auth.hook.custom_access_token]` commented
out. Live read:

```
npx supabase db query --linked "select n.nspname, p.proname from pg_proc p join pg_namespace n on n.oid = p.pronamespace where p.proname ilike '%access_token%' or p.proname ilike '%custom_access%' order by 1, 2"
```

→ **zero rows**. No hook is installed.

The hook runs before every token issue, including `token_refresh`. It can
add claims. Supabase's RBAC guide uses it by creating `public.user_roles`
and reading that table from a `SECURITY INVOKER` function granted to
`supabase_auth_admin`. That table would be a public-schema copy of
Operator identity. D-40 and `SECURITY_MODEL.md` §6 forbid it. A hook that
only copies `app_metadata` onto a root claim is a round trip that
duplicates what GoTrue already puts in the JWT.

**Cost.** A Postgres (or HTTP) function on every sign-in and every
refresh; grants to `supabase_auth_admin`; revoke from `anon` /
`authenticated` / `PUBLIC`; dashboard or `config.toml` enable; a new
failure domain — if the hook errors, **no one** receives a token.

**Survives token refresh.** Yes, because it runs on refresh. That is not
an advantage over `app_metadata`, which also survives refresh.

**Client influence.** None, if the hook only reads server-side data.
Still not a reason to take the cost.

**Why B loses.** This project has two Operators and no permission matrix
(`SECURITY_MODEL.md` §3, `ADMIN_SPEC.md` §3a). The claim is a static flag
on the auth user. The documented hook pattern needs a public roles table
this boundary forbids. The remaining hook — copy `app_metadata` to a
custom root claim — does nothing `app_metadata` does not already do, and
it adds a function that can lock every sign-in. Overwriting JWT `role`
from the hook would also break PostgREST. `app_metadata` wins.

---

## STEP 3 — lockout-safe ordering

Existing accounts carry no Operator claim (STEP 2 live read: 0 / 0).
`auth.jwt()` reads the presented token. Applying the twelve CHANGE
policies before the claim is on the token locks every current Operator out
of the eleven tables and `storage.objects`. Dashboard writes use the SSR
client and the cookie JWT (`createSupabaseServerClient`); they would
silently affect 0 rows or return the Storage 403 P05-T11 already quoted.

### Recommended: two operations, one migration

**Operation 1 — stamp. Not a policy migration.** Auth Admin
`updateUserById` (service role, human-held, never in the app) sets
`app_metadata.nel_principal = "Operator"` on each lasting Operator
account, merging with existing `provider` / `providers`. Do not update
`auth.users` from a public-schema migration if it can be avoided:
Operator identity does not belong in the application schema, and a
blanket `UPDATE auth.users` would stamp whoever happens to exist (today:
one row, identity not selected).

**Intermediate after Operation 1.** Policies are still
`TO authenticated USING true WITH CHECK true`. Any authenticated session
still writes, including a token that does not yet carry the claim.
Published-read is unchanged. Visitors are unchanged. A `PartnerLab`
account must not exist yet (this fence forbids implementing one). The
stamp is inert until Operation 2. Lasting Operators keep working whether
or not their current JWT has been refreshed.

**Verify before tightening.** After a refresh or a fresh sign-in, decode
the Operator access token, redact values, and confirm `app_metadata`
contains `nel_principal` = `Operator`. Do not proceed until that is true
for every lasting Operator session that will remain open.

**Operation 2 — one policy migration.** ALTER the twelve CHANGE policies
so USING and WITH CHECK require the predicate in STEP 2. KEEP policies
untouched. No GRANT change. Reverse: restore `USING true` / `WITH CHECK
true` on the eleven tables and the current bucket predicates on
`storage.objects`.

**Intermediate after Operation 2, if Operation 1 was done and tokens
refreshed.** Operators write as they do today. An authenticated token
without the claim is refused on all twelve CHANGE policies. Anon still
reads published rows only.

### What a single combined migration would do

If stamp and ALTER POLICY run in one `db push` **without** revoking
sessions, then until `jwt_expiry` (3600s) or the next refresh, lasting
Operator JWTs lack the claim and writes fail. That is the lockout this
audit exists to prevent. Combining them is safe only if the same
transaction also deletes `auth.sessions` for those accounts so the next
dashboard use is a new sign-in. That is a planned re-authentication, not
a silent lockout, but it cannot be verified between stamp and tighten.
Two operations remain the recommendation: the stamp can be proved on a
refreshed token **before** any policy changes.

Do not enable signup. Do not create `PartnerLab`. Do not apply Operation 2
from this branch.

---

## STEP 4 — the application gate

`src/lib/dashboard/assurance.ts` `readOperatorAccessFrom` today:

1. `getClaims()` — if error or null, `{ signedIn: false }`. The payload
   is discarded. No role, no `app_metadata`.
2. `mfa.getAuthenticatorAssuranceLevel()` — maps to `aal1` | `aal2`.
3. `mfa.listFactors()` — `hasVerifiedTotp` if any TOTP factor is
   `verified`.

`gateModuleRoute` (`src/lib/dashboard/gates.ts`) then:

1. not signed in → `/dashboard/sign-in`
2. no verified TOTP → `/dashboard/enrol`
3. `currentLevel !== "aal2"` → `/dashboard/challenge`

No Operator check at any step. `(session)/layout.tsx` only requires
`signedIn`. `(session)` includes enrol. `gateEnrolPage` will send a
signed-in session that lacks TOTP to enrol, and the enrol page calls
`mfa.enroll`. A `PartnerLab` who can sign in would be offered a TOTP QR
and, after verifying it, would pass `gateModuleRoute` as it stands.

### What changes (described, not implemented)

`readOperatorAccessFrom` already has the JWT. After `getClaims()`
succeeds, read `app_metadata.nel_principal` from that payload. Add
`isOperator` to the signed-in arm of `OperatorAccess`. Still collect AAL
and TOTP so a proof can show a `PartnerLab` with aal2 and a verified
factor and still fail the gate.

**The Operator check is the second step, immediately after signed-in,
before TOTP and before AAL2.** Every gate that currently branches on TOTP
or AAL2 gains that step: `gateSignInPage`, `gateEnrolPage`,
`gateChallengePage`, `gateModuleRoute`, and the signed-in-only test in
`(session)/layout.tsx`. A non-Operator is sent away from the dashboard
(sign-out / sign-in), never to enrol, never to challenge, never to a
module.

Submit handlers already call `gateModuleRoute` after
`readOperatorAccessFrom` (`catalogSubmit.ts`, Site Settings submit, Media
Library submit). They inherit the change. RLS remains the database
control when the application is bypassed (STEP 5).

### OD-15 §5 — TOTP must not be the thing that fails a PartnerLab

The fence, quoted as the source because OD-15 is not in `DECISIONS.md`
and this task must not document it there:

> a `PartnerLab` must fail this gate **without TOTP being the thing that
> fails it** — a gate testing only AAL2 admits any PartnerLab who enrols
> an authenticator, which is the hole as it stands today.

AAL2 is authentication strength, not authorization. Any authenticated
principal who enrols TOTP can reach aal2. Today's gate treats "signed in
+ verified TOTP + aal2" as "is an Operator". Under OD-15 §5 that is the
hole. The failure for a `PartnerLab` must be `isOperator === false`,
observable even when `hasVerifiedTotp === true` and
`currentLevel === "aal2"`. If the gate is ordered TOTP-first, a
`PartnerLab` without a factor is sent to enrol and TOTP becomes the
failure. That ordering is forbidden.

This task does not implement `PartnerLab`, does not enable signup, and
does not change `assurance.ts`.

---

## STEP 5 — negative-proof plan for M7B

Application bypassed: HTTP to PostgREST and to Storage, `Authorization:
Bearer <access_token>`, `apikey` the publishable key. Same class as
P05-T11's direct Storage POST. No `src/` route, no form, no cookie.

### Tokens

**`nel-m7b-anon`.** The publishable anon JWT already in the client bundle.
Not created. Not an Operator. Control for Visitor reads; negative for
writes (P05-T11 already: Storage POST → HTTP 400 wrapping 403, `new row
violates row-level security policy`). Re-run on Storage if M7B wants a
fresh quote; not a substitute for the authenticated-without-claim proof.

**`nel-m7b-auth-no-claim` (negative).** Throwaway authenticated session
with **no** `nel_principal` claim. Obtained without a lasting account:

1. Auth Admin `POST /auth/v1/admin/users` with the service-role key
   (human-held, never in the application, never committed). Email
   synthetic, password local to the run, `email_confirm` true,
   `app_metadata` **omitted** or without `nel_principal`.
2. `POST /auth/v1/token?grant_type=password` with that email/password and
   the publishable `apikey`. That returns `access_token`. Decode, redact,
   confirm `role` is `authenticated` and `app_metadata` has no
   `nel_principal`.
3. After the twelve write attempts: Auth Admin `DELETE /auth/v1/admin/users/{id}`.
   Confirm GET 404.

Public signup stays disabled (`enable_signup = false` in
`supabase/config.toml` at `[auth]` and `[auth.email]`). There is no
public path to an authenticated token. Admin create is the minting path.
Anonymous sign-ins are also disabled.

**`nel-m7b-operator-control` (control).** Throwaway authenticated session
**with** `app_metadata.nel_principal = "Operator"`. Same minting path as
the negative token, except the Admin create (or a subsequent
`updateUserById`) sets the claim, then password-grant, then decode to
confirm the claim is present (value quoted as `Operator`, everything else
redacted). After the twelve writes succeed and probe rows are deleted:
Admin DELETE, GET 404. Not a lasting Operator account.

Do not use a lasting Operator session as the control. The fence asks for
tokens obtained without creating a lasting account.

### Negative writes (`nel-m7b-auth-no-claim`)

One INSERT (or the named substitute) per table, then no residue. Expect
PostgREST/Storage to refuse with an RLS denial (P05-T11's 403 shape, or
0 rows affected on UPDATE). Quote status, body code, and that no row
remained.

| # | Surface | Write | Notes |
|---|---|---|---|
| 1 | `"LabUnit"` | INSERT draft unique slug, then DELETE if it landed | must not land |
| 2 | `"Branch"` | INSERT draft, then DELETE if it landed | must not land |
| 3 | `"SiteSettings"` | UPDATE a disposable text column, restore if it changed | singleton; do not INSERT |
| 4 | `"MediaAsset"` | INSERT draft metadata row, then DELETE if it landed | no object required |
| 5 | `"LabTest"` | INSERT draft, then DELETE if it landed | names empty is allowed on draft |
| 6 | `"Programme"` | INSERT draft, then DELETE if it landed | |
| 7 | `"ProgrammeTier"` | INSERT draft with a valid `"Programme"` FK, then DELETE if it landed | |
| 8 | `"ProgrammeLabTest"` | INSERT draft with valid FKs, then DELETE if it landed | |
| 9 | `"Offer"` | INSERT draft, then DELETE if it landed | |
| 10 | `"Video"` | INSERT draft, then DELETE if it landed | no YouTube fetch |
| 11 | `"Equipment"` | INSERT draft, then DELETE if it landed | |
| 12 | `storage.objects` | POST `media-asset/m7b-probe.png`, DELETE if it landed | MIME jpeg/png/webp, ≤ 5 MiB; application/pdf is the wrong proof |

Probe names carry `m7b-probe` so a leftover is findable. Nothing is
published.

### Control writes (`nel-m7b-operator-control`)

The same twelve operations must succeed, then the probe is deleted (or
the Site Settings column restored). That is "an Operator token still
writes everything it could before": the eleven tables plus
`storage.objects` inside `media-asset`. Do not add a thirteenth surface.

SELECT of unpublished rows with the control token should still work
(FOR ALL). SELECT with the negative token should return no rows. The
fence's Done-when is the write refusal; mention the SELECT consequence
from STEP 1 when quoting.

---

## STEP 6 — CF-87, non-bypass tokens

CF-87: `information_schema.role_table_grants` is empty through the MCP
connection; `pg_class.relacl` / `has_table_privilege` are the substitutes
for grants. The CLI `--linked` path also carries `rolbypassrls`, so
neither connection can be the subject of a policy.

This window confirmed the second clause, read only:

```
npx supabase db query --linked "select current_user as login_role, (select rolbypassrls from pg_roles where rolname = current_user) as login_bypassrls"
```

→ `login_role` `postgres`, `login_bypassrls` **true**.

```
npx supabase db query --linked "select rolname, rolbypassrls from pg_roles where rolbypassrls = true order by rolname"
```

→ `postgres` · `service_role` · `supabase_admin` · `supabase_etl_admin` ·
`supabase_read_only_user`. `anon` and `authenticated` are absent: they do
not bypass RLS.

**M7B therefore does not prove policies with MCP `execute_sql`, with
`npx supabase db query`, or with `SET request.jwt.claims`.** Those are
bypass or simulation. Three previous builders refused that substitution;
this audit does not propose it.

**How the proofs run instead.** HTTPS to the project's PostgREST and
Storage endpoints, presenting `nel-m7b-anon`, `nel-m7b-auth-no-claim`, or
`nel-m7b-operator-control` as the Bearer token. Postgres then sees
`current_user` `anon` or `authenticated` with `rolbypassrls` false, and
`auth.jwt()` is that token. That is the P05-T11 path, which already
closed CF-107 for anon Storage writes.

Admin create/delete of throwaway accounts uses the service-role key and
**is not a policy proof**. It only mints and destroys the subject token.
The proof is the subsequent REST/Storage call.

---

## STEP 7 — what this file is not

Not a spec. Not cited as authority. Not OD-15. Not M7B. Not a migration.
`GLOSSARY.md`, `DECISIONS.md`, `SECURITY_MODEL.md` and `CONTENT_MODEL.md`
are untouched.

---

## Supabase commands run (reads only)

Help (no database): `npx supabase --help` · `npx supabase db --help` ·
`npx supabase db query --help`.

Linked reads:

1. `migration list --linked` — nine timestamped forwards, local = remote
2. `db query --linked` policy count → 24
3. `db query --linked` policy count by `cmd` → ALL 12, SELECT 12
4. `db query --linked` current_user / rolbypassrls → postgres / true
5. `db query --linked` roles with `rolbypassrls` → five names, not anon,
   not authenticated
6. `db query --linked` `auth.users` count → 1
7. `db query --linked` `operator` / `nel_principal` keys → 0 / 0
8. `db query --linked` `provider` / `providers` keys → true / true
9. `db query --linked` `pg_proc` name like access_token / custom_access
   → 0 rows

Attempted and **failed** (temp-role password after concurrent reads; not
retried; not used as a count):

- `pg_policies` full `qual` / `with_check` dump
- `jsonb_object_keys` on `raw_app_meta_data`

Not run: `db push`, `db reset`, `migration new`, `apply_migration`,
Auth Admin create/update/delete, signup, any claim stamp.

MCP `search_docs` was used for the JWT Claims Reference and the Custom
Access Token Hook pages. No MCP tool that touches the project database
was called (PR-20).

---

## Recommendation, one paragraph

Stamp `app_metadata.nel_principal = "Operator"` on lasting Operator
accounts first, refresh or re-issue their tokens, then in a later task
after G5 (M7B) alter the twelve CHANGE policies to require that
predicate, and in the same M7B window change `readOperatorAccessFrom` so
the Operator check precedes TOTP. Reject the Custom Access Token hook.
Prove with `nel-m7b-auth-no-claim` refused on all twelve writes and
`nel-m7b-operator-control` accepted on all twelve, over HTTP, never
through a `rolbypassrls` connection.
