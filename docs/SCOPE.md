# NEL — Scope

**Status:** AUTHORED at P07-T03 · authored 24 September 2026 · replaces the P00-T01 stub
**Basis:** the scope as delivered — implemented, approved and merged — on `main`, under
OD-35 §2. The signed quotation and its signed amendments stay the historical commercial
record. Delivered scope beyond them is set out in
`docs/commercial/quotation-revision-1-delivered-scope.md`, a draft awaiting the human's
approval, with no prices.
**Final scope:** development is complete (OD-37). The delivered state described here is
the final scope; nothing is added to it during handover.
**Precedence:** document 2, with `DECISIONS.md`. This file records the delivered scope and
decides nothing; every entry cites the decision or task that delivered it. Where it
appears to disagree with a signed decision, this file is wrong and is amended.
**Verification:** every figure here is printed by `scripts/audit/inventory.py`, run at the repository
root with `python -X utf8 scripts/audit/inventory.py`. Schema figures are the replayed state of the
forward migrations in `supabase/migrations/`, not a live read.

---

## §1 What this document is

The quotation described a product before it was built. This document describes the product
that was built, which OD-37 fixes as the final scope. It does not re-admit anything
excluded (§25), and it does not drop anything delivered because the quotation did not name
it. What was approved and later withdrawn is listed as such (§24), and the delivered
state's known limitations are listed without being turned into new work (§26).

## §2 How things are counted

Four words are used in one sense each.

| Word | Means | Counted as |
|---|---|---|
| **page** | a tracked `page.tsx` under `src/app/` — one URL pattern | one per file, whatever the number of languages |
| **URL** | one concrete address a browser can request | a page in one language; a dynamic page once per row |
| **handler** | a tracked `route.ts` — an endpoint that accepts a form post or serves a file | never counted as a page |
| **module** | a directory under `src/app/[locale]/dashboard/(session)/(modules)/` | one per directory |

Every page lives under the `[locale]` segment and exists in Arabic and English. A
**static** page has no dynamic segment except the language. A **dynamic** page has a
further `[param]`, and its URL count depends on data. The `/` redirect to `/ar` is
configuration in `next.config.ts`; it is neither a page nor a URL here.

Totals: **42 pages** — 14 public, 26 dashboard, 2 PartnerLab — and **23 handlers**.

## §3 Public pages

Fourteen pages: thirteen static and one dynamic.

| # | Pattern | Content | Source |
|---|---|---|---|
| 1 | `/{locale}` | Home: hero, departments, story, programmes, three reasons, branches and map, offers band, news, videos, lab-to-lab | OD-08, OD-26 |
| 2 | `/{locale}/about` | About copy from Site Settings | `CONTENT_MODEL.md` §3c |
| 3 | `/{locale}/announcements` | Published news items | OD-09, P06-T15 |
| 4 | `/{locale}/contact` | WhatsApp action, hours, hotline, social links. No form | D-09, OD-33 |
| 5 | `/{locale}/departments` | The four departments | §3c |
| 6 | `/{locale}/equipment` | Published equipment | §3c |
| 7 | `/{locale}/lab-to-lab` | Lab-to-lab service copy | D-15 |
| 8 | `/{locale}/locations` | The branches and the drawn map | OD-22 |
| 9 | `/{locale}/offers` | Offers for an approved PartnerLab; an invitation to sign in for everyone else | OD-15 |
| 10 | `/{locale}/online-results` | One or two outbound links to the results portal | D-07, D-14 |
| 11 | `/{locale}/privacy-policy` | Privacy policy from Site Settings | D-13 |
| 12 | `/{locale}/programmes` | The nine programmes, and catalogue search while the clinical flag is on | OD-02, P04 |
| 13 | `/{locale}/videos` | Published videos | §3c |
| 14 | `/{locale}/programmes/{slug}` | One page per published programme, with tier and audience selection | P03-T08, P06 |

**URLs.** The thirteen static pages give 13 URLs per language, 26 in both. The dynamic
page gives one URL per published programme per language. With the nine programmes of the
signed catalogue published, as last measured, that is 22 URLs per language and **44 in
all**.

