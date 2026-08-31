-- M1 — enum types.
--
-- DATA_MODEL.md §4. Four Postgres enum types, and nothing else. No table, no
-- column, no function, no policy, no index, no grant. M1 creates types and stops.
--
-- Value order is significant: an enum's sort order is its creation order, and the
-- cumulation rule in CONTENT_MODEL.md §3b and D-06 reads Silver then Gold then
-- Platinum. The order below is the order DATA_MODEL.md §4 states.
--
-- Type names are quoted PascalCase per D-41 and DATA_MODEL.md §2. Enum values are
-- single-quoted literals — data, not identifiers — and are left exactly as §4
-- writes them, including the lowercase set on "EligibilityAudience".
--
-- Reverse: supabase/migrations/m1_enum_types.down.sql, authored in the same task
-- under OD-10 control 1. Not applied.

create type public."ProgrammeTierAxis" as enum (
  'none',
  'Silver',
  'Gold',
  'Platinum',
  'Children'
);

create type public."AudienceAxis" as enum (
  'none',
  'Male',
  'Female'
);

-- Defaults to 'unreviewed' wherever it is used, per DATA_MODEL.md §5 and D-42.
-- The default belongs to the column, not to the type, so it lands with the table
-- that carries it and not here.
create type public."EligibilityAudience" as enum (
  'unreviewed',
  'all',
  'male',
  'female'
);

create type public."PublicationState" as enum (
  'draft',
  'published'
);
