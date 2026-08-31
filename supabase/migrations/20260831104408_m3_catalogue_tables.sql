-- M3 — the four catalogue tables, their keys, and the grant revoke.
--
-- DATA_MODEL.md v3 §6 rows 1-4. This is the first migration with foreign keys, so
-- the first in which a key can be silently wrong. Creation order below is a
-- dependency order and not a preference: "LabTest" points at the "LabUnit" M2
-- created, "ProgrammeTier" points at "Programme", and "ProgrammeLabTest" points
-- at "ProgrammeTier" and at "LabTest". There is no "Programme" foreign key on
-- "ProgrammeLabTest". Axes live on the tier; a membership reaches them through it.
--
-- Names are quoted PascalCase per D-41 and §2, including every foreign-key
-- column, index and constraint name that carries one. §2 fixes the column form
-- explicitly — a column that carries an entity name is that name, quoted.
-- scripts/guard/naming.mjs rejects any unquoted form.
--
-- Every table carries the §3 common set exactly as M2's four do: a
-- database-generated uuid primary key, created_at and updated_at, a
-- "PublicationState", display_order, and RLS enabled in the same statement block
-- that creates it. No attribution column appears on any of the four — no
-- created_by, no updated_by, no deleted_by, no owner_id (D-40,
-- SECURITY_MODEL.md §5). Timestamps yes, a person no.
--
-- No policy and no function is created here. The §7 cumulation function and both
-- SECURITY_MODEL.md §3 policy shapes are M4's. §10 as amended at M2: enabling
-- RLS and granting policies are two different things, and conflating them is a
-- security defect. A table with RLS on and no policy denies every request —
-- Postgres has no implicit allow — so after this migration all eight tables in
-- public are readable and writable by nobody, including the Operator, until M4
-- lands the two shapes. That is the intended state between M3 and M4, and it is
-- recorded as a carry-forward so it is not mistaken for a fault.
--
-- updated_at defaults to now() and is not maintained by a trigger, exactly as in
-- M2. M3 creates no function, so the writer of a row sets updated_at.
--
-- No row is loaded, no eligibility value is set, and no Arabic name is written.
-- M4 is the only migration that loads data (§10).
--
-- Reverse: supabase/migrations/m3_catalogue_tables.down.sql, authored in the same
-- task under OD-10 control 1. Not applied.

-- §6 row 4. One laboratory analysis. slug is the public path segment, so it is
-- unique and not null while both bilingual names may still be absent — §3 rule 1
-- keeps identity off the primary key, and §1 finding F3 records that all
-- seventy-two seed rows have no Arabic name at all (CF-80). name_ar therefore
-- stays nullable in storage; the partial check below blocks publication, not
-- insertion, so M4 can load all seventy-two as drafts.
--
-- CONTENT_MODEL.md §3a line 70 lists slug, name_ar, name_en, aliases, qa_flag.
-- There is no note column and no eligibility column on this table. Eligibility
-- sits on the membership row (D-44, §5); the note a §3b step 4 exclusion shows
-- sits there too.
--
-- aliases holds both locales' alternate names in one list (CONTENT_MODEL.md
-- §3a), not null with an empty-array default so a row without aliases holds an
-- empty array rather than null. No search index is built on it: D-06 and OD-02
-- put the search index at build time rather than in the database, and
-- cross-script matching is still an open question (CF-54).
--
-- qa_flag carries the 2018 extraction's quality flags verbatim. It is internal
-- and never Visitor-facing. Five seed rows have one and two of those are HIGH
-- (CF-82); nothing is resolved here, the clinical gate owns them.
--
-- The "LabUnit" foreign key is nullable per §6 row 4, with on delete set null:
-- an analysis whose department is removed loses its department and survives,
-- because the analysis exists independently of the department that runs it.
--
-- The name pair is both-not-null on publication. A published LabTest with no
-- Arabic name is exactly what I18N_MODEL.md §8 makes a failure rather than a
-- fallback, and CF-80 tracks the seventy-two that are missing.
create table public."LabTest" (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_ar text,
  name_en text,
  aliases text[] not null default '{}',
  qa_flag text,
  "LabUnit" uuid,
  publication_state public."PublicationState" not null default 'draft',
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint "LabTest_LabUnit_fkey" foreign key ("LabUnit")
    references public."LabUnit" (id) on delete set null,
  constraint "LabTest_name_bilingual_when_published" check (
    publication_state <> 'published'
    or (name_ar is not null and name_en is not null)
  )
);

