import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import type { CatalogKey } from "@/lib/catalog";
import { isLocale, type Locale } from "@/lib/locale";
import { ApprovalGate } from "@/components/ui/ApprovalGate";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SkeletonBar } from "@/components/ui/SkeletonBar";
import styles from "./StaticShellPage.module.css";

interface StaticShellPageProps {
  locale: Locale;
  titleKey: CatalogKey;
  pendingLabelKey: CatalogKey;
  children?: ReactNode;
}

export async function requireLocale(params: Promise<{ locale: string }>): Promise<Locale> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return locale;
}

export function StaticShellPage({ locale, titleKey, pendingLabelKey, children }: StaticShellPageProps) {
  return (
    <div className={styles.page}>
      <SectionHeader locale={locale} titleKey={titleKey} />
      <ApprovalGate locale={locale} state="pending" pendingLabelKey={pendingLabelKey}>
        <div className={styles.body}>
          <SkeletonBar size="lg" widthPercent={64} />
          <SkeletonBar size="base" widthPercent={100} />
          <SkeletonBar size="base" widthPercent={82} />
        </div>
      </ApprovalGate>
      {children ? <div className={styles.actions}>{children}</div> : null}
    </div>
  );
}
