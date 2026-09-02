import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLabTestContentEnabled } from "@/lib/clinicalFlag";
import { localizedText } from "@/lib/listingFormat";
import { pageMetadata } from "@/lib/pageMetadata";
import { resolveEachPublishedSlot } from "@/lib/programmeLabTests";
import { publishedProgrammeBySlug } from "@/lib/publishedProgrammeDetail";
import { listPublishedProgrammeSlugs } from "@/lib/publishedProgrammeSlugs";
import { requireLocale } from "@/components/site/StaticShellPage";
import { ProgrammeDetail } from "@/components/site/ProgrammeDetail";

type Props = { params: Promise<{ locale: string; slug: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await listPublishedProgrammeSlugs();
  const params = slugs.map((slug) => ({ slug }));
  console.log("[p03-t08] generateStaticParams programmes/[slug] =", JSON.stringify(params));
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const locale = await requireLocale(params);
  const base = pageMetadata(locale, "page.programmes.title", `/programmes/${slug}`);
  const detail = await publishedProgrammeBySlug(slug);
  if (detail === null) return base;
  const name = localizedText(locale, detail.nameAr, detail.nameEn);
  return { ...base, title: name };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const locale = await requireLocale(params);
  const detail = await publishedProgrammeBySlug(slug);
  if (detail === null) notFound();

  const labTestContent = isLabTestContentEnabled();
  const resolutions = labTestContent
    ? await resolveEachPublishedSlot(detail.id, detail.slots)
    : null;

  if (resolutions !== null) {
    for (const resolution of resolutions) {
      console.log(
        "[p03-t08] programmeLabTests",
        resolution.slot.tier,
        resolution.slot.audience,
        resolution.rows.length,
      );
    }
  }

  return <ProgrammeDetail locale={locale} detail={detail} resolutions={resolutions} />;
}
