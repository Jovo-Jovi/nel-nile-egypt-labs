# Nile Egypt Labs — Quotation Revision 1: Delivered Scope

**Status:** DRAFT — for the human's approval. Not issued to the client.
**Authored:** P07-T03 · 24 September 2026
**Prices:** none. This revision sets, changes and restates no price, rate, total or
payment term. Every commercial figure stays where it was agreed.
**Relation to the signed quotation:** it does not amend the signed quotation and does not
pretend the signed quotation contained anything it did not. It records, beside it, what
was delivered, and which decision admitted each change.
**Name:** "Revision 1" is this document. It is not entry R1 of
`docs/QUOTATION_AMENDMENTS.md`, which is the withdrawal of the public Offers page.
**Figures:** every count is computed from the repository by `scripts/audit/inventory.py`;
`SCOPE.md` §2 states what each one counts.
**Final scope:** development is complete (OD-37). This revision describes the product that
exists; it proposes no further work.

It separates three things: **A**, what is delivered (§5); **B**, what was approved and
later withdrawn (§6); **C**, what was never delivered and is excluded (§7).

---

## §1 Four layers, kept apart

| Layer | What it is | Where it lives |
|---|---|---|
| 1. Baseline | The quotation as drafted, before signature, prices blank | `docs/commercial/quotation-draft-no-price.md` |
| 2. Signed amendments | The amended quotation the client signed on 4 September 2026 | The signed copy, held by the human outside this repository; its entries are recorded in `docs/QUOTATION_AMENDMENTS.md` |
| 3. Approved changes after signature | Each admitted by a signed OD or decision | `docs/DECISIONS.md` |
| 4. Delivered scope | What exists on `main` today | `SCOPE.md`, and §5 below |

The repository holds the baseline draft and not the signed copy. Layer 2 is therefore
stated only as far as `docs/QUOTATION_AMENDMENTS.md` records it (§3).

## §2 Layer 1 — the baseline

The baseline quoted a responsive public site of eleven pages plus an optional FAQ; an
admin dashboard of eleven items, among them a contact-submissions inbox and an activity
log; and a technical, security and launch package covering security headers, rate
limiting, SEO, analytics, redirects, launch and a staging environment. It excluded
bilingual delivery. Its content volumes and prices are blank in the repository copy. §6
maps each baseline item to its outcome.

## §3 Layer 2 — the signed amendments

`docs/QUOTATION_AMENDMENTS.md` records that the client signed the amended quotation on
4 September 2026, and that three entries rest on that signature:

| Entry | What it did | Source |
|---|---|---|
| A2 | Added brand refinement: the mark, a digital palette, typography direction and a UI design system | OD-07 |
| A7 | Added PartnerLab accounts and private Offers: signup, an Operator-reviewed approval queue, Offers restricted to approved accounts | OD-15 |
| R1 | Removed the public Offers page and the public home Offers band | OD-15 |

The schedule also records three corrections to the draft (C1 payment schedule, C2 phase
line, C3 the inbox struck by D-09) and four further additions (A1 bilingual delivery, A3
Announcements, A4 Clinical notices, A5 photography direction), plus A6 dark theme, which
the client never confirmed. It does not record which of those the signed copy carries.
**The human confirms that against the signed copy before this revision is issued** (§9).

## §4 Layer 3 — approved changes after signature

Each change below was admitted by a signed decision. Decisions that predate the
signature and shaped the baseline — D-01 to D-19, OD-07, OD-08 and OD-15 — are cited in §6
where they apply.

