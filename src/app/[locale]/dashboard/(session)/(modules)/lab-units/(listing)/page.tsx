import type { Metadata } from "next";
import { DashboardModuleTitle } from "@/components/dashboard/DashboardChrome";
import { LabUnitForm } from "@/components/dashboard/LabUnitForm";
import { CatalogRowList } from "@/components/dashboard/CatalogListing";
import extra from "@/components/dashboard/CatalogEntityForm.module.css";
import { PendingListingCards } from "@/components/dashboard/PendingListingCard";
import { noticeFromQuery } from "@/lib/dashboard/catalogEntities";
import { requireLocale } from "@/components/site/StaticShellPage";
import { listLabUnitRows } from "@/lib/dashboard/catalogEntities";
import { pageMetadata } from "@/lib/pageMetadata";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { translate } from "@/lib/catalog";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await requireLocale(params);
  return pageMetadata(locale, "dashboard.labUnits.heading", "/dashboard/lab-units");
}

export default async function LabUnitsPage({ params, searchParams }: Props) {
  const locale = await requireLocale(params);
  const notice = noticeFromQuery(await searchParams);

  const supabase = await createSupabaseServerClient();
  if (supabase === null) {
    return (
      <>
        <DashboardModuleTitle locale={locale} titleKey="dashboard.labUnits.heading" />
        <p>{translate(locale, "dashboard.catalog.errorWrite")}</p>
      </>
    );
  }

  const rows = await listLabUnitRows(supabase);

  return (
    <>
      <DashboardModuleTitle locale={locale} titleKey="dashboard.labUnits.heading" />
      <div className={extra.groups}>
        {rows.length === 0 ? (
          <PendingListingCards locale={locale} pendingLabelKey="dashboard.labUnits.pending" count={4} />
        ) : (
          <CatalogRowList locale={locale} rows={rows} editPrefix="/dashboard/lab-units" />
        )}
        <LabUnitForm locale={locale} row={null} notice={notice} />
      </div>
    </>
  );
}
