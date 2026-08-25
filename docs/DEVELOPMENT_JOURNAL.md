# NEL — DEVELOPMENT JOURNAL

Append-only narrative history. Intent, deviations and judgement that no diff shows.

---

## 2026-08-24 — Repo scaffolded

Bootstrap scaffold landed: method files, Cursor builder rules, seed data,
vocabulary and boundary model.

Preceding this: a public audit of the 2018 site (9 findings, 1 critical),
an owner information form returned by the client's IT manager, and an
open-source research pass that recovered branch coordinates, the full asset
inventory, and the complete test programme content.

Seed data extracted from `features.html` (Last-Modified 21 Feb 2018):
121 programme-test relationships resolving to 72 unique LabTests.

Five clinical defects and four missing tests flagged during extraction, not
corrected. Dispatched to the lab as CF-01.

Phase P00. Scope not yet frozen — awaiting signed quotation.

---

## 2026-08-25 — Gate-0 seeded pair frozen (P00-T01, landed as T01-R)

`GLOSSARY.md` and `BOUNDARY_MODEL.md` reviewed, amended and frozen. Seed
invariants recomputed independently of `verify_seed.py`: 121 relationships
resolving to 72 unique LabTests, zero orphans in either direction, zero duplicate
(Programme, tier, LabTest) triples.

**T01 halted at STEP 4b and the halt was correct.** The prompt's anchor was a
single sentence, but its replacement text rewrote a sentence sitting two lines
below the anchor. Applying it literally would have frozen a paragraph that told
the reader twice to consult the client's legal adviser, with inconsistent
spelling, and that simultaneously called the no-banner position "genuinely in
doubt" and the simplification "real and worth the question." The builder staged
both readings, produced the diff for each, and stopped rather than choosing.
T01-R re-anchored 4b on the whole three-line paragraph.

That halt is now generalised as PR-15: enumerated HALT conditions are a floor,
not a ceiling. A duplicated sentence or a self-contradicting passage is a halt
whether or not a rule names it. PR-15 fired twice more the same day — once on the
CF-11 row, whose owner cell claimed a written reminder was filed while the
appended amendment stated no notice was ever sent (resolved: filed internally,
never sent, both now stated explicitly), and once on the ledger's closing note,
which asserted every row was a client dependency at the moment three
project-owned rows landed.

Two decisions closed: `ProgrammeTier` becomes two axes rather than one, and
`ResultsPortalLink` is a build-time constant with an allowlisted host and no
Operator edit path. Both closed after the `GLOSSARY` cells describing them as
undecided had already been approved, so the frozen text is stale on arrival.
Recorded as CF-16 rather than quietly patched, because the freeze means the
correction is a supersession and should read as one.

The `Video` entity is the reason `BOUNDARY_MODEL` grew two evidence items. An
embedded player transmits Visitor IP and sets cookies on page load without a
single column existing to hold it, which is a boundary breach that no schema diff
would ever surface. Item 8 exists because a frame is not a link: framing the
results portal would render its login inside our origin, where a Visitor cannot
check the address bar, and that is a credential-phishing shape regardless of who
asks for it.

Method corrections also landed: canonical document paths (PR-13), after a HALT
condition demanded the journal at a path it has never occupied; and the
PowerShell capture artefact (PR-14), where formatted-table output is silently
discarded and a resolved file path reads as a zero result.

---

## 2026-08-25 — DECISIONS and CONTENT_MODEL authored (P00-T02)

Nineteen decisions filed, including OD-01 (selection rule, region PENDING at
P01), OD-02 (static client-side search index) and OD-03 (scope freeze signed
25 Aug 2026, lapses 15 Sep 2026). `CONTENT_MODEL.md` records the entity model,
the two-axis `ProgrammeTier` mapping, the Children-exclusion cumulation rule,
and the public route set.

Route enumeration is 12 static patterns, 24 locale-prefixed URLs, zero dynamic
public segments. The phase map's 13 was never enumerated; the difference is FAQ,
which the draft quotation marks optional and no OD includes. Search is a
build-time index on the `Programme` listing, not a route. `SESSION_CONTEXT.md`
phase map amended to match the enumeration.

CF-16 closed on the §3h confirmation: D-05 answers the GLOSSARY `ProgrammeTier`
deferral and D-07 answers the `ResultsPortalLink` deferral. PR-13's second
clause superseded by PR-17 (`docs/method/` holds method documents; the binding
pair is `PRECEDENTS.md` and `CARRY_FORWARDS.md`). PR-18 records reviewer
authority; PR-19 records the residual-repair path. CF-17 and CF-18 track the
quotation's superseded payment schedule and the bilingual exclusion that D-10
overrides. Next action is P01-T03 schema.

---

## 2026-08-25 — T02 failed on three defects, closed at T02-A

T02 passed its own checks and was still wrong in three places. Worth recording
which of the three were the builder's and which were the reviewer's, because the
distribution is the useful part.

