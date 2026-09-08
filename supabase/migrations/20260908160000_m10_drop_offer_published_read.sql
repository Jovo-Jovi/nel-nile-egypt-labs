-- M10 — drop Offer_published_read on public."Offer".
--
-- Offers are no longer anonymous. M9 added Offer_partner_read for an
-- authenticated PartnerLab. This file removes the remaining anonymous
-- SELECT so a Visitor holding the publishable key cannot read a
-- published Offer through PostgREST. The application gate already
-- withholds titles; this is the database half of the same decision.
--
-- One statement. No GRANT is changed. No other policy is named. No
-- column is added. Offer_partner_read and Offer_operator_write are not
-- touched. The eleven remaining *_published_read policies stay to anon
-- because those tables remain genuinely public.
--
-- Authored and rehearsed at P08-T11 under OD-10 control 7 and OD-17 §3.3.
-- Not applied in this task. Reverse: supabase/migrations/m10_drop_offer_published_read.down.sql.

drop policy "Offer_published_read" on public."Offer";
