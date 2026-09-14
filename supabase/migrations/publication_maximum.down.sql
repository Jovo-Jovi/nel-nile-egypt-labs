-- Reverse — drop the publication-maximum trigger, function and table.
--
-- OD-10 control 1: every migration ships with a reverse authored in the same
-- task as its forward. This file is NOT applied. It exists so that the reverse
-- is written while the forward is fresh rather than reconstructed under pressure.
--
-- It carries no leading timestamp, so the Supabase CLI does not treat it as a
-- migration and db push does not pick it up — the CLI prints a Skipping
-- migration line for it on every invocation. Running it is a deliberate,
-- separate act by a human. That Skipping line is by design and is not a defect.
--
-- Reverse of 20260913234353_publication_maximum.sql.
-- cascade is deliberately absent, matching M1, M2, M5, M6 and Announcement:
-- a bare drop fails the moment any object outside this file depends on
-- these objects, and that refusal is the control.
--
-- Drop order: trigger, function, table. The table drop takes its
-- constraints, RLS state, policies and grants with it.
--
-- Why this drop is safe today, stated per OD-10 control 1:
--
--   The trigger is attached only to "Announcement". The function is
--   referenced only by that trigger. "PublicationMaximum" holds one
--   configuration row and no inbound keys. This reverse was authored in
--   the same task as the forward, and the forward is not applied, so
--   none of these objects exist on the linked remote yet. Safe today
--   because destroying them destroys nothing that re-running the
--   forward restores exactly. Expires when a later migration attaches
--   the function to another table, or when a later row is seeded.
--
-- The trigger does not drop "Announcement". Unpublishing stays an
-- Operator act on that table and is not reversed here.

drop trigger "Announcement_enforcePublicationMaximum" on public."Announcement";

drop function public."enforcePublicationMaximum"();

drop table public."PublicationMaximum";
