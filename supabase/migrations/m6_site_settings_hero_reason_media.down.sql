-- M6 reverse — remove the hero, reason-card and media-role additions
-- from public."SiteSettings".
--
-- OD-10 control 1: every migration ships with a reverse authored in the same task
-- as its forward. This file is NOT applied. It exists so that the reverse is
-- written while the forward is fresh rather than reconstructed under pressure.
--
-- It carries no leading timestamp, so the Supabase CLI does not treat it as a
-- migration and db push does not pick it up — the CLI prints a Skipping
-- migration line for it on every invocation. Running it is a deliberate,
-- separate act by a human. That Skipping line is by design and is not a defect.
--
-- Reverse of 20260905020000_m6_site_settings_hero_reason_media.sql.
-- Order: the nine checks, then the three foreign keys, then the twenty-one
-- columns. cascade is deliberately absent on every statement, per M1's, M2's
-- and M5's precedent: a bare drop fails the moment any object outside this
-- file depends on the named constraint or column, and that refusal is the
-- control. cascade would convert a loud failure into the silent removal of
-- somebody else's object.
--
-- This file does not touch any other "SiteSettings" column, constraint,
-- index, policy, grant or row. It does not touch "MediaAsset".
--
-- Why each step is safe today, stated per OD-10 control 1:
--
--   The nine bilingual checks — they were added by M6 and name only the
--   new pairs plus publication_state. Nothing else depends on these
--   constraint names. Safe today because they constrain only columns this
--   reverse then removes. Expires when a later migration's check, view or
--   function assumes one of these names still exists.
--
--   The three foreign keys — they were added by M6 and point at
--   "MediaAsset" with on delete set null. Dropping them leaves
--   "MediaAsset" untouched and does not delete the settings row. Safe
--   today because no later object depends on these constraint names.
--   Expires when a later migration assumes referential integrity on
--   favicon_media, app_icon_media or hero_media.
--
--   The twenty-one columns — they were added by M6, nullable, with no
--   default. This reverse was authored in the same task as the forward,
--   and the forward is not applied, so they hold no Operator copy. M4 is
--   the only migration that loads rows (§10); M6 writes none. Safe today
--   because destroying them destroys only nulls that re-running the
--   forward restores exactly. Expires at the first write into any of
--   these columns, or when a later view, function or constraint reads
--   one of them.
--
-- So this file reverses M6 only while no later migration depends on these
-- twenty-one columns or these twelve constraint names. Nothing here
-- enforces that; a human reading this comment is the only control there
-- is. After an Operator has saved hero, reason-card or media-role copy,
-- running this file destroys that copy, and OD-10 control 4 puts
-- destructive change behind its own OD.

alter table public."SiteSettings"
  drop constraint "SiteSettings_hero_eyebrow_bilingual_when_published";

alter table public."SiteSettings"
  drop constraint "SiteSettings_hero_headline_bilingual_when_published";

alter table public."SiteSettings"
  drop constraint "SiteSettings_hero_standfirst_bilingual_when_published";

alter table public."SiteSettings"
  drop constraint "SiteSettings_reason1_title_bilingual_when_published";

alter table public."SiteSettings"
  drop constraint "SiteSettings_reason1_body_bilingual_when_published";

alter table public."SiteSettings"
  drop constraint "SiteSettings_reason2_title_bilingual_when_published";

alter table public."SiteSettings"
  drop constraint "SiteSettings_reason2_body_bilingual_when_published";

alter table public."SiteSettings"
  drop constraint "SiteSettings_reason3_title_bilingual_when_published";

alter table public."SiteSettings"
  drop constraint "SiteSettings_reason3_body_bilingual_when_published";

alter table public."SiteSettings"
  drop constraint "SiteSettings_favicon_media_fkey";

alter table public."SiteSettings"
  drop constraint "SiteSettings_app_icon_media_fkey";

alter table public."SiteSettings"
  drop constraint "SiteSettings_hero_media_fkey";

alter table public."SiteSettings"
  drop column hero_eyebrow_ar;

alter table public."SiteSettings"
  drop column hero_eyebrow_en;

alter table public."SiteSettings"
  drop column hero_headline_ar;

alter table public."SiteSettings"
  drop column hero_headline_en;

alter table public."SiteSettings"
  drop column hero_standfirst_ar;

alter table public."SiteSettings"
  drop column hero_standfirst_en;

alter table public."SiteSettings"
  drop column reason1_title_ar;

alter table public."SiteSettings"
  drop column reason1_title_en;

alter table public."SiteSettings"
  drop column reason1_body_ar;

alter table public."SiteSettings"
  drop column reason1_body_en;

alter table public."SiteSettings"
  drop column reason2_title_ar;

alter table public."SiteSettings"
  drop column reason2_title_en;

alter table public."SiteSettings"
  drop column reason2_body_ar;

alter table public."SiteSettings"
  drop column reason2_body_en;

alter table public."SiteSettings"
  drop column reason3_title_ar;

alter table public."SiteSettings"
  drop column reason3_title_en;

alter table public."SiteSettings"
  drop column reason3_body_ar;

alter table public."SiteSettings"
  drop column reason3_body_en;

alter table public."SiteSettings"
  drop column favicon_media;

alter table public."SiteSettings"
  drop column app_icon_media;

alter table public."SiteSettings"
  drop column hero_media;
