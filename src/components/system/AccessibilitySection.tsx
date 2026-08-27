import { translate, type Locale } from "@/lib/catalog";
import { A11Y_CRITERIA } from "@/lib/designSystemData";
import styles from "./AccessibilitySection.module.css";

interface AccessibilitySectionProps {
  locale: Locale;
}

// DESIGN_SYSTEM.md §8 — six accessibility criteria, each a check rather
// than an aspiration, with what closes it.
export function AccessibilitySection({ locale }: AccessibilitySectionProps) {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>{translate(locale, "system.accessibility.heading")}</h2>
      <ol className={styles.list}>
        {A11Y_CRITERIA.map((criterion, index) => (
          <li key={criterion.itemKey} className={styles.item}>
            <span className={styles.index}>{index + 1}</span>
            <div className={styles.itemBody}>
              <p className={styles.criterion}>{translate(locale, criterion.itemKey)}</p>
              <p className={styles.closes}>
                <span className={styles.closesLabel}>
                  {translate(locale, "system.accessibility.closesWith")}:
                </span>{" "}
                {translate(locale, criterion.closesKey)}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
