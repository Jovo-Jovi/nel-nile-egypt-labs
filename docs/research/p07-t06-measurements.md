# P07-T06 — Stage 2 measurements

Read-only. Counts and statuses only. No email, user id, key or project ref.

The second issue ran `npx supabase db query --linked` for Q1. It exited 1 with `LegacyDbConfigLoginRoleStatusError` and `Missing required permission(s): database_write`. That is a permission refusal, not a count. No further database command was run by the builder. STEP 5 is human-attested from the Supabase Dashboard SQL Editor on 25 September 2026.

## STEP 3 — Production headers

Builder, 25 September 2026, one request per path: `curl.exe -s -o NUL -D - https://nel-nile-egypt-labs.vercel.app<path>`. `/ar/programmes` used the same single request with the body kept, so STEP 4b did not send a second request.

| Path | Status | Six headers |
|---|---|---|
| `/ar` | HTTP/1.1 200 OK | each once, OD-38 values |
| `/en` | HTTP/1.1 200 OK | each once, OD-38 values |
| `/ar/programmes` | HTTP/1.1 200 OK | each once, OD-38 values |
| `/en/offers` | HTTP/1.1 200 OK | each once, OD-38 values |
| `/ar/online-results` | HTTP/1.1 200 OK | each once, OD-38 values |
| `/en/online-results` | HTTP/1.1 200 OK | each once, OD-38 values |
| `/ar/dashboard/sign-in` | HTTP/1.1 200 OK | each once, OD-38 values |
| `/en/partner-lab/sign-in` | HTTP/1.1 200 OK | each once, OD-38 values |

Values on every path:

- `Strict-Transport-Security: max-age=86400`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `X-Frame-Options: DENY`
- `Content-Security-Policy: frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-src https://www.youtube.com https://vercel.live`

No second `Strict-Transport-Security`. **PASS.**

## STEP 4 — Feature flags

Builder, from the second issue. Neither flag was changed.

- `NEL_PARTNER_SIGNUP`: `curl.exe -s -o NUL -w "%{http_code}"` on `/ar/partner-lab/sign-up` returned `200` — on.
- `NEL_LABTEST_CONTENT`: the `/ar/programmes` body from STEP 3's single request contains `data-catalogue-search="on"` — on.

**RECORDED.**

## STEP 5 — Live database reads

Human-attested, Supabase Dashboard SQL Editor, 25 September 2026. SELECT only. The connection counts include the SQL Editor's own session.

### Q1 — orphans

```
select (select count(*) from auth.sessions s where not exists (select 1 from auth.users u where u.id = s.user_id)) as orphan_sessions, (select count(*) from auth.mfa_factors f where not exists (select 1 from auth.users u where u.id = f.user_id)) as orphan_factors, (select count(*) from auth.refresh_tokens r where r.session_id is not null and not exists (select 1 from auth.sessions s where s.id = r.session_id)) as tokens_without_session, (select count(*) from auth.refresh_tokens r where not exists (select 1 from auth.users u where u.id::text = r.user_id)) as tokens_without_user;
```

| orphan_sessions | orphan_factors | tokens_without_session | tokens_without_user |
| --- | --- | --- | --- |
| 0 | 0 | 0 | 0 |

**PASS.** Every count is 0.

### Q2 — accounts and factors

```
select coalesce(raw_app_meta_data->>'nel_principal', 'none') as principal, count(*) from auth.users group by 1 order by 1;
```

| principal | count |
| --- | --- |
| none | 1 |
| Operator | 2 |
| PartnerLab | 3 |

```
select factor_type, status, count(*) from auth.mfa_factors group by 1, 2 order by 1, 2;
```

| factor_type | status | count |
| --- | --- | --- |
| totp | verified | 2 |

**RECORDED.**

### Q3 — connections

```
select coalesce(state, 'null') as state, count(*) from pg_stat_activity group by 1 order by 1;
```

| state | count |
| --- | --- |
| active | 1 |
| idle | 14 |
| null | 7 |

```
select current_setting('max_connections') as max_connections;
```

| max_connections |
| --- |
| 60 |

**RECORDED.** Idle count 14. Maximum connections 60.

### Q4 — live schema against SCOPE.md §8

```
select (select count(*) from pg_tables where schemaname = 'public') as tables, (select count(*) from pg_policies where schemaname = 'public') as public_policies, (select count(*) from pg_policies where schemaname = 'storage' and tablename = 'objects') as storage_policies, (select count(*) from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname = 'public' and p.prokind = 'f') as public_functions, (select count(*) from pg_trigger t join pg_class c on c.oid = t.tgrelid join pg_namespace n on n.oid = c.relnamespace where n.nspname = 'public' and not t.tgisinternal) as public_triggers, (select count(*) from storage.buckets) as buckets, (select count(*) from storage.buckets where public) as public_buckets, (select count(*) from supabase_migrations.schema_migrations) as migrations;
```

| tables | public_policies | storage_policies | public_functions | public_triggers | buckets | public_buckets | migrations |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 13 | 25 | 2 | 3 | 1 | 1 | 0 | 18 |

**PASS.** Matches the figures `SCOPE.md` §8 states: tables 13, public policies 25, storage policies 2, public functions 3, public triggers 1, buckets 1, public buckets 0, migrations 18.

## STEP 6 — Rate limiting

### Code

Builder, re-run on this issue: `git grep -n -i -E "rate.?limit|throttl|x-forwarded-for|x-real-ip" -- src`.

Two hits. Neither implements a limit.

- `src/app/[locale]/partner-lab/sign-up/submit/route.ts:125` — a comment naming a hosted throttle among the Auth outcomes.
- `src/lib/supabaseRest.spec.ts:146` — a spec stub returning 429.

**RECORDED.** The application adds no rate limit.

### Platform

Human-attested, Supabase Dashboard → Authentication → Rate Limits, 25 September 2026. Nothing was changed.

| Limit | Value as pasted |
| --- | --- |
| Sending emails | 30 per hour |
| Sending SMS messages | 150, and 1800 requests per hour |
| Token refreshes | 30 per 5 minutes per IP address, and 360 requests per hour |
| Token verifications | 30 per 5 minutes per IP address |
| Anonymous users | 30 per hour per IP address, and 360 requests per hour |
| Sign-ups and sign-ins | 30 per 5 minutes per IP address |
| Web3 sign-ups and sign-ins | no number followed the label |

**RECORDED.**

### Where the platform sees the address

`supabase.auth.signInWithPassword` is called from `src/app/[locale]/dashboard/sign-in/submit/route.ts` and `src/app/[locale]/partner-lab/sign-in/submit/route.ts`. `supabase.auth.signUp` is called from `src/app/[locale]/partner-lab/sign-up/submit/route.ts`. These are server handlers, so a platform per-address limit sees the server's address, not each visitor's.

**RECORDED.**
