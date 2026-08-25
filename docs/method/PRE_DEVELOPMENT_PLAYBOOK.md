# Nile Egypt Labs — Pre-Development Playbook

**Date:** 24 August 2026
**Covers:** file placement · documentation set · stack approvals · model routing · quotation timing
**Open dependency:** Dev OS Loop specification — see Section 7

---

## 1. What to do with the six files

Three different destinations. The distinction matters — one of these files must **not** go into the repo as truth.

### Into the repo — build inputs

| File | Path | Role |
|---|---|---|
| `nile_programmes.csv` | `data/seed/programmes.csv` | Seeds the `programmes` table |
| `nile_tests_canonical.csv` | `data/seed/tests.csv` | Seeds the `tests` table — 72 rows |
| `nile_programme_tests.csv` | `data/seed/programme_tests.csv` | Seeds the join table — 121 rows |
| `nile_test_catalogue.json` | `data/seed/catalogue.json` | Single-file bundle; also the build-time search index |

These are **source of truth for structure, not for clinical accuracy.** Add a `README.md` in `data/seed/` saying exactly that, with the extraction date and the source URL. Six months from now nobody will remember these came off a 2018 page.

### Out to the client — not a build input

| File | Goes to |
|---|---|
| `nile_qa_missing_tests.csv` | The **lab's clinical staff**, with the QA flags from the canonical CSV |

Keep it in `client-outbound/`, outside the app. It is a question, not data. It becomes a build input only when corrections come back in writing.

### Into project documentation — evidence

| File | Path |
|---|---|
| `Nile_Egypt_Labs_Research_Reconciliation.md` | `docs/research/` |
| Locked baseline, form review, audit brief, answered form | `docs/research/` |

These justify decisions. When someone asks in month three why the hotline is 15504 and not 16402, this is the answer.

---

## 2. Repository and documentation structure

```
nile-egypt-labs/
├─ CLAUDE.md                        ← agent rules, repo-level
├─ docs/
│  ├─ 00-brief.md                   ← one page: what, why, who
│  ├─ 01-scope-baseline.md          ← from the locked baseline
│  ├─ 02-information-architecture.md
│  ├─ 03-content-model.md           ← schema, entities, relationships
│  ├─ 04-design-system.md           ← tokens, type scale, components
│  ├─ 05-i18n-rtl.md                ← the bilingual rules, see §4
│  ├─ 06-admin-spec.md              ← per-module CRUD behaviour
│  ├─ 07-security.md                ← auth, RLS, headers, rate limits
│  ├─ 08-cutover-runbook.md         ← DNS, redirects, decommission
│  ├─ 09-test-plan.md
│  ├─ 10-content-entry-guide.md     ← handed to the client at training
│  ├─ decisions/                    ← ADR-0001.md onward
│  └─ research/                     ← the evidence files above
├─ data/seed/
├─ client-outbound/
└─ src/
```

**Write these three before any code:** `01-scope-baseline`, `03-content-model`, `05-i18n-rtl`. The rest can be written as you build. Writing all eleven up front is procrastination with extra steps.

**ADRs:** one file per irreversible decision. Minimum set for this project — hosting region, search architecture, i18n approach, how clinical content corrections are handled. Two paragraphs each, not two pages.

---

## 3. Chat project instructions

Delivered separately as `CLAUDE_PROJECT_INSTRUCTIONS.md` — paste into the project settings. Attach as project reference files:

1. `01-scope-baseline.md`
2. `03-content-model.md`
3. `05-i18n-rtl.md`
4. `nile_test_catalogue.json`

Four files. Resist adding more — every extra reference file dilutes attention across the ones that matter. The research documents stay in the repo, not in project context.

---

## 4. Stack decisions to approve

Most of this was settled earlier. These are the ones the new findings actually changed, plus the ones never explicitly decided. Approve or amend each.

