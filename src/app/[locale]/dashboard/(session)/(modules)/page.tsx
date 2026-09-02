import type { Metadata } from "next";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { requireLocale } from "@/components/site/StaticShellPage";
import { pageMetadata } from "@/lib/pageMetadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await requireLocale(params);
  return pageMetadata(locale, "dashboard.home.title", "/dashboard");
}

export default async function DashboardHomePage({ params }: Props) {
  const locale = await requireLocale(params);
  return <SectionHeader locale={locale} titleKey="dashboard.home.title" />;
}