alter table public."LabTest" enable row level security;

-- §6 row 1. One of the nine published check-up programmes. slug is the public
-- path segment under CONTENT_MODEL.md §3c, so it is unique and not null.
--
-- No price column, and this is a decision rather than an omission (D-04). Price
-- lives on "Offer", which carries validity dates, so a stale price expires by
-- itself. Adding one here later is a migration, which is the point: the absence
-- is enforced by there being nowhere to write it.
--
-- No tier_note column. That pair was DATA_MODEL.md's own invention and v3
-- dropped it. The note a §3b step 4 exclusion shows belongs on the membership
-- row. This table carries description and preparation_notes pairs, which
-- CONTENT_MODEL.md §3a lists.
--
-- name and description are both-not-null on publication. preparation_notes is
-- both-or-neither: a programme with no preparation notes is legitimate, and a
-- half-translated pair is not. A conditional pair whose absence is legitimate
-- must not block publication.
create table public."Programme" (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_ar text,
  name_en text,
  description_ar text,
  description_en text,
  preparation_notes_ar text,
  preparation_notes_en text,
  publication_state public."PublicationState" not null default 'draft',
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint "Programme_name_bilingual_when_published" check (
    publication_state <> 'published'
    or (name_ar is not null and name_en is not null)
  ),
  constraint "Programme_description_bilingual_when_published" check (
    publication_state <> 'published'
    or (description_ar is not null and description_en is not null)
  ),
  constraint "Programme_preparation_notes_bilingual_when_published" check (
    publication_state <> 'published'
    or ((preparation_notes_ar is null) = (preparation_notes_en is null))
  )
);

alter table public."Programme" enable row level security;

-- §6 row 2. One selectable slot on a "Programme", identified by the two D-05
-- axes. The seed's single tier string conflates both axes and §4 splits it into
-- eight pairs; nothing here stores the conflated string.
--
-- The "Programme" foreign key is not null and on delete cascade: a slot has no
-- meaning without the programme it is a slot on, so deleting a "Programme"
-- removes its slots. Both axes are not null — §4 gives each a 'none' member, so
-- "no tier" and "no audience" are values rather than absences, and a null would
-- be a third way to say the same thing.
--
-- Unique on the triple per §6 row 2 and §8: one "Programme" has at most one slot
-- for a given pair of axes. That unique constraint is also the §9 index the
-- function in §7 selects on, so a second index on the same columns is not
-- created. The mapping in CONTENT_MODEL.md §3a produces fourteen rows across
-- the nine Programmes and no duplicate among them.
create table public."ProgrammeTier" (
  id uuid primary key default gen_random_uuid(),
  "Programme" uuid not null,
  tier_axis public."ProgrammeTierAxis" not null,
  audience_axis public."AudienceAxis" not null,
  publication_state public."PublicationState" not null default 'draft',
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint "ProgrammeTier_Programme_fkey" foreign key ("Programme")
    references public."Programme" (id) on delete cascade,
  constraint "ProgrammeTier_Programme_axes_key"
    unique ("Programme", tier_axis, audience_axis)
);

alter table public."ProgrammeTier" enable row level security;

