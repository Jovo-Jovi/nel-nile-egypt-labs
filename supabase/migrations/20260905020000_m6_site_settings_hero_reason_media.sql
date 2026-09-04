-- M6 — hero, reason-card and media-role columns on public."SiteSettings".
--
-- Authored against CONTENT_MODEL.md §3a as amended at M6A, then
-- DATA_MODEL.md §6 row 10 made to match. §3a outranks §6 (CF-86).
--
-- Additive only (OD-10 control 4). Every statement is add column or
-- add constraint. Every new column is nullable with no default: the
-- live singleton exists, and a required column would fail on it.
-- No row is touched.
--
-- The headline is one field per locale, not two lines. Where a line
-- breaks is typographic; the design wraps it.
--
-- Nine bilingual-pair checks, same form as M2's whatsapp_message pair:
-- a published row with only one half of a pair is refused here, not
-- only in the form. DATA_MODEL.md §8: a published row is bilingually
-- complete. If the live singleton is already published, these checks
-- will refuse M6B's apply until that row is draft or every new pair
-- is filled — that is the rule, not a gap to paper over.
--
-- Three nullable keys to public."MediaAsset", on delete set
-- null: removing an asset must not remove the settings row. Constraint
-- names follow D-41: quoted PascalCase table, then the role column,
-- then _fkey. Roles live on "SiteSettings"; "MediaAsset" stays a
-- plain library and gains no role column.
--
-- This file is authored here and is not applied here. Apply is M6B.
--
-- Reverse: supabase/migrations/m6_site_settings_hero_reason_media.down.sql,
-- authored in the same task under OD-10 control 1. Not applied.

-- Hero, six columns.
alter table public."SiteSettings"
  add column hero_eyebrow_ar text;

alter table public."SiteSettings"
  add column hero_eyebrow_en text;

alter table public."SiteSettings"
  add column hero_headline_ar text;

alter table public."SiteSettings"
  add column hero_headline_en text;

alter table public."SiteSettings"
  add column hero_standfirst_ar text;

alter table public."SiteSettings"
  add column hero_standfirst_en text;

-- Reason cards, twelve columns, n in 1..3.
alter table public."SiteSettings"
  add column reason1_title_ar text;

alter table public."SiteSettings"
  add column reason1_title_en text;

alter table public."SiteSettings"
  add column reason1_body_ar text;

alter table public."SiteSettings"
  add column reason1_body_en text;

alter table public."SiteSettings"
  add column reason2_title_ar text;

alter table public."SiteSettings"
  add column reason2_title_en text;

alter table public."SiteSettings"
  add column reason2_body_ar text;

alter table public."SiteSettings"
  add column reason2_body_en text;

alter table public."SiteSettings"
  add column reason3_title_ar text;

alter table public."SiteSettings"
  add column reason3_title_en text;

alter table public."SiteSettings"
  add column reason3_body_ar text;

alter table public."SiteSettings"
  add column reason3_body_en text;

-- Media roles, three nullable keys.
alter table public."SiteSettings"
  add column favicon_media uuid;

alter table public."SiteSettings"
  add column app_icon_media uuid;

alter table public."SiteSettings"
  add column hero_media uuid;

alter table public."SiteSettings"
  add constraint "SiteSettings_favicon_media_fkey"
  foreign key (favicon_media)
  references public."MediaAsset" (id)
  on delete set null;

alter table public."SiteSettings"
  add constraint "SiteSettings_app_icon_media_fkey"
  foreign key (app_icon_media)
  references public."MediaAsset" (id)
  on delete set null;

alter table public."SiteSettings"
  add constraint "SiteSettings_hero_media_fkey"
  foreign key (hero_media)
  references public."MediaAsset" (id)
  on delete set null;

-- One check per new bilingual pair. Same form as M2's
-- whatsapp_message pair.
alter table public."SiteSettings"
  add constraint "SiteSettings_hero_eyebrow_bilingual_when_published"
  check (
    publication_state <> 'published'
    or (hero_eyebrow_ar is not null and hero_eyebrow_en is not null)
  );

alter table public."SiteSettings"
  add constraint "SiteSettings_hero_headline_bilingual_when_published"
  check (
    publication_state <> 'published'
    or (hero_headline_ar is not null and hero_headline_en is not null)
  );

alter table public."SiteSettings"
  add constraint "SiteSettings_hero_standfirst_bilingual_when_published"
  check (
    publication_state <> 'published'
    or (hero_standfirst_ar is not null and hero_standfirst_en is not null)
  );

alter table public."SiteSettings"
  add constraint "SiteSettings_reason1_title_bilingual_when_published"
  check (
    publication_state <> 'published'
    or (reason1_title_ar is not null and reason1_title_en is not null)
  );

alter table public."SiteSettings"
  add constraint "SiteSettings_reason1_body_bilingual_when_published"
  check (
    publication_state <> 'published'
    or (reason1_body_ar is not null and reason1_body_en is not null)
  );

alter table public."SiteSettings"
  add constraint "SiteSettings_reason2_title_bilingual_when_published"
  check (
    publication_state <> 'published'
    or (reason2_title_ar is not null and reason2_title_en is not null)
  );

alter table public."SiteSettings"
  add constraint "SiteSettings_reason2_body_bilingual_when_published"
  check (
    publication_state <> 'published'
    or (reason2_body_ar is not null and reason2_body_en is not null)
  );

alter table public."SiteSettings"
  add constraint "SiteSettings_reason3_title_bilingual_when_published"
  check (
    publication_state <> 'published'
    or (reason3_title_ar is not null and reason3_title_en is not null)
  );

alter table public."SiteSettings"
  add constraint "SiteSettings_reason3_body_bilingual_when_published"
  check (
    publication_state <> 'published'
    or (reason3_body_ar is not null and reason3_body_en is not null)
  );
