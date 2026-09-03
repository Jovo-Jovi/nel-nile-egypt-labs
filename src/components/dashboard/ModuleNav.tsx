"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { translate, type CatalogKey, type Locale } from "@/lib/catalog";
import { localeHref } from "@/lib/locale";
import styles from "./ModuleNav.module.css";

const MODULES: { suffix: string; labelKey: CatalogKey }[] = [
  { suffix: "/dashboard/offers", labelKey: "dashboard.nav.offers" },
  { suffix: "/dashboard/videos", labelKey: "dashboard.nav.videos" },
  { suffix: "/dashboard/equipment", labelKey: "dashboard.nav.equipment" },
  { suffix: "/dashboard/branches", labelKey: "dashboard.nav.branches" },
  { suffix: "/dashboard/lab-units", labelKey: "dashboard.nav.labUnits" },
  { suffix: "/dashboard/site-settings", labelKey: "dashboard.nav.siteSettings" },
];

export function ModuleNav({ locale }: { locale: Locale }) {
  const pathname = usePathname() ?? "";

  return (
    <nav className={styles.nav} aria-label={translate(locale, "dashboard.nav.label")}>
      {MODULES.map((item) => {
        const href = localeHref(locale, item.suffix);
        const current = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={item.suffix}
            className={styles.link}
            href={href}
            aria-current={current ? "page" : undefined}
          >
            {translate(locale, item.labelKey)}
          </Link>
        );
      })}
    </nav>
  );
}
