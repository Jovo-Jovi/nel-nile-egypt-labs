import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { operatorCookieOptions, supabasePublicEnv } from "./env";

export async function createSupabaseServerClient() {
  const env = supabasePublicEnv();
  if (env === null) return null;

  const cookieStore = await cookies();

  return createServerClient(env.url, env.anonKey, {
    cookieOptions: operatorCookieOptions(),
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet, _headers) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components cannot write cookies; src/middleware.ts does.
        }
      },
    },
  });
}
