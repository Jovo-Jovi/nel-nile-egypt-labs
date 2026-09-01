-- M5 — "Offer", "Video", "Equipment".
--
-- DATA_MODEL.md §6 rows 7-9 as reconciled at M5A. Creation order is a
-- dependency order: "Equipment" carries a nullable "Video" foreign key, so
-- "Video" is created first of those two. "Offer" has no key to either and
-- lands first as this task names it.
--
-- Names are quoted PascalCase per D-41 and §2, including every foreign-key
-- column, index and constraint name that carries one. Ordinary attribute
-- columns are lower snake case, as in every earlier migration.
--
-- Every table carries the §3 common set: a database-generated uuid primary
-- key, created_at and updated_at, a "PublicationState", display_order, and
-- row-level security enabled in the same statement block that creates it.
-- The existing public."PublicationState" enumeration is reused; this file
-- introduces no enumeration. No attribution column appears — no created_by,
-- no updated_by, no deleted_by, no owner_id (D-40, SECURITY_MODEL.md §5).
--
-- Both SECURITY_MODEL.md §3 policy shapes land in this file, per table,
-- because these three tables are created after M4. Published-read: SELECT
-- only, to anon, restricted to publication_state = 'published'.
-- Operator-write: for all, to authenticated. Grants match: SELECT to anon
-- and nothing else; insert, update and delete to authenticated so the
-- Operator-write policy has verbs to permit. M3's schema default already
-- grants SELECT on a new table to both roles; the named SELECT grant to
-- anon is the fence's match against SECURITY_MODEL.md §3, written rather
-- than inherited in silence.
--
-- Additive only (OD-10 control 4). This file does not rewrite, narrow or
-- otherwise change any table that already exists. Foreign keys point at
-- "MediaAsset" and "Programme", which M2 and M3 created; those tables are
-- not altered.
--
-- Bilingual columns are nullable in storage (§3 rule 6). A draft may be
-- written half-way; the per-pair check blocks publication, not insertion.
-- Each check is satisfied trivially while publication_state is 'draft'.
--
-- updated_at defaults to now() and is not maintained by a trigger, exactly
-- as in M2 and M3. The writer of a row sets updated_at.
--
-- No row is loaded and no row is published. Seed load is not this task.
--
-- This file is authored here and is not applied here. Apply is M5C.
--
-- Reverse: supabase/migrations/m5_offer_equipment_video.down.sql, authored
-- in the same task under OD-10 control 1. Not applied.

-- §6 row 7. One published promotional offer with validity dates and the
-- price. No currency is hardcoded and none is named (CF-21); price_currency
-- is stored per row with no default. The "Programme" foreign key is
-- nullable (D-18): an "Offer" may reference one "Programme" and is never
-- required to. The "MediaAsset" foreign key is nullable. Both use on delete
-- set null, the nullable-key shape M3 used for "LabTest"."LabUnit".
--
-- valid_from / valid_until are dates. §8 (as repaired at STEP 1a of this
-- task) requires valid_until >= valid_from. A SQL check treats unknown as
-- passing, so a draft may omit either date; the comparison binds once both
-- are present.
--
-- title and description are both-not-null on publication (§3 rule 6, §8
-- bilingual completeness).
create table public."Offer" (
  id uuid primary key default gen_random_uuid(),
  title_ar text,
  title_en text,
  description_ar text,
  description_en text,
  valid_from date,
  valid_until date,
  price_amount numeric(10,2),
  price_currency text,
  "MediaAsset" uuid,
  "Programme" uuid,
  publication_state public."PublicationState" not null default 'draft',
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint "Offer_MediaAsset_fkey" foreign key ("MediaAsset")
    references public."MediaAsset" (id) on delete set null,
  constraint "Offer_Programme_fkey" foreign key ("Programme")
    references public."Programme" (id) on delete set null,
  constraint "Offer_valid_until_gte_valid_from" check (
    valid_until >= valid_from
  ),
  constraint "Offer_title_bilingual_when_published" check (
    publication_state <> 'published'
    or (title_ar is not null and title_en is not null)
  ),
  constraint "Offer_description_bilingual_when_published" check (
    publication_state <> 'published'
    or (description_ar is not null and description_en is not null)
  )
);

