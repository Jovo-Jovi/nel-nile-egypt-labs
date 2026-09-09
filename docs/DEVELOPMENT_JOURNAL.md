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

---

## 2026-09-04 — P05-T13: OD-14, expiry filter, Videos and Media Library

Live maxima before allocate: OD 13, D 47. OD-14 and D-48 landed as the last
entries of their series. Offer expiry is a read-path filter on
`publishedListings.parseOffer`; it does not rewrite `publication_state`.

Video writes take a full YouTube URL. Parsing and poster fetch are server-side
(`youtubePoster.ts`) on save. The dashboard preview iframe lives only in
`VideoForm.tsx` (OD-14). Visitor HTML after `npm run build` contains none of
`youtube.com`, `youtu.be`, `ytimg.com` (25 public files, 0 dashboard).

guard:design **R5** is the new YouTube-host rule. Exempt paths:
`src/lib/dashboard/youtubePoster.ts` and
`src/components/dashboard/VideoForm.tsx`. FILE-MODE seed under
`src/components/site/` in a scratch tree outside the repository fired; the
real tree exits 0.

`fetchAnonStorageObject` was added to the existing `supabaseRest.ts` helper so
published posters can be served from `/media-asset/[name]` without a second
REST client. No migration. T14 not started.

---

## 2026-09-04 — P05-T14: maps links, phone fields, SiteSettings residue

The Branch form no longer takes a manual latitude/longitude pair. The Operator
pastes an expanded Google Maps URL; `parseMapsUrl` is a synchronous string
parse (`@lat,lng`, `?q=`, `!3d!4d`, `ll=`) and never fetches. A
`maps.app.goo.gl` short link is refused with `error=mapsShort` because
resolving it would make Google a dependency of every save. The URL itself is
not stored — there is no column and this task adds none. Retaining it is an
M6 candidate.

`SiteSettings` has no coordinate field. The laboratory's location is its
head-office `Branch`. `hotline` stays a short-code text box. `whatsapp_e164`
uses the calling-code selector with an empty first option (PR-16). Hours stay
prose with a format hint.

Fourteen published `SiteSettings` bilingual fields held `NEL-P05-T02-PROOF`
from earlier verification runs and were cleared to empty string, not to a
new placeholder. `ADMIN_SPEC.md` has no §4h; the classify used the T02 token
and T11 probe shapes. `hotline` and `whatsapp_e164` were not proof tokens and
were not rewritten.

No migration. T15 (invented public content) not started.

---

## 2026-09-05 — P05-T15: delete invented public content

The home composition no longer publishes unsigned claims as if they were a page. Accreditation marks, placeholder Offer cards, invented video durations, news items with dates, hardcoded LabUnit names, why-bodies, and `about.body` are gone. A region with nothing approved renders the §12 pending state.

Trust counts are derived from published `Branch`, `Programme` and `LabUnit` rows through `fetchAnonPublishedJson`. Zero published rows is pending, not the numeral 0. The about blurb reads published `SiteSettings`, same as `/about`.

Hero `headlineLine1`, `headlineLine2` and `standfirst` do not appear in `docs/research/09-locked-baseline.md`. They were invented mock copy and went to pending with the rest. M6 supplies the real ones. No column was added.

Catalogue 572 → 440, both locales identical (133 keys removed, one `approval.pending.signedCopy` added). Reachability from `src/app` plus `src/middleware.ts`: 159 / 159 / 0. No migration.

---

## 2026-09-05 — M6A: author SiteSettings hero, reason-card and media-role columns

SQL only, not applied. `CONTENT_MODEL.md` §3a named the fields first; `DATA_MODEL.md` §6 row 10 was then made to match. Twenty-one nullable columns, three `"MediaAsset"` keys with `on delete set null`, nine bilingual publish checks in the M2 `whatsapp_message` form.

The headline is one field per locale. Counts stay derived; no maps URL column; no `Announcement` or `ClinicalNotice`; no role column on `"MediaAsset"`. Apply is M6B.

---

## 2026-09-05 — M6B: unpublish, apply M6, leave in draft

The singleton was unpublished through `POST /ar/dashboard/site-settings/submit/unpublish` at aal2, not by SQL. The public chrome now renders the §12 pending state (no hotline, no WhatsApp) until a content task fills the pairs and republishes.

M6 applied: twenty-one nullable columns, nine bilingual-when-published checks, three `"MediaAsset"` keys with `on delete set null`. `"SiteSettings"` has 46 columns. `public.*` stays eleven tables, twenty-two policies, RLS on eleven of eleven. The reverse was not applied. The row stays `draft`; no field was filled.

CF-108 landed OPEN: empty string satisfies `is not null` on every `bilingual_when_published` check of that form. The application write path nulls empty fields; the database checks do not.

---

## 2026-09-05 — P05-T16A: verify the existing Operator account