## §4 Operator dashboard pages

Twenty-six pages: three authentication pages, the dashboard home, and twenty-two module
pages across eleven modules.

| Group | Pages | Patterns |
|---|---|---|
| Authentication | 3 | `/{locale}/dashboard/sign-in` · `/enrol` · `/challenge` |
| Home | 1 | `/{locale}/dashboard` |
| Modules | 22 | below |

| Module | Pages | Handlers | Pages are |
|---|---|---|---|
| announcements | 2 | 1 | listing · record |
| branches | 2 | 1 | listing · record |
| equipment | 2 | 1 | listing · record |
| lab-tests | 2 | 1 | listing · record |
| lab-units | 2 | 1 | listing · record |
| media-assets | 2 | 1 | library · asset |
| offers | 2 | 1 | listing · record |
| partner-lab | 1 | 2 | the account queue with its views; handlers for actions and provisioning |
| programmes | 4 | 3 | listing · programme · tier · membership |
| site-settings | 1 | 1 | the singleton |
| videos | 2 | 1 | listing · record |

Every dashboard page is rendered per request and never cached (`ADMIN_SPEC.md` §3e).

## §5 PartnerLab and authentication pages

Two PartnerLab pages: `/{locale}/partner-lab/sign-in` and `/{locale}/partner-lab/sign-up`.
The sign-up page resolves only while `NEL_PARTNER_SIGNUP` is `on` and is a 404 otherwise.

Counting every page whose purpose is authentication gives **five**: the three dashboard
authentication pages of §4 and the two PartnerLab pages. The five are also counted in §3's
and §4's totals where they belong, not added to them.

## §6 Handlers

Twenty-three, none of them a page.

| Area | Count | What they do |
|---|---|---|
| Dashboard authentication | 4 | sign-in, enrol and challenge submissions; sign-out |
| Dashboard modules | 14 | create, save, publish, unpublish and delete for each module; PartnerLab actions and provisioning |
| PartnerLab | 3 | sign-in and sign-up submissions; sign-out |
| Outside the language segment | 2 | `/media-asset/{name}` serves a published image from the private bucket; `/site-webmanifest` serves the manifest when an app icon is set |

`src/middleware.ts` refreshes the session on dashboard paths only.

## §7 Frontend

- **Composition.** The home composition approved on 29 August 2026 is the production
  baseline, refined in place (OD-08), restyled in the dashboard's visual language (OD-31)
  with its background on every Visitor page (OD-34). `DESIGN_SYSTEM.md` specifies it.
- **State-driven regions.** Every region that depends on content renders when the
  published data it needs exists and shows the `DESIGN_SYSTEM.md` §12 pending state when it
  does not (OD-26). Nothing is a hard-coded placeholder.
- **Components.** Header, footer, language switch, WhatsApp and results-portal actions,
  cards for each entity, the drawn Greater Cairo map, section headers, the pending state
  and the Latin-isolation primitive, all built on one token stylesheet.
- **Interface strings.** 645 catalogue keys in each language, identical sets, checked at
  compile time and at runtime.
- **Fonts.** IBM Plex Sans Arabic, Arabic and Latin subsets, self-hosted (D-31).
- **SEO.** A title per page and language, a canonical address and `hreflang` alternates
  with Arabic as `x-default`, the home page's title and description from Site Settings, the
  favicon and app icon from the Media Library, and a web manifest. No sitemap, robots file
  or structured data (§26).

## §8 Backend and database

One Supabase project, region `eu-central-2` (D-47).

| Object | Count | Detail |
|---|---|---|
| Forward migrations | 18 | Each with an authored reverse; no reverse executed (CF-83) |
| Enum types | 4 | `AudienceAxis`, `EligibilityAudience`, `ProgrammeTierAxis`, `PublicationState` |
| Tables | 13 | 12 content tables and `PublicationMaximum` |
| Foreign keys | 17 | 11 of them to `MediaAsset` |
| RLS policies | 27 | 25 on the 13 tables, 2 on `storage.objects` |
| Functions | 3 | `programmeLabTests`, `currentNelPrincipal`, `enforcePublicationMaximum` |
| Triggers | 1 | `Announcement_enforcePublicationMaximum` |
| Storage buckets | 1 | `media-asset`, private, JPEG, PNG and WebP, 5 MiB |

