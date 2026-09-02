// Published Programme detail. Name and description come from the
// Programme row. The tier axis comes from published ProgrammeTier rows
// of that Programme. Membership is not selected here — D-43.

import { fetchAnonPublishedJson } from "./supabaseRest";
import { parseAxisSelection, type AxisSelection } from "./programmeAxes";

export type PublishedProgrammeDetail = {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  slots: readonly AxisSelection[];
};

function asRecord(value: unknown): Record<string, unknown> | null {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function asNonEmptyString(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function parseProgrammeRow(value: unknown): Omit<PublishedProgrammeDetail, "slots"> | null {
  const row = asRecord(value);
  if (row === null) return null;
  if (row.publication_state !== "published") return null;
  const id = asNonEmptyString(row.id);
  const slug = asNonEmptyString(row.slug);
  const nameAr = asNonEmptyString(row.name_ar);
  const nameEn = asNonEmptyString(row.name_en);
  const descriptionAr = asNonEmptyString(row.description_ar);
  const descriptionEn = asNonEmptyString(row.description_en);
  if (id === null || slug === null || nameAr === null || nameEn === null) return null;
  if (descriptionAr === null || descriptionEn === null) return null;
  return { id, slug, nameAr, nameEn, descriptionAr, descriptionEn };
}

function parseSlot(value: unknown): AxisSelection | null {
  const row = asRecord(value);
  if (row === null) return null;
  if (row.publication_state !== undefined && row.publication_state !== "published") {
    return null;
  }
  return parseAxisSelection(row.tier_axis, row.audience_axis);
}

async function listPublishedSlots(programmeId: string): Promise<AxisSelection[]> {
  const encodedId = encodeURIComponent(programmeId);
  const payload = await fetchAnonPublishedJson(
    "ProgrammeTier",
    `select=tier_axis,audience_axis,display_order,publication_state&Programme=eq.${encodedId}&order=display_order.asc`,
  );
  if (!Array.isArray(payload)) return [];
  const slots: AxisSelection[] = [];
  for (const item of payload) {
    const parsed = parseSlot(item);
    if (parsed !== null) slots.push(parsed);
  }
  return slots;
}

export async function publishedProgrammeBySlug(
  slug: string,
): Promise<PublishedProgrammeDetail | null> {
  if (slug.length === 0) return null;
  const encodedSlug = encodeURIComponent(slug);
  const payload = await fetchAnonPublishedJson(
    "Programme",
    `select=id,slug,name_ar,name_en,description_ar,description_en,publication_state,display_order&slug=eq.${encodedSlug}`,
  );
  if (!Array.isArray(payload) || payload.length === 0) return null;
  const row = parseProgrammeRow(payload[0]);
  if (row === null) return null;
  const slots = await listPublishedSlots(row.id);
  return { ...row, slots };
}