One Operator session reached a module form at aal2 on a local production build. Sign-in established aal1, the module route at aal1 was refused to the TOTP challenge, a code generated from the enrolled secret was accepted, and the same module route then returned 200 with a form. Site Settings at aal2 read `draft`. No field was filled and nothing was republished.

`npx supabase db query --linked` on `auth.users` and `auth.mfa_factors` is the source for the account count, the quoted TOTP `verified` status, and the absence of `operator` / `nel_principal` in `app_metadata`. A claim was not set. This process did not create, alter or delete an account.

D-08 still requires a minimum of two accounts and G5 still checks for two. T16 is not started.

CF-109 landed OPEN: the locked public email and D-09's WhatsApp-only contact channel disagree; the client decides before launch.

---

## 2026-09-05 — P05-T16: the wireframe layout, across every module

Every module form is one main column and one sticky sidebar. The sidebar holds publication state, the reason a draft cannot yet publish, display order, save, publish, unpublish and delete. The main column keeps the grouped sections ADMIN_SPEC.md §4f already required. Video preview sits in the main column so there is not a second aside.

The Programmes card on the dashboard home states that the module is not yet built and no longer links. `/dashboard/programmes` remains only as the list key.

Sign-in, enrolment, challenge, pending listings, listings and forms now share existing tokens: `--nel-radius-md`, elevation 1, `--nel-space-64` between groups. Six of §4's nine type steps are in use: xs, sm, base, lg, xl, 2xl. Nothing was introduced. Public pages were not restyled.

The singleton is still `draft`. The Site Settings sidebar names the privacy policy body and the other required-on-publish pairs so an Operator seeing draft does not try to publish into a database check. No field was filled and nothing was republished. No account was created, altered or deleted.

CF-109 remains OPEN, owner client, P07.

---

## 2026-09-05 — P05-T18: the M6 Site Settings fields, an honest refusal, and the schema guard

The Operator can now fill the nine M6 bilingual pairs that publish requires.
Hero (eyebrow, headline, standfirst) and three reason cards (title and body
each) sit in two grouped sections on Site Settings. Nothing is prefilled.
Those nine pairs are not in the source table; three of the cards are
reviewer-authored and still await client approval. The fields exist so the
client can write them. Favicon, app-icon and hero media remain a successor.

Publish no longer returns a false "try again" when a bilingual check refuses
the row. A Postgres `23514` names the missing field group and the form says
retrying will not help. A genuine write failure still asks the Operator to
retry. Save is not stricter than the database: the nine pairs may stay empty
on a draft.

`guard:schema` is the check CF-110 asked for. It parses forward migrations
offline and fails the build when the database pair set and the application
pair set differ. Inventory total 33.

The singleton was published only as an N2 probe through a throwaway aal2
account, then restored to `draft` with the client's values. 46 of 46 columns
matched the before-capture by md5. The throwaway account was deleted.

CF-110 CLOSED. CF-113 OPEN, owner client, G5. CF-06 stays OPEN until privacy
is on a published row.

---

## 2026-09-05 — P05-T21: wire M6's public half

The home page now reads the nine M6 bilingual pairs through the same
published path as the rest of the chrome. `SITE_SETTINGS_SELECT` is 39
content columns. A published eyebrow, headline and standfirst in the
active locale replace the signed-copy pending gate; the catalogue eyebrow
remains the fallback when that pair is empty. The why band renders three
reason cards from the published title and body pairs, in order 1, 2, 3,
and keeps the existing pending occupancy when any card is absent. IsolatedCopy
wraps the published values. Section order and classes are unchanged.

The linked singleton was already `published` with all eighteen M6 text
columns populated. Capture was UTF-8, 46 of 46 columns. Probe strings were
not written: a publish of synthetic copy would have overwritten Visitor-facing
fields. GET `/ar` and `/en` against `npx next start` showed the signed-copy
pending gone from both sections, the catalogue eyebrow absent from `#home`,
and the nine section ids in the approved order.

CF-122, CF-123 and CF-124 OPEN, owner reviewer, G5 — the Branch render gap,
the unselected `youtube_id`, and §4h.3 grading zero published Offers complete
while `/offers` still shows a pending shell.


## 2026-09-06 — P05-T25B: the completeness header

The Operator dashboard now reports, field by field, which required content
is populated. `src/lib/regions.ts` is the authority for which
`"SiteSettings"` column renders on which page. The region map was refreshed
only for `home.hero` and `home.reasons`, which P05-T21 had already wired.

The denominator is `slots.length` on every evaluation. It is never stored.
Zero published Offers, Videos or Equipment contribute nothing; each
published Branch contributes seven fields plus the head-office slot; each
published Video contributes six. Programmes and LabTests report awaiting
clinical sign-off and the 72 / 121 / 5 counts. They have no percentage, no
progress bar and no complete/incomplete state.

