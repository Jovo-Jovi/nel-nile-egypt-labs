# NEL — GLOSSARY

**Status:** SEEDED at bootstrap · review and freeze at P00-T01
**Binding on:** every prompt issued, every document authored, every identifier written

## §1 Why this exists

The source content describes the lab's offering through **three overlapping
taxonomies** — six homepage services, four laboratory units, nine programmes —
and uses *programme*, *package*, *profile*, *panel* and *checkup* interchangeably
for the same thing. That ambiguity is the largest defect in the material being
migrated. Reproducing it in the schema would recreate the exact problem the
rebuild exists to solve.

## §2 Entities

| Entity | Meaning |
|---|---|
| `Programme` | One of nine published check-up programmes |
| `ProgrammeTier` | A cumulative tier within a Programme — Silver · Gold · Platinum · Children. Also used for the Infertility male/female split |
| `LabTest` | A single laboratory test. 72 unique across all Programmes |
| `LabUnit` | A laboratory department — Immunology, Chemistry, Haematology, Molecular Biology |
| `Branch` | A physical laboratory location. Four, one flagged head office |
| `Offer` | A published promotional offer with validity dates |
| `Equipment` | Laboratory equipment published on the site |
| `Visitor` | A person browsing the public site. Holds no account |
| `Operator` | A dashboard user. Minimum two accounts, MFA required |
| `ResultsPortalLink` | The outbound link to the separate results application |

## §3 Forbidden bare nouns

```
test · result · patient · branch · unit · programme · package · profile
panel · checkup · device · offer · service · user · admin · content · item
```

## §4 Qualified replacements

| Forbidden | Use | Note |
|---|---|---|
| `test` | `LabTest` / `spec` | Domain vs software-test collision |
| `result` | **forbidden** | Only `ResultsPortalLink` permitted |
| `patient` | `Visitor` / `Operator` | No patients — no patient data |
| `branch` | `Branch` | Lowercase means git |
| `unit` | `LabUnit` | |
| `programme` etc. | `Programme` | Synonyms never become identifiers |
| `tier` | `ProgrammeTier` | |
| `device` | `Equipment` | Collides with viewport |
| `offer` | `Offer` | |
| `service` | **forbidden** | Used three inconsistent ways on the old site |
| `content` | name the entity | |

## §5 Boundary vocabulary

`patient` and `result` are forbidden **outright**, not merely qualified. The
system holds no patient data, and no identifier may imply otherwise. An
occurrence of either is a **boundary defect**, not a naming defect, and is
reported under the boundary gate.
