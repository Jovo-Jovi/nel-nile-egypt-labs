# NEL — Phases to launch and handover

**Status:** AUTHORED at P03 · 1 September 2026
**Precedence:** navigational only. This document decides nothing. Where it disagrees with
`PRODUCT_BRIEF.md`, `GLOSSARY.md`, `DECISIONS.md`, `SCOPE.md`, `CONTENT_MODEL.md`,
`BOUNDARY_MODEL.md`, `SECURITY_MODEL.md`, `I18N_MODEL.md`, `DATA_MODEL.md`,
`DESIGN_SYSTEM.md` or a signed OD, that document wins and this one is amended.
**Companion:** the client-facing Arabic summary of 29 August 2026, *ملخص المشروع*. Section §1
maps every promise in that summary to the phase that delivers it.

> This exists because the road from here to launch lived in a nine-row table inside
> `SESSION_CONTEXT.md` and nowhere else, and because the owner-facing summary describes a
> deliverable that no internal document maps onto phase by phase.

---

## §1 What the owner was promised, and where each promise lands

The Arabic summary of 29 August 2026 makes four sets of promises. Every one is traced here.

### §1a The thirteen pages

Twelve static route patterns plus one dynamic, each in Arabic and English, enumerated in
`CONTENT_MODEL.md` §3c. Twenty-four static URLs render today; the eighteen Programme detail
URLs render only after publication, which is a clinical act (§4).

| # | Summary page | Route | Delivered in | Renders today |
|---|---|---|---|---|
| 1 | الرئيسية | `/{locale}` | P03 | Yes — the approved composition |
| 2 | من نحن | `/{locale}/about` | P03 | Shell, gated |
| 3 | الأقسام | `/{locale}/departments` | P03 | Shell, gated |
| 4 | البرامج | `/{locale}/programmes` | P03 listing · **P04 search** | Shell, gated |
| 5 | العروض | `/{locale}/offers` | P03, after M5 | Shell — **no table yet** |
| 6 | الفيديوهات | `/{locale}/videos` | P03, after M5 | Shell — **no table yet** |
| 7 | الأجهزة | `/{locale}/equipment` | P03, after M5 | Shell — **no table yet** |
| 8 | الفروع | `/{locale}/locations` | P03 | Shell, gated |
| 9 | تواصل معنا | `/{locale}/contact` | P03 | Shell, gated |
| 10 | نتائج المرضى | `/{locale}/online-results` | P03 | Shell, gated |
| 11 | سياسة الخصوصية | `/{locale}/privacy-policy` | P03 | Shell, gated |
| 12 | خدمة معمل لمعمل | `/{locale}/lab-to-lab` | P03 | Shell, gated |
| 13 | صفحة لكل برنامج | `/{locale}/programmes/{slug}` | P03 route · P06 content | **Zero pages** — every row is draft |

Pages 5, 6 and 7 have no database table. `DATA_MODEL.md` §6 specifies `"Offer"`,
`"Equipment"` and `"Video"` as rows 7–9; no migration creates them. That is M5, and it is the
next piece of work.

### §1b The ten dashboard modules

Eight are signed scope under D-16 and land at P05. Two are **draft, unpriced and unsigned**.

| # | Summary module | Entity | Status |
|---|---|---|---|
| 1 | العروض | `Offer` | Signed. Table at M5, module at P05 |
| 2 | الفيديوهات | `Video` | Signed. Table at M5, module at P05 |
| 3 | الأجهزة | `Equipment` | Signed. Table at M5, module at P05 |
| 4 | الفروع | `Branch` | Signed. Table exists. Module at P05 |
| 5 | البرامج | `Programme`, `ProgrammeTier`, `ProgrammeLabTest` | Signed. Tables exist. Module at P05 |
| 6 | الأقسام | `LabUnit` | Signed. Table exists. Module at P05 |
| 7 | إعدادات الموقع | `SiteSettings` | Signed. Table exists. Module at P05 |
| 8 | مكتبة الوسائط | `MediaAsset` | Signed. Table exists. Module at P05 |
| 9 | الأخبار | `Announcement` | **OD-09 DRAFT — unsigned, unpriced.** No table, no spec |
| 10 | التنبيهات الطبية | `ClinicalNotice` | **OD-09 DRAFT — unsigned, unpriced.** No table, no spec |

