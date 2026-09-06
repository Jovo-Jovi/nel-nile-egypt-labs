# Clinical catalogue sign-off

Status: SIGNED

Signatory: Androw
Role: Laboratory
Date: 6 September 2026
Approved worklist SHA-256: `22b2c73b697460b2def3a86e4b6489c987874a071c4d9c0f792a46612197569f`

---

## What this document is

This is the artefact the publish gate reads. While its status line reads
`PENDING`, the dashboard refuses to publish any `Programme`, `ProgrammeTier`,
`ProgrammeLabTest` or `LabTest` row, and the refusal names this file.

It is not a formality and it is not waivable. It is the point at which
responsibility for the published clinical catalogue passes to the laboratory,
and it carries a date for that reason.

## The document this signature attaches to

- Path: `docs/research/clinical-worklist.md`
- SHA-256: `22b2c73b697460b2def3a86e4b6489c987874a071c4d9c0f792a46612197569f`
- Contents: 71 laboratory tests with Arabic names, 124 programme memberships
  with eligibility, 5 resolved QA findings, 4 description decisions.

The signature attaches to that exact document. If it is reissued, its hash
changes and this sign-off does not carry over.

## Scope

This signature covers the clinical decisions recorded in that document, and
nothing else:

- **71 `LabTest` Arabic names.** 67 supplied by the laboratory; 4 drafted for
  the laboratory to validate, marked `draft` in Section A.
- **124 `Programme` membership eligibility decisions.** 119 supplied by the
  laboratory; 3 carried from the row they replace or split, marked
  `inherited`; 2 following the laboratory's own answer for every other row in
  the same tier, marked `tier`.
- **5 QA-flagged records**, all resolved by the laboratory on 6 September 2026.
- **4 description decisions**, all answered by the laboratory on the same date.

Anything outside that document is outside this signature. A later change to
the catalogue is a later sign-off.

## Cells the laboratory has not stated directly

Six cells in that document were not written by the laboratory. They are marked
in place so the signatory can find them, and this signature covers them:

- 4 Arabic names — `ast`, `esr`, `fsh`, `app-afp` — drafted following the
  laboratory's own naming convention, because their English identity was only
  settled by the laboratory's answers on 6 September.
- 2 eligibility values — `alt` in the Children tier and `testosterone-free` in
  the Infertility female panel — following the laboratory's own answer for
  every other row in the same tier.

**Read those six before signing.** They are the only cells where a signature
converts a draft into an approved clinical decision.

## Catalogue amendment recorded by this signature

The laboratory's answers changed the catalogue itself. Signing confirms the
amendment as well as the content:

- `creatinine-urea-combined` is removed and replaced by `creatinine` and `urea`
  as separate tests.
- The Gold tier entry recorded as `fsh` is `tsh`. `fsh` remains valid in both
  Infertility panels.
- `app-afp` becomes `AFP (Alpha-Fetoprotein)`.
- `alt` is added to the Children tier; `testosterone-free` is added to the
  Infertility female panel.
- Cystatin C and AMH are not offered and must not appear in any description.

The data-integrity assertion changes from `121 -> 72` to `124 -> 71`.

## Allocation of responsibility

**The laboratory is responsible for the clinical accuracy of the published
catalogue.** Not the developer, not the reviewer, not any language model used
at any point in this project.

- The **developer and reviewer** built the system, transcribed the answers and
  verified that what was entered matches what was returned.
- **Language models** drafted structure, drafted the four Arabic names above,
  and reviewed wording. No model decided what a test is, which programme it
  belongs to, or who it applies to. Every such decision in the referenced
  document came from the laboratory.
- The **2018 website** is extraction evidence containing the five errors
  resolved above. It is never a source of truth.

A clinician at the laboratory reviews and approves every name, every
eligibility and every resolution before this document is signed. Signing
asserts that this happened.

## Acknowledgement

By signing, the laboratory confirms:

1. A person with clinical authority has reviewed all 71 Arabic `LabTest` names,
   including the four marked `draft`, and approves each for publication.
2. That person has reviewed all 124 membership eligibility decisions, including
   the two marked `tier`, and approves each.
3. The 5 QA-flagged records are resolved as recorded.
4. The 4 description decisions are as the laboratory intends.
5. The catalogue amendment above is correct.
6. The laboratory accepts responsibility for the clinical accuracy of the
   published catalogue.

## How to sign

Complete the Signatory, Role and Date lines above, then change the status line
so the word after `Status:` reads the approval keyword in capitals instead of
`PENDING`, with nothing else on that line.

The gate compares whole lines after trimming. **Do not paste an example of the
completed status line anywhere in this file** — a line consisting of that
keyword alone opens the gate wherever it appears, including inside a code block
or a comment.

---

## Build-side requirements — not part of the signature

These are the developer's, not the laboratory's. Neither is satisfied, and
both must be closed before this signature has any effect in production.

**1. The artefact must reach the deployment bundle.** `hasClinicalCatalogueSignOff()`
reads this file from `process.cwd()` at request time and `next.config.ts`
declares no `outputFileTracingIncludes`, so on the current deployment the file
is absent, the read throws, and publish is refused even after signing. Failing
closed is correct; a gate the intended process cannot open is not. **CF-128**,
reviewer, P07.

**2. The verification key must be stronger than two literal strings.** The gate
opens on a heading line and a status line, both of which anyone who can write to
the repository can type. It should verify that the scope names the worklist by
the hash recorded here, and that the signatory and date lines are completed.
**CF-129**, reviewer, G6.

Until both are closed, treat a signed copy of this document as a record of the
laboratory's approval and not as evidence that the production gate will open.