A placeholder matches `TEST` as an uppercase token on a word boundary, so
the laboratory's English containing the word *test* is not residue. Live
GET `/ar/dashboard` and `/en/dashboard` both read 36 of 38, incomplete,
with the eighteen hero and reason columns on the home checklist.

`guard:schema` now fails when a required SiteSettings column is missing
from the constant. FILE MODE outside the repository: unmodified exit 0;
`hero_eyebrow_ar` removed exit 1 naming it.

CF-130, CF-131 and CF-132 OPEN. Open count 76 + 3 = 79. No laboratory row
was written. The throwaway aal2 account was deleted.



## 2026-09-06 — P05-T26A: amend the seed to the signed catalogue

The signed worklist and the pending sign-off artefact landed byte-exact.
`tests.csv` is 71 rows with Arabic names copied from Section A; `qa_flag`
is empty on every row; `app-afp` `name_en` is AFP (Alpha-Fetoprotein).
`programme_tests.csv` is 124 memberships: Gold FSH retargeted to TSH,
the Children combined row split into creatinine and urea, ALT added to
Children, free testosterone added to the Infertility female panel.

`verify_seed.py` prints `124 -> 71` and PASS. `catalogue.json` stays the
2018 snapshot; its count-equality checks are an UNRATIFIED residual
repair (PR-19) because this fence forbade editing that file.

CF-133 OPEN. The database is still 72 / 121. No laboratory row was written.



## 2026-09-06 — P05-T26B: transcribe the signed catalogue into the database

M8 copies the signed seed into the linked remote. Forward and down are
hand-authored. Rehearsal ran `BEGIN; … ROLLBACK;` first: inside, 71 tests
and 124 memberships at eligibility 94 · 16 · 14; after rollback, 72 / 121
with no residue. Then the forward was pushed.

Both-direction acceptance against `tests.csv` and `programme_tests.csv` is
empty. Recapture: 14 `"ProgrammeTier"` rows md5-identical to the pre-task
dump; 71 `"LabTest"` rows changed and one deleted; 120 memberships changed,
one deleted, four inserted. Nothing is published.

A throwaway aal2 Operator published a throwaway Programme (`error=signOff`
gone) and was refused on a throwaway `"LabTest"` with `name_ar` cleared
(`error=bilingual`). No laboratory-owned row was published. The throwaway
account is gone.

CF-133 CLOSED. CF-134 OPEN: the gate is open on disk and CF-128 still shuts
it in production. Open count 80 − 1 + 1 = 80.

## 2026-09-07 — M7C: the application gate reads the Operator claim

The dashboard gate now reads `app_metadata.nel_principal` from the same
`getClaims()` payload it already had. A signed-in session without
`nel_principal` = `Operator` is redirected to sign-in with
`reason=not-operator` and never offered TOTP enrolment. Enrolment remains
the Operator onboarding path: a throwaway with the claim and no verified
factor still reaches `/dashboard/enrol`.

This window is Cursor Grok 4.6. The fence requires Sonnet High review
before merge (PR-06). No SQL was authored or applied. No PartnerLab
account, claim, signup route or Offer gating was created. Two throwaway
auth users were created, used as P2 and P3/P4, and deleted (Admin GET 404).
No lasting Operator account was signed into.

CF-148 OPEN, reviewer, P08: OD-15's document amendments are unlanded.
Open count 83 + 1 = 84.

## 2026-09-07 — P08-T00: land OD-17

OD-17 is SIGNED. Grok is permitted on every task class, including
migrations applied against the live database. The model-class tiers are
advisory throughout. OD-13 exception 1 is superseded on the Status line;
exception 2 stands and was never a model-class rule. OD-13's reasoning is
unedited.

The replacement for the tier is already in force: OD-10 control 7, a
reverse authored in the same task, migrations split across two pushes,
executable negative proofs, and review from source. The residual risk OD-17
accepts is a semantically wrong but valid migration on a database with no
staging branch (CF-79); §3.3 is the control that makes the OD signable.

No CF row opened or closed. Open count 84 + 0 − 0 = 84. CF-148 stays OPEN.
No SQL was authored or applied. Signed clinical artefacts are unchanged.

## 2026-09-07 — P08-T01: land OD-15's document amendments and open P08

Documents only. OD-15 is countersigned in the file: Androw approved the
full text on 7 September 2026. The 4 September quotation signature stays
the record of agreement to the scope; this records agreement to the text.
OD-15's Status line and §7 wording are unedited.

The boundary gate is restated, not waived. An authentication credential is
not the class of data it excludes; a `PartnerLab` is another laboratory,
not a member of the public seeking care. Signup still accepts nothing
beyond that credential, and anything more needs a reviewer verdict.

