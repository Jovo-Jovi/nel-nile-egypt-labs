import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DashboardModuleTitle } from "@/components/dashboard/DashboardChrome";
import { ProgrammeLabTestForm } from "@/components/dashboard/ProgrammeLabTestForm";
import extra from "@/components/dashboard/CatalogEntityForm.module.css";
import {
  existingIdFromQuery,
  isRowId,
  listLabTestRows,
  noticeFromQuery,
  parseCatalogBilingualGroups,
  PROGRAMME_LAB_TEST_PAIR_STEMS,
  readProgrammeLabTestRow,
  readProgrammeRow,
  readProgrammeTierRow,
} from "@/lib/dashboard/catalogEntities";
import { requireLocale } from "@/components/site/StaticShellPage";
import { pageMetadata } from "@/lib/pageMetadata";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { translate } from "@/lib/catalog";
import { localeHref } from "@/lib/locale";

type Props = {
  params: Promise<{ locale: string; id: string; tierId: string; membershipId: string }>;
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

export default async function ProgrammeLabTestEditPage({ params, searchParams }: Props) {
  const resolved = await params;
  const locale = await requireLocale(Promise.resolve({ locale: resolved.locale }));
  const query = await searchParams;
  const notice = noticeFromQuery(query);
  const bilingualGroups = parseCatalogBilingualGroups(query.groups, PROGRAMME_LAB_TEST_PAIR_STEMS);
  const existingLabel = query.existing_label ?? existingIdFromQuery(query.existing);

  if (!isRowId(resolved.id) || !isRowId(resolved.tierId) || !isRowId(resolved.membershipId)) {
    notFound();
  }

  const supabase = await createSupabaseServerClient();
  if (supabase === null) {
    return (
      <>
        <DashboardModuleTitle locale={locale} titleKey="dashboard.programmes.heading" />
        <p>{translate(locale, "dashboard.catalog.errorWrite")}</p>
      </>
    );
  }

  const [programme, tier, membership, labTests] = await Promise.all([
    readProgrammeRow(supabase, resolved.id),
    readProgrammeTierRow(supabase, resolved.tierId),
    readProgrammeLabTestRow(supabase, resolved.membershipId),
    listLabTestRows(supabase),
  ]);
  if (
    programme === null ||
    tier === null ||
    membership === null ||
    tier.Programme !== programme.id ||
    membership.ProgrammeTier !== tier.id
  ) {
    notFound();
  }

  const labTest = labTests.find((item) => item.id === membership.LabTest) ?? null;

  return (
    <>
      <DashboardModuleTitle locale={locale} titleKey="dashboard.programmes.heading" />
      <div className={extra.groups}>
        <p className={extra.help}>
          <Link
            className={extra.editLink}
            href={localeHref(locale, `/dashboard/programmes/${programme.id}/tiers/${tier.id}`)}
          >
            {translate(locale, "dashboard.programmes.backToTier")}
          </Link>
        </p>
        <ProgrammeLabTestForm
          locale={locale}
          programmeId={programme.id}
          programmeTierId={tier.id}
          row={membership}
          notice={notice}
          bilingualGroups={bilingualGroups}
          existingLabel={existingLabel}
          labTests={labTests}
          labTestSlug={labTest?.slug ?? null}
        />
      </div>
    </>
  );
}
