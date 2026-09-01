import type { Locale } from "@/lib/locale";
import { IsolatedCopy } from "./Isolate";
import styles from "./EntityCard.module.css";

// DESIGN_SYSTEM.md §10 Card, used for a published Programme row. Name
// and description come from the row. No LabTest name, membership, tier,
// or detail link — the whole card is not a link, and this listing has
// no action until the detail template exists.

interface ProgrammeCardProps {
  locale: Locale;
  name: string;
  description: string;
}

export function ProgrammeCard({ locale, name, description }: ProgrammeCardProps) {
  return (
    <article className={styles.card}>
      <div className={styles.body}>
        <h2 className={styles.title}>
          <IsolatedCopy locale={locale} text={name} />
        </h2>
        <p className={styles.description}>
          <IsolatedCopy locale={locale} text={description} />
        </p>
      </div>
    </article>
  );
}
