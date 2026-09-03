import { redirect } from "next/navigation";
import { localeHref, type Locale } from "@/lib/locale";
import type { OperatorAccess } from "./assurance";

export function gateSignInPage(access: OperatorAccess, locale: Locale): void {
  if (!access.signedIn) return;
  if (!access.hasVerifiedTotp) redirect(localeHref(locale, "/dashboard/enrol"));
  if (access.currentLevel !== "aal2") redirect(localeHref(locale, "/dashboard/challenge"));
  redirect(localeHref(locale, "/dashboard"));
}

export function gateEnrolPage(access: OperatorAccess, locale: Locale): void {
  if (!access.signedIn) redirect(localeHref(locale, "/dashboard/sign-in"));
  if (access.hasVerifiedTotp && access.currentLevel === "aal2") {
    redirect(localeHref(locale, "/dashboard"));
  }
  if (access.hasVerifiedTotp) redirect(localeHref(locale, "/dashboard/challenge"));
}

export function gateChallengePage(access: OperatorAccess, locale: Locale): void {
  if (!access.signedIn) redirect(localeHref(locale, "/dashboard/sign-in"));
  if (!access.hasVerifiedTotp) redirect(localeHref(locale, "/dashboard/enrol"));
  if (access.currentLevel === "aal2") redirect(localeHref(locale, "/dashboard"));
}

export function gateModuleRoute(access: OperatorAccess, locale: Locale): void {
  if (!access.signedIn) redirect(localeHref(locale, "/dashboard/sign-in"));
  if (!access.hasVerifiedTotp) redirect(localeHref(locale, "/dashboard/enrol"));
  if (access.currentLevel !== "aal2") redirect(localeHref(locale, "/dashboard/challenge"));
}
