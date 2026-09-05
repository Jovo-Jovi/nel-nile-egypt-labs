# Region map

**Precedence:** none. Derived at P05-T17A2 by reading the components. The
authority is the code; this table is the audit that produced the constant at
P05-T17. Where they disagree, the code wins.

**What a row is.** One Visitor-facing content slot on a public route (or the
shared chrome) that either reads database columns, or is a hard-coded §12
pending gate occupying a §4h.3 required slot (`home.hero`, `home.reasons`).
Chrome is listed once against `/{locale}/**`. Nested gates inside one slot
are one row. Keys are stable dotted identifiers for `src/lib/regions.ts`.

**Out of this table.** Catalog-only chrome (nav, headings). Mark slots (no
column on the render path). Photography frames that do not read a
`MediaAsset` from a listing row. Home offer, video, news, caution, branch-copy
and map teasers (hard-coded pending; the listing pages are the rows that
read those tables). `SitePanels`. Footer address (no column selected).
`ResultsPortalLink` (build-time env, D-07). Dashboard.

**Count.** 27 data rows. Command:

```
python -X utf8 -c "import pathlib; rows=[ln for ln in pathlib.Path('docs/research/region-map.md').read_text(encoding='utf-8').splitlines() if ln.startswith('|') and 'region key' not in ln and not ln.startswith('|---')]; print(len(rows))"
```

Compared with twenty-one at `docs/ADMIN_SPEC.md:606`. The figures differ.
This file does not amend the specification.

