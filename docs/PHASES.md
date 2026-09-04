# NEL — Phases to launch and handover

**Status:** v2 — AUTHORED at P03 · 1 September 2026 · reordered under OD-12
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

**The order below is not the order the phases are numbered in.** `OD-12` reorders delivery to
P03 → P05 → P06 → P04 → P07. Phases keep their identifiers and their gates — G4 is still P04's
gate, it simply falls later — because renumbering would break every historical reference in
`DECISIONS.md`, `CARRY_FORWARDS.md` and the done-steps table.

---

## §3 The phases, in delivery order

Delivery order under `OD-12`: **P03 → P05 → P06 → P04 → P07**.

| Order | Phase | What it produces | Gate | Non-waivable | State |
|---|---|---|---|---|---|
| — | P00 Prepare | Documents, decisions, seed verified | G0 | — | **Closed** |
| — | P01 Foundation | Repository, CI, schema, row-level security, seed import | G1 | Boundary | **Closed** — 31 Aug 2026 |
| — | P02 Design system | Colour and type tokens, RTL primitives, executable lint rules | G2 | — | **Closed** — 1 Sep 2026 |
| 1 | P03 Public site | The thirteen pages, both locales, 42 URLs | G3 | Boundary · Bilingual | **Active** |
| 2 | P05 Admin dashboard | Eight modules, Operator accounts, login and MFA | G5 | Boundary · Bilingual | Next · spec unwritten |
| 3 | P06 Content and Arabic | Arabic test names, clinical review, content entry, sign-off | G6 | Clinical · Bilingual | Longest pole |
| 4 | P04 Catalogue search | Bilingual search over Programmes and LabTests | G4 | Clinical · Data integrity · Bilingual | After P06, by necessity |
| 5 | P07 Hardening and cutover | Headers, DNS, redirects, decommission, repo to private | **G7 launch** | Clinical · Boundary · Bilingual · Data integrity | Runbook unwritten |

### Why this order

**P04 could not have been built where it was.** All 72 `LabTest` Arabic names are empty and
twelve rows carry no Arabic alias either, so an Arabic query has nothing to match. P04's own
non-waivable column already reads Clinical. Placing it before P06 asked for an index over
empty fields. Moving it after P06 is a correction, not a preference.

**P06 needs the dashboard.** P06 is translation, entry and sign-off. The entry half needs
somewhere to type. Without P05 first it means writing SQL by hand, which is the opposite of
what the owner was promised.

**P03 stays first.** Public site before dashboard, so that if the date forces a split the
phasing already matches: a public site without a dashboard is launchable, a dashboard without
a public site is invisible to a visitor. P05 also carries Auth and MFA, the highest-risk work
in the project, and it should not be first.

---

### P03 — Public site · ACTIVE

- [x] **P03-T01** — locale routing, `lang` and `dir` from the URL, twelve static patterns
- [x] **P03-T01-F** — restore the approved home composition at `/{locale}`
- [x] **M5A** — reconcile `DATA_MODEL.md` §6 rows 7–9 against `CONTENT_MODEL.md` §3a
- [x] **P03-T02** — land `PHASES.md`, correct the P04 phase name
- [x] **M5B** — create `"Offer"`, `"Equipment"`, `"Video"` with row-level security
- [x] **P03-T03** — OD-12, `PHASES.md` v2, and the phases guard
- [x] **M5C** — apply M5; eight tables become eleven
- [x] **P03-T04** — Offers, Videos and Equipment listing pages *(needs M5B)*
- [x] **P03-T05** — Programmes and Departments listings
- [x] **P03-T05-F** — Isolate whole Latin runs, not single words
- [x] **P03-T06** — Branches page and the drawn map *(needs branch addresses)*
- [x] **P03-T07** — Contact, results portal, privacy policy, lab-to-lab
- [x] **P03-T08** — Programme detail template *(renders zero pages until P06)*
- [x] **P03-T09** — remove console scaffolding, stage the G3 evidence pack
- [x] **G3-R** — recorded the G3 gate
- [x] **G3** — rendered evidence in both locales on every page; boundary and bilingual gates

### P05 — Admin dashboard · NEXT

