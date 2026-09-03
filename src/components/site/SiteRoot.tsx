import type { ReactNode } from "react";
import type { Locale } from "@/lib/catalog";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import styles from "./SiteRoot.module.css";

interface SiteRootProps {
  locale: Locale;
  children: ReactNode;
}

// CF-61: lang/dir live on <html> in the [locale] layout, not on this
// wrapper. data-locale stays because tokens.css forks line-height on
// [data-locale="ar"] / [data-locale="en"].
export function SiteRoot({ locale, children }: SiteRootProps) {
  return (
    <div className={styles.root} data-locale={locale}>
      <div className={styles.hex} aria-hidden="true">
        <svg>
          <defs>
            <pattern id="nel-site-hex" width="56" height="64" patternUnits="userSpaceOnUse">
              <path d="M28 2 52 16v28L28 58 4 44V16Z" fill="none" stroke="currentColor" strokeWidth="0.75" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#nel-site-hex)" />
        </svg>
      </div>
      <SiteHeader locale={locale} />
      <main className={styles.main}>{children}</main>
      <SiteFooter locale={locale} />
    </div>
  );
}
