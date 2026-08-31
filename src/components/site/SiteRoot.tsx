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
      <SiteHeader locale={locale} />
      <main className={styles.main}>{children}</main>
      <SiteFooter locale={locale} />
    </div>
  );
}
