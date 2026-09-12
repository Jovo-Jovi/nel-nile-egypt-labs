import Link from "next/link";
import type { Locale } from "@/lib/locale";
import { IsolatedCopy } from "./Isolate";
import styles from "./EntityCard.module.css";

// DESIGN_SYSTEM.md §10 Card, used for a published Programme row. Name
// and description come from the row. No LabTest name, membership or
// tier. The whole card is the link to /{locale}/programmes/{slug}
// (keyboard reachable, focus-visible). The name is not a separate target.

interface ProgrammeCardProps {
  locale: Locale;
  name: string;
  description: string;
  href: string;
}

export function ProgrammeCard({ locale, name, description, href }: ProgrammeCardProps) {
  return (
    <article className={styles.card}>
      <Link href={href} className={styles.cardLink}>
        <h2 className={styles.title}>
          <IsolatedCopy locale={locale} text={name} />
        </h2>
        <p className={styles.description}>
          <IsolatedCopy locale={locale} text={description} />
        </p>
      </Link>
    </article>
  );
}
