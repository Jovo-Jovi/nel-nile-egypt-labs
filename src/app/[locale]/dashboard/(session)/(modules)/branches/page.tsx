import type { Metadata } from "next";
import { DashboardModuleTitle } from "@/components/dashboard/DashboardChrome";
import { BranchForm } from "@/components/dashboard/BranchForm";
import { CatalogRowList } from "@/components/dashboard/CatalogListing";
import extra from "@/components/dashboard/CatalogEntityForm.module.css";
import { PendingListingCards } from "@/components/dashboard/PendingListingCard";
import { noticeFromQuery } from "@/lib/dashboard/catalogEntities";
import { requireLocale } from "@/components/site/StaticShellPage";
import { listBranchRows } from "@/lib/dashboard/catalogEntities";
import { pageMetadata } from "@/lib/pageMetadata";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { translate } from "@/lib/catalog";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await requireLocale(params);
  return pageMetadata(locale, "dashboard.branches.heading", "/dashboard/branches");
}

export default async function BranchesPage({ params, searchParams }: Props) {
  const locale = await requireLocale(params);
  const notice = noticeFromQuery(await searchParams);

  const supabase = await createSupabaseServerClient();
  if (supabase === null) {
    return (
      <>
        <DashboardModuleTitle locale={locale} titleKey="dashboard.branches.heading" />
        <p>{translate(locale, "dashboard.catalog.errorWrite")}</p>
      </>
    );
  }

  const rows = await listBranchRows(supabase);

  return (
    <>
      <DashboardModuleTitle locale={locale} titleKey="dashboard.branches.heading" />
      <div className={extra.groups}>
        {rows.length === 0 ? (
          <PendingListingCards locale={locale} pendingLabelKey="dashboard.branches.pending" count={4} />
        ) : (
          <CatalogRowList locale={locale} rows={rows} editPrefix="/dashboard/branches" />
        )}
        <BranchForm locale={locale} row={null} notice={notice} />
      </div>
    </>
  );
}