The thirteen tables: `LabUnit`, `Branch`, `SiteSettings`, `MediaAsset`, `LabTest`,
`Programme`, `ProgrammeTier`, `ProgrammeLabTest`, `Offer`, `Video`, `Equipment`,
`Announcement`, `PublicationMaximum`. `DATA_MODEL.md` §6 gives their columns and §10
their migrations. Row-level security is enabled on every one. No column identifies a
person (D-40).

## §9 Authentication and authorisation

- **Operator.** Email and password, then TOTP, the only factor (`ADMIN_SPEC.md` §3b).
  Enrolment is compulsory before any module resolves. Access needs AAL2 and the
  `app_metadata.nel_principal = 'Operator'` claim, checked by the application (M7C) and by
  every write policy (M7B-2). Two accounts exist, each with a verified factor (D-08, read
  at G5-R). The session cookie is `httpOnly`, `SameSite=Lax`, and lapses after thirty
  minutes without a request. Recovery is break-glass by the holder of Supabase project
  access; there are no recovery codes (`ADMIN_SPEC.md` §3d).
- **PartnerLab.** Self-signup behind `NEL_PARTNER_SIGNUP` (OD-15) or Operator provisioning
  with a numeric identifier (OD-30). Sign-in by email or numeric identifier, with
  responses that do not reveal whether an identifier exists (OD-18 §6). Self-signup
  passwords need at least twelve characters, matching the hosted Auth policy (P08-T17). States: pending, approved, rejected, revoked to either (OD-18,
  OD-20). No email is sent (D-49); no password reset exists; no second factor.
- **Offer access.** Enforced in Postgres: the `Offer_partner_read` policy asks
  `currentNelPrincipal()` for the account's live state (OD-28, ADR-002). No anonymous read
  of `Offer` exists (M10).
- **Account administration.** Approve, reject, reinstate, revoke and provision run
  server-side through the Auth Admin API, on Operator routes behind AAL2 (ADR-001, OD-30).

## §10 Content management

Eleven modules, each with create-as-draft, edit, publish, unpublish, reorder, and delete
behind a typed confirmation. Arabic and English sit side by side; fields required for
publishing are marked before submission; the server validates every rule (`ADMIN_SPEC.md`
§4g). The dashboard home shows each module's published and draft counts and a
completeness checklist computed from `src/lib/regions.ts` (§4h).

| Module | Manages | Source |
|---|---|---|
| Offers | Offers with dates, price, currency, image, optional programme | D-16, D-48 |
| Videos | YouTube link, copy, featured flag, poster | D-16, OD-14 |
| Equipment | Equipment with image and optional video | D-16 |
| Branches | Address, hours, WhatsApp, coordinates, head office | D-16 |
| Programmes | Programmes, tiers, memberships and eligibility | D-16, D-42 |
| LabUnits | Departments and photographs | D-16 |
| Site Settings | Laboratory-wide values and page copy | D-16 |
| Media Library | Images and bilingual alternative text | D-16 |
| Announcements | News items | OD-09, OD-24 |
| LabTests | Analyses | P05-T24A |
| PartnerLab accounts | Queue, actions, provisioning | OD-15, OD-30 |

## §11 Clinical catalogue

- **Content.** 9 programmes · 14 tiers · 124 memberships · 71 analyses, signed on
  6 September 2026 (`docs/research/clinical-signoff.md`, digest `aa0469ee…aef7`; worklist
  `22b2c73b…7569f`; addendum countersigned 7 September 2026, `2b63422e…340d`) and
  transcribed by M8. Verified by `python -X utf8 data/seed/verify_seed.py` → `124 -> 71`.
- **Eligibility.** Explicit on all 124 memberships: 94 everyone, 16 women, 14 men,
  0 unreviewed (D-42).
