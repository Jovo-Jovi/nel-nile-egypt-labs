-- Reverse — remove the photography-slot additions from public."LabUnit"
-- and public."SiteSettings".
--
-- OD-10 control 1: every migration ships with a reverse authored in the same
-- task as its forward. This file is NOT applied. It exists so that the reverse
-- is written while the forward is fresh rather than reconstructed under pressure.
--
-- It carries no leading timestamp, so the Supabase CLI does not treat it as a
-- migration and db push does not pick it up — the CLI prints a Skipping
-- migration line for it on every invocation. Running it is a deliberate,
-- separate act by a human. That Skipping line is by design and is not a defect.
--
-- Reverse of 20260913140000_photography_slot_media.sql.
-- Order: the four foreign keys, then the four columns. cascade is deliberately
-- absent on every statement, per M1's, M2's, M5's and M6's precedent: a bare
-- drop fails the moment any object outside this file depends on the named
-- constraint or column, and that refusal is the control. cascade would convert
-- a loud failure into the silent removal of somebody else's object.
--
-- This file does not touch any other "LabUnit" or "SiteSettings" column,
-- constraint, index, policy, grant or row. It does not touch "MediaAsset".
--
-- Why each step is safe today, stated per OD-10 control 1:
--
--   The four foreign keys — they were added by this forward and point at
--   "MediaAsset" with on delete set null. Dropping them leaves
--   "MediaAsset" untouched and does not delete the holder row. Safe
--   today because no later object depends on these constraint names.
--   Expires when a later migration assumes referential integrity on
--   photography_media, story_main_media, story_float_media or
--   story_float_alt_media.
--
--   The four columns — they were added by this forward, nullable, with no
--   default. This reverse was authored in the same task as the forward,
--   and the forward is not applied, so they hold no Operator assignment.
--   Safe today because destroying them destroys only nulls that re-running
--   the forward restores exactly. Expires at the first write into any of
--   these columns, or when a later view, function or constraint reads
--   one of them.
--
-- So this file reverses this forward only while no later migration depends
-- on these four columns or these four constraint names. Nothing here
-- enforces that; a human reading this comment is the only control there
-- is. After an Operator has saved a photography-slot assignment, running
-- this file destroys that assignment, and OD-10 control 4 puts
-- destructive change behind its own OD.

alter table public."LabUnit"
  drop constraint "LabUnit_photography_media_fkey";

alter table public."SiteSettings"
  drop constraint "SiteSettings_story_main_media_fkey";

alter table public."SiteSettings"
  drop constraint "SiteSettings_story_float_media_fkey";

alter table public."SiteSettings"
  drop constraint "SiteSettings_story_float_alt_media_fkey";

alter table public."LabUnit"
  drop column photography_media;

alter table public."SiteSettings"
  drop column story_main_media;

alter table public."SiteSettings"
  drop column story_float_media;

alter table public."SiteSettings"
  drop column story_float_alt_media;
