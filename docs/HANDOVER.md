# NEL — Handover

**Status:** AUTHORED at P07-T08 · authored 25 September 2026 · Stage 3 of OD-35
**Audience:** the laboratory's account owner, its Operators' manager, and whoever maintains
the system after handover.
**Basis:** the finished application on `main`, approved by the laboratory on 25 September
2026. Development is complete (OD-37). This document describes what exists; it proposes
nothing new.

---

## §1 The system

NEL is the laboratory's bilingual website (Arabic first, English second), its Operator
dashboard, and a PartnerLab area for approved partner laboratories.
`docs/PRODUCT_BRIEF.md` describes it and `docs/SCOPE.md` inventories it. It holds no
patient data and collects no personal data from the public. The patient results portal is a
separate application that NEL only links to.

## §2 Delivered scope, in figures

Counted by `python -X utf8 scripts/audit/inventory.py`; `docs/SCOPE.md` §2 explains each count.

| What | Count |
|---|---|
| Public pages | 14 — 13 static and 1 per programme; 44 URLs with nine programmes published |
| Dashboard pages | 26 — 3 authentication, 1 home, 22 across 11 modules |
| PartnerLab pages | 2 |
| Endpoints (not pages) | 23 |
| Database tables | 13, with 17 foreign keys |
| Row-level-security policies | 27 — 25 on tables, 2 on storage |
| Database functions and triggers | 3 and 1 |
| Storage buckets | 1, private |
| Migrations | 18 forward, each with an authored reverse |
| Interface strings | 645 in each language |

## §3 Architecture

| Layer | What | Where |
|---|---|---|
| Application | Next.js 16, React 19, TypeScript; every page under `/ar` or `/en` | Vercel |
| Database, authentication, images | Supabase: Postgres with row-level security, Auth with TOTP, one private bucket | Supabase, region `eu-central-2` |
| Source and CI | The repository; CI runs five guards, lint, typecheck, build, the seed check and a production dependency audit | GitHub |
| Domain and DNS | `<PRODUCTION_DOMAIN>` | `<DNS_PROVIDER>` |

Public pages read published rows through Supabase's REST interface with the publishable key,
under row-level security. The dashboard writes through the same interface as a signed-in
Operator. Account administration uses the Auth Admin API from Operator routes only
(ADR-001). The catalogue search index is built before each deploy and queried in the
browser.

## §4 Pages, dashboard and endpoints

`docs/SCOPE.md` §3 to §6 list every page and endpoint. The eleven dashboard modules are
Offers, Videos, Equipment, Branches, Programmes, LabUnits, Site Settings, Media Library,
Announcements, LabTests and PartnerLab accounts. `docs/ADMIN_GUIDE.md` explains each one to
the Operators.

## §5 Database

Thirteen tables: `LabUnit`, `Branch`, `SiteSettings`, `MediaAsset`, `LabTest`, `Programme`,
`ProgrammeTier`, `ProgrammeLabTest`, `Offer`, `Video`, `Equipment`, `Announcement`,
`PublicationMaximum`. `docs/DATA_MODEL.md` §6 gives the columns and §10 the migrations. No
column identifies a person (D-40). Schema changes are made only by a new migration file with
its reverse, never in the dashboard's table editor (OD-10).

## §6 Authentication and authorisation

- **Visitors** are never signed in and read published rows only.
- **Operators** sign in with email, password and a TOTP code. Every database write requires
  the Operator claim and an AAL2 session. There are two Operator accounts.
- **PartnerLabs** sign in with email or a numeric identifier and a password. They read the
  laboratory's offers while their account is approved, and nothing else. Revocation is
  immediate (OD-28).
- `docs/SECURITY_MODEL.md` is the full model.

## §7 Publishing and media

Every record is draft or published; only published records reach the public site, and a
record publishes only when complete in both languages. Clinical records (programmes, tiers,
memberships, analyses) publish only while the laboratory's signed clinical artefact is in
the repository, and analysis names show only while `NEL_LABTEST_CONTENT` is `on`. Images are
uploaded once to the Media Library (JPEG, PNG or WebP, up to 5 MiB) and chosen for each role.

## §8 Deployment and runtime

- Node 22 for builds; Vercel builds `main` on every merge.
- Supabase and Vercel on paid plans after transfer: Supabase's Free plan pauses inactive
  projects, and Vercel's Hobby plan is for non-commercial use.
- Security headers are set in `next.config.ts` (OD-38). HSTS starts at one day and is raised
  after the rollback window (`CUTOVER_RUNBOOK.md` §5.6).

## §9 Environment variables

Names and environments are in `CUTOVER_RUNBOOK.md` §1.4. Only `SUPABASE_SERVICE_ROLE_KEY` is
secret, and it exists in Production only. No value is ever committed, pasted into a document
or shared in chat.

## §10 Where the secrets live

| Secret | Lives in | Held by after transfer |
|---|---|---|
| Supabase service-role or secret key | Vercel, Production environment | lab owner |
| Supabase database password | Supabase | lab owner |
| Vercel, GitHub and Supabase account credentials | each provider | lab owner, each with MFA |
| Domain registrar and DNS credentials | `<DNS_PROVIDER>` | lab owner |
| Operator passwords and authenticator apps | each Operator | each Operator; never shared |