-- §6 row 3. Membership of one "LabTest" in one "ProgrammeTier".
--
-- There is no "Programme" foreign key on this table and no axis column on it.
-- Axes live on the tier and a membership reaches them through it (D-44). The
-- unique constraint is therefore on the pair ("ProgrammeTier", "LabTest"), not
-- a quadruple.
--
-- The two delete actions below differ deliberately and §8 fixes them. They are
-- not to be made uniform.
--
--   "ProgrammeTier" — on delete cascade. A membership row is a property of the
--   slot. Deleting a slot removes its memberships, because a membership of a
--   slot that no longer exists is not a record worth keeping.
--
--   "LabTest" — on delete restrict. A membership row is not a property of the
--   analysis. Deleting a "LabTest" that is still a member is refused, and the
--   refusal is the control: the alternative silently removes rows from the
--   published contents of a programme nobody was looking at. The Operator must
--   remove the memberships first, deliberately, and see how many there are.
--
-- Both are not null. A membership pointing at nothing is not a membership, and
-- the unique constraint below would not constrain it either — Postgres treats
-- nulls as distinct, so a nullable key column would permit unlimited duplicates
-- of exactly the row §8 forbids duplicating.
--
-- source_name holds the seed's own string verbatim, byte for byte, including its
-- spelling and its qualifier wording (CONTENT_MODEL.md §3a). It is internal and
-- never Visitor-facing: the clinical gate checks the lab's corrections against
-- what the 2018 source said, and a string we did not keep cannot be checked. It
-- carries no bilingual pair — it is one historical string, not a translation —
-- and §6 row 3 states it as a single column, so it is one.
--
-- eligibility_audience is the consequential column in this file. §5 and D-42,
-- moved onto the membership by D-44: it is not null, it defaults to
-- 'unreviewed', and an 'unreviewed' row never renders on the public site in any
-- tier for any audience selection. The default is the control. Defaulting to
-- 'all' would match CONTENT_MODEL.md §3b step 4's wording and would place PSA —
-- which the seed carries at Silver, and Silver unions upward into both Gold and
-- Platinum — on a page a woman selects. A safe-looking default is how that
-- class of defect ships. No value is set on any row here; M4 loads all 121
-- memberships at the default, and each becomes visible only when a human
-- records a clinical judgement alongside the sign-off that governs the name.
--
-- note_ar / note_en are both-or-neither on publication. §5 makes the note pair
-- conditional: it is shown only where eligibility is 'male' or 'female' and the
-- selection is 'none', so a published row with eligibility 'all' correctly has
-- no note at all. Requiring both on publication would make such a row
-- unpublishable. What must never happen is a half-translated note, and that is
-- what this form forbids.
create table public."ProgrammeLabTest" (
  id uuid primary key default gen_random_uuid(),
  "ProgrammeTier" uuid not null,
  "LabTest" uuid not null,
  source_name text,
  eligibility_audience public."EligibilityAudience" not null default 'unreviewed',
  note_ar text,
  note_en text,
  publication_state public."PublicationState" not null default 'draft',
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint "ProgrammeLabTest_ProgrammeTier_fkey" foreign key ("ProgrammeTier")
    references public."ProgrammeTier" (id) on delete cascade,
  constraint "ProgrammeLabTest_LabTest_fkey" foreign key ("LabTest")
    references public."LabTest" (id) on delete restrict,
  constraint "ProgrammeLabTest_membership_key"
    unique ("ProgrammeTier", "LabTest"),
  constraint "ProgrammeLabTest_note_bilingual_when_published" check (
    publication_state <> 'published'
    or ((note_ar is null) = (note_en is null))
  )
);

alter table public."ProgrammeLabTest" enable row level security;

-- §9, publication state on each of the four. RLS filters on this column for
-- every anonymous read once M4's published-read policy exists, so each index is
-- written now against the query that policy will make on every request. No other
-- index is created: slug on "LabTest" and on "Programme" already has one from
-- its unique constraint, the "ProgrammeTier" triple already has one from its
-- unique constraint (that is the §9 ("Programme", tier_axis, audience_axis)
-- index), the "ProgrammeLabTest" pair already has one from its unique
-- constraint, and bilingual search is deferred under CF-54.
create index "LabTest_publication_state_idx"
  on public."LabTest" (publication_state);

