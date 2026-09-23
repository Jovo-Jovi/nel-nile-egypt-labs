import type { Metadata } from "next";
import Link from "next/link";
import { CompletenessHeader } from "@/components/dashboard/CompletenessHeader";
import { DashboardModuleTitle } from "@/components/dashboard/DashboardChrome";
import extra from "@/components/dashboard/CatalogEntityForm.module.css";
import { requireLocale } from "@/components/site/StaticShellPage";
import { translate, type CatalogKey, type Locale } from "@/lib/catalog";
import {
  countClinicalProgress,
  countDashboardModules,
  type ClinicalProgressCounts,
  type PublicationCounts,
} from "@/lib/dashboard/moduleCounts";
import { gateModuleRoute } from "@/lib/dashboard/gates";
import { readOperatorAccess } from "@/lib/dashboard/assurance";
import { pageMetadata } from "@/lib/pageMetadata";
import { localeHref } from "@/lib/locale";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type Props = { params: Promise<{ locale: string }> };

const MODULE_CARDS: {
  suffix: string;
  labelKey: CatalogKey;
  table:
    | "Offer"
    | "Video"
    | "Equipment"
    | "Branch"
    | "Programme"
    | "LabTest"
    | "LabUnit"
    | "SiteSettings"
    | "MediaAsset"
    | "Announcement";
}[] = [
  { suffix: "/dashboard/offers", labelKey: "dashboard.nav.offers", table: "Offer" },
  { suffix: "/dashboard/videos", labelKey: "dashboard.nav.videos", table: "Video" },
  { suffix: "/dashboard/equipment", labelKey: "dashboard.nav.equipment", table: "Equipment" },
  { suffix: "/dashboard/branches", labelKey: "dashboard.nav.branches", table: "Branch" },
  { suffix: "/dashboard/programmes", labelKey: "dashboard.nav.programmes", table: "Programme" },
  { suffix: "/dashboard/lab-tests", labelKey: "dashboard.nav.labTests", table: "LabTest" },
  { suffix: "/dashboard/lab-units", labelKey: "dashboard.nav.labUnits", table: "LabUnit" },
  { suffix: "/dashboard/site-settings", labelKey: "dashboard.nav.siteSettings", table: "SiteSettings" },
  { suffix: "/dashboard/media-assets", labelKey: "dashboard.nav.mediaAssets", table: "MediaAsset" },
  { suffix: "/dashboard/announcements", labelKey: "dashboard.nav.announcements", table: "Announcement" },
];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await requireLocale(params);
  return pageMetadata(locale, "dashboard.home.title", "/dashboard");
}

function countLabel(locale: Locale, counts: PublicationCounts): string {
  const published = translate(locale, "dashboard.home.published");
  const draft = translate(locale, "dashboard.home.draft");
  return `${counts.published} ${published} · ${counts.draft} ${draft}`;
}

function clinicalLines(locale: Locale, progress: ClinicalProgressCounts): string[] {
  return [
    translate(locale, "dashboard.home.awaitingSignOff"),
    `${progress.labTestArabicNamed} / ${progress.labTestTotal} ${translate(locale, "dashboard.home.arabicNames")}`,
    `${progress.membershipsReviewed} / ${progress.membershipsTotal} ${translate(locale, "dashboard.home.membershipsReviewed")}`,
    `${progress.qaFlagsOutstanding} ${translate(locale, "dashboard.home.qaFlagsOutstanding")}`,
  ];
}

export default async function DashboardHomePage({ params }: Props) {
  const locale = await requireLocale(params);
  const access = await readOperatorAccess();
  gateModuleRoute(access, locale);

  const supabase = await createSupabaseServerClient();
  if (supabase === null) {
    return (
      <>
        <DashboardModuleTitle locale={locale} titleKey="dashboard.home.title" />
        <p>{translate(locale, "dashboard.catalog.errorWrite")}</p>
      </>
    );
  }

  const [counts, progress] = await Promise.all([
    countDashboardModules(supabase),
    countClinicalProgress(supabase),
  ]);

  return (
    <>
      <DashboardModuleTitle locale={locale} titleKey="dashboard.home.title" />
      <CompletenessHeader locale={locale} variant="full" notes={clinicalLines(locale, progress)} />
      <ul className={extra.homeGrid} data-nel-container="home">
        {MODULE_CARDS.map((mod) => (
          <li key={mod.suffix}>
            <Link className={extra.homeCell} href={localeHref(locale, mod.suffix)}>
              <span className={extra.homeName}>{translate(locale, mod.labelKey)}</span>
              <span className={extra.homeMeta}>{countLabel(locale, counts[mod.table])}</span>
            </Link>
          </li>
        ))}
        <li>
          <Link className={extra.homeCell} href={localeHref(locale, "/dashboard/partner-lab")}>
            <span className={extra.homeName}>{translate(locale, "dashboard.nav.partnerLab")}</span>
            <span className={extra.homeMeta}>{translate(locale, "dashboard.partnerLab.homeMeta")}</span>
          </Link>
        </li>
      </ul>
    </>
  );
}
