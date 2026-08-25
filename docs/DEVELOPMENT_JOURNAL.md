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

