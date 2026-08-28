import { translate, type Locale } from "@/lib/catalog";
import { BandCard } from "@/components/ui/BandCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { LocationCard } from "@/components/ui/LocationCard";

interface LocationsCardProps {
  locale: Locale;
}

// DESIGN_SYSTEM.md §9 card band, Locations card — a map frame, the
// head-office address and hotline, one action. Address and hotline are
// pending (PR-16); the map is a static labelled frame, never an embedded
// third-party map (BOUNDARY_MODEL.md §5).
export function LocationsCard({ locale }: LocationsCardProps) {
  return (
    <BandCard
      header={
        <SectionHeader
          title={translate(locale, "locations.heading")}
          viewAllLabel={translate(locale, "locations.viewAll")}
        />
      }
    >
      <LocationCard
        locale={locale}
        mapLabel={translate(locale, "locations.mapLabel")}
        addressLabel={translate(locale, "locations.addressLabel")}
        address={translate(locale, "locations.headOfficeAddress")}
        hotlineLabel={translate(locale, "locations.hotlineLabel")}
        hotline={translate(locale, "locations.hotlineValue")}
        actionLabel={translate(locale, "locations.action")}
        pendingLabelKey="approval.pending.businessData"
      />
    </BandCard>
  );
}
