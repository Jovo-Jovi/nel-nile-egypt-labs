# Clinical catalogue sign-off — addendum 1

Status: COUNTERSIGNED

Issued: 7 September 2026
Attaches to: `docs/research/clinical-signoff.md`, signed 6 September 2026
Worklist bound by that signature: `docs/research/clinical-worklist.md`,
SHA-256 `22b2c73b697460b2def3a86e4b6489c987874a071c4d9c0f792a46612197569f`

## Why this exists

The signed document contains a statement about what the signature would do,
and that statement was wrong.

Its "Build-side requirements" section says the production gate cannot open
because the artefact does not reach the deployment, and closes: treat a signed
copy as a record of the laboratory's approval and not as evidence that the
production gate will open.

That was the developer's assessment and it was incorrect. The gate opened in
production the moment the document was signed. This was established on
6 September 2026 by a test that published a Programme carrying no laboratory
content to the live deployment. It was unpublished immediately and deleted, and
the published count across all four clinical tables was read afterwards as
zero, twice.

## What is corrected

1. **Build-side requirement 1 is withdrawn.** The artefact does reach the
   deployment. The publish gate reads it in production and opens on it.
2. **The closing instruction is withdrawn.** A signed copy of that document
   IS evidence that the production gate will open, and was from the moment it
   was signed.
3. **Build-side requirement 2 stands and is more urgent.** The gate still opens
   on two literal lines of text. That is now a live production control rather
   than a future improvement.

## What is NOT changed

Nothing in the signature's scope. The 71 Arabic names, the 124 eligibility
decisions, the 5 resolved QA findings and the 4 description decisions are
unaffected, and the worklist hash above is unchanged. The allocation of
responsibility is unaffected. This addendum corrects one factual statement
about the software, made by the developer, in a document the laboratory signed.

## What the laboratory should know

No clinical content of the laboratory's has been published. Every catalogue row
remains draft. Nothing a Visitor can reach carries a test name, in either
language.

The practical change is this: from 6 September 2026, publishing the catalogue
is a decision the dashboard will carry out rather than refuse. That decision
is the laboratory's to time.

## Countersignature

By countersigning, the laboratory confirms it has read this correction and that
its approval of the clinical catalogue is unchanged.

Countersigned: androw
Role: owner
Date: 7 September 2026

Change the status line at the top of this file so it reads exactly
`Status:` followed by one space and the word COUNTERSIGNED, with nothing else
on that line. That word is the only permitted value. No code reads this file
and no gate depends on it.
