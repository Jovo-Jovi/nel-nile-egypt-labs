# G4 — production evidence, 15 September 2026

**This is the evidence pack.** P04-T03. Read-only against production. No
source, migration, schema or row change.

**Precedence:** none — evidence. Never a parity target (PR-09). This file
decides nothing. **The reviewer issues G4.** This task does not record G4
as PASSED and does not check the **G4** box.

**Redaction.** Email addresses, keys, tokens, JWT payloads, connection
strings, the Supabase project ref, hotline and WhatsApp numbers, Branch
addresses and coordinate values do not appear here. LabTest names,
aliases, Programme names, slugs, queries, counts, payload sizes and
route tables are reported in full.

**No source, migration or schema change.**
`git diff --stat origin/main HEAD -- src/ supabase/ data/seed/` is empty.

---

## STEP 0 — tree, guards, digests, ledger

No leftover `tmp-*` directories were present. None were removed.

Branch `p04-t03` cut from `origin/main` at
`83b147356541be7d6fccf0bcd74a2819ae0abdc5` (merge of pull request #155 /
`p04-t02`).

Quoted, all exit 0:

- `npm run guard:naming` — PASS
- `npm run guard:schema` — PASS
- `npm run guard:design` — PASS
- `npm run guard:phases` — PASS (R5 report-only 17 historical rows)
- `npm run lint` — PASS
- `npm run typecheck` — PASS
- `npm run build` — PASS
- `python -X utf8 data/seed/verify_seed.py` — `124 -> 71`, PASS, QA-flagged 0
- `npm run guard:boundary` — PASS after the build, scanned 24 html under
  `.next/server/app/`

P04-T02 Verdict cell set to exactly:

`PASS at reviewer verdict — 14 September 2026; artefact read behind the flag in a Server Component so a flag-off build resolves, both build directions proved, nine queries measured in both locales, unsigned 0, 617/617. Both residual repairs RATIFIED.`

`**P04-T02**` checked. Unchecked `**P04-T03**` added. `**P06-T11**` and
`**P06-T03**` stay unchecked (PR-36). **G4** stays unchecked.

**Clinical digests by PR-37.**
`subprocess.run(["git","show",f"HEAD:{path}"], capture_output=True).stdout`
hashed with `hashlib.sha256` — no shell pipe.

| Artefact | Digest |
|---|---|
| `docs/research/clinical-worklist.md` | `22b2c73b697460b2def3a86e4b6489c987874a071c4d9c0f792a46612197569f` |
| `docs/research/clinical-signoff.md` | `aa0469eedad99a4f55acd469912689df511311343ec8f31bb75cabf8c577aef7` |
| `docs/research/clinical-signoff-addendum.md` | `2b63422efa63f256aef7fcac6f3a3ec3178148a60a3a85199810c75468b5340d` |

No mismatch. No halt.

**CF-197** OPEN, owner builder, P09. The catalogue search control's
keyboard order, focus order and `aria-live` announcement were asserted
from source at P04-T02 and never exercised in a browser or with
assistive technology. Do not repair it. Open arithmetic 101 + 1 − 0 =
102. Next free id CF-198.

**html 24** (python `Path('.next/server/app').rglob('*.html')` after the
STEP 0 build):

```
/_global-error
/_not-found
/ar/about
/ar/announcements
/ar/contact
/ar/departments
/ar/equipment
/ar/lab-to-lab
/ar/locations
/ar/online-results
/ar/privacy-policy
/ar/programmes
/ar/videos
/en/about
/en/announcements
/en/contact
/en/departments
/en/equipment
/en/lab-to-lab
/en/locations
/en/online-results
/en/privacy-policy
/en/programmes
/en/videos
```

Home, Offers, Programme detail, partner-lab and dashboard remain
request-dynamic. No `ar.html` / `en.html`. `.next/prerender-manifest.json`
lists `/ar/programmes` and `/en/programmes` as static. No nested
`/ar/programmes/<slug>` prerender rows. Route table unchanged from
P04-T02.

