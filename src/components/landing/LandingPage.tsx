"use client";

import { useState } from "react";
import type { Locale } from "@/lib/catalog";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { Actions } from "./Actions";
import { HoursLocation } from "./HoursLocation";
import { Footer } from "./Footer";
import styles from "./LandingPage.module.css";

// Named deviation, mock-only (I18N_MODEL.md §4, recorded as CF-61). No locale
// route segment exists at OD-05 bound 2, so dir/lang are set on this
// page-root wrapper instead of on <html>. P03 sets both on <html> from the
// locale segment and this wrapper does not survive.
export function LandingPage() {
  const [locale, setLocale] = useState<Locale>("ar");
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <div className={styles.root} lang={locale} dir={dir} data-locale={locale}>
      <Header locale={locale} onLocaleChange={setLocale} />
      <main className={styles.main}>
        <Hero locale={locale} />
        <Actions locale={locale} />
        <HoursLocation locale={locale} />
      </main>
      <Footer locale={locale} />
    </div>
  );
}
