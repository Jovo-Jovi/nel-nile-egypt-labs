import type { Metadata } from "next";
import { DashboardModuleTitle } from "@/components/dashboard/DashboardChrome";
import { EquipmentForm } from "@/components/dashboard/EquipmentForm";
import { CatalogRowList } from "@/components/dashboard/CatalogListing";
import extra from "@/components/dashboard/CatalogEntityForm.module.css";
import { PendingListingCards } from "@/components/dashboard/PendingListingCard";
import { noticeFromQuery } from "@/lib/dashboard/catalogEntities";
import { requireLocale } from "@/components/site/StaticShellPage";
import { listEquipmentRows } from "@/lib/dashboard/catalogEntities";
import { pageMetadata } from "@/lib/pageMetadata";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { translate } from "@/lib/catalog";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await requireLocale(params);
  return pageMetadata(locale, "dashboard.equipment.heading", "/dashboard/equipment");
}

export default async function EquipmentPage({ params, searchParams }: Props) {
  const locale = await requireLocale(params);
  const notice = noticeFromQuery(await searchParams);

  const supabase = await createSupabaseServerClient();
  if (supabase === null) {
    return (
      <>
        <DashboardModuleTitle locale={locale} titleKey="dashboard.equipment.heading" />
        <p>{translate(locale, "dashboard.catalog.errorWrite")}</p>
      </>
    );
  }

  const rows = await listEquipmentRows(supabase);

  return (
    <>
      <DashboardModuleTitle locale={locale} titleKey="dashboard.equipment.heading" />
      <div className={extra.groups}>
        {rows.length === 0 ? (
          <PendingListingCards locale={locale} pendingLabelKey="dashboard.equipment.pending" count={3} />
        ) : (
          <CatalogRowList locale={locale} rows={rows} editPrefix="/dashboard/equipment" />
        )}
        <EquipmentForm locale={locale} row={null} notice={notice} />
      </div>
    </>
  );
}
