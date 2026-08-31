// D-42 / CF-90 — generateStaticParams reads published Programmes only.
// Unpublished rows are never selected. An empty list is the correct
// result while every row remains draft; it is not a gap to fill.

type SlugRow = { slug: string };

function supabaseRestConfig(): { url: string; anonKey: string } | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.SUPABASE_ANON_KEY;
  if (typeof url !== "string" || url.length === 0) return null;
  if (typeof anonKey !== "string" || anonKey.length === 0) return null;
  return { url: url.replace(/\/$/, ""), anonKey };
}

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
  const config = supabaseRestConfig();
  if (config === null) {
    return [];
  }

  const endpoint = `${config.url}/rest/v1/Programme?select=slug&publication_state=eq.published`;
  const response = await fetch(endpoint, {
    headers: {
      apikey: config.anonKey,
      Authorization: `Bearer ${config.anonKey}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`published Programme slug query failed: ${response.status}`);
  }

  const slugs = slugsFromUnknown(await response.json());
  return slugs;
}