alter table public."Offer" enable row level security;

-- §6 row 9. One published video record. YouTube host only; never stored
-- here. youtube_id is the host's identifier. is_featured follows the
-- boolean convention (M5A): not null, default false, matching
-- "Branch".is_head_office. The "MediaAsset" foreign key is nullable and is
-- the poster (D-13, DESIGN_SYSTEM.md §10, CONTENT_MODEL.md §3a as amended
-- at M5A). An autoloading embed is a boundary defect; the poster cannot
-- come from the video host.
--
-- title and description are both-not-null on publication.
create table public."Video" (
  id uuid primary key default gen_random_uuid(),
  youtube_id text,
  title_ar text,
  title_en text,
  description_ar text,
  description_en text,
  is_featured boolean not null default false,
  "MediaAsset" uuid,
  publication_state public."PublicationState" not null default 'draft',
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint "Video_MediaAsset_fkey" foreign key ("MediaAsset")
    references public."MediaAsset" (id) on delete set null,
  constraint "Video_title_bilingual_when_published" check (
    publication_state <> 'published'
    or (title_ar is not null and title_en is not null)
  ),
  constraint "Video_description_bilingual_when_published" check (
    publication_state <> 'published'
    or (description_ar is not null and description_en is not null)
  )
);

alter table public."Video" enable row level security;

-- §6 row 8. One published piece of laboratory equipment. No "LabUnit"
-- foreign key: CONTENT_MODEL.md §3a line 78 does not list one, the listing
-- route is flat, and grouping by department is an amendment if the
-- dashboard ever wants it. The "MediaAsset" and "Video" foreign keys are
-- both nullable. Both use on delete set null.
--
-- name and description are both-not-null on publication.
create table public."Equipment" (
  id uuid primary key default gen_random_uuid(),
  name_ar text,
  name_en text,
  description_ar text,
  description_en text,
  "MediaAsset" uuid,
  "Video" uuid,
  publication_state public."PublicationState" not null default 'draft',
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint "Equipment_MediaAsset_fkey" foreign key ("MediaAsset")
    references public."MediaAsset" (id) on delete set null,
  constraint "Equipment_Video_fkey" foreign key ("Video")
    references public."Video" (id) on delete set null,
  constraint "Equipment_name_bilingual_when_published" check (
    publication_state <> 'published'
    or (name_ar is not null and name_en is not null)
  ),
  constraint "Equipment_description_bilingual_when_published" check (
    publication_state <> 'published'
    or (description_ar is not null and description_en is not null)
  )
);

alter table public."Equipment" enable row level security;

-- §9, publication state on each of the three. RLS filters on this column
-- for every anonymous read, so each index is written against the query
-- the published-read policy makes on every request. No other index is
-- created: these tables have no slug, and bilingual search is deferred
-- under CF-54.
create index "Offer_publication_state_idx"
  on public."Offer" (publication_state);

create index "Video_publication_state_idx"
  on public."Video" (publication_state);

create index "Equipment_publication_state_idx"
  on public."Equipment" (publication_state);

-- SECURITY_MODEL.md §3, both shapes, on each of the three tables.
-- Published-read is for select only — never for all — and only to anon.
-- Operator-write is for all, to authenticated, no per-Operator partition.

create policy "Offer_published_read"
  on public."Offer"
  for select
  to anon
  using (publication_state = 'published');

create policy "Offer_operator_write"
  on public."Offer"
  for all
  to authenticated
  using (true)
  with check (true);

create policy "Video_published_read"
  on public."Video"
  for select
  to anon
  using (publication_state = 'published');

create policy "Video_operator_write"
  on public."Video"
  for all
  to authenticated
  using (true)
  with check (true);

create policy "Equipment_published_read"
  on public."Equipment"
  for select
  to anon
  using (publication_state = 'published');

create policy "Equipment_operator_write"
  on public."Equipment"
  for all
  to authenticated
  using (true)
  with check (true);

grant select on table
  public."Offer",
  public."Video",
  public."Equipment"
to anon;

grant insert, update, delete on table
  public."Offer",
  public."Video",
  public."Equipment"
to authenticated;