Existing specs: 55 pass, 0 fail.
`node --import ./scripts/spec/register.mjs --test` over seven files
excluding `brandHead.spec.ts` (CF-184).

---

## STEP 1 — production identity

Command. `npx vercel api /v13/deployments/nel-nile-egypt-labs.vercel.app`

| Field | Value |
|---|---|
| `gitSource.sha` | `83b147356541be7d6fccf0bcd74a2819ae0abdc5` |
| `readyState` | READY |
| `readySubstate` | PROMOTED |
| `target` | production |
| `githubCommitMessage` | `Merge pull request #155 from Jovo-Jovi/p04-t02` |

`git rev-parse origin/main` equals that SHA. No halt.

`NEL_LABTEST_CONTENT` is present on the deployment environment key list.
`npx vercel env ls production` lists it as Hidden, Secret, Production.
It was not set, not changed, and its value is not written here. LabTest
lists render on unauthenticated GET, and `isLabTestContentEnabled`
accepts only `"on"`, so the deployed value is `"on"`.

---

## STEP 2 — the data-integrity limb

**The invariant is `124 → 71` and nothing else.**

Command. `npx supabase db query --linked --file` against SQL in `%TEMP%`
(not in the repo).

| Figure | Live |
|---|---|
| published `"ProgrammeLabTest"` | 124 |
| distinct published `"LabTest"` those rows resolve to | 71 |
| published `"Programme"` | 9 |
| published `"ProgrammeTier"` | 14 |
| unpublished `"LabTest"` | 0 |
| unpublished `"Programme"` | 0 |
| `creatinine-urea-combined` rows | 0 |

Command. `python -X utf8 data/seed/verify_seed.py`

```
programmes:        9
canonical LabTests:71
relationships:     124
124 -> 71
QA-flagged LabTests: 0
PASS
```

The live figures and the seed figures agree.

### 178 — derived rendering metric, not an invariant

Command. Linked `public."programmeLabTests"(programme, tier, audience)`
once per published `"ProgrammeTier"` slot.

| Programme slug | Slot (tier / audience) | Resolved rows |
|---|---|---|
| `general-checkup` | Silver / none | 13 |
| `general-checkup` | Gold / none | 21 |
| `general-checkup` | Platinum / Female | 27 |
| `general-checkup` | Platinum / Male | 27 |
| `general-checkup` | Children / none | 15 |
| `general-checkup` **subtotal** | | **103** |
| `kidney-profile` | none / none | 8 |
| `liver-profile` | none / none | 8 |
| `diabetes` | none / none | 7 |
| `cardiovascular-profile` | none / none | 5 |
| `joint-bone-pain` | none / none | 11 |
| `infertility` | none / Male | 6 |
| `infertility` | none / Female | 8 |
| `pregnancy-follow-up` | none / none | 14 |
| `pre-marital` | none / none | 8 |
| **nine-Programme sum** | | **178** |

`general-checkup` 13 + 21 + 27 + 27 + 15 = 103. Nine-Programme sum 178.

`"ProgrammeLabTest"` stores tier membership as a delta, so Gold holds
Gold-only rows, while the `programmeLabTests` RPC resolves each
published slot independently and unions the lower tiers into it. A
LabTest therefore renders once per slot that contains it. The four
sites P04-T01-F traced, still the render path:

- `src/components/site/ProgrammeDetail.tsx:179-186` maps `resolution.rows`
- `src/lib/programmeLabTests.ts:115-120` `resolveSlotLabTests`
- `src/lib/programmeLabTests.ts:126-135` `resolveEachPublishedSlot`
- `src/app/[locale]/(public)/programmes/[slug]/page.tsx:40-42`

178 is a public rendering count and is not a catalogue-membership
figure. G4's invariant is `124 → 71`.

Unauthenticated GET of the eighteen Programme detail URLs produced 356
`<article>` LabTestCards (178 × 2 locales), with `general-checkup` 103
in each locale. That agrees with the RPC, and it is still not the
invariant.

CF-196 remains OPEN: `CONTENT_MODEL.md` §3b states Platinum Male at 26
where this RPC resolves 27. Clinical data is unaffected.

