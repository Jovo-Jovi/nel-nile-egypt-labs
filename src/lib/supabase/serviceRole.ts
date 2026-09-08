import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { supabasePublicEnv } from "./env";

// Server-only Auth Admin client. The service-role key is read from
// SUPABASE_SERVICE_ROLE_KEY, never NEXT_PUBLIC_*. Do not import this
// module from a Client Component or from any file under
// src/app/[locale]/partner-lab/.

export function createSupabaseServiceRoleClient(): SupabaseClient | null {
  const env = supabasePublicEnv();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (env === null) return null;
  if (typeof serviceRoleKey !== "string" || serviceRoleKey.length === 0) return null;
  return createClient(env.url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
