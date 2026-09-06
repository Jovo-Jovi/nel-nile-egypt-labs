-- M8 reverse — restore the pre-P05-T26B catalogue rows.
--
-- OD-10 control 1: every migration ships with a reverse authored in the
-- same task as its forward. This file is NOT applied. It exists so that
-- the reverse is written while the forward is fresh rather than
-- reconstructed under pressure.
--
-- It carries no leading timestamp, so the Supabase CLI does not treat it
-- as a migration and db push does not pick it up. Running it is a
-- deliberate, separate act by a human.
--
-- Reverse of 20260906110552_m8_signed_catalogue.sql. Order is the reverse
-- of the forward: re-insert the combined LabTest before the membership
-- that references it (on delete restrict), then undo membership writes,
-- then restore LabTest names and qa_flag.
--
-- publication_state is not assigned. Rows that were draft stay draft.

-- 1. Restore the combined LabTest row at its original primary key.
insert into public."LabTest" (
  id,
  slug,
  name_ar,
  name_en,
  aliases,
  qa_flag,
  "LabUnit",
  publication_state,
  display_order,
  created_at,
  updated_at
) values (
  '0955ed27-b14c-4670-ab46-01cee7153688'::uuid,
  'creatinine-urea-combined',
  null,
  $m8$Creatinine / Urea — see QA note$m8$,
  ARRAY[$m8$creatinine urea$m8$, $m8$kidney function$m8$, $m8$وظائف كلى$m8$]::text[],
  $m8$MEDIUM — Source reads 'Creatinine\urea' as one entry. Should almost certainly be two separate tests. Confirm.$m8$,
  null,
  'draft'::public."PublicationState",
  32,
  timestamptz $m8$2026-08-31T11:24:42.396111Z$m8$,
  timestamptz $m8$2026-08-31T11:24:42.396111Z$m8$
);

-- 2. Undo membership writes, then restore the combined membership.
delete from public."ProgrammeLabTest" as plt
using public."LabTest" as lt,
      public."ProgrammeTier" as pt,
      public."Programme" as p
where plt."LabTest" = lt.id
  and plt."ProgrammeTier" = pt.id
  and pt."Programme" = p.id
  and (
    (p.slug = 'general-checkup' and pt.tier_axis = 'Children' and pt.audience_axis = 'none' and lt.slug in ('creatinine', 'urea', 'alt'))
    or
    (p.slug = 'infertility' and pt.tier_axis = 'none' and pt.audience_axis = 'Female' and lt.slug = 'testosterone-free')
  );

update public."ProgrammeLabTest"
set "LabTest" = 'f764f1b1-7958-40ae-a987-7d811df66b2c'::uuid
where id = 'feac7d97-2e55-4593-8448-29bd53f0dd0a'::uuid;

insert into public."ProgrammeLabTest" (
  id,
  "ProgrammeTier",
  "LabTest",
  source_name,
  eligibility_audience,
  note_ar,
  note_en,
  publication_state,
  display_order,
  created_at,
  updated_at
) values (
  '16dd3919-f333-4d28-80a3-eaee09ead457'::uuid,
  '8e66f8c0-cbcc-4b45-ba60-f968e442ef61'::uuid,
  '0955ed27-b14c-4670-ab46-01cee7153688'::uuid,
  $m8$Creatinine\urea$m8$,
  'unreviewed'::public."EligibilityAudience",
  null,
  null,
  'draft'::public."PublicationState",
  40,
  timestamptz $m8$2026-08-31T11:24:42.396111Z$m8$,
  timestamptz $m8$2026-08-31T11:24:42.396111Z$m8$
);

-- 3. Eligibility back to the fail-closed default on every remaining row.
update public."ProgrammeLabTest"
set eligibility_audience = 'unreviewed'::public."EligibilityAudience";

-- 4. Restore LabTest names and qa_flag. name_ar was null on every row.
update public."LabTest"
set name_ar = null;

update public."LabTest"
set name_en = $m8$APP — see QA note (likely AFP)$m8$
where slug = 'app-afp';

update public."LabTest" as lt
set qa_flag = v.qa_flag
from (
  values
  ($m8$app-afp$m8$, $m8$HIGH — 'APP' is not a recognised tumour marker. Almost certainly AFP (Alpha-Fetoprotein), which matches the stated purpose (liver tumours). Confirm with lab before publishing.$m8$),
  ($m8$ast$m8$, $m8$MEDIUM — Children tier writes 'SCOT (AST)'. SCOT is a typo for SGOT. Confirm.$m8$),
  ($m8$creatinine-urea-combined$m8$, $m8$MEDIUM — Source reads 'Creatinine\urea' as one entry. Should almost certainly be two separate tests. Confirm.$m8$),
  ($m8$esr$m8$, $m8$LOW — spelled 'Westergreen' in one tier, 'Westergren' in another. Westergren is correct.$m8$),
  ($m8$fsh$m8$, $m8$HIGH — FSH appears in the Gold tier, whose description is about THYROID disorders. FSH is a fertility hormone. Very likely should be TSH. Confirm with lab.$m8$)
) as v(slug, qa_flag)
where lt.slug = v.slug;

do $m8_down_assert$
declare
  n_test integer;
  n_membership integer;
  n_unreviewed integer;
  n_published integer;
begin
  select count(*) into n_test from public."LabTest";
  select count(*) into n_membership from public."ProgrammeLabTest";
  select count(*) into n_unreviewed from public."ProgrammeLabTest" where eligibility_audience = 'unreviewed';
  select
    (select count(*) from public."LabTest" where publication_state = 'published')
    + (select count(*) from public."Programme" where publication_state = 'published')
    + (select count(*) from public."ProgrammeTier" where publication_state = 'published')
    + (select count(*) from public."ProgrammeLabTest" where publication_state = 'published')
  into n_published;
  if n_test is distinct from 72
     or n_membership is distinct from 121
     or n_unreviewed is distinct from 121
     or n_published is distinct from 0 then
    raise exception
      'M8 down assertion failed: LabTest=% ProgrammeLabTest=% unreviewed=% published=%',
      n_test, n_membership, n_unreviewed, n_published;
  end if;
end;
$m8_down_assert$;
