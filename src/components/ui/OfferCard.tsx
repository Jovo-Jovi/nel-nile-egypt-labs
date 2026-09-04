import type { Locale } from "@/lib/locale";
import { translate } from "@/lib/catalog";
import { Isolate } from "./Isolate";
import { ImageFrame } from "./ImageFrame";
import { StatusStateBadge } from "./StatusStateBadge";
import styles from "./EntityCard.module.css";

// DESIGN_SYSTEM.md §10 Card, used for a published Offer. Price and
// currency come from the row; none is named in source (CF-21). Dates
// come from the row. The card is not a link.

interface OfferCardProps {
  locale: Locale;
  title: string;
  description: string;
  priceLabel: string | null;
  validityLabel: string | null;
  dateRange: string | null;
  expired: boolean;
  posterSrc: string | null;
  posterAlt: string | null;
}

export function OfferCard({
  locale,
  title,
  description,
  priceLabel,
  validityLabel,
  dateRange,
  expired,
  posterSrc,
  posterAlt,
}: OfferCardProps) {
  const frameLabel = translate(locale, "hero.imageFrameLabel");
  return (
    <article className={styles.card}>
      <div className={styles.media}>
        {posterSrc ? (
          // Native img: next/image would need a remote host allowlist, and
          // that host is a project ref (PR-16 / PR-23). Labelled frame if
          // the row has no self-hosted poster.
          // eslint-disable-next-line @next/next/no-img-element
          <img className={styles.photo} src={posterSrc} alt={posterAlt ?? frameLabel} />
        ) : (
          <ImageFrame label={frameLabel} />
        )}
      </div>
      <div className={styles.body}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.description}>{description}</p>
        {priceLabel || validityLabel || dateRange ? (
          <div className={styles.meta}>
            {priceLabel ? (
              <p className={styles.price}>
                <Isolate>{priceLabel}</Isolate>
              </p>
            ) : null}
            {dateRange ? (
              <p className={styles.dates}>
                <Isolate>{dateRange}</Isolate>
              </p>
            ) : null}
            {validityLabel ? (
              <StatusStateBadge state={expired ? "expired" : "current"} label={validityLabel} />
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}
