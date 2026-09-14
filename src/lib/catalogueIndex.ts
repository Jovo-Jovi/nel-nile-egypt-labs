// CONTENT_MODEL.md §3f — one record per published LabTest.
// Reads go through fetchAnonPublishedJson; no new query module, no session client.

import { fetchAnonPublishedJson } from "./supabaseRest";

export type CataloguePublicationState = "published" | "draft";

export type CatalogueIndexLabTestInput = {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  aliases: readonly string[];
  publicationState: CataloguePublicationState;
};

export type CatalogueIndexProgrammeInput = {
  id: string;
  slug: string;
  publicationState: CataloguePublicationState;
};

export type CatalogueIndexTierInput = {
  id: string;
  programmeId: string;
  publicationState: CataloguePublicationState;
};

export type CatalogueIndexMembershipInput = {
  labTestId: string;
  programmeTierId: string;
  publicationState: CataloguePublicationState;
};

export type CatalogueIndexEntry = {
  name: string;
  aliases: readonly string[];
  membership: readonly string[];
};

export type CatalogueIndex = {
  ar: Record<string, CatalogueIndexEntry>;
  en: Record<string, CatalogueIndexEntry>;
};

export type CatalogueIndexInputs = {
  labTests: readonly CatalogueIndexLabTestInput[];
  programmes: readonly CatalogueIndexProgrammeInput[];
  tiers: readonly CatalogueIndexTierInput[];
  memberships: readonly CatalogueIndexMembershipInput[];
};

function isPublished(state: CataloguePublicationState): boolean {
  return state === "published";
}

function localeEntries(
  locale: "ar" | "en",
  rows: readonly CatalogueIndexLabTestInput[],
  membershipByLabTestId: ReadonlyMap<string, readonly string[]>,
): Record<string, CatalogueIndexEntry> {
  const entries: Record<string, CatalogueIndexEntry> = {};
  const sorted = [...rows].sort((a, b) => a.slug.localeCompare(b.slug));
  for (const row of sorted) {
    const membership = membershipByLabTestId.get(row.id) ?? [];
    entries[row.slug] = {
      name: locale === "ar" ? row.nameAr : row.nameEn,
      aliases: [...row.aliases],
      membership: [...membership],
    };
  }
  return entries;
}