**The eligibility defect was the serious one.** The seed carries four rows whose
`source_name` restricts them — two PSA rows qualified `male>45`, a semen analysis
qualified `(Males)`, a genetic counselling row qualified `(Both)`. T02 modelled
`ProgrammeLabTest` with a `displayOrder` and nothing else, so those qualifiers
existed nowhere in the model. The cumulation rule then unioned Silver into Gold
and into Platinum, and Silver carries PSA. Applying §3b as landed rendered a
prostate marker to every Visitor selecting Gold, and to every Visitor selecting
Platinum — Female. That is the same harm class the Children constraint exists to
prevent, reached through a slot the Visitor did select rather than one they
inherited. T02 wrote the Children constraint carefully and missed the identical
problem one union away from it. Builder's defect.

`sourceName` is the quieter one and possibly the more expensive. T02 discarded
the seed's verbatim source string. The clinical gate works by comparing the lab's
signed corrections against what the 2018 page actually said, and a string nobody
kept cannot be compared. Five flagged defects and four absent-but-promised tests
are with the lab under CF-01; without `sourceName` there would have been nothing
to check their reply against. Builder's defect.

**Two defects originated in reviewer wording, not builder execution.** The
GLOSSARY froze at T01 with §6 binding the forbidden set to route segments. That
clause is unsatisfiable against the route set this lab needs: `programmes`,
`offers` and `online-results` each carry a banned noun. T02 obeyed the clause
literally and shipped `/{locale}/LabUnit`, `/{locale}/Offer` and
`/{locale}/ResultsPortalLink` as public paths — a schema leaking into an address
bar, produced by following the rule rather than breaking it. GLOSSARY §7 now
supersedes those two words and nothing else. The vocabulary exists to keep
ambiguity out of the codebase, not to choose the lab's URLs.

The route count was the second. T02 enumerated 12 patterns and 24 URLs honestly
against the phase map's unenumerated 13, and reported the difference — but the
enumeration itself omitted a `Programme` detail route, which the search feature
in the same document needed somewhere to land. An honest count of an incomplete
set is still an incomplete set. Real figures: 12 static, 1 dynamic, 42 rendered
URLs.

The clinical flag closed the last gap. PR-08 holds LabTest material behind a
flag, but T02's search index was specified as a build artefact with no flag
condition, so the flag would have hidden a listing while a static JSON file
served all 72 unsigned LabTest names to anyone who requested it. A flag that
does not gate the artefact is not a flag. §3f now emits no index at all while
the flag is off, which makes P04 conditional on the lab's sign-off rather than
on P04's own completion — landed as CF-22, and the phase map now says so.

---

## 2026-08-25 — P00 branch set closed out (P00-T02-H)

Three pull requests merged to `main`: #1 `p00-t01r-gate0-freeze`, #2
`p00-t02-decisions-content-model`, #3 `p00-t02a-amend-content-model`.

**#2 and #3 were both merged where #3 alone would have sufficed.** #3 was
branched from #2, so #3 already carried every commit #2 carried. Merging both
produced two merge commits — `c3b3a63` then `19a740a` — for one logical body of
work. Nothing was lost and nothing was duplicated in the tree, but the history
now records a redundant merge, and the reason is worth keeping: a task that
amends the branch before it is a descendant, not a sibling, and only the tip
needs merging.

The containment proof, before anything was deleted:
`git diff --stat 72bd32f origin/main` returns nothing, 0 lines. `main`'s tree is
byte-identical to the last commit this project verified. All three merged
branches return exit 0 from `git merge-base --is-ancestor <branch> origin/main`.
The seed re-ran on `main` at `121 -> 72`, PASS. Both FROZEN markers survived,
and all four T02-A markers are present on `main`.

Three remote branches deleted with `-d` and `--delete`, never `-D` and never a
force push. Their SHAs are recorded here so any of the three is recreatable by a
single command:

| Branch | SHA |
|---|---|
| `p00-t01r-gate0-freeze` | `78432675c8a73901e903934f1cffaadba018b12d` |
| `p00-t02-decisions-content-model` | `3bf5dd2d7ed9c728362669ab0126e1b9e94ac892` |
| `p00-t02a-amend-content-model` | `72bd32f191cb0faace19bbf51bfb519846504c8d` |

A fourth branch, `p00-t01-gate0-freeze`, existed locally and was never pushed —
the halted T01 run left it behind at `08c9551ba9ce9cd064d69386a5ba24a9fdfff4c6`.
It was reported at the time as holding zero commits. It holds zero commits *that
`main` does not already have*, which is why `-d` accepted it rather than
refusing; the original report was imprecise rather than wrong.

Four carry-forwards landed: CF-24 (GLOSSARY §7 does not reach framework-forced
route directories), CF-25 (`eligibility` notes unauthored, rides the clinical
gate), CF-26 (§3c prose claims a difference from 13 that does not exist — 12
static plus 1 dynamic *is* 13 patterns), CF-27 (`DEVOS_ADAPTATION_NOTES` §5 omits
Clinical from P04 and disagrees with `SESSION_CONTEXT`). Open count 15 → 19. The
four document corrections themselves belong to P01-T03 STEP 0, not here. Phase
state unchanged; next action remains P01-T03 schema.