`GLOSSARY.md` gains `PartnerLab` after `Operator`. `SECURITY_MODEL.md` §3
gains partner-read as a third policy shape. `CONTENT_MODEL.md` §3c row 5
becomes an authentication-required state; the home Offers band is the same
state. D-15 and D-16 record account review as the eleventh module: OD-09
had already taken nine and ten, so OD-15 §7's "ninth" is left as signed
and the count is corrected in the amendment text (PR-32).

P08 opens with gate G8, non-waivable Boundary. It follows G5 and precedes
G7. It is not in OD-12's sequence.

CF-148 CLOSED. CF-149, CF-150 and CF-151 OPEN. Open count 84 + 3 − 1 = 86.
No SQL, no route, no claim, no account. Signed clinical artefacts
unchanged.

A residual repair, labelled UNRATIFIED in `SECURITY_MODEL.md` §2: the
heading and principals table now include `PartnerLab`, because leaving
"There is no third" next to the partner-read shape would have been a
self-contradiction.

## 2026-09-07 — P08-T02: close the amendment residue before anything is built

Documents only. `SECURITY_MODEL.md` §1 now authenticates `Operator` and
`PartnerLab` as business parties; the breach sentence is unedited. §4 no
longer says there is no public sign-up: `PartnerLab` signup is open and
access is not; MFA remains an `Operator` requirement. `BOUNDARY_MODEL.md`
§2 records the only submission the system will accept — an authentication
credential, and only when choosing to become a `PartnerLab`. No new
header line: the OD-15 amendment line already covers §2.

The P08 State cell no longer asserts that the phase precedes G7. OD-12
does not name P08 and is unamended. CF-152 OPEN, owner human, lands at
P08: whether P08 ships before G7 or after it is a commercial decision and
needs an OD.

The §2 three-principal repair is RATIFIED at P08-T02 under PR-15.

A residual repair, labelled UNRATIFIED in `PHASES.md`: the mandated
State-cell change would have left that file asserting both "undecided"
and "precedes G7". The remaining assertions were aligned to the cell.

Open count 86 + 1 = 87. No SQL, no route, no claim, no account. Signed
clinical artefacts unchanged. OD headings 17, D headings 48, unchanged.

## 2026-09-07 — P08-T03: the PartnerLab claim model, and signup behind a flag

ADR-001 accepts two claims with different jobs. `nel_principal` is the only
security-bearing claim and has exactly two values, `Operator` and
`PartnerLab`. `nel_partner_state` is the review record and is never a
policy input. Signup writes neither claim, so ordinary `signUp` needs no
service-role key on the public route.

The route is `/{locale}/partner-lab/sign-up`, off unless
`NEL_PARTNER_SIGNUP` is exactly `on`. BOUNDARY_MODEL.md §2 evidence item 11
holds it unreachable until the privacy text is amended (CF-149). The
rendered field set is an email address and a password. R3 gained one
exact path; the allowlist is 16. CF-151 stays OPEN as the ongoing
allowlist control.

Q5 could not mint a throwaway token: hosted Auth has `disable_signup`
false and `mailer_autoconfirm` false, and `/auth/v1/signup` returned 429
`over_email_send_rate_limit` after the proof probes. No throwaway row was
created. The handler still calls `signUp({ email, password })` with no
metadata.

Open count 87 + 0 − 0 = 87. No SQL, no policy, no migration. Signed
clinical artefacts unchanged.

## 2026-09-07 — P08-T03-F: re-run Q5, and log what its failure found

Q5c executed: a third form key is rejected before `signUp`, 303 to
`/ar/partner-lab/sign-up?error=1`. Q5a did not mint an account. The form
POST 303'd to `error=1`, and a follow-up Auth signup returned 429
`over_email_send_rate_limit`. Prefix match 0; no access token; nothing to
delete. The mailer window had not cleared. The limit was not raised, the
mailer was not switched, and confirmation was left on.

CF-153 OPEN: confirmation mail, when it can send, goes to a member of the
public, and neither BOUNDARY_MODEL §2 nor SECURITY_MODEL §4 as amended
rules outbound authentication mail. CF-154 OPEN: the hosted built-in
mailer is not a production path and throttled this proof.

Open count 87 + 2 = 89. No SQL, no source change, no migration. Signed
clinical artefacts unchanged.

## 2026-09-07 — P08-T04: land the P08-T03-F verdict and OD-18 as a draft

Documents only. Cut from unmerged `p08-t03-f` at 2d6dc95; stacked, not
diffed against `main`. P08-T03-F Verdict cell set to PASS; P08-T03's FAIL
cell unedited. OD-18 landed DRAFT after OD-17, not in force, Status line
unsigned. Count sentence Seventeen to Eighteen. D headings stay 48.

CF-155 OPEN, reviewer, P08: OD-18 §2 is unproven until Q5d and Q5e compare
a known address with an unknown one byte for byte. Open count 89 + 1 = 90.

