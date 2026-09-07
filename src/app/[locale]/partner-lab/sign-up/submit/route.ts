import { notFound, redirect } from "next/navigation";
import { requireLocale } from "@/components/site/StaticShellPage";
import { localeHref } from "@/lib/locale";
import { isPartnerSignupEnabled } from "@/lib/partnerSignupFlag";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function signUpHref(locale: "ar" | "en", query: "error" | "created"): string {
  return `${localeHref(locale, "/partner-lab/sign-up")}?${query}=1`;
}

export async function POST(
  request: Request,
  context: { params: Promise<{ locale: string }> },
) {
  if (!isPartnerSignupEnabled()) notFound();
  const locale = await requireLocale(context.params);
  const supabase = await createSupabaseServerClient();
  if (supabase === null) {
    redirect(signUpHref(locale, "error"));
  }

  const form = await request.formData();
  for (const key of form.keys()) {
    if (key !== "email" && key !== "password") {
      redirect(signUpHref(locale, "error"));
    }
  }

  const emailValue = form.get("email");
  const passwordValue = form.get("password");
  if (typeof emailValue !== "string" || typeof passwordValue !== "string") {
    redirect(signUpHref(locale, "error"));
  }

  const email = emailValue.trim();
  const password = passwordValue;
  if (email.length === 0 || password.length === 0) {
    redirect(signUpHref(locale, "error"));
  }

  const { error } = await supabase.auth.signUp({ email, password });
  if (error) {
    redirect(signUpHref(locale, "error"));
  }

  redirect(signUpHref(locale, "created"));
}

export function GET() {
  return new Response(null, { status: 405 });
}
