-- P05-T10 — private Storage bucket for `"MediaAsset"` objects.
--
-- The `"MediaAsset"` table already exists (M2). This file does not create
-- a table, change a column or load a row. It inserts one private bucket and
-- writes row-level security on storage.objects in the same statement block,
-- both SECURITY_MODEL.md §3 policy shapes, scoped to this bucket only.
--
-- Bucket id: media-asset
-- Private: public = false. BOUNDARY_MODEL.md §4 item 3: no storage bucket
-- is writable by an unauthenticated actor. Anon receives SELECT and
-- nothing else.
--
-- Images only, enforced here, not in the form. A form check is advice; a
-- policy is a control; this is the upload path a patient result could
-- travel. A PDF upload is refused by the database even when the form is
-- bypassed entirely.
--
-- MIME allowlist (allowed_mime_types):
--   image/jpeg
--   image/png
--   image/webp
-- Size limit (file_size_limit): 5242880 bytes (5 MiB).
-- application/pdf is not in the allowlist. image/svg+xml is not in the
-- allowlist (it can carry a script). image/gif is not in the allowlist.
--
-- Additive only (OD-10 control 4). This file does not rewrite, narrow or
-- otherwise change any table that already exists. It adds a bucket row and
-- two policies.
--
-- Published-read (anon, SELECT only): an object in this bucket is
-- readable by anon only when a published `"MediaAsset"` row names it in
-- storage_path. Unpublished bytes do not leave the database.
-- Operator-write (authenticated, ALL): SELECT, INSERT, UPDATE and DELETE
-- within this bucket. SELECT is required for Storage's insert-returning
-- check on upload; UPDATE is required for replace (upsert). There is no
-- per-Operator partition. Anon is not granted INSERT, UPDATE or DELETE.
--
-- This file is authored here and is not applied here. Apply is P05-T10B.
--
-- Reverse: supabase/migrations/media_asset_bucket.down.sql, authored in
-- the same task under OD-10 control 1. Not applied.

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'media-asset',
  'media-asset',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']::text[]
);

-- `alter table storage.objects enable row level security` is absent.
-- On a hosted project storage.objects is owned by supabase_storage_admin
-- and db push connects as postgres, so that statement aborts with
-- `must be owner of table objects`. RLS on storage.objects is already
-- enabled by the platform. That enable is the platform's, not this
-- migration's.

create policy "MediaAsset_objects_published_read"
  on storage.objects
  for select
  to anon
  using (
    bucket_id = 'media-asset'
    and exists (
      select 1
      from public."MediaAsset" media_row
      where media_row.storage_path = name
        and media_row.publication_state = 'published'
    )
  );

create policy "MediaAsset_objects_operator_write"
  on storage.objects
  for all
  to authenticated
  using (bucket_id = 'media-asset')
  with check (bucket_id = 'media-asset');
