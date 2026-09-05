import type { Metadata } from "next";
import { DashboardModuleTitle } from "@/components/dashboard/DashboardChrome";
import { LabTestForm } from "@/components/dashboard/LabTestForm";
import { CatalogRowList } from "@/components/dashboard/CatalogListing";
import extra from "@/components/dashboard/CatalogEntityForm.module.css";
import {
  LAB_TEST_PAIR_STEMS,
  listLabTestRows,
  listLabUnitRows,
  noticeFromQuery,
  parseCatalogBilingualGroups,
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
  return pageMetadata(locale, "dashboard.labTests.heading", "/dashboard/lab-tests");
}

export default async function LabTestsPage({ params, searchParams }: Props) {
  const locale = await requireLocale(params);
  const query = await searchParams;
  const notice = noticeFromQuery(query);
  const bilingualGroups = parseCatalogBilingualGroups(query.groups, LAB_TEST_PAIR_STEMS);

  const supabase = await createSupabaseServerClient();
  if (supabase === null) {
    return (
      <>
        <DashboardModuleTitle locale={locale} titleKey="dashboard.labTests.heading" />
        <p>{translate(locale, "dashboard.catalog.errorWrite")}</p>
      </>
    );
  }

  const [rows, labUnits] = await Promise.all([listLabTestRows(supabase), listLabUnitRows(supabase)]);

  return (
    <>
      <DashboardModuleTitle locale={locale} titleKey="dashboard.labTests.heading" />
      <div className={extra.groups}>
        <CatalogRowList locale={locale} rows={rows} editPrefix="/dashboard/lab-tests" />
        <LabTestForm
          locale={locale}
          row={null}
          notice={notice}
          bilingualGroups={bilingualGroups}
          labUnits={labUnits}
          membershipCount={0}
        />
      </div>
    </>
  );
}
