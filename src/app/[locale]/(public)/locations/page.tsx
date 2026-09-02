import type { Metadata } from "next";
import { pageMetadata } from "@/lib/pageMetadata";
import { translate, type CatalogKey } from "@/lib/catalog";
import { localizedText } from "@/lib/listingFormat";
import { branchMapPins, listPublishedBranches } from "@/lib/publishedListings";
import { requireLocale } from "@/components/site/StaticShellPage";
import { PublishedListingPage } from "@/components/site/PublishedListingPage";
import listing from "@/components/site/PublishedListingPage.module.css";
import { ApprovalGate } from "@/components/ui/ApprovalGate";
import { BranchCard } from "@/components/ui/BranchCard";
import { GreaterCairoMap } from "@/components/ui/GreaterCairoMap";

type Props = { params: Promise<{ locale: string }> };

// ViewBox geometry for district labels on the drawing, not Branch
// locations. The same schematic positions SiteHome already passes.
const DISTRICT_LABEL_KEYS: { id: string; x: number; y: number; key: CatalogKey }[] = [
  { id: "giza", x: 22, y: 30, key: "locations.map.district.giza" },
  { id: "cairo", x: 60, y: 26, key: "locations.map.district.cairo" },
  { id: "maadi", x: 56, y: 74, key: "locations.map.district.maadi" },
];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await requireLocale(params);
  return pageMetadata(locale, "page.locations.title", "/locations");
}

export default async function Page({ params }: Props) {
  const locale = await requireLocale(params);
  const rows = await listPublishedBranches();
  const pins = branchMapPins(rows, locale);

  const map =
    pins.length === 0 ? (
      <ApprovalGate locale={locale} state="pending" pendingLabelKey="approval.pending.businessData">
        <div className={listing.mapFrame} />
      </ApprovalGate>
    ) : (
      <div className={listing.mapFrame}>
        <GreaterCairoMap
          ariaLabel={translate(locale, "locations.map.ariaLabel")}
          pinLabel={translate(locale, "locations.map.pinLabel")}
          headOfficePinLabel={translate(locale, "locations.map.headOfficePinLabel")}
          districtLabels={DISTRICT_LABEL_KEYS.map(({ id, x, y, key }) => ({
            id,
            x,
            y,
            label: translate(locale, key),
          }))}
          pins={pins}
        />
      </div>
    );

  return (
    <PublishedListingPage
      locale={locale}
      titleKey="page.locations.title"
      pendingLabelKey="approval.pending.businessData"
      isEmpty={rows.length === 0}
      lead={map}
    >
      {rows.map((row) => (
        <li key={row.id}>
          <BranchCard
            locale={locale}
            name={localizedText(locale, row.nameAr, row.nameEn)}
            isHeadOffice={row.isHeadOffice}
          />
        </li>
      ))}
    </PublishedListingPage>
  );
}
