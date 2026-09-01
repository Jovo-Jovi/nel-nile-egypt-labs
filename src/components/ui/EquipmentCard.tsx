import type { Locale } from "@/lib/locale";
import { translate } from "@/lib/catalog";
import { ImageFrame } from "./ImageFrame";
import styles from "./EntityCard.module.css";

// DESIGN_SYSTEM.md §10 Card, used for a published Equipment row. Name
// and description come from the row. Nothing is hardcoded.

interface EquipmentCardProps {
  locale: Locale;
  name: string;
  description: string;
  posterSrc: string | null;
  posterAlt: string | null;
}

export function EquipmentCard({ locale, name, description, posterSrc, posterAlt }: EquipmentCardProps) {
  const frameLabel = translate(locale, "equipment.frameLabel");
  return (
    <article className={styles.card}>
      <div className={styles.media}>
        {posterSrc ? (
          // eslint-disable-next-line @next/next/no-img-element -- remote host allowlist would be a project ref
          <img className={styles.photo} src={posterSrc} alt={posterAlt ?? frameLabel} />
        ) : (
          <ImageFrame label={frameLabel} />
        )}
      </div>
      <div className={styles.body}>
        <h2 className={styles.title}>{name}</h2>
        <p className={styles.description}>{description}</p>
      </div>
    </article>
  );
}