---

## STEP 3 — the clinical limb

Three digests by PR-37, quoted in STEP 0. Match.

Unauthenticated GET of all nine Programme detail pages in both locales
against `https://nel-nile-egypt-labs.vercel.app`. Every `<article>`
`<h3>` LabTest name checked against
`docs/research/clinical-worklist.md` Section A.

| Surface | HTTP | Names rendered | Unique | Matched | Unsigned |
|---|---|---|---|---|---|
| 18 Programme detail URLs | 200 × 18 | 356 | 142 | 142 | **0** |
| `/ar/programmes` search HTML | 200 | 142 | 142 | 142 | **0** |
| `/en/programmes` search HTML | 200 | 142 | 142 | 142 | **0** |

Index keys: ar 71 / en 71, identical, none outside the signed worklist.
Membership slugs on both listing pages:

`cardiovascular-profile` · `diabetes` · `general-checkup` ·
`infertility` · `joint-bone-pain` · `kidney-profile` · `liver-profile` ·
`pre-marital` · `pregnancy-follow-up`

Those are the nine published Programmes. `creatinine-urea-combined` is
absent from the index.

Unpublished reachability, commands:

- Linked counts: unpublished `"LabTest"` 0, unpublished `"Programme"` 0.
- Search index keys ⊆ signed worklist; membership ⊆ the nine published
  slugs.
- GET `/ar/programmes/creatinine-urea-combined` HTTP **404**.
- GET `/en/programmes/creatinine-urea-combined` HTTP **404**.

No unpublished LabTest or Programme is reachable through either
surface.

---

## STEP 4 — the bilingual limb

Command. `python -X utf8 scripts/audit/p06-standing-counts.py`

```
catalogue ar 617
catalogue en 617
catalogue identical_order True
catalogue set_identical True
catalogue dup_ar 0
catalogue dup_en 0
```

Base **617/617**, key sets identical, 0 duplicates.

### Control copy, measured per locale

From `src/lib/catalog.ts`, then against the live HTML / client chunks.

| String | `ar` | `en` | Where measured |
|---|---|---|---|
| label | البحث في التحاليل | Search LabTests | present in `/ar/programmes` and `/en/programmes` HTML |
| placeholder | اسم التحليل أو الاسم البديل | LabTest name or alias | present in that locale's HTML |
| empty | أدخل اسماً أو اسماً بديلاً للبحث في التحاليل المنشورة. | Enter a name or alias to search published LabTests. | present in that locale's HTML |
| none | لا توجد مطابقة. | No matches. | absent from initial HTML; present in the client chunks for both locales |
| hitCount | عدد المطابقات | Match count | absent from initial HTML; present in the client chunks for both locales |

The empty state is the initial `role="status"` `aria-live="polite"`
text. none and hitCount render after the Visitor types; they ship in
the same client bundle both locales consume, selected by `translate`.
A behaviour that worked in one locale only would be a FAIL. None was
found.

Visible `<label htmlFor>` on the search input in both locales. Input
`type="search"`, no `name`, no parent `<form>`.

### Nine queries, per locale, against the production index

The listing pages both embed `{ ar, en }` with 71 identical keys.
`searchCatalogueIndex` (`src/lib/catalogueSearch.ts`) is
locale-independent: a query matches `name_en`, `name_ar` and every
alias, as `CONTENT_MODEL.md` §3f states. The production index was
extracted from `/ar/programmes` (the `/en/programmes` index is the
same 71/71 set). Each query was therefore the hit set both pages
compute.

| # | Query | `ar` count | `en` count | Hits |
|---|---|---|---|---|
| 1 | exact-en `Albumin/Creatinine Ratio` | 1 | 1 | `acr` |
| 2 | exact-ar `نسبة الألبومين إلى الكرياتينين` | 1 | 1 | `acr` |
| 3 | alias-en `ACR` | 1 | 1 | `acr` |
| 4 | alias-ar `زلال البول` | 1 | 1 | `acr` |
| 5 | partial `CA` | 7 | 7 | first `ca-125`, `ca-15-3`, `ca-19-9` |
| 6 | nothing `xyz-no-such-labtest` | 0 | 0 | — |
| 7 | empty `""` | 0 | 0 | — |
| 8 | whitespace `  Albumin/Creatinine Ratio  ` | 1 | 1 | `acr` |
| 9 | cross-locale: Arabic query on the English map, English query on the Arabic map | 1 | 1 | `acr` |

