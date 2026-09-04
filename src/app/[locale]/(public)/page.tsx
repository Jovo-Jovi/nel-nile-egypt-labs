import type { Metadata } from "next";
import { localizedText } from "@/lib/listingFormat";
import { pageMetadata } from "@/lib/pageMetadata";
import {
  listPublishedBranches,
  listPublishedLabUnits,
  listPublishedProgrammes,
  publishedSiteSettings,
} from "@/lib/publishedListings";
import { chromeFromPublishedSettings } from "@/lib/publicChrome";
import { requireLocale } from "@/components/site/StaticShellPage";
import { SiteHome } from "@/components/site/SiteHome";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await requireLocale(params);
  const base = pageMetadata(locale, "page.home.title", "");
  const settings = await publishedSiteSettings();
  if (!settings?.seoTitleAr || !settings.seoTitleEn) return base;
  return {
    ...base,
    title: localizedText(locale, settings.seoTitleAr, settings.seoTitleEn),
    description:
      settings.seoDescriptionAr && settings.seoDescriptionEn
        ? localizedText(locale, settings.seoDescriptionAr, settings.seoDescriptionEn)
        : undefined,
  };
}

export default async function Page({ params }: Props) {
  const locale = await requireLocale(params);
  const [settings, labUnits, branches, programmes] = await Promise.all([
    publishedSiteSettings(),
    listPublishedLabUnits(),
    listPublishedBranches(),
    listPublishedProgrammes(),
  ]);
  const chrome = chromeFromPublishedSettings(settings, locale);
  return (
    <SiteHome
      locale={locale}
      whatsappHref={chrome.whatsappHref}
      aboutBody={chrome.aboutBody}
      labUnits={labUnits.map((row) => ({
        id: row.id,
        name: localizedText(locale, row.nameAr, row.nameEn),
      }))}
      branchCount={branches.length}
      programmeCount={programmes.length}
    />
  );
}