The summary marks 9 and 10 as `+ إضافة` requiring separate pricing, which is accurate. Until
OD-09 is signed, `CONTENT_MODEL.md` §3d correctly enumerates eight and they are out of scope.
Their tables would be M6, after M5.

### §1c The clinical-notice rule

The summary states it as a system constraint rather than a staff policy:

> «لا يُنشر أي تنبيه طبي على الموقع قبل اعتماده كتابيًا من الطاقم الطبي للمعمل.»

That is enforceable and specified. `DATA_MODEL.md` §6 row 13 carries `signed_by`, `signed_at`
and `signed_text_hash` on `"ClinicalNotice"`; the hash is what makes an edited notice revert
to pending automatically rather than relying on anyone remembering. It ships when OD-09 does.

### §1d The visual identity

Delivered and closed at G2. The palette was measured from the client's own flask mark, the
2018 template's colours and logo were identified as a purchased template's property and
discarded, contrast meets AA, and the typeface is self-hosted rather than served from a third
party. `DESIGN_SYSTEM.md` v5 is the record.

---

## §2 Reading the phase names

Two names mislead if read literally, so they are stated plainly here.

**"P04 — LabTest search" is not a search of the results portal.** It is the internal search on
page 4, البرامج, over this project's own catalogue: 9 Programmes, 72 LabTests, 121
memberships, in Arabic and English. It answers "does this lab run this test, and which
programme includes it". The results portal on page 10 is a separate application on a
different host; the site links to it and does nothing else. A search over patient results
would require holding patient data, which `BOUNDARY_MODEL.md` forbids and which nobody on this
project has access to. The two are unrelated, and the naming should be read as
**catalogue search**.

**"P07 — cutover" is infrastructure, not handover.** Its contents are headers, DNS, redirects,
decommission and reverting the repository to private. Nothing in it hands anything to the
owner. See §5.

---

## §3 The phases

| Phase | What it produces | Gate | Non-waivable | State |
|---|---|---|---|---|
| P00 Prepare | Documents, decisions, seed verified | G0 | — | **Closed** |
| P01 Foundation | Repository, CI, database schema, row-level security, seed import | G1 | Boundary | **Closed** — G1 passed 31 Aug 2026 |
| P02 Design system | Colour and type tokens, RTL primitives, executable lint rules | G2 | — | **Closed** — G2 passed 1 Sep 2026 |
| P03 Public site | The thirteen pages, both locales, 42 URLs | G3 | Boundary · Bilingual | **Active** |
| P04 Catalogue search | Bilingual search over Programmes and LabTests, page 4 | G4 | Clinical · Data integrity · Bilingual | Blocked on clinical sign-off |
| P05 Admin dashboard | Eight modules, Operator accounts, login and MFA | G5 | Boundary · Bilingual | Not started · spec unwritten |
| P06 Content and Arabic | Arabic test names, clinical review, content entry, sign-off | G6 | Clinical · Bilingual | Not started · longest pole |
| P07 Hardening and cutover | Security headers, DNS, redirects, decommission old site, repo to private | **G7 launch** | Clinical · Boundary · Bilingual · Data integrity | Not started · runbook unwritten |

### P03 — Public site · active

Done: locale routing with Arabic default, `lang` and `dir` set from the URL, twelve static
patterns rendering in both languages, the approved home composition live, and the Programme
detail route failing closed with zero pages because nothing is published.

Remaining, in order:

1. **M5** — create `"Offer"`, `"Equipment"` and `"Video"` with row-level security. Until this
   lands, pages 5, 6 and 7 have nowhere to read from.
2. **Listing pages** — Programmes, Offers, Videos, Equipment, Branches, Departments.
3. **Programme detail** — the route exists; it renders when P06 publishes.
4. **Contact, portal, privacy, lab-to-lab** — content from `SiteSettings`.

G3 requires rendered evidence in both locales on every page and proof that no page collects
personal data or couples to the results portal beyond an outbound link.

### P04 — Catalogue search

A static bilingual index over the catalogue, served on page 4. It cannot be built usefully
before P06 for a measurable reason: **all 72 LabTest Arabic names are empty**, and twelve rows
carry no Arabic alias either, so an Arabic query has nothing to match. The index is gated —
no artefact is emitted at all while the clinical flag is off.

### P05 — Admin dashboard

Eight modules, Operator accounts, login and MFA on at least two accounts. `ADMIN_SPEC.md` does
not exist yet and is authored one step ahead of this phase, not sooner. Everything the summary
promises the owner will edit himself — images, offers, videos, equipment, branch details,
WhatsApp number, opening hours — becomes editable **here**, not before. Between now and P05
the site renders gated regions with labelled frames rather than invented content, which is the
`لا يوجد محتوى وهمي` promise in the summary.

