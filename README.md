# NEL — Nile Egypt Labs

Bilingual (Arabic/English) website and content dashboard for a medical laboratory
in Cairo, replacing an unfinished 2018 template site.

**Method:** Dev OS. The reviewer surface is a Claude Project; the builder surface
is Cursor. One task at a time, verdicts before progression.

## Read first

| File | Purpose |
|---|---|
| `docs/SESSION_CONTEXT.md` | Current phase, next action, open carry-forwards |
| `docs/method/PRECEDENTS.md` | Binding procedural rulings (PR-nn) |
| `docs/method/CARRY_FORWARDS.md` | The ledger (CF-nn) |
| `docs/GLOSSARY.md` | Enforced vocabulary — forbidden nouns are defects |
| `docs/BOUNDARY_MODEL.md` | The non-waivable no-PHI gate |

## Two gates that cannot be waived

**Boundary** — no personal or medical data on any path.
**Clinical** — no LabTest content in production without the lab's written sign-off.

> **Public repository (OD-04).** The `qa_flag` entries in the seed and the
> rows in `client-outbound/` are unconfirmed readings of a public 2018 page
> (PR-09). They are questions for the lab's clinical staff, not assertions
> of clinical error, and none of them has been reviewed by the lab. Nothing
> here reaches production before written clinical sign-off (PR-08).

## Verify the seed

    python data/seed/verify_seed.py

Must print `121 -> 72`.
