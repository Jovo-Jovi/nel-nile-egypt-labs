# Method

| File | Purpose |
|---|---|
| `PRECEDENTS.md` | **Binding.** Procedural rulings PR-nn. Consult before re-deriving a pattern |
| `CARRY_FORWARDS.md` | **Binding.** The ledger, CF-nn |
| `NEL_REVIEWER_INSTRUCTIONS.md` | Reviewer surface instructions. Lives in the Claude Project; this is the versioned copy |
| `DEVOS_ADAPTATION_NOTES.md` | What was taken from B2S/BETK, dropped, and added. Read this to understand *why* the gates are shaped this way |
| `SETUP_RUNBOOK.md` | Bootstrap steps and the reviewer kickoff prompt |
| `PRE_DEVELOPMENT_PLAYBOOK.md` | Pre-Dev-OS planning pass. Superseded by the above; retains the model-routing rationale |

## The two non-waivable gates

**Boundary** — no personal or medical data on any path. Enforced twice: as gate
evidence, and in the vocabulary, where `patient` and `result` are forbidden nouns.

**Clinical** — no LabTest content in production without the lab's written
sign-off. Cannot be proved internally; held by a feature flag, not by a schedule.
