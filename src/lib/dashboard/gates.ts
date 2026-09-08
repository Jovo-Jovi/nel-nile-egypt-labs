import { redirect } from "next/navigation";
import { localeHref, type Locale } from "@/lib/locale";
import type { OperatorAccess } from "./assurance";

export const NOT_OPERATOR_REASON = "not-operator";

export function notOperatorSignInHref(locale: Locale): string {
  return `${localeHref(locale, "/dashboard/sign-in")}?reason=${NOT_OPERATOR_REASON}`;
}

export function gateSignInPage(access: OperatorAccess, locale: Locale): void {
  if (!access.signedIn) return;
  // Non-Operator sessions belong on the PartnerLab status / Offers
  // surface, never on the Operator sign-in form. Operator order below
  // is unchanged (M7C).
  if (!access.isOperator) redirect(localeHref(locale, "/offers"));
  if (!access.hasVerifiedTotp) redirect(localeHref(locale, "/dashboard/enrol"));
  if (access.currentLevel !== "aal2") redirect(localeHref(locale, "/dashboard/challenge"));
  redirect(localeHref(locale, "/dashboard"));
}

export function gateEnrolPage(access: OperatorAccess, locale: Locale): void {
  if (!access.signedIn) redirect(localeHref(locale, "/dashboard/sign-in"));
  if (!access.isOperator) redirect(notOperatorSignInHref(locale));
  if (access.hasVerifiedTotp && access.currentLevel === "aal2") {
    redirect(localeHref(locale, "/dashboard"));
  }
  if (access.hasVerifiedTotp) redirect(localeHref(locale, "/dashboard/challenge"));
}

export function gateChallengePage(access: OperatorAccess, locale: Locale): void {
  if (!access.signedIn) redirect(localeHref(locale, "/dashboard/sign-in"));
  if (!access.isOperator) redirect(notOperatorSignInHref(locale));
  if (!access.hasVerifiedTotp) redirect(localeHref(locale, "/dashboard/enrol"));
  if (access.currentLevel === "aal2") redirect(localeHref(locale, "/dashboard"));
}

export function gateModuleRoute(access: OperatorAccess, locale: Locale): void {
  if (!access.signedIn) redirect(localeHref(locale, "/dashboard/sign-in"));
  if (!access.isOperator) redirect(notOperatorSignInHref(locale));
  if (!access.hasVerifiedTotp) redirect(localeHref(locale, "/dashboard/enrol"));
  if (access.currentLevel !== "aal2") redirect(localeHref(locale, "/dashboard/challenge"));
}
