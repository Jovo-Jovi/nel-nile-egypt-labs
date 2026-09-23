import type { Metadata } from "next";
import { pageMetadata } from "@/lib/pageMetadata";
import { translate, type CatalogKey } from "@/lib/catalog";
import { localizedText } from "@/lib/listingFormat";
import { branchMapPins, listPublishedBranches } from "@/lib/publishedListings";
import { buildWhatsAppHref } from "@/lib/whatsappLink";
import { requireLocale } from "@/components/site/StaticShellPage";
import { PublishedListingPage } from "@/components/site/PublishedListingPage";
import listing from "@/components/site/PublishedListingPage.module.css";
import { ApprovalGate } from "@/components/ui/ApprovalGate";
import { BranchCard } from "@/components/ui/BranchCard";
import { GreaterCairoMap } from "@/components/ui/GreaterCairoMap";

type Props = { params: Promise<{ locale: string }> };

// District names for the drawn map. Positions come from city anchors
// inside GreaterCairoMap, not from Branch rows.
const DISTRICT_LABEL_KEYS: { id: string; key: CatalogKey }[] = [
  { id: "giza", key: "locations.map.district.giza" },
  { id: "cairo", key: "locations.map.district.cairo" },
  { id: "maadi", key: "locations.map.district.maadi" },
  { id: "heliopolis", key: "locations.map.district.heliopolis" },
  { id: "kobba", key: "locations.map.district.kobba" },
];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await requireLocale(params);
  return pageMetadata(locale, "page.locations.title", "/locations");
}

export default async function Page({ params }: Props) {
  const locale = await requireLocale(params);
  const rows = await listPublishedBranches();
  const pins = branchMapPins(rows, locale);
  const mapApproved = pins.length > 0;

  const map = (
    <ApprovalGate
      locale={locale}
      state={mapApproved ? "approved" : "pending"}
      pendingLabelKey="approval.pending.businessData"
    >
      <div className={listing.mapFrame}>
        {mapApproved ? (
          <GreaterCairoMap
            ariaLabel={translate(locale, "locations.map.ariaLabel")}
            pinLabel={translate(locale, "locations.map.pinLabel")}
            headOfficePinLabel={translate(locale, "locations.map.headOfficePinLabel")}
            directionsLabel={translate(locale, "locations.action")}
            districtLabels={DISTRICT_LABEL_KEYS.map(({ id, key }) => ({
              id,
              label: translate(locale, key),
            }))}
            pins={pins}
          />
        ) : null}
      </div>
    </ApprovalGate>
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
            address={
              row.addressAr !== null && row.addressEn !== null
                ? localizedText(locale, row.addressAr, row.addressEn)
                : null
            }
            hours={
              row.hoursAr !== null && row.hoursEn !== null
                ? localizedText(locale, row.hoursAr, row.hoursEn)
                : null
            }
            whatsappHref={buildWhatsAppHref(row.whatsappE164, null)}
          />
        </li>
      ))}
    </PublishedListingPage>
  );
}
