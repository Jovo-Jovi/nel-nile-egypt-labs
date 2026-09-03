// View-model for header and footer. Reads through publishedSiteSettings,
// which uses fetchAnonPublishedJson and still appends
// publication_state=eq.published where a caller cannot omit it (PR-08).
// Not a second REST helper.

import type { CatalogKey } from "@/lib/catalog";
import type { Locale } from "@/lib/locale";
import { localizedText } from "@/lib/listingFormat";
import { publishedSiteSettings, type PublishedSiteSettings } from "@/lib/publishedListings";
import { buildWhatsAppHref } from "@/lib/whatsappLink";

export type PublicSocialLink = {
  href: string;
  labelKey: CatalogKey;
};

export type PublicChrome = {
  whatsappHref: string | null;
  hotline: string | null;
  hours: string | null;
  social: PublicSocialLink[];
};

function socialFromSettings(settings: PublishedSiteSettings): PublicSocialLink[] {
  const links: PublicSocialLink[] = [];
  if (settings.facebookUrl !== null) {
    links.push({ href: settings.facebookUrl, labelKey: "contact.facebook" });
  }
  if (settings.instagramUrl !== null) {
    links.push({ href: settings.instagramUrl, labelKey: "contact.instagram" });
  }
  if (settings.linkedinUrl !== null) {
    links.push({ href: settings.linkedinUrl, labelKey: "contact.linkedin" });
  }
  if (settings.youtubeUrl !== null) {
    links.push({ href: settings.youtubeUrl, labelKey: "contact.youtube" });
  }
  return links;
}

export function chromeFromPublishedSettings(
  settings: PublishedSiteSettings | null,
  locale: Locale,
): PublicChrome {
  if (settings === null) {
    return { whatsappHref: null, hotline: null, hours: null, social: [] };
  }
  const message = locale === "ar" ? settings.whatsappMessageAr : settings.whatsappMessageEn;
  const hours =
    settings.hoursAr !== null && settings.hoursEn !== null
      ? localizedText(locale, settings.hoursAr, settings.hoursEn)
      : null;
  return {
    whatsappHref: buildWhatsAppHref(settings.whatsappE164, message),
    hotline: settings.hotline,
    hours,
    social: socialFromSettings(settings),
  };
}

export async function loadPublicChrome(locale: Locale): Promise<PublicChrome> {
  const settings = await publishedSiteSettings();
  return chromeFromPublishedSettings(settings, locale);
}
