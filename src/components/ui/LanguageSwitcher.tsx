"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { translate, type Locale } from "@/lib/catalog";
import { Isolate } from "./Isolate";
import styles from "./LanguageSwitcher.module.css";

export type LanguageSwitcherForcedState = "hover" | "focus" | "active" | "disabled";

interface LanguageSwitcherProps {
  locale: Locale;
  forceState?: LanguageSwitcherForcedState;
}

// DESIGN_SYSTEM.md §10 Language switcher — shows the *target* locale, not
// the current one. On an Arabic page it reads "EN". Navigates to the same
// page in the other locale (I18N_MODEL.md §3). 44px, radius full, 1px
// border, text label.
export function LanguageSwitcher({ locale, forceState }: LanguageSwitcherProps) {
  const pathname = usePathname() ?? `/${locale}`;
  const target: Locale = locale === "ar" ? "en" : "ar";
  const rest = pathname.replace(/^\/(ar|en)(?=\/|$)/, "");
  const href = `/${target}${rest}`;
  const ariaLabel = translate(locale, target === "ar" ? "languageSwitcher.toAr" : "languageSwitcher.toEn");
  const label = <Isolate>{target === "ar" ? "AR" : "EN"}</Isolate>;

  if (forceState === "disabled") {
    return (
      <span className={styles.switcher} aria-label={ariaLabel} aria-disabled="true" data-force-state={forceState}>
        {label}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className={styles.switcher}
      aria-label={ariaLabel}
      data-force-state={forceState}
    >
      {label}
    </Link>
  );
}
