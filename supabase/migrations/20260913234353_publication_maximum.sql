-- "PublicationMaximum" — per-module published-row maximum (OD-27).
--
-- A module declares the table it governs and an integer maximum. Adding a
-- later module is a row here plus a CREATE TRIGGER on that table; the
-- function is generic. Seeded with exactly one row: "Announcement", 3.
-- No other module is assigned a number (OD-27 Does not decide).
--
-- The integer is a signed decision, not an Operator setting. An Operator
-- raising it would amend OD-27 without a migration the reviewer reads
-- (OD-17 §3.3). An Operator lowering it below the live published count
-- would make the published set illegal without an explicit unpublish.
-- Writes are therefore migration-only. Operators SELECT so a later
-- dashboard can display the cap. Anonymous has no access at all.
--
-- No author, owner, created_by or account-holder column.
-- BOUNDARY_MODEL.md §2 item 10: this table identifies no account holder.
-- It holds a module name, a relation name and an integer. No personal or
-- medical data.
--
-- Additive only (OD-10 control 4). This file does not alter any table
-- that already exists, other than attaching a trigger to "Announcement".
--
-- The trigger function fires BEFORE INSERT OR UPDATE and acts only on a
-- transition into published. It does not rewrite publication_state. A
-- blocked write is refused; the row stays draft because the statement
-- does not succeed. Dedicated errcode P5MAX and message prefix
-- NEL_PUBLICATION_MAXIMUM — the server action matches those, not prose.
--
-- Lock key: pg_advisory_xact_lock(TG_RELID::bigint). TG_RELID is the
-- governed table's oid, supplied by Postgres to the trigger. Two
-- sessions transitioning the same relation into published serialize
-- until commit, so both cannot pass a count taken before either insert
-- is visible.
--
-- Count: SECURITY DEFINER, owner the table owner (postgres), so the
-- count reads every published row regardless of the firing role's RLS
-- view. relforcerowsecurity on the governed table stays false; the
-- owner role has rolbypassrls. Verified in the rehearsal, not assumed.
--
-- This file is authored here and is not applied here. Apply is the
-- human running npx supabase db push (OD-17 §3.3).
--
-- Reverse: supabase/migrations/publication_maximum.down.sql, authored
-- in the same task under OD-10 control 1. Not applied.

create table public."PublicationMaximum" (
  module_key text not null,
  governed_table text not null,
  published_maximum integer not null,
  constraint "PublicationMaximum_pkey" primary key (module_key),
  constraint "PublicationMaximum_governed_table_key" unique (governed_table),
  constraint "PublicationMaximum_published_maximum_positive" check (published_maximum > 0)
);

alter table public."PublicationMaximum" enable row level security;

create policy "PublicationMaximum_operator_read"
  on public."PublicationMaximum"
  for select
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'nel_principal') = 'Operator');

revoke all on table public."PublicationMaximum" from public, anon, authenticated;

grant select on table public."PublicationMaximum" to authenticated;

insert into public."PublicationMaximum" (
  module_key,
  governed_table,
  published_maximum
) values (
  'Announcement',
  'Announcement',
  3
);

create function public."enforcePublicationMaximum"()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $body$
declare
  maximum integer;
  published_count integer;
begin
  if NEW.publication_state is distinct from 'published'::public."PublicationState" then
    return NEW;
  end if;

  if TG_OP = 'UPDATE'
     and OLD.publication_state is not distinct from 'published'::public."PublicationState" then
    return NEW;
  end if;

  perform pg_advisory_xact_lock(TG_RELID::bigint);

  select pm.published_maximum
    into maximum
    from public."PublicationMaximum" as pm
   where pm.governed_table = TG_TABLE_NAME;

  if maximum is null then
    raise exception 'NEL_PUBLICATION_MAXIMUM'
      using errcode = 'P5MAX',
            detail = 'missing configuration';
  end if;

  execute format(
    'select count(*) from %I.%I where publication_state = $1',
    TG_TABLE_SCHEMA,
    TG_TABLE_NAME
  ) into published_count using 'published'::public."PublicationState";

  if published_count >= maximum then
    raise exception 'NEL_PUBLICATION_MAXIMUM'
      using errcode = 'P5MAX';
  end if;

  return NEW;
end;
$body$;

revoke all on function public."enforcePublicationMaximum"() from public;
revoke all on function public."enforcePublicationMaximum"() from anon, authenticated, service_role;

create trigger "Announcement_enforcePublicationMaximum"
  before insert or update
  on public."Announcement"
  for each row
  execute function public."enforcePublicationMaximum"();
