import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLabTestContentEnabled } from "@/lib/clinicalFlag";
import { localizedText } from "@/lib/listingFormat";
import { pageMetadata } from "@/lib/pageMetadata";
import { resolveEachPublishedSlot } from "@/lib/programmeLabTests";
import { publishedProgrammeBySlug } from "@/lib/publishedProgrammeDetail";
import { requireLocale } from "@/components/site/StaticShellPage";
import { ProgrammeDetail } from "@/components/site/ProgrammeDetail";

type Props = { params: Promise<{ locale: string; slug: string }> };

// Slug availability was bound to build time (`generateStaticParams` plus
// `dynamicParams = false`). Publishing reached the listing via
// `revalidatePublishedProgrammes` but not the detail route until a
// deploy. An unpublished Programme would have kept serving from a
// prerendered artefact against SECURITY_MODEL.md §3. `notFound()` on a
// null `publishedProgrammeBySlug` lookup is now the guard.
export const dynamic = "force-dynamic";
export const revalidate = 0;

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

  return <ProgrammeDetail locale={locale} detail={detail} resolutions={resolutions} />;
}
