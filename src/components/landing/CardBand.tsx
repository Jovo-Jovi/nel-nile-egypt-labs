import type { Locale } from "@/lib/catalog";
import { NewsCard } from "./NewsCard";
import { CautionsCard } from "./CautionsCard";
import { LocationsCard } from "./LocationsCard";
import { ProgrammesCard } from "./ProgrammesCard";
import styles from "./CardBand.module.css";

interface CardBandProps {
  locale: Locale;
}

// DESIGN_SYSTEM.md §9 "The card band" — directly under the hero, the
// highest-value structure on the page. Four cards at lg+, two-by-two at
// md, stacked below. Two of the four (Cautions, Programmes) carry
// material that cannot render as approved without sign-off; News is
// blocked on a ninth-module OD; Locations is blocked on SiteSettings.
// The band is built now and gated (§12).
export function CardBand({ locale }: CardBandProps) {
  return (
    <div className={styles.band}>
      <NewsCard locale={locale} />
      <CautionsCard locale={locale} />
      <LocationsCard locale={locale} />
      <ProgrammesCard locale={locale} />
    </div>
  );
}
