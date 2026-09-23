import type { ReactNode } from "react";
import type { Locale } from "@/lib/catalog";
import { loadPublicChrome } from "@/lib/publicChrome";
import { resultsPortalVisitorHref } from "@/lib/resultsPortalLink";
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
export async function SiteRoot({ locale, children }: SiteRootProps) {
  const chrome = await loadPublicChrome(locale);
  // header chips omitted href and
  // kept emitting the placeholder after the Visitor URL was resolved. Ratified at the P05-T19 verdict.
  const portalHref = resultsPortalVisitorHref()?.href ?? null;

  return (
    <div className={styles.root} data-locale={locale} data-nel-chrome="site">
      <div className={styles.wash} aria-hidden="true">
        <span className={styles.orbA} />
        <span className={styles.orbB} />
      </div>
      <SiteHeader locale={locale} whatsappHref={chrome.whatsappHref} portalHref={portalHref} />
      <main className={styles.main}>{children}</main>
      <SiteFooter locale={locale} chrome={chrome} />
    </div>
  );
}
