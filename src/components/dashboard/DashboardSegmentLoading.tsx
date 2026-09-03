"use client";

import { useParams } from "next/navigation";
import { PendingListingCards } from "@/components/dashboard/PendingListingCard";
import { translate, type CatalogKey, type Locale } from "@/lib/catalog";
import styles from "./DashboardChrome.module.css";

export function DashboardSegmentLoading({
  titleKey,
  pendingLabelKey,
}: {
  titleKey: CatalogKey;
  pendingLabelKey: CatalogKey;
}) {
  const params = useParams();
  const raw = params.locale;
  const locale: Locale = raw === "en" ? "en" : "ar";

  return (
    <>
      <header className={styles.pageHeader}>
        <p className={styles.eyebrow}>{translate(locale, "dashboard.module.eyebrow")}</p>
        <h1 className={styles.pageTitle}>{translate(locale, titleKey)}</h1>
      </header>
      <PendingListingCards locale={locale} pendingLabelKey={pendingLabelKey} count={3} />
    </>
  );
}
