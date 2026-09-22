import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DashboardModuleTitle } from "@/components/dashboard/DashboardChrome";
import { LabTestForm } from "@/components/dashboard/LabTestForm";
import {
  countLabTestMemberships,
  isRowId,
  LAB_TEST_PAIR_STEMS,
  listLabUnitRows,
  noticeFromQuery,
  parseCatalogBilingualGroups,
  readLabTestRow,
} from "@/lib/dashboard/catalogEntities";
import { requireLocale } from "@/components/site/StaticShellPage";
import { pageMetadata } from "@/lib/pageMetadata";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { translate } from "@/lib/catalog";

type Props = {
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<{ error?: string; saved?: string; groups?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await requireLocale(params);
  return pageMetadata(locale, "dashboard.labTests.heading", "/dashboard/lab-tests");
}

export default async function LabTestEditPage({ params, searchParams }: Props) {
  const resolved = await params;
  const locale = await requireLocale(Promise.resolve({ locale: resolved.locale }));
  const query = await searchParams;
  const notice = noticeFromQuery(query);
  const bilingualGroups = parseCatalogBilingualGroups(query.groups, LAB_TEST_PAIR_STEMS);

  if (!isRowId(resolved.id)) notFound();

  const supabase = await createSupabaseServerClient();
  if (supabase === null) {
    return (
      <>
        <DashboardModuleTitle locale={locale} titleKey="dashboard.labTests.heading" />
        <p>{translate(locale, "dashboard.catalog.errorWrite")}</p>
      </>
    );
  }

  const row = await readLabTestRow(supabase, resolved.id);
  if (row === null) notFound();
  const [labUnits, membershipCount] = await Promise.all([
    listLabUnitRows(supabase),
    countLabTestMemberships(supabase, row.id),
  ]);

  return (
    <>
      <DashboardModuleTitle locale={locale} titleKey="dashboard.labTests.heading" />
      <LabTestForm
        locale={locale}
        row={row}
        notice={notice}
        bilingualGroups={bilingualGroups}
        labUnits={labUnits}
        membershipCount={membershipCount}
      />
    </>
  );
}