No SQL, no source, no migration. ADR-001 unedited. Signed clinical
artefacts unchanged. Do not sign OD-18.

## 2026-09-07 — P08-T05: sign OD-18, then run Q5 once

Cut from unmerged `p08-t04` at 9fce647; stacked, not diffed against
`main`. P08-T04 Verdict cell set to PASS; P08-T03's FAIL cell unedited.
OD-18 Status line SIGNED — 7 September 2026. Body unedited. D headings
stay 48. Signature commit `7ff9c45` stands.

CF-156 OPEN, human, P08: OD-09 is DRAFT and unpriced while D-16 still
counts modules 9 and 10. Open count 90 + 1 = 91.

Q5c: 303 `Location /ar/partner-lab/sign-up?error=1`, body 0 bytes. Q5a
is not `created=1` (303 `error=1`, body 0 bytes). Q5e and Q5b did not
run. Prefix match 0; nothing to delete; no 404. Next stdout has no
`over_email_send_rate_limit` string; no second Auth signup. Halt at Q5a.
P08-T05 box stays unchecked. Option B is the human's.

No SQL, no source, no migration. ADR-001 unedited. Signed clinical
artefacts unchanged. Do not unwind OD-18.

## 2026-09-08 — P08-T06: diagnose the signup error, then make the handler enumeration-safe

Cut from unmerged `p08-t05` at d1173ba; stacked, not diffed against
`main`. P08-T05 Verdict cell set to PASS; P08-T03's FAIL cell unedited.

One POST to `/auth/v1/signup` with the anon key returned HTTP 422,
`error_code` `weak_password`, a character-class rule on the password
string. Not a throttle. The submit handler is now an allowlist: local
malformed email, local password shorter than six characters, and Auth
`weak_password` may produce a distinct response. Success, already-
registered, throttles, project settings, network failure and every
unrecognised code share `?created=1`. The form-key loop is unchanged.

CF-157 OPEN, reviewer, P08: OD-18 §6 does not close a timing oracle.
Open count 91 + 1 = 92.

No SQL, no migration. ADR-001 unedited. Signed clinical artefacts
unchanged. Flag off outside the proofs. Do not merge before the verdict.

## 2026-09-08 — P08-T07: HALT, no known address for the ordering test

Cut from unmerged `p08-t06` at c3a323d; stacked, not diffed against
`main`. P08-T06 Verdict cell set to PASS; P08-T03's FAIL cell unedited.

HALTED at STEP 1 E2. P08-T06 STEP 1 returned HTTP 422, `error_code`
`weak_password`. That is password validation before confirmation is sent,
so it did not create a user. The fence names that request as the only
allowed known address, and forbids creating one to obtain a subject.
Zero POSTs reached `/auth/v1/signup`. E1 was not sent. The handler is
unedited. CF-157 stays OPEN. Open count 92 + 0 − 0 = 92.

No SQL, no source, no migration. ADR-001 unedited. Signed clinical
artefacts unchanged. Do not merge before the verdict.

## 2026-09-08 — P08-T08: local password rule, weak_password made NEUTRAL

Cut from unmerged `p08-t07` at 87afeef; stacked, not diffed against
`main`. P08-T07 Verdict cell set to PASS; P08-T03's FAIL cell unedited.

A local strength check now runs after length and before `signUp`. Length
minimum is eight. The four character classes are taken from the hosted
422 body at P08-T06 STEP 1, not from `supabase/config.toml`. Anything
that passes locally must pass hosted, so `weak_password` is unreachable
on this route. The SAFE list is malformed email and password strength,
both decided before any request. Every Auth code, including
`weak_password`, shares `?created=1`. No signup request was issued.
Auth API request count: zero.

CF-158 OPEN, reviewer, P08: `supabase/config.toml` is not authoritative
for hosted auth settings on this project. CF-157 stays OPEN. Open count
92 + 1 = 93.

No SQL, no migration. ADR-001 unedited. Signed clinical artefacts
unchanged. Flag off outside the proofs. Do not merge before the verdict.

## 2026-09-08 — P08-T09: wire the brand mark and media roles, and clear source placeholders

Cut from unmerged `p08-t08` at 7477b1f; stacked, not diffed against
`main`. P08-T08 Verdict cell set to PASS.

MarkSlot now requests `/mark/nel-mark.png`. Production GET returned
HTTP/1.1 200 OK, Content-Type: image/png. The three M6 media-role
columns have pickers on Site Settings, sourced from the Media Library.
A null column leaves the labelled-frame hero, omits head icons, and
404s `/site-webmanifest`. They are not graded regions; count stays 27.

Placeholder scan: every public URL still carries the ResultsPortalLink
placeholder (CF-137, left). Catalogue literals that matched
`valueIsPlaceholder` were rewritten. SiteSettings text unedited.

