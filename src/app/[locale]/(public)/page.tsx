import type { Metadata } from "next";
import { localizedText } from "@/lib/listingFormat";
import { pageMetadata } from "@/lib/pageMetadata";
import { publishedSiteSettings } from "@/lib/publishedListings";
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
  return <SiteHome locale={locale} />;
}
