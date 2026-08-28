import { translate, type Locale } from "@/lib/catalog";
import { Isolate } from "@/components/ui/Isolate";
import { ComponentBlock, StateRow, StateSample } from "./GalleryPrimitives";
import styles from "./CompositionSection.module.css";

interface CompositionSectionProps {
  locale: Locale;
}

// DESIGN_SYSTEM.md §4 — Bold 700 is permitted at 2xl and above only.
// Forbidden below that is shown struck through in error, not simply
// omitted, so the rule and its boundary are both visible at once.
function BoldRule({ locale }: { locale: Locale }) {
  return (
    <ComponentBlock heading={translate(locale, "system.composition.boldRule.heading")}>
      <p className={styles.body}>{translate(locale, "system.composition.boldRule.body")}</p>
      <StateRow>
        <StateSample label={`${translate(locale, "system.composition.boldRule.sampleAllowed")} — 2xl+`}>
          <span className={styles.boldAllowed} lang="ar" dir="rtl">
            {translate(locale, "system.type.arabicSample")}
          </span>
        </StateSample>
        <StateSample label={`${translate(locale, "system.composition.boldRule.sampleForbidden")} — base`}>
          <span className={styles.boldForbidden} lang="ar" dir="rtl">
            {translate(locale, "system.type.arabicSample")}
          </span>
        </StateSample>
      </StateRow>
    </ComponentBlock>
  );
}

// DESIGN_SYSTEM.md §9/§10 — one gradient within a single hue family only,
// behind a section or hero band, never over text.
function GradientRule({ locale }: { locale: Locale }) {
  return (
    <ComponentBlock heading={translate(locale, "system.composition.gradientRule.heading")}>
      <p className={styles.body}>{translate(locale, "system.composition.gradientRule.body")}</p>
      <StateRow>
        <StateSample label={translate(locale, "system.composition.gradientRule.primarySample")}>
          <div className={styles.gradientPrimary}>
            <Isolate>primary → primary-strong</Isolate>
          </div>
        </StateSample>
        <StateSample label={translate(locale, "system.composition.gradientRule.neutralSample")}>
          <div className={styles.gradientNeutral}>
            <Isolate>background → surface</Isolate>
          </div>
        </StateSample>
      </StateRow>
      <p className={styles.note}>{translate(locale, "system.composition.gradientRule.textNote")}</p>
    </ComponentBlock>
  );
}

// DESIGN_SYSTEM.md §9 — sections alternate between background and surface
// only. Two existing neutrals, no new chromatic family.
function AlternatingFills({ locale }: { locale: Locale }) {
  return (
    <ComponentBlock heading={translate(locale, "system.composition.alternatingFills.heading")}>
      <p className={styles.body}>{translate(locale, "system.composition.alternatingFills.body")}</p>
      <div className={styles.fillStrip}>
        <div className={styles.fillBackground}>
          <Isolate>background</Isolate>
        </div>
        <div className={styles.fillSurface}>
          <Isolate>surface</Isolate>
        </div>
        <div className={styles.fillBackground}>
          <Isolate>background</Isolate>
        </div>
        <div className={styles.fillSurface}>
          <Isolate>surface</Isolate>
        </div>
      </div>
    </ComponentBlock>
  );
}

// STEP 3 — v3's new composition rules, demonstrated live rather than only
// described: the Bold 700 display rule, the single-hue-family gradient
// rule, and the two-neutral alternating section fills.
export function CompositionSection({ locale }: CompositionSectionProps) {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>{translate(locale, "system.composition.heading")}</h2>
      <div className={styles.list}>
        <BoldRule locale={locale} />
        <GradientRule locale={locale} />
        <AlternatingFills locale={locale} />
      </div>
    </section>
  );
}
