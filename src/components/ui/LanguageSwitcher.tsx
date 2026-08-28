"use client";

import { translate, type Locale } from "@/lib/catalog";
import { Isolate } from "./Isolate";
import styles from "./LanguageSwitcher.module.css";

export type LanguageSwitcherForcedState = "hover" | "focus" | "active" | "disabled";

interface LanguageSwitcherProps {
  locale: Locale;
  onChange: (locale: Locale) => void;
  forceState?: LanguageSwitcherForcedState;
}

// DESIGN_SYSTEM.md §10 Language switcher — shows the *target* locale, not
// the current one. On an Arabic page it reads "EN". 44px, radius full, 1px
// border, text label.
export function LanguageSwitcher({ locale, onChange, forceState }: LanguageSwitcherProps) {
  const target: Locale = locale === "ar" ? "en" : "ar";
  const ariaLabel = translate(locale, target === "ar" ? "languageSwitcher.toAr" : "languageSwitcher.toEn");

  return (
    <button
      type="button"
      className={styles.switcher}
      onClick={() => onChange(target)}
      aria-label={ariaLabel}
      disabled={forceState === "disabled"}
      data-force-state={forceState}
    >
      <Isolate>{target === "ar" ? "AR" : "EN"}</Isolate>
    </button>
  );
}
