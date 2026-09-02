import type { ReactNode } from "react";
import type { CatalogKey } from "@/lib/catalog";
import type { Locale } from "@/lib/locale";
import { ApprovalGate } from "@/components/ui/ApprovalGate";
import { IsolatedCopy } from "@/components/ui/Isolate";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SkeletonBar } from "@/components/ui/SkeletonBar";
import shell from "./StaticShellPage.module.css";
import styles from "./InfoPage.module.css";

interface InfoPageProps {
  locale: Locale;
  titleKey: CatalogKey;
  children: ReactNode;
}

// Shared chrome for the four P03-T07 routes. Approved copy renders as
// §10 cards. Missing facts render through ApprovalGate — never a
// hardcoded number, address, or unestablished legal claim.

export function InfoPage({ locale, titleKey, children }: InfoPageProps) {
  return (
    <div className={shell.page}>
      <SectionHeader locale={locale} titleKey={titleKey} />
      <div className={styles.stack}>{children}</div>
    </div>
  );
}

interface CopyCardProps {
  locale: Locale;
  title?: string;
  body?: string;
  children?: ReactNode;
}

export function CopyCard({ locale, title, body, children }: CopyCardProps) {
  return (
    <article className={styles.card}>
      {title ? (
        <h2 className={styles.title}>
          <IsolatedCopy locale={locale} text={title} />
        </h2>
      ) : null}
      {body ? (
        <p className={styles.copy}>
          <IsolatedCopy locale={locale} text={body} />
        </p>
      ) : null}
      {children}
    </article>
  );
}

export function PendingSlot({
  locale,
  pendingLabelKey,
}: {
  locale: Locale;
  pendingLabelKey: CatalogKey;
}) {
  return (
    <ApprovalGate locale={locale} state="pending" pendingLabelKey={pendingLabelKey}>
      <div className={shell.body}>
        <SkeletonBar size="lg" widthPercent={64} />
        <SkeletonBar size="base" widthPercent={100} />
        <SkeletonBar size="base" widthPercent={82} />
      </div>
    </ApprovalGate>
  );
}

export function PendingActions({
  locale,
  pendingLabelKey,
  children,
}: {
  locale: Locale;
  pendingLabelKey: CatalogKey;
  children: ReactNode;
}) {
  return (
    <ApprovalGate locale={locale} state="pending" pendingLabelKey={pendingLabelKey}>
      <div className={styles.actions}>{children}</div>
    </ApprovalGate>
  );
}
