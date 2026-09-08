-- M9 reverse — drop the partner-read policy on public."Offer".
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
-- Reverse of 20260908143000_m9_offer_partner_read.sql.
-- cascade is deliberately absent, per M1's precedent.
--
-- Offer_published_read and Offer_operator_write are not named here, as they
-- were not named in the forward. No GRANT is changed.

drop policy "Offer_partner_read" on public."Offer";
