-- Photography slots — nullable keys to public."MediaAsset" on
-- public."LabUnit" (one per department tile) and public."SiteSettings"
-- (three story frames: main, float, float-alt).
--
-- Authored against OD-26: photography binding is decided in principle
-- and delivered here. The news feature photo is T14 and is not a
-- column in this file.
--
-- Additive only (OD-10 control 4). Every statement is add column or
-- add constraint. Every new column is nullable with no default: live
-- "LabUnit" rows and the "SiteSettings" singleton exist, and a required
-- column would fail on them. No row is touched.
--
-- Four nullable keys to public."MediaAsset", on delete set null:
-- removing an asset must not remove the LabUnit or settings row.
-- Constraint names follow D-41 / M6: quoted PascalCase table, then the
-- role column, then _fkey. Roles live on the holder; "MediaAsset" stays
-- a plain library and gains no role column.
--
-- No column identifies an account holder. No personal or medical data
-- enters either table.
--
-- This file is authored here and is not applied here. Apply is the
-- human running npx supabase db push (OD-17 §3.3).
--
-- Reverse: supabase/migrations/photography_slot_media.down.sql,
-- authored in the same task under OD-10 control 1. Not applied.

alter table public."LabUnit"
  add column photography_media uuid;

alter table public."SiteSettings"
  add column story_main_media uuid;

alter table public."SiteSettings"
  add column story_float_media uuid;

alter table public."SiteSettings"
  add column story_float_alt_media uuid;

alter table public."LabUnit"
  add constraint "LabUnit_photography_media_fkey"
  foreign key (photography_media)
  references public."MediaAsset" (id)
  on delete set null;

alter table public."SiteSettings"
  add constraint "SiteSettings_story_main_media_fkey"
  foreign key (story_main_media)
  references public."MediaAsset" (id)
  on delete set null;

alter table public."SiteSettings"
  add constraint "SiteSettings_story_float_media_fkey"
  foreign key (story_float_media)
  references public."MediaAsset" (id)
  on delete set null;

alter table public."SiteSettings"
  add constraint "SiteSettings_story_float_alt_media_fkey"
  foreign key (story_float_alt_media)
  references public."MediaAsset" (id)
  on delete set null;