### P06 — Content and Arabic · the longest pole

Four things, none of which a developer can do alone:

1. **72 Arabic LabTest names** written and reviewed. Mistranslating a test name on a
   laboratory site is a clinical harm, so this is senior work and then goes to the lab.
2. **121 membership judgements** — which tests belong in which programme and tier.
3. **Five QA-flagged records**, two of them high severity, where the 2018 source is
   internally inconsistent.
4. **Written clinical sign-off.** Not waivable by anyone, including the client.

Nothing renders until this lands — not one Programme page, not one test name. The database is
already built to fail closed: every row is draft and returns nothing to anyone.

### P07 — Hardening and cutover

Security headers, DNS move, redirects from the 2018 URLs, decommissioning the old site, and
reverting the repository to private. `CUTOVER_RUNBOOK.md` does not exist yet and is authored
one step ahead. **This phase currently contains no handover to the owner** — see §5.

---

## §4 What the owner supplies, and what each unblocks

Five items, from the summary's section خامسًا. None can be produced by anyone else, and each
one blocks a specific, named thing.

| # | Material | Blocks | Needed by |
|---|---|---|---|
| 1 | The mark as SVG or any scalable format | The 16px favicon and the 180px app icon. The 83×100 raster cannot serve either | P03 |
| 2 | Photography — frontage, departments, equipment, branches | Every image slot; each renders a labelled frame until they land | P05 entry |
| 3 | Accreditation evidence — scheme, number, issuing body, expiry | Any accreditation claim. An unverified claim is a regulatory exposure | P06 |
| 4 | The four branch addresses | Accurate map pins. Unverified geography is a defect, not a placeholder | P05 |
| 5 | **Clinical sign-off** on test names, programme names and notices | P04 entirely, P06 entirely, G7 | P06 |

Twenty-one regions across the site currently render a pending state waiting on items 1–4.
Each shows what it is missing rather than a stand-in.

---

## §5 Promised or implied, but not yet scoped

Three gaps. Each is a decision for the human, not a task.

**Owner handover is not in any phase.** Searching every document for handover, training,
warranty, support period or acceptance returns nothing. P07 ends at "launch" and the owner
receives no training on the dashboard, no credential transfer procedure, and no acceptance
step where he confirms he has what he paid for. `D-12` puts **30% of the fee — the largest
instalment — at P07 launch**, so the biggest payment is gated on a phase whose written scope
does not include handing anything over. This needs an OD adding handover content to P07, or
it is unpaid work.

**OD-09 is drafted, not signed.** Modules 9 and 10 appear in the owner summary marked as
priced additions. They have no table, no specification and no phase. If signed, they add an M6
migration and two modules to P05.

**`QUOTATION_AMENDMENTS.md` §5 is out of date and it is client-facing.** Blocker B6 still
reads that there is no schema and that work cannot start. The schema has been live since M4 —
eight tables, row-level security on every one, sixteen policies, seed loaded and verified.
Sent to the client today, that document understates the project badly.

---

## §6 Payment against phases

`D-12`: 30% at signature · 20% at P03 exit · 20% at P05 exit · 30% at P07 launch.

| Instalment | Gate | Earned when |
|---|---|---|
| 30% | Signature | The revised quotation is signed. **Outstanding** |
| 20% | G3 | The thirteen pages render in both languages and pass the boundary and bilingual gates |
| 20% | G5 | The owner can edit the site himself through the dashboard |
| 30% | G7 | Launch — and, if §5 is resolved, handover |

---

## §7 What stops the project today

Two things, and neither is engineering.

**The signature.** `OD-03` holds scope frozen and **lapses 15 September 2026**. By its own
terms no further build task issues after that date until a new freeze is signed. P03, P04,
P05, P06 and P07 are all build phases. One signature prevents this.

**The clinical work.** It has not started, it is the longest item on the schedule, and it
cannot be compressed by adding developers. Seventy-two Arabic names, 121 judgements, five
flagged records, and a signature from the lab's clinical staff. It can begin in parallel with
P03 today, and starting it now is the single highest-value thing the client can do.

Everything else is sequenced and has no blocker. The database is live, the design system is
closed, the routing is built, and the approved home page renders in Arabic and English.
