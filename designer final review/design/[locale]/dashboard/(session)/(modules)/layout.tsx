import type { ReactNode } from "react";
import { CompletenessHeader } from "@/components/dashboard/CompletenessHeader";
import { ModuleNav } from "@/components/dashboard/ModuleNav";
import frame from "@/components/dashboard/ModuleNav.module.css";
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
    <div className={frame.workspace} data-nel-workspace="">
      <ModuleNav locale={locale} />
      <div className={frame.column}>
        <CompletenessHeader locale={locale} variant="compact" />
        {children}
      </div>
    </div>
  );
}
