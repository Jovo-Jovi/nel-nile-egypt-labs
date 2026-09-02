import type { Metadata } from "next";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { requireLocale } from "@/components/site/StaticShellPage";
import { pageMetadata } from "@/lib/pageMetadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await requireLocale(params);
  return pageMetadata(locale, "dashboard.offers.heading", "/dashboard/offers");
}

export default async function DashboardOffersPage({ params }: Props) {
  const locale = await requireLocale(params);
  return <SectionHeader locale={locale} titleKey="dashboard.offers.heading" />;
}
