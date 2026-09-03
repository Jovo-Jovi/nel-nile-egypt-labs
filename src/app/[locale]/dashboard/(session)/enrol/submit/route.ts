import { redirect } from "next/navigation";
import { requireLocale } from "@/components/site/StaticShellPage";
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
    redirect(`${localeHref(locale, "/dashboard/enrol")}?error=1`);
  }

  const form = await request.formData();
  const factorId = String(form.get("factorId") ?? "");
  const code = String(form.get("code") ?? "").trim();

  const challenge = await supabase.auth.mfa.challenge({ factorId });
  if (challenge.error || challenge.data === null) {
    redirect(`${localeHref(locale, "/dashboard/enrol")}?error=1`);
  }

  const verified = await supabase.auth.mfa.verify({
    factorId,
    challengeId: challenge.data.id,
    code,
  });
  if (verified.error) {
    redirect(`${localeHref(locale, "/dashboard/enrol")}?error=1`);
  }

  redirect(localeHref(locale, "/dashboard"));
}

export function GET() {
  return new Response(null, { status: 405 });
}
