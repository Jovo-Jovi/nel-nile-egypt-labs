import type { Metadata } from "next";
import { localizedText } from "@/lib/listingFormat";
import { localeHref } from "@/lib/locale";
import { pageMetadata } from "@/lib/pageMetadata";
import {
  branchMapPins,
  listPublishedBranches,
  listPublishedLabUnits,
  listPublishedProgrammes,
  listPublishedVideos,
  posterAlt,
  posterSrc,
  publishedBranchesHaveMapCoordinates,
  publishedMediaPoster,
  publishedSiteSettings,
  videoWatchHref,
  type PublishedSiteSettings,
} from "@/lib/publishedListings";
import { chromeFromPublishedSettings, headOfficeHoursFromBranches } from "@/lib/publicChrome";
import { PartnerLabStatus } from "@/components/partner-lab/PartnerLabStatus";
import { requireLocale } from "@/components/site/StaticShellPage";
import { SiteHome, type HomeM6Copy } from "@/components/site/SiteHome";
import { loadPartnerFacingSession, partnerLabStatusKind } from "@/lib/nelSession";
import { hasClinicalCatalogueSignOff } from "@/lib/dashboard/clinicalSignOff";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Props = { params: Promise<{ locale: string }> };

function homeM6CopyFromSettings(settings: PublishedSiteSettings | null): HomeM6Copy | null {
  if (settings === null) return null;
  return {
    hero_eyebrow_ar: settings.heroEyebrowAr,
    hero_eyebrow_en: settings.heroEyebrowEn,
    hero_headline_ar: settings.heroHeadlineAr,
    hero_headline_en: settings.heroHeadlineEn,
    hero_standfirst_ar: settings.heroStandfirstAr,
    hero_standfirst_en: settings.heroStandfirstEn,
    reason1_title_ar: settings.reason1TitleAr,
    reason1_title_en: settings.reason1TitleEn,
    reason1_body_ar: settings.reason1BodyAr,
    reason1_body_en: settings.reason1BodyEn,
    reason2_title_ar: settings.reason2TitleAr,
    reason2_title_en: settings.reason2TitleEn,
    reason2_body_ar: settings.reason2BodyAr,
    reason2_body_en: settings.reason2BodyEn,
    reason3_title_ar: settings.reason3TitleAr,
    reason3_title_en: settings.reason3TitleEn,
    reason3_body_ar: settings.reason3BodyAr,
    reason3_body_en: settings.reason3BodyEn,
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await requireLocale(params);
  const base = pageMetadata(locale, "page.home.title", "");
  const settings = await publishedSiteSettings("no-store");
  if (!settings?.seoTitleAr || !settings.seoTitleEn) return base;
  return {
    ...base,
    title: localizedText(locale, settings.seoTitleAr, settings.seoTitleEn),
    description:
      settings.seoDescriptionAr && settings.seoDescriptionEn
        ? localizedText(locale, settings.seoDescriptionAr, settings.seoDescriptionEn)
        : undefined,
  };
}

export default async function Page({ params }: Props) {
  const locale = await requireLocale(params);
  const [settings, labUnits, branches, programmes, videos, partnerFacing] = await Promise.all([
    publishedSiteSettings("no-store"),
    listPublishedLabUnits("no-store"),
    listPublishedBranches("no-store"),
    listPublishedProgrammes("no-store"),
    listPublishedVideos("no-store"),
    loadPartnerFacingSession(),
  ]);
  const heroPoster = await publishedMediaPoster(settings?.heroMediaId ?? null, "no-store");
  const chrome = chromeFromPublishedSettings(settings, locale, branches);
  const offersKind = partnerLabStatusKind(partnerFacing.session);
  const mapApproved = publishedBranchesHaveMapCoordinates(branches);
  return (
    <SiteHome
      locale={locale}
      whatsappHref={chrome.whatsappHref}
      aboutBody={chrome.aboutBody}
      labUnits={labUnits.map((row) => ({
        id: row.id,
        name: localizedText(locale, row.nameAr, row.nameEn),
      }))}
      branchCount={branches.length}
      programmeCount={programmes.length}
      homeM6Copy={homeM6CopyFromSettings(settings)}
      heroPosterSrc={posterSrc(heroPoster)}
      heroPosterAlt={posterAlt(locale, heroPoster)}
      offersAudience={<PartnerLabStatus locale={locale} kind={offersKind} embedded showSignOut={false} />}
      programmes={programmes.map((row) => ({
        id: row.id,
        name: localizedText(locale, row.nameAr, row.nameEn),
        description: localizedText(locale, row.descriptionAr, row.descriptionEn),
        href: localeHref(locale, `/programmes/${row.slug}`),
      }))}
      branches={branches.map((row) => ({
        id: row.id,
        name: localizedText(locale, row.nameAr, row.nameEn),
      }))}
      videos={videos.map((row) => ({
        id: row.id,
        title: localizedText(locale, row.titleAr, row.titleEn),
        posterSrc: posterSrc(row.poster),
        posterAlt: posterAlt(locale, row.poster),
        watchHref: videoWatchHref(row.youtubeId),
      }))}
      mapApproved={mapApproved}
      mapPins={mapApproved ? branchMapPins(branches, locale) : []}
      headOfficeAddress={chrome.headOfficeAddress}
      headOfficeHours={headOfficeHoursFromBranches(branches, locale)}
      clinicalCatalogueSignedOff={hasClinicalCatalogueSignOff()}
    />
  );
}
