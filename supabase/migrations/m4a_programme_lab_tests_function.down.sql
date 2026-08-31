-- M4a reverse — drop the §7 cumulation function.
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
-- Reverse of 20260831111505_m4a_programme_lab_tests_function.sql. cascade is
-- deliberately absent, per M1's precedent: a bare drop function fails the moment
-- any object outside this file depends on the function, and that refusal is the
-- control. cascade would convert a loud failure into the silent removal of
-- somebody else's object.
--
-- Why the drop is safe today: nothing references the function. No view, no
-- trigger, no second function, no grant that would survive the drop in a way
-- this file would need to restore — M4b grants execute, and dropping the
-- function takes that grant with it. The function holds no data.
--
-- After a caller starts using it, this file is no longer a complete reverse of
-- the schema as it then stands: dropping the one implementation of §3b removes
-- the control that keeps a tumour marker off a child's page (D-06, D-43). That
-- is why this file is not applied, and why it must not be edited to add cascade.
--
-- Argument types identify the function. RETURNS TABLE is not part of the
-- identity, so the drop names the three parameters only.

drop function public."programmeLabTests"(
  uuid,
  public."ProgrammeTierAxis",
  public."AudienceAxis"
);
