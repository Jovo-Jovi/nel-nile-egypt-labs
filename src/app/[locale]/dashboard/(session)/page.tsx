import type { Metadata } from "next";
import Link from "next/link";
import { DashboardModuleTitle } from "@/components/dashboard/DashboardChrome";
import extra from "@/components/dashboard/CatalogEntityForm.module.css";
import { IsolatedCopy } from "@/components/ui/Isolate";
import { requireLocale } from "@/components/site/StaticShellPage";
import { translate, type CatalogKey } from "@/lib/catalog";
import { countDashboardModules, type PublicationCounts } from "@/lib/dashboard/moduleCounts";
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
    | "LabUnit"
    | "SiteSettings"
    | "MediaAsset";
}[] = [
  { suffix: "/dashboard/offers", labelKey: "dashboard.nav.offers", table: "Offer" },
  { suffix: "/dashboard/videos", labelKey: "dashboard.nav.videos", table: "Video" },
  { suffix: "/dashboard/equipment", labelKey: "dashboard.nav.equipment", table: "Equipment" },
  { suffix: "/dashboard/branches", labelKey: "dashboard.nav.branches", table: "Branch" },
  { suffix: "/dashboard/programmes", labelKey: "dashboard.nav.programmes", table: "Programme" },
  { suffix: "/dashboard/lab-units", labelKey: "dashboard.nav.labUnits", table: "LabUnit" },
  { suffix: "/dashboard/site-settings", labelKey: "dashboard.nav.siteSettings", table: "SiteSettings" },
  { suffix: "/dashboard/media-assets", labelKey: "dashboard.nav.mediaAssets", table: "MediaAsset" },
];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await requireLocale(params);
  return pageMetadata(locale, "dashboard.home.title", "/dashboard");
}

function countLabel(locale: "ar" | "en", counts: PublicationCounts): string {
  const published = translate(locale, "dashboard.home.published");
  const draft = translate(locale, "dashboard.home.draft");
  return `${counts.published} ${published} · ${counts.draft} ${draft}`;
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

  const counts = await countDashboardModules(supabase);

  return (
    <>
      <DashboardModuleTitle locale={locale} titleKey="dashboard.home.title" />
      <div className={extra.groups} data-nel-container="home">
        <ul className={extra.list}>
          {MODULE_CARDS.map((mod) => {
            const unbuilt = mod.table === "Programme";
            return (
              <li key={mod.suffix}>
                <article className={extra.row}>
                  <div className={extra.rowMain}>
                    <p className={extra.rowName}>{translate(locale, mod.labelKey)}</p>
                    <p className={extra.rowMeta}>{countLabel(locale, counts[mod.table])}</p>
                    {unbuilt ? (
                      <p className={extra.rowMeta}>
                        <IsolatedCopy locale={locale} text={translate(locale, "dashboard.home.unbuilt")} />
                      </p>
                    ) : null}
                  </div>
                  {unbuilt ? null : (
                    <Link className={extra.editLink} href={localeHref(locale, mod.suffix)}>
                      {translate(locale, "dashboard.home.open")}
                    </Link>
                  )}
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
