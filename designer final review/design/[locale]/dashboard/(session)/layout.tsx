import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { DashboardChrome } from "@/components/dashboard/DashboardChrome";
import { PartnerLabStatus } from "@/components/partner-lab/PartnerLabStatus";
import { requireLocale } from "@/components/site/StaticShellPage";
import { readOperatorAccess } from "@/lib/dashboard/assurance";
import { partnerLabStatusKind, readNelSession } from "@/lib/nelSession";
import { localeHref } from "@/lib/locale";

export default async function SessionLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const locale = await requireLocale(params);
  const access = await readOperatorAccess();
  if (!access.signedIn) redirect(localeHref(locale, "/dashboard/sign-in"));
  if (access.isOperator) {
    return (
      <DashboardChrome locale={locale} showSignOut>
        {children}
      </DashboardChrome>
    );
  }

  const session = await readNelSession();
  const kind = partnerLabStatusKind(session);
  if (kind === "approved") redirect(localeHref(locale, "/offers"));

  return (
    <DashboardChrome locale={locale} showSignOut>
      <PartnerLabStatus locale={locale} kind={kind === "declined" ? "declined" : "pending"} />
    </DashboardChrome>
  );
}
