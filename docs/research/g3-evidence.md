# G3 evidence pack

**Status:** evidence tooling, not a model document. Landed at P03-T09, 2 September 2026.
**PR-09:** never current truth, never a parity target. This file decides nothing.

This pack holds what a **build** can prove: static HTML, tokens in that HTML, catalogue
parity, stylesheet greps, seed arithmetic, guards, and import reachability. Each figure
is a command and the result of running it.

Two G3 criteria are **not** in this pack, because no command here can produce them:

1. **CF-59** — `DESIGN_SYSTEM.md` §3 contrast ratios on rendered text over rendered
   surfaces, and §8's 44px minimum on every interactive target, in both locales.
2. **CF-60** — a reader of Arabic confirming that the rendered Arabic is correct,
   natural, and correctly isolated where Latin appears.

Neither is measured here. Neither is marked satisfied. An unmeasured floor is unmeasured.
See **WHAT A HUMAN MUST DO BEFORE G3**.

Independent reproduction: every figure below was produced by the command beside it, then
produced again by a second run of that same command. None disagreed.

---

## 1. Static HTML, locale pages, Programme detail, empty `generateStaticParams`

**Command.** `npm run build`

**Result.** Next.js 16.3.3. `Generating static pages using 16 workers (26/26)`.
Route table (quoted):

```
┌ ○ /_not-found
├   /[locale]
│ ├ ● /ar
│ └ ● /en
├   /[locale]/about
│ ├ ● /ar/about
│ └ ● /en/about
… (ten further static patterns, each with `/ar/…` and `/en/…`) …
├   /[locale]/programmes
│ ├ ● /ar/programmes
│ └ ● /en/programmes
├ ● /[locale]/programmes/[slug]
└   /[locale]/videos
  ├ ● /ar/videos
  └ ● /en/videos
```

`● /[locale]/programmes/[slug]` has **no** nested `/ar/programmes/<slug>` or
`/en/programmes/<slug>` rows. Every other `[locale]` pattern emits two locale URLs.
That is the empty `generateStaticParams` result after the P03-T08 `console.log` calls
were deleted: emptiness is the route table and the file count, not a log line.

**Command.**

```
python -X utf8 -c "from pathlib import Path; app=Path('.next/server/app'); html=list(app.rglob('*.html')); print('total', len(html)); print('excl_global_error', sum(1 for p in html if p.name!='_global-error.html')); print('locale', sum(1 for p in html if p.name not in ('_global-error.html','_not-found.html'))); print('detail', sum(1 for p in html if 'programmes' in p.as_posix() and p.name not in ('programmes.html',)))"
```

**Result.** `total 26` · `excl_global_error 25` · `locale 24` · `detail 0`.

The 24 locale pages, by relative path under `.next/server/app/`:

`ar.html` · `en.html` · `ar/about.html` · `en/about.html` · `ar/contact.html` ·
`en/contact.html` · `ar/departments.html` · `en/departments.html` · `ar/equipment.html` ·
`en/equipment.html` · `ar/lab-to-lab.html` · `en/lab-to-lab.html` · `ar/locations.html` ·
`en/locations.html` · `ar/offers.html` · `en/offers.html` · `ar/online-results.html` ·
`en/online-results.html` · `ar/privacy-policy.html` · `en/privacy-policy.html` ·
`ar/programmes.html` · `en/programmes.html` · `ar/videos.html` · `en/videos.html`.

---

## 2. Byte-comparable to the previous build (content hashes stripped)

**Previous build.** Static HTML from the P03-T08 tree (console.log still present), copied
to a scratch directory before the log deletion. Same 24 locale paths.

**Comparison method.** For each of the 24 locale pages, read the P03-T08 HTML and the
P03-T09 HTML and apply, in order:

1. replace `[A-Za-z0-9_-]{8,}\.(?:js|css|woff2?)` with `HASH.ext` (hashed asset filenames)
2. replace `\.[0-9a-f]{8,}\.` with `.HASH.` (hex content hashes inside filenames)
3. replace escaped and unescaped RSC `"b":"<token>"` fields of 8+ url-safe characters
   with `"b":"HASH"` (Next.js flight/tree hashes)
4. replace remaining `[0-9a-f]{8,}` with `HEX`

Then compare the two strings for equality.

