# NEL — Nile Egypt Labs

The website and content dashboard of Nile Egypt Labs, a medical laboratory in Cairo. It
replaces the laboratory's 2018 template site.

- **Public site** — Arabic by default, English second. Departments, check-up programmes
  and the analyses in them, catalogue search, branches on a drawn map, equipment, videos,
  news, WhatsApp contact and an outbound link to the laboratory's results portal.
- **Operator dashboard** — the laboratory's staff publish and maintain every piece of that
  content themselves, in eleven modules, behind email, password and TOTP.
- **PartnerLab area** — other laboratories, once approved by an Operator, read the
  laboratory's private offers.

Development is complete (OD-37): this repository is the final delivered product, now in
handover (OD-35). The site collects no personal data and holds no patient data. The results portal is a
separate application; this one links to it and nothing else.

`docs/PRODUCT_BRIEF.md` describes the product. `docs/SCOPE.md` inventories it, with every
page, module and database object counted and the count explained.

`docs/HANDOVER.md` is the handover: access, responsibilities, backups and known limitations.
`docs/CUTOVER_RUNBOOK.md` is the cutover plan, and `docs/ADMIN_GUIDE.md` the Operators' guide.

## Architecture

| Layer | What |
|---|---|
| Application | Next.js 16, React 19, TypeScript. App Router; every page under a `[locale]` segment |
| Styling | One token stylesheet and CSS modules, logical properties only, IBM Plex Sans Arabic self-hosted |
| Data, auth, storage | Supabase: Postgres with row-level security on every table, Auth with TOTP, one private image bucket |
| Hosting | Vercel |
| Schema | Hand-written migrations in `supabase/migrations/`, each with a reverse (OD-10) |
| Search | A bilingual index built before each build, queried in the browser (OD-02) |

## Layout

| Path | Holds |
|---|---|
| `src/app/` | Pages and route handlers |
| `src/components/` | Public-site and dashboard components |
| `src/lib/` | Data access, validation, the string catalogue, clinical and signup flags |
| `supabase/migrations/` | The schema, forward and reverse |
| `scripts/guard/` | The five project guards CI runs |
| `data/seed/` | The signed catalogue as CSV, and its check |
| `docs/` | The model documents, decisions and state |
| `docs/research/` | Evidence and the laboratory's signed clinical artefacts. Never a specification |
| `docs/commercial/` | The quotation draft and its delivered-scope revision |

## Read first

| File | Purpose |
|---|---|
| `docs/SESSION_CONTEXT.md` | Current phase, next action, open carry-forwards |
| `docs/method/PRECEDENTS.md` | Binding procedural rulings (PR-nn) |
| `docs/method/CARRY_FORWARDS.md` | The ledger (CF-nn) |
| `docs/GLOSSARY.md` | Enforced vocabulary — forbidden nouns are defects |
| `docs/BOUNDARY_MODEL.md` | The non-waivable no-personal-data gate |

## Two gates that cannot be waived

**Boundary** — no personal or medical data on any path.
**Clinical** — no analysis name, programme membership or medical description in
production without the laboratory's written sign-off. The laboratory signed the current
catalogue on 6 September 2026 (`docs/research/clinical-signoff.md`).

## Checks

The CI job runs on every push and pull request:

    npm run guard:naming
    npm run guard:schema
    npm run guard:design
    npm run guard:phases
    npm run lint
    npm run typecheck
    npm run build
    npm run guard:boundary
    python data/seed/verify_seed.py

`verify_seed.py` must print `124 -> 71` and `PASS`: nine programmes, seventy-one analyses
and one hundred and twenty-four memberships.

## Environment

`.env.example` lists the two results-portal variables. The others the application reads —
the Supabase URL and keys, and the `NEL_LABTEST_CONTENT` and `NEL_PARTNER_SIGNUP` flags —
are set in the deployment environment and never committed. No value of any of them
belongs in this repository.

## Repository visibility

This repository is public for review during development (OD-04) and turns private when it
is transferred to the laboratory, before the domain moves (OD-35). The seed's former
`qa_flag` entries and the rows in `client-outbound/` were questions put to the laboratory
from a public 2018 page (PR-09); the laboratory answered them in its signed catalogue.