Query 9 is §3f's own wording, not a guess: a query matches across
`name_en`, `name_ar` and every alias, so an Arabic string hits on an
English page and an English string hits on an Arabic page.

`acr` membership links followed: `/ar/programmes/diabetes`,
`/en/programmes/diabetes`, `/ar/programmes/kidney-profile`,
`/en/programmes/kidney-profile` — HTTP **200** all four.

### Latin-run sample on the Arabic programmes page

Scripts stripped. Tokens outside `dir="ltr"`. Four distinct unisolated
Latin runs: **Facebook**, **Instagram**, **LinkedIn**, **YouTube**
(footer social labels). LabTest abbreviations inside Programme copy
are isolated. Same class as CF-192. Close nothing.

The English page is Latin; an unisolated-Latin sampler there is not a
defect.

### Added payload, flag on

As P04-T02 measured it, not as a second invariant:

- ar html 45595 → 73223 (**+27628**)
- en html 38080 → 65601 (**+27521**)

Both locale maps ship on each page because §3f matches across
`name_en`, `name_ar` and every alias. That is a payload fact for P09,
not a defect.

Production GET sizes (chrome, not an invariant): `/ar/programmes`
73896 bytes, `/en/programmes` 66274 bytes.

---

## STEP 5 — the boundary limb, against the live site

`BOUNDARY_MODEL.md` §4 walked item by item.

**Item 1.** PASS. This task writes no column. `git diff --stat` under
`src/`, `supabase/` and `data/seed/` is empty. Linked
`information_schema`: public tables 13, public columns 182,
`created_by` 0. Name scan for `patient`, `email`, `password`,
`created_by`, `owner`, `birth`, `result` on `public` columns: 0.

**Item 2.** PASS. No route handler or server action accepts a personal
or medical field for catalogue search. The search `<input>` is
`type="search"` with no `name`, no parent form and no submission.
The guard exemption is keyed on those properties rather than on the
path alone. Quoted from `scripts/guard/boundary.mjs:198-204`:

```
function isProgrammesCatalogueSearchInput(tag, attrs, label) {
  if (tag !== "input") return false;
  if (!label.endsWith("/programmes.html")) return false;
  const type = (attrs.type ?? "").trim().toLowerCase();
  const name = (attrs.name ?? "").trim();
  return type === "search" && name.length === 0;
}
```

A future `<input name="...">` on those pages still fails the scan.

**Item 3.** PASS. No bucket write this task. Linked
`storage.buckets`: `media-asset`, `public` false, `file_size_limit`
5242880.

**Item 4.** PASS. `console.` under `src/` → 0. No public-route body
logging found.

**Item 5.** PASS. `patient` only in comments that forbid Visitor or
patient fields. `result` is not a domain identifier.
`ResultsPortalLink*` is the permitted compound.

**Item 6.** PASS. Live portal href
`https://www.nileegyptlabresults.com/Login/` (no query, no fragment)
on `/ar/programmes` and `/en/programmes`. Opens `_blank`.

**Item 7.** PASS. Unauthenticated GET of both programmes pages: no
`fonts.googleapis`, no `gtag`, no `googletagmanager`, no `<iframe>` /
`<embed>` / `<object>`. YouTube is an outbound footer link, not an
embed.

**Item 8.** Framing half PASS: `iframe` / `embed` / `object` = 0 on
both programmes pages and on the eighteen detail URLs. CSP half is
absent: every measured GET served no `Content-Security-Policy`
header, so there is no `frame-src` that excludes the results-portal
host. **That is CF-177, owned by P07, and it is a G7 blocker, not a
G4 one. Deferred, not passed.** This task does not add a CSP header.

