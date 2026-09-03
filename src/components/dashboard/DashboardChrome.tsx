import type { ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { MarkSlot } from "@/components/ui/MarkSlot";
import { translate, type CatalogKey, type Locale } from "@/lib/catalog";
import { localeHref } from "@/lib/locale";
import styles from "./DashboardChrome.module.css";

// ADMIN_SPEC.md §4f — module page title at 2xl. This is not a §10
// SectionHeader: that component is lg, defaults to h1, and dashboard
// groups pass h2 so a module page keeps exactly one h1.
export function DashboardModuleTitle({
  locale,
  titleKey,
}: {
  locale: Locale;
  titleKey: CatalogKey;
}) {
  return <h1 className={styles.pageTitle}>{translate(locale, titleKey)}</h1>;
}

export function DashboardChrome({
  locale,
  showSignOut,
  children,
}: {
  locale: Locale;
  showSignOut: boolean;
  children: ReactNode;
}) {
  const markHref = showSignOut
    ? localeHref(locale, "/dashboard")
    : localeHref(locale, "/dashboard/sign-in");

  return (
    <div className={styles.root}>
      {/* Same §9 wash as SiteRoot — one atmosphere, two surfaces. */}
      <div className={styles.wash} aria-hidden="true" />
      <header className={styles.bar}>
        <Link href={markHref} className={styles.mark}>
          <MarkSlot blockSize={40} fallbackLabel={translate(locale, "header.markFallback")} />
        </Link>
        <div className={styles.actions}>
          <LanguageSwitcher locale={locale} />
          {showSignOut ? (
            <form className={styles.signOut} method="post" action={localeHref(locale, "/dashboard/sign-out")}>
              <Button type="submit" variant="text">
                {translate(locale, "dashboard.signOut")}
              </Button>
            </form>
          ) : null}
        </div>
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
