-- M1 reverse — drop the four enum types.
--
-- OD-10 control 1: every migration ships with a reverse authored in the same task
-- as its forward. This file is NOT applied. It exists so that the reverse is
-- written while the forward is fresh rather than reconstructed under pressure.
--
-- It carries no leading timestamp, so the Supabase CLI does not treat it as a
-- migration and `db push` does not pick it up. Running it is a deliberate,
-- separate act by a human.
--
-- Reverse of 20260831082725_m1_enum_types.sql. Drop order is the reverse of
-- creation order.
--
-- Why each drop is safe, stated per OD-10 control 1:
--
--   No table, column, function, index, policy or domain references any of these
--   four types. M1 created types and nothing else, and M2 — which creates the
--   first tables — is not authored. `drop type` without `cascade` therefore has no
--   dependency to break: Postgres refuses a bare `drop type` the moment any object
--   depends on it, so if this file is ever run after M2 or later it fails loudly
--   rather than dropping a column. `cascade` is deliberately absent for that
--   reason — the failure is the control.
--
--   These types hold no data. An enum type is a value domain, not a store; no row
--   exists anywhere in the schema, so dropping them destroys nothing that a
--   re-run of the forward migration does not restore exactly.
--
-- OD-10 control 4 (additive before destructive) is not engaged: this file drops
-- nothing while unapplied, and it reverses a migration from the same task rather
-- than narrowing anything that pre-dates it.

drop type public."PublicationState";

drop type public."EligibilityAudience";

drop type public."AudienceAxis";

drop type public."ProgrammeTierAxis";
