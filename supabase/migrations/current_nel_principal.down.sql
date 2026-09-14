-- Reverse — restore M9 Offer_partner_read and drop currentNelPrincipal.
--
-- OD-10 control 1: every migration ships with a reverse authored in the
-- same task as its forward. This file is NOT applied. It exists so that
-- the reverse is written while the forward is fresh rather than
-- reconstructed under pressure.
--
-- It carries no leading timestamp, so the Supabase CLI does not treat it
-- as a migration and db push does not pick it up — the CLI prints a
-- Skipping migration line for it on every invocation. Running it is a
-- deliberate, separate act by a human.
--
-- Reverse of 20260914120000_current_nel_principal.sql.
-- cascade is deliberately absent, per M1's precedent: a bare drop fails
-- the moment any object outside this file depends on the function, and
-- that refusal is the control.
--
-- Drop order: restore the M9 policy first so the policy no longer
-- depends on the function, then drop the function. Dropping the
-- function while the swapped policy still names it would fail, and
-- that refusal is the control.
--
-- Why this drop is safe today: the forward is not applied, so neither
-- object exists on the linked remote. After the forward is applied,
-- restoring M9 returns authorization to the JWT claim (the P08-T24
-- defect) and dropping the function removes the live-principal read.
-- That is why this file is not applied by the CLI.

drop policy "Offer_partner_read" on public."Offer";

create policy "Offer_partner_read"
  on public."Offer"
  for select
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'nel_principal') = 'PartnerLab');

drop function public."currentNelPrincipal"();
