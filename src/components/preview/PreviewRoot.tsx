"use client";

import { useState } from "react";
import type { Locale } from "@/lib/catalog";
import { PreviewBanner, type PreviewView } from "./PreviewBanner";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { LandingView } from "@/components/landing/LandingView";
import { SystemView } from "@/components/system/SystemView";
import styles from "./PreviewRoot.module.css";

// P02-T09 STEP 1 — two views, one route. OD-05 bound 2 still binds: no new
// route, locale in client state, dir/lang on the page-root wrapper.
//
// Named deviation, mock-only (I18N_MODEL.md §4, carried forward as CF-61).
// No locale route segment exists at OD-05 bound 2, so dir/lang are set on
// this page-root wrapper instead of on <html>. P03 sets both on <html>
// from the locale segment and this wrapper does not survive.
export function PreviewRoot() {
  const [locale, setLocale] = useState<Locale>("ar");
  const [view, setView] = useState<PreviewView>("landing");
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <div className={styles.root} lang={locale} dir={dir} data-locale={locale}>
      <PreviewBanner locale={locale} view={view} onViewChange={setView} />
      <Header locale={locale} onLocaleChange={setLocale} />
      <main className={styles.main}>
        {view === "landing" ? <LandingView locale={locale} /> : <SystemView locale={locale} />}
      </main>
      <Footer locale={locale} />
    </div>
  );
}
