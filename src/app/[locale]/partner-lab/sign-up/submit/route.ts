import { notFound, redirect } from "next/navigation";
import { requireLocale } from "@/components/site/StaticShellPage";
import { localeHref } from "@/lib/locale";
import { isPartnerSignupEnabled } from "@/lib/partnerSignupFlag";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// Authority: the hosted 422 body at P08-T06 STEP 1 (error_code
// weak_password), NOT supabase/config.toml, which reads
// password_requirements = "" and minimum_password_length = 6 and is
// contradicted by the live project. STRICTER THAN HOSTED IS THE POINT:
// anything that passes locally must pass hosted, so weak_password can
// never be reached and a weak password can never silently produce no
// account.
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_CLASS_LOWER = "abcdefghijklmnopqrstuvwxyz";
const PASSWORD_CLASS_UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const PASSWORD_CLASS_DIGIT = "0123456789";
const PASSWORD_CLASS_SYMBOL = "!@#$%^&*()_+-=[]{};'\\:\"|<>?,./`~";

function signUpHref(locale: "ar" | "en", query: "error" | "created"): string {
  return `${localeHref(locale, "/partner-lab/sign-up")}?${query}=1`;
}

function signUpSafeHref(locale: "ar" | "en", kind: "password" | "email"): string {
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

function passwordHasClass(password: string, alphabet: string): boolean {
  for (const character of password) {
    if (alphabet.includes(character)) return true;
  }
  return false;
}

function passwordMissesRequiredClass(password: string): boolean {
  return (
    !passwordHasClass(password, PASSWORD_CLASS_LOWER) ||
    !passwordHasClass(password, PASSWORD_CLASS_UPPER) ||
    !passwordHasClass(password, PASSWORD_CLASS_DIGIT) ||
    !passwordHasClass(password, PASSWORD_CLASS_SYMBOL)
  );
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
  // Exactly two entries, both decided locally before any request. No Auth
  // response code is on the list. A local check cannot vary on whether an
  // address is known, so OD-18 §6 holds by construction rather than by
  // measurement.
  //
  //   1. malformed email, checked locally, so it costs no request
  //   2. password strength, checked locally: length at least
  //      PASSWORD_MIN_LENGTH, then the four character classes taken
  //      verbatim from the hosted 422 body at P08-T06 STEP 1
  //
  // weak_password is NEUTRAL. After the two local checks, every path
  // shares ?created=1: success, already-registered, throttles,
  // weak_password, unrecognised codes, and a thrown exception.
  //
  // Diagnosis in production comes from the platform's own auth logs,
  // server-side, outside this application. Do not add logging here.

  if (isMalformedEmail(email)) {
    redirect(signUpSafeHref(locale, "email"));
  }
  if (password.length < PASSWORD_MIN_LENGTH) {
    redirect(signUpSafeHref(locale, "password"));
  }
  if (passwordMissesRequiredClass(password)) {
    redirect(signUpSafeHref(locale, "password"));
  }

  try {
    await supabase.auth.signUp({ email, password });
  } catch {
    redirect(signUpHref(locale, "created"));
  }

  redirect(signUpHref(locale, "created"));
}

export function GET() {
  return new Response(null, { status: 405 });
}
