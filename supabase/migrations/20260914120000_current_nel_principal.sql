-- Live principal for Offer_partner_read (OD-28).
--
-- P08-T26 rehearsed this shape inside BEGIN; … ROLLBACK; and measured:
--   the authenticated role can execute a security definer that reads
--   auth.users for auth.uid(); auth.uid() resolves in the policy's
--   execution context; Filter actual time 0.173 ms for one row;
--   BOUNDARY_MODEL.md §4 no FAIL, §2 item 10 PASS.
--
-- No new table. No new column. No new claim. OD-20 §3 stands.
-- BOUNDARY_MODEL.md §2 item 10 and D-40 are untouched.
--
-- Ordering is not optional. The function and its grants land first;
-- the Offer_partner_read swap lands second. Swapping the policy before
-- the function exists denies every approved PartnerLab.
--
-- CREATE FUNCTION grants EXECUTE to PUBLIC by default. P08-T26 measured
-- that schema default privileges still name anon and service_role after
-- revoke all from public. This file revokes both by name and grants
-- EXECUTE to authenticated alone. For anon, auth.uid() is null and the
-- function returns null; that is fail-closed, not access.
--
-- A definer function reads past RLS, so it returns only the calling
-- identity's principal string and nothing else from auth.users.
--
-- Authored and rehearsed at P08-T27 under OD-10 control 7 and OD-17 §3.3.
-- Not applied in this task. Reverse:
-- supabase/migrations/current_nel_principal.down.sql.

create function public."currentNelPrincipal"()
returns text
language sql
stable
security definer
set search_path = public, pg_temp
as $sel$
  select raw_app_meta_data ->> 'nel_principal'
  from auth.users
  where id = auth.uid();
$sel$;

revoke all on function public."currentNelPrincipal"() from public;
revoke all on function public."currentNelPrincipal"() from anon;
revoke all on function public."currentNelPrincipal"() from service_role;
grant execute on function public."currentNelPrincipal"() to authenticated;

drop policy "Offer_partner_read" on public."Offer";

create policy "Offer_partner_read"
  on public."Offer"
  for select
  to authenticated
  using (public."currentNelPrincipal"() = 'PartnerLab');
