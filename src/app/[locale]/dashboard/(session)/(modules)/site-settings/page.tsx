import type { Metadata } from "next";
import { DashboardModuleTitle } from "@/components/dashboard/DashboardChrome";
import { SiteSettingsCreateForm, SiteSettingsForm } from "@/components/dashboard/SiteSettingsForm";
import type { SiteSettingsNotice } from "@/components/dashboard/SiteSettingsForm";
import { requireLocale } from "@/components/site/StaticShellPage";
import { translate } from "@/lib/catalog";
import { readSiteSettingsRow } from "@/lib/dashboard/siteSettings";
import { pageMetadata } from "@/lib/pageMetadata";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await requireLocale(params);
  return pageMetadata(locale, "dashboard.siteSettings.heading", "/dashboard/site-settings");
}

function noticeFromQuery(query: { error?: string; saved?: string }): SiteSettingsNotice {
  if (query.saved === "1") return "saved";
  if (query.error === "https") return "https";
  if (query.error === "bilingual") return "bilingual";
  if (query.error === "missing") return "missing";
  if (query.error === "write") return "write";
  if (query.error === "create") return "create";
  if (query.error === "exists") return "exists";
  return null;
}

export default async function SiteSettingsPage({ params, searchParams }: Props) {
  const locale = await requireLocale(params);
  const notice = noticeFromQuery(await searchParams);

  const supabase = await createSupabaseServerClient();
  if (supabase === null) {
    return (
      <>
        <DashboardModuleTitle locale={locale} titleKey="dashboard.siteSettings.heading" />
        <p>{translate(locale, "dashboard.siteSettings.errorWrite")}</p>
      </>
    );
  }

  const row = await readSiteSettingsRow(supabase);

  return (
    <>
      <DashboardModuleTitle locale={locale} titleKey="dashboard.siteSettings.heading" />
      {row === null ? (
        <SiteSettingsCreateForm locale={locale} notice={notice} />
      ) : (
        <SiteSettingsForm locale={locale} row={row} notice={notice} />
      )}
    </>
  );
}
