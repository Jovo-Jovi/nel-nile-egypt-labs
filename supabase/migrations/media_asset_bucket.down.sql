-- P05-T10 reverse — remove the private media-asset bucket and its
-- storage.objects policies.
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
-- Reverse of 20260903150000_media_asset_bucket.sql. Policy drops come first so
-- the bucket row is not left with policies that name it after it is gone.
-- cascade is deliberately absent: a bare drop policy fails if the policy was
-- renamed out from under this file, and that refusal is the control.
--
-- This file does not disable row-level security on storage.objects. Other
-- buckets share that table; turning RLS off would be a security defect, not
-- a reverse of this migration.
--
-- Why each step is safe today, per OD-10 control 1:
--
--   The two policies name only bucket_id = 'media-asset'. Nothing else
--   depends on them.
--
--   The bucket holds no objects: this reverse was authored in the same task
--   as the forward, and the forward is not applied. A later apply that
--   stores objects makes a bare delete from storage.buckets fail if the
--   provider requires the bucket to be empty. The failure is the intended
--   behaviour and this file must not be edited to add cascade to get past it.
--
-- So this file reverses P05-T10 only while that migration is the newest
-- applied storage change. Nothing here enforces that ordering; a human
-- reading this comment is the only control there is.

drop policy "MediaAsset_objects_operator_write" on storage.objects;

drop policy "MediaAsset_objects_published_read" on storage.objects;

delete from storage.buckets
where id = 'media-asset';
