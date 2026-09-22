import { ApprovalGate } from "@/components/ui/ApprovalGate";
import { SkeletonBar } from "@/components/ui/SkeletonBar";
import type { CatalogKey, Locale } from "@/lib/catalog";
import styles from "./PendingListingCard.module.css";

// DESIGN_SYSTEM.md §12 — a listing that will render cards occupies card
// geometry while pending, so the grid does not jump when rows arrive.
// Shimmer is SkeletonBar's existing §12 animation; this wrapper adds none.

export function PendingListingCards({
  locale,
  pendingLabelKey,
  count,
}: {
  locale: Locale;
  pendingLabelKey: CatalogKey;
  count: number;
}) {
  return (
    <ul className={styles.grid}>
      {Array.from({ length: count }, (_, index) => (
        <li key={index}>
          <ApprovalGate
            locale={locale}
            state="pending"
            pendingLabelKey={pendingLabelKey}
            className={styles.wellGate}
          >
            <article className={styles.card}>
              <div className={styles.media}>
                <SkeletonBar size="lg" widthPercent={100} fill />
              </div>
              <div className={styles.body}>
                <SkeletonBar size="xl" widthPercent={72} />
                <SkeletonBar size="lg" widthPercent={100} />
                <SkeletonBar size="sm" widthPercent={64} />
              </div>
            </article>
          </ApprovalGate>
        </li>
      ))}
    </ul>
  );
}
