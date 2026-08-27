import { translate, type Locale } from "@/lib/catalog";
import { Isolate } from "./Isolate";
import styles from "./Header.module.css";

interface HeaderProps {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
}

export function Header({ locale, onLocaleChange }: HeaderProps) {
  const other: Locale = locale === "ar" ? "en" : "ar";
  const toggleLabel = translate(
    locale,
    other === "ar" ? "header.toggleLabelToAr" : "header.toggleLabelToEn",
  );

  return (
    <header className={styles.header}>
      <div className={styles.mark}>{translate(locale, "header.markPlaceholder")}</div>
      <button
        type="button"
        className={styles.toggle}
        onClick={() => onLocaleChange(other)}
        aria-label={toggleLabel}
      >
        <Isolate>{other === "ar" ? "AR" : "EN"}</Isolate>
      </button>
    </header>
  );
}
