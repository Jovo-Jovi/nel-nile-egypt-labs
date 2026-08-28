import type { ReactNode } from "react";
import styles from "./TrustEntry.module.css";

interface TrustEntryProps {
  icon: ReactNode;
  label: ReactNode;
  qualifier: ReactNode;
}

// DESIGN_SYSTEM.md §10 Trust entry — 24px icon in primary, label at sm
// weight 600 in text, qualifier at xs in muted. No card, no border.
export function TrustEntry({ icon, label, qualifier }: TrustEntryProps) {
  return (
    <div className={styles.entry}>
      <span className={styles.icon} aria-hidden="true">
        {icon}
      </span>
      <span className={styles.text}>
        <span className={styles.label}>{label}</span>
        <span className={styles.qualifier}>{qualifier}</span>
      </span>
    </div>
  );
}
