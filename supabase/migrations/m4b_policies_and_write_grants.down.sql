-- M4b reverse — drop the sixteen policies, take the write verbs back off
-- authenticated, and restore the function's default execute grant.
--
-- OD-10 control 1: every migration ships with a reverse authored in the same task
-- as its forward. This file is NOT applied. It exists so that the reverse is
-- written while the forward is fresh rather than reconstructed under pressure.
--
-- It carries no leading timestamp, so the Supabase CLI does not treat it as a
-- migration and db push does not pick it up — the CLI prints a Skipping
-- migration line for it on every invocation. Running it is a deliberate,
-- separate act by a human.
--
-- Reverse of 20260831111522_m4b_policies_and_write_grants.sql. cascade is
-- deliberately absent, per M1's precedent.
--
-- Drop order is the reverse of creation order. Dropping a policy does not
-- disable RLS; the eight tables return to "RLS on, no policy, deny every
-- request", which is the M3 state this migration advanced from.
--
-- SELECT on the eight tables is left in place: M3 granted it, M4b did not
-- touch it, and a reverse of M4b must not revoke a privilege M4b did not
-- grant. insert, update and delete on authenticated are revoked because M4b
-- granted them.
--
-- Execute on the function is revoked from anon and authenticated and granted
-- back to PUBLIC, which is the Postgres default M4a left and M4b replaced.
-- The function itself is M4a's object and is not dropped here.

drop policy "ProgrammeLabTest_operator_write" on public."ProgrammeLabTest";
drop policy "ProgrammeLabTest_published_read" on public."ProgrammeLabTest";

drop policy "ProgrammeTier_operator_write" on public."ProgrammeTier";
drop policy "ProgrammeTier_published_read" on public."ProgrammeTier";

drop policy "Programme_operator_write" on public."Programme";
drop policy "Programme_published_read" on public."Programme";

drop policy "LabTest_operator_write" on public."LabTest";
drop policy "LabTest_published_read" on public."LabTest";

drop policy "MediaAsset_operator_write" on public."MediaAsset";
drop policy "MediaAsset_published_read" on public."MediaAsset";

drop policy "SiteSettings_operator_write" on public."SiteSettings";
drop policy "SiteSettings_published_read" on public."SiteSettings";

drop policy "Branch_operator_write" on public."Branch";
drop policy "Branch_published_read" on public."Branch";

drop policy "LabUnit_operator_write" on public."LabUnit";
drop policy "LabUnit_published_read" on public."LabUnit";

revoke insert, update, delete on table
  public."LabUnit",
  public."Branch",
  public."SiteSettings",
  public."MediaAsset",
  public."LabTest",
  public."Programme",
  public."ProgrammeTier",
  public."ProgrammeLabTest"
from authenticated;

revoke execute on function public."programmeLabTests"(
  uuid,
  public."ProgrammeTierAxis",
  public."AudienceAxis"
) from anon, authenticated;

grant execute on function public."programmeLabTests"(
  uuid,
  public."ProgrammeTierAxis",
  public."AudienceAxis"
) to public;