- [x] **P05-T00** — `ADMIN_SPEC.md` — authored one step ahead (CF-91)
- [x] **P05-T01a** — close out the stale region statements
- [x] **P05-T01b** — two repairs; Auth halted before STEP 3
- [x] **P05-T01c** — OD-13, Auth, enrolment and sessions with executable proof
- [x] **P05-T01c-F** — Narrow the R3 exemption to the files that need it
- [x] **P05-T01c-F2** — Define what a checked box means, and make the guard enforce it
- [ ] the two real Operator accounts, created with their factors enrolled
- [x] **P05-T02** — Site Settings module
- [x] **P05-T04** — Compose the dashboard against the design system
- [ ] **P05-T05** — Restore the §9 page wash, and put it behind the dashboard too
- [x] **P05-T06** — Restore the hex lattice and reconcile §9 with what was approved
- [x] **P05-T07** — Fix the dashboard scroll, then feedback states
- [x] **P05-T10** — Media Library module, bucket authored unapplied
- [x] **P05-T10A** — Fix the submit-button action fallback
- [x] **P05-T10B** — Remove the ownership line, then apply the bucket
- [x] **P05-T10C** — Fix Site Settings save, and complete T10B's verification
- [x] **P05-T11** — Validation and field types
- [x] **P05-T12** — Wire the chrome, add a dashboard home, centre the containers
- [x] **P05-T13** — Land OD-14 and the expiry rule, then Videos and Media Library
- [x] **P05-T14** — Site Settings and Branches: maps links, phone fields, proof residue
- [x] **M7A** — Read-first audit of the role split
- [x] **P05-T15A** — Record the OD-15 client approval
- [ ] **P05-T15B** — Record the countersignature, close CF-50, narrow CF-69 and CF-74
- [x] **P05-T08** — Branches and LabUnits modules
- [x] **P05-T09** — Offers, Videos and Equipment modules
- [ ] Programmes, tiers and memberships module
- [ ] **G5** — the owner can edit every unlocked region himself

### P06 — Content and Arabic · LONGEST POLE

- [ ] 72 Arabic `LabTest` names — written and reviewed
- [ ] 121 membership judgements — which tests belong to which programme and tier
- [ ] 5 QA-flagged records — two high severity, resolved with the lab
- [ ] Written clinical sign-off — not waivable by anyone, including the client
- [ ] Content entry — through the dashboard, not through SQL
- [ ] **G6** — clinical and bilingual gates

### P04 — Catalogue search · AFTER P06

- [ ] static bilingual index over Programmes and LabTests
- [ ] search on the البرامج page, both locales
- [ ] **G4** — clinical, data integrity and bilingual gates

### P07 — Hardening and cutover · LAUNCH

- [ ] `CUTOVER_RUNBOOK.md` — authored one step ahead
- [ ] security headers
- [ ] DNS move and redirects from the 2018 URLs
- [ ] decommission the old site
- [ ] revert the repository to private (OD-04)
- [ ] Owner handover — unscoped, see §5
- [ ] **G7** launch — all four standards

---

## §3a The checklist rule

Every box above is **derived, never hand-maintained**, because a second source of truth drifts
from the first and that is how `CF-86` happened.

- A **task box** is checked if and only if `docs/SESSION_CONTEXT.md` carries a done-step row
  with that exact task id whose Verdict cell certifies the work as done — a PASS-prefixed
  verdict, or a FAIL-prefixed verdict that has a fix-task row (`{id}-F`, or `{id}-F2` and
  onward for a chain). The placeholder `pushed — verdict at push` is not a certification.
- A **gate box** is checked if and only if the phase map's Gate cell for that phase reads
  `PASSED`.
- A task with no done-step row is unchecked. A task not yet issued has no row.
- A **task** checklist item carries a task id only once that task has been issued.
  Until then the item is id-less prose. A **gate** box always carries its bold id,
  checked or not, because a gate is never issued and its id is permanent; only
  task items drop their id while unissued. `guard:phases` R1–R4 and R6 read `**<id>**`
  boxes; R5 is the pipe-count rule on the done-steps table; an id-less item is ignored.

A checked box means the work is done and certified, not that the task
passed on its first attempt. A task that FAILED and was repaired by a
named fix task is checked, and its Verdict cell keeps the FAIL — the
checklist shows what is built, the Verdict column shows what it took.
P03-T01 and P03-T05 are both checked and both record a FAIL.

A box may therefore be checked while its verdict is FAIL only when a fix
task for it exists in the done-steps table. A FAIL with no fix task is an
unfinished failure and stays unchecked.

**The Verdict cell is the weak link and this rule repairs it.** Verdicts are issued in review
and, until now, were almost never written back: at v2 only one of the four most recent task
rows carried a verdict, the rest still reading `pushed — verdict at push`. A verdict that
lives only in a conversation is not a record.

So: **every task fence records the preceding task's verdict as its first step**, before doing
its own work, and updates that task's box here in the same commit. A task cannot begin until
its predecessor's verdict is written down. This is the rule that keeps the checklist true
without anyone maintaining it by hand. At a phase boundary the last task's verdict has no
successor task, so the gate record carries it.

**Every task fence also states its phase and verifies this file's state for that phase before
doing work.** A fence whose phase is closed, or whose predecessor box is unchecked, halts and
reports rather than proceeding.

`scripts/guard/phases.mjs` enforces all of the above in CI alongside the naming and design
guards, and fails the build when a box disagrees with the done-steps table. It parses the
table **from the right** — Date is the last cell, Verdict the one before it — because the Task
cell frequently contains unescaped `|` characters. It also fails any done-step row whose pipe
count does not match the four-column header, since such a row renders incorrectly wherever
Markdown is displayed.

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
eleven tables, row-level security on every one, twenty-two policies, seed loaded and verified.
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