create index "Programme_publication_state_idx"
  on public."Programme" (publication_state);

create index "ProgrammeTier_publication_state_idx"
  on public."ProgrammeTier" (publication_state);

create index "ProgrammeLabTest_publication_state_idx"
  on public."ProgrammeLabTest" (publication_state);

-- ---------------------------------------------------------------------------
-- The grant revoke — all eight tables in public, including M2's four.
-- ---------------------------------------------------------------------------
--
-- M2's read-back found anon and authenticated holding the full arwdDxtm
-- privilege set on the four tables it created, granted by the linked project's
-- default privileges rather than by anything M2 wrote. RLS denies today, so the
-- grant is inert. But SECURITY_MODEL.md §3's "no INSERT, no UPDATE, no DELETE
-- for the anonymous role, ever" then rests entirely on M4's policy being written
-- for select rather than for all. One keyword, in a file not yet written.
--
-- So: revoke everything from both public roles, then grant back only select. No
-- insert, update, delete, truncate, references or trigger to either role, in
-- this migration or any other. M4's policies decide which rows are visible;
-- these grants decide which verbs exist at all. Two independent controls is the
-- point, and either one alone has a single point of failure.
--
-- The Operator writes through the authenticated role, so M4 grants insert,
-- update and delete to authenticated alongside its Operator-write policy — not
-- here. Between M3 and M4 nobody can write, including the Operator. That is
-- intended and it is recorded as a carry-forward.
--
-- service_role is deliberately untouched. It bypasses RLS, it is never used by
-- the application (SECURITY_MODEL.md §3 and §7), and narrowing it here would
-- change the behaviour of administrative tooling this migration knows nothing
-- about. postgres, the owner, is likewise untouched.
--
-- One statement per verb rather than one per table: a list cannot omit a table
-- by accident the way eight separate statements can.
revoke all privileges on table
  public."LabUnit",
  public."Branch",
  public."SiteSettings",
  public."MediaAsset",
  public."LabTest",
  public."Programme",
  public."ProgrammeTier",
  public."ProgrammeLabTest"
from anon, authenticated;

grant select on table
  public."LabUnit",
  public."Branch",
  public."SiteSettings",
  public."MediaAsset",
  public."LabTest",
  public."Programme",
  public."ProgrammeTier",
  public."ProgrammeLabTest"
to anon, authenticated;

-- The same correction applied forward, so a table created after this migration
-- does not inherit the full set the way M2's four did.
--
-- No for-role clause, deliberately. Default privileges are keyed to the granting
-- role. pg_default_acl carries two granting roles — postgres and supabase_admin
-- — so a single statement narrows only one. The granting role that matters here
-- is the one that creates tables on this route: every table in public carries an
-- ACL entry granted by postgres, read back from pg_class.relacl as
-- anon=arwdDxtm/postgres, and supabase db push connects as that same role, so
-- the bare form targets exactly it.
--
-- The default is set to select rather than to nothing. Both satisfy "a future
-- table does not inherit the full set", and select is chosen because it makes
-- the default identical to the intended steady state: every table in this schema
-- is anonymously readable and never anonymously writable, so the failure mode of
-- a future migration that forgets to think about grants is a read-only table and
-- never a writable one.
--
-- A table created in public by supabase_admin — which is not the migration route
-- this project uses — would still inherit the full set. Narrowing that second
-- entry needs a role this migration may not be a member of, so it is recorded
-- rather than attempted here.
alter default privileges in schema public
  revoke all on tables from anon, authenticated;

alter default privileges in schema public
  grant select on tables to anon, authenticated;
