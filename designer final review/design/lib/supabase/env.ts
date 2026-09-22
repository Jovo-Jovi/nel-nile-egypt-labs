// Publishable credentials only. The service-role key is never read here.
// The URL is an environment value, never a literal (OD-04 condition 1).

export type SupabasePublicEnv = { url: string; anonKey: string };

export const OPERATOR_SESSION_COOKIE = "nel-operator-session";

// ADMIN_SPEC.md §3e — idle sessions expire. Absolute cookie lifetime; GoTrue
// inactivity_timeout in config.toml is the matching Auth-side bound.
export const OPERATOR_SESSION_MAX_AGE_SECONDS = 30 * 60;

export function supabasePublicEnv(): SupabasePublicEnv | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.SUPABASE_ANON_KEY;
  if (typeof url !== "string" || url.length === 0) return null;
  if (typeof anonKey !== "string" || anonKey.length === 0) return null;
  return { url: url.replace(/\/$/, ""), anonKey };
}

export function operatorCookieOptions() {
  return {
    name: OPERATOR_SESSION_COOKIE,
    path: "/",
    sameSite: "lax" as const,
    httpOnly: true,
    maxAge: OPERATOR_SESSION_MAX_AGE_SECONDS,
  };
}
