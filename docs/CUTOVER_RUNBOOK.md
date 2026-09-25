# NEL — Cutover Runbook

**Status:** AUTHORED at P07-T08 · authored 25 September 2026 · Stage 3 of OD-35
**Executes:** Stages 4 and 5 of OD-35, and G7. **Nothing in this runbook is executed until
the human supplies every placeholder below and authorises the step.**
**Governed by:** OD-35 (the handover programme), OD-37 (development is complete), OD-38
(security headers), the G7 triage (`docs/method/G7_TRIAGE.md`) and `docs/HANDOVER.md`.

---

## §0 How to use this runbook

- Steps run in order. A step's **Verify** line must hold before the next step starts. A
  failed Verify stops the cutover and opens §7.
- Every step names its **owner**: the **human** (the project owner who authorises and
  supplies inputs), the **lab owner** (the laboratory's account owner, receiving the
  accounts), the **builder** (a repository task under the reviewer), or the **reviewer**.
- No step changes a feature, a workflow, the access model or the appearance (OD-37). The
  only repository changes this runbook calls for are the 2018 redirects (§5.5) and the HSTS
  raise (§5.6), each landed and verified as its own task.
- Live database reads follow PR-40: the SELECT text is given, the account owner runs it in
  the Supabase SQL Editor, and the counts are recorded.
- Secrets never enter this file, a commit, a report or a chat. Names only.

### Placeholders

| Placeholder | Meaning | Supplied by |
|---|---|---|
| `<PRODUCTION_DOMAIN>` | The domain the site will serve from | human |
| `<DNS_PROVIDER>` | Where that domain's DNS records are managed | human |
| `<OLD_SITE_HOST>` | Where the 2018 site is hosted | human |
| `<VERCEL_TARGET_ACCOUNT>` | The laboratory's Vercel team that receives the project | human |
| `<SUPABASE_TARGET_ORGANIZATION>` | The laboratory's Supabase organisation that receives the project | human |
| `<GITHUB_TARGET_ORGANIZATION>` | The laboratory's GitHub organisation that receives the repository | human |
| `<CUTOVER_WINDOW>` | Date and time range of the DNS change | human |
| `<LAB_ACCOUNT_OWNER>` | The laboratory's person who owns every account after transfer | human |
| `<BREAK_GLASS_HOLDER>` | Who holds Supabase project access for Operator recovery after transfer (`ADMIN_SPEC.md` §3d) | human |
| `<BACKUP_LOCATION>` | Where the laboratory keeps the pre-cutover backups | human |
| `<ROLLBACK_WINDOW>` | How long after the DNS change a rollback stays possible; at least 24 hours (§5.6) | human |
| `<MAINTENANCE_CONTACT>` | Who the laboratory calls after handover | human |

---

## §1 Pre-cutover

### §1.1 G7 prerequisites — owner: human, reviewer

- The finished site is approved by the laboratory (recorded 25 September 2026).
- Every carry-forward is dispositioned (G7 triage, signed 25 September 2026). The twelve
  still open close at the steps named in §8.
- The laboratory's written approval of the mark (CF-49) and its countersignature of OD-16
  (CF-126) are in hand.
- Quotation Revision 1 is approved or explicitly set aside by the human.
- **Verify:** `grep -cE '^\| CF-[0-9]+ .*\| OPEN \|' docs/method/CARRY_FORWARDS.md` prints
  12, and the open ids are the twelve §8 names.

### §1.2 Ownership and payment — owner: human

- The payment milestone the commercial terms attach to launch is settled before any
  account leaves the developer's control (D-12). This runbook states no amount.
- `<LAB_ACCOUNT_OWNER>` has created, or has access to, `<GITHUB_TARGET_ORGANIZATION>`,
  `<VERCEL_TARGET_ACCOUNT>` and `<SUPABASE_TARGET_ORGANIZATION>`, each with a payment
  method in the laboratory's name.
- **Verify:** the human confirms both in writing.

### §1.3 Backups — owner: lab owner, with the builder's help

1. **Database.** Download the latest backup from Supabase Dashboard → Database → Backups,
   and take a logical dump with `pg_dump` over the project's direct connection string.
   Store both at `<BACKUP_LOCATION>`.
2. **Images.** Supabase database backups do not contain storage objects. Download every
   object in the `media-asset` bucket (Dashboard → Storage) to `<BACKUP_LOCATION>`.
3. **Repository.** `git clone --mirror` of the repository to `<BACKUP_LOCATION>`.
4. **Verify:** the dump restores the thirteen tables into a scratch Postgres (row counts
   recorded), the image count equals the `"MediaAsset"` row count, and the mirror's `main`
   equals `origin/main`.

