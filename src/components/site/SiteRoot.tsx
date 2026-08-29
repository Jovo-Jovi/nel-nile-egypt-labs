"use client";

import { useState } from "react";
import type { Locale } from "@/lib/catalog";
import { LoadingScreen } from "@/components/preview/LoadingScreen";
import { SiteHeader } from "./SiteHeader";
import { SiteHome } from "./SiteHome";
import { SiteFooter } from "./SiteFooter";
import styles from "./SiteRoot.module.css";

export function SiteRoot() {
  const [locale, setLocale] = useState<Locale>("ar");
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <div className={styles.root} lang={locale} dir={dir} data-locale={locale}>
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
      <LoadingScreen locale={locale} />
      <SiteHeader locale={locale} onLocaleChange={setLocale} />
      <main className={styles.main}>
        <SiteHome locale={locale} />
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
