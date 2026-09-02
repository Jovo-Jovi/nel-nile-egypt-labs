# Research — extraction evidence only

**PR-09: never current truth, never a parity target.**

These justify decisions. When someone asks in month three why the hotline is
15504 and not 16402, the answer is `11-research-findings.md` §2.

| File | What it is | Date |
|---|---|---|
| `01-audit-brief.pdf` | Unauthenticated public audit — 9 findings, 1 critical | 16 Aug 2026 |
| `02-architecture-and-user-journeys.pdf` | First architecture pass — **superseded** by the method docs | Aug 2026 |
| `03-original-quotation-superseded.pdf` | Original 65,000 EGP quotation — **superseded**, kept for history | Aug 2026 |
| `04-spec-and-gap-review.md` | Consolidated spec, 25 gaps, 7 contradictions found across the first three documents | 18 Aug 2026 |
| `05-owner-form-en-source.md` | English source text of the client questionnaire | Aug 2026 |
| `06-owner-form-ar-blank.docx` | Arabic RTL questionnaire as sent to the client | Aug 2026 |
| `07-owner-form-ar-ANSWERED.docx` | **The client's returned answers.** Selections marked by highlighting, extracted from the document XML | Aug 2026 |
| `08-form-review-and-next-steps.md` | Review of the returned form — what was answered, what was missing | 24 Aug 2026 |
| `09-locked-baseline.md` | Decisions closed after the client's rulings. **Feeds `SCOPE.md`** | 24 Aug 2026 |
| `10-research-prompt.md` | The open-source research brief, incl. the disambiguation list for seven confusable Cairo labs | 24 Aug 2026 |
| `11-research-findings.md` | Research results — branches, domains, assets, clinical defects, conflicts | 24 Aug 2026 |
| `12-research-reconciliation.md` | Findings reconciled against the baseline | 24 Aug 2026 |
| `13-brand-extraction.md` | Brand extraction evidence — colour, logo, typography, template fingerprint across the results portal, the 2018 site and the Facebook page | 26 Aug 2026 |
| `14-brand-extraction-portal-login.md` | Site 1 supplement — the results portal `/Login/` static HTML and bundled global CSS, authorised under OD-06 | 26 Aug 2026 |
| `15-mark-colour-sampling.md` | Pixel-level colour sampling of the two committed mark binaries — favicon (source of record) and Facebook cover (corroboration), no network access | 27 Aug 2026 |
| `16-owner-approved-composition.md` | Approval evidence for the composition the client approved on 29 August 2026, promoted under OD-08. Not a specification — `DESIGN_SYSTEM.md` §9 governs. Moved here from `docs/` at P01-T03-R-M1 | 29 Aug 2026 |
| `g3-evidence.md` | Computed facts a build can prove at P03 exit. Not a model document, not a G3 verdict. CF-59 and CF-60 are named as absent | 2 Sep 2026 |

## Still to land here

**`clinical-signoff-<date>.<ext>`** — the lab's written corrections to the five
flagged LabTest defects and four missing tests.

Until it arrives, LabTest content stays behind the feature flag (PR-08) and
**CF-01 stays open**. This is the longest lead time in the project and the only
carry-forward that can hold the launch.
