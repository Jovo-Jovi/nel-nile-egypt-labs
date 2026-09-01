// Shared anonymous REST config. The publishable key is the only key that
// may appear here; it is not a secret. No service-role key, no project
// ref, and no connection string.

export type SupabaseRestConfig = { url: string; anonKey: string };

export function supabaseRestConfig(): SupabaseRestConfig | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.SUPABASE_ANON_KEY;
  if (typeof url !== "string" || url.length === 0) return null;
  if (typeof anonKey !== "string" || anonKey.length === 0) return null;
  return { url: url.replace(/\/$/, ""), anonKey };
}

type PublishedTable = "Programme" | "Offer" | "Video" | "Equipment";

// Published-only. The publication_state filter is appended here so a
// caller cannot omit it. Unpublished rows are never selected (PR-08).
export async function fetchAnonPublishedJson(
  table: PublishedTable,
  selectAndOrder: string,
): Promise<unknown> {
  const config = supabaseRestConfig();
  if (config === null) return [];

  const endpoint = `${config.url}/rest/v1/${table}?${selectAndOrder}&publication_state=eq.published`;
  const response = await fetch(endpoint, {
    headers: {
      apikey: config.anonKey,
      Authorization: `Bearer ${config.anonKey}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`published ${table} query failed: ${response.status}`);
  }

  return response.json();
}