| # | Decision | Recommendation | Why |
|---|---|---|---|
| S1 | Framework | Next.js App Router + TypeScript | Already agreed |
| S2 | Styling | Tailwind, **logical properties only** (`ps-`/`pe-`/`ms-`/`me-`) | Physical `pl-`/`pr-` break RTL. Enforce with a lint rule, not discipline |
| S3 | i18n | `next-intl` with `/ar` and `/en` route segments, Arabic default | Route-based beats cookie-based for SEO; both languages get indexed |
| S4 | Arabic font | IBM Plex Sans Arabic or Tajawal, self-hosted | Self-host — the old site loaded Google Fonts over HTTP |
| S5 | Database | Supabase Postgres | Already agreed |
| S6 | **Region** | **Verify at project creation.** Supabase has no Middle East region to my knowledge — Frankfurt is likely closest. Confirm in the dashboard before creating | "Closest to Egypt" was approved on an assumption. Don't build on it |
| S7 | **Search** | **Static index, client-side.** Ship all 72 tests as JSON at build time, search with Fuse.js | 72 rows is tiny. Instant, no round trip, no server cost. Add a server path only past ~1,000 rows |
| S8 | Auth | Supabase Auth, MFA required, minimum 2 admin accounts | Approved |
| S9 | Authorisation | Postgres RLS, deny by default, service role never in client code | Non-negotiable |
| S10 | Media | Supabase Storage + `next/image`, type and size limits enforced server-side | |
| S11 | **Analytics** | **Cookieless — Plausible, Umami, or Vercel Analytics** | With no forms and no cookies, **you may avoid a consent banner entirely.** Real compliance simplification — worth confirming with their lawyer |
| S12 | Testing | Vitest (unit) + Playwright (E2E, both locales) | Every E2E path runs twice, AR and EN |
| S13 | CI | GitHub Actions → lint, typecheck, test, build. Vercel preview per PR | |
| S14 | Error monitoring | Sentry | |
| S15 | Structured data | `MedicalBusiness` schema per branch | Their local search presence is fragmented — this is cheap ground to win |

**S6 and S7 are the two that need a real decision before schema work starts.** The rest can be approved in a batch.

---

## 5. Model routing

Two rules first, because they matter more than the table.

**Rule 1 — Grok never touches these.** Auth, RLS policies, migrations against real data, the clinical test content, DNS and cutover, security headers. Not a quality judgement; these are the paths where a plausible-looking mistake is expensive and invisible.

**Rule 2 — nothing Grok writes merges unreviewed.** Sonnet reviews routine work, Opus reviews anything in a security or data-integrity path. The cost saving comes from Grok doing volume, not from skipping review.

| Workstream | Model | Effort | Notes |
|---|---|---|---|
| Schema design, migrations | **Opus** | high | Get the tests/programmes relationship right once |
| RLS policies, auth flows | **Opus** | extra high | Never Grok. Never unreviewed |
| **Arabic translation of test names** | **Opus** | extra high | Clinical terminology. A mistranslated test name on a lab site is a real harm vector — then verified by the lab, not just by us |
| Cutover runbook, DNS plan | **Opus** | high | Irreversible operations |
| Final security review before launch | **Opus** | max | |
| Design system, tokens, type scale | Sonnet | medium | |
| Search implementation | Sonnet | high | |
| RTL and bidi edge cases | Sonnet | high | Mixed AR/EN strings, numerals, URLs in Arabic paragraphs — Grok is weakest exactly here |
| E2E tests, both locales | Sonnet | high | |
| Accessibility audit | Sonnet | high | |
| Unit tests | Sonnet | medium | |
| Reviewing Grok PRs | Sonnet | medium | Escalate to Opus for security paths |
| SEO, metadata, schema.org | Sonnet | medium | |
| Static components, layout, cards | **Grok** | low–medium | Spec must be complete before handing over |
| Page assembly from approved components | **Grok** | medium | |
| Admin CRUD forms | **Grok** | medium | Sonnet reviews before merge |
| Seed import scripts | **Grok** | low | |
| Content entry, non-clinical copy | **Grok** | low | |

