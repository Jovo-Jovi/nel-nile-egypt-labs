import type { Locale } from "@/lib/locale";
import { IsolatedCopy } from "./Isolate";
import styles from "./LabTestCard.module.css";

// DESIGN_SYSTEM.md §10 Card. Name and the §3b per-row note come from
// the function's return row at render time. Neither string is a
// catalogue key.

interface LabTestCardProps {
  locale: Locale;
  name: string;
  note: string | null;
}

export function LabTestCard({ locale, name, note }: LabTestCardProps) {
  return (
    <article className={styles.card}>
      <div className={styles.body}>
        <h3 className={styles.title}>
          <IsolatedCopy locale={locale} text={name} />
        </h3>
        {note !== null ? (
          <p className={styles.note}>
            <IsolatedCopy locale={locale} text={note} />
          </p>
        ) : null}
      </div>
    </article>
  );
}
