import Link from "next/link";
import { translate, type Locale } from "@/lib/catalog";
import { localeHref } from "@/lib/locale";
import styles from "./ModuleNav.module.css";

export function ModuleNav({ locale }: { locale: Locale }) {
  return (
    <nav className={styles.nav} aria-label={translate(locale, "dashboard.nav.label")}>
      <Link className={styles.link} href={localeHref(locale, "/dashboard/offers")}>
        {translate(locale, "dashboard.nav.offers")}
      </Link>
      <Link className={styles.link} href={localeHref(locale, "/dashboard/site-settings")}>
        {translate(locale, "dashboard.nav.siteSettings")}
      </Link>
    </nav>
  );
}
