import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { translate, type Locale } from "@/lib/catalog";
import { localeHref } from "@/lib/locale";
import styles from "./DashboardChrome.module.css";

export function DashboardChrome({
  locale,
  showSignOut,
  children,
}: {
  locale: Locale;
  showSignOut: boolean;
  children: ReactNode;
}) {
  return (
    <>
      <header className={styles.bar}>
        <p className={styles.brand}>{translate(locale, "dashboard.home.title")}</p>
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
    </>
  );
}
