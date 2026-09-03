import type { Metadata } from "next";
import { DashboardModuleTitle } from "@/components/dashboard/DashboardChrome";
import { OfferForm } from "@/components/dashboard/OfferForm";
import { CatalogRowList } from "@/components/dashboard/CatalogListing";
import extra from "@/components/dashboard/CatalogEntityForm.module.css";
import { PendingListingCards } from "@/components/dashboard/PendingListingCard";
import { noticeFromQuery } from "@/lib/dashboard/catalogEntities";
import { requireLocale } from "@/components/site/StaticShellPage";
import { listOfferRows } from "@/lib/dashboard/catalogEntities";
import { pageMetadata } from "@/lib/pageMetadata";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { translate } from "@/lib/catalog";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await requireLocale(params);
  return pageMetadata(locale, "dashboard.offers.heading", "/dashboard/offers");
}

export default async function OffersPage({ params, searchParams }: Props) {
  const locale = await requireLocale(params);
  const notice = noticeFromQuery(await searchParams);

  const supabase = await createSupabaseServerClient();
  if (supabase === null) {
    return (
      <>
        <DashboardModuleTitle locale={locale} titleKey="dashboard.offers.heading" />
        <p>{translate(locale, "dashboard.catalog.errorWrite")}</p>
      </>
    );
  }

  const rows = await listOfferRows(supabase);

  return (
    <>
      <DashboardModuleTitle locale={locale} titleKey="dashboard.offers.heading" />
      <div className={extra.groups}>
        {rows.length === 0 ? (
          <PendingListingCards locale={locale} pendingLabelKey="dashboard.offers.pending" count={3} />
        ) : (
          <CatalogRowList
            locale={locale}
            rows={rows.map((row) => ({
              id: row.id,
              name_ar: row.title_ar,
              name_en: row.title_en,
              publication_state: row.publication_state,
              display_order: row.display_order,
            }))}
            editPrefix="/dashboard/offers"
          />
        )}
        <OfferForm locale={locale} row={null} notice={notice} />
      </div>
    </>
  );
}