### §1.4 Environment-variable inventory — owner: builder (names only)

| Name | Environments | Holds | Secret |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Production, Preview | The Supabase project URL | no |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Production, Preview | The publishable key; one of the two is set | no |
| `SUPABASE_SERVICE_ROLE_KEY` | **Production only** | The service-role key for Auth Admin calls (ADR-001, OD-30 §8) | **yes** |
| `RESULTS_PORTAL_VISITOR_URL` | Production, Preview | The results portal's Visitor address (OD-23) | no |
| `RESULTS_PORTAL_LAB_TO_LAB_URL` | Production, Preview | The results portal's lab-to-lab address (OD-23) | no |
| `NEL_LABTEST_CONTENT` | Production, Preview | `on` publishes analysis names and search (PR-08) | no |
| `NEL_PARTNER_SIGNUP` | Production, Preview | `on` opens PartnerLab self-signup (OD-15) | no |

`SUPABASE_URL` and `SUPABASE_ANON_KEY` are accepted fallbacks and need not be set.
`NEL_VERCEL_SHARE` is read only by the smoke script and is never a Vercel variable.
**Verify:** Vercel → Project → Settings → Environment Variables lists exactly these names
per environment. Values are not copied anywhere.

### §1.5 Access inventory — owner: human

Record, for GitHub, Vercel, Supabase, `<DNS_PROVIDER>`, the domain registrar and any mail
provider on `<PRODUCTION_DOMAIN>`: every person or token with access today and its role.
The target of each is `docs/HANDOVER.md` §13.

### §1.6 Current production verification — owner: builder

Run §6 against the current production address and record the results. Everything that
passes today must pass after cutover.

### §1.7 DNS inventory — owner: human

1. Export every record of `<PRODUCTION_DOMAIN>` at `<DNS_PROVIDER>`: A, AAAA, CNAME, MX,
   TXT (SPF, DKIM, DMARC and verification records), CAA and every subdomain. Keep the export
   at `<BACKUP_LOCATION>`; it is the DNS rollback (§7.2).
2. Note whether the results portal sits on a subdomain of `<PRODUCTION_DOMAIN>`. If it does,
   its record is not touched.
3. Record who controls `nileegyptlabs.org` and its mail (CF-07). Its records are not
   touched by this cutover unless it is `<PRODUCTION_DOMAIN>`.
4. At least 48 hours before `<CUTOVER_WINDOW>`, lower the TTL of the records §5.2 will change
   to 300 seconds.
- **Verify:** the export is saved, and the lowered TTLs are served by public resolvers.

### §1.8 Old-site inventory — owner: human, builder

1. List every path the 2018 site on `<OLD_SITE_HOST>` serves, including `/features.html`, by
   crawling it and reading the host's file list.
2. Build the redirect map: each 2018 path to its nearest current page, Arabic by default
   (for example `/features.html` → `/ar/programmes`). A path with no counterpart maps to
   `/ar`.
3. The 2018 site's stored form submissions, if any, are the laboratory's data and the
   laboratory's decision; this project neither reads nor migrates them.

### §1.9 Rollback criteria — owner: human

Agreed before the window. Any one triggers §7:
- the site does not serve `/ar` and `/en` over HTTPS within 60 minutes of the DNS change;
- Operator sign-in or TOTP fails for both Operators;
- an unpublished row or an Offer is readable anonymously;
- mail to `<PRODUCTION_DOMAIN>` stops being delivered;
- any security header of OD-38 is missing.

---

## §2 Account transfer (Stage 4)

### §2.1 GitHub — owner: human, then lab owner

1. Transfer the repository to `<GITHUB_TARGET_ORGANIZATION>` (Settings → Transfer). It is
   transferred, never recreated, so history, issues and pull requests move with it.
2. **Only on the human's explicit authorisation at this final step**, make it private
   (OD-04, OD-35 §4). This closes CF-28 and CF-213.
3. Apply the access matrix of `docs/HANDOVER.md` §13: the laboratory owns the organisation;
   the maintainer has write access to this repository only; the reviewer has read access.
4. Protect `main`: pull requests required, CI required.
5. **Verify:** the repository URL resolves under the new organisation, anonymous access is
   refused once private, and a CI run on a no-op pull request passes.

### §2.2 Supabase — owner: human, then lab owner

1. Transfer the project to `<SUPABASE_TARGET_ORGANIZATION>`. The region stays
   `eu-central-2`.
2. Move the organisation to a paid plan: the Free plan pauses inactive projects.
3. Apply the access matrix. Revoke the builder environment's Supabase MCP connection and
   every developer personal access token (CF-203) — at this step, not before.
