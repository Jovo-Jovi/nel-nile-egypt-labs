# P08-T26 — Rehearse the live-principal policy

**Evidence tooling. Never current truth, never a spec, never cited as
authority.** PR-09 applies: this file justifies the OD-21 §3 rewrite; it
does not replace `SECURITY_MODEL.md`, `DECISIONS.md`, ADR-001 or
BOUNDARY_MODEL.md. This task authors no forward migration, writes no OD
text, and changes nothing under `src/`. Nothing was pushed to the
database outside `BEGIN; … ROLLBACK;`.

**Task:** P08-T26 · P08 live-principal policy rehearsal · 12 September 2026
**Git branch:** `p08-t26` from `origin/main` at `3fb31c0` (merge of pull
request #129, `p06-t01`). Tip of `p06-t01` was `9ca8e58`.
**Reads:** `npx supabase db query --linked --file` only, every statement
inside `BEGIN; … ROLLBACK;` (OD-17 §3.3). `npx supabase db push` was
not run. `smoke:operator` was not run.

---

## RESIDUAL REPAIRS

None. No UNRATIFIED edit.

Observations that are not repairs, and were not applied:

1. **P06-T01 Verdict cell.** The fence said to set it to "the text the
   reviewer supplies at that task's verdict" and did not inline a longer
   string. The cell is `PASS at reviewer verdict — 12 September 2026`,
   the established PASS-prefix form, so the PHASES box can be checked.
   Pull request #129 had no review comment carrying a longer verdict.
2. **Default EXECUTE residue.** After `revoke all … from public` and
   `grant execute … to authenticated`, live `proacl` still named
   `anon` and `service_role`. That is schema default privileges on
   `public` functions, not a PUBLIC grant. The successor migration must
   revoke those two roles by name. Not allocated (fence: do not assign
   a CF id).
3. **EXPLAIN Filter is a union of two policies.**
   `Offer_operator_write` is `FOR ALL` and therefore participates in
   SELECT. The plan's Filter ORs `currentNelPrincipal() = 'PartnerLab'`
   with the Operator JWT predicate. The JWT used in this rehearsal
   carried `sub` and `role` only, so the Operator arm was false. The
   one-row positive control is the live-principal arm alone.

---

## STEP 0 — housekeeping

Working tree was clean before any edit. Branch cut from `origin/main`
at `3fb31c0` (merge of `p06-t01`, PR #129).

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
- `python -X utf8 data/seed/verify_seed.py` — `124 -> 71`, PASS,
  QA-flagged 0

P06-T01 Verdict cell set as in observation 1. PHASES.md `**P06-T01**`
checked; unchecked `**P08-T26**` added under P08 immediately after
`**P08-T25**`. `npm run guard:phases` exit 0 afterwards.

A throwaway `BEGIN; create function public."p08T26ProbeRollback"() …;
ROLLBACK;` was run first. A second transaction selected that name from
`pg_proc` and returned `[]`. A third returned `answer = 42` from
`BEGIN; select 42 as answer; ROLLBACK;`, so SELECT results inside a
rolled-back transaction are visible and an empty `pg_proc` read is not
a swallowed result.

`node scripts/guard/naming.mjs --stdin` over the rehearsal SQL:
PASS. Scanned 1 inline SQL fragment from stdin.

---

## STEP 1 — the M4a shape, and the M9 policy

Quoted from
`supabase/migrations/20260831111505_m4a_programme_lab_tests_function.sql`:

**Signature**

```sql
create function public."programmeLabTests"(
  "programme" uuid,
  tier public."ProgrammeTierAxis",
  audience public."AudienceAxis"
)
returns table (
  id uuid,
  slug text,
  name_ar text,
  name_en text,
  aliases text[],
  qa_flag text,
  "LabUnit" uuid,
  publication_state public."PublicationState",
  display_order integer,
  created_at timestamptz,
  updated_at timestamptz,
  note_ar text,
  note_en text
)
```

**`security definer` line:** `security definer`

**`search_path`:** `set search_path = public, pg_temp`

**Owner:** that file does not set one. Live `pg_proc` in the rehearsal
transaction: `postgres`. `prosecdef` true. `proconfig`
`{"search_path=public, pg_temp"}`.

**`grant execute`:** that file has none. M4b
(`20260831111522_m4b_policies_and_write_grants.sql`) is the grant:

```sql
revoke execute on function public."programmeLabTests"(
  uuid,
  public."ProgrammeTierAxis",
  public."AudienceAxis"
) from public;

grant execute on function public."programmeLabTests"(
  uuid,
  public."ProgrammeTierAxis",
  public."AudienceAxis"
) to anon, authenticated;
```

How it filters, given that a definer function reads past RLS by design.
The function applies `publication_state = 'published'` itself on every
table it touches, excludes `unreviewed` unconditionally, and implements
the Children / cumulation / eligibility rules in SQL rather than
trusting the caller's policies. A definer that omitted those filters
would return unpublished or unreviewed `"LabTest"` rows to `anon`; the
live-principal function must likewise constrain itself to `auth.uid()`
and a single metadata key, or it would expose other columns of
`auth.users` past RLS.

Quoted in full from
`supabase/migrations/20260908143000_m9_offer_partner_read.sql`:

```sql
create policy "Offer_partner_read"
  on public."Offer"
  for select
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'nel_principal') = 'PartnerLab');
```

---

## Function name and grants

**Name:** `public."currentNelPrincipal"()`.

`scripts/guard/naming.mjs` scans unquoted entity and type names from
DATA_MODEL.md §2/§4/§6 (`Programme`, `Offer`, `LabTest`, …). The
vocabulary rule forbids the bare nouns `test`, `result`, `patient`,
`branch`, `unit`, `programme`, `package`, `profile`, `panel`,
`checkup`, `device`, `offer`, `service`, `user`, `admin`, `content`,
`item`. `currentNelPrincipal` contains none of those as a token. Quoted
camelCase matches `programmeLabTests`. It names the existing
`nel_principal` claim, which is the only value this function returns.

**Execute grant.** `authenticated` only, because
`Offer_partner_read` is `for select to authenticated`. `anon` is not a
subject of that policy (M10 dropped `Offer_published_read`).
`service_role` bypasses RLS and is not the policy role. `PUBLIC` must
be revoked because `CREATE FUNCTION` grants `EXECUTE` to `PUBLIC` by
default (the M4b pattern). Measured `proacl` after that revoke-and-grant
was still
`{postgres=X/postgres,anon=X/postgres,authenticated=X/postgres,service_role=X/postgres}`:
schema default privileges grant `anon` and `service_role` independently
of `PUBLIC`. A forward migration must name those two revokes. The
function still returns only the caller's principal string; `anon` with
a null `auth.uid()` gets null.

---

## STEP 2 — one transaction, rolled back

Command: `npx supabase db query --linked --file` against the linked
project. Probe first (see STEP 0), then the rehearsal file, then the
rollback-proof file. The laboratory Offer hashed `7cc7436e57b8` was
not published, unpublished, updated or deleted.

### Full SQL (rehearsal)

```sql
begin;

create temporary table rehearsal_log (
  ord integer not null,
  step text not null,
  detail text
);

insert into rehearsal_log (ord, step, detail)
select 0, 'm4a_owner', pg_get_userbyid(p.proowner)
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.proname = 'programmeLabTests';

insert into rehearsal_log (ord, step, detail)
select 0, 'm4a_definer', p.prosecdef::text
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.proname = 'programmeLabTests';

insert into rehearsal_log (ord, step, detail)
select 0, 'm4a_config', coalesce(p.proconfig::text, 'null')
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.proname = 'programmeLabTests';

insert into rehearsal_log (ord, step, detail)
select 0, 'login_role', current_user;

insert into rehearsal_log (ord, step, detail)
select 0, 'login_bypassrls', r.rolbypassrls::text
from pg_roles r
where r.rolname = current_user;

insert into rehearsal_log (ord, step, detail)
select 0, 'offer_policy_before', coalesce(pol.qual, 'missing')
from (select 1) as _
left join pg_policies pol
  on pol.schemaname = 'public'
 and pol.tablename = 'Offer'
 and pol.policyname = 'Offer_partner_read';

-- 2a. Live principal. Reads auth.users for auth.uid() only.
-- Returns that row's raw_app_meta_data->>'nel_principal' and no other column.
create function public."currentNelPrincipal"()
returns text
language sql
stable
security definer
set search_path = public, pg_temp
as $sel$
  select raw_app_meta_data ->> 'nel_principal'
  from auth.users
  where id = auth.uid();
$sel$;

revoke all on function public."currentNelPrincipal"() from public;
grant execute on function public."currentNelPrincipal"() to authenticated;

insert into rehearsal_log (ord, step, detail)
select 1, 'fn_owner', pg_get_userbyid(p.proowner)
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.proname = 'currentNelPrincipal';

insert into rehearsal_log (ord, step, detail)
select 1, 'fn_definer', p.prosecdef::text
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.proname = 'currentNelPrincipal';

insert into rehearsal_log (ord, step, detail)
select 1, 'fn_config', coalesce(p.proconfig::text, 'null')
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.proname = 'currentNelPrincipal';

insert into rehearsal_log (ord, step, detail)
select 1, 'fn_acl', coalesce(p.proacl::text, 'null')
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.proname = 'currentNelPrincipal';

-- 2b. Same policy name, same command, same role; live principal instead of jwt().
drop policy "Offer_partner_read" on public."Offer";

create policy "Offer_partner_read"
  on public."Offer"
  for select
  to authenticated
  using (public."currentNelPrincipal"() = 'PartnerLab');

insert into rehearsal_log (ord, step, detail)
select 2, 'offer_policy_rehearsal', coalesce(pol.qual, 'missing')
from (select 1) as _
left join pg_policies pol
  on pol.schemaname = 'public'
 and pol.tablename = 'Offer'
 and pol.policyname = 'Offer_partner_read';

create temporary table subject as
select id
from auth.users
where coalesce(raw_app_meta_data ->> 'nel_principal', '') = 'PartnerLab'
limit 1;

insert into rehearsal_log (ord, step, detail)
select 3, 'subject_count', count(*)::text
from subject;

insert into rehearsal_log (ord, step, detail)
select 3, 'offer_rows_as_login', count(*)::text
from public."Offer";

-- 2c. Positive control, explain, negative proof, anon. One session.
do $positive$
declare
  claims text;
  n integer;
  uid_resolved uuid;
  principal text;
  cur_user text;
  bypass text;
  plan text := '';
  r text;
begin
  select json_build_object('sub', id::text, 'role', 'authenticated')::text
  into claims
  from subject;

  if claims is null then
    insert into rehearsal_log values (10, 'positive_count', 'VOID no PartnerLab subject');
    return;
  end if;

  perform set_config('request.jwt.claims', claims, true);
  perform set_config('request.jwt.claim.sub', (claims::jsonb ->> 'sub'), true);
  perform set_config('request.jwt.claim.role', 'authenticated', true);

  begin
    set local role authenticated;
  exception when others then
    insert into rehearsal_log values (5, 'set_role_authenticated', sqlerrm);
    insert into rehearsal_log values (6, 'auth_uid_resolved', case when auth.uid() is null then 'null' else 'set' end);
    insert into rehearsal_log values (10, 'positive_count', 'VOID set_role failed');
    return;
  end;

  cur_user := current_user;
  select rolbypassrls::text into bypass from pg_roles where rolname = current_user;
  uid_resolved := auth.uid();

  begin
    select public."currentNelPrincipal"() into principal;
  exception when others then
    reset role;
    insert into rehearsal_log values (5, 'current_user_authenticated', cur_user);
    insert into rehearsal_log values (5, 'role_bypassrls', coalesce(bypass, 'null'));
    insert into rehearsal_log values (6, 'auth_uid_resolved', case when uid_resolved is null then 'null' else 'set' end);
    insert into rehearsal_log values (7, 'function_call', sqlerrm);
    insert into rehearsal_log values (10, 'positive_count', 'VOID function call failed');
    return;
  end;

  select count(*) into n from public."Offer";

  begin
    for r in execute 'explain (analyze, buffers, format text) select id from public."Offer"'
    loop
      plan := plan || r || E'\n';
    end loop;
  exception when others then
    plan := sqlerrm;
  end;

  reset role;

  insert into rehearsal_log values (5, 'set_role_authenticated', 'ok');
  insert into rehearsal_log values (5, 'current_user_authenticated', cur_user);
  insert into rehearsal_log values (5, 'role_bypassrls', coalesce(bypass, 'null'));
  insert into rehearsal_log values (6, 'auth_uid_resolved', case when uid_resolved is null then 'null' else 'set' end);
  insert into rehearsal_log values (7, 'function_principal', coalesce(principal, 'null'));
  insert into rehearsal_log values (10, 'positive_count', n::text);
  insert into rehearsal_log values (15, 'explain', plan);
end;
$positive$;

update auth.users as u
set raw_app_meta_data = coalesce(u.raw_app_meta_data, '{}'::jsonb) - 'nel_principal'
from subject as s
where u.id = s.id;

insert into rehearsal_log (ord, step, detail)
select 16, 'cleared_principal_rows', count(*)::text
from auth.users as u
join subject as s on s.id = u.id
where not (coalesce(u.raw_app_meta_data, '{}'::jsonb) ? 'nel_principal');

do $negative$
declare
  claims text;
  n integer;
  principal text;
  cur_user text;
begin
  select json_build_object('sub', id::text, 'role', 'authenticated')::text
  into claims
  from subject;

  if claims is null then
    insert into rehearsal_log values (20, 'negative_count', 'VOID no PartnerLab subject');
    return;
  end if;

  perform set_config('request.jwt.claims', claims, true);
  perform set_config('request.jwt.claim.sub', (claims::jsonb ->> 'sub'), true);
  perform set_config('request.jwt.claim.role', 'authenticated', true);

  begin
    set local role authenticated;
  exception when others then
    insert into rehearsal_log values (20, 'negative_set_role', sqlerrm);
    insert into rehearsal_log values (21, 'negative_count', 'VOID set_role failed');
    return;
  end;

  cur_user := current_user;

  begin
    select public."currentNelPrincipal"() into principal;
    select count(*) into n from public."Offer";
  exception when others then
    reset role;
    insert into rehearsal_log values (20, 'negative_current_user', cur_user);
    insert into rehearsal_log values (20, 'negative_error', sqlerrm);
    insert into rehearsal_log values (21, 'negative_count', 'VOID select failed');
    return;
  end;

  reset role;

  insert into rehearsal_log values (20, 'negative_current_user', cur_user);
  insert into rehearsal_log values (20, 'negative_principal', coalesce(principal, 'null'));
  insert into rehearsal_log values (21, 'negative_count', n::text);
end;
$negative$;

do $anon$
declare
  n integer;
  cur_user text;
begin
  begin
    set local role anon;
  exception when others then
    insert into rehearsal_log values (30, 'anon_set_role', sqlerrm);
    insert into rehearsal_log values (31, 'anon_count', 'VOID set_role failed');
    return;
  end;

  cur_user := current_user;
  select count(*) into n from public."Offer";
  reset role;

  insert into rehearsal_log values (30, 'anon_set_role', 'ok');
  insert into rehearsal_log values (30, 'anon_current_user', cur_user);
  insert into rehearsal_log values (31, 'anon_count', n::text);
end;
$anon$;

select ord, step, detail
from rehearsal_log
order by ord, step;

rollback;
```

The JWT GUC was `{sub, role}` only. No `app_metadata`, no email, no
token payload is logged. Account ids are not in the log:
`auth_uid_resolved` is `set` or `null`.

### Measured output

| ord | step | detail |
|---|---|---|
| 0 | login_bypassrls | `true` |
| 0 | login_role | `postgres` |
| 0 | m4a_config | `{"search_path=public, pg_temp"}` |
| 0 | m4a_definer | `true` |
| 0 | m4a_owner | `postgres` |
| 0 | offer_policy_before | `(((auth.jwt() -> 'app_metadata'::text) ->> 'nel_principal'::text) = 'PartnerLab'::text)` |
| 1 | fn_acl | `{postgres=X/postgres,anon=X/postgres,authenticated=X/postgres,service_role=X/postgres}` |
| 1 | fn_config | `{"search_path=public, pg_temp"}` |
| 1 | fn_definer | `true` |
| 1 | fn_owner | `postgres` |
| 2 | offer_policy_rehearsal | `("currentNelPrincipal"() = 'PartnerLab'::text)` |
| 3 | offer_rows_as_login | `1` |
| 3 | subject_count | `1` |
| 5 | current_user_authenticated | `authenticated` |
| 5 | role_bypassrls | `false` |
| 5 | set_role_authenticated | `ok` |
| 6 | auth_uid_resolved | `set` |
| 7 | function_principal | `PartnerLab` |
| 10 | positive_count | `1` |
| 15 | explain | see below |
| 16 | cleared_principal_rows | `1` |
| 20 | negative_current_user | `authenticated` |
| 20 | negative_principal | `null` |
| 21 | negative_count | `0` |
| 30 | anon_current_user | `anon` |
| 30 | anon_set_role | `ok` |
| 31 | anon_count | `0` |

Positive control returned 1 row. The negative proof is evidence, not
VOID.

`explain (analyze, buffers, format text) select id from public."Offer"`
as `authenticated`, before the claim was cleared:

```
Seq Scan on "Offer"  (cost=0.00..1.29 rows=1 width=16) (actual time=0.173..0.173 rows=1 loops=1)
  Filter: (("currentNelPrincipal"() = 'PartnerLab'::text) OR ((((COALESCE(NULLIF(current_setting('request.jwt.claim'::text, true), ''::text), NULLIF(current_setting('request.jwt.claims'::text, true), ''::text)))::jsonb -> 'app_metadata'::text) ->> 'nel_principal'::text) = 'Operator'::text))
  Buffers: shared hit=6
Planning Time: 0.059 ms
Execution Time: 0.190 ms
```

The function is in `Filter`, not `InitPlan`. One row, one loop, actual
time 0.173 ms. That 0.173 ms is the per-row cost of the Filter, which
is the live-principal call plus the existing Operator-write SELECT arm
(false on this JWT). Shared buffers hit=6 is the `auth.users` lookup.

### 2d — rollback proof

Command: `npx supabase db query --linked --file` of:

```sql
begin;

select
  'policy' as kind,
  pol.policyname as name,
  pol.roles::text as roles,
  pol.cmd as cmd,
  pol.qual as detail
from pg_policies as pol
where pol.schemaname = 'public'
  and pol.tablename = 'Offer'
  and pol.policyname = 'Offer_partner_read'

union all

select
  'proc' as kind,
  p.proname as name,
  n.nspname as roles,
  null as cmd,
  pg_get_userbyid(p.proowner) as detail
from pg_proc as p
join pg_namespace as n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.proname = 'currentNelPrincipal';

rollback;
```

Returned one row:

| kind | name | roles | cmd | detail |
|---|---|---|---|---|
| policy | Offer_partner_read | `{authenticated}` | SELECT | `(((auth.jwt() -> 'app_metadata'::text) ->> 'nel_principal'::text) = 'PartnerLab'::text)` |

No `proc` row. The policy is the original M9 text. The function does
not exist. The rehearsal did not commit.

---

## STEP 3 — four questions

1. **Can the policy role execute a definer function that reads
   `auth.users` on this hosted project?** **Yes.**
   Statement: `function_principal` = `PartnerLab` under
   `current_user` = `authenticated` and `role_bypassrls` = `false`.
   No `SQLERRM`. `set_role_authenticated` = `ok`. The function is
   `security definer`, owner `postgres`, and selected
   `raw_app_meta_data ->> 'nel_principal'` for `auth.uid()`.

2. **Does `auth.uid()` resolve inside the policy's execution context?**
   **Yes.**
   Statement: `auth_uid_resolved` = `set` after `set local role
   authenticated` and `set_config` of `request.jwt.claims` /
   `request.jwt.claim.sub`. The JWT GUC carried `sub` and `role` only,
   no `app_metadata`, so the original M9 `auth.jwt()` predicate would
   have been false. The same session then read 1 `"Offer"` row through
   `currentNelPrincipal() = 'PartnerLab'`.

3. **What does the function cost per row, from `explain analyze`?**
   **0.173 ms actual time for 1 row (loops=1); query Execution Time
   0.190 ms; Planning Time 0.059 ms.**
   Statement: the Seq Scan Filter quoted above. The function is not an
   InitPlan. Cost `0.00..1.29`. Shared buffers hit=6.

4. **Does anything about this create a column in `public` identifying
   an account holder?** **No.** Walk of BOUNDARY_MODEL.md §4 against
   this design:

   | §4 item | Verdict | Against this design |
   |---|---|---|
   | 1. Schema diff shows no column capable of holding personal or medical data | **PASS** | No `ALTER TABLE`, no new table, no new column. The function returns `text` of an existing claim value (`PartnerLab` / `Operator` / null), not an email, name, or medical value. |
   | 2. No route handler or server action accepts such a field | **N/A** | No `src/` change. |
   | 3. No storage bucket is writable by an unauthenticated actor | **N/A** | No Storage change. |
   | 4. No log line records request bodies from public routes | **N/A** | No route change. The function does not log. |
   | 5. Vocabulary scan: zero `patient` or `result` as identifiers, excepting `ResultsPortalLink` | **PASS** | Identifier is `"currentNelPrincipal"`. `auth.users` is the platform schema, not a project identifier. |
   | 6. Outbound links to the results portal use `https://` and carry no parameters | **N/A** | No link change. |
   | 7. Third-party surface scan | **N/A** | No public-route change. |
   | 8. Framing scan | **N/A** | No iframe / embed / frame-src change. |

   BOUNDARY_MODEL.md §2 item 10 ("No table in `public` gains a column
   identifying an account holder"): **PASS**. This is the thing OD-21
   §3 got wrong; this rehearsal does not repeat it. Item 9 (signup
   handler fields) and item 11 (privacy text) are not touched.

No §4 item is FAIL. No HALT on questions 1 or 2.

---

## Carry-forwards the rehearsal surfaces

CF live maximum computed before any allocate (python `re.findall` over
`^\| CF-(\d+) \|` table rows in `docs/method/CARRY_FORWARDS.md`):
**173**. Next free would be CF-174. Open count by
`grep -cE '^\| CF-[0-9]+ .*\| OPEN \|'`: **97**.

**No CF landed.** Fence: do not assign a CF id. Described, not written
to the ledger:

- Schema default privileges on `public` functions grant `EXECUTE` to
  `anon` and `service_role` even after `revoke all from public`. A
  forward migration that only revokes `PUBLIC` and grants
  `authenticated` leaves those two roles able to call
  `"currentNelPrincipal"()`. For `anon`, `auth.uid()` is null and the
  function returns null, so it is not a leak of another account's
  principal. It is still more than "the roles the policy needs".
  Owner would be builder. Lands at the task that authors the forward
  migration. Live maximum before allocate: 173.

Open arithmetic: base 97 + 0 − 0 = **97**. CF-169, CF-170, CF-171 and
CF-173 stay OPEN by design.

---

## Standing counts (this task)

| Check | Command | Result |
|---|---|---|
| Open CF | python `re.findall` `^\| CF-\d+ \|.*\| OPEN \|` | 97 |
| CF live maximum | python max over CF-nn table rows | 173 |
| `### OD-` | `grep -c "^### OD-"` | 21 |
| `### D-` | `grep -c "^### D-"` | 49 |
| Status DRAFT | `grep` Status and DRAFT on one line | 1 (OD-09) |
| OD-21 §3 | read | still marked SUSPENDED |
| `git ls-files supabase/migrations/` | python len of `git ls-files` | 28 |
| Catalogue | `python -X utf8 scripts/audit/p06-standing-counts.py` | ar 590 · en 590 · identical · 0 duplicates |
| Worklist | `git show HEAD:docs/research/clinical-worklist.md` then sha256 of those bytes | `22b2c73b697460b2def3a86e4b6489c987874a071c4d9c0f792a46612197569f` |
| Sign-off | `git show HEAD:docs/research/clinical-signoff.md` then sha256 of those bytes | `aa0469eedad99a4f55acd469912689df511311343ec8f31bb75cabf8c577aef7` |
| Addendum | `git show HEAD:docs/research/clinical-signoff-addendum.md` then sha256 of those bytes | `2b63422efa63f256aef7fcac6f3a3ec3178148a60a3a85199810c75468b5340d` |
| `git ls-files docs/research/` before this file | python len of `git ls-files` | 33 |
| `git ls-files docs/research/` after this file | python len of `git ls-files` plus this file | 34 |

`git diff --stat 3fb31c0 HEAD -- src/ supabase/ data/seed/` is empty
by construction: this task does not touch those trees.

Redacted in this file: email addresses, keys and tokens, JWT payloads,
connection strings, the Supabase project ref, hotline and WhatsApp
numbers, Branch addresses, account ids. SQL, policy text,
`explain analyze` output and role names are reported in full.
