# P06-T02 — Measure the live homepage against the publication state

**Evidence tooling. Never current truth, never a spec, never cited as
authority.** PR-09 applies: this file justifies later homepage work; it does
not replace `CONTENT_MODEL.md`, `DESIGN_SYSTEM.md` §12, `BOUNDARY_MODEL.md`
or `DECISIONS.md`. This task authors nothing under `src/`, `supabase/` or
`data/seed/`. It writes no row, publishes nothing, and changes no Vercel
setting.

**Task:** P06-T02 · P06 homepage-state audit · 12 September 2026
**Git branch:** `p06-t02` from `origin/main` at `0f7bf93` (merge of pull
request #130, `p08-t26`). Tip of `p08-t26` was `f51710d`.
**Reads:** `npx supabase db query --linked` and unauthenticated GET of
`https://nel-nile-egypt-labs.vercel.app/{locale}`. `smoke:operator` was
not run.

---

## RESIDUAL REPAIRS

None. No UNRATIFIED edit.

Observations that are not repairs, and were not applied:

1. **§4 item 8 FAIL is a HALT.** Every measured public URL served no
   `Content-Security-Policy` header. Item 6 PASS (https, zero query
   parameters, zero fragment). The portal host is not framed. Absence of
   CSP is the finding, not a pass. No repair was made (PR-18).
2. **Equipment is not a homepage band.** The three-state taxonomy assumes
   a rendered block. The homepage HTML contains no Equipment section and
   zero occurrences of the Equipment heading. That is the standing
   composition (`equipment.listing` is `/{locale}/equipment`), not
   UNWIRED as defined (UNWIRED requires the قيد الانتظار shell to render).
3. **Offers on the homepage is the P08 invite, not a §12 shell.** `#offers`
   renders PartnerLab sign-in copy. STEP 1 shows zero published `"Offer"`
   rows. The قيد الانتظار marker is absent from that section, so
   UNPUBLISHED SHELL as defined does not apply.
4. **Research-count basis.** P06-T01 and P08-T26 reported the raw
   `git ls-files docs/research/` total. The established basis excludes
   README and `assets/`. This file states both. Historical reports were
   not edited (PR-32).

---

## HALT — BOUNDARY_MODEL.md §4 item 8

STOP condition: a §4 item 6 or item 8 check comes back FAIL.

- Item 6: **PASS** on the homepage, header, footer and
  `/{locale}/online-results`, both locales. Scheme `https://`. Query
  parameter count 0. Fragment no. Path is `/Login/` (a path, not a
  parameter; `resultsPortalLink.ts` rejects `search` and `hash` only).
- Item 8: **FAIL.** `iframe` / `embed` / `object` / `frame` counts are 0
  on every measured page, and no such tag targets the portal host. The
  `Content-Security-Policy` header is **absent** on `/ar`, `/en`,
  `/ar/online-results` and `/en/online-results`. There is no `frame-src`
  directive to quote. Absence is the finding, not a pass.

No production code was changed. CF-177 records the FAIL. The reviewer
decides the repair.

---

## STEP 0 — housekeeping

Working tree was clean before any edit (P08-T16's halt). Branch cut from
`origin/main` at `0f7bf93` (merge of `p08-t26`, PR #130).

Quoted at STEP 0, all exit 0:

- `npm run guard:naming` — PASS (28 SQL files)
- `npm run guard:schema` — PASS (14 forwards; inventory 33)
- `npm run guard:design` — PASS (205 files under `src/`)
- `npm run guard:phases` — PASS; R5 report-only 17 CF-100 rows
- `npm run guard:boundary` — PASS (22 `.html` under `.next/server/app/`)
- `npm run lint` — PASS (`eslint .`)
- `npm run typecheck` — PASS
- `npm run build` — PASS (Next.js 16.3.3; middleware deprecation
  warning only)
- `python -X utf8 data/seed/verify_seed.py` — `124 -> 71`, PASS,
  QA-flagged 0

P08-T26 Verdict cell set to the mandated PASS-prefixed text. PHASES.md
`**P08-T26**` checked; unchecked `**P06-T02**` added under P06.
`npm run guard:phases` exit 0 afterwards.

`grep -c "^### OD-"` via python line-prefix count: **21**.
`grep -c "^### D-"`: **49**. Status DRAFT lines: **1**, OD-09.
OD-21 §3 still SUSPENDED at `docs/DECISIONS.md:783`; §1, §2, §4–§7 were
not edited.

---

## STEP 1 — publication state, re-read

Not reused from P06-T01. Linked query against `information_schema` then
per-table `publication_state` counts. Command driver:
`python -X utf8 scripts/audit/p06-homepage-state-audit.py db`.

Public base tables (11), information_schema order:

`Branch` · `Equipment` · `LabTest` · `LabUnit` · `MediaAsset` · `Offer`
· `Programme` · `ProgrammeLabTest` · `ProgrammeTier` · `SiteSettings`
· `Video`

All eleven carry `publication_state`.

| Table | Rows | draft | published |
|---|---|---|---|
| `"Branch"` | 3 | 0 | 3 |
| `"Equipment"` | 1 | 0 | 1 |
| `"LabTest"` | 71 | 0 | 71 |
| `"LabUnit"` | 4 | 0 | 4 |
| `"MediaAsset"` | 3 | 0 | 3 |
| `"Offer"` | 1 | 1 | 0 |
| `"Programme"` | 9 | 0 | 9 |
| `"ProgrammeLabTest"` | 124 | 0 | 124 |
| `"ProgrammeTier"` | 14 | 0 | 14 |
| `"SiteSettings"` | 1 | 0 | 1 |
| `"Video"` | 1 | 0 | 1 |

Moved since P06-T01: the clinical catalogue is now `published`
(`"LabTest"` 71, `"Programme"` 9, `"ProgrammeTier"` 14,
`"ProgrammeLabTest"` 124). P06-T01 read those four as all `draft`. This
window did not write them.

`"Branch"` coordinates (same query):

- rows 3
- latitude non-null 1
- longitude non-null 1
- both non-null 1
- published and both non-null 1

CF-69 already owns the 1-of-3 optional pins. Not re-landed.

### Laboratory Offer hashed `7cc7436e57b8`

One `"Offer"` row. `left(md5(id::text), 12)` = `7cc7436e57b8`.
`publication_state` = `draft`. Not written, not published, not
unpublished by this window.

---

## STEP 2 — live homepage blocks

Unauthenticated GET `https://nel-nile-egypt-labs.vercel.app/ar` and
`/en`. HTTP 200 both. Classification is from the response body, not from
`SiteHome.tsx`.

Ten verdicts:

| Block | Locale | Verdict | Published rows | Rendered marker |
|---|---|---|---|---|
| Videos | ar | **UNWIRED** | `"Video"` 1 | `#videos` heading `فيديوهات`; `data-approval-state="pending"`; label `قيد الانتظار — بانتظار ملفات الفيديو من العميل`. Published title `أهمية الفحوصات الدورية لصحة أفضل` hit count **0**. |
| Videos | en | **UNWIRED** | `"Video"` 1 | `#videos` heading `Videos`; same pending attr; label `Pending — awaiting client-supplied video assets`. Published title `The Importance of Regular Health Checkups` hit count **0**. |
| Equipment | ar | **ABSENT BAND** (not one of the three states) | `"Equipment"` 1 | Homepage HTML: heading `الأجهزة` count **0**; published name `جهاز الكيمياء الإكلينيكية` count **0**; no `#equipment` section. `HEADER_NAV` / `FOOTER_MEDIA` do not include `/equipment`. |
| Equipment | en | **ABSENT BAND** (not one of the three states) | `"Equipment"` 1 | Heading `Equipment` count **0**; published name `Clinical Chemistry Analyzer` count **0**; no section. |
| Programme cards | ar | **UNWIRED** | `"Programme"` 9 | `#programmes` (a `div`, not a `section`) renders `SitePanels` tab `البرامج`, catalogue standfirst `برامج فحص شاملة — الأسماء المعتمدة تصل بعد توقيع الفريق الطبي.`, `data-approval-state="pending"`, six `SkeletonBar` slots, label `قيد الانتظار — بانتظار توقيع الفريق الطبي بالمعمل كتابيًا`. Published names (e.g. `فحص وظائف الكلى`) hit count **0**. |
| Programme cards | en | **UNWIRED** | `"Programme"` 9 | Same structure. Label `Pending — awaiting the lab&#x27;s written clinical sign-off`. Published names (e.g. `Kidney Profile`) hit count **0**. |
| Offers | ar | **not UNPUBLISHED SHELL** (invite, not قيد الانتظار) | `"Offer"` 0 | `#offers` kicker `العروض`; body `العروض متاحة للمعامل الشريكة المعتمدة. سجّل الدخول للمتابعة.`; links `/ar/partner-lab/sign-in` and `/ar/partner-lab/sign-up`. `data-approval-state` count in this section **0**. Draft Offer title hit count **0**. |
| Offers | en | **not UNPUBLISHED SHELL** (invite, not قيد الانتظار) | `"Offer"` 0 | Body `Offers are available to approved partner laboratories. Sign in to continue.` Same shape. |
| Map pins | ar | **UNWIRED** | `"Branch"` 3 published; 1 with lat/long | `#branches` two pending labels `قيد الانتظار — بانتظار بيانات الاتصال الرسمية من العميل`; `data-map-pin` count **0**. Greater Cairo SVG is present inside the pending gate; no pin marks. |
| Map pins | en | **UNWIRED** | same | Labels `Pending — awaiting the client&#x27;s official contact data`; `data-map-pin` count **0**. |

UNWIRED is a defect under this fence. CF-174 (Videos), CF-175 (Programme
cards), CF-176 (map pins). Equipment and Offers do not match the three
definitions; no CF for those two.

The standing position — homepage stays §12, no wiring task — no longer
matches the data for Videos, Programme cards and map pins. It still
matches Equipment (no homepage band) and Offers (zero published rows,
P08 invite).

---

## STEP 3 — is anything actually cached?

`page.tsx` exports `dynamic = "force-dynamic"` and `revalidate = 0`.
Measured headers, not that export.

| URL | x-vercel-cache | age | cache-control | x-vercel-id |
|---|---|---|---|---|
| `/ar` | MISS | 0 | `private, no-cache, no-store, max-age=0, must-revalidate` | `fra1::iad1::qrvmq-1789213228010-aaf5fd989ae6` |
| `/en` | MISS | 0 | same | `fra1::iad1::jrbqq-1789213226178-9d14faaeb1ae` |
| `/ar?nel_p06_t02=1` | MISS | 0 | same | `fra1::iad1::7cpj7-1789213227961-625c00b84621` |
| `/en?nel_p06_t02=1` | MISS | 0 | same | `fra1::iad1::w89md-1789213248967-cfc8b0c799c3` |

Plain vs cache-bust body:

- `/ar` 87408 bytes vs bust 87468 bytes. Bodies not equal. First
  difference is the Next.js flight payload encoding the request URL
  (`"ar"` / `"q":""` vs `"ar?nel_p06_t02=1"` / `"q":"?nel_p06_t02=1"`).
  No homepage content region differs.
- `/en` 80925 vs 80985. Same shape, locale `en`.

**Conclusion: no caching layer is serving stale content.**
`x-vercel-cache: MISS`, `age: 0`, `cache-control` private no-store.
The UNWIRED shells are the live body. The published rows themselves are
the current ones (STEP 1); the homepage does not render them. A draft
Offer sits in draft, not behind a CDN copy of an older published row.

`/{locale}/online-results` (STEP 4, not the homepage) served
`x-vercel-cache: PRERENDER` and `cache-control: public, max-age=0,
must-revalidate`. Recorded; not used to explain homepage shells.

CSP header: **absent** on all six measured responses.

---

## STEP 4 — boundary evidence

### 4a. Results portal

`src/lib/resultsPortalLink.ts` reads `process.env.RESULTS_PORTAL_VISITOR_URL`
and `RESULTS_PORTAL_LAB_TO_LAB_URL`. The href is **an environment
variable**, not a `"SiteSettings"` column. The laboratory cannot change
it through the dashboard.

Live pages (homepage header, homepage body, homepage footer, and
`/{locale}/online-results`), both locales, unauthenticated:

- Scheme: `https://` on every portal href.
- Query parameter count: **0**. Fragment: **no**. Path: `/Login/`.
- `iframe` / `embed` / `object` / `frame`: **0**. None targets the
  portal host.
- `Content-Security-Policy`: **absent**. Quoted value: there is no
  header to quote. Item 8 FAIL (HALT above). Host redacted.

### 4b. WhatsApp

Number and prefilled message come from published `"SiteSettings"`
(`whatsapp_e164`, `whatsapp_message_ar`, `whatsapp_message_en`) via
`chromeFromPublishedSettings` → `buildWhatsAppHref`. Not a homepage
hardcode.

`git grep -nE "wa\.me|whatsapp\.com|\+?20[0-9]{8,}" -- src/` :

```
src/lib/dashboard/completeness.spec.ts:106:          whatsapp_e164: "+201000000000",
src/lib/placeholders.ts:9:export const WHATSAPP_PLACEHOLDER_PATH = "wa.me/200000000000";
src/lib/whatsappLink.ts:11:    return `https://wa.me/${digits}`;
src/lib/whatsappLink.ts:13:  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
```

Classification of those four lines:

- `whatsappLink.ts` interpolates digits from a stored column. Not a
  literal number.
- `placeholders.ts` is the named PR-16 sentinel `wa.me/200000000000`,
  not the laboratory number.
- `completeness.spec.ts` is a synthetic fixture `+201000000000` (PR-10).
  It is not the laboratory number. Not treated as the HALT's "literal
  phone number" of the lab. Not allocated as a CF.

Live prefilled message, both locales, from the published singleton and
from decoded `?text=` on the homepage `wa.me` hrefs (identical):

- ar: `مرحبًا، أود الاستفسار عن خدمات معامل النيل إيجيبت.`
- en: `Hello, I would like to inquire about Nile Egypt Labs services.`

Neither asks for, nor invites, a personal or medical detail. Generic
service enquiry. Not a HALT.

### BOUNDARY_MODEL.md §4 walked

| Item | Verdict | Against this measurement |
|---|---|---|
| 1 Schema | PASS this window | `git diff --stat origin/main HEAD -- src/ supabase/ data/seed/` empty of schema. No new column. |
| 2 Route handler | PASS this window | No route handler or server action added. |
| 3 Storage | PASS this window | No bucket change. |
| 4 Logs | PASS this window | No public-route body logging added. |
| 5 Vocabulary | PASS this window | No new `patient` / `result` identifier. |
| 6 Portal link | **PASS** | https, 0 query parameters, 0 fragment. |
| 7 Third-party | PASS on the homepage | No analytics script, no embedded player, no `fonts.googleapis`. `youtube.com` appears as a footer outbound `<a href>` to the laboratory's published social URL (plus RSC payload duplicates), not as an embed. |
| 8 Framing | **FAIL** | No frame tags. CSP header absent, so `frame-src` cannot exclude the portal host. |

§2 items 9–11 (signup / public table / privacy text) were not re-proved
here; this fence asked for items 6 and 8 on the two new channels.

---

## Carry-forwards

CF live maximum computed before any allocate (python `re.findall` over
`^\| CF-(\d+) ` table rows in `docs/method/CARRY_FORWARDS.md`): **173**.
Open count by line prefix `| CF-` and `| OPEN |`: **97**.

Allocated:

- **CF-174** Videos UNWIRED
- **CF-175** Programme cards UNWIRED
- **CF-176** map pins UNWIRED
- **CF-177** §4 item 8 CSP absent

Open arithmetic: base 97 + 4 − 0 = **101**. Next free **CF-178**.

No CF for Equipment (absent band), Offers (P08 invite, zero published
rows), the synthetic spec fixture, or CF-69 (already open).

---

## Tooling

`scripts/audit/p06-homepage-state-audit.py` is the linked-query driver.
`scripts/audit/p06-homepage-classify.py` classifies captured HTML.
`scripts/audit/p06-standing-counts.py` now prints the research count
excluding README and `assets/`.

Live HTML was captured to the machine temp directory and is not
committed. Hotline, WhatsApp numbers, Branch addresses, the
results-portal host, keys and the project ref are redacted here.

---

## Standing counts (this task)

| Check | Command | Result |
|---|---|---|
| Open CF | python line prefix `\| CF-` and `\| OPEN \|` | 97 before allocate; 101 after |
| CF live maximum | python `^\| CF-(\d+) ` table rows | 173 before allocate |
| `### OD-` | python line-prefix `^### OD-` | 21 |
| `### D-` | python line-prefix `^### D-` | 49 |
| Status DRAFT | python lines containing Status and DRAFT | 1 (OD-09) |
| `git ls-files supabase/migrations/` | python len of `git ls-files` | 28 |
| Catalogue | python parse quoted keys in `const ar` / `const en` | ar 590 · en 590 · identical · 0 duplicates |
| Worklist | `git show HEAD:docs/research/clinical-worklist.md` piped to sha256 | `22b2c73b697460b2def3a86e4b6489c987874a071c4d9c0f792a46612197569f` |
| Sign-off | `git show HEAD:docs/research/clinical-signoff.md` piped to sha256 | `aa0469eedad99a4f55acd469912689df511311343ec8f31bb75cabf8c577aef7` |
| Addendum | `git show HEAD:docs/research/clinical-signoff-addendum.md` piped to sha256 | `2b63422efa63f256aef7fcac6f3a3ec3178148a60a3a85199810c75468b5340d` |
| Research tracked | `git ls-files docs/research/` | 34 before this file; 35 after |
| Research excluding README and `assets/` | that list minus `docs/research/README.md` and `docs/research/assets/*` | **30** before this file; **31** after |

`git diff --stat origin/main HEAD -- src/ supabase/ data/seed/` is
empty by construction: this task does not touch those trees.
