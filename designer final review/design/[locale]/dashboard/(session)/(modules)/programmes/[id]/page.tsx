import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DashboardModuleTitle } from "@/components/dashboard/DashboardChrome";
import { CatalogRowList, type CatalogListRow } from "@/components/dashboard/CatalogListing";
import { ProgrammeForm } from "@/components/dashboard/ProgrammeForm";
import { ProgrammeTierForm } from "@/components/dashboard/ProgrammeTierForm";
import extra from "@/components/dashboard/CatalogEntityForm.module.css";
import { SectionHeader } from "@/components/ui/SectionHeader";
import {
  countProgrammeDependents,
  countProgrammeTierMemberships,
  existingIdFromQuery,
  isRowId,
  listProgrammeTierRows,
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
  searchParams: Promise<{
    error?: string;
    saved?: string;
    groups?: string;
    existing?: string;
    existing_label?: string;
  }>;
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
  const existingLabel = query.existing_label ?? existingIdFromQuery(query.existing);

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
  const [dependents, tiers] = await Promise.all([
    countProgrammeDependents(supabase, row.id),
    listProgrammeTierRows(supabase, row.id),
  ]);
  const membershipCounts = await Promise.all(
    tiers.map((tier) => countProgrammeTierMemberships(supabase, tier.id)),
  );
  const tierRows: CatalogListRow[] = tiers.map((tier, index) => {
    const memberships = membershipCounts[index] ?? 0;
    const label = `${tier.tier_axis} · ${tier.audience_axis} · ${memberships} ProgrammeLabTest`;
    return {
      id: tier.id,
      name_ar: label,
      name_en: label,
      publication_state: tier.publication_state,
      display_order: tier.display_order,
    };
  });

  return (
    <>
      <DashboardModuleTitle locale={locale} titleKey="dashboard.programmes.heading" />
      <div className={extra.groups}>
        <div className={extra.groups}>
          <SectionHeader locale={locale} titleKey="dashboard.programmes.sectionTiers" level="h2" />
          <CatalogRowList
            locale={locale}
            rows={tierRows}
            editPrefix={`/dashboard/programmes/${row.id}/tiers`}
          />
          <ProgrammeTierForm
            locale={locale}
            programmeId={row.id}
            row={null}
            notice={notice}
            existingLabel={existingLabel}
            membershipCount={null}
          />
        </div>
        <ProgrammeForm
          locale={locale}
          row={row}
          notice={notice}
          bilingualGroups={bilingualGroups}
          dependents={dependents}
        />
      </div>
    </>
  );
}
