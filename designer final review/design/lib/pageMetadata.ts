import type { Metadata } from "next";
import { translate, type CatalogKey } from "./catalog";
import { localeHref, type Locale } from "./locale";

export function pageMetadata(locale: Locale, titleKey: CatalogKey, suffix: string): Metadata {
  return {
    title: translate(locale, titleKey),
    alternates: {
      canonical: localeHref(locale, suffix),
      languages: {
        ar: localeHref("ar", suffix),
        en: localeHref("en", suffix),
        "x-default": localeHref("ar", suffix),
      },
    },
  };
}
