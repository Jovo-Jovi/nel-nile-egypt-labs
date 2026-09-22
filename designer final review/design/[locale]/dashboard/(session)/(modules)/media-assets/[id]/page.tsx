import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DashboardModuleTitle } from "@/components/dashboard/DashboardChrome";
import { MediaAssetForm } from "@/components/dashboard/MediaAssetForm";
import { noticeFromQuery } from "@/lib/dashboard/catalogEntities";
import { requireLocale } from "@/components/site/StaticShellPage";
import { isRowId } from "@/lib/dashboard/catalogEntities";
import {
  listMediaAssetHolders,
  mediaAssetBucketAvailable,
  readMediaAssetRow,
} from "@/lib/dashboard/mediaAsset";
import { pageMetadata } from "@/lib/pageMetadata";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { translate } from "@/lib/catalog";

type Props = {
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await requireLocale(params);
  return pageMetadata(locale, "dashboard.media.heading", "/dashboard/media-assets");
}

export default async function MediaAssetEditPage({ params, searchParams }: Props) {
  const resolved = await params;
  const locale = await requireLocale(Promise.resolve({ locale: resolved.locale }));
  const notice = noticeFromQuery(await searchParams);

  if (!isRowId(resolved.id)) notFound();

  const supabase = await createSupabaseServerClient();
  if (supabase === null) {
    return (
      <>
        <DashboardModuleTitle locale={locale} titleKey="dashboard.media.heading" />
        <p>{translate(locale, "dashboard.catalog.errorWrite")}</p>
      </>
    );
  }

  const row = await readMediaAssetRow(supabase, resolved.id);
  if (row === null) notFound();

  const [bucketAvailable, holders] = await Promise.all([
    mediaAssetBucketAvailable(supabase),
    listMediaAssetHolders(supabase, row.id, locale),
  ]);

  return (
    <>
      <DashboardModuleTitle locale={locale} titleKey="dashboard.media.heading" />
      <MediaAssetForm
        locale={locale}
        row={row}
        notice={notice}
        bucketAvailable={bucketAvailable}
        holders={holders}
      />
    </>
  );
}
