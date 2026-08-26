# NEL — Dev OS Adaptation Notes

**What was taken from B2S and BETK, what was dropped, and what this project needs that neither has.**

---

## 1. Kept unchanged

The parts of the method that do the work regardless of project size:

- Reviewer surface / builder surface separation — the chat never writes production code
- Repo authoritative over memory, always
- `SESSION_CONTEXT.md` read every session; state is never reconstructed from conversation
- `PRECEDENTS.md` as the citable rulebook; supersede explicitly, never deviate silently
- `CARRY_FORWARDS.md` ledger; findings become named rows with owners, never silent patches
- ODs in `DECISIONS.md`; no scope exists outside them
- Exact verdict and task-prompt formats
- No evidence means FAIL
- Counts computed and stated with the command, never read off a window
- Self-contained prompts — a fresh window sees only the fence
- Reviewer describes CF/PR rows; the landing task allocates ids
- One task at a time; human opens and merges PRs
- Vocabulary enforced as a defect class, not a style preference
- Just-in-time document authoring — over-preparation is its own failure mode

---

## 2. Dropped, with reasons

| Dropped | Why |
|---|---|
| **Tenant isolation gate** | Single tenant. One lab, one dataset. Replaced by the boundary gate |
| **14-level document precedence** | Sized for a multi-tenant platform. NEL uses 12, and six of those are authored just-in-time |
| **"Architecture frozen until Gate 3"** | The stack is already fixed by the quotation. Two decisions remain open (region, search) and both are ODs, not a freeze |
| **Parity gate against legacy** | Void in B2S already, and here it would be actively harmful — the 2018 site contains placeholder copy and clinical errors |
| **`CALC_SPEC`, `PRINT_CONTRACT`, `TEMPLATE_MODEL`, `IMPORT_SPEC`** | No money, no print, no template engine, no CSV import in scope |
| **Design-system-owned-by-a-separate-surface (BETK's Claude Design split)** | One designer, one builder. The separation costs more than it protects at this size |
| **Phase packs generated one at a time on request** | Retained in spirit, but NEL has 7 phases against BETK's larger count — smaller packs, same rhythm |

---

## 3. Added — what neither B2S nor BETK has

### The clinical gate

This is the structural novelty. NEL has **content that cannot ship until a third party outside the project signs off** — the lab's clinical staff must confirm the flagged defects before any LabTest data reaches production.

B2S's non-waivable gate is tenant isolation, which the team can prove themselves. NEL's cannot be proved internally at all. That changes how it is handled:

- LabTest content ships **behind a feature flag** from the start, so the gate never blocks the build
- The gate is a **hold-point on release, not on development**
- The sign-off document is a repo artefact with a date, filed in `docs/research/`
- Until it lands, the Programmes pages render descriptions only, no test lists

Building the flag on day one is what stops a third-party dependency becoming a schedule dependency.

### The boundary gate

Replaces tenant isolation as the non-waivable structural gate. Proof that no path accepts personal or medical data.

It is enforced twice: at the gate as evidence, and in the **vocabulary**, where `patient` and `result` are forbidden nouns. If someone writes a `results` table, the naming rule catches it before the security review does. That is deliberate — the cheapest place to catch a boundary violation is at the identifier.

### The volume tier

B2S and BETK run two model classes. NEL runs three, because cost is a live constraint on this engagement.

The tier is defined by **what Grok may not touch** rather than by what it may, and every Grok task carries a named review gate in its own prompt. The saving comes from Grok doing volume, never from skipping review.

Where the hours actually sit: static components, page assembly, admin forms and non-clinical content entry. All Grok-suitable, and collectively most of the build. Schema, auth and Arabic clinical terminology are a small fraction of hours and carry the highest effort available. Inverting that to save money would be a false economy.

---

## 4. Vocabulary — why it earns its place here

In B2S the glossary prevents ambiguity in a domain with many similar nouns. In NEL it does something more specific.

The source content describes the lab's offering through **three overlapping taxonomies** — six homepage services, four laboratory units, nine programmes — and uses *programme*, *package*, *profile*, *panel* and *checkup* interchangeably for the same thing. That ambiguity is the largest defect in the material being migrated. Letting it into the schema would reproduce the exact problem the rebuild exists to fix.

Two collisions are project-specific and worth stating plainly:

- **`test`** — a laboratory test and a software test in the same repository. `LabTest` for the domain, `spec` for the file. Bare `test` in a domain context is a defect.
- **`branch`** — a physical laboratory location and a git branch. `Branch` PascalCase is the entity; lowercase means git and nothing else.

And two that enforce the boundary rather than clarity: **`patient`** and **`result`** are forbidden outright. The system has no patients because it holds no patient data, and any entity implying otherwise is a boundary defect caught at the identifier.

---

## 5. Phase and gate map

| Phase | Contents | Gate | Non-waivable checks |
|---|---|---|---|
| **P00** Prepare | Docs frozen, ODs signed, seed verified, clinical QA dispatched to the lab | G0 — quotation signed, scope frozen | — |
| **P01** Foundation | Repo, CI, schema, RLS, Auth, MFA, seed import | G1 | Boundary |
| **P02** Design system | Tokens, type scale, RTL primitives, lint rules | G2 | — |
| **P03** Public site | 13 routes, both locales | G3 | Boundary · Bilingual |
| **P04** LabTest search | Static index, client-side, bilingual aliases | G4 | Data integrity · Bilingual |
| **P05** Admin dashboard | 8 modules, Operator accounts | G5 | Boundary · Bilingual |
| **P06** Content & Arabic | Translation, content entry, clinical sign-off lands | G6 | **Clinical** · Bilingual |
| **P07** Hardening & cutover | Headers, DNS, redirects, decommission | G7 — launch | **Clinical** · **Boundary** · Bilingual · Data integrity |

The build order is deliberately Phase-1-first — public site before dashboard — so that if the launch date forces a split, the phasing already matches.

---

## 6. Bootstrap sequence

**Before any build task is issued:**

1. **Sign the quotation.** `SCOPE.md` derives from it. Until it is signed, scope is not frozen and P00 cannot exit.
2. **Dispatch the clinical QA file** to the lab's clinical staff, separately from all admin questions.
3. **Sign two ODs:** OD-01 hosting region (verify Supabase availability first — do not assume a Middle East region exists) and OD-02 search architecture (static index, client-side).
4. Create the repo and the `docs/method/` scaffold: `SESSION_CONTEXT.md`, `PRECEDENTS.md`, `CARRY_FORWARDS.md`, `DEVELOPMENT_JOURNAL.md`.
5. Author the Gate-0 blocking set: `PRODUCT_BRIEF` · `GLOSSARY` · `SCOPE` · `DECISIONS` · `CONTENT_MODEL` · `BOUNDARY_MODEL`. Six documents, not eleven.
6. Land the seed data and verify **121 → 72** programmatically. That is the first computed count and it sets the precedent.
7. Paste the reviewer instructions into project settings. Attach four reference files: `SCOPE.md`, `CONTENT_MODEL.md`, `BOUNDARY_MODEL.md`, `nile_test_catalogue.json`.

**Carry-forwards to land at repo creation** — describe the rows, let the landing task allocate ids:

| Item | Owner |
|---|---|
| Clinical corrections outstanding — 5 flagged defects, 4 missing tests | Lab clinical staff |
| Logo unverified — 2015 file, 274×35, likely template asset | Client |
| Launch date unagreed | Client |
| Fourth Branch unconfirmed — 37 El Garage St | Client |
| Working hours unconfirmed for all four Branches | Client |
| Privacy policy text not supplied | Client |
| `nileegyptlabs.org` — controller unknown, second mail system | Client |
| YouTube channel empty despite content confirmed | Client |
| Hotline 16402 live on ≥4 third-party directories | Excluded — propose as add-on |
| Three duplicate Facebook pages | Excluded — propose as add-on |
| Results portal certificate expires 28 Oct 2026 | Client — written reminder filed |

Eleven rows, and every one of them is a client dependency rather than a build defect. That is the honest state of this project: the engineering is well-defined and the risk sits almost entirely outside the repo.

---

## 7. On the quotation, in method terms

`SCOPE.md` derives from the signed quotation, so **the quotation is the scope freeze**. That resolves the earlier question: it is not a document to postpone until development is imminent — it is the artefact that permits development to begin.

Content volume is now exact — 9 Programmes, 72 LabTests, 121 relationships, 4 Branches, 4 LabUnits, 1 Lab-to-Lab section — so the largest unknown is closed. Issue it, carrying logo design, Arabic translation and phasing as priced options rather than as reasons to wait.
