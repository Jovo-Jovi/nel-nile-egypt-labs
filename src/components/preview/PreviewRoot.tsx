"use client";

import { useState } from "react";
import type { Locale } from "@/lib/catalog";
import { LoadingScreen } from "./LoadingScreen";
import { DockBar } from "./DockBar";
import { FloatingContact } from "./FloatingContact";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { LandingView } from "@/components/landing/LandingView";
import styles from "./PreviewRoot.module.css";

export function PreviewRoot() {
  const [locale, setLocale] = useState<Locale>("ar");
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <div className={styles.root} lang={locale} dir={dir} data-locale={locale}>
      <div className={styles.wash} aria-hidden="true" />
      <LoadingScreen locale={locale} />
      <Header locale={locale} onLocaleChange={setLocale} />
      <main className={styles.main}>
        <LandingView locale={locale} />
      </main>
      <Footer locale={locale} />
      <FloatingContact locale={locale} />
      <DockBar locale={locale} />
    </div>
  );
}
