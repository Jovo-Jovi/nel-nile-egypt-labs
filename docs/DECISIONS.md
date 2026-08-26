# NEL — Decisions

**Status:** AUTHORED at P00-T02 · 2026-08-25
**Binding on:** every prompt issued, every document authored, every identifier written
**Supersedes:** the unsigned draft quotation where a row below says so. The draft is not deleted; the conflict is named and owned as a carry-forward.

Twenty decisions. Four of them are filed as formal Operational Decisions (OD-01, OD-02, OD-03, OD-04). A decision is in force when it appears here. Conversation does not amend this file.

---

## Formal Operational Decisions

### OD-01 — Hosting region

**Status:** DECIDED-ON-RULE · region PENDING at P01
**Decides:** the selection rule, not the region.
**Rule:** at Supabase project creation, enumerate the regions the CLI reports as available, select the nearest to Cairo, and paste that CLI output into this OD as the evidence. The resolved region lands as an OD-01 amendment at P01.
**Not a legal constraint:** the platform stores no personal data, so residency is a latency choice.
**CLI evidence (P01):** PENDING. Do not assume a Middle East region exists.

### OD-02 — Search

**Status:** DECIDED
**Decides:** a static index is built at build time and queried client-side across every `LabTest` name and alias in both locales. No server round trip. Seventy-two records do not justify one.
**Index shape:** `CONTENT_MODEL.md` §3f.

### OD-03 — Scope freeze

**Status:** SIGNED
**Signed:** 25 August 2026
**Lapses:** 15 September 2026 if no signed quotation is filed.
**Decides:** development proceeds against the draft quotation as amended by this OD and by D-01 through D-19. `SCOPE.md` still derives from a signed quotation; until that quotation is filed, this OD is the freeze.
**On lapse:** if 15 September 2026 arrives with no signed quotation, this OD expires and no further build task is issued until a new freeze is signed.

### OD-04 — Repository visibility

**Status:** SIGNED
**Signed:** 25 August 2026
**Decides:** the repository is PUBLIC during development, for review
convenience, and reverts to PRIVATE before production cutover.
**Reverts when:** at P07, before DNS cutover. The revert is a G7 checklist
item. Until it is done, G7 does not pass.
**Conditions, binding while public:**
1. No credential, key, token, project ref or connection string in any
   commit. PR-10 stands; the exposure window is now immediate rather than
   theoretical.
2. No operational weakness assessment of a third-party system in any tracked
   file. The dependency is tracked; the assessment lives in client
   correspondence.
3. No CI trigger that runs fork-supplied code with repository context.
4. The clinical QA flags are unconfirmed readings of a public 2018 page, not
   assertions of clinical error, and every file carrying them says so.
**Not decided here:** whether the client consented to publication. That
question is open and is tracked as a carry-forward owned by the human.
**Known limit:** anything already pushed at `45ef104` is already public.
This OD governs forward state only. Removing published history requires a
rewrite and a force-push and is not authorised by this OD.

---

## Decision log

### D-01 — Scope freeze

OD-03, signed 25 August 2026, lapses 15 September 2026 if no signed quotation is filed. Development proceeds against the draft quotation as amended by OD-03.

### D-02 — Hosting region

OD-01. Decides the selection rule, not the region: enumerate available Supabase regions by CLI at project creation, select the nearest to Cairo, record the CLI output in this file as the evidence. The resolved region lands as an OD-01 amendment at P01. The platform stores no personal data, so residency is a latency choice and not a legal constraint.

### D-03 — Search

OD-02. Static index built at build time, queried client-side across all `LabTest` names and aliases in both locales. No server round trip. Seventy-two records do not justify one.

### D-04 — Prices

No price field on `Programme`. Price lives on `Offer`, which already carries validity dates, so a stale price expires by itself. Adding a price to `Programme` later is a migration.

### D-05 — ProgrammeTier