// Distinct Programme.slug values reached through ProgrammeLabTest /
// ProgrammeTier, any axis. Eligibility is a slot-render filter, not an
// index-membership filter; §3f is silent on it. Unpublished rows on any
// of the four tables are excluded.
export function assembleCatalogueIndex(inputs: CatalogueIndexInputs): CatalogueIndex {
  const publishedProgrammes = new Map<string, string>();
  for (const programme of inputs.programmes) {
    if (!isPublished(programme.publicationState)) continue;
    publishedProgrammes.set(programme.id, programme.slug);
  }

  const publishedTiers = new Map<string, string>();
  for (const tier of inputs.tiers) {
    if (!isPublished(tier.publicationState)) continue;
    const programmeSlug = publishedProgrammes.get(tier.programmeId);
    if (programmeSlug === undefined) continue;
    publishedTiers.set(tier.id, programmeSlug);
  }

  const membershipSets = new Map<string, Set<string>>();
  for (const membership of inputs.memberships) {
    if (!isPublished(membership.publicationState)) continue;
    const programmeSlug = publishedTiers.get(membership.programmeTierId);
    if (programmeSlug === undefined) continue;
    const existing = membershipSets.get(membership.labTestId);
    if (existing === undefined) {
      membershipSets.set(membership.labTestId, new Set([programmeSlug]));
    } else {
      existing.add(programmeSlug);
    }
  }

  const membershipByLabTestId = new Map<string, readonly string[]>();
  for (const [labTestId, slugs] of membershipSets) {
    membershipByLabTestId.set(labTestId, [...slugs].sort((a, b) => a.localeCompare(b)));
  }

  const publishedLabTests = inputs.labTests.filter((row) => isPublished(row.publicationState));

  return {
    ar: localeEntries("ar", publishedLabTests, membershipByLabTestId),
    en: localeEntries("en", publishedLabTests, membershipByLabTestId),
  };
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function asNonEmptyString(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function asAliasList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const aliases: string[] = [];
  for (const item of value) {
    if (typeof item === "string" && item.length > 0) aliases.push(item);
  }
  return aliases;
}

const LAB_TEST_SELECT =
  "select=id,slug,name_ar,name_en,aliases,publication_state,display_order&order=display_order.asc";

const PROGRAMME_SELECT = "select=id,slug,publication_state";

const PROGRAMME_TIER_SELECT = "select=id,Programme,publication_state";

const PROGRAMME_LAB_TEST_SELECT = "select=id,ProgrammeTier,LabTest,publication_state";

function parseLabTestInput(value: unknown): CatalogueIndexLabTestInput | null {
  const row = asRecord(value);
  if (row === null) return null;
  if (row.publication_state !== "published") return null;
  const id = asNonEmptyString(row.id);
  const slug = asNonEmptyString(row.slug);
  const nameAr = asNonEmptyString(row.name_ar);
  const nameEn = asNonEmptyString(row.name_en);
  if (id === null || slug === null || nameAr === null || nameEn === null) return null;
  return {
    id,
    slug,
    nameAr,
    nameEn,
    aliases: asAliasList(row.aliases),
    publicationState: "published",
  };
}

function parseProgrammeInput(value: unknown): CatalogueIndexProgrammeInput | null {
  const row = asRecord(value);
  if (row === null) return null;
  if (row.publication_state !== "published") return null;
  const id = asNonEmptyString(row.id);
  const slug = asNonEmptyString(row.slug);
  if (id === null || slug === null) return null;
  return { id, slug, publicationState: "published" };
}

function parseTierInput(value: unknown): CatalogueIndexTierInput | null {
  const row = asRecord(value);
  if (row === null) return null;
  if (row.publication_state !== "published") return null;
  const id = asNonEmptyString(row.id);
  const programmeId = asNonEmptyString(row.Programme);
  if (id === null || programmeId === null) return null;
  return { id, programmeId, publicationState: "published" };
}

function parseMembershipInput(value: unknown): CatalogueIndexMembershipInput | null {
  const row = asRecord(value);
  if (row === null) return null;
  if (row.publication_state !== "published") return null;
  const labTestId = asNonEmptyString(row.LabTest);
  const programmeTierId = asNonEmptyString(row.ProgrammeTier);
  if (labTestId === null || programmeTierId === null) return null;
  return { labTestId, programmeTierId, publicationState: "published" };
}

function mapPublished<T>(payload: unknown, parse: (value: unknown) => T | null): T[] {
  if (!Array.isArray(payload)) return [];
  const rows: T[] = [];
  for (const item of payload) {
    const parsed = parse(item);
    if (parsed !== null) rows.push(parsed);
  }
  return rows;
}

export async function loadPublishedCatalogueIndexInputs(): Promise<CatalogueIndexInputs> {
  const [labTests, programmes, tiers, memberships] = await Promise.all([
    fetchAnonPublishedJson("LabTest", LAB_TEST_SELECT),
    fetchAnonPublishedJson("Programme", PROGRAMME_SELECT),
    fetchAnonPublishedJson("ProgrammeTier", PROGRAMME_TIER_SELECT),
    fetchAnonPublishedJson("ProgrammeLabTest", PROGRAMME_LAB_TEST_SELECT),
  ]);
  return {
    labTests: mapPublished(labTests, parseLabTestInput),
    programmes: mapPublished(programmes, parseProgrammeInput),
    tiers: mapPublished(tiers, parseTierInput),
    memberships: mapPublished(memberships, parseMembershipInput),
  };
}