**Effort calibration:** *low* — mechanical, spec complete, no judgement. *medium* — single component, some judgement. *high* — cross-cutting, correctness matters. *extra high / max* — security, data integrity, clinical content, anything irreversible.

**Where the savings actually come from:** components, page assembly, admin forms and content entry are the bulk of the hours and almost all of them are Grok-suitable. Schema, auth and translation are a small fraction of the hours and should carry the highest effort you have. Do not invert this to save money.

---

## 6. Steps before development starts

**Blocking — do these first**

1. Settle the launch date, or agree the Phase 1 / Phase 2 split
2. Send the clinical QA file to the lab's clinical staff, separately from all admin questions
3. Approve S6 (region) and S7 (search architecture)
4. Confirm the logo situation — open the 2015 PNG, then ask whether one needs designing

**Setup — can run in parallel**

5. Create the repo, `docs/`, `data/seed/`, `client-outbound/`
6. Write `01-scope-baseline`, `03-content-model`, `05-i18n-rtl`
7. Paste project instructions, attach the four reference files
8. Create Supabase and Vercel projects in your own accounts — transfer at handover
9. Wire CI: lint, typecheck, test, build, preview per PR
10. Add the RTL lint rule (S2) before the first component exists

**Then**

11. Schema and migrations — Opus, high
12. Seed import, verify 121 rows resolve to 72 tests
13. Design system — Sonnet, medium
14. Build

DNS and hosting access are **not** on this list. They block cutover only.

---

## 7. Dev OS Loop — what I need from you

I can't see your B2S or BETK projects — each Claude Project keeps a separate memory space, so nothing from those threads reaches this one.

Paste either the loop specification or the project instructions file from one of them, and I'll wire the following into it properly:

- Where the model routing table sits in the loop
- Which loop stage owns the review gate for Grok output
- How ADRs are triggered and by whom
- Where the clinical QA hold-point sits — this project has a dependency most don't: **content that cannot ship until a third party signs off**
- What the loop's definition of done is, and whether "both locales pass E2E" belongs in it

Until then Section 6 is a plain sequence. It works, but it won't match how you run your other projects.

---

## 8. Quotation — issue it now

**Recommendation: send it now, don't wait.**

The reasoning: content volume is now a firm number rather than an estimate — 9 programmes, 72 tests, 121 relationships, 4 branches, 4 laboratory units, 1 Lab-to-Lab section. That was the largest unknown and it is now closed. He has approved all seven strategic decisions and wants to start. Holding the quotation over three variables that can be priced as options costs you momentum for no gain.

Carry the three open variables as **clearly-labelled line items** rather than as reasons to delay:

| Line item | Why it's separate |
|---|---|
| **Logo and basic brand identity** | Evidence says they have no logo. Not in the current scope. Price it as an option so it isn't absorbed silently |
| **Arabic translation** | 72 test names, 9 programme descriptions, plus all site copy. Androw said he'd supply content — clinical Arabic is a different job from marketing copy. Price it, or exclude it explicitly |
| **Phasing** | Two prices: single delivery, or Phase 1 / Phase 2 |

Also add to exclusions, both now defensible in one line each: correcting the stale third-party directory listings that still publish 16402, and consolidating their three Facebook pages. Both are real work, both are visible problems, and naming them as excluded is how they later become paid work rather than free favours.

State plainly that content entry covers the quantities above and no more. You have exact numbers now — use them. An unquantified cap is not a cap.

---

## 9. Risks carried into development

| Risk | Handling |
|---|---|
| Clinical corrections don't come back | Programmes module ships; test data stays behind a feature flag until sign-off arrives |
| No logo ever materialises | Header built to tolerate a wordmark fallback. Do not block design on it |
| Launch date unagreed when build starts | Build order follows Phase 1 anyway — public site first, dashboard second. Costs nothing if it stays a single delivery |
| Arabic content arrives late or thin | Build with the English as the source of record; Arabic is data, not layout. Never let missing Arabic block a component |
| Grok output drifts from the design system | Lint rules and the review gate, not instructions. Rules that only exist in prose get ignored at volume |
