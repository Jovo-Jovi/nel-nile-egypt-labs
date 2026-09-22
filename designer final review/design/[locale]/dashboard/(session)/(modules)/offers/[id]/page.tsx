import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DashboardModuleTitle } from "@/components/dashboard/DashboardChrome";
import { OfferForm } from "@/components/dashboard/OfferForm";
import { noticeFromQuery } from "@/lib/dashboard/catalogEntities";
import { requireLocale } from "@/components/site/StaticShellPage";
import { isRowId, readOfferRow } from "@/lib/dashboard/catalogEntities";
import { listMediaAssetOptions } from "@/lib/dashboard/mediaAsset";
import { pageMetadata } from "@/lib/pageMetadata";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { translate } from "@/lib/catalog";

type Props = {
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await requireLocale(params);
  return pageMetadata(locale, "dashboard.offers.heading", "/dashboard/offers");
}

export default async function OfferEditPage({ params, searchParams }: Props) {
  const resolved = await params;
  const locale = await requireLocale(Promise.resolve({ locale: resolved.locale }));
  const notice = noticeFromQuery(await searchParams);

  if (!isRowId(resolved.id)) notFound();

  const supabase = await createSupabaseServerClient();
  if (supabase === null) {
    return (
      <>
        <DashboardModuleTitle locale={locale} titleKey="dashboard.offers.heading" />
        <p>{translate(locale, "dashboard.catalog.errorWrite")}</p>
      </>
    );
  }

  const row = await readOfferRow(supabase, resolved.id);
  if (row === null) notFound();
  const assets = await listMediaAssetOptions(supabase);

  return (
    <>
      <DashboardModuleTitle locale={locale} titleKey="dashboard.offers.heading" />
      <OfferForm locale={locale} row={row} notice={notice} assets={assets} />
    </>
  );
}
