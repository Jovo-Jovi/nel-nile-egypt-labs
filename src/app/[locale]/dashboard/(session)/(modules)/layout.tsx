import type { ReactNode } from "react";
import { ModuleNav } from "@/components/dashboard/ModuleNav";
import { requireLocale } from "@/components/site/StaticShellPage";
import { readOperatorAccess } from "@/lib/dashboard/assurance";
import { gateModuleRoute } from "@/lib/dashboard/gates";

export default async function ModulesLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const locale = await requireLocale(params);
  const access = await readOperatorAccess();
  gateModuleRoute(access, locale);
  return (
    <>
      <ModuleNav locale={locale} />
      {children}
    </>
  );
}