| Change | Decision | Delivered |
|---|---|---|
| Announcements module, listing page and home news band | OD-09, effective under OD-24 | Yes |
| Clinical notices module | OD-09, effective under OD-24 | **No** — withdrawn by OD-37 (§6) |
| YouTube preview inside the dashboard only | OD-14 | Yes |
| The laboratory's published contact details may appear as text | OD-16 | Yes |
| Re-application, rejection persistence and reinstatement of PartnerLab accounts | OD-18 | Yes |
| Revoking an approved PartnerLab, effective against live server state | OD-20, OD-21, OD-28 | Yes |
| Public regions driven by published data, not by placeholders | OD-22, OD-26 | Yes |
| The results-portal URL stays deployment configuration | OD-23 | Yes |
| Design review before cutover; the dashboard's visual language and background on Visitor pages | OD-25, OD-31, OD-34 | Yes |
| Per-module publishing limits enforced in Postgres | OD-27 | Yes — Announcements, maximum 3 |
| Operator-provisioned PartnerLab accounts with a numeric identifier | OD-29, OD-30 | Yes |
| Development credit in the public footer | OD-32 | Yes |
| The published hotline as a call link | OD-33 | Yes |
| Offer expiry as a visibility filter | D-48 | Yes |
| No email sent at PartnerLab signup | D-49 | Yes |
| Cross-script catalogue search behaviour | D-50 | Yes |
| Development complete; delivered state is the final scope; Clinical notices withdrawn; undelivered baseline items excluded | OD-37 | — |

## §5 A. Delivered — layer 4, the current product

### §5a Pages and routes

| What | Count | What is counted |
|---|---|---|
| Public pages | 14 | 13 static patterns and 1 dynamic, each in Arabic and English |
| Public URLs | 44 | 26 static URLs plus 18 programme pages for the nine published programmes |
| Operator dashboard pages | 26 | 3 authentication, 1 home, 22 across the modules |
| PartnerLab pages | 2 | sign-in and sign-up |
| Authentication-related pages | 5 | the 3 dashboard authentication pages and the 2 PartnerLab pages, already counted above |
| Handlers (not pages) | 23 | 4 dashboard authentication, 14 dashboard module, 3 PartnerLab, and 2 outside the language segment (the media route and the web manifest) |

### §5b Backend and API surface

The 23 handlers above are the application's own endpoints: form submissions, sign-out, the
same-origin media route and the web manifest. Public pages read published rows through the
platform's REST interface under row-level security, and the catalogue's tier rule is the
database function `programmeLabTests`, called the same way. Account administration uses the
platform's Auth Admin API from Operator routes only. There is no other API.

### §5c Public site

The approved home composition refined in place (OD-08) and restyled in the dashboard's
visual language (OD-31, OD-34); the four departments, each with its photograph; programmes with tier and audience selection,
programme detail, catalogue search, equipment, videos, branches with a drawn map, news,
contact, lab-to-lab, privacy policy, about, and the outbound results-portal page. Every
content region is state-driven (OD-26).

### §5d Operator dashboard

Eleven modules: Offers, Videos, Equipment, Branches, Programmes, LabUnits, Site Settings,
Media Library, Announcements, LabTests and PartnerLab accounts. Draft and publish on every
record; bilingual editing side by side; server-side validation with typed phone,
coordinate, URL and date controls; typed confirmation before delete; a dashboard home with
per-module counts and a completeness checklist.

### §5e PartnerLab

Self-signup behind a switch, Operator provisioning by numeric identifier, sign-in by email
or identifier with enumeration-neutral responses, pending, approved, rejected and revoked
states, a status screen, and private Offers readable only by approved accounts.

### §5f Authentication and authorisation

Operator: email, password and TOTP, AAL2 plus an Operator claim checked by the application
and by every database write policy. PartnerLab: password only, access decided by live
server state in Postgres. Account administration through the Auth Admin API on Operator
routes only.

### §5g Database and backend

18 forward migrations; 13 tables; 4 enum types; 17 foreign keys; 27 row-level-security
policies, 25 on tables and 2 on storage; 3 functions; 1 trigger; 1 private storage
bucket. Row-level security on every table; no column identifies a person.

### §5h Clinical catalogue and its workflow

9 programmes, 14 tiers, 124 memberships and 71 analyses, each with its Arabic name and an
explicit eligibility, signed by the laboratory's clinical staff on 6 September 2026 and
transcribed into the database. Publication of clinical records requires the signed
artefact; analysis names reach the public site only behind the clinical flag. The tier
cumulation rule is one database function.

### §5i Bilingual Arabic and English

