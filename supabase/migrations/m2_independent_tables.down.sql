-- M2 reverse — drop the four independent tables.
--
-- OD-10 control 1: every migration ships with a reverse authored in the same task
-- as its forward. This file is NOT applied. It exists so that the reverse is
-- written while the forward is fresh rather than reconstructed under pressure.
--
-- It carries no leading timestamp, so the Supabase CLI does not treat it as a
-- migration and `db push` does not pick it up — the CLI prints a `Skipping
-- migration` line for it on every invocation. Running it is a deliberate,
-- separate act by a human.
--
-- Reverse of 20260831090539_m2_independent_tables.sql. Drop order is the reverse
-- of creation order. `cascade` is deliberately absent on every statement, per
-- M1's precedent: a bare `drop table` fails the moment any object outside this
-- file depends on the table, and that refusal is the control. `cascade` would
-- convert a loud failure into a silent removal of somebody else's object.
--
-- Dropping a table takes its own indexes, constraints and RLS state with it, so
-- no separate `drop index` is needed and none is written. The four
-- "PublicationState" column dependencies point at M1's type, which this file
-- does not touch.
--
-- Why each drop is safe, stated per OD-10 control 1:
--
--   "MediaAsset" — nothing references it. §6 gives it foreign keys from "Offer",
--   "Equipment" and "Video", and none of those three tables is created by any
--   migration authored so far.
--
--   "SiteSettings" — nothing references it. It is a singleton that no other
--   table points at in §6, in either direction.
--
--   "Branch" — nothing references it. §6 gives it no inbound foreign key.
--
--   "LabUnit" — nothing references it. §6 gives it inbound nullable foreign keys
--   from "LabTest" and "Equipment", and neither table exists.
--
--   All four hold no data. M2 loads nothing and M4 is the only migration that
--   loads anything (§10), so at the moment this reverse was authored the four
--   tables were empty and dropping them destroyed nothing that re-running the
--   forward migration does not restore exactly.
--
-- **After M3 or M4 this file is no longer safe, and it does not know that.**
-- Stated plainly because the four justifications above are true only of the
-- schema as it stands at M2:
--
--   M3 creates "LabTest" with a nullable "LabUnit" foreign key. From that moment
--   `drop table public."LabUnit"` has a dependent object and fails. The failure
--   is the intended behaviour and this file must not be edited to add `cascade`
--   to get past it — dropping "LabUnit" with `cascade` would silently drop that
--   column off "LabTest".
--
--   M4 loads the seed. From that moment the four tables are not empty, and
--   "the tables hold no data" — the second half of every justification above —
--   is false. Dropping a seeded table destroys rows, and OD-10 control 4 puts
--   destructive change behind its own OD.
--
-- So this file reverses M2 only while M2 is the newest applied migration. Once
-- M3 lands it is a historical record of how M2 was reversed, not a runnable
-- procedure, and the reverse of the schema as it then stands is M3's own down
-- file run first. Nothing here enforces that ordering; a human reading this
-- comment is the only control there is, which is why it is stated rather than
-- assumed.

drop table public."MediaAsset";

drop table public."SiteSettings";

drop table public."Branch";

drop table public."LabUnit";
