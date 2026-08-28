import { translate, type Locale } from "@/lib/catalog";
import { BandCard } from "@/components/ui/BandCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { LocationCard } from "@/components/ui/LocationCard";

interface LocationsCardProps {
  locale: Locale;
}

// DESIGN_SYSTEM.md v4 §9 card band, §10 Locations card — a drawn map,
// the head-office address and hotline, one action. Address, hotline and
// the map's own Branch coordinates are pending (PR-16, CF-69); the map
// is a hand-authored SVG, never an embedded third-party map
// (BOUNDARY_MODEL.md §5).
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
        addressLabel={translate(locale, "locations.addressLabel")}
        hotlineLabel={translate(locale, "locations.hotlineLabel")}
        actionLabel={translate(locale, "locations.action")}
        pendingLabelKey="approval.pending.businessData"
      />
    </BandCard>
  );
}