4. Name `<BREAK_GLASS_HOLDER>`; the holder transfers from the developer to the laboratory
   (`ADMIN_SPEC.md` §3d).
5. **Verify:** Q4 below returns 13 tables, 25 public policies, 2 storage policies,
   3 functions, 1 trigger, 1 bucket (0 public) and 18 migrations.

Q4, run in the SQL Editor:
```sql
select (select count(*) from pg_tables where schemaname = 'public') as tables, (select count(*) from pg_policies where schemaname = 'public') as public_policies, (select count(*) from pg_policies where schemaname = 'storage' and tablename = 'objects') as storage_policies, (select count(*) from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname = 'public' and p.prokind = 'f') as public_functions, (select count(*) from pg_trigger t join pg_class c on c.oid = t.tgrelid join pg_namespace n on n.oid = c.relnamespace where n.nspname = 'public' and not t.tgisinternal) as public_triggers, (select count(*) from storage.buckets) as buckets, (select count(*) from storage.buckets where public) as public_buckets, (select count(*) from supabase_migrations.schema_migrations) as migrations;
```

### §2.3 Vercel — owner: human, then lab owner

1. Transfer the project to `<VERCEL_TARGET_ACCOUNT>` on a paid plan: the Hobby plan is for
   non-commercial use.
2. Reconnect the Git integration to the transferred repository; the production branch is
   `main`.
3. Confirm the §1.4 variables exist in the new account, per environment.
4. Keep deployment protection on Preview deployments.
5. **Verify:** a redeploy of `main` succeeds and §6.1 passes on the production address.

### §2.4 Billing — owner: lab owner

Each of GitHub, Vercel and Supabase bills the laboratory. **Verify:** the lab owner confirms.

---

## §3 Secret rotation — owner: lab owner, with the builder

Rotate everything the developer has seen:
1. Supabase: issue new API keys (publishable and secret or service-role), and reset the
   database password.
2. Vercel: replace `SUPABASE_SERVICE_ROLE_KEY` and the publishable key with the new values,
   Production and Preview as §1.4 lists, then redeploy.
3. Revoke the old keys in Supabase, and every personal access token and deployment token
   the developer created.
4. **Verify:** a request with an old key is refused; §6 passes with the new ones.

---

## §4 Supabase Auth — owner: lab owner

1. **Site URL:** `https://<PRODUCTION_DOMAIN>`. **Redirect URLs:**
   `https://<PRODUCTION_DOMAIN>/**`. Remove any development entries.
2. **Password policy:** minimum twelve characters, as the application's signup assumes; it
   is never lowered (CF-166).
3. **MFA:** TOTP enabled. Both Operator accounts belong to laboratory staff and each has
   one verified factor. Remove any developer or test Operator.
4. **Signup:** consistent with `NEL_PARTNER_SIGNUP`.
5. **The pending PartnerLab account** is left exactly as it is; the Operator decides it.
6. **Lost authenticator:** the Operator tells `<BREAK_GLASS_HOLDER>`, who removes that
   account's factor in Dashboard → Authentication → Users. The Operator enrols again at the
   next sign-in. Every use is recorded with date, account and reason. The other Operator
   cannot do it.
7. **Verify:** Q2 in the SQL Editor shows 2 `Operator` accounts and 2 verified TOTP
   factors.

```sql
select coalesce(raw_app_meta_data->>'nel_principal', 'none') as principal, count(*) from auth.users group by 1 order by 1;
select factor_type, status, count(*) from auth.mfa_factors group by 1, 2 order by 1, 2;
```

---

## §5 DNS and domain (Stage 5) — inside `<CUTOVER_WINDOW>`

### §5.1 Add the domain — owner: lab owner
Add `<PRODUCTION_DOMAIN>` and its `www` host to the Vercel project. Vercel displays the
records it needs; use those, not remembered values.

### §5.2 Change the web records only — owner: lab owner
At `<DNS_PROVIDER>`, change only the apex and `www` records Vercel names. **MX, SPF, DKIM,
DMARC, verification TXT, CAA and every other subdomain stay as exported in §1.7.**

### §5.3 TLS — owner: builder
Vercel issues the certificate. **Verify:** `https://<PRODUCTION_DOMAIN>/ar` serves a valid
certificate for the domain.

### §5.4 Canonical host — owner: lab owner
Choose apex or `www` as canonical in Vercel; the other redirects to it. HTTP redirects to
HTTPS automatically.

### §5.5 The 2018 redirects — owner: builder, as a Stage 5 task
Land the §1.8 map as permanent redirects in `next.config.ts` `redirects()`, one entry per
2018 path. Nothing else in the file changes. **Verify:** each 2018 path returns 308 or 301
to its mapped page, and no current page is redirected.

