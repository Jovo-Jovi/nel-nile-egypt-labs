import type { Metadata } from "next";
import { DashboardModuleTitle } from "@/components/dashboard/DashboardChrome";
import { ProgrammeForm } from "@/components/dashboard/ProgrammeForm";
import { CatalogRowList } from "@/components/dashboard/CatalogListing";
import extra from "@/components/dashboard/CatalogEntityForm.module.css";
import {
  noticeFromQuery,
  parseCatalogBilingualGroups,
  PROGRAMME_PAIR_STEMS,
  listProgrammeRows,
} from "@/lib/dashboard/catalogEntities";
import { requireLocale } from "@/components/site/StaticShellPage";
import { pageMetadata } from "@/lib/pageMetadata";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { translate } from "@/lib/catalog";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string; saved?: string; groups?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await requireLocale(params);
  return pageMetadata(locale, "dashboard.programmes.heading", "/dashboard/programmes");
}

export default async function ProgrammesPage({ params, searchParams }: Props) {
  const locale = await requireLocale(params);
  const query = await searchParams;
  const notice = noticeFromQuery(query);
  const bilingualGroups = parseCatalogBilingualGroups(query.groups, PROGRAMME_PAIR_STEMS);

  const supabase = await createSupabaseServerClient();
  if (supabase === null) {
    return (
      <>
        <DashboardModuleTitle locale={locale} titleKey="dashboard.programmes.heading" />
        <p>{translate(locale, "dashboard.catalog.errorWrite")}</p>
      </>
    );
  }

  const rows = await listProgrammeRows(supabase);

  return (
    <>
      <DashboardModuleTitle locale={locale} titleKey="dashboard.programmes.heading" />
      <div className={extra.groups}>
        <CatalogRowList locale={locale} rows={rows} editPrefix="/dashboard/programmes" />
        <ProgrammeForm
          locale={locale}
          row={null}
          notice={notice}
          bilingualGroups={bilingualGroups}
          dependents={null}
        />
      </div>
    </>
  );
}
