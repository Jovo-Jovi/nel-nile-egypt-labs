# NEL — CARRY FORWARDS

Every finding becomes a row here with an owner. Nothing is silently patched.

**Next free id: CF-19**

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
| CF-11 | Results portal TLS certificate expires **28 Oct 2026**, inside the project window, with no support contract in place. Risk accepted by client decision, 25 Aug 2026. No written notice sent to the client. | Client — written reminder filed internally, not sent | OPEN | P07 |
| CF-12 | `ProgrammeTier` modelling — CLOSED on decision of 25 Aug 2026: two axes, tier (Silver/Gold/Platinum/Children) and audience (none/Male/Female) | Reviewer | CLOSED | `CONTENT_MODEL` at T02 |
| CF-13 | `ResultsPortalLink` target — CLOSED on decision of 25 Aug 2026: build-time constant, host allowlisted, no Operator edit path | Reviewer | CLOSED | `CONTENT_MODEL` at T02 |
| CF-14 | All 72 `LabTest` `name_ar` values empty; 12 carry no Arabic alias — bilingual gap blocking P04 and P06 | Lab, then Opus Max translation | OPEN | P06 / G6 |
| CF-15 | P03 route count and P05 module count asserted, never enumerated — violates PR-01 wherever repeated | Reviewer — enumerates in `CONTENT_MODEL` | OPEN | `CONTENT_MODEL` at T02 |
| CF-16 | Verify `CONTENT_MODEL` carries the `ProgrammeTier` (D-05) and `ResultsPortalLink` (D-07) decisions, closing the GLOSSARY §2 deferrals. Re-scoped at T02 from "GLOSSARY cells stale". Closed on the §3h confirmation in `CONTENT_MODEL.md`. | Reviewer | CLOSED | `CONTENT_MODEL` at T02 |
| CF-17 | Draft quotation §5 and §13 carry the superseded three-milestone schedule and no P01 line | client-facing, yours | OPEN | quotation amendment |
| CF-18 | Draft quotation §7 and §9 exclude bilingual while D-10 includes it; repricing outstanding | yours | OPEN | quotation amendment |

**Note:** CF-01 to CF-11 are client dependencies rather than build defects.
CF-14 and CF-15 are owned inside the project — a bilingual gap and a
now-enumerated route/module count. CF-17 and CF-18 are quotation amendments
owned on this side of the table. The engineering is well defined; the
client-side risk still sits largely outside the repo.