- **Cumulation.** One database function, `programmeLabTests`, used by every caller
  (D-43).
- **Gate.** Clinical records publish only while the signed artefact is present, and
  analysis names and the index reach the public site only while `NEL_LABTEST_CONTENT` is
  `on` (PR-08).

## §12 Search

A bilingual index of every published analysis — Arabic name, English name, aliases, and
the programmes that include it — built before each production build and queried in the
browser, with no server round trip (OD-02). Matching folds case and Unicode form and
matches substrings, with no transliteration between scripts (D-50). It renders on
`/{locale}/programmes` only while the clinical flag is on.

## §13 Media

A private bucket, reached by a Visitor only through `/media-asset/{name}` for images a
published record names. Upload accepts JPEG, PNG and WebP up to 5 MiB, enforced by the
bucket. Alternative text in both languages is required before an image can be attached to
a published record. Eleven image roles: offer, video poster, equipment, department,
announcement, hero, favicon, app icon and three story frames (P06-T13). The Media Library
offers a thumbnail grid, alt-text search and drag-and-drop upload.

## §14 Announcements

A dashboard module, a public listing and the home news band (P06-T14, P06-T15). An
announcement publishes only with a date and the Operator's affirmation that it carries no
medical instruction, and at most three are published at once (OD-27).

## §15 Branches

Four branches, one head office, with address, hours and WhatsApp number in both languages.
Coordinates come from a pasted Google Maps link, parsed without any network request
(P06-T10). The map is drawn, not tiled, and places pins from published coordinates (OD-22).

## §16 Videos

The Operator pastes a YouTube link; the identifier is parsed and the poster fetched once
into the Media Library (P05-T13). A public video card shows that poster and opens YouTube
on click. No public page embeds a player or loads anything from YouTube (D-13,
`guard:design` R5). The Operator's preview embeds behind AAL2 (OD-14).

## §17 Offers

Offers carry dates, a price and a currency, an optional image and an optional programme.
They are private to approved PartnerLabs (OD-15) and disappear once their end date passes
without their record changing (D-48).

## §18 Publication workflow

Draft and published, per record. Published rows are the only rows an anonymous request can
read. Bilingual completeness is a database constraint on every pair, applied at publish.
Clinical records also need the signed artefact. Announcements also need the affirmation
and a free slot under the maximum. Unpublishing is always available and is the default
offer before deletion.

## §19 Security controls

Delivered:

- row-level security on every table; no anonymous write policy; anonymous reads limited to
  published rows;
- Operator writes gated on AAL2 and the Operator claim, in the application and in Postgres;
- PartnerLab reads decided by live server state, so revocation is immediate;
- a private bucket with type and size limits enforced by the platform;
- server-side validation of every field;
- no personal-data column, no attribution column, no analytics table (D-40);
- the service-role key confined to Auth Admin calls on Operator routes (`SECURITY_MODEL.md`
  §3);
- the results portal linked and never framed (D-17), from an allowlisted host.

Hardening in Stage 2 of the handover programme, each item closing with a PASS or FAIL in
the ledger: security headers and a minimal CSP (CF-177), dependency advisories and a CI
audit step (CF-214, CF-217), and measurements of rate limiting on sign-in and signup, the
auth orphan read and the idle connection count. Hardening changes no page, module or data
the product offers (OD-37 §5).

## §20 Deployment and platform

Vercel for the application, Supabase for the database, authentication and storage, GitHub
for the repository. The results-portal URLs are environment variables, not content
(OD-23). The environment-variable names, backups and account transfers are documented in
`CUTOVER_RUNBOOK.md`, which Stage 3 of the handover programme produces. The repository is
public for review until the Stage 4 transfer, when it turns private (OD-04, OD-35).

## §21 Accessibility

