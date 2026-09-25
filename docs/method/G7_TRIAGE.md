# NEL — G7 carry-forward triage

**Status:** SIGNED — 25 September 2026. Proposed by the reviewer; approved by the human in full, with the clarifications in §Sign-off.
**Scope:** every carry-forward OPEN at P07-T06 — 109 rows — plus two new rows.
**Rules:** the human's Stage 2 rules. No disposition changes a feature, a workflow, the access model or the appearance.

## Dispositions

| Disposition | Meaning | Rows |
|---|---|---|
| CLOSE | Already resolved or superseded; closes now, citing what resolved it | 31 |
| FIX-DOC | Documentation corrected in the triage task, then closed | 2 |
| ACCEPT | Accepted as delivered: client, laboratory or commercial matters, or recorded divergences with no behaviour at stake. Closes as accepted | 42 |
| MAINTENANCE | Accepted for launch; listed for the maintenance agreement (Stage 3). Leaves the open count | 22 |
| HANDOVER | Stays OPEN until the named handover step closes it (Stage 3, 4, 5 or G7) | 12 |
| **Total** | | **109** |

After the triage the OPEN rows are exactly the twelve HANDOVER rows, each with its closing step.

## New rows the triage task lands

| # | Item | Disposition |
|---|---|---|
| N1 | P07-T06 Q2 found one Auth account with no `nel_principal`: a pending PartnerLab account. Counts only; no identity was read. | ACCEPT — the account stays exactly as it is. The Operator decides its status through the existing PartnerLab queue; this project does not delete, reject, approve or modify it |
| N2 | `QUOTATION_AMENDMENTS.md` §8 records A2 as delivered, but the vector mark is not: it waits on a client-supplied file (CF-65, CF-74). The reviewer's P07-T04 payload overstated it. | FIX-DOC — the row reads "Delivered, except the vector mark, which waits on a client-supplied file (CF-65, CF-74)" |

## The rows