**Result.** `comparable 24 of 24`. Raw file lengths were identical (`ar.html` 78350 bytes
both sides). The only residual difference before step 3 was an RSC `"b"` token
(`K_QysBkGGKRq5x_74VYT-` vs `hpDr2_cgF73zztvipfcfq`). Removing the logs did not change
rendered markup.

---

## 3. Ten boundary tokens across all 24 pages

Concatenation of the 24 locale HTML files. Case-insensitive for tags.

| Token | Command | Count |
|---|---|---|
| `<form` | `re.findall(r"<form\b", blob, re.I)` | 0 |
| `<input` | `re.findall(r"<input\b", blob, re.I)` | 0 |
| `<textarea` | `re.findall(r"<textarea\b", blob, re.I)` | 0 |
| `<select` | `re.findall(r"<select\b", blob, re.I)` | 0 |
| `<iframe` | `re.findall(r"<iframe\b", blob, re.I)` | 0 |
| `<embed` | `re.findall(r"<embed\b", blob, re.I)` | 0 |
| `onSubmit` | `blob.count("onSubmit")` | 0 |
| `FormData` | `blob.count("FormData")` | 0 |
| `action=` | `blob.count("action=")` | 0 |
| `mailto:` | `blob.count("mailto:")` | 0 |

Ten tokens. Each 0.

---

## 4. Absolute URLs, and portal anchors against `target="_blank" rel="noopener noreferrer"`

**Command.** `re.findall(r"https?://[^\"'\s<>]+", page)` over the 24 locale pages.

