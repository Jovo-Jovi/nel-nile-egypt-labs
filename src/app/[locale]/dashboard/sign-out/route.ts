import { redirect } from "next/navigation";
import { requireLocale } from "@/components/site/StaticShellPage";
import { localeHref } from "@/lib/locale";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(
  _request: Request,
  context: { params: Promise<{ locale: string }> },
) {
  const locale = await requireLocale(context.params);
  const supabase = await createSupabaseServerClient();
  if (supabase !== null) {
    await supabase.auth.signOut({ scope: "global" });
  }
  redirect(localeHref(locale, "/dashboard/sign-in"));
}

export function GET() {
  return new Response(null, { status: 405 });
}
