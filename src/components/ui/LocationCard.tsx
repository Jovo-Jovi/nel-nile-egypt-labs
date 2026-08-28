import type { CatalogKey, Locale } from "@/lib/catalog";
import { Button } from "./Button";
import { Isolate } from "./Isolate";
import { ApprovalGate } from "./ApprovalGate";
import styles from "./LocationCard.module.css";

interface LocationCardProps {
  locale: Locale;
  mapLabel: string;
  addressLabel: string;
  address: string;
  hotlineLabel: string;
  hotline: string;
  actionLabel: string;
  pendingLabelKey: CatalogKey;
}

// DESIGN_SYSTEM.md §10 Location card — a 16:9 map frame at the
// block-start, radius 4px, then the head-office address at sm text and
// the hotline at sm weight 600. One outlined action at the block-end. The
// map is a static image asset, never an embedded third-party map
// (BOUNDARY_MODEL.md §4 item 8, §5). Address and hotline are published
// business data (PR-16) and are pending until SiteSettings supplies them
// (§12); the map frame is a permanent architectural choice, not a gated
// material, so it renders unconditionally.
export function LocationCard({
  locale,
  mapLabel,
  addressLabel,
  address,
  hotlineLabel,
  hotline,
  actionLabel,
  pendingLabelKey,
}: LocationCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.mapFrame} style={{ aspectRatio: "16 / 9" }}>
        <span className={styles.mapLabel}>{mapLabel}</span>
      </div>
      <ApprovalGate locale={locale} state="pending" pendingLabelKey={pendingLabelKey}>
        <dl className={styles.details}>
          <div className={styles.row}>
            <dt className={styles.term}>{addressLabel}</dt>
            <dd className={styles.definition}>{address}</dd>
          </div>
          <div className={styles.row}>
            <dt className={styles.term}>{hotlineLabel}</dt>
            <dd className={styles.definitionStrong}>
              <Isolate>{hotline}</Isolate>
            </dd>
          </div>
        </dl>
      </ApprovalGate>
      <div className={styles.action}>
        <Button variant="secondary" disabled>
          {actionLabel}
        </Button>
      </div>
    </div>
  );
}