**Raw hits** (the trailing `\` is the RSC JSON escape of the same URL, not a fourth host):

| Count | Match |
|---|---|
| 82 | `https://example.invalid/portal-placeholder` |
| 76 | `https://wa.me/200000000000` |
| 58 | `https://example.invalid/portal-placeholder\` |
| 52 | `https://wa.me/200000000000\` |

Two absolute URLs in the build: the D-07 portal placeholder and the synthetic WhatsApp
deep link. No other host.

**Command.** For each `<a …>` in the 24 pages, count those whose attribute string contains
`https://example.invalid/portal-placeholder`; of those, count those that also contain
`target="_blank"` (or `target='_blank'`) and both `noopener` and `noreferrer`.

**Result.** portal-anchor count **82**. Count carrying `target="_blank" rel="noopener noreferrer"`
**82**. The two counts match.

---

## 5. Nine tracking tokens, each 0

Concatenation of the 24 locale HTML files, case-insensitive `count`.

| Token | Count |
|---|---|
| `googletagmanager` | 0 |
| `google-analytics` | 0 |
| `gtag(` | 0 |
| `fbq(` | 0 |
| `hotjar` | 0 |
| `mixpanel` | 0 |
| `youtube.com` | 0 |
| `youtu.be` | 0 |
| `ytimg.com` | 0 |

Nine tokens. Each 0. (`BOUNDARY_MODEL.md` §4 item 7: analytics script and embedded-player
hosts. The footer catalogue string `YouTube (placeholder link)` is not a host URL.)

---

## 6. Catalogue key counts per locale, set-identical, duplicate count

**Command.** Parse `src/lib/catalog.ts`: quoted keys in the `const ar = { … };` block and
the `const en = { … };` block (`re.findall(r'^\s*"([^"]+)":', block, re.M)`).

**Result.** `ar` **366** · `en` **366** · `ar == en` (same keys in the same order) ·
duplicate keys in `ar` **0** · duplicate keys in `en` **0**.

---

## 7. Physical CSS properties · Eastern Arabic-Indic digits · `prefers-reduced-motion`

**Physical properties.** `I18N_MODEL.md` §4 forbidden list over `src/**/*.css`,
`src/**/*.ts`, `src/**/*.tsx`: `margin-left` `margin-right` `padding-left` `padding-right`
`border-left` `border-right` `(?<![\w-])left\s*:` `(?<![\w-])right\s*:`
`float\s*:\s*(?:left\|right)` `text-align\s*:\s*(?:left\|right)`.

**Result.** **0**. (`npm run guard:design` R1 is the same list, executable; exit 0,
`Scanned 84 file(s) under src/`.)

**Eastern Arabic-Indic digits.** `[\u0660-\u0669\u06F0-\u06F9]` over every file under
`src/` and over the 24 locale pages.

**Result.** `src/` **0** · 24 pages **0**. (`guard:design` R2 covers `src/`; exit 0.)

**`prefers-reduced-motion` coverage.** Over `src/**/*.css`: count `transition:` and
`animation:` declarations outside `@media (prefers-reduced-motion: reduce)` blocks
(declarations); count `transition: none` and `animation: none` inside those blocks
(counterparts).

**Result.** declarations **20** · counterparts **20**. Per file, the two numbers were
equal (InfoPage 1/1, SiteFooter 1/1, SiteHeader 3/3, SiteHome 6/6, SitePanels 2/2,
Button 2/2, EntityCard 1/1, LabTestCard 1/1, LanguageSwitcher 1/1, SkeletonBar 1/1,
VideoCard 1/1). This is a stylesheet count, not a rendered-motion measurement.

---

## 8. Ten `IsolatedCopy` cases with their node sequences

**Command.** Scratch-tree Node call of `isolatedCopyNodes` transcribed from
`src/components/ui/Isolate.tsx` (the non-JSX function). `LATIN_TOKEN`, `ARABIC_BLOCK`
and `CONTINUE_GAP` in the transcription are identical to the source. Ten cases; locale
`ar` except case 7.

**Result.**

| # | Locale | Input | Node sequence |
|---|---|---|---|
| 1 | `ar` | `فحص Complete Blood Count شامل` | `["فحص ", ISO("Complete Blood Count"), " شامل"]` |
| 2 | `ar` | `جهاز Roche Cobas e411` | `["جهاز ", ISO("Roche Cobas e411")]` |
| 3 | `ar` | `تحليل Vitamin D.` | `["تحليل ", ISO("Vitamin D.")]` |
| 4 | `ar` | `نتائج COVID-19 PCR` | `["نتائج ", ISO("COVID-19 PCR")]` |
| 5 | `ar` | `A و B` | `[ISO("A"), " و ", ISO("B")]` |
| 6 | `ar` | `سعر 2026 جنيه` | `"سعر 2026 جنيه"` |
| 7 | `en` | `Complete Blood Count` | `"Complete Blood Count"` |
| 8 | `ar` | `نتائج COVID 19 PCR` | `["نتائج ", ISO("COVID 19 PCR")]` |
| 9 | `ar` | `فحص CBC، ESR وغيرها` | `["فحص ", ISO("CBC"), "، ", ISO("ESR"), " وغيرها"]` |
| 10 | `ar` | `Vitamin B 12` | `[ISO("Vitamin B 12")]` |

`ISO(…)` is one `{ isolate }` part, rendered as `<span dir="ltr">…</span>`. A bare
string is returned unchanged (no isolate). Cases 1–7 are the P03-T05-F set; 8–10 are
the P03-T06 additions. A second run of the same command produced the same ten lines.

This is the function's node sequence. It is not a judgement that the rendered Arabic
reads correctly (CF-60).

---

## 9. Ninety nonempty seeded names against `src/`, `catalog.ts`, and the built pages

**Command.** From `data/seed/catalogue.json`, collect every nonempty stripped `name_ar`
and `name_en` on `programmes` and on `tests`. Search each name as a literal substring in
(1) every file under `src/`, (2) `src/lib/catalog.ts` alone, (3) the concatenation of
the 24 locale pages.

**Result.** nonempty seeded names **90**. Hits in `src/` **0**. Hits in `src/lib/catalog.ts`
**0**. Hits in the 24 pages **0**.

---

## 10. `<html lang>` and `dir`

**Command.** `re.search(r"<html\b[^>]*>", text)` on `.next/server/app/ar.html` and
`.next/server/app/en.html`.

**Result.**

- `ar.html` → `<html lang="ar" dir="rtl">`
- `en.html` → `<html lang="en" dir="ltr">`

---

## 11. `121 -> 72`, and the five guards

**Command.** `python -X utf8 data/seed/verify_seed.py`

**Result.**

```
programmes:        9
canonical LabTests:72
relationships:     121
121 -> 72
QA-flagged LabTests: 5 -> ast, esr, fsh, app-afp, creatinine-urea-combined

PASS
```

Exit **0**.

**Five guards** (CI order). Each `npm run …`; exit codes:

| Command | Exit | Quoted line |
|---|---|---|
| `npm run guard:naming` | 0 | `guard:naming — PASS. Scanned 16 .sql file(s): …` |
| `npm run guard:design` | 0 | `guard:design — PASS. Scanned 84 file(s) under src/.` |
| `npm run guard:phases` | 0 | `guard:phases — PASS. Read docs/PHASES.md and docs/SESSION_CONTEXT.md.` R5 report-only, 17 CF-100 rows |
| `npm run lint` | 0 | `eslint .` (no findings) |
| `npm run typecheck` | 0 | `tsc --noEmit` (no findings) |

---

## 12. Reachability (PR-34)

**Command.** Walk files under `src/app/`, `src/components/`, `src/lib/`, `src/styles/`
with suffix `.ts` `.tsx` `.css` `.js` `.jsx` (universe). Entries: every `.ts`/`.tsx`/`.css`
under `src/app/`, plus `src/styles/fonts.css`, `src/styles/tokens.css`,
`src/styles/globals.css`. Follow `from`/`import`/`@import` specifiers; resolve `@/`
against `src/` and relatives against the importer. Reachable = universe members whose
resolved path was visited.

**Result.** universe **84** · reachable **84** · unreachable **0**.

(`guard:design` independently scanned 84 files under `src/`.)

---

## 13. Console scaffolding removed

**Command.** `git grep -n "console\." -- src`

**Result.** no matches (git grep exit 1). Python count of `console.` over every file
under `src/` → **0**. The Done-when `grep -rn 'console\.' src/ | wc -l` is the same
search; this machine has no `grep`/`wc` on PATH, so git grep and a Python count were
used. Both 0.

---

## 14. Ledgers this pack does not move

**Commands.**

```
python -X utf8 -c "import re; from pathlib import Path
d=Path('docs/DECISIONS.md').read_text(encoding='utf-8')
print('D', len(re.findall(r'^### D-', d, re.M)))
print('OD', len(re.findall(r'^### OD-', d, re.M)))
print('mig', len(list(Path('supabase/migrations').glob('*'))))
cf=Path('docs/method/CARRY_FORWARDS.md').read_text(encoding='utf-8')
ids=[int(x) for x in re.findall(r'^\| CF-(\d+) \|', cf, re.M)]
print('cfmax', max(ids), 'open', len(re.findall(r'^\| CF-\d+ \|.*\| OPEN \|', cf, re.M)))
pr=Path('docs/method/PRECEDENTS.md').read_text(encoding='utf-8')
print('prmax', max(int(x) for x in re.findall(r'\*\*PR-(\d+)\*\*', pr)))"
```

**Result.** D **46** · OD **12** · migrations **16** · CF live maximum **102** · open CF
**62** · PR live maximum **34**.

Open CF arithmetic (PR-28): base **62**, plus 0 additions, minus 0 closures = **62**.
CF-59 and CF-60 stay OPEN. No `supabase` command was run.

---

## WHAT A HUMAN MUST DO BEFORE G3

These two rows are the G3 criteria this pack cannot hold. No tool in this repository
can close them. No proxy is computed. Neither is marked satisfied.

### CF-59

Open `/ar` and `/en` in a browser and measure `DESIGN_SYSTEM.md` §3's contrast ratios
on **rendered text over rendered surfaces**, and §8's **44px minimum on every
interactive target**, in both locales.

Pages to check (the 24 URLs this build emits; 12 static patterns × 2 locales):

| Route | Arabic | English |
|---|---|---|
| Home | `/ar` | `/en` |
| About | `/ar/about` | `/en/about` |
| Departments | `/ar/departments` | `/en/departments` |
| Programmes listing | `/ar/programmes` | `/en/programmes` |
| Offers | `/ar/offers` | `/en/offers` |
| Videos | `/ar/videos` | `/en/videos` |
| Equipment | `/ar/equipment` | `/en/equipment` |
| Locations | `/ar/locations` | `/en/locations` |
| Contact | `/ar/contact` | `/en/contact` |
| Online results | `/ar/online-results` | `/en/online-results` |
| Privacy policy | `/ar/privacy-policy` | `/en/privacy-policy` |
| Lab-to-lab | `/ar/lab-to-lab` | `/en/lab-to-lab` |

`/{locale}/programmes/{slug}` emits **zero** pages in this build (every Programme is
`draft`). It cannot be measured until a Programme is published, which is a clinical
act, not a G3 measurement substitute.

This row is **not** satisfied by the §3 table in `DESIGN_SYSTEM.md`, by font metrics,
or by this pack.

### CF-60

A reader of Arabic reads the rendered Arabic on every page in the Arabic column above
(`/ar` and the eleven `/ar/…` routes) and confirms the copy is correct, natural, and
correctly isolated where Latin appears.

This row is **not** satisfied by `IsolatedCopy` node sequences, by IBM Plex metrics, or
by this pack.
