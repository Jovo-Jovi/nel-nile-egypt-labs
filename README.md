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

## Verify the seed

    python data/seed/verify_seed.py

Must print `121 -> 72`.
