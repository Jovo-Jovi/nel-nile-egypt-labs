-- M7B-2 — tighten the twelve operator-write policies to the Operator claim.
--
-- Today every one of these twelve policies is `for all to authenticated`
-- with `using (true) with check (true)` on the eleven application tables,
-- and `using (bucket_id = 'media-asset')` on storage.objects. The Postgres
-- role `authenticated` is therefore sufficient by itself: any session that
-- holds an access token writes the whole site. That is the hole the M7A
-- role-split audit was written to close.
--
-- This migration makes the Operator claim necessary as well. USING and
-- WITH CHECK on each of the twelve become the audit STEP 2 predicate:
--
--   (auth.jwt() -> 'app_metadata' ->> 'nel_principal') = 'Operator'
--
-- `app_metadata` is chosen over a custom access token hook (audit STEP 2,
-- mechanism A over mechanism B) because GoTrue copies
-- `auth.users.raw_app_meta_data` into every access token it issues,
-- including on refresh, and the client cannot write that object. The claim
-- does not live at JWT `role`: overwriting `role` would make PostgREST look
-- for a Postgres role that does not exist.
--
-- `auth.jwt()` reads the presented token, not a live lookup of
-- `auth.users`. Applying this file before the claim is on the token is a
-- lockout. Audit STEP 3 therefore ordered the stamp first: M7B-1 stamped
-- `app_metadata.nel_principal = 'Operator'` on both lasting Operator
-- accounts and proved it on refreshed tokens. This file is Operation 2 and
-- runs only after that.
--
-- On storage.objects the existing bucket predicate is kept and the claim is
-- ANDed onto it. Dropping `bucket_id = 'media-asset'` would widen the
-- policy to every bucket, so the two conditions travel together.
--
-- `alter policy` cannot change a policy's command or its role, and this
-- file changes neither: all twelve stay `for all to authenticated`. The
-- twelve `*_published_read` policies are not named here at all — anonymous
-- published reads are unchanged, so Visitors are unaffected.
--
-- No GRANT is changed. `authenticated` keeps the table-level INSERT, UPDATE
-- and DELETE that M4b and M5 granted; RLS is the control, not the grant
-- (audit STEP 1). No table is created or dropped, no column is added, no
-- role is created. CF-106's platform grant on storage.objects is untouched.
--
-- Consequence recorded by audit STEP 1: `*_published_read` is `to anon`
-- only, so after this file an authenticated session without the claim
-- matches no policy on these tables — its writes fail and its SELECT of
-- published rows fails too. That is correct for a principal who must not
-- use the dashboard. A `PartnerLab` that needs published catalogue reads is
-- a third policy shape and is not this migration.
--
-- Reverse: supabase/migrations/m7b2_operator_claim_write_policies.down.sql,
-- authored in the same task under OD-10 control 1. Not applied.

alter policy "LabUnit_operator_write"
  on public."LabUnit"
  using ((auth.jwt() -> 'app_metadata' ->> 'nel_principal') = 'Operator')
  with check ((auth.jwt() -> 'app_metadata' ->> 'nel_principal') = 'Operator');

alter policy "Branch_operator_write"
  on public."Branch"
  using ((auth.jwt() -> 'app_metadata' ->> 'nel_principal') = 'Operator')
  with check ((auth.jwt() -> 'app_metadata' ->> 'nel_principal') = 'Operator');

alter policy "SiteSettings_operator_write"
  on public."SiteSettings"
  using ((auth.jwt() -> 'app_metadata' ->> 'nel_principal') = 'Operator')
  with check ((auth.jwt() -> 'app_metadata' ->> 'nel_principal') = 'Operator');

alter policy "MediaAsset_operator_write"
  on public."MediaAsset"
  using ((auth.jwt() -> 'app_metadata' ->> 'nel_principal') = 'Operator')
  with check ((auth.jwt() -> 'app_metadata' ->> 'nel_principal') = 'Operator');

alter policy "LabTest_operator_write"
  on public."LabTest"
  using ((auth.jwt() -> 'app_metadata' ->> 'nel_principal') = 'Operator')
  with check ((auth.jwt() -> 'app_metadata' ->> 'nel_principal') = 'Operator');

alter policy "Programme_operator_write"
  on public."Programme"
  using ((auth.jwt() -> 'app_metadata' ->> 'nel_principal') = 'Operator')
  with check ((auth.jwt() -> 'app_metadata' ->> 'nel_principal') = 'Operator');

alter policy "ProgrammeTier_operator_write"
  on public."ProgrammeTier"
  using ((auth.jwt() -> 'app_metadata' ->> 'nel_principal') = 'Operator')
  with check ((auth.jwt() -> 'app_metadata' ->> 'nel_principal') = 'Operator');

alter policy "ProgrammeLabTest_operator_write"
  on public."ProgrammeLabTest"
  using ((auth.jwt() -> 'app_metadata' ->> 'nel_principal') = 'Operator')
  with check ((auth.jwt() -> 'app_metadata' ->> 'nel_principal') = 'Operator');

alter policy "Offer_operator_write"
  on public."Offer"
  using ((auth.jwt() -> 'app_metadata' ->> 'nel_principal') = 'Operator')
  with check ((auth.jwt() -> 'app_metadata' ->> 'nel_principal') = 'Operator');

alter policy "Video_operator_write"
  on public."Video"
  using ((auth.jwt() -> 'app_metadata' ->> 'nel_principal') = 'Operator')
  with check ((auth.jwt() -> 'app_metadata' ->> 'nel_principal') = 'Operator');

alter policy "Equipment_operator_write"
  on public."Equipment"
  using ((auth.jwt() -> 'app_metadata' ->> 'nel_principal') = 'Operator')
  with check ((auth.jwt() -> 'app_metadata' ->> 'nel_principal') = 'Operator');

-- The bucket predicate stays. The claim is ANDed onto it, never in place
-- of it.
alter policy "MediaAsset_objects_operator_write"
  on storage.objects
  using (
    bucket_id = 'media-asset'
    and (auth.jwt() -> 'app_metadata' ->> 'nel_principal') = 'Operator'
  )
  with check (
    bucket_id = 'media-asset'
    and (auth.jwt() -> 'app_metadata' ->> 'nel_principal') = 'Operator'
  );
