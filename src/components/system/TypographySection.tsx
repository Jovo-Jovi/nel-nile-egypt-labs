"use client";

import { translate, type CatalogKey, type Locale } from "@/lib/catalog";
import { useCssVar } from "./useCssVar";
import { TYPE_STEPS, LINE_HEIGHT_ROWS } from "@/lib/designSystemData";
import styles from "./TypographySection.module.css";

interface TypographySectionProps {
  locale: Locale;
}

function TypeStepRow({ step, cssVar, locale }: { step: string; cssVar: string; locale: Locale }) {
  const size = useCssVar(cssVar);
  return (
    <div className={styles.row}>
      <span className={styles.stepName}>{step}</span>
      <span className={styles.stepSize}>{size ?? "…"}</span>
      <span className={styles.arabicSample} style={{ fontSize: `var(${cssVar})` }} lang="ar" dir="rtl">
        {translate(locale, "system.type.arabicSample")}
      </span>
      <span className={styles.latinSample} style={{ fontSize: `var(${cssVar})` }} lang="en" dir="ltr">
        {translate(locale, "system.type.latinSample")}
      </span>
    </div>
  );
}

function LineHeightRow({
  labelKey,
  enVar,
  arVar,
  locale,
}: {
  labelKey: CatalogKey;
  enVar: string;
  arVar: string;
  locale: Locale;
}) {
  const enValue = useCssVar(enVar);
  const arValue = useCssVar(arVar);
  return (
    <div className={styles.lineHeightRow}>
      <span className={styles.lineHeightLabel}>{translate(locale, labelKey)}</span>
      <span className={styles.lineHeightValue}>en {enValue ?? "…"}</span>
      <span className={styles.lineHeightValue}>ar {arValue ?? "…"}</span>
    </div>
  );
}

// DESIGN_SYSTEM.md §4 — seven size steps, both scripts, with the per-locale
// line-height fork. Sizes and line heights are read live from tokens.css.
export function TypographySection({ locale }: TypographySectionProps) {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>{translate(locale, "system.type.heading")}</h2>
      <div className={styles.steps}>
        {TYPE_STEPS.map(({ step, cssVar }) => (
          <TypeStepRow key={step} step={step} cssVar={cssVar} locale={locale} />
        ))}
      </div>
      <div className={styles.lineHeights}>
        {LINE_HEIGHT_ROWS.map((row) => (
          <LineHeightRow
            key={row.labelKey}
            labelKey={row.labelKey}
            enVar={row.enVar}
            arVar={row.arVar}
            locale={locale}
          />
        ))}
      </div>
    </section>
  );
}
