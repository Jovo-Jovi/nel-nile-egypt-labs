import type { Locale } from "@/lib/locale";
import { translate } from "@/lib/catalog";
import { IsolatedCopy } from "./Isolate";
import { LocationPinIcon } from "./icons";
import card from "./EntityCard.module.css";
import styles from "./BranchCard.module.css";

// DESIGN_SYSTEM.md §10 Card, used for a published Branch row. The
// head-office flag is a badge, not a separate card shape. Name comes
// from the row. Address, phone and hours are not rendered — they are
// not in source (PR-16) and CF-69 records that they have not been
// supplied. The card is not a link.

interface BranchCardProps {
  locale: Locale;
  name: string;
  isHeadOffice: boolean;
}

export function BranchCard({ locale, name, isHeadOffice }: BranchCardProps) {
  return (
    <article className={card.card}>
      <div className={card.body}>
        <div className={styles.heading}>
          <h2 className={card.title}>
            <IsolatedCopy locale={locale} text={name} />
          </h2>
          {isHeadOffice ? (
            <span className={styles.badge}>
              <span className={styles.badgeIcon}>
                <LocationPinIcon size={14} />
              </span>
              {translate(locale, "branch.headOffice")}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}
