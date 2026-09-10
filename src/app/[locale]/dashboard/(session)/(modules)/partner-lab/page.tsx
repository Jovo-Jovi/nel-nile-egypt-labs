import type { Metadata } from "next";
import { DashboardModuleTitle } from "@/components/dashboard/DashboardChrome";
import { PartnerLabReviewForm } from "@/components/dashboard/PartnerLabReviewForm";
import { requireLocale } from "@/components/site/StaticShellPage";
import { translate } from "@/lib/catalog";
import {
  listPartnerLabReviewRows,
  type PartnerLabReviewKind,
} from "@/lib/dashboard/partnerAccountAdmin";
import { pageMetadata } from "@/lib/pageMetadata";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ view?: string; error?: string; saved?: string; ended?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await requireLocale(params);
  return pageMetadata(locale, "dashboard.partnerLab.heading", "/dashboard/partner-lab");
}

function parseKind(raw: string | undefined): PartnerLabReviewKind {
  if (raw === "approved" || raw === "rejected") return raw;
  return "pending";
}

function noticeFromQuery(query: { view?: string; error?: string; saved?: string; ended?: string }): "saved" | "ended" | "write" | "missing" | null {
  if (query.ended === "1" && query.saved === "1") return "ended";
  if (query.saved === "1") return "saved";
  if (query.error === "write") return "write";
  if (query.error === "missing") return "missing";
  return null;
}

export default async function PartnerLabReviewPage({ params, searchParams }: Props) {
  const locale = await requireLocale(params);
  const query = await searchParams;
  const kind = parseKind(query.view);
  const rows = await listPartnerLabReviewRows(kind);

  if (rows === null) {
    return (
      <>
        <DashboardModuleTitle locale={locale} titleKey="dashboard.partnerLab.heading" />
        <p>{translate(locale, "dashboard.partnerLab.error")}</p>
      </>
    );
  }

  return (
    <>
      <DashboardModuleTitle locale={locale} titleKey="dashboard.partnerLab.heading" />
      <PartnerLabReviewForm locale={locale} kind={kind} rows={rows} notice={noticeFromQuery(query)} />
    </>
  );
}
