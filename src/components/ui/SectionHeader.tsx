import { translate, type CatalogKey, type Locale } from "@/lib/catalog";
import styles from "./SectionHeader.module.css";

interface SectionHeaderProps {
  locale: Locale;
  titleKey: CatalogKey;
}

// DESIGN_SYSTEM.md §10 Section header — title at lg weight 600 in text
// at the inline-start. No View-all link on these gated shells.
export function SectionHeader({ locale, titleKey }: SectionHeaderProps) {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>{translate(locale, titleKey)}</h1>
    </header>
  );
}