CF-149 appended, stays OPEN. CF-159 OPEN, human, P08: the file on disk
is a raster mark. Open count 93 + 1 = 94.

No SQL, no migration. ADR-001 unedited. Signed clinical artefacts
unchanged. Flag unedited. Do not merge before the verdict.

---

## 2026-09-08 — P08-T10 PartnerLab flow, end to end

Parent is unmerged `p08-t09` at `7bacc16`, not `main`. Stacked.

The transparent PNG is the live mark: 334633 bytes, 537×752, color type 6.
A format without an alpha channel must not be the live mark; the JPEG is
gone. CF-74 stays open because the four §7 variants are still outstanding.
CF-159 closes: the reviewer ruled resolution, not format, and PNG with
alpha is enough.

A signed-in account with no `nel_principal` sees only pending. A rejected
account sees only declined. Neither body carries an Offer title or a
price. Authentication is what makes OD-18 §3 safe. The Operator gate
order is the M7C order.

M9 is one SELECT policy on `"Offer"` for `authenticated`, predicate
exactly the PartnerLab claim, matching the twelve Operator-write
policies. Rehearsed inside `BEGIN`/`ROLLBACK`. Live `pg_policies` stayed
24. Not pushed. Reverse authored with no timestamp.

Approve, reject and reinstate merge `app_metadata` through Auth Admin
behind aal2. They write nothing in `public`. The claim lands on the next
token refresh; the copy says so. The service-role key is server-side and
does not appear under `partner-lab/`.

`/offers` and the home Offers band are an authentication-required state.
The route still exists. A Visitor is invited to sign in. T3, the positive
control, reached listing chrome on a refreshed PartnerLab token. The
Offer table holds no published rows and this fence forbids publish, so
the empty-listing copy is the distinguisher.

R3 16 → 18, two exact paths, no directory, no pattern. Catalogue 574/574.
Open CF 94 − 1 = 93. Migrations on disk 24 + 2 = 26. Do not merge before
the verdict. Do not `db push`. Do not turn on `NEL_PARTNER_SIGNUP`.

## 2026-09-08 — P08-T11 STEPS 0-3: confirm-password, session Offer read, M10 authored

Parent is unmerged `p08-t10` at `901b8d6`, not `main`. Stacked.

P08-T10 Verdict cell set to PASS; M9 was applied by the human under
OD-17 §3.3. Confirm-password is a second typing of the same credential.
The signup loop is no longer byte-identical to `7e24066`. Evidence item 9
is restated in the handler: it accepts no field that is not an
authentication credential. A mismatch is a local SAFE check and cannot
leak whether an address is known.

`/{locale}/offers` reads Offers through `createSupabaseServerClient`.
`fetchAnonPublishedJson` stays on Equipment, Videos, Branches,
Programmes, LabUnits, SiteSettings, MediaAsset, and Programme detail.
No service-role client on that path.

M10 is one statement: drop `Offer_published_read`. Rehearsed inside
`BEGIN`/`ROLLBACK`, exit 0. Live `pg_policies` stayed 25. Not pushed.
Reverse recreates M5:185 exactly.

Catalogue 576/576. Migrations on disk 26 + 2 = 28. Do not merge before
the verdict. Do not `db push`. Do not turn on `NEL_PARTNER_SIGNUP`.

## 2026-09-08 — P08-T11 STEPS 4-6: M10 proved, CF-160 landed

The human applied M10 after STEPS 0-3. Live `pg_policies` 24. Anon
`GET /rest/v1/Offer?select=*` is `[]` with a published throwaway Offer in
the table; an approved PartnerLab session sees the title on `/ar/offers`
and `/en/offers`. Pending, declined, and unauthenticated bodies do not.
The throwaway was unpublished and deleted. Four clinical tables remain 0
published. Static HTML 26 → 22: `/ar`, `/en`, `/ar/offers`, `/en/offers`
are dynamic so the session JWT can reach Postgres. CF-160 OPEN, owner
reviewer, G8. CF-149 stays OPEN until P08-T12. Open CF 93 + 1 = 94.
Do not merge before the verdict. Do not turn on `NEL_PARTNER_SIGNUP`.

## 2026-09-08 — P08-T12: G8 wiring, mark gate, privacy chrome, media labels

