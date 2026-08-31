-- M2 — the four independent tables.
--
-- DATA_MODEL.md §6 rows 5, 6, 10 and 11. Independent means none of the four
-- carries a foreign key to another application table, so all four can land
-- before "Programme" and "LabTest" exist (§10). Creation order below is for
-- readability only; no dependency orders it.
--
-- Names are quoted PascalCase per D-41 and §2, including every index and
-- constraint name that carries one. An unquoted reference folds to lower case
-- and scripts/guard/naming.mjs rejects it.
--
-- Every table carries the §3 common set: a database-generated uuid primary key,
-- created_at and updated_at, a "PublicationState", display_order, and RLS
-- enabled in the same statement block that creates it. No attribution column
-- appears on any of the four — no created_by, no updated_by, no deleted_by, no
-- owner_id (D-40, SECURITY_MODEL.md §5). Timestamps yes, a person no.
--
-- No policy is created here. §10 as amended: enabling RLS and granting policies
-- are two different things, and conflating them is a security defect. A table
-- with RLS on and no policy denies every request — Postgres has no implicit
-- allow — so the four tables are readable by nobody, including a holder of the
-- publishable key, until M4 writes the two shapes from SECURITY_MODEL.md §3.
-- That is the intended state between M2 and M4, not a gap to be tolerated.
--
-- Bilingual columns are nullable in storage (§3 rule 6). A draft may be written
-- half-way; the per-pair check below blocks publication, not insertion. Each
-- check is satisfied trivially while publication_state is 'draft', so the
-- constraint bites at exactly one moment: the transition to 'published'.
--
-- updated_at defaults to now() and is not maintained by a trigger. M2 creates no
-- function (nothing in §6 requires one and §7's function is M4's), so the writer
-- of a row sets updated_at. Stated here because a column named updated_at is
-- normally assumed to maintain itself.
--
-- Reverse: supabase/migrations/m2_independent_tables.down.sql, authored in the
-- same task under OD-10 control 1. Not applied.

-- Row 5. The four laboratory departments (CONTENT_MODEL.md §3a). slug is the
-- public path segment, so it is unique and not null while every bilingual name
-- may still be absent — §3 rule 1 keeps identity off the primary key.
create table public."LabUnit" (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_ar text,
  name_en text,
  description_ar text,
  description_en text,
  publication_state public."PublicationState" not null default 'draft',
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint "LabUnit_name_bilingual_when_published" check (
    publication_state <> 'published'
    or (name_ar is not null and name_en is not null)
  ),
  constraint "LabUnit_description_bilingual_when_published" check (
    publication_state <> 'published'
    or (description_ar is not null and description_en is not null)
  )
);

alter table public."LabUnit" enable row level security;

-- Row 6. A physical laboratory location. whatsapp_e164 and the addresses are the
-- lab's published business contact points, not personal data — PR-16 keeps them
-- out of source and puts them here, which is the only home they have.
--
-- latitude and longitude are nullable because no coordinate has been verified
-- (CF-69). numeric(9,6) holds six decimal places, which is roughly 0.1 m, and a
-- signed three-digit integer part, which covers every longitude.
create table public."Branch" (
  id uuid primary key default gen_random_uuid(),
  name_ar text,
  name_en text,
  address_ar text,
  address_en text,
  is_head_office boolean not null default false,
  latitude numeric(9,6),
  longitude numeric(9,6),
  hours_ar text,
  hours_en text,
  whatsapp_e164 text,
  publication_state public."PublicationState" not null default 'draft',
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint "Branch_name_bilingual_when_published" check (
    publication_state <> 'published'
    or (name_ar is not null and name_en is not null)
  ),
  constraint "Branch_address_bilingual_when_published" check (
    publication_state <> 'published'
    or (address_ar is not null and address_en is not null)
  ),
  constraint "Branch_hours_bilingual_when_published" check (
    publication_state <> 'published'
    or (hours_ar is not null and hours_en is not null)
  )
);

alter table public."Branch" enable row level security;

