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
      {/* DESIGN_SYSTEM.md §9 "The page wash" — the one permitted
          page-level decorative layer: background easing to surface, a
          primary tint at no more than 6%, fixed to the viewport, behind
          everything. Carries no text and no interactive target; every
          text-bearing region below paints its own opaque background or
          surface fill above it, so nothing is ever read off this layer. */}
      <div className={styles.wash} aria-hidden="true" />
      <SiteHeader locale={locale} />
      <main className={styles.main}>{children}</main>
      <SiteFooter locale={locale} />
    </div>
  );
}
