"use client";

import { translate, type Locale } from "@/lib/catalog";
import { useCssVar } from "./useCssVar";
import { SPACING_STEPS, RADIUS_STEPS, ELEVATION_LEVELS } from "@/lib/designSystemData";
import styles from "./SpaceSection.module.css";

interface SpaceSectionProps {
  locale: Locale;
}

function SpacingBar({ step, cssVar }: { step: string; cssVar: string }) {
  const value = useCssVar(cssVar);
  return (
    <div className={styles.spacingRow}>
      <span className={styles.spacingLabel}>{step}px</span>
      <span className={styles.spacingBar} style={{ inlineSize: `var(${cssVar})` }} />
      <span className={styles.spacingValue}>{value ?? "…"}</span>
    </div>
  );
}

function RadiusSwatch({ name, cssVar }: { name: string; cssVar: string }) {
  const value = useCssVar(cssVar);
  return (
    <div className={styles.radiusSwatch}>
      <span className={styles.radiusBox} style={{ borderRadius: `var(${cssVar})` }} />
      <span className={styles.radiusLabel}>{name}</span>
      <span className={styles.radiusValue}>{value ?? "…"}</span>
    </div>
  );
}

function ElevationSwatch({ level, borderVar, shadowVar }: { level: string; borderVar: string; shadowVar: string }) {
  const border = useCssVar(borderVar);
  const shadow = useCssVar(shadowVar);
  return (
    <div className={styles.elevationSwatch}>
      <span
        className={styles.elevationBox}
        style={{
          borderWidth: `var(${borderVar})`,
          boxShadow: `var(${shadowVar})`,
        }}
      />
      <span className={styles.elevationLabel}>{level}</span>
      <span className={styles.elevationValue}>
        border {border ?? "…"} · shadow {shadow && shadow !== "none" ? "set" : "none"}
      </span>
    </div>
  );
}

// DESIGN_SYSTEM.md §5 — nine-step spacing scale, four radii, three
// elevation levels. All values read live from tokens.css.
export function SpaceSection({ locale }: SpaceSectionProps) {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>{translate(locale, "system.space.heading")}</h2>

      <div className={styles.subsection}>
        <h3 className={styles.subheading}>{translate(locale, "system.space.spacingScale")}</h3>
        <div className={styles.spacingList}>
          {SPACING_STEPS.map(({ step, cssVar }) => (
            <SpacingBar key={cssVar} step={step} cssVar={cssVar} />
          ))}
        </div>
      </div>

      <div className={styles.subsection}>
        <h3 className={styles.subheading}>{translate(locale, "system.space.radiusScale")}</h3>
        <div className={styles.radiusList}>
          {RADIUS_STEPS.map(({ name, cssVar }) => (
            <RadiusSwatch key={cssVar} name={name} cssVar={cssVar} />
          ))}
        </div>
      </div>

      <div className={styles.subsection}>
        <h3 className={styles.subheading}>{translate(locale, "system.space.elevationScale")}</h3>
        <div className={styles.elevationList}>
          {ELEVATION_LEVELS.map(({ level, borderVar, shadowVar }) => (
            <ElevationSwatch key={level} level={level} borderVar={borderVar} shadowVar={shadowVar} />
          ))}
        </div>
      </div>
    </section>
  );
}
