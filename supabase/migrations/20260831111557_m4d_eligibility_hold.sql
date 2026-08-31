-- M4d — the eligibility hold.
--
-- Assert that all 121 memberships carry eligibility_audience = 'unreviewed'
-- and abort otherwise. Nothing sets a value. This migration exists to make
-- the fail-closed state (D-42, DATA_MODEL.md §5) explicit and checkable
-- rather than implicit in a column default.
--
-- A membership whose eligibility is unreviewed never renders on the public
-- site, in any tier, for any audience selection. Until a human records a
-- clinical judgement per membership, that is the intended state.
--
-- Reverse: supabase/migrations/m4d_eligibility_hold.down.sql, authored in the
-- same task under OD-10 control 1. Not applied. The forward set nothing, so
-- the reverse undoes nothing.

do $hold$
declare
  n integer;
  n_bad integer;
begin
  select count(*) into n
  from public."ProgrammeLabTest";

  select count(*) into n_bad
  from public."ProgrammeLabTest"
  where eligibility_audience is distinct from 'unreviewed';

  if n is distinct from 121 or n_bad is distinct from 0 then
    raise exception
      'eligibility hold failed: memberships=% (expected 121), not-unreviewed=% (expected 0)',
      n,
      n_bad;
  end if;
end;
$hold$;
