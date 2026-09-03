import { translate, type CatalogKey, type Locale } from "@/lib/catalog";
import styles from "./SectionHeader.module.css";

type SectionHeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

interface SectionHeaderProps {
  locale: Locale;
  titleKey: CatalogKey;
  level?: SectionHeadingLevel;
}

// DESIGN_SYSTEM.md §10 Section header — title at lg weight 600 in text
// at the inline-start. No View-all link on these gated shells. Level
// defaults to h1 so the public site is unchanged; dashboard groups pass h2.
export function SectionHeader({ locale, titleKey, level = "h1" }: SectionHeaderProps) {
  const Heading = level;
  return (
    <header className={styles.header}>
      <Heading className={styles.title}>{translate(locale, titleKey)}</Heading>
    </header>
  );
}