Every secret the developer has seen is rotated at transfer (`CUTOVER_RUNBOOK.md` §3).

## §11 Who is responsible for what

| Area | Responsible | What it means |
|---|---|---|
| Accounts, billing and domain | the laboratory | Keeps GitHub, Vercel, Supabase and DNS paid and owned |
| Content | the laboratory's Operators | Everything on the site, through the dashboard |
| Clinical content | the laboratory's clinical staff | Analysis names, programme memberships and eligibility; every change is theirs and in writing |
| PartnerLab accounts | the Operators | Approve, reject, reinstate or revoke in the dashboard |
| Personal-data obligations | the laboratory, as controller | Egypt's personal-data law applies to the laboratory's own processing (CF-105) |
| Backups | the laboratory, with the maintainer verifying | §12 |
| Security updates and fixes | the maintainer, under the maintenance agreement | Dependency advisories, framework upgrades, incident response |
| New features | a new engagement | Outside maintenance (OD-37) |

## §12 Backup and restore

- **Database:** Supabase's paid plan keeps daily backups. The laboratory also keeps a logical
  dump taken with `pg_dump` at least monthly and before any migration, stored at
  `<BACKUP_LOCATION>`.
- **Images:** not in the database backups. Download the `media-asset` bucket's objects with
  the dump.
- **Repository:** GitHub holds it. A mirror clone is kept with the backups.
- **Restore:** create a Postgres (or a new Supabase project), restore the dump, re-upload the
  images, point the environment variables at it, redeploy, and run
  `CUTOVER_RUNBOOK.md` §6. The maintainer rehearses a restore once a year.

## §13 Access matrix — least privilege

| System | Laboratory owner | Operators | Maintainer | Reviewer |
|---|---|---|---|---|
| GitHub organisation | Owner | none | none | none |
| The repository | Admin, through the organisation | none | Write | Read |
| Vercel team | Owner | none | Member, deploy only | none |
| Supabase organisation | Owner | none | Developer role; no billing; no Owner | none |
| Supabase dashboard SQL Editor | yes | none | yes, for maintenance tasks | none |
| Supabase MCP or personal access tokens | — | — | none after transfer (CF-203) | none |
| `<DNS_PROVIDER>` and registrar | Owner | none | none, unless granted for a named task | none |
| The dashboard | none required | Operator accounts with TOTP | none | none |
| Break-glass Operator recovery | `<BREAK_GLASS_HOLDER>` | none | none | none |

Rules:
- Every human account uses MFA.
- The maintainer's access ends when the maintenance agreement ends.
- After the repository is private, the reviewer verifies from a git bundle the human uploads.
- No one shares an account.

## §14 Security requirements that stay in force

- Row-level security on every table; no anonymous write.
- The service-role key in Production only, used only for Auth Admin calls from Operator
  routes.
- The six OD-38 headers; HSTS never with `includeSubDomains` or `preload`, because the results
  portal may sit on a subdomain.
- The hosted password policy at twelve characters or more (CF-166).
- No personal or medical data in any table, bucket, form or log (`BOUNDARY_MODEL.md`).
- No clinical content changed without the laboratory's written sign-off.

## §15 Known limitations of the delivered state

These are recorded, not scheduled. `docs/SCOPE.md` §26 states them in full.

- No re-authentication before destructive actions; a typed confirmation is required
  instead (CF-220).
- Rate limiting is Supabase Auth's project limit only, which sees the server's address
  (CF-223).
- The Video featured flag has no effect on the public site.
- CI does not run the spec files (CF-219, CF-184).
- Accessibility items: CF-92, CF-179, CF-208, CF-211.
- Twelve analyses have no Arabic alias (CF-204).
- The CSP is minimal; the full allow-list is deferred (OD-38 §4).

The maintenance list is every carry-forward in `MAINTENANCE` status (22), for example CF-41,
CF-108, CF-161 to CF-164, CF-173, CF-205, CF-206, CF-215, CF-216, CF-220 and CF-223. Each
becomes work only by written agreement.

## §16 The handover package

1. **The repository**, transferred to `<GITHUB_TARGET_ORGANIZATION>`, with every document
   named here.
2. **The `nel-private` folder**, delivered by the human outside the repository. It contains
   the answered owner form and the nine pre-development papers of OD-36. Each paper's git
   blob id is in `docs/research/README.md`; check each file with
   `git hash-object --no-filters <file>`.
3. **The backups** of `CUTOVER_RUNBOOK.md` §1.3, at `<BACKUP_LOCATION>`.

## §17 Transfer checklist

`CUTOVER_RUNBOOK.md` §2 to §8, in order. Twelve carry-forwards stay open until their steps
close them: CF-07, CF-28, CF-37, CF-49, CF-105, CF-117, CF-118, CF-119, CF-126, CF-166,
CF-203 and CF-213. The Supabase MCP connection and the repository's visibility stay
unchanged until the final transfer step, on the human's explicit authorisation.
