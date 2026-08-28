import { translate, type Locale } from "@/lib/catalog";
import { NewsCard } from "./NewsCard";
import { CautionsCard } from "./CautionsCard";
import { LocationsCard } from "./LocationsCard";
import { ProgrammesCard } from "./ProgrammesCard";
import styles from "./CardBand.module.css";

interface CardBandProps {
  locale: Locale;
}

const CHIPS = [
  { href: "#news", labelKey: "news.heading" as const },
  { href: "#cautions", labelKey: "cautions.heading" as const },
  { href: "#locations", labelKey: "locations.heading" as const },
  { href: "#programmes", labelKey: "programmes.heading" as const },
];

export function CardBand({ locale }: CardBandProps) {
  return (
    <div className={styles.wrap}>
      <nav className={styles.chips} aria-label={translate(locale, "band.tabs")}>
        {CHIPS.map((chip) => (
          <a key={chip.href} href={chip.href} className={styles.chip}>
            {translate(locale, chip.labelKey)}
          </a>
        ))}
      </nav>
      <div className={styles.band}>
        <div id="news" className={styles.anchor}>
          <NewsCard locale={locale} />
        </div>
        <div id="cautions" className={styles.anchor}>
          <CautionsCard locale={locale} />
        </div>
        <div id="locations" className={styles.anchor}>
          <LocationsCard locale={locale} />
        </div>
        <div id="programmes" className={styles.anchor}>
          <ProgrammesCard locale={locale} />
        </div>
      </div>
    </div>
  );
}