-- Row 10. The singleton of lab-wide published values. Field list from
-- CONTENT_MODEL.md §3a, which outranks DATA_MODEL.md and enumerates which of
-- them are bilingual, bounded by §6 row 10's inventory.
--
-- hotline, whatsapp_e164 and the four social URLs are single columns rather than
-- bilingual pairs. I18N_MODEL.md §5 fixes Western digits in both locales
-- uniformly, so a hotline is the same string in Arabic and English, and §6 lists
-- "the WhatsApp number · social URLs · any SiteSettings value containing Latin"
-- among the Latin runs isolated at render — one stored value, isolated, in both
-- locales. A pair whose halves another rule requires to be identical is a
-- duplicated column, not a bilingual pair. "Branch" settles the same question
-- the same way in §6 row 6, where whatsapp_e164 is single and hours is a pair.
--
-- The four social columns are the four platforms the lab actually holds an
-- account on, per docs/research/11-research-findings.md §5 (Facebook, Instagram,
-- LinkedIn, YouTube; TikTok and X recorded as not found) and the four social
-- marks in docs/research/16-owner-approved-composition.md. All four are nullable
-- because no canonical URL is settled (CF-10) and D-35 renders no mark without a
-- destination — a null column is how "does not render" is stored.
--
-- display_order is inert on a singleton and is present so that the §3 common set
-- is uniform across all four tables.
create table public."SiteSettings" (
  id uuid primary key default gen_random_uuid(),
  hotline text,
  whatsapp_e164 text,
  whatsapp_message_ar text,
  whatsapp_message_en text,
  hours_ar text,
  hours_en text,
  facebook_url text,
  instagram_url text,
  linkedin_url text,
  youtube_url text,
  about_body_ar text,
  about_body_en text,
  privacy_body_ar text,
  privacy_body_en text,
  lab_to_lab_ar text,
  lab_to_lab_en text,
  seo_title_ar text,
  seo_title_en text,
  seo_description_ar text,
  seo_description_en text,
  publication_state public."PublicationState" not null default 'draft',
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint "SiteSettings_whatsapp_message_bilingual_when_published" check (
    publication_state <> 'published'
    or (whatsapp_message_ar is not null and whatsapp_message_en is not null)
  ),
  constraint "SiteSettings_hours_bilingual_when_published" check (
    publication_state <> 'published'
    or (hours_ar is not null and hours_en is not null)
  ),
  constraint "SiteSettings_about_body_bilingual_when_published" check (
    publication_state <> 'published'
    or (about_body_ar is not null and about_body_en is not null)
  ),
  constraint "SiteSettings_privacy_body_bilingual_when_published" check (
    publication_state <> 'published'
    or (privacy_body_ar is not null and privacy_body_en is not null)
  ),
  constraint "SiteSettings_lab_to_lab_bilingual_when_published" check (
    publication_state <> 'published'
    or (lab_to_lab_ar is not null and lab_to_lab_en is not null)
  ),
  constraint "SiteSettings_seo_title_bilingual_when_published" check (
    publication_state <> 'published'
    or (seo_title_ar is not null and seo_title_en is not null)
  ),
  constraint "SiteSettings_seo_description_bilingual_when_published" check (
    publication_state <> 'published'
    or (seo_description_ar is not null and seo_description_en is not null)
  )
);

alter table public."SiteSettings" enable row level security;

-- Row 11. One uploaded image, with bilingual alt text. storage_path points into
-- the provider's storage bucket and is the only required column; the dimensions
-- and the byte size are recorded at upload and are nullable until then.
create table public."MediaAsset" (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null,
  alt_ar text,
  alt_en text,
  width integer,
  height integer,
  byte_size bigint,
  mime_type text,
  publication_state public."PublicationState" not null default 'draft',
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint "MediaAsset_alt_bilingual_when_published" check (
    publication_state <> 'published'
    or (alt_ar is not null and alt_en is not null)
  )
);

alter table public."MediaAsset" enable row level security;

-- §8, at most one head office. A partial unique index over the rows where
-- is_head_office is true: among those rows the key has exactly one possible
-- value, so a second head office cannot be inserted. Rows where the flag is
-- false are not constrained and there may be any number of them.
create unique index "Branch_single_head_office_idx"
  on public."Branch" (is_head_office)
  where is_head_office;

-- §8, one "SiteSettings" row. A unique index on a constant expression: every row
-- indexes to the same key, so the second insert conflicts. Postgres permits a
-- constant index expression and this is the documented idiom for a singleton.
create unique index "SiteSettings_singleton_idx"
  on public."SiteSettings" ((true));

-- §9, publication state on each table. RLS filters on this column for every
-- anonymous read once M4's published-read policy exists, so the index is written
-- now against the query that policy will make on every request. No other index
-- is created: slug on "LabUnit" already has one from its unique constraint, and
-- bilingual search is deferred under CF-54.
create index "LabUnit_publication_state_idx"
  on public."LabUnit" (publication_state);

create index "Branch_publication_state_idx"
  on public."Branch" (publication_state);

create index "SiteSettings_publication_state_idx"
  on public."SiteSettings" (publication_state);

create index "MediaAsset_publication_state_idx"
  on public."MediaAsset" (publication_state);
