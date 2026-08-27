"use client";

import { translate, type Locale } from "@/lib/catalog";
import { Isolate } from "@/components/ui/Isolate";
import { useCssVar } from "./useCssVar";
import { COLOUR_TOKENS, type ColourTokenMeta } from "@/lib/designSystemData";
import styles from "./ColourSection.module.css";

interface ColourSectionProps {
  locale: Locale;
}

function ColourSwatch({ token, locale }: { token: ColourTokenMeta; locale: Locale }) {
  const hex = useCssVar(token.cssVar);

  return (
    <div className={styles.swatch}>
      <div className={styles.chip} style={{ backgroundColor: `var(${token.cssVar})` }} aria-hidden="true" />
      <p className={styles.name}>
        <Isolate>{token.name}</Isolate>
      </p>
      <p className={styles.hex}>
        <Isolate>{hex ?? "…"}</Isolate>
      </p>
      <p className={styles.origin}>{translate(locale, token.originKey)}</p>
      <dl className={styles.ratios}>
        <div className={styles.ratioRow}>
          <dt>{translate(locale, "system.colour.vsBackground")}</dt>
          <dd>{token.vsBackground !== null ? token.vsBackground.toFixed(2) : "—"}</dd>
        </div>
        <div className={styles.ratioRow}>
          <dt>{translate(locale, "system.colour.vsSurface")}</dt>
          <dd>{token.vsSurface !== null ? token.vsSurface.toFixed(2) : "—"}</dd>
        </div>
        <div className={styles.ratioRow}>
          <dt>{translate(locale, "system.colour.floor")}</dt>
          <dd>{token.floor !== null ? token.floor.toFixed(1) : "—"}</dd>
        </div>
      </dl>
    </div>
  );
}

// DESIGN_SYSTEM.md §3 — eleven tokens, no twelfth. Hex is read live from
// tokens.css (useCssVar); contrast ratios and origin notes are transcribed
// from the document's own table, so every number here is real.
export function ColourSection({ locale }: ColourSectionProps) {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>{translate(locale, "system.colour.heading")}</h2>
      <div className={styles.grid}>
        {COLOUR_TOKENS.map((token) => (
          <ColourSwatch key={token.cssVar} token={token} locale={locale} />
        ))}
      </div>
    </section>
  );
}
