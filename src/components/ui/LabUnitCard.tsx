import type { Locale } from "@/lib/locale";
import { IsolatedCopy } from "./Isolate";
import styles from "./EntityCard.module.css";

// DESIGN_SYSTEM.md §10 Card, used for a published LabUnit row. Name and
// description come from the row. M2's table has no MediaAsset column
// (DATA_MODEL.md §6 row 5), so there is no poster slot. The card is not
// a link — CONTENT_MODEL.md §3c has no LabUnit detail route.

interface LabUnitCardProps {
  locale: Locale;
  name: string;
  description: string;
}

export function LabUnitCard({ locale, name, description }: LabUnitCardProps) {
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