Arabic default, right-to-left composition, English mirrored; language from the address
only; logical properties only; Western digits; Latin runs isolated; 645 interface strings
in each language with parity enforced at build; every content field in both languages,
enforced at publish.

### §5j Search

A build-time index of every published analysis in both languages — names, aliases and
the programmes that include it — queried in the browser.

### §5k Media and photography

A private image library with bilingual alternative text, type and size limits enforced by
the storage bucket, a thumbnail grid with search and drag-and-drop upload, and eleven image
roles across offers, videos, equipment, departments, news, the hero, the favicon, the app
icon and three story photographs.

### §5l Announcements, branches, videos and offers

News with a publishing maximum and a no-medical-instruction affirmation; four branches
with a head office, WhatsApp numbers and map coordinates from a pasted Maps link; videos
from a pasted YouTube link with self-hosted posters and no public embed; offers with
dates, prices and expiry, private to approved PartnerLabs.

### §5m Publication, site settings and content management

Draft and published on every record, bilingual completeness enforced by the database,
unpublish as the default before delete, reorder, and one Site Settings record holding the
hotline, WhatsApp, hours, social links, page copy, default SEO, hero and reason cards and
media roles.

### §5n Security, design, accessibility, SEO and platform

Security controls as listed in `SCOPE.md` §19, with security headers, rate-limit
verification and dependency audit measured in Stage 2 of the handover. A design system with
tokens, components and responsive layouts; accessibility work against `DESIGN_SYSTEM.md`
§8 with three open items (CF-92, CF-208, CF-211). Per-page titles and descriptions,
`hreflang` alternates, the home page's title and description from Site Settings, favicon,
app icon and web manifest. Next.js on Vercel, Supabase in
`eu-central-2`, GitHub, and a continuous-integration job of five project guards, lint,
typecheck, build and a seed check. Nine gates passed; G7 is open.

## §6 B. Approved, then withdrawn

| Item | Approved by | Withdrawn by |
|---|---|---|
| Public Offers page and public home offers band | the quotation baseline, §2.2 | OD-15; quotation schedule R1, signed 4 September 2026. Offers are delivered privately to approved PartnerLabs instead |
| Clinical notices module | OD-09, effective under OD-24 | OD-37. Never built: no table, route or module. OD-24's price covered both OD-09 modules; any commercial effect of the withdrawal is the human's and no figure is stated here |

## §7 C. Never delivered, and excluded

| Item | Excluded by |
|---|---|
| Contact form, booking and incoming-message inbox | D-09, OD-16; correction C3 |
| Analytics and the cookie-consent banner | D-13 |
| A price on a Programme | D-04 |
| A managed partner-laboratory list | D-15 |
| An Operator-editable results-portal URL | D-07, OD-23 |
| Password reset and any email flow for a PartnerLab | D-49, OD-30 |
| A staging database | OD-10 |
| FAQ page | optional in the baseline; no copy supplied |
| Dark theme | schedule A6, never confirmed |
| Patient results, in any form | `BOUNDARY_MODEL.md` |
| Sitemap, robots file and structured data | OD-37 §3 |
| Error monitoring | OD-37 §3 |
| An agreed device matrix with cross-browser and performance checks | OD-37 §3 |
| A featured video and the latest equipment on the home page | OD-37 §3 |
| A telephone number per Branch | OD-37 §3 |
| A category field on a Programme | OD-37 §3 |
| A video player loading on click | OD-37 §3 |

## §8 The baseline, item by item

"Excluded" means a decision removed it. Every baseline item now has an outcome: delivered,
delivered differently, withdrawn, or excluded by the decision named.

