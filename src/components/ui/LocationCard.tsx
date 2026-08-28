import type { CatalogKey, Locale } from "@/lib/catalog";
import { translate } from "@/lib/catalog";
import { Button } from "./Button";
import { ApprovalGate } from "./ApprovalGate";
import { SkeletonBar } from "./SkeletonBar";
import { GreaterCairoMap } from "./GreaterCairoMap";
import styles from "./LocationCard.module.css";

interface LocationCardProps {
  locale: Locale;
  addressLabel: string;
  hotlineLabel: string;
  actionLabel: string;
  pendingLabelKey: CatalogKey;
}

const DISTRICT_LABEL_KEYS: { id: string; x: number; y: number; key: CatalogKey }[] = [
  { id: "giza", x: 22, y: 30, key: "locations.map.district.giza" },
  { id: "cairo", x: 60, y: 26, key: "locations.map.district.cairo" },
  { id: "maadi", x: 56, y: 74, key: "locations.map.district.maadi" },
];

// DESIGN_SYSTEM.md v4 §10 Location card — a drawn 16:9 map at the
// block-start, radius 4px, then the head-office address at sm text and
// the hotline at sm weight 600. One outlined action at the block-end.
// The map is a hand-authored SVG, never an embedded third-party map
// (BOUNDARY_MODEL.md §4 item 8, §5). CF-69 — Branch records carry no
// verified addresses, so the map itself is pending, its pins indicative
// only, never presented as real geography. Address and hotline are
// published business data (PR-16) and are pending until SiteSettings
// supplies them (§12) — both render as crafted §12 bars, never lorem.
export function LocationCard({
  locale,
  addressLabel,
  hotlineLabel,
  actionLabel,
  pendingLabelKey,
}: LocationCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.mapFrame} style={{ aspectRatio: "16 / 9" }}>
        <ApprovalGate locale={locale} state="pending" pendingLabelKey={pendingLabelKey}>
          <GreaterCairoMap
            ariaLabel={translate(locale, "locations.map.ariaLabel")}
            pinLabel={translate(locale, "locations.map.pinLabel")}
            headOfficePinLabel={translate(locale, "locations.map.headOfficePinLabel")}
            districtLabels={DISTRICT_LABEL_KEYS.map(({ id, x, y, key }) => ({
              id,
              x,
              y,
              label: translate(locale, key),
            }))}
          />
        </ApprovalGate>
      </div>
      <ApprovalGate locale={locale} state="pending" pendingLabelKey={pendingLabelKey}>
        <dl className={styles.details}>
          <div className={styles.row}>
            <dt className={styles.term}>{addressLabel}</dt>
            <dd className={styles.definition}>
              <SkeletonBar size="sm" widthPercent={60} />
            </dd>
          </div>
          <div className={styles.row}>
            <dt className={styles.term}>{hotlineLabel}</dt>
            <dd className={styles.definitionStrong}>
              <SkeletonBar size="sm" widthPercent={30} />
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
