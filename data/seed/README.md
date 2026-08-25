# Seed data

**Source:** `http://nileegyptlabs.com/features.html` · Last-Modified **21 Feb 2018**
**Extracted:** 24 August 2026

## What this is

Source of truth for **structure**. Not for clinical accuracy.

| File | Rows | Contents |
|---|---|---|
| `programmes.csv` | 9 | Programmes, EN + AR names, tier notes |
| `tests.csv` | 72 | Unique LabTests, EN name, blank AR column, bilingual search aliases, QA flags |
| `programme_tests.csv` | 121 | Programme → ProgrammeTier → LabTest, with verbatim source wording preserved |
| `catalogue.json` | — | All of the above as one importable bundle |

**121 → 72 is the point.** Without deduplication a Visitor searching `CBC` gets
five unconnected text blobs. With it, one result listing every Programme
containing it.

## Known defects — flagged, not fixed (CF-01)

Five in `tests.csv` under `qa_flag`, four in `client-outbound/qa-missing-tests.csv`.
Two are clinically significant:

- **`FSH` appears in the Gold tier**, whose description is entirely about thyroid
  disorders. FSH is a fertility hormone. Almost certainly meant to be **TSH**.
- **`APP` is listed as a tumour marker.** Not a recognised marker. Given the
  stated purpose (liver tumours), almost certainly **AFP**.

**Do not correct these.** PR-08: LabTest content ships behind a feature flag
until the lab signs off in writing.

## Verification

    python data/seed/verify_seed.py

Must print `121 -> 72`. PR-01: counts are computed, never asserted.

## The Arabic column is deliberately blank

`name_ar` in `tests.csv` is empty by design. Clinical Arabic translation is an
Opus-Max task and then goes to the lab for verification. A mistranslated LabTest
name on a laboratory site is a harm vector, and it is invisible to a reviewer who
does not read clinical Arabic.
