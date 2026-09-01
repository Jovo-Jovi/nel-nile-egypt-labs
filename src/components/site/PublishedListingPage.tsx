import type { ReactNode } from "react";
import type { CatalogKey } from "@/lib/catalog";
import type { Locale } from "@/lib/locale";
import { ApprovalGate } from "@/components/ui/ApprovalGate";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SkeletonBar } from "@/components/ui/SkeletonBar";
import shell from "./StaticShellPage.module.css";
import styles from "./PublishedListingPage.module.css";

interface PublishedListingPageProps {
  locale: Locale;
  titleKey: CatalogKey;
  pendingLabelKey: CatalogKey;
  isEmpty: boolean;
  children: ReactNode;
}

// Same chrome as StaticShellPage. Empty published-only lists render the
// §12 pending treatment and list nothing — D-42 failing closed.

export function PublishedListingPage({
  locale,
  titleKey,
  pendingLabelKey,
  isEmpty,
  children,
}: PublishedListingPageProps) {
  return (
    <div className={shell.page}>
      <SectionHeader locale={locale} titleKey={titleKey} />
      {isEmpty ? (
        <ApprovalGate locale={locale} state="pending" pendingLabelKey={pendingLabelKey}>
          <div className={shell.body}>
            <SkeletonBar size="lg" widthPercent={64} />
            <SkeletonBar size="base" widthPercent={100} />
            <SkeletonBar size="base" widthPercent={82} />
          </div>
        </ApprovalGate>
      ) : (
        <ul className={styles.grid}>{children}</ul>
      )}
    </div>
  );
}
