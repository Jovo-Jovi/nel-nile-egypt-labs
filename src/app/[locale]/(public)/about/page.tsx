import type { Metadata } from "next";
import { localizedText } from "@/lib/listingFormat";
import { pageMetadata } from "@/lib/pageMetadata";
import { publishedSiteSettings } from "@/lib/publishedListings";
import { requireLocale } from "@/components/site/StaticShellPage";
import { CopyCard, InfoPage, PendingSlot } from "@/components/site/InfoPage";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await requireLocale(params);
  return pageMetadata(locale, "page.about.title", "/about");
}

export default async function Page({ params }: Props) {
  const locale = await requireLocale(params);
  const settings = await publishedSiteSettings();
  const aboutCopy =
    settings?.aboutBodyAr && settings.aboutBodyEn
      ? localizedText(locale, settings.aboutBodyAr, settings.aboutBodyEn)
      : null;

  return (
    <InfoPage locale={locale} titleKey="page.about.title">
      {aboutCopy ? (
        <CopyCard locale={locale} body={aboutCopy} />
      ) : (
        <PendingSlot locale={locale} pendingLabelKey="approval.pending.businessData" />
      )}
    </InfoPage>
  );
}