`DESIGN_SYSTEM.md` §8 sets six criteria. Delivered: `lang` and `dir` on every page,
contrast measured per token pair, visible focus, 44-pixel targets on controls, motion
stopped under `prefers-reduced-motion`, and alternative text in both languages on every
published image. Open against §8: footer text links under 44 × 44 (CF-211), one
focus-visibility gap on date inputs (CF-208), and no single rendered surface on which
criteria 1 to 3 are proved (CF-92).

## §22 Responsive behaviour

One layout per page, fluid across phone, tablet and desktop, with the breakpoints
`DESIGN_SYSTEM.md` §9 defines, logical properties only, and the Arabic line-height fork.
Dashboard forms stack their Arabic and English columns on narrow screens.

## §23 Testing and verification

- **Continuous integration** on every push and pull request: the naming, schema, design,
  phases and boundary guards, lint, typecheck, build, and the seed check.
- **Specs.** 11 spec files declaring 84 cases, run with `node --test`. CI does not run
  them, and one file cannot run (CF-184).
- **Gates passed:** G1, G2, G3, G4, G5 (re-run as G5-R), G6, G8 (re-run as G8-R2), G9,
  G10. G7, launch, is open.
- **Smoke checks.** `npm run smoke:public` and `smoke:operator` exercise the PartnerLab
  flow against a deployment; the Operator mode is human-run only.

## §24 Approved and later withdrawn

| Item | Approved by | Withdrawn by |
|---|---|---|
| Public Offers page and public home offers band | the quotation baseline, §2.2 | OD-15; quotation schedule R1, signed 4 September 2026 |
| Clinical notices module and `ClinicalNotice` table | OD-09, effective under OD-24 | OD-37. Never built |

## §25 Never delivered, and excluded

Each item below is outside the delivered scope by the decision named. The items excluded by
OD-37 §3 are quotation-baseline items that were not delivered as written.

| Item | Excluded by |
|---|---|
| Contact form, booking and incoming-message inbox | D-09, OD-16 |
| Analytics and cookie-consent banner | D-13 |
| Public Offers page and public home offers band | OD-15; quotation schedule R1 |
| Price on a Programme | D-04 |
| A managed partner-laboratory list | D-15 |
| Operator-editable results-portal URL | D-07, OD-23 |
| Password reset and any email flow for a PartnerLab | D-49, OD-30 |
| A staging database | OD-10 |
| FAQ page | Optional in the quotation; no copy supplied and no OD includes it (`CONTENT_MODEL.md` §3c) |
| Dark theme | Quotation schedule A6: never confirmed by the client, not built |
| Patient results, in any form | `BOUNDARY_MODEL.md` |
| Sitemap, robots file and structured data (quotation §2.4) | OD-37 §3 |
| Error monitoring (quotation §3) | OD-37 §3 |
| An agreed device matrix with cross-browser and performance checks (quotation §2.4) | OD-37 §3 |
| A featured video and the latest equipment on the home page (quotation §2.2) | OD-37 §3 |
| A telephone number per Branch; each carries a WhatsApp number (quotation §2.3) | OD-37 §3 |
| A category field on a Programme (quotation §2.3) | OD-37 §3 |
| A video player loading on click; the card opens YouTube (quotation §2.2) | OD-37 §3 |

## §26 Known limitations of the delivered state

These are facts about the product as delivered. None is new work: each is recorded so the
laboratory and the maintainer know it, and OD-37 §4 governs the two it names.

- **Re-authentication before destructive actions** is required by `SECURITY_MODEL.md` §4
  and not delivered: a destructive action needs a typed confirmation inside an AAL2
  session. The requirement stands, recorded as not met; a carry-forward holds it for the
  G7 triage.
- **The Video featured flag** can be set in the dashboard and is read by no public page.
- **The spec files are not run by CI.** They run with `node --test` by hand, and one of
  them cannot run (CF-184); a carry-forward records the gap.
- **Accessibility** has three open items against `DESIGN_SYSTEM.md` §8 (CF-92, CF-208,
  CF-211).
- **Search** does not reach twelve analyses by an Arabic alias, because they have none; the
  official Arabic name reaches all 71 (CF-204, D-50).
- **Security headers** are not yet set on the deployment (CF-177); Stage 2 sets them.
