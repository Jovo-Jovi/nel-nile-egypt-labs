import type { Metadata } from "next";
import { pageMetadata } from "@/lib/pageMetadata";
import { localizedText } from "@/lib/listingFormat";
import { listPublishedProgrammes } from "@/lib/publishedListings";
import { requireLocale } from "@/components/site/StaticShellPage";
import { PublishedListingPage } from "@/components/site/PublishedListingPage";
import { ProgrammeCard } from "@/components/ui/ProgrammeCard";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await requireLocale(params);
  return pageMetadata(locale, "page.programmes.title", "/programmes");
}

export default async function Page({ params }: Props) {
  const locale = await requireLocale(params);
  const rows = await listPublishedProgrammes();

  return (
    <PublishedListingPage
      locale={locale}
      titleKey="page.programmes.title"
      pendingLabelKey="approval.pending.clinical"
      isEmpty={rows.length === 0}
    >
      {rows.map((row) => (
        <li key={row.id}>
          <ProgrammeCard
            locale={locale}
            name={localizedText(locale, row.nameAr, row.nameEn)}
            description={localizedText(locale, row.descriptionAr, row.descriptionEn)}
          />
        </li>
      ))}
    </PublishedListingPage>
  );
}
