# P06-T01 — Measure what was entered, against the signed seed

**Evidence tooling. Never current truth, never a spec, never cited as
authority.** PR-09 applies: this file justifies later content work; it does
not replace `CONTENT_MODEL.md`, `DECISIONS.md`, or the signed clinical
artefacts. This task authors nothing under `src/`, `supabase/` or
`data/seed/`. It writes no row.

**Task:** P06-T01 · P06 read-first audit · 12 September 2026
**Git branch:** `p06-t01` from `origin/main` at `7907d5a` (merge of pull
request #128, `p08-t25`). Tip of `p08-t25` was `eb39d55`.
**Reads:** `npx supabase db query --linked` only. `smoke:operator` was
not run.

---

## RESIDUAL REPAIRS

None. No UNRATIFIED edit.

Observations that are not repairs, and were not applied:

1. **CF-14 original wording.** The row still says all 72 `LabTest`
   `name_ar` values are empty. Live `"LabTest"` is 71 rows, and
   `name_ar`/`name_en` are both filled on all 71. The row was not
   edited (PR-32). Closing it is the reviewer's call.
2. **`docs/research/g5r-evidence.md`** is tracked (`git ls-files
   docs/research/` includes it) and has no README row. Not added here.
3. **OD-21 §3 SUSPENDED** was inserted after §3.6 as the fence required.
   §1, §2, §4, §5, §6 and §7 were not reworded.

---

## STEP 0 — housekeeping

Working tree was clean before any edit (P08-T16's halt). Branch cut from
`origin/main` at `7907d5a` (merge of `p08-t25`, PR #128).

Quoted at STEP 0, all exit 0:

- `npm run guard:naming` — PASS (28 SQL files)
- `npm run guard:schema` — PASS (14 forwards; inventory 33)
- `npm run guard:design` — PASS (205 files under `src/`)
- `npm run guard:phases` — PASS; R5 report-only 17 CF-100 rows
- `npm run guard:boundary` — PASS (22 `.html` under `.next/server/app/`)
- `npm run lint` — PASS (`eslint .`)
- `npm run typecheck` — PASS
- `npm run build` — PASS (Next.js 16.3.3; middleware deprecation
  warning only)
- `python -X utf8 data/seed/verify_seed.py` — `124 -> 71`, PASS,
  QA-flagged 0

P08-T25 Verdict cell set to the mandated PASS text. `UNRATIFIED` label
stripped from the DECISIONS.md heading-count sentence (Twenty-one /
OD-21 stands). OD-21 markdown emphasis restored (`**Status:**`,
`**Amends:**`, `**Raised by:**`, numbered section leads 1–7). OD-21 §3
SUSPENDED block inserted after §3.6 verbatim. PHASES.md `**P08-T25**`
checked; unchecked `**P06-T01**` added under P06. `npm run guard:phases`
exit 0 afterwards.

`grep -c "^### OD-"` via python line-prefix count: **21**.
`grep -c "^### D-"`: **49**. Status DRAFT lines: **1**, OD-09.

---

## STEP 1 — enumerate before you audit

Command (linked):

```sql
select table_name, column_name
from information_schema.columns
where table_schema = 'public'
order by table_name, ordinal_position
```

The live query also asked `data_type`, `udt_name` and `ordinal_position`
so the placeholder sweep could restrict itself to text columns. The
denominator is the column list, not memory.

**Table count: 11.** In information_schema order:

`Branch` · `Equipment` · `LabTest` · `LabUnit` · `MediaAsset` · `Offer`
· `Programme` · `ProgrammeLabTest` · `ProgrammeTier` · `SiteSettings`
· `Video`

Column rows: 163.

A bilingual pair is two columns on the same table whose names differ
only by an `_ar` / `_en` suffix.

| Table | Pair count | Pairs |
|---|---|---|
| `"Branch"` | 3 | `address_ar`/`address_en` · `hours_ar`/`hours_en` · `name_ar`/`name_en` |
| `"Equipment"` | 2 | `description_ar`/`description_en` · `name_ar`/`name_en` |
| `"LabTest"` | 1 | `name_ar`/`name_en` |
| `"LabUnit"` | 2 | `description_ar`/`description_en` · `name_ar`/`name_en` |
| `"MediaAsset"` | 1 | `alt_ar`/`alt_en` |
| `"Offer"` | 2 | `description_ar`/`description_en` · `title_ar`/`title_en` |
| `"Programme"` | 3 | `description_ar`/`description_en` · `name_ar`/`name_en` · `preparation_notes_ar`/`preparation_notes_en` |
| `"ProgrammeLabTest"` | 1 | `note_ar`/`note_en` |
| `"ProgrammeTier"` | 0 | none |
| `"SiteSettings"` | 16 | `about_body` · `hero_eyebrow` · `hero_headline` · `hero_standfirst` · `hours` · `lab_to_lab` · `privacy_body` · `reason1_body` · `reason1_title` · `reason2_body` · `reason2_title` · `reason3_body` · `reason3_title` · `seo_description` · `seo_title` · `whatsapp_message` |
| `"Video"` | 2 | `description_ar`/`description_en` · `title_ar`/`title_en` |

**Pair count total: 33.** Matches `guard:schema` inventory 33.

---

## STEP 2 — bilingual coverage, per table, computed

"Holds a value" means non-null and not empty after trimming. Four
numbers per pair. No site-wide percentage.

| Table | Pair | Total | Both | Exactly one | Neither |
|---|---|---|---|---|---|
| `"Branch"` | `address_ar`/`address_en` | 3 | 3 | 0 | 0 |
| `"Branch"` | `hours_ar`/`hours_en` | 3 | 3 | 0 | 0 |
| `"Branch"` | `name_ar`/`name_en` | 3 | 3 | 0 | 0 |
| `"Equipment"` | `description_ar`/`description_en` | 1 | 1 | 0 | 0 |
| `"Equipment"` | `name_ar`/`name_en` | 1 | 1 | 0 | 0 |
| `"LabTest"` | `name_ar`/`name_en` | 71 | 71 | 0 | 0 |
| `"LabUnit"` | `description_ar`/`description_en` | 4 | 4 | 0 | 0 |
| `"LabUnit"` | `name_ar`/`name_en` | 4 | 4 | 0 | 0 |
| `"MediaAsset"` | `alt_ar`/`alt_en` | 3 | 3 | 0 | 0 |
| `"Offer"` | `description_ar`/`description_en` | 1 | 1 | 0 | 0 |
| `"Offer"` | `title_ar`/`title_en` | 1 | 1 | 0 | 0 |
| `"Programme"` | `description_ar`/`description_en` | 9 | 9 | 0 | 0 |
| `"Programme"` | `name_ar`/`name_en` | 9 | 9 | 0 | 0 |
| `"Programme"` | `preparation_notes_ar`/`preparation_notes_en` | 9 | 0 | 0 | 9 |
| `"ProgrammeLabTest"` | `note_ar`/`note_en` | 124 | 3 | 0 | 121 |
| `"SiteSettings"` | all 16 pairs | 1 | 1 | 0 | 0 |
| `"Video"` | `description_ar`/`description_en` | 1 | 1 | 0 | 0 |
| `"Video"` | `title_ar`/`title_en` | 1 | 1 | 0 | 0 |

`"SiteSettings"` sixteen pairs each read total 1, both 1, exactly one 0,
neither 0.

**Exactly-one is 0 on every pair.** No half-translation.

`preparation_notes_*` neither-on-9 is the schema's both-or-neither
optional pair (`m3_catalogue_tables.sql`): a Programme with no
preparation notes is legitimate. Not missing content.

`note_ar`/`note_en` 3 both / 121 neither / 0 exactly-one is the same
shape: notes are conditional on restricted eligibility
(`CONTENT_MODEL.md` §3a, CF-25). Not a one-sided gap. CF-25 already
tracks unauthored notes; it is not re-opened here.

### Placeholder sweep

Sentinels read from `src/lib/placeholders.ts`, not from the fence:

- `RESULTS_PORTAL_PLACEHOLDER_URL` = `https://example.invalid/portal-placeholder`
- `RESULTS_PORTAL_PLACEHOLDER_DISPLAY` = `example.invalid`
- `WHATSAPP_PLACEHOLDER_PATH` = `wa.me/200000000000`
- word markers: `PROOF` · `PLACEHOLDER` · `TEST` (uppercase token only)
  · `SAMPLE` · `TODO` · `XXX`
- substring markers: `lorem` · `example.invalid`
- task-id and `M n` patterns as in `valueIsPlaceholder`

Every text / varchar / json / `text[]` column on every public table was
scanned. Sensitive columns (hotline, WhatsApp, Branch addresses) were
swept without quoting.

**Hits: 0.** No filled placeholder remains in public text columns.

---

## STEP 3 — site settings across the 27 regions

`REGIONS` length computed from `src/lib/regions.ts` (quoted `key:`
inside the `REGIONS` export, python): **27**. HALT did not fire.

`BILINGUAL_PAIRS` in `src/lib/dashboard/siteSettings.ts`: 16 pairs.
`mappedRequiredSiteSettingsColumns()`: 34 columns (the 16 pairs plus
`hotline` and `whatsapp_e164`).

Hotline, WhatsApp numbers and Branch addresses are reported present or
absent only.

| # | Region | Optional | Clinical | Both sides / required columns |
|---|---|---|---|---|
| 1 | `chrome.whatsapp` | no | no | WhatsApp number **present**; message pair both filled |
| 2 | `chrome.hotline` | no | no | hotline **present** |
| 3 | `chrome.hours` | no | no | both filled |
| 4 | `chrome.about` | no | no | both filled |
| 5 | `chrome.social` | yes | no | facebook, instagram, linkedin, youtube each filled |
| 6 | `home.hero` | no | no | all three pairs both filled |
| 7 | `home.reasons` | no | no | all six pairs both filled |
| 8 | `home.about` | no | no | both filled |
| 9 | `home.departments` | no | no | `"LabUnit"` 4/4 name pair |
| 10 | `home.seo` | no | no | both pairs filled |
| 11 | `about.body` | no | no | both filled |
| 12 | `contact.whatsapp` | no | no | number **present**; message pair both filled |
| 13 | `contact.hours` | no | no | both filled |
| 14 | `contact.hotline` | no | no | hotline **present** |
| 15 | `contact.social` | yes | no | all four URLs filled |
| 16 | `privacy.body` | no | no | both filled |
| 17 | `labToLab.body` | no | no | both filled |
| 18 | `labToLab.whatsapp` | no | no | number **present**; message pair both filled |
| 19 | `locations.map` | yes | no | latitude 1/3 · longitude 1/3 (optional; CF-69) |
| 20 | `locations.branches` | no | no | 3 rows: names, addresses (**present**), hours both filled; WhatsApp **present** on 3/3; `is_head_office` set on all 3 |
| 21 | `departments.labUnits` | no | no | 4/4 name and description pairs |
| 22 | `programmes.listing` | no | yes | 9/9 name and description pairs |
| 23 | `programmes.detail` | no | yes | Programme 9/9 name, description, slug; `"ProgrammeTier"` 14/14 axes |
| 24 | `programmes.labTests` | no | yes | `"LabTest"` 71/71 names; `"ProgrammeLabTest"` notes 3/124 both, 121/124 neither |
| 25 | `offers.listing` | no | no | 1 Offer: title, description, dates, price both/filled; `"MediaAsset"` 3/3 alt and `storage_path` |
| 26 | `videos.listing` | no | no | 1 Video: title, description, `youtube_id` filled; `"MediaAsset"` 3/3 |
| 27 | `equipment.listing` | no | no | 1 Equipment: name and description both; `"MediaAsset"` 3/3 |

Region 19 is optional. Region 24's empty notes are the conditional pair
already counted at STEP 2, not a required bilingual miss.

`"Branch"` row count is 3. CF-04 (fourth Branch unconfirmed) already
owns that. Not a new row.

---

## STEP 4 — the clinical comparison

Live `"LabTest"` and `"ProgrammeLabTest"` compared to the signed seed
`data/seed/tests.csv` and `data/seed/programme_tests.csv` (the
laboratory signed `clinical-signoff.md`, digest `aa0469ee…aef7`).

`"LabTest"` has no description or note column
(`information_schema.columns`; `m3_catalogue_tables.sql` lists
`slug`, `name_ar`, `name_en`, `aliases`, `qa_flag`). Comparison is
`slug`, `name_ar`, `name_en`. Seed Arabic is `name_ar_TO_TRANSLATE`.

Three explicit sets:

| Set | Size | Members |
|---|---|---|
| live slugs absent from the seed | **0** | — |
| seed slugs absent from the live rows | **0** | — |
| slugs present in both where `name_ar`, `name_en` or any medical description text differs | **0** | `"LabTest"` has no description column; name diffs none |

HALT on LabTest drift did not fire.

Programme memberships, live join
`"ProgrammeLabTest"` → `"ProgrammeTier"` → `"Programme"` → `"LabTest"`:

- membership count: **124**
- distinct `"LabTest"` slugs those memberships resolve to: **71**
- **`124 -> 71`**, equal to the signed seed assertion.

Membership identity (programme slug, `tier_axis`, `audience_axis`,
LabTest slug) against `programme_tests.csv`:

| Set | Size |
|---|---|
| live memberships absent from the seed | **0** |
| seed memberships absent from the live rows | **0** |

HALT on `124 -> 71` did not fire.

---

## STEP 5 — publication state

Per table, draft and published counted from the live rows. "Entered" and
"live on the public site" are different claims.

| Table | Rows | draft | published |
|---|---|---|---|
| `"Branch"` | 3 | 0 | 3 |
| `"Equipment"` | 1 | 0 | 1 |
| `"LabTest"` | 71 | 71 | 0 |
| `"LabUnit"` | 4 | 0 | 4 |
| `"MediaAsset"` | 3 | 0 | 3 |
| `"Offer"` | 1 | 1 | 0 |
| `"Programme"` | 9 | 9 | 0 |
| `"ProgrammeLabTest"` | 124 | 124 | 0 |
| `"ProgrammeTier"` | 14 | 14 | 0 |
| `"SiteSettings"` | 1 | 0 | 1 |
| `"Video"` | 1 | 0 | 1 |

The clinical catalogue is entered and unpublished. That is the PR-08
publish gate, not a missing-name finding. G6 is the gate; this task does
not claim G6.

### Laboratory Offer hashed `7cc7436e57b8`

Command:

```sql
select left(md5(id::text), 12) as id_md5_12, publication_state
from public."Offer"
```

Row count: **1**. That row is `7cc7436e57b8`. `publication_state`:
**draft**. Not written, not published, not unpublished by this window.
CF-172 already records the owner's confirmation that the laboratory
unpublished it.

---

## Carry-forwards

CF live maximum computed before any allocate (python `re.findall` over
`CF-nn` table rows in `docs/method/CARRY_FORWARDS.md`): **173**. Next
free would be CF-174. Open count by
`grep -cE '^\| CF-[0-9]+ .*\| OPEN \|'`: **97**.

STEP 2 to STEP 5 found no missing required content and no one-sided
translation. Optional empties (preparation notes, membership notes,
optional map pins) are either schema-legitimate or already owned
(CF-25, CF-69). Unpublished clinical rows are the publish gate, not an
entry gap.

**No CF landed.** Open arithmetic: base 97 + 0 − 0 = **97**. CF-169,
CF-170, CF-171 and CF-173 stay OPEN by design.

---

## Tooling

`scripts/audit/p06-content-entry-audit.py` is the linked-query driver.
`scripts/audit/p06-standing-counts.py` is the catalogue / region /
research-file counter. Both are evidence tooling; neither writes a row.

Redacted in this file: hotline, WhatsApp numbers, Branch addresses
(reported present/absent), keys, tokens, project ref, connection
strings.

---

## Standing counts (this task)

| Check | Command | Result |
|---|---|---|
| Open CF | python `re.findall` `^\| CF-\d+ .*\| OPEN \|` | 97 |
| CF live maximum | python max over CF-nn table rows | 173 |
| `### OD-` | python line-prefix `^### OD-` | 21 |
| `### D-` | python line-prefix `^### D-` | 49 |
| Status DRAFT | python lines containing Status and DRAFT | 1 (OD-09) |
| `git ls-files supabase/migrations/` | python len of `git ls-files` | 28 |
| Catalogue | python parse quoted keys in `const ar` / `const en` | ar 590 · en 590 · identical · 0 duplicates |
| Worklist | `git show HEAD:docs/research/clinical-worklist.md` piped to sha256 | `22b2c73b697460b2def3a86e4b6489c987874a071c4d9c0f792a46612197569f` |
| Sign-off | `git show HEAD:docs/research/clinical-signoff.md` piped to sha256 | `aa0469eedad99a4f55acd469912689df511311343ec8f31bb75cabf8c577aef7` |
| Addendum | `git show HEAD:docs/research/clinical-signoff-addendum.md` piped to sha256 | `2b63422efa63f256aef7fcac6f3a3ec3178148a60a3a85199810c75468b5340d` |
| `git ls-files docs/research/` before this file | python len | 32 |
| `git ls-files docs/research/` after this file | python len | 33 |

`git diff --stat origin/main HEAD -- src/ supabase/ data/seed/` is
empty by construction: this task does not touch those trees.
