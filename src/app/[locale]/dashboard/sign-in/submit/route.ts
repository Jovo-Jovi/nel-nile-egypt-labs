import { redirect } from "next/navigation";
import { requireLocale } from "@/components/site/StaticShellPage";
import { readOperatorAccessFrom } from "@/lib/dashboard/assurance";
import { gateSignInPage } from "@/lib/dashboard/gates";
import { localeHref } from "@/lib/locale";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  context: { params: Promise<{ locale: string }> },
) {
  const locale = await requireLocale(context.params);
  const supabase = await createSupabaseServerClient();
  if (supabase === null) {
    redirect(`${localeHref(locale, "/dashboard/sign-in")}?error=1`);
  }

  const form = await request.formData();
  const email = String(form.get("email") ?? "");
  const password = String(form.get("password") ?? "");

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    redirect(`${localeHref(locale, "/dashboard/sign-in")}?error=1`);
  }

  const access = await readOperatorAccessFrom(supabase);
  if (!access.signedIn) {
    redirect(`${localeHref(locale, "/dashboard/sign-in")}?error=1`);
  }
  gateSignInPage(access, locale);
}

export function GET() {
  return new Response(null, { status: 405 });
}
