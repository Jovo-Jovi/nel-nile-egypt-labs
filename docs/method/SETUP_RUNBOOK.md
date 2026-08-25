# NEL — Setup Runbook

**Goal:** repo live, Cursor configured, reviewer chat open, first task issued.
**Time:** about 30 minutes.
**You need:** `nel-bootstrap.zip`, a GitHub account, Cursor, a Claude Project.

Commands are written one per line — no `&&` chaining, so they work in PowerShell
and bash alike (PR-07).

---

## Step 1 — Create the repo

On GitHub: new repository, **Private**, name `nel-nile-egypt-labs`.
No README, no .gitignore, no licence — the scaffold brings its own.

Then locally:

```
mkdir nel-nile-egypt-labs
cd nel-nile-egypt-labs
git init
git branch -M main
```

---

## Step 2 — Extract the scaffold

Unzip `nel-bootstrap.zip` **into** the repo folder, so `docs/`, `data/`,
`.cursor/` and `README.md` sit at the root — not inside a `nel-bootstrap/`
subfolder.

Confirm:

```
ls docs
ls .cursor/rules
```

You should see `SESSION_CONTEXT.md` and three `.mdc` files. If `.cursor` is
hidden on Windows, enable hidden items in Explorer — it must exist.

---

## Step 3 — Nothing to move

**Every file produced in this project already ships inside the zip**, placed and
numbered. Nothing to hunt for, nothing to copy. What landed where:

```
docs/research/     01–12  audit, architecture, original quotation, spec review,
                          both owner forms (blank + ANSWERED), form review,
                          locked baseline, research prompt, research findings,
                          reconciliation
docs/method/       reviewer instructions, adaptation notes, this runbook,
                          pre-development playbook, PRECEDENTS, CARRY_FORWARDS
docs/commercial/   quotation draft, prices blank
data/seed/         4 data files + verify_seed.py
client-outbound/   qa-missing-tests.csv
.cursor/rules/     3 builder rule files
```

Each folder carries a `README.md` index explaining what the files are and which
are superseded.

Two things are deliberately **not** in the repo:

- **`NEL_REVIEWER_INSTRUCTIONS.md`** — a versioned copy sits in `docs/method/`,
  but the live copy belongs in the Claude Project settings (Step 7)
- **`CLAUDE_PROJECT_INSTRUCTIONS.md`** — superseded. Its content now lives in
  `.cursor/rules/`. Discard it

<details>
<summary>Original Step 3 table — kept for reference</summary>

| File | Destination | Why |
|---|---|---|
| `Nile_Egypt_Labs___website_audit_brief.pdf` | `docs/research/` | Evidence |
| `Nile_Egypt_Labs_Architecture_and_User_Journeys.pdf` | `docs/research/` | Evidence |
| `Nile_Egypt_Labs_Full_Quotation.pdf` | `docs/research/` | Superseded — keep for history |
| Answered approvals form `.docx` | `docs/research/` | Client's signed answers |
| `Nile_Egypt_Labs_Form_Review_and_Next_Steps.md` | `docs/research/` | Evidence |
| `Nile_Egypt_Labs_Locked_Baseline.md` | `docs/research/` | **Feeds SCOPE.md** |
| `Nile_Egypt_Labs_Research_Reconciliation.md` | `docs/research/` | Evidence |
| `Nile_Egypt_Labs_Pre_Development_Playbook.md` | `docs/research/` | Superseded by the method files |
| `NEL_DevOS_Adaptation_Notes.md` | `docs/method/` | Explains the method choices |
| `NEL_REVIEWER_INSTRUCTIONS.md` | **Claude Project settings** — Step 6 | Not a repo file |
| Seed CSVs + JSON | Already in `data/seed/` | Build input |
| `nile_qa_missing_tests.csv` | Already in `client-outbound/` | **Goes to the lab, not the build** |

</details>

---

## Step 4 — Verify the seed

```
python data/seed/verify_seed.py
```

Must print `121 -> 72` and `PASS`. This is the first computed count in the
project and it sets the precedent (PR-01). If it fails, stop and fix before
committing.

---

## Step 5 — First commit

```
git add .
git commit -m "chore: bootstrap NEL scaffold — method files, builder rules, seed data"
git remote add origin https://github.com/<you>/nel-nile-egypt-labs.git
git push -u origin main
```

Then edit `docs/SESSION_CONTEXT.md` and replace `<owner>/<repo>` with the real
path. Commit that too.

---

## Step 6 — Cursor

1. Open the repo folder in Cursor.
2. Settings → Rules → confirm the three project rules are detected.
3. Sanity check: open a chat and ask *"what are the forbidden nouns in this project?"*
   A correct answer names `patient` and `result` as forbidden outright. If it
   doesn't, the rules aren't loading — check `.cursor/rules/` exists at the repo
   root and the files end in `.mdc`.

Rule behaviour: `nel-core` and `nel-vocabulary` always apply; `nel-i18n-rtl`
attaches to files under `src/`.

---

## Step 7 — The reviewer chat

New Claude Project, named **NEL — Reviewer**.

**Custom instructions:** paste the full contents of `NEL_REVIEWER_INSTRUCTIONS.md`.
Replace `<owner>/<repo>` and `<path>` with the real values first.

