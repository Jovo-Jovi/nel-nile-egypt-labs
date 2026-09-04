# NEL — Quotation Amendment Schedule

**Status:** AUTHORED at P02-T16 · 29 August 2026
**Purpose:** every addition to, deletion from, or correction of the draft quotation
recorded in one place, so a single repricing conversation replaces six scattered ones.
**Authority:** this document **sets no price**. It states what changed, why it sits
outside the draft, and what each entry depends on. Pricing is the human's, and `SCOPE.md`
still derives from a signed quotation, not from this file.
**Precedence:** subordinate to `DECISIONS.md` and `SCOPE.md`. Where this schedule appears
to disagree with a signed OD, the OD wins and the disagreement is a defect in this file.

Counts stated here are enumerated in the tables below and verified programmatically
before landing (PR-01, PR-28).

---

## §1 Why this exists, and the date that matters

`OD-03` froze scope against the draft quotation on 25 August 2026 and **lapses 15
September 2026** if no signed quotation is filed. Its own text: *"if 15 September 2026
arrives with no signed quotation, this OD expires and no further build task is issued
until a new freeze is signed."*

The amended quotation was signed on 4 September 2026. That signature files the
quotation OD-03 named and retires the two unfiled approvals CF-50 carried: brand
refinement, already built, and the withdrawal of the public Offers page. The
15 September lapse path therefore does not fire. Whether the signature also
discharges OD-03's freeze role is a reviewer ruling; this file records the
signature, not that finding.

Eleven entries have accumulated against the quotation. A2, A7 and the scope
removal R1 now rest on that signature.

---

## §2 Corrections to the draft — no new work

Three entries where the draft is simply wrong and the repair carries no additional scope.

| # | Item | Draft says | Reality | Source |
|---|---|---|---|---|
| C1 | Payment schedule | three milestones, §5 and §13 | 30% at signature · 20% at P03 exit · 20% at P05 exit · 30% at P07 launch | D-19, CF-17 |
| C2 | Phase line | no P01 line exists | P01 is a phase with its own exit | CF-17 |
| C3 | Incoming-message inbox | included | struck; WhatsApp is the only contact channel | D-09 |

C3 **removes** work from the draft. It should be netted against the additions below rather
than forgotten — the inbox was quoted and is not being built.

---

## §2a Scope removal — withdrawn from the public deliverable

A removal is not a correction of a drafting error and not an addition of work.
The client is losing a page he was promised, and it is recorded here so the
schedule shows that plainly. The client's signature on the amended quotation,
4 September 2026, is the authoritative record of this agreement.

| # | Item | Draft says | Reality | Source |
|---|---|---|---|---|
| R1 | **Public Offers page and home Offers band** | Public page 5 (`/{locale}/offers`); G3 certified it rendering publicly | Withdrawn from the public deliverable by the client's signature on the amended quotation, 4 September 2026. An anonymous Visitor will see an authentication-required state; no title, description, price or image. The home Offers band becomes the same state. Not executed in this phase — that is P08, after G5 | OD-15, CF-50 |

---

## §3 Additions requiring a price

Seven entries. Each is outside the draft quotation as written.

| # | Item | Why it is outside the draft | Depends on |
|---|---|---|---|
| A1 | **Bilingual delivery** | Draft §7 and §9 **exclude** bilingual. `D-10` makes Arabic the default and English secondary. This is not a translation line — it doubles the copy surface, the review surface and the acceptance evidence, and it constrains the type system (`I18N_MODEL.md`) | CF-18 |
| A2 | **Brand refinement** | Absent from the draft. Logo refinement and vector reconstruction, four variants, a digital palette, typography direction, and a UI design system. Approved by the client's signature on the amended quotation, 4 September 2026 | OD-07, CF-49, CF-50 |
| A3 | **Announcements module** | The draft has eight dashboard modules. `D-15` states there is no ninth; `D-16` enumerates the eight. A news and posts stream is a ninth | OD-09 |
| A4 | **Clinical notices module** | A tenth module, and the only one carrying medical copy. Requires a distinct publication workflow because the clinical gate applies to it and not to Announcements | OD-09 |
| A5 | **Photography direction** | The lab supplies the files (`08-form-review:73`). Art direction, selection, cropping to the §9 ratios and optimisation are not the same as supplying a folder | §9, CF-72 |
| A6 | **Dark theme** | Requested at the reference-design review. A second theme roughly doubles the AA certification matrix: every token pair in `DESIGN_SYSTEM.md` §3 is verified twice, in both locales | not yet decided |
| A7 | **PartnerLab accounts and private Offers** | Absent from the draft. Open signup; an Operator-reviewed approval queue; `/{locale}/offers` and the home Offers band restricted to approved accounts; one shared price list with no per-Lab pricing; the role split (M7) that must precede it. D-09 prices its own reversal — an approval inbox — at a `BOUNDARY_MODEL.md` amendment plus a changed compliance position plus separate paid scope. This is that scope. Approved by the client's signature on the amended quotation, 4 September 2026 | OD-15, D-09, CF-50 |