| CF | Owner | Disposition | Closes at | Reason |
|---|---|---|---|---|
| CF-01 | Lab clinical staff | CLOSE | — | Resolved by the laboratory's signed catalogue of 6 September 2026 (M8): the five flagged defects corrected and the four absent analyses answered in the worklist. |
| CF-03 | Client | CLOSE | — | Superseded: launch is the cutover window of OD-35, supplied by the human at Stage 5. |
| CF-05 | Client | ACCEPT | — | Branch hours are the laboratory's content, entered in the Branches module. The site publishes what the laboratory enters. |
| CF-07 | Client | HANDOVER | Stage 5 | Who controls `nileegyptlabs.org` is a cutover input: the DNS inventory of `CUTOVER_RUNBOOK.md` (Stage 3), settled at Stage 5. |
| CF-08 | Client | ACCEPT | — | The laboratory's own channel. The Videos module publishes whatever the laboratory adds. |
| CF-09 | Excluded from scope — propose as paid add-on | ACCEPT | — | Excluded from scope by the human. Third-party listings and pages are the laboratory's. |
| CF-10 | Excluded from scope — propose as paid add-on | ACCEPT | — | Excluded from scope by the human. Third-party listings and pages are the laboratory's. |
| CF-11 | Client — written reminder filed internally, not sent | CLOSE | — | Duplicate of CF-118, which carries the portal certificate to handover. |
| CF-14 | Lab, then Opus Max translation | CLOSE | — | Resolved by M8: all 71 signed LabTests carry an Arabic name, every membership carries an explicit eligibility, and no QA flag is set. The alias gap is CF-204. |
| CF-17 | client-facing, yours | ACCEPT | — | Commercial, the human's. Quotation Revision 1 records the delivered scope without prices; no price is set in this repository. |
| CF-18 | yours | ACCEPT | — | Commercial, the human's. Quotation Revision 1 records the delivered scope without prices; no price is set in this repository. |
| CF-24 | Reviewer | ACCEPT | — | `GLOSSARY.md` §7 governs route segments as URL text, and `guard:naming` passes on the delivered tree. |
| CF-25 | Lab clinical staff | ACCEPT | — | Notes on restricted memberships are the laboratory's clinical content. The delivered site shows no note where none is authored; CF-201 is the measurement. |
| CF-26 | Reviewer | ACCEPT | — | Historical rationale in `CONTENT_MODEL.md` §3c. Its own enumeration, and `PHASES.md` §1a, state the same 14 patterns and 44 URLs, so no reader-facing contradiction remains. |
| CF-27 | Reviewer | ACCEPT | — | Method documents record the process of their time (`docs/method/README.md`, P07-T04). G4 passed with the clinical gate applied. |
| CF-28 | human | HANDOVER | Stage 4 — final transfer | Closes at the final transfer step (Stage 4), when the human explicitly authorises making the repository private (OD-04, OD-35), with CF-213. Not before. |
| CF-37 | human | HANDOVER | Stage 4 | Plan tier, pausing and backups are `CUTOVER_RUNBOOK.md` steps (Stage 3). Closes at Stage 4 on paid plans. |
| CF-41 | builder | MAINTENANCE | — | Node engine pin in CI. Toolchain, not product; at the next dependency upgrade. |
| CF-45 | client | ACCEPT | — | No editable original or vector mark was supplied by the client. The delivered mark is the raster in `public/mark/`. A supplied SVG drops in with no code change. |
| CF-46 | reviewer | ACCEPT | — | The results portal is the laboratory's separate application, outside NEL. |
| CF-49 | human | HANDOVER | G7 | The laboratory's written approval of the mark is a G7 prerequisite, closed at G7. |
| CF-51 | human | ACCEPT | — | Commercial, the human's. Quotation Revision 1 records the delivered scope without prices; no price is set in this repository. |
| CF-52 | reviewer | CLOSE | — | Decided in `ADMIN_SPEC.md` §4a; the documents were aligned at P07-T03 and P07-T04. |
| CF-62 | reviewer | CLOSE | — | Superseded: real values come from SiteSettings and the results-portal variables, live since P08-T12 (CF-137). |
| CF-63 | reviewer | CLOSE | — | Superseded by CF-66. |
| CF-65 | client | ACCEPT | — | No editable original or vector mark was supplied by the client. The delivered mark is the raster in `public/mark/`. A supplied SVG drops in with no code change. |
| CF-66 | reviewer | ACCEPT | — | The delivered components are the reference. The specification gap in `DESIGN_SYSTEM.md` is recorded, and the design rules are left unchanged under the Stage 2 rules. |
| CF-67 | human | CLOSE | — | Superseded by OD-26: every region renders from published data, and the clinical sign-off landed. The certification rule stands (`QUOTATION_AMENDMENTS.md` §8, B2). |
| CF-68 | reviewer | CLOSE | — | Superseded by OD-26: every region renders from published data, and the clinical sign-off landed. The certification rule stands (`QUOTATION_AMENDMENTS.md` §8, B2). |
| CF-71 | reviewer | CLOSE | — | Superseded by OD-26: every region renders from published data, and the clinical sign-off landed. The certification rule stands (`QUOTATION_AMENDMENTS.md` §8, B2). |
| CF-74 | client | ACCEPT | — | No editable original or vector mark was supplied by the client. The delivered mark is the raster in `public/mark/`. A supplied SVG drops in with no code change. |
| CF-75 | reviewer | CLOSE | — | Superseded by OD-26: every region renders from published data, and the clinical sign-off landed. The certification rule stands (`QUOTATION_AMENDMENTS.md` §8, B2). |
| CF-78 | reviewer | ACCEPT | — | Standing guidance under D-40; `guard:schema` and the boundary gate enforce it. |
| CF-79 | human | ACCEPT | — | OD-10 accepted operating without a staging database. |
| CF-80 | human | CLOSE | — | Resolved by M8: all 71 signed LabTests carry an Arabic name, every membership carries an explicit eligibility, and no QA flag is set. The alias gap is CF-204. |
| CF-81 | client | CLOSE | — | Resolved by M8: all 71 signed LabTests carry an Arabic name, every membership carries an explicit eligibility, and no QA flag is set. The alias gap is CF-204. |
| CF-82 | client | CLOSE | — | Resolved by M8: all 71 signed LabTests carry an Arabic name, every membership carries an explicit eligibility, and no QA flag is set. The alias gap is CF-204. |
| CF-83 | reviewer | ACCEPT | — | Every reverse migration is authored and none has been executed. A recorded limitation, stated in the handover document. |
| CF-86 | reviewer | CLOSE | — | Process records. Each lesson is applied in later fences and precedents. |
| CF-87 | reviewer | ACCEPT | — | A tooling observation from M3. The grants were verified by another route at the time. |
| CF-89 | reviewer | CLOSE | — | Superseded: memberships are explicit since M8, and the live function is exercised by the published catalogue (G4, G6). |
| CF-90 | client | CLOSE | — | Superseded: the signed catalogue is published, and the nine programme pages render (P06-T03). |
| CF-92 | reviewer | ACCEPT | — | A recorded evidence or naming gap with no behaviour at stake. Left as delivered. |
| CF-93 | reviewer | CLOSE | — | `PRODUCT_BRIEF.md` authored at P07-T03. |
| CF-94 | reviewer | ACCEPT | — | Historical; ratified at the time (OD-08, P02-T15; M7B-2). |
| CF-95 | reviewer | ACCEPT | — | Motion durations in code differ from `DESIGN_SYSTEM.md` §5. Recorded; appearance and design rules unchanged under the Stage 2 rules. |
| CF-96 | reviewer | CLOSE | — | The three tables exist since M5. |
| CF-97 | reviewer | CLOSE | — | Superseded: the signed catalogue is published, and the nine programme pages render (P06-T03). |
| CF-98 | reviewer | MAINTENANCE | — | Guard tooling, not product. |
| CF-100 | reviewer | ACCEPT | — | Rendering of historical ledger rows; the rows are history and stay as written. |
| CF-101 | reviewer | ACCEPT | — | The delivered components are the reference. The specification gap in `DESIGN_SYSTEM.md` is recorded, and the design rules are left unchanged under the Stage 2 rules. |
| CF-103 | client | ACCEPT | — | Arabic content review and aliases are the laboratory's. Stated as a known limitation in `SCOPE.md` §26. |
| CF-105 | client | HANDOVER | Stage 3 | The laboratory's own PDPL obligations as controller. Named in the Stage 3 handover document; closed there. |
| CF-106 | reviewer | ACCEPT | — | Row-level security denies every anonymous write. The table grants are platform-managed, and changing them is not required under the Stage 2 rules. |
| CF-108 | reviewer | MAINTENANCE | — | Tightening the bilingual checks to reject empty strings is a migration and not a security requirement. |
| CF-111 | reviewer | MAINTENANCE | — | Guard tooling, not product. |
| CF-112 | reviewer | ACCEPT | — | A recorded evidence or naming gap with no behaviour at stake. Left as delivered. |
| CF-114 | reviewer | MAINTENANCE | — | Guard tooling, not product. |
| CF-115 | reviewer | CLOSE | — | Process records. Each lesson is applied in later fences and precedents. |
| CF-116 | reviewer | CLOSE | — | Process records. Each lesson is applied in later fences and precedents. |
| CF-117 | reviewer | HANDOVER | Stage 5 | The post-cutover checks in `CUTOVER_RUNBOOK.md` verify that the portal URL renders. Closed at Stage 5. |
| CF-118 | client | HANDOVER | Stage 5 | The laboratory's portal certificate. A pre-cutover check in `CUTOVER_RUNBOOK.md`; closed at Stage 5. |
| CF-119 | reviewer | HANDOVER | Stage 5 | The post-cutover checks in `CUTOVER_RUNBOOK.md` verify that the portal URL renders. Closed at Stage 5. |
| CF-120 | reviewer | ACCEPT | — | `guard:schema` checks the migrations. P07-T06 found the live schema counts equal to them. |
| CF-124 | reviewer | ACCEPT | — | Offers are private (OD-15): the dashboard grade and the anonymous page answer different questions. Left as delivered. |
| CF-126 | client | HANDOVER | G7 | The client's countersignature of OD-16 is a G7 prerequisite, closed at G7. |
| CF-129 | reviewer | ACCEPT | — | The compensating control is the artefact digest verified at every gate (PR-37). Changing the check is a code change outside the Stage 2 rules. |
| CF-130 | reviewer | CLOSE | — | Process records. Each lesson is applied in later fences and precedents. |
| CF-138 | reviewer | FIX-DOC | — | The sentence goes with the CF-221 rewrite. The portal URL is live (CF-137, closed at P08-T12). |
| CF-139 | reviewer | CLOSE | — | `SCOPE.md` authored at P07-T03. |
| CF-143 | reviewer | CLOSE | — | `PHASES.md` §3 now reads every phase closed, with P07 active. |
| CF-144 | reviewer | ACCEPT | — | Historical; ratified at the time (OD-08, P02-T15; M7B-2). |
| CF-145 | reviewer | CLOSE | — | Process records. Each lesson is applied in later fences and precedents. |
| CF-146 | reviewer | CLOSE | — | Process records. Each lesson is applied in later fences and precedents. |
| CF-147 | reviewer | ACCEPT | — | Every reverse migration is authored and none has been executed. A recorded limitation, stated in the handover document. |
| CF-150 | human | ACCEPT | — | Commercial, the human's. Quotation Revision 1 records the delivered scope without prices; no price is set in this repository. |
| CF-151 | reviewer | ACCEPT | — | A tooling or proof gap with the control in place. Left as delivered. |
| CF-155 | reviewer | ACCEPT | — | Known limitation of signup enumeration-neutrality: untested for byte identity, and not neutral in time. Testing needs a production signup, and a fix changes behaviour; both are outside the Stage 2 rules. |
| CF-157 | reviewer | ACCEPT | — | Known limitation of signup enumeration-neutrality: untested for byte identity, and not neutral in time. Testing needs a production signup, and a fix changes behaviour; both are outside the Stage 2 rules. |
| CF-160 | reviewer | CLOSE | — | Informational: the eleven policies are public by decision, and Offer's was dropped at M10. |
| CF-161 | reviewer | MAINTENANCE | — | Performance, logging or hydration cleanup, not security. |
| CF-162 | reviewer | MAINTENANCE | — | Performance, logging or hydration cleanup, not security. |
| CF-163 | reviewer | MAINTENANCE | — | Performance, logging or hydration cleanup, not security. |
| CF-164 | builder | MAINTENANCE | — | Performance, logging or hydration cleanup, not security. |
| CF-166 | reviewer | HANDOVER | Stage 3 | The handover document states the hosted password policy and that it must not be lowered. Closed at Stage 3. |
| CF-171 | reviewer | CLOSE | — | Superseded: one method since PR-37 for digests, and one regex for counts with set-equality checked every task. |
| CF-173 | builder | MAINTENANCE | — | An unexplained redirect in a throwaway session at P08-T24. Verified by a real Operator during handover training; no change in P07. |
| CF-179 | builder | MAINTENANCE | — | Accessibility or interface-text fixes touch code and are outside the Stage 2 rules. Listed as known limitations. |
| CF-184 | builder | MAINTENANCE | — | The spec runner and a CI spec step. Verification tooling, not product. |
| CF-189 | builder | ACCEPT | — | A recorded evidence or naming gap with no behaviour at stake. Left as delivered. |
| CF-190 | builder | ACCEPT | — | A tooling or proof gap with the control in place. Left as delivered. |
| CF-191 | builder | MAINTENANCE | — | Accessibility or interface-text fixes touch code and are outside the Stage 2 rules. Listed as known limitations. |
| CF-193 | reviewer | CLOSE | — | Superseded: one method since PR-37 for digests, and one regex for counts with set-equality checked every task. |
| CF-195 | builder | ACCEPT | — | A recorded evidence or naming gap with no behaviour at stake. Left as delivered. |
| CF-196 | reviewer | CLOSE | — | `CONTENT_MODEL.md` §3b states the live 27 beside the seed figure (P07-T03). |
| CF-201 | reviewer | ACCEPT | — | Notes on restricted memberships are the laboratory's clinical content. The delivered site shows no note where none is authored; CF-201 is the measurement. |
| CF-203 | human | HANDOVER | Stage 4 — final transfer | The builder environment's Supabase MCP connection stays active and unchanged until the final transfer step (Stage 4): all checks PASS, the site finally approved, cutover ready, and no remaining dependency on it. It is revoked there, not before. The Stage 3 access matrix records it. |
| CF-204 | Lab clinical staff | ACCEPT | — | Arabic content review and aliases are the laboratory's. Stated as a known limitation in `SCOPE.md` §26. |
| CF-205 | reviewer | MAINTENANCE | — | Performance, logging or hydration cleanup, not security. |
| CF-206 | reviewer | MAINTENANCE | — | Performance, logging or hydration cleanup, not security. |
| CF-208 | reviewer | MAINTENANCE | — | Accessibility or interface-text fixes touch code and are outside the Stage 2 rules. Listed as known limitations. |
| CF-211 | reviewer | MAINTENANCE | — | Accessibility or interface-text fixes touch code and are outside the Stage 2 rules. Listed as known limitations. |
| CF-213 | reviewer | HANDOVER | Stage 4 — final transfer | Closes at the final transfer step (Stage 4), when the human explicitly authorises making the repository private. Not before. |
| CF-215 | builder | MAINTENANCE | — | Performance, and a deprecation rename. Not security. |
| CF-216 | builder | MAINTENANCE | — | Performance, and a deprecation rename. Not security. |
| CF-219 | builder | MAINTENANCE | — | The spec runner and a CI spec step. Verification tooling, not product. |
| CF-220 | human | MAINTENANCE | — | Accepted for launch as a known limitation; the `SECURITY_MODEL.md` §4 requirement stays recorded as unmet. For the maintenance agreement. |
| CF-221 | reviewer | FIX-DOC | — | The G7 triage task rewrites the section to the current next action. |
| CF-223 | human | MAINTENANCE | — | Accepted for launch as a known limitation. Application-level rate limiting is for the maintenance agreement. |

## Sign-off

The human approved every disposition as proposed on 25 September 2026, and set four clarifications:

1. **Supabase MCP (CF-203).** The builder environment's connection stays active and unchanged until the final transfer step. Nothing in this triage revokes it.
2. **Repository visibility (CF-28, CF-213).** The repository keeps its current visibility until the human explicitly authorises the final transfer step. Nothing in this triage changes it.
3. **The pending PartnerLab account (N1).** Unchanged. The Operator decides it through the existing workflow.
4. **The finished website.** Reviewed with the owner and approved. From here only documentation, scope descriptions and strictly necessary security work proceed; no feature, workflow, access-model or appearance change.
