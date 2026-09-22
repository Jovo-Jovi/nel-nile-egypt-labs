import { notFound, redirect } from "next/navigation";
import { requireLocale } from "@/components/site/StaticShellPage";
import { localeHref } from "@/lib/locale";
import { isPartnerSignupEnabled } from "@/lib/partnerSignupFlag";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// Hosted password policy read from the Supabase dashboard
// (Authentication → Policies) on 9 September 2026 by the human:
// minimum length 12. Character classes as configured there.
// Authoritative per CF-158; supabase/config.toml is not — it declares
// password_requirements = "" and minimum_password_length = 6 and is
// contradicted by the live project.
//
// That attestation is recorded here verbatim. The hosted minimum was
// neither inferred nor taken from config.toml.
//
// PASSWORD_MIN_LENGTH is 12. Comparison: local ≥ hosted (equal). The
// four character-class checks stay regardless of the hosted class
// setting — stricter is always safe, weaker fails silently.
//
// INVARIANT: weak_password is NEUTRAL under OD-18 §6, so any password
// that passes the local check and fails hosted returns ?created=1 with
// no account created. The local rule being at least as strict as hosted
// is the only thing that makes NEUTRAL safe. If the two ever diverge
// again, signup fails silently and nothing surfaces it.
const PASSWORD_MIN_LENGTH = 12;
const PASSWORD_CLASS_LOWER = "abcdefghijklmnopqrstuvwxyz";
const PASSWORD_CLASS_UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const PASSWORD_CLASS_DIGIT = "0123456789";
const PASSWORD_CLASS_SYMBOL = "!@#$%^&*()_+-=[]{};'\\:\"|<>?,./`~";

function signUpHref(locale: "ar" | "en", query: "error" | "created"): string {
  return `${localeHref(locale, "/partner-lab/sign-up")}?${query}=1`;
}

function signUpSafeHref(
  locale: "ar" | "en",
  kind: "password" | "email" | "confirm",
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
  // BOUNDARY_MODEL.md §2 evidence item 9, restated at P08-T11, not
  // inherited from 7e24066. The loop is no longer byte-identical to that
  // commit. Item 9 now reads: the handler accepts no field that is not an
  // authentication credential. `confirm_password` is the same credential
  // typed twice, not new data about anyone. That widening is a reviewer
  // decision at P08-T11 under the human's instruction of 8 September 2026.
  // Proved by reading this handler, not the form. The path is already on
  // the R3 allowlist; no further grant.
  for (const key of form.keys()) {
    if (key !== "email" && key !== "password" && key !== "confirm_password") {
      redirect(signUpHref(locale, "error"));
    }
  }

  const emailValue = form.get("email");
  const passwordValue = form.get("password");
  const confirmValue = form.get("confirm_password");
  const email = typeof emailValue === "string" ? emailValue.trim() : "";
  const password = typeof passwordValue === "string" ? passwordValue : "";
  const confirmPassword = typeof confirmValue === "string" ? confirmValue : "";

  // SAFE allowlist — properties of this submission, never of whether the
  // address is known. A code this project has not seen is not assumed safe.
  //
  // Exactly three entries, all decided locally before any request. No Auth
  // response code is on the list. A local check cannot vary on whether an
  // address is known, so OD-18 §6 holds by construction rather than by
  // measurement.
  //
  //   1. malformed email, checked locally, so it costs no request
  //   2. password strength, checked locally: length at least
  //      PASSWORD_MIN_LENGTH (12; local ≥ hosted as of the dashboard
  //      read on 9 September 2026), then the four character classes
  //      kept even if hosted is weaker — stricter is always safe
  //   3. confirm_password mismatch, checked locally by comparing the two
  //      copies of the same credential before signUp is called
  //
  // weak_password is NEUTRAL under OD-18 §6. After the three local
  // checks, every path shares ?created=1: success, already-registered,
  // throttles, weak_password, unrecognised codes, and a thrown
  // exception. A password that passes locally and fails hosted therefore
  // returns ?created=1 with no account created. Local ≥ hosted is the
  // only thing that makes that NEUTRAL path safe. If the two ever
  // diverge again, signup fails silently and nothing surfaces it.
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
  if (password !== confirmPassword) {
    redirect(signUpSafeHref(locale, "confirm"));
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
