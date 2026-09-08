-- M10 reverse — restore Offer_published_read on public."Offer".
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
-- Reverse of 20260908160000_m10_drop_offer_published_read.sql.
-- cascade is deliberately absent, per M1's precedent.
--
-- Recreates M5's policy exactly as
-- supabase/migrations/20260901084408_m5_offer_equipment_video.sql:185
-- wrote it. Read from that file; not reconstructed from memory.
-- No GRANT is changed. No other policy is named.

create policy "Offer_published_read"
  on public."Offer"
  for select
  to anon
  using (publication_state = 'published');
