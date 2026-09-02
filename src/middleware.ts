import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { operatorCookieOptions, supabasePublicEnv } from "@/lib/supabase/env";

// Cookie refresh only. Assurance is enforced in server layouts, not here.
// A skipped middleware cannot grant aal2; the layout reads the JWT.

export async function middleware(request: NextRequest) {
  const env = supabasePublicEnv();
  let response = NextResponse.next({ request });
  if (env === null) return response;

  const supabase = createServerClient(env.url, env.anonKey, {
    cookieOptions: operatorCookieOptions(),
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
        Object.entries(headers).forEach(([key, value]) => {
          response.headers.set(key, value);
        });
      },
    },
  });

  await supabase.auth.getClaims();
  return response;
}

export const config = {
  matcher: ["/ar/dashboard", "/ar/dashboard/:path*", "/en/dashboard", "/en/dashboard/:path*"],
};
