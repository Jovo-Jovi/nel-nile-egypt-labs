-- M5 reverse — drop the three tables "Equipment", "Video", "Offer".
--
-- OD-10 control 1: every migration ships with a reverse authored in the same task
-- as its forward. This file is NOT applied. It exists so that the reverse is
-- written while the forward is fresh rather than reconstructed under pressure.
--
-- It carries no leading timestamp, so the Supabase CLI does not treat it as a
-- migration and db push does not pick it up — the CLI prints a Skipping
-- migration line for it on every invocation. Running it is a deliberate,
-- separate act by a human. That Skipping line is by design and is not a defect.
--
-- Reverse of 20260901084408_m5_offer_equipment_video.sql. Drop order is the
-- reverse of creation order. cascade is deliberately absent on every statement,
-- per M1's, M2's and M3's precedent: a bare drop table fails the moment any
-- object outside this file depends on the table, and that refusal is the
-- control. cascade would convert a loud failure into the silent removal of
-- somebody else's object.
--
-- Dropping a table takes its own indexes, constraints, RLS state, policies and
-- privilege grants with it, so no separate drop index, drop policy or revoke is
-- written for any of the three. The three "PublicationState" column
-- dependencies point at M1's type, which this file does not touch. The outbound
-- keys to "MediaAsset", "Programme" and "Video" are removed with their tables
-- and leave those referenced tables untouched.
--
-- Why each drop is safe today, stated per table per OD-10 control 1:
--
--   "Equipment" — nothing references it. §6 gives it no inbound foreign key
--   from any table. It holds no rows: M5 loads nothing.
--
--   "Video" — one inbound foreign key, from "Equipment", dropped above. §6
--   gives it no other. It holds no rows.
--
--   "Offer" — nothing references it. §6 gives it inbound from no table. Its
--   own outbound keys to "MediaAsset" and "Programme" are removed with the
--   table and leave those two untouched. It holds no rows.
--
--   All three hold no data. M5 loads nothing and M4 is the only migration that
--   loads anything (§10), so at the moment this reverse was authored the three
--   tables were empty and dropping them destroyed nothing that re-running the
--   forward migration does not restore exactly.
--
-- After a later migration adds an inbound key to any of the three, this file
-- is no longer safe, and it does not know that. A bare drop table then has a
-- dependent object and fails. The failure is the intended behaviour and this
-- file must not be edited to add cascade to get past it.
--
-- So this file reverses M5 only while M5 is the newest applied migration.
-- Nothing here enforces that ordering; a human reading this comment is the
-- only control there is.

drop table public."Equipment";

drop table public."Video";

drop table public."Offer";
