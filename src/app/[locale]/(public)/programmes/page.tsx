import type { Metadata } from "next";
import { pageMetadata } from "@/lib/pageMetadata";
import { isLabTestContentEnabled } from "@/lib/clinicalFlag";
import { localizedText } from "@/lib/listingFormat";
import { localeHref } from "@/lib/locale";
import { listPublishedProgrammes } from "@/lib/publishedListings";
import { readCatalogueIndexArtefact } from "@/lib/readCatalogueIndexArtefact";
import { requireLocale } from "@/components/site/StaticShellPage";
import { PublishedListingPage } from "@/components/site/PublishedListingPage";
import { ProgrammeSearch } from "@/components/site/ProgrammeSearch";
import { ProgrammeCard } from "@/components/ui/ProgrammeCard";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await requireLocale(params);
  return pageMetadata(locale, "page.programmes.title", "/programmes");
}

export default async function Page({ params }: Props) {
  const locale = await requireLocale(params);
  const rows = await listPublishedProgrammes();

  const programmeNames = Object.fromEntries(
    rows.map((row) => [row.slug, { nameAr: row.nameAr, nameEn: row.nameEn }]),
  );

  // Flag off: do not read the artefact and do not render search. The JSON is
  // never a static import, so a missing file cannot fail this module graph.
  const search = isLabTestContentEnabled() ? (
    <ProgrammeSearch
      locale={locale}
      index={await readCatalogueIndexArtefact()}
      programmeNames={programmeNames}
    />
  ) : null;

  return (
    <PublishedListingPage
      locale={locale}
      titleKey="page.programmes.title"
      pendingLabelKey="approval.pending.publishedProgramme"
      isEmpty={rows.length === 0}
      lead={search}
    >
      {rows.map((row) => (
        <li key={row.id}>
          <ProgrammeCard
            locale={locale}
            name={localizedText(locale, row.nameAr, row.nameEn)}
            description={localizedText(locale, row.descriptionAr, row.descriptionEn)}
            href={localeHref(locale, `/programmes/${row.slug}`)}
          />
        </li>
      ))}
    </PublishedListingPage>
  );
}
