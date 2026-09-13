// View-model for header and footer. Reads through publishedSiteSettings,
// which uses fetchAnonPublishedJson and still appends
// publication_state=eq.published where a caller cannot omit it (PR-08).
// Not a second REST helper.

import type { CatalogKey } from "@/lib/catalog";
import type { Locale } from "@/lib/locale";
import { localizedText } from "@/lib/listingFormat";
import {
  listPublishedBranches,
  publishedSiteSettings,
  type PublishedBranch,
  type PublishedSiteSettings,
} from "@/lib/publishedListings";
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
  aboutBody: string | null;
  // Head-office Branch.address_ar / address_en. Footer and the home
  // find-a-branch standfirst render these fields; they are not a
  // site-wide flag.
  headOfficeAddress: string | null;
};

function localizedHeadOfficeField(
  branches: readonly PublishedBranch[],
  locale: Locale,
  pickAr: (row: PublishedBranch) => string | null,
  pickEn: (row: PublishedBranch) => string | null,
): string | null {
  const head = branches.find((row) => row.isHeadOffice);
  if (head === undefined) return null;
  const ar = pickAr(head);
  const en = pickEn(head);
  if (ar === null || en === null) return null;
  return localizedText(locale, ar, en);
}

export function headOfficeAddressFromBranches(
  branches: readonly PublishedBranch[],
  locale: Locale,
): string | null {
  return localizedHeadOfficeField(
    branches,
    locale,
    (row) => row.addressAr,
    (row) => row.addressEn,
  );
}

export function headOfficeHoursFromBranches(
  branches: readonly PublishedBranch[],
  locale: Locale,
): string | null {
  return localizedHeadOfficeField(branches, locale, (row) => row.hoursAr, (row) => row.hoursEn);
}

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
  branches: readonly PublishedBranch[] = [],
): PublicChrome {
  const headOfficeAddress = headOfficeAddressFromBranches(branches, locale);
  if (settings === null) {
    return {
      whatsappHref: null,
      hotline: null,
      hours: null,
      social: [],
      aboutBody: null,
      headOfficeAddress,
    };
  }
  const message = locale === "ar" ? settings.whatsappMessageAr : settings.whatsappMessageEn;
  const hours =
    settings.hoursAr !== null && settings.hoursEn !== null
      ? localizedText(locale, settings.hoursAr, settings.hoursEn)
      : null;
  const aboutBody =
    settings.aboutBodyAr !== null && settings.aboutBodyEn !== null
      ? localizedText(locale, settings.aboutBodyAr, settings.aboutBodyEn)
      : null;
  return {
    whatsappHref: buildWhatsAppHref(settings.whatsappE164, message),
    hotline: settings.hotline,
    hours,
    social: socialFromSettings(settings),
    aboutBody,
    headOfficeAddress,
  };
}

export async function loadPublicChrome(locale: Locale): Promise<PublicChrome> {
  const [settings, branches] = await Promise.all([publishedSiteSettings(), listPublishedBranches()]);
  return chromeFromPublishedSettings(settings, locale, branches);
}