Parent is `p08-t11` at `f8dda33`, then fast-forwarded onto `origin/main`
at `12c8df1` (PR #112). No migration.

The live mark file is 334633 bytes and HTTP 200. The frame was
`ApprovalGate` `pending` around that file, not `MarkSlot` `onError`.
Header and footer gates are now `approved`. MarkSlot and HeroPhoto no
longer swap element type during hydration. React #418 was not reproduced
under `next dev` (CF-164). `reportAllChanges` is not NEL code (CF-163).

Live privacy bodies already state what a PartnerLab signup stores.
CF-149 CLOSED. Catalogue chrome on the privacy page no longer claims the
site stores nothing, and `PendingSlot` for legal fact renders only when
the signed copy is absent.

Unnamed MediaAsset rows show `storage_path` so the picker is usable.

CF live maximum 160 before allocating CF-161. Closed CF-149 and CF-137.
Landed CF-161, CF-162, CF-163, CF-164, CF-165. Open 94 − 2 + 5 = 97.
Next free CF-166. Catalogue 576/576. Migrations 28.

Walkthrough on the production alias (SHA `ef5671b`): form signup returned
`303` `created=1` with no listable Auth row (CF-153, CF-154); pending,
approved and declined copy was quoted after Admin `createUser` plus
Admin metadata fallback because Operator review POSTs returned
`error=write` (CF-165). Synthetic Offer unpublished and deleted; GET 404.
Three throwaway Auth users `missing_after=true`. React #418 was not
reproduced under `next dev` and was not captured authenticated; G8 FAIL
on 1b. Do not merge before the verdict.

## 2026-09-08 — P08-T13 Part A: phase plan, OD-19 draft, D-49

Parent is `p08-t12` at `343c6e0`, unmerged. No migration.

P08-T12 recorded FAIL at reviewer verdict — 8 September 2026; G8 blocked on
React #418, signup persistence and Operator review; fixes at P08-T13.

PHASES.md: the OD-12 figure is struck through beside OD-19 (draft), with
P03-T03 and `9dac44f`. P09 added. `grep -c "^### P0"` → 7. The fence's
ten-change table was not in the prompt; the reconstruction is UNRATIFIED
in the file (PR-19). §7 rewritten from the live ledger: three G8 blockers,
credential rotation, OD-09 unsigned (CF-156), CF-152 settled by OD-19
draft.

OD-19 landed DRAFT, not signed. Count Eighteen → Nineteen. OD-12 unamended.
CF-152 still OPEN: settled by OD-19 §1, closes when signed.

D-49 landed: PartnerLab signup does not send email. Count Forty-eight →
Forty-nine.

Do not merge before the verdict.

## 2026-09-08 — P08-T13 Part B HALT at STEP 5

STEP 4 diagnosis, names only, no values. `applyPartnerLabReviewAction`
returns `write` when `createSupabaseServiceRoleClient()` is null, or when
`updateUserById` errors. Production `SUPABASE_SERVICE_ROLE_KEY` present
false (`npx vercel env ls production`, names only). That is the null-client
path. Rotation of both keys is still required because `--reveal` printed
them; setting the service-role variable on Production is what discharges
this path.

STEP 5 is a human action. This window did not rotate, copy, redeploy, or
touch mailer settings. HALT awaiting the human's attestation of a–f.
No key printed, echoed or written to a file.

Do not merge before the verdict. Part A stands.

## 2026-09-09 — P08-T13 Part B HALT at P3

STEP 5 attested by the human (a–f). Production redeploy Ready in 59s on
the alias. Production `SUPABASE_SERVICE_ROLE_KEY` present true (names
only).

STEP 6: `next build` then `next start` on 127.0.0.1:3060. Edge console on
`/ar`, `/en`, `/ar/offers`, `/en/offers` locally and live: no React #418
named. ABSENCE IS NOT PROOF OF CAUSE. CF-164 stays OPEN. No approved
PartnerLab session in that capture.

P1 live form POST 303 `Location: /ar/partner-lab/sign-up?created=1`.
P2 Auth Admin REST not runnable here: `vercel env run` cannot pull
Production Secret values. Linked `auth.users` after P1: keys
`provider,providers`; neither `nel_principal` nor `nel_partner_state`.
P3 HALT: Operator password sidecar missing. No `createUser`, no Admin
metadata fallback. P7 invite copy both locales. P9 clinical published
0/0/0/0. Offer 0. P10 24/24 200. G8 FAIL.

Do not merge before the verdict. Part A stands.

## 2026-09-09 — P08-T14: PartnerLab smoke, CF-153 and CF-154 closed

Parent is unmerged `p08-t13` at `a15dbde`, not `main`. No migration.

P08-T13 recorded PASS (Part A) at reviewer verdict — 8 September 2026;
halted at P3, G8 remains FAIL.

PHASES.md: P03 heading CLOSED at G3, 2 September 2026; P05 heading CLOSED
at G5-R, 7 September 2026; Programmes module checked, landed at P05-T24A /
P05-T24B; P06 72 / 121 / 5 and the sign-off line struck through with M8
71 / 124 / 0 and SIGNED 6 September 2026 hash aa0469ee…aef7. P08-T14 box
added, unchecked.

CF-153 and CF-154 CLOSED at P08-T14, discharged by D-49, not deferred.
Open 97 − 2 = 95.

`scripts/smoke/partner-lab.mjs` MODE public run against the live alias:
S1–S10 and cleanup PASS. MODE operator not run.

Do not merge before the verdict.

## 2026-09-09 — P08-T15: PartnerLab sign-in path and signup discoverability

Parent is unmerged `p08-t14` at `e97e920`, not `main`. No migration.

P08-T14 recorded PASS at reviewer verdict — 8 September 2026.

STEP 1 on the live alias: signup copy was PRESENT in `/ar/offers` and
`/en/offers`. The flag is on at runtime. It was not removed.

STEP 2 took audience-neutral copy on the existing `/dashboard/sign-in`
route rather than a second auth entry, because ADR-001 is one Supabase
auth. Heading and lede in both locales:

- ar: «تسجيل الدخول» / «أدخل البريد الإلكتروني وكلمة المرور للمتابعة.»
- en: «Sign in» / «Enter your email and password to continue.»

STEP 4 is footer, not header: primary nav stays at six items, the header
is a client component, and lab-to-lab already sits in the footer.

SSG public pages bake the footer flag at build time. Home, offers, and
sign-in are request-dynamic, so V3's on/off proof holds there without a
rebuild. Turning the flag off in production still wants a redeploy so
the SSG footer matches.

Do not merge before the verdict.

## 2026-09-09 — P08-T17: Align the local password rule to the hosted policy

Parent is `main` at `d86c735`. Tree was clean. `stash@{0}` was not popped.

STEP 0 recorded P08-T15 PASS at reviewer verdict — 8 September 2026, and
P08-T16 halted at STEP 0 on a dirty working tree, named no cause, issued
no request.

Hosted password policy read from the Supabase dashboard
(Authentication → Policies) on 9 September 2026 by the human:
minimum length 12. Character classes as configured there.
Authoritative per CF-158; supabase/config.toml is not — it declares
password_requirements = "" and minimum_password_length = 6 and is
contradicted by the live project.

`PASSWORD_MIN_LENGTH` is 12: local ≥ hosted (equal). The four
character-class checks are kept. `weak_password` stays NEUTRAL under
OD-18 §6; local ≥ hosted is what makes that NEUTRAL path safe.

CF-158 CLOSED at P08-T17. CF-166 OPEN, reviewer, G8. Open 95 − 1 + 1 = 95.

Do not merge before the verdict.

## 2026-09-09 — P08-T18: Functional UX fixes before G8

Parent is unmerged `p08-t17` at `e2f47e1`. PartnerLab sign-in and sign-out
moved off `/dashboard/*` without a second session, cookie, or Auth client.
The Operator form stays at `/dashboard/sign-in`. A signed-in non-Operator
is redirected by the existing `nel_principal` claim, never by looking up
an address.

An approved partner's Offers listing now has a sign-out. A pending load
attempts one `refreshSession`. Site Settings pickers state their role and
can write alt text through the existing MediaAsset save. A draft Offer
shows a publish affordance; the publish rules are unchanged. Rejected
accounts can be hidden from the Operator list in this mount only.

Local `npx next start` password signup from this IP did not persist a
row (created=1, count 0). The same public form on the live alias did.
Operator AAL2 was not signed into (sidecar absent), so approved-listing,
picker, Offer, and hide proofs that need the dashboard were not run.

Do not merge before the verdict.

## 2026-09-09 — P08-T19: Fix what the Operator cannot get past

Parent is `main` at `33e5a2d`. The Operator is told when unpublish has
nothing to withdraw, and إلغاء النشر is not offered on a never-published
row. Module pages name missing completeness slots and link to them.
Public Offers and the Operator Offers module no longer share a heading.
An approved PartnerLab still cannot be revoked; that is CF-167, and no
control was built.

CF-165 stays OPEN: the human confirmed the Offers sign-out and the
`/ar/dashboard` landing on 9 September 2026, not an approve redirect of
`saved=1`.

Operator AAL2 was not signed into (sidecar absent). Unpublish was not
pressed against the live published Site Settings singleton.

Do not merge before the verdict.

## 2026-09-10 — G8-R: Boundary re-run

Parent is `origin/main` at `6f511d2`. Evidence at
`docs/research/g8r-evidence.md`. No source, no migration, no schema
change. P08-T12's failed-run record was not edited.

P08-T19 recorded PASS at reviewer verdict — 9 September 2026. CF-165
CLOSED from the human's 9 September reject Location
`?view=rejected&saved=1`.

Source since G8 (`ef5671b`) is not identical: T15, T17, T18 and T19
touched `src/`. Every leg was measured fresh.

P1, P2, P6, P7, P9 and STEP 3 hold. P6 is anon PostgREST `[]` while a
laboratory Offer is published. P4 was not executed (no Operator
session). That Offer was not unpublished. G8-R FAIL. G8 remains FAIL.
Open CF 96 − 1 = 95.

Do not merge before the verdict. Do not start P06.


