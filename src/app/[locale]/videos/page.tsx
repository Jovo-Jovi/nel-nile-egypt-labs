import type { Metadata } from "next";
import { pageMetadata } from "@/lib/pageMetadata";
import { localizedText } from "@/lib/listingFormat";
import { listPublishedVideos, posterAlt, posterSrc } from "@/lib/publishedListings";
import { requireLocale } from "@/components/site/StaticShellPage";
import { PublishedListingPage } from "@/components/site/PublishedListingPage";
import { VideoCard } from "@/components/ui/VideoCard";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await requireLocale(params);
  return pageMetadata(locale, "page.videos.title", "/videos");
}

export default async function Page({ params }: Props) {
  const locale = await requireLocale(params);
  const rows = await listPublishedVideos();

  return (
    <PublishedListingPage
      locale={locale}
      titleKey="page.videos.title"
      pendingLabelKey="approval.pending.videoAsset"
      isEmpty={rows.length === 0}
    >
      {rows.map((row) => (
        <li key={row.id}>
          <VideoCard
            locale={locale}
            title={localizedText(locale, row.titleAr, row.titleEn)}
            description={localizedText(locale, row.descriptionAr, row.descriptionEn)}
            posterSrc={posterSrc(row.poster)}
            posterAlt={posterAlt(locale, row.poster)}
          />
        </li>
      ))}
    </PublishedListingPage>
  );
}
