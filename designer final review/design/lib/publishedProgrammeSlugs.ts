// D-42 / CF-90 — generateStaticParams reads published Programmes only.
// Unpublished rows are never selected. An empty list is the correct
// result while every row remains draft; it is not a gap to fill.

import { fetchAnonPublishedJson } from "./supabaseRest";

type SlugRow = { slug: string };

function slugsFromUnknown(payload: unknown): string[] {
  if (!Array.isArray(payload)) return [];
  const slugs: string[] = [];
  for (const row of payload) {
    if (row !== null && typeof row === "object" && "slug" in row) {
      const value = (row as SlugRow).slug;
      if (typeof value === "string" && value.length > 0) slugs.push(value);
    }
  }
  return slugs;
}

export async function listPublishedProgrammeSlugs(): Promise<string[]> {
  const payload = await fetchAnonPublishedJson("Programme", "select=slug");
  return slugsFromUnknown(payload);
}
