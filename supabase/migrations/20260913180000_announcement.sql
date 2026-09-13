-- "Announcement" — the ninth dashboard module (OD-09 A3).
--
-- DATA_MODEL.md §6 row 12 names title, body, published_at. OD-09's Decides
-- entry adds the optional "MediaAsset", PublicationState, and display
-- order. Bilingual columns are _ar/_en pairs. The common set from §3
-- (uuid pk, created_at, updated_at, publication_state, display_order,
-- RLS in the same block) matches M2, M3 and M5.
--
-- No author, creator, editor, owner or created_by column.
-- BOUNDARY_MODEL.md §2 item 10 forbids a table in public gaining a
-- column identifying an account holder. OD-09 Bound 1 records an
-- affirmation that the text contains no medical instruction; that is a
-- boolean on the row, not an identity. ClinicalNotice (A4) is not
-- created here.
--
-- Additive only (OD-10 control 4). This file does not alter any table
-- that already exists. The outbound key to "MediaAsset" uses on delete
-- set null: removing an asset degrades the optional photograph to
-- pending rather than deleting the announcement.
--
-- Bilingual columns are nullable in storage. A draft may be written
-- half-way; the per-pair check blocks publication, not insertion.
-- published_at and no_medical_instruction_affirmed are required only
-- when publication_state is published (OD-09 publication date; Bound 1).
--
-- Names are quoted PascalCase per D-41, including the foreign-key
-- column, index and constraint names that carry an entity. Ordinary
-- attribute columns are lower snake case.
--
-- RLS: anonymous read of published rows only; Operator write gated on
-- app_metadata.nel_principal = 'Operator', matching the M7B-2 predicate
-- the other twelve write policies use. Grants: SELECT to anon;
-- SELECT, INSERT, UPDATE, DELETE to authenticated.
--
-- No row is loaded and no row is published.
--
-- This file is authored here and is not applied here. Apply is the
-- human running npx supabase db push (OD-17 §3.3).
--
-- Reverse: supabase/migrations/announcement.down.sql, authored in the
-- same task under OD-10 control 1. Not applied.

create table public."Announcement" (
  id uuid primary key default gen_random_uuid(),
  title_ar text,
  title_en text,
  body_ar text,
  body_en text,
  published_at date,
  "MediaAsset" uuid,
  no_medical_instruction_affirmed boolean not null default false,
  publication_state public."PublicationState" not null default 'draft',
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint "Announcement_MediaAsset_fkey" foreign key ("MediaAsset")
    references public."MediaAsset" (id) on delete set null,
  constraint "Announcement_title_bilingual_when_published" check (
    publication_state <> 'published'
    or (title_ar is not null and title_en is not null)
  ),
  constraint "Announcement_body_bilingual_when_published" check (
    publication_state <> 'published'
    or (body_ar is not null and body_en is not null)
  ),
  constraint "Announcement_published_at_when_published" check (
    publication_state <> 'published'
    or published_at is not null
  ),
  constraint "Announcement_no_medical_instruction_affirmed_when_published" check (
    publication_state <> 'published'
    or no_medical_instruction_affirmed
  )
);

alter table public."Announcement" enable row level security;

create index "Announcement_publication_state_idx"
  on public."Announcement" (publication_state);

create policy "Announcement_published_read"
  on public."Announcement"
  for select
  to anon
  using (publication_state = 'published');

create policy "Announcement_operator_write"
  on public."Announcement"
  for all
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'nel_principal') = 'Operator')
  with check ((auth.jwt() -> 'app_metadata' ->> 'nel_principal') = 'Operator');

grant select on table public."Announcement" to anon;

grant select, insert, update, delete on table public."Announcement" to authenticated;
