import type { Metadata } from "next";
import { pageMetadata } from "@/lib/pageMetadata";
import { requireLocale } from "@/components/site/StaticShellPage";
import { SiteHome } from "@/components/site/SiteHome";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await requireLocale(params);
  return pageMetadata(locale, "page.home.title", "");
}

export default async function Page({ params }: Props) {
  const locale = await requireLocale(params);
  return <SiteHome locale={locale} />;
}
