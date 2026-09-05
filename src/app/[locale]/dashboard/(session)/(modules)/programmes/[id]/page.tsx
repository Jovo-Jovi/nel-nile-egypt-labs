import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DashboardModuleTitle } from "@/components/dashboard/DashboardChrome";
import { ProgrammeForm } from "@/components/dashboard/ProgrammeForm";
import {
  countProgrammeDependents,
  isRowId,
  noticeFromQuery,
  parseCatalogBilingualGroups,
  PROGRAMME_PAIR_STEMS,
  readProgrammeRow,
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
  return pageMetadata(locale, "dashboard.programmes.heading", "/dashboard/programmes");
}

export default async function ProgrammeEditPage({ params, searchParams }: Props) {
  const resolved = await params;
  const locale = await requireLocale(Promise.resolve({ locale: resolved.locale }));
  const query = await searchParams;
  const notice = noticeFromQuery(query);
  const bilingualGroups = parseCatalogBilingualGroups(query.groups, PROGRAMME_PAIR_STEMS);

  if (!isRowId(resolved.id)) notFound();

  const supabase = await createSupabaseServerClient();
  if (supabase === null) {
    return (
      <>
        <DashboardModuleTitle locale={locale} titleKey="dashboard.programmes.heading" />
        <p>{translate(locale, "dashboard.catalog.errorWrite")}</p>
      </>
    );
  }

  const row = await readProgrammeRow(supabase, resolved.id);
  if (row === null) notFound();
  const dependents = await countProgrammeDependents(supabase, row.id);

  return (
    <>
      <DashboardModuleTitle locale={locale} titleKey="dashboard.programmes.heading" />
      <ProgrammeForm
        locale={locale}
        row={row}
        notice={notice}
        bilingualGroups={bilingualGroups}
        dependents={dependents}
      />
    </>
  );
}
