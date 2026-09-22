import type { Metadata } from "next";
import extra from "@/components/dashboard/CatalogEntityForm.module.css";
import { DashboardModuleTitle } from "@/components/dashboard/DashboardChrome";
import { PartnerLabProvisionForm } from "@/components/dashboard/PartnerLabProvisionForm";
import { PartnerLabReviewForm } from "@/components/dashboard/PartnerLabReviewForm";
import { requireLocale } from "@/components/site/StaticShellPage";
import { translate } from "@/lib/catalog";
import {
  listPartnerLabReviewRows,
  type PartnerLabProvisionReason,
  type PartnerLabReviewKind,
} from "@/lib/dashboard/partnerAccountAdmin";
import { pageMetadata } from "@/lib/pageMetadata";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    view?: string;
    error?: string;
    saved?: string;
    ended?: string;
    provision?: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await requireLocale(params);
  return pageMetadata(locale, "dashboard.partnerLab.heading", "/dashboard/partner-lab");
}

function parseKind(raw: string | undefined): PartnerLabReviewKind {
  if (raw === "approved" || raw === "rejected") return raw;
  return "pending";
}

function noticeFromQuery(query: {
  view?: string;
  error?: string;
  saved?: string;
  ended?: string;
}): "saved" | "ended" | "write" | "missing" | null {
  if (query.ended === "1" && query.saved === "1") return "ended";
  if (query.saved === "1") return "saved";
  if (query.error === "write") return "write";
  if (query.error === "missing") return "missing";
  return null;
}

const PROVISION_REASONS: readonly PartnerLabProvisionReason[] = [
  "empty",
  "too_long",
  "eastern_arabic",
  "non_digit",
  "password",
  "password_refused",
  "duplicate",
  "config",
  "write",
];

function provisionNoticeFromQuery(
  raw: string | undefined,
): "created" | PartnerLabProvisionReason | null {
  if (raw === "created") return "created";
  for (const reason of PROVISION_REASONS) {
    if (reason === raw) return reason;
  }
  return null;
}

export default async function PartnerLabReviewPage({ params, searchParams }: Props) {
  const locale = await requireLocale(params);
  const query = await searchParams;
  const kind = parseKind(query.view);
  const rows = await listPartnerLabReviewRows(kind);
  const provisionNotice = provisionNoticeFromQuery(query.provision);

  if (rows === null) {
    return (
      <>
        <DashboardModuleTitle locale={locale} titleKey="dashboard.partnerLab.heading" />
        <p>{translate(locale, "dashboard.partnerLab.error")}</p>
        <div className={extra.groups}>
          <PartnerLabProvisionForm locale={locale} notice={provisionNotice} />
        </div>
      </>
    );
  }

  return (
    <>
      <DashboardModuleTitle locale={locale} titleKey="dashboard.partnerLab.heading" />
      <div className={extra.groups}>
        <PartnerLabProvisionForm locale={locale} notice={provisionNotice} />
        <PartnerLabReviewForm locale={locale} kind={kind} rows={rows} notice={noticeFromQuery(query)} />
      </div>
    </>
  );
}
