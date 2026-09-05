import type { Locale } from "@/lib/locale";
import { translate } from "@/lib/catalog";
import { IsolatedCopy } from "./Isolate";
import { LocationPinIcon } from "./icons";
import { ApprovalGate } from "./ApprovalGate";
import { SkeletonBar } from "./SkeletonBar";
import { WhatsAppAction } from "./WhatsAppAction";
import card from "./EntityCard.module.css";
import styles from "./BranchCard.module.css";

// DESIGN_SYSTEM.md §10 Card, used for a published Branch row. The
// head-office flag is a badge, not a separate card shape. Name, address,
// hours and WhatsApp come from the row. PR-16 governs where published
// business data is stored, not whether it renders. CONTENT_MODEL.md row 6
// puts addresses in the table precisely so they can be published. Each
// field is the published value or the existing §12 pending state. Contact
// is WhatsApp only (D-09). The card is not a link.

interface BranchCardProps {
  locale: Locale;
  name: string;
  isHeadOffice: boolean;
  address: string | null;
  hours: string | null;
  whatsappHref: string | null;
}

export function BranchCard({
  locale,
  name,
  isHeadOffice,
  address,
  hours,
  whatsappHref,
}: BranchCardProps) {
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
        {address !== null ? (
          <p className={card.description}>
            <IsolatedCopy locale={locale} text={address} />
          </p>
        ) : (
          <ApprovalGate locale={locale} state="pending" pendingLabelKey="approval.pending.businessData">
            <SkeletonBar size="base" widthPercent={82} />
          </ApprovalGate>
        )}
        {hours !== null ? (
          <p className={card.description}>
            <IsolatedCopy locale={locale} text={hours} />
          </p>
        ) : (
          <ApprovalGate locale={locale} state="pending" pendingLabelKey="approval.pending.businessData">
            <SkeletonBar size="sm" widthPercent={56} />
          </ApprovalGate>
        )}
        {whatsappHref !== null ? (
          <WhatsAppAction
            label={translate(locale, "hero.whatsappAction")}
            variant="whatsappFilled"
            href={whatsappHref}
          />
        ) : (
          <ApprovalGate locale={locale} state="pending" pendingLabelKey="approval.pending.businessData" dense>
            <SkeletonBar size="base" widthPercent={48} />
          </ApprovalGate>
        )}
      </div>
    </article>
  );
}