No §4 item other than item 8's CSP is FAIL.

---

## STEP 6 — carry-forward sweep

Close nothing. The reviewer rules at the gate.

CFs whose Lands-at phase is P04:

| Id | Status | Blocks G4? |
|---|---|---|
| CF-22 | CLOSED at P04-T01 | No. Flag on; lists render; unsigned 0. |
| CF-52 | OPEN, Lands `P04 ADMIN_SPEC.md` | No. Operator dashboard chrome language. `ADMIN_SPEC.md` exists. Not the public search surface. |
| CF-194 | CLOSED at P04-T01 | No. `NEL_LABTEST_CONTENT` is on the production env list; lists render. |

Named rows:

**CF-25** — OPEN, Lands P06 / G6. `eligibility.note_ar` / `note_en`
unauthored for the three audience-restricted memberships. Does **not**
block G4. G6 already passed. G4's clinical limb is signed LabTest
names on the public surfaces; those names matched the worklist,
unsigned 0. The notes are still missing and stay OPEN.

**CF-54** — OPEN, Lands P03 search architecture. Cross-script matching
was unspecified in `I18N_MODEL.md` §11. `CONTENT_MODEL.md` §3f now
states a query matches `name_en`, `name_ar` and every alias. STEP 4
query 9 measured that on the production index: Arabic and English
queries both return `acr` regardless of page locale. Does **not**
block G4. The row stays OPEN; the architecture question is answered
in §3f and in code, and the reviewer rules at the gate.

**CF-196** — OPEN, Lands P07. §3b Platinum Male 26 vs live RPC 27.
Does **not** block G4. The invariant remains `124 → 71`. 178 stays a
derived rendering metric. Do not repair it here.

Recorded this task, Lands P09:

**CF-197** — OPEN, owner builder, P09. Keyboard order, focus order and
`aria-live` asserted from source, never exercised in a browser or
with assistive technology. Does **not** block G4. Accessibility is
already in P09's scope.

CF-177 (item 8 CSP) is OPEN at P07 and is a G7 blocker, named in
STEP 5 as deferred.

---

## STEP 7 — P04 deliverables

From `docs/PHASES.md` §P04. G4 is not declared.

| Deliverable | Landed? | Task |
|---|---|---|
| Confirm the flag, then build the bilingual catalogue index | yes | P04-T01 |
| Produce the artefact and explain the card count | yes | P04-T01-F |
| Search on the programmes page, both locales | yes | P04-T02 |
| static bilingual index over Programmes and LabTests | yes | P04-T01 / P04-T01-F |
| search on the البرامج page, both locales | yes | P04-T02 |
| **G4** — clinical, data integrity and bilingual gates | **not issued** | reviewer, from this pack |

The id-less boxes and the **G4** box stay unchecked. This file does
not record G4 as PASSED.

---

## Standing counts

- `git ls-files supabase/migrations/` → **36**
- html **24**; route table unchanged
- `grep -c "^### OD-"` → **29**
- `grep -c "^### D-"` → **49**
- DRAFT status lines **0**
- OD-21 §3 still **SUSPENDED**
- Catalogue ar/en **617/617**, identical, 0 duplicates
- Open CF: base 101 + 1 (CF-197) − 0 = **102**
  (`python` count of `^\| CF-[0-9]+ .*\| OPEN \|` → 102)
- Research excluding README and `assets/`: **32** after this file
  (`git ls-files docs/research/` minus README.md and `assets/`)
- Three clinical digests by PR-37, quoted in STEP 0

Specs unchanged: 55 pass, 0 fail. The gate's measurement is the live
reads at STEP 2 to STEP 5.

Acceptance standards, measured, not declared as a gate pass:

- **Clinical.** Every public LabTest name on the detail pages and on
  the search surface matched the signed worklist. Unsigned 0.
- **Data integrity.** `124 → 71` computed from live rows. 178 recorded
  separately as a derived rendering metric.
- **Bilingual.** Every control and the nine queries measured in `ar`
  and `en` separately.
