import type { Locale } from "./catalog";

export type { Locale };

export const LOCALES: readonly Locale[] = ["ar", "en"];

export function isLocale(value: string): value is Locale {
  return value === "ar" || value === "en";
}

export function dirForLocale(locale: Locale): "rtl" | "ltr" {
  return locale === "ar" ? "rtl" : "ltr";
}

export function localeHref(locale: Locale, suffix: string): string {
  return suffix === "" ? `/${locale}` : `/${locale}${suffix}`;
}
