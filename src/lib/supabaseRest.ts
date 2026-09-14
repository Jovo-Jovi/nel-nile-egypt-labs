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
  | "MediaAsset"
  | "Announcement";

export type PublishedFetchCache = "force-cache" | "no-store";

// Three attempts, 100 ms backoff, Retry-After capped at 250 ms. Worst-case
// added wall time is 500 ms per in-flight fetch (two waits at the cap).
// That is enough to absorb a single 504 blip without stalling a 24-page
// static build, and a deterministic 4xx still fails on the first response.
export const PUBLISHED_FETCH_MAX_ATTEMPTS = 3;
export const PUBLISHED_FETCH_BACKOFF_MS = 100;
export const PUBLISHED_FETCH_RETRY_AFTER_CAP_MS = 250;

export type PublishedFetchDeps = {
  fetcher?: typeof fetch;
  sleep?: (ms: number) => Promise<void>;
};

function sleepMs(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function isTransientStatus(status: number): boolean {
  return (
    status === 408 ||
    status === 429 ||
    status === 500 ||
    status === 502 ||
    status === 503 ||
    status === 504
  );
}

function waitAfterTransient(status: number, retryAfterHeader: string | null): number {
  if (status !== 429) return PUBLISHED_FETCH_BACKOFF_MS;
  if (retryAfterHeader === null) return PUBLISHED_FETCH_BACKOFF_MS;
  if (retryAfterHeader.length === 0) return PUBLISHED_FETCH_BACKOFF_MS;
  const seconds = Number.parseInt(retryAfterHeader, 10);
  if (Number.isNaN(seconds)) return PUBLISHED_FETCH_BACKOFF_MS;
  if (seconds < 0) return PUBLISHED_FETCH_BACKOFF_MS;
  const requestedMs = seconds * 1000;
  if (requestedMs > PUBLISHED_FETCH_RETRY_AFTER_CAP_MS) {
    return PUBLISHED_FETCH_RETRY_AFTER_CAP_MS;
  }
  return requestedMs;
}

function publishedQueryFailed(
  table: PublishedTable,
  detail: string,
  attempts: number,
): Error {
  return new Error(`published ${table} query failed: ${detail} after ${attempts} attempts`);
}

// Published-only. The publication_state filter is appended here so a
// caller cannot omit it. Unpublished rows are never selected (PR-08).
export async function fetchAnonPublishedJson(
  table: PublishedTable,
  selectAndOrder: string,
  cache: PublishedFetchCache = "force-cache",
  deps: PublishedFetchDeps = {},
): Promise<unknown> {
  const config = supabaseRestConfig();
  if (config === null) return [];

  const fetcher = deps.fetcher !== undefined ? deps.fetcher : globalThis.fetch.bind(globalThis);
  const sleep = deps.sleep !== undefined ? deps.sleep : sleepMs;
  const endpoint = `${config.url}/rest/v1/${table}?${selectAndOrder}&publication_state=eq.published`;
  const requestInit: RequestInit = {
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
    // SECURITY_MODEL.md §3's invariant, not a freshness preference.
    //
    // A force-dynamic route with an infinitely-cached fetch beneath it
    // serves a frozen payload, so the lab's edits never reach the Main
    // Page. The static floor the default protects is still real and still
    // applies to SSG (●) routes. Those callers keep the default.
    // Force-dynamic listing callers pass no-store. The detail route
    // already does.
    //
    // Every static page reads through this helper at build time via
    // SiteRoot, so one transient failure fails the whole deployment. The
    // retry is for transport flakiness only (network throw; 408, 429,
    // 500, 502, 503, 504). A deterministic failure (400, 401, 403, 404)
    // still fails fast. Exhaustion throws with the original status and
    // the attempt count; it never returns [], null, a default, or a
    // partial result. P06-T09-F removed a catch-to-empty on the
    // Programme listing for the same reason (CF-99).
    cache,
  };

  for (let attempt = 1; attempt <= PUBLISHED_FETCH_MAX_ATTEMPTS; attempt += 1) {
    let response: Response;
    try {
      response = await fetcher(endpoint, requestInit);
    } catch {
      if (attempt === PUBLISHED_FETCH_MAX_ATTEMPTS) {
        throw publishedQueryFailed(table, "network", attempt);
      }
      await sleep(PUBLISHED_FETCH_BACKOFF_MS);
      continue;
    }

    if (response.ok) {
      return response.json();
    }

    if (!isTransientStatus(response.status) || attempt === PUBLISHED_FETCH_MAX_ATTEMPTS) {
      throw publishedQueryFailed(table, String(response.status), attempt);
    }

    await sleep(waitAfterTransient(response.status, response.headers.get("Retry-After")));
  }

  throw publishedQueryFailed(table, "exhausted", PUBLISHED_FETCH_MAX_ATTEMPTS);
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
