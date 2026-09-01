import type { Metadata } from "next";
import { pageMetadata } from "@/lib/pageMetadata";
import { localizedText } from "@/lib/listingFormat";
import { listPublishedLabUnits } from "@/lib/publishedListings";
import { requireLocale } from "@/components/site/StaticShellPage";
import { PublishedListingPage } from "@/components/site/PublishedListingPage";
import { LabUnitCard } from "@/components/ui/LabUnitCard";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await requireLocale(params);
  return pageMetadata(locale, "page.departments.title", "/departments");
}

export default async function Page({ params }: Props) {
  const locale = await requireLocale(params);
  const rows = await listPublishedLabUnits();

  return (
    <PublishedListingPage
      locale={locale}
      titleKey="page.departments.title"
      pendingLabelKey="approval.pending.businessData"
      isEmpty={rows.length === 0}
    >
      {rows.map((row) => (
        <li key={row.id}>
          <LabUnitCard
            locale={locale}
            name={localizedText(locale, row.nameAr, row.nameEn)}
            description={localizedText(locale, row.descriptionAr, row.descriptionEn)}
          />
        </li>
      ))}
    </PublishedListingPage>
  );
}
