import type { Metadata } from "next";
import { DashboardModuleTitle } from "@/components/dashboard/DashboardChrome";
import { VideoForm } from "@/components/dashboard/VideoForm";
import { CatalogRowList } from "@/components/dashboard/CatalogListing";
import extra from "@/components/dashboard/CatalogEntityForm.module.css";
import { noticeFromQuery } from "@/lib/dashboard/catalogEntities";
import { requireLocale } from "@/components/site/StaticShellPage";
import { listVideoRows } from "@/lib/dashboard/catalogEntities";
import { pageMetadata } from "@/lib/pageMetadata";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { translate } from "@/lib/catalog";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string; saved?: string; poster?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await requireLocale(params);
  return pageMetadata(locale, "dashboard.videos.heading", "/dashboard/videos");
}

export default async function VideosPage({ params, searchParams }: Props) {
  const locale = await requireLocale(params);
  const notice = noticeFromQuery(await searchParams);

  const supabase = await createSupabaseServerClient();
  if (supabase === null) {
    return (
      <>
        <DashboardModuleTitle locale={locale} titleKey="dashboard.videos.heading" />
        <p>{translate(locale, "dashboard.catalog.errorWrite")}</p>
      </>
    );
  }

  const rows = await listVideoRows(supabase);

  return (
    <>
      <DashboardModuleTitle locale={locale} titleKey="dashboard.videos.heading" />
      <div className={extra.groups}>
        <CatalogRowList
          locale={locale}
          rows={rows.map((row) => ({
            id: row.id,
            name_ar: row.title_ar,
            name_en: row.title_en,
            publication_state: row.publication_state,
            display_order: row.display_order,
          }))}
          editPrefix="/dashboard/videos"
        />
        <VideoForm locale={locale} row={null} notice={notice} />
      </div>
    </>
  );
}
