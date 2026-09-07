import { notFound, redirect } from "next/navigation";
import { requireLocale } from "@/components/site/StaticShellPage";
import { localeHref } from "@/lib/locale";
import { isPartnerSignupEnabled } from "@/lib/partnerSignupFlag";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// Hosted Auth also enforces a character-class rule (P08-T06 STEP 1
// returned error_code weak_password). Length is checked here so a short
// password never becomes a signUp request. supabase/config.toml records
// minimum_password_length = 6.
const PASSWORD_MIN_LENGTH = 6;

function signUpHref(locale: "ar" | "en", query: "error" | "created"): string {
  return `${localeHref(locale, "/partner-lab/sign-up")}?${query}=1`;
}

function signUpSafeHref(
  locale: "ar" | "en",
  kind: "password" | "email" | "weak-password",
): string {
  return `${localeHref(locale, "/partner-lab/sign-up")}?error=${kind}`;
}

function isMalformedEmail(email: string): boolean {
  if (email.length === 0) return true;
  if (email.includes(" ")) return true;
  const at = email.indexOf("@");
  if (at <= 0) return true;
  if (email.indexOf("@", at + 1) !== -1) return true;
  const domain = email.slice(at + 1);
  if (domain.length === 0) return true;
  if (!domain.includes(".")) return true;
  if (domain.startsWith(".") || domain.endsWith(".")) return true;
  return false;
}

export async function POST(
  request: Request,
  context: { params: Promise<{ locale: string }> },
) {
  if (!isPartnerSignupEnabled()) notFound();
  const locale = await requireLocale(context.params);
  const supabase = await createSupabaseServerClient();
  if (supabase === null) {
    redirect(signUpHref(locale, "created"));
  }

  const form = await request.formData();
  for (const key of form.keys()) {
    if (key !== "email" && key !== "password") {
      redirect(signUpHref(locale, "error"));
    }
  }

  const emailValue = form.get("email");
  const passwordValue = form.get("password");
  const email = typeof emailValue === "string" ? emailValue.trim() : "";
  const password = typeof passwordValue === "string" ? passwordValue : "";

  // SAFE allowlist — properties of this submission, never of whether the
  // address is known. A code this project has not seen is not assumed safe.
  //
  //   1. malformed email, checked locally, so it costs no request
  //   2. password shorter than PASSWORD_MIN_LENGTH, checked locally
  //   3. weak_password — the exact error_code P08-T06 STEP 1 returned from
  //      POST /auth/v1/signup (HTTP 422). That code is a character-class
  //      rule on the password string. It says nothing about whether the
  //      address is already registered, so it may produce a distinct
  //      response. Any other Auth code, including already-registered,
  //      throttles, project settings, and every unrecognised value, is
  //      NEUTRAL and shares ?created=1 with success (OD-18 §6).
  //
  // Diagnosis in production comes from the platform's own auth logs,
  // server-side, outside this application. Do not add logging here.

  if (isMalformedEmail(email)) {
    redirect(signUpSafeHref(locale, "email"));
  }
  if (password.length < PASSWORD_MIN_LENGTH) {
    redirect(signUpSafeHref(locale, "password"));
  }

  let signUpErrorCode: string | undefined;
  try {
    const { error } = await supabase.auth.signUp({ email, password });
    signUpErrorCode = error?.code;
  } catch {
    redirect(signUpHref(locale, "created"));
  }

  if (signUpErrorCode === "weak_password") {
    redirect(signUpSafeHref(locale, "weak-password"));
  }

  redirect(signUpHref(locale, "created"));
}

export function GET() {
  return new Response(null, { status: 405 });
}