### §5.6 HSTS — owner: builder, after `<ROLLBACK_WINDOW>`
`Strict-Transport-Security` stays at `max-age=86400` while a rollback to the 2018 site,
which has no HTTPS, is possible (OD-38 §2). When `<ROLLBACK_WINDOW>` closes without a
rollback, raise it to `max-age=31536000` with no `includeSubDomains` and no `preload`, as a
one-line task. **Verify:** the new header value is served on §6.1's paths.

### §5.7 Propagation — owner: builder
Query the apex and `www` from at least three public resolvers until each returns the
Vercel records. Mail records must still return their §1.7 values.

---

## §6 Post-cutover verification — owner: builder, then the laboratory

### §6.1 Public site
- `/`, `/ar` and `/en` return 200 over HTTPS; `/` redirects to `/ar`.
- The thirteen static pages and the nine programme pages return 200 in both languages:
  44 URLs (`docs/SCOPE.md` §3).
- Each response carries the six OD-38 headers with their values.
- `/ar/programmes` contains `data-catalogue-search="on"`, and search returns programmes for
  an analysis name in Arabic and in English.
- Images load from `/media-asset/…`; the hero, departments, equipment, videos and news
  render.
- Branches show addresses, hours and WhatsApp numbers, and the map shows its pins.
- The hotline renders as a call link; WhatsApp links open WhatsApp with the laboratory's
  number.
- `/ar/online-results` links to the results portal's host, in a new window, not framed.
- No page returns a broken link; no current page redirects unexpectedly.

### §6.2 Operator and PartnerLab
- Each Operator signs in with password and TOTP, reaches the dashboard home and opens each
  module. Nothing is published or changed for the test.
- An approved PartnerLab signs in and sees the current offers; signed out, `/ar/offers`
  shows the invitation to sign in and no offer.

### §6.3 Database and RLS
- Q4 of §2.2 returns the stated counts.
- An anonymous REST read of Offers returns no rows: a GET of
  `<project URL>/rest/v1/Offer?select=id` with only the publishable key as `apikey` prints
  `[]`. The project URL is the value of `NEXT_PUBLIC_SUPABASE_URL`; the key is typed at the
  prompt and never saved.

### §6.4 Operations
- Vercel and Supabase logs show no new error class for 24 hours.
- Mail sent to an address at `<PRODUCTION_DOMAIN>` arrives.

---

## §7 Rollback

### §7.1 Triggers
Any §1.9 criterion, or a §6 check that cannot be fixed inside `<CUTOVER_WINDOW>`.

### §7.2 DNS rollback — owner: lab owner
Restore the §1.7 export for the apex and `www` records only. With TTLs at 300 seconds, most
Visitors return to the 2018 site within minutes. A returning Visitor's browser keeps HSTS
for up to 24 hours (§5.6) and cannot open the HTTP-only 2018 site during that time.

### §7.3 Deployment rollback — owner: builder
Vercel → Deployments → promote the previous production deployment. Nothing in the database
changes.

### §7.4 Accounts and credentials — owner: human, lab owner
The source accounts are not deleted until §8 completes. A failed transfer is retried from
them. Rotated keys that break production are re-issued, never restored from the old values.

### §7.5 Data — owner: lab owner
Restore from the §1.3 database backup, then re-upload the images. The Operators re-enter any
change made after the backup.

| Step | Owner |
|---|---|
| Decide to roll back | human |
| DNS | lab owner |
| Deployment | builder |
| Accounts and keys | human, lab owner |
| Data | lab owner |

---

## §8 Handover completion

| Item | Confirms | Closes |
|---|---|---|
| The laboratory owns GitHub, Vercel, Supabase and the domain | lab owner | CF-37 |
| Repository private, on the human's authorisation | human | CF-28, CF-213 |
| MCP connection and developer tokens revoked | lab owner | CF-203 |
| Access matches `docs/HANDOVER.md` §13 | reviewer | — |
| Backups exist at `<BACKUP_LOCATION>` | lab owner | — |
| DNS inventory preserved; `nileegyptlabs.org` settled | lab owner | CF-07 |
| Portal certificate current; portal links render | lab owner, builder | CF-117, CF-118, CF-119 |
| Password policy and PDPL duties handed over | lab owner | CF-166, CF-105 |
| Documentation delivered: the repository and the `nel-private` handover folder | human | — |
| Operators trained with `docs/ADMIN_GUIDE.md` | lab owner | — |
| Maintenance agreement signed or declined | human, lab owner | — |
| Mark approved; OD-16 countersigned | lab owner | CF-49, CF-126 |
| HSTS raised after `<ROLLBACK_WINDOW>` | builder | — |
| G7 | reviewer | — |
