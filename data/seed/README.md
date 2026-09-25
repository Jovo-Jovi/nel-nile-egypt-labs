# Seed data

**Source of the 2018 snapshot:** `http://nileegyptlabs.com/features.html` · Last-Modified
**21 Feb 2018** · extracted 24 August 2026.
**Current content:** the laboratory's signed clinical catalogue of 6 September 2026
(`docs/research/clinical-signoff.md`), transcribed by M8. Updated at P07-T04 · 25 September
2026.

## What this is

| File | Rows | Contents |
|---|---|---|
| `programmes.csv` | 9 | Programmes, English and Arabic names, tier notes |
| `tests.csv` | 71 | LabTests of the signed catalogue: English name, Arabic name, search aliases, QA flag (none set) |
| `programme_tests.csv` | 124 | Programme → ProgrammeTier → LabTest memberships, with the source wording preserved |
| `catalogue.json` | — | The 2018 extraction snapshot, 72 LabTests across 121 relationships. Kept as evidence and not asserted (PR-09) |

The Arabic-name column in `tests.csv` keeps its original header, `name_ar_TO_TRANSLATE`;
every row now carries the laboratory's signed Arabic name.

**Deduplication is the point.** Without it a Visitor searching `CBC` would get unconnected
text blobs. With it, one LabTest lists every Programme that contains it.

## The 2018 defects

The 2018 snapshot carried five flagged LabTests and four analyses promised in descriptions
but missing from their own panels, among them `FSH` in a thyroid tier and `APP` as a tumour
marker. The laboratory resolved each one in its signed catalogue; no row in `tests.csv`
carries a `qa_flag` today. The four missing-analysis questions, as they were put to the
laboratory, are kept in `client-outbound/qa-missing-tests.csv`.

Clinical content is the laboratory's. Nothing here is corrected by the project (PR-08).

## Verification

    python data/seed/verify_seed.py

Must print `124 -> 71` and `PASS`. CI runs it on every push and pull request. PR-01:
counts are computed, never asserted.
