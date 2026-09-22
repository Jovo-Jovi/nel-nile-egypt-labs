import { redirect } from "next/navigation";
import { requireLocale } from "@/components/site/StaticShellPage";
import { readOperatorAccessFrom } from "@/lib/dashboard/assurance";
import { gateSignInPage } from "@/lib/dashboard/gates";
import { localeHref } from "@/lib/locale";
import { resolvePartnerLabSignInIdentifier } from "@/lib/partnerLabSignInIdentifier";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function signInFailedHref(locale: "ar" | "en"): string {
  return `${localeHref(locale, "/partner-lab/sign-in")}?error=1`;
}

export async function POST(
  request: Request,
  context: { params: Promise<{ locale: string }> },
) {
  const locale = await requireLocale(context.params);
  const supabase = await createSupabaseServerClient();
  if (supabase === null) {
    redirect(signInFailedHref(locale));
  }

  const form = await request.formData();
  // BOUNDARY_MODEL.md §2 evidence item 9. Proved by reading this handler,
  // not the form. The fields read are the sign-in identifier (posted as
  // `email`, an authentication credential that may be an email address or
  // a numeric identifier) and `password`. Nothing else is read.
  const identifier = String(form.get("email") ?? "");
  const password = String(form.get("password") ?? "");
  const resolved = resolvePartnerLabSignInIdentifier(identifier);
  if (resolved.outcome === "neutral") {
    redirect(signInFailedHref(locale));
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: resolved.address,
    password,
  });
  if (error) {
    redirect(signInFailedHref(locale));
  }

  const access = await readOperatorAccessFrom(supabase);
  if (!access.signedIn) {
    redirect(signInFailedHref(locale));
  }
  if (access.isOperator) {
    gateSignInPage(access, locale);
  }
  redirect(localeHref(locale, "/offers"));
}

export function GET() {
  return new Response(null, { status: 405 });
}
