import type { Metadata } from "next";
import { pageMetadata } from "@/lib/pageMetadata";
import { listPublishedProgrammeSlugs } from "@/lib/publishedProgrammeSlugs";
import { requireLocale, StaticShellPage } from "@/components/site/StaticShellPage";

type Props = { params: Promise<{ locale: string; slug: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await listPublishedProgrammeSlugs();
  const params = slugs.map((slug) => ({ slug }));
  console.log("[p03-t01] generateStaticParams programmes/[slug] =", JSON.stringify(params));
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const locale = await requireLocale(params);
  return pageMetadata(locale, "page.programmes.title", `/programmes/${slug}`);
}

export default async function Page({ params }: Props) {
  const locale = await requireLocale(params);
  return (
    <StaticShellPage locale={locale} titleKey="page.programmes.title" pendingLabelKey="approval.pending.clinical" />
  );
}
