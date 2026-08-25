# NEL — GLOSSARY

**Status:** FROZEN at P00-T01 · 2026-08-25 · amend only by explicit supersession
**Superseded in part:** P00-T02-A · 2026-08-25 · §7 supersedes the words "route
segments" in §6. Every other clause of §6 stands. The FROZEN marker stands.
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
| `ProgrammeTier` | A tier within a Programme. The seed carries eight distinct values, verified by the STEP 2 command: '' (seven untiered Programmes), Silver, Gold, Platinum — Female, Platinum — Male, Children, Male, Female. Whether the Platinum sex split is a tier value or a second axis is NOT decided here — see CONTENT_MODEL. |
| `LabTest` | A single laboratory analysis. 72 unique across 121 Programme relationships as extracted, verified programmatically. This total is PRE-SIGN-OFF and will move: five flagged rows and four absent-but-promised rows are with the lab (PR-08). Recompute after the signed corrections land; do not cite 72 as final. |
| `LabUnit` | A laboratory department — Immunology, Chemistry, Haematology, Molecular Biology |
| `Branch` | A physical laboratory location. Three confirmed plus one unconfirmed, one flagged head office. The fourth address and the working hours for all four are open carry-forwards owned by the client; the count is not frozen until they close. |
| `Offer` | A published promotional offer with validity dates |
| `Equipment` | Laboratory equipment published on the site |
| `Video` | A published video record surfaced on the public site and managed from the dashboard. Third-party embeds carry boundary consequences — see BOUNDARY_MODEL §4 |
| `Visitor` | A person browsing the public site. Holds no account |
| `Operator` | A dashboard user. Minimum two accounts, MFA required |
| `ResultsPortalLink` | The outbound link to the separate results application. Whether its target is a build-time constant or an Operator-editable value is NOT decided here — see CONTENT_MODEL. If Operator-editable, the target host must be allowlisted; an unconstrained editable target is an open redirect on a medical site. |

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

## §6 Scope of the forbidden set

The forbidden set in §3 binds identifiers: table names, type names, route
segments, field names, and source filenames under the application tree.

Two carve-outs, explicit so this document does not fail itself:

1. Method document filenames fixed by the precedence order —
   `CONTENT_MODEL.md` and `ADMIN_SPEC.md` — are permitted as written.
2. The seed catalogue's existing JSON keys (`tests`, `programme_tests`,
   `test_id`, `programmes`) are permitted IN THE FILE ONLY. The import must
   map them to compliant identifiers; no forbidden key reaches a column
   name, a type or a route.

Everything outside these two carve-outs is a defect, not a preference.

## §7 Route segments are Visitor-facing strings

**This section supersedes the words "route segments" in §6, and nothing else in
§6.** Landed at P00-T02-A, 2026-08-25. The superseded clause read: "The forbidden
set in §3 binds identifiers: table names, type names, route segments, field names,
and source filenames under the application tree."

**Ruling.** A public URL path segment is a Visitor-facing string, not an
identifier. It is read by a person and by a search engine, it is the address the
lab prints and the Visitor types, and it is chosen for legibility in the language
the page is written in. It is governed by the mapping table in `CONTENT_MODEL.md`
§3c, which names the entity behind every segment, and not by the forbidden set.

**What §6 continues to bind, unchanged:** table names · type names · field names ·
source filenames under the application tree. Both §6 carve-outs stand as written.

**What this does not relax.** §5 is untouched. `patient` and `result` remain
forbidden **outright as identifiers**, and an occurrence of either in a table
name, a type name, a field name or a source filename is still a boundary defect.
The route segment `online-results` is a Visitor-facing string naming the outbound
page at `CONTENT_MODEL.md` §3c row 10. It addresses a page that holds no data and
links outward under D-07 and D-17. It is not an identifier and does not name a
column, a type or a file. Read `ResultsPortalLink` as the identifier for that
surface; `online-results` is what the Visitor sees.

**Why the original clause could not stand.** Of the twelve static segments the
lab's route set needs, three carry a noun §3 bans: `programmes` bans on
`programme`, `offers` bans on `offer`, and `online-results` bans on `result`.
Binding the forbidden set to route segments forced a choice between a URL a
Visitor can read and a rule this document could keep, and the previous
enumeration resolved it by shipping PascalCase entity names as public paths —
`/{locale}/LabUnit`, `/{locale}/Offer`, `/{locale}/ResultsPortalLink`. That is a
schema leaking into an address bar. This vocabulary exists to stop ambiguity
entering the codebase, not to choose the lab's URLs.
