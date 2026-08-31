-- M4b — the two SECURITY_MODEL.md §3 policy shapes, the first write grants, and
-- execute on the §7 function.
--
-- Published-read: anonymous SELECT restricted to rows whose publication_state
-- is published. for select only — never for all. On all eight tables.
--
-- Operator-write: full SELECT, INSERT, UPDATE, DELETE for authenticated, no
-- per-Operator partition. On all eight tables. for all is permitted here
-- because STEP 6d's HALT is on the anonymous policies; an authenticated FOR ALL
-- is exactly "full SELECT, INSERT, UPDATE, DELETE".
--
-- Grant insert, update, delete to authenticated. Grant nothing beyond select
-- to anon, in this migration or any other. SELECT was granted to both roles
-- at M3; it is not re-granted and it is not revoked.
--
-- The function is security definer so it reads past RLS by design; that is why
-- it filters published itself. Grant execute on it to anon and authenticated.
-- Postgres grants execute to PUBLIC on a new function, so PUBLIC is revoked
-- first: otherwise the named grant is a no-op and the actual permission is the
-- default, which is not a grant this file decided.
--
-- Reverse: supabase/migrations/m4b_policies_and_write_grants.down.sql, authored
-- in the same task under OD-10 control 1. Not applied.

create policy "LabUnit_published_read"
  on public."LabUnit"
  for select
  to anon
  using (publication_state = 'published');

create policy "LabUnit_operator_write"
  on public."LabUnit"
  for all
  to authenticated
  using (true)
  with check (true);

create policy "Branch_published_read"
  on public."Branch"
  for select
  to anon
  using (publication_state = 'published');

create policy "Branch_operator_write"
  on public."Branch"
  for all
  to authenticated
  using (true)
  with check (true);

create policy "SiteSettings_published_read"
  on public."SiteSettings"
  for select
  to anon
  using (publication_state = 'published');

create policy "SiteSettings_operator_write"
  on public."SiteSettings"
  for all
  to authenticated
  using (true)
  with check (true);

create policy "MediaAsset_published_read"
  on public."MediaAsset"
  for select
  to anon
  using (publication_state = 'published');

create policy "MediaAsset_operator_write"
  on public."MediaAsset"
  for all
  to authenticated
  using (true)
  with check (true);

create policy "LabTest_published_read"
  on public."LabTest"
  for select
  to anon
  using (publication_state = 'published');

create policy "LabTest_operator_write"
  on public."LabTest"
  for all
  to authenticated
  using (true)
  with check (true);

create policy "Programme_published_read"
  on public."Programme"
  for select
  to anon
  using (publication_state = 'published');

create policy "Programme_operator_write"
  on public."Programme"
  for all
  to authenticated
  using (true)
  with check (true);

create policy "ProgrammeTier_published_read"
  on public."ProgrammeTier"
  for select
  to anon
  using (publication_state = 'published');

create policy "ProgrammeTier_operator_write"
  on public."ProgrammeTier"
  for all
  to authenticated
  using (true)
  with check (true);

create policy "ProgrammeLabTest_published_read"
  on public."ProgrammeLabTest"
  for select
  to anon
  using (publication_state = 'published');

create policy "ProgrammeLabTest_operator_write"
  on public."ProgrammeLabTest"
  for all
  to authenticated
  using (true)
  with check (true);

grant insert, update, delete on table
  public."LabUnit",
  public."Branch",
  public."SiteSettings",
  public."MediaAsset",
  public."LabTest",
  public."Programme",
  public."ProgrammeTier",
  public."ProgrammeLabTest"
to authenticated;

revoke execute on function public."programmeLabTests"(
  uuid,
  public."ProgrammeTierAxis",
  public."AudienceAxis"
) from public;

grant execute on function public."programmeLabTests"(
  uuid,
  public."ProgrammeTierAxis",
  public."AudienceAxis"
) to anon, authenticated;
