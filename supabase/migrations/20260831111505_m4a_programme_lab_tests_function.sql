-- M4a — public."programmeLabTests", the one implementation of CONTENT_MODEL.md §3b.
--
-- DATA_MODEL.md §7 asked for `returns setof "LabTest"`. That shape cannot carry
-- the per-row note §3b step 4 requires when eligibility is male/female and the
-- selection is none. This function therefore returns table(...) with every
-- "LabTest" column plus note_ar and note_en from the membership row. That
-- widening is a document divergence (PR-18): it is reported, not reconciled by
-- editing DATA_MODEL.md.
--
-- Harm-critical. Steps 1 and 4 of §3b are both named harm vectors. D-06, D-42,
-- D-43. Written against §3b read line by line, not from memory of the fence.
--
--   security definer — reads past RLS by design; it therefore filters
--     publication_state = 'published' itself, on every table it touches.
--   set search_path = public, pg_temp — pinned, so a caller cannot rebind an
--     unqualified name. Every relation below is still schema-qualified.
--   stable — reads tables, does not write.
--   Reach memberships through "ProgrammeTier". There is no axis column on
--     "ProgrammeLabTest" (D-44). The union is a join across tier rows of the
--     one "Programme".
--
-- "unreviewed" is excluded unconditionally, on every branch including Children,
-- before anything else (D-42, §5). That is the fail-closed default.
--
-- Reverse: supabase/migrations/m4a_programme_lab_tests_function.down.sql,
-- authored in the same task under OD-10 control 1. Not applied.

