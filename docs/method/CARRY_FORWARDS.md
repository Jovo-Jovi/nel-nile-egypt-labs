# NEL — CARRY FORWARDS

Every finding becomes a row here with an owner. Nothing is silently patched.

**Next free id: CF-28**

| Id | Item | Owner | Status | Lands at |
|---|---|---|---|---|
| CF-01 | Clinical corrections outstanding — 5 flagged defects (FSH/TSH, APP/AFP, SCOT/SGOT, `Creatinine\urea`, Westergren spelling) + 4 tests named in descriptions but absent from their panels | Lab clinical staff | OPEN | P06 / G6 |
| CF-02 | Logo unverified — file is 274×35, dated 10 May 2015, likely a Medinova template asset. Client may have no logo at all | Client | OPEN | P02 |
| CF-03 | Launch date unagreed — client stated 1 Sep 2026, not achievable for this scope | Client | OPEN | P00 / G0 |
| CF-04 | Fourth Branch unconfirmed — a lab exists at 37 El Garage St, apt 9, but the listing name and street number do not match | Client | OPEN | P03 |
| CF-05 | Working hours unconfirmed for all four Branches. Google contradicts the supplied 10:00–23:00 on two of them | Client | OPEN | P03 |
| CF-06 | Privacy policy text not supplied. Client states one exists; none is published anywhere | Client | OPEN | P07 — blocks launch |
| CF-07 | `nileegyptlabs.org` — controller unknown. Second mail system (Google Workspace) on a second domain. DNS changed 12 Aug 2026 | Client | OPEN | P01 |
| CF-08 | YouTube channel `@nileegyptlabs` created Jan 2025 but has zero public videos, despite the client confirming videos are ready | Client | OPEN | P06 |
| CF-09 | Hotline 16402 still published on ≥4 third-party directories; 15504 is the chosen number | Excluded from scope — propose as paid add-on | OPEN | P07 |
| CF-10 | Three duplicate Facebook pages fragment their local presence | Excluded from scope — propose as paid add-on | OPEN | P07 |
| CF-11 | Results portal TLS certificate expires **28 Oct 2026**, inside the project window. Risk accepted by client decision, 25 Aug 2026. No written notice sent to the client. Support position held in client correspondence, not in this repo. | Client — written reminder filed internally, not sent | OPEN | P07 |
| CF-12 | `ProgrammeTier` modelling — CLOSED on decision of 25 Aug 2026: two axes, tier (Silver/Gold/Platinum/Children) and audience (none/Male/Female) | Reviewer | CLOSED | `CONTENT_MODEL` at T02 |
| CF-13 | `ResultsPortalLink` target — CLOSED on decision of 25 Aug 2026: build-time constant, host allowlisted, no Operator edit path | Reviewer | CLOSED | `CONTENT_MODEL` at T02 |
| CF-14 | All 72 `LabTest` `name_ar` values empty; 12 carry no Arabic alias — bilingual gap blocking P04 and P06 | Lab, then Opus Max translation | OPEN | P06 / G6 |
| CF-15 | P03 route count and P05 module count asserted, never enumerated — violates PR-01 wherever repeated. Amended at T02-A: the T02 enumeration omitted the `Programme` detail route. Final figures are 12 static + 1 dynamic patterns, 42 rendered URLs, 8 modules, enumerated in `CONTENT_MODEL` §3c and §3d | Reviewer — enumerates in `CONTENT_MODEL` | CLOSED | `CONTENT_MODEL` at T02-A |
| CF-16 | Verify `CONTENT_MODEL` carries the `ProgrammeTier` (D-05) and `ResultsPortalLink` (D-07) decisions, closing the GLOSSARY §2 deferrals. Re-scoped at T02 from "GLOSSARY cells stale". Closed on the §3h confirmation in `CONTENT_MODEL.md`. | Reviewer | CLOSED | `CONTENT_MODEL` at T02 |
| CF-17 | Draft quotation §5 and §13 carry the superseded three-milestone schedule and no P01 line | client-facing, yours | OPEN | quotation amendment |
| CF-18 | Draft quotation §7 and §9 exclude bilingual while D-10 includes it; repricing outstanding | yours | OPEN | quotation amendment |
| CF-19 | `ProgrammeLabTest` carried no eligibility qualifier, so the seed's four sex- and age-restricted rows rendered to every Visitor. CLOSED at T02-A: `eligibility` (`audience` / `minAge` / `note_ar` / `note_en`) added in `CONTENT_MODEL` §3a and enforced by §3b step 4 | Builder | CLOSED | `CONTENT_MODEL` at T02-A |
| CF-20 | `ProgrammeLabTest` discarded the seed's `source_name`, leaving the clinical gate nothing to check the lab's corrections against. CLOSED at T02-A: `sourceName` preserved verbatim, internal, never Visitor-facing | Builder | CLOSED | `CONTENT_MODEL` at T02-A |
| CF-21 | `Offer` carried `priceAmount` with no currency, which forces a hardcoded currency at render time. CLOSED at T02-A: `priceCurrency` added per `Offer`; no currency named in source or in the document | Builder | CLOSED | `CONTENT_MODEL` at T02-A |
| CF-22 | P04 search cannot ship until the PR-08 clinical flag opens. The §3f index is emitted only with the flag on, so search is gated on the lab's written sign-off, not on P04 completion. P04 must be resequenced after sign-off or shipped dark behind the same flag — the phase map currently implies neither | Reviewer | OPEN | P04 sequencing |
| CF-23 | `Branch` fields were listed in prose (address, phone, working hours, map coordinates) rather than as canonical code-spanned names, so no vocabulary scan could reach them. CLOSED at T02-A: `addressLine_ar` · `addressLine_en` · `phone` · `workingHours` · `latitude` · `longitude`. **Landed as a new row, not an amendment — no existing row covered `Branch` field naming. CF-04 and CF-05 cover Branch *data*, not field names. Deviation reported at T02-A** | Builder | CLOSED | `CONTENT_MODEL` at T02-A |
| CF-24 | GLOSSARY §7 does not extend to framework-forced route files. §6 still binds source filenames under the application tree, and file-based routing requires directories named `online-results`, `programmes` and `offers` to serve the segments §3c prescribes. §7 rules the segment, not the file that produces it, so the two clauses meet head-on the moment the route tree is scaffolded | Reviewer | OPEN | P01-T03 STEP 0a |
| CF-25 | `eligibility.note_ar` / `note_en` are unauthored for the three audience-restricted `ProgrammeLabTest` rows. Any wording would derive from unverified 2018 source under PR-09, including the age threshold of 45, which is not ours to publish. Rides the clinical gate | Lab clinical staff | OPEN | P06 / G6 — rides the clinical gate |
| CF-26 | `CONTENT_MODEL` §3c prose asserts a difference from the phase-map claim of 13 that does not exist: 12 static plus 1 dynamic is 13 patterns. The 42 is a different unit — rendered URLs across both locales, not patterns | Reviewer | OPEN | P01-T03 STEP 0b |
| CF-27 | `DEVOS_ADAPTATION_NOTES` §5 omits Clinical from P04's non-waivable set and now disagrees with `SESSION_CONTEXT`, which carries it. The search index is a build artefact carrying `LabTest` names, so the clinical gate has always bound P04 | Reviewer | OPEN | P01-T03 STEP 0d |

**Note:** CF-01 to CF-11 are client dependencies rather than build defects.
CF-14 is a bilingual gap owned by the lab. CF-17 and CF-18 are quotation
amendments owned on this side of the table. CF-19 to CF-21 and CF-23 are
build defects found and closed at T02-A. CF-22 is a sequencing consequence of
the clinical gate and is owned by the reviewer. CF-24, CF-26 and CF-27 are
document corrections landed at T02-H and owned by the reviewer; each closes at
a numbered P01-T03 STEP 0 sub-step. CF-25 rides the clinical gate with CF-01
and CF-14. The engineering is well defined; the client-side risk still sits
largely outside the repo.