A6 is the only entry the client has not confirmed wanting. It is included so it is
priced or dropped deliberately rather than absorbed. A7 is wanted and signed; it
is unpriced (OD-15 §10).

---

## §4 What is already in scope and needs no price

Stated so it is not accidentally repriced.

- Editing **video links and descriptions** — `Video`, module 2, in the draft.
- Editing the **hero image and other page images** — `MediaAsset`, module 8, in the draft.
- **Operator login and MFA** — `D-08`. Login is authentication, not a module.
- The four **structural counts** and `LabUnit` names on the public site.

Three of the client's five dashboard requests are already paid for. Two are not.

---

## §5 Dependencies that no amount of money resolves

These are not commercial entries. They gate delivery regardless of what is signed.

| # | Blocker | Owner | Effect |
|---|---|---|---|
| B1 | **Clinical sign-off** on every `LabTest` name, `Programme` name and clinical notice | the lab's clinical staff | Non-waivable. Those regions ship gated `pending` until the signature exists (`DESIGN_SYSTEM.md` §12) |
| B2 | **Certification evidence** — scheme, number, issuing body, expiry | client | No accreditation claim renders without a supplied document. An unverified claim is a regulatory exposure |
| B3 | **The mark as vector** | client | The 83×100 raster does not satisfy §7's 16px favicon and 180px app icon (CF-74) |
| B4 | **Photography files** | client | Every image slot renders a labelled frame until they land (CF-72) |
| B5 | **`Branch` addresses** | client | Client-locked in `docs/research/09-locked-baseline.md`. Unverified geography remains a defect (CF-69); the addresses themselves are not unsupplied |
| B6 | **CF-34 — no local Postgres, no container runtime, no shell elevation** | human | **P01-T03-R cannot start. There is no schema, so nothing wires.** Every task since P02 opened has been documents or a mock because that is all that has been available |

**B6 is the real blocker on the project, not the price.** Signing the quotation unfreezes
scope; it does not produce a database.

---

## §6 The one conversation to have

Seven additions, three corrections, one deletion to net off (C3), one scope removal
(R1 — the public Offers page and the home Offers band), five client dependencies.
In a single message rather than six:

1. **The signature** — landed 4 September 2026. CF-50 is closed. Brand refinement
   and OD-15's withdrawal of the public Offers page both rest on that signature.
2. **The two new modules** — Announcements and Clinical notices, priced, with the clinical
   workflow explained rather than assumed.
3. **A7 — PartnerLab accounts and private Offers** — open signup, an Operator-reviewed
   approval queue, Offers restricted to approved accounts, one shared price list, and
   the role split that must precede it. D-09's own terms: this is separate paid scope.
4. **Dark theme** — wanted or dropped.
5. **What he still owes** — vector mark, photography, certification documents, clinical
   sign-off, and four answers: working hours, coordinate authority, the fourth branch's
   identity, and whether the two Google-listed branch phone numbers publish. Attaching the
   §12 `pending` list from the P02-T15 report makes this concrete: twenty-one regions on
   the page he approved are waiting on him, not on us.

---

## §7 What this document does not decide

- Any price, rate, or total. The human's, entirely.
- Whether A6 is wanted.
- Whether the 4 September 2026 signature discharges OD-03's freeze role. OD-03 is
  unamended. The reviewer rules.
- What `SCOPE.md` says, which derives from a **signed** quotation and not from this
  schedule.
