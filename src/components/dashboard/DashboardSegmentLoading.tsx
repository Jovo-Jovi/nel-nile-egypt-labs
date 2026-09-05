"use client";

import { useParams } from "next/navigation";
import { DashboardModuleTitle } from "@/components/dashboard/DashboardChrome";
import { PendingListingCards } from "@/components/dashboard/PendingListingCard";
import type { CatalogKey, Locale } from "@/lib/catalog";

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
      <DashboardModuleTitle locale={locale} titleKey={titleKey} />
      <PendingListingCards locale={locale} pendingLabelKey={pendingLabelKey} count={3} />
    </>
  );
}
