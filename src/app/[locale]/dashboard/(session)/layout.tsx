import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { DashboardChrome } from "@/components/dashboard/DashboardChrome";
import { requireLocale } from "@/components/site/StaticShellPage";
import { readOperatorAccess } from "@/lib/dashboard/assurance";
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

  return (
    <DashboardChrome locale={locale} showSignOut>
      {children}
    </DashboardChrome>
  );
}
