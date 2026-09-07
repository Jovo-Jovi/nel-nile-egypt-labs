-- M7B-2 reverse — put the twelve operator-write policies back to accepting
-- the Postgres role `authenticated` on its own.
--
-- OD-10 control 1: every migration ships with a reverse authored in the
-- same task as its forward. This file is NOT applied. It exists so that the
-- reverse is written while the forward is fresh rather than reconstructed
-- under pressure.
--
-- It carries no leading timestamp, so the Supabase CLI does not treat it as
-- a migration and db push does not pick it up — the CLI prints a Skipping
-- migration line for it on every invocation. Running it is a deliberate,
-- separate act by a human.
--
-- Reverse of 20260907000019_m7b2_operator_claim_write_policies.sql.
-- cascade is deliberately absent, per M1's precedent.
--
-- This restores `using (true) with check (true)` on the eleven application
-- tables and the bucket-only predicate on storage.objects, which is the
-- M4b / M5 / media_asset_bucket state the forward advanced from. It does
-- not drop a policy, so RLS stays on and all 24 policies stay in place.
--
-- Running this widens write access back to any authenticated session. It is
-- the lockout escape hatch, not a routine operation: if a lasting Operator
-- is refused by the tightened policies, this file returns the database to
-- the pre-M7B-2 posture while the claim is investigated.
--
-- The Operator stamp that M7B-1 landed on `auth.users.raw_app_meta_data` is
-- not removed here. It is inert under these predicates and harmless, and
-- M7B-1 is a separate task with its own reverse consideration.
--
-- No GRANT is changed. The twelve `*_published_read` policies are not named
-- here, as they were not named in the forward.

alter policy "MediaAsset_objects_operator_write"
  on storage.objects
  using (bucket_id = 'media-asset')
  with check (bucket_id = 'media-asset');

alter policy "Equipment_operator_write"
  on public."Equipment"
  using (true)
  with check (true);

alter policy "Video_operator_write"
  on public."Video"
  using (true)
  with check (true);

alter policy "Offer_operator_write"
  on public."Offer"
  using (true)
  with check (true);

alter policy "ProgrammeLabTest_operator_write"
  on public."ProgrammeLabTest"
  using (true)
  with check (true);

alter policy "ProgrammeTier_operator_write"
  on public."ProgrammeTier"
  using (true)
  with check (true);

alter policy "Programme_operator_write"
  on public."Programme"
  using (true)
  with check (true);

alter policy "LabTest_operator_write"
  on public."LabTest"
  using (true)
  with check (true);

alter policy "MediaAsset_operator_write"
  on public."MediaAsset"
  using (true)
  with check (true);

alter policy "SiteSettings_operator_write"
  on public."SiteSettings"
  using (true)
  with check (true);

alter policy "Branch_operator_write"
  on public."Branch"
  using (true)
  with check (true);

alter policy "LabUnit_operator_write"
  on public."LabUnit"
  using (true)
  with check (true);
