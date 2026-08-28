import { CautionIcon } from "./icons";
import styles from "./CautionCardEntry.module.css";

interface CautionCardEntryProps {
  title: string;
  body: string;
}

// DESIGN_SYSTEM.md §10 Caution card entry — 24px icon at the inline-start
// in primary, no fill behind it. Title base weight 600, body sm muted,
// two lines. The icon encodes meaning and does not mirror.
export function CautionCardEntry({ title, body }: CautionCardEntryProps) {
  return (
    <div className={styles.entry}>
      <span className={styles.icon}>
        <CautionIcon size={24} />
      </span>
      <div className={styles.body}>
        <p className={styles.title}>{title}</p>
        <p className={styles.text}>{body}</p>
      </div>
    </div>
  );
}
