import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DashboardModuleTitle } from "@/components/dashboard/DashboardChrome";
import { VideoForm } from "@/components/dashboard/VideoForm";
import { noticeFromQuery } from "@/lib/dashboard/catalogEntities";
import { requireLocale } from "@/components/site/StaticShellPage";
import { isRowId, readVideoRow } from "@/lib/dashboard/catalogEntities";
import { pageMetadata } from "@/lib/pageMetadata";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { translate } from "@/lib/catalog";

type Props = {
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<{ error?: string; saved?: string; poster?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await requireLocale(params);
  return pageMetadata(locale, "dashboard.videos.heading", "/dashboard/videos");
}

export default async function VideoEditPage({ params, searchParams }: Props) {
  const resolved = await params;
  const locale = await requireLocale(Promise.resolve({ locale: resolved.locale }));
  const notice = noticeFromQuery(await searchParams);

  if (!isRowId(resolved.id)) notFound();

  const supabase = await createSupabaseServerClient();
  if (supabase === null) {
    return (
      <>
        <DashboardModuleTitle locale={locale} titleKey="dashboard.videos.heading" />
        <p>{translate(locale, "dashboard.catalog.errorWrite")}</p>
      </>
    );
  }

  const row = await readVideoRow(supabase, resolved.id);
  if (row === null) notFound();

  return (
    <>
      <DashboardModuleTitle locale={locale} titleKey="dashboard.videos.heading" />
      <VideoForm locale={locale} row={row} notice={notice} />
    </>
  );
}
