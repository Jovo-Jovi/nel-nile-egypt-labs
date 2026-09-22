import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DashboardModuleTitle } from "@/components/dashboard/DashboardChrome";
import { CatalogRowList, type CatalogListRow } from "@/components/dashboard/CatalogListing";
import { ProgrammeTierForm } from "@/components/dashboard/ProgrammeTierForm";
import { ProgrammeLabTestForm } from "@/components/dashboard/ProgrammeLabTestForm";
import extra from "@/components/dashboard/CatalogEntityForm.module.css";
import { IsolatedCopy } from "@/components/ui/Isolate";
import { SectionHeader } from "@/components/ui/SectionHeader";
import {
  countProgrammeTierMemberships,
  existingIdFromQuery,
  isRowId,
  listLabTestRows,
  listProgrammeLabTestRows,
  noticeFromQuery,
  parseCatalogBilingualGroups,
  PROGRAMME_LAB_TEST_PAIR_STEMS,
  readProgrammeRow,
  readProgrammeTierRow,
} from "@/lib/dashboard/catalogEntities";
import { requireLocale } from "@/components/site/StaticShellPage";
import { pageMetadata } from "@/lib/pageMetadata";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { translate } from "@/lib/catalog";
import { localeHref } from "@/lib/locale";
import { resolveSlotLabTests } from "@/lib/programmeLabTests";

type Props = {
  params: Promise<{ locale: string; id: string; tierId: string }>;
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

export default async function ProgrammeTierEditPage({ params, searchParams }: Props) {
  const resolved = await params;
  const locale = await requireLocale(Promise.resolve({ locale: resolved.locale }));
  const query = await searchParams;
  const notice = noticeFromQuery(query);
  const bilingualGroups = parseCatalogBilingualGroups(query.groups, PROGRAMME_LAB_TEST_PAIR_STEMS);
  const existingLabel = query.existing_label ?? existingIdFromQuery(query.existing);

  if (!isRowId(resolved.id) || !isRowId(resolved.tierId)) notFound();

  const supabase = await createSupabaseServerClient();
  if (supabase === null) {
    return (
      <>
        <DashboardModuleTitle locale={locale} titleKey="dashboard.programmes.heading" />
        <p>{translate(locale, "dashboard.catalog.errorWrite")}</p>
      </>
    );
  }

  const [programme, tier] = await Promise.all([
    readProgrammeRow(supabase, resolved.id),
    readProgrammeTierRow(supabase, resolved.tierId),
  ]);
  if (programme === null || tier === null || tier.Programme !== programme.id) notFound();

  const [membershipCount, memberships, labTests] = await Promise.all([
    countProgrammeTierMemberships(supabase, tier.id),
    listProgrammeLabTestRows(supabase, tier.id),
    listLabTestRows(supabase),
  ]);

  const labTestById = new Map(labTests.map((labTest) => [labTest.id, labTest]));
  const membershipRows: CatalogListRow[] = memberships.map((membership) => {
    const labTest = labTestById.get(membership.LabTest);
    const slug = labTest?.slug ?? membership.LabTest;
    const flag = labTest?.qa_flag;
    const label =
      flag !== null && flag !== undefined && flag.length > 0
        ? `${slug} · ${membership.eligibility_audience} · ${flag}`
        : `${slug} · ${membership.eligibility_audience}`;
    return {
      id: membership.id,
      name_ar: label,
      name_en: label,
      publication_state: membership.publication_state,
      display_order: membership.display_order,
    };
  });

  let resolvedRows: Awaited<ReturnType<typeof resolveSlotLabTests>> = [];
  try {
    resolvedRows = await resolveSlotLabTests(programme.id, {
      tier: tier.tier_axis,
      audience: tier.audience_axis,
    });
  } catch {
    resolvedRows = [];
  }

  return (
    <>
      <DashboardModuleTitle locale={locale} titleKey="dashboard.programmes.heading" />
      <div className={extra.groups}>
        <p className={extra.help}>
          <Link className={extra.editLink} href={localeHref(locale, `/dashboard/programmes/${programme.id}`)}>
            {translate(locale, "dashboard.programmes.backToProgramme")}
          </Link>
        </p>
        <div className={extra.groups}>
          <SectionHeader locale={locale} titleKey="dashboard.programmes.sectionMemberships" level="h2" />
          <CatalogRowList
            locale={locale}
            rows={membershipRows}
            editPrefix={`/dashboard/programmes/${programme.id}/tiers/${tier.id}/memberships`}
          />
          <ProgrammeLabTestForm
            locale={locale}
            programmeId={programme.id}
            programmeTierId={tier.id}
            row={null}
            notice={notice}
            bilingualGroups={bilingualGroups}
            existingLabel={existingLabel}
            labTests={labTests}
            labTestSlug={null}
          />
        </div>
        <div className={extra.groups}>
          <SectionHeader locale={locale} titleKey="dashboard.programmes.resolvedSet" level="h2" />
          {resolvedRows.length === 0 ? (
            <p className={extra.help}>
              <IsolatedCopy locale={locale} text={translate(locale, "dashboard.programmes.resolvedEmpty")} />
            </p>
          ) : (
            <ul className={extra.list}>
              {resolvedRows.map((item) => {
                const name = locale === "ar" ? item.nameAr || item.nameEn : item.nameEn || item.nameAr;
                return (
                  <li key={item.id}>
                    <p className={extra.rowName}>
                      <IsolatedCopy locale={locale} text={name} />
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <ProgrammeTierForm
          locale={locale}
          programmeId={programme.id}
          row={tier}
          notice={notice}
          existingLabel={existingLabel}
          membershipCount={membershipCount}
        />
      </div>
    </>
  );
}