| route pattern | region key | rendering component and line | backing column or columns | table | current state (content or §12 pending) |
|---|---|---|---|---|---|
| `/{locale}/**` | chrome.whatsapp | `src/components/site/SiteHeader.tsx:102` | `whatsapp_e164`, `whatsapp_message_ar`, `whatsapp_message_en` | `"SiteSettings"` | content when a published number produces a href, else §12 pending |
| `/{locale}/**` | chrome.hotline | `src/components/site/SiteFooter.tsx:88` | `hotline` | `"SiteSettings"` | content when published value present, else §12 pending |
| `/{locale}/**` | chrome.hours | `src/components/site/SiteFooter.tsx:101` | `hours_ar`, `hours_en` | `"SiteSettings"` | content when both published, else §12 pending |
| `/{locale}/**` | chrome.about | `src/components/site/SiteFooter.tsx:38` | `about_body_ar`, `about_body_en` | `"SiteSettings"` | content when both published, else §12 pending |
| `/{locale}/**` | chrome.social | `src/components/site/SiteFooter.tsx:120` | `facebook_url`, `instagram_url`, `linkedin_url`, `youtube_url` | `"SiteSettings"` | content when at least one published https URL, else §12 pending. Optional under §4h.3 |
| `/{locale}` | home.hero | `src/components/site/SiteHome.tsx:114` | none | — | §12 pending, hard-coded. `hero_eyebrow_*`, `hero_headline_*`, `hero_standfirst_*` exist on `"SiteSettings"` and are not in `SITE_SETTINGS_SELECT` (`src/lib/publishedListings.ts:188`); `SiteHome` does not read them. Eyebrow on the page is a catalogue string |
| `/{locale}` | home.reasons | `src/components/site/SiteHome.tsx:232` | none | — | §12 pending, hard-coded. `reason1`–`reason3` title and body pairs exist on `"SiteSettings"` and are not in `SITE_SETTINGS_SELECT`; `SiteHome` does not read them |
| `/{locale}` | home.about | `src/components/site/SiteHome.tsx:186` | `about_body_ar`, `about_body_en` | `"SiteSettings"` | content when both published, else §12 pending |
| `/{locale}` | home.departments | `src/components/site/SiteHome.tsx:151` | `name_ar`, `name_en` | `"LabUnit"` | content when published rows exist, else §12 pending. Description is not passed. Photography inside each tile is a separate ungated-to-this-map frame |
| `/{locale}` | home.seo | `src/app/[locale]/(public)/page.tsx:20` | `seo_title_ar`, `seo_title_en`, `seo_description_ar`, `seo_description_en` | `"SiteSettings"` | document title from both title columns when present, else catalogue title; description only when both description columns are also present. No other public `generateMetadata` reads these columns |
| `/{locale}/about` | about.body | `src/app/[locale]/(public)/about/page.tsx:25` | `about_body_ar`, `about_body_en` | `"SiteSettings"` | content when both published, else §12 pending |
| `/{locale}/contact` | contact.whatsapp | `src/app/[locale]/(public)/contact/page.tsx:50` | `whatsapp_e164`, `whatsapp_message_ar`, `whatsapp_message_en` | `"SiteSettings"` | content when a href is produced, else §12 pending |
| `/{locale}/contact` | contact.hours | `src/app/[locale]/(public)/contact/page.tsx:55` | `hours_ar`, `hours_en` | `"SiteSettings"` | content when both published, else omitted (no pending gate) |
| `/{locale}/contact` | contact.hotline | `src/app/[locale]/(public)/contact/page.tsx:56` | `hotline` | `"SiteSettings"` | content when published value present, else omitted (no pending gate) |
| `/{locale}/contact` | contact.social | `src/app/[locale]/(public)/contact/page.tsx:59` | `facebook_url`, `instagram_url`, `linkedin_url`, `youtube_url` | `"SiteSettings"` | content when at least one URL, else omitted. Optional under §4h.3 |
| `/{locale}/privacy-policy` | privacy.body | `src/app/[locale]/(public)/privacy-policy/page.tsx:43` | `privacy_body_ar`, `privacy_body_en` | `"SiteSettings"` | extra content card when both published, else that card is absent. Catalogue clauses always render. A legalFact pending slot at line 44 always renders and has no backing column |
| `/{locale}/lab-to-lab` | labToLab.body | `src/app/[locale]/(public)/lab-to-lab/page.tsx:32` | `lab_to_lab_ar`, `lab_to_lab_en` | `"SiteSettings"` | extra content card when both published, else that card is absent. Catalogue body always renders |
| `/{locale}/lab-to-lab` | labToLab.whatsapp | `src/app/[locale]/(public)/lab-to-lab/page.tsx:33` | `whatsapp_e164`, `whatsapp_message_ar`, `whatsapp_message_en` | `"SiteSettings"` | content when a href is produced, else §12 pending |
| `/{locale}/locations` | locations.map | `src/app/[locale]/(public)/locations/page.tsx:35` | `latitude`, `longitude` | `"Branch"` | §12 pending. `branchMapPins` reads both coordinates and always returns `[]` (`src/lib/publishedListings.ts:386`) |
| `/{locale}/locations` | locations.branches | `src/app/[locale]/(public)/locations/page.tsx:65` | `name_ar`, `name_en`, `is_head_office` | `"Branch"` | content when published rows exist, else §12 pending. `address_ar`, `address_en`, `hours_ar`, `hours_en`, `whatsapp_e164` are not in `BRANCH_SELECT` and are not rendered (`src/components/ui/BranchCard.tsx:10`) |
| `/{locale}/departments` | departments.labUnits | `src/app/[locale]/(public)/departments/page.tsx:29` | `name_ar`, `name_en`, `description_ar`, `description_en` | `"LabUnit"` | content when published rows exist, else §12 pending. `slug` is required by §4h.3 and is not selected or rendered |
| `/{locale}/programmes` | programmes.listing | `src/app/[locale]/(public)/programmes/page.tsx:29` | `name_ar`, `name_en`, `description_ar`, `description_en` | `"Programme"` | content when published rows exist, else §12 pending (clinical label). Cards are not links |
| `/{locale}/programmes/{slug}` | programmes.detail | `src/components/site/ProgrammeDetail.tsx:68` | `name_ar`, `name_en`, `description_ar`, `description_en`, `slug`; `tier_axis`, `audience_axis` | `"Programme"`, `"ProgrammeTier"` | content when a published row exists. `generateStaticParams` currently emits zero pages (every row is draft) |
| `/{locale}/programmes/{slug}` | programmes.labTests | `src/components/site/ProgrammeDetail.tsx:102` | `name_ar`, `name_en`; `note_ar`, `note_en` | `"LabTest"`, `"ProgrammeLabTest"` | §12 withheld. `isLabTestContentEnabled` is off (`src/lib/clinicalFlag.ts:9`); `LabTestRegion` returns null. Empty-slot pending at `:118` is unreachable while the flag is off |
| `/{locale}/offers` | offers.listing | `src/app/[locale]/(public)/offers/page.tsx:36` | `title_ar`, `title_en`, `description_ar`, `description_en`, `valid_from`, `valid_until`, `price_amount`, `price_currency`; `storage_path`, `alt_ar`, `alt_en` | `"Offer"`, `"MediaAsset"` | content when published rows exist, else §12 pending. §4h.3 grades zero published Offers as complete; the page still shows the empty pending shell |
| `/{locale}/videos` | videos.listing | `src/app/[locale]/(public)/videos/page.tsx:29` | `title_ar`, `title_en`, `description_ar`, `description_en`; `storage_path`, `alt_ar`, `alt_en` | `"Video"`, `"MediaAsset"` | content when published rows exist, else §12 pending. `youtube_id` is required by §4h.3 and is not selected (`src/lib/publishedListings.ts:6`) |
| `/{locale}/equipment` | equipment.listing | `src/app/[locale]/(public)/equipment/page.tsx:29` | `name_ar`, `name_en`, `description_ar`, `description_en`; `storage_path`, `alt_ar`, `alt_en` | `"Equipment"`, `"MediaAsset"` | content when published rows exist, else §12 pending. `"MediaAsset"` and `"Video"` links are optional under §4h.3 |