**Project knowledge — attach exactly four files:**

1. `docs/GLOSSARY.md`
2. `docs/BOUNDARY_MODEL.md`
3. `data/seed/catalogue.json`
4. `NEL_DevOS_Adaptation_Notes.md`

Four, not fourteen. Every extra reference file dilutes attention across the ones
that matter. `SCOPE.md` and `CONTENT_MODEL.md` join this list once they're
authored — swap out the adaptation notes then.

---

## Step 8 — Kick off

Start a new chat in that project and paste the block in Section A below.

---

# A — Reviewer kickoff prompt

```
Session start. NEL — Nile Egypt Labs, Dev OS reviewer surface.

Repo: https://github.com/<you>/nel-nile-egypt-labs · branch main · PRIVATE
Local: <path>

The repo is private, so you cannot fetch it. State is pasted this session — say
so in your verdict. Pasted below: SESSION_CONTEXT.md and PRECEDENTS.md.

--- docs/SESSION_CONTEXT.md ---
<paste the whole file>
--- end ---

--- docs/method/PRECEDENTS.md ---
<paste the whole file>
--- end ---

Repo state, verified by me just now:
- Scaffold committed and pushed to main
- `python data/seed/verify_seed.py` prints: 121 -> 72, PASS
- QA-flagged LabTests: 5 — ast, esr, fsh, app-afp, creatinine-urea-combined
- docs/GLOSSARY.md and docs/BOUNDARY_MODEL.md are seeded, not yet frozen
- docs/PRODUCT_BRIEF.md, SCOPE.md, DECISIONS.md, CONTENT_MODEL.md are stubs
- CF-01 … CF-11 open, all client dependencies
- Quotation NOT yet signed, so scope is NOT frozen

Do three things, in this order:

1. Confirm you have read SESSION_CONTEXT and PRECEDENTS, and state the current
   phase, gate and blocking condition in one line each.

2. Tell me which tasks may legitimately run while scope is unfrozen, and which
   must wait for the signed quotation. Be specific — I want to use this time.

3. Issue P00-T01 as a task prompt in the exact task-prompt format, covering the
   Gate-0 document set. Note that GLOSSARY and BOUNDARY_MODEL are seeded and need
   review rather than authoring.

Do not write production code. Do not invent scope. If something here contradicts
the repo, say so and stop.
```

---

# B — What runs before the quotation is signed

Scope is frozen by the signed quotation, so no build task issues until then. But
this is not dead time — these can all run now:

| Can run now | Must wait |
|---|---|
| Author `PRODUCT_BRIEF`, `CONTENT_MODEL` | `SCOPE.md` — derives from the quotation |
| Review and freeze `GLOSSARY`, `BOUNDARY_MODEL` | Any schema or migration task |
| Draft OD-01 (region) and OD-02 (search) | Any component or route |
| Send the clinical QA file to the lab (CF-01) | Supabase and Vercel project creation |
| Chase CF-02 to CF-08 with the client | Design system work |
| Verify the Supabase region list before OD-01 is signed | |

**Send the clinical QA file today.** It is the longest lead time in the project
and nothing you do can shorten it — it depends on someone else's clinical staff
finding time. Everything else is under your control; this isn't.

---

# C — Gaps deliberately left, and where they land

Nothing here blocks starting. Each is parked at the step that owns it.

| Gap | Lands at |
|---|---|
| Launch date unagreed (CF-03) | P00 / G0 — before the quotation is signed |
| Supabase region not verified | OD-01, before P01 |
| Logo unconfirmed (CF-02) | P02 — header built to tolerate a wordmark fallback |
| Fourth Branch, hours (CF-04, CF-05) | P03 — Branches page |
| Arabic translation of 72 LabTests | P06 — Opus Max, then lab verification |
| Clinical sign-off (CF-01) | P06 / G6 — feature flag holds until it lands |
| Privacy policy (CF-06) | P07 — blocks launch, nothing earlier |
| DNS, hosting, domain access | P07 — blocks cutover only, never the build |
| `.org` domain controller (CF-07) | P01 — ask while doing infrastructure |
| Directory cleanup, Facebook duplicates (CF-09, CF-10) | Excluded — propose as paid add-ons |
| Portal certificate expiry (CF-11) | P07 — written reminder already filed |

The pattern worth noticing: **every open item is a client dependency, not an
engineering unknown.** The build is well defined. Chase the client, not the code.

---

# D — Daily rhythm once building

1. Open a Cursor window. Paste: *"Read docs/SESSION_CONTEXT.md and
   docs/method/PRECEDENTS.md, then execute:"* followed by the task prompt the
   reviewer gave you.
2. Cursor builds, pushes to a branch, and produces a build report.
3. Paste the build report and the diff into the reviewer chat.
4. Reviewer returns a verdict and the next task prompt.
5. You open and merge the PR.
6. Repeat. **One task at a time** (PR-03).

Model per task comes from the task prompt, never from habit. If Cursor's active
model doesn't match what the prompt specifies, switch it before running.

**Grok output never merges without the review gate named in its own prompt**
(PR-06). That gate is where the cost saving stays safe — the saving comes from
Grok doing volume, not from skipping review.