create function public."programmeLabTests"(
  "programme" uuid,
  tier public."ProgrammeTierAxis",
  audience public."AudienceAxis"
)
returns table (
  id uuid,
  slug text,
  name_ar text,
  name_en text,
  aliases text[],
  qa_flag text,
  "LabUnit" uuid,
  publication_state public."PublicationState",
  display_order integer,
  created_at timestamptz,
  updated_at timestamptz,
  note_ar text,
  note_en text
)
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $body$
begin
  -- §3b step 1. If ProgrammeTierAxis is Children: return only memberships
  -- whose tier row carries Children. Stop. Do not union Silver, Gold, Platinum,
  -- or any other slot. Return before step 4. The eligibility filter (all /
  -- male / female matching) does not apply to this branch.
  --
  -- Hard constraint, named twice in §3b and named a harm vector: Silver
  -- carries PSA and Platinum — Female carries seven tumour markers. A
  -- cumulative Children slot renders them on a child's page (D-06).
  --
  -- unreviewed is still excluded. That exclusion is not step 4; it is the
  -- fail-closed default and it applies before anything else, including here.
  --
  -- Published on every table this branch touches: "Programme",
  -- "ProgrammeTier", "ProgrammeLabTest", "LabTest".
  if tier = 'Children'::public."ProgrammeTierAxis" then
    return query
    select
      lt.id,
      lt.slug,
      lt.name_ar,
      lt.name_en,
      lt.aliases,
      lt.qa_flag,
      lt."LabUnit",
      lt.publication_state,
      lt.display_order,
      lt.created_at,
      lt.updated_at,
      plt.note_ar,
      plt.note_en
    from public."Programme" as p
    inner join public."ProgrammeTier" as pt
      on pt."Programme" = p.id
    inner join public."ProgrammeLabTest" as plt
      on plt."ProgrammeTier" = pt.id
    inner join public."LabTest" as lt
      on plt."LabTest" = lt.id
    where p.id = "programme"
      and pt.tier_axis = 'Children'::public."ProgrammeTierAxis"
      and p.publication_state = 'published'::public."PublicationState"
      and pt.publication_state = 'published'::public."PublicationState"
      and plt.publication_state = 'published'::public."PublicationState"
      and lt.publication_state = 'published'::public."PublicationState"
      and plt.eligibility_audience <> 'unreviewed'::public."EligibilityAudience";
    return;
  end if;

  -- §3b steps 2 and 3, then step 4. Children never reaches this block.
  -- The extra `tier <> 'Children'` keeps the block fail-closed if the early
  -- return above is ever deleted: Children would then yield empty, not a union.
  --
  -- Step 2. Silver, Gold, Platinum cumulate in that order.
  --   Start with membership whose ProgrammeTierAxis is Silver.
  --   If the selection is Gold or Platinum, union membership whose
  --     ProgrammeTierAxis is Gold.
  --   If the selection is Platinum, union membership whose ProgrammeTierAxis
  --     is Platinum and whose AudienceAxis matches the selected AudienceAxis.
  --
  -- Step 3. none does not cumulate. Return memberships whose tier row is
  --   (none, matching audience) only.
  --
  -- Step 4. Eligibility filter, after the union, never on the Children branch.
  --   all — the row always renders. No note.
  --   male or female, and the selected AudienceAxis is Male or Female — the
  --     row renders if the two match, and is removed from the set if they do
  --     not. An excluded row is removed, not annotated, not greyed, not shown
  --     with a caveat.
  --   male or female, and the selected AudienceAxis is none — the row renders
  --     with its note_ar / note_en. The notes travel on this return shape;
  --     setof "LabTest" could not carry them.
  --
  -- Hard constraint: PSA sits at Silver. Silver unions into Gold, and Silver
  -- unions into Platinum. Without step 4 the renderer shows a prostate marker
  -- to every Visitor selecting Gold, and to every Visitor selecting
  -- Platinum — Female.
  return query
  select
    lt.id,
    lt.slug,
    lt.name_ar,
    lt.name_en,
    lt.aliases,
    lt.qa_flag,
    lt."LabUnit",
    lt.publication_state,
    lt.display_order,
    lt.created_at,
    lt.updated_at,
    plt.note_ar,
    plt.note_en
  from public."Programme" as p
  inner join public."ProgrammeTier" as pt
    on pt."Programme" = p.id
  inner join public."ProgrammeLabTest" as plt
    on plt."ProgrammeTier" = pt.id
  inner join public."LabTest" as lt
    on plt."LabTest" = lt.id
  where p.id = "programme"
    and tier <> 'Children'::public."ProgrammeTierAxis"
    and p.publication_state = 'published'::public."PublicationState"
    and pt.publication_state = 'published'::public."PublicationState"
    and plt.publication_state = 'published'::public."PublicationState"
    and lt.publication_state = 'published'::public."PublicationState"
    and plt.eligibility_audience <> 'unreviewed'::public."EligibilityAudience"
    and (
      (
        tier in (
          'Silver'::public."ProgrammeTierAxis",
          'Gold'::public."ProgrammeTierAxis",
          'Platinum'::public."ProgrammeTierAxis"
        )
        and (
          pt.tier_axis = 'Silver'::public."ProgrammeTierAxis"
          or (
            tier in (
              'Gold'::public."ProgrammeTierAxis",
              'Platinum'::public."ProgrammeTierAxis"
            )
            and pt.tier_axis = 'Gold'::public."ProgrammeTierAxis"
          )
          or (
            tier = 'Platinum'::public."ProgrammeTierAxis"
            and pt.tier_axis = 'Platinum'::public."ProgrammeTierAxis"
            and pt.audience_axis = audience
          )
        )
      )
      or (
        tier = 'none'::public."ProgrammeTierAxis"
        and pt.tier_axis = 'none'::public."ProgrammeTierAxis"
        and pt.audience_axis = audience
      )
    )
    and (
      plt.eligibility_audience = 'all'::public."EligibilityAudience"
      or (
        plt.eligibility_audience in (
          'male'::public."EligibilityAudience",
          'female'::public."EligibilityAudience"
        )
        and audience in (
          'Male'::public."AudienceAxis",
          'Female'::public."AudienceAxis"
        )
        and (
          (
            plt.eligibility_audience = 'male'::public."EligibilityAudience"
            and audience = 'Male'::public."AudienceAxis"
          )
          or (
            plt.eligibility_audience = 'female'::public."EligibilityAudience"
            and audience = 'Female'::public."AudienceAxis"
          )
        )
      )
      or (
        plt.eligibility_audience in (
          'male'::public."EligibilityAudience",
          'female'::public."EligibilityAudience"
        )
        and audience = 'none'::public."AudienceAxis"
      )
    );
end;
$body$;
