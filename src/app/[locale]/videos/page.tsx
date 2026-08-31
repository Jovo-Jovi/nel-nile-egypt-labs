import type { Metadata } from "next";
import { pageMetadata } from "@/lib/pageMetadata";
import { requireLocale, StaticShellPage } from "@/components/site/StaticShellPage";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await requireLocale(params);
  return pageMetadata(locale, "page.videos.title", "/videos");
}

export default async function Page({ params }: Props) {
  const locale = await requireLocale(params);
  return (
    <StaticShellPage locale={locale} titleKey="page.videos.title" pendingLabelKey="approval.pending.videoAsset" />
  );
}
