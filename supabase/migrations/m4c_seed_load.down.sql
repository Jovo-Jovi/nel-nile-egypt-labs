-- M4c reverse — remove the seed rows. cascade absent.
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
-- Reverse of 20260831111538_m4c_seed_load.sql. DATA_MODEL.md §10 names the
-- reverse of the seed load as truncate. Truncate order is the reverse of
-- insert order and respects the foreign keys: memberships first, then slots,
-- then programmes, then analyses. cascade is deliberately absent on every
-- statement, per M1's precedent. A bare truncate fails the moment any object
-- outside these four tables still references a row, and that refusal is the
-- control.
--
-- Why each truncate is safe today:
--
--   "ProgrammeLabTest" — leaf. No inbound foreign key from any table.
--   "ProgrammeTier" — inbound from "ProgrammeLabTest", truncated above.
--   "Programme" — inbound from "ProgrammeTier", truncated above. There is no
--     key from "ProgrammeLabTest" to "Programme" (D-44). "Offer" does not exist.
--   "LabTest" — inbound from "ProgrammeLabTest" (on delete restrict), truncated
--     above. Its outbound key to "LabUnit" is left untouched; "LabUnit" is M2's
--     table and this reverse does not drop it or empty it.
--
-- Truncate destroys the 9 / 72 / 121 / loaded-tier rows this forward loaded.
-- OD-10 control 4 puts destructive change behind its own OD once real records
-- exist, which is why this file is not applied. After a human publishes any
-- row, "the rows are drafts this migration wrote" is no longer a complete
-- description of what truncate would destroy.

truncate public."ProgrammeLabTest";

truncate public."ProgrammeTier";

truncate public."Programme";

truncate public."LabTest";