Two axes. `ProgrammeTierAxis` (`none` | `Silver` | `Gold` | `Platinum` | `Children`) and `AudienceAxis` (`none` | `Male` | `Female`). The seed's "Platinum — Female" resolves to (`Platinum`, `Female`); Infertility "Male" resolves to (`none`, `Male`); the seven untiered Programmes resolve to (`none`, `none`). Supersedes the single-axis reading the frozen GLOSSARY defers to `CONTENT_MODEL.md`.

### D-06 — Cumulation

Silver → Gold → Platinum cumulative. Children is standalone and never inherits from any `ProgrammeTierAxis`. Reason: a cumulative Children axis renders PSA and seven tumour markers on a child's page. This is a harm vector, not a display preference, and it is not a configuration flag. The renderer rule is in `CONTENT_MODEL.md` §3b.

### D-07 — ResultsPortalLink

Build-time constant, target host allowlisted, no Operator edit path, no dashboard field. Supersedes the deferral in the frozen GLOSSARY.

### D-08 — Operator accounts

Minimum two. MFA is REQUIRED, not optional. GLOSSARY §2 is precedence 1 and beats draft quotation §2.3; the quotation is amended to match the build, never the reverse.

### D-09 — Contact

WhatsApp deep link only, opened client-side. No form, no booking, no inbox. The quotation's incoming-message inbox module is struck from the module list. Adding a form later is a `BOUNDARY_MODEL.md` amendment plus a changed compliance position plus separate paid scope — not a version bump.

### D-10 — Language

Bilingual, Arabic default. Draft quotation §7 and §9 exclude bilingual and must be amended and repriced.

### D-11 — Catalogue volume

9 Programmes · 72 LabTests PRE-SIGN-OFF · 121 relationships · 4 Branches, 3 confirmed · 4 LabUnits. Fills those blanks in draft §4. Remaining §4 blanks (Offers, Videos, Equipment, FAQ entries, website pages, Operator accounts) are not filled here: Operator accounts are D-08; website pages are enumerated in `CONTENT_MODEL.md` §3c; Offers, Videos, Equipment and FAQ entries have no signed quantity.

### D-12 — Payment

30% at signature · 20% at P03 exit · 20% at P05 exit · 30% at P07 launch. Supersedes the three-milestone schedule in draft §5 and §13.

### D-13 — Analytics and cookies

Neither ships at launch. The Privacy Policy page ships; the consent banner and the analytics do not. Every YouTube embed uses privacy-enhanced mode and does not load until the Visitor clicks a placeholder. An autoloading embed voids `BOUNDARY_MODEL.md` §5 — see evidence item 7.

### D-14 — Outbound portal page

One page carrying up to two clearly labelled outbound links, Visitor entry and Lab-to-Lab entry. Answers quotation D11. The page is the `ResultsPortalLink` public route in `CONTENT_MODEL.md` §3c.

### D-15 — Lab-to-Lab

In scope. Static page, copy sourced from `SiteSettings`, no ninth dashboard module. A managed partner-laboratory list is a priced change.

### D-16 — Dashboard modules

Eight: Offers · Videos · Equipment · Branches · Programmes · LabUnits · Site Settings · Media Library. Login is authentication, not a module. Activity log is a platform feature. The quotation's incoming-message inbox is struck per D-09.

### D-17 — Portal coupling

Linked, never framed. Confirmed 25 August 2026. See `BOUNDARY_MODEL.md` §2 and §4 item 8.

### D-18 — Offer to Programme

Optional nullable relation. An `Offer` may reference one `Programme`; it is never required to.

### D-19 — Clinical QA dispatch

Deferred by client decision, 25 August 2026. PR-08 holds: `LabTest` material ships behind a feature flag and Programmes render descriptions only. The gate binds release, not development. This becomes critical path the moment a launch date is agreed, and the dispatch date is then derived by working backwards from it.

### D-20 — Repository visibility

OD-04, signed 25 August 2026. The repository is PUBLIC during development, for review convenience, and reverts to PRIVATE before production cutover — the revert is a G7 checklist item.
