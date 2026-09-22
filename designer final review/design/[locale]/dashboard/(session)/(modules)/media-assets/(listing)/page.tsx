import type { Metadata } from "next";
import { DashboardModuleTitle } from "@/components/dashboard/DashboardChrome";
import { MediaAssetForm, MediaLibraryListing } from "@/components/dashboard/MediaAssetForm";
import { CatalogEmptyState } from "@/components/dashboard/CatalogListing";
import extra from "@/components/dashboard/CatalogEntityForm.module.css";
import { noticeFromQuery } from "@/lib/dashboard/catalogEntities";
import { requireLocale } from "@/components/site/StaticShellPage";
import { listMediaAssetOptions, mediaAssetBucketAvailable } from "@/lib/dashboard/mediaAsset";
import { pageMetadata } from "@/lib/pageMetadata";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { translate } from "@/lib/catalog";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await requireLocale(params);
  return pageMetadata(locale, "dashboard.media.heading", "/dashboard/media-assets");
}

export default async function MediaAssetsPage({ params, searchParams }: Props) {
  const locale = await requireLocale(params);
  const notice = noticeFromQuery(await searchParams);

  const supabase = await createSupabaseServerClient();
  if (supabase === null) {
    return (
      <>
        <DashboardModuleTitle locale={locale} titleKey="dashboard.media.heading" />
        <p>{translate(locale, "dashboard.catalog.errorWrite")}</p>
      </>
    );
  }

  const [rows, bucketAvailable] = await Promise.all([
    listMediaAssetOptions(supabase),
    mediaAssetBucketAvailable(supabase),
  ]);

  return (
    <>
      <DashboardModuleTitle locale={locale} titleKey="dashboard.media.heading" />
      <div className={extra.groups}>
        {rows.length === 0 ? (
          <CatalogEmptyState locale={locale} createHref="#create" />
        ) : (
          <MediaLibraryListing locale={locale} rows={rows} />
        )}
        <MediaAssetForm
          locale={locale}
          row={null}
          notice={notice}
          bucketAvailable={bucketAvailable}
          holders={[]}
        />
      </div>
    </>
  );
}
