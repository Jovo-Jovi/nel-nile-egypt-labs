# Client outbound

**Not build inputs.** These are questions, not data. Nothing here is imported.

## `qa-missing-tests.csv`

Four LabTests named in a Programme's own description but absent from its test
list — Cystatin C (Kidney), AMH and Testosterone (Infertility female), ALT
(Children tier).

Send to the **lab's clinical staff**, together with the five `qa_flag` rows in
`data/seed/tests.csv`. Send it on its own — not buried in a list of admin
questions.

When corrections come back in writing, file the reply in `docs/research/` as
`clinical-signoff-<date>` and close **CF-01**. That is the only event that lifts
the feature flag on LabTest content (PR-08).
