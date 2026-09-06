# Clinical publish gate — correction

Date: 7 September 2026
To: Androw
From: the developer
Status: draft for sending — this file is not the notice until it is sent

## The fact

On 6 September 2026 you signed `docs/research/clinical-signoff.md`. That
document's Build-side requirements section told you that a signed copy is a
record of the laboratory's approval and not evidence that the production
publish gate will open.

That sentence was the developer's assessment. It was incorrect. The gate
opened in production the moment the document was signed. This is a fact
about the software. It is not a clinical decision, and it is not a decision
the laboratory made.

The same day, a test published a Programme that carried no laboratory
content to the live deployment, unpublished it immediately, and deleted it.
The published count across all four clinical tables was then read as zero,
twice.

## What has not happened

No clinical content of the laboratory's has been published. Every catalogue
row remains draft. Nothing a Visitor can reach carries a test name, in
either language.

The signature's scope is unchanged: 71 Arabic names, 124 eligibility
decisions, 5 resolved QA findings, 4 description decisions. The worklist
hash the signature attaches to is unchanged.

## The addendum

The correction sits beside the signed document. It does not edit it.

- File: `docs/research/clinical-signoff-addendum.md`
- Title: Clinical catalogue sign-off — addendum 1
- Issued: 7 September 2026
- Status: UNCOUNTERSIGNED

Please read it and countersign. Countersigning confirms that the laboratory
has read this correction and that its approval of the clinical catalogue is
unchanged.

From 6 September 2026, publishing the catalogue is a decision the dashboard
will carry out rather than refuse. Timing that decision is the laboratory's.

## Whose error

The incorrect statement was written by the developer, in a document the
laboratory signed. The laboratory's clinical decisions are not in question.
