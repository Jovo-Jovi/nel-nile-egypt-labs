import type { Metadata } from "next";
import { DashboardModuleTitle } from "@/components/dashboard/DashboardChrome";
import { EquipmentForm } from "@/components/dashboard/EquipmentForm";
import { CatalogRowList } from "@/components/dashboard/CatalogListing";
import extra from "@/components/dashboard/CatalogEntityForm.module.css";
import { noticeFromQuery } from "@/lib/dashboard/catalogEntities";
import { requireLocale } from "@/components/site/StaticShellPage";
import { listEquipmentRows } from "@/lib/dashboard/catalogEntities";
import { listMediaAssetOptions } from "@/lib/dashboard/mediaAsset";
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

  const [rows, assets] = await Promise.all([
    listEquipmentRows(supabase),
    listMediaAssetOptions(supabase),
  ]);

  return (
    <>
      <DashboardModuleTitle locale={locale} titleKey="dashboard.equipment.heading" />
      <div className={extra.groups}>
        <CatalogRowList locale={locale} rows={rows} editPrefix="/dashboard/equipment" />
        <EquipmentForm locale={locale} row={null} notice={notice} assets={assets} />
      </div>
    </>
  );
}