| Baseline item | Outcome | Source |
|---|---|---|
| §2.1 Responsive UI and design system, RTL-ready | Delivered, extended by brand refinement | OD-07, OD-08, `DESIGN_SYSTEM.md` |
| §2.2 Home: hero, hotline call, featured offers, featured video, latest equipment | Delivered differently: offers are private; no featured video or equipment band on the home page | OD-15; OD-37 §3 |
| §2.2 About, Laboratory Units, Branches, Online Results, Privacy Policy | Delivered | `SCOPE.md` §3 |
| §2.2 Test Programmes / Packages with tiers and test lists | Delivered, behind the clinical sign-off | PR-08, M8 |
| §2.2 Offers: current published offers | Delivered as private to approved PartnerLabs | OD-15, schedule R1 |
| §2.2 Videos: embedded YouTube | Delivered differently: a poster that opens YouTube, no player | P05-T22; OD-37 §3 |
| §2.2 New Devices / Equipment | Delivered | `SCOPE.md` §3 |
| §2.2 Contact: WhatsApp, click-to-call, map, hours | Delivered; the map is on the branches page and the home page | D-09, OD-33 |
| §2.2 Privacy Policy cookie-consent banner | Excluded: no cookie is set on a Visitor | D-13 |
| §2.2 FAQ, optional | Not built: no copy supplied | `CONTENT_MODEL.md` §3c |
| §2.3 Secure login with optional MFA | Delivered with MFA required | D-08 |
| §2.3 Offers, Videos, Equipment, Laboratory Units, Media Library modules | Delivered | D-16 |
| §2.3 Branches with phone | Delivered with a WhatsApp number per branch, no separate phone | OD-37 §3 |
| §2.3 Test Programmes with category and optional price | Delivered without a category field and without a price | D-04; category OD-37 §3 |
| §2.3 Site Settings | Delivered, without a map value: the map is drawn from branch coordinates | OD-22 |
| §2.3 Contact Submissions inbox | Excluded | D-09, correction C3 |
| §2.3 Activity log | Provided by the platform's logs, not a module | D-16 |
| §2.4 HTTPS, HSTS, CSP and security headers | HTTPS delivered; headers set by Stage 2 hardening | CF-177 |
| §2.4 Server-side validation, secure sessions, secure media upload | Delivered | `ADMIN_SPEC.md` §4g, §3e; bucket policy |
| §2.4 Rate limiting on login and public forms | To be measured in Stage 2 | quotation §2.4 |
| §2.4 Dependency scanning | Stage 2 | CF-214, CF-217 |
| §2.4 SEO: metadata | Delivered | `SCOPE.md` §7 |
| §2.4 SEO: sitemap, robots, structured data | Excluded | OD-37 §3 |
| §2.4 Analytics | Excluded | D-13 |
| §2.4 301 redirects, canonical host, HTTP to HTTPS | Stage 3 runbook, executed at Stage 5 | OD-35 |
| §2.4 DNS cutover, TLS, decommissioning | Stage 3 runbook, executed at Stages 4 and 5 | OD-35 |
| §2.4 Device matrix, cross-browser, performance and accessibility checks | Accessibility work delivered with three open items; no agreed device matrix or performance check recorded | OD-37 §3 |
| §2.4 Protected staging environment | No staging database | OD-10 |
| §3 Stack: Next.js, React, TypeScript, Supabase, Vercel, GitHub CI | Delivered | `SCOPE.md` §20 |
| §3 Stack: Tailwind CSS and Zod | Not used: tokens with CSS modules, and hand-written server validators | technical choice, no scope change |
| §3 Monitoring: error monitoring | Excluded | OD-37 §3 |
| §7 Exclusion of bilingual delivery | Reversed: bilingual, Arabic default | D-10, schedule A1 |

## §9 Known limitations of the delivered state

Recorded, not new work (OD-37 §4). Re-authentication before destructive actions is required
by `SECURITY_MODEL.md` §4 and not delivered; the requirement stands. The Video featured flag
is editable and read by no public page. CI does not run the spec files. Accessibility has
three open items (CF-92, CF-208, CF-211). `SCOPE.md` §26 states each.

## §10 For the human, before this is issued

1. Confirm against the signed copy which of A1, A3, A4, A5 and C1 to C3 it carries.
2. Decide whether this revision goes to the client, and in what form.

## §11 What this revision does not do

It sets no price and changes none, including the price recorded for OD-09 in OD-24. It
does not change the payment schedule (D-12). It does not amend the signed quotation, it
does not describe any item as signed that the schedule does not record as signed, and it
proposes no further development.
