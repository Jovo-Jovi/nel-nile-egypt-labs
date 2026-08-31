-- M3 reverse — drop the four catalogue tables and restore the prior grant state.
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
-- Reverse of 20260831094526_m3_catalogue_tables.sql. Drop order is the reverse of
-- creation order. cascade is deliberately absent on every statement, per M1's and
-- M2's precedent: a bare drop table fails the moment any object outside this file
-- depends on the table, and that refusal is the control. cascade would convert a
-- loud failure into the silent removal of somebody else's object. In this file
-- the risk is concrete rather than theoretical — dropping "LabTest" with cascade
-- after M4 would take the §7 function with it.
--
-- Dropping a table takes its own indexes, constraints, RLS state and privilege
-- grants with it, so no separate drop index and no separate revoke is written for
-- any of the four. The four "PublicationState", "ProgrammeTierAxis",
-- "AudienceAxis" and "EligibilityAudience" column dependencies point at M1's
-- types, which this file does not touch.
--
-- Ordering, which nothing here enforces. M2's own reverse became unrunnable the
-- moment M3's forward gave "LabTest" a "LabUnit" foreign key: a bare
-- drop table public."LabUnit" then has a dependent object and fails. M2's down
-- file says so in its own comments. So this file runs first and M2's second, and
-- the only control on that ordering is a human reading these two comments.
--
-- Why each drop is safe today, stated per table per OD-10 control 1:
--
--   "ProgrammeLabTest" — nothing references it. §6 gives it no inbound foreign
--   key from any table, created or uncreated, and it is the leaf of the whole
--   catalogue. It holds no rows: M3 loads nothing.
--
--   "ProgrammeTier" — nothing references it. This one is worth stating carefully,
--   because CONTENT_MODEL.md §3a describes a ProgrammeLabTest as belonging to one
--   ProgrammeTier, which would be an inbound foreign key. The schema
--   DATA_MODEL.md §6 row 3 fixes, and which M3's forward implements, addresses a
--   membership by ("Programme", tier_axis, audience_axis) instead, so no such key
--   exists to break. It holds no rows.
--
--   "Programme" — two inbound foreign keys, both from tables dropped above:
--   "ProgrammeTier" and "ProgrammeLabTest". §6 gives it no third. CONTENT_MODEL.md
--   records an optional "Offer" to "Programme" relation (D-18), and "Offer" is
--   created by no migration authored so far. It holds no rows.
--
--   "LabTest" — one inbound foreign key, from "ProgrammeLabTest", dropped above.
--   §6 gives it no other. Its own outbound key to "LabUnit" is dropped with the
--   table and leaves "LabUnit" untouched. It holds no rows.
--
--   All four hold no data. M3 loads nothing and M4 is the only migration that
--   loads anything (§10), so at the moment this reverse was authored the four
--   tables were empty and dropping them destroyed nothing that re-running the
--   forward migration does not restore exactly.
--
-- After M4 this file is no longer safe, and it does not know that. Stated plainly,
-- because every justification above is true only of the schema and the data as
-- they stand at M3:
--
--   M4 loads the seed: nine "Programme" rows, fourteen "ProgrammeTier" rows,
--   seventy-two "LabTest" rows, and 121 "ProgrammeLabTest" membership rows this
--   file knows nothing about. From that moment "it holds no rows" — the second
--   half of every justification above — is false for all four tables. Dropping
--   them destroys those rows, the 121-to-72 assertion §8 puts inside the seed
--   migration has nothing left to assert against, and OD-10 control 4 puts
--   destructive change behind its own OD once real records exist.
--
--   M4 creates the §7 function, declared as returning a set of "LabTest". Its
--   return type is that table's row type, so from that moment
--   drop table public."LabTest" has a dependent object and fails. The failure is
--   the intended behaviour and this file must not be edited to add cascade to get
--   past it: cascade would drop the one implementation of the cumulation rule
--   that keeps a tumour marker off a child's page (D-06, D-43).
--
--   M4 creates the RLS policies. Those are dropped with their tables and are not
--   recoverable from this file, which has never seen them.
--
-- So this file reverses M3 only while M3 is the newest applied migration. Once M4
-- lands it is a historical record of how M3 was reversed, not a runnable
-- procedure.

drop table public."ProgrammeLabTest";

drop table public."ProgrammeTier";

drop table public."Programme";

drop table public."LabTest";

-- Restore the prior grant state.
--
-- The four tables dropped above took their own grants with them, so only M2's
-- four need restoring. Before M3, anon and authenticated held the full arwdDxtm
-- privilege set on each of them, granted by the project's default privileges at
-- creation rather than by anything M2 wrote, and the schema's default privileges
-- granted that same full set to both roles on every future table.
--
-- Restoring that is this file's obligation and it re-creates a known weakness.
-- The prior state is precisely the finding M3's forward migration exists to
-- remove: with the full set granted, SECURITY_MODEL.md §3's "no INSERT, no
-- UPDATE, no DELETE for the anonymous role, ever" rests entirely on RLS being
-- enabled and on M4's policy being written for select rather than for all. A
-- reverse that quietly left the narrower grants in place would not be a reverse
-- — it would be M3 half-applied, and the next reader would have no way to tell
-- which of the two states the database was in. So the restore is written, and the
-- consequence is written next to it: a human who runs this file and then stops
-- has re-exposed the write verbs, and should re-run the grant block of
-- 20260831094526_m3_catalogue_tables.sql or accept the exposure deliberately.
--
-- all privileges is used rather than the seven verbs spelled out, so that this
-- statement reproduces whatever "all" meant on the server version that granted
-- it, rather than a list frozen at the version this file was written against.
grant all privileges on table
  public."LabUnit",
  public."Branch",
  public."SiteSettings",
  public."MediaAsset"
to anon, authenticated;

-- The schema default, restored the same way and with the same caveat. No
-- for-role clause, matching the forward migration: the granting role that matters
-- is the one that creates tables here, and it is the role executing this
-- statement.
alter default privileges in schema public
  grant all on tables to anon, authenticated;
