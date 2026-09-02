import type { Metadata } from "next";
import { pageMetadata } from "@/lib/pageMetadata";
import { localizedText } from "@/lib/listingFormat";
import { listPublishedEquipment, posterAlt, posterSrc } from "@/lib/publishedListings";
import { requireLocale } from "@/components/site/StaticShellPage";
import { PublishedListingPage } from "@/components/site/PublishedListingPage";
import { EquipmentCard } from "@/components/ui/EquipmentCard";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await requireLocale(params);
  return pageMetadata(locale, "page.equipment.title", "/equipment");
}

export default async function Page({ params }: Props) {
  const locale = await requireLocale(params);
  const rows = await listPublishedEquipment();

  return (
    <PublishedListingPage
      locale={locale}
      titleKey="page.equipment.title"
      pendingLabelKey="approval.pending.businessData"
      isEmpty={rows.length === 0}
    >
      {rows.map((row) => (
        <li key={row.id}>
          <EquipmentCard
            locale={locale}
            name={localizedText(locale, row.nameAr, row.nameEn)}
            description={localizedText(locale, row.descriptionAr, row.descriptionEn)}
            posterSrc={posterSrc(row.poster)}
            posterAlt={posterAlt(locale, row.poster)}
          />
        </li>
      ))}
    </PublishedListingPage>
  );
}
