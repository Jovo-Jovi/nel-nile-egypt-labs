import type { Metadata } from "next";
import { pageMetadata } from "@/lib/pageMetadata";
import { localizedText } from "@/lib/listingFormat";
import { listPublishedAnnouncements, posterAlt, posterSrc } from "@/lib/publishedListings";
import { requireLocale } from "@/components/site/StaticShellPage";
import { PublishedListingPage } from "@/components/site/PublishedListingPage";
import { EquipmentCard } from "@/components/ui/EquipmentCard";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await requireLocale(params);
  return pageMetadata(locale, "page.announcements.title", "/announcements");
}

export default async function Page({ params }: Props) {
  const locale = await requireLocale(params);
  const rows = await listPublishedAnnouncements();

  return (
    <PublishedListingPage
      locale={locale}
      titleKey="page.announcements.title"
      pendingLabelKey="approval.pending.newsModule"
      isEmpty={rows.length === 0}
    >
      {rows.map((row) => (
        <li key={row.id}>
          <EquipmentCard
            locale={locale}
            name={localizedText(locale, row.titleAr, row.titleEn)}
            description={localizedText(locale, row.bodyAr, row.bodyEn)}
            posterSrc={posterSrc(row.poster)}
            posterAlt={posterAlt(locale, row.poster)}
          />
        </li>
      ))}
    </PublishedListingPage>
  );
}
