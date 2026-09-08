-- M9 — partner-read on public."Offer".
--
-- OD-15 §8 / SECURITY_MODEL.md §3 third policy shape. ADR-001: the
-- partner-read policy tests exactly
--
--   (auth.jwt() -> 'app_metadata' ->> 'nel_principal') = 'PartnerLab'
--
-- matching the shape of the twelve Operator-write policies. SELECT only,
-- to authenticated, on "Offer" only. No write. No other table. No column
-- is added. D-40 and BOUNDARY_MODEL.md §2 evidence item 10 stand.
--
-- `nel_partner_state` is never a policy input (ADR-001). Pending and
-- rejected accounts have no PartnerLab principal and match nothing here.
--
-- The twelve published-read policies, including Offer_published_read to
-- anon, are not named here. Applying this file does not make Offers
-- anonymous; the application gate is what withholds titles from a
-- Visitor. A later task that drops Offer_published_read is a separate
-- decision.
--
-- No GRANT is changed. authenticated already holds SELECT on "Offer"
-- from M5; RLS is the control.
--
-- Authored and rehearsed at P08-T10 under OD-10 control 7 and OD-17 §3.3.
-- Not applied in that task. Reverse: supabase/migrations/m9_offer_partner_read.down.sql.

create policy "Offer_partner_read"
  on public."Offer"
  for select
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'nel_principal') = 'PartnerLab');
