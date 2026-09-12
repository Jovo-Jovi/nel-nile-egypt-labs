// Shared anonymous REST config. The publishable key is the only key that
// may appear here; it is not a secret. No service-role key, no project
// ref, and no connection string.

import { supabasePublicEnv, type SupabasePublicEnv } from "@/lib/supabase/env";

export type SupabaseRestConfig = SupabasePublicEnv;

export function supabaseRestConfig(): SupabaseRestConfig | null {
  return supabasePublicEnv();
}

type PublishedTable =
  | "Programme"
  | "ProgrammeTier"
  | "LabUnit"
  | "Offer"
  | "Video"
  | "Equipment"
  | "Branch"
  | "SiteSettings"
  | "MediaAsset";

type PublishedFetchCache = "force-cache" | "no-store";

// Published-only. The publication_state filter is appended here so a
// caller cannot omit it. Unpublished rows are never selected (PR-08).
export async function fetchAnonPublishedJson(
  table: PublishedTable,
  selectAndOrder: string,
  cache: PublishedFetchCache = "force-cache",
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
    // Operator writes call revalidatePath. no-store would dynamize every
    // public page that reads a published listing and drop the static HTML
    // floor. Unpublished rows still cannot enter: the filter is appended
    // above where a caller cannot omit it (PR-08).
    //
    // The Programme detail route is force-dynamic with no revalidatePath
    // reaching its slug path, so an infinitely-cached fetch entry there
    // would keep serving a Programme after it was unpublished. That is
    // SECURITY_MODEL.md §3's invariant, not a freshness preference. Every
    // other caller is still static and still withdrawn by revalidatePath.
    // Those callers keep the default. The detail route passes no-store.
    cache,
  });

  if (!response.ok) {
    throw new Error(`published ${table} query failed: ${response.status}`);
  }

  return response.json();
}

export async function fetchAnonStorageObject(
  bucket: string,
  objectName: string,
): Promise<Response | null> {
  const config = supabaseRestConfig();
  if (config === null) return null;

  const response = await fetch(
    `${config.url}/storage/v1/object/${bucket}/${encodeURIComponent(objectName)}`,
    {
      headers: {
        apikey: config.anonKey,
        Authorization: `Bearer ${config.anonKey}`,
      },
      cache: "force-cache",
    },
  );

  if (!response.ok) return null;
  return response;
}
