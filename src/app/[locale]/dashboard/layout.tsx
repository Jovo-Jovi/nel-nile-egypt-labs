import type { ReactNode } from "react";
import { requireLocale } from "@/components/site/StaticShellPage";
import styles from "./layout.module.css";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "default-no-store";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const locale = await requireLocale(params);

  return (
    <div className={styles.root} data-locale={locale}>
      {children}
    </div>
  );
}
